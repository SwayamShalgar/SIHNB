const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../database/postgres');
const { JWT_SECRET, authenticateToken } = require('../middleware/auth');

// Register a new user
router.post('/register', async (req, res) => {
  try {
    const { email, password, role, full_name, organization, phone } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({ 
        error: 'Email, password, and role are required' 
      });
    }

    // Validate role
    const validRoles = ['Admin', 'Institute', 'Student', 'Company'];
    if (!validRoles.includes(role)) {
      return res.status(400).json({ 
        error: 'Invalid role. Must be Admin, Institute, Student, or Company' 
      });
    }

    // Check if user already exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determine if verification is needed (Company and Institute require admin approval)
    const requiresVerification = ['Company', 'Institute'].includes(role);
    const verifiedStatus = !requiresVerification; // Admin and Student are auto-verified

    // Insert new user
    const result = await pool.query(
      `INSERT INTO users (email, password, role, full_name, organization, phone, verified) 
       VALUES ($1, $2, $3, $4, $5, $6, $7) 
       RETURNING id, email, role, full_name, organization, phone, verified, created_at`,
      [email, hashedPassword, role, full_name || null, organization || null, phone || null, verifiedStatus]
    );

    const user = result.rows[0];

    // If user requires verification, return pending status (no token)
    if (requiresVerification) {
      return res.status(202).json({
        success: true,
        pending: true,
        message: `Registration submitted successfully! Your ${role} account is pending admin approval. You will be able to login once an administrator verifies your account.`,
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
          full_name: user.full_name,
          organization: user.organization,
          verified: false
        }
      });
    }

    // For Admin and Student, generate token and allow immediate login
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(201).json({
      success: true,
      message: 'User registered successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        organization: user.organization,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: 'Failed to register user' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;

    // Validation
    if (!email || !password || !role) {
      return res.status(400).json({ 
        error: 'Email, password, and role are required' 
      });
    }

    // Find user by email and role
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND role = $2',
      [email, role]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials or role' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Check if account is verified (for Company and Institute)
    if (['Company', 'Institute'].includes(user.role) && user.verified === false) {
      return res.status(403).json({ 
        error: 'Account pending verification',
        message: `Your ${user.role} account is pending admin approval. Please wait for an administrator to verify your account before logging in.`,
        pending: true
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.json({
      success: true,
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        full_name: user.full_name,
        organization: user.organization,
        phone: user.phone
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Failed to login' });
  }
});

// Get current user info
router.get('/me', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, role, full_name, organization, phone, created_at FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user: result.rows[0] });
  } catch (error) {
    console.error('Get user error:', error);
    res.status(500).json({ error: 'Failed to get user information' });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req, res) => {
  try {
    const { full_name, email, phone, organization } = req.body;
    const userId = req.user.id;

    // Validation
    if (!full_name || !email) {
      return res.status(400).json({ 
        error: 'Full name and email are required' 
      });
    }

    // Check if email is already taken by another user
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ 
        error: 'Email is already taken by another user' 
      });
    }

    // Update user profile
    const result = await pool.query(
      `UPDATE users 
       SET full_name = $1, email = $2, phone = $3, organization = $4, updated_at = CURRENT_TIMESTAMP
       WHERE id = $5
       RETURNING id, email, role, full_name, organization, phone, created_at`,
      [full_name, email, phone || null, organization || null, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Logout (client-side should remove token)
router.post('/logout', authenticateToken, (req, res) => {
  res.json({ success: true, message: 'Logout successful' });
});

module.exports = router;

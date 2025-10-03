const express = require('express');
const router = express.Router();
const pool = require('../database/postgres');
const db = require('../database/init');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get all users (Admin only)
router.get('/users', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    // Try PostgreSQL first
    try {
      const result = await pool.query(`
        SELECT 
          id, 
          email, 
          role, 
          full_name, 
          organization, 
          phone, 
          created_at,
          updated_at
        FROM users
        ORDER BY created_at DESC
      `);

      res.json({
        success: true,
        users: result.rows,
        source: 'PostgreSQL'
      });
    } catch (pgError) {
      console.error('PostgreSQL query failed, falling back to SQLite:', pgError.message);
      
      // Fallback to SQLite
      const sql = `
        SELECT 
          id, 
          email, 
          role, 
          full_name, 
          organization, 
          phone, 
          created_at,
          updated_at
        FROM users
        ORDER BY created_at DESC
      `;

      db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('SQLite error:', err);
          return res.status(500).json({ error: 'Failed to fetch users' });
        }

        res.json({
          success: true,
          users: rows,
          source: 'SQLite'
        });
      });
    }
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({ error: 'Failed to fetch users' });
  }
});

// Get user statistics by role
router.get('/stats', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    // Try PostgreSQL first
    try {
      const userStats = await pool.query(`
        SELECT 
          role,
          COUNT(*) as count
        FROM users
        GROUP BY role
      `);

      const certStats = await pool.query(`
        SELECT COUNT(*) as total FROM certificates
      `);

      const recentActivity = await pool.query(`
        SELECT 
          u.email,
          u.role,
          u.full_name,
          c.id as certificate_id,
          c.course_name,
          c.created_at
        FROM certificates c
        JOIN users u ON c.learner_email = u.email
        ORDER BY c.created_at DESC
        LIMIT 10
      `);

      const stats = {
        totalStudents: 0,
        totalInstitutes: 0,
        totalCompanies: 0,
        totalAdmins: 0,
        totalCertificates: certStats.rows[0]?.total || 0
      };

      userStats.rows.forEach(row => {
        if (row.role === 'Student') stats.totalStudents = parseInt(row.count);
        if (row.role === 'Institute') stats.totalInstitutes = parseInt(row.count);
        if (row.role === 'Company') stats.totalCompanies = parseInt(row.count);
        if (row.role === 'Admin') stats.totalAdmins = parseInt(row.count);
      });

      res.json({
        success: true,
        stats,
        recentActivity: recentActivity.rows,
        source: 'PostgreSQL'
      });
    } catch (pgError) {
      console.error('PostgreSQL query failed:', pgError.message);
      
      // Mock data fallback
      res.json({
        success: true,
        stats: {
          totalStudents: 0,
          totalInstitutes: 0,
          totalCompanies: 0,
          totalAdmins: 1,
          totalCertificates: 0
        },
        recentActivity: [],
        source: 'Mock'
      });
    }
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch statistics' });
  }
});

// Get user activity by email
router.get('/activity/:email', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { email } = req.params;

    // Try PostgreSQL first
    try {
      const certificates = await pool.query(`
        SELECT 
          id,
          learner_name,
          course_name,
          institute_name,
          issue_date,
          created_at
        FROM certificates
        WHERE learner_email = $1
        ORDER BY created_at DESC
      `, [email]);

      res.json({
        success: true,
        activity: {
          certificatesEarned: certificates.rows,
          totalCertificates: certificates.rows.length
        },
        source: 'PostgreSQL'
      });
    } catch (pgError) {
      console.error('PostgreSQL query failed:', pgError.message);
      res.json({
        success: true,
        activity: {
          certificatesEarned: [],
          totalCertificates: 0
        },
        source: 'Mock'
      });
    }
  } catch (error) {
    console.error('Error fetching user activity:', error);
    res.status(500).json({ error: 'Failed to fetch user activity' });
  }
});

// Delete user (Admin only)
router.delete('/users/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Try PostgreSQL first
    try {
      await pool.query('DELETE FROM users WHERE id = $1', [id]);
      res.json({ success: true, message: 'User deleted successfully' });
    } catch (pgError) {
      console.error('PostgreSQL delete failed:', pgError.message);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ error: 'Failed to delete user' });
  }
});

// Update user role (Admin only)
router.patch('/users/:id/role', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.body;

    if (!['Admin', 'Institute', 'Student', 'Company'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role' });
    }

    // Try PostgreSQL first
    try {
      await pool.query(
        'UPDATE users SET role = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2',
        [role, id]
      );
      res.json({ success: true, message: 'User role updated successfully' });
    } catch (pgError) {
      console.error('PostgreSQL update failed:', pgError.message);
      res.status(500).json({ error: 'Failed to update user role' });
    }
  } catch (error) {
    console.error('Error updating user role:', error);
    res.status(500).json({ error: 'Failed to update user role' });
  }
});

// Get pending user verifications (Admin only)
router.get('/pending-users', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    // Try PostgreSQL first
    try {
      const result = await pool.query(`
        SELECT 
          id, 
          email, 
          role, 
          full_name, 
          organization, 
          phone, 
          created_at,
          verified
        FROM users
        WHERE verified = FALSE AND role IN ('Company', 'Institute')
        ORDER BY created_at DESC
      `);

      res.json(result.rows);
    } catch (pgError) {
      console.error('PostgreSQL query failed:', pgError.message);
      
      // Fallback to SQLite
      const sql = `
        SELECT 
          id, 
          email, 
          role, 
          full_name, 
          organization, 
          phone, 
          created_at,
          verified
        FROM users
        WHERE verified = 0 AND role IN ('Company', 'Institute')
        ORDER BY created_at DESC
      `;

      db.all(sql, [], (err, rows) => {
        if (err) {
          console.error('SQLite error:', err);
          return res.status(500).json({ error: 'Failed to fetch pending users' });
        }
        res.json(rows);
      });
    }
  } catch (error) {
    console.error('Error fetching pending users:', error);
    res.status(500).json({ error: 'Failed to fetch pending users' });
  }
});

// Approve user (Admin only)
router.post('/approve-user/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Try PostgreSQL first
    try {
      await pool.query(
        'UPDATE users SET verified = TRUE, updated_at = CURRENT_TIMESTAMP WHERE id = $1',
        [id]
      );
      
      res.json({ 
        success: true, 
        message: 'User approved successfully' 
      });
    } catch (pgError) {
      console.error('PostgreSQL update failed:', pgError.message);
      
      // Fallback to SQLite
      const sql = 'UPDATE users SET verified = 1 WHERE id = ?';
      db.run(sql, [id], function(err) {
        if (err) {
          console.error('SQLite error:', err);
          return res.status(500).json({ error: 'Failed to approve user' });
        }
        res.json({ 
          success: true, 
          message: 'User approved successfully' 
        });
      });
    }
  } catch (error) {
    console.error('Error approving user:', error);
    res.status(500).json({ error: 'Failed to approve user' });
  }
});

// Reject user (Admin only)
router.post('/reject-user/:id', authenticateToken, authorizeRole('Admin'), async (req, res) => {
  try {
    const { id } = req.params;

    // Try PostgreSQL first
    try {
      await pool.query(
        'DELETE FROM users WHERE id = $1 AND verified = FALSE',
        [id]
      );
      
      res.json({ 
        success: true, 
        message: 'User rejected and removed from system' 
      });
    } catch (pgError) {
      console.error('PostgreSQL delete failed:', pgError.message);
      
      // Fallback to SQLite
      const sql = 'DELETE FROM users WHERE id = ? AND verified = 0';
      db.run(sql, [id], function(err) {
        if (err) {
          console.error('SQLite error:', err);
          return res.status(500).json({ error: 'Failed to reject user' });
        }
        res.json({ 
          success: true, 
          message: 'User rejected and removed from system' 
        });
      });
    }
  } catch (error) {
    console.error('Error rejecting user:', error);
    res.status(500).json({ error: 'Failed to reject user' });
  }
});

module.exports = router;

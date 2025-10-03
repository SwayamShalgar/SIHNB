const express = require('express');
const router = express.Router();
const pool = require('../database/postgres');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// Get student profile
router.get('/profile', authenticateToken, authorizeRole('Student'), async (req, res) => {
  try {
    const student_id = req.user.id;
    
    // Get student profile with user details
    const profileResult = await pool.query(`
      SELECT 
        u.id,
        u.full_name,
        u.email,
        u.phone,
        sp.*
      FROM users u
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      WHERE u.id = $1
    `, [student_id]);
    
    if (profileResult.rows.length === 0) {
      return res.status(404).json({ error: 'Profile not found' });
    }
    
    // Get certificates count
    const certsResult = await pool.query(
      'SELECT COUNT(*) as count FROM certificates WHERE learner_email = $1',
      [req.user.email]
    );
    
    const profile = profileResult.rows[0];
    profile.certificates_count = parseInt(certsResult.rows[0].count);
    
    res.json({
      success: true,
      profile
    });
  } catch (error) {
    console.error('Error fetching student profile:', error);
    res.status(500).json({ error: 'Failed to fetch profile' });
  }
});

// Create or update student profile
router.put('/profile', authenticateToken, authorizeRole('Student'), async (req, res) => {
  try {
    const student_id = req.user.id;
    const {
      skills,
      cgpa,
      graduation_year,
      degree,
      specialization,
      bio,
      visible_to_companies,
      resume_url,
      linkedin_url,
      github_url,
      portfolio_url
    } = req.body;
    
    // Check if profile exists
    const existingProfile = await pool.query(
      'SELECT * FROM student_profiles WHERE user_id = $1',
      [student_id]
    );
    
    let result;
    
    if (existingProfile.rows.length === 0) {
      // Create new profile
      result = await pool.query(`
        INSERT INTO student_profiles (
          user_id, skills, cgpa, graduation_year, degree, specialization,
          bio, visible_to_companies, resume_url, linkedin_url, github_url, portfolio_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING *
      `, [
        student_id, skills, cgpa, graduation_year, degree, specialization,
        bio, visible_to_companies, resume_url, linkedin_url, github_url, portfolio_url
      ]);
    } else {
      // Update existing profile
      result = await pool.query(`
        UPDATE student_profiles SET
          skills = COALESCE($1, skills),
          cgpa = COALESCE($2, cgpa),
          graduation_year = COALESCE($3, graduation_year),
          degree = COALESCE($4, degree),
          specialization = COALESCE($5, specialization),
          bio = COALESCE($6, bio),
          visible_to_companies = COALESCE($7, visible_to_companies),
          resume_url = COALESCE($8, resume_url),
          linkedin_url = COALESCE($9, linkedin_url),
          github_url = COALESCE($10, github_url),
          portfolio_url = COALESCE($11, portfolio_url),
          updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $12
        RETURNING *
      `, [
        skills, cgpa, graduation_year, degree, specialization,
        bio, visible_to_companies, resume_url, linkedin_url, github_url,
        portfolio_url, student_id
      ]);
    }
    
    res.json({
      success: true,
      message: 'Profile updated successfully',
      profile: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating student profile:', error);
    res.status(500).json({ error: 'Failed to update profile' });
  }
});

// Toggle visibility to companies
router.patch('/visibility', authenticateToken, authorizeRole('Student'), async (req, res) => {
  try {
    const student_id = req.user.id;
    const { visible } = req.body;
    
    if (typeof visible !== 'boolean') {
      return res.status(400).json({ error: 'visible must be a boolean value' });
    }
    
    // Check if profile exists
    const existingProfile = await pool.query(
      'SELECT * FROM student_profiles WHERE user_id = $1',
      [student_id]
    );
    
    let result;
    
    if (existingProfile.rows.length === 0) {
      // Create profile with visibility setting
      result = await pool.query(`
        INSERT INTO student_profiles (user_id, visible_to_companies)
        VALUES ($1, $2)
        RETURNING *
      `, [student_id, visible]);
    } else {
      // Update visibility
      result = await pool.query(`
        UPDATE student_profiles 
        SET visible_to_companies = $1, updated_at = CURRENT_TIMESTAMP
        WHERE user_id = $2
        RETURNING *
      `, [visible, student_id]);
    }
    
    res.json({
      success: true,
      message: `Profile ${visible ? 'visible' : 'hidden'} to companies`,
      visible_to_companies: result.rows[0].visible_to_companies
    });
  } catch (error) {
    console.error('Error updating visibility:', error);
    res.status(500).json({ error: 'Failed to update visibility' });
  }
});

// Get student certificates
router.get('/certificates', authenticateToken, authorizeRole('Student'), async (req, res) => {
  try {
    const email = req.user.email;
    
    const result = await pool.query(`
      SELECT 
        c.*,
        u.full_name as issuer_name,
        u.organization as issuer_organization
      FROM certificates c
      LEFT JOIN users u ON c.issuer_email = u.email
      WHERE c.learner_email = $1
      ORDER BY c.issued_at DESC
    `, [email]);
    
    res.json({
      success: true,
      certificates: result.rows
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Failed to fetch certificates' });
  }
});

// Get student dashboard stats
router.get('/stats', authenticateToken, authorizeRole('Student'), async (req, res) => {
  try {
    const student_id = req.user.id;
    const email = req.user.email;
    
    // Get total applications
    const applicationsResult = await pool.query(
      'SELECT COUNT(*) as count FROM job_applications WHERE student_id = $1',
      [student_id]
    );
    
    // Get pending applications
    const pendingAppsResult = await pool.query(
      `SELECT COUNT(*) as count FROM job_applications 
       WHERE student_id = $1 AND status = 'pending'`,
      [student_id]
    );
    
    // Get shortlisted applications
    const shortlistedResult = await pool.query(
      `SELECT COUNT(*) as count FROM job_applications 
       WHERE student_id = $1 AND status = 'shortlisted'`,
      [student_id]
    );
    
    // Get job offers
    const offersResult = await pool.query(
      'SELECT COUNT(*) as count FROM job_offers WHERE student_id = $1',
      [student_id]
    );
    
    // Get pending offers
    const pendingOffersResult = await pool.query(
      `SELECT COUNT(*) as count FROM job_offers 
       WHERE student_id = $1 AND status = 'pending'`,
      [student_id]
    );
    
    // Get certificates count
    const certsResult = await pool.query(
      'SELECT COUNT(*) as count FROM certificates WHERE learner_email = $1',
      [email]
    );
    
    // Get profile visibility
    const visibilityResult = await pool.query(
      'SELECT visible_to_companies FROM student_profiles WHERE user_id = $1',
      [student_id]
    );
    
    res.json({
      success: true,
      stats: {
        total_applications: parseInt(applicationsResult.rows[0].count),
        pending_applications: parseInt(pendingAppsResult.rows[0].count),
        shortlisted_applications: parseInt(shortlistedResult.rows[0].count),
        total_offers: parseInt(offersResult.rows[0].count),
        pending_offers: parseInt(pendingOffersResult.rows[0].count),
        certificates_count: parseInt(certsResult.rows[0].count),
        visible_to_companies: visibilityResult.rows.length > 0 
          ? visibilityResult.rows[0].visible_to_companies 
          : true
      }
    });
  } catch (error) {
    console.error('Error fetching student stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
});

// Get recommended jobs based on student profile
router.get('/recommended-jobs', authenticateToken, authorizeRole('Student'), async (req, res) => {
  try {
    const student_id = req.user.id;
    
    // Get student profile
    const profileResult = await pool.query(
      'SELECT skills, cgpa FROM student_profiles WHERE user_id = $1',
      [student_id]
    );
    
    if (profileResult.rows.length === 0 || !profileResult.rows[0].skills) {
      // No profile or skills, return general jobs
      const jobsResult = await pool.query(`
        SELECT 
          jp.*,
          u.full_name as company_name,
          u.organization as company_organization
        FROM job_postings jp
        JOIN users u ON jp.company_id = u.id
        WHERE jp.status = 'active' 
        AND jp.application_deadline >= CURRENT_DATE
        ORDER BY jp.created_at DESC
        LIMIT 10
      `);
      
      return res.json({
        success: true,
        jobs: jobsResult.rows,
        matched: false
      });
    }
    
    const { skills, cgpa } = profileResult.rows[0];
    
    // Find jobs that match skills or CGPA requirements
    const result = await pool.query(`
      SELECT 
        jp.*,
        u.full_name as company_name,
        u.organization as company_organization,
        CASE 
          WHEN jp.required_skills && $1 THEN 2
          ELSE 0
        END +
        CASE 
          WHEN jp.min_cgpa IS NULL OR $2 >= jp.min_cgpa THEN 1
          ELSE 0
        END as match_score
      FROM job_postings jp
      JOIN users u ON jp.company_id = u.id
      WHERE jp.status = 'active' 
      AND jp.application_deadline >= CURRENT_DATE
      AND (
        jp.required_skills && $1 
        OR jp.min_cgpa IS NULL 
        OR $2 >= jp.min_cgpa
      )
      ORDER BY match_score DESC, jp.created_at DESC
      LIMIT 10
    `, [skills, cgpa]);
    
    res.json({
      success: true,
      jobs: result.rows,
      matched: true
    });
  } catch (error) {
    console.error('Error fetching recommended jobs:', error);
    res.status(500).json({ error: 'Failed to fetch recommended jobs' });
  }
});

module.exports = router;

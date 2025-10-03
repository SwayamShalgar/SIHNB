const express = require('express');
const router = express.Router();
const pool = require('../database/postgres');
const { authenticateToken, authorizeRole } = require('../middleware/auth');

// ==================== JOB POSTINGS ====================

// Get all active job postings (for students)
router.get('/postings', authenticateToken, async (req, res) => {
  try {
    const { search, location, jobType, minSalary } = req.query;
    const student_id = req.user.id;
    
    let query = `
      SELECT 
        jp.*,
        u.full_name as company_name,
        u.organization as company_organization
      FROM job_postings jp
      JOIN users u ON jp.company_id = u.id
      WHERE jp.status = 'active'
      AND jp.application_deadline >= CURRENT_DATE
      AND jp.id NOT IN (
        SELECT job_id FROM job_offers 
        WHERE student_id = $1 AND status = 'accepted'
      )
    `;
    
    const params = [student_id];
    
    if (search) {
      query += ` AND (jp.job_title ILIKE $${params.length + 1} OR jp.job_description ILIKE $${params.length + 1})`;
      params.push(`%${search}%`);
    }
    
    if (location) {
      query += ` AND jp.location ILIKE $${params.length + 1}`;
      params.push(`%${location}%`);
    }
    
    if (jobType) {
      query += ` AND jp.job_type = $${params.length + 1}`;
      params.push(jobType);
    }
    
    query += ' ORDER BY jp.created_at DESC';
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      jobs: result.rows
    });
  } catch (error) {
    console.error('Error fetching job postings:', error);
    res.status(500).json({ error: 'Failed to fetch job postings' });
  }
});

// Get single job posting details
router.get('/postings/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;
    
    const result = await pool.query(`
      SELECT 
        jp.*,
        u.full_name as company_name,
        u.organization as company_organization,
        u.email as company_email,
        u.phone as company_phone
      FROM job_postings jp
      JOIN users u ON jp.company_id = u.id
      WHERE jp.id = $1
    `, [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Job posting not found' });
    }
    
    res.json({
      success: true,
      job: result.rows[0]
    });
  } catch (error) {
    console.error('Error fetching job posting:', error);
    res.status(500).json({ error: 'Failed to fetch job posting' });
  }
});

// Create new job posting (Company only)
router.post('/postings', authenticateToken, authorizeRole('Company'), async (req, res) => {
  try {
    const {
      job_title,
      job_description,
      job_type,
      location,
      salary_range,
      required_skills,
      min_cgpa,
      experience_required,
      application_deadline
    } = req.body;
    
    const company_id = req.user.id;
    
    // Validation
    if (!job_title || !job_description || !application_deadline) {
      return res.status(400).json({ 
        error: 'Job title, description, and application deadline are required' 
      });
    }
    
    const result = await pool.query(`
      INSERT INTO job_postings (
        company_id, job_title, job_description, job_type, location,
        salary_range, required_skills, min_cgpa, experience_required,
        application_deadline, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'active')
      RETURNING *
    `, [
      company_id, job_title, job_description, job_type, location,
      salary_range, required_skills, min_cgpa, experience_required,
      application_deadline
    ]);
    
    res.status(201).json({
      success: true,
      message: 'Job posting created successfully',
      job: result.rows[0]
    });
  } catch (error) {
    console.error('Error creating job posting:', error);
    res.status(500).json({ error: 'Failed to create job posting' });
  }
});

// Get company's own job postings
router.get('/my-postings', authenticateToken, authorizeRole('Company'), async (req, res) => {
  try {
    const company_id = req.user.id;
    
    const result = await pool.query(`
      SELECT 
        jp.*,
        COUNT(ja.id) as application_count
      FROM job_postings jp
      LEFT JOIN job_applications ja ON jp.id = ja.job_id
      WHERE jp.company_id = $1
      GROUP BY jp.id
      ORDER BY jp.created_at DESC
    `, [company_id]);
    
    res.json({
      success: true,
      jobs: result.rows
    });
  } catch (error) {
    console.error('Error fetching company job postings:', error);
    res.status(500).json({ error: 'Failed to fetch job postings' });
  }
});

// Update job posting
router.put('/postings/:id', authenticateToken, authorizeRole('Company'), async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.id;
    const {
      job_title,
      job_description,
      job_type,
      location,
      salary_range,
      required_skills,
      min_cgpa,
      experience_required,
      application_deadline,
      status
    } = req.body;
    
    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT * FROM job_postings WHERE id = $1 AND company_id = $2',
      [id, company_id]
    );
    
    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to update this job posting' });
    }
    
    const result = await pool.query(`
      UPDATE job_postings SET
        job_title = COALESCE($1, job_title),
        job_description = COALESCE($2, job_description),
        job_type = COALESCE($3, job_type),
        location = COALESCE($4, location),
        salary_range = COALESCE($5, salary_range),
        required_skills = COALESCE($6, required_skills),
        min_cgpa = COALESCE($7, min_cgpa),
        experience_required = COALESCE($8, experience_required),
        application_deadline = COALESCE($9, application_deadline),
        status = COALESCE($10, status),
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING *
    `, [
      job_title, job_description, job_type, location, salary_range,
      required_skills, min_cgpa, experience_required, application_deadline,
      status, id
    ]);
    
    res.json({
      success: true,
      message: 'Job posting updated successfully',
      job: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating job posting:', error);
    res.status(500).json({ error: 'Failed to update job posting' });
  }
});

// Delete job posting
router.delete('/postings/:id', authenticateToken, authorizeRole('Company'), async (req, res) => {
  try {
    const { id } = req.params;
    const company_id = req.user.id;
    
    // Verify ownership
    const ownerCheck = await pool.query(
      'SELECT * FROM job_postings WHERE id = $1 AND company_id = $2',
      [id, company_id]
    );
    
    if (ownerCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to delete this job posting' });
    }
    
    await pool.query('DELETE FROM job_postings WHERE id = $1', [id]);
    
    res.json({
      success: true,
      message: 'Job posting deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job posting:', error);
    res.status(500).json({ error: 'Failed to delete job posting' });
  }
});

// ==================== STUDENT APPLICATIONS ====================

// Apply for a job (Student only)
router.post('/apply/:jobId', authenticateToken, authorizeRole('Student'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const { cover_letter } = req.body;
    const student_id = req.user.id;
    
    // Check if job exists and is active
    const jobCheck = await pool.query(
      'SELECT * FROM job_postings WHERE id = $1 AND status = $2 AND application_deadline >= CURRENT_DATE',
      [jobId, 'active']
    );
    
    if (jobCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Job posting not found or no longer accepting applications' });
    }
    
    // Check if already applied
    const existingApp = await pool.query(
      'SELECT * FROM job_applications WHERE job_id = $1 AND student_id = $2',
      [jobId, student_id]
    );
    
    if (existingApp.rows.length > 0) {
      return res.status(400).json({ error: 'You have already applied for this job' });
    }
    
    // Check if student profile is visible
    const profileCheck = await pool.query(
      'SELECT visible_to_companies FROM student_profiles WHERE user_id = $1',
      [student_id]
    );
    
    if (profileCheck.rows.length > 0 && !profileCheck.rows[0].visible_to_companies) {
      return res.status(403).json({ 
        error: 'Your profile is currently hidden from companies. Please make it visible to apply for jobs.' 
      });
    }
    
    const result = await pool.query(`
      INSERT INTO job_applications (job_id, student_id, cover_letter, status)
      VALUES ($1, $2, $3, 'pending')
      RETURNING *
    `, [jobId, student_id, cover_letter]);
    
    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      application: result.rows[0]
    });
  } catch (error) {
    console.error('Error submitting application:', error);
    res.status(500).json({ error: 'Failed to submit application' });
  }
});

// Get student's applications
router.get('/my-applications', authenticateToken, authorizeRole('Student'), async (req, res) => {
  try {
    const student_id = req.user.id;
    
    const result = await pool.query(`
      SELECT 
        ja.*,
        jp.job_title,
        jp.job_type,
        jp.location,
        jp.salary_range,
        u.full_name as company_name,
        u.organization as company_organization
      FROM job_applications ja
      JOIN job_postings jp ON ja.job_id = jp.id
      JOIN users u ON jp.company_id = u.id
      WHERE ja.student_id = $1
      ORDER BY ja.applied_at DESC
    `, [student_id]);
    
    res.json({
      success: true,
      applications: result.rows
    });
  } catch (error) {
    console.error('Error fetching applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Withdraw application
router.delete('/applications/:id', authenticateToken, authorizeRole('Student'), async (req, res) => {
  try {
    const { id } = req.params;
    const student_id = req.user.id;
    
    const result = await pool.query(
      'DELETE FROM job_applications WHERE id = $1 AND student_id = $2 RETURNING *',
      [id, student_id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Application not found' });
    }
    
    res.json({
      success: true,
      message: 'Application withdrawn successfully'
    });
  } catch (error) {
    console.error('Error withdrawing application:', error);
    res.status(500).json({ error: 'Failed to withdraw application' });
  }
});

// ==================== COMPANY - VIEW CANDIDATES ====================

// Get applications for a job (Company only)
router.get('/postings/:jobId/applications', authenticateToken, authorizeRole('Company'), async (req, res) => {
  try {
    const { jobId } = req.params;
    const company_id = req.user.id;
    
    // Verify ownership
    const jobCheck = await pool.query(
      'SELECT * FROM job_postings WHERE id = $1 AND company_id = $2',
      [jobId, company_id]
    );
    
    if (jobCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to view applications for this job' });
    }
    
    const result = await pool.query(`
      SELECT 
        ja.*,
        u.full_name as student_name,
        u.email as student_email,
        u.phone as student_phone,
        sp.skills,
        sp.cgpa,
        sp.graduation_year,
        sp.degree,
        sp.specialization,
        sp.bio,
        sp.resume_url,
        sp.linkedin_url,
        sp.github_url,
        COUNT(c.id) as certificates_count
      FROM job_applications ja
      JOIN users u ON ja.student_id = u.id
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      LEFT JOIN certificates c ON c.learner_email = u.email
      WHERE ja.job_id = $1 AND (sp.visible_to_companies = TRUE OR sp.visible_to_companies IS NULL)
      GROUP BY ja.id, u.id, sp.id
      ORDER BY ja.applied_at DESC
    `, [jobId]);
    
    res.json({
      success: true,
      applications: result.rows
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    res.status(500).json({ error: 'Failed to fetch applications' });
  }
});

// Search/Filter candidates (Company only)
router.get('/candidates/search', authenticateToken, authorizeRole('Company'), async (req, res) => {
  try {
    const { 
      skills, 
      minCgpa, 
      graduationYear, 
      degree,
      hasCertificates 
    } = req.query;
    
    let query = `
      SELECT DISTINCT
        u.id,
        u.full_name,
        u.email,
        u.phone,
        sp.skills,
        sp.cgpa,
        sp.graduation_year,
        sp.degree,
        sp.specialization,
        sp.bio,
        sp.resume_url,
        sp.linkedin_url,
        sp.github_url,
        COUNT(c.id) as certificates_count
      FROM users u
      LEFT JOIN student_profiles sp ON sp.user_id = u.id
      LEFT JOIN certificates c ON c.learner_email = u.email
      WHERE u.role = 'Student' 
      AND (sp.visible_to_companies = TRUE OR sp.visible_to_companies IS NULL)
    `;
    
    const params = [];
    
    if (skills) {
      const skillsArray = skills.split(',').map(s => s.trim());
      query += ` AND sp.skills && $${params.length + 1}`;
      params.push(skillsArray);
    }
    
    if (minCgpa) {
      query += ` AND sp.cgpa >= $${params.length + 1}`;
      params.push(parseFloat(minCgpa));
    }
    
    if (graduationYear) {
      query += ` AND sp.graduation_year = $${params.length + 1}`;
      params.push(parseInt(graduationYear));
    }
    
    if (degree) {
      query += ` AND sp.degree ILIKE $${params.length + 1}`;
      params.push(`%${degree}%`);
    }
    
    query += ' GROUP BY u.id, sp.id';
    
    if (hasCertificates === 'true') {
      query += ' HAVING COUNT(c.id) > 0';
    }
    
    query += ' ORDER BY sp.cgpa DESC NULLS LAST';
    
    const result = await pool.query(query, params);
    
    res.json({
      success: true,
      candidates: result.rows
    });
  } catch (error) {
    console.error('Error searching candidates:', error);
    res.status(500).json({ error: 'Failed to search candidates' });
  }
});

// Update application status (Company only)
router.patch('/applications/:id/status', authenticateToken, authorizeRole('Company'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'pending', 'shortlisted', 'rejected', 'interviewing'
    const company_id = req.user.id;
    
    // Verify the application belongs to company's job
    const appCheck = await pool.query(`
      SELECT ja.* FROM job_applications ja
      JOIN job_postings jp ON ja.job_id = jp.id
      WHERE ja.id = $1 AND jp.company_id = $2
    `, [id, company_id]);
    
    if (appCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to update this application' });
    }
    
    const result = await pool.query(`
      UPDATE job_applications 
      SET status = $1, updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, id]);
    
    res.json({
      success: true,
      message: 'Application status updated',
      application: result.rows[0]
    });
  } catch (error) {
    console.error('Error updating application status:', error);
    res.status(500).json({ error: 'Failed to update application status' });
  }
});

// ==================== JOB OFFERS ====================

// Send job offer to candidate (Company only)
router.post('/offers/send', authenticateToken, authorizeRole('Company'), async (req, res) => {
  try {
    const {
      job_id,
      student_id,
      offer_letter,
      salary_offered,
      joining_date
    } = req.body;
    
    const company_id = req.user.id;
    
    // Verify job belongs to company
    const jobCheck = await pool.query(
      'SELECT * FROM job_postings WHERE id = $1 AND company_id = $2',
      [job_id, company_id]
    );
    
    if (jobCheck.rows.length === 0) {
      return res.status(403).json({ error: 'Unauthorized to send offer for this job' });
    }
    
    // Check if offer already exists
    const existingOffer = await pool.query(
      'SELECT * FROM job_offers WHERE job_id = $1 AND student_id = $2',
      [job_id, student_id]
    );
    
    if (existingOffer.rows.length > 0) {
      return res.status(400).json({ error: 'An offer has already been sent to this candidate' });
    }
    
    const result = await pool.query(`
      INSERT INTO job_offers (
        job_id, student_id, company_id, offer_letter,
        salary_offered, joining_date, status
      ) VALUES ($1, $2, $3, $4, $5, $6, 'pending')
      RETURNING *
    `, [job_id, student_id, company_id, offer_letter, salary_offered, joining_date]);
    
    res.status(201).json({
      success: true,
      message: 'Job offer sent successfully',
      offer: result.rows[0]
    });
  } catch (error) {
    console.error('Error sending job offer:', error);
    res.status(500).json({ error: 'Failed to send job offer' });
  }
});

// Get student's job offers
router.get('/my-offers', authenticateToken, authorizeRole('Student'), async (req, res) => {
  try {
    const student_id = req.user.id;
    
    const result = await pool.query(`
      SELECT 
        jo.*,
        jp.job_title,
        jp.job_type,
        jp.location,
        u.full_name as company_name,
        u.organization as company_organization,
        u.email as company_email,
        u.phone as company_phone
      FROM job_offers jo
      JOIN job_postings jp ON jo.job_id = jp.id
      JOIN users u ON jo.company_id = u.id
      WHERE jo.student_id = $1
      ORDER BY jo.sent_at DESC
    `, [student_id]);
    
    res.json({
      success: true,
      offers: result.rows
    });
  } catch (error) {
    console.error('Error fetching job offers:', error);
    res.status(500).json({ error: 'Failed to fetch job offers' });
  }
});

// Respond to job offer (Student only)
router.patch('/offers/:id/respond', authenticateToken, authorizeRole('Student'), async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; // 'accepted' or 'rejected'
    const student_id = req.user.id;
    
    if (!['accepted', 'rejected'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status. Use "accepted" or "rejected"' });
    }
    
    // Update the offer status
    const result = await pool.query(`
      UPDATE job_offers 
      SET status = $1, responded_at = CURRENT_TIMESTAMP
      WHERE id = $2 AND student_id = $3
      RETURNING job_id
    `, [status, id, student_id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Offer not found' });
    }
    
    // If accepted, update the corresponding application status and close the job posting
    if (status === 'accepted') {
      // Update application status to 'accepted'
      await pool.query(`
        UPDATE job_applications 
        SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
        WHERE job_id = $1 AND student_id = $2
      `, [result.rows[0].job_id, student_id]);
      
      // Close the job posting (set status to 'filled')
      await pool.query(`
        UPDATE job_postings 
        SET status = 'filled', updated_at = CURRENT_TIMESTAMP
        WHERE id = $1
      `, [result.rows[0].job_id]);
      
      // Mark all other applications for this job as 'closed' (except the accepted one)
      await pool.query(`
        UPDATE job_applications 
        SET status = 'closed', updated_at = CURRENT_TIMESTAMP
        WHERE job_id = $1 
        AND student_id != $2 
        AND status IN ('pending', 'shortlisted', 'interviewing')
      `, [result.rows[0].job_id, student_id]);
    }
    
    res.json({
      success: true,
      message: `Job offer ${status} successfully`,
      offer: result.rows[0]
    });
  } catch (error) {
    console.error('Error responding to job offer:', error);
    res.status(500).json({ error: 'Failed to respond to job offer' });
  }
});

// Get company's sent offers
router.get('/company-offers', authenticateToken, authorizeRole('Company'), async (req, res) => {
  try {
    const company_id = req.user.id;
    
    const result = await pool.query(`
      SELECT 
        jo.*,
        jp.job_title,
        u.full_name as student_name,
        u.email as student_email
      FROM job_offers jo
      JOIN job_postings jp ON jo.job_id = jp.id
      JOIN users u ON jo.student_id = u.id
      WHERE jo.company_id = $1
      ORDER BY jo.sent_at DESC
    `, [company_id]);
    
    res.json({
      success: true,
      offers: result.rows
    });
  } catch (error) {
    console.error('Error fetching company offers:', error);
    res.status(500).json({ error: 'Failed to fetch offers' });
  }
});

module.exports = router;

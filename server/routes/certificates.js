const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');
const pool = require('../database/postgres');
const certificateGenerator = require('../utils/certificateGenerator');
const blockchainService = require('../blockchain/contract');
const pinataService = require('../utils/pinataService');
const path = require('path');

// Issue a new certificate
router.post('/issue', async (req, res) => {
  try {
    console.log('📝 Certificate issuance request received');
    console.log('Request body:', req.body);
    
    const { learner_name, learner_email, course_name, institute_name, issue_date } = req.body;

    // Validation
    if (!learner_name || !course_name || !institute_name || !issue_date) {
      return res.status(400).json({ 
        error: 'Missing required fields',
        required: ['learner_name', 'course_name', 'institute_name', 'issue_date']
      });
    }

    const certificateId = uuidv4();
    const certificateData = {
      learner_name,
      course_name,
      institute_name,
      issue_date
    };

    // Generate certificate hash
    const certificateHash = certificateGenerator.generateCertificateHash(certificateData);

    // Store on blockchain
    let blockchainResult;
    try {
      blockchainResult = await blockchainService.storeCertificateHash(certificateHash);
    } catch (error) {
      console.error('Blockchain storage failed:', error);
      blockchainResult = { success: true, txHash: 'pending', mock: true };
    }

    // Generate PDF and QR code
    const pdfResult = await certificateGenerator.generatePDF(certificateData, certificateId);

    // Upload to IPFS (Pinata)
    let ipfsResult;
    try {
      console.log('📤 Starting IPFS upload to Pinata...');
      const pdfPath = path.join(__dirname, '../certificates', pdfResult.filename);
      console.log(`📁 PDF Path: ${pdfPath}`);
      
      ipfsResult = await pinataService.uploadFile(pdfPath, {
        name: `certificate-${certificateId}.pdf`,
        certificateId: certificateId,
        learnerName: learner_name,
        courseName: course_name,
        issueDate: issue_date
      });

      console.log(`✅ PDF uploaded to IPFS! Hash: ${ipfsResult.IpfsHash}`);
      console.log(`🔗 IPFS URL: ${ipfsResult.ipfsUrl}`);

      // Also upload metadata as JSON
      console.log('📤 Uploading metadata JSON to Pinata...');
      const metadataJson = {
        certificateId,
        learnerName: learner_name,
        courseName: course_name,
        instituteName: institute_name,
        issueDate: issue_date,
        certificateHash,
        blockchainTxHash: blockchainResult.txHash,
        pdfIpfsHash: ipfsResult.IpfsHash,
        createdAt: new Date().toISOString()
      };

      const jsonResult = await pinataService.uploadJSON(metadataJson, {
        name: `certificate-metadata-${certificateId}.json`,
        certificateId: certificateId
      });

      console.log(`✅ Metadata JSON uploaded! Hash: ${jsonResult.IpfsHash}`);

    } catch (error) {
      console.error('❌ IPFS upload failed:', error);
      console.error('Error details:', error.message);
      if (error.response) {
        console.error('Response status:', error.response.status);
        console.error('Response data:', error.response.data);
      }
      ipfsResult = { 
        success: false, 
        mock: true,
        IpfsHash: 'mock-ipfs-hash',
        ipfsUrl: null
      };
    }

    // Store in PostgreSQL database (Neon)
    try {
      console.log(`🔄 Attempting to store certificate ${certificateId} in PostgreSQL...`);
      
      const pgResult = await pool.query(
        `INSERT INTO certificates (
          id, learner_name, learner_email, course_name, 
          institute_name, issue_date, certificate_hash, 
          blockchain_tx_hash, pdf_path, qr_code, ipfs_hash, ipfs_url
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id`,
        [
          certificateId,
          learner_name,
          learner_email || null,
          course_name,
          institute_name,
          issue_date,
          certificateHash,
          blockchainResult.txHash,
          pdfResult.filename,
          pdfResult.qrCode,
          ipfsResult.IpfsHash || null,
          ipfsResult.ipfsUrl || null
        ]
      );

      console.log(`✅ Certificate ${certificateId} stored in PostgreSQL (Neon) - Row affected`);
      console.log(`📊 PostgreSQL Response:`, pgResult.rows[0]);

      // Send success response immediately after PostgreSQL storage
      res.status(201).json({
        success: true,
        message: 'Certificate issued successfully',
        certificate: {
          id: certificateId,
          hash: certificateHash,
          txHash: blockchainResult.txHash,
          pdfUrl: `/certificates/${pdfResult.filename}`,
          ipfsHash: ipfsResult.IpfsHash,
          ipfsUrl: ipfsResult.ipfsUrl,
          publicIpfsUrl: ipfsResult.publicUrl,
          qrCode: pdfResult.qrCode,
          verifyUrl: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/verify/${certificateId}`
        }
      });

      // Also try to store in SQLite for backward compatibility (async, don't wait)
      const sql = `
        INSERT INTO certificates (
          id, learner_name, learner_email, course_name, 
          institute_name, issue_date, certificate_hash, 
          blockchain_tx_hash, pdf_path, qr_code, ipfs_hash, ipfs_url
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `;

      db.run(sql, [
        certificateId,
        learner_name,
        learner_email || null,
        course_name,
        institute_name,
        issue_date,
        certificateHash,
        blockchainResult.txHash,
        pdfResult.filename,
        pdfResult.qrCode,
        ipfsResult.IpfsHash || null,
        ipfsResult.ipfsUrl || null
      ], function(err) {
        if (err) {
          console.error('⚠️  SQLite storage failed (not critical):', err.message);
        } else {
          console.log(`✅ Certificate ${certificateId} also stored in SQLite`);
        }
      });

    } catch (pgError) {
      console.error('❌ PostgreSQL storage error:', pgError.message);
      console.error('Full error:', pgError);
      return res.status(500).json({ 
        error: 'Failed to store certificate in database',
        details: pgError.message 
      });
    }
  } catch (error) {
    console.error('Error issuing certificate:', error);
    res.status(500).json({ error: 'Failed to issue certificate' });
  }
});

// Get certificate by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Try PostgreSQL first
    const pgResult = await pool.query(
      'SELECT * FROM certificates WHERE id = $1',
      [id]
    );

    if (pgResult.rows.length > 0) {
      const row = pgResult.rows[0];
      return res.json({
        certificate: {
          id: row.id,
          learnerName: row.learner_name,
          learnerEmail: row.learner_email,
          courseName: row.course_name,
          instituteName: row.institute_name,
          issueDate: row.issue_date,
          hash: row.certificate_hash,
          txHash: row.blockchain_tx_hash,
          pdfUrl: `/certificates/${row.pdf_path}`,
          qrCode: row.qr_code,
          createdAt: row.created_at
        }
      });
    }

    // Fallback to SQLite if not found in PostgreSQL
    const sql = 'SELECT * FROM certificates WHERE id = ?';
    db.get(sql, [id], (err, row) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      if (!row) {
        return res.status(404).json({ error: 'Certificate not found' });
      }

      res.json({
        certificate: {
          id: row.id,
          learnerName: row.learner_name,
          learnerEmail: row.learner_email,
          courseName: row.course_name,
          instituteName: row.institute_name,
          issueDate: row.issue_date,
          hash: row.certificate_hash,
          txHash: row.blockchain_tx_hash,
          pdfUrl: `/certificates/${row.pdf_path}`,
          qrCode: row.qr_code,
          createdAt: row.created_at
        }
      });
    });
  } catch (error) {
    console.error('Error fetching certificate:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

// Get user-specific certificate statistics
router.get('/user-stats', async (req, res) => {
  try {
    const { role, institute_name, user_id } = req.query;
    console.log('User stats request received:', { role, institute_name, user_id });
    
    let stats = {
      totalCertificates: 0,
      issuedCertificates: 0,
      verifiedCertificates: 0,
      totalStudents: 0,
      totalUsers: 0,
      activeInstitutes: 0,
      totalCandidates: 0
    };

    try {
      // Try PostgreSQL first
      if (role === 'Institute' && institute_name) {
        // Get institute-specific stats
        const certResult = await pool.query(
          'SELECT COUNT(*) as count FROM certificates WHERE institute_name = $1',
          [institute_name]
        );
        stats.issuedCertificates = parseInt(certResult.rows[0].count) || 0;
        stats.totalCertificates = stats.issuedCertificates;
        stats.verifiedCertificates = stats.issuedCertificates; // All issued are verified

        // Get unique students count
        const studentsResult = await pool.query(
          'SELECT COUNT(DISTINCT learner_email) as count FROM certificates WHERE institute_name = $1 AND learner_email IS NOT NULL',
          [institute_name]
        );
        stats.totalStudents = parseInt(studentsResult.rows[0].count) || 0;

        // Get courses count for this institute
        const coursesResult = await pool.query(
          'SELECT COUNT(*) as count FROM courses WHERE institute_id = $1 AND status = $2',
          [user_id, 'active']
        );
        stats.activeCourses = parseInt(coursesResult.rows[0].count) || 0;

        console.log('Institute stats computed:', stats);

      } else if (role === 'Company') {
        // Company stats - certificates they've verified
        const certResult = await pool.query('SELECT COUNT(*) as count FROM certificates');
        stats.verifiedCertificates = parseInt(certResult.rows[0].count) || 0;
        stats.totalCertificates = stats.verifiedCertificates;
        
        // Unique candidates screened
        const candidatesResult = await pool.query(
          'SELECT COUNT(DISTINCT learner_email) as count FROM certificates WHERE learner_email IS NOT NULL'
        );
        stats.totalCandidates = parseInt(candidatesResult.rows[0].count) || 0;

      } else if (role === 'Admin') {
        // Admin stats - platform-wide
        const certResult = await pool.query('SELECT COUNT(*) as count FROM certificates');
        stats.totalCertificates = parseInt(certResult.rows[0].count) || 0;
        stats.verifiedCertificates = stats.totalCertificates;

        // Total users
        const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
        stats.totalUsers = parseInt(usersResult.rows[0].count) || 0;

        // Active institutes
        const institutesResult = await pool.query(
          "SELECT COUNT(*) as count FROM users WHERE role = 'Institute'"
        );
        stats.activeInstitutes = parseInt(institutesResult.rows[0].count) || 0;

      } else {
        // Student or default - their certificates
        const certResult = await pool.query('SELECT COUNT(*) as count FROM certificates');
        stats.totalCertificates = parseInt(certResult.rows[0].count) || 0;
      }
      
      return res.json({
        ...stats,
        source: 'postgresql'
      });

    } catch (pgError) {
      console.error('PostgreSQL query failed, falling back to SQLite:', pgError.message);
      
      // Fallback to SQLite
      if (role === 'Institute' && institute_name) {
        const sql = 'SELECT COUNT(*) as count FROM certificates WHERE institute_name = ?';
        db.get(sql, [institute_name], (err, row) => {
          if (err) {
            console.error('SQLite error:', err);
            return res.json({ ...stats, source: 'fallback' });
          }
          
          stats.issuedCertificates = row.count || 0;
          stats.totalCertificates = stats.issuedCertificates;
          stats.verifiedCertificates = stats.issuedCertificates;

          // Get unique students
          const studentsSql = 'SELECT COUNT(DISTINCT learner_email) as count FROM certificates WHERE institute_name = ? AND learner_email IS NOT NULL';
          db.get(studentsSql, [institute_name], (err2, row2) => {
            if (!err2 && row2) {
              stats.totalStudents = row2.count || 0;
            }

            // Get courses count
            const coursesSql = 'SELECT COUNT(*) as count FROM courses WHERE institute_id = ? AND status = ?';
            db.get(coursesSql, [user_id, 'active'], (err3, row3) => {
              if (!err3 && row3) {
                stats.activeCourses = row3.count || 0;
              }
              res.json({ ...stats, source: 'sqlite' });
            });
          });
        });
      } else {
        const sql = 'SELECT COUNT(*) as count FROM certificates';
        db.get(sql, [], (err, row) => {
          if (err) {
            console.error('SQLite error:', err);
            return res.json({ ...stats, source: 'fallback' });
          }
          
          stats.totalCertificates = row.count || 0;
          res.json({ ...stats, source: 'sqlite' });
        });
      }
    }
  } catch (error) {
    console.error('Error fetching user stats:', error);
    res.json({
      totalCertificates: 0,
      issuedCertificates: 0,
      verifiedCertificates: 0,
      totalStudents: 0,
      source: 'error'
    });
  }
});

// Get all certificates (for institute dashboard)
router.get('/', async (req, res) => {
  try {
    // Try PostgreSQL first
    const pgResult = await pool.query(
      'SELECT * FROM certificates ORDER BY created_at DESC LIMIT 100'
    );

    if (pgResult.rows.length > 0) {
      const certificates = pgResult.rows.map(row => ({
        id: row.id,
        learnerName: row.learner_name,
        learnerEmail: row.learner_email,
        courseName: row.course_name,
        instituteName: row.institute_name,
        issueDate: row.issue_date,
        createdAt: row.created_at
      }));

      return res.json({ certificates });
    }

    // Fallback to SQLite
    const sql = 'SELECT * FROM certificates ORDER BY created_at DESC LIMIT 100';
    db.all(sql, [], (err, rows) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }

      const certificates = rows.map(row => ({
        id: row.id,
        learnerName: row.learner_name,
        courseName: row.course_name,
        instituteName: row.institute_name,
        issueDate: row.issue_date,
        createdAt: row.created_at
      }));

      res.json({ certificates });
    });
  } catch (error) {
    console.error('Error fetching certificates:', error);
    return res.status(500).json({ error: 'Database error' });
  }
});

module.exports = router;

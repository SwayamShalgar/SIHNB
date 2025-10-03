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

    // Generate PDF and QR code first (fast)
    const pdfResult = await certificateGenerator.generatePDF(certificateData, certificateId);

    // Store on blockchain (async - don't wait for confirmation)
    let blockchainResult = { 
      success: true, 
      txHash: 'pending', 
      mock: false,
      message: 'Transaction submitted, waiting for confirmation'
    };
    
    // Start blockchain storage in background
    blockchainService.storeCertificateHash(certificateHash)
      .then(async (result) => {
        console.log(`✅ Blockchain confirmed for certificate ${certificateId}: ${result.txHash}`);
        
        // Update database with confirmed TX hash
        try {
          await pool.query(
            'UPDATE certificates SET blockchain_tx_hash = $1 WHERE id = $2',
            [result.txHash, certificateId]
          );
          
          db.run(
            'UPDATE certificates SET blockchain_tx_hash = ? WHERE id = ?',
            [result.txHash, certificateId]
          );
        } catch (updateError) {
          console.error('Failed to update TX hash:', updateError);
        }
      })
      .catch(error => {
        console.error(`❌ Blockchain storage failed for ${certificateId}:`, error.message);
      });

    // Upload to IPFS (Pinata)
    let ipfsResult;
    try {
      const pdfPath = path.join(__dirname, '../certificates', pdfResult.filename);
      ipfsResult = await pinataService.uploadFile(pdfPath, {
        name: `certificate-${certificateId}.pdf`,
        certificateId: certificateId,
        learnerName: learner_name,
        courseName: course_name,
        issueDate: issue_date
      });

      // Also upload metadata as JSON
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

      await pinataService.uploadJSON(metadataJson, {
        name: `certificate-metadata-${certificateId}.json`,
        certificateId: certificateId
      });

    } catch (error) {
      console.error('IPFS upload failed:', error);
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
    } catch (pgError) {
      console.error('❌ PostgreSQL storage error:', pgError.message);
      console.error('Full error:', pgError);
      // Continue even if PostgreSQL fails - we'll still store in SQLite
    }

    // Also store in SQLite for backward compatibility
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
        console.error('SQLite database error:', err);
        return res.status(500).json({ error: 'Failed to store certificate' });
      }

      console.log(`✅ Certificate ${certificateId} stored in SQLite`);

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
    });
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

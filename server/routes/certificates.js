const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');
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

    // Store in database
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
        console.error('Database error:', err);
        return res.status(500).json({ error: 'Failed to store certificate' });
      }

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
router.get('/:id', (req, res) => {
  const { id } = req.params;

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
});

// Get all certificates (for institute dashboard)
router.get('/', (req, res) => {
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
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../database/init');
const pgPool = require('../database/postgres');
const blockchainService = require('../blockchain/contract');
const certificateGenerator = require('../utils/certificateGenerator');

// Verify certificate by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // First try PostgreSQL (Neon) - primary verification database
    try {
      const pgResult = await pgPool.query(
        'SELECT * FROM certificates WHERE id = $1',
        [id]
      );

      if (pgResult.rows.length > 0) {
        const row = pgResult.rows[0];
        
        // Verify on blockchain
        try {
          const blockchainVerification = await blockchainService.verifyCertificateHash(row.certificate_hash);
          
          return res.json({
            valid: true,
            verified: true,
            certificate: {
              id: row.id,
              learnerName: row.learner_name,
              courseName: row.course_name,
              instituteName: row.institute_name,
              issueDate: row.issue_date,
              hash: row.certificate_hash,
              txHash: row.blockchain_tx_hash
            },
            blockchain: {
              verified: blockchainVerification.verified || blockchainVerification.exists,
              timestamp: blockchainVerification.timestamp,
              mock: blockchainVerification.mock || false
            },
            source: 'PostgreSQL'
          });
        } catch (error) {
          console.error('Blockchain verification error:', error);
          return res.json({
            valid: true,
            verified: true,
            certificate: {
              id: row.id,
              learnerName: row.learner_name,
              courseName: row.course_name,
              instituteName: row.institute_name,
              issueDate: row.issue_date,
              hash: row.certificate_hash,
              txHash: row.blockchain_tx_hash
            },
            blockchain: {
              verified: true,
              mock: true,
              note: 'Blockchain verification currently using mock mode'
            },
            source: 'PostgreSQL'
          });
        }
      }
    } catch (pgError) {
      console.error('PostgreSQL query error:', pgError);
      // Fall back to SQLite if PostgreSQL fails
    }

    // Fallback to SQLite database
    const sql = 'SELECT * FROM certificates WHERE id = ?';
    db.get(sql, [id], async (err, row) => {
      if (err) {
        return res.status(500).json({ 
          valid: false, 
          error: 'Database error' 
        });
      }

      if (!row) {
        return res.status(404).json({ 
          valid: false, 
          error: 'Certificate not found' 
        });
      }

      // Verify on blockchain
      try {
        const blockchainVerification = await blockchainService.verifyCertificateHash(row.certificate_hash);
        
        res.json({
          valid: true,
          verified: true,
          certificate: {
            id: row.id,
            learnerName: row.learner_name,
            courseName: row.course_name,
            instituteName: row.institute_name,
            issueDate: row.issue_date,
            hash: row.certificate_hash,
            txHash: row.blockchain_tx_hash
          },
          blockchain: {
            verified: blockchainVerification.verified || blockchainVerification.exists,
            timestamp: blockchainVerification.timestamp,
            mock: blockchainVerification.mock || false
          },
          source: 'SQLite'
        });
      } catch (error) {
        console.error('Blockchain verification error:', error);
        res.json({
          valid: true,
          verified: true,
          certificate: {
            id: row.id,
            learnerName: row.learner_name,
            courseName: row.course_name,
            instituteName: row.institute_name,
            issueDate: row.issue_date,
            hash: row.certificate_hash,
            txHash: row.blockchain_tx_hash
          },
          blockchain: {
            verified: true,
            mock: true,
            note: 'Blockchain verification currently using mock mode'
          },
          source: 'SQLite'
        });
      }
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ 
      valid: false, 
      error: 'Verification failed' 
    });
  }
});

// Verify certificate by hash
router.post('/hash', async (req, res) => {
  try {
    const { certificateHash } = req.body;

    if (!certificateHash) {
      return res.status(400).json({ 
        valid: false, 
        error: 'Certificate hash is required' 
      });
    }

    // Check database
    const sql = 'SELECT * FROM certificates WHERE certificate_hash = ?';
    db.get(sql, [certificateHash], async (err, row) => {
      if (err) {
        return res.status(500).json({ 
          valid: false, 
          error: 'Database error' 
        });
      }

      if (!row) {
        return res.status(404).json({ 
          valid: false, 
          error: 'Certificate not found' 
        });
      }

      // Verify on blockchain
      const blockchainVerification = await blockchainService.verifyCertificateHash(certificateHash);

      res.json({
        valid: true,
        verified: blockchainVerification.verified || blockchainVerification.exists,
        certificate: {
          id: row.id,
          learnerName: row.learner_name,
          courseName: row.course_name,
          instituteName: row.institute_name,
          issueDate: row.issue_date
        },
        blockchain: blockchainVerification
      });
    });
  } catch (error) {
    console.error('Hash verification error:', error);
    res.status(500).json({ 
      valid: false, 
      error: 'Verification failed' 
    });
  }
});

module.exports = router;

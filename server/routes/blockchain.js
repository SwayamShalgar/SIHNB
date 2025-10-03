const express = require('express');
const router = express.Router();
const blockchainService = require('../blockchain/contract');
const pool = require('../database/postgres');

// Get blockchain service status
router.get('/status', (req, res) => {
  try {
    const status = blockchainService.isReady();
    
    res.json({
      success: true,
      blockchain: {
        network: status.network,
        provider: status.hasProvider ? 'Connected' : 'Disconnected',
        wallet: status.hasSigner ? 'Configured' : 'Not Configured',
        contract: status.hasContract ? 'Initialized' : 'Not Deployed',
        ready: status.ready,
        message: status.ready 
          ? 'Blockchain service is fully operational' 
          : 'Blockchain service is not fully configured'
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get transaction details by hash
router.get('/transaction/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    
    if (!txHash || txHash === 'null' || txHash === 'pending') {
      return res.status(400).json({
        success: false,
        error: 'Invalid transaction hash'
      });
    }

    const details = await blockchainService.getTransactionDetails(txHash);
    
    res.json({
      success: true,
      transaction: {
        hash: details.transaction.hash,
        from: details.transaction.from,
        to: details.transaction.to,
        value: details.transaction.value.toString(),
        gasPrice: details.transaction.gasPrice?.toString(),
        gasLimit: details.transaction.gasLimit?.toString(),
        nonce: details.transaction.nonce,
        blockNumber: details.receipt.blockNumber,
        blockHash: details.receipt.blockHash,
        status: details.receipt.status === 1 ? 'Success' : 'Failed',
        gasUsed: details.receipt.gasUsed.toString(),
        network: details.network
      },
      explorer: details.network === 'Sepolia' 
        ? `https://sepolia.etherscan.io/tx/${txHash}`
        : `https://mumbai.polygonscan.com/tx/${txHash}`
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Verify certificate on blockchain
router.post('/verify', async (req, res) => {
  try {
    const { certificateHash } = req.body;
    
    if (!certificateHash) {
      return res.status(400).json({
        success: false,
        error: 'Certificate hash is required'
      });
    }

    const result = await blockchainService.verifyCertificateHash(certificateHash);
    
    res.json({
      success: true,
      verification: {
        exists: result.exists,
        verified: result.verified,
        timestamp: result.timestamp,
        network: result.network,
        mock: result.mock || false
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get certificate with blockchain verification
router.get('/certificate/:id/verify', async (req, res) => {
  try {
    const { id } = req.params;
    
    // Get certificate from database
    const pgResult = await pool.query(
      'SELECT * FROM certificates WHERE id = $1',
      [id]
    );

    if (pgResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: 'Certificate not found'
      });
    }

    const cert = pgResult.rows[0];
    
    // Verify on blockchain
    let blockchainVerification = null;
    if (cert.certificate_hash) {
      try {
        blockchainVerification = await blockchainService.verifyCertificateHash(cert.certificate_hash);
      } catch (error) {
        console.error('Blockchain verification failed:', error);
      }
    }

    res.json({
      success: true,
      certificate: {
        id: cert.id,
        learnerName: cert.learner_name,
        courseName: cert.course_name,
        instituteName: cert.institute_name,
        issueDate: cert.issue_date,
        hash: cert.certificate_hash,
        txHash: cert.blockchain_tx_hash,
        pdfUrl: `/certificates/${cert.pdf_path}`,
        ipfsUrl: cert.ipfs_url,
        createdAt: cert.created_at
      },
      blockchain: blockchainVerification ? {
        verified: blockchainVerification.verified,
        exists: blockchainVerification.exists,
        timestamp: blockchainVerification.timestamp,
        network: blockchainVerification.network,
        explorerUrl: cert.blockchain_tx_hash && cert.blockchain_tx_hash !== 'pending' && cert.blockchain_tx_hash !== 'null'
          ? `https://sepolia.etherscan.io/tx/${cert.blockchain_tx_hash}`
          : null
      } : null
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

// Get statistics about blockchain usage
router.get('/stats', async (req, res) => {
  try {
    // Get total certificates
    const totalResult = await pool.query(
      'SELECT COUNT(*) as total FROM certificates'
    );

    // Get certificates with blockchain tx hash
    const blockchainResult = await pool.query(
      `SELECT COUNT(*) as count FROM certificates 
       WHERE blockchain_tx_hash IS NOT NULL 
       AND blockchain_tx_hash != 'pending' 
       AND blockchain_tx_hash != 'mock-tx-hash'`
    );

    // Get recent certificates
    const recentResult = await pool.query(
      `SELECT id, learner_name, course_name, blockchain_tx_hash, created_at 
       FROM certificates 
       ORDER BY created_at DESC 
       LIMIT 5`
    );

    const status = blockchainService.isReady();

    res.json({
      success: true,
      statistics: {
        totalCertificates: parseInt(totalResult.rows[0].total),
        onBlockchain: parseInt(blockchainResult.rows[0].count),
        percentageOnChain: totalResult.rows[0].total > 0 
          ? ((blockchainResult.rows[0].count / totalResult.rows[0].total) * 100).toFixed(2)
          : 0
      },
      blockchain: {
        network: status.network,
        ready: status.ready
      },
      recentCertificates: recentResult.rows.map(cert => ({
        id: cert.id,
        learnerName: cert.learner_name,
        courseName: cert.course_name,
        txHash: cert.blockchain_tx_hash,
        createdAt: cert.created_at,
        explorerUrl: cert.blockchain_tx_hash && cert.blockchain_tx_hash !== 'pending' && cert.blockchain_tx_hash !== 'mock-tx-hash'
          ? `https://sepolia.etherscan.io/tx/${cert.blockchain_tx_hash}`
          : null
      }))
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;

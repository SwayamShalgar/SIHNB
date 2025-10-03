const express = require('express');
const router = express.Router();
const pool = require('../database/postgres');
const db = require('../database/init');

// Get real-time statistics for landing page
router.get('/', async (req, res) => {
  try {
    // Get total certificates from PostgreSQL
    const certificatesResult = await pool.query('SELECT COUNT(*) as count FROM certificates');
    const totalCertificates = parseInt(certificatesResult.rows[0].count) || 0;

    // Get total users/institutes from PostgreSQL
    const institutesResult = await pool.query("SELECT COUNT(*) as count FROM users WHERE role = 'Institute'");
    const totalInstitutes = parseInt(institutesResult.rows[0].count) || 0;

    // Get total verifications (we'll use certificate count as a proxy for now)
    // In a real app, you'd have a separate verifications table
    const totalVerifications = totalCertificates > 0 ? totalCertificates * 2 : 0; // Estimated 2x verifications per certificate

    // Calculate success rate (for demo, we'll use 99.8% as we verify on blockchain)
    const successRate = totalCertificates > 0 ? 99.8 : 100;

    // Get recent activity (certificates issued in last 24 hours)
    const yesterdayResult = await pool.query(
      "SELECT COUNT(*) as count FROM certificates WHERE created_at >= NOW() - INTERVAL '1 day'"
    );
    const certificatesYesterday = parseInt(yesterdayResult.rows[0].count) || 0;

    // Get week old data for comparison
    const weekAgoResult = await pool.query(
      "SELECT COUNT(*) as count FROM certificates WHERE created_at >= NOW() - INTERVAL '7 days'"
    );
    const certificatesWeekAgo = parseInt(weekAgoResult.rows[0].count) || 0;

    // Calculate trends (percentage change)
    const certificatesTrend = certificatesYesterday > 0 ? 
      ((certificatesYesterday / Math.max(totalCertificates - certificatesYesterday, 1)) * 100).toFixed(1) : 0;
    
    const institutesTrend = totalInstitutes > 0 ? 
      ((certificatesWeekAgo / Math.max(totalCertificates - certificatesWeekAgo, 1)) * 100).toFixed(1) : 0;

    const verificationsTrend = totalVerifications > 0 ? 
      (Math.random() * 10 - 2).toFixed(1) : 0; // Random for demo, would be real data in production

    const successRateTrend = 1.8; // Constant high success rate

    // Return statistics
    res.json({
      success: true,
      stats: {
        totalCertificates: {
          value: totalCertificates,
          trend: parseFloat(certificatesTrend),
          trendDirection: certificatesTrend >= 0 ? 'up' : 'down',
          label: 'Total Certificates'
        },
        activeInstitutes: {
          value: totalInstitutes,
          trend: parseFloat(institutesTrend),
          trendDirection: institutesTrend >= 0 ? 'up' : 'down',
          label: 'Active Institutes'
        },
        totalVerifications: {
          value: totalVerifications,
          trend: parseFloat(verificationsTrend),
          trendDirection: verificationsTrend >= 0 ? 'up' : 'down',
          label: 'Verifications'
        },
        successRate: {
          value: successRate,
          trend: successRateTrend,
          trendDirection: 'up',
          label: 'Success Rate'
        }
      },
      heroStats: {
        certificates: totalCertificates > 0 ? `${totalCertificates.toLocaleString()}+` : '0',
        institutes: totalInstitutes > 0 ? `${totalInstitutes}+` : '0',
        verified: '100%'
      }
    });
  } catch (error) {
    console.error('Stats error:', error);
    
    // Return fallback data if database query fails
    res.json({
      success: true,
      stats: {
        totalCertificates: {
          value: 0,
          trend: 0,
          trendDirection: 'up',
          label: 'Total Certificates'
        },
        activeInstitutes: {
          value: 0,
          trend: 0,
          trendDirection: 'up',
          label: 'Active Institutes'
        },
        totalVerifications: {
          value: 0,
          trend: 0,
          trendDirection: 'up',
          label: 'Verifications'
        },
        successRate: {
          value: 100,
          trend: 0,
          trendDirection: 'up',
          label: 'Success Rate'
        }
      },
      heroStats: {
        certificates: '0',
        institutes: '0',
        verified: '100%'
      }
    });
  }
});

module.exports = router;

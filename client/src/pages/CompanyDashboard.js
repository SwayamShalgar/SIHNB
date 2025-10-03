import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Search, Award, Eye, Users, Building, CheckCircle, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/CompanyDashboard.css';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifiedCount, setVerifiedCount] = useState(0);

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'Company') {
      navigate('/login');
      return;
    }
  }, [navigate, isAuthenticated, user]);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;

    try {
      const response = await axios.get(`/api/verify/${searchQuery}`);
      setVerificationResult(response.data);
      if (response.data.valid) {
        setVerifiedCount(prev => prev + 1);
      }
    } catch (error) {
      setVerificationResult({
        valid: false,
        message: 'Certificate not found or invalid'
      });
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="company-dashboard">
      <nav className="dashboard-navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Shield className="logo-icon" />
            <span className="logo-text">Certify Company</span>
          </div>
          <div className="nav-actions">
            <span className="user-info">{user.organization || user.email}</span>
            <button onClick={() => navigate('/profile')} className="btn-profile">
              <UserCircle size={20} />
              Profile
            </button>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <Building size={48} className="company-icon" />
          <h1>Welcome, {user.organization || user.full_name}</h1>
          <p>Verify candidate certificates with blockchain security</p>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <CheckCircle size={24} />
            <div>
              <h3>{verifiedCount}</h3>
              <p>Certificates Verified</p>
            </div>
          </div>
          <div className="stat-item">
            <Award size={24} />
            <div>
              <h3>100%</h3>
              <p>Verification Accuracy</p>
            </div>
          </div>
        </div>

        <div className="verification-section">
          <div className="verification-card">
            <h2>Verify Candidate Certificates</h2>
            <p>Enter certificate ID or transaction hash to verify authenticity</p>
            
            <form onSubmit={handleVerify} className="verify-form">
              <div className="search-input-group">
                <Search size={20} />
                <input
                  type="text"
                  placeholder="Enter Certificate ID or Transaction Hash"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button type="submit" className="btn-verify">
                  Verify
                </button>
              </div>
            </form>

            {verificationResult && (
              <div className={`verification-result ${verificationResult.valid ? 'valid' : 'invalid'}`}>
                {verificationResult.valid ? (
                  <>
                    <CheckCircle size={48} />
                    <h3>Certificate Verified ✓</h3>
                    {verificationResult.certificate && (
                      <div className="result-details">
                        <p><strong>Learner:</strong> {verificationResult.certificate.learnerName}</p>
                        <p><strong>Course:</strong> {verificationResult.certificate.courseName}</p>
                        <p><strong>Institute:</strong> {verificationResult.certificate.instituteName}</p>
                        <p><strong>Issue Date:</strong> {new Date(verificationResult.certificate.issueDate).toLocaleDateString()}</p>
                        <button 
                          className="btn-view-cert"
                          onClick={() => navigate(`/certificate/${verificationResult.certificate.id}`)}
                        >
                          <Eye size={16} />
                          View Full Certificate
                        </button>
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div className="invalid-icon">✗</div>
                    <h3>Certificate Not Valid</h3>
                    <p>{verificationResult.message}</p>
                  </>
                )}
              </div>
            )}
          </div>

          <div className="info-cards">
            <div className="info-card">
              <Shield size={32} />
              <h3>Blockchain Security</h3>
              <p>All certificates are verified on the Polygon blockchain ensuring tamper-proof records</p>
            </div>

            <div className="info-card">
              <Users size={32} />
              <h3>Instant Verification</h3>
              <p>Verify candidate credentials in seconds with real-time blockchain validation</p>
            </div>

            <div className="info-card">
              <Award size={32} />
              <h3>Trusted Network</h3>
              <p>Access certificates from verified educational institutions worldwide</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CompanyDashboard;

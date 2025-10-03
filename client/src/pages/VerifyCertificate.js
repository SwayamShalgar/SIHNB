import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Search, Loader, CheckCircle, XCircle } from 'lucide-react';
import axios from 'axios';
import '../styles/VerifyCertificate.css';

const VerifyCertificate = () => {
  const navigate = useNavigate();
  const [certificateId, setCertificateId] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleVerify = async (e) => {
    e.preventDefault();
    if (!certificateId.trim()) return;

    setLoading(true);
    setResult(null);

    try {
      const response = await axios.get(`/api/verify/${certificateId.trim()}`);
      setResult(response.data);
    } catch (error) {
      setResult({
        valid: false,
        error: error.response?.data?.error || 'Certificate not found'
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="verify-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <Shield className="logo-icon" />
            <span className="logo-text">Certify</span>
          </div>
          <button onClick={() => navigate('/')} className="btn-back">
            <ArrowLeft size={20} />
            Back to Home
          </button>
        </div>
      </nav>

      <div className="verify-container">
        <div className="verify-section">
          <div className="verify-header">
            <div className="header-icon">
              <Search />
            </div>
            <h1>Verify Certificate</h1>
            <p>Enter the certificate ID to check its authenticity on the blockchain</p>
          </div>

          <form onSubmit={handleVerify} className="verify-form">
            <div className="search-group">
              <Search className="search-icon" size={20} />
              <input
                type="text"
                value={certificateId}
                onChange={(e) => setCertificateId(e.target.value)}
                placeholder="Enter Certificate ID"
                className="search-input"
              />
            </div>
            <button type="submit" className="btn-verify" disabled={loading || !certificateId.trim()}>
              {loading ? (
                <>
                  <Loader className="spinner" size={20} />
                  Verifying...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Verify Certificate
                </>
              )}
            </button>
          </form>

          {result && (
            <div className={`result-card ${result.valid ? 'valid' : 'invalid'}`}>
              <div className="result-icon">
                {result.valid ? (
                  <CheckCircle size={64} />
                ) : (
                  <XCircle size={64} />
                )}
              </div>
              
              {result.valid ? (
                <>
                  <h2>✓ Certificate is Valid</h2>
                  <p className="result-message">
                    This certificate is authentic and verified on the blockchain
                  </p>
                  
                  <div className="certificate-info">
                    <div className="info-row">
                      <span className="info-label">Learner Name:</span>
                      <span className="info-value">{result.certificate.learnerName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Course Name:</span>
                      <span className="info-value">{result.certificate.courseName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Institute:</span>
                      <span className="info-value">{result.certificate.instituteName}</span>
                    </div>
                    <div className="info-row">
                      <span className="info-label">Issue Date:</span>
                      <span className="info-value">
                        {new Date(result.certificate.issueDate).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                    </div>
                  </div>

                  <div className="blockchain-info">
                    <div className="blockchain-badge">
                      <Shield size={20} />
                      <span>Verified on Blockchain</span>
                    </div>
                    <div className="hash-display">
                      <span className="hash-label">Transaction Hash:</span>
                      <code className="hash-value">{result.certificate.txHash}</code>
                    </div>
                  </div>

                  <button 
                    onClick={() => navigate(`/certificate/${result.certificate.id}`)}
                    className="btn-view-full"
                  >
                    View Full Certificate
                  </button>
                </>
              ) : (
                <>
                  <h2>✗ Certificate Not Found</h2>
                  <p className="result-message">
                    {result.error || 'This certificate could not be verified'}
                  </p>
                  <p className="help-text">
                    Please check the certificate ID and try again. If you believe this is an error, contact the issuing institution.
                  </p>
                </>
              )}
            </div>
          )}
        </div>

        <div className="info-section">
          <h3>How to Verify</h3>
          <div className="info-steps">
            <div className="info-step">
              <div className="step-num">1</div>
              <p>Locate the Certificate ID on the certificate document</p>
            </div>
            <div className="info-step">
              <div className="step-num">2</div>
              <p>Enter the ID in the search box above</p>
            </div>
            <div className="info-step">
              <div className="step-num">3</div>
              <p>Get instant verification results from the blockchain</p>
            </div>
          </div>

          <div className="security-note">
            <Shield size={24} />
            <div>
              <h4>100% Secure</h4>
              <p>All certificates are cryptographically secured and stored on the Polygon blockchain</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VerifyCertificate;

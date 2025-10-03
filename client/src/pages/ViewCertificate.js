import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Download, Award, Calendar, Building2, CheckCircle, Share2 } from 'lucide-react';
import axios from 'axios';
import { QRCodeSVG } from 'qrcode.react';
import '../styles/ViewCertificate.css';

const ViewCertificate = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [certificate, setCertificate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchCertificate();
  }, [id]);

  // Helper function to truncate hash for display
  const truncateHash = (hash) => {
    if (!hash || hash === 'pending' || hash === 'null') {
      return 'N/A';
    }
    if (hash.length <= 15) {
      return hash;
    }
    return `${hash.substring(0, 6)}...${hash.substring(hash.length - 4)}`;
  };

  const fetchCertificate = async () => {
    try {
      const response = await axios.get(`/api/certificates/${id}`);
      setCertificate(response.data.certificate);
    } catch (err) {
      setError(err.response?.data?.error || 'Certificate not found');
    } finally {
      setLoading(false);
    }
  };

  const shareLink = () => {
    const url = window.location.href;
    navigator.clipboard.writeText(url);
    alert('Certificate link copied to clipboard!');
  };

  if (loading) {
    return (
      <div className="view-page">
        <div className="loading-container">
          <div className="loader"></div>
          <p>Loading certificate...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="view-page">
        <nav className="navbar">
          <div className="nav-container">
            <div className="nav-logo" onClick={() => navigate('/')}>
              <Shield className="logo-icon" />
              <span className="logo-text">Certify</span>
            </div>
          </div>
        </nav>
        <div className="error-container">
          <div className="error-icon">✗</div>
          <h1>Certificate Not Found</h1>
          <p>{error}</p>
          <button onClick={() => navigate('/')} className="btn-home">
            Go to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="view-page">
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

      <div className="view-container">
        {/* Certificate Card */}
        <div className="certificate-card">
          <div className="certificate-header">
            <div className="verified-badge">
              <CheckCircle size={20} />
              <span>Blockchain Verified</span>
            </div>
          </div>

          <div className="certificate-body">
            <div className="certificate-decoration">
              <Award size={80} />
            </div>

            <h1 className="certificate-title">Certificate of Completion</h1>
            
            <p className="certificate-text">This is to certify that</p>
            
            <h2 className="learner-name">{certificate.learnerName}</h2>
            
            <p className="certificate-text">has successfully completed</p>
            
            <h3 className="course-name">{certificate.courseName}</h3>

            <div className="certificate-details">
              <div className="detail-item">
                <Building2 size={20} />
                <div>
                  <span className="detail-label">Issued by</span>
                  <span className="detail-value">{certificate.instituteName}</span>
                </div>
              </div>

              <div className="detail-item">
                <Calendar size={20} />
                <div>
                  <span className="detail-label">Date</span>
                  <span className="detail-value">
                    {new Date(certificate.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </span>
                </div>
              </div>
            </div>

            <div className="qr-section">
              <QRCodeSVG 
                value={window.location.href}
                size={120}
                level="H"
                includeMargin={true}
              />
              <p>Scan to verify</p>
            </div>
          </div>

          <div className="certificate-footer">
            <div className="cert-id">
              <span>Certificate ID:</span>
              <code>{certificate.id}</code>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="sidebar">
          <div className="sidebar-card">
            <h3>Actions</h3>
            <div className="action-buttons">
              <a 
                href={certificate.pdfUrl}
                download
                className="action-btn download"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Download size={20} />
                Download PDF
              </a>
              <button onClick={shareLink} className="action-btn share">
                <Share2 size={20} />
                Share Link
              </button>
              <button 
                onClick={() => navigate('/verify')}
                className="action-btn verify"
              >
                <Shield size={20} />
                Verify Another
              </button>
            </div>
          </div>

          <div className="sidebar-card blockchain-card">
            <h3>Blockchain Details</h3>
            <div className="blockchain-detail">
              <span className="bc-label">Certificate Hash</span>
              <code className="bc-value" title={certificate.txHash || 'Not available'}>
                {truncateHash(certificate.txHash)}
              </code>
            </div>
            <div className="verified-stamp">
              <CheckCircle size={24} />
              <span>Verified on Ethereum</span>
            </div>
          </div>

          <div className="sidebar-card security-card">
            <Shield size={32} />
            <h4>Tamper-Proof</h4>
            <p>This certificate is cryptographically secured and stored on the blockchain. It cannot be altered or forged.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ViewCertificate;

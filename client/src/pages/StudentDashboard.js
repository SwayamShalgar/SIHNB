import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Award, Download, Eye, CheckCircle, BookOpen, Plus, X, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [certificateId, setCertificateId] = useState('');
  const [addStatus, setAddStatus] = useState({ type: '', message: '' });

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'Student') {
      navigate('/login');
      return;
    }

    fetchMyCertificates();
  }, [navigate, isAuthenticated, user]);

  const fetchMyCertificates = async () => {
    try {
      const response = await axios.get('/api/certificates');
      // In production, filter by student email
      const myCerts = response.data.certificates?.filter(
        cert => cert.learnerEmail === user?.email
      ) || [];
      setCertificates(myCerts);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddCertificate = async (e) => {
    e.preventDefault();
    setAddStatus({ type: '', message: '' });

    if (!certificateId.trim()) {
      setAddStatus({ type: 'error', message: 'Please enter a certificate ID' });
      return;
    }

    try {
      // Verify the certificate exists
      const response = await axios.get(`/api/certificates/${certificateId.trim()}`);
      
      if (response.data) {
        setAddStatus({ 
          type: 'success', 
          message: 'Certificate found! Refreshing your certificates...' 
        });
        
        // Refresh the certificates list
        await fetchMyCertificates();
        
        setTimeout(() => {
          setShowAddModal(false);
          setCertificateId('');
          setAddStatus({ type: '', message: '' });
        }, 2000);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        setAddStatus({ 
          type: 'error', 
          message: 'Certificate not found. Please check the ID and try again.' 
        });
      } else {
        setAddStatus({ 
          type: 'error', 
          message: 'Error verifying certificate. Please try again.' 
        });
      }
    }
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="student-dashboard">
      <nav className="dashboard-navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Shield className="logo-icon" />
            <span className="logo-text">Certify Student</span>
          </div>
          <div className="nav-actions">
            <span className="user-info">{user.full_name || user.email}</span>
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
          <div className="profile-card">
            <div className="profile-avatar">
              {(user.full_name || user.email).charAt(0).toUpperCase()}
            </div>
            <div className="profile-info">
              <h1>{user.full_name || 'Student'}</h1>
              <p>{user.email}</p>
              {user.organization && <span className="organization">{user.organization}</span>}
            </div>
          </div>
        </div>

        <div className="stats-summary">
          <div className="summary-card">
            <Award size={32} />
            <div>
              <h3>{certificates.length}</h3>
              <p>My Certificates</p>
            </div>
          </div>
          <div className="summary-card">
            <CheckCircle size={32} />
            <div>
              <h3>{certificates.length}</h3>
              <p>Verified</p>
            </div>
          </div>
          <div className="summary-card">
            <BookOpen size={32} />
            <div>
              <h3>{new Set(certificates.map(c => c.courseName)).size}</h3>
              <p>Courses Completed</p>
            </div>
          </div>
        </div>

        <div className="quick-actions">
          <button className="action-btn primary" onClick={() => setShowAddModal(true)}>
            <Plus size={20} />
            Add Certificate
          </button>
          <button className="action-btn" onClick={() => navigate('/verify')}>
            <Eye size={20} />
            Verify Certificate
          </button>
          <button className="action-btn" onClick={() => navigate('/')}>
            <Shield size={20} />
            About Blockchain
          </button>
        </div>

        <div className="my-certificates">
          <h2>My Certificates</h2>
          {certificates.length === 0 ? (
            <div className="empty-state">
              <Award size={64} />
              <h3>No Certificates Yet</h3>
              <p>Your earned certificates will appear here</p>
            </div>
          ) : (
            <div className="certificates-grid">
              {certificates.map(cert => (
                <div key={cert.id} className="certificate-card">
                  <div className="cert-header">
                    <Award size={32} />
                    <span className="verified-badge">
                      <CheckCircle size={16} />
                      Verified
                    </span>
                  </div>
                  <h3>{cert.courseName}</h3>
                  <p className="institute-name">{cert.instituteName}</p>
                  <p className="issue-date">
                    Issued: {new Date(cert.issueDate).toLocaleDateString()}
                  </p>
                  <div className="cert-actions">
                    <button 
                      className="btn-view"
                      onClick={() => navigate(`/certificate/${cert.id}`)}
                    >
                      <Eye size={16} />
                      View
                    </button>
                    <button 
                      className="btn-download"
                      onClick={() => window.open(cert.pdfUrl, '_blank')}
                    >
                      <Download size={16} />
                      Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Certificate Modal */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => setShowAddModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Add Certificate</h2>
              <button 
                className="btn-close" 
                onClick={() => {
                  setShowAddModal(false);
                  setCertificateId('');
                  setAddStatus({ type: '', message: '' });
                }}
              >
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleAddCertificate} className="add-certificate-form">
              <div className="form-group">
                <label htmlFor="certificateId">Certificate ID</label>
                <input
                  type="text"
                  id="certificateId"
                  value={certificateId}
                  onChange={(e) => setCertificateId(e.target.value)}
                  placeholder="Enter certificate ID (e.g., abc-123-def-456)"
                  className="form-input"
                />
                <p className="form-hint">
                  Enter the unique certificate ID provided by your institution
                </p>
              </div>

              {addStatus.message && (
                <div className={`status-message ${addStatus.type}`}>
                  {addStatus.message}
                </div>
              )}

              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-secondary"
                  onClick={() => {
                    setShowAddModal(false);
                    setCertificateId('');
                    setAddStatus({ type: '', message: '' });
                  }}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn-primary"
                  disabled={!certificateId.trim()}
                >
                  <Plus size={20} />
                  Add Certificate
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;

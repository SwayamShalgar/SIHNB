import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Award, Download, Eye, CheckCircle, BookOpen } from 'lucide-react';
import axios from 'axios';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    const token = localStorage.getItem('token');

    if (!userData || !token) {
      navigate('/login');
      return;
    }

    const parsedUser = JSON.parse(userData);
    if (parsedUser.role !== 'Student') {
      navigate('/login');
      return;
    }

    setUser(parsedUser);
    fetchMyCertificates();
  }, [navigate]);

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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
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
    </div>
  );
};

export default StudentDashboard;

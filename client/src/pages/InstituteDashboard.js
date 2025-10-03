import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, LogOut, Award, Users, FileText, Plus, Eye, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';
import '../styles/InstituteDashboard.css';

const InstituteDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'Institute') {
      navigate('/login');
      return;
    }

    fetchCertificates();
  }, [navigate, isAuthenticated, user]);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get('/api/certificates');
      setCertificates(response.data.certificates || []);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <div className="loading">Loading...</div>;

  return (
    <div className="institute-dashboard">
      <nav className="dashboard-navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Shield className="logo-icon" />
            <span className="logo-text">Certify Institute</span>
          </div>
          <div className="nav-actions">
            <LanguageSwitcher />
            <span className="user-info">{user.organization || user.email}</span>
            <button onClick={() => navigate('/profile')} className="btn-profile">
              <UserCircle size={20} />
              {t('nav.profile')}
            </button>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={20} />
              {t('nav.logout')}
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>{t('dashboard.welcome')}, {user.full_name || 'Institute'}</h1>
          <p>Manage your institution's certificates</p>
        </div>

        <div className="stats-row">
          <div className="stat-box">
            <Award size={32} />
            <div>
              <h3>{certificates.length}</h3>
              <p>{t('dashboard.certificatesIssued')}</p>
            </div>
          </div>
          <div className="stat-box">
            <Users size={32} />
            <div>
              <h3>{new Set(certificates.map(c => c.learnerName)).size}</h3>
              <p>Total Students</p>
            </div>
          </div>
        </div>

        <div className="action-cards">
          <div className="action-card primary" onClick={() => navigate('/issue')}>
            <Plus size={48} />
            <h3>{t('nav.issueCertificate')}</h3>
            <p>Issue a blockchain-verified certificate</p>
          </div>

          <div className="action-card secondary" onClick={() => navigate('/dashboard')}>
            <FileText size={48} />
            <h3>{t('dashboard.viewAll')}</h3>
            <p>Browse and manage issued certificates</p>
          </div>

          <div className="action-card tertiary" onClick={() => navigate('/verify')}>
            <Eye size={48} />
            <h3>{t('verify.title')}</h3>
            <p>Verify any certificate authenticity</p>
          </div>
        </div>

        <div className="recent-certificates">
          <h2>Recently Issued Certificates</h2>
          <div className="certificates-list">
            {certificates.slice(0, 5).map(cert => (
              <div key={cert.id} className="cert-item" onClick={() => navigate(`/certificate/${cert.id}`)}>
                <div className="cert-icon">
                  <Award size={24} />
                </div>
                <div className="cert-details">
                  <h4>{cert.learnerName}</h4>
                  <p>{cert.courseName}</p>
                  <span className="cert-date">{new Date(cert.issueDate).toLocaleDateString()}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstituteDashboard;

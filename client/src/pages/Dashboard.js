import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, ArrowLeft, Award, Search, Calendar, Building2 } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';
import '../styles/Dashboard.css';

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchCertificates();
  }, []);

  const fetchCertificates = async () => {
    try {
      const response = await axios.get('/api/certificates');
      setCertificates(response.data.certificates);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredCertificates = certificates.filter(cert =>
    cert.learnerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cert.instituteName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="dashboard-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <Shield className="logo-icon" />
            <span className="logo-text">Certify</span>
          </div>
          <div className="nav-actions">
            <LanguageSwitcher />
            <button onClick={() => navigate('/issue')} className="btn-primary">
              <Award size={18} />
              {t('nav.issueCertificate')}
            </button>
            <button onClick={() => navigate('/')} className="btn-back">
              <ArrowLeft size={20} />
              {t('common.back')}
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-container">
        <div className="dashboard-header">
          <h1>{t('dashboard.certificatesDashboard') || 'Certificate Dashboard'}</h1>
          <p>{t('dashboard.manageCertificates') || 'Manage and view all issued certificates'}</p>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Award />
            </div>
            <div className="stat-content">
              <span className="stat-number">{certificates.length}</span>
              <span className="stat-label">{t('dashboard.totalCertificates')}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">
              <Shield />
            </div>
            <div className="stat-content">
              <span className="stat-number">100%</span>
              <span className="stat-label">{t('dashboard.verified')}</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon purple">
              <Building2 />
            </div>
            <div className="stat-content">
              <span className="stat-number">{new Set(certificates.map(c => c.instituteName)).size}</span>
              <span className="stat-label">{t('dashboard.totalInstitutes')}</span>
            </div>
          </div>
        </div>

        <div className="search-section">
          <div className="search-bar">
            <Search className="search-icon" size={20} />
            <input
              type="text"
              placeholder={t('dashboard.searchPlaceholder') || 'Search by learner, course, or institute...'}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <div className="loader"></div>
            <p>{t('common.loading')}</p>
          </div>
        ) : filteredCertificates.length === 0 ? (
          <div className="empty-state">
            <Award size={64} />
            <h3>{t('dashboard.noCertificates')}</h3>
            <p>
              {searchTerm 
                ? t('dashboard.adjustSearch') || 'Try adjusting your search terms'
                : t('dashboard.startIssuing') || 'Start by issuing your first certificate'}
            </p>
            {!searchTerm && (
              <button onClick={() => navigate('/issue')} className="btn-issue">
                {t('nav.issueCertificate')}
              </button>
            )}
          </div>
        ) : (
          <div className="certificates-table">
            <table>
              <thead>
                <tr>
                  <th>{t('dashboard.learnerName')}</th>
                  <th>{t('dashboard.courseName')}</th>
                  <th>{t('dashboard.instituteName')}</th>
                  <th>{t('dashboard.issuedDate')}</th>
                  <th>{t('dashboard.actions')}</th>
                </tr>
              </thead>
              <tbody>
                {filteredCertificates.map((cert) => (
                  <tr key={cert.id}>
                    <td>
                      <div className="learner-cell">
                        <div className="learner-avatar">
                          {cert.learnerName.charAt(0).toUpperCase()}
                        </div>
                        <span className="learner-name">{cert.learnerName}</span>
                      </div>
                    </td>
                    <td>{cert.courseName}</td>
                    <td>{cert.instituteName}</td>
                    <td>
                      {new Date(cert.issueDate).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td>
                      <button
                        onClick={() => navigate(`/certificate/${cert.id}`)}
                        className="btn-view-cert"
                      >
                        {t('dashboard.view')}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;

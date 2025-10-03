import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, LogOut, Search, Award, Eye, Users, Building, CheckCircle, UserCircle, BookOpen, Download, Filter, Briefcase } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';
import CompanyJobManagement from '../components/CompanyJobManagement';
import '../styles/CompanyDashboard.css';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [verificationResult, setVerificationResult] = useState(null);
  const [verifiedCount, setVerifiedCount] = useState(0);
  const [selectedCourse, setSelectedCourse] = useState('');
  const [courses, setCourses] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('verify'); // 'verify' or 'browse'

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'Company') {
      navigate('/login');
      return;
    }
    fetchCourses();
  }, [navigate, isAuthenticated, user]);

  const fetchCourses = async () => {
    try {
      const response = await axios.get('/api/certificates');
      const allCertificates = response.data.certificates || [];
      
      // Extract unique courses
      const uniqueCourses = [...new Set(allCertificates.map(cert => cert.courseName))];
      setCourses(uniqueCourses.sort());
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const fetchStudentsByCourse = async (courseName) => {
    if (!courseName) {
      setStudents([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get('/api/certificates');
      const allCertificates = response.data.certificates || [];
      
      // Filter certificates by selected course
      const filteredCerts = allCertificates.filter(
        cert => cert.courseName === courseName
      );
      
      setStudents(filteredCerts);
    } catch (error) {
      console.error('Error fetching students:', error);
      setStudents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleCourseSelect = (e) => {
    const course = e.target.value;
    setSelectedCourse(course);
    fetchStudentsByCourse(course);
  };

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
            <nav className="company-navbar">
        <div className="company-nav-brand" onClick={() => navigate('/')}>
          <Shield className="company-brand-icon" />
          <span className="company-brand-text">Certify</span>
        </div>
        <div className="company-nav-right">
          <LanguageSwitcher />
          <button
            className="company-profile-btn"
            onClick={() => navigate('/profile')}
          >
            <UserCircle size={20} />
            {t('nav.profile')}
          </button>
          <button
            className="company-logout-btn"
            onClick={logout}
          >
            <LogOut size={20} />
            {t('nav.logout')}
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <Building size={48} className="company-icon" />
          <h1>{t('companyDashboard.welcome')}, {user.organization || user.full_name}</h1>
          <p>{t('companyDashboard.subtitle')}</p>
        </div>

        <div className="stats-bar">
          <div className="stat-item">
            <CheckCircle size={24} />
            <div>
              <h3>{verifiedCount}</h3>
              <p>{t('companyDashboard.certificatesVerified')}</p>
            </div>
          </div>
          <div className="stat-item">
            <Award size={24} />
            <div>
              <h3>100%</h3>
              <p>{t('companyDashboard.verificationAccuracy')}</p>
            </div>
          </div>
          <div className="stat-item">
            <BookOpen size={24} />
            <div>
              <h3>{courses.length}</h3>
              <p>{t('companyDashboard.availableCourses')}</p>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="tab-navigation">
          <button 
            className={`tab-btn ${activeTab === 'verify' ? 'active' : ''}`}
            onClick={() => setActiveTab('verify')}
          >
            <Search size={20} />
            {t('companyDashboard.verifyCertificate')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            <Filter size={20} />
            {t('companyDashboard.browseByCourse')}
          </button>
          <button 
            className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase size={20} />
            Job Portal
          </button>
        </div>

        {/* Verify Certificate Tab */}
        {activeTab === 'verify' && (
          <div className="verification-section">
            <div className="verification-card">
              <h2>{t('companyDashboard.verifyCandidateCertificates')}</h2>
              <p>{t('companyDashboard.enterCertificateIdOrHash')}</p>
              
              <form onSubmit={handleVerify} className="verify-form">
                <div className="search-input-group">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder={t('companyDashboard.placeholderCertificateId')}
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="search-input"
                  />
                  <button type="submit" className="btn-verify">
                    {t('companyDashboard.verify')}
                  </button>
                </div>
              </form>

              {verificationResult && (
                <div className={`verification-result ${verificationResult.valid ? 'valid' : 'invalid'}`}>
                  {verificationResult.valid ? (
                    <>
                      <CheckCircle size={48} />
                      <h3>{t('companyDashboard.certificateVerified')}</h3>
                      {verificationResult.certificate && (
                        <div className="result-details">
                          <p><strong>{t('companyDashboard.learner')}:</strong> {verificationResult.certificate.learnerName}</p>
                          <p><strong>{t('companyDashboard.course')}:</strong> {verificationResult.certificate.courseName}</p>
                          <p><strong>{t('companyDashboard.institute')}:</strong> {verificationResult.certificate.instituteName}</p>
                          <p><strong>{t('companyDashboard.issueDate')}:</strong> {new Date(verificationResult.certificate.issueDate).toLocaleDateString()}</p>
                          <button 
                            className="btn-view-cert"
                            onClick={() => navigate(`/certificate/${verificationResult.certificate.id}`)}
                          >
                            <Eye size={16} />
                            {t('companyDashboard.viewFullCertificate')}
                          </button>
                        </div>
                      )}
                    </>
                  ) : (
                    <>
                      <div className="invalid-icon">✗</div>
                      <h3>{t('companyDashboard.certificateNotValid')}</h3>
                      <p>{verificationResult.message}</p>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="info-cards">
              <div className="info-card">
                <Shield size={32} />
                <h3>{t('companyDashboard.blockchainSecurity')}</h3>
                <p>{t('companyDashboard.blockchainSecurityDesc')}</p>
              </div>

              <div className="info-card">
                <Users size={32} />
                <h3>{t('companyDashboard.instantVerification')}</h3>
                <p>{t('companyDashboard.instantVerificationDesc')}</p>
              </div>

              <div className="info-card">
                <Award size={32} />
                <h3>{t('companyDashboard.trustedNetwork')}</h3>
                <p>{t('companyDashboard.trustedNetworkDesc')}</p>
              </div>
            </div>
          </div>
        )}

        {/* Browse by Course Tab */}
        {activeTab === 'browse' && (
          <div className="browse-section">
            <div className="course-filter-card">
              <h2>{t('companyDashboard.browseStudentsByCourse')}</h2>
              <p>{t('companyDashboard.selectCourseToView')}</p>
              
              <div className="course-select-group">
                <BookOpen size={20} />
                <select 
                  value={selectedCourse} 
                  onChange={handleCourseSelect}
                  className="course-select"
                >
                  <option value="">{t('companyDashboard.selectACourse')}</option>
                  {courses.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
              </div>

              {loading && (
                <div className="loading-state">
                  <div className="loader"></div>
                  <p>{t('companyDashboard.loadingStudents')}</p>
                </div>
              )}

              {!loading && selectedCourse && students.length === 0 && (
                <div className="empty-state">
                  <Award size={64} />
                  <h3>{t('companyDashboard.noStudentsFound')}</h3>
                  <p>{t('companyDashboard.noCertificatesForCourse')}</p>
                </div>
              )}

              {!loading && students.length > 0 && (
                <div className="students-results">
                  <h3>{t('companyDashboard.studentsWhoCompleted')}: {selectedCourse}</h3>
                  <p className="results-count">{students.length} {students.length !== 1 ? t('companyDashboard.studentsFound') : t('companyDashboard.studentFound')}</p>
                  
                  <div className="students-grid">
                    {students.map((cert) => (
                      <div key={cert.id} className="student-card">
                        <div className="student-header">
                          <div className="student-avatar">
                            {cert.learnerName.charAt(0).toUpperCase()}
                          </div>
                          <div className="student-info">
                            <h4>{cert.learnerName}</h4>
                            {cert.learnerEmail && (
                              <p className="student-email">{cert.learnerEmail}</p>
                            )}
                          </div>
                          <div className="verified-badge-small">
                            <CheckCircle size={16} />
                          </div>
                        </div>
                        
                        <div className="certificate-info">
                          <p className="info-row">
                            <span className="info-label">Institute:</span>
                            <span className="info-value">{cert.instituteName}</span>
                          </p>
                          <p className="info-row">
                            <span className="info-label">Issue Date:</span>
                            <span className="info-value">
                              {new Date(cert.issueDate).toLocaleDateString('en-US', {
                                year: 'numeric',
                                month: 'short',
                                day: 'numeric'
                              })}
                            </span>
                          </p>
                          <p className="info-row">
                            <span className="info-label">Certificate ID:</span>
                            <span className="info-value cert-id">{cert.id.substring(0, 20)}...</span>
                          </p>
                        </div>

                        <div className="student-actions">
                          <button 
                            className="btn-view-student"
                            onClick={() => navigate(`/certificate/${cert.id}`)}
                          >
                            <Eye size={16} />
                            {t('companyDashboard.viewCertificate')}
                          </button>
                          <button 
                            className="btn-download-student"
                            onClick={() => window.open(cert.pdfUrl, '_blank')}
                          >
                            <Download size={16} />
                            {t('companyDashboard.download')}
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Job Portal Tab */}
        {activeTab === 'jobs' && (
          <CompanyJobManagement />
        )}
      </div>
    </div>
  );
};

export default CompanyDashboard;

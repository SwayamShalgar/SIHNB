import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Search, Award, Eye, Users, Building, CheckCircle, UserCircle, BookOpen, Download, Filter } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/CompanyDashboard.css';

const CompanyDashboard = () => {
  const navigate = useNavigate();
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
          <div className="stat-item">
            <BookOpen size={24} />
            <div>
              <h3>{courses.length}</h3>
              <p>Available Courses</p>
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
            Verify Certificate
          </button>
          <button 
            className={`tab-btn ${activeTab === 'browse' ? 'active' : ''}`}
            onClick={() => setActiveTab('browse')}
          >
            <Filter size={20} />
            Browse by Course
          </button>
        </div>

        {/* Verify Certificate Tab */}
        {activeTab === 'verify' && (
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
                <p>All certificates are verified on the Ethereum blockchain ensuring tamper-proof records</p>
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
        )}

        {/* Browse by Course Tab */}
        {activeTab === 'browse' && (
          <div className="browse-section">
            <div className="course-filter-card">
              <h2>Browse Students by Course</h2>
              <p>Select a course to view all students who have completed it</p>
              
              <div className="course-select-group">
                <BookOpen size={20} />
                <select 
                  value={selectedCourse} 
                  onChange={handleCourseSelect}
                  className="course-select"
                >
                  <option value="">Select a course...</option>
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
                  <p>Loading students...</p>
                </div>
              )}

              {!loading && selectedCourse && students.length === 0 && (
                <div className="empty-state">
                  <Award size={64} />
                  <h3>No Students Found</h3>
                  <p>No certificates found for this course</p>
                </div>
              )}

              {!loading && students.length > 0 && (
                <div className="students-results">
                  <h3>Students who completed: {selectedCourse}</h3>
                  <p className="results-count">{students.length} student{students.length !== 1 ? 's' : ''} found</p>
                  
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
                            View Certificate
                          </button>
                          <button 
                            className="btn-download-student"
                            onClick={() => window.open(cert.pdfUrl, '_blank')}
                          >
                            <Download size={16} />
                            Download
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
      </div>
    </div>
  );
};

export default CompanyDashboard;

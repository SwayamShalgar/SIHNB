import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, LogOut, Award, Download, Eye, CheckCircle, BookOpen, Plus, X, UserCircle, Briefcase, Send, EyeOff, MapPin, DollarSign, Clock, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';
import '../styles/StudentDashboard.css';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [certificates, setCertificates] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [certificateId, setCertificateId] = useState('');
  const [addStatus, setAddStatus] = useState({ type: '', message: '' });
  
  // Job Portal States
  const [activeTab, setActiveTab] = useState('certificates');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [profile, setProfile] = useState(null);
  const [stats, setStats] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showApplyModal, setShowApplyModal] = useState(false);
  const [coverLetter, setCoverLetter] = useState('');
  const [jobSearch, setJobSearch] = useState('');
  const [jobLocation, setJobLocation] = useState('');

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'Student') {
      navigate('/login');
      return;
    }

    fetchMyCertificates();
    fetchStudentProfile();
    fetchStudentStats();
    if (activeTab === 'jobs') fetchJobs();
    if (activeTab === 'applications') fetchApplications();
    if (activeTab === 'offers') fetchOffers();

    // Auto-refresh applications and offers every 30 seconds
    let interval;
    if (activeTab === 'applications' || activeTab === 'offers') {
      interval = setInterval(() => {
        if (activeTab === 'applications') fetchApplications();
        if (activeTab === 'offers') fetchOffers();
      }, 30000); // 30 seconds
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [navigate, isAuthenticated, user, activeTab]);

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

  const fetchStudentProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProfile(response.data.profile);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const fetchStudentStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/students/stats', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStats(response.data.stats);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (jobSearch) params.append('search', jobSearch);
      if (jobLocation) params.append('location', jobLocation);
      
      const response = await axios.get(`/api/jobs/postings?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplications = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/jobs/my-applications', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data.applications);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/jobs/my-offers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOffers(response.data.offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handleApplyJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post(`/api/jobs/apply/${selectedJob.id}`, 
        { cover_letter: coverLetter },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowApplyModal(false);
      setCoverLetter('');
      setSelectedJob(null);
      setAddStatus({ type: 'success', message: 'Application submitted successfully!' });
      fetchApplications();
    } catch (error) {
      setAddStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to submit application' 
      });
    }
  };

  const toggleVisibility = async () => {
    try {
      const token = localStorage.getItem('token');
      const newVisibility = !profile?.visible_to_companies;
      await axios.patch('/api/students/visibility', 
        { visible: newVisibility },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      fetchStudentProfile();
      setAddStatus({ 
        type: 'success', 
        message: `Profile ${newVisibility ? 'visible' : 'hidden'} to companies` 
      });
    } catch (error) {
      setAddStatus({ type: 'error', message: 'Failed to update visibility' });
    }
  };

  const respondToOffer = async (offerId, status) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/jobs/offers/${offerId}/respond`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Refresh all data immediately to update UI
      await Promise.all([
        fetchOffers(),
        fetchApplications(),
        fetchJobs(),
        fetchStudentStats()
      ]);
      setAddStatus({ 
        type: 'success', 
        message: `Offer ${status} successfully!` 
      });
      // Auto-dismiss success message after 3 seconds
      setTimeout(() => setAddStatus({ type: '', message: '' }), 3000);
    } catch (error) {
      setAddStatus({ type: 'error', message: 'Failed to respond to offer' });
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
          <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Shield className="logo-icon" />
            <span className="logo-text">Certify Student</span>
          </div>
          <div className="nav-actions">
            <LanguageSwitcher />
            <span className="user-info">{user.full_name || user.email}</span>
            <button onClick={() => navigate('/profile')} className="btn-profile">
              <UserCircle size={20} />
              {t('nav.profile')}
            </button>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={20} />
              {t('nav.logout')}
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

        {/* Tabs */}
        <div className="dashboard-tabs">
          <button 
            className={`tab-btn ${activeTab === 'certificates' ? 'active' : ''}`}
            onClick={() => setActiveTab('certificates')}
          >
            <Award size={20} />
            Certificates
          </button>
          <button 
            className={`tab-btn ${activeTab === 'jobs' ? 'active' : ''}`}
            onClick={() => setActiveTab('jobs')}
          >
            <Briefcase size={20} />
            Job Openings
          </button>
          <button 
            className={`tab-btn ${activeTab === 'applications' ? 'active' : ''}`}
            onClick={() => setActiveTab('applications')}
          >
            <Send size={20} />
            My Applications
          </button>
          <button 
            className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
            onClick={() => setActiveTab('offers')}
          >
            <CheckCircle size={20} />
            Job Offers
          </button>
        </div>

        {addStatus.message && (
          <div className={`status-banner ${addStatus.type}`}>
            {addStatus.message}
          </div>
        )}

        {/* Certificates Tab */}
        {activeTab === 'certificates' && (
          <>
            <div className="quick-actions">
              <button className="action-btn primary" onClick={() => setShowAddModal(true)}>
                <Plus size={20} />
                Add Certificate
              </button>
              <button className="action-btn" onClick={() => navigate('/verify')}>
                <Eye size={20} />
                Verify Certificate
              </button>
            </div>
          </>
        )}

        {/* Certificates Content */}
        {activeTab === 'certificates' && (
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
        )}

        {/* Jobs Tab */}
        {activeTab === 'jobs' && (
          <div className="jobs-section">
            <div className="section-header">
              <h2>Job Openings</h2>
              <button 
                className={`visibility-toggle ${profile?.visible_to_companies ? 'visible' : 'hidden'}`}
                onClick={toggleVisibility}
              >
                {profile?.visible_to_companies ? <Eye size={16} /> : <EyeOff size={16} />}
                {profile?.visible_to_companies ? 'Visible to Companies' : 'Hidden from Companies'}
              </button>
            </div>

            <div className="job-filters">
              <input
                type="text"
                placeholder="Search jobs..."
                value={jobSearch}
                onChange={(e) => setJobSearch(e.target.value)}
                className="search-input"
              />
              <input
                type="text"
                placeholder="Location"
                value={jobLocation}
                onChange={(e) => setJobLocation(e.target.value)}
                className="search-input"
              />
              <button onClick={fetchJobs} className="btn-search">Search</button>
            </div>

            {jobs.length === 0 ? (
              <div className="empty-state">
                <Briefcase size={64} />
                <h3>No Jobs Available</h3>
                <p>Check back later for new opportunities</p>
              </div>
            ) : (
              <div className="jobs-grid">
                {jobs.map(job => (
                  <div key={job.id} className="job-card">
                    <div className="job-header">
                      <h3>{job.job_title}</h3>
                      <span className="company-name">{job.company_name}</span>
                    </div>
                    <div className="job-details">
                      {job.location && (
                        <div className="detail-item">
                          <MapPin size={16} />
                          <span>{job.location}</span>
                        </div>
                      )}
                      {job.job_type && (
                        <div className="detail-item">
                          <Briefcase size={16} />
                          <span>{job.job_type}</span>
                        </div>
                      )}
                      {job.salary_range && (
                        <div className="detail-item">
                          <DollarSign size={16} />
                          <span>{job.salary_range}</span>
                        </div>
                      )}
                      <div className="detail-item">
                        <Clock size={16} />
                        <span>Deadline: {new Date(job.application_deadline).toLocaleDateString()}</span>
                      </div>
                    </div>
                    {job.required_skills && job.required_skills.length > 0 && (
                      <div className="job-skills">
                        {job.required_skills.slice(0, 3).map((skill, idx) => (
                          <span key={idx} className="skill-tag">{skill}</span>
                        ))}
                        {job.required_skills.length > 3 && (
                          <span className="skill-tag">+{job.required_skills.length - 3} more</span>
                        )}
                      </div>
                    )}
                    <button 
                      className="btn-apply"
                      onClick={() => {
                        setSelectedJob(job);
                        setShowApplyModal(true);
                      }}
                    >
                      <Send size={16} />
                      Apply Now
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Applications Tab */}
        {activeTab === 'applications' && (
          <div className="applications-section">
            <h2>My Applications</h2>
            {applications.filter(app => app.status !== 'closed').length === 0 ? (
              <div className="empty-state">
                <Send size={64} />
                <h3>No Applications</h3>
                <p>Start applying to jobs to see them here</p>
              </div>
            ) : (
              <div className="applications-list">
                {applications.map(app => {
                  // Hide only closed applications (job filled by someone else)
                  if (app.status === 'closed') {
                    return null;
                  }
                  
                  return (
                    <div key={app.id} className="application-card">
                      <div className="app-header">
                        <div>
                          <h3>{app.job_title}</h3>
                          <p className="company-name">{app.company_name}</p>
                        </div>
                        <span className={`status-badge ${app.status}`}>
                          {app.status}
                        </span>
                      </div>
                      <div className="app-details">
                        <div className="detail-row">
                          <span className="label">Applied on:</span>
                          <span>{new Date(app.applied_at).toLocaleDateString()}</span>
                        </div>
                        {app.location && (
                          <div className="detail-row">
                            <span className="label">Location:</span>
                            <span>{app.location}</span>
                          </div>
                        )}
                        {app.salary_range && (
                          <div className="detail-row">
                            <span className="label">Salary:</span>
                            <span>{app.salary_range}</span>
                          </div>
                        )}
                      </div>
                      {app.status === 'accepted' && (
                        <div className="application-accepted-message">
                          <CheckCircle size={20} />
                          <strong>Congratulations! You got this job! Check Job Offers tab for details.</strong>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}

        {/* Offers Tab */}
        {activeTab === 'offers' && (
          <div className="offers-section">
            <h2>Job Offers</h2>
            {offers.length === 0 ? (
              <div className="empty-state">
                <CheckCircle size={64} />
                <h3>No Offers Yet</h3>
                <p>Job offers from companies will appear here</p>
              </div>
            ) : (
              <div className="offers-list">
                {offers.map(offer => (
                  <div key={offer.id} className={`offer-card ${offer.status}`}>
                    <div className="offer-header">
                      <div>
                        <h3>{offer.job_title}</h3>
                        <p className="company-name">{offer.company_name}</p>
                      </div>
                      <span className={`status-badge ${offer.status}`}>
                        {offer.status}
                      </span>
                    </div>
                    <div className="offer-details">
                      <div className="detail-row">
                        <span className="label">Salary Offered:</span>
                        <strong>{offer.salary_offered}</strong>
                      </div>
                      {offer.joining_date && (
                        <div className="detail-row">
                          <span className="label">Joining Date:</span>
                          <span>{new Date(offer.joining_date).toLocaleDateString()}</span>
                        </div>
                      )}
                      <div className="detail-row">
                        <span className="label">Location:</span>
                        <span>{offer.location}</span>
                      </div>
                    </div>
                    {offer.offer_letter && (
                      <div className="offer-letter">
                        <p>{offer.offer_letter}</p>
                      </div>
                    )}
                    {offer.status === 'pending' && (
                      <div className="offer-actions">
                        <button 
                          className="btn-accept"
                          onClick={() => respondToOffer(offer.id, 'accepted')}
                        >
                          <CheckCircle size={16} />
                          Accept Offer
                        </button>
                        <button 
                          className="btn-reject"
                          onClick={() => respondToOffer(offer.id, 'rejected')}
                        >
                          <X size={16} />
                          Decline
                        </button>
                      </div>
                    )}
                    {offer.status === 'accepted' && (
                      <div className="offer-accepted-message">
                        <CheckCircle size={20} />
                        <strong>Congratulations! You accepted this offer.</strong>
                      </div>
                    )}
                    {offer.status === 'rejected' && (
                      <div className="offer-rejected-message">
                        <X size={20} />
                        <span>You declined this offer.</span>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Apply Job Modal */}
      {showApplyModal && selectedJob && (
        <div className="modal-overlay" onClick={() => setShowApplyModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Apply for {selectedJob.job_title}</h2>
              <button className="btn-close" onClick={() => setShowApplyModal(false)}>
                <X size={24} />
              </button>
            </div>
            
            <div className="job-info">
              <p><strong>{selectedJob.company_name}</strong></p>
              <p>{selectedJob.location} • {selectedJob.job_type}</p>
            </div>

            <form onSubmit={handleApplyJob} className="apply-form">
              <div className="form-group">
                <label htmlFor="coverLetter">Cover Letter *</label>
                <textarea
                  id="coverLetter"
                  value={coverLetter}
                  onChange={(e) => setCoverLetter(e.target.value)}
                  placeholder="Tell us why you're a great fit for this position..."
                  className="form-textarea"
                  rows="6"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowApplyModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Send size={20} />
                  Submit Application
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

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

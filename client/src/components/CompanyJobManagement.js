import React, { useState, useEffect } from 'react';
import { Briefcase, Plus, Edit, Trash2, Users, Send, Eye, Filter, Search, X, Calendar, MapPin, DollarSign } from 'lucide-react';
import axios from 'axios';
import '../styles/CompanyJobManagement.css';

const CompanyJobManagement = () => {
  const [activeTab, setActiveTab] = useState('postings');
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [offers, setOffers] = useState([]);
  const [candidates, setCandidates] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showPostModal, setShowPostModal] = useState(false);
  const [showOfferModal, setShowOfferModal] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const [status, setStatus] = useState({ type: '', message: '' });

  // Form States
  const [jobForm, setJobForm] = useState({
    job_title: '',
    job_description: '',
    job_type: 'Full-Time',
    location: '',
    salary_range: '',
    required_skills: '',
    min_cgpa: '',
    experience_required: '',
    application_deadline: ''
  });

  const [offerForm, setOfferForm] = useState({
    offer_letter: '',
    salary_offered: '',
    joining_date: ''
  });

  const [searchFilters, setSearchFilters] = useState({
    skills: '',
    minCgpa: '',
    graduationYear: '',
    degree: '',
    hasCertificates: false
  });

  useEffect(() => {
    if (activeTab === 'postings') fetchJobs();
    if (activeTab === 'candidates') fetchCandidates();
    if (activeTab === 'offers') fetchOffers();
  }, [activeTab]);

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/jobs/my-postings', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setJobs(response.data.jobs);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    }
  };

  const fetchApplicationsForJob = async (jobId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get(`/api/jobs/postings/${jobId}/applications`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setApplications(response.data.applications);
      setSelectedJob(jobId);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const fetchCandidates = async () => {
    try {
      const token = localStorage.getItem('token');
      const params = new URLSearchParams();
      if (searchFilters.skills) params.append('skills', searchFilters.skills);
      if (searchFilters.minCgpa) params.append('minCgpa', searchFilters.minCgpa);
      if (searchFilters.graduationYear) params.append('graduationYear', searchFilters.graduationYear);
      if (searchFilters.degree) params.append('degree', searchFilters.degree);
      if (searchFilters.hasCertificates) params.append('hasCertificates', 'true');

      const response = await axios.get(`/api/jobs/candidates/search?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setCandidates(response.data.candidates);
    } catch (error) {
      console.error('Error fetching candidates:', error);
    }
  };

  const fetchOffers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/jobs/company-offers', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOffers(response.data.offers);
    } catch (error) {
      console.error('Error fetching offers:', error);
    }
  };

  const handlePostJob = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      const jobData = {
        ...jobForm,
        required_skills: jobForm.required_skills.split(',').map(s => s.trim()).filter(s => s),
        min_cgpa: jobForm.min_cgpa ? parseFloat(jobForm.min_cgpa) : null
      };

      await axios.post('/api/jobs/postings', jobData, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setStatus({ type: 'success', message: 'Job posted successfully!' });
      setShowPostModal(false);
      resetJobForm();
      fetchJobs();
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to post job' 
      });
    }
  };

  const handleDeleteJob = async (jobId) => {
    if (!window.confirm('Are you sure you want to delete this job posting?')) return;

    try {
      const token = localStorage.getItem('token');
      await axios.delete(`/api/jobs/postings/${jobId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setStatus({ type: 'success', message: 'Job deleted successfully!' });
      fetchJobs();
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to delete job' });
    }
  };

  const handleUpdateApplicationStatus = async (appId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      await axios.patch(`/api/jobs/applications/${appId}/status`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus({ type: 'success', message: 'Application status updated!' });
      if (selectedJob) fetchApplicationsForJob(selectedJob);
    } catch (error) {
      setStatus({ type: 'error', message: 'Failed to update status' });
    }
  };

  const handleSendOffer = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('token');
      await axios.post('/api/jobs/offers/send', 
        {
          job_id: selectedJob,
          student_id: selectedCandidate,
          ...offerForm
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setStatus({ type: 'success', message: 'Job offer sent successfully!' });
      setShowOfferModal(false);
      resetOfferForm();
      fetchOffers();
    } catch (error) {
      setStatus({ 
        type: 'error', 
        message: error.response?.data?.error || 'Failed to send offer' 
      });
    }
  };

  const resetJobForm = () => {
    setJobForm({
      job_title: '',
      job_description: '',
      job_type: 'Full-Time',
      location: '',
      salary_range: '',
      required_skills: '',
      min_cgpa: '',
      experience_required: '',
      application_deadline: ''
    });
  };

  const resetOfferForm = () => {
    setOfferForm({
      offer_letter: '',
      salary_offered: '',
      joining_date: ''
    });
    setSelectedCandidate(null);
  };

  return (
    <div className="job-management">
      <div className="job-tabs">
        <button 
          className={`tab-btn ${activeTab === 'postings' ? 'active' : ''}`}
          onClick={() => setActiveTab('postings')}
        >
          <Briefcase size={20} />
          My Job Postings
        </button>
        <button 
          className={`tab-btn ${activeTab === 'candidates' ? 'active' : ''}`}
          onClick={() => setActiveTab('candidates')}
        >
          <Users size={20} />
          Find Candidates
        </button>
        <button 
          className={`tab-btn ${activeTab === 'offers' ? 'active' : ''}`}
          onClick={() => setActiveTab('offers')}
        >
          <Send size={20} />
          Sent Offers
        </button>
      </div>

      {status.message && (
        <div className={`status-banner ${status.type}`}>
          {status.message}
          <button onClick={() => setStatus({ type: '', message: '' })}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Job Postings Tab */}
      {activeTab === 'postings' && (
        <div className="postings-section">
          <div className="section-header">
            <h2>My Job Postings</h2>
            <button className="btn-post-job" onClick={() => setShowPostModal(true)}>
              <Plus size={20} />
              Post New Job
            </button>
          </div>

          {jobs.length === 0 ? (
            <div className="empty-state">
              <Briefcase size={64} />
              <h3>No Job Postings Yet</h3>
              <p>Create your first job posting to start receiving applications</p>
            </div>
          ) : (
            <div className="jobs-list">
              {jobs.map(job => (
                <div key={job.id} className="job-posting-card">
                  <div className="job-card-header">
                    <div>
                      <h3>{job.job_title}</h3>
                      <div className="job-meta">
                        <span className="meta-item">
                          <MapPin size={14} />
                          {job.location}
                        </span>
                        <span className="meta-item">
                          <Calendar size={14} />
                          Deadline: {new Date(job.application_deadline).toLocaleDateString()}
                        </span>
                        <span className={`status-badge ${job.status}`}>
                          {job.status}
                        </span>
                      </div>
                    </div>
                    <div className="job-actions">
                      <button 
                        className="btn-icon"
                        onClick={() => fetchApplicationsForJob(job.id)}
                        title="View Applications"
                      >
                        <Users size={18} />
                        <span className="badge">{job.application_count || 0}</span>
                      </button>
                      <button 
                        className="btn-icon"
                        onClick={() => handleDeleteJob(job.id)}
                        title="Delete Job"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                  
                  <p className="job-description">{job.job_description}</p>
                  
                  {job.required_skills && job.required_skills.length > 0 && (
                    <div className="job-skills">
                      {job.required_skills.map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}

                  {selectedJob === job.id && applications.length > 0 && (
                    <div className="applications-dropdown">
                      <h4>Applications ({applications.length})</h4>
                      <div className="applications-list">
                        {applications.map(app => (
                          <div key={app.id} className="application-item">
                            <div className="applicant-info">
                              <strong>{app.student_name}</strong>
                              <span>{app.student_email}</span>
                              {app.cgpa && <span>CGPA: {app.cgpa}</span>}
                              {app.certificates_count > 0 && (
                                <span>{app.certificates_count} certificates</span>
                              )}
                            </div>
                            <div className="app-actions">
                              <select
                                value={app.status}
                                onChange={(e) => handleUpdateApplicationStatus(app.id, e.target.value)}
                                className="status-select"
                              >
                                <option value="pending">Pending</option>
                                <option value="shortlisted">Shortlisted</option>
                                <option value="interviewing">Interviewing</option>
                                <option value="rejected">Rejected</option>
                              </select>
                              <button
                                className="btn-send-offer"
                                onClick={() => {
                                  setSelectedCandidate(app.student_id);
                                  setShowOfferModal(true);
                                }}
                              >
                                <Send size={14} />
                                Send Offer
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Candidates Tab */}
      {activeTab === 'candidates' && (
        <div className="candidates-section">
          <h2>Find Candidates</h2>
          
          <div className="search-filters">
            <div className="filter-grid">
              <input
                type="text"
                placeholder="Skills (comma separated)"
                value={searchFilters.skills}
                onChange={(e) => setSearchFilters({ ...searchFilters, skills: e.target.value })}
                className="filter-input"
              />
              <input
                type="number"
                placeholder="Min CGPA"
                value={searchFilters.minCgpa}
                onChange={(e) => setSearchFilters({ ...searchFilters, minCgpa: e.target.value })}
                className="filter-input"
                step="0.1"
                min="0"
                max="10"
              />
              <input
                type="number"
                placeholder="Graduation Year"
                value={searchFilters.graduationYear}
                onChange={(e) => setSearchFilters({ ...searchFilters, graduationYear: e.target.value })}
                className="filter-input"
              />
              <input
                type="text"
                placeholder="Degree"
                value={searchFilters.degree}
                onChange={(e) => setSearchFilters({ ...searchFilters, degree: e.target.value })}
                className="filter-input"
              />
              <label className="checkbox-filter">
                <input
                  type="checkbox"
                  checked={searchFilters.hasCertificates}
                  onChange={(e) => setSearchFilters({ ...searchFilters, hasCertificates: e.target.checked })}
                />
                Has Certificates
              </label>
            </div>
            <button className="btn-search" onClick={fetchCandidates}>
              <Search size={18} />
              Search Candidates
            </button>
          </div>

          {candidates.length === 0 ? (
            <div className="empty-state">
              <Users size={64} />
              <h3>No Candidates Found</h3>
              <p>Adjust your filters and search again</p>
            </div>
          ) : (
            <div className="candidates-grid">
              {candidates.map(candidate => (
                <div key={candidate.id} className="candidate-card">
                  <div className="candidate-header">
                    <div className="candidate-avatar">
                      {candidate.full_name.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3>{candidate.full_name}</h3>
                      <p>{candidate.email}</p>
                    </div>
                  </div>

                  <div className="candidate-details">
                    {candidate.cgpa && (
                      <div className="detail-row">
                        <span>CGPA:</span>
                        <strong>{candidate.cgpa}</strong>
                      </div>
                    )}
                    {candidate.degree && (
                      <div className="detail-row">
                        <span>Degree:</span>
                        <span>{candidate.degree}</span>
                      </div>
                    )}
                    {candidate.graduation_year && (
                      <div className="detail-row">
                        <span>Graduation:</span>
                        <span>{candidate.graduation_year}</span>
                      </div>
                    )}
                    {candidate.certificates_count > 0 && (
                      <div className="detail-row">
                        <span>Certificates:</span>
                        <strong>{candidate.certificates_count}</strong>
                      </div>
                    )}
                  </div>

                  {candidate.skills && candidate.skills.length > 0 && (
                    <div className="candidate-skills">
                      {candidate.skills.slice(0, 5).map((skill, idx) => (
                        <span key={idx} className="skill-tag">{skill}</span>
                      ))}
                    </div>
                  )}

                  <div className="candidate-links">
                    {candidate.resume_url && (
                      <a href={candidate.resume_url} target="_blank" rel="noopener noreferrer" className="link-btn">
                        Resume
                      </a>
                    )}
                    {candidate.linkedin_url && (
                      <a href={candidate.linkedin_url} target="_blank" rel="noopener noreferrer" className="link-btn">
                        LinkedIn
                      </a>
                    )}
                    {candidate.github_url && (
                      <a href={candidate.github_url} target="_blank" rel="noopener noreferrer" className="link-btn">
                        GitHub
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Offers Tab */}
      {activeTab === 'offers' && (
        <div className="offers-section">
          <h2>Sent Offers</h2>
          
          {offers.length === 0 ? (
            <div className="empty-state">
              <Send size={64} />
              <h3>No Offers Sent Yet</h3>
              <p>Send offers to candidates to see them here</p>
            </div>
          ) : (
            <div className="offers-list">
              {offers.map(offer => (
                <div key={offer.id} className={`offer-card ${offer.status}`}>
                  <div className="offer-header">
                    <div>
                      <h3>{offer.job_title}</h3>
                      <p>{offer.student_name} ({offer.student_email})</p>
                    </div>
                    <span className={`status-badge ${offer.status}`}>
                      {offer.status}
                    </span>
                  </div>
                  <div className="offer-details">
                    <div className="detail-row">
                      <span>Salary Offered:</span>
                      <strong>{offer.salary_offered}</strong>
                    </div>
                    {offer.joining_date && (
                      <div className="detail-row">
                        <span>Joining Date:</span>
                        <span>{new Date(offer.joining_date).toLocaleDateString()}</span>
                      </div>
                    )}
                    {offer.responded_at && (
                      <div className="detail-row">
                        <span>Responded:</span>
                        <span>{new Date(offer.responded_at).toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Post Job Modal */}
      {showPostModal && (
        <div className="modal-overlay" onClick={() => setShowPostModal(false)}>
          <div className="modal-content large" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Post New Job</h2>
              <button className="btn-close" onClick={() => setShowPostModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handlePostJob} className="job-form">
              <div className="form-row">
                <div className="form-group">
                  <label>Job Title *</label>
                  <input
                    type="text"
                    value={jobForm.job_title}
                    onChange={(e) => setJobForm({ ...jobForm, job_title: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Job Type *</label>
                  <select
                    value={jobForm.job_type}
                    onChange={(e) => setJobForm({ ...jobForm, job_type: e.target.value })}
                    className="form-input"
                  >
                    <option>Full-Time</option>
                    <option>Part-Time</option>
                    <option>Contract</option>
                    <option>Internship</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Job Description *</label>
                <textarea
                  value={jobForm.job_description}
                  onChange={(e) => setJobForm({ ...jobForm, job_description: e.target.value })}
                  required
                  rows="4"
                  className="form-textarea"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Location *</label>
                  <input
                    type="text"
                    value={jobForm.location}
                    onChange={(e) => setJobForm({ ...jobForm, location: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Salary Range</label>
                  <input
                    type="text"
                    value={jobForm.salary_range}
                    onChange={(e) => setJobForm({ ...jobForm, salary_range: e.target.value })}
                    placeholder="e.g. $50,000 - $70,000"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Required Skills (comma separated)</label>
                  <input
                    type="text"
                    value={jobForm.required_skills}
                    onChange={(e) => setJobForm({ ...jobForm, required_skills: e.target.value })}
                    placeholder="e.g. JavaScript, React, Node.js"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Minimum CGPA</label>
                  <input
                    type="number"
                    value={jobForm.min_cgpa}
                    onChange={(e) => setJobForm({ ...jobForm, min_cgpa: e.target.value })}
                    step="0.1"
                    min="0"
                    max="10"
                    className="form-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Experience Required</label>
                  <input
                    type="text"
                    value={jobForm.experience_required}
                    onChange={(e) => setJobForm({ ...jobForm, experience_required: e.target.value })}
                    placeholder="e.g. 2-3 years"
                    className="form-input"
                  />
                </div>
                <div className="form-group">
                  <label>Application Deadline *</label>
                  <input
                    type="date"
                    value={jobForm.application_deadline}
                    onChange={(e) => setJobForm({ ...jobForm, application_deadline: e.target.value })}
                    required
                    className="form-input"
                  />
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowPostModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Plus size={20} />
                  Post Job
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Send Offer Modal */}
      {showOfferModal && (
        <div className="modal-overlay" onClick={() => setShowOfferModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>Send Job Offer</h2>
              <button className="btn-close" onClick={() => setShowOfferModal(false)}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSendOffer} className="offer-form">
              <div className="form-group">
                <label>Offer Letter *</label>
                <textarea
                  value={offerForm.offer_letter}
                  onChange={(e) => setOfferForm({ ...offerForm, offer_letter: e.target.value })}
                  required
                  rows="6"
                  placeholder="Write your offer letter here..."
                  className="form-textarea"
                />
              </div>

              <div className="form-group">
                <label>Salary Offered *</label>
                <input
                  type="text"
                  value={offerForm.salary_offered}
                  onChange={(e) => setOfferForm({ ...offerForm, salary_offered: e.target.value })}
                  required
                  placeholder="e.g. $60,000/year"
                  className="form-input"
                />
              </div>

              <div className="form-group">
                <label>Joining Date</label>
                <input
                  type="date"
                  value={offerForm.joining_date}
                  onChange={(e) => setOfferForm({ ...offerForm, joining_date: e.target.value })}
                  className="form-input"
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-secondary" onClick={() => setShowOfferModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="btn-primary">
                  <Send size={20} />
                  Send Offer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompanyJobManagement;

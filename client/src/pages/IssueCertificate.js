import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Award, Calendar, User, Loader, Search, BookOpen, X } from 'lucide-react';
import axios from 'axios';
import { validateCertificateForm, sanitizeInput } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import '../styles/IssueCertificate.css';

const IssueCertificate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [errors, setErrors] = useState({});
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [courseSearch, setCourseSearch] = useState('');
  const [showCourseDropdown, setShowCourseDropdown] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [formData, setFormData] = useState({
    learner_name: '',
    learner_email: '',
    course_name: '',
    institute_name: user?.organization || user?.full_name || '',
    issue_date: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    fetchCourses();
  }, [user]);

  useEffect(() => {
    // Set institute name when user data loads
    if (user && !formData.institute_name) {
      setFormData(prev => ({
        ...prev,
        institute_name: user.organization || user.full_name || ''
      }));
    }
  }, [user]);

  useEffect(() => {
    // Filter courses based on search
    if (courseSearch.trim() === '') {
      setFilteredCourses(courses);
    } else {
      const searchLower = courseSearch.toLowerCase();
      const filtered = courses.filter(course =>
        course.course_name.toLowerCase().includes(searchLower) ||
        course.course_code.toLowerCase().includes(searchLower) ||
        (course.category && course.category.toLowerCase().includes(searchLower))
      );
      setFilteredCourses(filtered);
    }
  }, [courseSearch, courses]);

  useEffect(() => {
    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (!event.target.closest('.course-search-wrapper')) {
        setShowCourseDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const fetchCourses = async () => {
    try {
      if (!user?.id) return;
      
      const response = await axios.get(`/api/courses/institute/${user.id}`);
      setCourses(response.data.courses || []);
      setFilteredCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleCourseSelect = (course) => {
    setSelectedCourse(course);
    setCourseSearch(`${course.course_code} - ${course.course_name}`);
    setFormData({
      ...formData,
      course_name: course.course_name
    });
    setShowCourseDropdown(false);
    
    // Clear course name error if exists
    if (errors.course_name) {
      setErrors({
        ...errors,
        course_name: ''
      });
    }
  };

  const clearCourseSelection = () => {
    setSelectedCourse(null);
    setCourseSearch('');
    setFormData({
      ...formData,
      course_name: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrors({});

    // Validate form
    const validation = validateCertificateForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/certificates/issue', formData);
      setCertificateData(response.data.certificate);
      setSuccess(true);
    } catch (error) {
      console.error('Error issuing certificate:', error);
      alert(error.response?.data?.error || 'Failed to issue certificate. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData({
      ...formData,
      [name]: sanitizedValue
    });
    
    // Clear field-specific error when user types
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };

  const handleReset = () => {
    setSuccess(false);
    setCertificateData(null);
    setErrors({});
    setSelectedCourse(null);
    setCourseSearch('');
    setFormData({
      learner_name: '',
      learner_email: '',
      course_name: '',
      institute_name: user?.organization || user?.full_name || '',
      issue_date: new Date().toISOString().split('T')[0]
    });
  };

  return (
    <div className="issue-page">
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

      <div className="issue-container">
        {!success ? (
          <div className="form-section">
            <div className="form-header">
              <div className="header-icon">
                <Award />
              </div>
              <h1>Issue New Certificate</h1>
              <p>Enter the details below to create a blockchain-verified certificate</p>
            </div>

            <form onSubmit={handleSubmit} className="certificate-form">
              <div className="form-group">
                <label>
                  <User size={18} />
                  Learner Name *
                </label>
                <input
                  type="text"
                  name="learner_name"
                  value={formData.learner_name}
                  onChange={handleChange}
                  placeholder="Enter learner's full name"
                  required
                  className={errors.learner_name ? 'input-error' : ''}
                />
                {errors.learner_name && <span className="field-error">{errors.learner_name}</span>}
              </div>

              <div className="form-group">
                <label>
                  <User size={18} />
                  Learner Email *
                </label>
                <input
                  type="email"
                  name="learner_email"
                  value={formData.learner_email}
                  onChange={handleChange}
                  placeholder="learner@example.com"
                  required
                  className={errors.learner_email ? 'input-error' : ''}
                />
                {errors.learner_email && <span className="field-error">{errors.learner_email}</span>}
              </div>

              <div className="form-group course-select-group">
                <label>
                  <BookOpen size={18} />
                  Select Course *
                </label>
                <div className="course-search-wrapper">
                  <div className="search-input-wrapper">
                    <Search size={18} className="search-icon" />
                    <input
                      type="text"
                      value={courseSearch}
                      onChange={(e) => {
                        setCourseSearch(e.target.value);
                        setShowCourseDropdown(true);
                      }}
                      onFocus={() => setShowCourseDropdown(true)}
                      placeholder="Search courses by name or code..."
                      className={errors.course_name ? 'input-error' : ''}
                    />
                    {selectedCourse && (
                      <button
                        type="button"
                        className="clear-course-btn"
                        onClick={clearCourseSelection}
                        title="Clear selection"
                      >
                        <X size={18} />
                      </button>
                    )}
                  </div>

                  {showCourseDropdown && filteredCourses.length > 0 && (
                    <div className="course-dropdown">
                      {filteredCourses.map((course) => (
                        <div
                          key={course.id}
                          className="course-option"
                          onClick={() => handleCourseSelect(course)}
                        >
                          <div className="course-option-header">
                            <span className="course-code-badge">{course.course_code}</span>
                            <span className="course-name">{course.course_name}</span>
                          </div>
                          <div className="course-option-meta">
                            {course.category && (
                              <span className="course-category">
                                <Award size={12} />
                                {course.category}
                              </span>
                            )}
                            {course.level && (
                              <span className="course-level">{course.level}</span>
                            )}
                            {course.duration && (
                              <span className="course-duration">
                                {course.duration} {course.duration_unit}
                              </span>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {showCourseDropdown && courseSearch && filteredCourses.length === 0 && (
                    <div className="course-dropdown">
                      <div className="no-courses-found">
                        <BookOpen size={24} />
                        <p>No courses found</p>
                        <small>Try a different search term</small>
                      </div>
                    </div>
                  )}
                </div>
                {errors.course_name && <span className="field-error">{errors.course_name}</span>}
                {courses.length === 0 && (
                  <small className="field-hint warning">
                    No courses available. Please add courses in your profile first.
                  </small>
                )}
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={18} />
                  Issue Date *
                </label>
                <input
                  type="date"
                  name="issue_date"
                  value={formData.issue_date}
                  onChange={handleChange}
                  max={new Date().toISOString().split('T')[0]}
                  required
                  className={errors.issue_date ? 'input-error' : ''}
                />
                {errors.issue_date && <span className="field-error">{errors.issue_date}</span>}
              </div>

              <button type="submit" className="btn-submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader className="spinner" size={20} />
                    Issuing Certificate...
                  </>
                ) : (
                  <>
                    <Award size={20} />
                    Issue Certificate
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="success-section">
            <div className="success-icon">✓</div>
            <h1>Certificate Issued Successfully!</h1>
            <p>The certificate has been generated and stored on the blockchain</p>

            <div className="certificate-details">
              <div className="detail-row">
                <span className="detail-label">Certificate ID:</span>
                <span className="detail-value">{certificateData.id}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Transaction Hash:</span>
                <span className="detail-value hash">{certificateData.txHash}</span>
              </div>
              <div className="detail-row">
                <span className="detail-label">Certificate Hash:</span>
                <span className="detail-value hash">{certificateData.hash}</span>
              </div>
            </div>

            <div className="qr-section">
              <h3>QR Code for Verification</h3>
              <img src={certificateData.qrCode} alt="QR Code" className="qr-code" />
              <p className="qr-info">Scan this QR code to verify the certificate</p>
            </div>

            <div className="action-buttons">
              <a 
                href={certificateData.pdfUrl}
                download
                className="btn-download"
                target="_blank"
                rel="noopener noreferrer"
              >
                Download PDF
              </a>
              <button 
                onClick={() => navigate(`/certificate/${certificateData.id}`)}
                className="btn-view"
              >
                View Certificate
              </button>
              <button onClick={handleReset} className="btn-issue-another">
                Issue Another
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCertificate;

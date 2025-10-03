import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, Award, Calendar, User, Loader, BookOpen } from 'lucide-react';
import axios from 'axios';
import { validateCertificateForm, sanitizeInput } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import '../styles/IssueCertificate.css';

// Predefined famous tech courses
const PREDEFINED_COURSES = [
  'Full Stack Web Development',
  'Data Science & Machine Learning',
  'Artificial Intelligence',
  'Cloud Computing (AWS/Azure/GCP)',
  'Cybersecurity Fundamentals',
  'Mobile App Development (iOS/Android)',
  'DevOps Engineering',
  'Blockchain Development',
  'Python Programming',
  'JavaScript & React.js',
  'Java Programming',
  'C++ Programming',
  'Database Management (SQL/NoSQL)',
  'UI/UX Design',
  'Digital Marketing',
  'Business Analytics',
  'Project Management (PMP/Agile)',
  'Other (Specify Below)'
];

const IssueCertificate = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [certificateData, setCertificateData] = useState(null);
  const [errors, setErrors] = useState({});
  const [selectedCourseOption, setSelectedCourseOption] = useState('');
  const [showOtherInput, setShowOtherInput] = useState(false);
  const [formData, setFormData] = useState({
    learner_name: '',
    learner_email: '',
    course_name: '',
    institute_name: user?.organization || user?.full_name || '',
    issue_date: new Date().toISOString().split('T')[0]
  });

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

  useEffect(() => {
    // Set institute name when user data loads
    if (user && !formData.institute_name) {
      setFormData(prev => ({
        ...prev,
        institute_name: user.organization || user.full_name || ''
      }));
    }
  }, [user]);

  const handleCourseSelectChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedCourseOption(selectedValue);
    
    if (selectedValue === 'Other (Specify Below)') {
      setShowOtherInput(true);
      setFormData({
        ...formData,
        course_name: ''
      });
    } else {
      setShowOtherInput(false);
      setFormData({
        ...formData,
        course_name: selectedValue
      });
      // Clear course name error if exists
      if (errors.course_name) {
        setErrors({
          ...errors,
          course_name: ''
        });
      }
    }
  };

  const handleOtherCourseChange = (e) => {
    const { value } = e.target;
    const sanitizedValue = sanitizeInput(value);
    
    setFormData({
      ...formData,
      course_name: sanitizedValue
    });
    
    // Clear course name error
    if (errors.course_name) {
      setErrors({
        ...errors,
        course_name: ''
      });
    }
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
    setSelectedCourseOption('');
    setShowOtherInput(false);
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

              <div className="form-group">
                <label>
                  <BookOpen size={18} />
                  Select Course *
                </label>
                <select
                  value={selectedCourseOption}
                  onChange={handleCourseSelectChange}
                  required
                  className={errors.course_name ? 'input-error' : ''}
                >
                  <option value="">-- Choose a Course --</option>
                  {PREDEFINED_COURSES.map((course, index) => (
                    <option key={index} value={course}>
                      {course}
                    </option>
                  ))}
                </select>
                {errors.course_name && <span className="field-error">{errors.course_name}</span>}
              </div>

              {showOtherInput && (
                <div className="form-group other-course-input">
                  <label>
                    <BookOpen size={18} />
                    Enter Course Name *
                  </label>
                  <input
                    type="text"
                    value={formData.course_name}
                    onChange={handleOtherCourseChange}
                    placeholder="Enter the course name..."
                    required
                    className={errors.course_name ? 'input-error' : ''}
                  />
                  <small className="field-hint">Please specify the course name</small>
                </div>
              )}

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
                <span className="detail-label">Certificate Hash:</span>
                <span className="detail-value hash" title={certificateData.txHash || 'Not available'}>
                  {truncateHash(certificateData.txHash)}
                </span>
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

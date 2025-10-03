import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, ArrowLeft, Award, Calendar, User, Loader, BookOpen } from 'lucide-react';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';
import { validateCertificateForm, sanitizeInput } from '../utils/validation';
import { useAuth } from '../context/AuthContext';
import '../styles/IssueCertificate.css';

// Predefined famous tech courses - keys for translation
const PREDEFINED_COURSES = [
  { key: 'fullStack', defaultName: 'Full Stack Web Development' },
  { key: 'dataScience', defaultName: 'Data Science & Machine Learning' },
  { key: 'ai', defaultName: 'Artificial Intelligence' },
  { key: 'cloud', defaultName: 'Cloud Computing (AWS/Azure/GCP)' },
  { key: 'cybersecurity', defaultName: 'Cybersecurity Fundamentals' },
  { key: 'mobileApp', defaultName: 'Mobile App Development (iOS/Android)' },
  { key: 'devops', defaultName: 'DevOps Engineering' },
  { key: 'blockchain', defaultName: 'Blockchain Development' },
  { key: 'python', defaultName: 'Python Programming' },
  { key: 'javascript', defaultName: 'JavaScript & React.js' },
  { key: 'java', defaultName: 'Java Programming' },
  { key: 'cpp', defaultName: 'C++ Programming' },
  { key: 'database', defaultName: 'Database Management (SQL/NoSQL)' },
  { key: 'uiux', defaultName: 'UI/UX Design' },
  { key: 'digitalMarketing', defaultName: 'Digital Marketing' },
  { key: 'businessAnalytics', defaultName: 'Business Analytics' },
  { key: 'projectManagement', defaultName: 'Project Management (PMP/Agile)' },
  { key: 'other', defaultName: 'Other (Specify Below)' }
];

const IssueCertificate = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
    
    // Check if "Other" is selected (by checking if the value is the translation key)
    const isOther = selectedValue === t('issue.courses.other');
    
    if (isOther) {
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
      alert(error.response?.data?.error || t('issue.error'));
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

  const handleDownloadCertificate = async () => {
    try {
      if (!certificateData?.pdfUrl) {
        alert(t('issue.downloadError') || 'PDF URL not available');
        return;
      }

      // Construct the full URL
      const apiUrl = process.env.REACT_APP_API_URL || 'http://localhost:5001';
      const pdfUrl = certificateData.pdfUrl.startsWith('http') 
        ? certificateData.pdfUrl 
        : `${apiUrl}${certificateData.pdfUrl}`;

      // Fetch the PDF as a blob
      const response = await fetch(pdfUrl);
      
      if (!response.ok) {
        throw new Error('Failed to download certificate');
      }

      const blob = await response.blob();
      
      // Create a temporary URL for the blob
      const blobUrl = window.URL.createObjectURL(blob);
      
      // Create a temporary anchor element and trigger download
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `certificate_${certificateData.id}.pdf`;
      document.body.appendChild(link);
      link.click();
      
      // Clean up
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl);
      
    } catch (error) {
      console.error('Error downloading certificate:', error);
      alert(t('issue.downloadError') || 'Failed to download certificate. Please try again.');
    }
  };

  return (
    <div className="issue-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <Shield className="logo-icon" />
            <span className="logo-text">Certify</span>
          </div>
          <div className="nav-actions">
            <LanguageSwitcher />
            <button onClick={() => navigate('/')} className="btn-back">
              <ArrowLeft size={20} />
              {t('issue.backToHome')}
            </button>
          </div>
        </div>
      </nav>

      <div className="issue-container">
        {!success ? (
          <div className="form-section">
            <div className="form-header">
              <div className="header-icon">
                <Award />
              </div>
              <h1>{t('issue.title')}</h1>
              <p>{t('issue.subtitle')}</p>
            </div>

            <form onSubmit={handleSubmit} className="certificate-form">
              <div className="form-group">
                <label>
                  <User size={18} />
                  {t('issue.learnerName')} {t('issue.required')}
                </label>
                <input
                  type="text"
                  name="learner_name"
                  value={formData.learner_name}
                  onChange={handleChange}
                  placeholder={t('issue.learnerNamePlaceholder')}
                  required
                  className={errors.learner_name ? 'input-error' : ''}
                />
                {errors.learner_name && <span className="field-error">{errors.learner_name}</span>}
              </div>

              <div className="form-group">
                <label>
                  <User size={18} />
                  {t('issue.learnerEmail')} {t('issue.required')}
                </label>
                <input
                  type="email"
                  name="learner_email"
                  value={formData.learner_email}
                  onChange={handleChange}
                  placeholder={t('issue.learnerEmailPlaceholder')}
                  required
                  className={errors.learner_email ? 'input-error' : ''}
                />
                {errors.learner_email && <span className="field-error">{errors.learner_email}</span>}
              </div>

              <div className="form-group">
                <label>
                  <BookOpen size={18} />
                  {t('issue.selectCourse')} {t('issue.required')}
                </label>
                <select
                  value={selectedCourseOption}
                  onChange={handleCourseSelectChange}
                  required
                  className={errors.course_name ? 'input-error' : ''}
                >
                  <option value="">{t('issue.chooseCourse')}</option>
                  {PREDEFINED_COURSES.map((course, index) => (
                    <option key={index} value={t(`issue.courses.${course.key}`)}>
                      {t(`issue.courses.${course.key}`)}
                    </option>
                  ))}
                </select>
                {errors.course_name && <span className="field-error">{errors.course_name}</span>}
              </div>

              {showOtherInput && (
                <div className="form-group other-course-input">
                  <label>
                    <BookOpen size={18} />
                    {t('issue.enterCourseName')} {t('issue.required')}
                  </label>
                  <input
                    type="text"
                    value={formData.course_name}
                    onChange={handleOtherCourseChange}
                    placeholder={t('issue.courseNamePlaceholder')}
                    required
                    className={errors.course_name ? 'input-error' : ''}
                  />
                  <small className="field-hint">{t('issue.courseNameHint')}</small>
                </div>
              )}

              <div className="form-group">
                <label>
                  <Calendar size={18} />
                  {t('issue.issueDate')} {t('issue.required')}
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
                    {t('issue.issuingCertificate')}
                  </>
                ) : (
                  <>
                    <Award size={20} />
                    {t('issue.issueButton')}
                  </>
                )}
              </button>
            </form>
          </div>
        ) : (
          <div className="success-section">
            <div className="success-icon">✓</div>
            <h1>{t('issue.success')}</h1>
            <p>{t('issue.successMessage')}</p>

            <div className="certificate-details">
              <div className="certificate-id-display">
                <span className="id-label">{t('issue.certificateId')}</span>
                <span className="id-value">{certificateData.id}</span>
              </div>
            </div>

            <div className="qr-section">
              <h3>{t('issue.qrCodeTitle')}</h3>
              <img src={certificateData.qrCode} alt="QR Code" className="qr-code" />
              <p className="qr-info">{t('issue.qrCodeInfo')}</p>
            </div>

            <div className="action-buttons">
              <button 
                onClick={handleDownloadCertificate}
                className="btn-download"
              >
                {t('issue.downloadPdf')}
              </button>
              <button 
                onClick={() => navigate(`/certificate/${certificateData.id}`)}
                className="btn-view"
              >
                {t('issue.viewCertificate')}
              </button>
              <button onClick={handleReset} className="btn-issue-another">
                {t('issue.issueAnother')}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IssueCertificate;

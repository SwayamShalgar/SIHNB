import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, UserPlus, Mail, Lock, UserCircle, User, Building, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';
import { validateRegisterForm, sanitizeInput } from '../utils/validation';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    role: 'Student',
    full_name: '',
    organization: '',
    phone: ''
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [pendingApproval, setPendingApproval] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  const roles = ['Admin', 'Institute', 'Student', 'Company'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name.includes('password') ? value : sanitizeInput(value);
    
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
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrors({});

    // Validate form
    const validation = validateRegisterForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setError('Please fix the errors below');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/register', {
        email: formData.email,
        password: formData.password,
        role: formData.role,
        full_name: formData.full_name,
        organization: formData.organization,
        phone: formData.phone
      });
      
      if (response.data.success) {
        // Check if account requires admin approval
        if (response.data.pending) {
          setPendingApproval(true);
          setSuccessMessage(response.data.message);
          // Clear form
          setFormData({
            email: '',
            password: '',
            confirmPassword: '',
            role: 'Student',
            full_name: '',
            organization: '',
            phone: ''
          });
        } else {
          // For Admin and Student, login immediately
          login(response.data.user, response.data.token);

          // Redirect based on role
          const dashboardPaths = {
            Admin: '/admin-dashboard',
            Institute: '/institute-dashboard',
            Student: '/student-dashboard',
            Company: '/company-dashboard'
          };

          navigate(dashboardPaths[response.data.user.role]);
        }
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-container">
        <div className="register-header">
          <div className="logo-section">
            <Shield size={48} className="logo-icon" />
            <h1>Certify</h1>
          </div>
          <p className="register-subtitle">{t('register.subtitle')}</p>
          <div className="language-switcher-wrapper">
            <LanguageSwitcher />
          </div>
        </div>

        {pendingApproval ? (
          <div className="pending-approval-container">
            <div className="success-icon">✓</div>
            <h2>Registration Submitted!</h2>
            <p className="success-message">{successMessage}</p>
            <div className="info-box">
              <p><strong>What happens next?</strong></p>
              <ul>
                <li>An administrator will review your registration</li>
                <li>You'll receive notification once approved</li>
                <li>After approval, you can login with your credentials</li>
              </ul>
            </div>
            <button 
              className="btn-register" 
              onClick={() => navigate('/login')}
              style={{ marginTop: '20px' }}
            >
              {t('login.loginButton')}
            </button>
          </div>
        ) : (
          <form className="register-form" onSubmit={handleSubmit}>
            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}
            {successMessage && !error && (
              <div className="success-message-banner">
                <span>{successMessage}</span>
              </div>
            )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="full_name">
                <User size={18} />
                {t('register.fullName')}
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder={t('register.fullName')}
                required
                className={errors.full_name ? 'input-error' : ''}
              />
              {errors.full_name && <span className="field-error">{errors.full_name}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="role">
                <UserCircle size={18} />
                {t('register.role')}
              </label>
              <select
                id="role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
              >
                {roles.map(role => (
                  <option key={role} value={role}>{role}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              {t('register.email')}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="user@example.com"
              required
              className={errors.email ? 'input-error' : ''}
            />
            {errors.email && <span className="field-error">{errors.email}</span>}
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="organization">
                <Building size={18} />
                Organization
              </label>
              <input
                type="text"
                id="organization"
                name="organization"
                value={formData.organization}
                onChange={handleChange}
                placeholder="Your organization/institute"
                className={errors.organization ? 'input-error' : ''}
              />
              {errors.organization && <span className="field-error">{errors.organization}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="phone">
                <Phone size={18} />
                Phone
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Your phone number"
                className={errors.phone ? 'input-error' : ''}
              />
              {errors.phone && <span className="field-error">{errors.phone}</span>}
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="password">
                <Lock size={18} />
                {t('register.password')}
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder={t('register.password')}
                required
                className={errors.password ? 'input-error' : ''}
              />
              {errors.password && <span className="field-error">{errors.password}</span>}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Lock size={18} />
                {t('register.confirmPassword')}
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder={t('register.confirmPassword')}
                required
                className={errors.confirmPassword ? 'input-error' : ''}
              />
              {errors.confirmPassword && <span className="field-error">{errors.confirmPassword}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-register"
            disabled={loading}
          >
            {loading ? (
              <span>{t('common.loading')}</span>
            ) : (
              <>
                <UserPlus size={20} />
                {t('register.registerButton')}
              </>
            )}
          </button>
        </form>
        )}

        {!pendingApproval && (
          <div className="register-footer">
            <p>{t('register.haveAccount')} <span onClick={() => navigate('/login')} className="link">{t('register.signIn')}</span></p>
            <p className="back-home" onClick={() => navigate('/')}>← {t('common.back')} to Home</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Register;

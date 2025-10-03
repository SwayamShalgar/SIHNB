import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn, Mail, Lock, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import { validateLoginForm, sanitizeInput } from '../utils/validation';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Student'
  });
  const [errors, setErrors] = useState({});
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = ['Admin', 'Institute', 'Student', 'Company'];

  const handleChange = (e) => {
    const { name, value } = e.target;
    const sanitizedValue = name === 'password' ? value : sanitizeInput(value);
    
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
    const validation = validateLoginForm(formData);
    if (!validation.isValid) {
      setErrors(validation.errors);
      setError('Please fix the errors below');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/login', formData);
      
      if (response.data.success) {
        // Use AuthContext to store token and user info
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
    } catch (err) {
      // Handle pending approval status
      if (err.response?.data?.pending) {
        setError(err.response.data.message || 'Your account is pending admin approval.');
      } else {
        setError(err.response?.data?.error || err.response?.data?.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-container">
        <div className="login-header">
          <div className="logo-section">
            <Shield size={48} className="logo-icon" />
            <h1>Certify</h1>
          </div>
          <p className="login-subtitle">Login to your account</p>
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="email">
              <Mail size={18} />
              Email Address
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

          <div className="form-group">
            <label htmlFor="password">
              <Lock size={18} />
              Password
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              placeholder="Enter your password"
              required
              className={errors.password ? 'input-error' : ''}
            />
            {errors.password && <span className="field-error">{errors.password}</span>}
          </div>

          <div className="form-group">
            <label htmlFor="role">
              <UserCircle size={18} />
              Login As
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

          <button 
            type="submit" 
            className="btn-login"
            disabled={loading}
          >
            {loading ? (
              <span>Logging in...</span>
            ) : (
              <>
                <LogIn size={20} />
                Login
              </>
            )}
          </button>
        </form>

        <div className="login-footer">
          <p>Don't have an account? <span onClick={() => navigate('/register')} className="link">Register here</span></p>
          <p className="back-home" onClick={() => navigate('/')}>← Back to Home</p>
        </div>
      </div>
    </div>
  );
};

export default Login;

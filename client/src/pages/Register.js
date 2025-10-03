import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, UserPlus, Mail, Lock, UserCircle, User, Building, Phone } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/Register.css';

const Register = () => {
  const navigate = useNavigate();
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
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const roles = ['Admin', 'Institute', 'Student', 'Company'];

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    // Validate passwords match
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
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
          <p className="register-subtitle">Create your account</p>
        </div>

        <form className="register-form" onSubmit={handleSubmit}>
          {error && (
            <div className="error-message">
              <span>{error}</span>
            </div>
          )}

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="full_name">
                <User size={18} />
                Full Name
              </label>
              <input
                type="text"
                id="full_name"
                name="full_name"
                value={formData.full_name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="role">
                <UserCircle size={18} />
                Register As
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
              Email Address
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />
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
              />
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
              />
            </div>
          </div>

          <div className="form-row">
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
                placeholder="Create a password"
                required
                minLength="6"
              />
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">
                <Lock size={18} />
                Confirm Password
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm your password"
                required
                minLength="6"
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="btn-register"
            disabled={loading}
          >
            {loading ? (
              <span>Creating account...</span>
            ) : (
              <>
                <UserPlus size={20} />
                Register
              </>
            )}
          </button>
        </form>

        <div className="register-footer">
          <p>Already have an account? <span onClick={() => navigate('/login')} className="link">Login here</span></p>
          <p className="back-home" onClick={() => navigate('/')}>← Back to Home</p>
        </div>
      </div>
    </div>
  );
};

export default Register;

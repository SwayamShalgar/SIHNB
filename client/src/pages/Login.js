import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogIn, Mail, Lock, UserCircle } from 'lucide-react';
import axios from 'axios';
import '../styles/Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'Student'
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

    try {
      const response = await axios.post('/api/auth/login', formData);
      
      if (response.data.success) {
        // Store token and user info
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));

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
      setError(err.response?.data?.error || 'Login failed. Please try again.');
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
              placeholder="Enter your email"
              required
            />
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
            />
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

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, User, Mail, Phone, Building, Calendar, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import '../styles/Profile.css';

const Profile = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    full_name: '',
    email: '',
    phone: '',
    organization: '',
    role: ''
  });

  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }

    // Load user data
    if (user) {
      setFormData({
        full_name: user.full_name || user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        organization: user.organization || '',
        role: user.role || ''
      });
    }
  }, [user, isAuthenticated, navigate]);

  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      Admin: 'role-badge-admin',
      Institute: 'role-badge-institute',
      Student: 'role-badge-student',
      Company: 'role-badge-company'
    };
    return roleClasses[role] || 'role-badge-default';
  };

  if (!user) {
    return (
      <div className="profile-page">
        <div className="loading">Loading...</div>
      </div>
    );
  }

  return (
    <div className="profile-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <Shield className="logo-icon" />
            <span className="logo-text">Certify</span>
          </div>
          <button onClick={() => navigate(-1)} className="btn-back">
            <ArrowLeft size={20} />
            Back
          </button>
        </div>
      </nav>

      <div className="profile-container">
        <div className="profile-card">
          <div className="profile-header">
            <div className="profile-avatar">
              <UserCircle size={80} />
            </div>
            <h1>My Profile</h1>
            <span className={`role-badge ${getRoleBadgeClass(formData.role)}`}>
              {formData.role}
            </span>
          </div>

          <div className="profile-form">
            <div className="form-section">
              <h2>Personal Information</h2>
              
              <div className="form-group">
                <label>
                  <User size={18} />
                  Full Name
                </label>
                <div className="field-display">{formData.full_name || 'Not provided'}</div>
              </div>

              <div className="form-group">
                <label>
                  <Mail size={18} />
                  Email Address
                </label>
                <div className="field-display">{formData.email || 'Not provided'}</div>
              </div>

              <div className="form-group">
                <label>
                  <Phone size={18} />
                  Phone Number
                </label>
                <div className="field-display">{formData.phone || 'Not provided'}</div>
              </div>

              <div className="form-group">
                <label>
                  <Building size={18} />
                  Organization
                </label>
                <div className="field-display">{formData.organization || 'Not provided'}</div>
              </div>
            </div>

            <div className="form-section">
              <h2>Account Information</h2>
              
              <div className="form-group">
                <label>
                  <UserCircle size={18} />
                  Account Type
                </label>
                <div className="field-display">
                  <span className={`role-badge ${getRoleBadgeClass(formData.role)}`}>
                    {formData.role}
                  </span>
                </div>
              </div>

              <div className="form-group">
                <label>
                  <Calendar size={18} />
                  Member Since
                </label>
                <div className="field-display">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

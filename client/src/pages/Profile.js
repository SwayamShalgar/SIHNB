import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, User, Mail, Phone, Building, Calendar, UserCircle, Award, CheckCircle, Activity, Settings, Edit3, Bell, Users, FileCheck, BarChart3, Globe, Briefcase, GraduationCap } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import CourseManagement from '../components/CourseManagement';
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

  const [userStats, setUserStats] = useState({
    certificates: 0,
    issued: 0,
    verified: 0,
    students: 0,
    totalUsers: 0,
    activeInstitutes: 0
  });

  const [loading, setLoading] = useState(true);

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
      fetchUserStats();
    }
  }, [user, isAuthenticated, navigate]);

  const fetchUserStats = async () => {
    try {
      // Fetch role-specific stats with parameters
      console.log('User object:', user);
      const role = user?.role;
      const params = {
        role: role,
        institute_name: user?.organization,
        user_id: user?.id
      };

      console.log('Fetching stats with params:', params);
      const response = await axios.get('/api/certificates/user-stats', { params });
      console.log('Stats API response:', response.data);

      if (role === 'Institute') {
        setUserStats({
          certificates: response.data.issuedCertificates || 0,
          issued: response.data.issuedCertificates || 0,
          students: response.data.totalStudents || 0,
          verified: response.data.verifiedCertificates || 0,
          activeCourses: response.data.activeCourses || 0
        });
      } else if (role === 'Company') {
        setUserStats({
          certificates: response.data.totalCertificates || 0,
          verified: response.data.verifiedCertificates || 0,
          candidates: response.data.totalCandidates || 0
        });
      } else if (role === 'Admin') {
        setUserStats({
          certificates: response.data.totalCertificates || 0,
          totalUsers: response.data.totalUsers || 0,
          activeInstitutes: response.data.activeInstitutes || 0,
          verified: response.data.verifiedCertificates || 0
        });
      } else {
        // Student
        setUserStats({
          certificates: response.data.totalCertificates || 0
        });
      }
    } catch (error) {
      console.error('Error fetching user stats:', error);
      setUserStats({ certificates: 0 });
    } finally {
      setLoading(false);
    }
  };

  const getRoleBadgeClass = (role) => {
    const roleClasses = {
      Admin: 'role-badge-admin',
      Institute: 'role-badge-institute',
      Student: 'role-badge-student',
      Company: 'role-badge-company'
    };
    return roleClasses[role] || 'role-badge-default';
  };

  const renderRoleSpecificStats = () => {
    const role = formData.role;

    if (role === 'Institute') {
      return (
        <div className="stats-grid multi-stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Award size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.issued}</div>
              <div className="stat-label">Certificates Issued</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <CheckCircle size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.verified}</div>
              <div className="stat-label">Verified Certificates</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.students}</div>
              <div className="stat-label">Total Students</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <GraduationCap size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.activeCourses || 0}</div>
              <div className="stat-label">Active Courses</div>
            </div>
          </div>
        </div>
      );
    } else if (role === 'Company') {
      return (
        <div className="stats-grid multi-stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <FileCheck size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.verified}</div>
              <div className="stat-label">Certificates Verified</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.candidates}</div>
              <div className="stat-label">Candidates Screened</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Briefcase size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.certificates}</div>
              <div className="stat-label">Active Verifications</div>
            </div>
          </div>
        </div>
      );
    } else if (role === 'Admin') {
      return (
        <div className="stats-grid multi-stats">
          <div className="stat-card">
            <div className="stat-icon blue">
              <BarChart3 size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.certificates}</div>
              <div className="stat-label">Total Certificates</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon green">
              <Users size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.totalUsers}</div>
              <div className="stat-label">Platform Users</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon purple">
              <Building size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.activeInstitutes}</div>
              <div className="stat-label">Active Institutes</div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon orange">
              <Globe size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.verified}</div>
              <div className="stat-label">Verified Records</div>
            </div>
          </div>
        </div>
      );
    } else {
      // Student
      return (
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon blue">
              <Award size={24} />
            </div>
            <div className="stat-content">
              <div className="stat-value">{userStats.certificates}</div>
              <div className="stat-label">My Certificates</div>
            </div>
          </div>
        </div>
      );
    }
  };

  const renderRoleSpecificContent = () => {
    const role = formData.role;

    if (role === 'Institute') {
      return (
        <>
          <div className="info-card">
            <div className="card-header">
              <h2>
                <Building size={24} />
                Institute Information
              </h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <div className="info-label">
                  <Building size={18} />
                  Institute Name
                </div>
                <div className="info-value">{formData.organization || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Mail size={18} />
                  Official Email
                </div>
                <div className="info-value">{formData.email || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Phone size={18} />
                  Contact Number
                </div>
                <div className="info-value">{formData.phone || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <User size={18} />
                  Contact Person
                </div>
                <div className="info-value">{formData.full_name || 'Not provided'}</div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header">
              <h2>
                <Award size={24} />
                Certification Details
              </h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <div className="info-label">
                  <CheckCircle size={18} />
                  Accreditation Status
                </div>
                <div className="info-value">
                  <span className="status-badge verified">
                    <CheckCircle size={16} />
                    Accredited
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Calendar size={18} />
                  Member Since
                </div>
                <div className="info-value">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Activity size={18} />
                  Institute Status
                </div>
                <div className="info-value">
                  <span className="status-badge active">
                    <span className="status-dot"></span>
                    Active
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Shield size={18} />
                  Verification Level
                </div>
                <div className="info-value">
                  <span className="status-badge verified">
                    <Shield size={16} />
                    Level 3 Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (role === 'Company') {
      return (
        <>
          <div className="info-card">
            <div className="card-header">
              <h2>
                <Briefcase size={24} />
                Company Information
              </h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <div className="info-label">
                  <Building size={18} />
                  Company Name
                </div>
                <div className="info-value">{formData.organization || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Mail size={18} />
                  Corporate Email
                </div>
                <div className="info-value">{formData.email || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Phone size={18} />
                  Contact Number
                </div>
                <div className="info-value">{formData.phone || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <User size={18} />
                  HR Manager
                </div>
                <div className="info-value">{formData.full_name || 'Not provided'}</div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header">
              <h2>
                <FileCheck size={24} />
                Verification Access
              </h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <div className="info-label">
                  <CheckCircle size={18} />
                  Access Level
                </div>
                <div className="info-value">
                  <span className="status-badge verified">
                    <CheckCircle size={16} />
                    Premium Access
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Calendar size={18} />
                  Member Since
                </div>
                <div className="info-value">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Activity size={18} />
                  Account Status
                </div>
                <div className="info-value">
                  <span className="status-badge active">
                    <span className="status-dot"></span>
                    Active
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Shield size={18} />
                  Verification Rights
                </div>
                <div className="info-value">
                  <span className="status-badge verified">
                    <Shield size={16} />
                    Full Access
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else if (role === 'Admin') {
      return (
        <>
          <div className="info-card">
            <div className="card-header">
              <h2>
                <Shield size={24} />
                Admin Information
              </h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <div className="info-label">
                  <User size={18} />
                  Admin Name
                </div>
                <div className="info-value">{formData.full_name || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Mail size={18} />
                  Admin Email
                </div>
                <div className="info-value">{formData.email || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Phone size={18} />
                  Contact Number
                </div>
                <div className="info-value">{formData.phone || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Building size={18} />
                  Department
                </div>
                <div className="info-value">{formData.organization || 'Platform Administration'}</div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header">
              <h2>
                <Settings size={24} />
                System Access
              </h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <div className="info-label">
                  <Shield size={18} />
                  Access Level
                </div>
                <div className="info-value">
                  <span className="status-badge verified">
                    <Shield size={16} />
                    Super Admin
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Calendar size={18} />
                  Admin Since
                </div>
                <div className="info-value">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Activity size={18} />
                  Status
                </div>
                <div className="info-value">
                  <span className="status-badge active">
                    <span className="status-dot"></span>
                    Active
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Settings size={18} />
                  Permissions
                </div>
                <div className="info-value">
                  <span className="status-badge verified">
                    <CheckCircle size={16} />
                    Full Control
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    } else {
      // Student
      return (
        <>
          <div className="info-card">
            <div className="card-header">
              <h2>
                <User size={24} />
                Personal Information
              </h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <div className="info-label">
                  <User size={18} />
                  Full Name
                </div>
                <div className="info-value">{formData.full_name || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Mail size={18} />
                  Email Address
                </div>
                <div className="info-value">{formData.email || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Phone size={18} />
                  Phone Number
                </div>
                <div className="info-value">{formData.phone || 'Not provided'}</div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Building size={18} />
                  Institution
                </div>
                <div className="info-value">{formData.organization || 'Not provided'}</div>
              </div>
            </div>
          </div>

          <div className="info-card">
            <div className="card-header">
              <h2>
                <UserCircle size={24} />
                Account Information
              </h2>
            </div>
            <div className="card-body">
              <div className="info-row">
                <div className="info-label">
                  <UserCircle size={18} />
                  Account Type
                </div>
                <div className="info-value">
                  <span className={`role-badge ${getRoleBadgeClass(formData.role)}`}>
                    {formData.role}
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Calendar size={18} />
                  Member Since
                </div>
                <div className="info-value">
                  {user.created_at ? new Date(user.created_at).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'Not available'}
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <CheckCircle size={18} />
                  Account Status
                </div>
                <div className="info-value">
                  <span className="status-badge active">
                    <span className="status-dot"></span>
                    Active
                  </span>
                </div>
              </div>

              <div className="info-row">
                <div className="info-label">
                  <Shield size={18} />
                  Verification Status
                </div>
                <div className="info-value">
                  <span className="status-badge verified">
                    <CheckCircle size={16} />
                    Verified
                  </span>
                </div>
              </div>
            </div>
          </div>
        </>
      );
    }
  };

  const renderRoleSpecificActivity = () => {
    const role = formData.role;

    if (role === 'Institute') {
      return (
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-icon success">
              <Award size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">Certificate Batch Issued</div>
              <div className="timeline-desc">Issued 25 certificates for Web Development Course</div>
              <div className="timeline-time">2 hours ago</div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon primary">
              <Users size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">New Students Enrolled</div>
              <div className="timeline-desc">45 students enrolled in Data Science Program</div>
              <div className="timeline-time">1 day ago</div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon info">
              <CheckCircle size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">Institute Verification Renewed</div>
              <div className="timeline-desc">Your institute accreditation has been renewed</div>
              <div className="timeline-time">3 days ago</div>
            </div>
          </div>
        </div>
      );
    } else if (role === 'Company') {
      return (
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-icon success">
              <FileCheck size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">Certificate Verified</div>
              <div className="timeline-desc">Verified candidate certificate for John Doe</div>
              <div className="timeline-time">1 hour ago</div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon primary">
              <Users size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">Bulk Verification Completed</div>
              <div className="timeline-desc">Verified 50 candidate certificates</div>
              <div className="timeline-time">1 day ago</div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon info">
              <Briefcase size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">Premium Access Activated</div>
              <div className="timeline-desc">Your premium verification access is now active</div>
              <div className="timeline-time">5 days ago</div>
            </div>
          </div>
        </div>
      );
    } else if (role === 'Admin') {
      return (
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-icon success">
              <Building size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">New Institute Approved</div>
              <div className="timeline-desc">MIT Academy has been verified and approved</div>
              <div className="timeline-time">30 minutes ago</div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon primary">
              <BarChart3 size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">System Analytics Updated</div>
              <div className="timeline-desc">Monthly platform statistics generated</div>
              <div className="timeline-time">2 hours ago</div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon info">
              <Shield size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">Security Audit Completed</div>
              <div className="timeline-desc">Platform security audit passed successfully</div>
              <div className="timeline-time">1 day ago</div>
            </div>
          </div>
        </div>
      );
    } else {
      // Student
      return (
        <div className="timeline">
          <div className="timeline-item">
            <div className="timeline-icon success">
              <CheckCircle size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">Certificate Verified</div>
              <div className="timeline-desc">Your certificate has been successfully verified</div>
              <div className="timeline-time">2 hours ago</div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon primary">
              <Award size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">New Certificate Received</div>
              <div className="timeline-desc">Full Stack Development Certificate</div>
              <div className="timeline-time">1 day ago</div>
            </div>
          </div>

          <div className="timeline-item">
            <div className="timeline-icon info">
              <User size={20} />
            </div>
            <div className="timeline-content">
              <div className="timeline-title">Profile Updated</div>
              <div className="timeline-desc">You updated your profile information</div>
              <div className="timeline-time">3 days ago</div>
            </div>
          </div>
        </div>
      );
    }
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
      {/* Enhanced Navbar */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <Shield className="logo-icon" />
            <span className="logo-text">Certify</span>
          </div>
          <div className="nav-actions">
            <button className="btn-icon" title="Notifications">
              <Bell size={20} />
            </button>
            <button className="btn-icon" title="Settings">
              <Settings size={20} />
            </button>
            <button onClick={() => navigate(-1)} className="btn-back">
              <ArrowLeft size={20} />
              Back
            </button>
          </div>
        </div>
      </nav>

      <div className="profile-container">
        {/* Profile Header Card */}
        <div className="profile-header-card">
          <div className="profile-cover"></div>
          <div className="profile-info-section">
            <div className="profile-avatar-wrapper">
              <div className="profile-avatar">
                <UserCircle size={100} />
              </div>
              <button className="avatar-edit-btn" title="Change Avatar">
                <Edit3 size={16} />
              </button>
            </div>
            <div className="profile-details">
              <h1>{formData.full_name || 'User Name'}</h1>
              <p className="profile-email">{formData.email}</p>
              <div className="profile-badges">
                <span className={`role-badge ${getRoleBadgeClass(formData.role)}`}>
                  {formData.role}
                </span>
                <span className="verified-badge">
                  <CheckCircle size={16} />
                  Verified
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Role-Specific Stats Grid */}
        {renderRoleSpecificStats()}

        {/* Main Content Grid - Role Specific */}
        <div className="content-grid">
          {renderRoleSpecificContent()}
        </div>

        {/* Course Management for Institute Users */}
        {formData.role === 'Institute' && user.id && (
          <CourseManagement instituteId={user.id} />
        )}

        {/* Activity Timeline Card - Role Specific */}
        <div className="activity-card">
          <div className="card-header">
            <h2>
              <Activity size={24} />
              Recent Activity
            </h2>
          </div>
          <div className="card-body">
            {renderRoleSpecificActivity()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

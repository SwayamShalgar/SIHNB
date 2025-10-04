import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Shield, LogOut, Users, Building2, Award, 
  Search, Eye, Trash2, Activity, UserCircle, CheckCircle, 
  XCircle, Clock, TrendingUp, BarChart3, Sparkles
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, token, isAuthenticated, logout } = useAuth();

  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstitutes: 0,
    totalCompanies: 0,
    totalAdmins: 0,
    totalCertificates: 0
  });

  const [users, setUsers] = useState([]);
  const [pendingUsers, setPendingUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeSection, setActiveSection] = useState('overview');

  // API Functions
  const fetchStats = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get('/api/admin/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setStats(response.data.stats);
      setRecentActivity(response.data.recentActivity || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get('/api/admin/users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      if (error.response?.status === 401) {
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
      }
    }
  }, [token, logout, navigate]);

  const fetchPendingUsers = useCallback(async () => {
    if (!token) return;
    try {
      const response = await axios.get('/api/admin/pending-users', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setPendingUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching pending users:', error);
    }
  }, [token]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchStats(), fetchUsers(), fetchPendingUsers()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchUsers, fetchPendingUsers]);

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'Admin') {
      navigate('/login');
      return;
    }
    if (token) {
      fetchData();
    }
  }, [navigate, isAuthenticated, user, token, fetchData]);

  const fetchUserActivity = async (email) => {
    try {
      const response = await axios.get(`/api/admin/activity/${email}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      setUserActivity(response.data.activity);
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };

  // Event Handlers
  const handleViewUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    fetchUserActivity(selectedUser.email);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return;
    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      fetchUsers();
      setSelectedUser(null);
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleApproveUser = async (userId, userName) => {
    if (!window.confirm(`Approve ${userName}? This will allow them to login.`)) return;
    try {
      await axios.post(`/api/admin/approve-user/${userId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert(`${userName} has been approved successfully!`);
      await Promise.all([fetchPendingUsers(), fetchUsers()]);
    } catch (error) {
      console.error('Error approving user:', error);
      alert('Failed to approve user');
    }
  };

  const handleRejectUser = async (userId, userName) => {
    if (!window.confirm(`Reject and delete ${userName}? This action cannot be undone.`)) return;
    try {
      await axios.post(`/api/admin/reject-user/${userId}`, {}, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      alert(`${userName} has been rejected and removed.`);
      fetchPendingUsers();
    } catch (error) {
      console.error('Error rejecting user:', error);
      alert('Failed to reject user');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleLogoClick = () => {
    logout();
    navigate('/');
  };

  // Filter users
  const filteredUsers = users.filter(u => {
    const matchesSearch = 
      u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      u.organization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="loading-screen">
        <div className="loading-content">
          <div className="spinner-modern"></div>
          <p>Loading Dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <div className="admin-dashboard-modern">
      {/* Modern Navigation Bar */}
      <nav className="navbar-modern">
        <div className="nav-container-modern">
          <div className="nav-left">
            <div className="nav-logo-modern" onClick={handleLogoClick}>
              <div className="logo-icon-wrapper">
                <Shield size={28} />
              </div>
              <span className="logo-text-modern">Certify</span>
            </div>
          </div>
          
          <div className="nav-center-modern">
            <span className="nav-title">Admin Dashboard</span>
          </div>

          <div className="nav-right">
            <LanguageSwitcher />
            <button className="btn-icon-modern" onClick={() => navigate('/profile')}>
              <UserCircle size={22} />
            </button>
            <button className="btn-logout-modern" onClick={handleLogout}>
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="dashboard-main-modern">
        {/* Hero Section */}
        <div className="hero-section-modern">
          <div className="hero-content">
            <div className="hero-badge">
              <Sparkles size={16} />
              <span>Platform Overview</span>
            </div>
            <h1>Welcome back, {user.full_name || user.email}</h1>
            <p>Monitor and manage your entire certification ecosystem</p>
          </div>
        </div>

        {/* Navigation Pills */}
        <div className="nav-pills-container">
          <div className="nav-pills">
            <button 
              className={`pill ${activeSection === 'overview' ? 'pill-active' : ''}`}
              onClick={() => setActiveSection('overview')}
            >
              <BarChart3 size={18} />
              <span>Overview</span>
            </button>
            <button 
              className={`pill ${activeSection === 'verifications' ? 'pill-active' : ''}`}
              onClick={() => setActiveSection('verifications')}
            >
              <Clock size={18} />
              <span>Verifications</span>
              {pendingUsers.length > 0 && (
                <span className="pill-badge">{pendingUsers.length}</span>
              )}
            </button>
          </div>
        </div>

        {/* Overview Section */}
        {activeSection === 'overview' && (
          <>
            {/* Stats Grid - Modern Design */}
            <div className="stats-grid-modern">
              <div className="stat-card-modern stat-gradient-blue">
                <div className="stat-card-header">
                  <div className="stat-icon-modern">
                    <Users size={24} />
                  </div>
                  <TrendingUp size={18} className="stat-trend-icon" />
                </div>
                <div className="stat-body">
                  <h3>Total Students</h3>
                  <p className="stat-value">{stats.totalStudents.toLocaleString()}</p>
                  <span className="stat-label">Active learners</span>
                </div>
              </div>

              <div className="stat-card-modern stat-gradient-purple">
                <div className="stat-card-header">
                  <div className="stat-icon-modern">
                    <Building2 size={24} />
                  </div>
                  <TrendingUp size={18} className="stat-trend-icon" />
                </div>
                <div className="stat-body">
                  <h3>Institutes</h3>
                  <p className="stat-value">{stats.totalInstitutes.toLocaleString()}</p>
                  <span className="stat-label">Registered partners</span>
                </div>
              </div>

              <div className="stat-card-modern stat-gradient-teal">
                <div className="stat-card-header">
                  <div className="stat-icon-modern">
                    <Building2 size={24} />
                  </div>
                  <TrendingUp size={18} className="stat-trend-icon" />
                </div>
                <div className="stat-body">
                  <h3>Companies</h3>
                  <p className="stat-value">{stats.totalCompanies.toLocaleString()}</p>
                  <span className="stat-label">Business partners</span>
                </div>
              </div>

              <div className="stat-card-modern stat-gradient-orange">
                <div className="stat-card-header">
                  <div className="stat-icon-modern">
                    <Award size={24} />
                  </div>
                  <TrendingUp size={18} className="stat-trend-icon" />
                </div>
                <div className="stat-body">
                  <h3>Certificates</h3>
                  <p className="stat-value">{stats.totalCertificates.toLocaleString()}</p>
                  <span className="stat-label">Total issued</span>
                </div>
              </div>
            </div>

            {/* User Management Section */}
            <div className="content-card-modern">
              <div className="card-header-modern">
                <div className="header-left">
                  <Users size={24} />
                  <div>
                    <h2>User Management</h2>
                    <p>Manage all platform users</p>
                  </div>
                </div>
              </div>

              {/* Filters */}
              <div className="filters-modern">
                <div className="search-modern">
                  <Search size={20} />
                  <input
                    type="text"
                    placeholder="Search users..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>

                <div className="filter-chips">
                  {['All', 'Student', 'Institute', 'Company', 'Admin'].map(role => (
                    <button
                      key={role}
                      className={`chip ${filterRole === role ? 'chip-active' : ''}`}
                      onClick={() => setFilterRole(role)}
                    >
                      {role}
                      <span className="chip-count">
                        {role === 'All' 
                          ? users.length 
                          : users.filter(u => u.role === role).length}
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Users Table */}
              <div className="table-modern-container">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Organization</th>
                      <th>Joined</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUsers.length === 0 ? (
                      <tr>
                        <td colSpan="5" className="empty-row">
                          <div className="empty-state-table">
                            <Users size={48} />
                            <p>No users found</p>
                          </div>
                        </td>
                      </tr>
                    ) : (
                      filteredUsers.map(u => (
                        <tr key={u.id}>
                          <td>
                            <div className="user-info-cell">
                              <div className="avatar-modern">
                                {(u.full_name || u.email).charAt(0).toUpperCase()}
                              </div>
                              <div className="user-text">
                                <div className="user-name-text">{u.full_name || 'N/A'}</div>
                                <div className="user-email-text">{u.email}</div>
                              </div>
                            </div>
                          </td>
                          <td>
                            <span className={`badge-modern badge-${u.role.toLowerCase()}`}>
                              {u.role}
                            </span>
                          </td>
                          <td>{u.organization || 'N/A'}</td>
                          <td>{new Date(u.created_at).toLocaleDateString()}</td>
                          <td>
                            <div className="action-group">
                              <button 
                                className="btn-action btn-view-modern" 
                                onClick={() => handleViewUser(u)}
                              >
                                <Eye size={18} />
                              </button>
                              <button 
                                className="btn-action btn-delete-modern" 
                                onClick={() => handleDeleteUser(u.id)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Activity */}
            {recentActivity.length > 0 && (
              <div className="content-card-modern">
                <div className="card-header-modern">
                  <div className="header-left">
                    <Activity size={24} />
                    <div>
                      <h2>Recent Activity</h2>
                      <p>Latest platform activities</p>
                    </div>
                  </div>
                </div>

                <div className="activity-timeline">
                  {recentActivity.slice(0, 5).map((activity, index) => (
                    <div key={index} className="timeline-item">
                      <div className="timeline-dot"></div>
                      <div className="timeline-content">
                        <div className="timeline-header">
                          <Award size={18} />
                          <span className="activity-user-modern">
                            {activity.full_name || activity.email}
                          </span>
                          <span className={`badge-modern badge-${activity.role.toLowerCase()}`}>
                            {activity.role}
                          </span>
                        </div>
                        <p className="activity-text">earned a certificate</p>
                        <p className="activity-course">{activity.course_name}</p>
                        <span className="activity-timestamp">
                          {new Date(activity.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}

        {/* Verifications Section */}
        {activeSection === 'verifications' && (
          <div className="content-card-modern">
            <div className="card-header-modern">
              <div className="header-left">
                <Clock size={24} />
                <div>
                  <h2>Pending Verifications</h2>
                  <p>Review and approve registrations</p>
                </div>
              </div>
            </div>

            {pendingUsers.length === 0 ? (
              <div className="empty-state-modern">
                <div className="empty-icon-modern">
                  <CheckCircle size={60} />
                </div>
                <h3>All Caught Up!</h3>
                <p>No pending verifications at this time</p>
              </div>
            ) : (
              <div className="table-modern-container">
                <table className="table-modern">
                  <thead>
                    <tr>
                      <th>User</th>
                      <th>Role</th>
                      <th>Organization</th>
                      <th>Contact</th>
                      <th>Registered</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingUsers.map(u => (
                      <tr key={u.id}>
                        <td>
                          <div className="user-info-cell">
                            <div className="avatar-modern avatar-pending">
                              {(u.full_name || u.email).charAt(0).toUpperCase()}
                            </div>
                            <div className="user-text">
                              <div className="user-name-text">{u.full_name || 'N/A'}</div>
                              <div className="user-email-text">{u.email}</div>
                            </div>
                          </div>
                        </td>
                        <td>
                          <span className={`badge-modern badge-${u.role.toLowerCase()}`}>
                            {u.role}
                          </span>
                        </td>
                        <td>{u.organization || 'N/A'}</td>
                        <td>{u.phone || 'N/A'}</td>
                        <td>
                          <div className="date-cell">
                            {new Date(u.created_at).toLocaleDateString()}
                            <small>{new Date(u.created_at).toLocaleTimeString()}</small>
                          </div>
                        </td>
                        <td>
                          <div className="approval-group">
                            <button 
                              className="btn-approve-modern"
                              onClick={() => handleApproveUser(u.id, u.full_name || u.email)}
                            >
                              <CheckCircle size={18} />
                              Approve
                            </button>
                            <button 
                              className="btn-reject-modern"
                              onClick={() => handleRejectUser(u.id, u.full_name || u.email)}
                            >
                              <XCircle size={18} />
                              Reject
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>

      {/* User Activity Modal */}
      {selectedUser && (
        <div className="modal-overlay-modern" onClick={() => setSelectedUser(null)}>
          <div className="modal-content-modern" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-modern">
              <h3>User Details</h3>
              <button className="btn-close-modern" onClick={() => setSelectedUser(null)}>
                <XCircle size={24} />
              </button>
            </div>

            <div className="modal-body-modern">
              <div className="user-profile-card">
                <div className="avatar-large-modern">
                  {(selectedUser.full_name || selectedUser.email).charAt(0).toUpperCase()}
                </div>
                <h4>{selectedUser.full_name || selectedUser.email}</h4>
                <p>{selectedUser.email}</p>
                <span className={`badge-modern badge-${selectedUser.role.toLowerCase()}`}>
                  {selectedUser.role}
                </span>
                {selectedUser.organization && (
                  <p className="org-text">
                    <Building2 size={16} /> {selectedUser.organization}
                  </p>
                )}
                <p className="join-text">
                  Joined: {new Date(selectedUser.created_at).toLocaleDateString()}
                </p>
              </div>

              {userActivity && userActivity.length > 0 && (
                <div className="certificates-section">
                  <h4>
                    <Award size={20} />
                    Certificates Earned
                  </h4>
                  {userActivity.map((cert, index) => (
                    <div key={index} className="cert-item">
                      <Award size={24} className="cert-icon" />
                      <div className="cert-details">
                        <div className="cert-name">{cert.course_name}</div>
                        <div className="cert-institute">{cert.institute_name}</div>
                        <div className="cert-date">
                          {new Date(cert.issue_date).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {(!userActivity || userActivity.length === 0) && (
                <div className="empty-state-modal">
                  <Award size={40} />
                  <p>No certificates yet</p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

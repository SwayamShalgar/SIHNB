import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Users, FileText, BarChart, Award, Search, Eye, Trash2, Activity } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, token, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalInstitutes: 0,
    totalCompanies: 0,
    totalAdmins: 0,
    totalCertificates: 0
  });
  const [users, setUsers] = useState([]);
  const [recentActivity, setRecentActivity] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('All');
  const [selectedUser, setSelectedUser] = useState(null);
  const [userActivity, setUserActivity] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = useCallback(async () => {
    if (!token) {
      console.log('No token available for fetchStats');
      return;
    }
    try {
      console.log('Fetching stats with token:', token.substring(0, 20) + '...');
      const response = await axios.get('/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Stats fetched successfully:', response.data);
      setStats(response.data.stats);
      setRecentActivity(response.data.recentActivity || []);
    } catch (error) {
      console.error('Error fetching stats:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
    }
  }, [token]);

  const fetchUsers = useCallback(async () => {
    if (!token) {
      console.log('No token available for fetchUsers');
      return;
    }
    try {
      console.log('Fetching users with token:', token.substring(0, 20) + '...');
      const response = await axios.get('/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Users response:', response.data);
      console.log('Number of users:', response.data.users?.length);
      setUsers(response.data.users || []);
    } catch (error) {
      console.error('Error fetching users:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      if (error.response?.status === 401) {
        console.error('Authentication failed - token may be invalid');
        alert('Session expired. Please login again.');
        logout();
        navigate('/login');
      }
    }
  }, [token, logout, navigate]);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([fetchStats(), fetchUsers()]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  }, [fetchStats, fetchUsers]);

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
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setUserActivity(response.data.activity);
    } catch (error) {
      console.error('Error fetching user activity:', error);
    }
  };

  const handleViewUser = (selectedUser) => {
    setSelectedUser(selectedUser);
    fetchUserActivity(selectedUser.email);
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('Are you sure you want to delete this user?')) {
      return;
    }

    try {
      await axios.delete(`/api/admin/users/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      fetchUsers();
      setSelectedUser(null);
      alert('User deleted successfully');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const filteredUsers = users.filter(u => {
    const matchesSearch = u.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.full_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         u.organization?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = filterRole === 'All' || u.role === filterRole;
    return matchesSearch && matchesRole;
  });

  if (!user) return <div className="loading">Loading...</div>;
  if (loading) return <div className="loading">Loading admin data...</div>;

  return (
    <div className="admin-dashboard">
      <nav className="dashboard-navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Shield className="logo-icon" />
            <span className="logo-text">Certify Admin</span>
          </div>
          <div className="nav-actions">
            <span className="user-info">{user.email}</span>
            <button onClick={handleLogout} className="btn-logout">
              <LogOut size={20} />
              Logout
            </button>
          </div>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="welcome-section">
          <h1>Welcome, Administrator</h1>
          <p>Manage and oversee the entire Certify platform</p>
          <button 
            onClick={() => {
              console.log('Manual refresh triggered');
              console.log('Current token:', token ? 'Available' : 'Missing');
              console.log('Current user:', user);
              fetchData();
            }}
            style={{
              marginTop: '10px',
              padding: '10px 20px',
              background: '#667eea',
              color: 'white',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer'
            }}
          >
            🔄 Refresh Data (Debug)
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon students">
              <Users size={32} />
            </div>
            <div className="stat-info">
              <h3>Students</h3>
              <p className="stat-number">{stats.totalStudents}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon institutes">
              <FileText size={32} />
            </div>
            <div className="stat-info">
              <h3>Institutes</h3>
              <p className="stat-number">{stats.totalInstitutes}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon companies">
              <BarChart size={32} />
            </div>
            <div className="stat-info">
              <h3>Companies</h3>
              <p className="stat-number">{stats.totalCompanies}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon certificates">
              <Award size={32} />
            </div>
            <div className="stat-info">
              <h3>Certificates</h3>
              <p className="stat-number">{stats.totalCertificates}</p>
            </div>
          </div>
        </div>

        {/* User Management Section */}
        <div className="user-management-section">
          <div className="section-header">
            <h2>User Management</h2>
            <p>View and manage all platform users</p>
          </div>

          <div className="filters-section">
            <div className="search-box">
              <Search size={20} />
              <input
                type="text"
                placeholder="Search by name, email, or organization..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            <div className="role-filters">
              <button 
                className={filterRole === 'All' ? 'active' : ''}
                onClick={() => setFilterRole('All')}
              >
                All ({users.length})
              </button>
              <button 
                className={filterRole === 'Student' ? 'active' : ''}
                onClick={() => setFilterRole('Student')}
              >
                Students ({users.filter(u => u.role === 'Student').length})
              </button>
              <button 
                className={filterRole === 'Institute' ? 'active' : ''}
                onClick={() => setFilterRole('Institute')}
              >
                Institutes ({users.filter(u => u.role === 'Institute').length})
              </button>
              <button 
                className={filterRole === 'Company' ? 'active' : ''}
                onClick={() => setFilterRole('Company')}
              >
                Companies ({users.filter(u => u.role === 'Company').length})
              </button>
            </div>
          </div>

          <div className="users-table-container">
            <table className="users-table">
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
                    <td colSpan="5" className="no-users">
                      No users found
                    </td>
                  </tr>
                ) : (
                  filteredUsers.map(u => (
                    <tr key={u.id}>
                      <td>
                        <div className="user-cell">
                          <div className="user-avatar">
                            {(u.full_name || u.email).charAt(0).toUpperCase()}
                          </div>
                          <div className="user-details">
                            <div className="user-name">{u.full_name || 'N/A'}</div>
                            <div className="user-email">{u.email}</div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`role-badge ${u.role.toLowerCase()}`}>
                          {u.role}
                        </span>
                      </td>
                      <td>{u.organization || 'N/A'}</td>
                      <td>{new Date(u.created_at).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button 
                            className="btn-view"
                            onClick={() => handleViewUser(u)}
                            title="View Activity"
                          >
                            <Eye size={16} />
                          </button>
                          <button 
                            className="btn-delete"
                            onClick={() => handleDeleteUser(u.id)}
                            title="Delete User"
                          >
                            <Trash2 size={16} />
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

        {/* Recent Activity Section */}
        {recentActivity.length > 0 && (
          <div className="recent-activity-section">
            <h2>Recent Activity</h2>
            <div className="activity-list">
              {recentActivity.map((activity, index) => (
                <div key={index} className="activity-item">
                  <Activity size={20} />
                  <div className="activity-details">
                    <p>
                      <strong>{activity.full_name || activity.email}</strong> 
                      <span className={`role-badge ${activity.role.toLowerCase()}`}>
                        {activity.role}
                      </span>
                      earned a certificate
                    </p>
                    <p className="activity-meta">
                      {activity.course_name} • {new Date(activity.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* User Activity Modal */}
      {selectedUser && (
        <div className="modal-overlay" onClick={() => setSelectedUser(null)}>
          <div className="modal-content user-activity-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2>User Activity</h2>
                <p>{selectedUser.full_name || selectedUser.email}</p>
              </div>
              <button className="btn-close" onClick={() => setSelectedUser(null)}>
                ×
              </button>
            </div>

            <div className="user-activity-content">
              <div className="user-info-card">
                <div className="user-avatar-large">
                  {(selectedUser.full_name || selectedUser.email).charAt(0).toUpperCase()}
                </div>
                <div className="user-info-details">
                  <h3>{selectedUser.full_name || 'N/A'}</h3>
                  <p>{selectedUser.email}</p>
                  <span className={`role-badge ${selectedUser.role.toLowerCase()}`}>
                    {selectedUser.role}
                  </span>
                  {selectedUser.organization && (
                    <p className="organization-name">
                      <FileText size={16} />
                      {selectedUser.organization}
                    </p>
                  )}
                  <p className="join-date">
                    Joined: {new Date(selectedUser.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {userActivity && (
                <div className="activity-summary">
                  <h3>Activity Summary</h3>
                  <div className="activity-stats">
                    <div className="activity-stat">
                      <Award size={24} />
                      <div>
                        <h4>{userActivity.totalCertificates}</h4>
                        <p>Certificates Earned</p>
                      </div>
                    </div>
                  </div>

                  {userActivity.certificatesEarned?.length > 0 && (
                    <div className="certificates-list">
                      <h4>Certificates</h4>
                      {userActivity.certificatesEarned.map((cert) => (
                        <div key={cert.id} className="certificate-item">
                          <Award size={20} />
                          <div className="cert-details">
                            <p className="cert-name">{cert.course_name}</p>
                            <p className="cert-meta">
                              {cert.institute_name} • {new Date(cert.issue_date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  {(!userActivity.certificatesEarned || userActivity.certificatesEarned.length === 0) && (
                    <div className="no-activity">
                      <Award size={48} />
                      <p>No certificates earned yet</p>
                    </div>
                  )}
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

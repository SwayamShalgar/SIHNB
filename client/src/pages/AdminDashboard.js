import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, LogOut, Users, FileText, BarChart, Settings, Award } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalCertificates: 0,
    totalInstitutes: 0,
    totalCompanies: 0
  });

  useEffect(() => {
    if (!isAuthenticated() || user?.role !== 'Admin') {
      navigate('/login');
      return;
    }

    fetchStats();
  }, [navigate, isAuthenticated, user]);

  const fetchStats = async () => {
    // Mock stats - you can implement actual API calls
    setStats({
      totalUsers: 250,
      totalCertificates: 1850,
      totalInstitutes: 45,
      totalCompanies: 32
    });
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  if (!user) return <div className="loading">Loading...</div>;

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
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon users">
              <Users size={32} />
            </div>
            <div className="stat-info">
              <h3>Total Users</h3>
              <p className="stat-number">{stats.totalUsers}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon certificates">
              <Award size={32} />
            </div>
            <div className="stat-info">
              <h3>Certificates Issued</h3>
              <p className="stat-number">{stats.totalCertificates}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon institutes">
              <FileText size={32} />
            </div>
            <div className="stat-info">
              <h3>Active Institutes</h3>
              <p className="stat-number">{stats.totalInstitutes}</p>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-icon companies">
              <BarChart size={32} />
            </div>
            <div className="stat-info">
              <h3>Partner Companies</h3>
              <p className="stat-number">{stats.totalCompanies}</p>
            </div>
          </div>
        </div>

        <div className="admin-sections">
          <div className="section-card" onClick={() => navigate('/dashboard')}>
            <Users size={48} />
            <h3>Manage Users</h3>
            <p>View, edit, and manage all platform users</p>
          </div>

          <div className="section-card" onClick={() => navigate('/dashboard')}>
            <Award size={48} />
            <h3>Certificate Management</h3>
            <p>Oversee all issued certificates</p>
          </div>

          <div className="section-card" onClick={() => navigate('/dashboard')}>
            <BarChart size={48} />
            <h3>Analytics & Reports</h3>
            <p>View platform statistics and reports</p>
          </div>

          <div className="section-card" onClick={() => navigate('/dashboard')}>
            <Settings size={48} />
            <h3>System Settings</h3>
            <p>Configure platform settings</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;

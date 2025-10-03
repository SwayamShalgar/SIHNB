import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Login from './pages/Login';
import Register from './pages/Register';
import IssueCertificate from './pages/IssueCertificate';
import VerifyCertificate from './pages/VerifyCertificate';
import ViewCertificate from './pages/ViewCertificate';
import Dashboard from './pages/Dashboard';
import AdminDashboard from './pages/AdminDashboard';
import InstituteDashboard from './pages/InstituteDashboard';
import StudentDashboard from './pages/StudentDashboard';
import CompanyDashboard from './pages/CompanyDashboard';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/issue" element={<IssueCertificate />} />
        <Route path="/verify" element={<VerifyCertificate />} />
        <Route path="/verify/:id" element={<ViewCertificate />} />
        <Route path="/certificate/:id" element={<ViewCertificate />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/institute-dashboard" element={<InstituteDashboard />} />
        <Route path="/student-dashboard" element={<StudentDashboard />} />
        <Route path="/company-dashboard" element={<CompanyDashboard />} />
      </Routes>
    </Router>
  );
}

export default App;

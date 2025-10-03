import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Shield, Award, CheckCircle, Users, Building2, Search, ChevronRight, Sparkles, LogOut, UserCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axios.get('/api/stats');
      if (response.data.success) {
        setStats(response.data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
      // Use fallback default values
      setStats({
        heroStats: {
          certificates: '0',
          institutes: '0',
          verified: '100%'
        }
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const getDashboardRoute = () => {
    if (!user) return '/login';
    
    const dashboardRoutes = {
      Admin: '/admin-dashboard',
      Institute: '/institute-dashboard',
      Student: '/student-dashboard',
      Company: '/company-dashboard'
    };
    
    return dashboardRoutes[user.role] || '/login';
  };

  const getIssueCertificateRoute = () => {
    // If not logged in, redirect to login
    if (!user) return '/login';
    
    // If logged in as Institute, go to issue certificate page
    if (user.role === 'Institute') return '/issue';
    
    // For other roles, redirect to their dashboard
    return getDashboardRoute();
  };

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')} style={{ cursor: 'pointer' }}>
            <Shield className="logo-icon" />
            <span className="logo-text">Certify</span>
          </div>
          <div className="nav-links">
            {/* Language Switcher */}
            <LanguageSwitcher />
            
            {/* DigiLocker Link */}
            <a 
              href="https://www.digilocker.gov.in/web/signup" 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-digilocker"
            >
              {t('nav.digiLocker')}
            </a>

            {/* Conditional Navigation based on authentication and role */}
            {isAuthenticated() ? (
              <>
                {/* Show Issue Certificate only for Institute role */}
                {user?.role === 'Institute' && (
                  <button onClick={() => navigate('/issue')} className="btn-primary">
                    {t('nav.issueCertificate')}
                  </button>
                )}
                
                {/* Show Dashboard for logged-in users */}
                <button onClick={() => navigate(getDashboardRoute())} className="btn-secondary">
                  {t('nav.dashboard')}
                </button>
                
                {/* Profile button */}
                <button onClick={() => navigate('/profile')} className="btn-profile-nav">
                  <UserCircle size={18} />
                  {t('nav.profile')}
                </button>
                
                {/* Logout button */}
                <button onClick={handleLogout} className="btn-logout-nav">
                  <LogOut size={18} />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                {/* Show Login and Register for non-authenticated users */}
                <button onClick={() => navigate('/login')} className="btn-secondary">
                  {t('nav.login')}
                </button>
                <button onClick={() => navigate('/register')} className="btn-primary">
                  {t('nav.register')}
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <div className="badge">
              <Sparkles size={14} />
              <span>Blockchain-Powered Verification</span>
            </div>
            <h1 className="hero-title">
              {t('hero.title')}
            </h1>
            <p className="hero-subtitle">
              {t('hero.subtitle')}
            </p>
            <div className="hero-buttons">
              <button onClick={() => navigate(getDashboardRoute())} className="btn-hero-primary">
                {t('hero.getStarted')}
                <ChevronRight size={20} />
              </button>
              <button onClick={() => navigate('/verify')} className="btn-hero-secondary">
                <Search size={20} />
                {t('nav.verifyCertificate')}
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">
                  {loading ? '...' : stats?.heroStats?.certificates || '0'}
                </span>
                <span className="stat-label">{t('hero.stats.certificates')}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">
                  {loading ? '...' : stats?.heroStats?.institutes || '0'}
                </span>
                <span className="stat-label">{t('hero.stats.institutes')}</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">
                  {loading ? '...' : stats?.heroStats?.verified || '100%'}
                </span>
                <span className="stat-label">{t('hero.stats.verified')}</span>
              </div>
            </div>
          </div>
          <div className="hero-visual">
            <div className="floating-card card-1">
              <div className="card-icon">
                <Award />
              </div>
              <div className="card-content">
                <div className="card-title">Certificate Issued</div>
                <div className="card-subtitle">Stored on blockchain</div>
              </div>
              <div className="card-status verified">✓</div>
            </div>
            <div className="floating-card card-2">
              <div className="card-icon">
                <Shield />
              </div>
              <div className="card-content">
                <div className="card-title">Verified</div>
                <div className="card-subtitle">Authenticity confirmed</div>
              </div>
              <div className="card-badge">Blockchain</div>
            </div>
            <div className="glow-orb orb-1"></div>
            <div className="glow-orb orb-2"></div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{t('features.title')}</h2>
            <p className="section-subtitle">
              {t('features.subtitle')}
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon blue">
                <Shield />
              </div>
              <h3>{t('features.blockchain.title')}</h3>
              <p>{t('features.blockchain.description')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon green">
                <CheckCircle />
              </div>
              <h3>{t('features.instant.title')}</h3>
              <p>{t('features.instant.description')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon purple">
                <Award />
              </div>
              <h3>{t('features.transparency.title')}</h3>
              <p>{t('features.transparency.description')}</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon blue">
                <Building2 />
              </div>
              <h3>{t('features.integration.title')}</h3>
              <p>{t('features.integration.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">{t('howItWorks.title')}</h2>
            <p className="section-subtitle">{t('howItWorks.subtitle')}</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-icon">
                <Building2 />
              </div>
              <h3>{t('howItWorks.institute.title')}</h3>
              <p>{t('howItWorks.institute.description')}</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-icon">
                <Shield />
              </div>
              <h3>{t('howItWorks.blockchain.title')}</h3>
              <p>{t('howItWorks.blockchain.description')}</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-icon">
                <CheckCircle />
              </div>
              <h3>{t('howItWorks.verify.title')}</h3>
              <p>{t('howItWorks.verify.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="section-container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="section-title">{t('benefits.title')}</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>{t('benefits.institutes.title')}</h4>
                    <p>{t('benefits.institutes.feature1')}</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>{t('benefits.students.title')}</h4>
                    <p>{t('benefits.students.feature1')}</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>{t('benefits.companies.title')}</h4>
                    <p>{t('benefits.companies.feature1')}</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>{t('benefits.institutes.feature3')}</h4>
                    <p>{t('benefits.students.feature3')}</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="benefits-visual">
              <div className="benefit-card">
                <div className="benefit-card-header">
                  <Shield size={24} />
                  <span>Blockchain Verified</span>
                </div>
                <div className="benefit-card-body">
                  <div className="verification-badge">
                    <CheckCircle size={48} color="#10b981" />
                  </div>
                  <h3>100% Authentic</h3>
                  <p>This certificate is verified and tamper-proof</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-container">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
          <div className="cta-buttons">
            <button onClick={() => navigate(getIssueCertificateRoute())} className="btn-cta-primary">
              {t('nav.issueCertificate')}
            </button>
            <button onClick={() => navigate(getDashboardRoute())} className="btn-cta-secondary">
              {t('nav.dashboard')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-container">
          <div className="footer-brand">
            <div className="footer-logo">
              <Shield size={24} />
              <span>Certify</span>
            </div>
            <p>{t('footer.description')}</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>{t('footer.product')}</h4>
              <a href="#features">{t('footer.features')}</a>
              <a href="#how-it-works">{t('nav.howItWorks')}</a>
              <a href="/dashboard">{t('nav.dashboard')}</a>
            </div>
            <div className="footer-column">
              <h4>{t('footer.company')}</h4>
              <a href="#" onClick={(e) => { e.preventDefault(); navigate(getIssueCertificateRoute()); }}>{t('nav.issueCertificate')}</a>
              <a href="/verify">{t('nav.verifyCertificate')}</a>
            </div>
            <div className="footer-column">
              <h4>{t('footer.legal')}</h4>
              <a href="https://www.digilocker.gov.in/web/signup" target="_blank" rel="noopener noreferrer">{t('nav.digiLocker')}</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Certify. {t('footer.allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

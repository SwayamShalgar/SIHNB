import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { 
  Shield, Award, CheckCircle, Users, Building2, Search, 
  ArrowRight, Sparkles, LogOut, Zap, Globe 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import LanguageSwitcher from '../components/LanguageSwitcher';
import axios from 'axios';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const [stats, setStats] = useState(null);

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
      setStats({
        heroStats: {
          certificates: '13',
          institutes: '3',
          verified: '100%'
        }
      });
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
    if (!user) return '/login';
    if (user.role === 'Institute') return '/issue';
    return getDashboardRoute();
  };

  return (
    <div className="landing-page-centered">
      {/* Navigation */}
      <nav className="navbar-centered">
        <div className="nav-container-centered">
          <div className="nav-logo-centered" onClick={() => navigate('/')}>
            <div className="logo-icon-centered">
              <Shield size={28} />
            </div>
            <span className="logo-text-centered">Certify</span>
          </div>

          <div className="nav-menu-centered">
            <a href="#features">{t('nav.features')}</a>
            <a href="#how-it-works">{t('nav.howItWorks')}</a>
            <a href="#benefits">{t('nav.benefits')}</a>
            <a 
              href="https://www.digilocker.gov.in/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="digilocker-link-highlight"
            >
              <Sparkles size={14} />
              DigiLocker
            </a>
          </div>

          <div className="nav-actions-centered">
            <LanguageSwitcher />
            
            {isAuthenticated() && user ? (
              <>
                <button 
                  className="btn-nav-secondary"
                  onClick={() => navigate(getDashboardRoute())}
                >
                  {t('nav.dashboard')}
                </button>
                <button className="btn-nav-primary" onClick={handleLogout}>
                  <LogOut size={18} />
                  {t('nav.logout')}
                </button>
              </>
            ) : (
              <>
                <button 
                  className="btn-nav-secondary"
                  onClick={() => navigate('/login')}
                >
                  {t('nav.login')}
                </button>
                <button 
                  className="btn-nav-primary"
                  onClick={() => navigate('/register')}
                >
                  {t('hero.getStarted')}
                  <ArrowRight size={18} />
                </button>
              </>
            )}
          </div>
        </div>
      </nav>

      {/* Centered Hero Section */}
      <section className="hero-centered">
        <div className="hero-container-centered">
          <div className="hero-content-centered">
            {/* Badge */}
            <div className="hero-badge-centered">
              <Sparkles size={16} />
              <span>{t('Blockchain-Powered Certification') || 'Blockchain-Powered Certification'}</span>
            </div>

            {/* Title */}
            <h1 className="hero-title-centered">
              {t('hero.title')}
              <span className="gradient-text-centered">{t('Digital Certificates') || 'Digital Certificates'}</span>
            </h1>

            {/* Subtitle */}
            <p className="hero-subtitle-centered">
              {t('hero.subtitle')}
            </p>

            {/* Action Buttons */}
            <div className="hero-buttons-centered">
              <button 
                className="btn-hero-primary-centered"
                onClick={() => navigate(getIssueCertificateRoute())}
              >
                {t('nav.issueCertificate')}
                <ArrowRight size={20} />
              </button>
              <button 
                className="btn-hero-secondary-centered"
                onClick={() => navigate('/verify')}
              >
                <Search size={20} />
                {t('nav.verifyCertificate')}
              </button>
            </div>

            {/* Stats */}
            {stats && (
              <div className="hero-stats-centered">
                <div className="stat-centered">
                  <div className="stat-number-centered">
                    {stats.heroStats?.certificates || '13'}
                  </div>
                  <div className="stat-label-centered">{t('hero.stats.certificates')}</div>
                </div>
                <div className="stat-divider-centered"></div>
                <div className="stat-centered">
                  <div className="stat-number-centered">
                    {stats.heroStats?.institutes || '3'}
                  </div>
                  <div className="stat-label-centered">{t('hero.stats.institutes')}</div>
                </div>
                <div className="stat-divider-centered"></div>
                <div className="stat-centered">
                  <div className="stat-number-centered">
                    {stats.heroStats?.verified || '100%'}
                  </div>
                  <div className="stat-label-centered">{t('hero.stats.verified')}</div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="features-section-centered">
        <div className="section-container-centered">
          <div className="section-header-centered">
            <div className="section-badge-centered">
              <Sparkles size={16} />
              {t('nav.features')}
            </div>
            <h2 className="section-title-centered">{t('features.title')}</h2>
            <p className="section-subtitle-centered">
              {t('features.subtitle')}
            </p>
          </div>

          <div className="features-grid-centered">
            <div className="feature-card-centered">
              <div className="feature-icon-centered gradient-blue">
                <Shield size={28} />
              </div>
              <h3>{t('features.blockchain.title')}</h3>
              <p>{t('features.blockchain.description')}</p>
            </div>

            <div className="feature-card-centered">
              <div className="feature-icon-centered gradient-green">
                <Zap size={28} />
              </div>
              <h3>{t('features.instant.title')}</h3>
              <p>{t('features.instant.description')}</p>
            </div>

            <div className="feature-card-centered">
              <div className="feature-icon-centered gradient-purple">
                <Globe size={28} />
              </div>
              <h3>{t('features.transparency.title')}</h3>
              <p>{t('features.transparency.description')}</p>
            </div>

            <div className="feature-card-centered">
              <div className="feature-icon-centered gradient-orange">
                <Award size={28} />
              </div>
              <h3>{t('features.integration.title')}</h3>
              <p>{t('features.integration.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="how-it-works-centered">
        <div className="section-container-centered">
          <div className="section-header-centered">
            <div className="section-badge-centered">
              <Sparkles size={16} />
              {t('howItWorks.process') || 'Process'}
            </div>
            <h2 className="section-title-centered">{t('howItWorks.title')}</h2>
            <p className="section-subtitle-centered">
              {t('howItWorks.subtitle')}
            </p>
          </div>

          <div className="steps-centered">
            <div className="step-centered">
              <div className="step-number-centered">01</div>
              <div className="step-icon-centered gradient-blue">
                <Building2 size={32} />
              </div>
              <h3>{t('howItWorks.institute.title')}</h3>
              <p>{t('howItWorks.institute.description')}</p>
            </div>

            <div className="step-arrow-centered">
              <ArrowRight size={24} />
            </div>

            <div className="step-centered">
              <div className="step-number-centered">02</div>
              <div className="step-icon-centered gradient-purple">
                <Shield size={32} />
              </div>
              <h3>{t('howItWorks.blockchain.title')}</h3>
              <p>{t('howItWorks.blockchain.description')}</p>
            </div>

            <div className="step-arrow-centered">
              <ArrowRight size={24} />
            </div>

            <div className="step-centered">
              <div className="step-number-centered">03</div>
              <div className="step-icon-centered gradient-green">
                <CheckCircle size={32} />
              </div>
              <h3>{t('howItWorks.verify.title')}</h3>
              <p>{t('howItWorks.verify.description')}</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section-centered">
        <div className="section-container-centered">
          <div className="section-header-centered">
            <div className="section-badge-centered">
              <Sparkles size={16} />
              {t('nav.benefits')}
            </div>
            <h2 className="section-title-centered">{t('benefits.title')}</h2>
          </div>

          <div className="benefits-grid-centered">
            <div className="benefit-card-centered">
              <div className="benefit-header-centered">
                <Building2 size={24} />
                <h3>{t('benefits.institutes.title')}</h3>
              </div>
              <div className="benefit-list-centered">
                <div className="benefit-item-centered">
                  <CheckCircle size={20} />
                  <span>{t('benefits.institutes.feature1')}</span>
                </div>
                <div className="benefit-item-centered">
                  <CheckCircle size={20} />
                  <span>{t('benefits.institutes.feature2')}</span>
                </div>
                <div className="benefit-item-centered">
                  <CheckCircle size={20} />
                  <span>{t('benefits.institutes.feature3')}</span>
                </div>
              </div>
            </div>

            <div className="benefit-card-centered">
              <div className="benefit-header-centered">
                <Users size={24} />
                <h3>{t('benefits.students.title')}</h3>
              </div>
              <div className="benefit-list-centered">
                <div className="benefit-item-centered">
                  <CheckCircle size={20} />
                  <span>{t('benefits.students.feature1')}</span>
                </div>
                <div className="benefit-item-centered">
                  <CheckCircle size={20} />
                  <span>{t('benefits.students.feature2')}</span>
                </div>
                <div className="benefit-item-centered">
                  <CheckCircle size={20} />
                  <span>{t('benefits.students.feature3')}</span>
                </div>
              </div>
            </div>

            <div className="benefit-card-centered">
              <div className="benefit-header-centered">
                <Award size={24} />
                <h3>{t('benefits.companies.title')}</h3>
              </div>
              <div className="benefit-list-centered">
                <div className="benefit-item-centered">
                  <CheckCircle size={20} />
                  <span>{t('benefits.companies.feature1')}</span>
                </div>
                <div className="benefit-item-centered">
                  <CheckCircle size={20} />
                  <span>{t('benefits.companies.feature2')}</span>
                </div>
                <div className="benefit-item-centered">
                  <CheckCircle size={20} />
                  <span>{t('benefits.companies.feature3')}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="cta-section-centered">
        <div className="cta-container-centered">
          <h2>{t('cta.title')}</h2>
          <p>{t('cta.subtitle')}</p>
          <div className="cta-buttons-centered">
            <button 
              className="btn-cta-primary-centered"
              onClick={() => navigate('/register')}
            >
              {t('cta.button')}
              <ArrowRight size={20} />
            </button>
            <button 
              className="btn-cta-secondary-centered"
              onClick={() => navigate('/verify')}
            >
              <Search size={20} />
              {t('nav.verifyCertificate')}
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer-centered">
        <div className="footer-container-centered">
          <div className="footer-brand-centered">
            <div className="footer-logo-centered">
              <Shield size={28} />
              <span>Certify</span>
            </div>
            <p>{t('footer.description')}</p>
          </div>

          <div className="footer-column-centered">
            <h4>{t('footer.product')}</h4>
            <a href="#features">{t('nav.features')}</a>
            <a href="#how-it-works">{t('nav.howItWorks')}</a>
            <a href="#benefits">{t('nav.benefits')}</a>
            <a href="/verify">{t('nav.verifyCertificate')}</a>
          </div>

          <div className="footer-column-centered">
            <h4>{t('footer.company')}</h4>
            <a href="/about">{t('footer.about')}</a>
            <a href="/contact">{t('footer.contact')}</a>
            <a href="/careers">{t('footer.careers')}</a>
            <a href="/blog">{t('footer.blog')}</a>
          </div>

          <div className="footer-column-centered">
            <h4>{t('footer.legal')}</h4>
            <a href="/privacy">{t('footer.privacy')}</a>
            <a href="/terms">{t('footer.terms')}</a>
            <a href="/security">{t('footer.security') || 'Security'}</a>
          </div>
        </div>

        <div className="footer-bottom-centered">
          <p>&copy; 2025 Certify. {t('footer.allRightsReserved')}</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

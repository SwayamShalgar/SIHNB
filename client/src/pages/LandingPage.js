import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, Award, CheckCircle, Users, Building2, Search, ChevronRight, Sparkles } from 'lucide-react';
import '../styles/LandingPage.css';

const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="landing-page">
      {/* Navigation */}
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo">
            <Shield className="logo-icon" />
            <span className="logo-text">Certify</span>
          </div>
          <div className="nav-links">
            <a href="#features">Features</a>
            <a href="#how-it-works">How it Works</a>
            <a href="#benefits">Benefits</a>
            <button onClick={() => navigate('/verify')} className="btn-secondary">
              Verify Certificate
            </button>
            <button onClick={() => navigate('/issue')} className="btn-primary">
              Issue Certificate
            </button>
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
              Digital Certificates,
              <br />
              <span className="gradient-text">Verified Forever</span>
            </h1>
            <p className="hero-subtitle">
              Issue tamper-proof certificates, enable instant verification, and build trust
              with blockchain technology. No more fake credentials.
            </p>
            <div className="hero-buttons">
              <button onClick={() => navigate('/issue')} className="btn-hero-primary">
                Get Started Free
                <ChevronRight size={20} />
              </button>
              <button onClick={() => navigate('/verify')} className="btn-hero-secondary">
                <Search size={20} />
                Verify a Certificate
              </button>
            </div>
            <div className="hero-stats">
              <div className="stat-item">
                <span className="stat-number">100%</span>
                <span className="stat-label">Secure</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">Instant</span>
                <span className="stat-label">Verification</span>
              </div>
              <div className="stat-divider"></div>
              <div className="stat-item">
                <span className="stat-number">Forever</span>
                <span className="stat-label">On Blockchain</span>
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
            <h2 className="section-title">Built for Trust</h2>
            <p className="section-subtitle">
              Everything you need to issue and verify certificates with complete confidence
            </p>
          </div>
          <div className="features-grid">
            <div className="feature-card">
              <div className="feature-icon blue">
                <Building2 />
              </div>
              <h3>For Institutes</h3>
              <p>Issue certificates in seconds. Generate beautiful PDFs with QR codes and store them permanently on blockchain.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon green">
                <Award />
              </div>
              <h3>For Learners</h3>
              <p>Access your certificates anytime, anywhere. Share them with employers with a simple link or QR code scan.</p>
            </div>
            <div className="feature-card">
              <div className="feature-icon purple">
                <CheckCircle />
              </div>
              <h3>For Employers</h3>
              <p>Verify any certificate instantly. Scan QR code or enter certificate ID to check authenticity in real-time.</p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="how-it-works-section">
        <div className="section-container">
          <div className="section-header">
            <h2 className="section-title">How It Works</h2>
            <p className="section-subtitle">Three simple steps to secure, verifiable certificates</p>
          </div>
          <div className="steps-container">
            <div className="step">
              <div className="step-number">01</div>
              <div className="step-icon">
                <Building2 />
              </div>
              <h3>Issue Certificate</h3>
              <p>Institute enters learner details and course information. System generates a beautiful PDF certificate with a unique QR code.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">02</div>
              <div className="step-icon">
                <Shield />
              </div>
              <h3>Blockchain Storage</h3>
              <p>Certificate hash is permanently stored on Polygon blockchain. This ensures the certificate can never be tampered with.</p>
            </div>
            <div className="step-connector"></div>
            <div className="step">
              <div className="step-number">03</div>
              <div className="step-icon">
                <CheckCircle />
              </div>
              <h3>Instant Verification</h3>
              <p>Anyone can verify the certificate by scanning the QR code or entering the certificate ID. Results in seconds.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section id="benefits" className="benefits-section">
        <div className="section-container">
          <div className="benefits-content">
            <div className="benefits-text">
              <h2 className="section-title">Why Choose Certify?</h2>
              <div className="benefits-list">
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>Immutable Records</h4>
                    <p>Certificates stored on blockchain cannot be altered or deleted</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>Instant Verification</h4>
                    <p>Verify authenticity in seconds, not days or weeks</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>Cost Effective</h4>
                    <p>No expensive verification services or middlemen required</p>
                  </div>
                </div>
                <div className="benefit-item">
                  <div className="benefit-check">✓</div>
                  <div>
                    <h4>Global Access</h4>
                    <p>Access and verify certificates from anywhere in the world</p>
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
          <h2>Ready to Get Started?</h2>
          <p>Join institutes worldwide using blockchain to secure their certificates</p>
          <div className="cta-buttons">
            <button onClick={() => navigate('/issue')} className="btn-cta-primary">
              Issue Your First Certificate
            </button>
            <button onClick={() => navigate('/dashboard')} className="btn-cta-secondary">
              View Dashboard
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
            <p>Secure, verifiable certificates powered by blockchain technology.</p>
          </div>
          <div className="footer-links">
            <div className="footer-column">
              <h4>Product</h4>
              <a href="#features">Features</a>
              <a href="#how-it-works">How it Works</a>
              <a href="/dashboard">Dashboard</a>
            </div>
            <div className="footer-column">
              <h4>Actions</h4>
              <a href="/issue">Issue Certificate</a>
              <a href="/verify">Verify Certificate</a>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Certify. Built with blockchain technology.</p>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;

// src/components/About.jsx
import React from 'react';
import '../styles/About.css';

const About = () => {
  return (
    <section className="about-section" id="about">
      <div className="about-container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="text-gradient">What is</span> FiNOVA?
          </h2>
          <div className="title-underline"></div>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p className="about-description">
              FiNOVA is a futuristic platform powered by advanced AI algorithms to
              ensure fast, low-cost, and secure digital asset distributions, creating
              a truly decentralized and intelligent experience.
            </p>
            
            <div className="about-features">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Secure & Trustless</h3>
                <p className="feature-desc">
                  Fully decentralized infrastructure ensuring your assets remain secure and in your control.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="14.31" y1="8" x2="20.05" y2="17.94"></line>
                    <line x1="9.69" y1="8" x2="21.17" y2="8"></line>
                    <line x1="7.38" y1="12" x2="13.12" y2="2.06"></line>
                    <line x1="9.69" y1="16" x2="3.95" y2="6.06"></line>
                    <line x1="14.31" y1="16" x2="2.83" y2="16"></line>
                    <line x1="16.62" y1="12" x2="10.88" y2="21.94"></line>
                  </svg>
                </div>
                <h3 className="feature-title">AI-Powered</h3>
                <p className="feature-desc">
                  Advanced algorithms ensure fair distribution and optimal performance.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="16 3 21 3 21 8"></polyline>
                    <line x1="4" y1="20" x2="21" y2="3"></line>
                    <polyline points="21 16 21 21 16 21"></polyline>
                    <line x1="15" y1="15" x2="21" y2="21"></line>
                    <line x1="4" y1="4" x2="9" y2="9"></line>
                  </svg>
                </div>
                <h3 className="feature-title">Low Gas Fees</h3>
                <p className="feature-desc">
                  Optimized transactions mean you keep more of your assets.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
                    <line x1="8" y1="21" x2="16" y2="21"></line>
                    <line x1="12" y1="17" x2="12" y2="21"></line>
                  </svg>
                </div>
                <h3 className="feature-title">Multi-Chain</h3>
                <p className="feature-desc">
                  Seamlessly operate across multiple blockchains with unified experience.
                </p>
              </div>
            </div>
          </div>

          <div className="about-visual">
            <div className="about-graphic">
              <div className="cube-container">
                <div className="cube">
                  <div className="cube-face front"></div>
                  <div className="cube-face back"></div>
                  <div className="cube-face right"></div>
                  <div className="cube-face left"></div>
                  <div className="cube-face top"></div>
                  <div className="cube-face bottom"></div>
                </div>
              </div>
              <div className="orbit-container">
                <div className="about-orbit"></div>
              </div>
            </div>
            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-value"><span className="counter">100</span>%</div>
                <div className="stat-label">Fair Distribution</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">$<span className="counter">0</span></div>
                <div className="stat-label">Gas Optimization</div>
              </div>
              <div className="stat-item">
                <div className="stat-value"><span className="counter">24</span>/7</div>
                <div className="stat-label">AI Support</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
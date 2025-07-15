// src/components/Footer.jsx
import React from 'react';
import '../styles/Footer.css';

const Footer = () => {
  // Get current year for copyright
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-main">
            <div className="footer-logo">
              <span className="logo-text">FINOVA</span>
              <span className="logo-highlight">AI</span>
            </div>
            <p className="footer-tagline">
              AI-powered financial solutions for the modern world
            </p>
          </div>

          <div className="footer-links-section">
            <div className="footer-section">
              <h3>Quick Links</h3>
              <ul>
                <li><a href="#about">About</a></li>
                <li><a href="#tokenomics">Tokenomics</a></li>
                <li><a href="#roadmap">Roadmap</a></li>
                <li><a href="/claim-airdrop">Claim Airdrop</a></li>
              </ul>
            </div>

            <div className="footer-section">
              <h3>Connect</h3>
              <div className="social-icons">
                <a href="https://twitter.com/finovaai" target="_blank" rel="noopener noreferrer" className="social-icon" title="Twitter">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                </a>
                <a href="https://discord.gg/finovaai" target="_blank" rel="noopener noreferrer" className="social-icon" title="Discord">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M18 6a3 3 0 0 0-3-3H7a3 3 0 0 0-3 3v12a3 3 0 0 0 3 3h8a3 3 0 0 0 3-3 1 1 0 0 0 1-1v-2a1 1 0 0 0-1-1h.5a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2H18Z"></path>
                    <path d="M10.2 12.72 14.8 9.8a.53.53 0 0 1 .77.47v5.46a.53.53 0 0 1-.77.47l-4.6-2.92a.53.53 0 0 1 0-.9Z"></path>
                  </svg>
                </a>
                <a href="#telegram" target="_blank" rel="noopener noreferrer" className="social-icon" title="Telegram">
                  <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="m22 2-7 20-4-9-9-4Z"></path>
                    <path d="M22 2 11 13"></path>
                  </svg>
                </a>
              </div>
            </div>
          </div>
        </div>

        <div className="footer-bottom">
          <p className="copyright">© {currentYear} FINOVA AI. All rights reserved.</p>
          <div className="footer-legal">
            <a href="#privacy">Privacy</a>
            <span className="divider">|</span>
            <a href="#terms">Terms</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
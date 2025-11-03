// src/components/Footer.jsx - Improved Responsive Design
import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Footer.css';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="footer">
      <div className="footer-container">
        {/* Footer Top */}
        <div className="footer-top">
          <div className="footer-brand">
            <Link to="/" className="footer-logo">
              <span className="logo-text">3I/ATLAS</span>
              <span className="logo-ai">AI</span>
            </Link>
            <p className="footer-tagline">
              The Interstellar Meme Coin where Intelligence meets Innovation
            </p>
            <div className="footer-socials">
              <a href="https://x.com/ai_atlas91513?s=21" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Twitter">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"></path>
                </svg>
              </a>
              <a href="https://t.me/+yRIV4hz4Dlw0ZWJh" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Telegram">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="22" y1="2" x2="11" y2="13"></line>
                  <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                </svg>
              </a>
              {/* <a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="footer-social-link" aria-label="Discord">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20.317 4.37a19.791 19.791 0 0 0-4.885-1.515a.074.074 0 0 0-.079.037c-.21.375-.444.864-.608 1.25a18.27 18.27 0 0 0-5.487 0a12.64 12.64 0 0 0-.617-1.25a.077.077 0 0 0-.079-.037A19.736 19.736 0 0 0 3.677 4.37a.07.07 0 0 0-.032.027C.533 9.046-.32 13.58.099 18.057a.082.082 0 0 0 .031.057a19.9 19.9 0 0 0 5.993 3.03a.078.078 0 0 0 .084-.028a14.09 14.09 0 0 0 1.226-1.994a.076.076 0 0 0-.041-.106a13.107 13.107 0 0 1-1.872-.892a.077.077 0 0 1-.008-.128a10.2 10.2 0 0 0 .372-.292a.074.074 0 0 1 .077-.01c3.928 1.793 8.18 1.793 12.062 0a.074.074 0 0 1 .078.01c.12.098.246.198.373.292a.077.077 0 0 1-.006.127a12.299 12.299 0 0 1-1.873.892a.077.077 0 0 0-.041.107c.36.698.772 1.362 1.225 1.993a.076.076 0 0 0 .084.028a19.839 19.839 0 0 0 6.002-3.03a.077.077 0 0 0 .032-.054c.5-5.177-.838-9.674-3.549-13.66a.061.061 0 0 0-.031-.03zM8.02 15.33c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.956-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.956 2.418-2.157 2.418zm7.975 0c-1.183 0-2.157-1.085-2.157-2.419c0-1.333.955-2.419 2.157-2.419c1.21 0 2.176 1.096 2.157 2.42c0 1.333-.946 2.418-2.157 2.418z"/>
                </svg>
              </a> */}
            </div>
          </div>

          <div className="footer-links">
            <div className="footer-column">
              <h4 className="footer-title">Quick Links</h4>
              <ul className="footer-list">
                <li><a href="#home" className="footer-link">Home</a></li>
                <li><a href="#about" className="footer-link">About</a></li>
                <li><a href="#howtobuy" className="footer-link">How to Buy</a></li>
                <li><a href="#tokenomics" className="footer-link">Tokenomics</a></li>
                <li><a href="#roadmap" className="footer-link">Roadmap</a></li>
              </ul>
            </div>

            <div className="footer-column">
              <h4 className="footer-title">Community</h4>
              <ul className="footer-list">
                <li><a href="https://x.com/ai_atlas91513?s=21" target="_blank" rel="noopener noreferrer" className="footer-link">Twitter</a></li>
                <li><a href="https://t.me/+yRIV4hz4Dlw0ZWJh" target="_blank" rel="noopener noreferrer" className="footer-link">Telegram</a></li>
                {/* <li><a href="https://discord.com" target="_blank" rel="noopener noreferrer" className="footer-link">Discord</a></li>
                <li><a href="https://medium.com" target="_blank" rel="noopener noreferrer" className="footer-link">Medium</a></li> */}
              </ul>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div className="footer-bottom">
          <div className="footer-bottom-content">
            <p className="footer-copyright">
              © {currentYear} 3I/ATLAS AI. All rights reserved.
            </p>
            <div className="footer-legal">
              <a href="#privacy" className="footer-legal-link">Privacy Policy</a>
              <span className="footer-separator">•</span>
              <a href="#terms" className="footer-legal-link">Terms of Service</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
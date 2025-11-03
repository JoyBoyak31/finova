// src/components/About.jsx - Interstellar Theme with Starfield
import React, { useEffect, useRef } from 'react';
import '../styles/About.css';

const About = () => {
  const starsRef = useRef(null);

  // Generate starfield background
  useEffect(() => {
    const generateStars = () => {
      if (!starsRef.current) return;
      
      const starsContainer = starsRef.current;
      starsContainer.innerHTML = '';
      
      // Create fewer stars than Hero (about 100)
      for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'about-star';
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        
        // Random size
        const sizeType = Math.random();
        if (sizeType > 0.9) {
          star.classList.add('about-star-large');
        } else if (sizeType > 0.7) {
          star.classList.add('about-star-medium');
        } else {
          star.classList.add('about-star-small');
        }
        
        // Random twinkle delay
        star.style.animationDelay = `${Math.random() * 4}s`;
        
        starsContainer.appendChild(star);
      }
    };

    generateStars();

    const handleResize = () => {
      generateStars();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="about-section" id="about">
      {/* Starfield Background */}
      <div className="about-bg">
        <div ref={starsRef} className="about-stars-container"></div>
        <div className="about-gradient-overlay"></div>
      </div>

      <div className="about-container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="text-gradient">What is</span> 3I/ATLAS AI?
          </h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">
            The convergence of Interstellar Intelligence and Artificial Intelligence
          </p>
        </div>

        <div className="about-content">
          <div className="about-text">
            <p className="about-description">
              3I/ATLAS AI is inspired by the mysterious interstellar comet 3I/ATLAS, 
              which scientists believe came from beyond our solar system. Discussed by 
              Elon Musk on The Joe Rogan Experience, this enigmatic object represents 
              the unknown — and unlimited potential.
            </p>
            
            <div className="about-features">
              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"></path>
                    <path d="M2 12h20"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Interstellar Origin</h3>
                <p className="feature-desc">
                  Born from the mystery of a comet that traveled across galaxies to reach us.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                  </svg>
                </div>
                <h3 className="feature-title">Zero Tax</h3>
                <p className="feature-desc">
                  0% buy and sell tax. Keep more of what you earn on your cosmic journey.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M12 2L2 7l10 5 10-5-10-5z"></path>
                    <path d="M2 17l10 5 10-5"></path>
                    <path d="M2 12l10 5 10-5"></path>
                  </svg>
                </div>
                <h3 className="feature-title">AI-Powered</h3>
                <p className="feature-desc">
                  Advanced artificial intelligence meets interstellar mystery.
                </p>
              </div>

              <div className="feature-card">
                <div className="feature-icon">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
                    <polyline points="7.5 4.21 12 6.81 16.5 4.21"></polyline>
                    <polyline points="7.5 19.79 7.5 14.6 3 12"></polyline>
                    <polyline points="21 12 16.5 14.6 16.5 19.79"></polyline>
                    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
                    <line x1="12" y1="22.08" x2="12" y2="12"></line>
                  </svg>
                </div>
                <h3 className="feature-title">Community Driven</h3>
                <p className="feature-desc">
                  Built by explorers and visionaries who see beyond the horizon.
                </p>
              </div>
            </div>
          </div>

          <div className="about-visual">
            {/* Unique Orbital Animation - Different from Hero */}
            <div className="about-graphic">
              <div className="planet-system">
                {/* Central Planet with rings */}
                <div className="planet-core"></div>
                <div className="planet-ring ring-1"></div>
                <div className="planet-ring ring-2"></div>
                
                {/* Orbiting satellites */}
                <div className="satellite-orbit orbit-a">
                  <div className="satellite"></div>
                </div>
                <div className="satellite-orbit orbit-b">
                  <div className="satellite"></div>
                </div>
                <div className="satellite-orbit orbit-c">
                  <div className="satellite"></div>
                </div>
              </div>
            </div>

            <div className="stats-container">
              <div className="stat-item">
                <div className="stat-value">1B</div>
                <div className="stat-label">Total Supply</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">0%</div>
                <div className="stat-label">Tax</div>
              </div>
              <div className="stat-item">
                <div className="stat-value">∞</div>
                <div className="stat-label">Potential</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
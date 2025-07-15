// src/components/Hero.jsx
import React, { useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
  const orbitRef = useRef(null);
  const particlesRef = useRef(null);

  // Initialize particle animation
  useEffect(() => {
    const generateParticles = () => {
      if (!particlesRef.current) return;
      
      const particlesContainer = particlesRef.current;
      particlesContainer.innerHTML = '';
      
      // Create particles
      for (let i = 0; i < 50; i++) {
        const particle = document.createElement('div');
        particle.className = 'particle';
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        particle.style.left = `${posX}%`;
        particle.style.top = `${posY}%`;
        
        // Random size
        const size = Math.random() * 6 + 1;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;
        
        // Random opacity
        particle.style.opacity = Math.random() * 0.5 + 0.1;
        
        // Random animation duration
        const duration = Math.random() * 20 + 10;
        particle.style.animation = `float ${duration}s ease-in-out infinite`;
        particle.style.animationDelay = `${Math.random() * 5}s`;
        
        particlesContainer.appendChild(particle);
      }
    };

    generateParticles();
    
    // Initialize orbit animation
    if (orbitRef.current) {
      const orbitElements = orbitRef.current.querySelectorAll('.orbit-element');
      orbitElements.forEach((el, index) => {
        const delay = index * 1.5;
        el.style.animationDelay = `${delay}s`;
      });
    }

    // Handle resize
    const handleResize = () => {
      generateParticles();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="hero-section" id="home">
      {/* Animated background */}
      <div className="hero-bg">
        <div ref={particlesRef} className="particles-container"></div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Main content */}
      <div className="hero-content">
        <div className="hero-text">
          <h1 className="hero-title">
            <span className="text-gradient">FINOVA</span>
            <span className="hero-subtitle">AI</span>
          </h1>
          <p className="hero-description">
            Revolutionary AI-powered financial solutions for the modern world.
            Unlock the power of decentralized finance with intelligent automation.
          </p>
          <div className="hero-cta">
          <Link 
            to="/claim-airdrop" 
            className="primary-btn"
          >
            Claim Airdrop
          </Link>
          </div>
        </div>

        {/* Animated illustration */}
        <div className="hero-illustration">
          <div className="central-circle">
            <div className="pulse-effect"></div>
          </div>
          <div ref={orbitRef} className="orbits">
            <div className="orbit orbit-1">
              <div className="orbit-element"></div>
            </div>
            <div className="orbit orbit-2">
              <div className="orbit-element"></div>
            </div>
            <div className="orbit orbit-3">
              <div className="orbit-element"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <div className="scroll-indicator">
        <div className="mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>Scroll Down</span>
      </div>
    </section>
  );
};

export default Hero;
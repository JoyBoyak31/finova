// src/components/Hero.jsx - Interstellar Theme - ORIGINAL DESIGN RESTORED
import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Hero.css';

const Hero = () => {
  const starsRef = useRef(null);
  const shootingStarsRef = useRef(null);
  const orbitRef = useRef(null);

  // Initialize starfield and shooting stars
  useEffect(() => {
    const generateStars = () => {
      if (!starsRef.current) return;
      
      const starsContainer = starsRef.current;
      starsContainer.innerHTML = '';
      
      // Create multiple layers of stars
      for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        
        // Random position
        const posX = Math.random() * 100;
        const posY = Math.random() * 100;
        star.style.left = `${posX}%`;
        star.style.top = `${posY}%`;
        
        // Random size (small, medium, large stars)
        const sizeType = Math.random();
        if (sizeType > 0.95) {
          star.classList.add('star-large');
        } else if (sizeType > 0.85) {
          star.classList.add('star-medium');
        } else {
          star.classList.add('star-small');
        }
        
        // Random twinkle delay
        star.style.animationDelay = `${Math.random() * 3}s`;
        
        starsContainer.appendChild(star);
      }
    };

    const generateShootingStars = () => {
      if (!shootingStarsRef.current) return;
      
      const shootingContainer = shootingStarsRef.current;
      shootingContainer.innerHTML = '';
      
      // Create 3 shooting stars with different timings
      for (let i = 0; i < 3; i++) {
        const shootingStar = document.createElement('div');
        shootingStar.className = 'shooting-star';
        
        // Start from top-right area
        const startX = 70 + Math.random() * 30;
        const startY = Math.random() * 20;
        shootingStar.style.left = `${startX}%`;
        shootingStar.style.top = `${startY}%`;
        
        // Different animation delays for each shooting star
        shootingStar.style.animationDelay = `${i * 5 + Math.random() * 2}s`;
        
        shootingContainer.appendChild(shootingStar);
      }
    };

    generateStars();
    generateShootingStars();
    
    // Initialize orbit animation - RESTORED
    if (orbitRef.current) {
      const orbitElements = orbitRef.current.querySelectorAll('.orbit-element');
      orbitElements.forEach((el, index) => {
        const delay = index * 1.5;
        el.style.animationDelay = `${delay}s`;
      });
    }

    // Handle resize
    const handleResize = () => {
      generateStars();
      generateShootingStars();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <section className="hero-section" id="home">
      {/* Animated Starfield Background */}
      <div className="hero-bg">
        <div ref={starsRef} className="stars-container"></div>
        <div ref={shootingStarsRef} className="shooting-stars-container"></div>
        <div className="nebula-glow nebula-1"></div>
        <div className="nebula-glow nebula-2"></div>
        <div className="gradient-overlay"></div>
      </div>

      {/* Main content */}
      <div className="hero-content">
        <div className="hero-text">
          <div className="hero-badge">
            <span className="badge-icon">🚀</span>
            <span>The Interstellar Meme Coin</span>
          </div>
          
          <h1 className="hero-title">
            <span className="text-gradient">3I/ATLAS</span>
            <span className="hero-subtitle">AI</span>
          </h1>
          
          <p className="hero-tagline">
            "When the comet arrives, the next crypto wave begins."
          </p>
          
          <p className="hero-description">
            Inspired by the mysterious interstellar comet 3I/ATLAS. Where Interstellar Intelligence meets Artificial Intelligence. Built for explorers, visionaries, and those who see opportunity before the rest of the world.
          </p>
          
          <div className="hero-quote">
            <p className="quote-text">
              "If I ever had evidence of aliens, Joe — you'd be the first to know."
            </p>
            <p className="quote-author">— Elon Musk</p>
          </div>
          
          <div className="hero-cta">
            <a href="#howtobuy" className="primary-btn">
              <span>How to Buy</span>
              <span className="btn-icon">→</span>
            </a>
            <a href="#about" className="secondary-btn">
              <span>Explore More</span>
            </a>
          </div>
        </div>

        {/* ORIGINAL Animated Illustration with Orbital Elements RESTORED */}
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
      {/* <div className="scroll-indicator">
        <div className="mouse">
          <div className="scroll-wheel"></div>
        </div>
        <span>Scroll to Explore</span>
      </div> */}
    </section>
  );
};

export default Hero;
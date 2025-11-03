// src/components/HowItWorks.jsx - How to Buy (Solana-based)
import React from 'react';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Get a Wallet",
      description: "Download Phantom or Solflare wallet from the App Store or Google Play Store for free. Desktop users, get the browser extension.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      )
    },
    {
      id: 2,
      title: "Get Some SOL",
      description: "Have SOL in your wallet to swap for 3I/ATLAS AI. Buy SOL directly through your wallet, transfer from another wallet, or buy on an exchange and send it to your wallet.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="1" x2="12" y2="23"></line>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
        </svg>
      )
    },
    {
      id: 3,
      title: "Go to Raydium",
      description: "Connect to Raydium. Go to raydium.io in your browser or app. Connect your wallet. Paste the 3I/ATLAS AI token address into Raydium and confirm.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    },
    {
      id: 4,
      title: "Swap SOL for 3I/ATLAS AI",
      description: "Swap your SOL for 3I/ATLAS AI. We have ZERO taxes so you don't need to worry about specific slippage, although you may need to use slippage during times of market volatility.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    }
  ];

  return (
    <section className="how-it-works-section" id="howtobuy">
      <div className="how-container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="text-gradient">How to</span> Buy
          </h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">
            Follow these simple steps to join the interstellar journey
          </p>
        </div>

        <div className="steps-container">
          {steps.map((step, index) => (
            <div className="step-card" key={step.id} data-step={step.id}>
              <div className="step-connector">
                {index < steps.length - 1 && <div className="connector-line"></div>}
              </div>
              
              <div className="step-content">
                <div className="step-icon-wrapper">
                  <div className="step-icon">
                    {step.icon}
                  </div>
                  <div className="step-number">{step.id}</div>
                </div>
                
                <div className="step-info">
                  <h3 className="step-title">{step.title}</h3>
                  <p className="step-description">{step.description}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="cta-container">
          <p className="cta-text">Ready to start your interstellar journey?</p>
          <a href="https://raydium.io" target="_blank" rel="noopener noreferrer" className="primary-btn cta-button">
            Buy on Raydium
          </a>
        </div>
      </div>
      
      <div className="glow-effect glow-1"></div>
      <div className="glow-effect glow-2"></div>
    </section>
  );
};

export default HowItWorks;
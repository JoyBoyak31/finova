// src/components/HowItWorks.jsx
import React from 'react';
import '../styles/HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      id: 1,
      title: "Connect Your Wallet",
      description: "Securely link your Web3 wallet in one click.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="5" width="20" height="14" rx="2" ry="2"></rect>
          <line x1="2" y1="10" x2="22" y2="10"></line>
        </svg>
      )
    },
    {
      id: 2,
      title: "AI Eligibility Scan",
      description: "Our AI verifies activity to ensure fairness and authenticity.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
          <polyline points="14 2 14 8 20 8"></polyline>
          <line x1="16" y1="13" x2="8" y2="13"></line>
          <line x1="16" y1="17" x2="8" y2="17"></line>
          <line x1="10" y1="9" x2="8" y2="9"></line>
        </svg>
      )
    },
    {
      id: 3,
      title: "Get Verified",
      description: "Receive confirmations for participating features.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
          <polyline points="22 4 12 14.01 9 11.01"></polyline>
        </svg>
      )
    },
    {
      id: 4,
      title: "Stay Updated",
      description: "Follow upcoming opportunities and new token listings on our platform.",
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <circle cx="12" cy="12" r="10"></circle>
          <polyline points="12 6 12 12 16 14"></polyline>
        </svg>
      )
    }
  ];

  return (
    <section className="how-it-works-section" id="howitworks">
      <div className="how-container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="text-gradient">How It</span> Works
          </h2>
          <div className="title-underline"></div>
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
          <p className="cta-text">Ready to start your journey with FINOVA?</p>
          <button className="primary-btn cta-button">Connect Wallet</button>
        </div>
      </div>
      
      <div className="glow-effect glow-1"></div>
      <div className="glow-effect glow-2"></div>
    </section>
  );
};

export default HowItWorks;
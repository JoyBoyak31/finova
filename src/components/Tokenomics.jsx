// src/components/Tokenomics.jsx
import React from 'react';
import '../styles/Tokenomics.css';

const Tokenomics = () => {
  const tokenomicsData = [
    { category: 'User Incentives', percentage: 40, color: '#8b5cf6' },
    { category: 'Community & Ecosystem', percentage: 25, color: '#3b82f6' },
    { category: 'Team & Development (locked)', percentage: 20, color: '#10b981' },
    { category: 'Strategic Partnerships', percentage: 10, color: '#f59e0b' },
    { category: 'Liquidity & Reserves', percentage: 5, color: '#ef4444' }
  ];

  // Calculate accumulated percentages for conic-gradient
  let accumulatedPercentage = 0;
  const conicGradientStops = tokenomicsData.map((item) => {
    const startPercentage = accumulatedPercentage;
    accumulatedPercentage += item.percentage;
    return `${item.color} ${startPercentage}% ${accumulatedPercentage}%`;
  }).join(', ');

  return (
    <section className="tokenomics-section" id="tokenomics">
      <div className="tokenomics-container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="text-gradient">Token</span>omics
          </h2>
          <div className="title-underline"></div>
          <p className="section-subtitle">
            Our AI-tokenomics model ensures sustainable growth and fair rewards.
          </p>
        </div>

        <div className="tokenomics-content">
          <div className="tokenomics-chart">
            <div 
              className="pie-chart"
              style={{
                background: `conic-gradient(${conicGradientStops})`
              }}
            >
              <div className="chart-center">
                <span className="logo-text">FINOVA</span>
                <span className="logo-highlight">AI</span>
              </div>
            </div>
          </div>

          <div className="tokenomics-breakdown">
            <h3 className="breakdown-title">Token Distribution</h3>
            <div className="distribution-list">
              {tokenomicsData.map((item) => (
                <div className="distribution-item" key={item.category}>
                  <div className="distribution-info">
                    <div 
                      className="distribution-color" 
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="distribution-details">
                      <span className="distribution-category">{item.category}</span>
                      <div className="distribution-bar">
                        <div 
                          className="distribution-progress" 
                          style={{ 
                            width: `${item.percentage}%`,
                            backgroundColor: item.color,
                            '--percentage': `${item.percentage}%`
                          }}
                        ></div>
                      </div>
                    </div>
                  </div>
                  <span className="distribution-percentage">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      <div className="tokenomics-bg">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
        <div className="geometric-shape shape-3"></div>
      </div>
    </section>
  );
};

export default Tokenomics;
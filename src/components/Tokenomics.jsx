// src/components/Tokenomics.jsx - Interstellar Theme
import React from 'react';
import '../styles/Tokenomics.css';

const Tokenomics = () => {
  const tokenomicsData = [
    { category: 'Liquidity Pool (Locked)', percentage: 80, color: '#4fc3f7' },
    { category: 'Marketing & Burns', percentage: 15, color: '#d4af37' },
    { category: 'Development (Locked 6mo)', percentage: 5, color: '#7b2cbf' }
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
            Total Supply: 1,000,000,000 | 0% Buy/Sell Tax
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
                <span className="logo-text">3I/ATLAS</span>
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
            <div className="burn-mechanic">
              <p>🔥 Scheduled Burns: Each burn reduces supply — "like a comet burning brighter as it gets closer."</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="tokenomics-bg">
        <div className="geometric-shape shape-1"></div>
        <div className="geometric-shape shape-2"></div>
      </div>
    </section>
  );
};

export default Tokenomics;
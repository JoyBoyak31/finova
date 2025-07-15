// src/components/Roadmap.jsx
import React from 'react';
import '../styles/Roadmap.css';

const Roadmap = () => {
  const roadmapData = [
    {
      id: 1,
      phase: 'Q2 2025',
      title: 'Launch FiNOVA Beta',
      milestones: [
        'Initial platform deployment',
        'Basic wallet integration',
        'Core AI algorithm testing'
      ],
      status: 'current'
    },
    {
      id: 2,
      phase: 'Q3 2025',
      title: 'Launch Multi-chain Support + Marketing Push',
      milestones: [
        'Expand to multiple blockchains',
        'Strategic marketing campaigns',
        'Community growth initiatives'
      ],
      status: 'upcoming'
    },
    {
      id: 3,
      phase: 'Q4 2025',
      title: 'Governance & AI Agent Deployment',
      milestones: [
        'DAO governance implementation',
        'Advanced AI agent integration',
        'Token utility expansion'
      ],
      status: 'upcoming'
    },
    {
      id: 4,
      phase: 'Q1 2026',
      title: 'Community Expansion + Staking Mechanism',
      milestones: [
        'Staking and rewards system',
        'Global community expansion',
        'Strategic partnerships'
      ],
      status: 'upcoming'
    }
  ];

  return (
    <section className="roadmap-section" id="roadmap">
      <div className="roadmap-container">
        <div className="section-header">
          <h2 className="section-title">
            <span className="text-gradient">Road</span>map
          </h2>
          <div className="title-underline"></div>
        </div>

        <div className="roadmap-timeline">
          <div className="timeline-track"></div>
          
          {roadmapData.map((item, index) => (
            <div 
              key={item.id} 
              className={`roadmap-item ${item.status}`}
              data-aos={index % 2 === 0 ? "fade-right" : "fade-left"}
              data-aos-delay={index * 100}
            >
              <div className="roadmap-marker">
                <div className="marker-dot"></div>
                <div className="marker-line"></div>
              </div>
              
              <div className="roadmap-content">
                <div className="roadmap-phase">{item.phase}</div>
                <h3 className="roadmap-title">{item.title}</h3>
                <ul className="milestone-list">
                  {item.milestones.map((milestone, i) => (
                    <li key={i} className="milestone-item">{milestone}</li>
                  ))}
                </ul>
                <div className="status-badge">{item.status}</div>
              </div>
            </div>
          ))}
        </div>

        <div className="roadmap-note">
          <p>Our roadmap is dynamic and may evolve based on community feedback and market conditions.</p>
        </div>
      </div>
      
      <div className="glow-effect roadmap-glow-1"></div>
      <div className="glow-effect roadmap-glow-2"></div>
    </section>
  );
};

export default Roadmap;
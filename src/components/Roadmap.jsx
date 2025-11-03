// src/components/Roadmap.jsx - Interstellar Theme
import React from 'react';
import '../styles/Roadmap.css';

const Roadmap = () => {
  const roadmapData = [
    {
      id: 1,
      phase: 'Q2 2025',
      title: 'Launch Orbit',
      milestones: [
        'Website & whitepaper release',
        '3I/ATLAS AI token launch',
        '"From the Stars to the Chain" campaign',
        'Meme & content rollout featuring Elon\'s quote'
      ],
      status: 'current'
    },
    {
      id: 2,
      phase: 'Q3 2025',
      title: 'Interstellar Expansion',
      milestones: [
        'CEX listings',
        'NFT drop: "Fragments of the Comet"',
        'Influencer & podcast tie-ins',
        'First scheduled token burn event'
      ],
      status: 'upcoming'
    },
    {
      id: 3,
      phase: 'Q4 2025',
      title: 'AI Awakening',
      milestones: [
        '"Interstellar Intelligence Hub" - AI meme generator',
        'DAO vote for burns and expansion',
        'Major exchange listing',
        'Media coverage push'
      ],
      status: 'upcoming'
    },
    {
      id: 4,
      phase: 'Q1 2026',
      title: 'Beyond the Solar System',
      milestones: [
        'Cross-chain bridge (Binance/Solana/ETH)',
        'Partnerships with AI & space projects',
        'Cosmic NFT Game launch',
        'Collect fragments, earn rewards'
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
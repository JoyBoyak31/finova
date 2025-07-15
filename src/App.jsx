// src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastProvider } from './components/Toast/ToastSystem';
import { WalletProvider } from './contexts/WalletContext';
import Layout from './components/Layout';
import Hero from './components/Hero';
import About from './components/About';
import HowItWorks from './components/HowItWorks';
import Tokenomics from './components/Tokenomics';
import Roadmap from './components/Roadmap';
import Footer from './components/Footer';
import ClaimAirdrop from './pages/ClaimAirdrop';
import './styles/main.css';

// HomePage component to contain all the main page sections
const HomePage = () => {
  return (
    <Layout>
      <Hero />
      <About />
      <HowItWorks />
      <Tokenomics />
      <Roadmap />
      <Footer />
    </Layout>
  );
};

function App() {
  return (
    <ToastProvider>
      <WalletProvider>
        <Router>
          <div className="App">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/claim-airdrop" element={<ClaimAirdrop />} />
              {/* Add a catch-all route to redirect to home page */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </div>
        </Router>
      </WalletProvider>
    </ToastProvider>
  );
}

export default App;
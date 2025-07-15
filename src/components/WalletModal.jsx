// src/components/WalletModal.jsx
import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import { useWallet } from '../contexts/WalletContext';
import '../styles/WalletModal.css';

// Import wallet icons (you'll need to add these to your assets folder)
import metamaskIcon from '../assets/wallets/metamask.png';
import trustwalletIcon from '../assets/wallets/trustwallet.png';
import walletconnectIcon from '../assets/wallets/walletconnect.png';

const WalletModal = ({ isOpen, onClose, onSelect }) => {
  const { 
    allAvailableWallets, 
    isMobileDevice
  } = useWallet();
  
  // Lock body scroll when modal is open
  useEffect(() => {
    if (isOpen) {
      const originalOverflow = document.body.style.overflow;
      document.body.style.overflow = 'hidden';
      
      const handleEsc = (e) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };
      
      window.addEventListener('keydown', handleEsc);
      
      return () => {
        document.body.style.overflow = originalOverflow;
        window.removeEventListener('keydown', handleEsc);
      };
    }
  }, [isOpen, onClose]);
  
  // Close modal when clicking outside
  const handleBackdropClick = (e) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };
  
  if (!isOpen) return null;
  
  const isMobile = isMobileDevice && isMobileDevice();
  
  // Handle selecting a wallet
  const handleSelectWallet = (walletId) => {
    if (onSelect) {
      onSelect(walletId);
    }
  };
  
  // The modal content to be rendered
  const modalContent = (
    <div 
      className="wallet-modal-overlay" 
      onClick={handleBackdropClick}
    >
      <div className="wallet-modal-content" onClick={e => e.stopPropagation()}>
        <div className="wallet-modal-header">
          <h2 className="wallet-modal-title">
            <span className="text-gradient">Connect</span> Your Wallet
          </h2>
          <button 
            className="wallet-modal-close" 
            onClick={onClose}
            aria-label="Close"
          >
            ×
          </button>
        </div>
        
        <div className="wallet-modal-body">
          <p className="wallet-modal-description">
            {isMobile 
              ? "Choose your preferred wallet to connect to FINOVA AI. If you don't have a wallet, you'll be guided to install one."
              : "Select one of the available wallet providers to connect to FINOVA AI and access the presale."
            }
          </p>
          
          <div className="wallet-list">
            {/* MetaMask */}
            <button
              className="wallet-option"
              onClick={() => handleSelectWallet('metamask')}
            >
              <div className="wallet-option-inner">
                <img src={metamaskIcon} alt="MetaMask" className="wallet-icon" />
                <div className="wallet-info">
                  <span className="wallet-name">MetaMask</span>
                  <span className="wallet-description">
                    {isMobile ? "Most popular crypto wallet" : "Connect using browser extension"}
                  </span>
                </div>
                {isMobile && !allAvailableWallets.includes('metamask') && (
                  <span className="wallet-status">Install</span>
                )}
              </div>
              <div className="wallet-hover-effect"></div>
            </button>
            
            {/* Trust Wallet */}
            <button
              className="wallet-option"
              onClick={() => handleSelectWallet('trust')}
            >
              <div className="wallet-option-inner">
                <img src={trustwalletIcon} alt="Trust Wallet" className="wallet-icon" />
                <div className="wallet-info">
                  <span className="wallet-name">Trust Wallet</span>
                  <span className="wallet-description">
                    {isMobile ? "Secure mobile wallet" : "Multi-coin wallet"}
                  </span>
                </div>
                {isMobile && (
                  <span className="wallet-badge">Mobile</span>
                )}
              </div>
              <div className="wallet-hover-effect"></div>
            </button>
            
            {/* WalletConnect */}
            <button
              className="wallet-option"
              onClick={() => handleSelectWallet('walletconnect')}
            >
              <div className="wallet-option-inner">
                <img src={walletconnectIcon} alt="WalletConnect" className="wallet-icon" />
                <div className="wallet-info">
                  <span className="wallet-name">WalletConnect</span>
                  <span className="wallet-description">
                    {isMobile ? "Connect any mobile wallet" : "Scan with mobile wallet"}
                  </span>
                </div>
                {isMobile && (
                  <span className="wallet-badge">Universal</span>
                )}
              </div>
              <div className="wallet-hover-effect"></div>
            </button>
          </div>
          
          {isMobile && (
            <div className="wallet-mobile-help">
              <div className="help-icon">💡</div>
              <div className="help-content">
                <p><strong>New to crypto wallets?</strong></p>
                <p>We'll guide you through the installation process. Choose any wallet above to get started!</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="wallet-modal-footer">
          <div className="security-notice">
            <div className="security-icon">🔒</div>
            <p>
              Your wallet credentials are never stored or shared. By connecting, you agree to our 
              <a href="#terms" className="terms-link"> Terms of Service</a>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
  
  // Use ReactDOM.createPortal to render the modal directly to document.body
  return ReactDOM.createPortal(
    modalContent,
    document.body
  );
};

export default WalletModal;
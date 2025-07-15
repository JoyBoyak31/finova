// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useWallet } from '../contexts/WalletContext';
import WalletModal from './WalletModal';
import { useToast } from '../components/Toast/ToastSystem';
import '../styles/Navbar.css';
import logo from '../assets/logo/logo.png';

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const [activeLink, setActiveLink] = useState('home');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const [connecting, setConnecting] = useState(false);
  
  const location = useLocation();
  const navigate = useNavigate();
  const isHomePage = location.pathname === '/';
  
  // Get wallet context
  const {
    account,
    connectMetaMask,
    connectTrustWallet,
    connectWalletConnect,
    disconnectWallet,
    formatAddress,
    loading,
    isCorrectNetwork,
    allAvailableWallets,
    isMobileDevice
  } = useWallet();

  // Get toast context
  const toast = useToast();

  // Handle scroll event for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Set active link based on current location
  useEffect(() => {
    if (isHomePage) {
      if (location.hash) {
        setActiveLink(location.hash.substring(1));
      } else {
        setActiveLink('home');
      }
    }
  }, [location, isHomePage]);

  // Disable body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'auto';
    }
    
    return () => {
      document.body.style.overflow = 'auto';
    };
  }, [mobileMenuOpen]);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  // Function to handle navigation
  const handleNavigation = (sectionId) => {
    setActiveLink(sectionId);
    
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }

    if (isHomePage) {
      setTimeout(() => {
        const element = document.getElementById(sectionId);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 100);
    } else {
      navigate(`/#${sectionId}`);
    }
  };

  // Handle wallet button click
  const handleConnectClick = () => {
    if (mobileMenuOpen) {
      setMobileMenuOpen(false);
    }
    
    if (account) {
      if (window.confirm("Disconnect your wallet?")) {
        disconnectWallet();
        toast.info("Wallet disconnected", 3000);
      }
    } else if (!connecting) {
      setWalletModalOpen(true);
    }
  };

  // Handle wallet selection from modal
  const handleWalletSelect = async (walletId) => {
    if (connecting) {
      console.log("Connection already in progress, ignoring duplicate request");
      return;
    }
    
    setConnecting(true);
    setWalletModalOpen(false);
    
    let success = false;
    
    try {
      toast.info(`Connecting to ${walletId}...`, 3000);
      
      switch (walletId) {
        case 'metamask':
          success = await connectMetaMask();
          break;
        case 'trust':
          success = await connectTrustWallet();
          break;
        case 'walletconnect':
          success = await connectWalletConnect();
          break;
        default:
          console.error('Unknown wallet type:', walletId);
          toast.error(`Unknown wallet type: ${walletId}`, 5000);
      }
      
      if (success) {
        console.log(`Successfully connected to ${walletId}`);
        toast.success(`Connected to ${walletId}`, 5000);
      }
    } catch (error) {
      console.error("Error connecting wallet:", error);
      
      if (error.code === 4001) {
        toast.warning("Connection rejected by user", 5000);
      } else if (error.code === -32002) {
        toast.warning("Connection request already pending. Please check your wallet", 7000);
      } else {
        toast.error(`Failed to connect: ${error.message}`, 7000);
      }
    } finally {
      setTimeout(() => {
        setConnecting(false);
      }, 1000);
    }
  };

  // Get button text based on wallet state
  const getConnectButtonText = () => {
    if (loading || connecting) {
      return "Connecting...";
    }
    
    if (account) {
      if (!isCorrectNetwork()) {
        return "Wrong Network";
      }
      return isHovering ? "Disconnect" : formatAddress(account);
    }
    
    return "Connect Wallet";
  };
  
  // Get button class based on state
  const getButtonClass = () => {
    let baseClass = "connect-wallet-btn";
    
    if (loading || connecting) {
      return `${baseClass} connecting`;
    }
    
    if (account) {
      if (!isCorrectNetwork()) {
        return `${baseClass} wrong-network`;
      }
      return isHovering ? `${baseClass} disconnect-btn` : `${baseClass} connected`;
    }
    
    if (allAvailableWallets && allAvailableWallets.length === 0) {
      return `${baseClass} install`;
    }
    
    return `${baseClass} unlock`;
  };

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="navbar-logo">
          <Link to="/" onClick={() => setActiveLink('home')}>
            <img src={logo} alt="FINOVA AI Logo" className="logo-image" />
            <div className="logo-text-container">
              <span className="logo-text">FINOVA</span>
              <span className="logo-highlight">AI</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation */}
        <div className="navbar-links-desktop">
          <ul>
            <li>
              <a 
                href="#home" 
                className={activeLink === 'home' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('home');
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={activeLink === 'about' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('about');
                }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#howitworks" 
                className={activeLink === 'howitworks' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('howitworks');
                }}
              >
                How it works
              </a>
            </li>
            <li>
              <a 
                href="#tokenomics" 
                className={activeLink === 'tokenomics' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('tokenomics');
                }}
              >
                Tokenomics
              </a>
            </li>
            <li>
              <a 
                href="#roadmap" 
                className={activeLink === 'roadmap' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('roadmap');
                }}
              >
                Roadmap
              </a>
            </li>
          </ul>
        </div>

        {/* Navbar Actions */}
        <div className="navbar-actions">
          {/* Connect Wallet Button */}
          {/* <button 
            className={getButtonClass()}
            onClick={handleConnectClick}
            onMouseEnter={() => setIsHovering(true)}
            onMouseLeave={() => setIsHovering(false)}
            disabled={loading || connecting}
          >
            <span>{getConnectButtonText()}</span>
          </button>  */}

          {/* Claim Airdrop Button */}
          <Link 
            to="/claim-airdrop" 
            className="claim-airdrop-btn"
          >
            Claim Airdrop
          </Link>
          
          {/* Mobile Menu Toggle */}
          <button className="mobile-menu-toggle" onClick={toggleMobileMenu} aria-label="Toggle navigation menu">
            <span className={`hamburger ${mobileMenuOpen ? 'open' : ''}`}></span>
          </button>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-inner">
          <ul>
            <li>
              <a 
                href="#home" 
                className={activeLink === 'home' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('home');
                }}
              >
                Home
              </a>
            </li>
            <li>
              <a 
                href="#about" 
                className={activeLink === 'about' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('about');
                }}
              >
                About
              </a>
            </li>
            <li>
              <a 
                href="#howitworks" 
                className={activeLink === 'howitworks' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('howitworks');
                }}
              >
                How it works
              </a>
            </li>
            <li>
              <a 
                href="#tokenomics" 
                className={activeLink === 'tokenomics' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('tokenomics');
                }}
              >
                Tokenomics
              </a>
            </li>
            <li>
              <a 
                href="#roadmap" 
                className={activeLink === 'roadmap' ? 'active' : ''}
                onClick={(e) => {
                  e.preventDefault();
                  handleNavigation('roadmap');
                }}
              >
                Roadmap
              </a>
            </li>
          </ul>
          <div className="mobile-menu-footer">
            {/* Mobile Wallet Button */}
            <button 
              className={getButtonClass()} 
              onClick={handleConnectClick}
              onMouseEnter={() => setIsHovering(true)}
              onMouseLeave={() => setIsHovering(false)}
              disabled={loading || connecting}
            >
              <span>{getConnectButtonText()}</span>
            </button>
            
            <Link 
              to="/claim-airdrop" 
              className="claim-airdrop-btn"
              onClick={() => setMobileMenuOpen(false)}
            >
              Claim Airdrop
            </Link>
          </div>
        </div>
      </div>
      
      {/* Wallet Selection Modal */}
      <WalletModal 
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onSelect={handleWalletSelect}
      />
    </nav>
  );
};

export default Navbar;
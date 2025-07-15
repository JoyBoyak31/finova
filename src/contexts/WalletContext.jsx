// src/contexts/WalletContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { ethers } from 'ethers';
import config from '../config';

// Create the context with default values to prevent undefined errors
const defaultContextValue = {
  account: null,
  provider: null,
  signer: null,
  chainId: null,
  loading: false,
  isCorrectNetwork: () => false,
  connectMetaMask: async () => false,
  connectTrustWallet: async () => false,
  connectWalletConnect: async () => false,
  disconnectWallet: () => {},
  formatAddress: (address) => address,
  isMetaMaskAvailable: () => false,
  isTrustWalletAvailable: () => false,
  allAvailableWallets: [],
  isMobileDevice: () => false
};

// Create the context with default values
const WalletContext = createContext(defaultContextValue);

// Export the hook with a try/catch to help debug issues
export function useWallet() {
  try {
    const context = useContext(WalletContext);
    if (context === undefined) {
      console.error("useWallet must be used within a WalletProvider");
      return defaultContextValue;
    }
    return context;
  } catch (error) {
    console.error("Error using WalletContext:", error);
    return defaultContextValue;
  }
}

// Export the provider with error boundaries
export const WalletProvider = ({ children }) => {
  console.log("WalletProvider initializing");
  
  // Get target network configuration
  const targetNetwork = config.getTargetNetwork();
  
  // State variables
  const [error, setError] = useState(null);
  const [account, setAccount] = useState(null);
  const [provider, setProvider] = useState(null);
  const [signer, setSigner] = useState(null);
  const [chainId, setChainId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeWallet, setActiveWallet] = useState(null);
  const [availableProviders, setAvailableProviders] = useState([]);
  const [allAvailableWallets, setAllAvailableWallets] = useState([]);
  const [mobileWalletDeepLink, setMobileWalletDeepLink] = useState(null);
  
  // Helper to detect if we're on a mobile device
  const isMobileDevice = () => {
    return (
      typeof window !== 'undefined' &&
      (typeof window.orientation !== 'undefined' ||
        navigator.userAgent.indexOf('IEMobile') !== -1 ||
        /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent))
    );
  };
  
  // Scan for available providers on mount and window focus
  useEffect(() => {
    scanProviders();
    window.addEventListener('focus', scanProviders);
    
    const savedWallet = localStorage.getItem('activeWallet');
    if (savedWallet) {
      console.log(`Found saved wallet connection: ${savedWallet}`);
    }
    
    return () => {
      window.removeEventListener('focus', scanProviders);
      if (provider && activeWallet) {
        try {
          const rawProvider = getProviderByType(activeWallet);
          if (rawProvider && rawProvider.removeListener) {
            rawProvider.removeListener('accountsChanged', handleAccountsChanged);
            rawProvider.removeListener('chainChanged', handleChainChanged);
            rawProvider.removeListener('disconnect', handleDisconnect);
          }
        } catch (error) {
          console.error("Error removing listeners during cleanup:", error);
        }
      }
    };
  }, []);
  
  // Helper function to check if a provider is MetaMask
  const isRealMetaMask = (provider) => {
    if (!provider) return false;
    
    if (provider._metamask || provider._state?.isUnlocked) {
      return true;
    }
    
    if (provider.isMetaMask && !provider.isTrust && !provider.isTrustWallet) {
      return true;
    }
    
    return false;
  };
  
  // Helper function to check if a provider is Trust Wallet
  const isTrustWallet = (provider) => {
    if (!provider) return false;
    
    if (provider.isTrust || provider.isTrustWallet) {
      return true;
    }
    
    if (provider.isMetaMask && (provider.isTrust || provider.isTrustWallet)) {
      return true;
    }
    
    return false;
  };
  
  // Scan and categorize available providers
  const scanProviders = () => {
    console.log("Scanning for providers...");
    let providers = [];
    let wallets = [];
    
    if (isMobileDevice()) {
      wallets.push("walletconnect");
    }
    
    if (window.ethereum?.providers && Array.isArray(window.ethereum.providers)) {
      console.log(`Found ${window.ethereum.providers.length} providers in window.ethereum.providers`);
      
      window.ethereum.providers.forEach((provider, index) => {
        console.log(`Provider ${index} properties:`, Object.keys(provider));
        
        const isMM = isRealMetaMask(provider);
        const isTW = isTrustWallet(provider);
        
        let name = "Unknown Provider";
        let type = "unknown";
        
        if (isMM) {
          name = "MetaMask";
          type = "metamask";
          wallets.push("metamask");
        } else if (isTW) {
          name = "Trust Wallet";
          type = "trust";
          wallets.push("trust");
        }
        
        providers.push({
          index,
          name,
          type,
          isMetaMask: isMM,
          isTrust: isTW,
          provider
        });
      });
    } else if (window.ethereum) {
      console.log("Found single provider in window.ethereum");
      console.log("window.ethereum properties:", Object.keys(window.ethereum));
      
      if (isRealMetaMask(window.ethereum)) {
        console.log("Detected MetaMask");
        providers.push({
          index: -1,
          name: "MetaMask",
          type: "metamask",
          isMetaMask: true,
          isTrust: false,
          provider: window.ethereum
        });
        wallets.push("metamask");
      }
      
      if (isTrustWallet(window.ethereum)) {
        console.log("Detected Trust Wallet");
        providers.push({
          index: -1,
          name: "Trust Wallet",
          type: "trust",
          isMetaMask: false,
          isTrust: true,
          provider: window.ethereum
        });
        wallets.push("trust");
      }
      
      if (providers.length === 0 && window.ethereum.isMetaMask) {
        console.log("Detected unknown provider with isMetaMask flag");
        providers.push({
          index: -1,
          name: "Unknown Wallet",
          type: "unknown",
          isMetaMask: true,
          isTrust: false,
          provider: window.ethereum
        });
      }
      
      if (providers.length === 0) {
        console.log("Detected generic web3 provider");
        providers.push({
          index: -1,
          name: "Web3 Provider",
          type: "unknown",
          isMetaMask: false,
          isTrust: false,
          provider: window.ethereum
        });
      }
    }
    
    console.log("Available providers:", providers);
    console.log("Available wallets:", wallets);
    
    setAvailableProviders(providers);
    setAllAvailableWallets([...new Set(wallets)]);
  };
  
  // Get specific provider by type
  const getProviderByType = (type) => {
    const provider = availableProviders.find(p => p.type === type);
    if (provider) {
      console.log(`Found ${type} provider:`, provider.name);
      return provider.provider;
    }
    
    if (type === 'metamask' && window.ethereum?.isMetaMask) {
      console.log("Using window.ethereum as MetaMask provider");
      return window.ethereum;
    }
    
    if (type === 'trust' && (window.ethereum?.isTrust || window.ethereum?.isTrustWallet)) {
      console.log("Using window.ethereum as Trust Wallet provider");
      return window.ethereum;
    }
    
    console.log(`No ${type} provider found`);
    return null;
  };
  
  // Get the target chain ID
  const getTargetChainId = () => {
    return targetNetwork.ID;
  };
  
  // Force a new wallet permission request
  const forceWalletPermissionRequest = async (ethereumProvider) => {
    try {
      console.log("Forcing wallet permission request");
      
      if (!ethereumProvider) {
        throw new Error("Provider not available");
      }
      
      if (ethereumProvider.isMetaMask) {
        try {
          console.log("Using wallet_requestPermissions method for MetaMask");
          await ethereumProvider.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }]
          });
          
          const accounts = await ethereumProvider.request({
            method: "eth_requestAccounts"
          });
          
          return accounts;
        } catch (mmError) {
          console.log("MetaMask permission request failed, trying alternative method:", mmError);
        }
      }
      
      console.log("Using eth_requestAccounts method");
      const accounts = await ethereumProvider.request({
        method: "eth_requestAccounts"
      });
      
      return accounts;
    } catch (error) {
      console.error("Error forcing wallet permission:", error);
      throw error;
    }
  };
  
  // Connect to a specific wallet type
  const connectWallet = async (walletType) => {
    try {
      console.log(`Attempting to connect to ${walletType}...`);
      setLoading(true);
      setError(null);
      
      disconnectWallet();
      
      if (isMobileDevice()) {
        if (walletType === 'metamask' && !window.ethereum?.isMetaMask) {
          const deepLink = `${config.WALLET.METAMASK.DEEPLINK_PREFIX}${window.location.host}${window.location.pathname}`;
          console.log("Redirecting to MetaMask mobile:", deepLink);
          setMobileWalletDeepLink(deepLink);
          window.location.href = deepLink;
          setLoading(false);
          return false;
        }
        
        if (walletType === 'trust' && !window.ethereum?.isTrust) {
          const deepLink = `${config.WALLET.TRUST_WALLET.DEEPLINK_PREFIX}${encodeURIComponent(window.location.href)}`;
          console.log("Redirecting to Trust Wallet mobile:", deepLink);
          setMobileWalletDeepLink(deepLink);
          window.location.href = deepLink;
          setLoading(false);
          return false;
        }
      }
      
      const ethereumProvider = getProviderByType(walletType);
      
      if (!ethereumProvider) {
        console.log(`${walletType} provider not found`);
        
        if (isMobileDevice()) {
          let installLink = '';
          let walletName = '';
          
          if (walletType === 'metamask') {
            walletName = 'MetaMask';
            installLink = config.WALLET.METAMASK.INSTALL_URL;
          } else if (walletType === 'trust') {
            walletName = 'Trust Wallet';
            installLink = config.WALLET.TRUST_WALLET.INSTALL_URL;
          }
          
          if (installLink) {
            const installMsg = `${walletName} is not installed. Would you like to install it now?`;
            if (window.confirm(installMsg)) {
              window.location.href = installLink;
              return false;
            }
          }
        }
        
        const errorMsg = `${walletType} is not installed or not detected. Please install it to continue.`;
        setError(errorMsg);
        alert(errorMsg);
        setLoading(false);
        return false;
      }
      
      console.log("Requesting wallet permission with force dialog...");
      const accounts = await forceWalletPermissionRequest(ethereumProvider);
      
      if (!accounts || accounts.length === 0) {
        console.log("No accounts returned after permission request");
        setLoading(false);
        return false;
      }
      
      console.log("Creating ethers provider...");
      const ethersProvider = new ethers.BrowserProvider(ethereumProvider);
      const ethersSigner = await ethersProvider.getSigner();
      const network = await ethersProvider.getNetwork();
      const networkChainId = Number(network.chainId);
      
      console.log(`Connected to chain ID: ${networkChainId}`);
      
      const targetChainId = getTargetChainId();
      let finalChainId = networkChainId;
      
      if (networkChainId !== targetChainId) {
        console.log(`Not on correct network. Current: ${networkChainId}, Target: ${targetChainId}`);
        alert(`Connected to incorrect network (Chain ID: ${networkChainId}). Attempting to switch to ${targetNetwork.NAME}...`);
        
        try {
          await switchToBSC(targetChainId, ethereumProvider);
          
          const updatedProvider = new ethers.BrowserProvider(ethereumProvider);
          const updatedSigner = await updatedProvider.getSigner();
          const updatedNetwork = await updatedProvider.getNetwork();
          
          setProvider(updatedProvider);
          setSigner(updatedSigner);
          finalChainId = Number(updatedNetwork.chainId);
          console.log(`Switched to network with chainId: ${finalChainId}`);
          alert(`Successfully switched to ${targetNetwork.NAME}`);
        } catch (switchError) {
          console.error("Failed to switch network:", switchError);
          alert(`Could not switch to ${targetNetwork.NAME}. Please switch manually in your wallet settings.`);
          setProvider(ethersProvider);
          setSigner(ethersSigner);
          finalChainId = networkChainId;
        }
      } else {
        console.log(`Already on correct network: ${networkChainId}`);
        setProvider(ethersProvider);
        setSigner(ethersSigner);
      }
      
      setAccount(accounts[0]);
      setChainId(finalChainId);
      setActiveWallet(walletType);
      
      localStorage.setItem('activeWallet', walletType);
      
      console.log("Setting up event listeners...");
      ethereumProvider.on('accountsChanged', handleAccountsChanged);
      ethereumProvider.on('chainChanged', handleChainChanged);
      ethereumProvider.on('disconnect', handleDisconnect);
      
      console.log(`Successfully connected to ${walletType} with account ${accounts[0]}`);
      setLoading(false);
      return true;
    } catch (error) {
      console.error(`${walletType} connection error:`, error);
      
      let errorMessage = "Unknown error connecting to wallet";
      
      if (error.code === 4001) {
        errorMessage = "Connection rejected. Please approve the wallet popup to connect.";
      } else if (error.code === -32002) {
        errorMessage = "Connection request already pending. Please open your wallet extension to continue.";
      } else if (error.message) {
        errorMessage = `Error connecting to wallet: ${error.message}`;
      }
      
      setError(errorMessage);
      alert(errorMessage);
      
      setLoading(false);
      return false;
    }
  };
  
  // Helper to switch to BSC
  const switchToBSC = async (chainId, ethereumProvider) => {
    try {
      const chainIdHex = '0x' + chainId.toString(16);
      
      await ethereumProvider.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: chainIdHex }],
      });
    } catch (switchError) {
      if (switchError.code === 4902) {
        await addBscNetwork(chainId, ethereumProvider);
      } else {
        throw switchError;
      }
    }
  };
  
  // Helper to add BSC network to wallet
  const addBscNetwork = async (chainId, ethereumProvider) => {
    const networkConfig = chainId === config.NETWORK.BSC.MAINNET.ID
      ? config.NETWORK.BSC.MAINNET
      : config.NETWORK.BSC.TESTNET;
    
    const params = {
      chainId: '0x' + chainId.toString(16),
      chainName: networkConfig.NAME,
      nativeCurrency: networkConfig.CURRENCY,
      rpcUrls: networkConfig.RPC_URLS,
      blockExplorerUrls: [networkConfig.EXPLORER_URL],
    };
    
    alert(`Adding ${params.chainName} to your wallet...`);
    await ethereumProvider.request({
      method: 'wallet_addEthereumChain',
      params: [params],
    });
  };
  
  // Handler for account changes
  const handleAccountsChanged = (accounts) => {
    console.log("Accounts changed:", accounts);
    if (accounts.length === 0) {
      disconnectWallet();
    } else {
      setAccount(accounts[0]);
    }
  };
  
  // Handler for chain changes
  const handleChainChanged = (chainId) => {
    console.log("Chain changed to:", chainId);
    const newChainId = typeof chainId === 'string' ? 
      parseInt(chainId, 16) : Number(chainId);
    
    setChainId(newChainId);
    
    const targetChainId = getTargetChainId();
    if (newChainId === targetChainId) {
      alert(`Connected to ${targetNetwork.NAME}`);
    } else {
      alert(`You've switched to a different network (Chain ID: ${newChainId}). Please connect to ${targetNetwork.NAME}.`);
    }
    
    setTimeout(() => {
      window.location.reload();
    }, 1500);
  };
  
  // Handler for disconnect event
  const handleDisconnect = (error) => {
    console.log("Wallet disconnected:", error);
    disconnectWallet();
  };
  
  // Specific connection functions
  const connectMetaMask = async () => {
    return connectWallet('metamask');
  };
  
  const connectTrustWallet = async () => {
    return connectWallet('trust');
  };
  
  // WalletConnect implementation
  const connectWalletConnect = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (isMobileDevice()) {
        const mobileWallets = [
          { name: "Trust Wallet", link: config.WALLET.TRUST_WALLET.INSTALL_URL },
          { name: "MetaMask", link: config.WALLET.METAMASK.INSTALL_URL },
          { name: "Coinbase Wallet", link: "https://www.coinbase.com/wallet" }
        ];
        
        let message = "Please choose a wallet that supports WalletConnect:";
        let selectedWallet = null;
        
        if (window.confirm("Would you like to use WalletConnect to connect with your mobile wallet?")) {
          const walletChoice = prompt(
            `${message}\n\n1. Trust Wallet\n2. MetaMask\n3. Coinbase Wallet\n\nEnter number (1-3):`
          );
          
          if (walletChoice && !isNaN(walletChoice)) {
            const choice = parseInt(walletChoice);
            if (choice >= 1 && choice <= 3) {
              selectedWallet = mobileWallets[choice - 1];
              
              if (window.confirm(`Opening ${selectedWallet.name}. If you don't have it installed, you'll be taken to the download page.`)) {
                window.location.href = selectedWallet.link;
                return false;
              }
            }
          }
        }
      }
      
      alert("WalletConnect integration coming soon! Please use MetaMask or Trust Wallet for now.");
      setLoading(false);
      return false;
    } catch (error) {
      console.error("WalletConnect error:", error);
      setError(`WalletConnect error: ${error.message || 'Unknown error'}`);
      setLoading(false);
      return false;
    }
  };
  
  // Disconnect wallet
  const disconnectWallet = async () => {
    console.log("Disconnecting wallet...");
    
    if (provider && activeWallet) {
      try {
        const rawProvider = getProviderByType(activeWallet);
        if (rawProvider) {
          console.log("Removing event listeners from provider");
          if (rawProvider.removeListener) {
            rawProvider.removeListener('accountsChanged', handleAccountsChanged);
            rawProvider.removeListener('chainChanged', handleChainChanged);
            rawProvider.removeListener('disconnect', handleDisconnect);
          }
          
          if (rawProvider.isMetaMask) {
            try {
              await rawProvider.request({
                method: "wallet_revokePermissions",
                params: [{ eth_accounts: {} }]
              });
              console.log("MetaMask permissions revoked");
            } catch (revokeError) {
              console.log("Failed to revoke permissions:", revokeError);
            }
          }
        }
      } catch (error) {
        console.error("Error during disconnection:", error);
      }
    }
    
    localStorage.removeItem('activeWallet');
    
    setAccount(null);
    setProvider(null);
    setSigner(null);
    setChainId(null);
    setActiveWallet(null);
    setError(null);
    
    console.log("Wallet disconnected successfully");
  };
  
  // Format address for display
  const formatAddress = (address) => {
    if (!address) return '';
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };
  
  // Check if connected to the correct network
  const isCorrectNetwork = () => {
    return chainId === targetNetwork.ID;
  };
  
  // Helper to detect if MetaMask is available
  const isMetaMaskAvailable = () => {
    return availableProviders.some(p => p.type === 'metamask') || 
           allAvailableWallets.includes('metamask');
  };
  
  // Helper to detect if Trust Wallet is available
  const isTrustWalletAvailable = () => {
    return availableProviders.some(p => p.type === 'trust') || 
           allAvailableWallets.includes('trust');
  };
  
  // Context value
  const value = {
    account,
    provider,
    signer,
    chainId,
    loading,
    error,
    activeWallet,
    mobileWalletDeepLink,
    isCorrectNetwork,
    connectMetaMask,
    connectTrustWallet,
    connectWalletConnect,
    disconnectWallet,
    formatAddress,
    isMetaMaskAvailable,
    isTrustWalletAvailable,
    isMobileDevice,
    scanProviders,
    allAvailableWallets
  };
  
  return (
    <WalletContext.Provider value={value}>
      {children}
      
      {mobileWalletDeepLink && isMobileDevice() && (
        <div style={{
          position: 'fixed',
          bottom: '20px',
          left: '20px',
          right: '20px',
          background: 'linear-gradient(145deg, rgba(10, 15, 29, 0.95), rgba(5, 5, 25, 0.98))',
          border: '1px solid rgba(123, 94, 255, 0.4)',
          boxShadow: '0px 0px 20px rgba(0, 217, 255, 0.4)',
          padding: '15px',
          borderRadius: '15px',
          zIndex: 1000,
          textAlign: 'center',
          color: 'white'
        }}>
          <p style={{ marginBottom: '10px' }}>Connecting to wallet...</p>
          <p style={{ marginBottom: '15px' }}>
            If your wallet app didn't open automatically, please{' '}
            <a 
              href={mobileWalletDeepLink} 
              style={{
                color: '#00d9ff',
                textDecoration: 'underline',
                fontWeight: 'bold'
              }}
            >
              click here
            </a>{' '}
            to open it.
          </p>
          <button 
            onClick={() => setMobileWalletDeepLink(null)}
            style={{
              background: 'linear-gradient(135deg, #7500e2 40%, #00d9ff)',
              border: 'none',
              color: 'white',
              padding: '8px 16px',
              borderRadius: '10px',
              marginTop: '10px',
              cursor: 'pointer',
              fontWeight: 'bold',
              boxShadow: '0 0 10px rgba(0, 217, 255, 0.5)'
            }}
          >
            Close
          </button>
        </div>
      )}
    </WalletContext.Provider>
  );
};

export default WalletProvider;
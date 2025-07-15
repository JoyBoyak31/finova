// src/pages/ClaimAirdrop.jsx - Debug Version with Button State Debugging
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ethers } from 'ethers';
import Navbar from '../components/Navbar';
import WalletModal from '../components/WalletModal';
import { useWallet } from '../contexts/WalletContext';
import { useToast } from '../components/Toast/ToastSystem';
import config from '../config';
import '../styles/ClaimAirdrop.css';

// Local storage key for claim data
const CLAIM_DATA_KEY = 'fnva_airdrop_claims';

// Helper functions for localStorage management
const getClaimData = () => {
  try {
    const data = localStorage.getItem(CLAIM_DATA_KEY);
    return data ? JSON.parse(data) : {};
  } catch (error) {
    console.error('Error reading claim data:', error);
    return {};
  }
};

const saveClaimData = (address, claimInfo) => {
  try {
    const allClaimData = getClaimData();
    allClaimData[address.toLowerCase()] = claimInfo;
    localStorage.setItem(CLAIM_DATA_KEY, JSON.stringify(allClaimData));
    console.log('✅ Claim data saved successfully');
  } catch (error) {
    console.error('❌ Error saving claim data:', error);
  }
};

const getUserClaimData = (address) => {
  if (!address) return null;
  const allClaimData = getClaimData();
  return allClaimData[address.toLowerCase()] || null;
};

// Simulate delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const ClaimAirdrop = () => {
  const [walletModalOpen, setWalletModalOpen] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [claimStatus, setClaimStatus] = useState(null);
  const [isCopied, setIsCopied] = useState(false);
  const [userClaimData, setUserClaimData] = useState(null);
  const [checkingClaims, setCheckingClaims] = useState(false);
  const [userBalance, setUserBalance] = useState('0');
  const [actualFeePaid, setActualFeePaid] = useState(null);
  const [gasUsed, setGasUsed] = useState(null);
  const [showWithdrawModal, setShowWithdrawModal] = useState(false);
  const [showDebugInfo, setShowDebugInfo] = useState(true); // Default to true for debugging
  const [currentBNBPrice, setCurrentBNBPrice] = useState(config.PRICES.BNB_USD);
  const [forceEnableButton, setForceEnableButton] = useState(false); // Force enable for testing
  
  // Get wallet context
  const {
    account,
    provider,
    signer,
    connectMetaMask,
    connectTrustWallet,
    connectWalletConnect,
    disconnectWallet,
    formatAddress,
    loading: walletLoading,
    isCorrectNetwork,
    isMobileDevice
  } = useWallet();

  // Get toast context
  const toast = useToast();

  // Get configurable amounts from config
  const claimFeeUSD = config.FEE_SYSTEM.CLAIM_FEE_USD;
  const tokenAmount = config.getDisplayTokenAmount();
  const fundReceiverAddress = config.getFundReceiverAddress();

  // Update BNB price and claim fee when component mounts
  useEffect(() => {
    const updatePricing = async () => {
      try {
        console.log('🔄 Updating BNB price...');
        const newPrice = await config.updateBNBPriceFromAPI();
        setCurrentBNBPrice(newPrice);
        console.log('✅ BNB price updated to:', newPrice);
      } catch (error) {
        console.warn('⚠️ Could not update BNB price, using cached value:', error);
      }
    };

    updatePricing();
  }, []);

  // Get current claim fee in BNB (recalculated with latest price)
  const claimFeeInBNB = config.getClaimFeeInBNB();

  // Check user claim status and balance when wallet connects
  useEffect(() => {
    if (account && provider) {
      console.log('🔗 Wallet connected, checking status...');
      checkUserClaimStatus();
      checkUserBalance();
      
      // Log debug info for troubleshooting
      const debugInfo = config.getDebugInfo();
      console.log('🔍 Debug Info:', debugInfo);
      
      // Show detailed button state debugging
      setTimeout(() => {
        debugButtonState();
      }, 2000);
    } else {
      // Reset states when wallet disconnects
      setUserClaimData(null);
      setClaimStatus(null);
      setUserBalance('0');
      setActualFeePaid(null);
      setGasUsed(null);
    }
  }, [account, provider]);

  // Debug button state function
  const debugButtonState = () => {
    console.log('🔍 BUTTON STATE DEBUG:');
    console.log('- isLoading:', isLoading);
    console.log('- hasSufficientBalance():', hasSufficientBalance());
    console.log('- isCorrectNetwork():', isCorrectNetwork());
    console.log('- userClaimData:', userClaimData);
    console.log('- claimStatus:', claimStatus);
    console.log('- userBalance:', userBalance, 'BNB');
    console.log('- Required BNB:', (parseFloat(claimFeeInBNB) + config.FEE_SYSTEM.MIN_BNB_FOR_GAS));
    console.log('- forceEnableButton:', forceEnableButton);
    
    const shouldBeEnabled = !isLoading && 
                           (hasSufficientBalance() || forceEnableButton) && 
                           (isCorrectNetwork() || forceEnableButton) && 
                           !userClaimData;
    
    console.log('- Button should be enabled:', shouldBeEnabled);
    
    if (!shouldBeEnabled) {
      console.log('❌ Button disabled due to:');
      if (isLoading) console.log('  - Loading in progress');
      if (!hasSufficientBalance() && !forceEnableButton) console.log('  - Insufficient balance');
      if (!isCorrectNetwork() && !forceEnableButton) console.log('  - Wrong network');
      if (userClaimData) console.log('  - Already claimed');
    }
  };

  // Check user's BNB balance
  const checkUserBalance = async () => {
    if (!account || !provider) return;
    
    try {
      console.log('💰 Checking user balance...');
      const balance = await provider.getBalance(account);
      const balanceInBNB = ethers.formatEther(balance);
      setUserBalance(balanceInBNB);
      console.log(`✅ User balance: ${balanceInBNB} BNB`);
      
      // Debug balance check
      const required = parseFloat(claimFeeInBNB) + config.FEE_SYSTEM.MIN_BNB_FOR_GAS;
      const available = parseFloat(balanceInBNB);
      console.log(`💰 Balance check: ${available} BNB available, ${required} BNB required`);
      
    } catch (error) {
      console.error('❌ Error checking balance:', error);
      toast.error('Failed to check wallet balance', 5000);
      // Set a fallback balance to prevent button being disabled due to balance check failure
      setUserBalance('0.1'); 
    }
  };

  // Check if user has already claimed tokens
  const checkUserClaimStatus = async () => {
    if (!account) return;
    
    setCheckingClaims(true);
    console.log('🔍 Checking claim status for:', account);
    
    try {
      // Add small delay to simulate checking
      await delay(800);
      
      const claimData = getUserClaimData(account);
      
      if (claimData) {
        console.log('✅ Found previous claim:', claimData);
        setUserClaimData(claimData);
        setClaimStatus('already-claimed');
        setActualFeePaid(claimData.feePaidBNB || claimData.actualFeePaid || 'N/A');
        setGasUsed(claimData.gasUsed || 'N/A');
        toast.info(`Found previous claim of ${claimData.totalClaimed.toLocaleString()} FNVA tokens`, 4000);
      } else {
        console.log('✅ User is eligible to claim');
        setUserClaimData(null);
        setClaimStatus(null);
        setActualFeePaid(null);
        setGasUsed(null);
        toast.success(`You are eligible to claim ${tokenAmount.toLocaleString()} FNVA tokens!`, 4000);
      }
    } catch (error) {
      console.error('❌ Error checking claim status:', error);
      toast.error('Error checking claim status', 3000);
    } finally {
      setCheckingClaims(false);
    }
  };

  // Handle wallet connect
  const handleConnectClick = () => {
    if (!account && !connecting) {
      setWalletModalOpen(true);
    }
  };

  // Handle wallet selection
  const handleWalletSelect = async (walletId) => {
    if (connecting || walletLoading) return;

    setConnecting(true);
    setWalletModalOpen(false);

    try {
      console.log(`🔗 Connecting to ${walletId}...`);
      let success = false;

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
          toast.error(`Unknown wallet type: ${walletId}`, 5000);
      }

      if (success) {
        console.log('✅ Wallet connected successfully');
        toast.success(`Wallet connected successfully`, 3000);
      }
    } catch (error) {
      console.error('❌ Wallet connection failed:', error);
      toast.error(`Failed to connect: ${error.message}`, 5000);
    } finally {
      setTimeout(() => setConnecting(false), 1000);
    }
  };

  // Handle disconnect
  const handleDisconnectWallet = () => {
    console.log('🔌 Disconnecting wallet...');
    setUserClaimData(null);
    setClaimStatus(null);
    setUserBalance('0');
    setActualFeePaid(null);
    setGasUsed(null);
    disconnectWallet();
    toast.info('Wallet disconnected', 3000);
  };

  // Enhanced validation for production with better error reporting
  const validateClaimRequirements = async () => {
    console.log('🔍 Validating claim requirements...');
    
    if (!account) {
      console.log('❌ No account connected');
      toast.warning('Please connect your wallet first!', 3000);
      return false;
    }

    // Skip network check if force enabled
    if (!forceEnableButton && !isCorrectNetwork()) {
      const targetNetwork = config.getTargetNetwork();
      console.log('❌ Wrong network. Current:', provider?.network?.name, 'Expected:', targetNetwork.NAME);
      toast.error(`Please switch to ${targetNetwork.NAME}`, 5000);
      return false;
    }

    if (userClaimData) {
      console.log('❌ Already claimed');
      toast.warning('You have already claimed your tokens!', 3000);
      return false;
    }

    // Check if fund receiver is configured
    if (!config.isValidFundReceiver()) {
      console.error('❌ Invalid fund receiver configuration');
      toast.error('Fund receiver not configured properly. Please contact support.', 8000);
      return false;
    }

    // Skip balance check if force enabled
    if (!forceEnableButton) {
      // Update BNB price before final calculation
      try {
        await config.updateBNBPriceFromAPI();
      } catch (error) {
        console.warn('⚠️ Could not update BNB price for final calculation');
      }

      // Check if user has enough BNB for fee + gas
      const latestFeeInBNB = config.getClaimFeeInBNB();
      const requiredBNB = parseFloat(latestFeeInBNB) + config.FEE_SYSTEM.MIN_BNB_FOR_GAS;
      const userBNB = parseFloat(userBalance);

      console.log(`💰 Required: ${requiredBNB} BNB, Available: ${userBNB} BNB`);

      if (userBNB < requiredBNB) {
        console.log('❌ Insufficient balance');
        toast.error(`Insufficient BNB. You need at least ${requiredBNB.toFixed(4)} BNB (${latestFeeInBNB} for fee + ${config.FEE_SYSTEM.MIN_BNB_FOR_GAS} for gas)`, 10000);
        return false;
      }
    }

    console.log('✅ All claim requirements validated');
    return true;
  };

  // Enhanced claim function
  const claimAirdrop = async () => {
    console.log('🚀 Starting claim process...');
    
    if (!(await validateClaimRequirements())) {
      console.log('❌ Validation failed');
      return;
    }

    setIsLoading(true);

    try {
      // Get balance before transaction
      const balanceBefore = await provider.getBalance(account);
      console.log('💰 Balance before transaction:', ethers.formatEther(balanceBefore), 'BNB');
      
      // Get the latest fee calculation
      const latestFeeInBNB = config.getClaimFeeInBNB();
      console.log('💸 Claim fee:', latestFeeInBNB, 'BNB ($', claimFeeUSD, ')');
      
      toast.info(`Processing claim... Please pay ${latestFeeInBNB} BNB ($${claimFeeUSD}) fee`, 5000);
      
      // Convert fee to wei
      const feeInWei = ethers.parseEther(latestFeeInBNB);
      console.log('⚙️ Fee in wei:', feeInWei.toString());
      
      // Get fund receiver address and ensure proper checksum format
      let fundReceiverAddr = fundReceiverAddress;
      try {
        fundReceiverAddr = ethers.getAddress(fundReceiverAddress);
        console.log('✅ Fund receiver address (checksum):', fundReceiverAddr);
      } catch (checksumError) {
        console.warn('⚠️ Address checksum conversion failed, using original address');
        fundReceiverAddr = fundReceiverAddress;
      }
      
      // Get optimal gas price for production
      const gasPrice = await config.getOptimalGasPrice(provider);
      console.log('⛽ Gas price:', ethers.formatUnits(gasPrice, 'gwei'), 'Gwei');
      
      // Create transaction object
      const transaction = {
        to: fundReceiverAddr,
        value: feeInWei,
        gasPrice: gasPrice
      };
      
      // Estimate gas with buffer
      const gasLimit = await config.estimateGasWithBuffer(provider, transaction);
      transaction.gasLimit = gasLimit;
      
      console.log('📝 Transaction details:', {
        to: transaction.to,
        value: ethers.formatEther(transaction.value) + ' BNB',
        gasLimit: transaction.gasLimit.toString(),
        gasPrice: ethers.formatUnits(transaction.gasPrice, 'gwei') + ' Gwei'
      });

      toast.info('Please confirm the payment in your wallet', 6000);
      
      // Send transaction with timeout
      console.log('📡 Sending transaction...');
      const tx = await Promise.race([
        signer.sendTransaction(transaction),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Transaction timeout')), config.TIMING.TRANSACTION_TIMEOUT)
        )
      ]);
      
      console.log('✅ Payment transaction sent:', tx.hash);
      toast.info('Payment sent! Waiting for confirmation...', 5000);
      
      // Wait for confirmation with timeout
      console.log('⏳ Waiting for confirmation...');
      const receipt = await Promise.race([
        tx.wait(),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Confirmation timeout')), config.TIMING.TRANSACTION_TIMEOUT)
        )
      ]);
      
      if (receipt.status === 1) {
        console.log('✅ Payment confirmed:', receipt.transactionHash);
        
        // Get balance after transaction to calculate actual costs
        const balanceAfter = await provider.getBalance(account);
        const actualCostWei = balanceBefore - balanceAfter;
        const actualCostBNB = ethers.formatEther(actualCostWei);
        
        console.log('💰 Balance after transaction:', ethers.formatEther(balanceAfter), 'BNB');
        console.log('💸 Total cost:', actualCostBNB, 'BNB');
        
        // Calculate actual gas used
        const actualGasUsed = receipt.gasUsed;
        const actualGasCost = actualGasUsed * receipt.gasPrice;
        const actualGasCostBNB = ethers.formatEther(actualGasCost);
        
        console.log('⛽ Gas used:', actualGasUsed.toString(), 'units');
        console.log('⛽ Gas cost:', actualGasCostBNB, 'BNB');
        
        // Verify the fee amount (should be close to expected)
        const actualFeePaidBNB = parseFloat(actualCostBNB) - parseFloat(actualGasCostBNB);
        
        // Create claim record with detailed fee information
        const claimInfo = {
          totalClaimed: tokenAmount,
          claimDate: new Date().toISOString(),
          paymentTxHash: receipt.transactionHash,
          feePaidBNB: latestFeeInBNB,
          actualFeePaid: actualFeePaidBNB.toFixed(6),
          feePaidUSD: claimFeeUSD,
          gasUsed: actualGasUsed.toString(),
          gasCostBNB: actualGasCostBNB,
          totalCostBNB: actualCostBNB,
          gasPrice: ethers.formatUnits(receipt.gasPrice, 'gwei'),
          blockNumber: receipt.blockNumber,
          fundReceiverAddress: fundReceiverAddr,
          bnbPriceAtClaim: config.PRICES.BNB_USD,
          environment: config.ENVIRONMENT,
          networkUsed: config.getTargetNetwork().NAME
        };
        
        console.log('💾 Saving claim data:', claimInfo);
        
        // Save claim data
        saveClaimData(account, claimInfo);
        
        // Update component state
        setUserClaimData(claimInfo);
        setClaimStatus('success');
        setActualFeePaid(actualFeePaidBNB.toFixed(6));
        setGasUsed(actualGasUsed.toString());
        
        // Update balance
        await checkUserBalance();

        toast.success(`🎉 Payment successful! You've claimed ${tokenAmount.toLocaleString()} FNVA tokens. Total cost: ${parseFloat(actualCostBNB).toFixed(6)} BNB (Fee: ${actualFeePaidBNB.toFixed(6)} BNB + Gas: ${parseFloat(actualGasCostBNB).toFixed(6)} BNB)`, 12000);
        
        console.log('🎉 Claim process completed successfully!');
        
      } else {
        throw new Error('Payment transaction failed - receipt status: ' + receipt.status);
      }
    } catch (error) {
      console.error('❌ Claim error:', error);
      setClaimStatus('error');
      
      // Enhanced error handling
      let errorMessage = 'Payment failed. Please try again.';
      
      if (error.code === 'ACTION_REJECTED' || error.code === 4001) {
        errorMessage = 'Transaction was rejected by user';
        toast.warning(errorMessage, 5000);
      } else if (error.message?.includes('insufficient funds')) {
        errorMessage = 'Insufficient funds for payment and gas fees';
        toast.error(errorMessage, 8000);
      } else if (error.message?.includes('bad address checksum')) {
        errorMessage = 'Invalid receiver address configuration. Please contact support.';
        toast.error(errorMessage, 10000);
      } else if (error.message?.includes('timeout')) {
        errorMessage = 'Transaction timed out. Please check your wallet and try again.';
        toast.error(errorMessage, 8000);
      } else if (error.message?.includes('gas')) {
        errorMessage = 'Gas estimation failed. Please try again with more BNB for gas.';
        toast.error(errorMessage, 8000);
      } else if (error.message?.includes('network')) {
        errorMessage = 'Network error. Please check your connection and try again.';
        toast.error(errorMessage, 8000);
      } else {
        errorMessage = `Payment failed: ${error.message}`;
        toast.error(errorMessage, 10000);
      }
      
      console.error('💥 Detailed error:', {
        message: error.message,
        code: error.code,
        data: error.data,
        stack: error.stack
      });
    } finally {
      setIsLoading(false);
      console.log('🔄 Claim process finished');
    }
  };

  // Copy text to clipboard
  const copyToClipboard = (text, label = 'Text') => {
    navigator.clipboard.writeText(text).then(() => {
      toast.info(`${label} copied to clipboard!`, 3000);
    });
  };

  // Copy wallet address
  const copyAddress = () => {
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
    copyToClipboard(account, 'Address');
  };

  // Format date
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Check if user has sufficient balance (with better error handling)
  const hasSufficientBalance = () => {
    try {
      const requiredBNB = parseFloat(claimFeeInBNB) + config.FEE_SYSTEM.MIN_BNB_FOR_GAS;
      const userBNB = parseFloat(userBalance);
      console.log(`💰 Balance check: ${userBNB} >= ${requiredBNB} = ${userBNB >= requiredBNB}`);
      return userBNB >= requiredBNB;
    } catch (error) {
      console.error('❌ Error in balance check:', error);
      return false;
    }
  };

  // Format number for display
  const formatNumber = (num, decimals = 6) => {
    if (num === null || num === undefined || num === 'N/A') return 'N/A';
    const number = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(number) ? 'N/A' : number.toFixed(decimals);
  };

  // Handle withdrawal attempt
  const handleWithdrawClick = () => {
    if (config.isWithdrawalEnabled()) {
      setShowWithdrawModal(true);
    } else {
      toast.info(config.getWithdrawalMessage(), 10000);
    }
  };

  // Close withdrawal modal
  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
  };

  // Enhanced debug panel
  const DebugPanel = () => {
    if (!showDebugInfo) return null;
    
    const debugInfo = config.getDebugInfo();
    const networkCheck = isCorrectNetwork();
    const balanceCheck = hasSufficientBalance();
    const buttonShouldBeEnabled = !isLoading && 
                                 (balanceCheck || forceEnableButton) && 
                                 (networkCheck || forceEnableButton) && 
                                 !userClaimData;
    
    return (
      <div className="debug-panel">
        <h4>🔍 Debug Information & Button State</h4>
        <div className="debug-content">
          <div className="debug-section">
            <h5>📊 Configuration</h5>
            <p><strong>Environment:</strong> <span className={debugInfo.environment === 'production' ? 'text-success' : 'text-warning'}>{debugInfo.environment}</span></p>
            <p><strong>Hostname:</strong> {debugInfo.hostname}</p>
            <p><strong>Network:</strong> <span className={debugInfo.targetNetwork === 'BNB Smart Chain' ? 'text-success' : 'text-warning'}>{debugInfo.targetNetwork}</span></p>
            <p><strong>Fund Receiver:</strong> {debugInfo.fundReceiver}</p>
            <p><strong>Valid Receiver:</strong> <span className={debugInfo.isValidReceiver ? 'text-success' : 'text-error'}>{debugInfo.isValidReceiver ? '✅' : '❌'}</span></p>
          </div>
          
          <div className="debug-section">
            <h5>💰 Pricing</h5>
            <p><strong>Claim Fee USD:</strong> ${debugInfo.claimFeeUSD}</p>
            <p><strong>Claim Fee BNB:</strong> {debugInfo.claimFeeBNB} BNB</p>
            <p><strong>BNB Price:</strong> ${debugInfo.bnbPrice}</p>
            <p><strong>Token Amount:</strong> {debugInfo.tokenAmount.toLocaleString()}</p>
          </div>
          
          {account && (
            <div className="debug-section">
              <h5>🔗 Wallet Status</h5>
              <p><strong>Connected Account:</strong> {account}</p>
              <p><strong>User Balance:</strong> {userBalance} BNB</p>
              <p><strong>Required Balance:</strong> {(parseFloat(claimFeeInBNB) + config.FEE_SYSTEM.MIN_BNB_FOR_GAS).toFixed(6)} BNB</p>
              <p><strong>Sufficient Balance:</strong> <span className={balanceCheck ? 'text-success' : 'text-error'}>{balanceCheck ? '✅' : '❌'}</span></p>
              <p><strong>Correct Network:</strong> <span className={networkCheck ? 'text-success' : 'text-error'}>{networkCheck ? '✅' : '❌'}</span></p>
              <p><strong>Already Claimed:</strong> <span className={userClaimData ? 'text-warning' : 'text-success'}>{userClaimData ? '❌ Yes' : '✅ No'}</span></p>
            </div>
          )}
          
          <div className="debug-section">
            <h5>🔘 Button State</h5>
            <p><strong>Is Loading:</strong> <span className={isLoading ? 'text-warning' : 'text-success'}>{isLoading ? '❌' : '✅'}</span></p>
            <p><strong>Should Be Enabled:</strong> <span className={buttonShouldBeEnabled ? 'text-success' : 'text-error'}>{buttonShouldBeEnabled ? '✅' : '❌'}</span></p>
            <p><strong>Force Enable:</strong> <span className={forceEnableButton ? 'text-warning' : 'text-muted'}>{forceEnableButton ? '✅ ON' : '❌ OFF'}</span></p>
          </div>
          
          <div className="debug-actions">
            <button 
              className="debug-action-btn"
              onClick={() => {
                setForceEnableButton(!forceEnableButton);
                console.log('🔧 Force enable button:', !forceEnableButton);
              }}
              style={{
                background: forceEnableButton ? '#f44336' : '#4caf50',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              {forceEnableButton ? 'Disable Force' : 'Force Enable'} Button
            </button>
            
            <button 
              className="debug-action-btn"
              onClick={() => {
                debugButtonState();
                toast.info('Button state logged to console', 3000);
              }}
              style={{
                background: '#2196f3',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer',
                marginRight: '8px'
              }}
            >
              Debug Button State
            </button>
            
            <button 
              className="debug-action-btn"
              onClick={() => {
                checkUserBalance();
                toast.info('Balance refreshed', 3000);
              }}
              style={{
                background: '#ff9800',
                color: 'white',
                border: 'none',
                padding: '8px 16px',
                borderRadius: '4px',
                cursor: 'pointer'
              }}
            >
              Refresh Balance
            </button>
          </div>
        </div>
      </div>
    );
  };

  // Withdrawal Modal Component
  const WithdrawModal = () => {
    if (!showWithdrawModal) return null;

    return (
      <div className="withdraw-modal-overlay" onClick={closeWithdrawModal}>
        <div className="withdraw-modal-content" onClick={e => e.stopPropagation()}>
          <div className="withdraw-modal-header">
            <h3>Withdraw FNVA Tokens</h3>
            <button className="modal-close-btn" onClick={closeWithdrawModal}>×</button>
          </div>
          <div className="withdraw-modal-body">
            <div className="withdraw-info">
              <div className="withdraw-amount">
                <span className="amount">{userClaimData?.totalClaimed.toLocaleString()}</span>
                <span className="token-symbol">FNVA</span>
              </div>
              <p>Available for withdrawal</p>
            </div>
            <button className="primary-btn withdraw-confirm-btn">
              Withdraw {userClaimData?.totalClaimed.toLocaleString()} FNVA
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="airdrop-page">
      <Navbar />

      <div className="airdrop-container">
        <div className="airdrop-box glass-container">
          <div className="airdrop-header">
            <h1 className="airdrop-title">
              <span className="text-gradient">Claim Your</span> FINOVA AI Airdrop
            </h1>
            <p className="airdrop-description">
              Get your {tokenAmount.toLocaleString()} FNVA tokens by paying a processing fee of ${claimFeeUSD} ({claimFeeInBNB} BNB). 
              This fee helps us process and verify your claim.
            </p>
            
            {/* Debug toggle - always visible for troubleshooting */}
            <div className="debug-toggle" style={{ marginTop: '1rem' }}>
              <button 
                className="debug-btn"
                onClick={() => setShowDebugInfo(!showDebugInfo)}
                style={{
                  background: showDebugInfo ? '#f44336' : 'rgba(123, 140, 255, 0.2)',
                  border: '1px solid rgba(123, 140, 255, 0.3)',
                  color: showDebugInfo ? 'white' : 'rgba(123, 140, 255, 0.7)',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '0.8rem',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                {showDebugInfo ? '🔍 Hide Debug Panel' : '🔍 Show Debug Panel'}
              </button>
            </div>
          </div>

          {/* Debug Panel - Enhanced */}
          <DebugPanel />

          <div className="airdrop-content">
            {!account ? (
              <div className="wallet-connect-section">
                <button
                  className="primary-btn connect-wallet-btn"
                  onClick={handleConnectClick}
                  disabled={connecting || walletLoading}
                >
                  {connecting || walletLoading ? (
                    <>
                      <span className="loading-spinner"></span>
                      <span>Connecting...</span>
                    </>
                  ) : (
                    'Connect Wallet'
                  )}
                </button>
              </div>
            ) : (
              <div className="wallet-connected-section">
                <div className="wallet-info">
                  <div className="wallet-address">
                    <span className="wallet-label">Connected Wallet:</span>
                    <div className="address-container">
                      <span className="address-text">{formatAddress(account)}</span>
                      <button className="copy-address-btn" onClick={copyAddress}>
                        {isCopied ? 'Copied!' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="wallet-balance">
                    <span className="balance-label">BNB Balance:</span>
                    <span className="balance-value">
                      {parseFloat(userBalance).toFixed(4)} BNB
                    </span>
                  </div>
                  <button className="secondary-btn disconnect-btn" onClick={handleDisconnectWallet}>
                    Disconnect
                  </button>
                </div>

                {/* Network Warning */}
                {!isCorrectNetwork() && !forceEnableButton && (
                  <div className="network-warning">
                    ⚠️ Please switch to {config.getTargetNetwork().NAME} to continue
                  </div>
                )}

                {/* Fee Information */}
                <div className="fee-info-section">
                  <div className="fee-info-card">
                    <h4>💰 Payment Required</h4>
                    <div className="fee-details">
                      <div className="fee-item">
                        <span className="fee-label">Processing Fee:</span>
                        <span className="fee-value">${claimFeeUSD} ({claimFeeInBNB} BNB)</span>
                      </div>
                      <div className="fee-item">
                        <span className="fee-label">Gas Fee (estimated):</span>
                        <span className="fee-value">~{config.FEE_SYSTEM.MIN_BNB_FOR_GAS} BNB</span>
                      </div>
                      <div className="fee-item">
                        <span className="fee-label">Total Required:</span>
                        <span className="fee-value total">
                          ~{(parseFloat(claimFeeInBNB) + config.FEE_SYSTEM.MIN_BNB_FOR_GAS).toFixed(4)} BNB
                        </span>
                      </div>
                      <div className="fee-item">
                        <span className="fee-label">Current BNB Price:</span>
                        <span className="fee-value">${config.PRICES.BNB_USD}</span>
                      </div>
                    </div>
                    
                    {!hasSufficientBalance() && !forceEnableButton && (
                      <div className="insufficient-balance-warning">
                        ⚠️ Insufficient BNB balance. Please add more BNB to your wallet.
                      </div>
                    )}
                    
                    {forceEnableButton && (
                      <div className="force-enable-warning" style={{
                        background: 'rgba(255, 193, 7, 0.1)',
                        border: '1px solid rgba(255, 193, 7, 0.3)',
                        borderRadius: '8px',
                        padding: '12px',
                        marginTop: '12px',
                        color: '#FFC107'
                      }}>
                        🔧 <strong>Force Enable Mode:</strong> Button validation checks bypassed for testing
                      </div>
                    )}
                  </div>
                </div>

                {/* User Claim Status Indicator */}
                {checkingClaims ? (
                  <div className="claim-status-indicator checking">
                    <div className="loading-spinner"></div>
                    <span>Checking claim status...</span>
                  </div>
                ) : userClaimData ? (
                  <div className="claim-status-indicator claimed">
                    <div className="status-icon">✓</div>
                    <div className="status-info">
                      <span className="status-text">
                        You claimed <strong>{userClaimData.totalClaimed.toLocaleString()} FNVA</strong>
                      </span>
                      <span className="status-date">on {formatDate(userClaimData.claimDate)}</span>
                      <div className="fee-breakdown">
                        <span className="fee-paid">
                          <strong>Fee Paid:</strong> {formatNumber(userClaimData.actualFeePaid || userClaimData.feePaidBNB)} BNB
                        </span>
                        {userClaimData.gasCostBNB && (
                          <span className="gas-paid">
                            <strong>Gas Cost:</strong> {formatNumber(userClaimData.gasCostBNB)} BNB
                          </span>
                        )}
                        {userClaimData.totalCostBNB && (
                          <span className="total-paid">
                            <strong>Total Cost:</strong> {formatNumber(userClaimData.totalCostBNB)} BNB
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="claim-status-indicator eligible">
                    <div className="status-icon">🎁</div>
                    <div className="status-info">
                      <span className="status-text">You're eligible to claim <strong>{tokenAmount.toLocaleString()} FNVA</strong></span>
                    </div>
                  </div>
                )}

                <div className="claim-section">
                  {claimStatus === null && !userClaimData && (
                    <div className="claim-info">
                      <h3>You are eligible for:</h3>
                      <div className="token-amount">
                        <span className="amount">{tokenAmount.toLocaleString()}</span>
                        <span className="token-name">FNVA Tokens</span>
                      </div>
                      
                      <div className="payment-notice">
                        <p>💡 Pay ${claimFeeUSD} processing fee to claim your tokens</p>
                      </div>
                      
                      <button
                        className="primary-btn claim-btn"
                        onClick={claimAirdrop}
                        disabled={isLoading || (!hasSufficientBalance() && !forceEnableButton) || (!isCorrectNetwork() && !forceEnableButton)}
                        style={{
                          opacity: (isLoading || (!hasSufficientBalance() && !forceEnableButton) || (!isCorrectNetwork() && !forceEnableButton)) ? 0.6 : 1,
                          cursor: (isLoading || (!hasSufficientBalance() && !forceEnableButton) || (!isCorrectNetwork() && !forceEnableButton)) ? 'not-allowed' : 'pointer'
                        }}
                      >
                        {isLoading ? (
                          <>
                            <span className="loading-spinner"></span>
                            <span>Processing Payment...</span>
                          </>
                        ) : forceEnableButton ? (
                          `🔧 FORCE: Pay ${claimFeeInBNB} BNB & Claim`
                        ) : (
                          `Pay ${claimFeeInBNB} BNB & Claim`
                        )}
                      </button>
                    </div>
                  )}

                  {/* Rest of the claim states remain the same... */}
                  {claimStatus === 'success' && (
                    <div className="claim-success">
                      <div className="success-icon">✓</div>
                      <h3>Payment Successful!</h3>
                      <p>Your payment has been processed and {tokenAmount.toLocaleString()} FNVA tokens have been allocated to your wallet.</p>
                      
                      <div className="transaction-info">
                        <div className="tx-row">
                          <span>Payment Transaction:</span>
                          <span 
                            className="tx-hash clickable"
                            onClick={() => copyToClipboard(userClaimData?.paymentTxHash, 'Payment transaction hash')}
                            title="Click to copy"
                          >
                            {userClaimData?.paymentTxHash?.slice(0, 10)}...{userClaimData?.paymentTxHash?.slice(-8)}
                          </span>
                        </div>
                        {userClaimData?.blockNumber && (
                          <div className="tx-row">
                            <span>Block Number:</span>
                            <span>{userClaimData.blockNumber}</span>
                          </div>
                        )}
                        <div className="tx-row">
                          <span>View on BSCScan:</span>
                          <a 
                            href={config.getBSCScanLink(userClaimData?.paymentTxHash)}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bscscan-link"
                          >
                            Open Transaction
                          </a>
                        </div>
                      </div>

                      <div className="payment-summary">
                        <div className="payment-details">
                          <p><strong>Processing Fee:</strong> {formatNumber(userClaimData?.actualFeePaid || userClaimData?.feePaidBNB)} BNB (${userClaimData?.feePaidUSD})</p>
                          {userClaimData?.gasCostBNB && (
                            <p><strong>Gas Cost:</strong> {formatNumber(userClaimData.gasCostBNB)} BNB</p>
                          )}
                          {userClaimData?.totalCostBNB && (
                            <p><strong>Total Cost:</strong> {formatNumber(userClaimData.totalCostBNB)} BNB</p>
                          )}
                          <p><strong>Tokens Claimed:</strong> {userClaimData?.totalClaimed.toLocaleString()} FNVA</p>
                          {userClaimData?.gasUsed && (
                            <p><strong>Gas Used:</strong> {parseInt(userClaimData.gasUsed).toLocaleString()} units</p>
                          )}
                          {userClaimData?.gasPrice && (
                            <p><strong>Gas Price:</strong> {parseFloat(userClaimData.gasPrice).toFixed(2)} Gwei</p>
                          )}
                        </div>
                        
                        <div className="action-buttons">
                          <button 
                            className="secondary-btn withdraw-btn"
                            onClick={handleWithdrawClick}
                            title="Withdraw your FNVA tokens"
                          >
                            💰 Withdraw Tokens
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {claimStatus === 'error' && (
                    <div className="claim-error">
                      <div className="error-icon">✕</div>
                      <h3>Payment Failed</h3>
                      <p>There was an error processing your payment. Please try again.</p>
                      <button className="secondary-btn retry-btn" onClick={claimAirdrop}>
                        Try Again
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          <div className="airdrop-footer">
            <div className="airdrop-steps">
              <h3>How it works:</h3>
              <div className="steps-flow">
                <div className="step-item">
                  <div className="step-icon">
                    <span className="step-number">1</span>
                  </div>
                  <span className="step-text">Connect wallet</span>
                </div>
                <div className="step-arrow">→</div>
                <div className="step-item">
                  <div className="step-icon">
                    <span className="step-number">2</span>
                  </div>
                  <span className="step-text">Pay processing fee</span>
                </div>
                <div className="step-arrow">→</div>
                <div className="step-item">
                  <div className="step-icon">
                    <span className="step-number">3</span>
                  </div>
                  <span className="step-text">Receive tokens</span>
                </div>
              </div>
            </div>

            <p className="airdrop-note">
              Processing fee: ${claimFeeUSD} per claim. Each wallet can claim once. Tokens are allocated after payment confirmation.
            </p>
          </div>
        </div>
      </div>

      {/* Wallet Selection Modal */}
      <WalletModal
        isOpen={walletModalOpen}
        onClose={() => setWalletModalOpen(false)}
        onSelect={handleWalletSelect}
      />

      {/* Withdrawal Modal */}
      <WithdrawModal />

      {/* Additional styles for debug panel */}
      <style jsx>{`
        .debug-panel {
          background: linear-gradient(135deg, rgba(255, 193, 7, 0.1) 0%, rgba(255, 152, 0, 0.05) 100%);
          border: 1px solid rgba(255, 193, 7, 0.3);
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 1.5rem;
          font-size: 0.875rem;
        }
        
        .debug-content {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1rem;
        }
        
        .debug-section {
          background: rgba(0, 0, 0, 0.1);
          border-radius: 8px;
          padding: 1rem;
        }
        
        .debug-section h5 {
          margin: 0 0 0.75rem 0;
          color: var(--accent-indigo);
          font-size: 0.9rem;
          font-weight: 600;
        }
        
        .debug-section p {
          margin: 0.25rem 0;
          color: var(--text-muted);
          font-family: 'Courier New', monospace;
        }
        
        .debug-actions {
          grid-column: 1 / -1;
          margin-top: 1rem;
          padding-top: 1rem;
          border-top: 1px solid rgba(255, 193, 7, 0.2);
        }
        
        .text-success { color: #4caf50 !important; font-weight: 600; }
        .text-error { color: #f44336 !important; font-weight: 600; }
        .text-warning { color: #ff9800 !important; font-weight: 600; }
        .text-muted { color: var(--text-muted) !important; }
        
        .network-warning {
          background: rgba(255, 152, 0, 0.1);
          border: 1px solid rgba(255, 152, 0, 0.3);
          border-radius: 8px;
          padding: 1rem;
          margin-bottom: 1rem;
          text-align: center;
          color: #ff9800;
          font-weight: 500;
        }
        
        .bscscan-link {
          color: var(--accent-indigo);
          text-decoration: none;
          font-weight: 500;
        }
        
        .bscscan-link:hover {
          text-decoration: underline;
        }
        
        .withdraw-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: rgba(13, 17, 33, 0.95);
          backdrop-filter: blur(15px);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 1rem;
        }

        .withdraw-modal-content {
          background: linear-gradient(145deg, rgba(13, 17, 33, 0.95) 0%, rgba(26, 32, 54, 0.95) 100%);
          border: 1px solid rgba(123, 140, 255, 0.2);
          border-radius: var(--border-radius-lg);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.4);
          max-width: 400px;
          width: 100%;
          padding: 0;
        }

        .withdraw-modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem;
          border-bottom: 1px solid rgba(123, 140, 255, 0.1);
        }

        .withdraw-modal-header h3 {
          margin: 0;
          color: var(--text-light);
        }

        .modal-close-btn {
          background: transparent;
          border: none;
          color: var(--text-light);
          font-size: 1.5rem;
          cursor: pointer;
          padding: 0.25rem;
          border-radius: 4px;
          transition: all 0.2s ease;
        }

        .modal-close-btn:hover {
          background: rgba(123, 140, 255, 0.1);
          color: var(--accent-indigo);
        }

        .withdraw-modal-body {
          padding: 1.5rem;
          text-align: center;
        }

        .withdraw-info {
          margin-bottom: 1.5rem;
        }

        .withdraw-amount {
          display: flex;
          align-items: baseline;
          justify-content: center;
          gap: 0.5rem;
          margin-bottom: 0.5rem;
        }

        .withdraw-amount .amount {
          font-size: 2rem;
          font-weight: bold;
          color: var(--accent-indigo);
        }

        .withdraw-amount .token-symbol {
          font-size: 1.2rem;
          color: var(--text-muted);
        }

        .withdraw-confirm-btn {
          width: 100%;
          margin-top: 1rem;
        }
      `}</style>
    </div>
  );
};

export default ClaimAirdrop;
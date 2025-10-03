const { ethers } = require('ethers');

// Simple contract ABI for certificate storage
const CONTRACT_ABI = [
  "function storeCertificate(string memory certificateHash) public returns (bool)",
  "function verifyCertificate(string memory certificateHash) public view returns (bool, uint256)",
  "event CertificateStored(string certificateHash, uint256 timestamp)"
];

class BlockchainService {
  constructor() {
    this.provider = null;
    this.contract = null;
    this.signer = null;
    this.networkName = 'Unknown';
    this.init();
  }

  async init() {
    try {
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      // Get network information
      try {
        const network = await this.provider.getNetwork();
        this.networkName = network.name;
        const chainId = network.chainId;
        
        if (chainId === 11155111n) {
          this.networkName = 'Sepolia';
        } else if (chainId === 80001n) {
          this.networkName = 'Mumbai';
        } else if (chainId === 31337n) {
          this.networkName = 'Localhost';
        }
        
        console.log(`⛓️  Connected to ${this.networkName} network (Chain ID: ${chainId})`);
      } catch (netError) {
        console.warn('Could not fetch network info:', netError.message);
      }
      
      if (process.env.PRIVATE_KEY) {
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
        const address = await this.signer.getAddress();
        console.log(`🔑 Wallet address: ${address}`);
        
        // Check balance
        try {
          const balance = await this.provider.getBalance(address);
          const balanceInEth = ethers.formatEther(balance);
          console.log(`💰 Wallet balance: ${balanceInEth} ETH`);
          
          if (balance === 0n) {
            console.warn('⚠️  Warning: Wallet has 0 balance. Get Sepolia ETH from faucet!');
          }
        } catch (balanceError) {
          console.warn('Could not check balance:', balanceError.message);
        }
      } else {
        console.warn('⚠️  No private key configured. Blockchain storage will be disabled.');
      }

      if (process.env.CONTRACT_ADDRESS && this.signer) {
        this.contract = new ethers.Contract(
          process.env.CONTRACT_ADDRESS,
          CONTRACT_ABI,
          this.signer
        );
        console.log(`📜 Contract initialized at: ${process.env.CONTRACT_ADDRESS}`);
      } else if (!process.env.CONTRACT_ADDRESS) {
        console.warn('⚠️  No contract address configured. Deploy contract first!');
      }

      console.log('⛓️  Blockchain service initialized successfully');
    } catch (error) {
      console.error('❌ Error initializing blockchain service:', error.message);
    }
  }

  async storeCertificateHash(certificateHash) {
    try {
      if (!this.contract) {
        console.warn('⚠️  Contract not initialized, skipping blockchain storage');
        return { 
          success: true, 
          txHash: null,
          blockNumber: null,
          network: this.networkName,
          mock: true,
          message: 'Contract not configured - certificate stored locally only'
        };
      }

      console.log(`📝 Storing certificate hash on ${this.networkName}...`);
      
      // Estimate gas before sending transaction
      try {
        const gasEstimate = await this.contract.storeCertificate.estimateGas(certificateHash);
        console.log(`⛽ Estimated gas: ${gasEstimate.toString()}`);
      } catch (gasError) {
        console.warn('Could not estimate gas:', gasError.message);
      }

      // Send transaction
      const tx = await this.contract.storeCertificate(certificateHash);
      console.log(`📤 Transaction sent: ${tx.hash}`);
      console.log(`⏳ Waiting for confirmation...`);
      
      // Wait for transaction to be mined
      const receipt = await tx.wait();
      
      console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);
      console.log(`🔗 Transaction hash: ${receipt.hash}`);
      
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber,
        network: this.networkName,
        gasUsed: receipt.gasUsed.toString(),
        mock: false
      };
    } catch (error) {
      console.error('❌ Error storing certificate on blockchain:', error.message);
      
      // Return detailed error information
      return {
        success: false,
        error: error.message,
        network: this.networkName,
        mock: false
      };
    }
  }

  async verifyCertificateHash(certificateHash) {
    try {
      if (!this.contract) {
        console.warn('⚠️  Contract not initialized, returning mock verification');
        return { 
          exists: true, 
          timestamp: Date.now(), 
          network: this.networkName,
          mock: true 
        };
      }

      console.log(`🔍 Verifying certificate on ${this.networkName}...`);
      const [exists, timestamp] = await this.contract.verifyCertificate(certificateHash);
      
      console.log(`${exists ? '✅' : '❌'} Certificate ${exists ? 'found' : 'not found'} on blockchain`);
      
      return {
        exists,
        timestamp: timestamp.toString(),
        verified: exists,
        network: this.networkName,
        mock: false
      };
    } catch (error) {
      console.error('❌ Error verifying certificate on blockchain:', error.message);
      return {
        exists: false,
        error: error.message,
        network: this.networkName,
        mock: false
      };
    }
  }

  // Get transaction details
  async getTransactionDetails(txHash) {
    try {
      if (!this.provider) {
        throw new Error('Provider not initialized');
      }

      const tx = await this.provider.getTransaction(txHash);
      const receipt = await this.provider.getTransactionReceipt(txHash);
      
      return {
        transaction: tx,
        receipt: receipt,
        network: this.networkName
      };
    } catch (error) {
      console.error('Error fetching transaction details:', error.message);
      throw error;
    }
  }

  // Check if service is ready
  isReady() {
    return {
      hasProvider: !!this.provider,
      hasSigner: !!this.signer,
      hasContract: !!this.contract,
      network: this.networkName,
      ready: !!(this.provider && this.signer && this.contract)
    };
  }
}

module.exports = new BlockchainService();

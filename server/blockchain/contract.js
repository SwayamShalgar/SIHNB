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
    this.init();
  }

  init() {
    try {
      const rpcUrl = process.env.BLOCKCHAIN_RPC_URL || 'http://127.0.0.1:8545';
      this.provider = new ethers.JsonRpcProvider(rpcUrl);
      
      if (process.env.PRIVATE_KEY) {
        this.signer = new ethers.Wallet(process.env.PRIVATE_KEY, this.provider);
      }

      if (process.env.CONTRACT_ADDRESS && this.signer) {
        this.contract = new ethers.Contract(
          process.env.CONTRACT_ADDRESS,
          CONTRACT_ABI,
          this.signer
        );
      }

      console.log('⛓️  Blockchain service initialized');
    } catch (error) {
      console.error('Error initializing blockchain service:', error.message);
    }
  }

  async storeCertificateHash(certificateHash) {
    try {
      if (!this.contract) {
        console.warn('Contract not initialized, skipping blockchain storage');
        return { success: true, txHash: 'mock-tx-hash', mock: true };
      }

      const tx = await this.contract.storeCertificate(certificateHash);
      const receipt = await tx.wait();
      
      return {
        success: true,
        txHash: receipt.hash,
        blockNumber: receipt.blockNumber
      };
    } catch (error) {
      console.error('Error storing certificate on blockchain:', error.message);
      throw error;
    }
  }

  async verifyCertificateHash(certificateHash) {
    try {
      if (!this.contract) {
        console.warn('Contract not initialized, returning mock verification');
        return { exists: true, timestamp: Date.now(), mock: true };
      }

      const [exists, timestamp] = await this.contract.verifyCertificate(certificateHash);
      
      return {
        exists,
        timestamp: timestamp.toString(),
        verified: exists
      };
    } catch (error) {
      console.error('Error verifying certificate on blockchain:', error.message);
      throw error;
    }
  }
}

module.exports = new BlockchainService();

# Blockchain Setup Guide

## Option 1: Local Development with Ganache (Recommended for MVP)

### 1. Install Ganache
```bash
npm install -g ganache
```

### 2. Start Ganache
```bash
ganache --port 8545
```

This will give you:
- 10 accounts with 100 ETH each
- Local blockchain at `http://127.0.0.1:8545`

### 3. Update server/.env
```env
BLOCKCHAIN_RPC_URL=http://127.0.0.1:8545
PRIVATE_KEY=<copy_private_key_from_ganache_output>
```

### 4. Deploy Contract

Install Hardhat:
```bash
cd blockchain
npm init -y
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

Create deployment script `scripts/deploy.js`:
```javascript
async function main() {
  const CertificateRegistry = await ethers.getContractFactory("CertificateRegistry");
  const contract = await CertificateRegistry.deploy();
  await contract.deployed();
  console.log("Contract deployed to:", contract.address);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
```

Deploy:
```bash
npx hardhat run scripts/deploy.js --network localhost
```

Copy the contract address and update `server/.env`:
```env
CONTRACT_ADDRESS=<your_contract_address>
```

## Option 2: Polygon Mumbai Testnet (For Production-Like Testing)

### 1. Get Mumbai MATIC
Visit: https://faucet.polygon.technology/
Enter your wallet address to get test MATIC

### 2. Update server/.env
```env
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=<your_wallet_private_key>
```

### 3. Configure Hardhat for Mumbai

Edit `hardhat.config.js`:
```javascript
require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.19",
  networks: {
    mumbai: {
      url: process.env.BLOCKCHAIN_RPC_URL,
      accounts: [process.env.PRIVATE_KEY]
    }
  }
};
```

### 4. Deploy to Mumbai
```bash
npx hardhat run scripts/deploy.js --network mumbai
```

### 5. Verify Contract (Optional)
Get API key from https://polygonscan.com/
```bash
npx hardhat verify --network mumbai <CONTRACT_ADDRESS>
```

## Option 3: Mock Mode (No Blockchain Required)

The application will work in mock mode if:
- `CONTRACT_ADDRESS` is not set in `.env`
- Or blockchain connection fails

In mock mode:
- Certificates are still stored in SQLite
- "Mock" flag is returned in API responses
- All features work except real blockchain verification

## Testing the Contract

You can test the contract directly using Hardhat console:

```bash
npx hardhat console --network localhost
```

```javascript
const Contract = await ethers.getContractFactory("CertificateRegistry");
const contract = await Contract.attach("YOUR_CONTRACT_ADDRESS");

// Store a certificate
await contract.storeCertificate("test_hash_123");

// Verify a certificate
const [exists, timestamp] = await contract.verifyCertificate("test_hash_123");
console.log("Exists:", exists, "Timestamp:", timestamp.toString());
```

## Recommended Setup for MVP

For quick MVP testing, use **Option 1 (Ganache)** or **Option 3 (Mock Mode)**.

For demo purposes, use **Option 2 (Polygon Mumbai)** to show real blockchain integration.

# Ethereum Sepolia Testnet Setup Guide

This guide will help you set up the certificate registry on Ethereum's Sepolia testnet.

## 🎯 Your Ethereum Address
**Address:** `0xC438024bC86820DfBc874A571813E896330c5376`

## 📋 Prerequisites

### 1. Get Sepolia ETH (Free Testnet Tokens)
You need Sepolia ETH to deploy the contract and store certificates. Get free testnet ETH from these faucets:

- **Alchemy Sepolia Faucet**: https://sepoliafaucet.com/
- **Infura Sepolia Faucet**: https://www.infura.io/faucet/sepolia
- **Chainlink Faucet**: https://faucets.chain.link/sepolia

Enter your address: `0xC438024bC86820DfBc874A571813E896330c5376`

You'll need at least 0.01 Sepolia ETH to deploy the contract.

### 2. Get an Alchemy API Key (Recommended)
Alchemy provides reliable RPC access to Ethereum networks:

1. Sign up at https://www.alchemy.com/
2. Create a new app
3. Select **Ethereum** as the chain
4. Select **Sepolia** as the network
5. Copy your API key

Alternative RPC providers:
- **Infura**: https://infura.io/
- **Public RPC**: `https://rpc.sepolia.org` (may be rate-limited)

### 3. Export Your Private Key
⚠️ **SECURITY WARNING**: Never share your private key! Never commit it to git!

**From MetaMask:**
1. Click the three dots on your account
2. Select "Account Details"
3. Click "Show Private Key"
4. Enter your password
5. Copy the private key (without the 0x prefix)

## 🚀 Setup Steps

### Step 1: Install Dependencies
```bash
# Install Hardhat dependencies
npm install

# Or if you need to reinstall
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

### Step 2: Configure Environment Variables

Create a `.env` file in the root directory:

```bash
# Ethereum Sepolia Testnet
BLOCKCHAIN_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=your_private_key_without_0x_prefix
CONTRACT_ADDRESS=will_be_filled_after_deployment
```

Create `server/.env` file:

```bash
PORT=5002
NODE_ENV=development

# Ethereum Sepolia Testnet
BLOCKCHAIN_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=your_private_key_without_0x_prefix
CONTRACT_ADDRESS=will_be_filled_after_deployment

# Pinata IPFS (keep existing values)
PINATA_API_KEY=00e9a2479534b50693e5
PINATA_API_SECRET=4265ada4f4ff1807a053e1545a69fb18ca4e392ff55b60f90dd5eca11bddc2ab
PINATA_GATEWAY=https://gateway.pinata.cloud

# Database (keep existing connection)
DB_PATH=postgresql://neondb_owner:npg_2ghyseCmpNX7@ep-damp-truth-a10ix4ll-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

# JWT Secret
JWT_SECRET=your-super-secret-jwt-key-change-in-production

# Frontend URL
FRONTEND_URL=http://localhost:3001
```

### Step 3: Deploy the Contract to Sepolia

```bash
# Compile the smart contract
npx hardhat compile

# Deploy to Sepolia testnet
npx hardhat run scripts/deploy.js --network sepolia
```

You should see output like:
```
Deploying CertificateRegistry to Sepolia...
✅ CertificateRegistry deployed to: 0x1234567890abcdef...
Transaction hash: 0xabcdef1234567890...
Block number: 12345678
Gas used: 500000
```

**Important:** Copy the contract address and update your `.env` files!

### Step 4: Update Environment Variables with Contract Address

Update both `.env` and `server/.env`:
```bash
CONTRACT_ADDRESS=0x_your_deployed_contract_address
```

### Step 5: Restart Your Server

```bash
cd server
npm start
```

You should see:
```
⛓️  Connected to Sepolia network (Chain ID: 11155111)
🔑 Wallet address: 0xC438024bC86820DfBc874A571813E896330c5376
💰 Wallet balance: 0.05 ETH
📜 Contract initialized at: 0x...
⛓️  Blockchain service initialized successfully
```

## 🧪 Testing the Integration

### 1. Check Blockchain Status
The server will display blockchain info on startup:
- Network name (should be "Sepolia")
- Your wallet address
- Current balance
- Contract address

### 2. Issue a Test Certificate
1. Log in as an Institute user
2. Go to "Issue Certificate"
3. Fill in the details and submit
4. Wait for blockchain confirmation

You should see in server logs:
```
📝 Storing certificate hash on Sepolia...
⛽ Estimated gas: 45000
📤 Transaction sent: 0xabc123...
⏳ Waiting for confirmation...
✅ Transaction confirmed in block 12345679
🔗 Transaction hash: 0xabc123...
```

### 3. Verify on Etherscan
Check your transaction on Sepolia Etherscan:
```
https://sepolia.etherscan.io/tx/YOUR_TRANSACTION_HASH
https://sepolia.etherscan.io/address/0xC438024bC86820DfBc874A571813E896330c5376
```

## 📊 Monitoring

### Check Your Transactions
Visit: https://sepolia.etherscan.io/address/0xC438024bC86820DfBc874A571813E896330c5376

### Check Contract
Visit: https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS

### Check Balance
Your wallet balance is displayed when the server starts. You can also check on Etherscan.

## 🔍 Troubleshooting

### "Wallet has 0 balance"
- Get Sepolia ETH from faucets listed above
- Wait a few minutes for the transaction to confirm

### "insufficient funds for intrinsic transaction cost"
- You need more Sepolia ETH
- Each certificate storage costs approximately 0.0001-0.0005 ETH

### "Contract not initialized"
- Make sure you deployed the contract
- Check that CONTRACT_ADDRESS is set in `.env`
- Restart the server

### "nonce has already been used"
- Wait a few seconds and try again
- This happens when sending multiple transactions quickly

### "replacement transaction underpriced"
- Wait for previous transaction to complete
- Increase gas price if needed

## 💡 Tips

1. **Gas Costs**: Each certificate storage costs around 45,000-60,000 gas
2. **Confirmation Time**: Sepolia blocks are ~12 seconds, so expect 15-30 second confirmation times
3. **Keep Some ETH**: Always keep at least 0.01 ETH in your wallet for future certificates
4. **Backup Private Key**: Store your private key securely - it controls your wallet!

## 🔐 Security Best Practices

1. ✅ Never commit `.env` file to git (already in `.gitignore`)
2. ✅ Never share your private key
3. ✅ Use environment variables for sensitive data
4. ✅ For production, use a dedicated wallet with limited funds
5. ✅ Consider using a hardware wallet for mainnet deployments

## 📱 Next Steps

After successful setup:
1. Issue test certificates to verify blockchain integration
2. Check transaction hashes on Etherscan
3. Implement certificate verification with blockchain lookups
4. Add transaction hash display in the UI
5. Set up monitoring and alerts for low balance

## 🌐 Network Information

- **Network Name**: Sepolia
- **Chain ID**: 11155111
- **Block Explorer**: https://sepolia.etherscan.io/
- **Your Address**: 0xC438024bC86820DfBc874A571813E896330c5376
- **Faucets**: 
  - https://sepoliafaucet.com/
  - https://www.alchemy.com/faucets/ethereum-sepolia

## 📚 Resources

- Sepolia Testnet: https://sepolia.dev/
- Ethers.js Docs: https://docs.ethers.org/
- Hardhat Docs: https://hardhat.org/
- Alchemy Dashboard: https://dashboard.alchemy.com/

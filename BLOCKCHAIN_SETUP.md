# 🔗 Blockchain Setup Guide - Polygon Mumbai Testnet

Complete guide to deploy your certificate platform on Polygon Mumbai Testnet (100% FREE!)

---

## 📋 Prerequisites

- MetaMask wallet installed in your browser
- Node.js and npm installed (you already have this!)
- 10 minutes of your time

---

## 🚀 Step-by-Step Setup

### Step 1: Set Up MetaMask Wallet

#### 1.1 Install MetaMask
- Go to https://metamask.io/download/
- Install the browser extension
- Create a new wallet (or import existing one)
- **IMPORTANT:** Save your secret recovery phrase in a safe place!

#### 1.2 Add Polygon Mumbai Testnet to MetaMask
1. Open MetaMask
2. Click the network dropdown (top center)
3. Click "Add Network" or "Add Network Manually"
4. Enter these details:

```
Network Name: Polygon Mumbai Testnet
RPC URL: https://rpc-mumbai.maticvigil.com
Chain ID: 80001
Currency Symbol: MATIC
Block Explorer: https://mumbai.polygonscan.com/
```

5. Click "Save"
6. Switch to "Polygon Mumbai Testnet"

---

### Step 2: Get Free Testnet MATIC

You need testnet MATIC to deploy the contract and store certificates.

#### 2.1 Copy Your Wallet Address
1. Open MetaMask
2. Click on your account name at the top
3. Your address will be copied (starts with 0x...)

#### 2.2 Get Free MATIC from Faucets

Visit these faucets (try multiple if one is slow):

**Option 1: Polygon Faucet**
- Go to: https://faucet.polygon.technology/
- Select "Mumbai"
- Paste your wallet address
- Click "Submit"
- Wait 1-2 minutes

**Option 2: Alchemy Faucet**
- Go to: https://mumbaifaucet.com/
- Paste your wallet address
- Complete captcha
- Click "Send Me MATIC"

**Option 3: QuickNode Faucet**
- Go to: https://faucet.quicknode.com/polygon/mumbai
- Connect wallet or paste address
- Request tokens

#### 2.3 Verify You Received MATIC
- Check MetaMask - you should see ~0.5-2 MATIC
- This is enough for thousands of transactions!

---

### Step 3: Export Your Private Key

**⚠️ SECURITY WARNING:**
- Only use this wallet for TESTNET
- Never share your private key
- Never use this key on mainnet with real money

#### 3.1 Get Your Private Key
1. Open MetaMask
2. Click the 3 dots menu (top right)
3. Click "Account Details"
4. Click "Show Private Key"
5. Enter your MetaMask password
6. **Copy the private key** (64 character hex string)

---

### Step 4: Install Hardhat (Deployment Tool)

Open a terminal in your project folder:

```bash
cd /Users/surajbayas/Developer/Certify
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
npx hardhat init
```

When prompted:
- Choose: "Create a JavaScript project"
- Press Enter for all defaults

---

### Step 5: Configure Hardhat

#### 5.1 Create hardhat.config.js

I'll create this file for you with the right configuration.

#### 5.2 Create .env file in root

Create a file named `.env` in `/Users/surajbayas/Developer/Certify/`:

```bash
# Paste your private key from Step 3 (remove 0x prefix if present)
PRIVATE_KEY=your_private_key_here_without_0x_prefix

# Polygon Mumbai RPC
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
```

**Example:**
```bash
PRIVATE_KEY=abc123def456...your64characterkey
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
```

---

### Step 6: Deploy Smart Contract

#### 6.1 Deploy to Mumbai Testnet

Run this command:

```bash
cd /Users/surajbayas/Developer/Certify
npx hardhat run scripts/deploy.js --network mumbai
```

#### 6.2 Save the Contract Address

The output will show:
```
CertificateRegistry deployed to: 0x1234567890abcdef...
```

**Copy this address!** You'll need it in the next step.

---

### Step 7: Configure Your Application

#### 7.1 Update server/.env

Edit `/Users/surajbayas/Developer/Certify/server/.env`:

```bash
PORT=5001
NODE_ENV=development

# Paste your actual values here
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_from_step_3
CONTRACT_ADDRESS=0x1234...your_contract_address_from_step_6

DB_PATH=./database.sqlite
FRONTEND_URL=http://localhost:3000
```

#### 7.2 Restart Your Server

```bash
cd server
npm start
```

---

### Step 8: Test Your Setup! 🎉

#### 8.1 Issue a Test Certificate
1. Go to http://localhost:3000
2. Click "Issue Certificate"
3. Fill in the details
4. Click "Issue Certificate"

#### 8.2 Check Blockchain Confirmation
- You should see "Transaction Hash: 0x..." in the response
- Copy the transaction hash
- Visit: https://mumbai.polygonscan.com/
- Paste the transaction hash in the search bar
- You'll see your certificate hash on the blockchain!

#### 8.3 Verify the Certificate
1. Use the QR code or enter the certificate ID
2. Click "Verify"
3. It will check the blockchain and show ✅ Valid!

---

## 🎯 You're Done!

Your certificate platform is now running on Polygon Mumbai Testnet!

### What you can do now:
- Issue unlimited certificates (free!)
- Verify certificates on blockchain
- Generate QR codes
- Share with friends/employers

---

## 📊 Monitoring Your Blockchain Activity

### Check Your Wallet
- Open MetaMask
- See your MATIC balance decrease slightly with each transaction
- Each transaction costs ~0.001-0.01 MATIC

### View on Block Explorer
- Visit: https://mumbai.polygonscan.com/
- Paste your wallet address
- See all your transactions
- View your smart contract

### Check Contract on PolygonScan
- Go to: https://mumbai.polygonscan.com/address/YOUR_CONTRACT_ADDRESS
- See all certificates stored
- View transaction history

---

## 🆘 Troubleshooting

### "Insufficient funds for gas"
- Get more testnet MATIC from faucets
- You might need to wait 24 hours between requests

### "Invalid private key"
- Make sure you copied the full key
- Remove any "0x" prefix
- Check for extra spaces

### "Contract not deployed"
- Verify contract address in .env
- Check it exists on mumbai.polygonscan.com

### "Transaction taking too long"
- Mumbai testnet can be slow sometimes
- Wait 1-2 minutes
- Check transaction on PolygonScan

---

## 🔐 Security Reminders

✅ DO:
- Use separate wallet for testnet
- Keep private key in .env file (never commit to git!)
- Use this only for testing

❌ DON'T:
- Share your private key
- Use this wallet on mainnet
- Commit .env to version control
- Send real MATIC to testnet wallet

---

## 💰 Cost Breakdown (All FREE!)

| Action | Cost |
|--------|------|
| Creating wallet | FREE |
| Getting testnet MATIC | FREE |
| Deploying contract | FREE (uses testnet MATIC) |
| Issuing certificates | FREE (uses testnet MATIC) |
| Verifying certificates | FREE (read-only) |
| Total | $0.00 |

---

## 🚀 Next Steps

Once you're happy with testing on Mumbai:

1. **Production Deployment:**
   - Deploy to Polygon Mainnet
   - Get real MATIC from exchange
   - Costs ~$0.01 per transaction

2. **Enhancements:**
   - Add batch certificate issuance
   - Add certificate revocation
   - Add multi-signature approval
   - Add IPFS for storing PDFs

3. **Scale:**
   - Add more institutes
   - Add authentication
   - Add analytics dashboard

---

## 📚 Useful Links

- [Polygon Documentation](https://docs.polygon.technology/)
- [Mumbai Testnet Faucet](https://faucet.polygon.technology/)
- [Mumbai Block Explorer](https://mumbai.polygonscan.com/)
- [MetaMask Documentation](https://docs.metamask.io/)
- [Hardhat Documentation](https://hardhat.org/docs)

---

## ❓ Need Help?

If you run into issues:
1. Check the error message carefully
2. Verify all addresses and keys
3. Check if you have enough testnet MATIC
4. Look for the transaction on PolygonScan

---

**Ready to start? Begin with Step 1! 🚀**

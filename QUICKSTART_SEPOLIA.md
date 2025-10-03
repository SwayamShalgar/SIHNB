# Quick Start: Ethereum Sepolia Integration

## 🎯 Your Setup
- **Ethereum Address**: `0xC438024bC86820DfBc874A571813E896330c5376`
- **Network**: Sepolia Testnet (Chain ID: 11155111)

## ⚡ Quick Setup (5 Minutes)

### 1️⃣ Get Sepolia ETH (2 minutes)
Visit: https://sepoliafaucet.com/
- Enter: `0xC438024bC86820DfBc874A571813E896330c5376`
- Click "Send Me ETH"
- Wait 1-2 minutes

### 2️⃣ Get Alchemy API Key (2 minutes)
Visit: https://www.alchemy.com/
- Sign up / Log in
- Create new app
- Select: Ethereum → Sepolia
- Copy API key

### 3️⃣ Configure Environment (1 minute)

Create `server/.env`:
```bash
PORT=5002
NODE_ENV=development

# Ethereum Sepolia - Replace YOUR_ALCHEMY_API_KEY
BLOCKCHAIN_RPC_URL=https://eth-sepolia.g.alchemy.com/v2/YOUR_ALCHEMY_API_KEY
PRIVATE_KEY=your_wallet_private_key_without_0x
CONTRACT_ADDRESS=will_add_after_deployment

# Keep your existing settings below
PINATA_API_KEY=00e9a2479534b50693e5
PINATA_API_SECRET=4265ada4f4ff1807a053e1545a69fb18ca4e392ff55b60f90dd5eca11bddc2ab
PINATA_GATEWAY=https://gateway.pinata.cloud

DB_PATH=postgresql://neondb_owner:npg_2ghyseCmpNX7@ep-damp-truth-a10ix4ll-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require

JWT_SECRET=your-super-secret-jwt-key-change-in-production
FRONTEND_URL=http://localhost:3001
```

Create `.env` in root directory (same as above).

### 4️⃣ Deploy Contract
```powershell
# Compile contract
npx hardhat compile

# Deploy to Sepolia
npx hardhat run scripts/deploy.js --network sepolia
```

Copy the contract address from output and update both `.env` files:
```bash
CONTRACT_ADDRESS=0x_your_contract_address_here
```

### 5️⃣ Start Server
```powershell
cd server
npm start
```

Look for these messages:
```
⛓️  Connected to Sepolia network (Chain ID: 11155111)
🔑 Wallet address: 0xC438024bC86820DfBc874A571813E896330c5376
💰 Wallet balance: 0.5 ETH
📜 Contract initialized at: 0x...
```

## ✅ Test It

1. **Issue a Certificate**:
   - Login as Institute user
   - Go to "Issue Certificate"
   - Fill details and submit

2. **Check Server Logs**:
   ```
   📝 Storing certificate hash on Sepolia...
   📤 Transaction sent: 0xabc123...
   ✅ Transaction confirmed in block 12345
   ```

3. **View on Etherscan**:
   ```
   https://sepolia.etherscan.io/address/0xC438024bC86820DfBc874A571813E896330c5376
   ```

## 🔍 How It Works

When you issue a certificate:
1. ✅ Certificate data is hashed (SHA-256)
2. ✅ Hash is stored on Sepolia blockchain
3. ✅ Transaction hash is saved to PostgreSQL database
4. ✅ PDF is generated with QR code
5. ✅ Uploaded to IPFS (Pinata)

**Blockchain Transaction Flow**:
```
User Issues Certificate
    ↓
Generate Certificate Hash
    ↓
Send Transaction to Sepolia ⛓️
    ↓
Wait for Confirmation (~15-30 seconds)
    ↓
Store TX Hash in Database 💾
    ↓
Return to User ✅
```

## 📊 Monitor Your Activity

### Check Balance
```
https://sepolia.etherscan.io/address/0xC438024bC86820DfBc874A571813E896330c5376
```

### Check Contract
```
https://sepolia.etherscan.io/address/YOUR_CONTRACT_ADDRESS
```

### View Transactions
All your certificate storage transactions will appear on your address page.

## 💰 Cost Estimate

- **Per Certificate**: ~0.0001-0.0005 Sepolia ETH
- **100 Certificates**: ~0.01-0.05 Sepolia ETH
- **1000 Certificates**: ~0.1-0.5 Sepolia ETH

Get more Sepolia ETH anytime from faucets (it's free!).

## 🐛 Troubleshooting

### "Wallet has 0 balance"
➡️ Get Sepolia ETH from: https://sepoliafaucet.com/

### "Contract not initialized"
➡️ Check CONTRACT_ADDRESS is set in `.env`
➡️ Restart server

### "insufficient funds"
➡️ Need more Sepolia ETH from faucet

### Transaction pending forever
➡️ Normal! Sepolia can take 15-30 seconds
➡️ Check on Etherscan for status

## 🎉 That's It!

You're now storing certificate hashes on Ethereum Sepolia testnet!

For detailed information, see: [SEPOLIA_SETUP.md](./SEPOLIA_SETUP.md)

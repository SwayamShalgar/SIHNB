# 📦 Pinata IPFS Setup Guide

Complete guide to integrate Pinata IPFS for decentralized certificate storage.

---

## 🎯 Why Use Pinata + IPFS?

### Benefits:
✅ **Decentralized Storage** - Certificates stored on IPFS network
✅ **Permanent & Immutable** - Files can't be changed or deleted
✅ **Global Access** - Anyone can access via IPFS hash
✅ **Cost Effective** - Pinata free tier includes 1GB storage
✅ **Fast CDN** - Quick access worldwide
✅ **Blockchain Proof** - Store IPFS hash on blockchain

### How It Works:
1. Generate certificate PDF
2. Upload PDF to IPFS via Pinata
3. Get IPFS hash (like `QmX...`)
4. Store IPFS hash on blockchain
5. Anyone can verify and download from IPFS

---

## 🚀 Setup Pinata (5 minutes)

### Step 1: Create Pinata Account

1. Go to: https://www.pinata.cloud/
2. Click "Sign Up" (top right)
3. Sign up with email or GitHub
4. Verify your email

### Step 2: Get API Keys

1. Log in to Pinata dashboard
2. Click on your profile (top right)
3. Go to "API Keys"
4. Click "New Key"

**Configure the key:**
- **Key Name:** `Certify-MVP`
- **Permissions:**
  - ✅ Admin (check all boxes):
    - pinFileToIPFS
    - pinJSONToIPFS
    - unpin
    - pinList
    - userPinPolicy
- Click "Create Key"

**IMPORTANT:** Copy both:
- `API Key` (starts with something like: `a1b2c3...`)
- `API Secret` (longer string)

⚠️ **Save these now!** You can't see the secret again.

### Step 3: Configure Your Application

Create or update `/Users/surajbayas/Developer/Certify/server/.env`:

```bash
PORT=5001
NODE_ENV=development

# Polygon Mumbai Testnet (from previous setup)
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_private_key_here
CONTRACT_ADDRESS=your_contract_address_here

# Pinata IPFS (NEW - paste your keys here)
PINATA_API_KEY=your_pinata_api_key_here
PINATA_API_SECRET=your_pinata_api_secret_here
PINATA_GATEWAY=https://gateway.pinata.cloud

# Database
DB_PATH=./database.sqlite

# Frontend URL
FRONTEND_URL=http://localhost:3000
```

### Step 4: Install Dependencies

```bash
cd /Users/surajbayas/Developer/Certify/server
npm install axios form-data
```

### Step 5: Test the Integration

Restart your server:
```bash
cd /Users/surajbayas/Developer/Certify/server
npm start
```

---

## 📝 How to Use

### Issue a Certificate with IPFS

1. Go to http://localhost:3000
2. Click "Issue Certificate"
3. Fill in the details
4. Click "Issue Certificate"

**What happens:**
1. ✅ Generates PDF locally
2. ✅ Uploads PDF to IPFS via Pinata
3. ✅ Gets IPFS hash (e.g., `QmXoypizjW3...`)
4. ✅ Stores hash on blockchain
5. ✅ Saves everything in database

**Response includes:**
```json
{
  "certificate": {
    "id": "uuid-here",
    "hash": "sha256-hash",
    "txHash": "blockchain-tx-hash",
    "pdfUrl": "/certificates/cert.pdf",
    "ipfsHash": "QmXoypizjW3...",
    "ipfsUrl": "https://gateway.pinata.cloud/ipfs/QmXoy...",
    "publicIpfsUrl": "https://ipfs.io/ipfs/QmXoy...",
    "qrCode": "data:image/png;base64..."
  }
}
```

### Access Certificate on IPFS

**Option 1: Pinata Gateway (Fastest)**
```
https://gateway.pinata.cloud/ipfs/QmXoypizjW3...
```

**Option 2: Public IPFS Gateway**
```
https://ipfs.io/ipfs/QmXoypizjW3...
```

**Option 3: Any IPFS Gateway**
```
https://cloudflare-ipfs.com/ipfs/QmXoypizjW3...
https://dweb.link/ipfs/QmXoypizjW3...
```

---

## 🎨 View Your Files on Pinata

1. Go to: https://app.pinata.cloud/pinmanager
2. See all uploaded certificates
3. View metadata, size, and access stats
4. Download or preview files

### File Organization:
- **PDFs**: `certificate-{uuid}.pdf`
- **Metadata**: `certificate-metadata-{uuid}.json`

---

## 💰 Pinata Pricing (Free Tier)

### Free Plan Includes:
- ✅ 1 GB storage
- ✅ 100 GB bandwidth/month
- ✅ Unlimited pins
- ✅ Unlimited requests
- ✅ No credit card required

### How Much Can You Store?

**Average PDF size:** ~200 KB

**Free tier capacity:**
- ~5,000 certificates with PDFs
- ~50,000 certificates (metadata only)

**Bandwidth:**
- ~500,000 certificate downloads/month

---

## 🔐 Security & Best Practices

### What's Stored on IPFS:
✅ Certificate PDF (public)
✅ Certificate metadata JSON (public)
✅ IPFS hashes are public

### What's NOT on IPFS:
❌ Private keys
❌ Student emails (optional)
❌ Sensitive data

### Security Tips:
1. **Never** put sensitive data in certificates
2. Store IPFS hash on blockchain for proof
3. Keep API keys in `.env` file
4. Add `.env` to `.gitignore`
5. Use dedicated Pinata key per project

---

## 🛠️ Troubleshooting

### "Pinata authentication failed"
- Check API key and secret are correct
- Ensure no extra spaces in `.env`
- Verify key has correct permissions

### "IPFS upload failed"
- Check internet connection
- Verify Pinata account is active
- Check if you hit storage limit

### "Can't access IPFS URL"
- IPFS can be slow sometimes (30s-2min)
- Try different gateway
- File might still be propagating

### "Mock IPFS hash"
- Means Pinata keys not configured
- Check `.env` file exists
- Restart server after adding keys

---

## 📊 Monitoring Usage

### Check Storage Used:
1. Go to: https://app.pinata.cloud/
2. Dashboard shows:
   - Total storage used
   - Number of files
   - Bandwidth used
   - API request count

### Track Certificates:
- Each certificate = 2 files (PDF + metadata)
- Monitor your free 1GB limit
- Upgrade if needed ($20/month for 100GB)

---

## 🚀 Production Tips

### For Scale:
1. **Paid Plan** - $20/month for 100GB
2. **Dedicated Gateway** - Faster access ($20/month)
3. **Submarine Keys** - Encrypt sensitive data
4. **Custom Domains** - Use your domain for IPFS

### Optimize Costs:
- Compress PDFs before upload
- Use metadata JSON for searches
- Cache frequently accessed files
- Consider PDF size limits

---

## 🔄 Migration from Local Storage

If you already have certificates:

```javascript
// Script to upload existing PDFs to IPFS
const pinataService = require('./utils/pinataService');
const fs = require('fs');
const path = require('path');

async function migrateToIPFS() {
  const certsDir = './certificates';
  const files = fs.readdirSync(certsDir);
  
  for (const file of files) {
    if (file.endsWith('.pdf')) {
      const filePath = path.join(certsDir, file);
      const result = await pinataService.uploadFile(filePath);
      console.log(`Uploaded ${file}: ${result.IpfsHash}`);
    }
  }
}
```

---

## 📚 Advanced Features

### 1. Unpinning Files (Delete)
```javascript
await pinataService.unpinFile('QmXoypizjW3...');
```

### 2. List All Pins
```javascript
const files = await pinataService.getPinnedFiles();
```

### 3. Upload Metadata Only
```javascript
const metadata = {
  certificateId: 'uuid',
  learnerName: 'John Doe'
};
await pinataService.uploadJSON(metadata);
```

### 4. Custom Metadata
```javascript
await pinataService.uploadFile(filePath, {
  name: 'Custom Name',
  certificateId: 'abc123',
  customField: 'value'
});
```

---

## 🎯 Complete Flow

```
1. User → Issue Certificate
2. Server → Generate PDF
3. Server → Upload to Pinata IPFS
4. Pinata → Returns IPFS hash
5. Server → Store hash on Blockchain
6. Server → Save all to Database
7. User → Gets certificate with IPFS link

Verification:
1. Employer → Scans QR code
2. System → Fetches from database
3. System → Shows IPFS link
4. System → Verifies blockchain hash
5. Employer → Downloads from IPFS
6. Employer → ✅ Verified!
```

---

## 🔗 Useful Links

- [Pinata Dashboard](https://app.pinata.cloud/)
- [Pinata Docs](https://docs.pinata.cloud/)
- [IPFS Documentation](https://docs.ipfs.tech/)
- [Public IPFS Gateways](https://ipfs.github.io/public-gateway-checker/)
- [IPFS Explorer](https://explore.ipld.io/)

---

## ✅ Checklist

- [ ] Created Pinata account
- [ ] Generated API keys
- [ ] Added keys to `.env` file
- [ ] Installed dependencies
- [ ] Tested certificate issuance
- [ ] Verified IPFS upload works
- [ ] Checked file on Pinata dashboard
- [ ] Tested IPFS URL access
- [ ] Confirmed blockchain + IPFS integration

---

**You're all set!** 🎉

Your certificates are now stored on IPFS for permanent, decentralized access!

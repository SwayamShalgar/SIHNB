# ✅ Pinata IPFS Configuration - Updated & Working

## Status: ACTIVE ✅

Your Pinata IPFS integration is now fully configured and operational!

---

## 📋 Configuration Summary

### Credentials (Updated: October 3, 2025)

- **API Key**: `ea8689798bf50cc1cec0` ✅
- **API Secret**: `5aa075ab625aa7246b96e22a9a7f05061c5d6a81d06afb6ffec619b27a68e483` ✅
- **JWT Token**: Configured ✅
- **Gateway**: `https://gateway.pinata.cloud` ✅

### Test Results

```
✅ Authentication successful
✅ API connection verified
✅ Ready to upload certificates
```

---

## 🔄 How Certificate Upload Works

When an Institute issues a certificate, the system automatically:

1. **Generates PDF Certificate**

   - Creates certificate with learner details
   - Generates QR code for verification
   - Saves locally in `server/certificates/` folder

2. **Uploads to Pinata IPFS** (Automatic)

   - Uploads the PDF file to IPFS
   - Uploads metadata JSON with certificate details
   - Returns IPFS hash and public URL

3. **Stores in Database**

   - Saves certificate details
   - Stores IPFS hash for retrieval
   - Stores public IPFS URL

4. **Blockchain (Optional)**
   - Stores certificate hash on blockchain if configured
   - Falls back gracefully if blockchain is not set up

---

## 📁 What Gets Uploaded to Pinata

### 1. Certificate PDF

- **Filename**: `certificate-{UUID}.pdf`
- **Metadata Tags**:
  - Certificate ID
  - Learner Name
  - Course Name
  - Issue Date
  - Upload Date

### 2. Certificate Metadata JSON

- **Filename**: `certificate-metadata-{UUID}.json`
- **Contains**:
  ```json
  {
    "certificateId": "uuid",
    "learnerName": "...",
    "courseName": "...",
    "instituteName": "...",
    "issueDate": "...",
    "certificateHash": "...",
    "blockchainTxHash": "...",
    "pdfIpfsHash": "...",
    "createdAt": "..."
  }
  ```

---

## 🔍 Verification Process

Certificates uploaded to Pinata can be accessed via:

1. **IPFS Hash**: `QmXXXXXXXXXXXXXXXXXX`
2. **Public URL**: `https://gateway.pinata.cloud/ipfs/{hash}`
3. **QR Code**: Links to verification page

---

## 📝 Code Implementation

### Certificate Issuance (server/routes/certificates.js)

```javascript
// Upload PDF to Pinata
const ipfsResult = await pinataService.uploadFile(pdfPath, {
  name: `certificate-${certificateId}.pdf`,
  certificateId: certificateId,
  learnerName: learner_name,
  courseName: course_name,
  issueDate: issue_date,
});

// Upload metadata JSON
await pinataService.uploadJSON(metadataJson, {
  name: `certificate-metadata-${certificateId}.json`,
  certificateId: certificateId,
});
```

### Pinata Service (server/utils/pinataService.js)

The service handles:

- ✅ File uploads (PDF)
- ✅ JSON uploads (Metadata)
- ✅ Authentication
- ✅ Error handling
- ✅ Graceful fallback if Pinata is unavailable

---

## 🧪 Testing

### Test Pinata Connection

```bash
cd server
node test-pinata-connection.js
```

### Expected Output

```
✅ Pinata authentication successful
✅ Pinata is properly configured and ready to use!
```

---

## 🚀 Usage

### For Institute Users

1. **Login** as Institute
2. **Navigate** to "Issue Certificate"
3. **Fill in** certificate details:
   - Learner Name
   - Learner Email
   - Course Name
   - Issue Date
4. **Submit**

**What Happens Automatically:**

- ✅ Certificate PDF generated
- ✅ PDF uploaded to Pinata IPFS
- ✅ Metadata uploaded to Pinata IPFS
- ✅ Certificate stored in database with IPFS links
- ✅ Student can download and verify certificate

---

## 📊 Database Storage

Certificates are stored in PostgreSQL with:

- `ipfs_hash`: The IPFS content hash
- `ipfs_url`: Direct public URL to access the certificate
- `pdf_path`: Local backup path
- `certificate_hash`: Cryptographic hash for verification
- `blockchain_tx_hash`: Blockchain transaction (if enabled)

---

## 🔐 Security Features

1. **Immutable Storage**: Files on IPFS cannot be modified
2. **Content Addressing**: Each file has a unique hash based on content
3. **Distributed Storage**: Files stored across IPFS network
4. **Public Accessibility**: Anyone can verify certificates using IPFS hash
5. **Metadata Protection**: Sensitive data encrypted if needed

---

## 🎯 Benefits

### For Institutes

- ✅ Permanent certificate storage
- ✅ No risk of data loss
- ✅ Global accessibility
- ✅ Instant verification

### For Students

- ✅ Lifetime certificate access
- ✅ Shareable IPFS links
- ✅ QR code for quick verification
- ✅ Download anytime, anywhere

### For Companies

- ✅ Instant certificate verification
- ✅ Tamper-proof validation
- ✅ No need to contact institute
- ✅ Blockchain-backed authenticity

---

## 📞 Troubleshooting

### Issue: Upload fails

**Solution**:

- Check API credentials in `.env` file
- Run `node test-pinata-connection.js`
- Verify internet connection

### Issue: Slow uploads

**Solution**:

- Large PDF files may take longer
- Check network speed
- Pinata gateway may be busy

### Issue: IPFS URL not accessible

**Solution**:

- IPFS propagation can take a few seconds
- Try accessing after 1-2 minutes
- Check if IPFS hash is correct

---

## 🔧 Configuration Files

### Environment Variables (.env)

```bash
PINATA_API_KEY=ea8689798bf50cc1cec0
PINATA_API_SECRET=5aa075ab625aa7246b96e22a9a7f05061c5d6a81d06afb6ffec619b27a68e483
PINATA_JWT=eyJhbGci...
PINATA_GATEWAY=https://gateway.pinata.cloud
```

---

## ✅ Verification Checklist

- [x] Pinata credentials configured in `.env`
- [x] Authentication tested and working
- [x] Certificate upload code implemented
- [x] Metadata upload code implemented
- [x] Database stores IPFS hash and URL
- [x] Graceful fallback if Pinata unavailable
- [x] Error handling implemented
- [x] Test script created

---

## 🎉 Summary

Your Certify platform is now fully integrated with Pinata IPFS! Every certificate issued by institutes will be:

1. **Generated** as a professional PDF
2. **Uploaded** to IPFS automatically
3. **Stored** permanently and immutably
4. **Accessible** globally via IPFS hash
5. **Verifiable** by anyone with the certificate ID

The system is production-ready and will ensure all certificates are safely stored on the decentralized IPFS network! 🚀

---

**Last Updated**: October 3, 2025  
**Status**: ✅ Active and Working  
**Test Status**: ✅ Passed

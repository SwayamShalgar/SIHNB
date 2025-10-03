# 🚀 Quick Start Guide - Certify Platform

## ⚡ Start the Platform (2 Steps)

### Step 1: Start Backend Server

```bash
cd /Users/surajbayas/Developer/certifyo/SIHNB/server
npm start
```

✅ **Expected**: Server running on port 5001

### Step 2: Start Frontend

```bash
cd /Users/surajbayas/Developer/certifyo/SIHNB/client
npm start
```

✅ **Expected**: App running on http://localhost:3000

---

## 📋 Quick Verification

### Test Pinata (Optional)

```bash
cd /Users/surajbayas/Developer/certifyo/SIHNB/server
node test-pinata-connection.js
```

✅ **Expected**: "Pinata authentication successful"

---

## ✅ All Changes Made

1. ✅ **Pinata Credentials Updated** - Certificates upload to IPFS
2. ✅ **Certificate Issuance Fixed** - No more stuck loading
3. ✅ **Navbar Layout Fixed** - All buttons in one line
4. ✅ **Server Port Changed** - Now using 5001
5. ✅ **Profile Feature Added** - Available in all dashboards
6. ✅ **Smart Dashboard Routing** - Redirects to role-specific pages
7. ✅ **Enhanced Logging** - Better debugging information

---

## 🎯 Key Features Working

- ✅ User Registration & Login
- ✅ Institute Certificate Issuance
- ✅ **Automatic Pinata IPFS Upload**
- ✅ Certificate Verification
- ✅ QR Code Generation
- ✅ Student/Institute/Company/Admin Dashboards
- ✅ Profile Viewing
- ✅ Certificate Download

---

## 📁 Important Files

**Configuration**:

- `/server/.env` - All credentials and settings

**Certificate Upload Code**:

- `/server/routes/certificates.js` - Pinata upload logic
- `/server/utils/pinataService.js` - IPFS service

**Frontend Styles**:

- `/client/src/styles/LandingPage.css` - Navbar styling

**Documentation**:

- `/SYSTEM_VERIFICATION.md` - Complete verification report
- `/PINATA_VERIFICATION.md` - Pinata upload proof
- `/SERVER_STARTUP_FIX.md` - Troubleshooting guide

---

## 🔍 View Uploaded Certificates

**Pinata Dashboard**: https://app.pinata.cloud/pinmanager

Login with: surajbayas@orchideng.ac.in

---

## 💡 Need Help?

Check these documents:

1. `SYSTEM_VERIFICATION.md` - Full system status
2. `PINATA_VERIFICATION.md` - Pinata upload details
3. `SERVER_STARTUP_FIX.md` - Troubleshooting

---

**Status**: ✅ ALL READY TO USE  
**Last Updated**: October 4, 2025

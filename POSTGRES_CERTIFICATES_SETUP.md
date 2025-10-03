# 🗄️ PostgreSQL (Neon) Integration for Certificates

## ✅ Implementation Complete

Certificate hashes and all certificate data are now stored in **PostgreSQL (Neon)** cloud database!

## 🎯 What's Been Implemented

### 1. Database Schema Created in PostgreSQL

A new `certificates` table has been created in Neon PostgreSQL with the following structure:

```sql
CREATE TABLE certificates (
  id VARCHAR(255) PRIMARY KEY,
  learner_name VARCHAR(255) NOT NULL,
  learner_email VARCHAR(255),
  course_name VARCHAR(255) NOT NULL,
  institute_name VARCHAR(255) NOT NULL,
  issue_date DATE NOT NULL,
  certificate_hash VARCHAR(255) NOT NULL,
  blockchain_tx_hash VARCHAR(255),
  pdf_path VARCHAR(255),
  qr_code TEXT,
  ipfs_hash VARCHAR(255),
  ipfs_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for performance
CREATE INDEX idx_certificate_hash ON certificates(certificate_hash);
CREATE INDEX idx_learner_email ON certificates(learner_email);
```

### 2. Dual Database Storage

The system now stores certificate data in **both databases**:

#### **Primary: PostgreSQL (Neon)**
- Cloud-based, highly available
- Automatic backups
- Scalable storage
- Primary source for queries

#### **Secondary: SQLite (Local)**
- Backward compatibility
- Local fallback
- Development testing

### 3. Updated Routes

#### **POST /api/certificates/issue**
When a new certificate is issued:
1. ✅ Generates certificate hash
2. ✅ Stores hash on blockchain
3. ✅ **Stores in PostgreSQL (Neon)** ← NEW!
4. ✅ Stores in SQLite (fallback)
5. ✅ Generates PDF and QR code
6. ✅ Uploads to IPFS

Console output on success:
```
✅ Certificate <id> stored in PostgreSQL (Neon)
✅ Certificate <id> stored in SQLite
```

#### **GET /api/certificates/:id**
Retrieves certificate by ID:
1. ✅ Queries PostgreSQL first (primary source)
2. ✅ Falls back to SQLite if not found
3. ✅ Returns certificate data

#### **GET /api/certificates/**
Lists all certificates:
1. ✅ Queries PostgreSQL first
2. ✅ Falls back to SQLite if empty
3. ✅ Returns up to 100 most recent certificates

#### **GET /api/verify/:id**
Verifies certificate:
1. ✅ Checks PostgreSQL first
2. ✅ Verifies blockchain hash
3. ✅ Falls back to SQLite if needed
4. ✅ Returns verification result

## 📊 Data Stored in PostgreSQL

For each certificate, the following is stored:

```json
{
  "id": "uuid-v4",
  "learner_name": "John Doe",
  "learner_email": "john@example.com",
  "course_name": "Blockchain Development",
  "institute_name": "Tech University",
  "issue_date": "2025-10-03",
  "certificate_hash": "sha256-hash",
  "blockchain_tx_hash": "0x...",
  "pdf_path": "certificate_<uuid>.pdf",
  "qr_code": "data:image/png;base64...",
  "ipfs_hash": "Qm...",
  "ipfs_url": "https://gateway.pinata.cloud/ipfs/...",
  "created_at": "2025-10-03T12:00:00Z",
  "updated_at": "2025-10-03T12:00:00Z"
}
```

## 🔐 Security Features

### Certificate Hash Storage
- **SHA-256 hash** of certificate data stored in PostgreSQL
- Hash is **immutable** and used for verification
- Indexed for fast lookups
- Same hash stored on blockchain for dual verification

### Database Security
- ✅ SSL/TLS encrypted connections
- ✅ Parameterized queries (SQL injection protection)
- ✅ Cloud-hosted with automatic backups (Neon)
- ✅ Connection pooling for performance

## 🚀 How It Works

### Certificate Issuance Flow

```
1. Institute creates certificate
   ↓
2. Generate certificate data & hash
   ↓
3. Store hash on blockchain
   ↓
4. Store certificate in PostgreSQL ← YOU ARE HERE!
   ↓
5. Store certificate in SQLite (backup)
   ↓
6. Generate PDF with QR code
   ↓
7. Upload to IPFS
   ↓
8. Return certificate ID & verification URL
```

### Certificate Verification Flow

```
1. User enters certificate ID
   ↓
2. Query PostgreSQL for certificate
   ↓
3. If found → retrieve certificate hash
   ↓
4. Verify hash on blockchain
   ↓
5. Return verification result
```

## 📝 Files Modified

### Database Files
- `server/database/postgres.js` - Added certificates table initialization

### Route Files
- `server/routes/certificates.js` - Updated to use PostgreSQL
  - POST /issue - Stores in PostgreSQL + SQLite
  - GET /:id - Queries PostgreSQL first
  - GET / - Lists from PostgreSQL first

- `server/routes/verification.js` - Already using PostgreSQL ✅

## 🧪 Testing

### Test Certificate Creation

1. Start the server (should already be running on port 5002)
2. Issue a certificate via the Institute dashboard or API
3. Check console output for:
   ```
   ✅ Certificate <id> stored in PostgreSQL (Neon)
   ✅ Certificate <id> stored in SQLite
   ```

### Test Certificate Retrieval

```bash
# Get specific certificate
curl http://localhost:5002/api/certificates/<certificate-id>

# Get all certificates
curl http://localhost:5002/api/certificates

# Verify certificate
curl http://localhost:5002/api/verify/<certificate-id>
```

### View Data in Neon Dashboard

1. Go to https://console.neon.tech
2. Select your project
3. Navigate to Tables → certificates
4. View stored certificate data

## 🔍 Query Examples

### Check if certificate exists by hash
```sql
SELECT * FROM certificates 
WHERE certificate_hash = '<hash>';
```

### Get all certificates for a student
```sql
SELECT * FROM certificates 
WHERE learner_email = 'student@example.com'
ORDER BY created_at DESC;
```

### Get certificates issued by an institute
```sql
SELECT * FROM certificates 
WHERE institute_name = 'Tech University'
ORDER BY created_at DESC;
```

### Count total certificates
```sql
SELECT COUNT(*) as total FROM certificates;
```

## 🎯 Benefits

### 1. **Cloud Storage**
- Accessible from anywhere
- No local storage limitations
- Automatic scaling

### 2. **High Availability**
- 99.95% uptime (Neon SLA)
- Automatic failover
- Geographic redundancy

### 3. **Performance**
- Indexed queries for fast lookups
- Connection pooling
- Optimized for concurrent access

### 4. **Backup & Recovery**
- Automatic daily backups
- Point-in-time recovery
- Data durability guarantee

### 5. **Scalability**
- Handles thousands of certificates
- Auto-scales with demand
- No manual intervention needed

## 📊 Database Comparison

| Feature | PostgreSQL (Neon) | SQLite |
|---------|------------------|--------|
| Storage | Cloud ☁️ | Local 💾 |
| Scalability | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Concurrent Access | ⭐⭐⭐⭐⭐ | ⭐⭐ |
| Backup | Automatic | Manual |
| Performance | High | Medium |
| Use Case | Production | Development |

## 🔄 Migration Path

### Current State
- ✅ Both databases active
- ✅ PostgreSQL is primary
- ✅ SQLite is fallback

### Future Option (Optional)
If you want to use PostgreSQL only:
1. Ensure all data migrated
2. Remove SQLite queries
3. Keep only PostgreSQL code

## 🎉 Summary

**Certificate hashes are now stored in Neon PostgreSQL!**

Every certificate issued:
- ✅ Hash stored in PostgreSQL (Neon)
- ✅ Hash stored on blockchain
- ✅ Full data in PostgreSQL
- ✅ Backup in SQLite
- ✅ PDF on local server
- ✅ Metadata on IPFS

**Triple redundancy** ensures certificate data is never lost! 🔒

---

## Next Steps

1. **Test certificate creation** - Issue a new certificate
2. **Verify storage** - Check Neon dashboard for data
3. **Test retrieval** - Query certificates via API
4. **Monitor performance** - Check logs for PostgreSQL queries

Your certificates are now in the cloud! ☁️✨

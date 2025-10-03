# 🐛 Certificate Storage Debugging Guide

## Issue: Certificates Not Stored in PostgreSQL

If certificates are not being stored in the PostgreSQL (Neon) database, follow these debugging steps:

---

## ✅ Step 1: Verify Code Changes

### Check `server/database/postgres.js`

The file should have:
- ✅ Connection test function `testConnection()`
- ✅ `initializeCertificatesTable()` function
- ✅ Both functions called in `initializeTables()`

### Check `server/routes/certificates.js`

The POST `/issue` route should have:
- ✅ `const pool = require('../database/postgres');` at the top
- ✅ Try-catch block for PostgreSQL insertion BEFORE SQLite
- ✅ Enhanced console logging:
  ```javascript
  console.log(`🔄 Attempting to store certificate ${certificateId} in PostgreSQL...`);
  // ... INSERT query ...
  console.log(`✅ Certificate ${certificateId} stored in PostgreSQL (Neon) - Row affected`);
  ```

---

## ✅ Step 2: Restart Server

**Important**: You MUST restart the server for changes to take effect!

```powershell
# Stop the current server (Ctrl+C in the terminal running it)
# Then start again:
cd d:\CODING\NBHACAKTHON\Certify\server
node index.js
```

**Expected startup logs:**
```
🔌 PostgreSQL connection successful at: [timestamp]
✅ Users table initialized successfully
✅ Certificates table initialized successfully in PostgreSQL
🚀 Server running on port 5001
```

If you see these logs ✅, the database is ready!

---

## ✅ Step 3: Test Certificate Creation

### Method 1: Via React UI (Easiest)

1. Go to http://localhost:3000
2. Login as Institute: `institute@university.edu` / `institute123`
3. Click "Issue Certificate"
4. Fill out the form and submit
5. **Watch the server console** for these logs:

**Expected logs:**
```
🔄 Attempting to store certificate abc-123-def in PostgreSQL...
✅ Certificate abc-123-def stored in PostgreSQL (Neon) - Row affected
📊 PostgreSQL Response: { id: 'abc-123-def' }
✅ Certificate abc-123-def stored in SQLite
```

### Method 2: Via curl

```powershell
curl -X POST http://localhost:5001/api/certificates/issue `
  -H "Content-Type: application/json" `
  -d '{
    "learner_name": "Debug Test",
    "learner_email": "debug@test.com",
    "course_name": "Debug Course",
    "institute_name": "Debug University",
    "issue_date": "2025-10-03"
  }'
```

---

## ✅ Step 4: Verify Storage

### Check PostgreSQL Directly

```powershell
cd d:\CODING\NBHACAKTHON\Certify\server

# Count certificates
node -e "const pool = require('./database/postgres'); pool.query('SELECT COUNT(*) FROM certificates').then(res => { console.log('Total certificates:', res.rows[0].count); process.exit(0); });"

# List recent certificates
node -e "const pool = require('./database/postgres'); pool.query('SELECT id, learner_name, course_name, created_at FROM certificates ORDER BY created_at DESC LIMIT 5').then(res => { console.log('Recent certificates:'); console.table(res.rows); process.exit(0); });"
```

---

## 🔍 Common Issues & Solutions

### Issue 1: "PostgreSQL storage error" in logs

**Symptoms:**
```
❌ PostgreSQL storage error: [error message]
```

**Solutions:**

1. **Connection string error**:
   - Check `server/database/postgres.js`
   - Verify the connection string is correct
   - Make sure SSL is enabled: `ssl: { rejectUnauthorized: false }`

2. **Table doesn't exist**:
   ```powershell
   # Verify table exists
   node -e "const pool = require('./database/postgres'); pool.query('SELECT * FROM certificates LIMIT 1').then(() => { console.log('✅ Table exists'); process.exit(0); }).catch(err => { console.error('❌ Table error:', err.message); process.exit(1); });"
   ```

3. **Column mismatch**:
   - Ensure all columns in INSERT match the table schema
   - Check for typos in column names

### Issue 2: No PostgreSQL logs at all

**Symptoms:**
- Only see SQLite logs
- No "Attempting to store" log

**Solutions:**

1. **Code not updated**:
   - Verify `server/routes/certificates.js` has the new code
   - Search for "Attempting to store certificate" in the file

2. **Server not restarted**:
   - Stop the server (Ctrl+C)
   - Start again: `node index.js`
   - Node.js caches modules, restart is required!

3. **Wrong file being run**:
   - Make sure you're in `d:\CODING\NBHACAKTHON\Certify\server`
   - Run `node index.js` not from parent directory

### Issue 3: Server won't start

**Symptoms:**
```
Error: listen EADDRINUSE: address already in use :::5001
```

**Solutions:**

1. **Kill the existing process**:
   ```powershell
   # Find process on port 5001
   netstat -ano | findstr :5001
   
   # Kill it (replace <PID> with the process ID)
   taskkill /PID <PID> /F
   ```

2. **Use different port**:
   ```powershell
   # Start on port 5002 instead
   set PORT=5002 && node index.js
   ```

### Issue 4: Certificates in SQLite but not PostgreSQL

**Symptoms:**
- See "✅ Certificate stored in SQLite"
- Don't see "✅ Certificate stored in PostgreSQL"

**Solutions:**

1. **Check error logs**:
   - Look for "PostgreSQL storage error" message
   - The error will show WHY it failed

2. **Test connection**:
   ```powershell
   node -e "const pool = require('./database/postgres'); pool.query('SELECT NOW()').then(res => { console.log('✅ Connected:', res.rows[0].now); process.exit(0); }).catch(err => { console.error('❌ Connection failed:', err.message); process.exit(1); });"
   ```

3. **Check Neon dashboard**:
   - Go to https://console.neon.tech
   - Make sure your database is active (not suspended)
   - Check if you have enough quota

---

## 📊 Verification Checklist

Use this checklist after making changes:

- [ ] Code updated in `server/database/postgres.js`
- [ ] Code updated in `server/routes/certificates.js`
- [ ] Server restarted
- [ ] Startup logs show PostgreSQL connection successful
- [ ] Startup logs show certificates table initialized
- [ ] Created a test certificate
- [ ] Server console shows "Attempting to store" log
- [ ] Server console shows "stored in PostgreSQL" log
- [ ] No error messages in red
- [ ] Can query certificates from PostgreSQL
- [ ] Certificates visible in Neon dashboard

---

## 🎯 Success Criteria

**You know it's working when you see ALL of these:**

1. **On server startup:**
   ```
   🔌 PostgreSQL connection successful
   ✅ Certificates table initialized successfully in PostgreSQL
   ```

2. **When issuing certificate:**
   ```
   🔄 Attempting to store certificate...
   ✅ Certificate stored in PostgreSQL (Neon)
   📊 PostgreSQL Response: { id: '...' }
   ```

3. **When querying database:**
   ```powershell
   node -e "..." 
   # Shows: Total certificates: 1 (or more)
   ```

4. **In Neon dashboard:**
   - Navigate to Tables → certificates
   - See rows with your certificate data

---

## 🆘 Still Not Working?

If you've followed all steps and it's still not working:

1. **Copy the exact error message** from server console
2. **Check these files have the updates**:
   - `server/database/postgres.js` (testConnection, initializeCertificatesTable)
   - `server/routes/certificates.js` (pool import, PostgreSQL INSERT with logs)

3. **Run this diagnostic**:
   ```powershell
   cd d:\CODING\NBHACAKTHON\Certify\server
   node -e "console.log('Testing PostgreSQL...'); const pool = require('./database/postgres'); setTimeout(async () => { try { await pool.query('INSERT INTO certificates (id, learner_name, course_name, institute_name, issue_date, certificate_hash) VALUES ($1, $2, $3, $4, $5, $6)', ['test-123', 'Test', 'Course', 'Institute', '2025-10-03', 'hash123']); console.log('✅ INSERT successful'); const res = await pool.query('SELECT * FROM certificates WHERE id = $1', ['test-123']); console.log('✅ Found:', res.rows[0]); await pool.query('DELETE FROM certificates WHERE id = $1', ['test-123']); console.log('✅ Cleanup done'); } catch(err) { console.error('❌ Error:', err.message); } process.exit(0); }, 2000);"
   ```

This will test if basic INSERT works to PostgreSQL.

---

## 💡 Key Points

1. **Dual Storage**: System stores in BOTH PostgreSQL and SQLite
   - PostgreSQL is PRIMARY (cloud)
   - SQLite is BACKUP (local)

2. **Order Matters**: PostgreSQL INSERT happens BEFORE SQLite
   - If PostgreSQL fails, you'll see the error
   - SQLite will still work

3. **Async Operations**: Wait for all operations to complete
   - Check logs after certificate creation
   - Give it a few seconds

4. **Server Restart**: Required for code changes
   - Node caches modules
   - Must restart to load new code

---

**Good luck! Your certificates will be stored in the cloud soon! ☁️**

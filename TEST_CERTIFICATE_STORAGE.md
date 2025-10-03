# 🔧 Testing Certificate Storage in PostgreSQL

## Quick Test Steps

### Option 1: Via React App (Recommended)

1. **Start the server** (if not already running):
   ```powershell
   cd d:\CODING\NBHACAKTHON\Certify\server
   node index.js
   ```

   You should see:
   ```
   🔌 PostgreSQL connection successful
   ✅ Users table initialized successfully
   ✅ Certificates table initialized successfully in PostgreSQL
   🚀 Server running on port 5001
   ```

2. **Start the React client** (in a new terminal):
   ```powershell
   cd d:\CODING\NBHACAKTHON\Certify\client
   npm start
   ```

3. **Login as Institute user**:
   - Go to http://localhost:3000
   - Click "Login"
   - Email: `institute@university.edu`
   - Password: `institute123`
   - Click "Login"

4. **Issue a certificate**:
   - Click "Issue Certificate" in the navbar
   - Fill in the form:
     - Learner Name: `Test Student`
     - Learner Email: `test@student.com`
     - Course Name: `Test Course`
     - Institute Name: `Test University`
     - Issue Date: Select today's date
   - Click "Issue Certificate"

5. **Check the server console**:
   You should see:
   ```
   🔄 Attempting to store certificate <uuid> in PostgreSQL...
   ✅ Certificate <uuid> stored in PostgreSQL (Neon) - Row affected
   📊 PostgreSQL Response: { id: '<uuid>' }
   ✅ Certificate <uuid> stored in SQLite
   ```

6. **Verify in Neon Dashboard**:
   - Go to https://console.neon.tech
   - Login to your account
   - Select your project
   - Navigate to Tables → `certificates`
   - You should see your new certificate!

### Option 2: Via API (Using curl or Postman)

```powershell
# Issue a certificate
curl -X POST http://localhost:5001/api/certificates/issue `
  -H "Content-Type: application/json" `
  -d '{
    \"learner_name\": \"Test Student\",
    \"learner_email\": \"test@student.com\",
    \"course_name\": \"Test Course\",
    \"institute_name\": \"Test University\",
    \"issue_date\": \"2025-10-03\"
  }'
```

### Option 3: Direct Database Query

```powershell
cd d:\CODING\NBHACAKTHON\Certify\server
node -e "const pool = require('./database/postgres'); pool.query('SELECT id, learner_name, course_name, certificate_hash, created_at FROM certificates ORDER BY created_at DESC LIMIT 5').then(res => { console.log('Recent certificates:'); res.rows.forEach((row, i) => console.log(`${i+1}. ${row.learner_name} - ${row.course_name} (${row.id.substring(0,8)}...)`)); process.exit(0); });"
```

## Expected Console Output

When a certificate is successfully stored, you'll see:

```
🔄 Attempting to store certificate abc123-def456 in PostgreSQL...
✅ Certificate abc123-def456 stored in PostgreSQL (Neon) - Row affected
📊 PostgreSQL Response: { id: 'abc123-def456' }
✅ Certificate abc123-def456 stored in SQLite
```

## Troubleshooting

### If you don't see PostgreSQL logs:

1. **Check server is running**:
   ```powershell
   curl http://localhost:5001/api/health
   ```

2. **Check PostgreSQL connection**:
   ```powershell
   cd d:\CODING\NBHACAKTHON\Certify\server
   node -e "const pool = require('./database/postgres'); setTimeout(() => process.exit(0), 3000);"
   ```
   
   Should show:
   ```
   🔌 PostgreSQL connection successful at: [timestamp]
   ✅ Certificates table initialized successfully in PostgreSQL
   ```

3. **Check for errors**:
   - Look at the server console for any red error messages
   - Especially look for "PostgreSQL storage error" messages

### If certificates aren't showing up:

1. **Verify table exists**:
   ```powershell
   cd d:\CODING\NBHACAKTHON\Certify\server
   node -e "const pool = require('./database/postgres'); pool.query('SELECT COUNT(*) as count FROM certificates').then(res => { console.log('Total certificates:', res.rows[0].count); process.exit(0); });"
   ```

2. **Check the error logs** in server console when issuing certificate

3. **Verify connection string** is correct in `server/database/postgres.js`

## Success Indicators

✅ **PostgreSQL connection successful** - Database is connected  
✅ **Certificates table initialized** - Table exists  
✅ **Certificate stored in PostgreSQL** - Data is being written  
✅ **Certificate retrieved from API** - Data can be read back  

## Next Steps After Successful Test

1. Check Neon dashboard to see your certificates
2. Issue multiple certificates and verify they all appear
3. Test the verification endpoint with a certificate ID
4. Check student dashboard to see certificates by email
5. Monitor server logs for any PostgreSQL errors

---

**Note**: The server has **dual storage** - certificates are stored in BOTH PostgreSQL (primary) and SQLite (backup). If you see "Certificate stored in SQLite" but not "Certificate stored in PostgreSQL", check the PostgreSQL error logs for details.

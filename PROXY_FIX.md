# Proxy Configuration Fix

## Issue Identified
The frontend React app was configured to proxy API requests to `http://localhost:5001`, but the backend server is actually running on port `5002`. This mismatch caused all API calls to fail, resulting in zero data being displayed in the profile.

## Fix Applied
Updated `client/package.json` proxy configuration:

**Before:**
```json
"proxy": "http://localhost:5001"
```

**After:**
```json
"proxy": "http://localhost:5002"
```

## How to Apply the Fix

### **IMPORTANT: Restart the Frontend Server**

1. **Stop the current React development server**:
   - In the terminal running `npm start` in the client folder
   - Press `Ctrl+C` to stop it

2. **Start the React development server again**:
   ```powershell
   cd client
   npm start
   ```

3. **Refresh your browser** at `http://localhost:3000`

## Why This Was Necessary

### React Proxy Behavior
- The `proxy` setting in `package.json` is only read when the development server starts
- Changes to the proxy require a **full restart** of the React dev server
- Simply refreshing the browser is NOT enough

### Port Mismatch Detection
When testing the API endpoint:
```powershell
curl "http://localhost:5001/api/certificates/user-stats?role=Admin"
```
Result: **Unable to connect to the remote server**

When trying to start server on 5002:
```
Error: listen EADDRINUSE: address already in use :::5002
```
This confirmed the server is running on port **5002**, not 5001.

## Verification Steps

After restarting the frontend:

1. **Open Browser Console** (F12)
2. **Navigate to Profile page**
3. **Check for logs**:
   - "User object:" - Shows user data
   - "Fetching stats with params:" - Shows API parameters
   - "Stats API response:" - Shows the actual data from backend

4. **Check Network Tab**:
   - Look for `/api/certificates/user-stats` request
   - Should show status **200 OK**
   - Response should contain actual numbers (not zeros)

## Expected Results

### Admin Profile Should Show:
- **Total Certificates**: 5 (from database)
- **Platform Users**: 6 (from database)
- **Active Institutes**: 1 (from database)
- **Verified Records**: 5 (same as total certificates)

### Institute Profile Should Show:
- **Certificates Issued**: Number of certificates issued by that institute
- **Verified Certificates**: Same as issued
- **Total Students**: Count of unique learner emails
- **Active Courses**: 1 (from courses table)

## Technical Details

### Database Verification
Ran test query that confirmed data exists:
```
Total certificates: 5
Total users: 6
Active institutes: 1
Total courses: 1
```

### API Endpoint
```
GET /api/certificates/user-stats
Query Parameters:
  - role: 'Admin' | 'Institute' | 'Company' | 'Student'
  - institute_name: string (for Institute role)
  - user_id: string (for courses query)
```

### Proxy Functionality
The React development server proxies requests:
- Frontend calls: `/api/certificates/user-stats`
- Gets forwarded to: `http://localhost:5002/api/certificates/user-stats`
- Backend processes and returns JSON response

## Common Issues

### If Still Showing Zeros After Restart:

1. **Check browser console for errors**
2. **Verify backend is running**: Look for port 5002 in use
3. **Check Network tab**: Verify API calls are reaching port 5002
4. **Clear browser cache**: Hard refresh with `Ctrl+Shift+R`
5. **Check CORS**: Backend should have CORS enabled (already configured)

## Files Modified
- `client/package.json` - Updated proxy from 5001 to 5002
- `client/src/pages/Profile.js` - Added console.log for debugging
- `server/routes/certificates.js` - Added console.log for debugging

## Next Steps
1. ✅ Proxy configuration fixed
2. ⏳ Restart React development server (USER ACTION REQUIRED)
3. ⏳ Refresh browser and verify data displays
4. ⏳ Remove debug console.log statements (optional, for cleaner production code)

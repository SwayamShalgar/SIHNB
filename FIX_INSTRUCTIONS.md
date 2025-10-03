# 🔧 Admin Dashboard - Complete Fix Instructions

## Current Status
The code has been updated to include JWT authentication, but you need to **refresh your session** to see the data.

## ✅ Step-by-Step Solution

### Step 1: Clear Browser Data
1. Open the application: http://localhost:3000
2. Press `F12` to open Developer Tools
3. Go to the **Console** tab
4. Type this command and press Enter:
   ```javascript
   localStorage.clear()
   ```
5. Close Developer Tools

### Step 2: Refresh the Page
1. Press `Ctrl + Shift + R` (hard refresh) or `F5`
2. This will clear the cache and reload

### Step 3: Login Again
1. You should be redirected to the login page
2. Enter Admin credentials:
   - **Email**: `admin@certify.com`
   - **Password**: `admin123`
   - **Role**: Admin
3. Click **Login**

### Step 4: Verify Data Display
You should now see:
- ✅ Stats cards showing actual numbers (11 Students, 5 Institutes, 6 Companies)
- ✅ User table populated with all 25 users
- ✅ Search and filter working

## 🐛 Debugging (If Still Not Working)

### Check 1: Open Browser Console
1. Press `F12`
2. Go to **Console** tab
3. You should see logs like:
   ```
   Fetching users with token: eyJhbGciOiJIUzI1NI6...
   Users response: {success: true, users: Array(25), source: "PostgreSQL"}
   Number of users: 25
   ```

### Check 2: Use the Debug Button
1. Look for the **"🔄 Refresh Data (Debug)"** button below the welcome message
2. Click it
3. Check console for detailed logs

### Check 3: Verify Token in localStorage
1. Press `F12`
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Click **Local Storage** → `http://localhost:3000`
4. You should see:
   - `token`: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` (long string)
   - `user`: `{"id":1,"email":"admin@certify.com","role":"Admin",...}`

### Check 4: Network Tab
1. Press `F12`
2. Go to **Network** tab
3. Click the **"🔄 Refresh Data (Debug)"** button
4. Look for requests to:
   - `/api/admin/users`
   - `/api/admin/stats`
5. Click on each request and check:
   - **Status**: Should be `200 OK` (not 401 or 403)
   - **Headers** tab → Request Headers → Should see: `Authorization: Bearer <token>`
   - **Response** tab → Should show JSON with users array

## 🔍 Common Error Messages

### Error: "No token available"
**Console shows**: `No token available for fetchUsers`
**Solution**: 
1. Logout (click Logout button)
2. Clear localStorage: `localStorage.clear()`
3. Login again

### Error: 401 Unauthorized
**Console shows**: `Error status: 401`
**Solution**:
1. Token expired or invalid
2. Clear localStorage and login again
3. If persists, restart the server

### Error: "Cannot read property 'users' of undefined"
**Solution**: 
1. Server might not be running
2. Check if server is on port 5002
3. Check proxy configuration

## 🔄 Alternative: Direct API Test

If the UI still doesn't work, test the API directly:

### Using Browser Console:
1. Login first to get a token
2. Open Console (F12)
3. Run this code:
```javascript
const token = localStorage.getItem('token');
fetch('/api/admin/users', {
  headers: { 'Authorization': `Bearer ${token}` }
})
.then(res => res.json())
.then(data => console.log('API Response:', data))
.catch(err => console.error('API Error:', err));
```

You should see:
```json
{
  "success": true,
  "users": [...25 users...],
  "source": "PostgreSQL"
}
```

## 📝 Quick Checklist

Before proceeding, verify:
- [ ] Server is running on port 5002
- [ ] Client is running on port 3000
- [ ] No console errors (red text in F12)
- [ ] localStorage has been cleared
- [ ] You've logged in with fresh credentials
- [ ] Browser has been hard-refreshed (Ctrl+Shift+R)

## 🎯 Expected Result

After following these steps, your admin dashboard should show:

### Stats Cards:
```
┌─────────────┐ ┌──────────────┐ ┌─────────────┐ ┌──────────────┐
│  Students   │ │  Institutes  │ │  Companies  │ │ Certificates │
│     11      │ │      5       │ │      6      │ │      3       │
└─────────────┘ └──────────────┘ └─────────────┘ └──────────────┘
```

### User Table:
```
USER                           ROLE        ORGANIZATION              JOINED        ACTIONS
───────────────────────────────────────────────────────────────────────────────────────────
System Administrator          Admin       Certify Platform          10/03/2025    👁️ 🗑️
Swayam                        Admin       NIT                       10/03/2025    👁️ 🗑️
Harvard Admin                 Institute   Harvard University        10/03/2025    👁️ 🗑️
MIT Admin                     Institute   MIT                       10/03/2025    👁️ 🗑️
Swayam                        Institute   NKOCET                    10/03/2025    👁️ 🗑️
...and 20 more users...
```

## 💡 Why This Happens

The issue occurs because:
1. You were logged in **before** the authentication code was added
2. Your old session doesn't have the JWT token in the required format
3. The API calls now require the `Authorization: Bearer <token>` header
4. Without clearing localStorage, the old session persists

## 🚀 Quick Fix Command

Run this in browser console to force a fresh start:
```javascript
localStorage.clear(); 
window.location.href = '/login';
```

This will:
1. Clear all stored data
2. Redirect to login page
3. Force you to create a new authenticated session

---

## Still Having Issues?

If none of the above works, try this **nuclear option**:

1. **Stop both servers**:
   - Close server terminal (Ctrl+C)
   - Close client terminal (Ctrl+C)

2. **Clear everything**:
   - In browser: `localStorage.clear()` + `Ctrl+Shift+Del` (clear cache)
   - Close browser completely

3. **Restart servers**:
   ```powershell
   # Terminal 1: Server
   cd d:\CODING\NBHACAKTHON\Certify\server
   $env:PORT="5002"
   node index.js

   # Terminal 2: Client
   cd d:\CODING\NBHACAKTHON\Certify\client
   npm start
   ```

4. **Open fresh browser window**:
   - Go to http://localhost:3000
   - Login with admin@certify.com / admin123

---

**Last Updated**: October 3, 2025  
**Status**: Code is correct, just need fresh session  
**Database**: 25 users ready in Neon PostgreSQL

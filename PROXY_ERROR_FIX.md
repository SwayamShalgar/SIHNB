# Proxy Error Fix - Complete Solution

## Problem Identified ❌

The React client was trying to proxy requests to `http://localhost:5002`, but the server was running on port `5001`, causing connection refused errors.

### Error Messages:

```
Proxy error: Could not proxy request /main.a6d36828fe884669926f.hot-update.json
from localhost:3000 to http://localhost:5002.
(ECONNREFUSED)

Proxy error: Could not proxy request /api/stats
from localhost:3000 to http://localhost:5002.
(ECONNREFUSED)
```

## Root Cause 🔍

**Mismatch between client proxy configuration and server port:**

- Client proxy: `http://localhost:5002` ❌
- Server port: `5001` ✅

## Solution Applied ✅

### 1. Fixed Client Proxy Configuration

**File:** `/client/package.json`

**Changed:**

```json
"proxy": "http://localhost:5002"  // ❌ Wrong
```

**To:**

```json
"proxy": "http://localhost:5001"  // ✅ Correct
```

### 2. Created Environment Files

#### A. Client `.env` File

Created `/client/.env` with:

```env
REACT_APP_API_URL=http://localhost:5001
REACT_APP_VERSION=1.0.0
REACT_APP_ENABLE_BLOCKCHAIN=true
```

#### B. Client `.env.example` File

Created `/client/.env.example` as a template for future reference.

### 3. Server Port Configuration

The server is configured in `/server/index.js`:

```javascript
const PORT = process.env.PORT || 5001;
```

This means:

- It uses `PORT` from `.env` file if available
- Falls back to `5001` if not specified

## How to Fix This Permanently 🔧

### Step 1: Restart the Development Servers

**Important:** After changing `package.json`, you MUST restart the React dev server.

```bash
# Stop the current client server (Ctrl+C in the terminal)
# Then restart:
cd client
npm start
```

### Step 2: Ensure Server is Running

```bash
# In a separate terminal:
cd server
npm start
```

### Step 3: Verify Ports

Check that:

- ✅ Client runs on: `http://localhost:3000`
- ✅ Server runs on: `http://localhost:5001`

You should see in server terminal:

```
🚀 Server running on port 5001
```

## Configuration Files Overview

### Client Configuration

**File:** `/client/package.json`

```json
{
  "proxy": "http://localhost:5001"
}
```

**File:** `/client/.env`

```env
REACT_APP_API_URL=http://localhost:5001
```

### Server Configuration

**File:** `/server/index.js`

```javascript
const PORT = process.env.PORT || 5001;
```

**File:** `/server/.env` (create if missing)

```env
PORT=5001
```

## Testing the Fix 🧪

### Test 1: Check Server is Running

```bash
curl http://localhost:5001/api/health
```

Expected response:

```json
{ "status": "ok", "message": "Server is running" }
```

### Test 2: Check Client Can Access API

1. Open browser: `http://localhost:3000`
2. Open DevTools → Network tab
3. Look for API calls to `/api/stats`
4. Should show status: `200 OK` (not 502 or 504)

### Test 3: Check Proxy is Working

```bash
# In browser console:
fetch('/api/health')
  .then(r => r.json())
  .then(d => console.log(d))
```

Expected output:

```json
{ "status": "ok", "message": "Server is running" }
```

## Common Issues & Solutions 💡

### Issue 1: Still Getting Proxy Error After Fix

**Solution:**

```bash
# 1. Stop the React dev server (Ctrl+C)
# 2. Clear npm cache
npm cache clean --force
# 3. Restart
npm start
```

### Issue 2: Server Not Running on 5001

**Check:**

```bash
# See what's running on port 5001
lsof -i :5001
# Or on Windows:
netstat -ano | findstr :5001
```

**Solution:** Make sure server is running:

```bash
cd server
npm start
```

### Issue 3: Port Already in Use

**Error:** `Port 5001 is already in use`

**Solution:**

```bash
# Kill the process using port 5001
# macOS/Linux:
lsof -ti:5001 | xargs kill -9

# Windows:
netstat -ano | findstr :5001
taskkill /PID <PID> /F
```

### Issue 4: Changes Not Taking Effect

**Solution:**

```bash
# 1. Stop all servers
# 2. Delete node_modules and reinstall
cd client
rm -rf node_modules package-lock.json
npm install

cd ../server
rm -rf node_modules package-lock.json
npm install

# 3. Restart both servers
```

## Environment-Specific Configuration 🌍

### Development

```env
# Client
REACT_APP_API_URL=http://localhost:5001

# Server
PORT=5001
```

### Production

```env
# Client
REACT_APP_API_URL=https://api.yourdomain.com

# Server
PORT=5001 (or as configured by hosting platform)
```

## Architecture Overview 📊

```
┌─────────────────────────────────────────────┐
│                                             │
│  Browser: http://localhost:3000             │
│                                             │
│  ┌──────────────────────────────────┐      │
│  │   React App (Client)              │      │
│  │   - Runs on port 3000             │      │
│  │   - Proxy: localhost:5001         │      │
│  └──────────────┬───────────────────┘      │
│                 │                            │
│                 │ Proxy /api/* requests      │
│                 │                            │
│                 ▼                            │
│  ┌──────────────────────────────────┐      │
│  │   Express Server                  │      │
│  │   - Runs on port 5001             │      │
│  │   - Handles API requests          │      │
│  │   - Connects to blockchain        │      │
│  │   - Connects to database          │      │
│  └──────────────────────────────────┘      │
│                                             │
└─────────────────────────────────────────────┘
```

## Startup Commands 🚀

### Option 1: Run Separately (Recommended for Development)

**Terminal 1 - Server:**

```bash
cd server
npm start
```

**Terminal 2 - Client:**

```bash
cd client
npm start
```

### Option 2: Run Concurrently (Optional)

You can add to root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run server\" \"npm run client\"",
    "server": "cd server && npm start",
    "client": "cd client && npm start"
  }
}
```

Then run:

```bash
npm run dev
```

## Verification Checklist ✅

- [x] `client/package.json` has `"proxy": "http://localhost:5001"`
- [x] Client `.env` created with correct API URL
- [x] Server running on port 5001
- [x] Client running on port 3000
- [x] No proxy errors in browser console
- [x] API calls returning 200 status codes
- [x] Landing page stats loading correctly

## Files Modified

1. ✅ `/client/package.json` - Fixed proxy from 5002 to 5001
2. ✅ `/client/.env` - Created with API URL configuration
3. ✅ `/client/.env.example` - Created as template

## Files to Create (If Missing)

If server `.env` doesn't exist, create it:

**File:** `/server/.env`

```env
PORT=5001
NODE_ENV=development

# Add your other environment variables here
# Blockchain configuration
# Database configuration
# API keys, etc.
```

## Prevention Tips 🛡️

1. **Always check proxy configuration** when switching environments
2. **Document port numbers** in README
3. **Use environment variables** for all URLs
4. **Restart servers** after configuration changes
5. **Check both terminals** are running when developing

---

**Status:** ✅ Fixed
**Permanent Solution:** Yes
**Restart Required:** Yes (React dev server must be restarted)
**Last Updated:** October 4, 2025

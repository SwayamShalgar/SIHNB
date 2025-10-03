# Quick Start Guide

## Installation & Setup

### 1. Install Dependencies

```bash
# Install root dependencies
npm install

# Install server dependencies
cd server
npm install
cd ..

# Install client dependencies
cd client
npm install
cd ..
```

### 2. Configure Environment

```bash
cd server
cp .env.example .env
```

For quick testing, use these settings in `server/.env`:
```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:3000

# Leave these empty for mock mode (no blockchain required)
BLOCKCHAIN_RPC_URL=
PRIVATE_KEY=
CONTRACT_ADDRESS=
```

### 3. Start the Application

**Option A: Run both servers simultaneously**
```bash
npm run dev
```

**Option B: Run separately in different terminals**

Terminal 1 (Backend):
```bash
npm run server
```

Terminal 2 (Frontend):
```bash
npm run client
```

### 4. Access the Application

Open your browser and go to:
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000

## First Steps

1. **Issue a Certificate**
   - Click "Issue Certificate" or go to `/issue`
   - Fill in the form with test data
   - Click "Issue Certificate"
   - Download the PDF or view online

2. **Verify a Certificate**
   - Copy the Certificate ID from the issued certificate
   - Go to `/verify`
   - Paste the ID and click "Verify"
   - See instant verification results

3. **View Dashboard**
   - Go to `/dashboard`
   - See all issued certificates
   - Search and filter certificates

## Testing with Sample Data

Use these sample values for testing:

**Learner Name:** John Doe  
**Learner Email:** john@example.com  
**Course Name:** Full Stack Development Bootcamp  
**Institute Name:** Tech Academy  
**Issue Date:** Today's date  

## Troubleshooting

### Port Already in Use
If port 3000 or 5000 is already in use:

**For backend (port 5000):**
Edit `server/.env` and change `PORT=5000` to another port like `PORT=5001`

**For frontend (port 3000):**
It will automatically prompt you to use another port (3001)

### Database Issues
If you see database errors:
```bash
cd server
rm database.sqlite
# Restart the server - database will be recreated
```

### Module Not Found
If you see "Module not found" errors:
```bash
# Delete node_modules and reinstall
rm -rf node_modules
rm -rf client/node_modules
rm -rf server/node_modules
npm run install-all
```

## Next Steps

### Add Blockchain Integration
See `blockchain/SETUP.md` for instructions on:
- Setting up Ganache for local blockchain
- Deploying to Polygon Mumbai testnet
- Configuring the smart contract

### Customize the Design
- Edit CSS files in `client/src/styles/`
- Modify colors, fonts, and layouts
- Update the logo and branding

### Add Authentication
Consider adding authentication for institutes:
- JWT tokens for API security
- User registration and login
- Role-based access control

## Production Deployment

### Frontend (Vercel/Netlify)
```bash
cd client
npm run build
# Deploy the 'build' folder
```

### Backend (Heroku/Railway)
1. Set environment variables
2. Configure PostgreSQL (replace SQLite)
3. Deploy the server folder

### Environment Variables for Production
```env
NODE_ENV=production
PORT=5000
BLOCKCHAIN_RPC_URL=https://polygon-rpc.com
PRIVATE_KEY=<your_private_key>
CONTRACT_ADDRESS=<deployed_contract_address>
FRONTEND_URL=https://your-frontend-url.com
```

## Support

For issues or questions:
1. Check the main README.md
2. Review the troubleshooting section
3. Check server logs in the terminal
4. Open an issue on GitHub

---

Happy building! 🚀

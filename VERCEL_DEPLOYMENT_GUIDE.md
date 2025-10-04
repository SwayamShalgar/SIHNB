# Vercel Deployment Guide for Certify Platform

## 🚀 Quick Deploy to Vercel

### Prerequisites
1. GitHub account with your code pushed
2. Vercel account (free tier works)
3. Environment variables ready

---

## 📝 Step-by-Step Deployment

### 1. Push Your Code to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Environment Variables Setup

You'll need to add these environment variables in Vercel Dashboard:

#### Server Environment Variables
```
# Database
DATABASE_URL=your_neon_postgres_url

# JWT
JWT_SECRET=your_jwt_secret_key

# Pinata IPFS
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt_token

# Blockchain
PRIVATE_KEY=your_ethereum_private_key
CONTRACT_ADDRESS=0x127F2a2235141c1838c70B5b91E8a9Cd41d4d7CC
SEPOLIA_RPC_URL=https://sepolia.infura.io/v3/YOUR_INFURA_KEY

# Server
PORT=5001
NODE_ENV=production
```

### 3. Deploy on Vercel

#### Option A: Using Vercel CLI
```bash
# Install Vercel CLI
npm i -g vercel

# Login to Vercel
vercel login

# Deploy
vercel

# For production
vercel --prod
```

#### Option B: Using Vercel Dashboard
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Configure project:
   - **Framework Preset**: Other
   - **Build Command**: `npm run vercel-build`
   - **Output Directory**: `client/build`
   - **Install Command**: `npm install`
4. Add environment variables in Settings → Environment Variables
5. Click "Deploy"

---

## 📁 Project Structure for Vercel

```
SIHNB/
├── vercel.json          ✅ Created (routing config)
├── package.json         ✅ Updated (vercel-build script)
├── client/
│   ├── package.json     ✅ Updated (Tailwind devDeps)
│   ├── build/          ← Static files (generated)
│   └── src/
└── server/
    ├── package.json     ✅ Ready
    └── index.js        ← API routes
```

---

## 🔧 Configuration Files

### vercel.json
```json
{
  "version": 2,
  "builds": [
    {
      "src": "client/package.json",
      "use": "@vercel/static-build",
      "config": { "distDir": "client/build" }
    },
    {
      "src": "server/index.js",
      "use": "@vercel/node"
    }
  ],
  "routes": [
    {
      "src": "/api/(.*)",
      "dest": "server/index.js"
    },
    {
      "src": "/(.*)",
      "dest": "client/build/$1"
    }
  ]
}
```

### Build Commands
- **Root package.json**: `npm run vercel-build`
- **Client**: `npm install && npm run build`
- **Output**: `client/build/`

---

## ⚠️ Important Notes

### 1. Database Configuration
- Use Neon Postgres (serverless)
- Connection pooling enabled
- SSL mode required for production

### 2. API Routes
- All server routes must start with `/api/`
- Example: `/api/certificates`, `/api/verify`

### 3. Environment Variables
- Add ALL environment variables in Vercel Dashboard
- Don't commit `.env` files to GitHub
- Use `.env.example` as a template

### 4. CORS Configuration
Make sure your `server/index.js` has proper CORS setup:
```javascript
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? 'https://your-vercel-domain.vercel.app'
    : 'http://localhost:3000',
  credentials: true
}));
```

---

## 🐛 Troubleshooting

### Build Fails
**Error**: "Module not found"
**Solution**: Add missing dependencies to package.json and run `npm install`

**Error**: Tailwind CSS not working
**Solution**: Ensure `tailwindcss`, `postcss`, `autoprefixer` are in client's devDependencies

### Deployment Warnings
The deprecation warnings (glob, debug, etc.) are **NOT errors**. They won't prevent deployment.

### API Routes Not Working
1. Check `vercel.json` routing configuration
2. Verify environment variables are set
3. Check server logs in Vercel dashboard

### Database Connection Issues
1. Verify DATABASE_URL is correct
2. Ensure SSL is enabled
3. Check Neon database allows connections from Vercel IPs

---

## 🔍 Testing Deployment

After deployment, test these endpoints:

1. **Frontend**: `https://your-app.vercel.app`
2. **API Health**: `https://your-app.vercel.app/api/health`
3. **Stats**: `https://your-app.vercel.app/api/stats`
4. **Certificates**: `https://your-app.vercel.app/api/certificates`

---

## 📊 Post-Deployment Checklist

- [ ] Frontend loads correctly
- [ ] Language switcher works (all 7 languages)
- [ ] Login/Register functions
- [ ] Certificate issuance works
- [ ] Certificate verification works
- [ ] Database connections stable
- [ ] Blockchain integration works
- [ ] IPFS uploads (Pinata) functional
- [ ] All dashboards accessible
- [ ] Mobile responsive

---

## 🌐 Custom Domain (Optional)

1. Go to Vercel Dashboard → Your Project → Settings → Domains
2. Add your custom domain
3. Update DNS records as instructed
4. SSL certificate auto-generated

---

## 🔄 Continuous Deployment

Vercel automatically deploys when you push to GitHub:
- **Push to main**: Production deployment
- **Push to other branches**: Preview deployments
- **Pull requests**: Preview deployments with unique URLs

---

## 💡 Performance Tips

1. **Enable Edge Caching**: Static assets cached globally
2. **Optimize Images**: Use Next.js Image component or optimize beforehand
3. **Code Splitting**: React lazy loading for large components
4. **Gzip Compression**: Enabled by default on Vercel

---

## 📞 Support

- **Vercel Docs**: https://vercel.com/docs
- **Community**: https://github.com/vercel/vercel/discussions
- **Status**: https://vercel-status.com

---

## ✅ Deployment Status

After following this guide:
- ✅ vercel.json created
- ✅ Build scripts configured
- ✅ Tailwind CSS dependencies added
- ✅ Project structure optimized
- ✅ Ready for deployment

**Next Step**: Run `vercel` in your terminal or deploy via Vercel Dashboard!

---

**🎉 Your Certify platform is ready for Vercel deployment! 🎉**

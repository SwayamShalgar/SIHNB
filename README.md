# 🎓 Certify - Blockchain Certificate Verification Platform

> A modern, secure, and professional platform for issuing, managing, and verifying certificates using blockchain technology and IPFS storage.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)](https://reactjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-18+-339933?logo=node.js)](https://nodejs.org/)
[![Ethereum](https://img.shields.io/badge/Blockchain-Polygon-8247E5?logo=ethereum)](https://polygon.technology/)

## 📋 Table of Contents

- [Overview](#-overview)
- [Key Features](#-key-features)
- [Tech Stack](#️-tech-stack)
- [Architecture](#-architecture)
- [Prerequisites](#-prerequisites)
- [Installation](#-installation)
- [Configuration](#️-configuration)
- [Running the Application](#-running-the-application)
- [User Roles & Permissions](#-user-roles--permissions)
- [Usage Guide](#-usage-guide)
- [Blockchain Integration](#️-blockchain-integration)
- [API Documentation](#-api-documentation)
- [Project Structure](#-project-structure)
- [Security](#-security-best-practices)
- [Testing](#-testing)
- [Deployment](#-deployment)
- [Troubleshooting](#-troubleshooting)
- [Contributing](#-contributing)
- [License](#-license)

## 🌟 Overview

**Certify** is an enterprise-grade certificate management platform that leverages blockchain technology to ensure the authenticity and immutability of digital certificates. Built with a modern tech stack, it provides a seamless experience for educational institutions, companies, and students to issue, manage, and verify certificates.

### Why Certify?

- **🔒 Tamper-Proof**: Certificates are hashed and stored on blockchain, making them immutable
- **⚡ Instant Verification**: Verify certificates in seconds via QR codes or certificate IDs
- **🌐 Decentralized Storage**: PDFs stored on IPFS via Pinata for permanent accessibility
- **👥 Multi-Role Support**: Separate dashboards for admins, institutes, students, and companies
- **📱 Modern UI**: Professional, clean design with responsive layouts
- **🔐 Secure Authentication**: JWT-based auth with role-based access control

## 🚀 Key Features

### For Educational Institutions

- ✅ Issue blockchain-verified certificates with custom templates
- ✅ Bulk certificate generation support
- ✅ Institute-specific dashboard with analytics
- ✅ Automated PDF generation with QR codes
- ✅ IPFS storage integration for permanent archival

### For Students

- ✅ Personal dashboard to view all earned certificates
- ✅ Download certificates as PDF
- ✅ Share certificates via unique verification links
- ✅ QR code for instant verification
- ✅ Certificate authenticity guaranteed by blockchain

### For Companies

- ✅ Verify candidate certificates instantly
- ✅ Bulk verification support
- ✅ Access to certificate metadata and issuer information
- ✅ Integration-ready verification API

### For Administrators

- ✅ Platform-wide analytics and monitoring
- ✅ User management (institutes, students, companies)
- ✅ Blockchain transaction monitoring
- ✅ System configuration and settings

## 🛠️ Tech Stack

### Frontend

| Technology   | Version | Purpose                    |
| ------------ | ------- | -------------------------- |
| React        | 18.2.0  | UI framework               |
| React Router | 6.20.0  | Client-side routing        |
| Axios        | 1.6.2   | HTTP client                |
| Lucide React | 0.294.0 | Icon library               |
| QRCode.React | 3.1.0   | QR code generation         |
| Custom CSS   | -       | Professional design system |

### Backend

| Technology | Version | Purpose                    |
| ---------- | ------- | -------------------------- |
| Node.js    | 18+     | Runtime environment        |
| Express    | 4.18.2  | Web framework              |
| SQLite3    | 5.1.6   | Local database             |
| PostgreSQL | 8.16.3  | Production database option |
| JWT        | 9.0.2   | Authentication             |
| Bcrypt.js  | 3.0.2   | Password hashing           |
| PDFKit     | 0.13.0  | PDF generation             |
| Multer     | 1.4.5   | File uploads               |

### Blockchain & Storage

| Technology     | Version | Purpose                    |
| -------------- | ------- | -------------------------- |
| Hardhat        | Latest  | Smart contract development |
| Ethers.js      | 6.9.0   | Blockchain interaction     |
| Solidity       | 0.8.19  | Smart contract language    |
| Polygon Mumbai | Testnet | Blockchain network         |
| IPFS/Pinata    | -       | Decentralized storage      |

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                        Client Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │ Landing  │  │   Auth   │  │Dashboard │  │ Verify   │   │
│  │   Page   │  │  System  │  │  (Roles) │  │  Page    │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
└─────────────────────────────────────────────────────────────┘
                            ↕ HTTP/REST API
┌─────────────────────────────────────────────────────────────┐
│                       Server Layer                           │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ Auth Routes  │  │ Certificate  │  │ Verification │     │
│  │              │  │   Routes     │  │   Routes     │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
│                                                              │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐     │
│  │ JWT Auth     │  │ PDF Generator│  │ Pinata IPFS  │     │
│  │ Middleware   │  │              │  │   Service    │     │
│  └──────────────┘  └──────────────┘  └──────────────┘     │
└─────────────────────────────────────────────────────────────┘
                    ↕                        ↕
┌──────────────────────┐        ┌──────────────────────┐
│   Database Layer     │        │  Blockchain Layer    │
│                      │        │                      │
│  ┌────────────────┐ │        │  ┌────────────────┐ │
│  │ SQLite/        │ │        │  │ Smart Contract │ │
│  │ PostgreSQL     │ │        │  │ (Polygon)      │ │
│  │                │ │        │  │                │ │
│  │ • Users        │ │        │  │ • Certificate  │ │
│  │ • Certificates │ │        │  │   Hashes       │ │
│  │ • Metadata     │ │        │  │ • Verification │ │
│  └────────────────┘ │        │  └────────────────┘ │
└──────────────────────┘        └──────────────────────┘
```

## ✅ Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher) - [Download](https://nodejs.org/)
- **npm** (v9.0.0 or higher) - Comes with Node.js
- **Git** - [Download](https://git-scm.com/)
- **MetaMask** or similar Web3 wallet (for blockchain transactions)
- **Pinata Account** (for IPFS storage) - [Sign Up](https://pinata.cloud/)

### Optional (for production)

- **PostgreSQL** (v14+) - For production database
- **Polygon RPC URL** - From [Alchemy](https://www.alchemy.com/) or [Infura](https://infura.io/)

## 📦 Installation

### 1. Clone the Repository

```bash
git clone https://github.com/SurajsinghBayas/SIHNB.git
cd SIHNB
```

### 2. Install All Dependencies

Quick install (recommended):

```bash
npm run install-all
```

Or install manually:

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

### 3. Install Hardhat (for blockchain development)

```bash
npm install --save-dev hardhat @nomicfoundation/hardhat-toolbox
```

## ⚙️ Configuration

### 1. Server Environment Variables

Create a `.env` file in the `server` directory:

```bash
cd server
touch .env
```

Add the following variables:

```env
# Server Configuration
PORT=5001
NODE_ENV=development

# Database Configuration (PostgreSQL - Optional)
DATABASE_URL=postgresql://username:password@localhost:5432/certify
# Or use SQLite (default)
USE_SQLITE=true

# JWT Configuration
JWT_SECRET=your_super_secret_jwt_key_change_this_in_production
JWT_EXPIRES_IN=7d

# Blockchain Configuration
BLOCKCHAIN_RPC_URL=https://rpc-mumbai.maticvigil.com
PRIVATE_KEY=your_polygon_wallet_private_key_without_0x_prefix
CONTRACT_ADDRESS=deployed_contract_address_after_deployment

# IPFS/Pinata Configuration
PINATA_API_KEY=your_pinata_api_key
PINATA_SECRET_KEY=your_pinata_secret_key
PINATA_JWT=your_pinata_jwt_token

# CORS Configuration
CLIENT_URL=http://localhost:3000
```

### 2. Smart Contract Deployment

Deploy the certificate registry contract to Polygon Mumbai testnet:

```bash
# Compile the smart contract
npx hardhat compile

# Deploy to Mumbai testnet
npx hardhat run scripts/deploy.js --network mumbai

# Or deploy to local Hardhat network for testing
npx hardhat node
npx hardhat run scripts/deploy.js --network localhost
```

**Note**: Copy the deployed contract address and add it to your `.env` file as `CONTRACT_ADDRESS`.

### 3. Database Initialization

The database will auto-initialize on first run. To manually seed users:

```bash
cd server
npm run seed
```

This creates default users:

- Admin: `admin@certify.com` / `admin123`
- Institute: `institute@example.com` / `institute123`
- Student: `student@example.com` / `student123`
- Company: `company@example.com` / `company123`

## 🚀 Running the Application

### Development Mode (Recommended)

Run both frontend and backend simultaneously:

```bash
# From root directory
npm run dev
```

This starts:

- **Backend**: http://localhost:5001
- **Frontend**: http://localhost:3000

### Production Mode

Build and run for production:

```bash
# Build frontend
npm run build

# Start server (serves built frontend)
cd server
npm start
```

### Run Separately

**Backend only:**

```bash
npm run server
# or
cd server && npm start
```

**Frontend only:**

```bash
npm run client
# or
cd client && npm start
```

## 👥 User Roles & Permissions

### 🔴 Admin

- Full platform access
- User management (create, edit, delete institutes/companies)
- Platform analytics and monitoring
- System configuration
- Blockchain transaction monitoring

### 🟢 Institute

- Issue certificates to students
- View all issued certificates
- Manage student records
- Access institute-specific analytics
- Download/regenerate certificates

### 🔵 Student

- View personal certificates
- Download certificates as PDF
- Share verification links
- Access QR codes for verification
- Track certificate history

### 🟡 Company

- Verify candidate certificates
- Bulk verification support
- Access certificate metadata
- View issuer information
- Generate verification reports

## 📖 Usage Guide

### 1. Register an Account

1. Visit http://localhost:3000
2. Click **"Get Started"** or **"Sign Up"**
3. Select your role (Institute/Student/Company)
4. Fill in registration details
5. Verify your email (if enabled)

### 2. Login

1. Go to **Login** page
2. Enter credentials
3. Select your role from dropdown
4. Click **"Login"**

### 3. Issue a Certificate (Institute)

1. Navigate to **Dashboard**
2. Click **"Issue Certificate"**
3. Fill in certificate details:
   - Student name and email
   - Course name
   - Completion date
   - Grade/Score (optional)
4. Click **"Issue Certificate"**
5. System will:
   - Generate PDF with QR code
   - Upload to IPFS
   - Store hash on blockchain
   - Send notification to student

### 4. View Certificates (Student)

1. Login to **Student Dashboard**
2. View all earned certificates
3. Click on any certificate to:
   - View full details
   - Download PDF
   - Copy verification link
   - Share QR code

### 5. Verify Certificate (Anyone)

**Method 1: QR Code**

1. Scan QR code on certificate using phone camera
2. Automatically redirects to verification page
3. View certificate details and blockchain proof

**Method 2: Certificate ID**

1. Go to **Verify Certificate** page
2. Enter certificate ID
3. Click **"Verify"**
4. View results with:
   - Certificate metadata
   - Blockchain transaction hash
   - IPFS link
   - Issuer information

**Method 3: API**

```bash
curl -X POST http://localhost:5001/api/verification/verify \
  -H "Content-Type: application/json" \
  -d '{"certificateId": "cert_abc123xyz"}'
```

## ⛓️ Blockchain Integration

### Smart Contract: CertificateRegistry.sol

The platform uses a Solidity smart contract deployed on Polygon Mumbai testnet:

```solidity
// Key Functions:
- registerCertificate(bytes32 certificateHash)
- verifyCertificate(bytes32 certificateHash)
- getCertificateDetails(bytes32 certificateHash)
```

### How It Works

1. **Certificate Issuance**:

   ```
   Certificate Data → SHA-256 Hash → Store on Blockchain
   ```

2. **Verification**:

   ```
   Certificate ID → Retrieve Hash → Query Blockchain → Verify Match
   ```

3. **Benefits**:
   - **Immutability**: Once written, cannot be altered
   - **Transparency**: Anyone can verify on blockchain
   - **Decentralization**: No single point of failure
   - **Low Cost**: Polygon offers minimal gas fees

### View Transactions

Visit [PolygonScan Mumbai](https://mumbai.polygonscan.com/) and search for your contract address or transaction hash.

## 🔌 API Documentation

### Authentication Endpoints

#### Register User

```http
POST /api/auth/register
Content-Type: application/json

{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student",
  "organizationName": "XYZ University" // for institutes
}
```

#### Login

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securePassword123",
  "role": "student"
}
```

### Certificate Endpoints

#### Issue Certificate

```http
POST /api/certificates/issue
Authorization: Bearer <jwt_token>
Content-Type: application/json

{
  "studentName": "Jane Smith",
  "studentEmail": "jane@example.com",
  "courseName": "Full Stack Development",
  "completionDate": "2024-03-15",
  "grade": "A+"
}
```

#### Get User Certificates

```http
GET /api/certificates/user
Authorization: Bearer <jwt_token>
```

#### Download Certificate

```http
GET /api/certificates/:certificateId/download
```

### Verification Endpoints

#### Verify Certificate

```http
POST /api/verification/verify
Content-Type: application/json

{
  "certificateId": "cert_abc123xyz"
}
```

#### Bulk Verify

```http
POST /api/verification/bulk-verify
Content-Type: application/json

{
  "certificateIds": ["cert_1", "cert_2", "cert_3"]
}
```

## 📁 Project Structure

```
SIHNB/
├── blockchain/                 # Smart contracts
│   ├── CertificateRegistry.sol # Main contract
│   └── SETUP.md               # Blockchain setup guide
│
├── client/                    # React frontend
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   └── ui/           # Reusable UI components
│   │   ├── context/
│   │   │   └── AuthContext.js # Authentication context
│   │   ├── pages/            # Page components
│   │   │   ├── LandingPage.js
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── Dashboard.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── InstituteDashboard.js
│   │   │   ├── StudentDashboard.js
│   │   │   ├── CompanyDashboard.js
│   │   │   ├── IssueCertificate.js
│   │   │   ├── VerifyCertificate.js
│   │   │   └── ViewCertificate.js
│   │   ├── styles/           # CSS modules
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── server/                    # Express backend
│   ├── blockchain/
│   │   └── contract.js       # Blockchain interaction
│   ├── database/
│   │   ├── init.js           # SQLite initialization
│   │   └── postgres.js       # PostgreSQL setup
│   ├── middleware/
│   │   └── auth.js           # JWT authentication
│   ├── routes/
│   │   ├── auth.js           # Auth endpoints
│   │   ├── certificates.js   # Certificate CRUD
│   │   └── verification.js   # Verification logic
│   ├── utils/
│   │   ├── certificateGenerator.js # PDF generation
│   │   └── pinataService.js  # IPFS integration
│   ├── certificates/         # Generated PDFs
│   ├── scripts/
│   │   └── seedUsers.js      # Database seeding
│   ├── database.sqlite       # SQLite database
│   ├── index.js              # Server entry point
│   └── package.json
│
├── scripts/
│   └── deploy.js             # Contract deployment script
│
├── hardhat.config.js         # Hardhat configuration
├── package.json              # Root dependencies
└── README.md                 # This file
```

## 🔒 Security Best Practices

1. **Environment Variables**: Never commit `.env` files to version control
2. **JWT Secret**: Use a strong, random secret key (32+ characters)
3. **Private Keys**: Store blockchain private keys securely
4. **Password Hashing**: Uses bcrypt with salt rounds
5. **HTTPS**: Always use HTTPS in production
6. **CORS**: Configure CORS to allow only trusted origins
7. **Input Validation**: All inputs are validated and sanitized
8. **Rate Limiting**: Implement rate limiting for API endpoints (recommended)

## 🧪 Testing

### Run Unit Tests

```bash
# Frontend tests
cd client
npm test

# Backend tests
cd server
npm test
```

### Smart Contract Tests

```bash
npx hardhat test
```

### Test Coverage

```bash
npx hardhat coverage
```

## 🚢 Deployment

### Frontend (Vercel/Netlify)

1. Build the production bundle:

   ```bash
   cd client
   npm run build
   ```

2. Deploy the `build` folder to your hosting provider

### Backend (Heroku/Railway/DigitalOcean)

1. Set environment variables on your hosting platform
2. Deploy server directory
3. Configure database (PostgreSQL recommended for production)

### Smart Contract (Polygon Mainnet)

1. Get MATIC tokens for gas fees
2. Update `hardhat.config.js` with mainnet configuration
3. Deploy:
   ```bash
   npx hardhat run scripts/deploy.js --network polygon
   ```

## 🐛 Troubleshooting

### Common Issues

**Issue**: "Cannot connect to database"

```bash
# Solution: Check if PostgreSQL is running or use SQLite
cd server
# Set USE_SQLITE=true in .env
```

**Issue**: "Blockchain transaction failed"

```bash
# Solution: Ensure you have test MATIC tokens
# Get free tokens from: https://faucet.polygon.technology/
```

**Issue**: "IPFS upload failed"

```bash
# Solution: Verify Pinata credentials in .env
# Ensure PINATA_API_KEY and PINATA_SECRET_KEY are correct
```

**Issue**: "Port already in use"

```bash
# Solution: Kill the process or change port
# macOS/Linux:
lsof -ti:5001 | xargs kill -9

# Change PORT in server/.env
```

## 📊 Performance Optimization

- **Frontend**: Code splitting, lazy loading, image optimization
- **Backend**: Database indexing, caching with Redis (optional)
- **Blockchain**: Batch transactions, gas optimization
- **IPFS**: CDN integration for faster file retrieval

## 🗺️ Roadmap

- [ ] Multi-chain support (Ethereum, BSC, Avalanche)
- [ ] Email notifications for certificate issuance
- [ ] Advanced analytics dashboard
- [ ] Bulk certificate issuance via CSV
- [ ] Mobile app (React Native)
- [ ] Integration with LinkedIn
- [ ] API rate limiting and quotas
- [ ] Two-factor authentication (2FA)
- [ ] Certificate templates customization
- [ ] Multi-language support

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Contribution Guidelines

- Follow existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all tests pass before submitting PR

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Authors

- **Certify Team** - _Initial work_ - [GitHub](https://github.com/SurajsinghBayas)

## 🙏 Acknowledgments

- [Hardhat](https://hardhat.org/) for smart contract development tools
- [Polygon](https://polygon.technology/) for scalable blockchain infrastructure
- [Pinata](https://pinata.cloud/) for IPFS pinning services
- [React](https://reactjs.org/) team for the amazing framework
- [Express](https://expressjs.com/) for robust backend framework

## 📞 Support

For support, create an issue on [GitHub](https://github.com/SurajsinghBayas/SIHNB/issues) or reach out to the team.

## 🌐 Links

- **GitHub Repository**: https://github.com/SurajsinghBayas/SIHNB
- **Live Demo**: Coming soon
- **Documentation**: See project documentation files

---

<div align="center">
  <p>Made with ❤️ by the Certify Team</p>
  <p>⭐ Star this repo if you find it helpful!</p>
  
  **Built with React • Node.js • Blockchain Technology**
</div>

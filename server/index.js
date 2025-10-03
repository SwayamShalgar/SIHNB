const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from server/.env
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));

// Import routes
const certificateRoutes = require('./routes/certificates');
const verificationRoutes = require('./routes/verification');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const blockchainRoutes = require('./routes/blockchain');

// Initialize database
const db = require('./database/init');
const pgPool = require('./database/postgres');

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/certificates', certificateRoutes);
app.use('/api/verify', verificationRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/blockchain', blockchainRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📊 Environment: ${process.env.NODE_ENV || 'development'}`);
});

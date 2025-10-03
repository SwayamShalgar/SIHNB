# 🚀 Quick Start Guide - Authentication System

## ✅ Setup Complete!

Your login system with 4 user roles is now ready!

## 📋 What's Been Created

### Backend (Server)
- ✅ PostgreSQL database connection (Neon)
- ✅ User authentication with JWT
- ✅ Password hashing with bcrypt
- ✅ Role-based access control
- ✅ Auth routes: `/api/auth/register`, `/api/auth/login`

### Frontend (Client)
- ✅ Login page (`/login`)
- ✅ Register page (`/register`)
- ✅ Admin Dashboard (`/admin-dashboard`)
- ✅ Institute Dashboard (`/institute-dashboard`)
- ✅ Student Dashboard (`/student-dashboard`)
- ✅ Company Dashboard (`/company-dashboard`)

## 🎯 How to Start

### 1. Seed Test Users (Optional but Recommended)

```bash
cd server
npm run seed
```

This creates 4 test users:
- **Admin**: admin@certify.com / admin123
- **Institute**: institute@university.edu / institute123
- **Student**: student@university.edu / student123
- **Company**: hr@company.com / company123

### 2. Start the Backend Server

```bash
cd server
npm start
```

Server will run on: http://localhost:5001

### 3. Start the Frontend Client

Open a new terminal:

```bash
cd client
npm start
```

Client will run on: http://localhost:3000

## 🎨 Testing the System

### Step 1: Access the Application
Open your browser and go to: **http://localhost:3000**

### Step 2: Click "Login" Button
You'll see the login button in the top navigation bar.

### Step 3: Choose a User Type and Login

**Test Admin:**
1. Email: `admin@certify.com`
2. Password: `admin123`
3. Role: Select "Admin"
4. Click Login
→ You'll be redirected to Admin Dashboard

**Test Institute:**
1. Email: `institute@university.edu`
2. Password: `institute123`
3. Role: Select "Institute"
4. Click Login
→ You'll be redirected to Institute Dashboard

**Test Student:**
1. Email: `student@university.edu`
2. Password: `student123`
3. Role: Select "Student"
4. Click Login
→ You'll be redirected to Student Dashboard

**Test Company:**
1. Email: `hr@company.com`
2. Password: `company123`
3. Role: Select "Company"
4. Click Login
→ You'll be redirected to Company Dashboard

### Step 4: Register New Users
1. Click "Register here" on the login page
2. Fill in the registration form
3. Select a role from dropdown
4. Submit
→ Auto-login and redirect to appropriate dashboard

## 📱 Features by Role

### 👨‍💼 Admin Dashboard
- View platform statistics (users, certificates, institutes, companies)
- Manage users
- Certificate management
- Analytics & reports
- System settings

### 🏫 Institute Dashboard
- Issue new blockchain certificates
- View all issued certificates
- Recent certificates list
- Student management
- Quick actions menu

### 🎓 Student Dashboard
- Personal profile card
- View all earned certificates
- Download certificates
- Verify certificate authenticity
- Course completion tracking

### 🏢 Company Dashboard
- Real-time certificate verification
- Search by certificate ID or hash
- View candidate credentials
- Blockchain validation
- Verification history tracking

## 🔒 Security Features

✅ **Password Security**
- Bcrypt hashing (10 rounds)
- Never stored in plain text

✅ **JWT Authentication**
- 24-hour token expiration
- Secure token storage

✅ **Role-Based Access**
- Server-side validation
- Client-side route protection

✅ **Database Security**
- SSL/TLS encrypted connections
- Parameterized queries
- SQL injection protection

## 🛠️ Troubleshooting

### Issue: Cannot connect to database
**Solution:** Check if PostgreSQL connection string is correct in `server/database/postgres.js`

### Issue: Token expired error
**Solution:** Clear localStorage and login again:
```javascript
// In browser console:
localStorage.clear();
```

### Issue: Wrong dashboard after login
**Solution:** Make sure the role selected during login matches your user role in database

### Issue: Server not starting
**Solution:** 
1. Make sure port 5001 is not in use
2. Check if all dependencies are installed: `npm install`

### Issue: Database table doesn't exist
**Solution:** The table auto-creates on first run. Restart the server if needed.

## 📂 Project Structure

```
Certify/
├── server/
│   ├── database/
│   │   ├── postgres.js          # PostgreSQL connection
│   │   └── init.js              # SQLite (existing)
│   ├── middleware/
│   │   └── auth.js              # JWT authentication
│   ├── routes/
│   │   ├── auth.js              # Auth endpoints
│   │   ├── certificates.js      # Certificate routes
│   │   └── verification.js      # Verification routes
│   ├── scripts/
│   │   └── seedUsers.js         # Test user seeding
│   └── index.js                 # Server entry
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.js
│   │   │   ├── Register.js
│   │   │   ├── AdminDashboard.js
│   │   │   ├── InstituteDashboard.js
│   │   │   ├── StudentDashboard.js
│   │   │   └── CompanyDashboard.js
│   │   ├── styles/
│   │   │   ├── Login.css
│   │   │   ├── Register.css
│   │   │   ├── AdminDashboard.css
│   │   │   ├── InstituteDashboard.css
│   │   │   ├── StudentDashboard.css
│   │   │   └── CompanyDashboard.css
│   │   └── App.js
│   └── package.json
│
└── AUTH_SYSTEM_DOCUMENTATION.md
```

## 🎓 Next Steps

1. **Customize Dashboards**
   - Add more features to each dashboard
   - Connect to existing certificate system

2. **Add Email Verification**
   - Send verification emails
   - Password reset functionality

3. **Enhance Security**
   - Add 2FA authentication
   - Session management
   - Rate limiting

4. **Integration**
   - Connect Institute dashboard to certificate issuance
   - Link Student dashboard to personal certificates
   - Integrate Company verification with existing system

## 📞 Support

For detailed documentation, see: `AUTH_SYSTEM_DOCUMENTATION.md`

For certificate system integration, see: `README.md`

---

## 🎉 You're All Set!

Your authentication system is ready to use. Login with any test account and explore the role-specific dashboards!

**Happy Coding! 🚀**

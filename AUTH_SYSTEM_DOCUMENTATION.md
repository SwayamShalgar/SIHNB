# Authentication System Documentation

## Overview
A complete role-based authentication system with 4 user types:
- **Admin**: Full platform management
- **Institute**: Issue and manage certificates
- **Student**: View and download certificates
- **Company**: Verify candidate certificates

## Database Schema

### PostgreSQL Database
Connection: Neon PostgreSQL (secure SSL connection)

```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Institute', 'Student', 'Company')),
  full_name VARCHAR(255),
  organization VARCHAR(255),
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Backend Setup

### Dependencies Installed
- `pg` - PostgreSQL client
- `bcryptjs` - Password hashing
- `jsonwebtoken` - JWT authentication

### Files Created

1. **server/database/postgres.js**
   - PostgreSQL connection pool
   - Auto-creates users table
   - Handles SSL connection

2. **server/middleware/auth.js**
   - JWT token verification
   - Role-based authorization
   - Protected route middleware

3. **server/routes/auth.js**
   - POST `/api/auth/register` - User registration
   - POST `/api/auth/login` - User login
   - GET `/api/auth/me` - Get current user
   - POST `/api/auth/logout` - Logout

## Frontend Components

### Pages Created

1. **Login.js** (`/login`)
   - Email, password, role selection
   - Redirects to role-specific dashboard

2. **Register.js** (`/register`)
   - Full registration form
   - Email, password, role, name, organization, phone
   - Auto-login after registration

3. **AdminDashboard.js** (`/admin-dashboard`)
   - Platform statistics
   - User management
   - Certificate oversight
   - Analytics & reports

4. **InstituteDashboard.js** (`/institute-dashboard`)
   - Issue new certificates
   - View issued certificates
   - Organization management

5. **StudentDashboard.js** (`/student-dashboard`)
   - View earned certificates
   - Download certificates
   - Profile information

6. **CompanyDashboard.js** (`/company-dashboard`)
   - Verify candidate certificates
   - Search by certificate ID
   - View verification history

### Styling
Each dashboard has its own CSS file with:
- Modern gradient designs
- Responsive layouts
- Smooth animations
- Card-based UI components

## Authentication Flow

### Registration
1. User fills registration form
2. Password is hashed with bcrypt (10 rounds)
3. User data stored in PostgreSQL
4. JWT token generated (24h expiry)
5. Token stored in localStorage
6. Redirect to role-specific dashboard

### Login
1. User enters email, password, role
2. Backend verifies credentials
3. Password compared with hashed version
4. JWT token generated
5. Token stored in localStorage
6. Redirect to dashboard based on role

### Protected Routes
Each dashboard checks:
1. Token exists in localStorage
2. User data exists
3. Role matches the dashboard type
4. Redirects to `/login` if unauthorized

## API Endpoints

### POST /api/auth/register
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "role": "Student",
  "full_name": "John Doe",
  "organization": "ABC University",
  "phone": "+1234567890"
}

Response:
{
  "success": true,
  "message": "User registered successfully",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "Student",
    "full_name": "John Doe"
  }
}
```

### POST /api/auth/login
```json
Request:
{
  "email": "user@example.com",
  "password": "password123",
  "role": "Student"
}

Response:
{
  "success": true,
  "message": "Login successful",
  "token": "jwt-token-here",
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "Student"
  }
}
```

### GET /api/auth/me
Headers: `Authorization: Bearer <token>`

```json
Response:
{
  "user": {
    "id": 1,
    "email": "user@example.com",
    "role": "Student",
    "full_name": "John Doe",
    "organization": "ABC University"
  }
}
```

## Role-Based Access Control

### Admin Dashboard
- Can access: All platform features
- View: All users, certificates, analytics
- Actions: Manage users, configure system

### Institute Dashboard
- Can access: Certificate issuance
- View: Own issued certificates
- Actions: Issue certificates, view students

### Student Dashboard
- Can access: Personal certificates
- View: Own certificates only
- Actions: Download certificates, verify

### Company Dashboard
- Can access: Verification system
- View: Verified certificate details
- Actions: Verify certificates by ID

## Security Features

1. **Password Security**
   - Bcrypt hashing (10 salt rounds)
   - Never stored in plain text

2. **JWT Tokens**
   - 24-hour expiration
   - Signed with secret key
   - Stored in localStorage

3. **Role Validation**
   - Server-side role checks
   - Client-side route protection
   - Database-level role constraints

4. **SQL Injection Protection**
   - Parameterized queries
   - PostgreSQL prepared statements

5. **SSL/TLS**
   - Encrypted database connections
   - Secure API communication

## Testing the System

### 1. Start the Server
```bash
cd server
npm start
```
Server runs on: `http://localhost:5001`

### 2. Start the Client
```bash
cd client
npm start
```
Client runs on: `http://localhost:3000`

### 3. Create Test Users

**Admin User:**
- Email: admin@certify.com
- Password: admin123
- Role: Admin

**Institute User:**
- Email: institute@university.edu
- Password: institute123
- Role: Institute

**Student User:**
- Email: student@university.edu
- Password: student123
- Role: Student

**Company User:**
- Email: hr@company.com
- Password: company123
- Role: Company

## Features by Role

### Admin
✓ Platform overview statistics
✓ User management interface
✓ Certificate oversight
✓ System configuration
✓ Analytics and reports

### Institute
✓ Issue blockchain certificates
✓ View issued certificates
✓ Student management
✓ Organization profile

### Student
✓ View earned certificates
✓ Download PDF certificates
✓ Verify certificates
✓ Personal profile

### Company
✓ Real-time certificate verification
✓ Candidate credential check
✓ Blockchain validation
✓ Verification history

## Environment Variables

Add to `server/.env`:
```env
PORT=5001
JWT_SECRET=your-super-secret-jwt-key-change-in-production
DATABASE_URL=postgresql://neondb_owner:npg_2ghyseCmpNX7@ep-damp-truth-a10ix4ll-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require
```

## Future Enhancements

1. **Email Verification**
   - Send verification emails on registration
   - Password reset functionality

2. **Two-Factor Authentication**
   - SMS or email OTP
   - Authenticator app support

3. **Session Management**
   - Track active sessions
   - Force logout from all devices

4. **Audit Logs**
   - Track all user actions
   - Security event logging

5. **Advanced Permissions**
   - Granular permissions per role
   - Custom role creation

## Troubleshooting

### Database Connection Issues
- Check Neon PostgreSQL dashboard
- Verify connection string
- Ensure SSL is enabled

### Token Errors
- Check JWT_SECRET is set
- Verify token expiration
- Clear localStorage and login again

### Role Access Denied
- Verify user role in database
- Check localStorage user data
- Ensure role matches route

## Support
For issues or questions, check:
1. Browser console for errors
2. Server logs for backend errors
3. PostgreSQL logs for database issues

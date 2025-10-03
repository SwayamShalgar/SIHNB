# Admin Approval Flow Implementation

## Overview
This document describes the implementation of the admin approval system for Company and Institute registrations. These user types now require admin verification before they can access the system.

## 🎯 User Flow

### For Company/Institute Registration:

1. **Registration Phase**
   - User fills out registration form and selects role (Company or Institute)
   - System creates account with `verified = FALSE`
   - User sees success message with pending status
   - **No login token is issued** - user cannot login yet

2. **Waiting Phase**
   - Account exists in database but cannot login
   - User receives message: *"Your account is pending admin approval"*
   - Admin sees the account in pending verifications list

3. **Admin Review Phase**
   - Admin logs into admin dashboard
   - Navigates to "Pending Verifications" section
   - Reviews Company/Institute registration details
   - **Approves**: Sets `verified = TRUE`, user can now login
   - **Rejects**: Deletes the account from database

4. **Post-Approval**
   - User can now login with their credentials
   - Full access to dashboard features

### For Admin/Student Registration:

1. **Immediate Access**
   - Registration automatically sets `verified = TRUE`
   - Login token issued immediately
   - User redirected to appropriate dashboard
   - No admin approval needed

## 🔧 Technical Implementation

### Database Schema

**users table** - Added `verified` column:
```sql
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role VARCHAR(50) NOT NULL,
  full_name VARCHAR(255),
  organization VARCHAR(255),
  phone VARCHAR(50),
  verified BOOLEAN DEFAULT TRUE,  -- NEW COLUMN
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- For existing databases
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT TRUE;
```

**Verification Logic:**
- `verified = TRUE` (default) - Admin, Student (auto-approved)
- `verified = FALSE` - Company, Institute (requires admin approval)

### Backend Changes

#### 1. Registration Endpoint (`/api/auth/register`)

**File:** `server/routes/auth.js`

**Key Changes:**
```javascript
// Determine verification requirement
const requiresVerification = ['Company', 'Institute'].includes(role);
const verifiedStatus = !requiresVerification;

// Insert with verification status
await pool.query(
  `INSERT INTO users (..., verified) VALUES (..., $7)`,
  [..., verifiedStatus]
);

// Different responses based on verification requirement
if (requiresVerification) {
  return res.status(202).json({
    success: true,
    pending: true,
    message: "Registration submitted! Pending admin approval.",
    // NO TOKEN ISSUED
  });
} else {
  // Issue token for Admin/Student
  const token = jwt.sign(...);
  return res.status(201).json({ success: true, token, ... });
}
```

#### 2. Login Endpoint (`/api/auth/login`)

**File:** `server/routes/auth.js`

**Key Changes:**
```javascript
// After password verification
if (['Company', 'Institute'].includes(user.role) && user.verified === false) {
  return res.status(403).json({ 
    error: 'Account pending verification',
    message: 'Your account is pending admin approval.',
    pending: true
  });
}

// Only issue token if verified
const token = jwt.sign(...);
```

#### 3. Admin Approval Endpoints

**File:** `server/routes/admin.js`

**Endpoints:**

1. **GET `/api/admin/pending-users`**
   - Returns all unverified Company/Institute accounts
   - Requires Admin authentication

2. **POST `/api/admin/approve-user/:id`**
   - Sets `verified = TRUE` for specified user
   - User can now login

3. **POST `/api/admin/reject-user/:id`**
   - Deletes unverified user account
   - User must re-register if needed

### Frontend Changes

#### 1. Register Component

**File:** `client/src/pages/Register.js`

**Key Changes:**
```javascript
// New state
const [pendingApproval, setPendingApproval] = useState(false);
const [successMessage, setSuccessMessage] = useState('');

// Handle registration response
if (response.data.pending) {
  setPendingApproval(true);
  setSuccessMessage(response.data.message);
  // Show pending approval screen
} else {
  // Immediate login for Admin/Student
  login(response.data.user, response.data.token);
  navigate(dashboardPath);
}
```

**UI Updates:**
- Conditional rendering: Show pending approval screen OR registration form
- Success icon and informative message
- "What happens next?" info box
- "Go to Login" button after successful submission

#### 2. Login Component

**File:** `client/src/pages/Login.js`

**Key Changes:**
```javascript
catch (err) {
  if (err.response?.data?.pending) {
    setError('Your account is pending admin approval.');
  } else {
    setError(err.response?.data?.error || 'Login failed.');
  }
}
```

**UI Updates:**
- Clear error message for pending approval status
- Distinguishes between invalid credentials and pending approval

#### 3. Styling

**File:** `client/src/styles/Register.css`

**New Styles:**
- `.pending-approval-container` - Success state container
- `.success-icon` - Green checkmark circle
- `.success-message` - Green highlighted message
- `.info-box` - Info panel with next steps
- `.success-message-banner` - Optional banner style

## 🔒 Security Features

1. **No Token on Pending Registration**
   - Unverified users receive NO JWT token
   - Cannot bypass verification by manipulating frontend

2. **Database-Level Enforcement**
   - `verified` column stored in database
   - Login endpoint checks database value, not client claims

3. **Admin-Only Approval**
   - Approval endpoints require `authenticateToken` middleware
   - Require `authorizeRole('Admin')` middleware
   - Only admins can approve/reject

4. **Role-Based Logic**
   - Verification check only applies to Company/Institute
   - Admin/Student bypass verification (auto-approved)

## 📋 Testing Checklist

### Test Company/Institute Registration:
- [ ] Register new Company account
- [ ] Verify no token received
- [ ] See pending approval message
- [ ] Redirected to login option
- [ ] Attempt login - should fail with pending message
- [ ] Admin approves account
- [ ] Login succeeds after approval

### Test Admin/Student Registration:
- [ ] Register new Student account
- [ ] Receive token immediately
- [ ] Automatically logged in
- [ ] Redirected to dashboard

### Test Admin Approval:
- [ ] Login as Admin
- [ ] See pending users in dashboard
- [ ] Approve a pending user
- [ ] User can now login
- [ ] Reject a pending user
- [ ] User account deleted from database

### Test Login Flow:
- [ ] Login with unverified Company - see pending message
- [ ] Login with verified Company - success
- [ ] Login with Student - immediate success
- [ ] Invalid credentials - appropriate error message

## 🚀 Deployment Notes

### Database Migration:
```sql
-- Run this on existing database
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT TRUE;

-- Update existing Company/Institute accounts (optional)
UPDATE users SET verified = FALSE WHERE role IN ('Company', 'Institute');
```

### Server Restart:
After deploying changes, restart the backend server:
```bash
cd server
npm restart
```

### Frontend Rebuild:
Clear cache and rebuild frontend if necessary:
```bash
cd client
npm run build
```

## 📊 Admin Dashboard Integration

The admin dashboard already has the backend endpoints ready:

### Pending Users API:
```javascript
GET /api/admin/pending-users
Response: [
  {
    id: 123,
    email: "company@example.com",
    role: "Company",
    full_name: "ABC Corporation",
    organization: "ABC Corp",
    verified: false,
    created_at: "2025-10-04T..."
  }
]
```

### Approval API:
```javascript
POST /api/admin/approve-user/123
Response: { success: true, message: "User approved" }
```

### Rejection API:
```javascript
POST /api/admin/reject-user/123
Response: { success: true, message: "User rejected and deleted" }
```

## 🔄 Future Enhancements

1. **Email Notifications**
   - Send email when registration submitted
   - Send email when approved/rejected
   - Requires email service integration (e.g., SendGrid, Nodemailer)

2. **Rejection Reasons**
   - Admin can provide reason for rejection
   - Store in database or send via email
   - User can see reason and re-register with corrections

3. **Bulk Approval**
   - Select multiple pending users
   - Approve/reject all at once
   - Useful for high-volume registrations

4. **Auto-Approval Rules**
   - Email domain whitelist (e.g., @verified-company.com)
   - Organization verification via external API
   - Document upload requirement (business license, etc.)

5. **Approval Analytics**
   - Track approval/rejection rates
   - Average approval time
   - Most common rejection reasons

## 📖 User Documentation

### For Companies/Institutes:
> **Registration Process**
> 
> 1. Fill out the registration form with your details
> 2. Submit your registration
> 3. You will see a confirmation that your registration is pending
> 4. An administrator will review your registration
> 5. Once approved, you can login with your email and password
> 
> **Note:** You will NOT be able to login until an administrator approves your account.

### For Admins:
> **Approving New Accounts**
> 
> 1. Login to your admin dashboard
> 2. Navigate to "Pending Verifications" section
> 3. Review the list of pending Company/Institute registrations
> 4. Click "Approve" to activate the account
> 5. Click "Reject" to delete the registration
> 
> **Tip:** Check organization details and contact information before approving.

## 🐛 Troubleshooting

### Issue: User can't login after approval
**Solution:** Check database - ensure `verified = TRUE` for that user ID

### Issue: Pending users not showing in admin dashboard
**Solution:** Verify admin endpoints are accessible, check JWT token validity

### Issue: Student/Admin seeing pending message
**Solution:** These roles should have `verified = TRUE` by default - check database

### Issue: Old Company/Institute users can't login
**Solution:** Run migration to add `verified` column with default TRUE:
```sql
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT TRUE;
```

## 📝 Summary

This implementation provides a complete admin approval workflow:

✅ **Company/Institute registrations require approval**
✅ **Admin/Student registrations work immediately**
✅ **Secure - no tokens for unverified users**
✅ **Clear UI feedback for pending status**
✅ **Admin dashboard endpoints ready for integration**
✅ **Database schema updated with verified column**

The system is now ready for production use with proper user verification controls!

# Admin Approval Flow - Visual Guide

## 📊 System Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                          USER REGISTRATION FLOW                          │
└─────────────────────────────────────────────────────────────────────────┘

                            User selects role
                                   │
                    ┌──────────────┴──────────────┐
                    │                             │
           ┌────────▼────────┐          ┌────────▼────────┐
           │  Admin/Student  │          │ Company/Institute│
           └────────┬────────┘          └────────┬────────┘
                    │                             │
         ┌──────────▼──────────┐       ┌─────────▼─────────┐
         │  Register User      │       │  Register User    │
         │  verified = TRUE    │       │  verified = FALSE │
         └──────────┬──────────┘       └─────────┬─────────┘
                    │                             │
         ┌──────────▼──────────┐       ┌─────────▼─────────┐
         │  Issue JWT Token    │       │  NO Token Issued  │
         │  Return user data   │       │  Return pending   │
         └──────────┬──────────┘       └─────────┬─────────┘
                    │                             │
         ┌──────────▼──────────┐       ┌─────────▼─────────┐
         │  Auto-login         │       │  Show pending msg │
         │  Redirect dashboard │       │  Redirect to login│
         └─────────────────────┘       └─────────┬─────────┘
                                                  │
                                       ┌──────────▼──────────┐
                                       │  Wait for Admin     │
                                       │  Approval           │
                                       └──────────┬──────────┘
                                                  │
                              ┌───────────────────┴───────────────────┐
                              │                                       │
                   ┌──────────▼──────────┐                 ┌─────────▼─────────┐
                   │  Admin APPROVES     │                 │  Admin REJECTS    │
                   │  verified = TRUE    │                 │  Delete user      │
                   └──────────┬──────────┘                 └───────────────────┘
                              │
                   ┌──────────▼──────────┐
                   │  User can login     │
                   │  Full access granted│
                   └─────────────────────┘
```

## 🔐 Login Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            LOGIN VALIDATION                              │
└─────────────────────────────────────────────────────────────────────────┘

                        User enters credentials
                                 │
                    ┌────────────▼────────────┐
                    │  Find user by email &   │
                    │  role in database       │
                    └────────────┬────────────┘
                                 │
                    ┌────────────▼────────────┐
                    │  User exists?           │
                    └────────────┬────────────┘
                                 │
                    ┌────────────┴────────────┐
                    │                         │
              ┌─────▼─────┐           ┌──────▼──────┐
              │    YES    │           │     NO      │
              └─────┬─────┘           └──────┬──────┘
                    │                        │
         ┌──────────▼──────────┐   ┌─────────▼─────────┐
         │  Verify password    │   │  Return 401       │
         └──────────┬──────────┘   │  Invalid creds    │
                    │              └───────────────────┘
         ┌──────────▼──────────┐
         │  Password correct?  │
         └──────────┬──────────┘
                    │
         ┌──────────┴──────────┐
         │                     │
    ┌────▼────┐          ┌─────▼─────┐
    │   YES   │          │    NO     │
    └────┬────┘          └─────┬─────┘
         │                     │
         │              ┌──────▼──────┐
         │              │  Return 401 │
         │              │  Invalid    │
         │              └─────────────┘
         │
┌────────▼────────┐
│ Check if role   │
│ is Company or   │
│ Institute       │
└────────┬────────┘
         │
┌────────┴────────┐
│                 │
┌────▼────┐  ┌────▼────┐
│   YES   │  │   NO    │
└────┬────┘  └────┬────┘
     │            │
┌────▼────────┐  │
│ Check       │  │
│ verified    │  │
│ status      │  │
└────┬────────┘  │
     │           │
┌────┴────┐      │
│         │      │
┌────▼────┐      │
│ FALSE   │      │
└────┬────┘      │
     │           │
┌────▼────────┐  │
│ Return 403  │  │
│ Pending     │  │
│ approval    │  │
└─────────────┘  │
                 │
            ┌────▼────┐
            │  TRUE   │
            └────┬────┘
                 │
        ┌────────▼────────┐
        │  Issue JWT      │
        │  Return token   │
        │  Login success  │
        └─────────────────┘
```

## 🎨 User Interface States

### Registration Page - Pending State
```
╔═══════════════════════════════════════════════════════╗
║                        ✓                              ║
║              Registration Submitted!                  ║
║                                                       ║
║  Your Company account is pending admin approval.     ║
║  You will be able to login once an administrator     ║
║  verifies your account.                              ║
║                                                       ║
║  ┌─────────────────────────────────────────────┐    ║
║  │         What happens next?                   │    ║
║  │  • An administrator will review your account │    ║
║  │  • You'll be notified once approved          │    ║
║  │  • After approval, login with your creds     │    ║
║  └─────────────────────────────────────────────┘    ║
║                                                       ║
║           [ Go to Login ]                            ║
╚═══════════════════════════════════════════════════════╝
```

### Login Page - Pending Error
```
╔═══════════════════════════════════════════════════════╗
║                      Login                            ║
║                                                       ║
║  ┌───────────────────────────────────────────────┐  ║
║  │ ⚠ Account pending verification                │  ║
║  │ Your Company account is pending admin         │  ║
║  │ approval. Please wait for verification.       │  ║
║  └───────────────────────────────────────────────┘  ║
║                                                       ║
║  Email:    [ company@example.com            ]       ║
║  Password: [ ••••••••••••                   ]       ║
║  Role:     [ Company                  ▼     ]       ║
║                                                       ║
║           [ Login ]                                  ║
╚═══════════════════════════════════════════════════════╝
```

### Admin Dashboard - Pending Users
```
╔═══════════════════════════════════════════════════════════════════════╗
║  Admin Dashboard > Pending Verifications                              ║
╠═══════════════════════════════════════════════════════════════════════╣
║                                                                       ║
║  📋 Pending User Verifications (2)                                   ║
║                                                                       ║
║  ┌─────────────────────────────────────────────────────────────────┐║
║  │ Email                    │ Role      │ Organization   │ Actions  │║
║  ├─────────────────────────────────────────────────────────────────┤║
║  │ company@example.com      │ Company   │ ABC Corp       │ ✓ Approve││
║  │ Created: 2 hours ago     │           │ (555) 123-4567 │ ✗ Reject ││
║  ├─────────────────────────────────────────────────────────────────┤║
║  │ institute@example.com    │ Institute │ XYZ Institute  │ ✓ Approve││
║  │ Created: 5 hours ago     │           │ (555) 987-6543 │ ✗ Reject ││
║  └─────────────────────────────────────────────────────────────────┘║
║                                                                       ║
╚═══════════════════════════════════════════════════════════════════════╝
```

## 🔄 State Transitions

### Database States
```
NEW USER REGISTRATION

Admin/Student:
  INSERT → verified = TRUE → Can login immediately

Company/Institute:
  INSERT → verified = FALSE → Cannot login
         ↓
  ADMIN APPROVES → verified = TRUE → Can login
         ↓
  ADMIN REJECTS → DELETE → Account removed
```

### User States
```
┌─────────────┐
│   PENDING   │  ← Company/Institute after registration
└──────┬──────┘
       │
   ┌───┴───┐
   │       │
┌──▼───┐ ┌─▼──────┐
│ACTIVE│ │REJECTED│
└──────┘ └────────┘
   ↑
   │
Admin approval
```

## 🎯 Role-Based Behavior Matrix

| Role      | Registration | Verified? | Token on Reg? | Can Login? | Admin Approval? |
|-----------|--------------|-----------|---------------|------------|-----------------|
| Admin     | Instant      | TRUE      | ✓ Yes         | ✓ Yes      | ✗ No           |
| Student   | Instant      | TRUE      | ✓ Yes         | ✓ Yes      | ✗ No           |
| Company   | Pending      | FALSE     | ✗ No          | ✗ No       | ✓ Yes          |
| Institute | Pending      | FALSE     | ✗ No          | ✗ No       | ✓ Yes          |

## 📱 HTTP Response Codes

### Registration Responses
```
201 Created - Admin/Student registered (with token)
202 Accepted - Company/Institute registered (pending approval)
400 Bad Request - Validation errors
500 Internal Server Error - Server error
```

### Login Responses
```
200 OK - Login successful (with token)
401 Unauthorized - Invalid credentials
403 Forbidden - Account pending verification
500 Internal Server Error - Server error
```

### Admin Action Responses
```
200 OK - Approval/rejection successful
401 Unauthorized - Invalid/missing token
403 Forbidden - Not authorized (non-admin)
404 Not Found - User not found
500 Internal Server Error - Server error
```

## 🛡️ Security Checkpoints

```
Registration
    ↓
  Is role Company/Institute?
    ↓ YES
  Set verified = FALSE
  DO NOT issue token
    ↓
Login Attempt
    ↓
  Check database verified column
    ↓
  verified = FALSE?
    ↓ YES
  BLOCK login (403 response)
    ↓
Admin Approval
    ↓
  Check admin token (JWT)
  Check admin role (authorization)
    ↓ VALID
  Update verified = TRUE
    ↓
Login Attempt (after approval)
    ↓
  verified = TRUE
    ↓
  Issue token
  Allow access
```

## 📊 Database Query Examples

### Create unverified user
```sql
INSERT INTO users (email, password, role, verified, ...)
VALUES ('company@example.com', '$2a$10$...', 'Company', FALSE, ...);
```

### Check login eligibility
```sql
SELECT * FROM users 
WHERE email = 'company@example.com' 
  AND role = 'Company'
  AND verified = TRUE;  -- Will return 0 rows if pending
```

### Get pending users (Admin)
```sql
SELECT id, email, role, organization, created_at
FROM users
WHERE verified = FALSE 
  AND role IN ('Company', 'Institute')
ORDER BY created_at DESC;
```

### Approve user
```sql
UPDATE users 
SET verified = TRUE 
WHERE id = 123;
```

### Reject user
```sql
DELETE FROM users 
WHERE id = 123 
  AND verified = FALSE;
```

## 🎓 Implementation Summary

**What Changed:**
- ✅ Database: Added `verified` column
- ✅ Registration: Set verified=FALSE for Company/Institute
- ✅ Registration: No token issued for pending users
- ✅ Login: Check verified status before allowing access
- ✅ Admin API: Endpoints to approve/reject
- ✅ Frontend: Pending approval UI
- ✅ Frontend: Clear error messages

**What Works:**
- ✅ Companies need approval to login
- ✅ Institutes need approval to login
- ✅ Admins can access immediately
- ✅ Students can access immediately
- ✅ Pending users get clear feedback
- ✅ Admins can approve/reject from dashboard

**Security:**
- ✅ No JWT token for unverified users
- ✅ Database-level verification check
- ✅ Admin-only approval endpoints
- ✅ JWT authentication required
- ✅ Role-based authorization enforced

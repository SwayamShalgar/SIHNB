# Testing the Admin Approval Flow

## ✅ What Was Implemented

The admin approval system is now **fully functional**! Here's what works:

### Backend (✅ Complete):
- Company/Institute registrations set `verified = FALSE`
- Login blocked for unverified accounts
- Admin API endpoints for approval/rejection
- Database schema with `verified` column

### Frontend (✅ Complete):
- Registration shows pending approval message
- Login shows clear error for pending accounts
- **Admin Dashboard now has Verification tab**
- Approve/Reject buttons functional

## 🧪 Step-by-Step Testing Guide

### Test 1: Register a New Institute Account

1. **Navigate to Registration:**
   ```
   http://localhost:3000/register
   ```

2. **Fill the form:**
   - Full Name: `Test Institute`
   - Email: `testinstitute@example.com`
   - Organization: `Test Institute Organization`
   - Phone: `1234567890`
   - Role: Select **Institute**
   - Password: `Test123456`
   - Confirm Password: `Test123456`

3. **Submit the form**

4. **Expected Result:**
   - ✅ Success screen appears
   - ✅ Message: "Your Institute account is pending admin approval"
   - ✅ "What happens next?" info box shown
   - ✅ "Go to Login" button visible
   - ❌ NO automatic login
   - ❌ NO token issued

### Test 2: Try to Login (Should Fail)

1. **Click "Go to Login" or navigate to:**
   ```
   http://localhost:3000/login
   ```

2. **Enter credentials:**
   - Email: `testinstitute@example.com`
   - Password: `Test123456`
   - Role: **Institute**

3. **Click Login**

4. **Expected Result:**
   - ❌ Login fails
   - 🔴 Error message: "Your Institute account is pending admin approval..."
   - ❌ NOT redirected to dashboard

### Test 3: Admin Views Pending Request

1. **Login as Admin:**
   ```
   Email: admin@example.com (use your admin email)
   Password: your_admin_password
   Role: Admin
   ```

2. **Navigate to Admin Dashboard:**
   - Should automatically redirect to `/admin-dashboard`

3. **Click on "Pending Verifications" tab:**
   - Located at the top below the welcome message
   - Shows badge with count if there are pending users

4. **Expected Result:**
   - ✅ See the Institute account in the table
   - ✅ Details visible:
     - User Details (name, email with avatar)
     - Role badge (Institute - blue)
     - Organization name
     - Phone number
     - Registration date/time
   - ✅ Two buttons: "✓ Approve" and "✗ Reject"

### Test 4: Admin Approves the Account

1. **In the Pending Verifications section:**
   - Click **"✓ Approve"** button for the Institute

2. **Confirm the approval:**
   - Popup appears: "Approve Test Institute? This will allow them to login."
   - Click **OK**

3. **Expected Result:**
   - ✅ Success alert: "Test Institute has been approved successfully!"
   - ✅ Institute disappears from pending list
   - ✅ If no more pending users, see "All Caught Up!" message

4. **Switch to "Dashboard Overview" tab:**
   - ✅ Total Institutes count increased by 1
   - ✅ Institute now appears in user management table

### Test 5: Institute Can Now Login

1. **Logout from Admin account**

2. **Navigate to Login:**
   ```
   http://localhost:3000/login
   ```

3. **Enter Institute credentials:**
   - Email: `testinstitute@example.com`
   - Password: `Test123456`
   - Role: **Institute**

4. **Click Login**

5. **Expected Result:**
   - ✅ Login successful!
   - ✅ Token received
   - ✅ Redirected to Institute Dashboard
   - ✅ Full access granted

### Test 6: Test Rejection Flow

1. **Register another Institute:**
   - Email: `rejecttest@example.com`
   - Full Name: `Reject Test Institute`
   - Password: `Test123456`
   - Role: **Institute**

2. **Login as Admin**

3. **Go to Pending Verifications tab**

4. **Click "✗ Reject" button**

5. **Confirm rejection:**
   - Popup: "Reject and delete Reject Test Institute? This action cannot be undone."
   - Click **OK**

6. **Expected Result:**
   - ✅ Success alert: "Reject Test Institute has been rejected and removed."
   - ✅ Account removed from pending list
   - ✅ Account deleted from database

7. **Try to login with rejected account:**
   - ❌ Should fail with "Invalid credentials"
   - ❌ User no longer exists in system

### Test 7: Test Company Registration

Repeat tests 1-5 but with **Company** role instead of Institute.

**Expected:** Same behavior - pending approval required.

### Test 8: Test Student Auto-Approval

1. **Register a Student account:**
   - Email: `student@example.com`
   - Full Name: `Test Student`
   - Password: `Test123456`
   - Role: **Student**

2. **Expected Result:**
   - ✅ Immediately logged in
   - ✅ Token received
   - ✅ Redirected to Student Dashboard
   - ✅ NO pending approval needed
   - ✅ NOT in pending verifications list

## 🎯 Verification Checklist

Use this checklist to verify all features:

### Registration Flow:
- [ ] Company registration → Pending status
- [ ] Institute registration → Pending status
- [ ] Student registration → Immediate login
- [ ] Admin registration → Immediate login
- [ ] Pending message shows for Company/Institute
- [ ] No token issued for pending accounts

### Login Flow:
- [ ] Unverified Company cannot login
- [ ] Unverified Institute cannot login
- [ ] Clear error message shown for pending accounts
- [ ] Verified accounts can login normally
- [ ] Student can login immediately after registration

### Admin Dashboard:
- [ ] "Pending Verifications" tab visible
- [ ] Badge count shows number of pending users
- [ ] Pending users table displays correctly
- [ ] User details (name, email, organization, phone) visible
- [ ] Role badges color-coded correctly
- [ ] Registration date/time shown

### Approval Actions:
- [ ] "Approve" button works
- [ ] Confirmation popup appears
- [ ] User disappears from pending list after approval
- [ ] User appears in main user list after approval
- [ ] Statistics update after approval
- [ ] User can login after approval

### Rejection Actions:
- [ ] "Reject" button works
- [ ] Confirmation popup appears
- [ ] Warning message about permanent deletion
- [ ] User removed from pending list
- [ ] User deleted from database
- [ ] Rejected user cannot login

### Empty States:
- [ ] "All Caught Up!" message when no pending users
- [ ] Green checkmark icon shown
- [ ] Proper messaging displayed

## 🐛 Common Issues & Solutions

### Issue: "No pending users showing in admin dashboard"

**Possible Causes:**
1. No Company/Institute accounts registered yet
2. All accounts already approved
3. Database missing `verified` column

**Solution:**
```sql
-- Check if verified column exists
SELECT column_name FROM information_schema.columns 
WHERE table_name='users' AND column_name='verified';

-- Add column if missing
ALTER TABLE users ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT TRUE;

-- Check for pending users
SELECT * FROM users WHERE verified = FALSE;
```

### Issue: "Institute still cannot login after approval"

**Solution:**
```sql
-- Check verified status in database
SELECT id, email, role, verified FROM users WHERE email = 'testinstitute@example.com';

-- Manually verify if needed
UPDATE users SET verified = TRUE WHERE email = 'testinstitute@example.com';
```

### Issue: "Student account showing as pending"

**Solution:**
Check the registration logic - Students should have `verified = TRUE` by default.

```javascript
// In server/routes/auth.js, verify this logic:
const requiresVerification = ['Company', 'Institute'].includes(role);
const verifiedStatus = !requiresVerification; // Should be TRUE for Student
```

### Issue: "Admin cannot see pending users tab"

**Solution:**
1. Clear browser cache
2. Hard refresh: `Ctrl + F5` (Windows) or `Cmd + Shift + R` (Mac)
3. Check browser console for errors
4. Verify admin token is valid

### Issue: "Approval/Reject buttons not working"

**Solution:**
1. Check browser console for errors
2. Verify backend is running: `http://localhost:5002`
3. Check admin token in localStorage
4. Verify API endpoints are accessible:
   ```
   GET http://localhost:5002/api/admin/pending-users
   POST http://localhost:5002/api/admin/approve-user/:id
   POST http://localhost:5002/api/admin/reject-user/:id
   ```

## 📊 Database Queries for Verification

### Check Pending Users:
```sql
SELECT id, email, role, full_name, organization, verified, created_at 
FROM users 
WHERE verified = FALSE 
  AND role IN ('Company', 'Institute')
ORDER BY created_at DESC;
```

### Check Verified Users:
```sql
SELECT id, email, role, full_name, verified 
FROM users 
WHERE verified = TRUE
ORDER BY created_at DESC;
```

### Manual Approval (if needed):
```sql
UPDATE users 
SET verified = TRUE 
WHERE id = 123; -- Replace with actual user ID
```

### Manual Rejection (if needed):
```sql
DELETE FROM users 
WHERE id = 123 AND verified = FALSE; -- Replace with actual user ID
```

### Check All Users by Role:
```sql
SELECT role, verified, COUNT(*) as count 
FROM users 
GROUP BY role, verified
ORDER BY role, verified;
```

## 🎉 Success Criteria

Your implementation is successful if:

✅ **Registration:**
- Company/Institute see pending message
- Student/Admin login immediately
- No tokens for unverified accounts

✅ **Login:**
- Unverified accounts blocked
- Clear error messages
- Verified accounts work normally

✅ **Admin Dashboard:**
- Pending tab visible with count badge
- All pending users listed
- User details displayed correctly

✅ **Approval:**
- Approve button works
- User can login after approval
- User appears in main list
- Statistics update

✅ **Rejection:**
- Reject button works
- User deleted from system
- Cannot login after rejection

✅ **Security:**
- No JWT tokens for unverified users
- Database-level verification check
- Admin-only access to approval endpoints

## 🚀 Next Steps

After testing, you can:

1. **Add Email Notifications:**
   - Send email when account registered (pending)
   - Send email when approved
   - Send email when rejected with reason

2. **Add Rejection Reasons:**
   - Admin can provide reason for rejection
   - Store in database or send via email
   - User can see reason

3. **Add Bulk Actions:**
   - Select multiple pending users
   - Approve/reject all selected
   - Useful for high volume

4. **Add Search/Filter in Pending Tab:**
   - Search by email, name, organization
   - Filter by role (Company/Institute)
   - Sort by registration date

5. **Add Approval Analytics:**
   - Track approval/rejection rates
   - Average approval time
   - Pending users by date chart

## 📝 Test Results Template

Use this to document your test results:

```
Test Date: __________
Tester: __________

✅ = Pass  ❌ = Fail  ⚠️ = Partial

[ ] Test 1: Institute Registration (Pending)
[ ] Test 2: Institute Login (Blocked)
[ ] Test 3: Admin Views Pending Request
[ ] Test 4: Admin Approves Account
[ ] Test 5: Institute Can Login After Approval
[ ] Test 6: Admin Rejects Account
[ ] Test 7: Company Registration (Pending)
[ ] Test 8: Student Auto-Approval

Issues Found:
_______________________________________
_______________________________________
_______________________________________

Notes:
_______________________________________
_______________________________________
_______________________________________
```

---

**Need Help?** Check:
1. Browser console for errors
2. Server terminal for backend errors
3. Database for user records
4. Network tab for API responses

**Good luck testing! 🎉**

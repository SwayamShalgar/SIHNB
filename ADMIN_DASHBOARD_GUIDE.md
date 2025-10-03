# Admin Dashboard Guide

## Overview
The Admin Dashboard displays all users from the PostgreSQL (Neon) database in a comprehensive management interface.

## Database Status
✅ **PostgreSQL Database**: Connected and populated
✅ **Users Table**: Initialized with test data
✅ **Certificates Table**: Initialized and ready

## Current Users in Database

### Total Users: 18
- **1 Admin**
- **4 Institutes** 
- **8 Students**
- **5 Companies**

### Admin Users
1. **System Administrator**
   - Email: admin@certify.com
   - Password: admin123
   - Organization: Certify Platform

### Institute Users
1. **University Admin**
   - Email: institute@university.edu
   - Organization: Global University
   
2. **MIT Admin**
   - Email: admin@mit.edu
   - Organization: Massachusetts Institute of Technology
   
3. **Stanford Admin**
   - Email: admin@stanford.edu
   - Organization: Stanford University
   
4. **Harvard Admin**
   - Email: admin@harvard.edu
   - Organization: Harvard University

### Student Users
1. **John Doe**
   - Email: student@university.edu
   - Organization: Global University
   
2. **Jane Smith**
   - Email: jane.smith@student.edu
   - Organization: MIT
   
3. **Michael Brown**
   - Email: michael.brown@student.edu
   - Organization: Stanford University
   
4. **Sarah Wilson**
   - Email: sarah.wilson@student.edu
   - Organization: Harvard University
   
5. **David Lee**
   - Email: david.lee@student.edu
   - Organization: Global University
   
6. **Emily Davis**
   - Email: emily.davis@student.edu
   - Organization: MIT
   
7. **Robert Johnson**
   - Email: robert.johnson@student.edu
   - Organization: Stanford University
   
8. **Lisa Anderson**
   - Email: lisa.anderson@student.edu
   - Organization: Harvard University

### Company Users
1. **HR Manager**
   - Email: hr@company.com
   - Organization: Tech Corporation
   
2. **Google HR**
   - Email: hr@google.com
   - Organization: Google Inc.
   
3. **Microsoft HR**
   - Email: hr@microsoft.com
   - Organization: Microsoft Corporation
   
4. **Amazon HR**
   - Email: hr@amazon.com
   - Organization: Amazon.com Inc.
   
5. **Apple HR**
   - Email: hr@apple.com
   - Organization: Apple Inc.

## How to Access Admin Dashboard

1. **Open the application** in your browser: http://localhost:3001 (or port shown in terminal)

2. **Login as Admin**:
   - Email: `admin@certify.com`
   - Password: `admin123`
   - Role: Admin

3. **You will see**:
   - **Stats Cards** at the top showing:
     - Total Students: 8
     - Total Institutes: 4
     - Total Companies: 5
     - Total Certificates: (based on issued certificates)
   
   - **User Management Section** with:
     - Search box to filter users
     - Role filter buttons (All, Student, Institute, Company)
     - Users table displaying all 18 users with:
       - Avatar (first letter of name)
       - Full name and email
       - Role badge (color-coded)
       - Organization
       - Join date
       - Action buttons (View/Delete)
   
   - **Recent Activity Section** showing:
     - Latest certificate issuances
     - User activity feed

4. **Features Available**:
   - ✅ Search users by name, email, or organization
   - ✅ Filter users by role
   - ✅ View individual user details and certificates
   - ✅ Delete users (with confirmation)
   - ✅ Mobile responsive design

## API Endpoints Used

The admin dashboard fetches data from these endpoints:

1. `GET /api/admin/users` - Fetches all users from PostgreSQL
2. `GET /api/admin/stats` - Fetches statistics by role
3. `GET /api/admin/activity/:email` - Fetches user-specific activity
4. `DELETE /api/admin/users/:id` - Deletes a user
5. `PATCH /api/admin/users/:id/role` - Updates user role

All endpoints are protected with JWT authentication and require Admin role.

## Testing the Dashboard

### Test Scenario 1: View All Users
1. Login as admin
2. You should see 18 total users in the table
3. Stats should show: 8 Students, 4 Institutes, 5 Companies

### Test Scenario 2: Search Functionality
1. Type "MIT" in search box
2. Should filter to show only MIT-related users (Jane Smith, Emily Davis, MIT Admin)
3. Type "Google" to see only Google HR

### Test Scenario 3: Role Filtering
1. Click "Student" filter button
2. Should show only 8 students
3. Click "Institute" to see 4 institutes
4. Click "Company" to see 5 companies
5. Click "All" to see all 18 users

### Test Scenario 4: View User Activity
1. Click the eye icon on any user
2. Modal should open showing user details
3. Should display user's certificates (if any)

### Test Scenario 5: Delete User (Optional)
1. Click trash icon on a test user
2. Confirm deletion
3. User should be removed from the list
4. Stats should update accordingly

## Troubleshooting

### Users Not Showing?
- Check if server is running on port 5002
- Check browser console for API errors
- Verify JWT token is valid
- Ensure you're logged in as Admin

### Database Connection Issues?
- Verify PostgreSQL connection in server logs
- Check if seedUsers.js ran successfully
- Confirm users exist in database

### Page Not Loading?
- Clear browser cache
- Check if client is running (npm start)
- Verify proxy configuration in package.json

## Default Test Password
All test users use these default passwords:
- Admin: `admin123`
- Institutes: `institute123`
- Students: `student123`
- Companies: `company123`

---

**Last Updated**: October 3, 2025
**Database**: Neon PostgreSQL
**Total Users Seeded**: 18 (1 Admin + 4 Institutes + 8 Students + 5 Companies)

# Profile Feature Documentation

## Overview

This document describes the implementation of the user profile feature that allows logged-in users to view and edit their profile information from the navigation bar.

## Implementation Date

December 2024

---

## Features Implemented

### 1. Profile Page Component

**File**: `/client/src/pages/Profile.js`

A comprehensive profile management page with:

- **View Mode**: Display user information in a clean, read-only format
- **Edit Mode**: Allow users to update their personal information
- **Validation**: Full form validation using the existing validation utility
- **Security**: Protected route requiring authentication
- **Responsive Design**: Mobile-friendly layout

#### User Information Displayed

1. **Personal Information**

   - Full Name (editable)
   - Email Address (editable)
   - Phone Number (editable, optional)
   - Organization (editable, optional)

2. **Account Information**
   - Account Type (read-only, shown as colored badge)
   - Member Since (read-only, formatted date)

#### Features

- ✅ Profile avatar with user icon
- ✅ Role-based badge styling
- ✅ Edit/Save/Cancel functionality
- ✅ Real-time form validation
- ✅ Success/Error message display
- ✅ Field-specific error messages
- ✅ Loading states during updates
- ✅ Automatic redirect to login if not authenticated
- ✅ Back navigation button

---

### 2. Profile Styling

**File**: `/client/src/styles/Profile.css`

Professional styling with:

- **Gradient Background**: Purple gradient matching the app theme
- **Card Layout**: Clean white card with shadow
- **Header Section**: Purple gradient header with avatar
- **Role Badges**: Color-coded by role type
  - Admin: Red
  - Institute: Blue
  - Student: Green
  - Company: Orange
- **Form Styling**: Consistent with other forms in the app
- **Button Styles**: Edit (gradient), Save (green), Cancel (gray)
- **Responsive Design**: Mobile-optimized layout

---

### 3. Navigation Bar Integration

**File**: `/client/src/pages/LandingPage.js`

Added Profile button to the navbar:

- **Position**: Between Dashboard and Logout buttons
- **Icon**: UserCircle icon from lucide-react
- **Styling**: Blue outline button with hover effects
- **Visibility**: Only shown for authenticated users
- **Action**: Navigates to `/profile` route

#### Button Styling

**File**: `/client/src/styles/LandingPage.css`

`.btn-profile-nav` class with:

- Blue outline style
- Hover effect (fills with blue, white text)
- Smooth transitions
- Responsive sizing for mobile devices

---

### 4. Routing Configuration

**File**: `/client/src/App.js`

Added profile route:

```javascript
<Route path="/profile" element={<Profile />} />
```

---

### 5. Authentication Context Enhancement

**File**: `/client/src/context/AuthContext.js`

Added `updateUser` function:

- **Purpose**: Update user data in context and localStorage
- **Usage**: Called after successful profile update
- **Benefits**: Keeps UI in sync with updated user data

```javascript
const updateUser = (userData) => {
  setUser(userData);
  localStorage.setItem("user", JSON.stringify(userData));
};
```

---

### 6. Backend API Endpoint

**File**: `/server/routes/auth.js`

Added profile update endpoint:

**Route**: `PUT /api/auth/profile`

**Authentication**: Required (JWT token)

**Request Body**:

```json
{
  "full_name": "string (required)",
  "email": "string (required)",
  "phone": "string (optional)",
  "organization": "string (optional)"
}
```

**Response (Success)**:

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": "number",
    "email": "string",
    "role": "string",
    "full_name": "string",
    "organization": "string",
    "phone": "string",
    "created_at": "timestamp"
  }
}
```

**Response (Error)**:

```json
{
  "error": "Error message"
}
```

**Validations**:

- ✅ Full name and email are required
- ✅ Email uniqueness check (prevents duplicate emails)
- ✅ User authentication check
- ✅ Updates timestamp automatically

---

## Validation Rules

The profile form uses the existing validation utility (`/client/src/utils/validation.js`):

### Full Name

- **Pattern**: Letters, spaces, hyphens, apostrophes only
- **Length**: 2-100 characters
- **Error Messages**: Field-specific feedback

### Email

- **Pattern**: Enhanced email regex with 10+ checks
- **Validation**:
  - Valid domain
  - No consecutive dots
  - Valid characters
  - Proper start/end characters
- **Uniqueness**: Checked against database

### Phone (Optional)

- **Pattern**: 10 digits (Indian format)
- **Format**: Numbers only
- **Error Messages**: Clear formatting guidance

### Organization (Optional)

- **Pattern**: Letters, numbers, spaces, hyphens, apostrophes
- **Length**: 2-100 characters
- **Error Messages**: Descriptive feedback

---

## User Experience Flow

### Viewing Profile

1. User clicks "Profile" button in navbar
2. Redirected to `/profile` route
3. Profile page displays user information in read-only format
4. User sees their:
   - Avatar
   - Full name
   - Role badge
   - Personal information
   - Account information

### Editing Profile

1. User clicks "Edit Profile" button
2. Form fields become editable
3. User modifies desired fields
4. Real-time validation on input change
5. Field-specific errors shown immediately

### Saving Changes

1. User clicks "Save Changes" button
2. Form validation runs
3. If valid:
   - API request sent to server
   - Loading state shown
   - Server validates and updates database
   - Success message displayed
   - Context updated with new user data
   - Form returns to read-only mode
4. If invalid:
   - Error message displayed
   - Field-specific errors highlighted

### Canceling Edit

1. User clicks "Cancel" button
2. Form data reset to original values
3. All errors cleared
4. Returns to read-only mode

---

## Security Features

1. **Authentication Required**

   - Page redirects to login if user not authenticated
   - Uses `isAuthenticated()` check from AuthContext

2. **JWT Token Validation**

   - All API requests include JWT token
   - Server validates token before processing
   - Uses `authenticateToken` middleware

3. **Email Uniqueness**

   - Server checks if email is already taken
   - Prevents duplicate email addresses
   - User can keep their own email

4. **Input Sanitization**

   - All inputs sanitized using `sanitizeInput()` function
   - Prevents XSS attacks
   - Removes potentially harmful characters

5. **Server-Side Validation**
   - Double validation (client + server)
   - Required fields enforced
   - Data integrity maintained

---

## Responsive Design

### Desktop (>1024px)

- Full navbar with all buttons
- Wide profile card (800px max-width)
- Side-by-side action buttons
- Large avatar (120px)
- Full font sizes

### Tablet (768px - 1024px)

- Adjusted button sizes
- Responsive padding
- Maintained layout structure

### Mobile (<768px)

- Smaller profile card
- Stacked action buttons (full width)
- Smaller avatar (100px)
- Reduced padding
- Compact header
- Touch-friendly buttons

---

## File Changes Summary

### New Files Created

1. `/client/src/pages/Profile.js` (355 lines)

   - Profile page component

2. `/client/src/styles/Profile.css` (474 lines)
   - Profile page styling

### Modified Files

1. `/client/src/context/AuthContext.js`

   - Added `updateUser` function
   - Exported in value object

2. `/client/src/App.js`

   - Added Profile import
   - Added `/profile` route

3. `/client/src/pages/LandingPage.js`

   - Added UserCircle icon import
   - Added Profile button in navbar
   - Positioned between Dashboard and Logout

4. `/client/src/styles/LandingPage.css`

   - Added `.btn-profile-nav` styling
   - Updated responsive CSS sections
   - Added profile button to media queries

5. `/server/routes/auth.js`
   - Added `PUT /api/auth/profile` endpoint
   - Profile update logic with validation
   - Email uniqueness check

---

## Testing Checklist

### Frontend Testing

- [ ] Profile page loads correctly
- [ ] User data displays properly
- [ ] Edit mode activates on button click
- [ ] Form validation works for all fields
- [ ] Error messages display correctly
- [ ] Save functionality updates data
- [ ] Cancel button resets form
- [ ] Success message shows after save
- [ ] Profile button visible in navbar
- [ ] Navigation works correctly
- [ ] Responsive design on mobile
- [ ] Back button works
- [ ] Redirects to login if not authenticated

### Backend Testing

- [ ] Profile update endpoint works
- [ ] Email uniqueness validation works
- [ ] Required field validation works
- [ ] JWT authentication works
- [ ] Database updates correctly
- [ ] Error handling works
- [ ] Response format correct

### Integration Testing

- [ ] End-to-end profile update flow
- [ ] Context updates after save
- [ ] UI reflects updated data
- [ ] Logout and login preserves changes
- [ ] Multiple users can update profiles
- [ ] Email change updates login

---

## Known Limitations

1. **Password Change**: Not included in this feature (separate feature recommended)
2. **Profile Picture**: Not implemented (uses icon avatar)
3. **Email Verification**: Email changes don't require verification
4. **Role Change**: Role cannot be changed by user (security)
5. **Account Deletion**: Not included (separate feature)

---

## Future Enhancements

### Potential Features

1. **Password Change**: Separate section with current/new password
2. **Profile Picture Upload**: Image upload and cropping
3. **Email Verification**: Send verification email on email change
4. **Activity Log**: Show recent account activity
5. **Privacy Settings**: Control what information is visible
6. **Two-Factor Authentication**: Add 2FA setup
7. **Connected Accounts**: Link social accounts
8. **Notification Preferences**: Email notification settings
9. **Account Deletion**: Self-service account deletion
10. **Profile Completeness**: Progress bar showing profile completion

---

## Dependencies

### Client-Side

- `react` (18.2.0)
- `react-router-dom` (routing)
- `lucide-react` (icons)
- `axios` (HTTP requests)

### Server-Side

- `express` (web framework)
- `jsonwebtoken` (JWT authentication)
- `pg` (PostgreSQL client)

### Utilities

- `/client/src/utils/validation.js` (form validation)
- `/client/src/context/AuthContext.js` (authentication)
- `/server/middleware/auth.js` (JWT middleware)

---

## API Documentation

### Update Profile Endpoint

**URL**: `/api/auth/profile`

**Method**: `PUT`

**Headers**:

```
Authorization: Bearer <JWT_TOKEN>
Content-Type: application/json
```

**Request Body**:

```json
{
  "full_name": "John Doe",
  "email": "john.doe@example.com",
  "phone": "9876543210",
  "organization": "Tech University"
}
```

**Success Response** (200 OK):

```json
{
  "success": true,
  "message": "Profile updated successfully",
  "user": {
    "id": 1,
    "email": "john.doe@example.com",
    "role": "Student",
    "full_name": "John Doe",
    "organization": "Tech University",
    "phone": "9876543210",
    "created_at": "2024-01-15T10:30:00.000Z"
  }
}
```

**Error Responses**:

400 Bad Request:

```json
{
  "error": "Full name and email are required"
}
```

400 Bad Request (Duplicate Email):

```json
{
  "error": "Email is already taken by another user"
}
```

401 Unauthorized:

```json
{
  "error": "Unauthorized"
}
```

404 Not Found:

```json
{
  "error": "User not found"
}
```

500 Internal Server Error:

```json
{
  "error": "Failed to update profile"
}
```

---

## Code Examples

### Using Profile Navigation

```javascript
// In any component with navigation
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navigate to profile
const goToProfile = () => {
  navigate("/profile");
};
```

### Updating User Context

```javascript
// In Profile.js after successful update
import { useAuth } from "../context/AuthContext";

const { updateUser } = useAuth();

// After API call succeeds
updateUser(response.data.user);
```

### Role Badge Styling

```javascript
// Dynamic role badge class
const getRoleBadgeClass = (role) => {
  const roleClasses = {
    Admin: "role-badge-admin", // Red
    Institute: "role-badge-institute", // Blue
    Student: "role-badge-student", // Green
    Company: "role-badge-company", // Orange
  };
  return roleClasses[role] || "role-badge-default";
};
```

---

## Troubleshooting

### Profile Page Not Loading

- **Issue**: Blank page or error
- **Solution**: Check if user is authenticated, verify routing

### Update Not Saving

- **Issue**: Form submits but data doesn't update
- **Solution**: Check JWT token, verify API endpoint, check network tab

### Email Already Taken Error

- **Issue**: Cannot save even with own email
- **Solution**: Check server logic excludes current user ID

### Validation Errors

- **Issue**: Form shows errors even with valid data
- **Solution**: Check validation regex patterns, verify field names

### Context Not Updating

- **Issue**: UI doesn't reflect changes after save
- **Solution**: Verify `updateUser` is called, check localStorage

---

## Conclusion

The profile feature provides a complete user profile management system with:

- ✅ Secure authentication
- ✅ Comprehensive validation
- ✅ Professional UI/UX
- ✅ Responsive design
- ✅ Backend integration
- ✅ Error handling
- ✅ Context management

This feature enhances the application by allowing users to maintain accurate profile information, which is essential for certificate issuance and verification processes.

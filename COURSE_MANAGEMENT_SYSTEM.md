# Course Management System - Complete Documentation

## 📚 Overview

The Course Management System allows institutes to create, manage, and use courses when issuing certificates. This ensures standardization and reduces errors by eliminating manual course name entry.

**Created:** December 2024
**Status:** ✅ Fully Implemented and Ready to Use

---

## 🎯 Features Implemented

### 1. **Database Structure**

- Courses table already exists in PostgreSQL (Neon Database)
- Complete schema with all necessary fields:
  - **Basic Info:** id, institute_id, course_code, course_name
  - **Details:** course_description, duration, duration_unit, level, category
  - **Academic:** credits, instructor_name, department
  - **Learning:** prerequisites, learning_outcomes
  - **Status:** status (active/inactive), created_at, updated_at
- Foreign key relationship with users table (institute_id)
- Indexes for performance optimization

### 2. **Backend API Routes** (`/server/routes/courses.js`)

All CRUD operations fully implemented:

#### Get All Courses for Institute

```http
GET /api/courses/institute/:instituteId
```

- Returns all courses for a specific institute
- Sorted by creation date (newest first)
- Dual database support (PostgreSQL primary, SQLite fallback)

#### Get Single Course

```http
GET /api/courses/:id
```

- Returns detailed information for a specific course
- 404 error if course not found

#### Create New Course

```http
POST /api/courses
```

**Required Fields:**

- institute_id
- course_code
- course_name

**Optional Fields:**

- course_description
- duration, duration_unit (weeks/months/years/hours)
- level (Beginner/Intermediate/Advanced)
- category
- credits
- instructor_name
- department
- prerequisites
- learning_outcomes
- status (active/inactive)

**Response:**

```json
{
  "success": true,
  "message": "Course created successfully",
  "course": {
    /* course object */
  }
}
```

#### Update Course

```http
PUT /api/courses/:id
```

- Updates existing course
- Same fields as create
- Returns updated course object

#### Delete Course

```http
DELETE /api/courses/:id
```

- Permanently deletes course
- Returns success confirmation

#### Get All Active Courses

```http
GET /api/courses
```

- Returns all active courses
- Sorted by course name
- Used for dropdown selections

---

## 🎨 Frontend Components

### 1. **ManageCourses Page** (`/client/src/pages/ManageCourses.js`)

**Route:** `/manage-courses`

**Features:**

- ✅ Create new courses with comprehensive form
- ✅ Edit existing courses
- ✅ Delete courses (with confirmation)
- ✅ Toggle course status (active/inactive)
- ✅ Search courses by name, code, category, or instructor
- ✅ Filter by status (all/active/inactive)
- ✅ Beautiful card-based grid layout
- ✅ Responsive design for all devices
- ✅ Modal-based create/edit forms
- ✅ Real-time search and filtering

**Access Control:**

- Only accessible to users with `role === 'institute'`
- Automatically redirects non-institute users to dashboard

**UI Components:**

- Header with page title and "Create Course" button
- Search bar and status filter
- Course cards displaying:
  - Course code badge
  - Status badge (active/inactive)
  - Course name and description
  - Category, level, duration, credits
  - Instructor and department info
  - Action buttons (Edit, Activate/Deactivate, Delete)
- Modal form for creating/editing courses

### 2. **Updated IssueCertificate Page** (`/client/src/pages/IssueCertificate.js`)

**Course Selection Features:**

- ✅ Searchable dropdown of institute's courses
- ✅ Search by course name, code, or category
- ✅ Displays course details (code, name, category, level, duration)
- ✅ Clear selection button
- ✅ Automatic course name population when selected
- ✅ Validation to ensure course is selected

**How It Works:**

1. Fetches all courses for logged-in institute on page load
2. User searches/selects course from dropdown
3. Course name is automatically filled in form
4. Certificate is issued with selected course name

### 3. **Updated InstituteDashboard** (`/client/src/pages/InstituteDashboard.js`)

**New Action Card:**

- Added "Manage Courses" card with green gradient
- Icon: BookOpen
- Click navigates to `/manage-courses`
- Positioned between "Issue Certificate" and "View All Certificates"

**Card Layout (4 cards now):**

1. Issue New Certificate (Purple)
2. **Manage Courses (Green)** ← NEW
3. View All Certificates (Orange)
4. Verify Certificate (Blue)

---

## 📁 File Structure

```
SIHNB/
├── server/
│   ├── routes/
│   │   └── courses.js              ✅ Complete API routes
│   ├── database/
│   │   └── postgres.js             ✅ Courses table schema
│   └── index.js                    ✅ Route registered
│
├── client/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── ManageCourses.js    ✅ NEW - Course management UI
│   │   │   ├── IssueCertificate.js ✅ Updated with course dropdown
│   │   │   └── InstituteDashboard.js ✅ Added "Manage Courses" card
│   │   ├── styles/
│   │   │   ├── ManageCourses.css   ✅ NEW - Course management styles
│   │   │   └── InstituteDashboard.css ✅ Updated with quaternary card
│   │   └── App.js                  ✅ Added /manage-courses route
│
└── COURSE_MANAGEMENT_SYSTEM.md     ✅ This documentation
```

---

## 🚀 How to Use

### For Institutes:

#### 1. **Create Courses**

1. Login as Institute user
2. Go to Institute Dashboard
3. Click "Manage Courses" card
4. Click "Create Course" button
5. Fill in course details:
   - **Required:** Course Code, Course Name
   - **Optional:** Description, duration, level, category, etc.
6. Click "Create Course"
7. Course is saved to database

#### 2. **Manage Existing Courses**

- **Edit:** Click "Edit" button on any course card
- **Activate/Deactivate:** Toggle course status
- **Delete:** Click "Delete" (confirms before deleting)
- **Search:** Use search bar to find courses
- **Filter:** Use status dropdown to filter by active/inactive

#### 3. **Issue Certificates with Courses**

1. Go to "Issue New Certificate"
2. In "Select Course" field, start typing
3. See dropdown with matching courses
4. Click on desired course
5. Course name is automatically filled
6. Complete other fields and submit

---

## 🔧 Technical Details

### Database Operations

**Dual Database Strategy:**

- Primary: PostgreSQL (Neon) - Cloud database
- Fallback: SQLite - Local backup
- All operations try PostgreSQL first, then SQLite if needed
- Ensures high availability

### API Endpoints Summary

| Method | Endpoint                     | Purpose                       |
| ------ | ---------------------------- | ----------------------------- |
| GET    | `/api/courses/institute/:id` | Get all courses for institute |
| GET    | `/api/courses/:id`           | Get single course details     |
| GET    | `/api/courses`               | Get all active courses        |
| POST   | `/api/courses`               | Create new course             |
| PUT    | `/api/courses/:id`           | Update existing course        |
| DELETE | `/api/courses/:id`           | Delete course                 |

### Security Features

- Institute ID automatically added from logged-in user
- Only institutes can access course management pages
- Automatic redirect for unauthorized access
- Validation on required fields

---

## 🎨 UI/UX Features

### ManageCourses Page

- **Color Scheme:** Purple gradient matching app theme
- **Cards:** 3-column grid (responsive to 1 column on mobile)
- **Status Indicators:** Green (active) / Red (inactive) badges
- **Search:** Real-time filtering as you type
- **Empty States:** Helpful messages when no courses found
- **Loading States:** Spinner while fetching data
- **Modal Form:** Smooth overlay for create/edit
- **Responsive:** Works perfectly on all screen sizes

### Course Selection in IssueCertificate

- **Smart Dropdown:** Shows course code, name, category, level, duration
- **Search:** Finds courses by any visible field
- **Clear Button:** Remove selection with X icon
- **Visual Feedback:** Selected course highlighted
- **No Courses Message:** Helpful text when search returns nothing

---

## ✅ Verification Checklist

- [x] Courses table exists in database
- [x] All API routes implemented and working
- [x] Routes registered in server/index.js
- [x] ManageCourses page created
- [x] ManageCourses CSS created
- [x] Route added to App.js
- [x] InstituteDashboard updated with "Manage Courses" button
- [x] InstituteDashboard CSS updated with quaternary card styles
- [x] IssueCertificate page already has course dropdown (was already implemented)
- [x] All CRUD operations tested
- [x] Dual database support working
- [x] Access control implemented
- [x] Responsive design working
- [x] Documentation complete

---

## 🧪 Testing Guide

### Test Course Creation:

1. Login as Institute user
2. Go to Manage Courses
3. Click "Create Course"
4. Fill in:
   - Course Code: "CS101"
   - Course Name: "Introduction to Computer Science"
   - Category: "Computer Science"
   - Level: "Beginner"
   - Duration: "12" / "weeks"
5. Click "Create Course"
6. ✅ Should see success message
7. ✅ Should see new course in list

### Test Course Search:

1. Create multiple courses with different names
2. Use search bar to search by:
   - Course name
   - Course code
   - Category
   - Instructor name
3. ✅ Should see filtered results in real-time

### Test Certificate Issuance with Course:

1. Go to Issue Certificate page
2. Click in "Select Course" field
3. Start typing course name
4. ✅ Should see dropdown with matching courses
5. Click on a course
6. ✅ Course name should auto-fill
7. Complete form and submit
8. ✅ Certificate should be issued successfully

---

## 🎯 Benefits

### For Institutes:

1. **Standardization:** All course names are consistent
2. **No Typos:** Selecting from dropdown eliminates spelling errors
3. **Efficiency:** No need to retype course names
4. **Organization:** All courses in one place
5. **Reusability:** Create once, use multiple times

### For System:

1. **Data Integrity:** Consistent course information
2. **Better Reporting:** Accurate course statistics
3. **Scalability:** Easy to add more course metadata
4. **Flexibility:** Can extend with more features later

---

## 🔜 Future Enhancements (Optional)

Possible additions for future:

- [ ] Bulk course upload via CSV
- [ ] Course templates for common courses
- [ ] Course analytics (how many certificates per course)
- [ ] Course archiving (soft delete instead of hard delete)
- [ ] Course cloning (duplicate existing course)
- [ ] Course categories management
- [ ] Department management
- [ ] Instructor database

---

## 📊 Summary

✅ **Fully Implemented Features:**

- Complete database schema
- Full CRUD API routes
- Beautiful course management interface
- Search and filter functionality
- Course selection in certificate issuance
- Responsive design
- Access control

✅ **Files Created/Modified:**

- Created: ManageCourses.js (517 lines)
- Created: ManageCourses.css (461 lines)
- Created: COURSE_MANAGEMENT_SYSTEM.md (this file)
- Modified: App.js (added route and import)
- Modified: InstituteDashboard.js (added Manage Courses card)
- Modified: InstituteDashboard.css (added quaternary card styles)

✅ **Ready to Use:**
The course management system is 100% complete and ready for production use. All features are working, tested, and integrated with the existing certificate issuance system.

---

**Last Updated:** December 2024
**Status:** ✅ Complete & Production Ready

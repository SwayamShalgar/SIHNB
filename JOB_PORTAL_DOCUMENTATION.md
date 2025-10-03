# Job Portal System Documentation

## Overview
Complete job recruitment platform integrated into the certificate management system, connecting students with companies for job opportunities.

---

## Database Schema

### Tables Created

#### 1. `student_profiles`
Stores student profile information with visibility control.

```sql
CREATE TABLE student_profiles (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  skills TEXT[],
  cgpa DECIMAL(3,2),
  graduation_year INTEGER,
  degree VARCHAR(255),
  specialization VARCHAR(255),
  bio TEXT,
  visible_to_companies BOOLEAN DEFAULT TRUE,
  resume_url TEXT,
  linkedin_url TEXT,
  github_url TEXT,
  portfolio_url TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_student_profiles_user ON student_profiles(user_id);
CREATE INDEX idx_student_profiles_visible ON student_profiles(visible_to_companies);
CREATE INDEX idx_student_profiles_cgpa ON student_profiles(cgpa);
```

#### 2. `job_postings`
Company job listings with requirements.

```sql
CREATE TABLE job_postings (
  id SERIAL PRIMARY KEY,
  company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  job_title VARCHAR(255) NOT NULL,
  job_description TEXT NOT NULL,
  job_type VARCHAR(50),
  location VARCHAR(255),
  salary_range VARCHAR(100),
  required_skills TEXT[],
  min_cgpa DECIMAL(3,2),
  experience_required VARCHAR(100),
  application_deadline DATE NOT NULL,
  status VARCHAR(50) DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_job_postings_company ON job_postings(company_id);
CREATE INDEX idx_job_postings_status ON job_postings(status);
CREATE INDEX idx_job_postings_deadline ON job_postings(application_deadline);
```

#### 3. `job_applications`
Tracks student applications to jobs.

```sql
CREATE TABLE job_applications (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES job_postings(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT,
  status VARCHAR(50) DEFAULT 'pending',
  applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(job_id, student_id)
);
CREATE INDEX idx_job_applications_job ON job_applications(job_id);
CREATE INDEX idx_job_applications_student ON job_applications(student_id);
CREATE INDEX idx_job_applications_status ON job_applications(status);
```

#### 4. `job_offers`
Tracks company offers to students.

```sql
CREATE TABLE job_offers (
  id SERIAL PRIMARY KEY,
  job_id INTEGER REFERENCES job_postings(id) ON DELETE CASCADE,
  student_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  company_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  offer_letter TEXT,
  salary_offered VARCHAR(100),
  joining_date DATE,
  status VARCHAR(50) DEFAULT 'pending',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  responded_at TIMESTAMP,
  UNIQUE(job_id, student_id)
);
CREATE INDEX idx_job_offers_student ON job_offers(student_id);
CREATE INDEX idx_job_offers_company ON job_offers(company_id);
CREATE INDEX idx_job_offers_status ON job_offers(status);
```

---

## Backend API Routes

### Job Routes (`/api/jobs`)

#### **Public/Student Routes**

**GET /api/jobs/postings**
- Get all active job postings
- Query params: `search`, `location`, `jobType`, `minSalary`
- Auth: Required (Student/All)
- Returns: List of active jobs with company details

**GET /api/jobs/postings/:id**
- Get single job posting details
- Auth: Required
- Returns: Job details with company information

**POST /api/jobs/apply/:jobId**
- Apply for a job
- Auth: Required (Student only)
- Body: `{ cover_letter: string }`
- Validates:
  - Job exists and is active
  - Not already applied
  - Student profile is visible to companies
- Returns: Application confirmation

**GET /api/jobs/my-applications**
- Get student's job applications
- Auth: Required (Student only)
- Returns: List of applications with job and company details

**DELETE /api/jobs/applications/:id**
- Withdraw application
- Auth: Required (Student only)
- Returns: Confirmation

#### **Company Routes**

**POST /api/jobs/postings**
- Create new job posting
- Auth: Required (Company only)
- Body:
```json
{
  "job_title": "string",
  "job_description": "string",
  "job_type": "Full-Time|Part-Time|Contract|Internship",
  "location": "string",
  "salary_range": "string",
  "required_skills": "comma,separated,skills",
  "min_cgpa": "number",
  "experience_required": "string",
  "application_deadline": "YYYY-MM-DD"
}
```

**GET /api/jobs/my-postings**
- Get company's job postings with application counts
- Auth: Required (Company only)
- Returns: Company's jobs with application statistics

**PUT /api/jobs/postings/:id**
- Update job posting
- Auth: Required (Company only, ownership verified)
- Body: Same as POST (all fields optional)

**DELETE /api/jobs/postings/:id**
- Delete job posting
- Auth: Required (Company only, ownership verified)

**GET /api/jobs/postings/:jobId/applications**
- Get applications for a specific job
- Auth: Required (Company only, ownership verified)
- Returns: Applications with student profiles, CGPA, skills, certificates

**PATCH /api/jobs/applications/:id/status**
- Update application status
- Auth: Required (Company only)
- Body: `{ status: "pending|shortlisted|interviewing|rejected" }`

**GET /api/jobs/candidates/search**
- Search and filter candidates
- Auth: Required (Company only)
- Query params:
  - `skills`: comma-separated skills
  - `minCgpa`: minimum CGPA
  - `graduationYear`: graduation year
  - `degree`: degree name
  - `hasCertificates`: true/false
- Returns: Filtered students with profiles visible to companies

#### **Job Offers Routes**

**POST /api/jobs/offers/send**
- Send job offer to candidate
- Auth: Required (Company only)
- Body:
```json
{
  "job_id": "number",
  "student_id": "number",
  "offer_letter": "string",
  "salary_offered": "string",
  "joining_date": "YYYY-MM-DD"
}
```

**GET /api/jobs/my-offers** (Student)
- Get student's job offers
- Auth: Required (Student only)
- Returns: Offers with job and company details

**GET /api/jobs/company-offers** (Company)
- Get company's sent offers
- Auth: Required (Company only)
- Returns: All offers sent by company

**PATCH /api/jobs/offers/:id/respond**
- Student responds to job offer
- Auth: Required (Student only)
- Body: `{ status: "accepted|rejected" }`

---

### Student Profile Routes (`/api/students`)

**GET /api/students/profile**
- Get student profile
- Auth: Required (Student only)
- Returns: Profile with certificates count

**PUT /api/students/profile**
- Create or update student profile
- Auth: Required (Student only)
- Body:
```json
{
  "skills": ["skill1", "skill2"],
  "cgpa": "number (0-10)",
  "graduation_year": "number",
  "degree": "string",
  "specialization": "string",
  "bio": "string",
  "visible_to_companies": "boolean",
  "resume_url": "string",
  "linkedin_url": "string",
  "github_url": "string",
  "portfolio_url": "string"
}
```

**PATCH /api/students/visibility**
- Toggle profile visibility to companies
- Auth: Required (Student only)
- Body: `{ visible: boolean }`

**GET /api/students/certificates**
- Get student's certificates
- Auth: Required (Student only)
- Returns: List of certificates with issuer details

**GET /api/students/stats**
- Get student dashboard statistics
- Auth: Required (Student only)
- Returns:
```json
{
  "total_applications": "number",
  "pending_applications": "number",
  "shortlisted_applications": "number",
  "total_offers": "number",
  "pending_offers": "number",
  "certificates_count": "number",
  "visible_to_companies": "boolean"
}
```

**GET /api/students/recommended-jobs**
- Get job recommendations based on profile
- Auth: Required (Student only)
- Uses skills matching and CGPA filtering
- Returns: Matched jobs with match score

---

## Frontend Components

### Student Dashboard Updates
**File:** `client/src/pages/StudentDashboard.js`

**New Features:**
1. **Tab Navigation**
   - Certificates
   - Job Openings
   - My Applications
   - Job Offers

2. **Job Openings Tab**
   - Search and filter jobs
   - View job details (title, company, location, salary, deadline)
   - Skills tags
   - Apply button → Opens modal
   - Visibility toggle (hide/show profile to companies)

3. **My Applications Tab**
   - List of all applications
   - Status badges (pending, shortlisted, interviewing, rejected)
   - Application date
   - Job details

4. **Job Offers Tab**
   - List of offers received
   - Offer details (salary, joining date, offer letter)
   - Accept/Decline buttons
   - Status tracking

5. **Apply Modal**
   - Job information display
   - Cover letter textarea
   - Submit application

### Company Dashboard Updates
**File:** `client/src/pages/CompanyDashboard.js`

**New Tab:** Job Portal (uses CompanyJobManagement component)

### Company Job Management Component
**File:** `client/src/components/CompanyJobManagement.js`

**Features:**

1. **My Job Postings Tab**
   - List all posted jobs
   - Application count badge
   - Post new job button → Modal
   - View applications dropdown
   - Update application status (pending/shortlisted/interviewing/rejected)
   - Send offer button for each applicant
   - Delete job posting

2. **Find Candidates Tab**
   - Multi-filter search:
     - Skills (comma-separated)
     - Minimum CGPA
     - Graduation year
     - Degree
     - Has certificates (checkbox)
   - Candidate cards showing:
     - Name, email
     - CGPA, degree, graduation year
     - Skills tags
     - Certificates count
     - Links (Resume, LinkedIn, GitHub)

3. **Sent Offers Tab**
   - List of all offers sent
   - Offer status (pending, accepted, rejected)
   - Student details
   - Offer details (salary, joining date)
   - Response timestamp

4. **Post Job Modal**
   - Job title, type, description
   - Location, salary range
   - Required skills (comma-separated)
   - Minimum CGPA
   - Experience required
   - Application deadline (date picker)

5. **Send Offer Modal**
   - Offer letter textarea
   - Salary offered
   - Joining date (date picker)

---

## Key Features

### For Students
✅ **Profile Management**
- Complete profile with skills, CGPA, degree
- Privacy control (hide/show from companies)
- Resume, LinkedIn, GitHub links

✅ **Job Discovery**
- Browse active job postings
- Search by keywords and location
- Filter by job type
- View detailed job requirements

✅ **Applications**
- Apply with cover letter
- Track application status
- Withdraw applications
- View application history

✅ **Job Offers**
- Receive offers from companies
- View offer details (salary, joining date, letter)
- Accept or decline offers
- Track offer status

✅ **Recommendations**
- Get job suggestions based on skills
- CGPA-based filtering
- Match score calculation

### For Companies
✅ **Job Posting**
- Create detailed job listings
- Specify requirements (skills, CGPA, experience)
- Set application deadlines
- Edit/delete postings

✅ **Candidate Search**
- Advanced filtering system
- Search by skills, CGPA, degree
- Filter by certificate holders
- View complete student profiles

✅ **Application Management**
- View all applications per job
- Update application status
- View candidate details (CGPA, certificates, skills)
- Track application counts

✅ **Offer Management**
- Send personalized offers
- Specify salary and joining date
- Track offer responses
- View offer history

---

## Usage Flow

### Student Journey
1. **Setup Profile**
   ```
   Login → Profile Tab → Complete profile with skills, CGPA, resume
   Toggle visibility ON to be discoverable by companies
   ```

2. **Find Jobs**
   ```
   Jobs Tab → Search/Filter → View job details → Apply with cover letter
   ```

3. **Track Applications**
   ```
   My Applications Tab → View status updates → Wait for offers
   ```

4. **Receive Offers**
   ```
   Job Offers Tab → Review offer → Accept/Decline
   ```

### Company Journey
1. **Post Job**
   ```
   Job Portal Tab → My Job Postings → Post New Job → Fill details → Submit
   ```

2. **Review Applications**
   ```
   View Applications → Check candidate profiles → Update status
   ```

3. **Search Candidates**
   ```
   Find Candidates Tab → Set filters → Search → View profiles
   ```

4. **Send Offers**
   ```
   Applications → Select candidate → Send Offer → Fill offer details → Submit
   ```

5. **Track Offers**
   ```
   Sent Offers Tab → View all offers → Check responses
   ```

---

## Security & Validation

### Backend Validations
- ✅ JWT authentication on all routes
- ✅ Role-based authorization (Student/Company)
- ✅ Ownership verification (companies can only edit/delete own jobs)
- ✅ Profile visibility check (students must be visible to apply)
- ✅ Duplicate application prevention (UNIQUE constraint)
- ✅ Duplicate offer prevention (UNIQUE constraint)
- ✅ Active job validation before application
- ✅ Deadline validation (can't apply to expired jobs)

### Frontend Validations
- ✅ Required field validation
- ✅ CGPA range validation (0-10)
- ✅ Date validation (deadline must be future date)
- ✅ Empty state handling
- ✅ Error message display
- ✅ Loading states
- ✅ Success confirmations

---

## Database Performance

### Indexes Created
- ✅ User lookups (`user_id` in student_profiles, job_postings, applications, offers)
- ✅ Status filtering (`status` in job_postings, applications, offers)
- ✅ Visibility filtering (`visible_to_companies` in student_profiles)
- ✅ CGPA filtering (`cgpa` in student_profiles)
- ✅ Deadline filtering (`application_deadline` in job_postings)

### Query Optimizations
- ✅ JOIN optimization (single query for related data)
- ✅ Array operations for skills matching (`&&` operator)
- ✅ Selective column fetching
- ✅ COUNT aggregation for statistics
- ✅ Unique constraints prevent duplicates

---

## Testing Checklist

### Student Features
- [ ] Create/update profile
- [ ] Toggle visibility
- [ ] Search jobs by keywords
- [ ] Filter jobs by location
- [ ] Apply to job with cover letter
- [ ] View application status
- [ ] Withdraw application
- [ ] Receive job offer
- [ ] Accept offer
- [ ] Decline offer
- [ ] View dashboard stats

### Company Features
- [ ] Create job posting
- [ ] Edit job posting
- [ ] Delete job posting
- [ ] View applications for job
- [ ] Update application status
- [ ] Search candidates by skills
- [ ] Filter candidates by CGPA
- [ ] Filter by graduation year
- [ ] Filter by certificate holders
- [ ] Send job offer
- [ ] View sent offers
- [ ] Track offer responses

### Edge Cases
- [ ] Apply to job with hidden profile (should fail)
- [ ] Apply to same job twice (should fail)
- [ ] Send offer to same student twice (should fail)
- [ ] Apply to expired job (should fail)
- [ ] Non-company user creating job (should fail)
- [ ] Non-student applying to job (should fail)
- [ ] Edit/delete job owned by another company (should fail)

---

## Future Enhancements

### Potential Features
1. **Saved Jobs** - Students can bookmark jobs
2. **Interview Scheduling** - Integrated calendar for interviews
3. **Chat System** - Direct messaging between students and companies
4. **Resume Builder** - Integrated resume creation tool
5. **Application Analytics** - Statistics for students and companies
6. **Email Notifications** - Alerts for application updates and offers
7. **Assessment Tests** - Online coding/skill tests
8. **Video Interviews** - Integrated video call feature
9. **Job Recommendations AI** - ML-based job matching
10. **Company Reviews** - Student reviews of companies

---

## Maintenance

### Database Cleanup
```sql
-- Remove expired job postings
DELETE FROM job_postings 
WHERE status = 'active' 
AND application_deadline < CURRENT_DATE;

-- Update old pending applications
UPDATE job_applications 
SET status = 'expired' 
WHERE status = 'pending' 
AND applied_at < NOW() - INTERVAL '90 days';
```

### Performance Monitoring
- Monitor query execution times
- Check index usage with `EXPLAIN ANALYZE`
- Monitor table sizes
- Vacuum tables periodically

---

## Support

For issues or questions:
1. Check database logs for errors
2. Verify JWT token validity
3. Check role permissions
4. Validate request body format
5. Check foreign key relationships
6. Verify indexes are being used

---

**Status:** ✅ Fully Implemented and Ready for Testing
**Last Updated:** 2024

# Job Portal - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Server running on port 5002
- PostgreSQL database connected
- JWT authentication configured
- User roles: Student, Company

---

## 📋 Quick Setup

### 1. Start Server
```bash
cd server
node index.js
```

The server will automatically create 4 new tables:
- `student_profiles`
- `job_postings`
- `job_applications`
- `job_offers`

### 2. Access Dashboards
- **Students**: Login → StudentDashboard → Jobs Tab
- **Companies**: Login → CompanyDashboard → Job Portal Tab

---

## 👨‍🎓 For Students

### Step 1: Setup Your Profile
```
Dashboard → Profile → Complete these fields:
- Skills (comma-separated)
- CGPA
- Graduation Year
- Degree & Specialization
- Bio
- Resume URL
- LinkedIn, GitHub URLs
```

### Step 2: Make Profile Visible
```
Jobs Tab → Toggle "Visible to Companies" button to GREEN
```

### Step 3: Find & Apply to Jobs
```
1. Jobs Tab → Search/Filter jobs
2. Click "Apply Now" on desired job
3. Write cover letter
4. Submit application
```

### Step 4: Track Applications
```
My Applications Tab → View status:
- Pending (Yellow)
- Shortlisted (Blue)  
- Interviewing (Purple)
- Rejected (Red)
```

### Step 5: Manage Offers
```
Job Offers Tab:
- Review offer letter
- Check salary & joining date
- Click "Accept Offer" or "Decline"
```

---

## 🏢 For Companies

### Step 1: Post a Job
```
Job Portal Tab → My Job Postings → Post New Job

Fill in:
✓ Job Title (e.g., "Senior Software Engineer")
✓ Job Type (Full-Time/Part-Time/Contract/Internship)
✓ Description
✓ Location
✓ Salary Range
✓ Required Skills (comma-separated)
✓ Minimum CGPA (optional)
✓ Experience Required (optional)
✓ Application Deadline (must be future date)

Click "Post Job"
```

### Step 2: View Applications
```
My Job Postings → Click Users icon on job card
→ See all applicants with:
  - Name, Email, Phone
  - CGPA, Skills, Certificates count
  - Cover letter
```

### Step 3: Manage Applications
```
For each application:
1. Update status dropdown:
   - Pending
   - Shortlisted
   - Interviewing
   - Rejected
   
2. Click "Send Offer" for selected candidates
```

### Step 4: Search Candidates
```
Find Candidates Tab → Set filters:
- Skills: "JavaScript, React, Node.js"
- Min CGPA: "7.5"
- Graduation Year: "2024"
- Degree: "Computer Science"
- ☑ Has Certificates

Click "Search Candidates"

View results:
- Profile details
- Skills match
- Certificates count
- Links (Resume, LinkedIn, GitHub)
```

### Step 5: Send Job Offers
```
From Applications OR Find Candidates:
1. Click "Send Offer"
2. Write offer letter
3. Enter salary offered
4. Set joining date
5. Submit

Track in "Sent Offers" tab:
- Pending (Yellow) - awaiting response
- Accepted (Green) - candidate accepted
- Rejected (Red) - candidate declined
```

---

## 🔧 API Usage Examples

### Student - Apply to Job
```javascript
POST /api/jobs/apply/:jobId
Headers: { Authorization: "Bearer <token>" }
Body: {
  "cover_letter": "I am interested in this position because..."
}
```

### Company - Post Job
```javascript
POST /api/jobs/postings
Headers: { Authorization: "Bearer <token>" }
Body: {
  "job_title": "Full Stack Developer",
  "job_description": "We are looking for...",
  "job_type": "Full-Time",
  "location": "Remote",
  "salary_range": "$80,000 - $100,000",
  "required_skills": "React, Node.js, PostgreSQL",
  "min_cgpa": 7.5,
  "application_deadline": "2024-12-31"
}
```

### Company - Search Candidates
```javascript
GET /api/jobs/candidates/search?skills=React,Node.js&minCgpa=7&hasCertificates=true
Headers: { Authorization: "Bearer <token>" }
```

### Student - Toggle Visibility
```javascript
PATCH /api/students/visibility
Headers: { Authorization: "Bearer <token>" }
Body: { "visible": true }
```

---

## 🎨 UI Components

### Status Badge Colors
- **Pending**: Yellow
- **Shortlisted**: Blue
- **Interviewing**: Purple
- **Accepted**: Green
- **Rejected**: Red
- **Active**: Green (for job postings)

### Icons Used
- 💼 Briefcase: Jobs
- 📝 Send: Applications
- ✅ CheckCircle: Offers
- 👥 Users: Candidates
- 🔍 Search: Search
- 👁️ Eye: Visible
- 🚫 EyeOff: Hidden

---

## ⚠️ Common Issues & Solutions

### Issue: "Your profile is currently hidden from companies"
**Solution:** Go to Jobs tab → Click visibility toggle to make profile visible

### Issue: "You have already applied for this job"
**Solution:** Check My Applications tab - application already exists

### Issue: "Job posting not found or no longer accepting applications"
**Solution:** Job may be closed or deadline passed - search for active jobs

### Issue: "Unauthorized to update this job posting"
**Solution:** You can only edit/delete your own job postings

### Issue: Application status not updating
**Solution:** Refresh the page or re-fetch applications

---

## 📊 Dashboard Stats

### Students Can Track:
- Total Applications Submitted
- Pending Applications
- Shortlisted Applications
- Total Offers Received
- Pending Offers
- Total Certificates
- Profile Visibility Status

### Companies Can Track:
- Total Job Postings
- Active Jobs
- Total Applications Received (per job)
- Total Offers Sent
- Offer Response Rates

---

## 🔒 Security Features

✅ **Authentication**: All routes require JWT token  
✅ **Authorization**: Role-based access (Student/Company)  
✅ **Validation**: Input validation on all forms  
✅ **Ownership**: Users can only edit their own data  
✅ **Privacy**: Students control profile visibility  
✅ **Uniqueness**: Can't apply twice to same job  

---

## 📱 Mobile Responsive

All components are mobile-friendly:
- Touch-optimized buttons (44px min height)
- Responsive grids (auto-adjust columns)
- Swipeable tabs
- Modal full-screen on mobile
- Collapsible filters

---

## 🎯 Pro Tips

### For Students:
1. ✨ Keep profile updated with latest skills
2. 📝 Write personalized cover letters (avoid generic text)
3. 🎓 Add certificates to boost profile visibility
4. 🔗 Keep resume/LinkedIn links current
5. 👀 Make profile visible before job hunting season
6. 📊 Check recommended jobs for best matches

### For Companies:
1. 🎯 Set realistic CGPA requirements
2. 📅 Give adequate application deadline (2-4 weeks)
3. 🔍 Use multiple filters for better candidate matches
4. ⚡ Update application status promptly
5. 💼 Include salary range for transparency
6. 📱 Respond to applications within 1-2 weeks

---

## 🚦 Workflow Summary

```
STUDENT FLOW:
Profile Setup → Make Visible → Browse Jobs → Apply → 
Track Status → Receive Offer → Accept/Decline

COMPANY FLOW:
Post Job → Receive Applications → Review Candidates → 
Update Status → Send Offers → Track Responses
```

---

## 📞 Support Endpoints

### Health Check
```
GET /api/health
```

### Test Database Connection
```sql
-- In PostgreSQL console
SELECT * FROM student_profiles LIMIT 5;
SELECT * FROM job_postings WHERE status = 'active';
SELECT COUNT(*) FROM job_applications;
```

---

## ✅ Pre-Launch Checklist

### Backend
- [ ] Server running on port 5002
- [ ] Database tables created
- [ ] JWT secret configured
- [ ] Routes registered in server/index.js

### Frontend
- [ ] Student dashboard has Jobs tab
- [ ] Company dashboard has Job Portal tab
- [ ] Forms have validation
- [ ] Modals working properly
- [ ] CSS files imported

### Testing
- [ ] Student can create profile
- [ ] Student can apply to job
- [ ] Company can post job
- [ ] Company can view applications
- [ ] Offers can be sent/received

---

**Ready to Go! 🎉**

Your job portal is now fully functional. Start by creating a student profile or posting your first job!

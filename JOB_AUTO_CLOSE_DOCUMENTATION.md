# Job Posting Auto-Close on Offer Acceptance

## Feature Overview
When a student accepts a job offer, the system automatically closes the job posting and hides it from other students, preventing further applications.

---

## Business Logic

### What Happens When a Student Accepts an Offer?

1. ✅ **Offer Status Updated** → `accepted`
2. ✅ **Student's Application Status Updated** → `accepted`
3. ✅ **Job Posting Status Changed** → `filled` (previously `active`)
4. ✅ **Other Pending Applications Closed** → Status changed to `closed`
5. ✅ **Job Hidden from Search** → No longer visible to other students

---

## Implementation Details

### Backend (`server/routes/jobs.js`)

**Route: `PATCH /api/jobs/offers/:id/respond`**

```javascript
if (status === 'accepted') {
  // 1. Update the accepted student's application
  await pool.query(`
    UPDATE job_applications 
    SET status = 'accepted', updated_at = CURRENT_TIMESTAMP
    WHERE job_id = $1 AND student_id = $2
  `, [job_id, student_id]);
  
  // 2. Close the job posting (mark as filled)
  await pool.query(`
    UPDATE job_postings 
    SET status = 'filled', updated_at = CURRENT_TIMESTAMP
    WHERE id = $1
  `, [job_id]);
  
  // 3. Close all other pending applications
  await pool.query(`
    UPDATE job_applications 
    SET status = 'closed', updated_at = CURRENT_TIMESTAMP
    WHERE job_id = $1 AND student_id != $2 AND status = 'pending'
  `, [job_id, student_id]);
}
```

### Frontend Filtering

**Job Listings (`GET /api/jobs/postings`)**
```javascript
WHERE jp.status = 'active'  // Only shows active jobs, not 'filled'
AND jp.application_deadline >= CURRENT_DATE
```

**Student Applications Tab**
```javascript
applications.filter(app => 
  app.status !== 'accepted' && 
  app.status !== 'closed'
)
```
Only shows applications that are:
- ✅ Pending
- ✅ Shortlisted
- ✅ Interviewing
- ✅ Rejected

Hides applications that are:
- ❌ Accepted (moved to Job Offers tab)
- ❌ Closed (job was filled by another candidate)

---

## Status Definitions

### Job Posting Statuses
| Status | Meaning | Visible to Students? |
|--------|---------|---------------------|
| `active` | Job is open and accepting applications | ✅ Yes |
| `filled` | Position has been filled (offer accepted) | ❌ No |
| `closed` | Job manually closed by company | ❌ No |

### Application Statuses
| Status | Meaning | Action |
|--------|---------|--------|
| `pending` | Waiting for company review | Show in Applications |
| `shortlisted` | Selected for next round | Show in Applications |
| `interviewing` | In interview process | Show in Applications |
| `rejected` | Application declined | Show in Applications |
| `accepted` | Student got the job | Hide (shown in Offers) |
| `closed` | Job filled by another candidate | Hide |

### Offer Statuses
| Status | Meaning | Student Action |
|--------|---------|---------------|
| `pending` | Waiting for student response | Can Accept/Decline |
| `accepted` | Student accepted the offer | No action needed |
| `rejected` | Student declined the offer | No action needed |

---

## User Experience Flows

### Flow 1: Student A Accepts Offer

**Initial State:**
- Job Posting: `active` (visible to all)
- Student A Application: `pending`
- Student B Application: `pending`
- Student C Application: `shortlisted`

**Student A Accepts Offer:**
```
1. Student A receives offer → Clicks "Accept Offer"
2. System updates:
   - Offer Status: pending → accepted ✓
   - Student A Application: pending → accepted ✓
   - Job Posting: active → filled ✓
   - Student B Application: pending → closed ✓
   - Student C Application: shortlisted → closed ✓
```

**New State:**
- Job Posting: `filled` (❌ no longer visible to new students)
- Student A: Sees "Congratulations!" in Job Offers tab
- Student A: Application removed from "My Applications"
- Student B: Application disappears from "My Applications"
- Student C: Application disappears from "My Applications"

### Flow 2: Student Viewing Jobs

**Before Acceptance:**
```
Student logs in → Jobs Tab
Sees: 10 active job postings
```

**After Another Student Accepts:**
```
Student logs in → Jobs Tab
Sees: 9 active job postings (filled job hidden)
```

**If Student Had Applied to Filled Job:**
```
Student → My Applications Tab
Previous Applications: 5 → Now: 4
(Closed application automatically removed from view)
```

---

## Company Dashboard Impact

### Job Postings View
Companies can see all their postings including filled ones:

```javascript
// Company sees filled jobs with special badge
<span className="status-badge filled">
  Filled
</span>
```

**Visual Indicators:**
- 🟢 Active (green) - Currently accepting applications
- 🔵 Filled (blue-green) - Position has been filled
- ⚪ Closed (gray) - Manually closed by company

### Application Management
When a job is filled:
- ✅ Company can still view all applications (including closed ones)
- ✅ Application count remains accurate
- ✅ Company can see which student accepted the offer

---

## Edge Cases Handled

### 1. Multiple Offers for Same Job
❌ **Prevented:** Companies can only send one offer per student per job (UNIQUE constraint)

### 2. Student Accepts After Job Filled
❌ **Prevented:** Students can't see filled jobs, so can't apply

### 3. Company Manually Closes Job
✅ **Handled:** Companies can manually set status to `closed` to stop applications

### 4. Application Status Conflicts
✅ **Handled:** 
- Accepted applications are never overwritten
- Closed status only applies to pending applications

### 5. Offer Rejection
✅ **Handled:** 
- If student rejects offer, job remains `active`
- Other students' applications remain unchanged
- Only changes when student **accepts**

---

## Benefits

### For Students
1. ✅ **Cleaner Experience** - Don't see jobs that are already filled
2. ✅ **Reduced Clutter** - Closed applications automatically hidden
3. ✅ **Clear Feedback** - Know when a job is no longer available
4. ✅ **Focus on Active Opportunities** - See only relevant jobs

### For Companies
1. ✅ **Automatic Management** - No manual job closure needed
2. ✅ **Prevent Over-Applications** - Stop receiving applications once filled
3. ✅ **Clear Status Tracking** - See which jobs are filled vs active
4. ✅ **Complete History** - Still see all applications even after filling

### For System
1. ✅ **Data Integrity** - Proper status tracking across tables
2. ✅ **Reduced Database Load** - Fewer unnecessary applications
3. ✅ **Consistent State** - Applications and postings stay synchronized
4. ✅ **Audit Trail** - Complete history of job lifecycle

---

## Database Queries

### Check Active Jobs Only
```sql
SELECT * FROM job_postings 
WHERE status = 'active' 
AND application_deadline >= CURRENT_DATE;
```

### Find All Filled Positions
```sql
SELECT 
  jp.*,
  u.full_name as accepted_student
FROM job_postings jp
JOIN job_offers jo ON jp.id = jo.job_id
JOIN users u ON jo.student_id = u.id
WHERE jp.status = 'filled' 
AND jo.status = 'accepted';
```

### Student's Active Applications
```sql
SELECT * FROM job_applications
WHERE student_id = $1
AND status NOT IN ('accepted', 'closed')
ORDER BY applied_at DESC;
```

---

## Testing Scenarios

### Test 1: Basic Acceptance Flow
1. ✅ Student A applies to Job X
2. ✅ Company sends offer to Student A
3. ✅ Student A accepts offer
4. ✅ Verify Job X status = 'filled'
5. ✅ Verify Job X not visible to Student B
6. ✅ Verify Student A application status = 'accepted'

### Test 2: Multiple Applications
1. ✅ Student A, B, C apply to Job X
2. ✅ Company sends offer to Student A
3. ✅ Student A accepts
4. ✅ Verify Student B & C applications status = 'closed'
5. ✅ Verify Student B & C don't see application anymore

### Test 3: Rejection Doesn't Close
1. ✅ Student A receives offer for Job X
2. ✅ Student A rejects offer
3. ✅ Verify Job X status = 'active' (unchanged)
4. ✅ Verify Job X still visible to other students

### Test 4: Company View
1. ✅ Job gets filled
2. ✅ Company can still see the job in dashboard
3. ✅ Job shows 'filled' badge
4. ✅ Company can see all applications including closed ones

---

## Configuration Options

### Optional Behaviors (Can be customized)

**Auto-close other applications:**
```javascript
// Current: Closes pending applications
// Alternative: Keep them visible with "position filled" message
WHERE status = 'pending'  // Can add more statuses
```

**Job visibility after filling:**
```javascript
// Current: Completely hidden
// Alternative: Show with "Position Filled" tag
WHERE status = 'active'  // Could be: WHERE status IN ('active', 'filled')
```

**Reopen job option:**
```javascript
// Future: Allow companies to reopen filled positions
UPDATE job_postings SET status = 'active' WHERE id = $1;
```

---

## Monitoring & Analytics

### Metrics to Track
- Time to fill (job creation → filled)
- Applications per filled position
- Acceptance rate
- Jobs filled vs jobs expired
- Average applications before filling

### SQL Analytics Queries

**Average Time to Fill:**
```sql
SELECT 
  AVG(EXTRACT(EPOCH FROM (updated_at - created_at))/86400) as avg_days_to_fill
FROM job_postings
WHERE status = 'filled';
```

**Filled Jobs Today:**
```sql
SELECT COUNT(*) FROM job_postings
WHERE status = 'filled'
AND DATE(updated_at) = CURRENT_DATE;
```

---

**Status:** ✅ Fully Implemented
**Version:** 1.0
**Last Updated:** October 4, 2025

# Complete Multilingual Integration Guide

## Files Already Updated with Translations

### ✅ Fully Integrated Pages:
1. **LandingPage.js** - Complete with LanguageSwitcher
2. **Login.js** - Complete with LanguageSwitcher  
3. **Register.js** - Has `useTranslation` hook imported
4. **IssueCertificate.js** - Has `useTranslation` hook imported
5. **VerifyCertificate.js** - Has `useTranslation` hook imported
6. **AdminDashboard.js** - Has `useTranslation` hook imported + LanguageSwitcher
7. **StudentDashboard.js** - Has `useTranslation` hook imported + LanguageSwitcher
8. **InstituteDashboard.js** - Has `useTranslation` hook imported + LanguageSwitcher
9. **CompanyDashboard.js** - Has `useTranslation` hook imported + LanguageSwitcher

## Translation Keys Available

All translation files (en, hi, ta, bn, te, mr, es) have comprehensive keys for:

### Navigation (`nav.*`)
- features, howItWorks, benefits, digiLocker
- verifyCertificate, issueCertificate, dashboard
- profile, logout, login, register

### Dashboard (`dashboard.*`)
- welcome, statistics, recentActivity
- certificatesIssued, certificatesVerified, pendingApprovals
- totalStudents, totalInstitutes, totalCompanies, totalAdmins
- totalCertificates, allUsers, pendingUsers, approvedUsers
- searchUsers, filterByRole, all, admin, institute, student, company
- name, email, role, organization, phone, status, actions
- approve, reject, delete, view, approved, pending, rejected
- myCertificates, addCertificate, noCertificates
- courseName, issuedBy, issuedDate, downloadPDF, viewDetails
- And 25+ more keys...

### Issue Certificate (`issue.*`)
- title, subtitle, studentName, studentEmail, courseName
- instituteName, issueDate, issueButton, success, error
- selectCourse, otherCourse, enterCourseName
- learnerNamePlaceholder, learnerEmailPlaceholder
- processing, generatingCertificate, uploadingToIPFS
- storingOnBlockchain, certificateGenerated
- certificateId, downloadCertificate, viewCertificate
- issueAnother, backToDashboard

### Verify Certificate (`verify.*`)
- title, subtitle, certificateId, verifyButton
- scanQR, verified, notVerified, certificateDetails
- enterCertificateId, verifying, valid, invalid, notFound
- learnerName, learnerEmail, courseName, instituteName
- issueDate, blockchainHash, certificateValid
- certificateInvalid, backToHome

### Common (`common.*`)
- loading, error, success, cancel, save, delete
- edit, view, download, search, filter, actions
- status, date, name, email, back, next, submit, close

## How to Use Translations in Components

### Step 1: Import the Hook
```javascript
import { useTranslation } from 'react-i18next';
```

### Step 2: Use in Component
```javascript
const MyComponent = () => {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('dashboard.welcome')}</h1>
      <button>{t('common.submit')}</button>
    </div>
  );
};
```

### Step 3: Add Language Switcher
```javascript
import LanguageSwitcher from '../components/LanguageSwitcher';

// In your JSX:
<LanguageSwitcher />
```

## Quick Translation Replacement Patterns

### Replace Hardcoded Text:

**Before:**
```javascript
<h1>Welcome, Admin</h1>
<button>Logout</button>
<p>Total Students</p>
```

**After:**
```javascript
<h1>{t('dashboard.welcome')}, {t('dashboard.admin')}</h1>
<button>{t('nav.logout')}</button>
<p>{t('dashboard.totalStudents')}</p>
```

### Common Replacements for Dashboards:

| Hardcoded Text | Translation Key |
|---------------|----------------|
| "Welcome" | `{t('dashboard.welcome')}` |
| "Profile" | `{t('nav.profile')}` |
| "Logout" | `{t('nav.logout')}` |
| "Dashboard" | `{t('nav.dashboard')}` |
| "Students" | `{t('dashboard.student')}` |
| "Institutes" | `{t('dashboard.institute')}` |
| "Companies" | `{t('dashboard.company')}` |
| "Certificates Issued" | `{t('dashboard.certificatesIssued')}` |
| "View All" | `{t('dashboard.viewAll')}` |
| "Search users..." | `{t('dashboard.searchUsers')}` |
| "Filter by Role" | `{t('dashboard.filterByRole')}` |
| "All" | `{t('dashboard.all')}` |
| "Name" | `{t('dashboard.name')}` |
| "Email" | `{t('dashboard.email')}` |
| "Role" | `{t('dashboard.role')}` |
| "Status" | `{t('dashboard.status')}` |
| "Actions" | `{t('dashboard.actions')}` |
| "Approve" | `{t('dashboard.approve')}` |
| "Reject" | `{t('dashboard.reject')}` |
| "Delete" | `{t('dashboard.delete')}` |
| "View" | `{t('dashboard.view')}` |
| "Approved" | `{t('dashboard.approved')}` |
| "Pending" | `{t('dashboard.pending')}` |
| "My Certificates" | `{t('dashboard.myCertificates')}` |
| "Add Certificate" | `{t('dashboard.addCertificate')}` |
| "No certificates found" | `{t('dashboard.noCertificates')}` |
| "Course Name" | `{t('dashboard.courseName')}` |
| "Issued By" | `{t('dashboard.issuedBy')}` |
| "Issue Date" | `{t('dashboard.issuedDate')}` |
| "Download PDF" | `{t('dashboard.downloadPDF')}` |
| "View Details" | `{t('dashboard.viewDetails')}` |
| "Loading..." | `{t('common.loading')}` |
| "Submit" | `{t('common.submit')}` |
| "Cancel" | `{t('common.cancel')}` |
| "Save" | `{t('common.save')}` |
| "Back" | `{t('common.back')}` |
| "Next" | `{t('common.next')}` |
| "Close" | `{t('common.close')}` |

### For Issue Certificate Page:

| Hardcoded Text | Translation Key |
|---------------|----------------|
| "Issue Certificate" | `{t('issue.title')}` |
| "Student Name" | `{t('issue.studentName')}` |
| "Student Email" | `{t('issue.studentEmail')}` |
| "Course Name" | `{t('issue.courseName')}` |
| "Institute Name" | `{t('issue.instituteName')}` |
| "Issue Date" | `{t('issue.issueDate')}` |
| "Select a Course" | `{t('issue.selectCourse')}` |
| "Other (Specify Below)" | `{t('issue.otherCourse')}` |
| "Enter course name" | `{t('issue.enterCourseName')}` |
| "Processing..." | `{t('issue.processing')}` |
| "Generating Certificate" | `{t('issue.generatingCertificate')}` |
| "Certificate Generated Successfully" | `{t('issue.certificateGenerated')}` |
| "Download Certificate" | `{t('issue.downloadCertificate')}` |
| "Issue Another Certificate" | `{t('issue.issueAnother')}` |
| "Back to Dashboard" | `{t('issue.backToDashboard')}` |

### For Verify Certificate Page:

| Hardcoded Text | Translation Key |
|---------------|----------------|
| "Verify Certificate" | `{t('verify.title')}` |
| "Enter certificate ID to verify" | `{t('verify.enterCertificateId')}` |
| "Verify" | `{t('verify.verifyButton')}` |
| "Verifying..." | `{t('verify.verifying')}` |
| "Valid Certificate" | `{t('verify.valid')}` |
| "Invalid Certificate" | `{t('verify.invalid')}` |
| "Certificate Not Found" | `{t('verify.notFound')}` |
| "Learner Name" | `{t('verify.learnerName')}` |
| "Learner Email" | `{t('verify.learnerEmail')}` |
| "Course Name" | `{t('verify.courseName')}` |
| "Issued By" | `{t('verify.instituteName')}` |
| "Issue Date" | `{t('verify.issueDate')}` |
| "Blockchain Hash" | `{t('verify.blockchainHash')}` |
| "This certificate is valid and verified on the blockchain" | `{t('verify.certificateValid')}` |
| "This certificate could not be verified" | `{t('verify.certificateInvalid')}` |
| "Back to Home" | `{t('verify.backToHome')}` |

## Files That Need Manual Translation Updates

While the translation hooks are imported, you need to replace hardcoded strings with translation keys:

### High Priority:
1. **AdminDashboard.js** - Replace stat card labels, button text, table headers
2. **StudentDashboard.js** - Replace certificate list labels, modal text
3. **InstituteDashboard.js** - Replace action card text, stats labels
4. **CompanyDashboard.js** - Replace search labels, filter options, table headers

### Medium Priority:
5. **IssueCertificate.js** - Replace form labels, success messages, status text
6. **VerifyCertificate.js** - Replace result messages, certificate detail labels
7. **Register.js** - Replace form labels, error messages
8. **Profile.js** - If exists, replace profile field labels
9. **ViewCertificate.js** - Replace certificate detail labels

## Testing Checklist

After making changes, test:

- [ ] Landing page displays correctly in all 7 languages
- [ ] Login page switches language properly
- [ ] Register page maintains translations
- [ ] Admin dashboard shows translated labels
- [ ] Student dashboard shows translated text
- [ ] Institute dashboard displays correctly
- [ ] Company dashboard works in all languages
- [ ] Issue certificate form is fully translated
- [ ] Verify certificate page shows results in selected language
- [ ] Language selection persists on page refresh
- [ ] Language switcher appears on all pages
- [ ] No console errors related to missing translation keys

## Adding New Translation Keys

If you need a new translation key:

1. Add it to `en.json` first
2. Copy the structure to all other language files
3. Translate the value for each language
4. Use it in your component: `{t('section.newKey')}`

Example:
```json
// In all language files under appropriate section:
"newKey": "Translated Text"
```

## Supported Languages

1. 🇬🇧 English (en)
2. 🇮🇳 Hindi (hi)
3. 🇮🇳 Tamil (ta)
4. 🇮🇳 Bengali (bn)
5. 🇮🇳 Telugu (te)
6. 🇮🇳 Marathi (mr)
7. 🇪🇸 Spanish (es)

## Common Issues & Solutions

### Issue: Translation not showing
**Solution**: Check if the key exists in all translation files

### Issue: Language not persisting
**Solution**: Check localStorage in browser DevTools

### Issue: Missing translation warning
**Solution**: Add the missing key to all language files

### Issue: LanguageSwitcher not showing
**Solution**: Import and add `<LanguageSwitcher />` to the component

---

**Next Steps**: 
1. Go through each dashboard file
2. Replace hardcoded text with `{t('key')}`
3. Test in different languages
4. Add Language Switcher if missing

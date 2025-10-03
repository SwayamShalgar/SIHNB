// Validation utility with regex patterns and validation functions

// Regex patterns
export const REGEX_PATTERNS = {
  // Email: Enhanced email format with stricter validation
  // Supports: lowercase, uppercase, numbers, dots, hyphens, underscores before @
  // Domain must have valid TLD (2-6 characters)
  EMAIL: /^[a-zA-Z0-9][a-zA-Z0-9._-]*[a-zA-Z0-9]@[a-zA-Z0-9][a-zA-Z0-9.-]*\.[a-zA-Z]{2,6}$/,
  
  // Phone: Supports multiple formats
  // +1-234-567-8900, (123) 456-7890, 123-456-7890, 1234567890
  PHONE: /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,5}[-\s\.]?[0-9]{1,5}$/,
  
  // Name: Only letters, spaces, hyphens, and apostrophes (2-50 chars)
  NAME: /^[a-zA-Z\s'-]{2,50}$/,
  
  // Password: At least 8 chars, 1 uppercase, 1 lowercase, 1 number, 1 special char
  PASSWORD_STRONG: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/,
  
  // Password: Minimum 6 chars (for backward compatibility)
  PASSWORD_MEDIUM: /^.{6,}$/,
  
  // Organization/Institute name: ONLY letters, spaces, hyphens, apostrophes, periods, commas, ampersands (NO NUMBERS)
  ORGANIZATION: /^[a-zA-Z\s.,'&()-]{2,100}$/,
  
  // Institute name: ONLY letters, spaces, hyphens, periods (NO NUMBERS) - More strict for institutes
  INSTITUTE: /^[a-zA-Z\s.-]{2,100}$/,
  
  // Course name: Letters, numbers, spaces, common punctuation
  COURSE_NAME: /^[a-zA-Z0-9\s.,'&():-]{2,100}$/,
  
  // Alphanumeric with spaces (for general text fields)
  ALPHANUMERIC: /^[a-zA-Z0-9\s]+$/,
  
  // No special characters except common punctuation
  TEXT_SAFE: /^[a-zA-Z0-9\s.,'-]+$/,
};

// Validation functions
export const validateEmail = (email) => {
  if (!email) return { valid: false, error: 'Email is required' };
  
  // Trim email and convert to lowercase for validation
  const trimmedEmail = email.trim().toLowerCase();
  
  // Check for basic format issues
  if (trimmedEmail.length < 5) {
    return { valid: false, error: 'Email address is too short' };
  }
  
  if (!trimmedEmail.includes('@')) {
    return { valid: false, error: 'Email must contain @ symbol' };
  }
  
  if (!trimmedEmail.includes('.')) {
    return { valid: false, error: 'Email must contain a domain (e.g., .com)' };
  }
  
  // Check for consecutive dots
  if (trimmedEmail.includes('..')) {
    return { valid: false, error: 'Email cannot contain consecutive dots' };
  }
  
  // Check if starts or ends with special characters
  if (/^[._-]/.test(trimmedEmail) || /@[._-]/.test(trimmedEmail)) {
    return { valid: false, error: 'Email cannot start with special characters' };
  }
  
  if (!REGEX_PATTERNS.EMAIL.test(trimmedEmail)) {
    return { valid: false, error: 'Please enter a valid email address (e.g., user@example.com)' };
  }
  
  // Additional check: ensure there's content after the last dot
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return { valid: false, error: 'Email must have exactly one @ symbol' };
  }
  
  const domain = parts[1];
  const domainParts = domain.split('.');
  const tld = domainParts[domainParts.length - 1];
  
  if (tld.length < 2) {
    return { valid: false, error: 'Email domain extension is too short' };
  }
  
  return { valid: true, error: '' };
};

export const validatePhone = (phone) => {
  if (!phone) return { valid: true, error: '' }; // Phone is often optional
  if (!REGEX_PATTERNS.PHONE.test(phone)) {
    return { valid: false, error: 'Please enter a valid phone number' };
  }
  if (phone.replace(/\D/g, '').length < 10) {
    return { valid: false, error: 'Phone number must be at least 10 digits' };
  }
  return { valid: true, error: '' };
};

export const validateName = (name, fieldName = 'Name') => {
  if (!name) return { valid: false, error: `${fieldName} is required` };
  if (name.trim().length < 2) {
    return { valid: false, error: `${fieldName} must be at least 2 characters` };
  }
  if (!REGEX_PATTERNS.NAME.test(name)) {
    return { valid: false, error: `${fieldName} can only contain letters, spaces, hyphens, and apostrophes` };
  }
  return { valid: true, error: '' };
};

export const validatePassword = (password, strong = false) => {
  if (!password) return { valid: false, error: 'Password is required' };
  
  if (strong) {
    if (!REGEX_PATTERNS.PASSWORD_STRONG.test(password)) {
      return { 
        valid: false, 
        error: 'Password must be at least 8 characters with uppercase, lowercase, number, and special character' 
      };
    }
  } else {
    if (!REGEX_PATTERNS.PASSWORD_MEDIUM.test(password)) {
      return { valid: false, error: 'Password must be at least 6 characters' };
    }
  }
  return { valid: true, error: '' };
};

export const validateConfirmPassword = (password, confirmPassword) => {
  if (!confirmPassword) return { valid: false, error: 'Please confirm your password' };
  if (password !== confirmPassword) {
    return { valid: false, error: 'Passwords do not match' };
  }
  return { valid: true, error: '' };
};

export const validateOrganization = (org) => {
  if (!org) return { valid: true, error: '' }; // Often optional
  if (!REGEX_PATTERNS.ORGANIZATION.test(org)) {
    return { valid: false, error: 'Organization name contains invalid characters' };
  }
  return { valid: true, error: '' };
};

export const validateCourseName = (course) => {
  if (!course) return { valid: false, error: 'Course name is required' };
  if (course.trim().length < 2) {
    return { valid: false, error: 'Course name must be at least 2 characters' };
  }
  if (!REGEX_PATTERNS.COURSE_NAME.test(course)) {
    return { valid: false, error: 'Course name contains invalid characters' };
  }
  return { valid: true, error: '' };
};

export const validateInstituteName = (institute) => {
  if (!institute) return { valid: false, error: 'Institute name is required' };
  
  const trimmedInstitute = institute.trim();
  
  if (trimmedInstitute.length < 2) {
    return { valid: false, error: 'Institute name must be at least 2 characters' };
  }
  
  if (trimmedInstitute.length > 100) {
    return { valid: false, error: 'Institute name is too long (max 100 characters)' };
  }
  
  // Check for numbers
  if (/\d/.test(trimmedInstitute)) {
    return { valid: false, error: 'Institute name cannot contain numbers' };
  }
  
  if (!REGEX_PATTERNS.INSTITUTE.test(trimmedInstitute)) {
    return { valid: false, error: 'Institute name can only contain letters, spaces, hyphens, and periods' };
  }
  
  return { valid: true, error: '' };
};

export const validateDate = (date) => {
  if (!date) return { valid: false, error: 'Date is required' };
  const selectedDate = new Date(date);
  const today = new Date();
  
  if (isNaN(selectedDate.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  
  // Check if date is in the future
  if (selectedDate > today) {
    return { valid: false, error: 'Date cannot be in the future' };
  }
  
  return { valid: true, error: '' };
};

// Sanitize input to prevent XSS
export const sanitizeInput = (input) => {
  if (typeof input !== 'string') return input;
  return input
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .slice(0, 500); // Limit length
};

// Validate entire form (returns object with field errors)
export const validateLoginForm = (formData) => {
  const errors = {};
  
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.valid) errors.email = emailValidation.error;
  
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.valid) errors.password = passwordValidation.error;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateRegisterForm = (formData) => {
  const errors = {};
  
  const nameValidation = validateName(formData.full_name, 'Full name');
  if (!nameValidation.valid) errors.full_name = nameValidation.error;
  
  const emailValidation = validateEmail(formData.email);
  if (!emailValidation.valid) errors.email = emailValidation.error;
  
  const phoneValidation = validatePhone(formData.phone);
  if (!phoneValidation.valid) errors.phone = phoneValidation.error;
  
  const orgValidation = validateOrganization(formData.organization);
  if (!orgValidation.valid) errors.organization = orgValidation.error;
  
  const passwordValidation = validatePassword(formData.password);
  if (!passwordValidation.valid) errors.password = passwordValidation.error;
  
  const confirmPasswordValidation = validateConfirmPassword(formData.password, formData.confirmPassword);
  if (!confirmPasswordValidation.valid) errors.confirmPassword = confirmPasswordValidation.error;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const validateCertificateForm = (formData) => {
  const errors = {};
  
  const nameValidation = validateName(formData.learner_name, 'Learner name');
  if (!nameValidation.valid) errors.learner_name = nameValidation.error;
  
  // Email is now REQUIRED for certificates
  const emailValidation = validateEmail(formData.learner_email);
  if (!emailValidation.valid) errors.learner_email = emailValidation.error;
  
  const courseValidation = validateCourseName(formData.course_name);
  if (!courseValidation.valid) errors.course_name = courseValidation.error;
  
  const instituteValidation = validateInstituteName(formData.institute_name);
  if (!instituteValidation.valid) errors.institute_name = instituteValidation.error;
  
  const dateValidation = validateDate(formData.issue_date);
  if (!dateValidation.valid) errors.issue_date = dateValidation.error;
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

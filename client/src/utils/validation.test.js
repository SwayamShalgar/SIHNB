// Validation Test Examples
// This file demonstrates the validation functionality

import {
  validateEmail,
  validatePhone,
  validateName,
  validatePassword,
  validateCourseName,
  validateInstituteName,
  validateDate,
  validateLoginForm,
  validateRegisterForm,
  validateCertificateForm
} from './validation';

console.log('=== EMAIL VALIDATION TESTS ===');
console.log('Valid email:', validateEmail('user@example.com'));
console.log('Invalid email:', validateEmail('invalid.email'));
console.log('Missing @:', validateEmail('userexample.com'));
console.log('Empty email:', validateEmail(''));

console.log('\n=== PHONE VALIDATION TESTS ===');
console.log('Valid US phone:', validatePhone('1234567890'));
console.log('Valid formatted:', validatePhone('+1-234-567-8900'));
console.log('Valid parentheses:', validatePhone('(123) 456-7890'));
console.log('Too short:', validatePhone('12345'));
console.log('Invalid chars:', validatePhone('abc-def-ghij'));

console.log('\n=== NAME VALIDATION TESTS ===');
console.log('Valid name:', validateName('John Doe'));
console.log("Valid with apostrophe:", validateName("O'Brien"));
console.log('Valid with hyphen:', validateName('Jean-Pierre'));
console.log('Too short:', validateName('J'));
console.log('With numbers:', validateName('John123'));
console.log('With special chars:', validateName('@John'));

console.log('\n=== PASSWORD VALIDATION TESTS ===');
console.log('Valid medium password:', validatePassword('abc123'));
console.log('Too short:', validatePassword('abc'));
console.log('Valid strong password:', validatePassword('Pass123!', true));
console.log('Strong but no uppercase:', validatePassword('pass123!', true));
console.log('Strong but no special:', validatePassword('Pass1234', true));

console.log('\n=== ORGANIZATION VALIDATION TESTS ===');
console.log('Valid org:', validateOrganization('MIT'));
console.log('Valid with punctuation:', validateOrganization('ABC Corp & Co.'));
console.log('Valid university:', validateOrganization('Stanford University'));

console.log('\n=== COURSE NAME VALIDATION TESTS ===');
console.log('Valid course:', validateCourseName('Full Stack Development'));
console.log('Valid with symbols:', validateCourseName('Machine Learning - Advanced'));
console.log('Valid with version:', validateCourseName('Python 3.0'));
console.log('Too short:', validateCourseName('A'));

console.log('\n=== DATE VALIDATION TESTS ===');
const today = new Date().toISOString().split('T')[0];
const yesterday = new Date(Date.now() - 86400000).toISOString().split('T')[0];
const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];

console.log('Valid date (today):', validateDate(today));
console.log('Valid date (yesterday):', validateDate(yesterday));
console.log('Invalid (future):', validateDate(tomorrow));
console.log('Invalid format:', validateDate('invalid-date'));

console.log('\n=== FORM VALIDATION TESTS ===');

// Login Form
const loginData = {
  email: 'user@example.com',
  password: 'password123'
};
console.log('Valid login form:', validateLoginForm(loginData));

const invalidLoginData = {
  email: 'invalid-email',
  password: '123'
};
console.log('Invalid login form:', validateLoginForm(invalidLoginData));

// Register Form
const registerData = {
  full_name: 'John Doe',
  email: 'john@example.com',
  phone: '1234567890',
  organization: 'Tech Corp',
  password: 'password123',
  confirmPassword: 'password123'
};
console.log('Valid register form:', validateRegisterForm(registerData));

const invalidRegisterData = {
  full_name: 'J',
  email: 'invalid',
  phone: '123',
  organization: '',
  password: '123',
  confirmPassword: '456'
};
console.log('Invalid register form:', validateRegisterForm(invalidRegisterData));

// Certificate Form
const certData = {
  learner_name: 'Jane Smith',
  learner_email: 'jane@example.com',
  course_name: 'Web Development',
  institute_name: 'Tech University',
  issue_date: today
};
console.log('Valid certificate form:', validateCertificateForm(certData));

const invalidCertData = {
  learner_name: 'J',
  learner_email: 'invalid',
  course_name: 'A',
  institute_name: 'B',
  issue_date: tomorrow
};
console.log('Invalid certificate form:', validateCertificateForm(invalidCertData));

console.log('\n=== SANITIZATION TESTS ===');
console.log('Normal text:', sanitizeInput('Hello World'));
console.log('With HTML:', sanitizeInput('Hello <script>alert("xss")</script>'));
console.log('With extra spaces:', sanitizeInput('  Hello   World  '));
console.log('Very long text:', sanitizeInput('a'.repeat(600)).length, 'chars (should be 500)');

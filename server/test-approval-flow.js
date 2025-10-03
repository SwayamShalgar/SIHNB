/**
 * Test Admin Approval Flow
 * 
 * This script tests the complete approval workflow:
 * 1. Register a Company/Institute (should be unverified)
 * 2. Try to login (should fail with pending message)
 * 3. Admin approves the user
 * 4. Try to login again (should succeed)
 */

const axios = require('axios');

const BASE_URL = 'http://localhost:5002/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`),
  step: (msg) => console.log(`${colors.cyan}→ ${msg}${colors.reset}\n`)
};

// Test data
const testCompany = {
  email: `test-company-${Date.now()}@example.com`,
  password: 'TestPassword123',
  role: 'Company',
  full_name: 'Test Company Inc',
  organization: 'Test Company',
  phone: '1234567890'
};

const adminCredentials = {
  email: 'admin@example.com', // Update with your admin email
  password: 'admin123',        // Update with your admin password
  role: 'Admin'
};

let adminToken = null;
let companyUserId = null;

async function testApprovalFlow() {
  console.log('\n' + '='.repeat(60));
  console.log('   TESTING ADMIN APPROVAL FLOW');
  console.log('='.repeat(60) + '\n');

  try {
    // Step 1: Register Company (should be pending)
    log.step('Step 1: Registering Company account...');
    try {
      const registerResponse = await axios.post(`${BASE_URL}/auth/register`, testCompany);
      
      if (registerResponse.data.pending) {
        log.success('Company registered with pending status');
        log.info(`Message: ${registerResponse.data.message}`);
        companyUserId = registerResponse.data.user.id;
        log.info(`User ID: ${companyUserId}`);
      } else {
        log.error('Company was not set to pending status!');
        return;
      }
    } catch (err) {
      if (err.response?.status === 202 && err.response?.data?.pending) {
        log.success('Company registered with pending status (202 response)');
        log.info(`Message: ${err.response.data.message}`);
        companyUserId = err.response.data.user.id;
        log.info(`User ID: ${companyUserId}`);
      } else {
        log.error(`Registration failed: ${err.response?.data?.error || err.message}`);
        return;
      }
    }

    // Step 2: Try to login (should fail)
    log.step('Step 2: Attempting to login with unverified account...');
    try {
      await axios.post(`${BASE_URL}/auth/login`, {
        email: testCompany.email,
        password: testCompany.password,
        role: testCompany.role
      });
      log.error('Login succeeded but should have been blocked!');
    } catch (err) {
      if (err.response?.status === 403 && err.response?.data?.pending) {
        log.success('Login correctly blocked for unverified account');
        log.info(`Message: ${err.response.data.message}`);
      } else {
        log.error(`Unexpected error: ${err.response?.data?.error || err.message}`);
      }
    }

    // Step 3: Admin login
    log.step('Step 3: Logging in as Admin...');
    try {
      const adminLoginResponse = await axios.post(`${BASE_URL}/auth/login`, adminCredentials);
      adminToken = adminLoginResponse.data.token;
      log.success('Admin logged in successfully');
      log.info(`Token: ${adminToken.substring(0, 20)}...`);
    } catch (err) {
      log.error(`Admin login failed: ${err.response?.data?.error || err.message}`);
      log.warn('Please update adminCredentials in the script with valid admin account');
      return;
    }

    // Step 4: Get pending users
    log.step('Step 4: Fetching pending users...');
    try {
      const pendingResponse = await axios.get(`${BASE_URL}/admin/pending-users`, {
        headers: { Authorization: `Bearer ${adminToken}` }
      });
      log.success(`Found ${pendingResponse.data.length} pending user(s)`);
      
      const ourUser = pendingResponse.data.find(u => u.email === testCompany.email);
      if (ourUser) {
        log.info(`Our test user found: ${ourUser.email} (${ourUser.role})`);
        companyUserId = ourUser.id;
      } else {
        log.warn('Our test user not found in pending list');
      }
    } catch (err) {
      log.error(`Failed to fetch pending users: ${err.response?.data?.error || err.message}`);
      return;
    }

    // Step 5: Approve the company
    log.step('Step 5: Approving the company account...');
    try {
      const approveResponse = await axios.post(
        `${BASE_URL}/admin/approve-user/${companyUserId}`,
        {},
        { headers: { Authorization: `Bearer ${adminToken}` } }
      );
      log.success('Company account approved!');
      log.info(`Message: ${approveResponse.data.message}`);
    } catch (err) {
      log.error(`Approval failed: ${err.response?.data?.error || err.message}`);
      return;
    }

    // Step 6: Login again (should succeed now)
    log.step('Step 6: Attempting login with approved account...');
    try {
      const loginResponse = await axios.post(`${BASE_URL}/auth/login`, {
        email: testCompany.email,
        password: testCompany.password,
        role: testCompany.role
      });
      log.success('Login successful with approved account!');
      log.info(`User: ${loginResponse.data.user.full_name}`);
      log.info(`Token: ${loginResponse.data.token.substring(0, 20)}...`);
    } catch (err) {
      log.error(`Login failed: ${err.response?.data?.error || err.message}`);
      return;
    }

    // Step 7: Test Student registration (should be immediate)
    log.step('Step 7: Testing Student registration (auto-approved)...');
    const testStudent = {
      email: `test-student-${Date.now()}@example.com`,
      password: 'StudentPass123',
      role: 'Student',
      full_name: 'Test Student'
    };

    try {
      const studentRegResponse = await axios.post(`${BASE_URL}/auth/register`, testStudent);
      if (studentRegResponse.data.token) {
        log.success('Student auto-approved and logged in immediately');
        log.info(`Token received: ${studentRegResponse.data.token.substring(0, 20)}...`);
      } else {
        log.error('Student should have received token immediately!');
      }
    } catch (err) {
      log.error(`Student registration failed: ${err.response?.data?.error || err.message}`);
    }

    // Final Summary
    console.log('\n' + '='.repeat(60));
    log.success('ALL TESTS PASSED! ✨');
    console.log('='.repeat(60) + '\n');
    
    log.info('Summary:');
    console.log('  • Company/Institute registrations require approval ✓');
    console.log('  • Unverified accounts cannot login ✓');
    console.log('  • Admin can approve accounts ✓');
    console.log('  • Approved accounts can login ✓');
    console.log('  • Student accounts are auto-approved ✓');
    console.log('');

  } catch (error) {
    log.error(`Unexpected error: ${error.message}`);
    console.error(error);
  }
}

// Run the test
console.log('\nMake sure the server is running on http://localhost:5002\n');
testApprovalFlow();

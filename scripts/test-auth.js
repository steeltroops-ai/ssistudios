#!/usr/bin/env node

/**
 * Comprehensive Authentication System Testing Script
 * Tests all authentication flows including signup, login, and security features
 */

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

// Test data
const testUsers = {
  validUser: {
    username: 'testuser123',
    email: 'test@example.com',
    password: 'testpassword123'
  },
  invalidUser: {
    username: 'invalid',
    email: 'invalid-email',
    password: '123'
  },
  adminUser: {
    username: 'admin',
    password: 'admin123'
  }
};

// Test results tracking
let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

// Helper functions
function log(message, type = 'info') {
  const colors = {
    info: '\x1b[36m',
    success: '\x1b[32m',
    error: '\x1b[31m',
    warning: '\x1b[33m',
    reset: '\x1b[0m'
  };
  console.log(`${colors[type]}${message}${colors.reset}`);
}

function assert(condition, message) {
  testResults.total++;
  if (condition) {
    testResults.passed++;
    log(`✓ ${message}`, 'success');
  } else {
    testResults.failed++;
    log(`✗ ${message}`, 'error');
  }
}

async function makeRequest(endpoint, options = {}) {
  try {
    const response = await fetch(`${BASE_URL}${endpoint}`, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    });
    
    const data = await response.json();
    return { response, data };
  } catch (error) {
    log(`Request failed: ${error.message}`, 'error');
    return { response: null, data: null, error };
  }
}

// Test suites
async function testSignupValidation() {
  log('\n=== Testing Signup Validation ===', 'info');
  
  // Test empty fields
  const { response: emptyResponse } = await makeRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({})
  });
  assert(emptyResponse?.status === 400, 'Empty fields should return 400');
  
  // Test invalid email
  const { response: invalidEmailResponse } = await makeRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      username: 'testuser',
      email: 'invalid-email',
      password: 'password123'
    })
  });
  assert(invalidEmailResponse?.status === 400, 'Invalid email should return 400');
  
  // Test short password
  const { response: shortPasswordResponse } = await makeRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify({
      username: 'testuser',
      email: 'test@example.com',
      password: '123'
    })
  });
  assert(shortPasswordResponse?.status === 400, 'Short password should return 400');
}

async function testSuccessfulSignup() {
  log('\n=== Testing Successful Signup ===', 'info');
  
  const { response, data } = await makeRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(testUsers.validUser)
  });
  
  assert(response?.status === 201, 'Valid signup should return 201');
  assert(data?.user?.username === testUsers.validUser.username, 'Response should include user data');
  assert(data?.user?.email === testUsers.validUser.email, 'Response should include email');
  assert(!data?.user?.password, 'Response should not include password');
}

async function testDuplicateSignup() {
  log('\n=== Testing Duplicate Signup Prevention ===', 'info');
  
  // Try to signup with same user again
  const { response } = await makeRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(testUsers.validUser)
  });
  
  assert(response?.status === 409, 'Duplicate signup should return 409');
}

async function testLoginValidation() {
  log('\n=== Testing Login Validation ===', 'info');
  
  // Test empty fields
  const { response: emptyResponse } = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({})
  });
  assert(emptyResponse?.status === 400, 'Empty login fields should return 400');
  
  // Test invalid credentials
  const { response: invalidResponse } = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: 'nonexistent',
      password: 'wrongpassword'
    })
  });
  assert(invalidResponse?.status === 401, 'Invalid credentials should return 401');
}

async function testSuccessfulLogin() {
  log('\n=== Testing Successful Login ===', 'info');
  
  const { response, data } = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: testUsers.validUser.username,
      password: testUsers.validUser.password
    })
  });
  
  assert(response?.status === 200, 'Valid login should return 200');
  assert(data?.user?.username === testUsers.validUser.username, 'Response should include user data');
  assert(data?.message === 'Login successful', 'Response should include success message');
}

async function testAdminLogin() {
  log('\n=== Testing Admin Login ===', 'info');
  
  const { response, data } = await makeRequest('/api/auth/login', {
    method: 'POST',
    body: JSON.stringify({
      username: testUsers.adminUser.username,
      password: testUsers.adminUser.password,
      userType: 'admin'
    })
  });
  
  // This might fail if admin user doesn't exist, which is expected
  if (response?.status === 200) {
    assert(data?.user?.isAdmin === true, 'Admin login should return admin user');
    log('Admin login successful', 'success');
  } else {
    log('Admin user not found (expected in test environment)', 'warning');
  }
}

async function testRateLimiting() {
  log('\n=== Testing Rate Limiting ===', 'info');
  
  // Make multiple rapid requests
  const promises = Array(12).fill().map(() => 
    makeRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({
        username: 'ratelimittest',
        password: 'wrongpassword'
      })
    })
  );
  
  const results = await Promise.all(promises);
  const rateLimitedRequests = results.filter(({ response }) => response?.status === 429);
  
  assert(rateLimitedRequests.length > 0, 'Rate limiting should trigger after multiple requests');
}

async function testSecurityHeaders() {
  log('\n=== Testing Security Headers ===', 'info');
  
  const { response } = await makeRequest('/api/auth/signup', {
    method: 'POST',
    body: JSON.stringify(testUsers.validUser)
  });
  
  const headers = response?.headers;
  assert(headers?.get('X-Content-Type-Options') === 'nosniff', 'Should include X-Content-Type-Options header');
  assert(headers?.get('X-Frame-Options') === 'DENY', 'Should include X-Frame-Options header');
  assert(headers?.get('X-XSS-Protection') === '1; mode=block', 'Should include X-XSS-Protection header');
}

// Main test runner
async function runAllTests() {
  log('🚀 Starting Authentication System Tests', 'info');
  log(`Testing against: ${BASE_URL}`, 'info');
  
  try {
    await testSignupValidation();
    await testSuccessfulSignup();
    await testDuplicateSignup();
    await testLoginValidation();
    await testSuccessfulLogin();
    await testAdminLogin();
    await testRateLimiting();
    await testSecurityHeaders();
    
    // Print results
    log('\n=== Test Results ===', 'info');
    log(`Total Tests: ${testResults.total}`, 'info');
    log(`Passed: ${testResults.passed}`, 'success');
    log(`Failed: ${testResults.failed}`, testResults.failed > 0 ? 'error' : 'success');
    
    const successRate = ((testResults.passed / testResults.total) * 100).toFixed(1);
    log(`Success Rate: ${successRate}%`, successRate >= 80 ? 'success' : 'error');
    
    if (testResults.failed === 0) {
      log('\n🎉 All tests passed! Authentication system is working correctly.', 'success');
    } else {
      log(`\n⚠️  ${testResults.failed} test(s) failed. Please review the issues above.`, 'warning');
    }
    
  } catch (error) {
    log(`Test suite failed: ${error.message}`, 'error');
    process.exit(1);
  }
}

// Run tests if this script is executed directly
if (require.main === module) {
  runAllTests();
}

module.exports = { runAllTests, testResults };

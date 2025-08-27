// Test script to verify authentication system
const bcrypt = require('bcryptjs');

async function testPasswordHashing() {
  console.log('🔐 Testing password hashing...');
  
  const password = 'testpassword123';
  const hashedPassword = await bcrypt.hash(password, 12);
  
  console.log('Original password:', password);
  console.log('Hashed password:', hashedPassword);
  
  const isValid = await bcrypt.compare(password, hashedPassword);
  console.log('Password verification:', isValid ? '✅ PASS' : '❌ FAIL');
  
  const isInvalid = await bcrypt.compare('wrongpassword', hashedPassword);
  console.log('Wrong password verification:', isInvalid ? '❌ FAIL' : '✅ PASS');
}

async function testJWT() {
  console.log('\n🔑 Testing JWT token generation...');
  
  try {
    // Set JWT_SECRET for testing
    process.env.JWT_SECRET = 'test-secret-key';
    
    const jwt = require('jsonwebtoken');
    
    const payload = {
      userId: '507f1f77bcf86cd799439011',
      username: 'testuser',
      email: 'test@example.com',
      isAdmin: false,
      type: 'user'
    };
    
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });
    console.log('Generated token:', token.substring(0, 50) + '...');
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log('Decoded payload:', decoded);
    console.log('JWT test:', '✅ PASS');
  } catch (error) {
    console.error('JWT test failed:', error.message);
    console.log('JWT test:', '❌ FAIL');
  }
}

async function testDatabaseConnection() {
  console.log('\n🗄️ Testing database connection...');
  
  try {
    const mongoose = require('mongoose');
    
    // Use the MongoDB URI from environment
    const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://puneetshukla041:zo6KoEIWALNm9d97@cluster0.lmeiugu.mongodb.net/employeeaccess?retryWrites=true&w=majority&appName=Cluster0';
    
    await mongoose.connect(MONGODB_URI);
    console.log('Database connection:', '✅ PASS');
    
    // Test collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Available collections:', collections.map(c => c.name));
    
    await mongoose.disconnect();
  } catch (error) {
    console.error('Database connection failed:', error.message);
    console.log('Database connection:', '❌ FAIL');
  }
}

async function runTests() {
  console.log('🧪 SSI Studios Authentication System Test\n');
  console.log('==========================================');
  
  await testPasswordHashing();
  await testJWT();
  await testDatabaseConnection();
  
  console.log('\n==========================================');
  console.log('🏁 Test completed!');
}

runTests().catch(console.error);

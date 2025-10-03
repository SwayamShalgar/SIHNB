require('dotenv').config();
const pinataService = require('./utils/pinataService');

async function testPinataConnection() {
  console.log('🧪 Testing Pinata Connection...\n');
  
  console.log('📋 Pinata Configuration:');
  console.log('API Key:', process.env.PINATA_API_KEY ? '✅ Set' : '❌ Not Set');
  console.log('API Secret:', process.env.PINATA_API_SECRET ? '✅ Set' : '❌ Not Set');
  console.log('JWT:', process.env.PINATA_JWT ? '✅ Set' : '❌ Not Set');
  console.log('Gateway:', process.env.PINATA_GATEWAY || 'https://gateway.pinata.cloud');
  console.log('\n');

  try {
    console.log('🔐 Testing authentication...');
    const authResult = await pinataService.testAuthentication();
    console.log('✅ Authentication successful!');
    console.log('Response:', authResult);
    console.log('\n');
    
    console.log('✅ Pinata is properly configured and ready to use!');
    console.log('📝 Certificates will be uploaded to IPFS when issued.\n');
    
    return true;
  } catch (error) {
    console.error('❌ Pinata authentication failed!');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Status:', error.response.status);
      console.error('Data:', error.response.data);
    }
    console.log('\n');
    return false;
  }
}

// Run the test
testPinataConnection()
  .then(() => {
    console.log('Test completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Test failed:', error);
    process.exit(1);
  });

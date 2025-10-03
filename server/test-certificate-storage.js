const axios = require('axios');

async function testCertificateStorage() {
  console.log('🧪 Testing Certificate Storage in PostgreSQL\n');

  try {
    // Step 1: Issue a certificate
    console.log('📝 Step 1: Issuing a new certificate...');
    const issueResponse = await axios.post('http://localhost:5001/api/certificates/issue', {
      learner_name: 'Test Student',
      learner_email: 'test@student.com',
      course_name: 'PostgreSQL Testing Course',
      institute_name: 'Test University',
      issue_date: '2025-10-03'
    });

    const certificateId = issueResponse.data.certificate.id;
    console.log(`✅ Certificate issued successfully!`);
    console.log(`   Certificate ID: ${certificateId}`);
    console.log(`   Certificate Hash: ${issueResponse.data.certificate.certificateHash}\n`);

    // Step 2: Wait a moment for async operations
    await new Promise(resolve => setTimeout(resolve, 1000));

    // Step 3: Retrieve from API
    console.log('📥 Step 2: Retrieving certificate from API...');
    const getResponse = await axios.get(`http://localhost:5001/api/certificates/${certificateId}`);
    
    console.log(`✅ Certificate retrieved successfully!`);
    console.log(`   Source: ${getResponse.data.source || 'Unknown'}`);
    console.log(`   Learner: ${getResponse.data.learner_name}`);
    console.log(`   Course: ${getResponse.data.course_name}\n`);

    // Step 4: Query PostgreSQL directly
    console.log('🔍 Step 3: Querying PostgreSQL directly...');
    const pool = require('./database/postgres');
    const pgResult = await pool.query('SELECT * FROM certificates WHERE id = $1', [certificateId]);
    
    if (pgResult.rows.length > 0) {
      console.log(`✅ Certificate found in PostgreSQL!`);
      console.log(`   Database Row:`, {
        id: pgResult.rows[0].id,
        learner_name: pgResult.rows[0].learner_name,
        course_name: pgResult.rows[0].course_name,
        certificate_hash: pgResult.rows[0].certificate_hash,
        created_at: pgResult.rows[0].created_at
      });
    } else {
      console.log(`❌ Certificate NOT found in PostgreSQL!`);
    }

    // Step 5: Count total certificates
    const countResult = await pool.query('SELECT COUNT(*) as count FROM certificates');
    console.log(`\n📊 Total certificates in PostgreSQL: ${countResult.rows[0].count}`);

    console.log('\n✅ Test completed successfully!');
    process.exit(0);

  } catch (error) {
    console.error('\n❌ Test failed!');
    console.error('Error:', error.message);
    if (error.response) {
      console.error('Response data:', error.response.data);
    }
    process.exit(1);
  }
}

testCertificateStorage();

require('dotenv').config();
const pinataService = require('./utils/pinataService');
const certificateGenerator = require('./utils/certificateGenerator');
const { v4: uuidv4 } = require('uuid');
const path = require('path');
const fs = require('fs');

async function testCertificateUpload() {
  console.log('🧪 Testing Certificate Upload to Pinata IPFS...\n');

  try {
    // Step 1: Generate a test certificate
    console.log('📝 Step 1: Generating test certificate PDF...');
    const certificateId = uuidv4();
    const testCertificateData = {
      learner_name: 'John Doe',
      course_name: 'Full Stack Web Development',
      institute_name: 'Test Institute',
      issue_date: new Date().toISOString().split('T')[0]
    };

    const pdfResult = await certificateGenerator.generatePDF(testCertificateData, certificateId);
    console.log(`✅ Certificate PDF generated: ${pdfResult.filename}`);
    console.log(`   Path: ${pdfResult.path}\n`);

    // Step 2: Upload to Pinata
    console.log('📤 Step 2: Uploading PDF to Pinata IPFS...');
    const pdfPath = path.join(__dirname, 'certificates', pdfResult.filename);
    
    // Check if file exists
    if (!fs.existsSync(pdfPath)) {
      throw new Error(`PDF file not found at: ${pdfPath}`);
    }

    const fileStats = fs.statSync(pdfPath);
    console.log(`   File size: ${(fileStats.size / 1024).toFixed(2)} KB`);

    const ipfsResult = await pinataService.uploadFile(pdfPath, {
      name: `test-certificate-${certificateId}.pdf`,
      certificateId: certificateId,
      learnerName: testCertificateData.learner_name,
      courseName: testCertificateData.course_name,
      issueDate: testCertificateData.issue_date
    });

    if (ipfsResult.success) {
      console.log('✅ PDF uploaded successfully to IPFS!\n');
      console.log('📋 Upload Details:');
      console.log('   IPFS Hash:', ipfsResult.IpfsHash);
      console.log('   Pin Size:', ipfsResult.PinSize, 'bytes');
      console.log('   Timestamp:', ipfsResult.Timestamp);
      console.log('\n🔗 Access URLs:');
      console.log('   Pinata Gateway:', ipfsResult.ipfsUrl);
      console.log('   Public IPFS:', ipfsResult.publicUrl);
      console.log('\n');

      // Step 3: Upload metadata JSON
      console.log('📤 Step 3: Uploading certificate metadata JSON...');
      const metadataJson = {
        certificateId: certificateId,
        learnerName: testCertificateData.learner_name,
        courseName: testCertificateData.course_name,
        instituteName: testCertificateData.institute_name,
        issueDate: testCertificateData.issue_date,
        pdfIpfsHash: ipfsResult.IpfsHash,
        pdfIpfsUrl: ipfsResult.ipfsUrl,
        createdAt: new Date().toISOString(),
        testUpload: true
      };

      const jsonResult = await pinataService.uploadJSON(metadataJson, {
        name: `test-certificate-metadata-${certificateId}.json`,
        certificateId: certificateId
      });

      if (jsonResult.success) {
        console.log('✅ Metadata JSON uploaded successfully!\n');
        console.log('📋 Metadata Details:');
        console.log('   IPFS Hash:', jsonResult.IpfsHash);
        console.log('   Metadata URL:', jsonResult.ipfsUrl);
        console.log('\n');
      }

      // Step 4: List pinned files
      console.log('📋 Step 4: Checking Pinata for uploaded files...');
      const pinnedFiles = await pinataService.getPinnedFiles({ 
        pageLimit: 10,
        status: 'pinned'
      });

      if (pinnedFiles && pinnedFiles.rows) {
        console.log(`✅ Found ${pinnedFiles.count} total pinned files on Pinata`);
        console.log(`   Showing last ${Math.min(5, pinnedFiles.rows.length)} files:\n`);
        
        pinnedFiles.rows.slice(0, 5).forEach((file, index) => {
          console.log(`   ${index + 1}. ${file.metadata.name || 'Unnamed'}`);
          console.log(`      Hash: ${file.ipfs_pin_hash}`);
          console.log(`      Size: ${(file.size / 1024).toFixed(2)} KB`);
          console.log(`      Date: ${new Date(file.date_pinned).toLocaleString()}`);
          console.log('');
        });
      }

      console.log('✅ Test completed successfully!');
      console.log('\n🎉 Your Pinata integration is working correctly!');
      console.log('📝 You can now view these files in your Pinata dashboard:');
      console.log('   https://app.pinata.cloud/pinmanager\n');

      // Clean up instructions
      console.log('🧹 Cleanup:');
      console.log(`   Test PDF location: ${pdfPath}`);
      console.log('   You can delete the test certificate file if needed.\n');

    } else {
      console.error('❌ Upload failed:', ipfsResult.message);
    }

  } catch (error) {
    console.error('\n❌ Test failed with error:');
    console.error('   Error:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Response:', error.response.data);
    }
    console.error('\n');
  }
}

// Run the test
testCertificateUpload()
  .then(() => {
    console.log('Test execution completed.');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Fatal error:', error);
    process.exit(1);
  });

console.log('═══════════════════════════════════════════════════════════');
console.log('🔍 Admin Dashboard Debug Helper');
console.log('═══════════════════════════════════════════════════════════\n');

// Check localStorage
console.log('📦 localStorage Check:');
const token = localStorage.getItem('token');
const user = localStorage.getItem('user');

if (token) {
  console.log('✅ Token exists:', token.substring(0, 30) + '...' + token.substring(token.length - 10));
  console.log('   Token length:', token.length, 'characters');
} else {
  console.log('❌ Token missing! You need to login.');
}

if (user) {
  try {
    const userData = JSON.parse(user);
    console.log('✅ User data:', userData);
    console.log('   Email:', userData.email);
    console.log('   Role:', userData.role);
  } catch (e) {
    console.log('❌ User data corrupted:', user);
  }
} else {
  console.log('❌ User data missing!');
}

console.log('\n───────────────────────────────────────────────────────────\n');

// Test API if token exists
if (token) {
  console.log('🔄 Testing API connection...\n');
  
  // Test /api/admin/users
  fetch('/api/admin/users', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => {
    console.log('📡 /api/admin/users - Status:', res.status, res.statusText);
    return res.json();
  })
  .then(data => {
    if (data.success) {
      console.log('✅ Users API working!');
      console.log('   Total users:', data.users.length);
      console.log('   Data source:', data.source);
      console.log('   First 3 users:');
      data.users.slice(0, 3).forEach((u, i) => {
        console.log(`   ${i + 1}. ${u.full_name} (${u.email}) - ${u.role}`);
      });
    } else {
      console.log('❌ API returned error:', data);
    }
  })
  .catch(err => {
    console.error('❌ Failed to fetch users:', err.message);
  });

  // Test /api/admin/stats
  fetch('/api/admin/stats', {
    headers: { 'Authorization': `Bearer ${token}` }
  })
  .then(res => {
    console.log('\n📡 /api/admin/stats - Status:', res.status, res.statusText);
    return res.json();
  })
  .then(data => {
    if (data.success) {
      console.log('✅ Stats API working!');
      console.log('   Students:', data.stats.totalStudents);
      console.log('   Institutes:', data.stats.totalInstitutes);
      console.log('   Companies:', data.stats.totalCompanies);
      console.log('   Admins:', data.stats.totalAdmins);
      console.log('   Certificates:', data.stats.totalCertificates);
    } else {
      console.log('❌ API returned error:', data);
    }
  })
  .catch(err => {
    console.error('❌ Failed to fetch stats:', err.message);
  });
  
  console.log('\n───────────────────────────────────────────────────────────');
  console.log('⏳ API tests running... Check results above ⬆️');
  console.log('═══════════════════════════════════════════════════════════');
} else {
  console.log('⚠️  Cannot test API without token. Please:');
  console.log('   1. Login at: http://localhost:3000/login');
  console.log('   2. Use: admin@certify.com / admin123');
  console.log('   3. Run this script again');
  console.log('═══════════════════════════════════════════════════════════');
}

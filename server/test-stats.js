// Quick test to verify database stats
const pool = require('./database/postgres');

async function testStats() {
  try {
    console.log('Testing database statistics...\n');

    // Test certificates count
    const certResult = await pool.query('SELECT COUNT(*) as count FROM certificates');
    console.log('Total certificates:', certResult.rows[0].count);

    // Test users count
    const usersResult = await pool.query('SELECT COUNT(*) as count FROM users');
    console.log('Total users:', usersResult.rows[0].count);

    // Test institutes count
    const institutesResult = await pool.query(
      "SELECT COUNT(*) as count FROM users WHERE role = 'Institute'"
    );
    console.log('Active institutes:', institutesResult.rows[0].count);

    // Test courses count
    const coursesResult = await pool.query('SELECT COUNT(*) as count FROM courses');
    console.log('Total courses:', coursesResult.rows[0].count);

    // List some users to verify data
    const usersListResult = await pool.query('SELECT id, full_name, email, role FROM users LIMIT 5');
    console.log('\nSample users:');
    usersListResult.rows.forEach(user => {
      console.log(`- ${user.full_name} (${user.email}) - ${user.role}`);
    });

    await pool.end();
    console.log('\n✓ Database test completed successfully');
  } catch (error) {
    console.error('Database test failed:', error.message);
    process.exit(1);
  }
}

testStats();

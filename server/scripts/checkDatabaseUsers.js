const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_2ghyseCmpNX7@ep-damp-truth-a10ix4ll-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

async function checkDatabaseUsers() {
  console.log('🔍 Checking Neon PostgreSQL Database Users...\n');
  
  try {
    // Get all users
    const usersResult = await pool.query(`
      SELECT 
        id, 
        email, 
        role, 
        full_name, 
        organization, 
        phone,
        created_at
      FROM users
      ORDER BY role, created_at DESC
    `);

    const users = usersResult.rows;
    console.log(`📊 Total Users in Database: ${users.length}\n`);

    // Group by role
    const usersByRole = {
      Admin: [],
      Institute: [],
      Student: [],
      Company: []
    };

    users.forEach(user => {
      if (usersByRole[user.role]) {
        usersByRole[user.role].push(user);
      }
    });

    // Display statistics
    console.log('📈 User Statistics:');
    console.log('═══════════════════════════════════════════════════════');
    console.log(`👤 Admins:     ${usersByRole.Admin.length}`);
    console.log(`🏛️  Institutes: ${usersByRole.Institute.length}`);
    console.log(`🎓 Students:   ${usersByRole.Student.length}`);
    console.log(`🏢 Companies:  ${usersByRole.Company.length}`);
    console.log('═══════════════════════════════════════════════════════\n');

    // Display all users by role
    for (const [role, roleUsers] of Object.entries(usersByRole)) {
      if (roleUsers.length > 0) {
        console.log(`\n${getRoleIcon(role)} ${role.toUpperCase()} USERS (${roleUsers.length}):`);
        console.log('─────────────────────────────────────────────────────────');
        
        roleUsers.forEach((user, index) => {
          console.log(`\n${index + 1}. ${user.full_name || 'No Name'}`);
          console.log(`   Email: ${user.email}`);
          console.log(`   Organization: ${user.organization || 'N/A'}`);
          console.log(`   Phone: ${user.phone || 'N/A'}`);
          console.log(`   Joined: ${new Date(user.created_at).toLocaleDateString()}`);
        });
      }
    }

    console.log('\n\n✅ All users from Neon PostgreSQL are displayed above.');
    console.log('These same users will appear in your Admin Dashboard.\n');

    // Get certificate count
    const certResult = await pool.query('SELECT COUNT(*) as count FROM certificates');
    console.log(`📜 Total Certificates in Database: ${certResult.rows[0].count}\n`);

  } catch (error) {
    console.error('❌ Error fetching users from database:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await pool.end();
  }
}

function getRoleIcon(role) {
  const icons = {
    Admin: '👤',
    Institute: '🏛️',
    Student: '🎓',
    Company: '🏢'
  };
  return icons[role] || '👥';
}

checkDatabaseUsers();

const bcrypt = require('bcryptjs');
const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_2ghyseCmpNX7@ep-damp-truth-a10ix4ll-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

const testUsers = [
  {
    email: 'admin@certify.com',
    password: 'admin123',
    role: 'Admin',
    full_name: 'System Administrator',
    organization: 'Certify Platform',
    phone: '+1234567890'
  },
  {
    email: 'institute@university.edu',
    password: 'institute123',
    role: 'Institute',
    full_name: 'University Admin',
    organization: 'Global University',
    phone: '+1234567891'
  },
  {
    email: 'student@university.edu',
    password: 'student123',
    role: 'Student',
    full_name: 'John Doe',
    organization: 'Global University',
    phone: '+1234567892'
  },
  {
    email: 'hr@company.com',
    password: 'company123',
    role: 'Company',
    full_name: 'HR Manager',
    organization: 'Tech Corporation',
    phone: '+1234567893'
  }
];

async function seedTestUsers() {
  console.log('🌱 Seeding test users...');

  try {
    for (const user of testUsers) {
      // Check if user already exists
      const existing = await pool.query(
        'SELECT * FROM users WHERE email = $1',
        [user.email]
      );

      if (existing.rows.length > 0) {
        console.log(`⚠️  User ${user.email} already exists, skipping...`);
        continue;
      }

      // Hash password
      const hashedPassword = await bcrypt.hash(user.password, 10);

      // Insert user
      await pool.query(
        `INSERT INTO users (email, password, role, full_name, organization, phone) 
         VALUES ($1, $2, $3, $4, $5, $6)`,
        [user.email, hashedPassword, user.role, user.full_name, user.organization, user.phone]
      );

      console.log(`✅ Created ${user.role} user: ${user.email}`);
    }

    console.log('\n🎉 Test users seeded successfully!');
    console.log('\nTest Credentials:');
    console.log('=====================================');
    testUsers.forEach(user => {
      console.log(`\n${user.role}:`);
      console.log(`  Email: ${user.email}`);
      console.log(`  Password: ${user.password}`);
    });
    console.log('\n=====================================');

  } catch (error) {
    console.error('❌ Error seeding users:', error);
  } finally {
    await pool.end();
  }
}

seedTestUsers();

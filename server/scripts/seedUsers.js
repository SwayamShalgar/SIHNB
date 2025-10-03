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
  // Institutes
  {
    email: 'institute@university.edu',
    password: 'institute123',
    role: 'Institute',
    full_name: 'University Admin',
    organization: 'Global University',
    phone: '+1234567891'
  },
  {
    email: 'admin@mit.edu',
    password: 'institute123',
    role: 'Institute',
    full_name: 'MIT Admin',
    organization: 'Massachusetts Institute of Technology',
    phone: '+1234567894'
  },
  {
    email: 'admin@stanford.edu',
    password: 'institute123',
    role: 'Institute',
    full_name: 'Stanford Admin',
    organization: 'Stanford University',
    phone: '+1234567895'
  },
  {
    email: 'admin@harvard.edu',
    password: 'institute123',
    role: 'Institute',
    full_name: 'Harvard Admin',
    organization: 'Harvard University',
    phone: '+1234567896'
  },
  // Students
  {
    email: 'student@university.edu',
    password: 'student123',
    role: 'Student',
    full_name: 'John Doe',
    organization: 'Global University',
    phone: '+1234567892'
  },
  {
    email: 'jane.smith@student.edu',
    password: 'student123',
    role: 'Student',
    full_name: 'Jane Smith',
    organization: 'MIT',
    phone: '+1234567897'
  },
  {
    email: 'michael.brown@student.edu',
    password: 'student123',
    role: 'Student',
    full_name: 'Michael Brown',
    organization: 'Stanford University',
    phone: '+1234567898'
  },
  {
    email: 'sarah.wilson@student.edu',
    password: 'student123',
    role: 'Student',
    full_name: 'Sarah Wilson',
    organization: 'Harvard University',
    phone: '+1234567899'
  },
  {
    email: 'david.lee@student.edu',
    password: 'student123',
    role: 'Student',
    full_name: 'David Lee',
    organization: 'Global University',
    phone: '+1234567800'
  },
  {
    email: 'emily.davis@student.edu',
    password: 'student123',
    role: 'Student',
    full_name: 'Emily Davis',
    organization: 'MIT',
    phone: '+1234567801'
  },
  {
    email: 'robert.johnson@student.edu',
    password: 'student123',
    role: 'Student',
    full_name: 'Robert Johnson',
    organization: 'Stanford University',
    phone: '+1234567802'
  },
  {
    email: 'lisa.anderson@student.edu',
    password: 'student123',
    role: 'Student',
    full_name: 'Lisa Anderson',
    organization: 'Harvard University',
    phone: '+1234567803'
  },
  // Companies
  {
    email: 'hr@company.com',
    password: 'company123',
    role: 'Company',
    full_name: 'HR Manager',
    organization: 'Tech Corporation',
    phone: '+1234567893'
  },
  {
    email: 'hr@google.com',
    password: 'company123',
    role: 'Company',
    full_name: 'Google HR',
    organization: 'Google Inc.',
    phone: '+1234567804'
  },
  {
    email: 'hr@microsoft.com',
    password: 'company123',
    role: 'Company',
    full_name: 'Microsoft HR',
    organization: 'Microsoft Corporation',
    phone: '+1234567805'
  },
  {
    email: 'hr@amazon.com',
    password: 'company123',
    role: 'Company',
    full_name: 'Amazon HR',
    organization: 'Amazon.com Inc.',
    phone: '+1234567806'
  },
  {
    email: 'hr@apple.com',
    password: 'company123',
    role: 'Company',
    full_name: 'Apple HR',
    organization: 'Apple Inc.',
    phone: '+1234567807'
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

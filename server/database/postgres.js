const { Pool } = require('pg');

const pool = new Pool({
  connectionString: 'postgresql://neondb_owner:npg_2ghyseCmpNX7@ep-damp-truth-a10ix4ll-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require',
  ssl: {
    rejectUnauthorized: false
  }
});

// Initialize users table
const initializeUsersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Institute', 'Student', 'Company')),
        full_name VARCHAR(255),
        organization VARCHAR(255),
        phone VARCHAR(50),
        verified BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Add verified column if it doesn't exist (for existing databases)
    try {
      await pool.query(`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS verified BOOLEAN DEFAULT TRUE
      `);
    } catch (alterError) {
      // Column might already exist, ignore error
    }

    console.log('✅ Users table initialized successfully');
  } catch (error) {
    console.error('Error initializing users table:', error);
  }
};

// Initialize certificates table in PostgreSQL
const initializeCertificatesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS certificates (
        id VARCHAR(255) PRIMARY KEY,
        learner_name VARCHAR(255) NOT NULL,
        learner_email VARCHAR(255),
        course_name VARCHAR(255) NOT NULL,
        institute_name VARCHAR(255) NOT NULL,
        issue_date DATE NOT NULL,
        certificate_hash VARCHAR(255) NOT NULL,
        blockchain_tx_hash VARCHAR(255),
        pdf_path VARCHAR(255),
        qr_code TEXT,
        ipfs_hash VARCHAR(255),
        ipfs_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create index on certificate_hash for faster lookups
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_certificate_hash 
      ON certificates(certificate_hash)
    `);

    // Create index on learner_email for student queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_learner_email 
      ON certificates(learner_email)
    `);

    console.log('✅ Certificates table initialized successfully in PostgreSQL');
  } catch (error) {
    console.error('Error initializing certificates table:', error);
  }
};

// Test database connection
const testConnection = async () => {
  try {
    const result = await pool.query('SELECT NOW()');
    console.log('🔌 PostgreSQL connection successful at:', result.rows[0].now);
    return true;
  } catch (error) {
    console.error('❌ PostgreSQL connection failed:', error.message);
    return false;
  }
};

// Initialize courses table in PostgreSQL
const initializeCoursesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS courses (
        id VARCHAR(255) PRIMARY KEY,
        institute_id INTEGER NOT NULL,
        course_code VARCHAR(50) NOT NULL,
        course_name VARCHAR(255) NOT NULL,
        course_description TEXT,
        duration VARCHAR(50),
        duration_unit VARCHAR(20),
        level VARCHAR(50),
        category VARCHAR(100),
        credits VARCHAR(20),
        instructor_name VARCHAR(255),
        department VARCHAR(255),
        prerequisites TEXT,
        learning_outcomes TEXT,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (institute_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    // Create index for faster course queries by institute
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_courses_institute 
      ON courses(institute_id)
    `);

    // Create index for course code queries
    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_courses_code 
      ON courses(course_code)
    `);

    console.log('✅ Courses table initialized successfully in PostgreSQL');
  } catch (error) {
    console.error('Error initializing courses table:', error);
  }
};

// Initialize all tables on module load
const initializeTables = async () => {
  const connected = await testConnection();
  if (!connected) {
    console.error('⚠️ Skipping table initialization due to connection failure');
    return;
  }
  
  await initializeUsersTable();
  await initializeCertificatesTable();
  await initializeCoursesTable();
};

initializeTables();

module.exports = pool;

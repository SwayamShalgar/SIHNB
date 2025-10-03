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

// Initialize student profiles table
const initializeStudentProfilesTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS student_profiles (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL UNIQUE,
        skills TEXT[],
        cgpa DECIMAL(4,2),
        graduation_year INTEGER,
        degree VARCHAR(255),
        specialization VARCHAR(255),
        bio TEXT,
        resume_url VARCHAR(500),
        linkedin_url VARCHAR(500),
        github_url VARCHAR(500),
        visible_to_companies BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_student_profiles_user 
      ON student_profiles(user_id)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_student_profiles_visible 
      ON student_profiles(visible_to_companies)
    `);

    console.log('✅ Student profiles table initialized successfully');
  } catch (error) {
    console.error('Error initializing student profiles table:', error);
  }
};

// Initialize job postings table
const initializeJobPostingsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_postings (
        id SERIAL PRIMARY KEY,
        company_id INTEGER NOT NULL,
        job_title VARCHAR(255) NOT NULL,
        job_description TEXT NOT NULL,
        job_type VARCHAR(50),
        location VARCHAR(255),
        salary_range VARCHAR(100),
        required_skills TEXT[],
        min_cgpa DECIMAL(4,2),
        experience_required VARCHAR(100),
        application_deadline DATE,
        status VARCHAR(20) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_job_postings_company 
      ON job_postings(company_id)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_job_postings_status 
      ON job_postings(status)
    `);

    console.log('✅ Job postings table initialized successfully');
  } catch (error) {
    console.error('Error initializing job postings table:', error);
  }
};

// Initialize job applications table
const initializeJobApplicationsTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_applications (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        cover_letter TEXT,
        status VARCHAR(50) DEFAULT 'pending',
        applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        UNIQUE(job_id, student_id)
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_applications_job 
      ON job_applications(job_id)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_applications_student 
      ON job_applications(student_id)
    `);

    console.log('✅ Job applications table initialized successfully');
  } catch (error) {
    console.error('Error initializing job applications table:', error);
  }
};

// Initialize job offers table
const initializeJobOffersTable = async () => {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS job_offers (
        id SERIAL PRIMARY KEY,
        job_id INTEGER NOT NULL,
        student_id INTEGER NOT NULL,
        company_id INTEGER NOT NULL,
        offer_letter TEXT,
        salary_offered VARCHAR(100),
        joining_date DATE,
        status VARCHAR(50) DEFAULT 'pending',
        sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        responded_at TIMESTAMP,
        FOREIGN KEY (job_id) REFERENCES job_postings(id) ON DELETE CASCADE,
        FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
        FOREIGN KEY (company_id) REFERENCES users(id) ON DELETE CASCADE
      )
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_offers_student 
      ON job_offers(student_id)
    `);

    await pool.query(`
      CREATE INDEX IF NOT EXISTS idx_offers_company 
      ON job_offers(company_id)
    `);

    console.log('✅ Job offers table initialized successfully');
  } catch (error) {
    console.error('Error initializing job offers table:', error);
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
  await initializeStudentProfilesTable();
  await initializeJobPostingsTable();
  await initializeJobApplicationsTable();
  await initializeJobOffersTable();
};

initializeTables();

module.exports = pool;

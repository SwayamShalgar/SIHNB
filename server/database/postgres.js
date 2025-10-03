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
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);

    console.log('✅ Users table initialized successfully');
  } catch (error) {
    console.error('Error initializing users table:', error);
  }
};

// Initialize the table on module load
initializeUsersTable();

module.exports = pool;

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid');
const db = require('../database/init');
const pool = require('../database/postgres');

// Get all courses for an institute
router.get('/institute/:instituteId', async (req, res) => {
  const { instituteId } = req.params;

  try {
    // Try PostgreSQL first
    const pgResult = await pool.query(
      'SELECT * FROM courses WHERE institute_id = $1 ORDER BY created_at DESC',
      [instituteId]
    );

    if (pgResult.rows.length > 0 || pgResult.rowCount === 0) {
      return res.json({
        courses: pgResult.rows,
        source: 'postgresql'
      });
    }
  } catch (pgError) {
    console.error('PostgreSQL query failed:', pgError.message);
  }

  // Fallback to SQLite
  const sql = 'SELECT * FROM courses WHERE institute_id = ? ORDER BY created_at DESC';
  db.all(sql, [instituteId], (err, rows) => {
    if (err) {
      console.error('SQLite error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      courses: rows || [],
      source: 'sqlite'
    });
  });
});

// Get single course by ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Try PostgreSQL first
    const pgResult = await pool.query(
      'SELECT * FROM courses WHERE id = $1',
      [id]
    );

    if (pgResult.rows.length > 0) {
      return res.json({
        course: pgResult.rows[0],
        source: 'postgresql'
      });
    }
  } catch (pgError) {
    console.error('PostgreSQL query failed:', pgError.message);
  }

  // Fallback to SQLite
  const sql = 'SELECT * FROM courses WHERE id = ?';
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error('SQLite error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    if (!row) {
      return res.status(404).json({ error: 'Course not found' });
    }

    res.json({
      course: row,
      source: 'sqlite'
    });
  });
});

// Create a new course
router.post('/', async (req, res) => {
  try {
    const {
      institute_id,
      course_code,
      course_name,
      course_description,
      duration,
      duration_unit,
      level,
      category,
      credits,
      instructor_name,
      department,
      prerequisites,
      learning_outcomes
    } = req.body;

    // Validation - only course_name and institute_id are required
    if (!institute_id || !course_name) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['institute_id', 'course_name']
      });
    }

    const courseId = uuidv4();
    const now = new Date().toISOString();

    // Try PostgreSQL first
    try {
      await pool.query(
        `INSERT INTO courses (
          id, institute_id, course_code, course_name, course_description,
          duration, duration_unit, level, category, credits,
          instructor_name, department, prerequisites, learning_outcomes,
          status, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17)`,
        [
          courseId,
          institute_id,
          course_code,
          course_name,
          course_description || null,
          duration || null,
          duration_unit || null,
          level || null,
          category || null,
          credits || null,
          instructor_name || null,
          department || null,
          prerequisites || null,
          learning_outcomes || null,
          'active',
          now,
          now
        ]
      );

      console.log(`✅ Course ${courseId} stored in PostgreSQL`);
    } catch (pgError) {
      console.error('PostgreSQL storage error:', pgError.message);
    }

    // Also store in SQLite
    const sql = `
      INSERT INTO courses (
        id, institute_id, course_code, course_name, course_description,
        duration, duration_unit, level, category, credits,
        instructor_name, department, prerequisites, learning_outcomes,
        status, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    db.run(sql, [
      courseId,
      institute_id,
      course_code,
      course_name,
      course_description || null,
      duration || null,
      duration_unit || null,
      level || null,
      category || null,
      credits || null,
      instructor_name || null,
      department || null,
      prerequisites || null,
      learning_outcomes || null,
      'active',
      now,
      now
    ], function(err) {
      if (err) {
        console.error('SQLite database error:', err);
        return res.status(500).json({ error: 'Failed to store course' });
      }

      console.log(`✅ Course ${courseId} stored in SQLite`);

      res.status(201).json({
        success: true,
        message: 'Course created successfully',
        course: {
          id: courseId,
          institute_id,
          course_code,
          course_name,
          course_description,
          duration,
          duration_unit,
          level,
          category,
          credits,
          instructor_name,
          department,
          prerequisites,
          learning_outcomes,
          status: 'active',
          created_at: now
        }
      });
    });
  } catch (error) {
    console.error('Error creating course:', error);
    res.status(500).json({ error: 'Failed to create course' });
  }
});

// Update a course
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const {
      course_code,
      course_name,
      course_description,
      duration,
      duration_unit,
      level,
      category,
      credits,
      instructor_name,
      department,
      prerequisites,
      learning_outcomes,
      status
    } = req.body;

    const now = new Date().toISOString();

    // Try PostgreSQL first
    try {
      const pgResult = await pool.query(
        `UPDATE courses SET
          course_code = $1,
          course_name = $2,
          course_description = $3,
          duration = $4,
          duration_unit = $5,
          level = $6,
          category = $7,
          credits = $8,
          instructor_name = $9,
          department = $10,
          prerequisites = $11,
          learning_outcomes = $12,
          status = $13,
          updated_at = $14
        WHERE id = $15
        RETURNING *`,
        [
          course_code,
          course_name,
          course_description,
          duration,
          duration_unit,
          level,
          category,
          credits,
          instructor_name,
          department,
          prerequisites,
          learning_outcomes,
          status || 'active',
          now,
          id
        ]
      );

      if (pgResult.rowCount > 0) {
        console.log(`✅ Course ${id} updated in PostgreSQL`);
      }
    } catch (pgError) {
      console.error('PostgreSQL update error:', pgError.message);
    }

    // Also update in SQLite
    const sql = `
      UPDATE courses SET
        course_code = ?,
        course_name = ?,
        course_description = ?,
        duration = ?,
        duration_unit = ?,
        level = ?,
        category = ?,
        credits = ?,
        instructor_name = ?,
        department = ?,
        prerequisites = ?,
        learning_outcomes = ?,
        status = ?,
        updated_at = ?
      WHERE id = ?
    `;

    db.run(sql, [
      course_code,
      course_name,
      course_description,
      duration,
      duration_unit,
      level,
      category,
      credits,
      instructor_name,
      department,
      prerequisites,
      learning_outcomes,
      status || 'active',
      now,
      id
    ], function(err) {
      if (err) {
        console.error('SQLite update error:', err);
        return res.status(500).json({ error: 'Failed to update course' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }

      console.log(`✅ Course ${id} updated in SQLite`);

      res.json({
        success: true,
        message: 'Course updated successfully',
        course: {
          id,
          course_code,
          course_name,
          course_description,
          duration,
          duration_unit,
          level,
          category,
          credits,
          instructor_name,
          department,
          prerequisites,
          learning_outcomes,
          status: status || 'active',
          updated_at: now
        }
      });
    });
  } catch (error) {
    console.error('Error updating course:', error);
    res.status(500).json({ error: 'Failed to update course' });
  }
});

// Delete a course
router.delete('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Try PostgreSQL first
    try {
      const pgResult = await pool.query('DELETE FROM courses WHERE id = $1', [id]);
      if (pgResult.rowCount > 0) {
        console.log(`✅ Course ${id} deleted from PostgreSQL`);
      }
    } catch (pgError) {
      console.error('PostgreSQL delete error:', pgError.message);
    }

    // Also delete from SQLite
    const sql = 'DELETE FROM courses WHERE id = ?';
    db.run(sql, [id], function(err) {
      if (err) {
        console.error('SQLite delete error:', err);
        return res.status(500).json({ error: 'Failed to delete course' });
      }

      if (this.changes === 0) {
        return res.status(404).json({ error: 'Course not found' });
      }

      console.log(`✅ Course ${id} deleted from SQLite`);

      res.json({
        success: true,
        message: 'Course deleted successfully'
      });
    });
  } catch (error) {
    console.error('Error deleting course:', error);
    res.status(500).json({ error: 'Failed to delete course' });
  }
});

// Get all active courses (for dropdown)
router.get('/', async (req, res) => {
  try {
    // Try PostgreSQL first
    const pgResult = await pool.query(
      "SELECT * FROM courses WHERE status = 'active' ORDER BY course_name ASC"
    );

    if (pgResult.rows.length > 0) {
      return res.json({
        courses: pgResult.rows,
        source: 'postgresql'
      });
    }
  } catch (pgError) {
    console.error('PostgreSQL query failed:', pgError.message);
  }

  // Fallback to SQLite
  const sql = "SELECT * FROM courses WHERE status = 'active' ORDER BY course_name ASC";
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error('SQLite error:', err);
      return res.status(500).json({ error: 'Database error' });
    }

    res.json({
      courses: rows || [],
      source: 'sqlite'
    });
  });
});

module.exports = router;

import React, { useState, useEffect } from 'react';
import { Plus, X, Edit2, Trash2, Save, BookOpen, Clock, Award, Users, GraduationCap, CheckCircle } from 'lucide-react';
import axios from 'axios';
import './CourseManagement.css';

const CourseManagement = ({ instituteId }) => {
  const [courses, setCourses] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    course_description: '',
    duration: '',
    duration_unit: 'months',
    level: 'Beginner',
    category: '',
    credits: '',
    instructor_name: '',
    department: '',
    prerequisites: '',
    learning_outcomes: ''
  });

  useEffect(() => {
    fetchCourses();
  }, [instituteId]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/courses/institute/${instituteId}`);
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const resetForm = () => {
    setFormData({
      course_code: '',
      course_name: '',
      course_description: '',
      duration: '',
      duration_unit: 'months',
      level: 'Beginner',
      category: '',
      credits: '',
      instructor_name: '',
      department: '',
      prerequisites: '',
      learning_outcomes: ''
    });
    setEditingCourse(null);
    setShowForm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const courseData = {
        ...formData,
        institute_id: instituteId
      };

      if (editingCourse) {
        // Update existing course
        await axios.put(`/api/courses/${editingCourse.id}`, courseData);
      } else {
        // Create new course
        await axios.post('/api/courses', courseData);
      }

      await fetchCourses();
      resetForm();
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Failed to save course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course) => {
    setFormData({
      course_code: course.course_code || '',
      course_name: course.course_name || '',
      course_description: course.course_description || '',
      duration: course.duration || '',
      duration_unit: course.duration_unit || 'months',
      level: course.level || 'Beginner',
      category: course.category || '',
      credits: course.credits || '',
      instructor_name: course.instructor_name || '',
      department: course.department || '',
      prerequisites: course.prerequisites || '',
      learning_outcomes: course.learning_outcomes || ''
    });
    setEditingCourse(course);
    setShowForm(true);
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course?')) {
      return;
    }

    try {
      setLoading(true);
      await axios.delete(`/api/courses/${courseId}`);
      await fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="course-management">
      <div className="course-header">
        <div className="course-header-content">
          <h2>
            <BookOpen size={24} />
            Course Management
          </h2>
          <p>Manage your institute's courses and certifications</p>
        </div>
        <button
          className="btn-add-course"
          onClick={() => setShowForm(true)}
          disabled={loading}
        >
          <Plus size={20} />
          Add New Course
        </button>
      </div>

      {showForm && (
        <div className="course-modal">
          <div className="course-modal-content">
            <div className="modal-header">
              <h3>{editingCourse ? 'Edit Course' : 'Add New Course'}</h3>
              <button className="btn-close" onClick={resetForm}>
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="course-form">
              <div className="form-grid">
                {/* Course Code */}
                <div className="form-group">
                  <label>
                    Course Code <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="course_code"
                    value={formData.course_code}
                    onChange={handleInputChange}
                    placeholder="e.g., CS101"
                    required
                  />
                </div>

                {/* Course Name */}
                <div className="form-group full-width">
                  <label>
                    Course Name <span className="required">*</span>
                  </label>
                  <input
                    type="text"
                    name="course_name"
                    value={formData.course_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Introduction to Computer Science"
                    required
                  />
                </div>

                {/* Category */}
                <div className="form-group">
                  <label>Category</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science"
                  />
                </div>

                {/* Level */}
                <div className="form-group">
                  <label>Level</label>
                  <select
                    name="level"
                    value={formData.level}
                    onChange={handleInputChange}
                  >
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                    <option value="Expert">Expert</option>
                  </select>
                </div>

                {/* Duration */}
                <div className="form-group">
                  <label>Duration</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleInputChange}
                    placeholder="e.g., 6"
                    min="1"
                  />
                </div>

                {/* Duration Unit */}
                <div className="form-group">
                  <label>Duration Unit</label>
                  <select
                    name="duration_unit"
                    value={formData.duration_unit}
                    onChange={handleInputChange}
                  >
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>

                {/* Credits */}
                <div className="form-group">
                  <label>Credits</label>
                  <input
                    type="text"
                    name="credits"
                    value={formData.credits}
                    onChange={handleInputChange}
                    placeholder="e.g., 3"
                  />
                </div>

                {/* Department */}
                <div className="form-group">
                  <label>Department</label>
                  <input
                    type="text"
                    name="department"
                    value={formData.department}
                    onChange={handleInputChange}
                    placeholder="e.g., Computer Science"
                  />
                </div>

                {/* Instructor Name */}
                <div className="form-group">
                  <label>Instructor Name</label>
                  <input
                    type="text"
                    name="instructor_name"
                    value={formData.instructor_name}
                    onChange={handleInputChange}
                    placeholder="e.g., Dr. John Smith"
                  />
                </div>

                {/* Course Description */}
                <div className="form-group full-width">
                  <label>Course Description</label>
                  <textarea
                    name="course_description"
                    value={formData.course_description}
                    onChange={handleInputChange}
                    placeholder="Provide a detailed description of the course..."
                    rows="4"
                  />
                </div>

                {/* Prerequisites */}
                <div className="form-group full-width">
                  <label>Prerequisites</label>
                  <textarea
                    name="prerequisites"
                    value={formData.prerequisites}
                    onChange={handleInputChange}
                    placeholder="List any prerequisites for this course (comma separated)..."
                    rows="2"
                  />
                </div>

                {/* Learning Outcomes */}
                <div className="form-group full-width">
                  <label>Learning Outcomes</label>
                  <textarea
                    name="learning_outcomes"
                    value={formData.learning_outcomes}
                    onChange={handleInputChange}
                    placeholder="List the key learning outcomes (comma separated or line separated)..."
                    rows="3"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={resetForm}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-save"
                  disabled={loading}
                >
                  <Save size={18} />
                  {loading ? 'Saving...' : editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Course List */}
      <div className="courses-grid">
        {loading && courses.length === 0 ? (
          <div className="loading-state">Loading courses...</div>
        ) : courses.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={48} />
            <h3>No Courses Yet</h3>
            <p>Start by adding your first course</p>
          </div>
        ) : (
          courses.map((course) => (
            <div key={course.id} className="course-card">
              <div className="course-card-header">
                <div className="course-code">{course.course_code}</div>
                <div className="course-actions">
                  <button
                    className="btn-icon-small"
                    onClick={() => handleEdit(course)}
                    title="Edit"
                  >
                    <Edit2 size={16} />
                  </button>
                  <button
                    className="btn-icon-small btn-danger"
                    onClick={() => handleDelete(course.id)}
                    title="Delete"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              <div className="course-card-body">
                <h4>{course.course_name}</h4>
                {course.course_description && (
                  <p className="course-desc">
                    {course.course_description.substring(0, 100)}
                    {course.course_description.length > 100 ? '...' : ''}
                  </p>
                )}

                <div className="course-meta">
                  {course.duration && (
                    <div className="meta-item">
                      <Clock size={16} />
                      <span>{course.duration} {course.duration_unit}</span>
                    </div>
                  )}
                  {course.level && (
                    <div className="meta-item">
                      <Award size={16} />
                      <span>{course.level}</span>
                    </div>
                  )}
                  {course.credits && (
                    <div className="meta-item">
                      <GraduationCap size={16} />
                      <span>{course.credits} Credits</span>
                    </div>
                  )}
                </div>

                {course.instructor_name && (
                  <div className="course-instructor">
                    <Users size={14} />
                    <span>Instructor: {course.instructor_name}</span>
                  </div>
                )}

                <div className="course-status">
                  <CheckCircle size={14} />
                  <span>Active</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default CourseManagement;

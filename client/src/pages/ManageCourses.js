import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Shield, ArrowLeft, BookOpen, Plus, Edit2, Trash2, Save, X, Search, Filter } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import '../styles/ManageCourses.css';

const ManageCourses = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [filteredCourses, setFilteredCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [formData, setFormData] = useState({
    course_code: '',
    course_name: '',
    course_description: '',
    duration: '',
    duration_unit: 'months',
    level: 'Beginner',
    category: '',
    status: 'active'
  });

  useEffect(() => {
    if (user?.role !== 'institute') {
      navigate('/dashboard');
      return;
    }
    fetchCourses();
  }, [user]);

  useEffect(() => {
    filterCourses();
  }, [courses, searchTerm, filterStatus]);

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`/api/courses/institute/${user.id}`);
      setCourses(response.data.courses || []);
    } catch (error) {
      console.error('Error fetching courses:', error);
      alert('Failed to load courses. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const filterCourses = () => {
    let filtered = [...courses];

    // Filter by status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(course => course.status === filterStatus);
    }

    // Filter by search term
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(course =>
        course.course_name.toLowerCase().includes(search) ||
        course.course_code.toLowerCase().includes(search) ||
        (course.category && course.category.toLowerCase().includes(search)) ||
        (course.instructor_name && course.instructor_name.toLowerCase().includes(search))
      );
    }

    setFilteredCourses(filtered);
  };

  const handleOpenModal = (course = null) => {
    if (course) {
      setEditingCourse(course);
      setFormData({
        course_code: course.course_code || '',
        course_name: course.course_name || '',
        course_description: course.course_description || '',
        duration: course.duration || '',
        duration_unit: course.duration_unit || 'months',
        level: course.level || 'Beginner',
        category: course.category || '',
        status: course.status || 'active'
      });
    } else {
      setEditingCourse(null);
      setFormData({
        course_code: '',
        course_name: '',
        course_description: '',
        duration: '',
        duration_unit: 'months',
        level: 'Beginner',
        category: '',
        status: 'active'
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setEditingCourse(null);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.course_name) {
      alert('Course name is required!');
      return;
    }

    try {
      const payload = {
        ...formData,
        institute_id: user.id,
        // Auto-generate course code if not provided
        course_code: formData.course_code || `COURSE-${Date.now().toString().slice(-6)}`
      };

      if (editingCourse) {
        // Update existing course
        await axios.put(`/api/courses/${editingCourse.id}`, payload);
        alert('Course updated successfully!');
      } else {
        // Create new course
        await axios.post('/api/courses', payload);
        alert('Course created successfully!');
      }

      handleCloseModal();
      fetchCourses();
    } catch (error) {
      console.error('Error saving course:', error);
      alert(error.response?.data?.error || 'Failed to save course. Please try again.');
    }
  };

  const handleDelete = async (courseId) => {
    if (!window.confirm('Are you sure you want to delete this course? This action cannot be undone.')) {
      return;
    }

    try {
      await axios.delete(`/api/courses/${courseId}`);
      alert('Course deleted successfully!');
      fetchCourses();
    } catch (error) {
      console.error('Error deleting course:', error);
      alert('Failed to delete course. Please try again.');
    }
  };

  const handleToggleStatus = async (course) => {
    try {
      const newStatus = course.status === 'active' ? 'inactive' : 'active';
      await axios.put(`/api/courses/${course.id}`, {
        ...course,
        status: newStatus
      });
      fetchCourses();
    } catch (error) {
      console.error('Error updating course status:', error);
      alert('Failed to update course status.');
    }
  };

  return (
    <div className="manage-courses-page">
      <nav className="navbar">
        <div className="nav-container">
          <div className="nav-logo" onClick={() => navigate('/')}>
            <Shield className="logo-icon" />
            <span className="logo-text">Certify</span>
          </div>
          <button onClick={() => navigate('/institute-dashboard')} className="btn-back">
            <ArrowLeft size={20} />
            Back to Dashboard
          </button>
        </div>
      </nav>

      <div className="courses-container">
        <div className="courses-header">
          <div className="header-content">
            <div className="header-icon">
              <BookOpen size={32} />
            </div>
            <div>
              <h1>Manage Courses</h1>
              <p>Create and manage your institution's courses</p>
            </div>
          </div>
          <button className="btn-create" onClick={() => handleOpenModal()}>
            <Plus size={20} />
            Create Course
          </button>
        </div>

        <div className="courses-filters">
          <div className="search-box">
            <Search size={18} />
            <input
              type="text"
              placeholder="Search courses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="filter-box">
            <Filter size={18} />
            <select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <BookOpen size={48} />
            <p>Loading courses...</p>
          </div>
        ) : filteredCourses.length === 0 ? (
          <div className="empty-state">
            <BookOpen size={64} />
            <h2>No courses found</h2>
            <p>
              {searchTerm || filterStatus !== 'all'
                ? 'Try adjusting your filters'
                : 'Get started by creating your first course'}
            </p>
            {!searchTerm && filterStatus === 'all' && (
              <button className="btn-create" onClick={() => handleOpenModal()}>
                <Plus size={20} />
                Create Your First Course
              </button>
            )}
          </div>
        ) : (
          <div className="courses-grid">
            {filteredCourses.map((course) => (
              <div key={course.id} className={`course-card ${course.status}`}>
                <div className="course-header">
                  <div className="course-code-badge">{course.course_code}</div>
                  <div className={`status-badge ${course.status}`}>
                    {course.status}
                  </div>
                </div>
                <h3 className="course-title">{course.course_name}</h3>
                {course.course_description && (
                  <p className="course-description">{course.course_description}</p>
                )}
                <div className="course-meta">
                  {course.category && (
                    <span className="meta-item">
                      <BookOpen size={14} />
                      {course.category}
                    </span>
                  )}
                  {course.level && (
                    <span className="meta-item level">{course.level}</span>
                  )}
                  {course.duration && (
                    <span className="meta-item">
                      {course.duration} {course.duration_unit}
                    </span>
                  )}
                  {course.credits && (
                    <span className="meta-item">{course.credits} Credits</span>
                  )}
                </div>
                {course.instructor_name && (
                  <div className="instructor-info">
                    <strong>Instructor:</strong> {course.instructor_name}
                  </div>
                )}
                {course.department && (
                  <div className="department-info">
                    <strong>Department:</strong> {course.department}
                  </div>
                )}
                <div className="course-actions">
                  <button
                    className="btn-action edit"
                    onClick={() => handleOpenModal(course)}
                    title="Edit course"
                  >
                    <Edit2 size={16} />
                    Edit
                  </button>
                  <button
                    className="btn-action toggle"
                    onClick={() => handleToggleStatus(course)}
                    title={course.status === 'active' ? 'Deactivate' : 'Activate'}
                  >
                    {course.status === 'active' ? 'Deactivate' : 'Activate'}
                  </button>
                  <button
                    className="btn-action delete"
                    onClick={() => handleDelete(course.id)}
                    title="Delete course"
                  >
                    <Trash2 size={16} />
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>{editingCourse ? 'Edit Course' : 'Create New Course'}</h2>
              <button className="btn-close" onClick={handleCloseModal}>
                <X size={24} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="course-form">
              <div className="simple-form-notice">
                <p>✨ Quick course creation - only course name is required!</p>
              </div>

              <div className="form-group">
                <label>Course Name *</label>
                <input
                  type="text"
                  name="course_name"
                  value={formData.course_name}
                  onChange={handleChange}
                  placeholder="e.g., Introduction to Computer Science"
                  required
                  autoFocus
                />
                <small>This is the only required field</small>
              </div>

              <div className="form-group">
                <label>Course Code (Optional)</label>
                <input
                  type="text"
                  name="course_code"
                  value={formData.course_code}
                  onChange={handleChange}
                  placeholder="e.g., CS101 (auto-generated if empty)"
                />
                <small>Leave empty to auto-generate</small>
              </div>

              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea
                  name="course_description"
                  value={formData.course_description}
                  onChange={handleChange}
                  placeholder="Brief description of the course..."
                  rows="3"
                />
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Category (Optional)</label>
                  <input
                    type="text"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    placeholder="e.g., Computer Science"
                  />
                </div>
                <div className="form-group">
                  <label>Level</label>
                  <select name="level" value={formData.level} onChange={handleChange}>
                    <option value="Beginner">Beginner</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Advanced">Advanced</option>
                  </select>
                </div>
              </div>

              <div className="form-row two-col">
                <div className="form-group">
                  <label>Duration (Optional)</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 12"
                    min="1"
                  />
                </div>
                <div className="form-group">
                  <label>Duration Unit</label>
                  <select name="duration_unit" value={formData.duration_unit} onChange={handleChange}>
                    <option value="hours">Hours</option>
                    <option value="weeks">Weeks</option>
                    <option value="months">Months</option>
                    <option value="years">Years</option>
                  </select>
                </div>
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={handleCloseModal}>
                  <X size={18} />
                  Cancel
                </button>
                <button type="submit" className="btn-save">
                  <Save size={18} />
                  {editingCourse ? 'Update Course' : 'Create Course'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageCourses;

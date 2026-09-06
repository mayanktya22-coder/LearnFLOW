import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  DollarSign,
  Users,
  Star,
  TrendingUp,
  PlusCircle,
  Edit,
  BarChart3,
  CheckCircle2,
  Clock,
  ArrowRight,
  Sparkles,
  BookOpen,
  MessageSquare
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';

const InstructorDashboard = () => {
  const { user } = useAuth();
  const { courses, apiBase } = useCourse();
  const navigate = useNavigate();

  const [instructorCourses, setInstructorCourses] = useState([]);
  const [submissionsCount, setSubmissionsCount] = useState(2);

  useEffect(() => {
    if (!user) return;
    const filtered = courses.filter(c => c.instructorId === user.id || user.role === 'instructor');
    setInstructorCourses(filtered);
  }, [courses, user]);

  return (
    <div className="main-content animate-fade-in" style={{ paddingBottom: 64 }}>
      {/* Welcome Banner */}
      <div style={{
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-lg)',
        padding: '24px 28px',
        marginBottom: 32,
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 20
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <img
            src={user?.avatar}
            alt={user?.name}
            style={{ width: 52, height: 52, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Welcome, {user?.name}</h1>
              <span className="badge badge-success">Instructor</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
              Managing {instructorCourses.length} active courses
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <Link to="/instructor/course/create" className="btn btn-primary btn-sm" style={{ gap: 6 }}>
            <PlusCircle size={15} /> Create New Masterclass
          </Link>
          <Link to="/instructor/grading" className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
            <CheckCircle2 size={15} /> Grade Submissions ({submissionsCount})
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
        marginBottom: 36
      }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Monthly Revenue</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'var(--success-bg)' }}>
              <DollarSign size={18} color="var(--success)" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>₹89,000</div>
          <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>↗ +15.4% vs last month</div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Students</span>
            <div style={{ padding: 6, borderRadius: 'var(--radius-sm)', background: 'var(--accent-light)' }}>
              <Users size={18} color="var(--accent)" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>1,234</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>567 active this week</div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Course Rating</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'rgba(245, 158, 11, 0.15)' }}>
              <Star size={18} color="#f59e0b" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>4.8 / 5.0</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Across 376 reviews</div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Completion Rate</span>
            <div style={{ padding: 6, borderRadius: 8, background: 'var(--info-bg)' }}>
              <TrendingUp size={18} color="var(--info)" />
            </div>
          </div>
          <div style={{ fontSize: 28, fontWeight: 800 }}>75.2%</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Top 10% on LearnFlow</div>
        </div>
      </div>

      {/* Main Instructor Section */}
      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 32, alignItems: 'start' }}>
        {/* Left: Course Management List */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>My Courses & Drafts</h2>
            <Link to="/instructor/course/create" style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600 }}>
              + Add New
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {instructorCourses.map(course => (
              <div
                key={course.id}
                className="glass-card"
                style={{
                  padding: 20,
                  display: 'grid',
                  gridTemplateColumns: '140px 1fr auto',
                  gap: 20,
                  alignItems: 'center'
                }}
              >
                <img
                  src={course.thumbnail}
                  alt={course.title}
                  style={{ width: '100%', height: 95, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                />

                <div>
                  <div style={{ display: 'flex', gap: 6, marginBottom: 4 }}>
                    <span className={`badge ${course.status === 'published' ? 'badge-success' : 'badge-warning'}`}>
                      {course.status === 'published' ? 'Published' : 'Under Review'}
                    </span>
                    <span className="badge badge-primary">{course.category}</span>
                  </div>

                  <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>{course.title}</h3>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)', display: 'flex', gap: 14 }}>
                    <span>👥 {course.studentCount || 0} students</span>
                    <span>⭐ {course.rating || 5.0}</span>
                    <span>💰 ₹{(course.revenue || course.price * (course.studentCount || 0)).toLocaleString()} earned</span>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8 }}>
                  <Link
                    to={`/instructor/course/${course.id}/edit`}
                    className="btn btn-outline btn-sm"
                    title="Edit Curriculum"
                  >
                    <Edit size={14} /> Edit
                  </Link>
                  <Link
                    to="/instructor/analytics"
                    className="btn btn-secondary btn-sm"
                    title="View Analytics"
                  >
                    <BarChart3 size={14} />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Pending Action Items */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Instructor To-Do List</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Grade Pending Submissions</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>2 student projects awaiting review</div>
                </div>
                <Link to="/instructor/grading" className="btn btn-primary btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
                  Review
                </Link>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Reply to Student Q&A</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>CSS Grid centering discussion</div>
                </div>
                <Link to="/learn/course-1" className="btn btn-secondary btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
                  Answer
                </Link>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: 12, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Review At-Risk Students</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>2 students inactive for 7+ days</div>
                </div>
                <Link to="/instructor/analytics" className="btn btn-outline btn-sm" style={{ padding: '4px 10px', fontSize: 11 }}>
                  Notify
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorDashboard;

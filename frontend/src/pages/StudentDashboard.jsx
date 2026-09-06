import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  CheckCircle2,
  Award,
  Clock,
  Flame,
  PlayCircle,
  ArrowRight,
  TrendingUp,
  FileCode,
  HelpCircle,
  ExternalLink,
  Download
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import CertificateModal from '../components/CertificateModal';

const StudentDashboard = () => {
  const { user } = useAuth();
  const { enrolledCourses, courses, apiBase } = useCourse();
  const [certificates, setCertificates] = useState([]);
  const [selectedCert, setSelectedCert] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) return;
    fetch(`${apiBase}/certificates?userId=${user.id}`)
      .then(res => res.json())
      .then(data => {
        if (data.certificates) setCertificates(data.certificates);
      })
      .catch(err => console.error(err));
  }, [user, apiBase]);

  const recommended = courses.filter(c => !enrolledCourses.some(ec => ec.id === c.id)).slice(0, 2);

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
            style={{ width: 56, height: 56, borderRadius: '50%', objectFit: 'cover' }}
          />
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <h1 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em' }}>Welcome back, {user?.name}</h1>
              <span className="badge badge-neutral">Student</span>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginTop: 4 }}>
              You are on a <strong>{user?.streak || 7}-day streak</strong>. Keep going.
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 12 }}>
          <Link to="/courses" className="btn btn-outline btn-sm">
            <BookOpen size={14} /> Browse Catalog
          </Link>
          <Link to="/verify/CERT-2026-09-12345" className="btn btn-primary btn-sm">
            <Award size={14} /> My Certificates ({certificates.length})
          </Link>
        </div>
      </div>

      {/* Quick Stats Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 20,
        marginBottom: 40
      }}>
        <div className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 'var(--radius-md)', background: 'var(--accent-light)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <BookOpen size={24} color="var(--accent)" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{enrolledCourses.length}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Courses Enrolled</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircle2 size={24} color="var(--success)" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>1</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Courses Completed</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Award size={24} color="#f59e0b" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{certificates.length}</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Certificates Earned</div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: 20, display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--danger-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={24} color="var(--danger)" />
          </div>
          <div>
            <div style={{ fontSize: 24, fontWeight: 800 }}>{user?.streak || 7} Days</div>
            <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Current Streak 🔥</div>
          </div>
        </div>
      </div>

      {/* Main Grid: Enrolled Courses & Side Activity */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 32, alignItems: 'start' }}>
        {/* Left: Active Enrolled Courses */}
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800 }}>My Enrolled Courses</h2>
            <Link to="/courses" style={{ fontSize: 13, color: 'var(--accent-primary)', fontWeight: 600 }}>
              Enroll in new +
            </Link>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {enrolledCourses.map(course => {
              const progressPct = course.progress?.completionPercentage || 0;
              return (
                <div
                  key={course.id}
                  className="glass-card"
                  style={{
                    padding: 20,
                    display: 'grid',
                    gridTemplateColumns: '180px 1fr auto',
                    gap: 20,
                    alignItems: 'center'
                  }}
                >
                  <img
                    src={course.thumbnail}
                    alt={course.title}
                    style={{ width: '100%', height: 110, borderRadius: 'var(--radius-md)', objectFit: 'cover' }}
                  />

                  <div>
                    <span className="badge badge-primary" style={{ marginBottom: 6 }}>{course.category}</span>
                    <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 6 }}>{course.title}</h3>
                    <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 12 }}>
                      Instructor: {course.instructorName}
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
                        <span style={{ color: 'var(--text-secondary)' }}>Progress</span>
                        <span className="text-gradient">{progressPct}% Complete</span>
                      </div>
                      <div className="progress-track">
                        <div className="progress-fill" style={{ width: `${progressPct}%` }} />
                      </div>
                    </div>
                  </div>

                  <div>
                    <Link
                      to={`/learn/${course.id}`}
                      className="btn btn-primary btn-sm"
                      style={{ padding: '10px 18px', gap: 6 }}
                    >
                      <PlayCircle size={16} /> Continue Learning
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>

          {/* My Certificates Section */}
          <div style={{ marginTop: 40 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontSize: 20, fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
                <Award size={20} color="#fbbf24" /> My Issued Certificates
              </h2>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: 16 }}>
              {certificates.map(cert => (
                <div
                  key={cert.id}
                  className="glass-card"
                  style={{
                    padding: 20,
                    borderLeft: '4px solid #fbbf24',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between'
                  }}
                >
                  <div>
                    <span className="badge badge-warning" style={{ marginBottom: 8 }}>{cert.certificateNumber}</span>
                    <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{cert.courseTitle}</h4>
                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Grade: <strong>{cert.grade}</strong>
                    </div>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      Issued on {cert.issuedDate}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
                    <button
                      onClick={() => setSelectedCert(cert)}
                      className="btn btn-primary btn-sm"
                      style={{ flex: 1, padding: '6px 12px' }}
                    >
                      View & Print PDF
                    </button>
                    <Link
                      to={`/verify/${cert.certificateNumber}`}
                      className="btn btn-outline btn-sm"
                      style={{ padding: '6px 10px' }}
                      title="Verify online"
                    >
                      <ExternalLink size={14} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right: Activity Feed & Recommended */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Recent Activity */}
          <div className="glass-card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={18} color="var(--accent-primary)" /> Recent Activity
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <HelpCircle size={16} color="var(--success)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Completed Quiz: HTML5 Basics</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Score: 90% • 2 hours ago</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(99, 102, 241, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <FileCode size={16} color="var(--accent-primary)" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Submitted Landing Page Assignment</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Grade: 92/100 (Grade A) • Yesterday</div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(245, 158, 11, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Award size={16} color="#f59e0b" />
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Earned Certificate of Completion</div>
                  <div style={{ fontSize: 11, color: 'var(--text-secondary)' }}>Web Development Fundamentals</div>
                </div>
              </div>
            </div>
          </div>

          {/* Recommended Next */}
          {recommended.length > 0 && (
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Recommended for You</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {recommended.map(c => (
                  <div key={c.id} style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <img src={c.thumbnail} alt={c.title} style={{ width: 64, height: 50, borderRadius: 'var(--radius-sm)', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <h4 style={{ fontSize: 13, fontWeight: 700, lineHeight: 1.2 }}>{c.title}</h4>
                      <div style={{ fontSize: 11, color: 'var(--accent-primary)', fontWeight: 600, marginTop: 2 }}>
                        ₹{c.price} • {c.level}
                      </div>
                    </div>
                    <Link to={`/courses/${c.id}`} className="btn btn-outline btn-sm" style={{ padding: '4px 8px' }}>
                      View
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Certificate Modal */}
      <CertificateModal
        certificate={selectedCert}
        isOpen={!!selectedCert}
        onClose={() => setSelectedCert(null)}
      />
    </div>
  );
};

export default StudentDashboard;

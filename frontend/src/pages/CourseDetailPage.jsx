import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Star,
  Users,
  Clock,
  CheckCircle,
  PlayCircle,
  FileText,
  HelpCircle,
  Lock,
  Share2,
  Award,
  BookOpen,
  ArrowRight,
  ShieldCheck,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import PaymentModal from '../components/PaymentModal';

const CourseDetailPage = () => {
  const { id } = useParams();
  const { courses, enrolledCourses, apiBase } = useCourse();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);
  const [openSections, setOpenSections] = useState({ 0: true });
  const [showPaymentModal, setShowPaymentModal] = useState(false);

  useEffect(() => {
    const found = courses.find(c => c.id === id || c.slug === id);
    if (found) {
      setCourse(found);
      setLoading(false);
    } else {
      // fetch directly
      fetch(`${apiBase}/courses/${id}`)
        .then(res => res.json())
        .then(data => {
          if (data.course) setCourse(data.course);
        })
        .catch(err => console.error(err))
        .finally(() => setLoading(false));
    }
  }, [id, courses, apiBase]);

  if (loading) {
    return (
      <div className="main-content" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Loading syllabus details...</div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="main-content" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>Course not found</h2>
        <Link to="/courses" className="btn btn-primary btn-sm">Browse All Courses</Link>
      </div>
    );
  }

  const isEnrolled = enrolledCourses.some(ec => ec.id === course.id);
  const enrolledData = enrolledCourses.find(ec => ec.id === course.id);

  const toggleSection = (idx) => {
    setOpenSections(prev => ({ ...prev, [idx]: !prev[idx] }));
  };

  const totalLessons = (course.sections || []).reduce((acc, sec) => acc + (sec.lessons || []).length, 0);

  return (
    <div className="animate-fade-in" style={{ paddingBottom: 80 }}>
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(to bottom, var(--bg-secondary), var(--bg-primary))',
        borderBottom: '1px solid var(--border-color)',
        padding: '48px 24px 40px'
      }}>
        <div className="main-content" style={{ padding: 0, display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40, alignItems: 'start' }}>
          {/* Left: Course Highlights */}
          <div>
            <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
              <span className="badge badge-primary">{course.category}</span>
              <span className="badge badge-info">{course.level}</span>
            </div>

            <h1 style={{ fontSize: 'clamp(26px, 3.5vw, 38px)', fontWeight: 800, lineHeight: 1.25, marginBottom: 16 }}>
              {course.title}
            </h1>

            <p style={{ fontSize: 16, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 20 }}>
              {course.shortDescription || course.description}
            </p>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 20, alignItems: 'center', fontSize: 13, color: 'var(--text-secondary)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Star size={16} color="#f59e0b" fill="#f59e0b" />
                <strong style={{ color: 'var(--text-primary)' }}>{course.rating || 4.8}</strong>
                <span>({course.reviewCount || 120} ratings)</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Users size={16} />
                <span>{(course.studentCount || 0).toLocaleString()} students enrolled</span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                <Clock size={16} />
                <span>{course.duration || '28 hrs'} on-demand video</span>
              </div>
            </div>

            {/* Instructor snippet */}
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginTop: 24 }}>
              <img
                src={course.instructorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={course.instructorName}
                style={{ width: 44, height: 44, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>Created by</div>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--text-primary)' }}>{course.instructorName}</div>
              </div>
            </div>
          </div>

          {/* Right: Sticky Enrollment Card */}
          <div className="glass-card" style={{
            position: 'sticky',
            top: 90,
            overflow: 'hidden',
            padding: 0
          }}>
            <div style={{ position: 'relative', width: '100%', height: 200 }}>
              <img
                src={course.thumbnail}
                alt={course.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.3)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <div style={{
                  width: 50,
                  height: 50,
                  borderRadius: '50%',
                  background: 'var(--accent-gradient)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <PlayCircle size={28} color="#fff" />
                </div>
              </div>
            </div>

            <div style={{ padding: 24 }}>
              {!isEnrolled ? (
                <div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 8 }}>
                    <span style={{ fontSize: 32, fontWeight: 800, color: 'var(--text-primary)' }}>
                      ₹{(course.price || 999).toLocaleString()}
                    </span>
                    {(course.originalPrice || 1999) > course.price && (
                      <span style={{ fontSize: 16, textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                        ₹{(course.originalPrice || 1999).toLocaleString()}
                      </span>
                    )}
                    {course.discount > 0 && (
                      <span className="badge badge-success">Save ₹{course.discount}</span>
                    )}
                  </div>

                  <button
                    onClick={() => setShowPaymentModal(true)}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: 16, marginBottom: 12 }}
                  >
                    Enroll Now • Instant Access
                  </button>
                  <p style={{ fontSize: 11, textAlign: 'center', color: 'var(--text-muted)', marginBottom: 20 }}>
                    30-Day Money-Back Guarantee • Lifetime Access
                  </p>
                </div>
              ) : (
                <div style={{ marginBottom: 20 }}>
                  <div style={{
                    padding: 14,
                    background: 'var(--success-bg)',
                    border: '1px solid var(--success)',
                    borderRadius: 'var(--radius-md)',
                    color: '#34d399',
                    fontSize: 13,
                    fontWeight: 600,
                    marginBottom: 16,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8
                  }}>
                    <CheckCircle size={18} /> You are enrolled in this course!
                  </div>

                  <Link
                    to={`/learn/${course.id}`}
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '14px', fontSize: 16 }}
                  >
                    Continue to Classroom <ArrowRight size={16} />
                  </Link>
                </div>
              )}

              <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 16 }}>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 12 }}>This course includes:</div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <PlayCircle size={15} color="var(--accent-primary)" /> {course.duration || '28 hrs'} on-demand HD video
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <FileText size={15} color="var(--accent-primary)" /> Downloadable lecture notes & starter code
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <HelpCircle size={15} color="var(--accent-primary)" /> Auto-graded interactive quizzes
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Award size={15} color="#fbbf24" /> Verifiable Certificate of Completion
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Syllabus Content & Outcomes */}
      <section className="main-content" style={{ marginTop: 40, display: 'grid', gridTemplateColumns: '1fr 360px', gap: 40 }}>
        <div>
          {/* What You'll Learn */}
          <div className="glass-card" style={{ padding: 28, marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>What you'll learn</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 12 }}>
              {(course.learningOutcomes || [
                'Build production-ready, accessible web applications',
                'Master modern layout algorithms (Flexbox & CSS Grid)',
                'Understand JavaScript event loops & DOM manipulations',
                'Deploy with CI/CD and production best practices'
              ]).map((outcome, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                  <CheckCircle size={16} color="var(--success)" style={{ flexShrink: 0, marginTop: 2 }} />
                  <span>{outcome}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Curriculum Accordion */}
          <div style={{ marginBottom: 36 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>Course Curriculum</h2>
                <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                  {(course.sections || []).length} sections • {totalLessons} lectures
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {(course.sections || []).map((sec, sIdx) => {
                const isOpen = openSections[sIdx];
                return (
                  <div key={sec.id || sIdx} className="glass-card" style={{ overflow: 'hidden' }}>
                    {/* Section Header */}
                    <button
                      onClick={() => toggleSection(sIdx)}
                      style={{
                        width: '100%',
                        padding: '16px 20px',
                        background: 'var(--bg-tertiary)',
                        border: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        color: 'var(--text-primary)',
                        textAlign: 'left'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <BookOpen size={16} color="var(--accent-primary)" />
                        <span style={{ fontSize: 14, fontWeight: 700 }}>{sec.title}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, fontSize: 12, color: 'var(--text-muted)' }}>
                        <span>{(sec.lessons || []).length} lectures</span>
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    {/* Section Lessons */}
                    {isOpen && (
                      <div style={{ padding: '8px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {(sec.lessons || []).map((les) => (
                          <div
                            key={les.id}
                            style={{
                              padding: '10px 12px',
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'space-between',
                              borderRadius: 'var(--radius-sm)',
                              background: 'var(--bg-glass)'
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {les.type === 'quiz' ? (
                                <HelpCircle size={15} color="#fbbf24" />
                              ) : les.type === 'assignment' ? (
                                <FileText size={15} color="#10b981" />
                              ) : (
                                <PlayCircle size={15} color="var(--accent-primary)" />
                              )}
                              <span style={{ fontSize: 13, color: 'var(--text-primary)' }}>{les.title}</span>
                            </div>

                            <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--text-muted)' }}>
                              <span>{les.duration}</span>
                              {les.isPreview || isEnrolled ? (
                                <span style={{ color: 'var(--success)', fontWeight: 600, fontSize: 11 }}>Preview</span>
                              ) : (
                                <Lock size={13} color="var(--text-muted)" />
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Instructor Bio */}
          <div className="glass-card" style={{ padding: 28, marginBottom: 32 }}>
            <h2 style={{ fontSize: 20, fontWeight: 800, marginBottom: 16 }}>Your Instructor</h2>
            <div style={{ display: 'flex', gap: 20, alignItems: 'center', marginBottom: 16 }}>
              <img
                src={course.instructorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
                alt={course.instructorName}
                style={{ width: 72, height: 72, borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
              />
              <div>
                <h3 style={{ fontSize: 18, fontWeight: 800 }}>{course.instructorName}</h3>
                <div style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600, marginTop: 2 }}>
                  Senior Software Architect & Mentor
                </div>
                <div style={{ display: 'flex', gap: 14, fontSize: 12, color: 'var(--text-muted)', marginTop: 6 }}>
                  <span>⭐ 4.8 Instructor Rating</span>
                  <span>👥 1,234+ Students Taught</span>
                </div>
              </div>
            </div>
            <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
              {course.instructorBio || 'Senior Full-Stack Architect with over a decade of production experience designing scalable systems, web performance benchmarks, and mentoring hundreds of engineers.'}
            </p>
          </div>
        </div>

        {/* Right side empty placeholder matching grid layout */}
        <div />
      </section>

      {/* Payment Modal */}
      <PaymentModal
        course={course}
        isOpen={showPaymentModal}
        onClose={() => setShowPaymentModal(false)}
        onPaymentSuccess={() => navigate(`/learn/${course.id}`)}
      />
    </div>
  );
};

export default CourseDetailPage;

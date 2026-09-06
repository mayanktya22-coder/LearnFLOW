import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  BookOpen,
  Users,
  Award,
  Video,
  Code,
  ShieldCheck,
  Star,
  Search,
  Clock,
  CheckCircle,
  ArrowRight,
  BarChart3,
  MessageSquare,
  Zap
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';
import PaymentModal from '../components/PaymentModal';

const FEATURES = [
  {
    icon: Video,
    title: '1080p Video Lessons',
    desc: 'High-quality streaming with adjustable playback speed, captions, and downloadable resources for every lesson.'
  },
  {
    icon: Code,
    title: 'Rubric-Graded Projects',
    desc: 'Submit code or GitHub repos and receive structured feedback across four grading criteria from instructors.'
  },
  {
    icon: Award,
    title: 'Verified Certificates',
    desc: 'Auto-generated digital certificates with unique IDs and QR codes — instantly verifiable by recruiters.'
  }
];

const PRICING = [
  {
    name: 'Free',
    price: 0,
    period: '',
    desc: 'Access select free courses and explore the platform at no cost.',
    cta: 'Get started free',
    ctaStyle: 'btn-secondary',
    features: [
      'Access to 50+ free courses',
      'Community Q&A forum',
      'Progress tracking',
      'Mobile access'
    ]
  },
  {
    name: 'Pro',
    price: 999,
    period: '/month',
    desc: 'Unlimited access to all courses, graded projects, and certificate generation.',
    cta: 'Start 7-day trial',
    ctaStyle: 'btn-primary',
    highlight: true,
    features: [
      'Everything in Free',
      'Unlimited course access',
      'Rubric graded assignments',
      'Verified certificates',
      'Priority support'
    ]
  },
  {
    name: 'Team',
    price: 499,
    period: '/user/month',
    desc: 'Centralized billing, admin dashboard, and progress reports for teams of 5 or more.',
    cta: 'Talk to sales',
    ctaStyle: 'btn-secondary',
    features: [
      'Everything in Pro',
      'Team admin dashboard',
      'Bulk enrollment',
      'Custom learning paths',
      'Dedicated account manager'
    ]
  }
];

const STATS = [
  { value: '5,200+', label: 'Active learners' },
  { value: '560+', label: 'Courses available' },
  { value: '98.4%', label: 'Completion rate' },
  { value: '12,000+', label: 'Certificates issued' }
];

const HomePage = () => {
  const { courses, enrolledCourses, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useCourse();
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState(null);
  const navigate = useNavigate();

  const handleHeroSearch = (e) => {
    e.preventDefault();
    navigate('/courses');
  };

  return (
    <div className="animate-fade-in">

      {/* ── Hero ── */}
      <section style={{
        padding: '72px 32px 80px',
        maxWidth: 1280,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '1fr 1fr',
        gap: 64,
        alignItems: 'center'
      }}>
        <div>
          {/* Eyebrow label */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 12px',
            background: 'var(--accent-light)',
            color: 'var(--accent)',
            fontSize: 12,
            fontWeight: 600,
            borderRadius: 'var(--radius-sm)',
            marginBottom: 20,
            letterSpacing: '0.02em'
          }}>
            <Zap size={13} />
            New: Python for Data Science launched
          </div>

          <h1 style={{
            fontSize: 'clamp(32px, 4vw, 48px)',
            fontWeight: 700,
            lineHeight: 1.2,
            letterSpacing: '-0.03em',
            color: 'var(--text-primary)',
            marginBottom: 18
          }}>
            Learn in-demand tech skills that actually get you hired
          </h1>

          <p style={{
            fontSize: 17,
            color: 'var(--text-secondary)',
            lineHeight: 1.65,
            maxWidth: 480,
            marginBottom: 36
          }}>
            Build real projects, get graded by instructors, and earn certificates verified by employers. Used by 5,200+ learners across India.
          </p>

          {/* Search bar */}
          <form onSubmit={handleHeroSearch} style={{
            display: 'flex',
            gap: 8,
            maxWidth: 480,
            marginBottom: 24
          }}>
            <div style={{
              flex: 1,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-md)',
              boxShadow: 'var(--shadow-xs)'
            }}>
              <Search size={16} color="var(--text-muted)" />
              <input
                type="text"
                placeholder="Search courses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  outline: 'none',
                  color: 'var(--text-primary)',
                  fontSize: 14,
                  width: '100%'
                }}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Search
            </button>
          </form>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            <Link to="/courses" className="btn btn-primary btn-lg">
              Explore courses
            </Link>
            <Link to="/dashboard" className="btn btn-secondary btn-lg">
              My learning
            </Link>
          </div>
        </div>

        {/* Hero illustration — real platform preview */}
        <div style={{
          background: 'var(--bg-secondary)',
          border: '1px solid var(--border-color)',
          borderRadius: 'var(--radius-xl)',
          overflow: 'hidden',
          boxShadow: 'var(--shadow-lg)'
        }}>
          {/* Browser chrome */}
          <div style={{
            padding: '12px 16px',
            background: 'var(--bg-tertiary)',
            borderBottom: '1px solid var(--border-color)',
            display: 'flex',
            alignItems: 'center',
            gap: 8
          }}>
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
            <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
            <div style={{
              flex: 1,
              marginLeft: 8,
              background: 'var(--bg-primary)',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              padding: '4px 12px',
              fontSize: 12,
              color: 'var(--text-muted)',
              fontFamily: 'var(--font-mono)'
            }}>
              learnflow.dev/learn/web-dev
            </div>
          </div>

          {/* Video player mockup */}
          <div style={{ background: '#0f0f0f', height: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
            <div style={{
              position: 'absolute', inset: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <div style={{
                width: 52, height: 52,
                borderRadius: '50%',
                background: 'rgba(255,255,255,0.12)',
                border: '2px solid rgba(255,255,255,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                backdropFilter: 'blur(4px)'
              }}>
                <div style={{ width: 0, height: 0, borderTop: '9px solid transparent', borderBottom: '9px solid transparent', borderLeft: '16px solid white', marginLeft: 3 }} />
              </div>
            </div>
            {/* Progress bar at bottom */}
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: 'rgba(255,255,255,0.1)' }}>
              <div style={{ width: '42%', height: '100%', background: 'var(--accent)' }} />
            </div>
          </div>

          {/* Lesson list */}
          {[
            { title: 'HTML Document Structure', done: true, dur: '12 min' },
            { title: 'CSS Box Model in Depth', done: true, dur: '18 min' },
            { title: 'JavaScript Variables & Scope', done: false, dur: '24 min', active: true },
            { title: 'Building Your First Component', done: false, dur: '31 min' }
          ].map((lesson, i) => (
            <div key={i} style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              padding: '10px 16px',
              borderBottom: '1px solid var(--border-color)',
              background: lesson.active ? 'var(--accent-light)' : 'transparent'
            }}>
              <CheckCircle
                size={15}
                color={lesson.done ? 'var(--success)' : (lesson.active ? 'var(--accent)' : 'var(--border-strong)')}
                fill={lesson.done ? 'var(--success)' : 'none'}
              />
              <span style={{
                flex: 1,
                fontSize: 13,
                color: lesson.active ? 'var(--accent)' : (lesson.done ? 'var(--text-muted)' : 'var(--text-primary)'),
                fontWeight: lesson.active ? 600 : 400
              }}>
                {lesson.title}
              </span>
              <span style={{ fontSize: 11, color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>{lesson.dur}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Stats bar ── */}
      <section style={{
        borderTop: '1px solid var(--border-color)',
        borderBottom: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        padding: '32px 32px'
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: 32,
          textAlign: 'center'
        }}>
          {STATS.map(s => (
            <div key={s.label}>
              <div style={{ fontSize: 28, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
                {s.value}
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 4 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Featured Courses ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'flex-end',
          marginBottom: 32
        }}>
          <div>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>
              Trending now
            </div>
            <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em' }}>
              Featured courses
            </h2>
          </div>
          <Link to="/courses" className="btn btn-secondary btn-sm">
            View all courses
          </Link>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
          {courses.slice(0, 3).map(course => {
            const isEnrolled = enrolledCourses.some(ec => ec.id === course.id);
            const enrolledData = enrolledCourses.find(ec => ec.id === course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={isEnrolled}
                progressPercent={enrolledData?.progress?.completionPercentage || 0}
                onEnrollClick={(c) => setSelectedCourseForPayment(c)}
              />
            );
          })}
        </div>
      </section>

      {/* ── Features — 3 cards in a row ── */}
      <section style={{
        borderTop: '1px solid var(--border-color)',
        padding: '64px 32px',
        background: 'var(--bg-secondary)'
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: 48 }}>
            <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>
              Built for serious learners
            </h2>
            <p style={{ fontSize: 15, color: 'var(--text-secondary)', maxWidth: 480, margin: '0 auto' }}>
              Every feature is designed to get you from learning to doing — faster than any other platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
            {FEATURES.map(f => {
              const Icon = f.icon;
              return (
                <div key={f.title} className="card" style={{ padding: '28px 28px' }}>
                  <div style={{
                    width: 40, height: 40,
                    borderRadius: 'var(--radius-md)',
                    background: 'var(--accent-light)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    marginBottom: 18
                  }}>
                    <Icon size={20} color="var(--accent)" />
                  </div>
                  <h3 style={{ fontSize: 16, fontWeight: 600, marginBottom: 10, color: 'var(--text-primary)' }}>
                    {f.title}
                  </h3>
                  <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
                    {f.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pricing — 3 tiers ── */}
      <section style={{ maxWidth: 1280, margin: '0 auto', padding: '64px 32px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>
            Simple, transparent pricing
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)' }}>
            Start for free. Upgrade when you need more.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24, alignItems: 'start' }}>
          {PRICING.map(plan => (
            <div
              key={plan.name}
              className="card"
              style={{
                padding: '32px',
                ...(plan.highlight ? {
                  border: '2px solid var(--accent)',
                  boxShadow: 'var(--shadow-md)',
                  position: 'relative'
                } : {})
              }}
            >
              {plan.highlight && (
                <div style={{
                  position: 'absolute',
                  top: -1,
                  left: '50%',
                  transform: 'translateX(-50%) translateY(-50%)',
                  background: 'var(--accent)',
                  color: '#fff',
                  fontSize: 11,
                  fontWeight: 600,
                  padding: '3px 12px',
                  borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.04em'
                }}>
                  MOST POPULAR
                </div>
              )}

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--text-primary)', marginBottom: 4 }}>
                  {plan.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 8 }}>
                  <span style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em' }}>
                    {plan.price === 0 ? 'Free' : `₹${plan.price.toLocaleString()}`}
                  </span>
                  {plan.period && (
                    <span style={{ fontSize: 13, color: 'var(--text-muted)' }}>{plan.period}</span>
                  )}
                </div>
                <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                  {plan.desc}
                </p>
              </div>

              <Link to="/courses" className={`btn ${plan.ctaStyle}`} style={{ width: '100%', marginBottom: 24 }}>
                {plan.cta}
              </Link>

              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(feat => (
                  <li key={feat} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 13, color: 'var(--text-secondary)' }}>
                    <CheckCircle size={15} color="var(--success)" />
                    {feat}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* ── Footer CTA ── */}
      <section style={{
        borderTop: '1px solid var(--border-color)',
        background: 'var(--bg-secondary)',
        padding: '56px 32px',
        textAlign: 'center'
      }}>
        <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>
          Ready to start learning?
        </h2>
        <p style={{ fontSize: 15, color: 'var(--text-secondary)', marginBottom: 28 }}>
          Join 5,200+ learners already building their careers on LearnFlow.
        </p>
        <Link to="/courses" className="btn btn-primary btn-lg">
          Browse all courses
        </Link>
      </section>

      <PaymentModal
        course={selectedCourseForPayment}
        isOpen={!!selectedCourseForPayment}
        onClose={() => setSelectedCourseForPayment(null)}
        onPaymentSuccess={(c) => navigate(`/learn/${c.id}`)}
      />
    </div>
  );
};

export default HomePage;

import React, { useState } from 'react';
import {
  BarChart3,
  TrendingUp,
  Users,
  Star,
  AlertTriangle,
  Mail,
  CheckCircle2,
  Clock,
  Sparkles
} from 'lucide-react';

const InstructorAnalytics = () => {
  const [selectedCourse, setSelectedCourse] = useState('course-1');
  const [sentEmailId, setSentEmailId] = useState(null);

  const atRiskStudents = [
    { id: 's-1', name: 'Alex Miller', email: 'alex@example.com', daysInactive: 8, stuckLesson: 'CSS Flexbox Layouts', progress: '38%' },
    { id: 's-2', name: 'Pooja Sharma', email: 'pooja@example.com', daysInactive: 12, stuckLesson: 'HTML Forms & Validation', progress: '18%' }
  ];

  const handleSendMotivationalEmail = (studentId) => {
    setSentEmailId(studentId);
    setTimeout(() => setSentEmailId(null), 3000);
  };

  return (
    <div className="main-content animate-fade-in" style={{ paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Instructor Performance & Course Analytics</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            Monitor student completion drop-offs, track retention metrics, and assist at-risk learners.
          </p>
        </div>

        <select
          value={selectedCourse}
          onChange={(e) => setSelectedCourse(e.target.value)}
          className="input-field"
          style={{ width: 260, marginBottom: 0 }}
        >
          <option value="course-1">Web Development Fundamentals</option>
          <option value="course-2">Python Masterclass</option>
        </select>
      </div>

      {/* Metric Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Enrolled Learners</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>890 Students</div>
          <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>↗ +180 this month</div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Average Watch Time</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>85.4%</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Avg 45 mins session</div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Quiz Completion Rate</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>86.2%</div>
          <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>Avg Score: 87/100</div>
        </div>

        <div className="glass-card" style={{ padding: 20 }}>
          <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Course Revenue (Sep)</div>
          <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }} className="text-gradient">₹89,000</div>
          <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 4 }}>Projected: ₹1.06M / yr</div>
        </div>
      </div>

      {/* Section-Wise Completion Funnel */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 24, marginBottom: 32 }}>
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Curriculum Section Completion Funnel</h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                <span>Section 1: HTML5 Architecture & Semantics</span>
                <span style={{ color: 'var(--success)' }}>95% Completion (Appropriate Pace)</span>
              </div>
              <div className="progress-track" style={{ height: 10 }}>
                <div className="progress-fill" style={{ width: '95%', background: 'var(--success)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                <span>Section 2: CSS3 Styling, Flexbox & Grid</span>
                <span style={{ color: 'var(--accent)' }}>82% Completion (Moderate)</span>
              </div>
              <div className="progress-track" style={{ height: 10 }}>
                <div className="progress-fill" style={{ width: '82%', background: 'var(--accent-primary)' }} />
              </div>
            </div>

            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
                <span>Section 3: JavaScript Programming & DOM</span>
                <span style={{ color: 'var(--warning)' }}>65% Completion (Attention Needed)</span>
              </div>
              <div className="progress-track" style={{ height: 10 }}>
                <div className="progress-fill" style={{ width: '65%', background: 'var(--warning)' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Rating Breakdown */}
        <div className="glass-card" style={{ padding: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Student Rating Distribution</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {[
              { stars: '5 Stars', count: 234, pct: 62 },
              { stars: '4 Stars', count: 120, pct: 32 },
              { stars: '3 Stars', count: 15, pct: 4 },
              { stars: '2 Stars', count: 5, pct: 1 },
              { stars: '1 Star', count: 2, pct: 1 }
            ].map(r => (
              <div key={r.stars} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12 }}>
                <span style={{ width: 50, color: 'var(--text-secondary)' }}>{r.stars}</span>
                <div className="progress-track" style={{ flex: 1, height: 6 }}>
                  <div className="progress-fill" style={{ width: `${r.pct}%` }} />
                </div>
                <span style={{ width: 35, textAlign: 'right', fontWeight: 600 }}>{r.count}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* At-Risk Students Section */}
      <div className="glass-card" style={{ padding: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
          <AlertTriangle size={20} color="var(--danger)" />
          <h3 style={{ fontSize: 16, fontWeight: 800 }}>At-Risk Learner Intervention</h3>
        </div>
        <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginBottom: 20 }}>
          Students who have not logged in for over 7 days or are stuck on the same lesson. Send automated personalized motivational reminders.
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 16 }}>
          {atRiskStudents.map(student => (
            <div
              key={student.id}
              style={{
                padding: 16,
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-md)',
                border: '1px solid var(--border-color)',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                  <strong style={{ fontSize: 14 }}>{student.name}</strong>
                  <span className="badge badge-danger" style={{ fontSize: 11 }}>{student.daysInactive}d inactive</span>
                </div>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{student.email}</div>
                <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 8 }}>
                  Stuck on: <strong>{student.stuckLesson}</strong> (Progress: {student.progress})
                </div>
              </div>

              <div style={{ marginTop: 14 }}>
                {sentEmailId === student.id ? (
                  <div style={{ color: 'var(--success)', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <CheckCircle2 size={14} /> Motivational email dispatched!
                  </div>
                ) : (
                  <button
                    onClick={() => handleSendMotivationalEmail(student.id)}
                    className="btn btn-outline btn-sm"
                    style={{ width: '100%', gap: 6 }}
                  >
                    <Mail size={14} /> Send Personalized Encouragement
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default InstructorAnalytics;

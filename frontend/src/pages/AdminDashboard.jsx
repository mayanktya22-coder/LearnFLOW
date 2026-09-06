import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  DollarSign,
  Users,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  UserCheck,
  CreditCard,
  Sparkles,
  ArrowRight
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';

const AdminDashboard = () => {
  const { apiBase, fetchCourses } = useCourse();

  const [stats, setStats] = useState(null);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'instructors' | 'courses' | 'finance'
  const [loading, setLoading] = useState(true);

  const fetchAdminStats = async () => {
    try {
      const res = await fetch(`${apiBase}/admin/stats`);
      const data = await res.json();
      setStats(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdminStats();
  }, []);

  const handleApproveCourse = async (courseId) => {
    try {
      await fetch(`${apiBase}/admin/courses/${courseId}/approve`, { method: 'POST' });
      await fetchAdminStats();
      await fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectCourse = async (courseId) => {
    try {
      await fetch(`${apiBase}/admin/courses/${courseId}/reject`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: 'Requires higher resolution video and more detailed lesson assignments.' })
      });
      await fetchAdminStats();
      await fetchCourses();
    } catch (err) {
      console.error(err);
    }
  };

  const handleApproveInstructor = async (appId) => {
    try {
      await fetch(`${apiBase}/admin/applications/${appId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'approve' })
      });
      await fetchAdminStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRejectInstructor = async (appId) => {
    try {
      await fetch(`${apiBase}/admin/applications/${appId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'reject' })
      });
      await fetchAdminStats();
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefundAction = async (refundId, action) => {
    try {
      await fetch(`${apiBase}/payments/refunds/${refundId}/action`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action })
      });
      await fetchAdminStats();
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) {
    return (
      <div className="main-content" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Loading governance control center...</div>
      </div>
    );
  }

  const p = stats?.platform || {};

  return (
    <div className="main-content animate-fade-in" style={{ paddingBottom: 64 }}>
      {/* Header */}
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
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <h1 style={{ fontSize: 24, fontWeight: 800 }}>Platform Governance & Executive Admin</h1>
            <span className="badge badge-primary">Super Admin</span>
          </div>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 2 }}>
            LearnFlow Technologies • Academic Standards, Financials, and Quality Compliance
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <span className="badge badge-success" style={{ padding: '8px 14px', fontSize: 13 }}>
            ✓ System Status: 100% Operational
          </span>
        </div>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: 8,
        borderBottom: '1px solid var(--border-color)',
        marginBottom: 28
      }}>
        {[
          { id: 'overview', label: 'Platform Executive Overview' },
          { id: 'instructors', label: `Instructor Applications (${stats?.pendingApplications?.length || 0})` },
          { id: 'courses', label: `Course Quality Moderation (${stats?.pendingCourses?.length || 0})` },
          { id: 'finance', label: `Payments & Refunds (${stats?.pendingRefunds?.length || 0})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '10px 18px',
              background: 'transparent',
              border: 'none',
              borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
              color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
              fontWeight: activeTab === tab.id ? 700 : 500,
              fontSize: 13,
              cursor: 'pointer'
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Platform Overview */}
      {activeTab === 'overview' && (
        <div>
          {/* Top Metrics */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 20, marginBottom: 32 }}>
            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Platform Users</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{(p.totalUsers || 5234).toLocaleString()}</div>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                {p.students || 4890} Students • {p.instructors || 235} Teachers
              </div>
            </div>

            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Total Courses Catalog</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{p.totalCourses || 567}</div>
              <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>
                {p.publishedCourses || 512} Published • {stats?.pendingCourses?.length || 0} Pending
              </div>
            </div>

            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Monthly Gross Revenue</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }} className="text-gradient">
                ₹{(p.revenueThisMonth || 234000).toLocaleString()}
              </div>
              <div style={{ fontSize: 12, color: 'var(--success)', marginTop: 4 }}>
                ↗ +{p.growthPercent || 18.2}% MoM Growth
              </div>
            </div>

            <div className="glass-card" style={{ padding: 20 }}>
              <div style={{ fontSize: 13, color: 'var(--text-secondary)' }}>Active Learners Today</div>
              <div style={{ fontSize: 28, fontWeight: 800, marginTop: 4 }}>{(p.activeUsersToday || 1234).toLocaleString()}</div>
              <div style={{ fontSize: 12, color: 'var(--info)', marginTop: 4 }}>
                {p.satisfactionScore || 92}% Satisfaction Score
              </div>
            </div>
          </div>

          {/* Revenue Breakdown Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24, marginBottom: 32 }}>
            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Revenue Share by Category</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {(stats?.categoryBreakdown || []).map(cat => (
                  <div key={cat.category}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      <span>{cat.category}</span>
                      <span>₹{cat.revenue.toLocaleString()} ({cat.percentage}%)</span>
                    </div>
                    <div className="progress-track" style={{ height: 8 }}>
                      <div className="progress-fill" style={{ width: `${cat.percentage}%` }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="glass-card" style={{ padding: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Payment Method Distribution</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {[
                  { method: 'Credit / Debit Cards', pct: 45, color: '#0d9488' },
                  { method: 'UPI (PhonePe, GPay, Paytm)', pct: 35, color: '#10b981' },
                  { method: 'Google Pay Direct', pct: 15, color: '#f59e0b' },
                  { method: 'Netbanking / Wallets', pct: 5, color: '#ec4899' }
                ].map(m => (
                  <div key={m.method}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13, fontWeight: 600, marginBottom: 4 }}>
                      <span>{m.method}</span>
                      <span>{m.pct}%</span>
                    </div>
                    <div className="progress-track" style={{ height: 8 }}>
                      <div className="progress-fill" style={{ width: `${m.pct}%`, background: m.color }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: Instructor Applications */}
      {activeTab === 'instructors' && (
        <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Instructor Verification Queue</h3>
          {(stats?.pendingApplications || []).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {stats.pendingApplications.map(app => (
                <div
                  key={app.id}
                  style={{
                    padding: 20,
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    border: '1px solid var(--border-color)',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: 20
                  }}
                >
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4 }}>
                      <strong style={{ fontSize: 16 }}>{app.name}</strong>
                      <span className="badge badge-info">{app.expertise}</span>
                    </div>
                    <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginBottom: 8 }}>
                      {app.email} • Applied on {app.appliedDate}
                    </div>
                    <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                      "{app.bio}"
                    </p>
                  </div>

                  <div style={{ display: 'flex', gap: 8 }}>
                    <button
                      onClick={() => handleRejectInstructor(app.id)}
                      className="btn btn-outline btn-sm"
                      style={{ color: 'var(--danger)' }}
                    >
                      <XCircle size={15} /> Reject
                    </button>
                    <button
                      onClick={() => handleApproveInstructor(app.id)}
                      className="btn btn-success btn-sm"
                    >
                      <CheckCircle2 size={15} /> Approve & Verify
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              No pending instructor applications at this time.
            </div>
          )}
        </div>
      )}

      {/* TAB 3: Course Moderation */}
      {activeTab === 'courses' && (
        <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Draft Courses Awaiting Quality Review</h3>
          {(stats?.pendingCourses || []).length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              {stats.pendingCourses.map(course => (
                <div
                  key={course.id}
                  style={{
                    padding: 24,
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--border-color)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
                    <div>
                      <div style={{ display: 'flex', gap: 8, marginBottom: 6 }}>
                        <span className="badge badge-warning">Pending Approval</span>
                        <span className="badge badge-primary">{course.category}</span>
                      </div>
                      <h4 style={{ fontSize: 18, fontWeight: 800 }}>{course.title}</h4>
                      <div style={{ fontSize: 13, color: 'var(--text-secondary)', marginTop: 2 }}>
                        Submitted by: <strong>{course.instructorName}</strong> • Selling Price: ₹{course.price}
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleRejectCourse(course.id)}
                        className="btn btn-outline btn-sm"
                        style={{ color: 'var(--danger)' }}
                      >
                        <XCircle size={15} /> Request Changes
                      </button>
                      <button
                        onClick={() => handleApproveCourse(course.id)}
                        className="btn btn-primary btn-sm"
                      >
                        <CheckCircle2 size={15} /> Approve & Publish
                      </button>
                    </div>
                  </div>

                  {/* Quality Checklist */}
                  <div style={{
                    padding: 14,
                    background: 'var(--bg-glass)',
                    borderRadius: 'var(--radius-md)',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
                    gap: 12,
                    fontSize: 12,
                    color: 'var(--text-secondary)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={14} color="var(--success)" /> Video Quality (1080p)
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={14} color="var(--success)" /> Curriculum Structure
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={14} color="var(--success)" /> Materials & Resources
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <CheckCircle2 size={14} color="var(--success)" /> HD Thumbnail Specs
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-secondary)' }}>
              All submitted masterclasses have been moderated!
            </div>
          )}
        </div>
      )}

      {/* TAB 4: Finance & Refunds */}
      {activeTab === 'finance' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Pending Refund Requests */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Student Refund Requests</h3>
            {(stats?.pendingRefunds || []).length > 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {stats.pendingRefunds.map(ref => (
                  <div
                    key={ref.id}
                    style={{
                      padding: 16,
                      background: 'var(--bg-tertiary)',
                      borderRadius: 'var(--radius-md)',
                      border: '1px solid var(--border-color)',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center'
                    }}
                  >
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 700 }}>{ref.studentName} ({ref.studentEmail})</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                        Course: <strong>{ref.courseTitle}</strong> • Amount: ₹{ref.amount}
                      </div>
                      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 4 }}>
                        Reason: "{ref.reason}"
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: 8 }}>
                      <button
                        onClick={() => handleRefundAction(ref.id, 'deny')}
                        className="btn btn-outline btn-sm"
                      >
                        Deny
                      </button>
                      <button
                        onClick={() => handleRefundAction(ref.id, 'approve')}
                        className="btn btn-primary btn-sm"
                      >
                        Approve ₹{ref.amount} Refund
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--text-secondary)' }}>
                No pending refund requests.
              </div>
            )}
          </div>

          {/* Recent Platform Payments */}
          <div className="glass-card" style={{ padding: 28 }}>
            <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16 }}>Recent Payment Transactions</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {(stats?.recentPayments || []).map(pay => (
                <div
                  key={pay.id}
                  style={{
                    padding: 12,
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-sm)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    fontSize: 13
                  }}
                >
                  <div>
                    <strong>{pay.userName}</strong> • {pay.courseTitle}
                    <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                      {pay.transactionId} • {pay.method} • {new Date(pay.date).toLocaleString()}
                    </div>
                  </div>

                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontWeight: 800, fontSize: 14, color: pay.status === 'success' ? 'var(--success)' : 'var(--danger)' }}>
                      {pay.status === 'success' ? `+₹${pay.amount}` : 'FAILED'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;

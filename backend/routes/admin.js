const express = require('express');
const router = express.Router();
const db = require('../data/db');

// GET /api/admin/stats
router.get('/stats', (req, res) => {
  const analytics = db.getAnalytics();
  const users = db.getUsers();
  const courses = db.getCourses();
  const payments = db.getPayments();
  const refunds = db.getRefundRequests();
  const applications = db.getApplications();

  res.json({
    platform: analytics.platform || {},
    categoryBreakdown: analytics.categoryBreakdown || [],
    monthlyRevenueTrend: analytics.monthlyRevenueTrend || [],
    recentPayments: payments.slice(0, 10),
    pendingRefunds: refunds.filter(r => r.status === 'pending'),
    pendingApplications: applications.filter(a => a.status === 'pending'),
    pendingCourses: courses.filter(c => c.status === 'pending_approval'),
    totalUsersCount: users.length,
    totalCoursesCount: courses.length
  });
});

// POST /api/admin/courses/:id/approve
router.post('/courses/:id/approve', (req, res) => {
  const course = db.updateCourse(req.params.id, { status: 'published' });
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json({ success: true, course });
});

// POST /api/admin/courses/:id/reject
router.post('/courses/:id/reject', (req, res) => {
  const { reason } = req.body;
  const course = db.updateCourse(req.params.id, {
    status: 'draft',
    rejectionReason: reason || 'Needs improvement in video resolution and structure.'
  });
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json({ success: true, course });
});

// POST /api/admin/applications/:id/action
router.post('/applications/:id/action', (req, res) => {
  const { action } = req.body; // 'approved' | 'rejected'
  const app = db.updateApplication(req.params.id, action === 'approve' ? 'approved' : 'rejected');
  if (!app) {
    return res.status(404).json({ error: 'Application not found' });
  }

  // If approved, create/verify instructor user
  if (action === 'approve') {
    const existing = db.getUserByEmail(app.email);
    if (existing) {
      db.updateUser(existing.id, { role: 'instructor', status: 'verified' });
    } else {
      db.createUser({
        name: app.name,
        email: app.email,
        role: 'instructor',
        avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
        bio: app.bio,
        rating: 5.0,
        totalStudents: 0,
        coursesCreated: [],
        totalRevenue: 0,
        status: 'verified'
      });
    }
  }

  res.json({ success: true, application: app });
});

// POST /api/admin/users/:id/status
router.post('/users/:id/status', (req, res) => {
  const { status } = req.body; // 'active' | 'suspended'
  const user = db.updateUser(req.params.id, { status });
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json({ success: true, user });
});

module.exports = router;

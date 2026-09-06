const express = require('express');
const router = express.Router();
const db = require('../data/db');

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email } = req.body;
  const user = db.getUserByEmail(email || '');
  if (!user) {
    return res.status(401).json({ error: 'Invalid email credentials' });
  }
  return res.json({
    token: `jwt-token-${user.id}`,
    user
  });
});

// POST /api/auth/signup
router.post('/signup', (req, res) => {
  const { name, email, role, bio } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required' });
  }
  const existing = db.getUserByEmail(email);
  if (existing) {
    return res.status(400).json({ error: 'User already exists with this email' });
  }
  const newUser = db.createUser({
    name,
    email,
    role: role || 'student',
    avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`,
    bio: bio || 'Lifelong learner at LearnFlow',
    enrolledCourses: [],
    certificatesEarned: [],
    totalHoursLearned: 0,
    streak: 1,
    status: 'active',
    joinDate: new Date().toISOString().split('T')[0]
  });
  return res.status(201).json({
    token: `jwt-token-${newUser.id}`,
    user: newUser
  });
});

// GET /api/auth/me/:id
router.get('/me/:id', (req, res) => {
  const user = db.getUserById(req.params.id);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  return res.json({ user });
});

// GET /api/auth/users
router.get('/users', (req, res) => {
  const role = req.query.role;
  let users = db.getUsers();
  if (role) {
    users = users.filter(u => u.role === role);
  }
  return res.json({ users });
});

module.exports = router;

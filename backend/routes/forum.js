const express = require('express');
const router = express.Router();
const db = require('../data/db');

// GET /api/forum?courseId=xxx
router.get('/', (req, res) => {
  const threads = db.getForumThreads(req.query.courseId);
  res.json({ threads });
});

// GET /api/forum/:id
router.get('/:id', (req, res) => {
  const thread = db.getForumThreadById(req.params.id);
  if (!thread) {
    return res.status(404).json({ error: 'Thread not found' });
  }
  res.json({ thread });
});

// POST /api/forum
router.post('/', (req, res) => {
  const { courseId, userId, userName, userAvatar, title, content, topic } = req.body;
  if (!title || !content) {
    return res.status(400).json({ error: 'Title and content are required' });
  }
  const newThread = db.createForumThread({
    courseId: courseId || 'course-1',
    userId: userId || 'user-student-1',
    userName: userName || 'Student',
    userAvatar: userAvatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    title,
    content,
    topic: topic || 'General Q&A'
  });
  res.status(201).json({ thread: newThread });
});

// POST /api/forum/:id/reply
router.post('/:id/reply', (req, res) => {
  const { userId, userName, userAvatar, content, isInstructor } = req.body;
  if (!content) {
    return res.status(400).json({ error: 'Reply content cannot be empty' });
  }
  const reply = db.addForumReply(req.params.id, {
    userId,
    userName,
    userAvatar,
    content,
    isInstructor: !!isInstructor
  });
  if (!reply) {
    return res.status(404).json({ error: 'Thread not found' });
  }
  res.status(201).json({ reply });
});

module.exports = router;

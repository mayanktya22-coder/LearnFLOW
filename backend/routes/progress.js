const express = require('express');
const router = express.Router();
const db = require('../data/db');

// GET /api/progress/:userId/:courseId
router.get('/:userId/:courseId', (req, res) => {
  const { userId, courseId } = req.params;
  const progress = db.getProgress(userId, courseId) || {
    userId,
    courseId,
    lessonsCompleted: [],
    currentLessonId: null,
    completionPercentage: 0,
    hoursWatched: 0,
    quizScores: {},
    assignmentScores: {},
    lastAccessed: new Date().toISOString()
  };
  res.json({ progress });
});

// POST /api/progress/complete-lesson
router.post('/complete-lesson', (req, res) => {
  const { userId, courseId, lessonId, nextLessonId } = req.body;
  if (!userId || !courseId || !lessonId) {
    return res.status(400).json({ error: 'userId, courseId, and lessonId are required' });
  }

  const course = db.getCourseById(courseId);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }

  // Calculate total lessons in course
  let totalLessons = 0;
  (course.sections || []).forEach(sec => {
    totalLessons += (sec.lessons || []).length;
  });

  const existingProg = db.getProgress(userId, courseId) || {
    lessonsCompleted: [],
    hoursWatched: 0
  };

  const completed = Array.from(new Set([...(existingProg.lessonsCompleted || []), lessonId]));
  const percentage = totalLessons > 0 ? Math.min(100, Math.round((completed.length / totalLessons) * 100)) : 100;
  const updatedHours = Number(existingProg.hoursWatched || 0) + 0.5;

  const updatedProg = db.updateProgress(userId, courseId, {
    lessonsCompleted: completed,
    currentLessonId: nextLessonId || lessonId,
    completionPercentage: percentage,
    hoursWatched: updatedHours
  });

  // Check if course is 100% completed and certificate not yet generated
  let newCert = null;
  if (percentage === 100) {
    const existingCert = db.getCertificates().find(c => c.userId === userId && c.courseId === courseId);
    if (!existingCert) {
      const user = db.getUserById(userId);
      newCert = db.createCertificate({
        userId,
        studentName: user ? user.name : 'Student',
        courseId,
        courseTitle: course.title,
        grade: 'A+ (95%)',
        instructorName: course.instructorName || 'Instructor',
        skills: course.learningOutcomes || ['Web Development', 'Full-Stack Engineering']
      });
      if (user && !user.certificatesEarned.includes(newCert.id)) {
        user.certificatesEarned.push(newCert.id);
        db.updateUser(userId, { certificatesEarned: user.certificatesEarned });
      }
    }
  }

  res.json({
    success: true,
    progress: updatedProg,
    certificate: newCert
  });
});

module.exports = router;

const express = require('express');
const router = express.Router();
const db = require('../data/db');

// POST /api/enrollments (Enroll student in a course)
router.post('/', (req, res) => {
  const { userId, courseId, paymentMethod, amountPaid } = req.body;
  if (!userId || !courseId) {
    return res.status(400).json({ error: 'userId and courseId are required' });
  }

  const user = db.getUserById(userId);
  const course = db.getCourseById(courseId);

  if (!user || !course) {
    return res.status(404).json({ error: 'User or Course not found' });
  }

  // Add course to user's enrolledCourses if not already enrolled
  if (!user.enrolledCourses.includes(courseId)) {
    user.enrolledCourses.push(courseId);
    course.studentCount = (course.studentCount || 0) + 1;
    course.revenue = (course.revenue || 0) + (amountPaid || 0);

    db.updateUser(userId, {
      enrolledCourses: user.enrolledCourses,
      totalSpent: (user.totalSpent || 0) + (amountPaid || 0)
    });
    db.updateCourse(courseId, {
      studentCount: course.studentCount,
      revenue: course.revenue
    });

    // Record payment
    db.createPayment({
      userId,
      userName: user.name,
      courseId,
      courseTitle: course.title,
      amount: amountPaid || 0,
      method: paymentMethod || 'Free Enrollment',
      status: 'success'
    });

    // Initialize progress record
    const firstLessonId = course.sections?.[0]?.lessons?.[0]?.id || null;
    db.updateProgress(userId, courseId, {
      lessonsCompleted: [],
      currentLessonId: firstLessonId,
      completionPercentage: 0,
      hoursWatched: 0
    });
  }

  res.json({
    success: true,
    message: 'Successfully enrolled!',
    enrolledCourses: user.enrolledCourses
  });
});

// GET /api/enrollments/my-courses/:userId
router.get('/my-courses/:userId', (req, res) => {
  const user = db.getUserById(req.params.userId);
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const allCourses = db.getCourses();
  const enrolled = allCourses.filter(c => user.enrolledCourses?.includes(c.id));

  // Attach student's specific progress to each course
  const enrolledWithProgress = enrolled.map(course => {
    const prog = db.getProgress(user.id, course.id) || {
      completionPercentage: 0,
      lessonsCompleted: [],
      hoursWatched: 0,
      lastAccessed: new Date().toISOString()
    };
    return {
      ...course,
      progress: prog
    };
  });

  res.json({ courses: enrolledWithProgress });
});

module.exports = router;

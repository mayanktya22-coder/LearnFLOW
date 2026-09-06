const express = require('express');
const router = express.Router();
const db = require('../data/db');

// GET /api/courses (with search, category, level, sort)
router.get('/', (req, res) => {
  const { category, level, search, sort, instructorId, status } = req.query;
  let courses = db.getCourses();

  if (status) {
    courses = courses.filter(c => c.status === status);
  } else if (!instructorId) {
    // default public view: published courses only
    courses = courses.filter(c => c.status === 'published');
  }

  if (category && category !== 'All') {
    courses = courses.filter(c => c.category.toLowerCase() === category.toLowerCase());
  }

  if (level && level !== 'All') {
    courses = courses.filter(c => c.level.toLowerCase() === level.toLowerCase());
  }

  if (instructorId) {
    courses = courses.filter(c => c.instructorId === instructorId);
  }

  if (search) {
    const term = search.toLowerCase();
    courses = courses.filter(c =>
      c.title.toLowerCase().includes(term) ||
      c.shortDescription.toLowerCase().includes(term) ||
      c.instructorName.toLowerCase().includes(term)
    );
  }

  if (sort === 'rating') {
    courses.sort((a, b) => b.rating - a.rating);
  } else if (sort === 'price-low') {
    courses.sort((a, b) => a.price - b.price);
  } else if (sort === 'price-high') {
    courses.sort((a, b) => b.price - a.price);
  } else if (sort === 'students') {
    courses.sort((a, b) => b.studentCount - a.studentCount);
  } else if (sort === 'newest') {
    courses.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  }

  res.json({ courses });
});

// GET /api/courses/:id
router.get('/:id', (req, res) => {
  const course = db.getCourseById(req.params.id);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json({ course });
});

// POST /api/courses
router.post('/', (req, res) => {
  const {
    title,
    category,
    level,
    price,
    originalPrice,
    discount,
    shortDescription,
    description,
    learningOutcomes,
    requirements,
    thumbnail,
    trailerUrl,
    instructorId,
    instructorName,
    instructorAvatar,
    sections,
    status
  } = req.body;

  if (!title || !category || price === undefined) {
    return res.status(400).json({ error: 'Title, category, and price are required' });
  }

  const newCourse = db.createCourse({
    title,
    category,
    level: level || 'Beginner',
    price: Number(price),
    originalPrice: Number(originalPrice || price),
    discount: Number(discount || 0),
    shortDescription: shortDescription || '',
    description: description || '',
    learningOutcomes: learningOutcomes || [],
    requirements: requirements || [],
    thumbnail: thumbnail || 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
    trailerUrl: trailerUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    instructorId: instructorId || 'user-instructor-1',
    instructorName: instructorName || 'Maitri Jain',
    instructorAvatar: instructorAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    sections: sections || [],
    status: status || 'pending_approval'
  });

  res.status(201).json({ course: newCourse });
});

// PUT /api/courses/:id
router.put('/:id', (req, res) => {
  const course = db.updateCourse(req.params.id, req.body);
  if (!course) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json({ course });
});

// DELETE /api/courses/:id
router.delete('/:id', (req, res) => {
  const deleted = db.deleteCourse(req.params.id);
  if (!deleted) {
    return res.status(404).json({ error: 'Course not found' });
  }
  res.json({ success: true, deleted });
});

module.exports = router;

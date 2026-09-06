const express = require('express');
const router = express.Router();
const db = require('../data/db');

// GET /api/quizzes/:id
router.get('/:id', (req, res) => {
  const quiz = db.getQuizById(req.params.id) || db.getQuizByLessonId(req.params.id);
  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }
  res.json({ quiz });
});

// POST /api/quizzes (Create new quiz)
router.post('/', (req, res) => {
  const { courseId, lessonId, title, timeLimitMinutes, passingScorePercent, questions } = req.body;
  if (!title || !questions) {
    return res.status(400).json({ error: 'Title and questions are required' });
  }
  const newQuiz = db.createQuiz({
    courseId,
    lessonId,
    title,
    timeLimitMinutes: Number(timeLimitMinutes || 15),
    passingScorePercent: Number(passingScorePercent || 60),
    attemptsAllowed: 0,
    questions: questions || []
  });
  res.status(201).json({ quiz: newQuiz });
});

// POST /api/quizzes/:id/submit (Submit student answers and calculate grade)
router.post('/:id/submit', (req, res) => {
  const { userId, answers } = req.body; // answers: { "q-1": "B", "q-2": "A", ... }
  const quiz = db.getQuizById(req.params.id) || db.getQuizByLessonId(req.params.id);

  if (!quiz) {
    return res.status(404).json({ error: 'Quiz not found' });
  }

  const questions = quiz.questions || [];
  let correctCount = 0;
  const breakdown = [];

  questions.forEach((q, idx) => {
    const studentAns = answers ? answers[q.id] : null;
    const isCorrect = studentAns === q.correctOption;
    if (isCorrect) correctCount++;

    breakdown.push({
      questionId: q.id,
      questionText: q.question,
      studentAnswer: studentAns,
      correctAnswer: q.correctOption,
      isCorrect,
      explanation: q.explanation || 'No explanation provided.'
    });
  });

  const total = questions.length || 1;
  const scorePercent = Math.round((correctCount / total) * 100);
  const passed = scorePercent >= (quiz.passingScorePercent || 60);

  // Update student progress if userId provided
  if (userId && quiz.courseId) {
    const prog = db.getProgress(userId, quiz.courseId) || {};
    const quizScores = prog.quizScores || {};
    quizScores[quiz.id] = scorePercent;
    db.updateProgress(userId, quiz.courseId, { quizScores });
  }

  res.json({
    score: scorePercent,
    correctCount,
    totalQuestions: total,
    passed,
    breakdown
  });
});

module.exports = router;

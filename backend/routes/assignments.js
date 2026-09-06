const express = require('express');
const router = express.Router();
const db = require('../data/db');

// GET /api/assignments/:id
router.get('/:id', (req, res) => {
  const assign = db.getAssignmentById(req.params.id) || db.getAssignmentByLessonId(req.params.id);
  if (!assign) {
    return res.status(404).json({ error: 'Assignment not found' });
  }
  res.json({ assignment: assign });
});

// GET /api/assignments/:id/submissions
router.get('/:id/submissions', (req, res) => {
  const submissions = db.getSubmissionsByAssignmentId(req.params.id);
  res.json({ submissions });
});

// POST /api/assignments/:id/submit (Student submits assignment)
router.post('/:id/submit', (req, res) => {
  const { studentId, studentName, studentEmail, submissionType, githubUrl, codeContent } = req.body;
  const assign = db.getAssignmentById(req.params.id) || db.getAssignmentByLessonId(req.params.id);

  if (!assign) {
    return res.status(404).json({ error: 'Assignment not found' });
  }

  const submission = db.createSubmission({
    assignmentId: assign.id,
    studentId,
    studentName,
    studentEmail,
    submissionType: submissionType || 'code',
    githubUrl: githubUrl || '',
    codeContent: codeContent || ''
  });

  res.status(201).json({ success: true, submission });
});

// POST /api/assignments/grade/:submissionId (Instructor grades submission using rubric)
router.post('/grade/:submissionId', (req, res) => {
  const { grade, feedback, rubricScores, gradedBy } = req.body;
  const submission = db.getSubmissionById(req.params.submissionId);

  if (!submission) {
    return res.status(404).json({ error: 'Submission not found' });
  }

  const updated = db.gradeSubmission(req.params.submissionId, {
    grade: Number(grade),
    feedback,
    rubricScores,
    gradedBy: gradedBy || 'Instructor'
  });

  // Also update student's assignment score in course progress
  const assign = db.getAssignmentById(submission.assignmentId);
  if (assign && assign.courseId) {
    const prog = db.getProgress(submission.studentId, assign.courseId) || {};
    const assignScores = prog.assignmentScores || {};
    assignScores[assign.id] = Number(grade);
    db.updateProgress(submission.studentId, assign.courseId, { assignmentScores: assignScores });
  }

  res.json({ success: true, submission: updated });
});

module.exports = router;

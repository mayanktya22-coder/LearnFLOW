const fs = require('fs');
const path = require('path');

const SEED_PATH = path.join(__dirname, 'seed.json');

class Database {
  constructor() {
    this.data = this.loadData();
  }

  loadData() {
    try {
      if (fs.existsSync(SEED_PATH)) {
        const raw = fs.readFileSync(SEED_PATH, 'utf-8');
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error('Error loading seed database:', err);
    }
    return {};
  }

  save() {
    try {
      fs.writeFileSync(SEED_PATH, JSON.stringify(this.data, null, 2), 'utf-8');
    } catch (err) {
      console.error('Error persisting database:', err);
    }
  }

  // Users
  getUsers() { return this.data.users || []; }
  getUserById(id) { return this.getUsers().find(u => u.id === id); }
  getUserByEmail(email) { return this.getUsers().find(u => u.email.toLowerCase() === email.toLowerCase()); }
  createUser(user) {
    this.data.users = this.data.users || [];
    const newUser = { id: `user-${Date.now()}`, ...user };
    this.data.users.push(newUser);
    this.save();
    return newUser;
  }
  updateUser(id, updates) {
    const user = this.getUserById(id);
    if (user) {
      Object.assign(user, updates);
      this.save();
    }
    return user;
  }

  // Courses
  getCourses() { return this.data.courses || []; }
  getCourseById(id) { return this.getCourses().find(c => c.id === id || c.slug === id); }
  createCourse(course) {
    this.data.courses = this.data.courses || [];
    const newCourse = {
      id: `course-${Date.now()}`,
      slug: (course.title || 'course').toLowerCase().replace(/[^a-z0-9]+/g, '-'),
      rating: 5.0,
      reviewCount: 0,
      studentCount: 0,
      revenue: 0,
      updatedAt: new Date().toISOString().split('T')[0],
      sections: [],
      ...course
    };
    this.data.courses.unshift(newCourse);
    this.save();
    return newCourse;
  }
  updateCourse(id, updates) {
    const course = this.getCourseById(id);
    if (course) {
      Object.assign(course, updates, { updatedAt: new Date().toISOString().split('T')[0] });
      this.save();
    }
    return course;
  }
  deleteCourse(id) {
    const index = this.getCourses().findIndex(c => c.id === id);
    if (index !== -1) {
      const deleted = this.data.courses.splice(index, 1)[0];
      this.save();
      return deleted;
    }
    return null;
  }

  // Quizzes
  getQuizzes() { return this.data.quizzes || []; }
  getQuizById(id) { return this.getQuizzes().find(q => q.id === id); }
  getQuizByLessonId(lessonId) { return this.getQuizzes().find(q => q.lessonId === lessonId); }
  createQuiz(quiz) {
    this.data.quizzes = this.data.quizzes || [];
    const newQuiz = { id: `quiz-${Date.now()}`, ...quiz };
    this.data.quizzes.push(newQuiz);
    this.save();
    return newQuiz;
  }

  // Assignments
  getAssignments() { return this.data.assignments || []; }
  getAssignmentById(id) { return this.getAssignments().find(a => a.id === id); }
  getAssignmentByLessonId(lessonId) { return this.getAssignments().find(a => a.lessonId === lessonId); }
  createAssignment(assign) {
    this.data.assignments = this.data.assignments || [];
    const newAssign = { id: `assign-${Date.now()}`, ...assign };
    this.data.assignments.push(newAssign);
    this.save();
    return newAssign;
  }

  // Submissions
  getSubmissions() { return this.data.submissions || []; }
  getSubmissionById(id) { return this.getSubmissions().find(s => s.id === id); }
  getSubmissionsByAssignmentId(assignmentId) {
    return this.getSubmissions().filter(s => s.assignmentId === assignmentId);
  }
  createSubmission(sub) {
    this.data.submissions = this.data.submissions || [];
    // remove existing submission if student resubmits
    const existingIndex = this.data.submissions.findIndex(
      s => s.assignmentId === sub.assignmentId && s.studentId === sub.studentId
    );
    const newSub = {
      id: `sub-${Date.now()}`,
      submissionDate: new Date().toISOString(),
      status: 'pending',
      grade: null,
      feedback: null,
      rubricScores: {},
      ...sub
    };
    if (existingIndex >= 0) {
      this.data.submissions[existingIndex] = newSub;
    } else {
      this.data.submissions.push(newSub);
    }
    this.save();
    return newSub;
  }
  gradeSubmission(id, gradeData) {
    const sub = this.getSubmissionById(id);
    if (sub) {
      Object.assign(sub, {
        status: 'graded',
        grade: gradeData.grade,
        feedback: gradeData.feedback,
        rubricScores: gradeData.rubricScores || {},
        gradedBy: gradeData.gradedBy,
        gradedAt: new Date().toISOString()
      });
      this.save();
    }
    return sub;
  }

  // Progress
  getProgress(userId, courseId) {
    const all = this.data.progress || [];
    return all.find(p => p.userId === userId && p.courseId === courseId);
  }
  updateProgress(userId, courseId, updates) {
    this.data.progress = this.data.progress || [];
    let record = this.getProgress(userId, courseId);
    if (!record) {
      record = {
        id: `prog-${Date.now()}`,
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
      this.data.progress.push(record);
    }
    Object.assign(record, updates, { lastAccessed: new Date().toISOString() });
    this.save();
    return record;
  }

  // Certificates
  getCertificates() { return this.data.certificates || []; }
  getCertificateById(id) {
    return this.getCertificates().find(c => c.id === id || c.certificateNumber === id);
  }
  createCertificate(cert) {
    this.data.certificates = this.data.certificates || [];
    const newCert = {
      id: `cert-${Date.now()}`,
      certificateNumber: `CERT-${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}-${Math.floor(10000 + Math.random() * 90000)}`,
      issuedDate: new Date().toISOString().split('T')[0],
      organization: 'LearnFlow Academy',
      ...cert
    };
    this.data.certificates.push(newCert);
    this.save();
    return newCert;
  }

  // Forum
  getForumThreads(courseId) {
    const threads = this.data.forum || [];
    return courseId ? threads.filter(t => t.courseId === courseId) : threads;
  }
  getForumThreadById(id) {
    return (this.data.forum || []).find(t => t.id === id);
  }
  createForumThread(thread) {
    this.data.forum = this.data.forum || [];
    const newThread = {
      id: `forum-${Date.now()}`,
      createdAt: new Date().toISOString(),
      likes: 0,
      views: 1,
      isAnswered: false,
      replies: [],
      ...thread
    };
    this.data.forum.unshift(newThread);
    this.save();
    return newThread;
  }
  addForumReply(threadId, reply) {
    const thread = this.getForumThreadById(threadId);
    if (thread) {
      const newReply = {
        id: `rep-${Date.now()}`,
        createdAt: new Date().toISOString(),
        likes: 0,
        isAccepted: false,
        ...reply
      };
      thread.replies.push(newReply);
      if (reply.isInstructor) {
        thread.isAnswered = true;
      }
      this.save();
      return newReply;
    }
    return null;
  }

  // Payments & Refunds
  getPayments() { return this.data.payments || []; }
  createPayment(payment) {
    this.data.payments = this.data.payments || [];
    const newPay = {
      id: `pay-${Date.now()}`,
      transactionId: `TXN-${payment.method || 'PAY'}-${Date.now().toString().slice(-8)}`,
      date: new Date().toISOString(),
      status: 'success',
      ...payment
    };
    this.data.payments.unshift(newPay);
    this.save();
    return newPay;
  }
  getRefundRequests() { return this.data.refundRequests || []; }
  updateRefundRequest(id, status) {
    const req = (this.data.refundRequests || []).find(r => r.id === id);
    if (req) {
      req.status = status;
      this.save();
    }
    return req;
  }

  // Instructor Applications & Payouts
  getApplications() { return this.data.instructorApplications || []; }
  updateApplication(id, status) {
    const app = (this.data.instructorApplications || []).find(a => a.id === id);
    if (app) {
      app.status = status;
      this.save();
    }
    return app;
  }
  getPayouts() { return this.data.instructorPayouts || []; }

  // Platform Analytics
  getAnalytics() { return this.data.analytics || {}; }
}

const db = new Database();
module.exports = db;

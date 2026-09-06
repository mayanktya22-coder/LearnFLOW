# LearnFlow — Modern Learning Management System (LMS)

LearnFlow is a modern, production-grade Learning Management System featuring interactive video masterclasses, multi-role access (Student, Instructor, and Administrator), hands-on code assignment submissions with rubric-based grading, discussion forums, and verifiable digital certificates.

---

## 🌟 Key Features

### 👨‍🎓 Student Portal
- **Course Discovery & Filtering**: Search and filter by category (Web Development, Python, UI/UX Design) and proficiency level.
- **Interactive Video Classroom**: Sleek custom player with seek, 10-second skip, speed controls, video resolution toggle, lesson notes, and downloadable project materials.
- **Coding Assignments**: Live in-browser coding interface with responsive split-screen preview and instant submission.
- **Auto-Graded Quizzes**: Multiple-choice assessments with immediate feedback, detailed rationale, and score tracking.
- **Verifiable Certificates**: Beautiful certificates of completion with QR code verification and direct sharing.
- **Streak & Gamification**: Daily learning streaks and real-time progress metrics.

### 👨‍🏫 Instructor Studio
- **Curriculum Builder**: Multi-step course creation wizard with section and lesson organization, video uploading/linking, and downloadable resources.
- **Interactive Rubric Grading**: Multi-criteria grading panel with interactive scoring sliders, code artifact inspector, and student feedback.
- **Analytics & Payouts**: Real-time tracking of student enrollments, completion rates, revenue, and payout history.

### 💼 Administrator Governance
- **Platform Analytics**: Total revenue, platform take rate, active students, and course completions.
- **Course Approval Workflow**: Review and approve instructor courses before catalog publication.
- **User & Dispute Management**: Audit student and instructor accounts, manage flags, and monitor academic compliance.

---

## 🛠️ Technology Stack

- **Frontend**: React 18, Vite, React Router v6, Lucide Icons, Custom CSS Design System (Inter font, Deep Teal `#0d9488` theme, Light/Dark mode).
- **Backend**: Node.js, Express, CORS, Morgan, REST API with in-memory/JSON datastore.

---

## 🚀 Getting Started

### 1. Prerequisites
- [Node.js](https://nodejs.org/) (v16 or higher)
- npm (comes with Node.js)

### 2. Installation
Install root, backend, and frontend dependencies:
```bash
npm run install:all
```

Or install separately:
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 3. Running Locally
Start both the backend server (port `5001`) and frontend dev server (port `5173`) with a single command:
```bash
npm run dev
```
Open your browser and visit: **http://localhost:5173**

---

## 🔐 Demo Accounts
Quick 1-click login is available on the login page:
- **Student**: Mayank Tyagi (`mayank@gmail.com`)
- **Instructor**: Maitri Jain (`maitri.jain@example.com`)
- **Super Admin**: Platform Governance (`admin@learnflow.dev`)

---

## 📄 License
MIT License. © 2026 LearnFlow Technologies Inc.

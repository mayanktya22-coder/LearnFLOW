import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  CheckCircle2,
  PlayCircle,
  HelpCircle,
  FileText,
  Lock,
  Download,
  Share2,
  Award,
  ChevronDown,
  ChevronUp,
  MessageSquare,
  ThumbsUp,
  FileCode,
  Users,
  Check,
  Sparkles,
  Send
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';
import VideoPlayer from '../components/VideoPlayer';
import QuizModal from '../components/QuizModal';
import AssignmentModal from '../components/AssignmentModal';
import CertificateModal from '../components/CertificateModal';

const LearningPage = () => {
  const { courseId } = useParams();
  const { courses, completeLesson, apiBase } = useCourse();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [currentSectionIdx, setCurrentSectionIdx] = useState(0);
  const [currentLessonIdx, setCurrentLessonIdx] = useState(0);
  const [activeTab, setActiveTab] = useState('overview'); // 'overview' | 'materials' | 'notes' | 'forum' | 'peers'

  const [progress, setProgress] = useState({ lessonsCompleted: [], completionPercentage: 0 });
  const [openSections, setOpenSections] = useState({ 0: true });

  // Modals
  const [activeQuiz, setActiveQuiz] = useState(null);
  const [activeAssignment, setActiveAssignment] = useState(null);
  const [earnedCertificate, setEarnedCertificate] = useState(null);

  // Forum State
  const [forumThreads, setForumThreads] = useState([]);
  const [newQuestionTitle, setNewQuestionTitle] = useState('');
  const [newQuestionContent, setNewQuestionContent] = useState('');
  const [replyContent, setReplyContent] = useState({});
  const [submittingForum, setSubmittingForum] = useState(false);

  useEffect(() => {
    const found = courses.find(c => c.id === courseId || c.slug === courseId);
    if (found) {
      setCourse(found);
    } else {
      fetch(`${apiBase}/courses/${courseId}`)
        .then(res => res.json())
        .then(data => {
          if (data.course) setCourse(data.course);
        });
    }

    if (user?.id) {
      fetch(`${apiBase}/progress/${user.id}/${courseId}`)
        .then(res => res.json())
        .then(data => {
          if (data.progress) setProgress(data.progress);
        });
    }

    // Fetch forum threads for this course
    fetch(`${apiBase}/forum?courseId=${courseId}`)
      .then(res => res.json())
      .then(data => {
        if (data.threads) setForumThreads(data.threads);
      });
  }, [courseId, courses, user, apiBase]);

  if (!course) {
    return (
      <div className="main-content" style={{ padding: '80px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 16, color: 'var(--text-secondary)' }}>Loading learning environment...</div>
      </div>
    );
  }

  const sections = course.sections || [];
  const currentSection = sections[currentSectionIdx] || sections[0];
  const lessons = currentSection?.lessons || [];
  const currentLesson = lessons[currentLessonIdx] || lessons[0];

  const totalLessonsCount = sections.reduce((acc, s) => acc + (s.lessons || []).length, 0);
  const isCurrentLessonCompleted = progress.lessonsCompleted?.includes(currentLesson?.id);

  const handleLessonSelect = (secIdx, lesIdx) => {
    setCurrentSectionIdx(secIdx);
    setCurrentLessonIdx(lesIdx);
    const selected = sections[secIdx]?.lessons?.[lesIdx];
    if (selected?.type === 'quiz' && selected.quizId) {
      fetch(`${apiBase}/quizzes/${selected.quizId}`)
        .then(res => res.json())
        .then(data => {
          if (data.quiz) setActiveQuiz(data.quiz);
        });
    } else if (selected?.type === 'assignment' && selected.assignmentId) {
      fetch(`${apiBase}/assignments/${selected.assignmentId}`)
        .then(res => res.json())
        .then(data => {
          if (data.assignment) setActiveAssignment(data.assignment);
        });
    }
  };

  const handleMarkComplete = async () => {
    if (!currentLesson) return;
    // calculate next lesson
    let nextSecIdx = currentSectionIdx;
    let nextLesIdx = currentLessonIdx + 1;
    if (nextLesIdx >= (sections[nextSecIdx]?.lessons || []).length) {
      nextSecIdx += 1;
      nextLesIdx = 0;
    }
    const nextLesson = sections[nextSecIdx]?.lessons?.[nextLesIdx];

    const result = await completeLesson(course.id, currentLesson.id, nextLesson?.id);
    if (result?.progress) {
      setProgress(result.progress);
    }
    if (result?.certificate) {
      setEarnedCertificate(result.certificate);
    }

    // Auto-advance if next lesson exists
    if (nextLesson && nextSecIdx < sections.length) {
      setCurrentSectionIdx(nextSecIdx);
      setCurrentLessonIdx(nextLesIdx);
      setOpenSections(prev => ({ ...prev, [nextSecIdx]: true }));
    }
  };

  const handlePostQuestion = async (e) => {
    e.preventDefault();
    if (!newQuestionTitle.trim() || !newQuestionContent.trim()) return;
    setSubmittingForum(true);
    try {
      const res = await fetch(`${apiBase}/forum`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: course.id,
          userId: user?.id,
          userName: user?.name,
          userAvatar: user?.avatar,
          title: newQuestionTitle,
          content: newQuestionContent,
          topic: currentSection?.title || 'General'
        })
      });
      const data = await res.json();
      if (data.thread) {
        setForumThreads(prev => [data.thread, ...prev]);
        setNewQuestionTitle('');
        setNewQuestionContent('');
      }
    } catch (err) {
      console.error('Forum submit error:', err);
    } finally {
      setSubmittingForum(false);
    }
  };

  const handleReplyThread = async (threadId) => {
    const text = replyContent[threadId];
    if (!text?.trim()) return;
    try {
      const res = await fetch(`${apiBase}/forum/${threadId}/reply`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          userName: user?.name,
          userAvatar: user?.avatar,
          content: text,
          isInstructor: user?.role === 'instructor'
        })
      });
      const data = await res.json();
      if (data.reply) {
        setForumThreads(prev => prev.map(t => {
          if (t.id === threadId) {
            return {
              ...t,
              isAnswered: user?.role === 'instructor' ? true : t.isAnswered,
              replies: [...(t.replies || []), data.reply]
            };
          }
          return t;
        }));
        setReplyContent(prev => ({ ...prev, [threadId]: '' }));
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-primary)' }}>
      {/* Top Classroom Bar */}
      <div style={{
        background: 'var(--bg-secondary)',
        borderBottom: '1px solid var(--border-color)',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 16,
        position: 'sticky',
        top: 64,
        zIndex: 90
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
          <Link to="/dashboard" className="btn btn-outline btn-sm" style={{ padding: '6px 10px' }}>
            <ArrowLeft size={16} /> Back
          </Link>
          <div>
            <h2 style={{ fontSize: 15, fontWeight: 800 }}>{course.title}</h2>
            <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>
              {currentSection?.title} • {currentLesson?.title}
            </div>
          </div>
        </div>

        {/* Center Progress Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, minWidth: 260 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, fontWeight: 700, marginBottom: 4 }}>
              <span>Course Progress</span>
              <span className="text-gradient">{progress.completionPercentage || 0}%</span>
            </div>
            <div className="progress-track" style={{ height: 6 }}>
              <div className="progress-fill" style={{ width: `${progress.completionPercentage || 0}%` }} />
            </div>
          </div>
          {progress.completionPercentage === 100 && (
            <button
              onClick={() => setEarnedCertificate({
                certificateNumber: 'CERT-2026-09-12345',
                studentName: user?.name || 'Mayank Tyagi',
                courseTitle: course.title,
                grade: 'A+ (96%)',
                issuedDate: new Date().toISOString().split('T')[0]
              })}
              className="btn btn-sm btn-primary"
              style={{ gap: 4 }}
            >
              <Award size={14} color="#fbbf24" /> View Cert
            </button>
          )}
        </div>
      </div>

      {/* Main Classroom Body */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 380px',
        flex: 1,
        maxWidth: 1600,
        margin: '0 auto',
        width: '100%',
        padding: '24px 24px 64px',
        gap: 24
      }}>
        {/* Left: Player & Tab Content */}
        <div>
          {/* Main Video / Content Area */}
          {currentLesson?.type === 'quiz' ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center', background: 'var(--bg-secondary)', marginBottom: 20 }}>
              <HelpCircle size={56} color="#fbbf24" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{currentLesson.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 500, margin: '0 auto 24px' }}>
                {currentLesson.description || 'Test your knowledge on this section to evaluate your comprehension and unlock future milestones.'}
              </p>
              <button
                onClick={() => {
                  fetch(`${apiBase}/quizzes/${currentLesson.quizId || 'quiz-101'}`)
                    .then(r => r.json())
                    .then(d => setActiveQuiz(d.quiz));
                }}
                className="btn btn-primary btn-lg"
                style={{ gap: 8 }}
              >
                <Sparkles size={18} /> Launch Interactive Quiz
              </button>
            </div>
          ) : currentLesson?.type === 'assignment' ? (
            <div className="glass-card" style={{ padding: 40, textAlign: 'center', background: 'var(--bg-secondary)', marginBottom: 20 }}>
              <FileCode size={56} color="var(--accent-primary)" style={{ margin: '0 auto 16px' }} />
              <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>{currentLesson.title}</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, maxWidth: 500, margin: '0 auto 24px' }}>
                {currentLesson.description || 'Submit your code or GitHub project repository for expert mentor review and rubric evaluation.'}
              </p>
              <button
                onClick={() => {
                  fetch(`${apiBase}/assignments/${currentLesson.assignmentId || 'assign-101'}`)
                    .then(r => r.json())
                    .then(d => setActiveAssignment(d.assignment));
                }}
                className="btn btn-primary btn-lg"
                style={{ gap: 8 }}
              >
                <FileCode size={18} /> Open Project Submission Desk
              </button>
            </div>
          ) : (
            <div style={{ marginBottom: 20 }}>
              <VideoPlayer
                videoUrl={currentLesson?.videoUrl}
                title={currentLesson?.title}
                onEnded={handleMarkComplete}
              />
            </div>
          )}

          {/* Action Row Under Video */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '16px 20px',
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius-lg)',
            border: '1px solid var(--border-color)',
            marginBottom: 24
          }}>
            <div>
              <h2 style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)' }}>{currentLesson?.title}</h2>
              <div style={{ fontSize: 12, color: 'var(--text-muted)', marginTop: 2 }}>
                Instructor: {course.instructorName} • Duration: {currentLesson?.duration}
              </div>
            </div>

            <div style={{ display: 'flex', gap: 10 }}>
              <button
                onClick={handleMarkComplete}
                className={`btn btn-sm ${isCurrentLessonCompleted ? 'btn-success' : 'btn-primary'}`}
                style={{ gap: 6 }}
              >
                <CheckCircle2 size={16} />
                {isCurrentLessonCompleted ? 'Completed ✓' : 'Mark as Complete & Next'}
              </button>
            </div>
          </div>

          {/* Tabs Navigation */}
          <div style={{
            display: 'flex',
            gap: 8,
            borderBottom: '1px solid var(--border-color)',
            marginBottom: 20
          }}>
            {[
              { id: 'overview', label: 'Lesson Overview' },
              { id: 'materials', label: 'Materials & Files' },
              { id: 'notes', label: 'Lecture Notes' },
              { id: 'forum', label: `Q&A Forum (${forumThreads.length})` },
              { id: 'peers', label: 'Peer Study (14 online)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  padding: '10px 16px',
                  background: 'transparent',
                  border: 'none',
                  borderBottom: activeTab === tab.id ? '2px solid var(--accent-primary)' : '2px solid transparent',
                  color: activeTab === tab.id ? 'var(--text-primary)' : 'var(--text-secondary)',
                  fontWeight: activeTab === tab.id ? 700 : 500,
                  fontSize: 13,
                  cursor: 'pointer'
                }}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Tab Content Panels */}
          <div className="glass-card" style={{ padding: 24 }}>
            {activeTab === 'overview' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 10 }}>About this Lesson</h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6, marginBottom: 16 }}>
                  {currentLesson?.description || 'In this lesson, you will explore real-world implementation patterns, best practices, and hands-on exercises.'}
                </p>
                <div style={{ display: 'flex', gap: 16, fontSize: 12, color: 'var(--text-muted)' }}>
                  <span>🎯 <strong>Difficulty:</strong> Beginner to Intermediate</span>
                  <span>⏱️ <strong>Duration:</strong> {currentLesson?.duration}</span>
                  <span>📦 <strong>Resources:</strong> Downloadable materials included</span>
                </div>
              </div>
            )}

            {activeTab === 'materials' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Downloadable Materials</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                  {(currentLesson?.materials || [
                    { name: 'HTML5_Semantic_Reference.pdf', size: '1.4 MB', type: 'pdf' },
                    { name: 'Starter_Project_Source.zip', size: '420 KB', type: 'zip' }
                  ]).map((mat, i) => (
                    <div
                      key={i}
                      style={{
                        padding: '12px 16px',
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <FileText size={18} color="var(--accent-primary)" />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 600 }}>{mat.name}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{mat.size}</div>
                        </div>
                      </div>
                      <a
                        href="#"
                        onClick={(e) => { e.preventDefault(); alert(`Downloading ${mat.name}...`); }}
                        className="btn btn-outline btn-sm"
                        style={{ padding: '6px 12px', gap: 6 }}
                      >
                        <Download size={14} /> Download
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'notes' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Lecture Notes & Code Snippets</h3>
                <div style={{
                  background: 'var(--bg-tertiary)',
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  fontSize: 13,
                  color: 'var(--text-secondary)',
                  lineHeight: 1.6,
                  fontFamily: 'var(--font-mono)'
                }}>
                  {currentLesson?.notes || 'No notes published for this lesson yet.'}
                </div>
              </div>
            )}

            {activeTab === 'forum' && (
              <div>
                {/* Ask New Question Form */}
                <form onSubmit={handlePostQuestion} style={{ marginBottom: 24, paddingBottom: 20, borderBottom: '1px solid var(--border-color)' }}>
                  <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Ask a Question</h4>
                  <div className="input-group" style={{ marginBottom: 10 }}>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="Title: e.g. How do I center a div using CSS Grid?"
                      value={newQuestionTitle}
                      onChange={(e) => setNewQuestionTitle(e.target.value)}
                    />
                  </div>
                  <div className="input-group" style={{ marginBottom: 12 }}>
                    <textarea
                      rows={3}
                      className="input-field"
                      placeholder="Describe what you tried or where you got stuck..."
                      value={newQuestionContent}
                      onChange={(e) => setNewQuestionContent(e.target.value)}
                    />
                  </div>
                  <button type="submit" disabled={submittingForum} className="btn btn-primary btn-sm">
                    <Send size={14} /> Post Question to Community
                  </button>
                </form>

                {/* Question Threads List */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                  {forumThreads.map(thread => (
                    <div
                      key={thread.id}
                      style={{
                        padding: 16,
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
                        <img src={thread.userAvatar} alt={thread.userName} style={{ width: 28, height: 28, borderRadius: '50%' }} />
                        <div>
                          <div style={{ fontSize: 13, fontWeight: 700 }}>{thread.userName}</div>
                          <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{thread.topic}</div>
                        </div>
                        {thread.isAnswered && (
                          <span className="badge badge-success" style={{ marginLeft: 'auto' }}>
                            ✓ Mentor Solved
                          </span>
                        )}
                      </div>

                      <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{thread.title}</h4>
                      <p style={{ fontSize: 13, color: 'var(--text-secondary)', lineHeight: 1.5, marginBottom: 12 }}>
                        {thread.content}
                      </p>

                      {/* Replies List */}
                      {thread.replies?.map(rep => (
                        <div
                          key={rep.id}
                          style={{
                            marginTop: 10,
                            padding: 12,
                            background: rep.isInstructor ? 'var(--accent-gradient-subtle)' : 'var(--bg-glass)',
                            borderRadius: 'var(--radius-sm)',
                            borderLeft: rep.isInstructor ? '3px solid var(--accent-primary)' : '3px solid transparent'
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                            <strong style={{ fontSize: 12 }}>{rep.userName}</strong>
                            {rep.isInstructor && <span className="badge badge-primary" style={{ fontSize: 10 }}>Instructor</span>}
                          </div>
                          <p style={{ fontSize: 12, color: 'var(--text-secondary)', lineHeight: 1.5 }}>
                            {rep.content}
                          </p>
                        </div>
                      ))}

                      {/* Reply Input */}
                      <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
                        <input
                          type="text"
                          placeholder="Write a response..."
                          className="input-field"
                          value={replyContent[thread.id] || ''}
                          onChange={(e) => setReplyContent({ ...replyContent, [thread.id]: e.target.value })}
                          style={{ marginBottom: 0, padding: '6px 12px', fontSize: 12 }}
                        />
                        <button
                          type="button"
                          onClick={() => handleReplyThread(thread.id)}
                          className="btn btn-secondary btn-sm"
                        >
                          Reply
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'peers' && (
              <div>
                <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>Learners Currently Online</h3>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12 }}>
                  {['Sarah Johnson', 'Alex Chen', 'Pooja Sharma', 'David Kim', 'Elena Rostova'].map((peer, i) => (
                    <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: 10, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                      <div style={{ width: 10, height: 10, borderRadius: '50%', background: 'var(--success)' }} />
                      <span style={{ fontSize: 13, fontWeight: 600 }}>{peer}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Right Sidebar: Curriculum Drawer */}
        <div>
          <div className="glass-card" style={{ padding: 0, overflow: 'hidden', position: 'sticky', top: 128 }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid var(--border-color)', background: 'var(--bg-tertiary)' }}>
              <h3 style={{ fontSize: 15, fontWeight: 800 }}>Course Curriculum</h3>
              <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>
                {progress.lessonsCompleted?.length || 0} / {totalLessonsCount} Completed
              </p>
            </div>

            <div style={{ maxHeight: '72vh', overflowY: 'auto' }}>
              {sections.map((sec, sIdx) => {
                const isOpen = openSections[sIdx] !== false;
                return (
                  <div key={sec.id || sIdx} style={{ borderBottom: '1px solid var(--border-color)' }}>
                    <button
                      onClick={() => setOpenSections(prev => ({ ...prev, [sIdx]: !isOpen }))}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        background: 'var(--bg-glass)',
                        border: 'none',
                        color: 'var(--text-primary)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        cursor: 'pointer',
                        textAlign: 'left'
                      }}
                    >
                      <span style={{ fontSize: 13, fontWeight: 700 }}>{sec.title}</span>
                      {isOpen ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </button>

                    {isOpen && (
                      <div style={{ padding: '6px 8px', display: 'flex', flexDirection: 'column', gap: 4 }}>
                        {(sec.lessons || []).map((les, lIdx) => {
                          const isCurrent = currentSectionIdx === sIdx && currentLessonIdx === lIdx;
                          const isCompleted = progress.lessonsCompleted?.includes(les.id);
                          return (
                            <button
                              key={les.id}
                              onClick={() => handleLessonSelect(sIdx, lIdx)}
                              style={{
                                width: '100%',
                                padding: '10px 12px',
                                borderRadius: 'var(--radius-sm)',
                                border: isCurrent ? '1px solid var(--accent-primary)' : '1px solid transparent',
                                background: isCurrent ? 'var(--accent-gradient-subtle)' : 'transparent',
                                display: 'flex',
                                alignItems: 'center',
                                gap: 10,
                                textAlign: 'left',
                                cursor: 'pointer',
                                color: isCurrent ? 'var(--accent)' : 'var(--text-primary)'
                              }}
                            >
                              {isCompleted ? (
                                <CheckCircle2 size={16} color="var(--success)" style={{ flexShrink: 0 }} />
                              ) : les.type === 'quiz' ? (
                                <HelpCircle size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
                              ) : les.type === 'assignment' ? (
                                <FileText size={16} color="#10b981" style={{ flexShrink: 0 }} />
                              ) : (
                                <PlayCircle size={16} color={isCurrent ? 'var(--accent-primary)' : 'var(--text-muted)'} style={{ flexShrink: 0 }} />
                              )}

                              <div style={{ flex: 1, minWidth: 0 }}>
                                <div style={{
                                  fontSize: 12,
                                  fontWeight: isCurrent ? 700 : 500,
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis'
                                }}>
                                  {les.title}
                                </div>
                                <div style={{ fontSize: 10, color: 'var(--text-muted)' }}>{les.duration}</div>
                              </div>
                            </button>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Quiz Modal */}
      <QuizModal
        quiz={activeQuiz}
        isOpen={!!activeQuiz}
        onClose={() => setActiveQuiz(null)}
        onQuizComplete={handleMarkComplete}
      />

      {/* Assignment Modal */}
      <AssignmentModal
        assignment={activeAssignment}
        isOpen={!!activeAssignment}
        onClose={() => setActiveAssignment(null)}
        onAssignmentSubmitted={() => handleMarkComplete()}
      />

      {/* Certificate Modal */}
      <CertificateModal
        certificate={earnedCertificate}
        isOpen={!!earnedCertificate}
        onClose={() => setEarnedCertificate(null)}
      />
    </div>
  );
};

export default LearningPage;

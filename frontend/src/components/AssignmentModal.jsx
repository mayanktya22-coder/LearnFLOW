import React, { useState, useEffect } from 'react';
import {
  FileCode,
  GitBranch,
  Upload,
  CheckCircle2,
  Clock,
  Award,
  Send,
  X,
  Sparkles,
  BookOpen
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';

const AssignmentModal = ({ assignment, isOpen, onClose, onAssignmentSubmitted }) => {
  const { user } = useAuth();
  const { apiBase } = useCourse();

  const [subType, setSubType] = useState('code');
  const [githubUrl, setGithubUrl] = useState('https://github.com/johnsmith/responsive-agency-portfolio');
  const [codeContent, setCodeContent] = useState(`<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Agency Landing Page</title>
  <style>
    :root { --primary: #0d9488; }
    body { font-family: sans-serif; margin: 0; }
    .hero { padding: 60px 20px; text-align: center; background: #111827; color: white; }
    .btn { background: var(--primary); color: white; padding: 10px 20px; border-radius: 6px; }
  </style>
</head>
<body>
  <div class="hero">
    <h1>Transforming Ideas Into Scalable Products</h1>
    <p>Modern engineering tailored for high-growth tech ventures.</p>
    <a href="#contact" class="btn">Get Started</a>
  </div>
</body>
</html>`);

  const [existingSubmission, setExistingSubmission] = useState(null);
  const [loadingSubmission, setLoadingSubmission] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submittedSuccess, setSubmittedSuccess] = useState(false);

  useEffect(() => {
    if (!isOpen || !assignment) return;
    const fetchExisting = async () => {
      setLoadingSubmission(true);
      try {
        const res = await fetch(`${apiBase}/assignments/${assignment.id}/submissions`);
        const data = await res.json();
        const userSub = (data.submissions || []).find(s => s.studentId === user?.id);
        if (userSub) {
          setExistingSubmission(userSub);
          if (userSub.githubUrl) setGithubUrl(userSub.githubUrl);
          if (userSub.codeContent) setCodeContent(userSub.codeContent);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingSubmission(false);
      }
    };
    fetchExisting();
  }, [isOpen, assignment, user]);

  if (!isOpen || !assignment) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/assignments/${assignment.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentId: user?.id,
          studentName: user?.name,
          studentEmail: user?.email,
          submissionType: subType,
          githubUrl: subType === 'github' ? githubUrl : '',
          codeContent: subType === 'code' ? codeContent : ''
        })
      });
      const data = await res.json();
      if (data.success) {
        setExistingSubmission(data.submission);
        setSubmittedSuccess(true);
        if (onAssignmentSubmitted) onAssignmentSubmitted(data.submission);
        setTimeout(() => setSubmittedSuccess(false), 3000);
      }
    } catch (err) {
      console.error('Assignment submit error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      background: 'rgba(0,0,0,0.8)',
      backdropFilter: 'blur(12px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: 880,
        width: '100%',
        maxHeight: '92vh',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>{assignment.title}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Maximum Points: {assignment.maxPoints || 100} • Mentor Rubric Graded
            </p>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: 6, borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        {/* Content Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
          {/* Left Column: Instructions & Submission Form */}
          <div>
            <div style={{ marginBottom: 20 }}>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <BookOpen size={16} color="var(--accent-primary)" /> Project Brief & Instructions
              </h4>
              <div style={{
                background: 'var(--bg-tertiary)',
                padding: 14,
                borderRadius: 'var(--radius-md)',
                fontSize: 13,
                color: 'var(--text-secondary)',
                lineHeight: 1.6,
                whiteSpace: 'pre-line'
              }}>
                {assignment.instructions}
              </div>
            </div>

            {/* Submission Mode Selector */}
            <div style={{ marginBottom: 14 }}>
              <label className="input-label" style={{ marginBottom: 8, display: 'block' }}>Submission Method</label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                <button
                  type="button"
                  onClick={() => setSubType('code')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: subType === 'code' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: subType === 'code' ? 'var(--accent-gradient-subtle)' : 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <FileCode size={16} color="var(--accent-primary)" /> Code Editor
                </button>

                <button
                  type="button"
                  onClick={() => setSubType('github')}
                  style={{
                    padding: '8px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: subType === 'github' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: subType === 'github' ? 'var(--accent-gradient-subtle)' : 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <GitBranch size={16} color="#10b981" /> GitHub Link
                </button>
              </div>
            </div>

            {subType === 'code' ? (
              <div className="input-group">
                <label className="input-label">HTML/CSS/JS Source Code</label>
                <textarea
                  rows={8}
                  className="input-field"
                  value={codeContent}
                  onChange={(e) => setCodeContent(e.target.value)}
                  style={{ fontFamily: 'var(--font-mono)', fontSize: 12, resize: 'vertical' }}
                />
              </div>
            ) : (
              <div className="input-group">
                <label className="input-label">Public GitHub Repository URL</label>
                <input
                  type="url"
                  className="input-field"
                  placeholder="https://github.com/username/project"
                  value={githubUrl}
                  onChange={(e) => setGithubUrl(e.target.value)}
                />
              </div>
            )}

            <button
              onClick={handleSubmit}
              disabled={submitting}
              className="btn btn-primary"
              style={{ width: '100%', marginTop: 8 }}
            >
              {submitting ? 'Submitting Code...' : <><Send size={15} /> Submit Solution for Review</>}
            </button>

            {submittedSuccess && (
              <div style={{
                marginTop: 12,
                padding: '10px 14px',
                background: 'var(--success-bg)',
                border: '1px solid var(--success)',
                borderRadius: 'var(--radius-md)',
                color: '#34d399',
                fontSize: 13,
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}>
                <CheckCircle2 size={16} /> Assignment uploaded successfully! Mentor grading queued.
              </div>
            )}
          </div>

          {/* Right Column: Rubric & Past Grade/Feedback */}
          <div>
            {/* Status Card if already submitted */}
            {existingSubmission && (
              <div style={{
                padding: 16,
                background: 'var(--bg-tertiary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--border-color)',
                marginBottom: 20
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
                  <span style={{ fontSize: 13, fontWeight: 700 }}>Submission Status</span>
                  <span className={`badge ${existingSubmission.status === 'graded' ? 'badge-success' : 'badge-warning'}`}>
                    {existingSubmission.status === 'graded' ? 'GRADED' : 'PENDING REVIEW'}
                  </span>
                </div>

                {existingSubmission.status === 'graded' && (
                  <div>
                    <div style={{ fontSize: 24, fontWeight: 800, color: 'var(--text-primary)', marginBottom: 8 }}>
                      <span className="text-gradient">{existingSubmission.grade}</span> / 100
                    </div>

                    <div style={{
                      padding: 12,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-glass)',
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.5,
                      marginBottom: 10
                    }}>
                      💬 <strong>Instructor Feedback:</strong><br />
                      "{existingSubmission.feedback}"
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Rubric Breakdown */}
            <div>
              <h4 style={{ fontSize: 14, fontWeight: 700, marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                <Award size={16} color="#fbbf24" /> Grading Rubric
              </h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {assignment.rubric?.map((r) => {
                  const awarded = existingSubmission?.rubricScores?.[r.id];
                  return (
                    <div
                      key={r.id}
                      style={{
                        padding: 12,
                        background: 'var(--bg-tertiary)',
                        borderRadius: 'var(--radius-md)',
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
                        <span style={{ fontSize: 13, fontWeight: 600 }}>{r.criteria}</span>
                        <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--accent-primary)' }}>
                          {awarded !== undefined ? `${awarded} / ${r.maxPoints} pts` : `${r.maxPoints} pts`}
                        </span>
                      </div>
                      <p style={{ fontSize: 11, color: 'var(--text-muted)' }}>{r.description}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssignmentModal;

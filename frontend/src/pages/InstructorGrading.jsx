import React, { useState, useEffect } from 'react';
import {
  FileCode,
  GitBranch,
  Award,
  CheckCircle2,
  Clock,
  Send,
  Eye,
  Sparkles,
  UserCheck
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';

const InstructorGrading = () => {
  const { apiBase } = useCourse();
  const { user } = useAuth();

  const [submissions, setSubmissions] = useState([]);
  const [selectedSub, setSelectedSub] = useState(null);
  const [rubricScores, setRubricScores] = useState({ 'r-1': 25, 'r-2': 22, 'r-3': 25, 'r-4': 20 });
  const [feedback, setFeedback] = useState('Clean HTML semantics and solid responsive layout. Consider refining form focus indicators.');
  const [saving, setSaving] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const fetchSubmissions = async () => {
    try {
      const res = await fetch(`${apiBase}/assignments/assign-101/submissions`);
      const data = await res.json();
      if (data.submissions) {
        setSubmissions(data.submissions);
        if (data.submissions.length > 0) {
          setSelectedSub(data.submissions[0]);
          if (data.submissions[0].rubricScores && Object.keys(data.submissions[0].rubricScores).length > 0) {
            setRubricScores(data.submissions[0].rubricScores);
          }
          if (data.submissions[0].feedback) {
            setFeedback(data.submissions[0].feedback);
          }
        }
      }
    } catch (err) {
      console.error('Fetch submissions error:', err);
    }
  };

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const totalCalculatedGrade = Object.values(rubricScores).reduce((a, b) => Number(a) + Number(b), 0);

  const handleScoreChange = (rubricKey, score) => {
    setRubricScores(prev => ({ ...prev, [rubricKey]: Number(score) }));
  };

  const handleSelectSubmission = (sub) => {
    setSelectedSub(sub);
    if (sub.rubricScores && Object.keys(sub.rubricScores).length > 0) {
      setRubricScores(sub.rubricScores);
    } else {
      setRubricScores({ 'r-1': 25, 'r-2': 22, 'r-3': 25, 'r-4': 20 });
    }
    if (sub.feedback) {
      setFeedback(sub.feedback);
    } else {
      setFeedback('Great work! Your HTML is clean and semantic. Keep up the solid progress!');
    }
  };

  const handleSaveGrade = async () => {
    if (!selectedSub) return;
    setSaving(true);
    try {
      const res = await fetch(`${apiBase}/assignments/grade/${selectedSub.id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          grade: totalCalculatedGrade,
          feedback,
          rubricScores,
          gradedBy: user?.name || 'Maitri Jain'
        })
      });
      const data = await res.json();
      if (data.success) {
        setSavedSuccess(true);
        await fetchSubmissions();
        setTimeout(() => setSavedSuccess(false), 3000);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="main-content animate-fade-in" style={{ paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <h1 style={{ fontSize: 26, fontWeight: 800, marginBottom: 6 }}>Assignment Rubric Grading Desk</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          Evaluate student project submissions against standardized rubric criteria and deliver actionable feedback.
        </p>
      </div>

      {/* Main Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: 24, alignItems: 'start' }}>
        {/* Left: Submissions Queue */}
        <div className="glass-card" style={{ padding: 20 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 14 }}>
            Submissions ({submissions.length})
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {submissions.map(sub => {
              const isSelected = selectedSub?.id === sub.id;
              return (
                <button
                  key={sub.id}
                  onClick={() => handleSelectSubmission(sub)}
                  style={{
                    padding: 14,
                    borderRadius: 'var(--radius-md)',
                    border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: isSelected ? 'var(--accent-gradient-subtle)' : 'var(--bg-tertiary)',
                    textAlign: 'left',
                    color: 'var(--text-primary)',
                    cursor: 'pointer'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                    <strong style={{ fontSize: 14 }}>{sub.studentName}</strong>
                    <span className={`badge ${sub.status === 'graded' ? 'badge-success' : 'badge-warning'}`} style={{ fontSize: 10 }}>
                      {sub.status === 'graded' ? `${sub.grade}/100` : 'Pending'}
                    </span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
                    {sub.studentEmail}
                  </div>
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    Type: {sub.submissionType} • {new Date(sub.submissionDate).toLocaleDateString()}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right: Submission Details & Rubric Scoring */}
        {selectedSub && (
          <div className="glass-card animate-fade-in" style={{ padding: 28 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20 }}>
              <div>
                <h2 style={{ fontSize: 20, fontWeight: 800 }}>{selectedSub.studentName}'s Project Submission</h2>
                <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>
                  Assignment: Build a Responsive Agency Landing Page
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>Auto Calculated Score</div>
                <div style={{ fontSize: 28, fontWeight: 800 }} className="text-gradient">
                  {totalCalculatedGrade} / 100
                </div>
              </div>
            </div>

            {/* Submission Preview Box */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                <FileCode size={16} color="var(--accent-primary)" /> Code & Project Artifacts
              </div>

              {selectedSub.githubUrl && (
                <div style={{ marginBottom: 12 }}>
                  <a
                    href={selectedSub.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-outline btn-sm"
                    style={{ gap: 6 }}
                  >
                    <GitBranch size={14} /> Open Repository ({selectedSub.githubUrl})
                  </a>
                </div>
              )}

              {selectedSub.codeContent && (
                <div style={{
                  background: '#0d1117',
                  color: '#f0f6fc',
                  padding: 16,
                  borderRadius: 'var(--radius-md)',
                  fontFamily: 'var(--font-mono)',
                  fontSize: 12,
                  maxHeight: 220,
                  overflowY: 'auto',
                  border: '1px solid var(--border-color)'
                }}>
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap' }}>{selectedSub.codeContent}</pre>
                </div>
              )}
            </div>

            {/* Rubric Evaluation Sliders */}
            <div style={{ marginBottom: 24 }}>
              <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Rubric Evaluation (100 Points Total)</h3>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                {/* HTML Semantic Structure */}
                <div style={{ padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>HTML Semantic Structure</span>
                    <strong style={{ color: 'var(--accent-primary)', fontSize: 13 }}>{rubricScores['r-1'] || 0} / 25 pts</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={rubricScores['r-1'] || 0}
                    onChange={(e) => handleScoreChange('r-1', e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    Use of header, nav, section, article, footer and accessibility attributes.
                  </div>
                </div>

                {/* CSS Styling */}
                <div style={{ padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>CSS Styling & Layout</span>
                    <strong style={{ color: 'var(--accent-primary)', fontSize: 13 }}>{rubricScores['r-2'] || 0} / 25 pts</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={rubricScores['r-2'] || 0}
                    onChange={(e) => handleScoreChange('r-2', e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    Clean typography, modern color palette, and CSS variables structure.
                  </div>
                </div>

                {/* Responsiveness */}
                <div style={{ padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Mobile Responsiveness</span>
                    <strong style={{ color: 'var(--accent-primary)', fontSize: 13 }}>{rubricScores['r-3'] || 0} / 25 pts</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={rubricScores['r-3'] || 0}
                    onChange={(e) => handleScoreChange('r-3', e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    Fluid Flexbox/Grid breakpoints across mobile, tablet, and desktop viewports.
                  </div>
                </div>

                {/* Functionality */}
                <div style={{ padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                    <span style={{ fontSize: 13, fontWeight: 600 }}>Functionality & Form Validation</span>
                    <strong style={{ color: 'var(--accent-primary)', fontSize: 13 }}>{rubricScores['r-4'] || 0} / 25 pts</strong>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="25"
                    value={rubricScores['r-4'] || 0}
                    onChange={(e) => handleScoreChange('r-4', e.target.value)}
                    style={{ width: '100%', accentColor: 'var(--accent)' }}
                  />
                  <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>
                    Interactive forms, working validation states, and zero console errors.
                  </div>
                </div>
              </div>
            </div>

            {/* Feedback Editor */}
            <div className="input-group">
              <label className="input-label">Detailed Mentor Feedback for Student</label>
              <textarea
                rows={4}
                className="input-field"
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </div>

            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 20 }}>
              {savedSuccess ? (
                <div style={{ color: 'var(--success)', display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, fontWeight: 600 }}>
                  <CheckCircle2 size={16} /> Grade recorded & student notified successfully!
                </div>
              ) : <div />}

              <button
                onClick={handleSaveGrade}
                disabled={saving}
                className="btn btn-primary"
                style={{ gap: 8 }}
              >
                {saving ? 'Recording Grade...' : <><Send size={15} /> Save Grade & Send Feedback</>}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default InstructorGrading;

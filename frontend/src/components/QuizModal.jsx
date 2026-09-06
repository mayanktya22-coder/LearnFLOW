import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import {
  Timer,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  RotateCcw,
  Sparkles,
  Award,
  X
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';

const QuizModal = ({ quiz, isOpen, onClose, onQuizComplete }) => {
  const { user } = useAuth();
  const { apiBase } = useCourse();

  const [currentIdx, setCurrentIdx] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [timeLeft, setTimeLeft] = useState((quiz?.timeLimitMinutes || 15) * 60);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [result, setResult] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!isOpen || isSubmitted) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [isOpen, isSubmitted]);

  if (!isOpen || !quiz) return null;

  const questions = quiz.questions || [];
  const currentQ = questions[currentIdx];

  const handleSelectOption = (questionId, optionId) => {
    if (isSubmitted) return;
    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: optionId
    }));
  };

  const handleSubmitQuiz = async () => {
    setSubmitting(true);
    try {
      const res = await fetch(`${apiBase}/quizzes/${quiz.id}/submit`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user?.id,
          answers: selectedAnswers
        })
      });
      const data = await res.json();
      setResult(data);
      setIsSubmitted(true);

      if (data.passed) {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      }

      if (onQuizComplete) {
        onQuizComplete(data);
      }
    } catch (err) {
      console.error('Quiz submission error:', err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleRetake = () => {
    setSelectedAnswers({});
    setCurrentIdx(0);
    setIsSubmitted(false);
    setResult(null);
    setTimeLeft((quiz?.timeLimitMinutes || 15) * 60);
  };

  const formatTimer = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
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
        maxWidth: 780,
        width: '100%',
        maxHeight: '90vh',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        {/* Header */}
        <div style={{
          padding: '18px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div>
            <h3 style={{ fontSize: 17, fontWeight: 800 }}>{quiz.title}</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>
              Passing score: {quiz.passingScorePercent}% • Total Questions: {questions.length}
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            {!isSubmitted && (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                background: timeLeft < 120 ? 'var(--danger-bg)' : 'var(--bg-tertiary)',
                color: timeLeft < 120 ? 'var(--danger)' : 'var(--text-primary)',
                padding: '6px 12px',
                borderRadius: 'var(--radius-full)',
                fontSize: 13,
                fontWeight: 700,
                fontFamily: 'var(--font-mono)'
              }}>
                <Timer size={16} />
                <span>{formatTimer(timeLeft)}</span>
              </div>
            )}
            <button onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: 6, borderRadius: '50%' }}>
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Modal Content Body */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          {!isSubmitted ? (
            <div>
              {/* Question Stepper */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--text-secondary)' }}>
                  Question {currentIdx + 1} of {questions.length}
                </span>
                <span style={{ fontSize: 12, color: 'var(--accent-primary)', fontWeight: 600 }}>
                  {Object.keys(selectedAnswers).length} / {questions.length} Answered
                </span>
              </div>

              {/* Progress bar */}
              <div className="progress-track" style={{ marginBottom: 24, height: 6 }}>
                <div
                  className="progress-fill"
                  style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}
                />
              </div>

              {/* Question Text */}
              {currentQ && (
                <div>
                  <h4 style={{ fontSize: 17, fontWeight: 700, lineHeight: 1.4, marginBottom: 20 }}>
                    {currentQ.question}
                  </h4>

                  {/* Options */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                    {currentQ.options?.map((opt) => {
                      const isSelected = selectedAnswers[currentQ.id] === opt.id;
                      return (
                        <button
                          key={opt.id}
                          type="button"
                          onClick={() => handleSelectOption(currentQ.id, opt.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 12,
                            padding: '14px 18px',
                            borderRadius: 'var(--radius-md)',
                            border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                            background: isSelected ? 'var(--accent-gradient-subtle)' : 'var(--bg-tertiary)',
                            color: 'var(--text-primary)',
                            cursor: 'pointer',
                            textAlign: 'left',
                            fontSize: 14,
                            transition: 'all 0.2s ease'
                          }}
                        >
                          <span style={{
                            width: 28,
                            height: 28,
                            borderRadius: '50%',
                            background: isSelected ? 'var(--accent-primary)' : 'var(--bg-glass)',
                            color: isSelected ? '#fff' : 'var(--text-secondary)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: 12,
                            fontWeight: 700,
                            flexShrink: 0
                          }}>
                            {opt.id}
                          </span>
                          <span style={{ flex: 1 }}>{opt.text}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* Results View */
            <div className="animate-fade-in">
              <div style={{
                textAlign: 'center',
                padding: '24px 0 20px',
                borderBottom: '1px solid var(--border-color)',
                marginBottom: 24
              }}>
                <div style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  background: result?.passed ? 'var(--success-bg)' : 'var(--danger-bg)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px'
                }}>
                  {result?.passed ? (
                    <Award size={36} color="var(--success)" />
                  ) : (
                    <XCircle size={36} color="var(--danger)" />
                  )}
                </div>

                <h3 style={{ fontSize: 22, fontWeight: 800 }}>
                  {result?.passed ? 'Assessment Passed! 🎉' : 'Needs Review'}
                </h3>
                <p style={{ fontSize: 14, color: 'var(--text-secondary)', marginTop: 4 }}>
                  Your Score: <strong>{result?.score}%</strong> ({result?.correctCount} / {result?.totalQuestions} correct)
                </p>
                <div style={{ marginTop: 10 }}>
                  <span className={`badge ${result?.passed ? 'badge-success' : 'badge-danger'}`}>
                    {result?.passed ? '✓ PASSED CRITERIA' : 'FAILED - RETAKE REQUIRED'}
                  </span>
                </div>
              </div>

              {/* Detailed Question Review Breakdown */}
              <h4 style={{ fontSize: 15, fontWeight: 700, marginBottom: 16 }}>Answers & Explanations</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
                {result?.breakdown?.map((item, idx) => (
                  <div
                    key={item.questionId}
                    style={{
                      padding: 16,
                      borderRadius: 'var(--radius-md)',
                      background: 'var(--bg-tertiary)',
                      border: `1px solid ${item.isCorrect ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      {item.isCorrect ? (
                        <CheckCircle2 size={18} color="var(--success)" />
                      ) : (
                        <XCircle size={18} color="var(--danger)" />
                      )}
                      <span style={{ fontSize: 13, fontWeight: 700 }}>
                        Q{idx + 1}: {item.isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                    </div>

                    <div style={{ fontSize: 13, color: 'var(--text-primary)', marginBottom: 8 }}>
                      {item.questionText}
                    </div>

                    <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginBottom: 4 }}>
                      Your Answer: <strong>{item.studentAnswer || 'None'}</strong> • Correct Answer: <strong>{item.correctAnswer}</strong>
                    </div>

                    <div style={{
                      marginTop: 8,
                      padding: '8px 12px',
                      borderRadius: 'var(--radius-sm)',
                      background: 'var(--bg-glass)',
                      fontSize: 12,
                      color: 'var(--text-secondary)',
                      lineHeight: 1.4
                    }}>
                      💡 <strong>Explanation:</strong> {item.explanation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          {!isSubmitted ? (
            <>
              <button
                type="button"
                onClick={() => setCurrentIdx(prev => Math.max(0, prev - 1))}
                disabled={currentIdx === 0}
                className="btn btn-secondary btn-sm"
              >
                <ArrowLeft size={14} /> Previous
              </button>

              {currentIdx < questions.length - 1 ? (
                <button
                  type="button"
                  onClick={() => setCurrentIdx(prev => Math.min(questions.length - 1, prev + 1))}
                  className="btn btn-primary btn-sm"
                >
                  Next <ArrowRight size={14} />
                </button>
              ) : (
                <button
                  type="button"
                  onClick={handleSubmitQuiz}
                  disabled={submitting}
                  className="btn btn-success btn-sm"
                >
                  {submitting ? 'Evaluating...' : 'Submit Assessment'}
                </button>
              )}
            </>
          ) : (
            <>
              <button onClick={handleRetake} className="btn btn-secondary btn-sm">
                <RotateCcw size={14} /> Retake Assessment
              </button>
              <button onClick={onClose} className="btn btn-primary btn-sm">
                Close & Continue Learning <ArrowRight size={14} />
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizModal;

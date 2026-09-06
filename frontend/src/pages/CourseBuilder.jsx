import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Plus,
  Trash2,
  Video,
  FileText,
  HelpCircle,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Layers,
  Save,
  BookOpen
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import { useAuth } from '../context/AuthContext';

const CourseBuilder = () => {
  const { courseId } = useParams();
  const { courses, fetchCourses, apiBase } = useCourse();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [saving, setSaving] = useState(false);

  // Form Fields
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [level, setLevel] = useState('Beginner');
  const [price, setPrice] = useState(999);
  const [originalPrice, setOriginalPrice] = useState(1999);
  const [discount, setDiscount] = useState(100);
  const [shortDescription, setShortDescription] = useState('');
  const [description, setDescription] = useState('');
  const [thumbnail, setThumbnail] = useState('https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80');
  const [learningOutcomes, setLearningOutcomes] = useState(['Master core syntax and architecture', 'Build 3 real-world portfolio applications']);
  const [requirements, setRequirements] = useState(['Basic computer skills and an internet connection']);

  // Curriculum State
  const [sections, setSections] = useState([
    {
      id: `sec-${Date.now()}`,
      title: 'Section 1: Architecture & Foundations',
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: 'Lesson 1: Introduction & Tooling Setup',
          duration: '15:00',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          type: 'video',
          description: 'Overview of the course roadmap and environment setup.'
        }
      ]
    }
  ]);

  useEffect(() => {
    if (courseId) {
      const existing = courses.find(c => c.id === courseId);
      if (existing) {
        setTitle(existing.title || '');
        setCategory(existing.category || 'Web Development');
        setLevel(existing.level || 'Beginner');
        setPrice(existing.price || 999);
        setOriginalPrice(existing.originalPrice || 1999);
        setDiscount(existing.discount || 0);
        setShortDescription(existing.shortDescription || '');
        setDescription(existing.description || '');
        setThumbnail(existing.thumbnail || '');
        if (existing.learningOutcomes) setLearningOutcomes(existing.learningOutcomes);
        if (existing.requirements) setRequirements(existing.requirements);
        if (existing.sections) setSections(existing.sections);
      }
    }
  }, [courseId, courses]);

  const handleAddOutcome = () => {
    setLearningOutcomes([...learningOutcomes, '']);
  };

  const handleUpdateOutcome = (index, val) => {
    const updated = [...learningOutcomes];
    updated[index] = val;
    setLearningOutcomes(updated);
  };

  const handleAddSection = () => {
    setSections([
      ...sections,
      {
        id: `sec-${Date.now()}`,
        title: `Section ${sections.length + 1}: New Topic Module`,
        lessons: []
      }
    ]);
  };

  const handleAddLesson = (secIdx, type = 'video') => {
    const updated = [...sections];
    updated[secIdx].lessons.push({
      id: `les-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: type === 'quiz' ? 'Section Assessment Quiz' : type === 'assignment' ? 'Capstone Project Assignment' : 'New Video Lecture',
      duration: type === 'quiz' ? '15:00' : '12:00',
      type,
      videoUrl: type === 'video' ? 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' : '',
      description: 'Lecture details and concepts.'
    });
    setSections(updated);
  };

  const handleSaveCourse = async (status = 'published') => {
    if (!title.trim()) {
      alert('Please enter a course title');
      setStep(1);
      return;
    }
    setSaving(true);
    try {
      const payload = {
        title,
        category,
        level,
        price: Number(price),
        originalPrice: Number(originalPrice),
        discount: Number(discount),
        shortDescription,
        description,
        thumbnail,
        learningOutcomes: learningOutcomes.filter(o => o.trim()),
        requirements: requirements.filter(r => r.trim()),
        sections,
        instructorId: user?.id,
        instructorName: user?.name,
        instructorAvatar: user?.avatar,
        status
      };

      const url = courseId ? `${apiBase}/courses/${courseId}` : `${apiBase}/courses`;
      const method = courseId ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.course) {
        await fetchCourses();
        navigate('/instructor/dashboard');
      }
    } catch (err) {
      console.error('Course save error:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="main-content animate-fade-in" style={{ paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 800 }}>{courseId ? 'Edit Masterclass' : 'Course Studio & Builder'}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13 }}>
            Design your curriculum, add quizzes and assignments, set pricing, and publish.
          </p>
        </div>

        <div style={{ display: 'flex', gap: 10 }}>
          <button
            onClick={() => handleSaveCourse('draft')}
            disabled={saving}
            className="btn btn-secondary btn-sm"
          >
            Save Draft
          </button>
          <button
            onClick={() => handleSaveCourse('published')}
            disabled={saving}
            className="btn btn-primary btn-sm"
          >
            {saving ? 'Saving...' : 'Publish Masterclass 🚀'}
          </button>
        </div>
      </div>

      {/* Stepper Wizard Bar */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 32 }}>
        {[
          { num: 1, label: 'Course Basics & Details' },
          { num: 2, label: 'Curriculum & Lessons' },
          { num: 3, label: 'Preview & Publish' }
        ].map(s => (
          <button
            key={s.num}
            onClick={() => setStep(s.num)}
            style={{
              flex: 1,
              padding: '12px 16px',
              borderRadius: 'var(--radius-md)',
              border: step === s.num ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
              background: step === s.num ? 'var(--accent-gradient-subtle)' : 'var(--bg-secondary)',
              color: step === s.num ? 'var(--accent)' : 'var(--text-secondary)',
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              cursor: 'pointer',
              fontWeight: 700,
              fontSize: 13
            }}
          >
            <span style={{
              width: 24,
              height: 24,
              borderRadius: '50%',
              background: step === s.num ? 'var(--accent-primary)' : 'var(--bg-tertiary)',
              color: '#fff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12
            }}>
              {s.num}
            </span>
            <span>{s.label}</span>
          </button>
        ))}
      </div>

      {/* STEP 1: Basic Info */}
      {step === 1 && (
        <div className="glass-card animate-fade-in" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Step 1: Course Information & Pricing</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20 }}>
            <div className="input-group">
              <label className="input-label">Masterclass Title *</label>
              <input
                type="text"
                className="input-field"
                placeholder="e.g. Modern Full-Stack Web Development Bootcamp"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Category *</label>
              <select
                className="input-field"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="Web Development">Web Development</option>
                <option value="Python">Python</option>
                <option value="Design">Design</option>
                <option value="Mobile Development">Mobile Development</option>
              </select>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 20 }}>
            <div className="input-group">
              <label className="input-label">Difficulty Level</label>
              <select className="input-field" value={level} onChange={(e) => setLevel(e.target.value)}>
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
              </select>
            </div>

            <div className="input-group">
              <label className="input-label">Selling Price (₹)</label>
              <input
                type="number"
                className="input-field"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
              />
            </div>

            <div className="input-group">
              <label className="input-label">Original Price (₹)</label>
              <input
                type="number"
                className="input-field"
                value={originalPrice}
                onChange={(e) => setOriginalPrice(e.target.value)}
              />
            </div>
          </div>

          <div className="input-group">
            <label className="input-label">Short Summary (Shown in Course Cards)</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Master HTML5, CSS3, Flexbox, CSS Grid, and modern JavaScript fundamentals..."
              value={shortDescription}
              onChange={(e) => setShortDescription(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Thumbnail Image URL</label>
            <input
              type="url"
              className="input-field"
              value={thumbnail}
              onChange={(e) => setThumbnail(e.target.value)}
            />
          </div>

          {/* Learning Outcomes */}
          <div style={{ marginTop: 16 }}>
            <label className="input-label" style={{ display: 'block', marginBottom: 8 }}>What Students Will Learn</label>
            {learningOutcomes.map((outcome, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 10, marginBottom: 8 }}>
                <input
                  type="text"
                  className="input-field"
                  placeholder={`Learning Outcome ${idx + 1}`}
                  value={outcome}
                  onChange={(e) => handleUpdateOutcome(idx, e.target.value)}
                  style={{ marginBottom: 0 }}
                />
              </div>
            ))}
            <button type="button" onClick={handleAddOutcome} className="btn btn-outline btn-sm" style={{ marginTop: 6 }}>
              + Add Learning Outcome
            </button>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 32 }}>
            <button onClick={() => setStep(2)} className="btn btn-primary">
              Continue to Curriculum <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 2: Curriculum Structure */}
      {step === 2 && (
        <div className="glass-card animate-fade-in" style={{ padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <div>
              <h3 style={{ fontSize: 18, fontWeight: 700 }}>Step 2: Curriculum & Assessment Builder</h3>
              <p style={{ fontSize: 13, color: 'var(--text-secondary)' }}>
                Organize your curriculum into structured modules with videos, quizzes, and assignments.
              </p>
            </div>
            <button onClick={handleAddSection} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
              <Plus size={15} /> Add Module / Section
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
            {sections.map((sec, sIdx) => (
              <div
                key={sec.id || sIdx}
                style={{
                  padding: 20,
                  background: 'var(--bg-tertiary)',
                  borderRadius: 'var(--radius-lg)',
                  border: '1px solid var(--border-color)'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                  <input
                    type="text"
                    className="input-field"
                    value={sec.title}
                    onChange={(e) => {
                      const updated = [...sections];
                      updated[sIdx].title = e.target.value;
                      setSections(updated);
                    }}
                    style={{ fontWeight: 700, fontSize: 15, marginBottom: 0 }}
                  />
                  <button
                    onClick={() => {
                      const updated = sections.filter((_, i) => i !== sIdx);
                      setSections(updated);
                    }}
                    className="btn btn-outline btn-sm"
                    style={{ color: 'var(--danger)' }}
                    title="Delete Section"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>

                {/* Lessons List in Section */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, paddingLeft: 12 }}>
                  {(sec.lessons || []).map((les, lIdx) => (
                    <div
                      key={les.id || lIdx}
                      style={{
                        padding: 12,
                        background: 'var(--bg-glass)',
                        borderRadius: 'var(--radius-md)',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 12,
                        border: '1px solid var(--border-color)'
                      }}
                    >
                      {les.type === 'quiz' ? (
                        <HelpCircle size={18} color="#fbbf24" />
                      ) : les.type === 'assignment' ? (
                        <FileText size={18} color="#10b981" />
                      ) : (
                        <Video size={18} color="var(--accent-primary)" />
                      )}

                      <input
                        type="text"
                        className="input-field"
                        value={les.title}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[sIdx].lessons[lIdx].title = e.target.value;
                          setSections(updated);
                        }}
                        style={{ marginBottom: 0, padding: '6px 12px', fontSize: 13, flex: 1 }}
                      />

                      <input
                        type="text"
                        className="input-field"
                        value={les.duration}
                        onChange={(e) => {
                          const updated = [...sections];
                          updated[sIdx].lessons[lIdx].duration = e.target.value;
                          setSections(updated);
                        }}
                        placeholder="15:00"
                        style={{ width: 80, marginBottom: 0, padding: '6px 8px', fontSize: 12 }}
                      />

                      <button
                        onClick={() => {
                          const updated = [...sections];
                          updated[sIdx].lessons = updated[sIdx].lessons.filter((_, i) => i !== lIdx);
                          setSections(updated);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  ))}

                  {/* Add Lesson Actions */}
                  <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => handleAddLesson(sIdx, 'video')}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 12 }}
                    >
                      <Video size={13} /> + Video Lesson
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddLesson(sIdx, 'quiz')}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 12 }}
                    >
                      <HelpCircle size={13} /> + Timed Quiz
                    </button>

                    <button
                      type="button"
                      onClick={() => handleAddLesson(sIdx, 'assignment')}
                      className="btn btn-outline btn-sm"
                      style={{ fontSize: 12 }}
                    >
                      <FileText size={13} /> + Rubric Assignment
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
            <button onClick={() => setStep(1)} className="btn btn-secondary">
              <ArrowLeft size={16} /> Back to Details
            </button>
            <button onClick={() => setStep(3)} className="btn btn-primary">
              Review Landing Page <ArrowRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* STEP 3: Preview & Finalize */}
      {step === 3 && (
        <div className="glass-card animate-fade-in" style={{ padding: 32 }}>
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 20 }}>Step 3: Preview Course Landing Page</h3>

          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 32, marginBottom: 32 }}>
            <div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 12 }}>
                <span className="badge badge-primary">{category}</span>
                <span className="badge badge-info">{level}</span>
              </div>
              <h2 style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>{title || 'Untitled Masterclass'}</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: 14, lineHeight: 1.6, marginBottom: 20 }}>
                {shortDescription || 'Masterclass overview and learning trajectory.'}
              </p>

              <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 10 }}>Curriculum Outline:</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {sections.map((sec, i) => (
                  <div key={i} style={{ padding: 10, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-sm)', fontSize: 13 }}>
                    <strong>{sec.title}</strong> ({sec.lessons?.length || 0} lessons)
                  </div>
                ))}
              </div>
            </div>

            <div>
              <div className="glass-card" style={{ padding: 20 }}>
                <img src={thumbnail} alt={title} style={{ width: '100%', height: 160, borderRadius: 'var(--radius-md)', objectFit: 'cover', marginBottom: 16 }} />
                <div style={{ fontSize: 24, fontWeight: 800, marginBottom: 12 }}>
                  ₹{price} <span style={{ fontSize: 14, textDecoration: 'line-through', color: 'var(--text-muted)' }}>₹{originalPrice}</span>
                </div>
                <button
                  onClick={() => handleSaveCourse('published')}
                  disabled={saving}
                  className="btn btn-primary"
                  style={{ width: '100%', padding: '12px' }}
                >
                  {saving ? 'Publishing...' : 'Publish to LearnFlow Catalog'}
                </button>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
            <button onClick={() => setStep(2)} className="btn btn-secondary">
              <ArrowLeft size={16} /> Back to Curriculum
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CourseBuilder;

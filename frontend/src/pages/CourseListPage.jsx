import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, SlidersHorizontal, ArrowUpDown, BookOpen } from 'lucide-react';
import { useCourse } from '../context/CourseContext';
import CourseCard from '../components/CourseCard';
import PaymentModal from '../components/PaymentModal';

const CourseListPage = () => {
  const { courses, enrolledCourses, searchQuery, setSearchQuery, selectedCategory, setSelectedCategory } = useCourse();
  const [selectedLevel, setSelectedLevel] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [selectedCourseForPayment, setSelectedCourseForPayment] = useState(null);
  const navigate = useNavigate();

  // Filter & Sort logic
  let filtered = [...courses];

  if (selectedCategory !== 'All') {
    filtered = filtered.filter(c => c.category?.toLowerCase() === selectedCategory.toLowerCase());
  }

  if (selectedLevel !== 'All') {
    filtered = filtered.filter(c => c.level?.toLowerCase() === selectedLevel.toLowerCase());
  }

  if (searchQuery.trim()) {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(c =>
      c.title.toLowerCase().includes(q) ||
      c.shortDescription?.toLowerCase().includes(q) ||
      c.instructorName?.toLowerCase().includes(q)
    );
  }

  if (sortBy === 'popular') {
    filtered.sort((a, b) => (b.studentCount || 0) - (a.studentCount || 0));
  } else if (sortBy === 'rating') {
    filtered.sort((a, b) => (b.rating || 0) - (a.rating || 0));
  } else if (sortBy === 'price-low') {
    filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
  } else if (sortBy === 'price-high') {
    filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
  }

  return (
    <div className="main-content animate-fade-in" style={{ paddingBottom: 64 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>All Courses</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 15 }}>
          Comprehensive curriculum taught by veteran software architects with practical capstone projects.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="glass-card" style={{ padding: 20, marginBottom: 32, display: 'flex', flexDirection: 'column', gap: 16 }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Search Box */}
          <div style={{ position: 'relative', flex: 1, minWidth: 260 }}>
            <Search size={16} color="var(--text-muted)" style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)' }} />
            <input
              type="text"
              className="input-field"
              placeholder="Search by title, keywords, instructor..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ paddingLeft: 38, marginBottom: 0 }}
            />
          </div>

          {/* Sort Dropdown */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <span style={{ fontSize: 13, color: 'var(--text-secondary)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
              <ArrowUpDown size={14} /> Sort:
            </span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="input-field"
              style={{ width: 170, marginBottom: 0, padding: '8px 12px' }}
            >
              <option value="popular">Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Category & Level Pills */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, borderTop: '1px solid var(--border-color)', paddingTop: 14 }}>
          {/* Categories */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginRight: 4 }}>
              Category:
            </span>
            {['All', 'Web Development', 'Python', 'Design'].map(cat => (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: selectedCategory === cat ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                  background: selectedCategory === cat ? 'var(--accent-light)' : 'var(--bg-secondary)',
                  color: selectedCategory === cat ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Levels */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', marginRight: 4 }}>
              Level:
            </span>
            {['All', 'Beginner', 'Intermediate', 'Advanced'].map(lvl => (
              <button
                key={lvl}
                type="button"
                onClick={() => setSelectedLevel(lvl)}
                style={{
                  padding: '5px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: selectedLevel === lvl ? '1px solid var(--accent)' : '1px solid var(--border-color)',
                  background: selectedLevel === lvl ? 'var(--accent-light)' : 'var(--bg-secondary)',
                  color: selectedLevel === lvl ? 'var(--accent)' : 'var(--text-secondary)',
                  fontSize: 12,
                  fontWeight: 500,
                  cursor: 'pointer'
                }}
              >
                {lvl}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Grid */}
      {filtered.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 24 }}>
          {filtered.map(course => {
            const isEnrolled = enrolledCourses.some(ec => ec.id === course.id);
            const enrolledData = enrolledCourses.find(ec => ec.id === course.id);
            return (
              <CourseCard
                key={course.id}
                course={course}
                isEnrolled={isEnrolled}
                progressPercent={enrolledData?.progress?.completionPercentage || 0}
                onEnrollClick={(c) => setSelectedCourseForPayment(c)}
              />
            );
          })}
        </div>
      ) : (
        <div className="glass-card" style={{ padding: '64px 24px', textAlign: 'center' }}>
          <BookOpen size={48} color="var(--text-muted)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>No courses match your criteria</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
            Try resetting your search query or selecting a different category.
          </p>
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedCategory('All');
              setSelectedLevel('All');
            }}
            className="btn btn-primary btn-sm"
          >
            Reset Filters
          </button>
        </div>
      )}

      {/* Checkout Modal */}
      <PaymentModal
        course={selectedCourseForPayment}
        isOpen={!!selectedCourseForPayment}
        onClose={() => setSelectedCourseForPayment(null)}
        onPaymentSuccess={(c) => navigate(`/learn/${c.id}`)}
      />
    </div>
  );
};

export default CourseListPage;

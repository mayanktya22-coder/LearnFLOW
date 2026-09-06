import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Users, Clock, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const CourseCard = ({ course, isEnrolled, progressPercent, onEnrollClick }) => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const discountedPrice = course.price;
  const originalPrice = course.originalPrice || (course.price + (course.discount || 0));

  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
      {/* Thumbnail */}
      <div style={{ position: 'relative', height: 170, overflow: 'hidden', background: 'var(--bg-tertiary)' }}>
        <img
          src={course.thumbnail}
          alt={course.title}
          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
        />
        {/* Level tag */}
        <span style={{
          position: 'absolute',
          bottom: 10,
          left: 10,
          background: 'rgba(0,0,0,0.7)',
          color: '#fff',
          fontSize: 11,
          fontWeight: 500,
          padding: '3px 8px',
          borderRadius: 'var(--radius-xs)',
          backdropFilter: 'blur(4px)'
        }}>
          {course.level}
        </span>
      </div>

      {/* Body */}
      <div style={{ padding: '18px 20px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ marginBottom: 6 }}>
          <span style={{ fontSize: 11, fontWeight: 500, color: 'var(--accent)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            {course.category}
          </span>
        </div>

        <Link to={`/courses/${course.id}`} style={{ textDecoration: 'none' }}>
          <h3 style={{
            fontSize: 15,
            fontWeight: 600,
            lineHeight: 1.4,
            marginBottom: 8,
            color: 'var(--text-primary)',
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden'
          }}>
            {course.title}
          </h3>
        </Link>

        <p style={{
          fontSize: 13,
          color: 'var(--text-secondary)',
          lineHeight: 1.5,
          marginBottom: 14,
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {course.shortDescription || course.description}
        </p>

        {/* Instructor */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 14 }}>
          <img
            src={course.instructorAvatar || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'}
            alt={course.instructorName}
            style={{ width: 20, height: 20, borderRadius: '50%', objectFit: 'cover' }}
          />
          <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>
            {course.instructorName}
          </span>
        </div>

        {/* Meta stats */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: 14,
          paddingBottom: 14,
          borderBottom: '1px solid var(--border-color)',
          fontSize: 12,
          color: 'var(--text-muted)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Star size={12} color="#f59e0b" fill="#f59e0b" />
            <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>{course.rating || 4.8}</span>
            <span>({course.reviewCount || 120})</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Users size={12} />
            <span>{(course.studentCount || 0).toLocaleString()}</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <Clock size={12} />
            <span>{course.duration || '25 hrs'}</span>
          </div>
        </div>

        {/* Progress bar if enrolled */}
        {isEnrolled && (
          <div style={{ marginTop: 14 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, fontWeight: 500, marginBottom: 5 }}>
              <span style={{ color: 'var(--text-muted)' }}>Progress</span>
              <span style={{ color: 'var(--accent)' }}>{progressPercent || 0}%</span>
            </div>
            <div className="progress-track">
              <div className="progress-fill" style={{ width: `${progressPercent || 0}%` }} />
            </div>
          </div>
        )}

        {/* Price and action */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginTop: 'auto',
          paddingTop: 16
        }}>
          {!isEnrolled ? (
            <div>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: 6 }}>
                <span style={{ fontSize: 18, fontWeight: 700, color: 'var(--text-primary)' }}>
                  {discountedPrice === 0 ? 'Free' : `₹${discountedPrice.toLocaleString()}`}
                </span>
                {originalPrice > discountedPrice && (
                  <span style={{ fontSize: 12, textDecoration: 'line-through', color: 'var(--text-muted)' }}>
                    ₹{originalPrice.toLocaleString()}
                  </span>
                )}
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: 5, color: 'var(--success)', fontSize: 12, fontWeight: 500 }}>
              <CheckCircle size={14} />
              Enrolled
            </div>
          )}

          <div style={{ display: 'flex', gap: 6 }}>
            {isEnrolled ? (
              <Link to={`/learn/${course.id}`} className="btn btn-primary btn-sm">
                Continue
              </Link>
            ) : (
              <>
                <Link to={`/courses/${course.id}`} className="btn btn-secondary btn-sm">
                  Details
                </Link>
                <button
                  onClick={() => onEnrollClick ? onEnrollClick(course) : navigate(`/courses/${course.id}`)}
                  className="btn btn-primary btn-sm"
                >
                  Enroll
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseCard;

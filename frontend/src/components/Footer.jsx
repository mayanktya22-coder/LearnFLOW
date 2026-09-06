import React from 'react';
import { Link } from 'react-router-dom';
import { GraduationCap } from 'lucide-react';

const LINKS = {
  Platform: [
    { label: 'All Courses', to: '/courses' },
    { label: 'Student Dashboard', to: '/dashboard' },
    { label: 'Instructor Studio', to: '/instructor/dashboard' },
    { label: 'Admin Panel', to: '/admin/dashboard' },
    { label: 'Verify Certificate', to: '/verify/CERT-2026-09-12345' }
  ],
  Topics: [
    { label: 'Web Development', to: '/courses' },
    { label: 'Python & Data Science', to: '/courses' },
    { label: 'UI/UX Design', to: '/courses' },
    { label: 'React & Next.js', to: '/courses' }
  ],
  Company: [
    { label: 'About us', to: '/' },
    { label: 'Terms of Service', to: '/terms' },
    { label: 'Privacy Policy', to: '/privacy' },
    { label: 'Contact', to: '/' }
  ]
};

const Footer = () => {
  return (
    <footer style={{
      background: 'var(--bg-secondary)',
      borderTop: '1px solid var(--border-color)',
      padding: '48px 32px 32px',
      marginTop: 'auto'
    }}>
      <div style={{
        maxWidth: 1280,
        margin: '0 auto',
        display: 'grid',
        gridTemplateColumns: '2fr 1fr 1fr 1fr',
        gap: 48,
        marginBottom: 48
      }}>
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
            <div style={{
              width: 28, height: 28,
              borderRadius: 'var(--radius-sm)',
              background: 'var(--accent)',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <GraduationCap size={16} color="#ffffff" />
            </div>
            <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              LearnFlow
            </span>
          </div>
          <p style={{ color: 'var(--text-muted)', fontSize: 13, lineHeight: 1.65, maxWidth: 280 }}>
            A Learning Management System for building real-world tech skills. Graded projects, verified certificates, and structured courses.
          </p>
        </div>

        {/* Link columns */}
        {Object.entries(LINKS).map(([section, links]) => (
          <div key={section}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              {section}
            </div>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: 9 }}>
              {links.map(link => (
                <li key={link.label}>
                  <Link
                    to={link.to}
                    style={{ fontSize: 13, color: 'var(--text-muted)', transition: 'color var(--transition)' }}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-primary)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div style={{
        maxWidth: 1280, margin: '0 auto',
        paddingTop: 24,
        borderTop: '1px solid var(--border-color)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: 12,
        fontSize: 12,
        color: 'var(--text-muted)'
      }}>
        <span>© 2026 LearnFlow Technologies Inc. All rights reserved.</span>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link to="/terms" style={{ color: 'var(--text-muted)', fontSize: 12 }}>Terms</Link>
          <Link to="/privacy" style={{ color: 'var(--text-muted)', fontSize: 12 }}>Privacy</Link>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

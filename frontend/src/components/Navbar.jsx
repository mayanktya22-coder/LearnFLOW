import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCourse } from '../context/CourseContext';
import {
  GraduationCap,
  Bell,
  Sun,
  Moon,
  Search,
  BookOpen,
  LayoutDashboard,
  PlusCircle,
  Award,
  ShieldCheck,
  ChevronDown,
  UserCheck,
  BarChart3,
  Check
} from 'lucide-react';

const Navbar = () => {
  const { user, theme, toggleTheme, demoProfiles, switchProfile, notifications, markAllNotificationsRead } = useAuth();
  const { searchQuery, setSearchQuery } = useCourse();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifMenu, setShowNotifMenu] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const unreadCount = notifications.filter(n => n.unread).length;

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) navigate('/courses');
  };

  const isActive = (path) => location.pathname === path;
  const isActivePart = (part) => location.pathname.startsWith(part);

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 100,
      background: 'var(--bg-primary)',
      borderBottom: '1px solid var(--border-color)',
      padding: '0 24px'
    }}>
      <div style={{
        maxWidth: 1440,
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        height: 56,
        gap: 20
      }}>
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', flexShrink: 0 }}>
          <div style={{
            width: 30,
            height: 30,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <GraduationCap size={17} color="#ffffff" />
          </div>
          <span style={{ fontSize: 15, fontWeight: 700, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
            LearnFlow
          </span>
        </Link>

        {/* Search */}
        <form onSubmit={handleSearchSubmit} style={{ position: 'relative', maxWidth: 300, flex: 1 }}>
          <Search size={14} color="var(--text-muted)" style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', pointerEvents: 'none' }} />
          <input
            type="text"
            placeholder="Search courses..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '6px 12px 6px 32px',
              fontSize: 13,
              borderRadius: 'var(--radius-md)',
              background: 'var(--bg-secondary)',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              outline: 'none',
              transition: 'border-color var(--transition)'
            }}
            onFocus={(e) => e.target.style.borderColor = 'var(--accent)'}
            onBlur={(e) => e.target.style.borderColor = 'var(--border-color)'}
          />
        </form>

        {/* Navigation */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          {user?.role === 'student' && (
            <>
              <Link
                to="/courses"
                className="btn btn-ghost btn-sm"
                style={{ color: isActive('/courses') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/courses') ? 600 : 400 }}
              >
                Explore
              </Link>
              <Link
                to="/dashboard"
                className="btn btn-ghost btn-sm"
                style={{ color: isActive('/dashboard') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/dashboard') ? 600 : 400 }}
              >
                My learning
              </Link>
            </>
          )}

          {user?.role === 'instructor' && (
            <>
              <Link
                to="/instructor/dashboard"
                className="btn btn-ghost btn-sm"
                style={{ color: isActive('/instructor/dashboard') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/instructor/dashboard') ? 600 : 400 }}
              >
                Studio
              </Link>
              <Link
                to="/instructor/course/create"
                className="btn btn-ghost btn-sm"
                style={{ color: isActive('/instructor/course/create') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/instructor/course/create') ? 600 : 400 }}
              >
                Create
              </Link>
              <Link
                to="/instructor/grading"
                className="btn btn-ghost btn-sm"
                style={{ color: isActive('/instructor/grading') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/instructor/grading') ? 600 : 400 }}
              >
                Submissions
              </Link>
              <Link
                to="/instructor/analytics"
                className="btn btn-ghost btn-sm"
                style={{ color: isActive('/instructor/analytics') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActive('/instructor/analytics') ? 600 : 400 }}
              >
                Analytics
              </Link>
            </>
          )}

          {user?.role === 'admin' && (
            <Link
              to="/admin/dashboard"
              className="btn btn-ghost btn-sm"
              style={{ color: isActivePart('/admin') ? 'var(--text-primary)' : 'var(--text-secondary)', fontWeight: isActivePart('/admin') ? 600 : 400 }}
            >
              Admin
            </Link>
          )}
        </nav>

        {/* Right controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, flexShrink: 0 }}>
          {/* Streak — show as plain text badge */}
          {user?.role === 'student' && (
            <div style={{
              fontSize: 12,
              fontWeight: 500,
              color: 'var(--text-secondary)',
              padding: '4px 10px',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--radius-sm)',
              background: 'var(--bg-secondary)'
            }}>
              {user.streak || 7} day streak
            </div>
          )}

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            className="btn btn-ghost btn-sm"
            style={{ padding: 7, borderRadius: 'var(--radius-sm)' }}
            title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
          >
            {theme === 'dark' ? <Sun size={15} /> : <Moon size={15} />}
          </button>

          {/* Notifications */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowNotifMenu(!showNotifMenu); setShowRoleMenu(false); }}
              className="btn btn-ghost btn-sm"
              style={{ padding: 7, borderRadius: 'var(--radius-sm)', position: 'relative' }}
            >
              <Bell size={15} />
              {unreadCount > 0 && (
                <span style={{
                  position: 'absolute', top: 4, right: 4,
                  width: 7, height: 7,
                  background: 'var(--danger)',
                  borderRadius: '50%',
                  border: '1.5px solid var(--bg-primary)'
                }} />
              )}
            </button>

            {showNotifMenu && (
              <div className="card animate-fade-in" style={{
                position: 'absolute', top: 42, right: 0,
                width: 320, padding: 16, zIndex: 200
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                  <span style={{ fontWeight: 600, fontSize: 14 }}>Notifications</span>
                  {unreadCount > 0 && (
                    <button
                      onClick={markAllNotificationsRead}
                      style={{ background: 'none', border: 'none', color: 'var(--accent)', fontSize: 12, fontWeight: 500, cursor: 'pointer' }}
                    >
                      Mark all read
                    </button>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {notifications.map(n => (
                    <div
                      key={n.id}
                      style={{
                        padding: '10px 12px',
                        background: n.unread ? 'var(--accent-light)' : 'var(--bg-secondary)',
                        borderRadius: 'var(--radius-md)',
                        borderLeft: n.unread ? '3px solid var(--accent)' : '3px solid transparent'
                      }}
                    >
                      <div style={{ fontSize: 13, fontWeight: 500, color: 'var(--text-primary)' }}>{n.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--text-secondary)', marginTop: 2 }}>{n.message}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)', marginTop: 4 }}>{n.time}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile switcher */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => { setShowRoleMenu(!showRoleMenu); setShowNotifMenu(false); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '4px 10px 4px 4px',
                background: 'transparent',
                border: '1px solid var(--border-color)',
                borderRadius: 'var(--radius-full)',
                cursor: 'pointer',
                transition: 'background var(--transition), border-color var(--transition)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = 'var(--bg-secondary)';
                e.currentTarget.style.borderColor = 'var(--border-strong)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }}
            >
              <img
                src={user?.avatar}
                alt={user?.name}
                style={{ width: 26, height: 26, borderRadius: '50%', objectFit: 'cover' }}
              />
              <div style={{ textAlign: 'left', lineHeight: 1.25 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--text-primary)' }}>{user?.name}</div>
                <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{user?.role}</div>
              </div>
              <ChevronDown size={13} color="var(--text-muted)" />
            </button>

            {showRoleMenu && (
              <div className="card animate-fade-in" style={{
                position: 'absolute', top: 44, right: 0,
                width: 240, padding: 8, zIndex: 200
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', padding: '4px 8px 8px', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                  Switch persona
                </div>
                {demoProfiles.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      switchProfile(p.id);
                      setShowRoleMenu(false);
                      if (p.role === 'student') navigate('/dashboard');
                      else if (p.role === 'instructor') navigate('/instructor/dashboard');
                      else if (p.role === 'admin') navigate('/admin/dashboard');
                    }}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 10,
                      padding: '8px',
                      width: '100%',
                      background: user.id === p.id ? 'var(--accent-light)' : 'transparent',
                      border: 'none',
                      borderRadius: 'var(--radius-md)',
                      cursor: 'pointer',
                      textAlign: 'left',
                      color: 'var(--text-primary)',
                      transition: 'background var(--transition)'
                    }}
                    onMouseEnter={(e) => { if (user.id !== p.id) e.currentTarget.style.background = 'var(--bg-secondary)'; }}
                    onMouseLeave={(e) => { if (user.id !== p.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <img src={p.avatar} alt={p.name} style={{ width: 30, height: 30, borderRadius: '50%', objectFit: 'cover' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 13, fontWeight: 500 }}>{p.name}</div>
                      <div style={{ fontSize: 11, color: 'var(--text-muted)' }}>{p.roleLabel}</div>
                    </div>
                    {user.id === p.id && <Check size={14} color="var(--accent)" />}
                  </button>
                ))}
                <hr className="divider" style={{ margin: '8px 0' }} />
                <Link
                  to="/verify/CERT-2026-09-12345"
                  onClick={() => setShowRoleMenu(false)}
                  style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '6px 8px', fontSize: 12, color: 'var(--text-secondary)', borderRadius: 'var(--radius-sm)' }}
                >
                  <Award size={13} />
                  Verify a certificate
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;

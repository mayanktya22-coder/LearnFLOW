import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, Lock, Mail, ShieldCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const LoginPage = () => {
  const { demoProfiles, switchProfile, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleDemoLogin = (profile) => {
    switchProfile(profile.id);
    if (profile.role === 'student') navigate('/dashboard');
    else if (profile.role === 'instructor') navigate('/instructor/dashboard');
    else if (profile.role === 'admin') navigate('/admin/dashboard');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const target = demoProfiles.find(p => p.email.toLowerCase() === email.toLowerCase()) || demoProfiles[0];
    handleDemoLogin(target);
  };

  return (
    <div className="main-content animate-fade-in" style={{ padding: '60px 24px 80px', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{ maxWidth: 480, width: '100%', padding: '40px 36px' }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{
            width: 40,
            height: 40,
            borderRadius: 'var(--radius-sm)',
            background: 'var(--accent)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 16px'
          }}>
            <GraduationCap size={22} color="#fff" />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Welcome back</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
            Sign in to your LearnFlow account
          </p>
        </div>

        {/* Demo Fast Logins */}
        <div style={{ marginBottom: 24, padding: 14, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)', border: '1px solid var(--border-color)' }}>
          <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', marginBottom: 10, letterSpacing: '0.06em' }}>
            Quick demo access
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {demoProfiles.map(p => (
              <button
                key={p.id}
                type="button"
                onClick={() => handleDemoLogin(p)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 10,
                  padding: '8px 10px',
                  background: 'var(--bg-secondary)',
                  border: '1px solid var(--border-color)',
                  borderRadius: 'var(--radius-sm)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  color: 'var(--text-primary)',
                  transition: 'border-color var(--transition)'
                }}
              >
                <img src={p.avatar} alt={p.name} style={{ width: 26, height: 26, borderRadius: '50%' }} />
                <div style={{ flex: 1 }}>
                  <span style={{ fontSize: 13, fontWeight: 600 }}>{p.name}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)', marginLeft: 6 }}>({p.role})</span>
                </div>
                <ArrowRight size={13} color="var(--accent)" />
              </button>
            ))}
          </div>
        </div>

        {/* Standard Form */}
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="e.g. john@gmail.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="input-group">
            <label className="input-label">Password</label>
            <input
              type="password"
              className="input-field"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 8 }}>
            Sign In to LMS
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
          Don't have an account? <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: 500 }}>Create account</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { GraduationCap, ArrowRight, User, Mail, Lock } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SignupPage = () => {
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [role, setRole] = useState('student');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    const newUser = {
      id: `user-${Date.now()}`,
      name: name || 'LearnFlow Scholar',
      email: email || 'student@example.com',
      role,
      roleLabel: role === 'instructor' ? 'Instructor Studio' : 'Student Portal',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80`,
      streak: 1,
      totalSpent: 0,
      status: 'active'
    };
    login(newUser);
    if (role === 'instructor') navigate('/instructor/dashboard');
    else navigate('/dashboard');
  };

  return (
    <div className="main-content animate-fade-in" style={{ padding: '60px 24px 80px', display: 'flex', justifyContent: 'center' }}>
      <div className="glass-card" style={{ maxWidth: 480, width: '100%', padding: '40px 36px' }}>
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
          <h1 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em' }}>Create your LearnFlow account</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: 13, marginTop: 6 }}>
            Join thousands of developers and designers learning today
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label className="input-label">Full Name</label>
            <input
              type="text"
              className="input-field"
              placeholder="e.g. Mayank Tyagi"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">Email Address</label>
            <input
              type="email"
              className="input-field"
              placeholder="e.g. john@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <label className="input-label">I want to join as</label>
            <select
              className="input-field"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="student">Student (Learn courses & earn certificates)</option>
              <option value="instructor">Instructor (Create & sell masterclasses)</option>
            </select>
          </div>

          <button type="submit" className="btn btn-primary" style={{ width: '100%', marginTop: 12 }}>
            Create Account & Get Started
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: 24, fontSize: 13, color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--accent)', fontWeight: 500 }}>Sign in</Link>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;

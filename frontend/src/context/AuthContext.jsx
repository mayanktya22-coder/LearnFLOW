import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const DEMO_PROFILES = [
  {
    id: 'user-student-1',
    name: 'Mayank Tyagi',
    email: 'mayank@gmail.com',
    role: 'student',
    roleLabel: 'Student Portal',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    bio: 'Aspiring Full-Stack Software Engineer & UI Enthusiast',
    streak: 7,
    totalSpent: 2997,
    status: 'active'
  },
  {
    id: 'user-instructor-1',
    name: 'Maitri Jain',
    email: 'maitri.jain@example.com',
    role: 'instructor',
    roleLabel: 'Instructor Studio',
    avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
    bio: 'Senior Frontend Architect & Educator',
    rating: 4.8,
    totalStudents: 1234,
    status: 'verified'
  },
  {
    id: 'user-admin-1',
    name: 'Super Admin',
    email: 'admin@learnflow.dev',
    role: 'admin',
    roleLabel: 'Admin Governance',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80',
    bio: 'Platform Operations & Academic Governance Lead',
    status: 'active'
  }
];

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('learnflow_user') || localStorage.getItem('learntricks_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const matched = DEMO_PROFILES.find(p => p.id === parsed.id);
        if (matched) return { ...parsed, name: matched.name, email: matched.email };
        return parsed;
      } catch (e) {
        return DEMO_PROFILES[0];
      }
    }
    return DEMO_PROFILES[0];
  });

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('learnflow_theme') || localStorage.getItem('learntricks_theme') || 'light';
  });

  const [notifications, setNotifications] = useState([
    { id: 'notif-1', title: 'Assignment Graded', message: 'Your landing page assignment received 92/100 (Grade A)!', time: '10m ago', unread: true },
    { id: 'notif-2', title: 'New Lesson Available', message: 'Section 3: JavaScript DOM Manipulation is now unlocked.', time: '2h ago', unread: true },
    { id: 'notif-3', title: '7-Day Streak Achieved', message: 'You are in the top 5% of daily learners this week.', time: '1d ago', unread: false }
  ]);

  useEffect(() => {
    localStorage.setItem('learnflow_user', JSON.stringify(user));
  }, [user]);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('learnflow_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  };

  const switchProfile = (profileId) => {
    const target = DEMO_PROFILES.find(p => p.id === profileId) || DEMO_PROFILES[0];
    setUser(target);
  };

  const switchRole = (role) => {
    const target = DEMO_PROFILES.find(p => p.role === role) || DEMO_PROFILES[0];
    setUser(target);
  };

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    // defaults back to student demo profile for seamless showcase
    setUser(DEMO_PROFILES[0]);
  };

  const markAllNotificationsRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        theme,
        toggleTheme,
        switchProfile,
        switchRole,
        login,
        logout,
        notifications,
        markAllNotificationsRead,
        demoProfiles: DEMO_PROFILES
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

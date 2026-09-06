import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CourseContext = createContext();

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const FALLBACK_COURSES = [
    {
      id: 'course-1', slug: 'web-development-fundamentals',
      title: 'Web Development Fundamentals', category: 'Web Development',
      level: 'Beginner', price: 999, originalPrice: 1999, discount: 1000,
      shortDescription: 'Master HTML, CSS, and JavaScript from the ground up with hands-on projects.',
      instructorName: 'Maitri Jain', instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=800&auto=format&fit=crop&q=80',
      rating: 4.8, reviewCount: 312, studentCount: 1240, duration: '28 hrs', status: 'published', sections: []
    },
    {
      id: 'course-2', slug: 'python-masterclass',
      title: 'Python Masterclass: From Zero to Data Hero', category: 'Python',
      level: 'Intermediate', price: 1299, originalPrice: 2499, discount: 1200,
      shortDescription: 'Complete Python course covering data science, automation, and ML fundamentals.',
      instructorName: 'Maitri Jain', instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?w=800&auto=format&fit=crop&q=80',
      rating: 4.9, reviewCount: 528, studentCount: 2180, duration: '42 hrs', status: 'published', sections: []
    },
    {
      id: 'course-3', slug: 'uiux-design-pro',
      title: 'UI/UX Design Pro: Figma to Code', category: 'Design',
      level: 'Beginner', price: 1099, originalPrice: 1999, discount: 900,
      shortDescription: 'Design stunning interfaces in Figma and bring them to life with real code.',
      instructorName: 'Maitri Jain', instructorAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      thumbnail: 'https://images.unsplash.com/photo-1561070791-2526d30994b5?w=800&auto=format&fit=crop&q=80',
      rating: 4.7, reviewCount: 189, studentCount: 870, duration: '22 hrs', status: 'published', sections: []
    }
  ];

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/courses`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      if (data.courses && data.courses.length > 0) {
        setCourses(data.courses);
      } else {
        setCourses(FALLBACK_COURSES);
      }
    } catch (err) {
      console.warn('API fetch failed, using fallback data:', err.message);
      setCourses(FALLBACK_COURSES);
    } finally {
      setLoading(false);
    }
  };

  const fetchEnrolledCourses = async () => {
    if (!user || user.role !== 'student') return;
    try {
      const res = await fetch(`${API_BASE}/enrollments/my-courses/${user.id}`);
      const data = await res.json();
      if (data.courses) {
        setEnrolledCourses(data.courses);
      }
    } catch (err) {
      console.warn('Could not fetch enrolled courses:', err);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  useEffect(() => {
    if (user?.id) {
      fetchEnrolledCourses();
    }
  }, [user]);

  const enrollInCourse = async (courseId, paymentMethod = 'Card', amount = 999) => {
    if (!user) return { success: false, error: 'Must be logged in' };
    try {
      const res = await fetch(`${API_BASE}/enrollments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId,
          paymentMethod,
          amountPaid: amount
        })
      });
      const data = await res.json();
      if (data.success) {
        await fetchEnrolledCourses();
        await fetchCourses();
        return { success: true };
      }
      return { success: false, error: data.error };
    } catch (err) {
      console.error('Enrollment error:', err);
      return { success: false, error: err.message };
    }
  };

  const completeLesson = async (courseId, lessonId, nextLessonId) => {
    if (!user) return null;
    try {
      const res = await fetch(`${API_BASE}/progress/complete-lesson`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          userId: user.id,
          courseId,
          lessonId,
          nextLessonId
        })
      });
      const data = await res.json();
      await fetchEnrolledCourses();
      return data;
    } catch (err) {
      console.error('Complete lesson error:', err);
      return null;
    }
  };

  return (
    <CourseContext.Provider
      value={{
        courses,
        enrolledCourses,
        loading,
        searchQuery,
        setSearchQuery,
        selectedCategory,
        setSelectedCategory,
        fetchCourses,
        fetchEnrolledCourses,
        enrollInCourse,
        completeLesson,
        apiBase: API_BASE
      }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const useCourse = () => useContext(CourseContext);

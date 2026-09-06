import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CourseContext = createContext();

const API_BASE = 'http://localhost:5001/api';

export const CourseProvider = ({ children }) => {
  const { user } = useAuth();
  const [courses, setCourses] = useState([]);
  const [enrolledCourses, setEnrolledCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/courses`);
      const data = await res.json();
      if (data.courses) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.warn('API fetch failed, utilizing fallback store', err);
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

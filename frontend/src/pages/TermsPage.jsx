import React from 'react';

const TermsPage = () => (
  <div className="main-content animate-fade-in" style={{ maxWidth: 720 }}>
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Legal</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>Terms of Service</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Last updated: September 2026</p>
    </div>

    {[
      {
        title: '1. Acceptance of Terms',
        body: 'By accessing and using the LearnFlow platform, you agree to be bound by these Terms of Service and all applicable laws and regulations. If you do not agree with any of these terms, you are prohibited from using or accessing this site.'
      },
      {
        title: '2. Use of the Platform',
        body: 'LearnFlow grants you a limited, non-exclusive, non-transferable license to access and use our platform for personal, non-commercial educational purposes. You may not reproduce, distribute, or create derivative works from any content on this platform without explicit written permission.'
      },
      {
        title: '3. User Accounts',
        body: 'You are responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account. You must notify us immediately of any unauthorized use of your account.'
      },
      {
        title: '4. Course Enrollment and Payments',
        body: 'When you purchase a course, you receive a non-transferable license to access that course content. All payments are processed securely. Refunds may be requested within 7 days of purchase for courses where less than 30% of the content has been consumed.'
      },
      {
        title: '5. Certificates',
        body: 'Certificates are issued upon successful completion of course requirements. LearnFlow certificates are digital and verifiable via our public verification system. Certificates do not constitute formal academic qualifications.'
      },
      {
        title: '6. Intellectual Property',
        body: 'All course content, including videos, text, quizzes, and assignments, remains the intellectual property of the respective instructors or LearnFlow Technologies Inc. Unauthorized reproduction or distribution is strictly prohibited.'
      },
      {
        title: '7. Limitation of Liability',
        body: 'LearnFlow shall not be liable for any indirect, incidental, special, or consequential damages resulting from your use of or inability to use the platform. Our total liability shall not exceed the amount you paid for the course in question.'
      },
      {
        title: '8. Governing Law',
        body: 'These terms shall be governed by and construed in accordance with the laws of Delaware, United States. Any disputes arising out of or related to these terms shall be subject to the exclusive jurisdiction of the competent courts.'
      }
    ].map(section => (
      <div key={section.title} style={{ marginBottom: 28 }}>
        <h2 style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--text-primary)' }}>
          {section.title}
        </h2>
        <p style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.7 }}>
          {section.body}
        </p>
      </div>
    ))}

    <div style={{
      marginTop: 40,
      padding: '20px',
      background: 'var(--bg-secondary)',
      border: '1px solid var(--border-color)',
      borderRadius: 'var(--radius-md)',
      fontSize: 13,
      color: 'var(--text-secondary)'
    }}>
      Questions? Contact us at <a href="mailto:legal@learnflow.dev" style={{ color: 'var(--accent)' }}>legal@learnflow.dev</a>
    </div>
  </div>
);

export default TermsPage;

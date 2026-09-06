import React from 'react';

const PrivacyPage = () => (
  <div className="main-content animate-fade-in" style={{ maxWidth: 720 }}>
    <div style={{ marginBottom: 32 }}>
      <div style={{ fontSize: 12, color: 'var(--text-muted)', marginBottom: 8 }}>Legal</div>
      <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10 }}>Privacy Policy</h1>
      <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>Last updated: September 2026</p>
    </div>

    {[
      {
        title: '1. Information We Collect',
        body: 'We collect information you provide directly, such as your name, email address, and payment details when you create an account or enroll in a course. We also collect usage data including which lessons you complete, quiz scores, and assignment submissions to personalize your learning experience.'
      },
      {
        title: '2. How We Use Your Information',
        body: 'We use your information to operate and improve the platform, process transactions, send you service-related notifications, track your learning progress, and generate certificates upon course completion. We do not sell your personal information to third parties.'
      },
      {
        title: '3. Data Storage and Security',
        body: 'Your data is stored on servers located in India. We employ industry-standard security measures including encryption in transit (TLS) and at rest to protect your personal information. Despite these measures, no system is completely secure.'
      },
      {
        title: '4. Cookies and Tracking',
        body: 'We use essential cookies to operate the platform (e.g., keeping you logged in). We also use analytics cookies to understand how users interact with the platform and improve the experience. You can disable non-essential cookies in your browser settings.'
      },
      {
        title: '5. Sharing of Information',
        body: 'We may share your information with instructors to facilitate course delivery and grading. We may also disclose information to comply with legal obligations, enforce our policies, or protect the rights and safety of our users.'
      },
      {
        title: '6. Your Rights',
        body: 'You have the right to access, correct, or delete your personal data. You may also request a copy of your data or ask us to restrict its processing. To exercise these rights, contact us at privacy@learnflow.dev.'
      },
      {
        title: '7. Retention',
        body: 'We retain your account data for as long as your account is active. If you delete your account, we will delete or anonymize your personal data within 30 days, except where we are required to retain it by law (e.g., payment records).'
      },
      {
        title: '8. Changes to This Policy',
        body: 'We may update this Privacy Policy from time to time. We will notify you of significant changes via email or a notice on the platform. Your continued use of LearnFlow after changes constitutes your acceptance of the updated policy.'
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
      Privacy questions? Email <a href="mailto:privacy@learnflow.dev" style={{ color: 'var(--accent)' }}>privacy@learnflow.dev</a>
    </div>
  </div>
);

export default PrivacyPage;

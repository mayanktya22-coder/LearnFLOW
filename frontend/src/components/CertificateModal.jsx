import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import {
  Award,
  Download,
  Share2,
  CheckCircle2,
  ExternalLink,
  Copy,
  X,
  Sparkles,
  QrCode,
  ShieldCheck
} from 'lucide-react';

const CertificateModal = ({ certificate, isOpen, onClose }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      confetti({
        particleCount: 120,
        spread: 90,
        origin: { y: 0.5 }
      });
    }
  }, [isOpen]);

  if (!isOpen || !certificate) return null;

  const handleCopyLink = () => {
    const url = `${window.location.origin}/verify/${certificate.certificateNumber}`;
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShareLinkedIn = () => {
    const text = encodeURIComponent(
      `Excited to share that I have successfully completed "${certificate.courseTitle}" with grade ${certificate.grade} from LearnFlow Academy! 🚀🎓`
    );
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.origin)}&summary=${text}`, '_blank');
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      background: 'rgba(0,0,0,0.85)',
      backdropFilter: 'blur(16px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: 920,
        width: '100%',
        maxHeight: '94vh',
        background: 'var(--bg-secondary)',
        borderRadius: 'var(--radius-xl)',
        display: 'flex',
        flexDirection: 'column',
        overflow: 'hidden',
        border: '1px solid var(--border-color)'
      }}>
        {/* Header */}
        <div style={{
          padding: '16px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Award size={22} color="#fbbf24" />
            <span style={{ fontSize: 16, fontWeight: 800 }}>Certificate of Academic Completion</span>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: 6, borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        {/* Certificate Display Canvas Container */}
        <div style={{ padding: 24, overflowY: 'auto', flex: 1 }}>
          <div
            id="printable-certificate"
            style={{
              position: 'relative',
              background: '#0d1117',
              color: '#f0f6fc',
              border: '8px double rgba(245, 158, 11, 0.6)',
              borderRadius: 16,
              padding: '48px 40px',
              textAlign: 'center',
              boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
              backgroundImage: 'radial-gradient(circle at 50% 50%, rgba(99, 102, 241, 0.08) 0%, transparent 80%)'
            }}
          >
            {/* Seal / Emblem */}
            <div style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #f59e0b, #d97706)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 16px',
              boxShadow: '0 0 24px rgba(245, 158, 11, 0.5)'
            }}>
              <Award size={36} color="#ffffff" />
            </div>

            <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '4px', textTransform: 'uppercase', color: '#14b8a6', marginBottom: 6 }}>
              LEARNFLOW ACADEMY
            </div>

            <h2 style={{ fontSize: 28, fontWeight: 800, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: 16, color: '#ffffff' }}>
              CERTIFICATE OF COMPLETION
            </h2>

            <p style={{ fontSize: 13, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: 12 }}>
              This certifies that
            </p>

            <div style={{
              fontSize: 32,
              fontWeight: 800,
              fontFamily: 'serif',
              color: '#ffffff',
              borderBottom: '2px solid rgba(245, 158, 11, 0.4)',
              display: 'inline-block',
              padding: '0 32px 8px',
              marginBottom: 16
            }}>
              {certificate.studentName || 'Mayank Tyagi'}
            </div>

            <p style={{ fontSize: 14, color: '#8b949e', maxWidth: 600, margin: '0 auto 16px', lineHeight: 1.6 }}>
              has successfully fulfilled all curriculum requirements, assessments, and projects with distinction in:
            </p>

            <h3 style={{ fontSize: 22, fontWeight: 800, color: '#14b8a6', marginBottom: 10 }}>
              {certificate.courseTitle}
            </h3>

            <div style={{ display: 'inline-flex', gap: 8, marginBottom: 28 }}>
              <span style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
                Grade: {certificate.grade || 'A+ (95%)'}
              </span>
              <span style={{ background: 'rgba(20, 184, 166, 0.2)', color: '#2dd4bf', padding: '4px 12px', borderRadius: 99, fontSize: 12, fontWeight: 700 }}>
                ID: {certificate.certificateNumber}
              </span>
            </div>

            {/* Skills Pills */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 6, maxWidth: 640, margin: '0 auto 32px' }}>
              {(certificate.skills || ['HTML5', 'CSS3', 'JavaScript', 'Responsive Web Design']).map((s, i) => (
                <span key={i} style={{ background: 'rgba(255,255,255,0.06)', fontSize: 11, padding: '3px 8px', borderRadius: 6, color: '#c9d1d9' }}>
                  ✓ {s}
                </span>
              ))}
            </div>

            {/* Signatures & QR Code Footer */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 120px 1fr',
              alignItems: 'flex-end',
              borderTop: '1px solid rgba(255,255,255,0.1)',
              paddingTop: 24,
              marginTop: 16
            }}>
              {/* Instructor Sig */}
              <div style={{ textAlign: 'left' }}>
                <div style={{ fontFamily: 'cursive', fontSize: 20, color: '#fbbf24', marginBottom: 4 }}>
                  {certificate.instructorName || 'Maitri Jain'}
                </div>
                <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Lead Course Instructor
                </div>
                <div style={{ fontSize: 11, color: '#8b949e' }}>
                  Issued: {certificate.issuedDate || '2026-09-05'}
                </div>
              </div>

              {/* QR Code */}
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <div style={{
                  width: 64,
                  height: 64,
                  background: '#ffffff',
                  borderRadius: 6,
                  padding: 4,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <QrCode size={52} color="#000000" />
                </div>
                <span style={{ fontSize: 9, color: '#8b949e', marginTop: 4 }}>Scan to verify</span>
              </div>

              {/* Director Sig */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontFamily: 'cursive', fontSize: 20, color: '#14b8a6', marginBottom: 4 }}>
                  Prof. Alistair Vance
                </div>
                <div style={{ fontSize: 11, color: '#8b949e', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Academic Director, LearnFlow
                </div>
                <div style={{ fontSize: 11, color: '#34d399', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: 4 }}>
                  <ShieldCheck size={12} /> Verified Credential
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Actions Footer */}
        <div style={{
          padding: '16px 24px',
          borderTop: '1px solid var(--border-color)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 12
        }}>
          <button onClick={handleCopyLink} className="btn btn-outline btn-sm">
            <Copy size={14} /> {copied ? 'Link Copied!' : 'Copy Verification Link'}
          </button>

          <div style={{ display: 'flex', gap: 10 }}>
            <button onClick={handleShareLinkedIn} className="btn btn-secondary btn-sm" style={{ gap: 6 }}>
              <Share2 size={14} color="#0a66c2" /> Share on LinkedIn
            </button>

            <button onClick={handlePrint} className="btn btn-primary btn-sm" style={{ gap: 6 }}>
              <Download size={14} /> Download / Print PDF
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CertificateModal;

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  Award,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  QrCode,
  ArrowRight,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { useCourse } from '../context/CourseContext';

const CertificateVerifyPage = () => {
  const { certNumber } = useParams();
  const { apiBase } = useCourse();

  const [searchId, setSearchId] = useState(certNumber || 'CERT-2026-09-12345');
  const [certData, setCertData] = useState(null);
  const [loading, setLoading] = useState(true);

  const verifyCertificate = async (id) => {
    setLoading(true);
    try {
      const res = await fetch(`${apiBase}/certificates/verify/${id}`);
      const data = await res.json();
      setCertData(data);
    } catch (err) {
      console.error(err);
      setCertData({ isValid: false });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (searchId) {
      verifyCertificate(searchId);
    }
  }, [searchId]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchId.trim()) {
      verifyCertificate(searchId.trim());
    }
  };

  const cert = certData?.certificate;

  return (
    <div className="main-content animate-fade-in" style={{ paddingBottom: 80 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', maxWidth: 640, margin: '0 auto 36px' }}>
        <div style={{
          width: 44,
          height: 44,
          borderRadius: 'var(--radius-sm)',
          background: 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 16px'
        }}>
          <ShieldCheck size={24} color="#fff" />
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>Certificate Verification</h1>
        <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
          LearnFlow Public Credential Verification Engine
        </p>

        {/* Search Input */}
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 8, marginTop: 24 }}>
          <input
            type="text"
            className="input-field"
            placeholder="Enter Certificate ID (e.g. CERT-2026-09-12345)"
            value={searchId}
            onChange={(e) => setSearchId(e.target.value)}
            style={{ marginBottom: 0 }}
          />
          <button type="submit" className="btn btn-primary" style={{ padding: '0 24px' }}>
            Verify
          </button>
        </form>
      </div>

      {/* Verification Result Card */}
      {loading ? (
        <div className="glass-card" style={{ padding: 48, textAlign: 'center' }}>
          <div style={{ fontSize: 14, color: 'var(--text-secondary)' }}>Validating cryptographic certificate signature...</div>
        </div>
      ) : certData?.isValid && cert ? (
        <div className="glass-card" style={{ maxWidth: 780, margin: '0 auto', padding: 36, border: '2px solid var(--success)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 24, borderBottom: '1px solid var(--border-color)', paddingBottom: 20 }}>
            <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'var(--success-bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <CheckCircle2 size={28} color="var(--success)" />
            </div>
            <div>
              <div style={{ fontSize: 12, color: 'var(--success)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                ✓ Authentic & Verified Credential
              </div>
              <h2 style={{ fontSize: 20, fontWeight: 700 }}>LearnFlow Certificate #{cert.certificateNumber}</h2>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 28 }}>
            <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Recipient Name</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{cert.studentName}</div>
            </div>

            <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Academic Course</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{cert.courseTitle}</div>
            </div>

            <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Final Grade</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--success)', marginTop: 4 }}>{cert.grade}</div>
            </div>

            <div style={{ padding: 16, background: 'var(--bg-tertiary)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: 11, color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 700 }}>Issue Date</div>
              <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--text-primary)', marginTop: 4 }}>{cert.issuedDate}</div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid var(--border-color)', paddingTop: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div style={{ fontSize: 12, color: 'var(--text-muted)' }}>
              Issued by <strong>LearnFlow Technologies Inc.</strong> • Lifetime Authenticity
            </div>
            <Link to="/courses" className="btn btn-outline btn-sm">
              Explore Courses <ArrowRight size={14} />
            </Link>
          </div>
        </div>
      ) : (
        <div className="glass-card" style={{ maxWidth: 640, margin: '0 auto', padding: 48, textAlign: 'center', border: '1px solid var(--danger)' }}>
          <XCircle size={48} color="var(--danger)" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontSize: 20, fontWeight: 800, marginBottom: 8 }}>Certificate Not Found</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: 14 }}>
            We could not locate any credential registered under ID: <strong>{searchId}</strong>. Please verify the ID on your document.
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificateVerifyPage;

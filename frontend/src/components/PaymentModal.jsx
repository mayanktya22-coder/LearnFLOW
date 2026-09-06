import React, { useState } from 'react';
import { X, CreditCard, Smartphone, Building2, CheckCircle2, ShieldCheck, Lock, Sparkles } from 'lucide-react';
import { useCourse } from '../context/CourseContext';

const PaymentModal = ({ course, isOpen, onClose, onPaymentSuccess }) => {
  const { enrollInCourse } = useCourse();
  const [method, setMethod] = useState('card');
  const [cardNumber, setCardNumber] = useState('4242 •••• •••• 4242');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvc, setCardCvc] = useState('888');
  const [cardName, setCardName] = useState('Mayank Tyagi');
  const [upiId, setUpiId] = useState('mayanktyagi@oksbi');
  const [discountCode, setDiscountCode] = useState('LEARNFLOW10');
  const [discountApplied, setDiscountApplied] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen || !course) return null;

  const basePrice = course.price || 999;
  const discountAmount = discountApplied ? Math.min(100, Math.round(basePrice * 0.1)) : 0;
  const taxablePrice = Math.max(0, basePrice - discountAmount);
  const tax = Math.round(taxablePrice * 0.18);
  const totalPrice = taxablePrice + tax;

  const handlePay = async (e) => {
    e.preventDefault();
    setProcessing(true);

    // Simulate gateway roundtrip
    setTimeout(async () => {
      const res = await enrollInCourse(course.id, method.toUpperCase(), totalPrice);
      setProcessing(false);
      if (res.success) {
        setSuccess(true);
        setTimeout(() => {
          if (onPaymentSuccess) onPaymentSuccess(course);
          onClose();
        }, 1800);
      }
    }, 1200);
  };

  return (
    <div style={{
      position: 'fixed',
      inset: 0,
      zIndex: 999,
      background: 'rgba(0, 0, 0, 0.75)',
      backdropFilter: 'blur(10px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 16
    }}>
      <div className="glass-card animate-fade-in" style={{
        maxWidth: 600,
        width: '100%',
        background: 'var(--bg-secondary)',
        border: '1px solid var(--border-color)',
        borderRadius: 'var(--radius-xl)',
        overflow: 'hidden',
        boxShadow: 'var(--shadow-lg)'
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          borderBottom: '1px solid var(--border-color)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h3 style={{ fontSize: 18, fontWeight: 800 }}>Complete Your Enrollment</h3>
            <p style={{ fontSize: 12, color: 'var(--text-secondary)' }}>Instant access & lifetime certificate eligibility</p>
          </div>
          <button onClick={onClose} className="btn btn-outline btn-sm" style={{ padding: 6, borderRadius: '50%' }}>
            <X size={16} />
          </button>
        </div>

        {success ? (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: '50%',
              background: 'var(--success-bg)',
              border: '2px solid var(--success)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px'
            }}>
              <CheckCircle2 size={40} color="var(--success)" />
            </div>
            <h3 style={{ fontSize: 22, fontWeight: 800, marginBottom: 8 }}>Payment Confirmed! 🎉</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: 14, marginBottom: 20 }}>
              You are now enrolled in <strong>{course.title}</strong>. Redirecting to your learning workspace...
            </p>
          </div>
        ) : (
          <div style={{ padding: 24, display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 24 }}>
            {/* Left Column: Payment Details */}
            <div>
              {/* Payment Methods */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
                <button
                  type="button"
                  onClick={() => setMethod('card')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: method === 'card' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: method === 'card' ? 'var(--accent-gradient-subtle)' : 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <CreditCard size={16} color="var(--accent-primary)" /> Card
                </button>

                <button
                  type="button"
                  onClick={() => setMethod('upi')}
                  style={{
                    padding: '10px 12px',
                    borderRadius: 'var(--radius-md)',
                    border: method === 'upi' ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    background: method === 'upi' ? 'var(--accent-gradient-subtle)' : 'var(--bg-tertiary)',
                    color: 'var(--text-primary)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                    fontSize: 13,
                    fontWeight: 600,
                    cursor: 'pointer'
                  }}
                >
                  <Smartphone size={16} color="#10b981" /> UPI / QR
                </button>
              </div>

              {method === 'card' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Cardholder Name</label>
                    <input
                      type="text"
                      className="input-field"
                      value={cardName}
                      onChange={(e) => setCardName(e.target.value)}
                    />
                  </div>

                  <div className="input-group" style={{ marginBottom: 0 }}>
                    <label className="input-label">Card Number</label>
                    <input
                      type="text"
                      className="input-field"
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">Expires</label>
                      <input
                        type="text"
                        className="input-field"
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                      />
                    </div>
                    <div className="input-group" style={{ marginBottom: 0 }}>
                      <label className="input-label">CVC</label>
                      <input
                        type="password"
                        className="input-field"
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="input-group" style={{ marginBottom: 12 }}>
                    <label className="input-label">UPI ID / VPA</label>
                    <input
                      type="text"
                      className="input-field"
                      placeholder="username@okhdfcbank"
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                    />
                  </div>
                  <div style={{
                    padding: 12,
                    background: 'var(--bg-tertiary)',
                    borderRadius: 'var(--radius-md)',
                    textAlign: 'center',
                    fontSize: 12,
                    color: 'var(--text-secondary)'
                  }}>
                    Scan with Google Pay, PhonePe, or Paytm on mobile
                  </div>
                </div>
              )}

              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--text-muted)' }}>
                <Lock size={12} color="var(--success)" /> 256-Bit SSL Encrypted & PCI Compliant Gateway
              </div>
            </div>

            {/* Right Column: Price Summary */}
            <div style={{
              background: 'var(--bg-tertiary)',
              padding: 16,
              borderRadius: 'var(--radius-lg)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 8, color: 'var(--text-primary)' }}>
                  Order Summary
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--text-secondary)', marginBottom: 12 }}>
                  {course.title}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 8, fontSize: 12, borderTop: '1px solid var(--border-color)', paddingTop: 12 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                    <span style={{ color: 'var(--text-secondary)' }}>Course Price:</span>
                    <span>₹{basePrice}</span>
                  </div>

                  {discountApplied && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--success)' }}>
                      <span>Coupon (LEARNFLOW10):</span>
                      <span>-₹{discountAmount}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', color: 'var(--text-secondary)' }}>
                    <span>GST (18%):</span>
                    <span>₹{tax}</span>
                  </div>

                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    fontSize: 15,
                    fontWeight: 800,
                    borderTop: '1px solid var(--border-color)',
                    paddingTop: 8,
                    marginTop: 4
                  }}>
                    <span>Total:</span>
                    <span className="text-gradient">₹{totalPrice.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              <button
                onClick={handlePay}
                disabled={processing}
                className="btn btn-primary"
                style={{ width: '100%', marginTop: 16 }}
              >
                {processing ? 'Processing Payment...' : `Pay ₹${totalPrice.toLocaleString()}`}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaymentModal;

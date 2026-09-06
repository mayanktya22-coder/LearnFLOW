const express = require('express');
const router = express.Router();
const db = require('../data/db');

// GET /api/payments
router.get('/', (req, res) => {
  const { userId } = req.query;
  let payments = db.getPayments();
  if (userId) {
    payments = payments.filter(p => p.userId === userId);
  }
  res.json({ payments });
});

// POST /api/payments/checkout
router.post('/checkout', (req, res) => {
  const { userId, userName, courseId, courseTitle, amount, method } = req.body;
  const payment = db.createPayment({
    userId,
    userName,
    courseId,
    courseTitle,
    amount: Number(amount || 0),
    method: method || 'Card'
  });
  res.status(201).json({ success: true, payment });
});

// GET /api/payments/refunds
router.get('/refunds', (req, res) => {
  const refunds = db.getRefundRequests();
  res.json({ refundRequests: refunds });
});

// POST /api/payments/refunds/:id/action
router.post('/refunds/:id/action', (req, res) => {
  const { action } = req.body; // 'approved' | 'rejected'
  const refund = db.updateRefundRequest(req.params.id, action === 'approve' ? 'approved' : 'rejected');
  if (!refund) {
    return res.status(404).json({ error: 'Refund request not found' });
  }
  res.json({ success: true, refund });
});

// GET /api/payments/payouts
router.get('/payouts', (req, res) => {
  const payouts = db.getPayouts();
  res.json({ payouts });
});

module.exports = router;

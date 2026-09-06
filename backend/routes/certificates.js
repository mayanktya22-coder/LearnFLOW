const express = require('express');
const router = express.Router();
const db = require('../data/db');

// GET /api/certificates (all or by userId)
router.get('/', (req, res) => {
  const { userId } = req.query;
  let certs = db.getCertificates();
  if (userId) {
    certs = certs.filter(c => c.userId === userId);
  }
  res.json({ certificates: certs });
});

// GET /api/certificates/:id (or certificateNumber)
router.get('/:id', (req, res) => {
  const cert = db.getCertificateById(req.params.id);
  if (!cert) {
    return res.status(404).json({ error: 'Certificate not found' });
  }
  res.json({ certificate: cert });
});

// GET /api/certificates/verify/:certNumber (Public Verification endpoint)
router.get('/verify/:certNumber', (req, res) => {
  const cert = db.getCertificateById(req.params.certNumber);
  if (!cert) {
    return res.status(404).json({ isValid: false, message: 'Certificate not found in LearnFlow registry' });
  }
  res.json({
    isValid: true,
    certificate: cert,
    issuer: 'LearnFlow Academy',
    verifiedAt: new Date().toISOString()
  });
});

module.exports = router;

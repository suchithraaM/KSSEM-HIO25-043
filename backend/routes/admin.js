const express = require('express');
const router = express.Router();
const { sendSMS, sendEmail } = require('../services/notification');

router.get('/test-notify', async (req, res) => {
  try {
    const to = req.query.phone;
    const emailTo = req.query.email || process.env.EMAIL_USER;
    if (!to && !emailTo) return res.status(400).json({ success: false, message: 'pass ?phone=+123 or ?email=' });

    if (to) {
      try {
        await sendSMS(to, 'TimeCare test SMS from /api/admin/test-notify');
      } catch (e) {
        console.error('sendSMS in test-notify failed:', e);
        // fallback to email if sms fails
        if (emailTo) await sendEmail(emailTo, 'TimeCare test email (fallback)', '<p>Test email due to SMS failure</p>');
      }
    }
    if (emailTo) {
      await sendEmail(emailTo, 'TimeCare test email', '<p>This is a test email from TimeCare.</p>');
    }

    res.json({ success: true, message: 'Triggered test notifications, check server logs.' });
  } catch (err) {
    console.error('test-notify error', err);
    res.status(500).json({ success: false, error: err && (err.message || err) });
  }
});

module.exports = router;

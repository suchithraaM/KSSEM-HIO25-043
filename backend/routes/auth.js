const express = require('express');
const router = express.Router();

// Simple in-memory users (replace with DB in production)
const users = [
  { email: "admin@timecare.com", password: "admin123", role: "admin" },
  { email: "doctor@timecare.com", password: "doctor123", role: "doctor" },
  { email: "meena@timecare.com", password: "meena123", role: "doctor" }   // added user
];


// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;
  const user = users.find(u => u.email === email && u.password === password);
  if (!user) return res.json({ success: false, message: 'Invalid credentials' });
  res.json({ success: true, role: user.role });
});

module.exports = { router };

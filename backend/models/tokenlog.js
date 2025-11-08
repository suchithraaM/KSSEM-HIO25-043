const mongoose = require('mongoose');

const tokenLogSchema = new mongoose.Schema({
  tokenNumber: Number,
  department: String,
  doctor: String,
  issuedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TokenLog', tokenLogSchema);

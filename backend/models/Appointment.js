const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
  patientName: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true },
  department: { type: String, required: true },
  cause: { type: String, required: true },
  tokenNumber: { type: Number, required: true },
  predictedWait: { type: String, required: true }, // ✅ here only
  date: { type: Date, default: Date.now }
});

module.exports = mongoose.model("Appointment", appointmentSchema);

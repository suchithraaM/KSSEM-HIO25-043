// backend/routes/appointment.js
const express = require("express");
const router = express.Router();
const Appointment = require("../models/Appointment");
const { sendSMS, sendEmail } = require("../services/notification");

// Predict waiting time = 15 min × queue position
function getPredictedWait(position) {
  const minutes = position * 15;
  return minutes < 60
    ? `${minutes} minutes`
    : `${Math.floor(minutes / 60)} hour ${minutes % 60} minutes`;
}

router.post("/book", async (req, res) => {
  try {
    const { patientName, phone, email, department, cause } = req.body;
    if (!patientName || !phone || !email || !department || !cause)
      return res.status(400).json({ success: false, message: "Missing fields" });

    const count = await Appointment.countDocuments({ department });
    const tokenNumber = count + 1;
    const predictedWait = getPredictedWait(tokenNumber - 1);

    const appointment = new Appointment({
      patientName,
      phone,
      email,
      department,
      cause,
      tokenNumber,
      predictedWait, // ✅ matches schema
      date: new Date()
    });

    await appointment.save();

    // Send SMS + email
    const msg = `Hi ${patientName}, your appointment is confirmed.\nDept: ${department}\nToken: ${tokenNumber}\nEstimated wait: ${predictedWait}`;
    await sendSMS(phone, msg);
    await sendEmail(
      email,
      "TimeCare Appointment Confirmation",
      `<p>${msg.replace(/\n/g, "<br>")}</p>`
    );

    res.json({
      success: true,
      appointment: { tokenNumber, predictedWait }
    });
  } catch (err) {
    console.error("Booking failed:", err);
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;


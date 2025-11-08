// backend/server.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const { sendSMS, sendEmail } = require("./services/notification");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// 🔍 Debug: ensure .env is loaded correctly
console.log("🔍 Starting TimeCare backend...");
console.log("📦 Environment check:", {
  PORT: process.env.PORT,
  MONGO_URI: !!process.env.MONGO_URI,
  TWILIO_SID: !!process.env.TWILIO_ACCOUNT_SID,
  TWILIO_PHONE: process.env.TWILIO_PHONE_NUMBER,
});

// ✅ Connect to MongoDB
mongoose
  .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB connection error:", err));

// ✅ Base route
app.get("/", (req, res) => res.send("✅ TimeCare backend running"));

// ✅ Appointment routes
app.use("/api/appointment", require("./routes/appointment"));

// ✅ Global error handler (optional)
app.use((err, req, res, next) => {
  console.error("❌ Server error:", err.stack);
  res.status(500).json({ success: false, message: "Internal Server Error" });
});

// ✅ Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));

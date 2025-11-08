const nodemailer = require("nodemailer");
const twilio = require("twilio");

// ✅ Correct variable names
const { TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER, EMAIL_USER, EMAIL_PASS } = process.env;

// Twilio setup
let twilioClient = null;
if (TWILIO_ACCOUNT_SID && TWILIO_AUTH_TOKEN) {
  twilioClient = twilio(TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN);
  console.log("✅ Twilio client initialized");
} else {
  console.warn("⚠️ Twilio credentials missing — SMS disabled");
}

// Email setup
const transporter = (EMAIL_USER && EMAIL_PASS)
  ? nodemailer.createTransport({
      service: "gmail",
      auth: { user: EMAIL_USER, pass: EMAIL_PASS },
    })
  : null;

// SMS sender
async function sendSMS(to, message) {
  if (!to) return;
  if (twilioClient && TWILIO_PHONE_NUMBER) {
    try {
      const result = await twilioClient.messages.create({
        body: message,
        from: TWILIO_PHONE_NUMBER,
        to: to.startsWith("+") ? to : `+91${to}`,
      });
      console.log("📱 SMS sent:", result.sid);
    } catch (err) {
      console.error("❌ SMS failed:", err.message);
    }
  } else {
    console.log("MOCK SMS →", to, message);
  }
}

// Email sender
async function sendEmail(to, subject, html) {
  if (!to) return;
  if (transporter) {
    try {
      await transporter.sendMail({ from: EMAIL_USER, to, subject, html });
      console.log("📧 Email sent to", to);
    } catch (err) {
      console.error("❌ Email failed:", err.message);
    }
  } else {
    console.log("MOCK EMAIL →", to, subject);
  }
}

module.exports = { sendSMS, sendEmail };

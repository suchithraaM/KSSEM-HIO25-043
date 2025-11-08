require('dotenv').config();
const twilio = require('twilio');

// Support both TWILIO_ACCOUNT_SID/TWILIO_AUTH_TOKEN and TWILIO_SID/TWILIO_TOKEN
const sid = process.env.TWILIO_ACCOUNT_SID || process.env.TWILIO_SID;
const token = process.env.TWILIO_AUTH_TOKEN || process.env.TWILIO_TOKEN;
const from = (process.env.TWILIO_PHONE_NUMBER || process.env.TWILIO_PHONE || '').replace(/[^\d+]/g, '');
const to = process.argv[2];

if (!sid || !token || !from || !to) {
  console.error('Twilio credentials missing. Check .env (TWILIO_ACCOUNT_SID, TWILIO_AUTH_TOKEN, TWILIO_PHONE_NUMBER).');
  process.exit(1);
}

const client = twilio(sid, token);

client.messages
  .create({
    body: '✅ TimeCare test SMS — connection successful!',
    from,
    to
  })
  .then(msg => console.log('✅ Twilio connected successfully — Message SID:', msg.sid))
  .catch(err => {
    console.error('❌ Twilio test failed — full error:', err);
    if (err.response && err.response.body) console.error('Twilio response body:', err.response.body);
  });

const QRCode = require('qrcode');

async function generateQRCode(data) {
  return QRCode.toDataURL(JSON.stringify(data));
}

module.exports = { generateQRCode };

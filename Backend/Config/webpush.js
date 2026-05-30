const webpush = require('web-push');
require('dotenv').config();

// Ensure the VAPID keys are available
if (process.env.VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY) {
    webpush.setVapidDetails(
      'mailto:support@medihelp.com',
      process.env.VAPID_PUBLIC_KEY,
      process.env.VAPID_PRIVATE_KEY
    );
} else {
    console.warn("⚠️ VAPID keys are missing from .env! Web Push will not work.");
}

module.exports = webpush;

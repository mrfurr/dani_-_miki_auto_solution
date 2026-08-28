import 'dotenv/config';
import nodemailer from 'nodemailer';

const user = process.env.GMAIL_USER;
const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '');

console.log('From:', user, '| Pass length:', pass.length);

const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 465,
  secure: true,
  auth: { user, pass },
  tls: { rejectUnauthorized: false }
});

transporter.sendMail({
  from: `"Dani & Miki Auto Solution" <${user}>`,
  to: user,
  subject: 'Booking Confirmed DM-9999 - Dani & Miki Auto Solution',
  html: '<h2 style="color:#dc2626">Booking Confirmed</h2><p>Code: <strong>DM-9999-8888</strong></p><p>Service: OEM Diagnostic Scan</p><p>Date: 2026-09-05 at 09:00 AM</p><p>Deposit: 200 ETB</p>'
}, function(err, info) {
  if (err) {
    console.error('FAILED:', err.message);
    process.exit(1);
  } else {
    console.log('SUCCESS - Message ID:', info.messageId);
    console.log('Accepted:', info.accepted);
    process.exit(0);
  }
});

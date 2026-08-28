import nodemailer from 'nodemailer'

// Create transporter with explicit SMTP config
// Using explicit host/port is more reliable than service:'gmail' in server environments
const createTransporter = () => {
  const user = process.env.GMAIL_USER
  const pass = (process.env.GMAIL_APP_PASSWORD || '').replace(/\s/g, '') // strip spaces from 16-char app password

  if (!user || !pass) {
    throw new Error('GMAIL_USER or GMAIL_APP_PASSWORD not set in environment variables')
  }

  return nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true, // use SSL
    auth: { user, pass },
    tls: { rejectUnauthorized: false },
  })
}

// ─── Approval Email ───────────────────────────────────────────────────────────
export async function sendApprovalEmail({
  customerEmail,
  customerName,
  bookingCode,
  serviceName,
  date,
  time,
  depositAmount,
}: {
  customerEmail: string
  customerName: string
  bookingCode: string
  serviceName: string
  date: string
  time: string
  depositAmount: number
}) {
  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"Dani & Miki Auto Solution" <${process.env.GMAIL_USER}>`,
    to: customerEmail,
    subject: `Booking Confirmed ✅ ${bookingCode} — Dani & Miki Auto Solution`,
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
      'X-Mailer': 'Dani & Miki Auto Solution Booking System',
      'List-Unsubscribe': `<mailto:${process.env.GMAIL_USER}?subject=Unsubscribe>`,
      'Precedence': 'bulk'
    },
    html: `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#070709;font-family:Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070709;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0e0e13;border:1px solid #222;border-radius:12px;overflow:hidden;">

        <!-- Header -->
        <tr><td style="background:#dc2626;padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">
            Dani &amp; Miki Auto Solution
          </h1>
          <p style="margin:6px 0 0;color:#fca5a5;font-size:13px;">Precision Automotive Diagnostics &amp; Performance</p>
        </td></tr>

        <!-- Confirmed badge -->
        <tr><td style="padding:28px 32px 0;text-align:center;">
          <div style="display:inline-block;background:#16a34a22;border:1px solid #16a34a66;border-radius:8px;padding:10px 20px;">
            <span style="color:#4ade80;font-size:14px;font-weight:bold;">✅ PAYMENT VERIFIED — BOOKING CONFIRMED</span>
          </div>
          <p style="color:#d1d5db;font-size:15px;margin:16px 0 0;">Dear <strong style="color:#ffffff;">${customerName}</strong>,</p>
          <p style="color:#9ca3af;font-size:14px;margin:8px 0 0;">Your payment has been verified. Your appointment is confirmed. Please save your booking code below.</p>
        </td></tr>

        <!-- Booking Code -->
        <tr><td style="padding:20px 32px;">
          <div style="background:#1a0a0a;border:2px solid #dc2626;border-radius:10px;padding:24px;text-align:center;">
            <p style="margin:0 0 8px;color:#9ca3af;font-size:11px;letter-spacing:3px;text-transform:uppercase;">Your Booking Code</p>
            <h2 style="margin:0;color:#ef4444;font-size:34px;font-weight:bold;letter-spacing:4px;font-family:monospace;">${bookingCode}</h2>
            <p style="margin:10px 0 0;color:#6b7280;font-size:12px;">Show this code when you arrive at the workshop</p>
          </div>
        </td></tr>

        <!-- Details -->
        <tr><td style="padding:0 32px 24px;">
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1f2937;border-radius:8px;overflow:hidden;">
            <tr style="background:#111827;">
              <td colspan="2" style="padding:12px 16px;color:#6b7280;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Appointment Details</td>
            </tr>
            ${[
              ['Service', serviceName],
              ['Date', date],
              ['Time', time],
              ['Deposit Paid', `${depositAmount} ETB`],
            ].map(([label, value], i) => `
            <tr style="background:${i % 2 === 0 ? '#0e0e13' : '#111'};">
              <td style="padding:12px 16px;color:#9ca3af;font-size:13px;width:40%;border-bottom:1px solid #1f2937;">${label}</td>
              <td style="padding:12px 16px;color:#f3f4f6;font-size:13px;font-weight:600;border-bottom:1px solid #1f2937;">${value}</td>
            </tr>`).join('')}
          </table>
        </td></tr>

        <!-- Important notice -->
        <tr><td style="padding:0 32px 24px;">
          <div style="background:#0c0a00;border-left:4px solid #f59e0b;border-radius:4px;padding:14px 16px;">
            <p style="margin:0;color:#fbbf24;font-size:13px;font-weight:bold;">📌 Important</p>
            <p style="margin:6px 0 0;color:#d4c483;font-size:13px;">Please arrive <strong>10 minutes before</strong> your scheduled time. Bring your booking code and vehicle registration documents.</p>
          </div>
        </td></tr>

        <!-- Location -->
        <tr><td style="padding:0 32px 24px;">
          <div style="background:#111827;border:1px solid #1f2937;border-radius:8px;padding:14px 16px;">
            <p style="margin:0;color:#6b7280;font-size:11px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Workshop Location</p>
            <p style="margin:6px 0 0;color:#d1d5db;font-size:13px;">Bole Medhanialem / Garage Zone, Addis Ababa, Ethiopia</p>
            <p style="margin:4px 0 0;color:#9ca3af;font-size:12px;">📞 Contact: +251 911 234 567</p>
          </div>
        </td></tr>

        <!-- Footer -->
        <tr><td style="background:#0a0a0d;padding:20px 32px;text-align:center;border-top:1px solid #1f2937;">
          <p style="margin:0;color:#4b5563;font-size:12px;">Thank you for choosing Dani &amp; Miki Auto Solution</p>
          <p style="margin:4px 0 0;color:#6b7280;font-size:11px;">Bole Medhanialem, Addis Ababa, Ethiopia</p>
          <p style="margin:4px 0 0;color:#374151;font-size:11px;">&copy; 2026 Dani &amp; Miki Auto Solution — This is an automated email, please do not reply.</p>
        </td></tr>

      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}

// ─── Rejection Email ──────────────────────────────────────────────────────────
export async function sendRejectionEmail({
  customerEmail,
  customerName,
  serviceName,
  date,
  time,
  rejectionReason,
}: {
  customerEmail: string
  customerName: string
  serviceName: string
  date: string
  time: string
  rejectionReason: string
}) {
  const transporter = createTransporter()

  await transporter.sendMail({
    from: `"Dani & Miki Auto Solution" <${process.env.GMAIL_USER}>`,
    to: customerEmail,
    subject: `Booking Update — Dani & Miki Auto Solution`,
    headers: {
      'X-Priority': '1',
      'X-MSMail-Priority': 'High',
      'Importance': 'high',
      'X-Mailer': 'Dani & Miki Auto Solution Booking System',
      'List-Unsubscribe': `<mailto:${process.env.GMAIL_USER}?subject=Unsubscribe>`,
      'Precedence': 'bulk'
    },
    html: `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#070709;font-family:Arial,sans-serif;color:#ffffff;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#070709;padding:20px 0;">
    <tr><td align="center">
      <table width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background:#0e0e13;border:1px solid #222;border-radius:12px;overflow:hidden;">
        <tr><td style="background:#dc2626;padding:28px 32px;text-align:center;">
          <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;letter-spacing:2px;text-transform:uppercase;">Dani &amp; Miki Auto Solution</h1>
        </td></tr>
        <tr><td style="padding:28px 32px;">
          <p style="color:#d1d5db;font-size:15px;">Dear <strong style="color:#ffffff;">${customerName}</strong>,</p>
          <p style="color:#9ca3af;font-size:14px;">We regret to inform you that your booking could not be confirmed at this time.</p>
          <table width="100%" cellpadding="0" cellspacing="0" style="border:1px solid #1f2937;border-radius:8px;margin:16px 0;">
            <tr style="background:#111827;"><td colspan="2" style="padding:10px 16px;color:#6b7280;font-size:11px;letter-spacing:2px;text-transform:uppercase;">Booking Details</td></tr>
            <tr><td style="padding:12px 16px;color:#9ca3af;font-size:13px;width:40%;">Service</td><td style="padding:12px 16px;color:#f3f4f6;font-size:13px;font-weight:600;">${serviceName}</td></tr>
            <tr style="background:#111;"><td style="padding:12px 16px;color:#9ca3af;font-size:13px;">Date</td><td style="padding:12px 16px;color:#f3f4f6;font-size:13px;font-weight:600;">${date}</td></tr>
            <tr><td style="padding:12px 16px;color:#9ca3af;font-size:13px;">Time</td><td style="padding:12px 16px;color:#f3f4f6;font-size:13px;font-weight:600;">${time}</td></tr>
          </table>
          <div style="background:#1a0505;border-left:4px solid #dc2626;border-radius:4px;padding:14px 16px;margin:16px 0;">
            <p style="margin:0;color:#f87171;font-size:13px;font-weight:bold;">Reason:</p>
            <p style="margin:6px 0 0;color:#fca5a5;font-size:13px;">${rejectionReason}</p>
          </div>
          <p style="color:#9ca3af;font-size:13px;">Please contact us directly to reschedule or for more information.</p>
          <p style="color:#6b7280;font-size:13px;">We apologize for any inconvenience.</p>
        </td></tr>
        <tr><td style="background:#0a0a0d;padding:16px 32px;text-align:center;border-top:1px solid #1f2937;">
          <p style="margin:0;color:#6b7280;font-size:11px;">Bole Medhanialem, Addis Ababa, Ethiopia</p>
          <p style="margin:4px 0 0;color:#4b5563;font-size:11px;">&copy; 2026 Dani &amp; Miki Auto Solution — Automated email, please do not reply.</p>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`,
  })
}

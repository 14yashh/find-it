import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;
if (env.EMAIL_ENABLED && env.SMTP_HOST) {
  transporter = nodemailer.createTransport({
    host: env.SMTP_HOST,
    port: env.SMTP_PORT || 587,
    secure: env.SMTP_PORT === 465,
    auth: {
      user: env.SMTP_USER,
      pass: env.SMTP_PASS
    }
  });
}

export async function sendEmail(to, subject, text) {
  if (!env.EMAIL_ENABLED || !transporter) {
    console.log(`[Email Skipped] To: ${to} | Subject: ${subject}`);
    return;
  }
  
  try {
    await transporter.sendMail({
      from: env.SMTP_USER || 'noreply@findit.college.edu',
      to,
      subject,
      text
    });
    console.log(`[Email Sent] To: ${to} | Subject: ${subject}`);
  } catch (err) {
    console.error(`[Email Error] Failed to send email to ${to}:`, err.message);
  }
}

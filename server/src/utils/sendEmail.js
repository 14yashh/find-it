import nodemailer from 'nodemailer';
import { env } from '../config/env.js';

let transporter;
if (env.EMAIL_ENABLED && env.EMAIL_HOST) {
  transporter = nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT || 587,
    secure: env.EMAIL_PORT === 465,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS
    }
  });
}

export async function sendEmail(to, subject, text) {
  if (!env.EMAIL_ENABLED || !transporter) {
    if (process.env.NODE_ENV !== 'test') {
      console.log(`[Email Skipped] To: ${to} | Subject: ${subject}`);
    }
    return;
  }

  try {
    await transporter.sendMail({
      from: env.EMAIL_FROM || env.EMAIL_USER || 'noreply@findit.college.edu',
      to,
      subject,
      text
    });
    console.log(`[Email Sent] To: ${to} | Subject: ${subject}`);
  } catch (err) {
    console.error(`[Email Error] Failed to send email to ${to}:`, err.message);
  }
}

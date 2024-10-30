import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email, locale, email_subject, email_greeting, email_body } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    try {
      const token = jwt.sign({ name, email }, JWT_SECRET, { expiresIn: '1h' });
      const verificationLink = `${process.env.FRONTEND_URL}/api/verify?token=${token}`;

      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: email_subject,
        html: `
          <p>${email_greeting} ${name},</p>
          <p>${email_body}</p>
          <a href="${verificationLink}">Verify your email</a>
        `,
      });

      res.status(200).json({ message: 'Verification email sent' });
    } catch (err) {
      res.status(500).json({ message: 'Error sending verification email' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

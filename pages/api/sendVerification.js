import nodemailer from 'nodemailer';
import jwt from 'jsonwebtoken';

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Can be 'gmail', 'outlook', or any SMTP service
  auth: {
    user: process.env.EMAIL_USER, // Gmail email from environment variables
    pass: process.env.EMAIL_PASS, // Gmail App Password
  },
});

// JWT secret from environment variables
const JWT_SECRET = process.env.JWT_SECRET;

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { name, email } = req.body;

    if (!name || !email) {
      return res.status(400).json({ message: 'Name and email are required' });
    }

    try {
      // Generate JWT token valid for 1 hour
      const token = jwt.sign({ name, email }, JWT_SECRET, { expiresIn: '1h' });

      // Construct the verification link
      const verificationLink = `${process.env.FRONTEND_URL}/api/verify?token=${token}`;

      console.log('Sending email to:', email); // Debugging line

      // Send the verification email
      await transporter.sendMail({
        from: process.env.EMAIL_USER, // Sender address
        to: email, // User's email
        subject: 'Verify your email for GolfBallAssistant',
        html: `
          <p>Hello ${name},</p>
          <p>Please verify your email by clicking the link below:</p>
          <a href="${verificationLink}">Verify your email</a>
        `,
      });

      console.log('Email sent successfully'); // Debugging line

      // Send a success response to the client
      res.status(200).json({ message: 'Verification email sent. Please check your inbox.' });

    } catch (err) {
      console.error('Error sending email:', err); // Log the error if email sending fails
      res.status(500).json({ message: 'Error sending verification email' });
    }

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

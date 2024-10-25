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
    const { name, email, locale, email_subject, email_greeting, email_body } = req.body;

    // Check if name and email are present
    if (!name || !email) {
      return res.status(400).json({ message: locale === 'es' ? 'Se requiere nombre y correo electrónico.' : locale === 'ca' ? 'Es requereix nom i correu electrònic.' : 'Name and email are required' });
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
        subject: email_subject, // Subject passed from the frontend
        html: `
          <p>${email_greeting} ${name},</p>
          <p>${email_body}</p>
          <a href="${verificationLink}">${locale === 'es' ? 'Verificar tu correo' : locale === 'ca' ? 'Verifica el teu correu' : 'Verify your email'}</a>
        `,
      });

      console.log('Email sent successfully'); // Debugging line

      // Send a success response to the client
      res.status(200).json({ message: locale === 'es' ? 'Correo de verificación enviado. Revisa tu bandeja de entrada.' : locale === 'ca' ? 'Correu de verificació enviat. Comprova la teva safata d\'entrada.' : 'Verification email sent. Please check your inbox.' });

    } catch (err) {
      console.error('Error sending email:', err); // Log the error if email sending fails
      res.status(500).json({ message: locale === 'es' ? 'Error al enviar el correo de verificación.' : locale === 'ca' ? 'Error en enviar el correu de verificació.' : 'Error sending verification email' });
    }

  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

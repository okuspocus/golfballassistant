// sendReport.js
import nodemailer from 'nodemailer';
import path from 'path';
import { execFile } from 'child_process';
import fs from 'fs';

// Configuración del transporter de nodemailer
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { email, locale, recommendations, userName } = req.body;

    if (!email) {
      return res.status(400).json({ message: 'Email is required' });
    }

    const pdfPath = path.join(process.cwd(), 'recommendation_report.pdf');
    const jsonData = JSON.stringify({ user_name: userName, recommendations });

    try {
      // Genera el PDF con `generate_pdf.py`
      await new Promise((resolve, reject) => {
        execFile('python3', [path.join(process.cwd(), 'generate_pdf.py'), jsonData, pdfPath], (error, stdout, stderr) => {
          if (error) {
            console.error('Error generating PDF:', stderr);
            reject(error);
          } else {
            resolve(stdout);
          }
        });
      });

      // Enviar el correo electrónico con el PDF adjunto
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: locale === 'es' ? 'Informe de recomendaciones de golf' : locale === 'ca' ? 'Informe de recomanacions de golf' : 'Golf Recommendations Report',
        text: locale === 'es' ? 'Adjuntamos su informe de recomendaciones de golf. Una última cosa, si te ha sido útil la aplicación,  nos puedes contestar este correo con aquello que te gustaría que mejoráramos?' : locale === 'ca' ? 'Adjunt adjuntem l\'informe de recomanacions de golf. Una darrera cosa, ens seria molt útil si ens pots contestar aquest correu amb allò que voldries que milloréssim. Gràcies!' : 'Attached is your golf recommendation report. One last thing, if the application has been useful to you, can you reply to this email with what you would like us to improve?',
        attachments: [
          {
            filename: 'recommendation_report.pdf',
            path: pdfPath,
          },
        ],
      });

      console.log('Report email sent successfully');
      res.status(200).json({ message: 'Report sent successfully.' });

    } catch (err) {
      console.error('Error sending report email:', err);
      res.status(500).json({ message: 'Error sending report email.' });
    } finally {
      if (fs.existsSync(pdfPath)) {
        fs.unlinkSync(pdfPath);
      }
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).json({ message: `Method ${req.method} not allowed` });
  }
}

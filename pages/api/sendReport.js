import OpenAI from 'openai';
import nodemailer from 'nodemailer';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_DAN,
});

// Configure nodemailer for email
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: `Method ${req.method} not allowed` });
  }

  const { email, locale, conversation, userName } = req.body;
  if (!conversation || !Array.isArray(conversation)) {
    console.error("Invalid or missing conversation data");
    return res.status(400).json({ message: 'Invalid or missing conversation data' });
  }

  try {
    // Prepare messages for the chat completion request
    const messages = [
      { role: 'system', content: "Generate a golf ball recommendation report based on the following conversation." },
      ...conversation,
    ];

    // Call OpenAI's chat completion endpoint
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
    });

    const recommendationText = completion.choices[0].message.content.trim();

    // Generate PDF file using pdfkit
    const outputFilePath = path.join(process.cwd(), 'recommendation_report.pdf');
    const doc = new PDFDocument();
    const writeStream = fs.createWriteStream(outputFilePath);
    doc.pipe(writeStream);

    // PDF content
    doc.fontSize(20).text(`Golf Ball Recommendations for ${userName}`, { align: 'center' });
    doc.moveDown();
    doc.fontSize(12).text('Thanks for visiting our Golf Ball assistant.', {
      align: 'left',
    });
    doc.moveDown();

    // Split recommendations into individual lines
    const recommendations = recommendationText.split('\n').filter((line) => line.trim());
    recommendations.forEach((line) => {
      doc.fontSize(12).text(line.trim(), {
        align: 'left',
        indent: 20,
        lineGap: 4,
      });
      doc.moveDown(0.5);
    });

    // Finalize PDF file
    doc.end();

    // Wait until the PDF is fully created
    await new Promise((resolve, reject) => {
      writeStream.on('finish', resolve);
      writeStream.on('error', reject);
    });

    // Send the email with the PDF report attached
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your Golf Ball Recommendations Report',
      text: 'Please find attached your personalized golf ball recommendation report.',
      attachments: [
        {
          filename: 'recommendation_report.pdf',
          path: outputFilePath,
        },
      ],
    });

    // Delete the PDF after sending the email
    fs.unlinkSync(outputFilePath);

    res.status(200).json({ message: 'Report sent successfully' });
  } catch (error) {
    console.error('Error generating or sending report:', error);
    res.status(500).json({ message: 'Error generating or sending report' });
  }
}




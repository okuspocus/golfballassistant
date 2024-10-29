import OpenAI from 'openai';
import nodemailer from 'nodemailer';
import MarkdownIt from 'markdown-it';
import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import translations from '../../translations/translations';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_DAN,
});

// Configuración de nodemailer para el envío de correos
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
    return res.status(405).json({ message: translations[req.body.locale]?.report_method_not_allowed || 'Method not allowed' });
  }

  const { email, locale, conversation, userName } = req.body;
  const t = translations[locale] || translations.en;
  
  if (!conversation || !Array.isArray(conversation)) {
    console.error(t.report_invalid_conversation);
    return res.status(400).json({ message: t.report_invalid_conversation });
  }

  try {
    // Usar prompt traducido para la solicitud de OpenAI
    const messages = [
      { role: 'system', content: t.report_prompt },  // Usar el prompt traducido según el locale
      ...conversation,
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
    });

    const markdownContent = completion.choices[0].message.content.trim();

    const md = new MarkdownIt();
    const htmlContent = md.render(markdownContent);

    const outputFilePath = path.join(process.cwd(), 'recommendation_report.pdf');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(`<html><body><h1>${t.report_title} ${userName}</h1><p>${t.report_thanks_message}</p>${htmlContent}</body></html>`);
    await page.pdf({
      path: outputFilePath,
      format: 'A4',
      margin: {
        top: '20mm',
        bottom: '20mm',
        left: '20mm',
        right: '20mm'
      },
    });

    await browser.close();

    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: t.report_email_subject,
      text: t.report_email_text,
      attachments: [
        {
          filename: 'recommendation_report.pdf',
          path: outputFilePath,
        },
      ],
    });

    fs.unlinkSync(outputFilePath);

    res.status(200).json({ message: t.report_success_message });
  } catch (error) {
    console.error('Error generating or sending report:', error);
    res.status(500).json({ message: 'Error generating or sending report' });
  }
}





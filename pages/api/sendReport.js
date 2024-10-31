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

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

function isValidReport(content) {
  const keywords = ["golf ball", "model", "recomanacions", "rendiment", "Titleist", "Callaway", "Srixon", "recommendation", "suitable", "ideal"];
  return keywords.some((keyword) => content.includes(keyword)) && content.length > 100;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: translations[req.body.locale]?.report_method_not_allowed || 'Method not allowed' });
  }

  const { email, locale, conversation, userName } = req.body;
  const t = translations[locale] || translations.en;

  if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
    console.error("Conversation data is missing or invalid.");
    return res.status(400).json({ message: t.report_invalid_conversation });
  }

  try {
    const messages = [
      { role: 'system', content: t.report_prompt },
      ...conversation,
    ];

    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.2,
      top_p: 0.8,
    });

    const markdownContent = completion.choices[0].message.content.trim();

    if (!isValidReport(markdownContent)) {
      return res.status(500).json({ message: 'Generated report content is not valid or relevant.' });
    }

    const md = new MarkdownIt();
    const htmlContent = md.render(markdownContent);

    // Incluir mensaje de despedida y logo
    const farewellMessage = t.farewell_message_with_logo || 'We hope the lakes spit out your balls. Have a great day!';
    const logoUrl = 'http://localhost:3000/bolasgolflogo.png';
    
    const fullHtmlContent = `
    <html>
      <body style="font-family: Arial, sans-serif;">
        <h2 style="text-align: center; font-size: 24px;">${t.report_title} ${userName}</h2>
        <p style="text-align: center; font-size: 14px;">${t.report_thanks_message}</p>
        ${htmlContent}
        <div style="text-align: center; margin-top: 30px;">
          <p style="font-size: 14px; margin-bottom: 10px;">${farewellMessage}</p>
          <img src="${logoUrl}" alt="bolas.golf logo" style="height: 40px; width: auto; margin-top: 10px;" />
        </div>
       </body>
    </html>`;

    // Log HTML content for debugging
    console.log("Generated HTML for PDF:", fullHtmlContent);

    const outputFilePath = path.join(process.cwd(), 'recommendation_report.pdf');
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.setContent(fullHtmlContent, { waitUntil: 'networkidle0' });
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
    console.error('Full error details:', JSON.stringify(error, null, 2));
    // Enviar un mensaje de error claro sin cerrar la sesión
    res.status(500).json({ message: t.report_error_message });
  }
}





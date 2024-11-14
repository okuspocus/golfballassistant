import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";
import MarkdownIt from 'markdown-it';
import puppeteer from 'puppeteer';
import nodemailer from 'nodemailer';
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

function hasValidRecommendations(content) {
  const keywords = ["Bridgestone", "Callaway", "TaylorMade", "Titleist", "Wilson", "Srixon"];
  return keywords.some((keyword) => content.includes(keyword)) && content.length > 150;
}

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', ['POST']);
    return res.status(405).json({ message: translations[req.body.locale]?.report_method_not_allowed || 'Method not allowed' });
  }

  const { email, locale, conversation, userName } = req.body;
  const t = translations[locale] || translations.en;

  // Verificar la validez de la conversación
  if (!conversation || !Array.isArray(conversation) || conversation.length === 0) {
    console.error("Conversation data is missing or invalid.");
    return res.status(400).json({ message: t.report_invalid_conversation });
  }

  // Extraer el último mensaje de la conversación de OpenAI (que debería ser la recomendación)
  const openAiMessage = conversation[conversation.length - 1]?.content;

  if (!hasValidRecommendations(openAiMessage)) {
    // Si no hay recomendaciones, retornar un error
    return res.status(400).json({ message: "No hay recomendaciones que informar." });
  }

  try {
    console.log("Generating report...");

    const messages = [
      { role: 'system', content: t.report_prompt },
      ...conversation,
    ];

    // Llamada a la API de OpenAI para generar el contenido del informe
    const completion = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo',
      messages,
      max_tokens: 500,
      temperature: 0.2,
      top_p: 0.8,
    });

    const markdownContent = completion.choices[0].message.content.trim();
    console.log("Generated markdown content:", markdownContent);

    // Si el informe generado no es válido, retornar error
    if (!isValidReport(markdownContent)) {
      console.error("Generated report content is not valid or relevant.");
      return res.status(500).json({ message: 'Generated report content is not valid or relevant.' });
    }

    const md = new MarkdownIt();
    const htmlContent = md.render(markdownContent);

    const farewellMessage = t.farewell_message_with_logo || 'Have a great day!';
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

    console.log("Generated HTML content for PDF:", fullHtmlContent);

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
    console.log("PDF generated successfully at", outputFilePath);

    await browser.close();

    // Enviar el correo electrónico con el PDF adjunto
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
    console.log("Email sent successfully to", email);

    res.status(200).json({ message: t.report_success_message });
  } catch (error) {
    console.error('Error generating or sending report:', error);
    res.status(500).json({ message: t.report_error_message, errorDetails: error.toString() });
  }
}

function isValidReport(content) {
  const keywords = ["Bridgestone", "Callaway", "TaylorMade", "Titleist", "Wilson", "Srixon", "Titleist"];
  return keywords.some((keyword) => content.includes(keyword)) && content.length > 150;
}





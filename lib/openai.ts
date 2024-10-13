// lib/openai.ts
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_DAN, // Asegúrate de que esta variable esté definida
});

export { openai };


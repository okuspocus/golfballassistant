import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY_DAN,
});

export const runtime = "edge"; // Mantener el runtime como 'edge'

export async function POST(req: Request) {
  const { messages } = await req.json();

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    stream: true,
    max_tokens: 500,
    temperature: 0.1,
    top_p: 0.4,  // Limita la aleatoriedad
    messages: [
      {
        role: 'system',
        content: 'You are a golf professional and a golf ball expert, and you speak englsih, spanish and catalan. You ask the user for diverse aspects on his current golf game, about 4-5 questions, one question at a time, and from the info you get, you advise on the best golf ball for him, giving a couple or 3 options with some details on why. Use only real, well-known golf ball models and if needed check them out on the internet. If you do not understand the game characteristics of the user, ask for additional details and do not accept monosylabus. If you are asked for anything not related to golf or something unknown to you, politely decline the answer and do not provide advice.',
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}

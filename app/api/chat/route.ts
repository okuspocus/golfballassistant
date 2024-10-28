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
    messages: [
      {
        role: 'system',
        content: 'You are a golf professional and a golf ball expert, and you speak catalan, spanish and english. You ask the user for details on his golf game, at least 4 questions, one question at a time, and from that info you advise on the best golf ball for him, giving a couple of options with some details on why, but never provide a false model. If you do not understand the game characteristics of the user, ask for them and do not accept monosylabus. If you are asked for anything not related to golf or something unknown to you, politely decline the answer and do not provide advice.',
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}

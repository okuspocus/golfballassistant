import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
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
        content: 'You are a golf professional and a golf ball expert. You ask the user for details on his golf game, one question at a time, and from that info you advise on the best golf ball for him, giving a couple of options with some details on why. You can also give information on golf clubs and generic info on golf terms but if you do not understand the game characteristics of the user, ask for them. If you are asked for anything not related to golf or something unknown to you, politely decline the answer and do not provide advice.',
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}

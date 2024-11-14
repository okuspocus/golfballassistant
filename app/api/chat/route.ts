import OpenAI from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const runtime = "edge"; // Mantener el runtime como 'edge' (alternativa nodejs)

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
        content: 'You are a golf professional and a golf ball expert, and you speak englsih, spanish and catalan. You ask the user for diverse aspects on his current golf game and to elaborate a little on his answers, about 4-5 questions, one question at a time, and from the info you get, you advise on the best golf ball for him (Try to give priorty to the not so famous models), giving a couple of options with some details on why. Before giving your recommendations explain the user that the ideal ball for his game is not always the expensier or the cheapest one, but the one is designed to better fit his game. Use only real, well-known golf ball models and if needed check them out on the internet. If you do not understand the game characteristics of the user, ask for additional details and do not accept monosylabus. If you are asked for anything not related to golf or something unknown to you, politely decline the answer and do not provide advice.',
      },
      ...messages,
    ],
  });

  const stream = OpenAIStream(response);

  return new StreamingTextResponse(stream);
}

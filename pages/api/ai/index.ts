import { NextRequest } from "next/server";
import { OpenAIStream, OpenAIStreamPayload } from "@/utils/OpenAIStream";

export const config = { runtime: "edge" };

export default async function handler(req: NextRequest) {
  const { prompt } = (await req.json()) as {
    prompt: string;
  };

  const payload: OpenAIStreamPayload = {
    model: "gpt-3.5-turbo-0301",
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],

    stream: true,
  };

  const stream = await OpenAIStream(payload);
  return new Response(stream);
}

import { NextResponse } from "next/server";
import openai from "openai";

const openaiClient = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: Request) {
  const { text, voice, model } = await request.json();
  if (!text || typeof text !== "string") {
    return NextResponse.json({ error: "Text is required" }, { status: 400 });
  }

  if (!voice || typeof voice !== "string") {
    return NextResponse.json({ error: "Voice is required" }, { status: 400 });
  }

  if (!model || typeof model !== "string") {
    return NextResponse.json({ error: "Model is required" }, { status: 400 });
  }

  const res = await openaiClient.audio.speech.create({
    model: model,
    input: text,
    voice: voice,
  });

  const arrayBuffer = await res.arrayBuffer();

  return new NextResponse(arrayBuffer, {
    headers: {
      "Content-Type": "audio/mpeg",
    },
  });
}

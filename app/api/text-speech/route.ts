import { NextResponse } from "next/server";
import openai from "openai";

const openaiClient = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

type RequestBody = {
  text: string;
};

const VOICE = "alloy";
const MODEL = "gpt-4o-mini-tts";

export async function POST(request: Request) {
  try {
    const body: RequestBody = await request.json();
    const { text } = body;

    if (!text) {
      return NextResponse.json({ error: "Text is required" }, { status: 400 });
    }

    const res = await openaiClient.audio.speech.create({
      model: MODEL,
      input: text,
      voice: VOICE ,
    });

    const arrayBuffer = await res.arrayBuffer();

    return new NextResponse(arrayBuffer, {
      headers: {
        "Content-Type": "audio/mpeg",
      },
    });
  } catch (error) {
    console.error("Error processing text to speech", error);
    return NextResponse.json(
      { error: "Failed to process text to speech" },
      { status: 500 },
    );
  }
}

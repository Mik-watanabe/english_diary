import openai from "openai";
import {
  DIARY_DEVELOPER_PROMPT,
  DIARY_SYSTEM_PROMPT,
} from "@/app/prompts/diary";
import { NextResponse } from "next/server";

const openaiClient = new openai({
  apiKey: process.env.OPENAI_API_KEY,
});

const reviseDiarySchema = {
  name: "reviseDiary",
  schema: {
    type: "object",
    properties: {
      original: {
        type: "string",
        description: "The original diary entry.",
      },
      revised: {
        type: "string",
        description: "The revised diary entry.",
      },
      corrections: {
        type: "array",
        description: "The corrections to the diary entry.",
        items: {
          type: "object",
          properties: {
            original: {
              type: "string",
            },
            revised: {
              type: "string",
            },
            why: {
              type: "string",
            },
          },
          required: ["original", "revised", "why"],
          additionalProperties: false,
        },
      },
      alternatives: { type: "string" },
    },
    required: ["original", "revised", "corrections", "alternatives"],
    additionalProperties: false,
  },
  strict: true,
};

export async function POST(request: Request) {
  try {
    const { originalDiary } = await request.json();

    if (!originalDiary || typeof originalDiary !== "string") {
      return NextResponse.json(
        { error: "Empty input is not allowed" },
        { status: 400 },
      );
    }

    if (originalDiary.length > 2000) {
      return NextResponse.json(
        { error: "Input is too long. Please keep it under 2000 characters." },
        { status: 400 },
      );
    }

    const response = await openaiClient.responses.create({
        model: "gpt-4.1",
        temperature: 0.3,
        store: false,
        input: [
            {
                role: "developer",
                content: DIARY_DEVELOPER_PROMPT
            },
            {
                role: "system",
                content: DIARY_SYSTEM_PROMPT
            },
            {
                role: "user",
                content: originalDiary
            }
        ],
        text: {
            format: {
                type: "json_schema",
                ...reviseDiarySchema,
            },
        },
    });

    const result = JSON.parse(response.output_text);


    return NextResponse.json(result);

  } catch (error) {
    console.error("Diary revision failed: ", error);

    return NextResponse.json(
      { error: "Failed to revise diary" },
      { status: 500 },
    );
  }
}

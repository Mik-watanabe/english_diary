"use server";

import valueProcessor from "next/dist/build/webpack/loaders/resolve-url-loader/lib/value-processor";
import { string, z } from "zod";
import moment from "moment";
import { createClient } from "@/lib/supabase/server";

const correctionsSchema = z.array(z.object({
  original: z.string(),
  revised: z.string(),
  why: z.string(),
}));

const SaveDiarySchema = z.object({
  title: z.string().min(1, "Title is required"),
  date: z.string(),
  original_content: string().min(1),
  revised_content: string().min(1),
  alternative_content: string().min(1),
  corrections: z.string().transform((value, ctx) => {
    try {
      return correctionsSchema.parse(JSON.parse(value));
    } catch {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid corrections",
      });
      return z.NEVER;
    }
  }),
});

export default async function saveDiary(initialState: any, formData: FormData) {

  const validatedFields = SaveDiarySchema.safeParse({
    title: formData.get("title"),
    date: formData.get("date"),
    original_content: formData.get("original_content"),
    revised_content: formData.get("revised_content"),
    corrections: formData.get("corrections"),
    alternative_content: formData.get("alternative_content"),
  });

  console.log(validatedFields);
  if (!validatedFields.success) {
    return {
      success: false,
      message: "Failed to save diary. Please try again.",
      errors: {},
    };
  }

  const supabase = await createClient();


  const { data, error } = await supabase.rpc("save_diary_with_corrections", {
    p_title: validatedFields.data.title,
    p_diary_date: new Date(validatedFields.data.date),
    p_original_content: validatedFields.data.original_content,
    p_revised_content: validatedFields.data.revised_content,
    p_corrections: validatedFields.data.corrections,
    p_alternative_content: validatedFields.data.alternative_content,
  });

  if (error) {
    return {
      success: false,
      message: error.message,
    };
  }

  return {
    success: true,
    message: "Diary saved successfully.",
    diaryId: data,
  };
}

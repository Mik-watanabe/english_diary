"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { getUser } from "./diary/read-action";

const LoginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters long"),
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function login(initialState: any, formData: FormData) {
  const validatedFields = LoginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (!validatedFields.success) {
    const flattenedErros = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "",
      errors: flattenedErros.fieldErrors,
    };
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
  });

  if (error) {
    return {
      success: false,
      message: "Failed to login. Please try again.",
      errors: {},
    };
  }

  redirect("/diary");
}

export async function loginWithDemo() {
  const supabase = await createClient();
  const { error: signInError } = await supabase.auth.signInWithPassword({
    email: "demo@example.com",
    password: process.env.DEMO_USER_PASSWORD!,
  });
  if (signInError) {
    return {
      success: false,
      message: "Failed to login with demo account. Please try again.",
      errors: {},
    };
  }
  const userResult = await getUser();
  if (!userResult.success || !userResult.userData?.id) {
    return {
      success: false,
      message: "Failed to login with demo account. Please try again.",
      errors: {},
    };
  }

  // delete all the demo data from the database except seed data
  const { error: deleteError } = await supabase
    .from("diaries")
    .delete()
    .eq("user_id", userResult.userData.id)
    .or("is_sample.eq.false");

  if (deleteError) {
    return {
      success: false,
      message: "Failed to login with demo account. Please try again.",
      errors: {},
    };
  }

  redirect("/diary");
}

"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

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

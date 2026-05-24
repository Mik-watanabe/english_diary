"use server";

import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";

const SignupSchema = z
  .object({
    firstName: z.string().min(1, "First name is required."),
    lastName: z.string().min(1, "Last name is required."),
    email: z.string().email("Please enter a valid email."),
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z
      .string()
      .min(8, "Password must be at least 8 characters."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords do not match.",
  });

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function signup(initialState: any, formData: FormData) {
  const validatedFields = SignupSchema.safeParse({
    firstName: formData.get("firstName"),
    lastName: formData.get("lastName"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  });

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    return {
      success: false,
      message: "",
      errors: flattenedErrors.fieldErrors,
    };
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.signUp({
    email: validatedFields.data.email,
    password: validatedFields.data.password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/confirm`,
      data: {
        first_name: validatedFields.data.firstName,
        last_name: validatedFields.data.lastName,
      },
    },
  });

  if (error) {
    return {
      success: false,
      errors: {},
      message: "Failed to create account. Please try again.",
    };
  }

  if (data.user && data.user.identities?.length === 0) {
    return {
      success: false,
      errors: {},
      message: "This email may already be registered. Please sign in instead.",
    };
  }

  redirect("/signup/check-your-email");
}

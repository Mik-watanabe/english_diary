"use client";

import { useActionState } from "react";
import { login } from "@/app/actions/login-action";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import Link from "next/link";

const initialState = {
  success: false,
  message: "",
  errors: {
    email: [],
    password: [],
  },
};

export default function LoginForm() {
  const [state, formAction] = useActionState(login, initialState);
  return (
    <div className="flex min-h-dvh items-center justify-center">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-foreground dark:text-foreground mt-2 text-center text-lg font-bold text-balance">
            Login to EnglishDiary
          </h2>
          {state.message && (
            <p className="text-center text-sm text-red-500">{state.message}</p>
          )}
        </div>

        <Card className="mt-4 shadow-2xs sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent>
            <form action={formAction} className="space-y-4">
              <FieldGroup>
                <Field>
                  <FieldLabel htmlFor="form-email">Email</FieldLabel>
                  <Input
                    id="form-email"
                    type="email"
                    placeholder="john@example.com"
                    name="email"
                    required
                  />
                  {state.errors?.email && (
                    <p className="text-sm text-red-500">
                      {state.errors.email[0]}
                    </p>
                  )}
                </Field>

                <Field>
                  {/* TODO: Add forgot password link */}
                  <FieldLabel htmlFor="form-password">
                    Password{" "}
                    <span className="ml-auto text-xs text-blue-500 hover:cursor-pointer hover:underline">
                      Forgot password?
                    </span>
                  </FieldLabel>
                  <Input
                    id="form-password"
                    type="password"
                    placeholder="********"
                    name="password"
                    required
                  />
                  {state.errors?.password && (
                    <p className="text-sm text-red-500">
                      {state.errors.password[0]}
                    </p>
                  )}
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="mt-4 w-full py-2 font-medium hover:cursor-pointer hover:opacity-80"
              >
                Login
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="text-muted-foreground dark:text-muted-foreground mt-4 text-center text-sm">
          Don&apos;t have an account?{" "}
          <Link
            href="/signup"
            className="text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90 font-medium"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}

"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import Link from "next/link";
import { useActionState } from "react";
import { signup } from "../signup/action";

const initialState = {
  success: false,
  message: "",
  errors: {},
};

export default function SignUpForm() {
  const [state, formAction] = useActionState(signup, initialState);
  return (
    <div className="flex items-center justify-center min-h-dvh">
      <div className="flex flex-1 flex-col justify-center px-4 py-10 lg:px-6">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <h2 className="text-balance mt-2 text-center text-lg font-bold text-foreground dark:text-foreground">
            Create new account for EnglishDiary
          </h2>
          {state.message && (
            <p className="text-sm text-red-500 text-center">
              {state.message}
            </p>
          )}
        </div>

        <Card className="mt-4 shadow-2xs sm:mx-auto sm:w-full sm:max-w-md">
          <CardContent>
            <form action={formAction} className="space-y-4">
              <FieldGroup>
                <div className="grid grid-cols-2 gap-2">
                  <Field>
                    <FieldLabel htmlFor="form-first-name">
                      First Name
                    </FieldLabel>
                    <Input
                      id="form-first-name"
                      placeholder="John"
                      name="firstName"
                      required
                    />
                    {state.errors?.firstName && (
                      <p className="text-sm text-red-500">
                        {state.errors.firstName[0]}
                      </p>
                    )}
                  </Field>
                  <Field>
                    <FieldLabel htmlFor="form-last-name">Last Name</FieldLabel>
                    <Input
                      id="form-last-name"
                      placeholder="Smith"
                      name="lastName"
                      required
                    />
                    {state.errors?.xlastName && (
                      <p className="text-sm text-red-500">
                        {state.errors.lastName[0]}
                      </p>
                    )}
                  </Field>
                </div>
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
                  <FieldLabel htmlFor="form-password">Password</FieldLabel>
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

                <Field>
                  <FieldLabel htmlFor="form-confirm-password">
                    Confirm Password
                  </FieldLabel>
                  <Input
                    id="form-confirm-password"
                    type="password"
                    placeholder="********"
                    name="confirmPassword"
                    required
                  />
                  {state.errors?.confirmPassword && (
                    <p className="text-sm text-red-500">
                      {state.errors.confirmPassword[0]}
                    </p>
                  )}
                </Field>
              </FieldGroup>

              <Button
                type="submit"
                className="mt-4 w-full py-2 font-medium hover:opacity-80 hover:cursor-pointer"
              >
                Create account
              </Button>
            </form>
          </CardContent>
        </Card>
        <p className="mt-4 text-center text-sm text-muted-foreground dark:text-muted-foreground">
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary hover:text-primary/90 dark:text-primary hover:dark:text-primary/90"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}

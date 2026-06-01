"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { useActionState } from "react";
import { signup } from "@/app/actions/signup-action";
import type { SignupState } from "@/types/diary";
import {
  AuthShell,
  AuthTextFooter,
  AuthTextLink,
  authInputClass,
  authPrimaryButtonClass,
} from "@/app/ui/auth/auth-shell";

const initialState: SignupState = {
  success: false,
  message: "",
  errors: {},
};

export default function SignUpForm() {
  const [state, formAction] = useActionState(signup, initialState);

  return (
    <AuthShell
      title="Create your EnglishDiary account"
      message={state.message || undefined}
      footer={
        <AuthTextFooter>
          Already have an account?{" "}
          <AuthTextLink href="/login">Sign in</AuthTextLink>
        </AuthTextFooter>
      }
    >
      <form action={formAction} className="space-y-4">
        <FieldGroup>
          <div className="grid grid-cols-2 gap-2">
            <Field>
              <FieldLabel htmlFor="form-first-name">First Name</FieldLabel>
              <Input
                id="form-first-name"
                placeholder="John"
                name="firstName"
                required
                className={authInputClass}
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
                className={authInputClass}
              />
              {state.errors?.lastName && (
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
              className={authInputClass}
            />
            {state.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email[0]}</p>
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
              className={authInputClass}
            />
            {state.errors?.password && (
              <p className="text-sm text-red-500">{state.errors.password[0]}</p>
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
              className={authInputClass}
            />
            {state.errors?.confirmPassword && (
              <p className="text-sm text-red-500">
                {state.errors.confirmPassword[0]}
              </p>
            )}
          </Field>
        </FieldGroup>

        <Button type="submit" className={authPrimaryButtonClass}>
          Create account
        </Button>
      </form>
    </AuthShell>
  );
}

"use client";

import { useActionState, useState } from "react";
import { unstable_rethrow } from "next/navigation";
import { login, loginWithDemo } from "@/app/actions/login-action";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { showErrorToast } from "@/lib/show-toast";
import { clearEventCache } from "@/lib/diary/event-cache";
import {
  AuthShell,
  AuthTextFooter,
  AuthTextLink,
  authInputClass,
  authPrimaryButtonClass,
  authTextLinkClass,
} from "@/app/ui/auth/auth-shell";
import { cn } from "@/lib/utils";

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
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleTryDemo = async () => {
    setIsDemoLoading(true);

    try {
      clearEventCache();
      const result = await loginWithDemo();
      if (result && !result.success) {
        showErrorToast(result.message);
      }
    } catch (error) {
      unstable_rethrow(error);
      showErrorToast("Failed to try demo");
    } finally {
      setIsDemoLoading(false);
    }
  };

  return (
    <AuthShell
      title="Login to EnglishDiary"
      message={state.message || undefined}
      footer={
        <>
          <AuthTextFooter>
            Don&apos;t have an account?{" "}
            <AuthTextLink href="/signup">Sign up</AuthTextLink>
          </AuthTextFooter>
          <AuthTextFooter>
            Want to try EnglishDiary with a demo account?{" "}
            <button
              type="button"
              onClick={handleTryDemo}
              disabled={isDemoLoading}
              aria-busy={isDemoLoading}
              className={cn(
                authTextLinkClass,
                isDemoLoading && "pointer-events-none opacity-60",
              )}
            >
              Try Demo
            </button>
          </AuthTextFooter>
        </>
      }
    >
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
              className={authInputClass}
            />
            {state.errors?.email && (
              <p className="text-sm text-red-500">{state.errors.email[0]}</p>
            )}
          </Field>

          <Field>
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
              className={authInputClass}
            />
            {state.errors?.password && (
              <p className="text-sm text-red-500">{state.errors.password[0]}</p>
            )}
          </Field>
        </FieldGroup>

        <Button type="submit" className={authPrimaryButtonClass}>
          Login
        </Button>
      </form>
    </AuthShell>
  );
}

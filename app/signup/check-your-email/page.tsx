import { AuthTextFooter, AuthTextLink } from "@/app/ui/auth/auth-shell";

export default function CheckYourEmailPage() {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-[#E5EDF8] bg-white p-6 shadow-sm">
        <h2 className="text-center text-lg font-semibold text-slate-900">
          Check your email
        </h2>
        <p className="mt-4 text-center text-sm text-slate-600">
          We&apos;ve sent you a confirmation email. Please check your inbox and
          click the link to confirm your account.
        </p>
        <AuthTextFooter>
          <AuthTextLink href="/login">Back to sign in</AuthTextLink>
        </AuthTextFooter>
      </div>
    </div>
  );
}

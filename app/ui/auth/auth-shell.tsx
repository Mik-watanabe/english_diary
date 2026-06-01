import Link from "next/link";
import { cn } from "@/lib/utils";

export const authPrimaryButtonClass =
  "w-full rounded-full border-blue-500 bg-blue-500 py-5 font-semibold text-white hover:cursor-pointer hover:bg-blue-600";

/** Matches diary-editor focus/border styling */
export const authInputClass =
  "h-10 rounded-xl border-[#E5EDF8] bg-[#F5F9FF]/30 px-3 text-slate-700 shadow-none placeholder:text-slate-400 focus-visible:border-blue-300 focus-visible:ring-2 focus-visible:ring-blue-200/80 focus-visible:ring-offset-0 focus-visible:outline-none aria-invalid:border-red-500/50 aria-invalid:ring-2 aria-invalid:ring-red-500/20";

type AuthShellProps = {
  title: string;
  message?: string;
  children: React.ReactNode;
  footer?: React.ReactNode;
};

export function AuthShell({
  title,
  message,
  children,
  footer,
}: AuthShellProps) {
  return (
    <div className="flex min-h-dvh items-center justify-center px-4 py-10">
      <div className="w-full max-w-sm rounded-xl border border-[#E5EDF8] bg-white p-6 shadow-sm">
        <h2 className="text-center text-lg font-semibold text-slate-900">
          {title}
        </h2>
        {message ? (
          <p className="mt-2 text-center text-sm text-red-500">{message}</p>
        ) : null}
        <div className="mt-6">{children}</div>
        {footer ? <div className="mt-4 space-y-4">{footer}</div> : null}
      </div>
    </div>
  );
}

export const authTextLinkClass =
  "font-medium text-blue-500 hover:text-blue-700 hover:underline";

export function AuthTextLink({
  href,
  children,
  className,
}: {
  href: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <Link href={href} className={cn(authTextLinkClass, className)}>
      {children}
    </Link>
  );
}

type AuthTextFooterProps = {
  children: React.ReactNode;
};

export function AuthTextFooter({ children }: AuthTextFooterProps) {
  return (
    <p className="text-muted-foreground text-center text-sm">{children}</p>
  );
}

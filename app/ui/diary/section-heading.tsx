import { cn } from "@/lib/utils";

export default function SectionHeading({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <h2
      className={cn(
        "px-2 pb-2 text-sm font-semibold text-slate-900",
        className,
      )}
    >
      {children}
    </h2>
  );
}

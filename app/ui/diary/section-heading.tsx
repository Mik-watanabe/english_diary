import { cn } from "@/lib/utils";

export function SectionHeading({ children, className }: { children: React.ReactNode, className?: string }) {
    return (
        <h2 className={cn("text-sm font-semibold text-slate-900 px-2 pb-2", className)}>
            {children}
        </h2>
    );
}
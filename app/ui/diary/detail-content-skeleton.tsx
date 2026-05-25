import { SectionHeading } from "./section-heading";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const contentPanelClass = "rounded-xl border border-[#E5EDF8] p-3";

export function DetailContentSkeleton() {
  return (
    <>
      <div className="flex animate-pulse justify-center py-8">
        <Skeleton className="h-6 w-48 max-w-[80%]" />
      </div>

      {/* Original diary */}
      <section>
        <div className="w-full">
          <SectionHeading>🌤️ Your Original Diary:</SectionHeading>
          <div className="rounded-xl border border-[#E5EDF8] p-2">
            <Skeleton className="mt-2 h-[7.5rem] w-full animate-pulse rounded-xl" />
          </div>
        </div>
      </section>

      {/* Revised diary — match create/page skeleton */}
      <section className="mt-4">
        <SectionHeading>✨ Revised Diary</SectionHeading>
        <div className={cn(contentPanelClass, "leading-relaxed")}>
          <div className="animate-pulse space-y-3 rounded-md px-3 py-2">
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-5/6" />
            <Skeleton className="h-4 w-2/3" />
          </div>
        </div>
      </section>

      {/* AI Feedback — tabs area */}
      <section className="mt-4">
        <SectionHeading>💡 AI Feedback</SectionHeading>
        <div className="rounded-xl border border-[#E5EDF8] p-2">
          <div className="flex gap-4 border-b border-[#E5EDF8] pb-2">
            <Skeleton className="h-5 w-24" />
            <Skeleton className="h-5 w-24" />
          </div>
          <Skeleton className="mt-3 h-32 w-full rounded-md" />
        </div>
      </section>
    </>
  );
}

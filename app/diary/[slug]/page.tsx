import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronLeft, ChevronRight, NotepadText } from "lucide-react";
import { parseDiaryDate } from "@/lib/date";
import { Suspense } from "react";
import DetailContent from "@/app/ui/diary/detail-content";
import { DetailContentSkeleton } from "@/app/ui/diary/detail-content-skeleton";

const DiaryPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const date = parseDiaryDate(slug);
  if (!date) {
    notFound();
  }
  const prevDate = date.clone().subtract(1, "day");
  const nextDate = date.clone().add(1, "day");

  return (
    <div className="rounded-3xl border border-[#E5EDF8] bg-white p-4 shadow-lg shadow-[#E5EDF8]/50">
      <section className="flex items-center justify-between gap-3 px-2 pb-2">
        <Link
          href={`/diary/${prevDate.format("YYYY-MM-DD")}`}
          className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-600/80"
        >
          <ChevronLeft className="size-4" />
          {prevDate.format("dddd, MMM DD")}
        </Link>
        <NotepadText className="size-4" />

        <Link
          href={`/diary/${nextDate.format("YYYY-MM-DD")}`}
          className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-600/80"
        >
          {nextDate.format("dddd, MMM DD")}
          <ChevronRight className="size-4" />
        </Link>
      </section>
      <Suspense fallback={<DetailContentSkeleton />}>
        <DetailContent date={date.format("YYYY-MM-DD")} />
      </Suspense>
    </div>
  );
};

export default DiaryPage;

import React from "react";
import { notFound, redirect } from "next/navigation";
import { getUserDiary } from "@/app/actions/diary/read-action";
import type { GetUserDiaryErrorCode } from "@/types/diary";
import { highlightDiff } from "@/lib/diaryHighlight";
import TextSpeechButton from "@/app/ui/diary/text-speech-button";
import { cn } from "@/lib/utils";
import { DiaryTabs } from "@/app/ui/diary/tabs";
import Link from "next/link";
import { ChevronLeft, ChevronRight, NotepadText } from "lucide-react";
import { parseDiaryDate } from "@/lib/date";
import { SectionHeading } from "@/app/ui/diary/section-heading";
import { DiaryEmptyState } from "@/app/ui/diary/diary-empty-state";
const logGetUserDiaryFailure = (
  code: GetUserDiaryErrorCode,
  message: string,
) => {
  console.error("[getUserDiary]", code, message);
};

const contentPanelClass =
  "rounded-xl border border-[#E5EDF8] bg-[#F5F9FF]/40 p-3 text-slate-700";

const DiaryPage = async ({ params }: { params: Promise<{ slug: string }> }) => {
  const { slug } = await params;

  const date = parseDiaryDate(slug);
  if (!date) {
    notFound();
  }

  const result = await getUserDiary(date.format("YYYY-MM-DD"));
  const prevDate = date.clone().subtract(1, "day");
  const nextDate = date.clone().add(1, "day");

  if (!result.success) {
    const { code, message } = result;
    if (code === "auth_failed") {
      redirect("/login");
    }
    if (code === "diary_not_found") {
    } else {
      logGetUserDiaryFailure(code, message);
      notFound();
    }
  }
  const isEmpty = !result.success && result.code === "diary_not_found";
  const diary = result.success ? result.diaryData : null;
  const revisedWithHighlight =
    diary != null ? highlightDiff(diary.original, diary.revised) : null;

  return (
    <div className="rounded-3xl border border-[#E5EDF8] bg-white p-4 shadow-lg shadow-[#E5EDF8]/50">
      <section>
        <div className="flex items-center justify-between gap-3 px-2 pb-2">
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
        </div>
        {!isEmpty && (
          <SectionHeading className="px-0 py-6 text-center text-xl font-semibold">
            Title: {diary?.title}
          </SectionHeading>
        )}
      </section>
      {isEmpty ? (
        <DiaryEmptyState date={date.format("YYYY-MM-DD")} />
      ) : (
        <>
          <section>
            <div className="w-full [&_textarea]:rounded-xl [&_textarea]:border-[#E5EDF8] [&_textarea]:bg-[#F5F9FF]/30 [&_textarea]:p-3 [&_textarea]:text-slate-700">
              <SectionHeading className="px-0 pb-0">
                🌤️ Your Original Diary:
              </SectionHeading>
              <textarea
                readOnly
                rows={5}
                name="diary"
                id="diary"
                value={diary?.original}
                className="mt-2 w-full rounded-xl border border-gray-300 p-2 focus-within:outline-none"
              />
            </div>
          </section>
          <section className="mt-4">
            <SectionHeading>
              ✨ Revised Diary{" "}
              <TextSpeechButton revisedText={diary?.revised || ""} />
            </SectionHeading>
            <div className={cn(contentPanelClass, "leading-relaxed")}>
              <p className="rounded-md bg-white px-3 py-2">
                {revisedWithHighlight}
              </p>
            </div>
          </section>
          <section className="mt-4">
            <SectionHeading>💡 AI Feedback</SectionHeading>
            <div className="rounded-xl border border-[#E5EDF8] bg-[#F5F9FF]/30 p-2">
              <DiaryTabs
                corrections={diary?.corrections || []}
                alternative={diary?.alternative || ""}
              />
            </div>
          </section>
        </>
      )}
    </div>
  );
};

export default DiaryPage;

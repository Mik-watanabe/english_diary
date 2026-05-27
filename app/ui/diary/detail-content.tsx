import { SectionHeading } from "./section-heading";
import TextSpeechButton from "./text-speech-button";
import { cn } from "@/lib/utils";
import { DiaryTabs } from "./tabs";
import { DiaryEmptyState } from "./diary-empty-state";
import { getUserDiary } from "@/app/actions/diary/read-action";
import { highlightDiff } from "@/lib/diary/diaryHighlight";
import type { GetUserDiaryErrorCode } from "@/types/diary";
import { notFound } from "next/navigation";

const contentPanelClass =
  "rounded-xl border border-[#E5EDF8] bg-[#F5F9FF]/40 p-3 text-slate-700";

const logGetUserDiaryFailure = (
  code: GetUserDiaryErrorCode,
  message: string,
) => {
  console.error("[getUserDiary]", code, message);
};

export default async function DetailContent({ date }: { date: string }) {
  const result = await getUserDiary(date);
  if (!result.success) {
    const { code, message } = result;

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

  if (isEmpty) {
    return <DiaryEmptyState date={date} />;
  }
  return (
    <>
      <SectionHeading className="px-0 py-6 text-center text-xl font-semibold">
        Title: {diary?.title}
      </SectionHeading>
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
  );
}

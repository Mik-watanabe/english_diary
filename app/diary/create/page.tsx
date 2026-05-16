"use client";
import React, { useState } from "react";
import { notFound, useSearchParams } from "next/navigation";
import moment from "moment";
import { highlightDiff } from "@/lib/diaryHighlight";
import { Correction } from "../types";
import DiaryEditor from "@/app/ui/diary/diary-editor";
import { Skeleton } from "@/components/ui/skeleton";
import SaveDialog from "@/app/ui/diary/save-diary-dialog";
import { RevisedDiaryResponse } from "@/types/diary";
import { showErrorToast } from "@/lib/show-toast";
import { DiaryTabs } from "@/app/ui/diary/tabs";
import { cn } from "@/lib/utils";

const sectionHeadingClass = "text-sm font-semibold text-slate-900 px-2 pb-2";
const contentPanelClass =
  "rounded-xl border border-[#E5EDF8] bg-[#F5F9FF]/40 p-3 text-slate-700";
const editorWrapperClass =
  "[&_textarea]:rounded-xl [&_textarea]:border-[#E5EDF8] [&_textarea]:bg-[#F5F9FF]/30 [&_textarea]:p-3 [&_textarea]:text-slate-700 [&_textarea]:placeholder:text-slate-400 [&_textarea]:focus:border-blue-300 [&_textarea]:focus:outline-none [&_textarea]:focus:ring-2 [&_textarea]:focus:ring-blue-200/80";

const CreateDiaryPage = () => {
  const [revisedDiaryValue, setRevisedDiaryValue] = useState<React.ReactNode[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [revisedDiaryResponse, setRevisedDiaryResponse] =
    useState<RevisedDiaryResponse | null>(null);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const searchParams = useSearchParams();
  const [alternative, setAlternative] = useState<string>("");

  const rawDate = searchParams.get("date");

  if (!rawDate || !moment(rawDate, "YYYY-MM-DD", true).isValid()) {
    notFound();
  }

  const date = moment(rawDate).format("MMM DD, YYYY");

  const handleRevise = async (diaryValue: string) => {
    if (!diaryValue.trim()) return;

    try {
      setLoading(true);

      const response = await fetch("/api/revise-diary", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          originalDiary: diaryValue,
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to revise diary");
      }

      const data: RevisedDiaryResponse = await response.json();

      setCorrections(data.corrections);
      const highlighted = highlightDiff(data.original, data.revised);
      setAlternative(data.alternative);

      setRevisedDiaryValue(highlighted);
      setRevisedDiaryResponse(data);
    } catch (error) {
      console.error(error);
      showErrorToast("Failed to revise diary. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rounded-3xl border border-[#E5EDF8] bg-white p-4 shadow-lg shadow-[#E5EDF8]/50">
      <section>
        <div className="flex items-center justify-between gap-3 px-2 pb-2">
          <h2 className={cn(sectionHeadingClass, "px-0 pb-0")}>
            🌤️ How was your day?
          </h2>
          <div className="shrink-0 [&_button]:h-9 [&_button]:rounded-xl [&_button]:px-3 [&_button]:font-semibold">
            <SaveDialog
              date={date}
              revisedDiaryResponse={revisedDiaryResponse}
            />
          </div>
        </div>
        <div className={editorWrapperClass}>
          <DiaryEditor handleRevise={handleRevise} loading={loading} />
        </div>
      </section>

      {loading ? (
        <section className="mt-4">
          <h2 className={sectionHeadingClass}>Revised Diary</h2>
          <div className={contentPanelClass}>
            <div className="space-y-3 animate-pulse">
              <Skeleton className="h-4 w-3/4 bg-blue-100/80" />
              <Skeleton className="h-4 w-full bg-blue-100/80" />
              <Skeleton className="h-4 w-5/6 bg-blue-100/80" />
              <Skeleton className="h-4 w-2/3 bg-blue-100/80" />
            </div>
          </div>
        </section>
      ) : (
        revisedDiaryValue.length > 0 && (
          <section className="mt-4">
            <h2 className={sectionHeadingClass}>✨ Revised Diary</h2>
            <div className={cn(contentPanelClass, "leading-relaxed")}>
              <p className="bg-white rounded-md px-3 py-2">{revisedDiaryValue}</p>
            </div>
          </section>
        )
      )}

      {revisedDiaryValue.length > 0 && (
        <section className="mt-4">
          <h2 className={sectionHeadingClass}>💡 AI Feedback</h2>
          <div className="rounded-xl border border-[#E5EDF8] bg-[#F5F9FF]/30 p-2">
            <DiaryTabs corrections={corrections} alternative={alternative} />
          </div>
        </section>
      )}
    </div>
  );
};

export default CreateDiaryPage;

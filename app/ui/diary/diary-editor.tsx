"use client";

import clsx from "clsx";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";
import { MessageCircleWarning } from "lucide-react";

const MAX_WORDS = 125;

const DiaryEditor = ({
  handleRevise,
  loading,
}: {
  handleRevise: (diaryValue: string) => void;
  loading: boolean;
}) => {
  const [diaryValue, setDiaryValue] = useState("");
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleDiaryChange = (v: string) => {
    setDiaryValue(v);
    const words = v.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);

    if (error) {
      if (wordCount <= MAX_WORDS && wordCount >= 5) {
        setError("");
        return;
      }
    }
  };

  const onHandleRevise = () => {
    if (wordCount > MAX_WORDS) {
      setError("You have reached the maximum word limit");
      return;
    } else if (wordCount < 5) {
      setError("Please enter at least 5 words");
      return;
    }
    handleRevise(diaryValue);
  };

  const editorWrapperClass =
    "border rounded-xl border-[#E5EDF8] bg-[#F5F9FF]/30 p-3 [&_textarea]:text-slate-700 [&_textarea]:placeholder:text-slate-400 focus-within:border-blue-300 focus-within:outline-none focus-within:ring-2  focus-within:ring-blue-200/80";
  return (
    <>
      <div
        className={cn(
          editorWrapperClass,
          error && "border-2 border-red-500/50",
        )}
      >
        <textarea
          readOnly={loading}
          name="diary"
          id="diary"
          placeholder="Write about your day in english, what you did, how you felt etc (min 5 words, max 125 words)💭"
          rows={10}
          className="w-full resize-none focus-within:outline-none"
          onChange={(e) => handleDiaryChange(e.target.value)}
          value={diaryValue}
        ></textarea>
        <p className="text-right text-sm text-gray-500">
          {wordCount}/{MAX_WORDS}
        </p>
      </div>
      <div className="flex flex-col items-center justify-between">
        {error && (
          <p className="flex items-baseline py-2 text-sm text-red-500">
            <MessageCircleWarning className="mr-1 inline-block size-4 scale-x-[-1] text-red-500" />
            {error} 🚨
          </p>
        )}
        <button
          disabled={loading}
          className={clsx(
            "mt-2 ml-auto flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
            loading
              ? "cursor-not-allowed border-[#E5EDF8] bg-slate-50 text-slate-400"
              : "border-blue-500 bg-blue-500 text-white shadow-sm hover:cursor-pointer hover:border-blue-600 hover:bg-blue-600",
          )}
          onClick={onHandleRevise}
        >
          {loading ? (
            <Spinner data-icon="inline-start" className="inline-block" />
          ) : (
            <Sparkle className="size-4 text-white" />
          )}
          AI review & Correct
        </button>
      </div>
    </>
  );
};

export default DiaryEditor;

"use client";

import clsx from "clsx";
import { useState, useEffect } from "react";
import { MessageCircleWarning } from "lucide-react";
import { Spinner } from "@/components/ui/spinner";
import { Sparkle } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_WORDS = 125;

const DiaryEditor = ({
  handleRevise,
  loading,
}: {
  handleRevise: (diaryValue: string) => void;
  loading: boolean;
}) => {
  const [diaryValue, setDiaryValue] = useState("");
  const [isButtonDisabled, setIsButtonDisabled] = useState(true);
  const [error, setError] = useState("");
  const [wordCount, setWordCount] = useState(0);

  const handleDiaryChange = (v: string) =>  {
    setDiaryValue(v);
    const words = v.trim().split(/\s+/).filter(Boolean);
    setWordCount(words.length);
  }

  useEffect(() => {
    setIsButtonDisabled(diaryValue.length === 0 || loading);
    setError("");
  }, [diaryValue, loading]);

  const onHandleRevise = () => {
    if (isButtonDisabled) return;
    if (diaryValue.trim() === "") {
      setError("Please enter your diary first");
      return;
    } else if (wordCount > MAX_WORDS) {
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
      <div className={cn(editorWrapperClass, error && "border-red-500/50 border-2")}>
        <textarea
          readOnly={loading}
          name="diary"
          id="diary"
          placeholder="Write about your day in english, what you did, how you felt etc (min 5 words, max 125 words)💭"
          rows={10}
          className="w-full focus-within:outline-none resize-none"
          onChange={(e) => handleDiaryChange(e.target.value)}
          value={diaryValue}
        ></textarea>
        <p className="text-sm text-right text-gray-500">{wordCount}/{MAX_WORDS}</p>
      </div>
      <div className="flex flex-col justify-between items-center">
        {error && (
          <p className="text-red-500 flex items-baseline text-sm py-2">
            <MessageCircleWarning className="size-4 text-red-500 scale-x-[-1] inline-block mr-1" />
            {error} 🚨
          </p>
        )}
        <button
          disabled={isButtonDisabled}
          className={clsx(
            "mt-2 ml-auto flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
            isButtonDisabled
              ? "cursor-not-allowed border-[#E5EDF8] bg-slate-50 text-slate-400"
              : "border-blue-500 bg-blue-500 text-white shadow-sm hover:bg-blue-600 hover:border-blue-600 hover:cursor-pointer",
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

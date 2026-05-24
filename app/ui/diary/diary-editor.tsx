"use client";

import clsx from "clsx";
import { useState } from "react";
import { Spinner } from "@/components/ui/spinner";
import { Sparkle } from "lucide-react";

const DiaryEditor = ({
  handleRevise,
  loading,
}: {
  handleRevise: (diaryValue: string) => void;
  loading: boolean;
}) => {
  const [diaryValue, setDiaryValue] = useState("");
  const handleDiaryChange = (v: string) => setDiaryValue(v);
  const isButtonDisabled = diaryValue.trim().length === 0 || loading;

  const onHandleRevise = () => {
    if (isButtonDisabled) return;
    handleRevise(diaryValue);
  };

  return (
    <div>
      <textarea
        readOnly={loading}
        name="diary"
        id="diary"
        placeholder="Write about your day in english, what you did, how you felt etc 💭"
        rows={10}
        className="w-full rounded-xl border border-gray-300 p-2 focus-within:outline-none"
        onChange={(e) => handleDiaryChange(e.target.value)}
        value={diaryValue}
      ></textarea>
      <div className="flex flex-col items-center justify-between">
        <button
          disabled={isButtonDisabled}
          className={clsx(
            "mt-2 ml-auto flex w-full items-center justify-center gap-1.5 rounded-xl border px-4 py-2 text-sm font-semibold transition-colors",
            isButtonDisabled
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
    </div>
  );
};

export default DiaryEditor;

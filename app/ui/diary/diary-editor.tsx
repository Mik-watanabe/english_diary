"use client";

import clsx from "clsx";
import { useState, useEffect } from "react";
import { MessageCircleWarning } from "lucide-react";
import { Spinner } from "@/components/ui/spinner"
import { Sparkle } from "lucide-react";

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
  const handleDiaryChange = (v: string) => setDiaryValue(v);

  useEffect(() => {
    setIsButtonDisabled(diaryValue.length === 0 || loading);
    setError("");
  }, [diaryValue, loading]);


  const onHandleRevise = () => {
    if (isButtonDisabled) return;
    if (diaryValue.trim() === "") {
      setError("Please enter your diary first");
      return;
    }
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
        className="border border-gray-300 p-2 rounded-xl w-full focus-within:outline-none"
        onChange={(e) => handleDiaryChange(e.target.value)}
        value={diaryValue}
      ></textarea>
      <div className="flex justify-between items-center">
        {error && (
          <p className="text-red-500 flex items-baseline">
            <MessageCircleWarning className="w-5 h-5 text-red-500 scale-x-[-1] inline-block mr-1" />
            {error}
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
    </div>
  );
};

export default DiaryEditor;

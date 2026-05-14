"use client";

import clsx from "clsx";
import { useState, useEffect } from "react";
import { MessageCircleWarning } from "lucide-react";
import { Spinner } from "@/components/ui/spinner"

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
    <div className="border-t border-r border-gray-300 p-2 rounded-none">
      <textarea
        readOnly={loading}
        name="diary"
        id="diary"
        placeholder="Write about your day in english, what you did, how you felt etc 💭"
        rows={10}
        className="border-none w-full focus-within:outline-none"
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
            "py-1 px-2 rounded-md ml-auto flex items-center",
            isButtonDisabled
              ? "bg-gray-300 cursor-not-allowed"
              : "bg-green-300 hover:bg-green-400  hover:cursor-pointer",
          )}
          onClick={onHandleRevise}
        >
          {loading ? <Spinner data-icon="inline-start" className="inline-block mr-2" /> : <></>}
          Revise with AI
        </button>
      </div>
    </div>
  );
};

export default DiaryEditor;

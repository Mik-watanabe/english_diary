"use client";
import React, { useState } from "react";
import { useSearchParams } from "next/navigation";
import moment from "moment";
import { highlightDiff } from "@/lib/diaryHighlight";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Correction } from "../types";
import Loading from "../loading";
import DiaryEditor from "@/app/ui/diary/diary-editor";
import { Skeleton } from "@/components/ui/skeleton";

const CreateDiaryPage = () => {
  const [revisedDiaryValue, setRevisedDiaryValue] = useState<React.ReactNode[]>(
    [],
  );
  const [loading, setLoading] = useState(false);
  const [corrections, setCorrections] = useState<Correction[]>([]);
  const searchParams = useSearchParams();
  const [alternatives, setAlternatives] = useState<string>("");
  const date = moment(searchParams.get("date")).format("MMM Do, YYYY");
  const handleRevise = async (diaryValue: string) => {
    setLoading(true);
    console.log("Revise with AI", diaryValue);
    if (diaryValue == "") return;

    // const response = await fetch("/api/revise-diary", {
    //   method: "POST",
    //   headers: {
    //     "Content-Type": "application/json",
    //   },
    //   body: JSON.stringify({
    //     originalDiary: diaryValue,
    //   }),
    // });
    // const data = await response.json();
    // console.log(data);
    // setCorrections(data.corrections);
    // const highlighted = highlightDiff(data.original, data.revised);
    // setAlternatives(data.alternatives);

    // setRevisedDiaryValue(highlighted);
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-4">English Diary - {date}</h1>
      <div className="grid grid-cols-2 border border-gray-300">
        <div>
          <h2 className="font-semibold text-center border-r border-gray-300 p-2">
            Your Diary
          </h2>
          <DiaryEditor handleRevise={handleRevise} loading={loading} />
        </div>
        <div>
          <h2 className="font-semibold text-center p-2">
            Revised Diary by AI assistant
          </h2>
          <div className="border-t border-gray-300 p-2 rounded-none">
            {loading && (
              <div className="space-y-3 p-3 animate-pulse">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            )}
            {!loading && (
              <div className="p-3 whitespace-pre-wrap">
                {revisedDiaryValue || ""}
              </div>
            )}
          </div>
        </div>
      </div>

      {revisedDiaryValue && (
        <>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Original</TableHead>
                <TableHead>Revised</TableHead>
                <TableHead>Why</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {corrections?.map((item, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{item.original}</TableCell>
                  <TableCell>{item.revised}</TableCell>
                  <TableCell>{item.why}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          <div>
            <h2 className="font-semibold text-left">Alternatives</h2>
            <div className="px-3 whitespace-pre-wrap">{alternatives}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateDiaryPage;

"use client";
import React, { useState } from "react";
import { notFound, useSearchParams } from "next/navigation";
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
import DiaryEditor from "@/app/ui/diary/diary-editor";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import SaveDialog from "@/app/ui/diary/save-diary-dialog";
import { RevisedDiaryResponse } from "@/types/diary";

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
      toast.error("Failed to revise diary. Please try again.", {
        position: "top-center",
        style: {
          "--normal-text":
            "light-dark(var(--color-red-600), var(--color-red-400))",
          "--normal-border":
            "light-dark(var(--color-red-600), var(--color-red-400))",
        } as React.CSSProperties,
      });
    } finally {
      setLoading(false);
    }
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
            {loading ? (
              <div className="space-y-3 p-3 animate-pulse">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-5/6" />
                <Skeleton className="h-4 w-2/3" />
              </div>
            ) : (
              <div className="p-3 whitespace-pre-wrap">
                {revisedDiaryValue || ""}
              </div>
            )}
          </div>
        </div>
      </div>

      <SaveDialog date={date} revisedDiaryResponse={revisedDiaryResponse} />

      {revisedDiaryValue.length > 0 && (
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
            <div className="px-3 whitespace-pre-wrap">{alternative}</div>
          </div>
        </>
      )}
    </div>
  );
};

export default CreateDiaryPage;

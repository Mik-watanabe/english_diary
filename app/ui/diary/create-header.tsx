"use client";

import { notFound, useSearchParams } from "next/navigation";
import { parseDiaryDate } from "@/lib/date";
import { DiaryPageHeader } from "./diary-page-header";

export function CreateHeader() {
  const date = parseDiaryDate(useSearchParams().get("date"));
  if (!date) {
    notFound();
  }

  return <DiaryPageHeader date={date} />;
}

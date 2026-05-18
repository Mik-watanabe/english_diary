"use client";

import { notFound, useParams } from "next/navigation";
import { parseDiaryDate } from "@/lib/date";
import { DiaryPageHeader } from "./diary-page-header";

export function DetailHeader() {
  const { slug } = useParams<{ slug: string }>();
  const date = parseDiaryDate(slug);
  if (!date) {
    notFound();
  }

  return <DiaryPageHeader date={date} />;
}

"use client";

import { DiaryHeader } from "@/app/ui/diary/header";
import moment from "moment";
import { useSearchParams } from "next/navigation";

export function DiaryCreateHeader() {
  const searchParams = useSearchParams();
  const rawDate = searchParams.get("date");
  const date =
    rawDate && moment(rawDate, "YYYY-MM-DD", true).isValid()
      ? rawDate
      : moment().format("YYYY-MM-DD");

  return <DiaryHeader date={date} />;
}

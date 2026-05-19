"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Moment } from "moment";
import { DiaryHeader } from "./header";
import { DateTitle } from "./date-title";
import { ProfileButton } from "./profile-button";
import moment from "moment";

export function DiaryPageHeader({ date }: { date: Moment }) {
  return (
    <DiaryHeader>
      <Link
        href={`/diary?month=${moment(date).format("YYYY-MM")}`}
        className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-600/80"
      >
        <ChevronLeft className="size-4" />
        Back
      </Link>

      <DateTitle date={date} />

    </DiaryHeader>
  );
}

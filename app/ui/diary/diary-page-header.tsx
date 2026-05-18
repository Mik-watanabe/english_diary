"use client";

import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import type { Moment } from "moment";
import { DiaryHeader } from "./header";
import { DateTitle } from "./date-title";
import { ProfileButton } from "./profile-button";

export function DiaryPageHeader({ date }: { date: Moment }) {
  return (
    <DiaryHeader>
      <Link
        href="/diary"
        className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-600/80"
      >
        <ChevronLeft className="size-4" />
        Back
      </Link>

      <DateTitle date={date} />

      <ProfileButton />
    </DiaryHeader>
  );
}

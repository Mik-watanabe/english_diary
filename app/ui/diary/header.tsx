"use client";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import moment from "moment";
import { ProfileButton } from "./profile-button";

export function DiaryHeader({ date }: { date: string }) {
  return (
    <header className="sticky top-0 z-50 border-b border-[#E5EDF8] bg-white backdrop-blur">
      <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
        <Link
          href="/diary"
          className="flex items-center text-sm font-semibold text-blue-600 transition-colors hover:text-blue-600/80"
        >
          <ChevronLeft className="size-4" />
          Back
        </Link>

        <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
          <h1 className="font-semibold text-slate-900 text-sm">
            {moment(date).format("MMM DD, YYYY")}
          </h1>
          <span className="text-xs text-gray-500 font-medium">
            {moment(date).format("dddd")}
          </span>
        </div>

        <ProfileButton />
      </div>
    </header>
  );
}

import { DiaryHeader } from "../ui/diary/header";
import { ProfileButton } from "../ui/diary/profile-button";
import DiaryCalendar from "../ui/diary/calendar";
import { PencilLine } from "lucide-react";

export default function CalendarPage() {
  return (
    <>
      <DiaryHeader>
        <h1 className="text-xl font-bold text-blue-600">English Diary</h1>
        <ProfileButton />
      </DiaryHeader>
      <main className="mx-auto w-full max-w-4xl px-4 py-8 pb-16">
        <DiaryCalendar />
        <p className="mt-2 text-xs text-gray-500">
          <PencilLine className="mr-1 inline-block size-3" />
          Click the day to create a new diary entry
        </p>
      </main>
    </>
  );
}

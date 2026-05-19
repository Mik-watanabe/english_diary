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
        {/* TODO: Add Toaster */}
        <DiaryCalendar />
        <p className="text-xs text-gray-500 mt-2"><PencilLine className="size-3 inline-block mr-1" />Click the day to create a new diary entry</p>
      </main>
    </>
  );
}

import Link from "next/link";

export function DiaryEmptyState({date}: {date: string}) {
  return (
    <section
      className="flex flex-col items-center justify-center min-h-[400px]"
    >
      <h2 className="text-2xl font-semibold mt-6 mb-4">No Entry for this day yet.</h2>
      <p className="text-slate-500 mt-1">Would you like to create one?</p>
      <Link
        href={`/diary/create?date=${date}`}
        className="text-sm font-semibold mt-6 bg-white inline-flex text-blue-500 border border-blue-500 hover:bg-blue-500 hover:text-white bg-white px-4 py-2 rounded-md transition-colors duration-200"
      >
        Create diary
      </Link>
    </section>
  );
}

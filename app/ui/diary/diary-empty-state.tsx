import Link from "next/link";

export function DiaryEmptyState({ date }: { date: string }) {
  return (
    <section className="flex min-h-[400px] flex-col items-center justify-center">
      <h2 className="mt-6 mb-4 text-2xl font-semibold">
        No Entry for this day yet.
      </h2>
      <p className="mt-1 text-slate-500">Would you like to create one?</p>
      <Link
        href={`/diary/create?date=${date}`}
        className="mt-6 inline-flex rounded-md border border-blue-500 bg-white px-4 py-2 text-sm font-semibold text-blue-500 transition-colors duration-200 hover:bg-blue-500 hover:text-white"
      >
        Create diary
      </Link>
    </section>
  );
}

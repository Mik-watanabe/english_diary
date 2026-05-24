import type { Moment } from "moment";

export function DateTitle({ date }: { date: Moment }) {
  return (
    <div className="absolute left-1/2 flex -translate-x-1/2 flex-col items-center justify-center">
      <h1 className="text-sm font-semibold text-slate-900">
        {date.format("MMM DD, YYYY")}
      </h1>
      <span className="text-xs font-medium text-gray-500">
        {date.format("dddd")}
      </span>
    </div>
  );
}

import type { Moment } from "moment";

export function DateTitle({ date }: { date: Moment }) {
  return (
    <div className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center justify-center">
      <h1 className="font-semibold text-slate-900 text-sm">
        {date.format("MMM DD, YYYY")}
      </h1>
      <span className="text-xs text-gray-500 font-medium">
        {date.format("dddd")}
      </span>
    </div>
  );
}

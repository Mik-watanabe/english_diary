import { parseDiaryDate } from "@/lib/date";
import type { DiaryCalendarEntry, DiaryEvent } from "@/types/diary";

/** Build react-big-calendar events in the browser's local timezone. */
export function diaryCalendarEntryToEvent(
  entry: DiaryCalendarEntry,
): DiaryEvent | null {
  const day = parseDiaryDate(entry.diaryDate);
  if (!day) return null;

  const start = day.clone().startOf("day").toDate();
  const end = day.clone().add(1, "day").startOf("day").toDate();

  return {
    title: entry.title,
    start,
    end,
    allDay: true,
  };
}

export function diaryCalendarEntriesToEvents(
  entries: DiaryCalendarEntry[],
): DiaryEvent[] {
  return entries.flatMap((entry) => {
    const event = diaryCalendarEntryToEvent(entry);
    return event ? [event] : [];
  });
}

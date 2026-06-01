import { DiaryEvent } from "@/types/diary";

export const eventCache = new Map<string, DiaryEvent[]>();

export function clearEventCache() {
  eventCache.clear();
}

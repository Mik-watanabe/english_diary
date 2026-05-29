"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import { useState, useEffect } from "react";
import {
  Calendar,
  momentLocalizer,
  type EventPropGetter,
} from "react-big-calendar";
import moment from "moment";
import { DiaryEvent } from "@/types/diary";
import { getUserDiaryTitleByMonth } from "@/app/actions/diary/read-action";
import { useRouter, useSearchParams } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { parseDiaryDate } from "@/lib/date";
import { showErrorToast } from "@/lib/show-toast";
import { eventCache } from "@/lib/diary/event-cache";

const localizer = momentLocalizer(moment);

const eventPropGetter: EventPropGetter<DiaryEvent> = () => ({
  style: {
    backgroundColor: "#3b82f6",
    border: "none",
    borderRadius: "0.5rem",
    color: "#ffffff",
    fontSize: "0.75rem",
    fontWeight: 500,
    padding: "2px 6px",
  },
});

export default function DiaryCalendar() {
  const searchParams = useSearchParams();

  const monthParam = searchParams.get("month");
  const initialMonth =
    parseDiaryDate(monthParam, "YYYY-MM")?.toDate() || new Date();

  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [month, setMonth] = useState<Date>(initialMonth);
  const [events, setEvents] = useState<DiaryEvent[]>([]);

  const fetchEvents = async (targetDate: Date): Promise<DiaryEvent[]> => {
    const from = moment(targetDate)
      .startOf("month")
      .startOf("week")
      .format("YYYY-MM-DD");
    const to = moment(targetDate)
      .endOf("month")
      .endOf("week")
      .format("YYYY-MM-DD");
    const result = await getUserDiaryTitleByMonth(from, to);
    if (!result.success) {
      throw new Error(result.message);
    }
    return result.diaryData;
  };

  useEffect(() => {
    let cancelled = false;
    async function loadEvents() {
      const monthKey = moment(month).format("YYYY-MM");
      const cachedEvents = eventCache.get(monthKey);
      if (cachedEvents) {
        setEvents(cachedEvents);
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        setEvents([]);
        const nextEvents = await fetchEvents(month);
        if (!cancelled) {
          eventCache.set(moment(month).format("YYYY-MM"), nextEvents);
          setEvents(nextEvents);
        }
      } catch (error) {
        if (!cancelled) {
          console.error(error);
          showErrorToast((error as Error).message);
        }
      } finally {
        if (!cancelled) setIsLoading(false);
      }
    }

    loadEvents();
    return () => {
      cancelled = true;
    };
  }, [month]);

  const handleSelectSlot = ({ start }: { start: Date }) => {
    const exists = events.some(
      (event) =>
        moment(event.start).format("YYYY-MM-DD") ===
        moment(start).format("YYYY-MM-DD"),
    );
    if (exists) {
      return;
    }
    router.push(`/diary/create?date=${moment(start).format("YYYY-MM-DD")}`);
  };

  const handleSelectEvent = (event: DiaryEvent) => {
    router.push(`/diary/${moment(event.start).format("YYYY-MM-DD")}`);
  };
  const handleNavigate = (date: Date) => {
    const currentKey = moment(month).format("YYYY-MM");
    const nextKey = moment(date).format("YYYY-MM");
    if (currentKey === nextKey) return;

    setMonth(date);
    router.replace(`/diary?month=${nextKey}`);
  };

  return (
    <div className="diary-calendar relative">
      <Calendar
        dayLayoutAlgorithm="no-overlap"
        localizer={localizer}
        events={isLoading ? [] : events}
        startAccessor="start"
        endAccessor="end"
        eventPropGetter={eventPropGetter}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={handleSelectEvent}
        onNavigate={handleNavigate}
        selectable
        style={{ height: 500 }}
        views={["month"]}
        date={month}
      />
      {isLoading && (
        <div
          className="absolute inset-0 z-10 flex items-center justify-center rounded-xl bg-white"
          aria-busy="true"
          aria-label="Loading calendar events"
        >
          <Spinner className="size-8 text-blue-500" />
        </div>
      )}
    </div>
  );
}

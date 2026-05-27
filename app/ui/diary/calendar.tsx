"use client";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "./calendar.css";
import { useState, useEffect, useRef } from "react";
import {
  Calendar,
  momentLocalizer,
  type EventPropGetter,
} from "react-big-calendar";
import moment from "moment";
import { DiaryEvent } from "@/types/diary";
import { getUserDiaryTitleByMonth } from "@/app/actions/diary/read-action";
import { useRouter, useSearchParams } from "next/navigation";
import { CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
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
  const eventCacheRef = useRef(eventCache);

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
      const cachedEvents = eventCacheRef.current.get(monthKey);
      if (cachedEvents) {
        console.log("there is cached events", cachedEvents);
        setEvents(cachedEvents);
        return;
      }

      try {
        setIsLoading(true);
        const nextEvents = await fetchEvents(month);
        if (!cancelled) {
          console.log("setting cached events", nextEvents);
          console.log("eventCacheRef.current", eventCacheRef.current);
          eventCacheRef.current.set(monthKey, nextEvents);
          setEvents(nextEvents);
        }
      } catch (error) {
        if (!cancelled) console.error(error);
        showErrorToast((error as Error).message);
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
      (event) => event.start.toDateString() == start.toDateString(),
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
    setMonth(date);
    router.replace(`/diary?month=${moment(date).format("YYYY-MM")}`);
  };

  if (isLoading) {
    return (
      <div>
        <CardHeader className="mb-8 flex animate-pulse flex-col items-center justify-between gap-2 px-0 md:mb-4 md:flex-row">
          <Skeleton className="h-5 w-2/4 md:w-1/4" />
          <Skeleton className="h-5 w-2/4 md:w-1/6" />
        </CardHeader>

        <CardContent className="animate-pulse p-0">
          <Skeleton className="h-[400px] w-full md:h-[450px]" />
        </CardContent>
      </div>
    );
  }

  return (
    <div className="diary-calendar">
      <Calendar
        dayLayoutAlgorithm="no-overlap"
        localizer={localizer}
        events={events}
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
    </div>
  );
}

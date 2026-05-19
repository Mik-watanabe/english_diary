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
    monthParam && moment(monthParam, "YYYY-MM", true).isValid()
      ? moment(monthParam, "YYYY-MM").toDate()
      : new Date();

  const router = useRouter();
  const [month, setMonth] = useState<Date>(initialMonth);
  const [events, setEvents] = useState<DiaryEvent[]>([]);

  //   const fetchEvents = async (targetDate: Date) => {
  //     const from = moment(targetDate)
  //       .startOf("month")
  //       .startOf("week")
  //       .format("YYYY-MM-DD");
  //     const to = moment(targetDate)
  //       .endOf("month")
  //       .endOf("week")
  //       .format("YYYY-MM-DD");

  //     const result = await getUserDiaryTitleByMonth(from, to);
  //     if (result.success) {
  //       setEvents(result.diaryData);
  //     } else {
  //       console.error(result.message);
  //     }
  //   };

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
    (async () => {
      try {
        const nextEvents = await fetchEvents(month);
        if (!cancelled) setEvents(nextEvents);
      } catch (error) {
        if (!cancelled) console.error(error);
      }
    })();
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

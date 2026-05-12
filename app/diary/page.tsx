"use client";

import React, { useCallback, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Calendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";

const localizer = momentLocalizer(moment);

export default function CalendarPage() {

    const router = useRouter();
    const events = [
        {
            title: "Went to a cafe ☕",
            start: new Date(2026, 4, 2),
            end: new Date(2026, 4, 2),
            allDay: true,
          }
    ];
  const [myEvents, setEvents] = useState(events);

  const handleSelectSlot = useCallback(
    ({ start }: { start: Date; }) => {
        const exists = myEvents.some(event =>
            event.start.toDateString() == start.toDateString()
        );

        if (exists) {
            return;
        }

        router.push(`/diary/create?date=${moment(start).format("YYYY-MM-DD")}`);
    
    },
    [setEvents],
  );

  const handleSelectEvent = useCallback(
    (event: { title: string }) => window.alert(event.title),
    [],
  );
  return (
    <Calendar
      dayLayoutAlgorithm="no-overlap"
      localizer={localizer}
      events={myEvents}
      startAccessor="start"
      endAccessor="end"
      onSelectSlot={handleSelectSlot}
      onSelectEvent={handleSelectEvent}
      selectable
      style={{ height: 500 }}
      views={["month"]}
    />
  );
}

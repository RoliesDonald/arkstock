"use client";
import { Separator } from "@radix-ui/react-dropdown-menu";
import Image from "next/image";
import React, { useState } from "react";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";

type ValuePiece = Date | null;
type Value = ValuePiece | [ValuePiece, ValuePiece];

const events = [
  {
    id: 1,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    title: "Lorem ipsum dolor",
    time: "12:00 PM - 2:00 PM",
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];

const CalendarSchedule = () => {
  const [Value, onChange] = useState<Value>(new Date());
  return (
    <div className="p-2 bg-arkBg-50 rounded-xl w-full">
      <div className="rounded-xl w-full  shadow-md bg-arkBg-100 border-t-2 mb-10">
        <Calendar onChange={onChange} value={Value} />
      </div>
      <h1 className="text-slate-500 font-semibold my-4">Detail Schedule</h1>
      <div className="flex flex-col gap-4 ">
        {events.map((event) => (
          <div
            className="p-5 rounded-md border-2 border-arkBlue-50 bg-arkBlue-50 border-t-4 "
            key={event.id}
          >
            <div className="flex items-center justify-between">
              <h1 className="font-semibold text-gray-600">{event.title}</h1>
              <span className="text-gray-300 text-xs">{event.time}</span>
            </div>
            <p className="mt-2 text-gray-400 text-sm">{event.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CalendarSchedule;

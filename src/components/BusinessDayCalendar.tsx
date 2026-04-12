"use client";

import { isBusinessDay } from "@/lib/business-days";
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  getDay,
  isSameDay,
  isAfter,
  isBefore,
  addMonths,
} from "date-fns";
import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BusinessDayCalendarProps {
  submissionDate: Date;
  thresholdDate: Date;
  holidays: string[];
  today?: Date;
}

export function BusinessDayCalendar({
  submissionDate,
  thresholdDate,
  holidays,
  today = new Date(),
}: BusinessDayCalendarProps) {
  const [currentMonth, setCurrentMonth] = useState(today);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startDayOfWeek = getDay(monthStart);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, -1))}
          className="p-1.5 hover:bg-sand-dark rounded-lg transition-colors"
        >
          <ChevronLeft className="h-4 w-4 text-muted-foreground" />
        </button>
        <h3 className="text-sm font-semibold">
          {format(currentMonth, "MMMM yyyy")}
        </h3>
        <button
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
          className="p-1.5 hover:bg-sand-dark rounded-lg transition-colors"
        >
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-0.5 text-center text-xs">
        {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
          <div key={d} className="py-1.5 font-medium text-muted-foreground/60 text-[10px] uppercase tracking-wider">
            {d}
          </div>
        ))}

        {Array.from({ length: startDayOfWeek }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {days.map((day) => {
          const isBiz = isBusinessDay(day, holidays);
          const isHoliday = holidays.includes(format(day, "yyyy-MM-dd"));
          const isToday = isSameDay(day, today);
          const isSubmission = isSameDay(day, submissionDate);
          const isThreshold = isSameDay(day, thresholdDate);
          const isInRange =
            (isAfter(day, submissionDate) && isBefore(day, thresholdDate)) || isThreshold;

          let className = "py-1.5 rounded-md text-xs transition-colors relative ";
          if (isSubmission) {
            className += "bg-terracotta text-white font-bold shadow-sm";
          } else if (isThreshold) {
            className += "bg-olive text-white font-bold shadow-sm";
          } else if (isToday) {
            className += "ring-2 ring-terracotta ring-offset-1 font-bold";
          } else if (isHoliday) {
            className += "bg-terracotta/10 text-terracotta";
          } else if (!isBiz) {
            className += "text-muted-foreground/30";
          } else if (isInRange) {
            className += "bg-amber-soft/60 text-foreground";
          } else {
            className += "text-muted-foreground hover:bg-sand-dark";
          }

          return (
            <div key={day.toISOString()} className={className}>
              {format(day, "d")}
            </div>
          );
        })}
      </div>

      <div className="flex flex-wrap gap-x-4 gap-y-1.5 text-[10px] text-muted-foreground pt-1">
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded bg-terracotta" /> Submitted
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded bg-olive" /> Day 20
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded bg-terracotta/10 border border-terracotta/20" /> Holiday
        </span>
        <span className="flex items-center gap-1.5">
          <span className="inline-block w-2.5 h-2.5 rounded ring-2 ring-terracotta" /> Today
        </span>
      </div>
    </div>
  );
}

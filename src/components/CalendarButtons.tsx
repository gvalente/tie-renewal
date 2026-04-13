"use client";

import { Calendar, Download, ExternalLink } from "lucide-react";
import {
  googleCalendarUrl,
  generateIcs,
  downloadIcs,
  type CalendarEvent,
} from "@/lib/calendar";

type Props = {
  events: CalendarEvent[];
  /** Used as the .ics filename (without extension) */
  filename: string;
  /** Layout: "row" = all buttons in one horizontal row; "stack" = one Google button per event + one bulk .ics export */
  layout?: "row" | "stack";
};

/**
 * Unobtrusive calendar export buttons.
 * - "row" layout: single Google Calendar button (first event) + .ics export for all events.
 * - "stack" layout: one Google Calendar link per event + one .ics export for all events.
 */
export function CalendarButtons({ events, filename, layout = "row" }: Props) {
  if (!events.length) return null;

  const handleDownload = () => {
    downloadIcs(filename, generateIcs(events));
  };

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mr-1">
        <Calendar className="h-3.5 w-3.5" />
        Add to calendar:
      </span>

      {layout === "stack" ? (
        /* One Google Calendar link per event */
        events.map((event) => (
          <a
            key={event.title}
            href={googleCalendarUrl(event.title, event.date, event.description)}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-border bg-card hover:border-terracotta/40 hover:text-terracotta transition-colors text-muted-foreground"
          >
            {event.title}
            <ExternalLink className="h-3 w-3 shrink-0" />
          </a>
        ))
      ) : (
        /* Single Google Calendar link for the first event */
        <a
          href={googleCalendarUrl(
            events[0].title,
            events[0].date,
            events[0].description
          )}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-border bg-card hover:border-terracotta/40 hover:text-terracotta transition-colors text-muted-foreground"
        >
          Google Calendar
          <ExternalLink className="h-3 w-3 shrink-0" />
        </a>
      )}

      <button
        onClick={handleDownload}
        className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md border border-border bg-card hover:border-terracotta/40 hover:text-terracotta transition-colors text-muted-foreground cursor-pointer"
      >
        <Download className="h-3 w-3" />
        Export .ics
      </button>
    </div>
  );
}

/**
 * Calendar utilities — Google Calendar URL builder and .ics file generator.
 * No external dependencies; pure string formatting (RFC 5545).
 */

export type CalendarEvent = {
  title: string;
  /** YYYY-MM-DD — all-day events only */
  date: string;
  description?: string;
};

/** Format a YYYY-MM-DD date string as a YYYYMMDD Google Calendar date param. */
function toGcalDate(dateStr: string): string {
  return dateStr.replace(/-/g, "");
}

/**
 * Build a prefilled Google Calendar "add event" URL.
 * Uses a single all-day date (same start and end, per Google's convention).
 */
export function googleCalendarUrl(
  title: string,
  date: string,
  description: string = ""
): string {
  const d = toGcalDate(date);
  // Google Calendar all-day: dates=YYYYMMDD/YYYYMMDD (end = same day)
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: title,
    dates: `${d}/${d}`,
    details: description,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

/** Escape special characters in iCalendar text values. */
function icsEscape(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

/**
 * Generate an RFC 5545-compliant .ics string for one or more all-day events.
 */
export function generateIcs(events: CalendarEvent[]): string {
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//RenewMyTIE//TIE Renewal Dates//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
  ];

  for (const event of events) {
    const d = toGcalDate(event.date);
    // All-day events: DTSTART;VALUE=DATE and DTEND is the next day
    const dtstart = d;
    const dtend = toGcalDate(nextDay(event.date));
    const uid = `${d}-${slugify(event.title)}@renewmytie.app`;

    lines.push(
      "BEGIN:VEVENT",
      `DTSTART;VALUE=DATE:${dtstart}`,
      `DTEND;VALUE=DATE:${dtend}`,
      `SUMMARY:${icsEscape(event.title)}`,
      event.description
        ? `DESCRIPTION:${icsEscape(event.description)}`
        : "DESCRIPTION:",
      `UID:${uid}`,
      "END:VEVENT"
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}

/** Trigger a browser download of an .ics file. Client-side only. */
export function downloadIcs(filename: string, icsContent: string): void {
  const blob = new Blob([icsContent], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename.endsWith(".ics") ? filename : `${filename}.ics`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/** Add one calendar day to a YYYY-MM-DD date string. */
function nextDay(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  d.setDate(d.getDate() + 1);
  return d.toISOString().slice(0, 10);
}

function slugify(text: string): string {
  return text.toLowerCase().replace(/\s+/g, "-").replace(/[^a-z0-9-]/g, "");
}

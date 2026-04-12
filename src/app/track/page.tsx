"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { getExpiryDates, type ExpiryDates } from "@/lib/business-days";
import { THRESHOLDS } from "@/lib/constants";
import { format, differenceInDays } from "date-fns";
import {
  CalendarDays,
  AlertTriangle,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";

const phaseConfig: Record<
  ExpiryDates["phase"],
  {
    label: string;
    color: string;
    bg: string;
    border: string;
    icon: typeof Clock;
    message: string;
  }
> = {
  too_early: {
    label: "Too early to renew",
    color: "text-clay",
    bg: "bg-sand-dark/50",
    border: "border-border",
    icon: Clock,
    message:
      "Your renewal window hasn't opened yet. You can start the process 60 days before your TIE expires. We'll help you prepare in the meantime.",
  },
  window_open: {
    label: "Renewal window is open!",
    color: "text-olive",
    bg: "bg-olive-light/15",
    border: "border-olive-light/30",
    icon: CheckCircle,
    message:
      "Great timing! Your renewal window is open. This is the ideal time to start — no rush, no stress.",
  },
  urgent: {
    label: "Renew now",
    color: "text-terracotta",
    bg: "bg-terracotta/8",
    border: "border-terracotta/20",
    icon: AlertTriangle,
    message:
      "Your TIE expires very soon. Start your renewal immediately to avoid filing after expiry, which may result in a fine.",
  },
  expired_can_file: {
    label: "Expired — still time to file",
    color: "text-terracotta-dark",
    bg: "bg-terracotta/10",
    border: "border-terracotta/25",
    icon: AlertTriangle,
    message:
      "Your TIE has expired, but you can still file within 90 days of expiry. Be aware this may result in a fine (sanción). File as soon as possible.",
  },
  expired_too_late: {
    label: "Filing deadline passed",
    color: "text-red-800",
    bg: "bg-red-50",
    border: "border-red-200",
    icon: XCircle,
    message:
      "The 90-day late filing deadline has passed. You may need to apply for a new permit. We strongly recommend consulting an immigration lawyer.",
  },
};

export default function TrackPage() {
  const [expiryDate, setExpiryDate] = useState("");
  const [result, setResult] = useState<ExpiryDates | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!expiryDate) return;
    const dates = getExpiryDates(new Date(expiryDate + "T00:00:00"));
    setResult(dates);
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="warm-gradient texture-overlay border-b border-border/40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-warm/20 text-amber-700 text-sm font-medium">
            <CalendarDays className="h-3.5 w-3.5" />
            Know your dates
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            TIE Expiry Tracker
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Enter your TIE expiry date to see your key renewal dates and know
            exactly when to act.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8 w-full">
        {/* Form */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-amber-warm/20 flex items-center justify-center">
              <CalendarDays className="h-4.5 w-4.5 text-amber-700" />
            </div>
            <div>
              <h2 className="font-semibold">Your TIE Details</h2>
              <p className="text-xs text-muted-foreground">
                Find your expiry date on the front of your TIE card
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="expiryDate" className="text-sm font-medium">TIE Expiry Date</Label>
              <Input
                id="expiryDate"
                type="date"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                required
                className="bg-background"
              />
            </div>
            <Button type="submit" className="w-full bg-terracotta hover:bg-terracotta-dark text-white h-11">
              <CalendarDays className="h-4 w-4 mr-2" />
              Show My Timeline
            </Button>
          </form>
        </div>

        {result && <ExpiryResult dates={result} />}
      </div>
    </div>
  );
}

function ExpiryResult({ dates }: { dates: ExpiryDates }) {
  const config = phaseConfig[dates.phase];
  const today = new Date();

  const timelineEvents = [
    {
      date: dates.renewalWindowOpens,
      label: "Renewal window opens",
      description: `${THRESHOLDS.RENEWAL_WINDOW_DAYS} days before expiry — earliest you can file`,
      isPast: today >= dates.renewalWindowOpens,
      color: "bg-olive",
    },
    {
      date: dates.expiryDate,
      label: "TIE expires",
      description: "File before this date to avoid potential fines",
      isPast: today >= dates.expiryDate,
      color: "bg-terracotta",
    },
    {
      date: dates.lateDeadline,
      label: "Late filing deadline",
      description: `${THRESHOLDS.LATE_FILING_DAYS} days after expiry — absolute last chance to file`,
      isPast: today >= dates.lateDeadline,
      color: "bg-espresso",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-300">
      {/* Status banner */}
      <div className={`rounded-xl border ${config.border} ${config.bg} p-5`}>
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-lg bg-white/60 flex items-center justify-center shrink-0">
            <config.icon className={`h-5 w-5 ${config.color}`} />
          </div>
          <div className="space-y-1.5">
            <div className="flex flex-wrap items-center gap-2">
              <p className={`font-semibold ${config.color}`}>{config.label}</p>
              <Badge variant="outline" className={`${config.color} border-current/20 text-xs`}>
                {dates.daysUntilExpiry > 0
                  ? `${dates.daysUntilExpiry} days until expiry`
                  : `Expired ${Math.abs(dates.daysUntilExpiry)} days ago`}
              </Badge>
            </div>
            <p className={`text-sm leading-relaxed ${config.color} opacity-80`}>
              {config.message}
            </p>
          </div>
        </div>
      </div>

      {/* Timeline */}
      <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm">
        <h2 className="text-lg font-semibold mb-5 flex items-center gap-2">
          <span className="w-1.5 h-5 rounded-full bg-terracotta" />
          Key Dates
        </h2>

        <div className="space-y-0">
          {timelineEvents.map((event, i) => {
            const daysFromNow = differenceInDays(event.date, today);
            return (
              <div key={i} className="flex gap-4">
                {/* Timeline dot + line */}
                <div className="flex flex-col items-center">
                  <div
                    className={`w-3 h-3 rounded-full border-2 shrink-0 ${
                      event.isPast
                        ? `${event.color} border-transparent`
                        : "bg-card border-muted-foreground/30"
                    }`}
                  />
                  {i < timelineEvents.length - 1 && (
                    <div className="w-0.5 flex-1 bg-border min-h-14" />
                  )}
                </div>
                {/* Content */}
                <div className="pb-6 -mt-0.5">
                  <p className="text-sm font-semibold">{event.label}</p>
                  <p className="text-sm text-muted-foreground mt-0.5">
                    {format(event.date, "EEEE, MMMM d, yyyy")}
                    {daysFromNow > 0 && (
                      <span className="ml-2 text-xs text-terracotta font-medium">
                        ({daysFromNow} days from now)
                      </span>
                    )}
                    {daysFromNow < 0 && (
                      <span className="ml-2 text-xs text-muted-foreground">
                        ({Math.abs(daysFromNow)} days ago)
                      </span>
                    )}
                    {daysFromNow === 0 && (
                      <span className="ml-2 text-xs text-terracotta font-bold">
                        (today!)
                      </span>
                    )}
                  </p>
                  <p className="text-xs text-muted-foreground/70 mt-1">
                    {event.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* CTAs */}
      {(dates.phase === "window_open" || dates.phase === "urgent") && (
        <div className="flex gap-3">
          <a href="/renew" className="flex-1">
            <Button className="w-full bg-terracotta hover:bg-terracotta-dark text-white h-11">
              Start Renewal Guide
            </Button>
          </a>
          <a href="/status" className="flex-1">
            <Button variant="outline" className="w-full h-11 border-terracotta/30 text-terracotta hover:bg-terracotta/5">
              Already Applied?
            </Button>
          </a>
        </div>
      )}
    </div>
  );
}

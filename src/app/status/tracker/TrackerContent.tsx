"use client";

import { Timeline } from "@/components/Timeline";
import { BusinessDayCalendar } from "@/components/BusinessDayCalendar";
import { QuickLinks } from "@/components/QuickLinks";
import { SilencioGuide } from "@/components/SilencioGuide";
import { StatusBadge } from "@/components/StatusBadge";
import { StatusLog } from "@/components/StatusLog";
import { getTimelineStatus } from "@/lib/business-days";
import { SPANISH_HOLIDAYS } from "@/lib/holidays";
import { STATUSES } from "@/lib/constants";
import { format } from "date-fns";
import { ArrowLeft, Hash, Calendar, ArrowRight } from "lucide-react";

type SavedCheck = {
  id: string;
  checked_at: string;
  check_method: string;
  status_found: string;
};

type Props = {
  registro: string;
  dateStr: string;
  appId: string | null;
  savedChecks: SavedCheck[];
};

export function TrackerContent({ registro, dateStr, appId, savedChecks }: Props) {
  if (!registro || !dateStr) {
    return (
      <div className="text-center py-16 space-y-3">
        <p className="text-muted-foreground">Missing application details.</p>
        <a href="/status" className="text-sm text-terracotta underline underline-offset-2">
          Go back and enter your details
        </a>
      </div>
    );
  }

  const submissionDate = new Date(dateStr + "T00:00:00");
  const today = new Date();
  const status = getTimelineStatus(submissionDate, SPANISH_HOLIDAYS, today);

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="warm-gradient texture-overlay border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10">
          <a
            href="/status"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-terracotta transition-colors mb-4"
          >
            <ArrowLeft className="h-3.5 w-3.5" /> Back
          </a>

          <div className="flex items-start justify-between gap-4">
            <div className="space-y-2">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
                Status Tracker
              </h1>
              <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
                <span className="inline-flex items-center gap-1.5 font-mono bg-card px-2.5 py-1 rounded-md border border-border/60">
                  <Hash className="h-3 w-3 text-terracotta" />
                  {registro}
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5 text-terracotta" />
                  Submitted {format(submissionDate, "MMMM d, yyyy")}
                </span>
              </div>
              {appId && (
                <p className="text-xs text-olive flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-olive inline-block" />
                  Saved to your account
                </p>
              )}
            </div>
            <StatusBadge
              status={
                status.isPastThreshold
                  ? STATUSES.SILENCIO_POSITIVO
                  : STATUSES.EN_TRAMITE
              }
            />
          </div>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full">
        {/* Timeline */}
        <div className="rounded-xl border border-border bg-card p-5 sm:p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-terracotta" />
            20-Day Business Day Countdown
          </h2>
          <Timeline status={status} submissionDate={submissionDate} />
        </div>

        {/* Silencio guide if past threshold */}
        {status.isPastThreshold && (
          <>
            <SilencioGuide />
            <a
              href="/guide/silencio"
              className="inline-flex items-center gap-1.5 text-sm text-terracotta hover:text-terracotta-dark font-medium transition-colors"
            >
              Full silencio administrativo guide <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </>
        )}

        {/* Calendar + Quick Links / Status Log */}
        <div className="grid gap-6 md:grid-cols-2">
          <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
            <h2 className="text-sm font-semibold mb-4 flex items-center gap-2">
              <span className="w-1 h-4 rounded-full bg-amber-warm" />
              Business Day Calendar
            </h2>
            <BusinessDayCalendar
              submissionDate={submissionDate}
              thresholdDate={status.thresholdDate}
              holidays={SPANISH_HOLIDAYS}
              today={today}
            />
          </div>

          <div className="space-y-6">
            <QuickLinks />
            <StatusLog applicationId={appId} initialChecks={savedChecks} />
          </div>
        </div>
      </div>
    </div>
  );
}

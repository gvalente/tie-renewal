"use client";

import { Progress } from "@/components/ui/progress";
import { type TimelineStatus } from "@/lib/business-days";
import { format } from "date-fns";
import { Clock, AlertTriangle, Zap, CheckCircle } from "lucide-react";

const urgencyConfig = {
  normal: {
    color: "text-olive",
    bg: "bg-olive-light/20",
    border: "border-olive-light/40",
    icon: Clock,
    message: "Your application is being processed. This is normal — sit tight.",
  },
  approaching: {
    color: "text-amber-700",
    bg: "bg-amber-soft/50",
    border: "border-amber-warm/40",
    icon: AlertTriangle,
    message: "Getting close to the 20-day threshold. Keep an eye on your status.",
  },
  threshold: {
    color: "text-terracotta",
    bg: "bg-terracotta-light/15",
    border: "border-terracotta-light/40",
    icon: Zap,
    message: "Almost at the 20-day threshold! Check your status now.",
  },
  past: {
    color: "text-olive",
    bg: "bg-olive-light/15",
    border: "border-olive-light/40",
    icon: CheckCircle,
    message: "Past the 20-day threshold. If no requerimiento was issued, your renewal should be approved via silencio administrativo positivo.",
  },
};

export function Timeline({
  status,
  submissionDate,
}: {
  status: TimelineStatus;
  submissionDate: Date;
}) {
  const config = urgencyConfig[status.urgency];
  const Icon = config.icon;

  return (
    <div className="space-y-5">
      {/* Big number */}
      <div className="flex items-baseline gap-3">
        <span className="text-4xl font-bold text-foreground tabular-nums">
          {status.businessDaysElapsed}
        </span>
        <span className="text-muted-foreground text-sm">
          of 20 business days elapsed
        </span>
      </div>

      {/* Progress bar */}
      <div className="space-y-2">
        <div className="h-3 bg-sand-dark rounded-full overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-700 ease-out"
            style={{
              width: `${status.percentComplete}%`,
              background: status.isPastThreshold
                ? 'linear-gradient(90deg, oklch(0.55 0.08 140), oklch(0.62 0.10 140))'
                : status.urgency === 'threshold'
                ? 'linear-gradient(90deg, oklch(0.58 0.14 35), oklch(0.65 0.16 30))'
                : status.urgency === 'approaching'
                ? 'linear-gradient(90deg, oklch(0.75 0.12 75), oklch(0.82 0.12 75))'
                : 'linear-gradient(90deg, oklch(0.52 0.14 32), oklch(0.58 0.14 35))',
            }}
          />
        </div>
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>Submitted {format(submissionDate, "MMM d, yyyy")}</span>
          <span className={config.color}>
            {status.businessDaysRemaining > 0
              ? `${status.businessDaysRemaining} business days remaining`
              : "Threshold reached"}
          </span>
        </div>
        <div className="text-xs text-muted-foreground/70">
          Day 20 falls on <strong>{format(status.thresholdDate, "EEEE, MMMM d, yyyy")}</strong>
        </div>
      </div>

      {/* Status message */}
      <div className={`rounded-lg border p-4 ${config.bg} ${config.border}`}>
        <div className="flex items-start gap-3">
          <Icon className={`h-5 w-5 mt-0.5 shrink-0 ${config.color}`} />
          <p className={`text-sm leading-relaxed ${config.color}`}>
            {config.message}
          </p>
        </div>
      </div>
    </div>
  );
}

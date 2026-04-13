"use client";

import { useState, useTransition } from "react";
import { Bell } from "lucide-react";
import { updateNotifyPreference } from "@/app/actions/applications";

type NotifyField =
  | "notify_90_days"
  | "notify_60_days"
  | "notify_30_days"
  | "notify_14_days"
  | "notify_7_days";

type Props = {
  recordId: string;
  initial: Record<NotifyField, boolean>;
};

const THRESHOLDS: { field: NotifyField; label: string }[] = [
  { field: "notify_90_days", label: "90d" },
  { field: "notify_60_days", label: "60d" },
  { field: "notify_30_days", label: "30d" },
  { field: "notify_14_days", label: "14d" },
  { field: "notify_7_days",  label: "7d"  },
];

export function NotifyToggles({ recordId, initial }: Props) {
  const [prefs, setPrefs] = useState(initial);
  const [pending, startTransition] = useTransition();

  function toggle(field: NotifyField) {
    const next = !prefs[field];
    setPrefs((p) => ({ ...p, [field]: next }));
    startTransition(async () => {
      const result = await updateNotifyPreference(recordId, field, next);
      if (result.error) {
        // Roll back optimistic update on failure
        setPrefs((p) => ({ ...p, [field]: !next }));
      }
    });
  }

  return (
    <div className="flex flex-wrap items-center gap-2 text-sm">
      <span className="text-xs text-muted-foreground font-medium flex items-center gap-1 mr-1">
        <Bell className="h-3.5 w-3.5" />
        Email reminders:
      </span>
      {THRESHOLDS.map(({ field, label }) => {
        const on = prefs[field];
        return (
          <button
            key={field}
            type="button"
            onClick={() => toggle(field)}
            disabled={pending}
            aria-pressed={on}
            aria-label={`${on ? "Disable" : "Enable"} ${label} reminder`}
            className={`text-xs px-2.5 py-1 rounded-md border transition-colors cursor-pointer disabled:opacity-60 ${
              on
                ? "bg-olive-light/20 border-olive/40 text-olive font-medium"
                : "bg-card border-border text-muted-foreground hover:border-border/80"
            }`}
          >
            {label}
          </button>
        );
      })}
      <span className="text-xs text-muted-foreground/60 hidden sm:inline">
        — before expiry
      </span>
    </div>
  );
}

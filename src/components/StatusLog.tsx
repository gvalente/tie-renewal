"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { Plus, X, Lock, Sparkles } from "lucide-react";
import { saveStatusCheck } from "@/app/actions/applications";

type LogEntry = {
  id: string;
  date: Date;
  status: string;
  method: string;
};

const statusOptions = [
  { value: "en_tramite", label: "Still in process", sublabel: "En trámite" },
  { value: "requerido", label: "Documents requested", sublabel: "Requerido" },
  { value: "resuelto_favorable", label: "Approved!", sublabel: "Resuelto favorable" },
  { value: "resuelto_no_favorable", label: "Denied", sublabel: "Resuelto no favorable" },
];

const methodOptions = [
  { value: "portal", label: "Portal" },
  { value: "infoext2", label: "infoext2" },
  { value: "sms", label: "SMS" },
  { value: "phone", label: "Phone" },
];

type SavedCheck = {
  id: string;
  checked_at: string;
  check_method: string;
  status_found: string;
};

type Props = {
  applicationId?: string | null;
  initialChecks?: SavedCheck[];
  isPro?: boolean;
};

export function StatusLog({ applicationId, initialChecks = [], isPro = false }: Props) {
  const [entries, setEntries] = useState<LogEntry[]>(
    initialChecks.map((c) => ({
      id: c.id,
      date: new Date(c.checked_at),
      status: c.status_found,
      method: c.check_method,
    }))
  );
  const [showForm, setShowForm] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState("");
  const [selectedMethod, setSelectedMethod] = useState("");
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  async function addEntry() {
    if (!selectedStatus || !selectedMethod) return;

    setSaving(true);
    setSaveError(null);
    const newEntry: LogEntry = {
      id: Date.now().toString(),
      date: new Date(),
      status: selectedStatus,
      method: selectedMethod,
    };

    // Persist to DB if we have an applicationId
    if (applicationId) {
      const result = await saveStatusCheck(applicationId, selectedStatus, selectedMethod);
      if (result.error) {
        setSaveError("Couldn't save to your account — logged locally only.");
      }
    }

    setEntries([newEntry, ...entries]);
    setSelectedStatus("");
    setSelectedMethod("");
    setShowForm(false);
    setSaving(false);
  }

  // Pro gate: show upgrade CTA if not Pro and trying to save
  if (!isPro && applicationId) {
    return (
      <div className="rounded-xl border border-terracotta/30 bg-card p-5 shadow-sm space-y-3">
        <div className="flex items-center gap-2">
          <Lock className="h-4 w-4 text-terracotta" />
          <h3 className="text-sm font-semibold">Status Check Log</h3>
          <span className="text-xs text-terracotta font-medium">Pro</span>
        </div>
        <p className="text-xs text-muted-foreground leading-relaxed">
          Upgrade to Pro to save your status checks over time and get email alerts when your
          application status changes.
        </p>
        <a href="/pricing">
          <Button size="sm" className="bg-terracotta hover:bg-terracotta-dark text-white">
            <Sparkles className="h-3.5 w-3.5 mr-1.5" />
            Upgrade to Pro — $20
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-semibold flex items-center gap-2">
          <span className="w-1 h-4 rounded-full bg-olive" />
          Status Check Log
          {applicationId && (
            <span className="text-xs text-olive/70 font-normal">(saved)</span>
          )}
        </h3>
        <button
          onClick={() => setShowForm(!showForm)}
          className="inline-flex items-center gap-1.5 text-xs text-terracotta hover:text-terracotta-dark font-medium transition-colors"
        >
          {showForm ? (
            <>
              <X className="h-3 w-3" /> Cancel
            </>
          ) : (
            <>
              <Plus className="h-3 w-3" /> Log a check
            </>
          )}
        </button>
      </div>

      {showForm && (
        <div className="space-y-3 bg-sand/80 rounded-lg p-4 mb-3 border border-border/50">
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">What did you see?</p>
            <div className="grid grid-cols-2 gap-1.5">
              {statusOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedStatus(opt.value)}
                  className={`text-left p-2.5 rounded-lg border text-xs transition-all ${
                    selectedStatus === opt.value
                      ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta/30"
                      : "border-border hover:border-terracotta/30 hover:bg-card"
                  }`}
                >
                  <span className="font-medium block">{opt.label}</span>
                  <span className="text-muted-foreground text-xs">{opt.sublabel}</span>
                </button>
              ))}
            </div>
          </div>
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground">How did you check?</p>
            <div className="flex gap-1.5">
              {methodOptions.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => setSelectedMethod(opt.value)}
                  className={`text-xs px-3 py-1.5 rounded-lg border transition-all ${
                    selectedMethod === opt.value
                      ? "border-terracotta bg-terracotta/5 ring-1 ring-terracotta/30"
                      : "border-border hover:border-terracotta/30"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          <Button
            size="sm"
            onClick={addEntry}
            disabled={!selectedStatus || !selectedMethod || saving}
            className="w-full bg-terracotta hover:bg-terracotta-dark text-white"
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </div>
      )}

      {saveError && (
        <p role="alert" className="text-xs text-destructive bg-destructive/10 px-3 py-2 rounded-lg mb-2">
          {saveError}
        </p>
      )}

      {entries.length === 0 && !showForm && (
        <p className="text-xs text-muted-foreground py-2">
          No status checks logged yet. Log each time you check the portal to keep a record.
        </p>
      )}

      <div className="space-y-0">
        {entries.map((entry) => (
          <div
            key={entry.id}
            className="flex justify-between items-center text-xs py-2.5 border-b border-border/40 last:border-0"
          >
            <div className="space-y-0.5">
              <span className="font-medium">
                {statusOptions.find((s) => s.value === entry.status)?.label ?? entry.status}
              </span>
              <span className="text-muted-foreground block text-xs">
                via {entry.method}
              </span>
            </div>
            <span className="text-muted-foreground text-xs">
              {format(entry.date, "MMM d, HH:mm")}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

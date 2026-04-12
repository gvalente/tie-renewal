"use client";

import { useState } from "react";
import { Checkbox } from "@/components/ui/checkbox";
import { REQUIRED_DOCUMENTS } from "@/lib/constants";
import { FileText, PartyPopper } from "lucide-react";

export function DocumentChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const completedCount = Object.values(checked).filter(Boolean).length;
  const total = REQUIRED_DOCUMENTS.length;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold">Document Checklist</h3>
        <span className="text-xs font-medium text-muted-foreground bg-sand-dark px-2 py-0.5 rounded-full">
          {completedCount} of {total} ready
        </span>
      </div>

      {/* Progress */}
      <div className="h-2 bg-sand-dark rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-terracotta to-terracotta-light rounded-full transition-all duration-500 ease-out"
          style={{ width: `${(completedCount / total) * 100}%` }}
        />
      </div>

      <div className="space-y-2">
        {REQUIRED_DOCUMENTS.map((doc, i) => (
          <label
            key={doc.id}
            className={`flex items-start gap-3 p-4 rounded-xl border cursor-pointer transition-all duration-200 ${
              checked[doc.id]
                ? "bg-olive-light/10 border-olive-light/30"
                : "bg-card border-border hover:border-terracotta/30 hover:bg-amber-soft/20"
            }`}
          >
            <Checkbox
              checked={checked[doc.id] || false}
              onCheckedChange={(val) =>
                setChecked({ ...checked, [doc.id]: !!val })
              }
              className="mt-0.5 data-[state=checked]:bg-olive data-[state=checked]:border-olive"
            />
            <div className="space-y-0.5 flex-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground/50 font-mono w-4">{i + 1}.</span>
                <FileText className="h-3.5 w-3.5 text-muted-foreground/50" />
                <span
                  className={`text-sm font-medium transition-colors ${
                    checked[doc.id] ? "line-through text-muted-foreground" : ""
                  }`}
                >
                  {doc.label}
                </span>
              </div>
              <p className="text-xs text-muted-foreground ml-6">{doc.description}</p>
            </div>
          </label>
        ))}
      </div>

      {completedCount === total && (
        <div className="flex items-center gap-2 text-sm text-olive font-medium bg-olive-light/15 p-3 rounded-lg">
          <PartyPopper className="h-4 w-4" />
          All documents ready! You&apos;re set to submit.
        </div>
      )}

      <p className="text-xs text-muted-foreground/70 italic text-center pt-1">
        That&apos;s really all you need &mdash; simpler than most guides say!
      </p>
    </div>
  );
}

"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Trash2, Loader2 } from "lucide-react";
import { deleteApplication, deleteTIERecord } from "@/app/actions/applications";

type Props = {
  id: string;
  kind: "application" | "tie";
  label?: string;
};

export function DeleteButton({ id, kind, label = "Delete" }: Props) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!confirming) {
      setConfirming(true);
      setTimeout(() => setConfirming(false), 3000);
      return;
    }

    setError(null);
    startTransition(async () => {
      const action = kind === "application" ? deleteApplication : deleteTIERecord;
      const res = await action(id);
      if (res.error) {
        setError(res.error);
        setConfirming(false);
        return;
      }
      router.refresh();
    });
  }

  return (
    <div className="flex flex-col items-end gap-1">
      <button
        type="button"
        onClick={handleClick}
        disabled={pending}
        aria-label={label}
        className={`inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-md border transition-colors shrink-0 ${
          confirming
            ? "border-destructive/50 bg-destructive/10 text-destructive hover:bg-destructive/15"
            : "border-border text-muted-foreground hover:text-destructive hover:border-destructive/30 hover:bg-destructive/5"
        }`}
      >
        {pending ? (
          <Loader2 className="h-3 w-3 animate-spin" />
        ) : (
          <Trash2 className="h-3 w-3" />
        )}
        {confirming ? "Click again to confirm" : label}
      </button>
      {error && (
        <span className="text-[11px] text-destructive">{error}</span>
      )}
    </div>
  );
}

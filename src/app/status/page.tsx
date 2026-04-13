"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { saveApplication } from "@/app/actions/applications";
import { Search, FileText, HelpCircle } from "lucide-react";

export default function StatusPage() {
  const router = useRouter();
  const [registro, setRegistro] = useState("");
  const [submissionDate, setSubmissionDate] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (!registro.trim()) {
      setError("Please enter your registro number");
      return;
    }
    if (!submissionDate) {
      setError("Please enter your submission date");
      return;
    }

    setLoading(true);

    // Save to DB if user is logged in — best-effort, don't block navigation
    let appId: string | null = null;
    try {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const result = await saveApplication(registro.trim(), submissionDate);
        if (!result.error) appId = result.id;
      }
    } catch {
      // Not logged in or DB unavailable — continue stateless
    }

    const params = new URLSearchParams({
      registro: registro.trim(),
      date: submissionDate,
      ...(appId ? { appId } : {}),
    });
    router.push(`/status/tracker?${params.toString()}`);
  }

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="warm-gradient texture-overlay border-b border-border/40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-sm font-medium">
            <Search className="h-3.5 w-3.5" />
            Post-submission tracking
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Application Status Tracker
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Enter your application details to track your renewal and count
            business days to the auto-approval threshold.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-8 w-full">
        {/* Form */}
        <div className="rounded-xl border border-border bg-card p-6 sm:p-8 shadow-sm">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-9 h-9 rounded-lg bg-terracotta/10 flex items-center justify-center">
              <FileText className="h-4.5 w-4.5 text-terracotta" />
            </div>
            <div>
              <h2 className="font-semibold">Your Application Details</h2>
              <p className="text-xs text-muted-foreground">
                From your Acuse de Recibo (submission receipt)
              </p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="registro" className="text-sm font-medium">
                Registro Number
              </Label>
              <Input
                id="registro"
                placeholder="REGAGE26e00022070621"
                value={registro}
                onChange={(e) => setRegistro(e.target.value)}
                aria-describedby={error ? "status-error" : "registro-hint"}
                aria-invalid={!!error && !registro.trim()}
                className="font-mono bg-background"
              />
              <p id="registro-hint" className="text-xs text-muted-foreground">
                Found on your Acuse de Recibo. Format: REGAGE followed by numbers.
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="submissionDate" className="text-sm font-medium">
                Submission Date <span className="text-muted-foreground font-normal">(Fecha alta)</span>
              </Label>
              <Input
                id="submissionDate"
                type="date"
                value={submissionDate}
                onChange={(e) => setSubmissionDate(e.target.value)}
                aria-describedby={error ? "status-error" : undefined}
                aria-invalid={!!error && !submissionDate}
                className="bg-background"
              />
            </div>

            {error && (
              <p id="status-error" role="alert" className="text-sm text-destructive bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>
            )}

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-terracotta hover:bg-terracotta-dark text-white h-11"
            >
              <Search className="h-4 w-4 mr-2" />
              {loading ? "Loading..." : "Track My Application"}
            </Button>
          </form>
        </div>

        {/* Help */}
        <div className="rounded-xl border border-border/60 bg-amber-soft/30 p-5">
          <div className="flex items-start gap-3">
            <HelpCircle className="h-5 w-5 text-clay mt-0.5 shrink-0" />
            <div className="space-y-2">
              <p className="text-sm font-medium text-foreground/80">
                Don&apos;t have your registro number?
              </p>
              <ul className="space-y-1.5 text-xs text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-terracotta mt-0.5">&#8227;</span>
                  Check your Acuse de Recibo PDF (downloaded when you submitted)
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-terracotta mt-0.5">&#8227;</span>
                  <span>
                    Log into the{" "}
                    <a
                      href="https://expinterweb.inclusion.gob.es/iley11/consultaSolicitud/verExptesPresentador.action"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-terracotta underline underline-offset-2 hover:text-terracotta-dark"
                    >
                      Law 14/2013 portal
                    </a>{" "}
                    with your digital certificate
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/client";
import { AlertTriangle, Mail, CheckCircle, ArrowLeft } from "lucide-react";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const supabase = createClient();
    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL ??
      (typeof window !== "undefined" ? window.location.origin : "");
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${siteUrl}/reset-password`,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSent(true);
    setLoading(false);
  }

  if (sent) {
    return (
      <div className="w-full max-w-sm space-y-6 text-center">
        <div className="w-16 h-16 rounded-full bg-olive-light/30 flex items-center justify-center mx-auto">
          <CheckCircle className="h-8 w-8 text-olive" />
        </div>
        <div className="space-y-2">
          <h1 className="text-2xl font-bold tracking-tight">Check your email</h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            If an account exists for <strong className="text-foreground">{email}</strong>,
            we&apos;ve sent a password reset link. It expires in one hour.
          </p>
        </div>
        <a href="/login" className="inline-flex">
          <Button
            variant="outline"
            className="border-terracotta/30 text-terracotta hover:bg-terracotta/5"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to sign in
          </Button>
        </a>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm space-y-6">
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-terracotta to-terracotta-dark flex items-center justify-center shadow-md mx-auto">
          <span className="text-white font-bold text-lg">T</span>
        </div>
        <h1 className="text-2xl font-bold tracking-tight">Reset password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email and we&apos;ll send you a reset link
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-sm space-y-5">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              aria-describedby={error ? "forgot-error" : undefined}
              aria-invalid={!!error}
              className="bg-background"
            />
          </div>

          {error && (
            <div id="forgot-error" role="alert" className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 flex items-start gap-2 text-sm text-destructive">
              <AlertTriangle className="h-4 w-4 shrink-0 mt-0.5" />
              {error}
            </div>
          )}

          <Button
            type="submit"
            disabled={loading}
            className="w-full bg-terracotta hover:bg-terracotta-dark text-white h-11"
          >
            {loading ? (
              "Sending link..."
            ) : (
              <>
                <Mail className="h-4 w-4 mr-2" />
                Send reset link
              </>
            )}
          </Button>
        </form>

        <div className="text-center">
          <a
            href="/login"
            className="text-sm text-muted-foreground hover:text-terracotta inline-flex items-center gap-1"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to sign in
          </a>
        </div>
      </div>
    </div>
  );
}

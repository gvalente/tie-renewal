"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, Loader2 } from "lucide-react";

type Props = {
  isPro: boolean;
};

export function PricingClient({ isPro }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUpgrade() {
    setLoading(true);
    setError(null);

    const res = await fetch("/api/stripe/checkout", { method: "POST" });
    const json = await res.json();

    if (!res.ok || !json.url) {
      setError(json.error ?? "Something went wrong. Please try again.");
      setLoading(false);
      return;
    }

    window.location.href = json.url;
  }

  if (isPro) {
    return (
      <div className="flex items-center gap-2 text-sm text-olive font-medium">
        <CheckCircle className="h-4 w-4" />
        You&apos;re already Pro
      </div>
    );
  }

  return (
    <div className="space-y-2">
      <Button
        onClick={handleUpgrade}
        disabled={loading}
        className="w-full bg-terracotta hover:bg-terracotta-dark text-white h-11"
      >
        {loading ? (
          <>
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            Redirecting to checkout…
          </>
        ) : (
          "Upgrade to Pro — $20"
        )}
      </Button>
      {error && (
        <p role="alert" className="text-xs text-destructive text-center">
          {error}
        </p>
      )}
    </div>
  );
}

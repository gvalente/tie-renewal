import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/subscription";
import { PricingClient } from "./PricingClient";
import { CheckCircle, Sparkles } from "lucide-react";

export const metadata = {
  title: "Pricing — RenewMyTIE",
  description: "One payment. Full access. Everything you need to renew your TIE.",
};

const freeFeatures = [
  "All /guide knowledge base articles",
  "TIE expiry date calculator",
  "One-time status check (no save)",
  "Renewal guide steps 0–3 (eligibility, docs, fee)",
];

const proFeatures = [
  "Full guided renewal walkthrough (steps 4–5)",
  "Persistent dashboard — save applications & TIE records",
  "Status tracking history across all check methods",
  "Silencio administrativo email alert",
  "TIE expiry reminder emails (90, 60, 30, 14, 7 days)",
];

export default async function PricingPage() {
  const supabase = await createClient();
  const tier = await getUserTier(supabase);
  const isPro = tier === "pro";

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="warm-gradient texture-overlay border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Simple pricing
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            One payment. Full access.
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            TIE renewal is stressful. Pay once to unlock everything you need — no subscription, no recurring charges.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full">
        <div className="grid sm:grid-cols-2 gap-6">
          {/* Free tier */}
          <div className="rounded-xl border border-border bg-card p-6 space-y-5">
            <div>
              <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide">Free</p>
              <p className="text-3xl font-bold mt-1">$0</p>
              <p className="text-xs text-muted-foreground mt-1">Always free, no card needed</p>
            </div>
            <ul className="space-y-2.5">
              {freeFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle className="h-4 w-4 text-olive mt-0.5 shrink-0" />
                  <span className="text-muted-foreground">{f}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Pro tier */}
          <div className="rounded-xl border-2 border-terracotta bg-card p-6 space-y-5 relative">
            <div className="absolute -top-3 left-1/2 -translate-x-1/2">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-terracotta text-white text-xs font-semibold">
                <Sparkles className="h-3 w-3" /> Recommended
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-terracotta uppercase tracking-wide">Pro</p>
              <p className="text-3xl font-bold mt-1">$20</p>
              <p className="text-xs text-muted-foreground mt-1">One-time payment, lifetime access</p>
            </div>
            <ul className="space-y-2.5">
              {proFeatures.map((f) => (
                <li key={f} className="flex items-start gap-2.5 text-sm">
                  <CheckCircle className="h-4 w-4 text-terracotta mt-0.5 shrink-0" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>

            <PricingClient isPro={isPro} />
          </div>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8 leading-relaxed">
          Payments processed securely by Stripe. No subscription — you pay once and it&apos;s yours.
          Questions? This is a solo project by an expat who went through this process.
        </p>
      </div>
    </div>
  );
}

import { createClient } from "@/lib/supabase/server";
import { CheckCircle, ArrowRight, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export const metadata = {
  title: "Welcome to Pro — RenewMyTIE",
};

export default async function UpgradePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  return (
    <div className="flex flex-col">
      <div className="warm-gradient texture-overlay border-b border-border/40">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-3 text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-olive/10 text-olive text-sm font-medium">
            <Sparkles className="h-3.5 w-3.5" />
            Payment confirmed
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            You&apos;re now Pro!
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Thank you{user?.email ? `, ${user.email}` : ""}. Full access is unlocked — let&apos;s finish your renewal.
          </p>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-10 space-y-6 w-full">
        <div className="rounded-xl border border-olive/20 bg-olive-light/10 p-6 space-y-4">
          <h2 className="font-semibold text-olive-dark flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-olive" />
            What&apos;s now unlocked
          </h2>
          <ul className="space-y-2.5 text-sm">
            {[
              "Full guided renewal walkthrough — steps 4 and 5",
              "Persistent dashboard with saved applications & TIE records",
              "Status tracking history across all check methods",
              "Silencio administrativo email alert (20 business days)",
              "TIE expiry reminder emails at 90, 60, 30, 14, and 7 days",
            ].map((item) => (
              <li key={item} className="flex items-start gap-2.5">
                <CheckCircle className="h-4 w-4 text-olive mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/renew" className="flex-1">
            <Button className="w-full bg-terracotta hover:bg-terracotta-dark text-white h-11">
              Continue Renewal Guide
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
          <Link href="/dashboard" className="flex-1">
            <Button variant="outline" className="w-full h-11 border-border">
              Go to Dashboard
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

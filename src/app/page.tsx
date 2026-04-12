import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { CalendarDays, ClipboardList, Search, ArrowRight, FileCheck, Clock, Shield } from "lucide-react";

const entryPoints = [
  {
    href: "/track",
    icon: CalendarDays,
    title: "Track my TIE expiry",
    description:
      "Know exactly when your renewal window opens and never miss a deadline",
    accent: "from-amber-warm/30 to-amber-soft/20",
    iconColor: "text-amber-700",
  },
  {
    href: "/renew",
    icon: ClipboardList,
    title: "Guide me through renewal",
    description:
      "Step-by-step walkthrough with our verified 4-document checklist",
    accent: "from-olive-light/30 to-olive-light/10",
    iconColor: "text-olive",
  },
  {
    href: "/status",
    icon: Search,
    title: "I already applied",
    description:
      "Track your 20-day countdown to auto-approval with business day precision",
    accent: "from-terracotta-light/30 to-terracotta-light/10",
    iconColor: "text-terracotta",
  },
];

const highlights = [
  {
    icon: FileCheck,
    title: "Only 4 documents",
    description: "Verified against a real application — much simpler than most guides claim",
  },
  {
    icon: Clock,
    title: "20-day countdown",
    description: "Business day calculator with Spanish holidays built in",
  },
  {
    icon: Shield,
    title: "Silencio positivo",
    description: "Know when auto-approval kicks in and exactly what to do next",
  },
];

export default function Home() {
  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="warm-gradient texture-overlay">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-20 sm:py-28 text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-sm font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-terracotta animate-pulse" />
            For HQP/PAC permit holders under Law 14/2013
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
            TIE Renewal,{" "}
            <span className="text-terracotta">simplified.</span>
          </h1>

          <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
            The stress-free guide for highly qualified professionals renewing
            their residence card in Spain
          </p>

          <p className="text-sm text-clay italic">
            &ldquo;Because Spanish bureaucracy shouldn&apos;t require a PhD to navigate&rdquo;
          </p>
        </div>
      </section>

      {/* Entry points */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 -mt-8 relative z-10 w-full">
        <div className="grid gap-5 sm:grid-cols-3">
          {entryPoints.map((entry) => (
            <a key={entry.href} href={entry.href} className="group">
              <div className="card-warm rounded-xl overflow-hidden h-full">
                {/* Gradient accent top */}
                <div className={`h-1.5 bg-gradient-to-r ${entry.accent}`} />
                <div className="p-5 sm:p-6 space-y-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${entry.accent} flex items-center justify-center`}>
                    <entry.icon className={`h-5 w-5 ${entry.iconColor}`} />
                  </div>
                  <h2 className="text-lg font-semibold tracking-tight group-hover:text-terracotta transition-colors">
                    {entry.title}
                  </h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {entry.description}
                  </p>
                  <div className="flex items-center gap-1 text-sm text-terracotta font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Get started <ArrowRight className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Highlights */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 py-20 w-full">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold tracking-tight">
            What makes this <span className="text-terracotta">different</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Verified against a real HQP/PAC renewal — not generic advice
          </p>
        </div>

        <div className="grid gap-8 sm:grid-cols-3">
          {highlights.map((item) => (
            <div key={item.title} className="text-center space-y-3">
              <div className="w-12 h-12 rounded-xl bg-terracotta/10 flex items-center justify-center mx-auto">
                <item.icon className="h-6 w-6 text-terracotta" />
              </div>
              <h3 className="font-semibold">{item.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Trust section */}
      <section className="border-t border-border/50">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 text-center space-y-4">
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-terracotta to-transparent mx-auto" />
          <p className="text-muted-foreground text-sm leading-relaxed">
            Built by an expat in Barcelona who filed his own HQP renewal
            in March 2026 — and realized the process was way simpler than
            everyone makes it sound. This app is the guide he wished he&apos;d had.
          </p>
          <p className="text-xs text-muted-foreground/60">
            Datos reales &middot; Proceso verificado &middot; Hecho con cari&ntilde;o
          </p>
        </div>
      </section>
    </div>
  );
}

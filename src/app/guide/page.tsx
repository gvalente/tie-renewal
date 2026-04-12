import { BookOpen, Clock, CheckCircle2, KeyRound, ArrowRight } from "lucide-react";

const topics = [
  {
    href: "/guide/silencio",
    icon: Clock,
    title: "Silencio administrativo explained",
    description:
      "What the 20-business-day rule actually means, how to confirm it applies to you, and how to get it certified in writing.",
    color: "text-olive",
    bg: "bg-olive-light/15",
  },
  {
    href: "/guide/after-approval",
    icon: CheckCircle2,
    title: "After your renewal is approved",
    description:
      "Booking your TIE card appointment, fingerprints, collection, and what to carry with you in the meantime.",
    color: "text-terracotta",
    bg: "bg-terracotta/8",
  },
  {
    href: "/guide/authentication",
    icon: KeyRound,
    title: "Authentication setup",
    description:
      "Getting a Cl@ve PIN or FNMT digital certificate — the keys that unlock the Law 14/2013 portal and Sede Electrónica.",
    color: "text-amber-700",
    bg: "bg-amber-soft/50",
  },
];

export default function GuideIndexPage() {
  return (
    <div className="flex flex-col">
      <div className="warm-gradient texture-overlay border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-12 sm:py-16 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-terracotta/10 text-terracotta text-sm font-medium">
            <BookOpen className="h-3.5 w-3.5" />
            Knowledge base
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            Guides & explainers
          </h1>
          <p className="text-muted-foreground leading-relaxed max-w-2xl">
            Deep dives on the moving parts of the TIE renewal process —
            written the way we wish someone had explained it to us.
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 space-y-4 w-full">
        {topics.map((topic) => (
          <a
            key={topic.href}
            href={topic.href}
            className="group rounded-xl border border-border bg-card p-5 sm:p-6 hover:border-terracotta/30 hover:shadow-sm transition-all duration-200 flex items-start gap-4"
          >
            <div
              className={`w-10 h-10 rounded-lg ${topic.bg} flex items-center justify-center shrink-0`}
            >
              <topic.icon className={`h-5 w-5 ${topic.color}`} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold group-hover:text-terracotta transition-colors">
                {topic.title}
              </p>
              <p className="text-sm text-muted-foreground mt-1 leading-relaxed">
                {topic.description}
              </p>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground/50 group-hover:text-terracotta transition-colors shrink-0 mt-1" />
          </a>
        ))}
      </div>
    </div>
  );
}

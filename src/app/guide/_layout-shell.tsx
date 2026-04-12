import { ArrowLeft, BookOpen, LucideIcon } from "lucide-react";

type Props = {
  title: string;
  subtitle: string;
  icon: LucideIcon;
  iconBg: string;
  iconColor: string;
  children: React.ReactNode;
};

export function GuideShell({ title, subtitle, icon: Icon, iconBg, iconColor, children }: Props) {
  return (
    <div className="flex flex-col">
      <div className="warm-gradient texture-overlay border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-4">
          <a
            href="/guide"
            className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-terracotta font-medium"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to knowledge base
          </a>
          <div className="flex items-start gap-4">
            <div className={`w-12 h-12 rounded-xl ${iconBg} flex items-center justify-center shrink-0`}>
              <Icon className={`h-6 w-6 ${iconColor}`} />
            </div>
            <div className="space-y-1.5">
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
                {title}
              </h1>
              <p className="text-muted-foreground leading-relaxed">{subtitle}</p>
            </div>
          </div>
        </div>
      </div>

      <article className="max-w-3xl mx-auto px-4 sm:px-6 py-10 w-full prose-guide">
        {children}
      </article>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 pb-12 w-full">
        <a
          href="/guide"
          className="inline-flex items-center gap-2 text-sm text-terracotta hover:text-terracotta-dark font-medium"
        >
          <BookOpen className="h-4 w-4" />
          More guides
        </a>
      </div>
    </div>
  );
}

export function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3 mb-10">
      <h2 className="text-xl font-semibold flex items-center gap-2">
        <span className="w-1.5 h-5 rounded-full bg-terracotta" />
        {title}
      </h2>
      <div className="space-y-3 text-[15px] leading-relaxed text-foreground/85">{children}</div>
    </section>
  );
}

export function Callout({
  tone = "info",
  title,
  children,
}: {
  tone?: "info" | "warn" | "good";
  title?: string;
  children: React.ReactNode;
}) {
  const styles: Record<string, string> = {
    info: "border-border bg-amber-soft/30 text-foreground/80",
    warn: "border-terracotta/25 bg-terracotta/5 text-foreground/80",
    good: "border-olive-light/30 bg-olive-light/10 text-foreground/80",
  };
  return (
    <div className={`rounded-lg border p-4 text-sm space-y-1 ${styles[tone]}`}>
      {title && <p className="font-semibold">{title}</p>}
      <div className="[&>p]:leading-relaxed">{children}</div>
    </div>
  );
}

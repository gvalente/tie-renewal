import { createClient } from "@/lib/supabase/server";
import { getTimelineStatus } from "@/lib/business-days";
import { SPANISH_HOLIDAYS } from "@/lib/holidays";
import { STATUSES } from "@/lib/constants";
import { format } from "date-fns";
import {
  CalendarDays,
  ClipboardList,
  Search,
  ArrowRight,
  FileCheck,
  Clock,
  Shield,
  CheckCircle,
  AlertTriangle,
  XCircle,
  Sparkles,
  BookOpen,
  AlertCircle,
  ThumbsUp,
} from "lucide-react";

// ─── Types ───────────────────────────────────────────────────────────────────

type TIERow = {
  tie_expiry_date: string;
  renewal_window_start: string;
  late_deadline: string;
} | null;

type AppRow = {
  id: string;
  registro_number: string | null;
  submission_date: string;
  current_status: string;
  silencio_reached: boolean;
} | null;

type HomeState =
  | { kind: "no_data" }
  | { kind: "window_not_open"; daysUntilWindow: number; windowStart: string; expiryDate: string }
  | { kind: "window_open"; daysUntilExpiry: number; expiryDate: string }
  | { kind: "expired_late_window"; daysOverdue: number; lateDeadline: string; daysUntilDeadline: number }
  | { kind: "expired_past_deadline"; daysOverdue: number }
  | { kind: "application_active"; businessDaysElapsed: number; thresholdDate: Date; registro: string | null; submissionDate: string; appId: string }
  | { kind: "requerido"; registro: string | null; appId: string }
  | { kind: "silencio_reached"; registro: string | null; appId: string }
  | { kind: "application_approved"; registro: string | null }
  | { kind: "application_denied"; registro: string | null };

// ─── State resolution (priority: application > TIE) ──────────────────────────

function resolveState(tie: TIERow, app: AppRow, today: Date): HomeState {
  if (app) {
    const status = app.current_status;

    if (status === STATUSES.RESUELTO_FAVORABLE) {
      return { kind: "application_approved", registro: app.registro_number };
    }
    if (status === STATUSES.RESUELTO_NO_FAVORABLE) {
      return { kind: "application_denied", registro: app.registro_number };
    }
    if (app.silencio_reached || status === STATUSES.SILENCIO_POSITIVO) {
      return { kind: "silencio_reached", registro: app.registro_number, appId: app.id };
    }
    if (status === STATUSES.REQUERIDO) {
      return { kind: "requerido", registro: app.registro_number, appId: app.id };
    }
    // en_tramite / submitted / pendiente_informes
    const submissionDate = new Date(app.submission_date + "T00:00:00");
    const tl = getTimelineStatus(submissionDate, SPANISH_HOLIDAYS, today);
    if (tl.isPastThreshold) {
      return { kind: "silencio_reached", registro: app.registro_number, appId: app.id };
    }
    return {
      kind: "application_active",
      businessDaysElapsed: tl.businessDaysElapsed,
      thresholdDate: tl.thresholdDate,
      registro: app.registro_number,
      submissionDate: app.submission_date,
      appId: app.id,
    };
  }

  if (tie) {
    const expiry = new Date(tie.tie_expiry_date + "T00:00:00");
    const windowStart = new Date(tie.renewal_window_start + "T00:00:00");
    const lateDeadline = new Date(tie.late_deadline + "T00:00:00");

    const daysUntilExpiry = Math.ceil((expiry.getTime() - today.getTime()) / 86400000);
    const daysUntilWindow = Math.ceil((windowStart.getTime() - today.getTime()) / 86400000);
    const daysUntilDeadline = Math.ceil((lateDeadline.getTime() - today.getTime()) / 86400000);

    if (daysUntilExpiry < 0) {
      const daysOverdue = Math.abs(daysUntilExpiry);
      return daysUntilDeadline > 0
        ? { kind: "expired_late_window", daysOverdue, lateDeadline: tie.late_deadline, daysUntilDeadline }
        : { kind: "expired_past_deadline", daysOverdue };
    }
    if (daysUntilWindow <= 0) {
      return { kind: "window_open", daysUntilExpiry, expiryDate: tie.tie_expiry_date };
    }
    return { kind: "window_not_open", daysUntilWindow, windowStart: tie.renewal_window_start, expiryDate: tie.tie_expiry_date };
  }

  return { kind: "no_data" };
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function Home() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return <MarketingPage />;
  }

  const today = new Date();
  const firstName = (user.user_metadata?.full_name as string | undefined)?.split(" ")[0] ?? null;

  const [{ data: tieData }, { data: appData }] = await Promise.all([
    supabase
      .from("tie_records")
      .select("tie_expiry_date, renewal_window_start, late_deadline")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("renewal_applications")
      .select("id, registro_number, submission_date, current_status, silencio_reached")
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
  ]);

  const state = resolveState(tieData ?? null, appData ?? null, today);

  return <AuthenticatedHome state={state} firstName={firstName} today={today} />;
}

// ─── Authenticated home ───────────────────────────────────────────────────────

function AuthenticatedHome({
  state,
  firstName,
  today,
}: {
  state: HomeState;
  firstName: string | null;
  today: Date;
}) {
  const greeting = firstName ? `Hi ${firstName}` : "Welcome back";

  // "no_data" gets the full marketing routing layout instead of a status card
  if (state.kind === "no_data") {
    return (
      <div className="flex flex-col">
        <div className="warm-gradient texture-overlay border-b border-border/40">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-2">
            <p className="text-sm text-muted-foreground">{greeting}</p>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              Where would you like to start?
            </h1>
            <p className="text-muted-foreground">
              Track your TIE expiry, follow the renewal guide, or check an application you&apos;ve already submitted.
            </p>
          </div>
        </div>
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
          <RoutingCards />
          <div className="pt-2 border-t border-border/40 flex justify-center">
            <a
              href="/dashboard"
              className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-terracotta transition-colors"
            >
              Go to dashboard <ArrowRight className="h-3.5 w-3.5" />
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col">
      {/* Header + status card */}
      <div className="warm-gradient texture-overlay border-b border-border/40">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 sm:py-10 space-y-4">
          <p className="text-sm text-muted-foreground">
            {greeting} — here&apos;s where things stand
          </p>
          <StatusCard state={state} today={today} />
        </div>
      </div>

      {/* Quick access tools */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 w-full space-y-6">
        <div>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground/70 mb-3">
            Quick access
          </h2>
          <QuickAccessRow state={state} />
        </div>

        <div className="pt-2 border-t border-border/40 flex justify-center">
          <a
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-terracotta transition-colors"
          >
            Full dashboard <ArrowRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Status card ──────────────────────────────────────────────────────────────

function StatusCard({ state, today }: { state: Exclude<HomeState, { kind: "no_data" }>; today: Date }) {
  switch (state.kind) {
    case "window_not_open": {
      const windowDate = format(new Date(state.windowStart + "T00:00:00"), "MMM d, yyyy");
      const expiryDateFmt = format(new Date(state.expiryDate + "T00:00:00"), "MMM d, yyyy");
      return (
        <Card accent="olive">
          <CardIcon icon={CheckCircle} color="text-olive" bg="bg-olive-light/20" />
          <CardBody
            badge={{ label: "All good", color: "bg-olive-light/20 text-olive" }}
            title={`${state.daysUntilWindow} days until your renewal window opens`}
            body="No action needed right now. Your TIE is valid and you're not yet in the filing window."
            metric={`Window opens ${windowDate} · Expiry ${expiryDateFmt}`}
            actions={[
              { href: "/track", label: "View full timeline", variant: "secondary" },
              { href: "/renew", label: "Preview renewal guide", variant: "ghost" },
            ]}
          />
        </Card>
      );
    }

    case "window_open": {
      const expiryDateFmt = format(new Date(state.expiryDate + "T00:00:00"), "MMM d, yyyy");
      const urgent = state.daysUntilExpiry <= 14;
      return (
        <Card accent={urgent ? "terracotta" : "amber"}>
          <CardIcon
            icon={AlertCircle}
            color={urgent ? "text-terracotta" : "text-amber-700"}
            bg={urgent ? "bg-terracotta/10" : "bg-amber-soft/50"}
          />
          <CardBody
            badge={{
              label: urgent ? "Urgent — act now" : "Renewal window open",
              color: urgent ? "bg-terracotta/10 text-terracotta" : "bg-amber-soft/60 text-amber-700",
            }}
            title={`Your TIE expires in ${state.daysUntilExpiry} day${state.daysUntilExpiry === 1 ? "" : "s"}`}
            body={
              urgent
                ? "Your TIE expires very soon. File your renewal application today to avoid complications."
                : "You're in the 60-day renewal window. You can file your application now — it's a good time to start."
            }
            metric={`Expiry date: ${expiryDateFmt}`}
            actions={[
              { href: "/renew", label: "Start renewal guide", variant: "primary" },
              { href: "/track", label: "View timeline", variant: "secondary" },
            ]}
          />
        </Card>
      );
    }

    case "expired_late_window": {
      const lateFmt = format(new Date(state.lateDeadline + "T00:00:00"), "MMM d, yyyy");
      return (
        <Card accent="terracotta">
          <CardIcon icon={AlertTriangle} color="text-terracotta" bg="bg-terracotta/10" />
          <CardBody
            badge={{ label: "TIE expired — late filing window", color: "bg-terracotta/10 text-terracotta" }}
            title={`Expired ${state.daysOverdue} day${state.daysOverdue === 1 ? "" : "s"} ago — you can still file`}
            body="Filing late is allowed within 90 days of expiry. You may receive a fine, but your status is not lost. File as soon as possible."
            metric={`Late filing deadline: ${lateFmt} (${state.daysUntilDeadline} day${state.daysUntilDeadline === 1 ? "" : "s"} left)`}
            actions={[
              { href: "/renew", label: "File renewal now", variant: "primary" },
              { href: "/guide", label: "Know your options", variant: "secondary" },
            ]}
          />
        </Card>
      );
    }

    case "expired_past_deadline": {
      return (
        <Card accent="destructive">
          <CardIcon icon={XCircle} color="text-destructive" bg="bg-destructive/10" />
          <CardBody
            badge={{ label: "Late filing window closed", color: "bg-destructive/10 text-destructive" }}
            title={`TIE expired ${state.daysOverdue} days ago — deadline passed`}
            body="The 90-day late filing window has closed. You may need to start a new initial application rather than a renewal. This is complex — consider consulting an immigration lawyer."
            metric="The renewal process is no longer available for this TIE"
            actions={[
              { href: "/guide", label: "Understand your options", variant: "primary" },
            ]}
          />
        </Card>
      );
    }

    case "application_active": {
      const daysLeft = 20 - state.businessDaysElapsed;
      const thresholdFmt = format(state.thresholdDate, "MMM d, yyyy");
      const trackerUrl = state.registro
        ? `/status/tracker?registro=${encodeURIComponent(state.registro)}&date=${state.submissionDate}&appId=${state.appId}`
        : `/status/tracker?date=${state.submissionDate}&appId=${state.appId}`;
      const isLate = state.businessDaysElapsed >= 15;
      return (
        <Card accent="terracotta">
          <CardIcon icon={Clock} color="text-terracotta" bg="bg-terracotta/8" />
          <CardBody
            badge={{ label: "Application in review", color: "bg-terracotta/10 text-terracotta" }}
            title={`Day ${state.businessDaysElapsed} of 20 business days`}
            body={
              isLate
                ? `Getting close to the silencio threshold. ${daysLeft} business day${daysLeft === 1 ? "" : "s"} remaining — check the portal for any updates.`
                : `Your application is being processed. ${daysLeft} business day${daysLeft === 1 ? "" : "s"} until the auto-approval threshold.`
            }
            metric={`Silencio administrativo threshold: ${thresholdFmt}`}
            actions={[
              { href: trackerUrl, label: "Open status tracker", variant: "primary" },
              { href: "/guide/silencio", label: "What is silencio?", variant: "ghost" },
            ]}
          />
        </Card>
      );
    }

    case "requerido": {
      const trackerUrl = state.registro
        ? `/status/tracker?registro=${encodeURIComponent(state.registro)}&appId=${state.appId}`
        : `/status/tracker?appId=${state.appId}`;
      return (
        <Card accent="amber">
          <CardIcon icon={AlertTriangle} color="text-amber-700" bg="bg-amber-soft/50" />
          <CardBody
            badge={{ label: "Documents requested", color: "bg-amber-soft/60 text-amber-700" }}
            title="UGE has requested additional documents"
            body="You have 10 business days to respond from the date of the request. Check your portal notifications immediately and upload the required documents."
            metric="Log into the Law 14/2013 portal → Notifications to see what's needed"
            actions={[
              { href: trackerUrl, label: "Open tracker", variant: "primary" },
              {
                href: "https://expinterweb.inclusion.gob.es/iley11/",
                label: "Law 14/2013 portal",
                variant: "secondary",
                external: true,
              },
            ]}
          />
        </Card>
      );
    }

    case "silencio_reached": {
      const trackerUrl = state.registro
        ? `/status/tracker?registro=${encodeURIComponent(state.registro)}&appId=${state.appId}`
        : `/status/tracker?appId=${state.appId}`;
      return (
        <Card accent="olive">
          <CardIcon icon={CheckCircle} color="text-olive" bg="bg-olive-light/20" />
          <CardBody
            badge={{ label: "Silencio administrativo positivo", color: "bg-olive-light/20 text-olive" }}
            title="Your application has likely been approved"
            body="20 business days have passed with no negative decision or requerimiento. Under Law 14/2013, this means silencio administrativo positivo — your renewal is considered approved."
            metric="Next: confirm no requerimiento was issued, then book your TIE appointment"
            actions={[
              { href: "/guide/silencio", label: "What to do next", variant: "primary" },
              { href: trackerUrl, label: "Open tracker", variant: "secondary" },
            ]}
          />
        </Card>
      );
    }

    case "application_approved": {
      return (
        <Card accent="olive">
          <CardIcon icon={ThumbsUp} color="text-olive" bg="bg-olive-light/20" />
          <CardBody
            badge={{ label: "Approved — resolución favorable", color: "bg-olive-light/20 text-olive" }}
            title="Your renewal has been formally approved"
            body="Congratulations! You now need to book a TIE card appointment at your local police station to receive your new physical card."
            metric="Bring: resolution, passport, current TIE, photo, empadronamiento, and Tasa 790-012"
            actions={[
              { href: "/guide/after-approval", label: "After-approval checklist", variant: "primary" },
              { href: "/track", label: "Track new TIE expiry", variant: "secondary" },
            ]}
          />
        </Card>
      );
    }

    case "application_denied": {
      return (
        <Card accent="destructive">
          <CardIcon icon={XCircle} color="text-destructive" bg="bg-destructive/10" />
          <CardBody
            badge={{ label: "Resolución no favorable", color: "bg-destructive/10 text-destructive" }}
            title="Your application was not approved"
            body="You have the right to appeal (recurso de alzada) within one month of notification. Download the decision from your portal notifications to understand the reason."
            metric="Time-sensitive: the appeal window is typically 1 month from the notification date"
            actions={[
              {
                href: "https://expinterweb.inclusion.gob.es/iley11/",
                label: "Check portal notifications",
                variant: "primary",
                external: true,
              },
              { href: "/guide", label: "Knowledge base", variant: "secondary" },
            ]}
          />
        </Card>
      );
    }
  }
}

// ─── Card primitives ──────────────────────────────────────────────────────────

const accentBorder: Record<string, string> = {
  olive:       "border-l-olive",
  terracotta:  "border-l-terracotta",
  amber:       "border-l-amber-warm",
  destructive: "border-l-destructive",
};

function Card({ accent, children }: { accent: string; children: React.ReactNode }) {
  return (
    <div
      className={`rounded-xl border border-border bg-card shadow-sm border-l-4 ${accentBorder[accent] ?? "border-l-border"} flex gap-4 p-5 sm:p-6`}
    >
      {children}
    </div>
  );
}

function CardIcon({
  icon: Icon,
  color,
  bg,
}: {
  icon: React.ElementType;
  color: string;
  bg: string;
}) {
  return (
    <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center shrink-0 mt-0.5`}>
      <Icon className={`h-5 w-5 ${color}`} />
    </div>
  );
}

type ActionConfig = {
  href: string;
  label: string;
  variant: "primary" | "secondary" | "ghost";
  external?: boolean;
};

function CardBody({
  badge,
  title,
  body,
  metric,
  actions,
}: {
  badge: { label: string; color: string };
  title: string;
  body: string;
  metric: string;
  actions: ActionConfig[];
}) {
  return (
    <div className="flex-1 min-w-0 space-y-3">
      <div>
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full ${badge.color}`}>
          {badge.label}
        </span>
        <h2 className="text-base sm:text-lg font-bold mt-2 leading-snug">{title}</h2>
        <p className="text-sm text-muted-foreground mt-1 leading-relaxed">{body}</p>
      </div>

      <p className="text-xs text-muted-foreground bg-secondary/60 rounded-lg px-3 py-2 leading-relaxed">
        {metric}
      </p>

      <div className="flex flex-wrap gap-2">
        {actions.map((action) =>
          action.external ? (
            <a
              key={action.label}
              href={action.href}
              target="_blank"
              rel="noopener noreferrer"
              className={actionClass(action.variant)}
            >
              {action.label}
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </a>
          ) : (
            <a key={action.label} href={action.href} className={actionClass(action.variant)}>
              {action.label}
              <ArrowRight className="h-3.5 w-3.5 shrink-0" />
            </a>
          )
        )}
      </div>
    </div>
  );
}

function actionClass(variant: ActionConfig["variant"]) {
  const base = "inline-flex items-center gap-1.5 text-sm font-medium rounded-lg px-3 py-1.5 transition-colors";
  if (variant === "primary")
    return `${base} bg-terracotta text-white hover:bg-terracotta-dark`;
  if (variant === "secondary")
    return `${base} border border-border bg-card hover:border-terracotta/40 hover:text-terracotta text-foreground`;
  return `${base} text-muted-foreground hover:text-terracotta`;
}

// ─── Quick access row ─────────────────────────────────────────────────────────

const ALL_TOOLS = [
  { href: "/track",   icon: CalendarDays, label: "Expiry Tracker",  description: "Key dates & countdown",  color: "text-amber-700", bg: "bg-amber-soft/50"   },
  { href: "/renew",   icon: ClipboardList, label: "Renewal Guide",   description: "Step-by-step walkthrough", color: "text-olive",    bg: "bg-olive-light/15"  },
  { href: "/status",  icon: Search,        label: "Status Tracker",  description: "20-day countdown",       color: "text-terracotta", bg: "bg-terracotta/8"   },
  { href: "/guide",   icon: BookOpen,      label: "Knowledge Base",  description: "Guides & explainers",    color: "text-clay",      bg: "bg-secondary"       },
] as const;

function QuickAccessRow({ state }: { state: HomeState }) {
  // Surface the most relevant tool first based on state
  const primaryHref =
    state.kind === "application_active" || state.kind === "silencio_reached" || state.kind === "requerido"
      ? "/status"
      : state.kind === "window_open" || state.kind === "expired_late_window"
      ? "/renew"
      : "/track";

  const sorted = [...ALL_TOOLS].sort((a, b) =>
    a.href === primaryHref ? -1 : b.href === primaryHref ? 1 : 0
  );

  return (
    <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {sorted.map((tool) => (
        <a
          key={tool.href}
          href={tool.href}
          className="group flex items-center gap-3 rounded-xl border border-border bg-card p-3.5 hover:border-terracotta/30 hover:shadow-sm transition-all duration-200"
        >
          <div className={`w-8 h-8 rounded-lg ${tool.bg} flex items-center justify-center shrink-0`}>
            <tool.icon className={`h-4 w-4 ${tool.color}`} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium group-hover:text-terracotta transition-colors truncate">
              {tool.label}
            </p>
            <p className="text-xs text-muted-foreground truncate">{tool.description}</p>
          </div>
          <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/40 group-hover:text-terracotta transition-colors shrink-0" />
        </a>
      ))}
    </div>
  );
}

// ─── Routing cards (used in no_data state) ────────────────────────────────────

function RoutingCards() {
  const entries = [
    {
      href: "/track",
      icon: CalendarDays,
      title: "Track my TIE expiry",
      description: "Know exactly when your renewal window opens and never miss a deadline",
      accent: "from-amber-warm/30 to-amber-soft/20",
      iconColor: "text-amber-700",
    },
    {
      href: "/renew",
      icon: ClipboardList,
      title: "Guide me through renewal",
      description: "Step-by-step walkthrough with our verified 4-document checklist",
      accent: "from-olive-light/30 to-olive-light/10",
      iconColor: "text-olive",
    },
    {
      href: "/status",
      icon: Search,
      title: "I already applied",
      description: "Track your 20-day countdown to auto-approval with business day precision",
      accent: "from-terracotta-light/30 to-terracotta-light/10",
      iconColor: "text-terracotta",
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {entries.map((entry) => (
        <a key={entry.href} href={entry.href} className="group">
          <div className="card-warm rounded-xl overflow-hidden h-full">
            <div className={`h-1.5 bg-gradient-to-r ${entry.accent}`} />
            <div className="p-5 space-y-3">
              <div className={`w-10 h-10 rounded-lg bg-gradient-to-br ${entry.accent} flex items-center justify-center`}>
                <entry.icon className={`h-5 w-5 ${entry.iconColor}`} />
              </div>
              <h2 className="text-base font-semibold tracking-tight group-hover:text-terracotta transition-colors">
                {entry.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">{entry.description}</p>
              <div className="flex items-center gap-1 text-sm text-terracotta font-medium opacity-40 group-hover:opacity-100 transition-opacity">
                Get started <ArrowRight className="h-3.5 w-3.5" />
              </div>
            </div>
          </div>
        </a>
      ))}
    </div>
  );
}

// ─── Marketing page (anonymous visitors) ─────────────────────────────────────

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

function MarketingPage() {
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
          {[
            {
              href: "/track",
              icon: CalendarDays,
              title: "Track my TIE expiry",
              description: "Know exactly when your renewal window opens and never miss a deadline",
              accent: "from-amber-warm/30 to-amber-soft/20",
              iconColor: "text-amber-700",
            },
            {
              href: "/renew",
              icon: ClipboardList,
              title: "Guide me through renewal",
              description: "Step-by-step walkthrough with our verified 4-document checklist",
              accent: "from-olive-light/30 to-olive-light/10",
              iconColor: "text-olive",
            },
            {
              href: "/status",
              icon: Search,
              title: "I already applied",
              description: "Track your 20-day countdown to auto-approval with business day precision",
              accent: "from-terracotta-light/30 to-terracotta-light/10",
              iconColor: "text-terracotta",
            },
          ].map((entry) => (
            <a key={entry.href} href={entry.href} className="group">
              <div className="card-warm rounded-xl overflow-hidden h-full">
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
                  <div className="flex items-center gap-1 text-sm text-terracotta font-medium opacity-40 group-hover:opacity-100 transition-opacity">
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
              <p className="text-sm text-muted-foreground leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Sign-up CTA */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 pb-16 w-full">
        <div className="rounded-2xl border border-terracotta/20 bg-terracotta/5 p-8 sm:p-10 text-center space-y-4">
          <div className="w-10 h-10 rounded-xl bg-terracotta/10 flex items-center justify-center mx-auto">
            <Sparkles className="h-5 w-5 text-terracotta" />
          </div>
          <h2 className="text-xl font-bold">Save your progress, track your deadlines</h2>
          <p className="text-sm text-muted-foreground max-w-md mx-auto">
            Create a free account to save your TIE expiry date and get reminders before your renewal window opens.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <a
              href="/signup"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg bg-terracotta text-white text-sm font-semibold hover:bg-terracotta-dark transition-colors"
            >
              Create free account <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <a
              href="/login"
              className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-lg border border-border text-sm font-medium hover:border-terracotta/40 hover:text-terracotta transition-colors"
            >
              Sign in
            </a>
          </div>
        </div>
      </section>

      {/* Trust */}
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

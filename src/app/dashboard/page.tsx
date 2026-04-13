import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/subscription";
import { redirect } from "next/navigation";
import {
  CalendarDays,
  Search,
  ClipboardList,
  Plus,
  ArrowRight,
  Clock,
  CheckCircle,
  Hash,
} from "lucide-react";
import { format } from "date-fns";
import { getTimelineStatus } from "@/lib/business-days";
import { SPANISH_HOLIDAYS } from "@/lib/holidays";
import { STATUS_LABELS, type StatusType } from "@/lib/constants";
import { DeleteButton } from "@/components/DeleteButton";
import { CalendarButtons } from "@/components/CalendarButtons";

type Application = {
  id: string;
  registro_number: string | null;
  submission_date: string;
  current_status: string;
  threshold_date: string | null;
  silencio_reached: boolean;
};

type TIERecord = {
  id: string;
  tie_expiry_date: string;
  permit_type: string;
  renewal_window_start: string;
  late_deadline: string;
};

export default async function DashboardPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const tier = await getUserTier(supabase);
  const isPro = tier === "pro";

  const [{ data: applications }, { data: tieRecords }] = await Promise.all([
    supabase
      .from("renewal_applications")
      .select("id, registro_number, submission_date, current_status, threshold_date, silencio_reached")
      .order("created_at", { ascending: false })
      .limit(5),
    supabase
      .from("tie_records")
      .select("id, tie_expiry_date, permit_type, renewal_window_start, late_deadline")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const today = new Date();

  return (
    <div className="flex flex-col">
      {/* Header */}
      <div className="warm-gradient texture-overlay border-b border-border/40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-14 space-y-2">
          <div className="flex items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
              My Dashboard
            </h1>
            {isPro && (
              <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-terracotta/10 text-terracotta border border-terracotta/20 self-center">
                Pro
              </span>
            )}
          </div>
          <p className="text-muted-foreground">
            {isPro
              ? "Full access — all your renewal activity in one place"
              : "All your renewal activity in one place"}
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-8 w-full">
        {/* Applications */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-terracotta" />
              Active Applications
            </h2>
            <a
              href="/status"
              className="inline-flex items-center gap-1.5 text-sm text-terracotta hover:text-terracotta-dark font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Track new
            </a>
          </div>

          {!applications || applications.length === 0 ? (
            <EmptyState
              icon={Search}
              title="No applications yet"
              description="Enter your registro number to start tracking your 20-day countdown."
              href="/status"
              cta="Track application"
            />
          ) : (
            <div className="space-y-3">
              {applications.map((app: Application) => (
                <ApplicationCard
                  key={app.id}
                  app={app}
                  today={today}
                />
              ))}
            </div>
          )}
        </section>

        {/* TIE Records */}
        <section className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold flex items-center gap-2">
              <span className="w-1.5 h-5 rounded-full bg-amber-warm" />
              TIE Expiry Tracking
            </h2>
            <a
              href="/track"
              className="inline-flex items-center gap-1.5 text-sm text-terracotta hover:text-terracotta-dark font-medium transition-colors"
            >
              <Plus className="h-3.5 w-3.5" />
              Add TIE
            </a>
          </div>

          {!tieRecords || tieRecords.length === 0 ? (
            <EmptyState
              icon={CalendarDays}
              title="No TIE tracked yet"
              description="Enter your TIE expiry date to get deadline reminders and renewal window alerts."
              href="/track"
              cta="Track expiry"
            />
          ) : (
            <div className="space-y-3">
              {tieRecords.map((record: TIERecord) => (
                <TIERecordCard key={record.id} record={record} today={today} />
              ))}
            </div>
          )}
        </section>

        {/* Quick actions */}
        <section className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <span className="w-1.5 h-5 rounded-full bg-olive" />
            Quick Actions
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {[
              {
                href: "/renew",
                icon: ClipboardList,
                label: "Renewal Guide",
                description: "Step-by-step walkthrough",
                color: "text-olive",
                bg: "bg-olive-light/15",
              },
              {
                href: "/track",
                icon: CalendarDays,
                label: "Expiry Tracker",
                description: "Check your key dates",
                color: "text-amber-700",
                bg: "bg-amber-soft/50",
              },
              {
                href: "/status",
                icon: Search,
                label: "Status Tracker",
                description: "20-day countdown",
                color: "text-terracotta",
                bg: "bg-terracotta/8",
              },
            ].map((action) => (
              <a
                key={action.href}
                href={action.href}
                className="group rounded-xl border border-border bg-card p-4 hover:border-terracotta/30 hover:shadow-sm transition-all duration-200 flex items-center gap-3"
              >
                <div
                  className={`w-9 h-9 rounded-lg ${action.bg} flex items-center justify-center shrink-0`}
                >
                  <action.icon className={`h-4 w-4 ${action.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium group-hover:text-terracotta transition-colors">
                    {action.label}
                  </p>
                  <p className="text-xs text-muted-foreground truncate">
                    {action.description}
                  </p>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-muted-foreground/50 group-hover:text-terracotta transition-colors shrink-0" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}

function ApplicationCard({
  app,
  today,
}: {
  app: Application;
  today: Date;
}) {
  const submissionDate = new Date(app.submission_date + "T00:00:00");
  const status = getTimelineStatus(submissionDate, SPANISH_HOLIDAYS, today);
  const trackerUrl = app.registro_number
    ? `/status/tracker?registro=${encodeURIComponent(app.registro_number)}&date=${app.submission_date}`
    : null;

  return (
    <div className="group rounded-xl border border-border bg-card p-4 sm:p-5 hover:border-terracotta/30 hover:shadow-sm transition-all duration-200 flex items-center gap-4">
      <a
        href={trackerUrl ?? "#"}
        className="flex items-center gap-4 flex-1 min-w-0"
      >
        <div className="w-10 h-10 rounded-lg bg-terracotta/8 flex items-center justify-center shrink-0">
          {status.isPastThreshold ? (
            <CheckCircle className="h-5 w-5 text-olive" />
          ) : (
            <Clock className="h-5 w-5 text-terracotta" />
          )}
        </div>
        <div className="flex-1 min-w-0 space-y-0.5">
          <div className="flex items-center gap-2 flex-wrap">
            {app.registro_number && (
              <span className="font-mono text-xs bg-secondary px-2 py-0.5 rounded text-muted-foreground inline-flex items-center gap-1">
                <Hash className="h-2.5 w-2.5" />
                {app.registro_number}
              </span>
            )}
            <span className="text-xs text-muted-foreground">
              {STATUS_LABELS[app.current_status as StatusType] ?? app.current_status}
            </span>
          </div>
          <p className="text-sm text-muted-foreground">
            Submitted {format(submissionDate, "MMM d, yyyy")} &middot;{" "}
            <span className={status.isPastThreshold ? "text-olive font-medium" : "text-terracotta font-medium"}>
              {status.isPastThreshold
                ? "Past 20-day threshold"
                : `Day ${status.businessDaysElapsed} of 20`}
            </span>
          </p>
        </div>
      </a>
      <DeleteButton id={app.id} kind="application" />
    </div>
  );
}

function TIERecordCard({
  record,
  today,
}: {
  record: TIERecord;
  today: Date;
}) {
  const expiryDate = new Date(record.tie_expiry_date + "T00:00:00");
  const daysUntil = Math.ceil(
    (expiryDate.getTime() - today.getTime()) / 86400000
  );
  const isExpired = daysUntil < 0;
  const isUrgent = daysUntil >= 0 && daysUntil <= 14;

  const calendarEvents = [
    {
      title: "TIE Renewal Window Opens",
      date: record.renewal_window_start,
      description:
        "Your TIE renewal window opens today. You can now submit your renewal application at the Oficina de Extranjería.",
    },
    {
      title: "TIE Expiry Date",
      date: record.tie_expiry_date,
      description:
        "Your TIE card expires today. If you haven't renewed yet, file as soon as possible to avoid penalties.",
    },
    {
      title: "TIE Late Filing Deadline",
      date: record.late_deadline,
      description:
        "Last day to file a late renewal application (90 days after expiry). After this date you may face fines under Law 14/2013.",
    },
  ];

  return (
    <div className="group rounded-xl border border-border bg-card p-4 sm:p-5 hover:border-amber-warm/40 hover:shadow-sm transition-all duration-200 space-y-3">
      <div className="flex items-center gap-4">
        <a href="/track" className="flex items-center gap-4 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-amber-soft/50 flex items-center justify-center shrink-0">
            <CalendarDays className="h-5 w-5 text-amber-700" />
          </div>
          <div className="flex-1 min-w-0 space-y-0.5">
            <p className="text-sm font-medium">
              TIE expires {format(expiryDate, "MMM d, yyyy")}
            </p>
            <p className={`text-sm ${isExpired ? "text-destructive" : isUrgent ? "text-terracotta font-medium" : "text-muted-foreground"}`}>
              {isExpired
                ? `Expired ${Math.abs(daysUntil)} days ago`
                : isUrgent
                ? `${daysUntil} days left — renew now!`
                : `${daysUntil} days until expiry`}
            </p>
          </div>
        </a>
        <DeleteButton id={record.id} kind="tie" />
      </div>

      {/* Calendar export */}
      <CalendarButtons
        events={calendarEvents}
        filename="tie-renewal-dates"
        layout="stack"
      />
    </div>
  );
}

function EmptyState({
  icon: Icon,
  title,
  description,
  href,
  cta,
}: {
  icon: typeof Search;
  title: string;
  description: string;
  href: string;
  cta: string;
}) {
  return (
    <div className="rounded-xl border border-dashed border-border/60 bg-card/50 p-8 text-center space-y-3">
      <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center mx-auto">
        <Icon className="h-5 w-5 text-muted-foreground" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-xs text-muted-foreground max-w-xs mx-auto leading-relaxed">
          {description}
        </p>
      </div>
      <a
        href={href}
        className="inline-flex items-center gap-1.5 text-sm text-terracotta hover:text-terracotta-dark font-medium transition-colors"
      >
        {cta} <ArrowRight className="h-3.5 w-3.5" />
      </a>
    </div>
  );
}

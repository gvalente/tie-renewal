import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { addBusinessDays } from "@/lib/business-days";
import { SPANISH_HOLIDAYS } from "@/lib/holidays";
import { THRESHOLDS } from "@/lib/constants";
import { sendSilencioEmail, sendExpiryReminderEmail } from "@/lib/email";
import { format } from "date-fns";

// Admin client used to look up a user's email from auth.users — needed for email sends.
function adminClient() {
  return createAdminClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { persistSession: false } }
  );
}

async function getUserEmail(userId: string): Promise<{ email: string | null; fullName: string | null }> {
  try {
    const admin = adminClient();
    const { data, error } = await admin.auth.admin.getUserById(userId);
    if (error || !data?.user) return { email: null, fullName: null };
    const meta = (data.user.user_metadata ?? {}) as { full_name?: string };
    return { email: data.user.email ?? null, fullName: meta.full_name ?? null };
  } catch {
    return { email: null, fullName: null };
  }
}

// Vercel cron — runs daily at 08:00 UTC
// vercel.json: { "crons": [{ "path": "/api/cron/reminders", "schedule": "0 8 * * *" }] }

export async function GET(request: Request) {
  // Verify the request is from Vercel Cron
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = await createClient();
  const today = new Date();
  const todayStr = today.toISOString().slice(0, 10);

  const results = {
    silencioNotifications: 0,
    expiryNotifications: 0,
    errors: [] as string[],
  };

  // ── 1. Silencio administrativo threshold notifications ─────────────────────
  // Find applications that hit their 20-business-day threshold today
  const { data: applications, error: appsError } = await supabase
    .from("renewal_applications")
    .select("id, user_id, submission_date, registro_number")
    .eq("silencio_reached", false)
    .eq("current_status", "en_tramite");

  if (appsError) {
    results.errors.push(`Failed to fetch applications: ${appsError.message}`);
  } else if (applications) {
    for (const app of applications) {
      const submissionDate = new Date(app.submission_date + "T00:00:00");
      const thresholdDate = addBusinessDays(
        submissionDate,
        THRESHOLDS.SILENCIO_BUSINESS_DAYS,
        SPANISH_HOLIDAYS
      );
      const thresholdStr = thresholdDate.toISOString().slice(0, 10);

      if (thresholdStr === todayStr) {
        // Mark silencio reached
        await supabase
          .from("renewal_applications")
          .update({
            silencio_reached: true,
            threshold_date: thresholdStr,
            current_status: "silencio_positivo",
          })
          .eq("id", app.id);

        // Log notification
        await supabase.from("notifications_log").insert({
          user_id: app.user_id,
          notification_type: "silencio_reached",
        });

        const { email, fullName } = await getUserEmail(app.user_id);
        if (email) {
          const res = await sendSilencioEmail(email, {
            fullName,
            registroNumber: app.registro_number,
            thresholdDate: format(thresholdDate, "MMMM d, yyyy"),
          });
          if (!res.ok) {
            results.errors.push(`silencio email for ${app.id}: ${res.error}`);
          }
        }

        results.silencioNotifications++;
      }
    }
  }

  // ── 2. TIE expiry reminder notifications ───────────────────────────────────
  // Find TIE records expiring in 90, 60, 30, 14, or 7 days
  const { data: tieRecords, error: tieError } = await supabase
    .from("tie_records")
    .select(
      "id, user_id, tie_expiry_date, notify_90_days, notify_60_days, notify_30_days, notify_14_days, notify_7_days"
    );

  if (tieError) {
    results.errors.push(`Failed to fetch TIE records: ${tieError.message}`);
  } else if (tieRecords) {
    const notifyThresholds = [
      { days: 90, field: "notify_90_days" as const },
      { days: 60, field: "notify_60_days" as const },
      { days: 30, field: "notify_30_days" as const },
      { days: 14, field: "notify_14_days" as const },
      { days: 7, field: "notify_7_days" as const },
    ];

    for (const record of tieRecords) {
      const expiryDate = new Date(record.tie_expiry_date + "T00:00:00");
      const daysUntilExpiry = Math.ceil(
        (expiryDate.getTime() - today.getTime()) / 86400000
      );

      for (const threshold of notifyThresholds) {
        if (
          daysUntilExpiry === threshold.days &&
          record[threshold.field]
        ) {
          await supabase.from("notifications_log").insert({
            user_id: record.user_id,
            notification_type: `tie_expiry_${threshold.days}_days`,
          });

          const { email, fullName } = await getUserEmail(record.user_id);
          if (email) {
            const res = await sendExpiryReminderEmail(email, {
              fullName,
              expiryDate: format(expiryDate, "MMMM d, yyyy"),
              daysUntilExpiry: threshold.days,
            });
            if (!res.ok) {
              results.errors.push(`expiry email for ${record.id}: ${res.error}`);
            }
          }

          results.expiryNotifications++;
        }
      }
    }
  }

  return NextResponse.json({
    ok: true,
    date: todayStr,
    ...results,
  });
}

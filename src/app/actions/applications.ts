"use server";

import { createClient } from "@/lib/supabase/server";
import { getUserTier } from "@/lib/subscription";
import { revalidatePath } from "next/cache";

export async function saveTIERecord(tieExpiryDate: string, permitType = "hqp_pac") {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", id: null };

  const tier = await getUserTier(supabase);
  if (tier !== "pro") return { error: "Pro subscription required.", id: null };

  // Check if a TIE record with this expiry already exists for the user — update instead of duplicate
  const { data: existing } = await supabase
    .from("tie_records")
    .select("id")
    .eq("user_id", user.id)
    .eq("tie_expiry_date", tieExpiryDate)
    .maybeSingle();

  if (existing) {
    revalidatePath("/dashboard");
    return { error: null, id: existing.id as string };
  }

  const { data, error } = await supabase
    .from("tie_records")
    .insert({
      user_id: user.id,
      tie_expiry_date: tieExpiryDate,
      permit_type: permitType,
    })
    .select("id")
    .single();

  if (error) return { error: error.message, id: null };

  revalidatePath("/dashboard");
  return { error: null, id: data.id as string };
}

export async function deleteTIERecord(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("tie_records")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function deleteApplication(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const { error } = await supabase
    .from("renewal_applications")
    .delete()
    .eq("id", id)
    .eq("user_id", user.id);

  if (error) return { error: error.message };

  revalidatePath("/dashboard");
  return { error: null };
}

export async function saveApplication(registro: string, submissionDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", id: null };

  const tier = await getUserTier(supabase);
  if (tier !== "pro") return { error: "Pro subscription required.", id: null };

  // Upsert by registro_number so re-entering the same number doesn't duplicate
  const { data, error } = await supabase
    .from("renewal_applications")
    .upsert(
      {
        user_id: user.id,
        registro_number: registro,
        submission_date: submissionDate,
        current_status: "en_tramite",
      },
      { onConflict: "user_id,registro_number", ignoreDuplicates: false }
    )
    .select("id")
    .single();

  if (error) return { error: error.message, id: null };

  revalidatePath("/dashboard");
  return { error: null, id: data.id as string };
}

export async function updateNotifyPreference(
  recordId: string,
  field: "notify_90_days" | "notify_60_days" | "notify_30_days" | "notify_14_days" | "notify_7_days",
  value: boolean
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const tier = await getUserTier(supabase);
  if (tier !== "pro") return { error: "Pro subscription required." };

  const { error } = await supabase
    .from("tie_records")
    .update({ [field]: value })
    .eq("id", recordId)
    .eq("user_id", user.id);

  if (error) return { error: error.message };
  return { error: null };
}

export async function saveStatusCheck(
  applicationId: string,
  statusFound: string,
  checkMethod: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

  const tier = await getUserTier(supabase);
  if (tier !== "pro") return { error: "Pro subscription required." };

  // Verify the application belongs to this user
  const { data: app } = await supabase
    .from("renewal_applications")
    .select("id, current_status")
    .eq("id", applicationId)
    .eq("user_id", user.id)
    .single();

  if (!app) return { error: "Application not found" };

  const { error: checkError } = await supabase.from("status_checks").insert({
    application_id: applicationId,
    check_method: checkMethod,
    status_found: statusFound,
  });

  if (checkError) return { error: checkError.message };

  // Update current_status on the application
  await supabase
    .from("renewal_applications")
    .update({ current_status: statusFound, updated_at: new Date().toISOString() })
    .eq("id", applicationId);

  revalidatePath("/dashboard");
  revalidatePath(`/status/tracker`);
  return { error: null };
}

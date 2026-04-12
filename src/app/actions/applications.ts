"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";

export async function saveApplication(registro: string, submissionDate: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated", id: null };

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

export async function saveStatusCheck(
  applicationId: string,
  statusFound: string,
  checkMethod: string
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return { error: "Not authenticated" };

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

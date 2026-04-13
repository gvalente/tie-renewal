import { redirect } from "next/navigation";
import type { SupabaseClient } from "@supabase/supabase-js";

export type Tier = "free" | "pro";

export async function getUserTier(supabase: SupabaseClient): Promise<Tier> {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) return "free";

  const { data } = await supabase
    .from("profiles")
    .select("subscription_tier")
    .eq("id", user.id)
    .single();

  return (data?.subscription_tier as Tier) ?? "free";
}

export async function requirePro(supabase: SupabaseClient): Promise<void> {
  const tier = await getUserTier(supabase);
  if (tier !== "pro") {
    redirect("/pricing");
  }
}

export type ProFeature =
  | "renew_steps_4_5"
  | "save_application"
  | "save_status_check"
  | "status_tracking_history"
  | "email_notifications";

export function isProFeature(_tier: Tier, _feature: ProFeature): boolean {
  return _tier === "pro";
}

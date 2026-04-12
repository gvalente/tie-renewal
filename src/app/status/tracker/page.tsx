import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { TrackerContent } from "./TrackerContent";

type PageProps = {
  searchParams: Promise<Record<string, string>>;
};

export default async function TrackerPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const appId = params.appId ?? null;

  // Load saved status checks from DB if appId present
  let savedChecks: { id: string; checked_at: string; check_method: string; status_found: string }[] = [];
  if (appId) {
    try {
      const supabase = await createClient();
      const { data } = await supabase
        .from("status_checks")
        .select("id, checked_at, check_method, status_found")
        .eq("application_id", appId)
        .order("checked_at", { ascending: false })
        .limit(50);
      if (data) savedChecks = data;
    } catch {
      // DB not configured yet — continue stateless
    }
  }

  return (
    <Suspense
      fallback={
        <div className="max-w-3xl mx-auto px-4 py-16 text-center text-muted-foreground">
          Loading tracker...
        </div>
      }
    >
      <TrackerContent
        registro={params.registro ?? ""}
        dateStr={params.date ?? ""}
        appId={appId}
        savedChecks={savedChecks}
      />
    </Suspense>
  );
}

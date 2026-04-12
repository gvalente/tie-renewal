// Lightweight Resend client — uses the REST API directly so we don't pull in the
// SDK as a dependency. Gracefully skips when RESEND_API_KEY is missing so local
// dev and preview environments don't error.

type SendArgs = {
  to: string | string[];
  subject: string;
  html: string;
  text?: string;
};

type SendResult =
  | { ok: true; skipped: false; id: string }
  | { ok: true; skipped: true; reason: string }
  | { ok: false; skipped: false; error: string };

export async function sendEmail(args: SendArgs): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM ?? "noreply@renewmytie.com";

  if (!apiKey) {
    console.log(
      `[email] RESEND_API_KEY not set — skipping send to ${Array.isArray(args.to) ? args.to.join(", ") : args.to} (subject: "${args.subject}")`
    );
    return { ok: true, skipped: true, reason: "RESEND_API_KEY missing" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: Array.isArray(args.to) ? args.to : [args.to],
        subject: args.subject,
        html: args.html,
        text: args.text,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      return { ok: false, skipped: false, error: `Resend ${res.status}: ${body}` };
    }

    const data = (await res.json()) as { id?: string };
    return { ok: true, skipped: false, id: data.id ?? "unknown" };
  } catch (err) {
    return {
      ok: false,
      skipped: false,
      error: err instanceof Error ? err.message : "Unknown error",
    };
  }
}

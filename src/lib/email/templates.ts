// Plain HTML templates — kept as template functions so we can swap the renderer
// (react-email, MJML) later without changing call sites. Designed to degrade
// gracefully in plain-text clients via the companion .text variants.

const BRAND = {
  name: "RenewMyTIE",
  primary: "#C65D3B",
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL ?? "https://renewmytie.com",
};

function wrap(inner: string): string {
  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
  </head>
  <body style="margin:0;padding:0;background:#FAF7F2;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;color:#2D2420;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="padding:24px 12px;">
      <tr><td align="center">
        <table role="presentation" width="560" cellpadding="0" cellspacing="0" style="max-width:560px;background:#fff;border:1px solid #E8DFD3;border-radius:12px;overflow:hidden;">
          <tr><td style="background:${BRAND.primary};padding:16px 24px;color:#fff;font-weight:700;font-size:16px;">
            ${BRAND.name}
          </td></tr>
          <tr><td style="padding:28px 24px;font-size:15px;line-height:1.55;">
            ${inner}
          </td></tr>
          <tr><td style="padding:16px 24px;border-top:1px solid #E8DFD3;font-size:12px;color:#7A6D64;">
            Informational guidance only, not legal advice. Always verify with official sources.<br/>
            <a href="${BRAND.siteUrl}" style="color:${BRAND.primary};text-decoration:none;">${BRAND.siteUrl}</a>
          </td></tr>
        </table>
      </td></tr>
    </table>
  </body>
</html>`;
}

// ────────────────────────────────────────────────────────────────────────────
// Silencio administrativo reached (20 business days elapsed)
// ────────────────────────────────────────────────────────────────────────────

export type SilencioTemplateArgs = {
  fullName?: string | null;
  registroNumber?: string | null;
  thresholdDate: string; // formatted human string e.g. "April 12, 2026"
};

export function silencioTemplate(args: SilencioTemplateArgs) {
  const name = args.fullName ? args.fullName.split(" ")[0] : "there";
  const registro = args.registroNumber ?? "(no registro number on file)";
  const subject = `Silencio administrativo reached — your TIE renewal`;

  const html = wrap(`
    <h1 style="margin:0 0 12px;font-size:20px;">Hi ${escapeHtml(name)},</h1>
    <p>Your TIE renewal application has reached the <strong>20 business day threshold</strong> as of <strong>${escapeHtml(args.thresholdDate)}</strong>.</p>
    <p>Under Spanish administrative law, <em>silencio administrativo positivo</em> applies: your application is considered approved unless the administration has formally notified you otherwise.</p>
    <div style="background:#FFF8F1;border:1px solid #F1E2CF;border-radius:8px;padding:14px 16px;margin:16px 0;">
      <p style="margin:0 0 6px;font-size:13px;color:#7A6D64;">Application reference</p>
      <p style="margin:0;font-family:ui-monospace,Menlo,monospace;font-size:13px;">${escapeHtml(registro)}</p>
    </div>
    <p><strong>What to do next:</strong></p>
    <ol style="padding-left:20px;">
      <li>Check your application status on the Law 14/2013 portal and infoext2.</li>
      <li>If still "en trámite," you can request an <em>acreditación de silencio positivo</em>.</li>
      <li>Once confirmed, book a TIE card appointment at your local police station.</li>
    </ol>
    <p style="margin-top:24px;">
      <a href="${BRAND.siteUrl}/dashboard" style="display:inline-block;background:${BRAND.primary};color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;">Open dashboard</a>
    </p>
  `);

  const text = `Hi ${name},

Your TIE renewal application has reached the 20 business day threshold as of ${args.thresholdDate}.

Under Spanish administrative law, silencio administrativo positivo applies: your application is considered approved unless the administration has formally notified you otherwise.

Application: ${registro}

Next steps:
1. Check status on the Law 14/2013 portal and infoext2.
2. If still "en trámite," request an acreditación de silencio positivo.
3. Book a TIE card appointment at your local police station.

Dashboard: ${BRAND.siteUrl}/dashboard
`;

  return { subject, html, text };
}

// ────────────────────────────────────────────────────────────────────────────
// Expiry reminder (90 / 60 / 30 / 14 / 7 days before expiry)
// ────────────────────────────────────────────────────────────────────────────

export type ExpiryReminderArgs = {
  fullName?: string | null;
  expiryDate: string; // human format
  daysUntilExpiry: number;
};

export function expiryReminderTemplate(args: ExpiryReminderArgs) {
  const name = args.fullName ? args.fullName.split(" ")[0] : "there";
  const urgency = args.daysUntilExpiry <= 14 ? "URGENT" : args.daysUntilExpiry <= 30 ? "Soon" : "Heads up";
  const subject = `${urgency}: TIE expires in ${args.daysUntilExpiry} days (${args.expiryDate})`;

  const ctaLabel = args.daysUntilExpiry <= 60 ? "Start renewal now" : "Prepare your documents";

  const windowNote =
    args.daysUntilExpiry <= 60
      ? "Your renewal window is open — you can file today."
      : `You can start filing in ${args.daysUntilExpiry - 60} days (60 days before expiry).`;

  const html = wrap(`
    <h1 style="margin:0 0 12px;font-size:20px;">Hi ${escapeHtml(name)},</h1>
    <p>Your TIE expires on <strong>${escapeHtml(args.expiryDate)}</strong> — that's <strong>${args.daysUntilExpiry} days</strong> from today.</p>
    <div style="background:#FFF8F1;border:1px solid #F1E2CF;border-radius:8px;padding:14px 16px;margin:16px 0;">
      <p style="margin:0;">${escapeHtml(windowNote)}</p>
    </div>
    <p><strong>You need four documents:</strong></p>
    <ol style="padding-left:20px;">
      <li>Full passport copy (all pages, PDF)</li>
      <li>Tasa 790 payment receipt (€78.67)</li>
      <li>Employment contract, signed, all pages</li>
      <li>Formulario MIT (MOV-INT)</li>
    </ol>
    <p style="margin-top:24px;">
      <a href="${BRAND.siteUrl}/renew" style="display:inline-block;background:${BRAND.primary};color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;">${ctaLabel}</a>
    </p>
  `);

  const text = `Hi ${name},

Your TIE expires on ${args.expiryDate} — that's ${args.daysUntilExpiry} days from today.

${windowNote}

You need four documents:
1. Full passport copy
2. Tasa 790 payment receipt (€78.67)
3. Employment contract, signed
4. Formulario MIT (MOV-INT)

Start your renewal: ${BRAND.siteUrl}/renew
`;

  return { subject, html, text };
}

// ────────────────────────────────────────────────────────────────────────────
// Requerimiento — UGE has requested additional documents
// ────────────────────────────────────────────────────────────────────────────

export type RequeridoTemplateArgs = {
  fullName?: string | null;
  registroNumber?: string | null;
};

export function requeridoTemplate(args: RequeridoTemplateArgs) {
  const name = args.fullName ? args.fullName.split(" ")[0] : "there";
  const registro = args.registroNumber ?? "(no registro number on file)";
  const subject = `Action required: UGE has requested documents for your TIE renewal`;
  const portalUrl = "https://expinterweb.inclusion.gob.es/iley11/";

  const html = wrap(`
    <h1 style="margin:0 0 12px;font-size:20px;">Hi ${escapeHtml(name)},</h1>
    <p>UGE-CE has issued a <strong>requerimiento de documentación</strong> for your TIE renewal application — they are requesting additional documents.</p>
    <div style="background:#FFF8F1;border:1px solid #F1E2CF;border-radius:8px;padding:14px 16px;margin:16px 0;">
      <p style="margin:0 0 6px;font-size:13px;color:#7A6D64;">Application reference</p>
      <p style="margin:0;font-family:ui-monospace,Menlo,monospace;font-size:13px;">${escapeHtml(registro)}</p>
    </div>
    <p><strong>You must respond within 10 business days</strong> of the notification date. Missing this deadline may result in your application being denied.</p>
    <p><strong>What to do right now:</strong></p>
    <ol style="padding-left:20px;">
      <li>Log in to the Law 14/2013 portal with your digital certificate.</li>
      <li>Go to <em>Mis Trámites → Notificaciones</em> to see exactly what documents are needed.</li>
      <li>Gather and upload the requested documents through the portal.</li>
      <li>Note: the 20-day silencio countdown is <strong>paused</strong> while the requerimiento is open.</li>
    </ol>
    <p style="margin-top:24px;">
      <a href="${portalUrl}" style="display:inline-block;background:${BRAND.primary};color:#fff;text-decoration:none;padding:10px 18px;border-radius:8px;font-weight:600;">Open Law 14/2013 portal</a>
    </p>
  `);

  const text = `Hi ${name},

UGE-CE has issued a requerimiento de documentación for your TIE renewal application — they are requesting additional documents.

Application: ${registro}

You must respond within 10 business days of the notification date. Missing this deadline may result in your application being denied.

What to do right now:
1. Log in to the Law 14/2013 portal with your digital certificate.
2. Go to Mis Trámites → Notificaciones to see what documents are needed.
3. Gather and upload the requested documents through the portal.
4. Note: the 20-day silencio countdown is paused while the requerimiento is open.

Open portal: ${portalUrl}
Dashboard: ${BRAND.siteUrl}/dashboard
`;

  return { subject, html, text };
}

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

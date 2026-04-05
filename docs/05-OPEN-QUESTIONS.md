# Open Questions & Resolved Decisions

## Resolved ✅

### Portal → Law 14/2013 Sede Electrónica (expinterweb.inclusion.gob.es/iley11/)
Confirmed with screenshots and real application data. NOT Mercurio, NOT local extranjería.

### Status check URL → /consultaSolicitud/verExptesPresentador.action
Confirmed from founder's screenshot. Shows table: Fecha alta | Número registro | Estado expediente | Acuse de Recibo.

### Auth → Supabase Auth (email/password)
Enables email notifications and data persistence.

### Language → English-only, i18n-ready
Architecture uses translation layer from day 1. Future: es, ca.

### Scope → Renewals only
Initial applications are employer-handled. The app focuses exclusively on the renewal process that the permit holder files themselves.

### Fee → Tasa modelo 790, €78.67
Confirmed from real receipt. Payment via card through the portal.

### Documents → Only 4 required
Verified from real Acuse de Recibo: passport, fee receipt, work contract, Formulario MIT. Much simpler than most guides claim.

### Who files → The permit holder (TITULAR), not the employer
The employer handles initial applications; the candidate is responsible for their own renewal.

### Registration number format → REGAGE26eXXXXXXXXXXX
Not a 15-char expediente. Confirmed from real Acuse de Recibo.

### Founder's current status
- Submitted: March 2, 2026
- Status: "En trámite" as of April 6, 2026
- Business days elapsed: ~25 (well past 20-day threshold)
- No requerimiento received
- Silencio administrativo positivo should apply

### App name → RenewMyTIE or TIEHelper
Something highlighting "TIE". Will finalize during build.

---

## Still To Validate During Build

- **Exact silencio positivo request process** — how exactly to request the certificate. The docs describe multiple methods but this hasn't been tested firsthand yet.
- **Viernes Santo dates for 2028+** — Easter is moveable; holiday table needs annual updates.
- **Whether infoext2 shows HQP/PAC applications** or only general extranjería ones.
- **Post-approval TIE appointment** — exact documents and process for getting the new physical card.

---

## Future Feature Backlog

### v1.1 (Near-term)
- **WhatsApp bot** — status reminders via messaging
- **Google Calendar integration** — add key dates with one click
- **Spanish + Catalan** — flip the i18n switch

### v2
- Community anonymized data (average processing times)
- Multi-permit support (Digital Nomad, Blue Card)
- Employer/HR dashboard
- Document scanner (OCR TIE card → auto-fill expiry + NIE)

### v3
- Lawyer marketplace
- Browser extension for government portal
- Renewal prep service (paid document review)

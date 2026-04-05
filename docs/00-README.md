# RenewMyTIE — Project Documentation

## Document Index

| File | Contents |
|------|----------|
| `CLAUDE.md` | **Start here.** Claude Code instructions: stack, decisions, verified domain knowledge, portal URLs, real application data |
| `01-PROJECT-BRIEF.md` | Product vision, user problems, MVP scope, success criteria |
| `02-REGULATORY-CONTEXT.md` | Complete renewal process (verified against real application), government portal details, document requirements, authentication, pitfalls |
| `03-USER-FLOWS.md` | 3 personas, 5 user flows, screen descriptions, edge cases |
| `04-TECHNICAL-ARCHITECTURE.md` | Stack, SQL data model with RLS, business day calculator (TypeScript), constants, page structure, 6 milestones |
| `05-OPEN-QUESTIONS.md` | Resolved decisions, validation items, future backlog |

## Key Facts (Verified from Real Application)

- **Portal:** `expinterweb.inclusion.gob.es/iley11/` (Law 14/2013 Sede Electrónica)
- **Fee:** Tasa 790, €78.67
- **Documents:** Only 4 — passport, fee receipt, work contract, application form (MIT)
- **Who files:** The permit holder (not employer)
- **Registration format:** REGAGE26eXXXXXXXXXXX
- **Silence rule:** 20 business days → auto-approved if no response
- **Scope:** Renewals only (not initial applications)

## Build Priority

1. **Status Tracker** — founder actively past 20-day threshold
2. **Business Day Calculator** — core logic, needs tests
3. **TIE Expiry Tracker** — recurring value
4. **Guided Renewal** — content-heavy
5. **Email Notifications** — polish

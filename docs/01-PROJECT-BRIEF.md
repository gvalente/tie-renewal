# RenewMyTIE — Project Brief

## What This Is
A web app that guides non-EU expats in Spain through **renewing** their TIE (Tarjeta de Identidad de Extranjero), focused on Highly Qualified Professional (HQP/PAC) permit holders under Law 14/2013. Renewals only — initial applications are handled by employers.

## Core User Problems

1. **Confusion about which process to follow.** HQP renewals go through a specific Law 14/2013 portal (Ministry of Inclusion's Sede Electrónica) — NOT local Oficinas de Extranjería, NOT the Mercurio platform. Users frequently apply to the wrong place. The founder made this mistake himself.

2. **Not knowing when to start.** Renewal window opens 60 days before TIE expiry. Late filing (up to 90 days after expiry) is allowed but risks a fine. Users don't track dates.

3. **The 20-day waiting limbo.** After submission, the UGE has 20 business days to respond. No response = auto-approved (silencio administrativo positivo). But users don't know how to count business days, don't know what silencio means, and keep anxiously checking the portal. The founder is currently in this exact situation — submitted March 2, 2026, still showing "En trámite" 25+ business days later with no requerimiento.

4. **Status checking is painful.** Requires logging into the portal with a digital certificate every time. No push notifications. Multiple channels (portal, SMS, phone) but none are proactive.

5. **The renewal process was unfamiliar.** Even though the initial application was handled by the employer, the candidate is responsible for their own renewal. The founder's employer didn't help — it was all new.

## Target User
- Non-EU tech professionals in Spain on HQP/PAC permits (Barcelona, Madrid)
- 25-45, English-speaking, employed at tech companies, €40K-€80K+
- Comfortable with tech but overwhelmed by Spanish bureaucracy
- Willingness to pay: €20+ to remove anxiety

## Key Principles
- **Simplicity:** Minimal UI, plain English, no jargon without explanation
- **Clarity:** Always know where you are, what to do next, what to expect
- **Ease:** Centralize everything in one place — the app IS the process
- **Own the UX:** The government portal has terrible UX. We build a clean, modern interface.

## MVP Scope (~1 week build)

### Feature 1: Status Tracker Dashboard
- Enter registro number (REGAGE format) + submission date
- Business day calculator with Spanish national holidays
- Countdown to 20-day silencio threshold
- Links to all status-checking methods (portal, SMS, phone)
- Manual status update logging with guidance per status
- Silencio administrativo guide when past 20 days
- Support for users who already applied (like the founder)

### Feature 2: TIE Expiry Tracker & Reminders
- Enter TIE expiry date → see key dates (60-day window, expiry, 90-day deadline)
- Email notifications at 90, 60, 30, 14, 7 days before expiry
- Dashboard with timeline visualization

### Feature 3: Guided Renewal Walkthrough
- Step-by-step for HQP/PAC renewals
- Document checklist (verified: only 4 documents needed!)
- Links to portal, fee payment, certificate setup
- Eligibility check (right permit type? same employer?)

### NOT in MVP
- Automated status checking via government APIs
- Form submission on behalf of users
- Multi-language (English-only, but i18n-ready architecture)
- Mobile native app (responsive web)
- Initial application flow (employer handles that)

## Success Criteria
1. Working, deployable web app within ~1 week
2. Founder can use it for his active renewal (status tracking)
3. Business day calculator correctly handles Spanish holidays
4. Document checklist matches real-world requirements
5. Scalable to hundreds of users
6. i18n-ready for future Spanish/Catalan

## Future Ideas (Post-MVP)
- WhatsApp/Telegram bot for status notifications
- Google Calendar integration (add key dates)
- Community processing time data
- Multi-permit support (Digital Nomad, Blue Card)
- Employer/HR dashboard

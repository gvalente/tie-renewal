# User Flows & Journey Maps

## Personas

### "Already Applied" — Gino (the founder's actual situation)
- Product person from the US, in Barcelona on HQP/PAC
- Filed renewal March 2, status still "En trámite" on April 6 — well past 20 business days
- No requerimiento received but doesn't know what to do about silencio administrativo
- Keeps logging into the portal with his digital certificate to check — annoying

### "New to Renewal" — Ana
- Senior engineer from Brazil, 2 years in Barcelona, first renewal approaching
- Employer handled the initial application — renewal is completely unfamiliar
- Has FNMT certificate from tax filing but doesn't know what documents she needs
- Willing to pay for peace of mind

### "Procrastinator" — Priya
- Data scientist from India, TIE expired 2 weeks ago
- Didn't know about the 60-day early window
- Panicking — needs reassurance she can still file (within 90 days)

---

## Flow 1: Landing Page → Routing

```
[Landing Page]
  Hero: "TIE Renewal, simplified."
  Sub: "The stress-free guide for highly qualified professionals in Spain"
  │
  Three cards:
  ├─ "📅 Track my TIE expiry" → Flow 2 (Expiry Tracker)
  ├─ "📋 Guide me through renewal" → Flow 3 (Guided Walkthrough)
  └─ "🔍 I already applied" → Flow 4 (Status Tracker)
  
  Trust: "Built by an expat who's been through it"
  Disclaimer: "Informational guidance, not legal advice"
```

## Flow 2: TIE Expiry Tracker

```
[Enter TIE Details]
  - TIE expiry date (required)
  - Email (for notifications)
  - NIE (optional)
  - Name (optional)
      │
      [Dashboard]
      - Visual timeline:
        • 60-day window opening
        • Today
        • TIE expiry date
        • 90-day late deadline
      - Status badge: "No action needed" / "Window open" / "Urgent" / "Expired"
      - Next action card (what to do NOW)
      - Notification preferences (90, 60, 30, 14, 7 days)
      - When window opens → CTA to guided renewal
```

## Flow 3: Guided Renewal Walkthrough

```
[Step 0: Eligibility Check]
  - Are you on HQP/PAC (Law 14/2013)?
  - Still with same employer?
  - Still meeting salary threshold?
  → If unsure about permit type: help identify from TIE card
  → If employer changed: warning — need new application, not renewal
      │
[Step 1: Authentication Setup]
  - Do you have FNMT digital certificate?
    • Yes → verify not expired
    • No → guide to obtain (FNMT in-person or video ID)
  - Do you have AutoFirma installed?
    • Yes → continue
    • No → download link + install guide
  - Tip: test your certificate on the portal BEFORE submission day
      │
[Step 2: Pay the Fee]
  - Direct link to Tasa 790 payment portal
  - Amount: €78.67
  - Pay with card online
  - SAVE the receipt PDF
  - NOTE the NRC (reference number) — you'll need it in the application
  □ Mark as done
      │
[Step 3: Gather Documents]
  - Interactive checklist (only 4 items!):
    □ Full passport copy (ALL pages, single PDF)
    □ Tasa 790 payment receipt (from Step 2)
    □ Employment contract (signed by you AND company, all pages, PDF)
    □ Formulario MIT / MOV-INT (signed application form, PDF)
  - Each item expandable with:
    • What it is in plain English
    • Format: PDF, legible, total <24MB
  - Progress bar: "3 of 4 ready"
  - Note: "That's really all you need — simpler than most guides say!"
      │
[Step 4: Submit Application]
  Step-by-step walkthrough:
  1. Go to Law 14/2013 portal → Alta Solicitud (direct link)
  2. Authenticate with digital certificate
  3. Fill in Type of Application:
     - Applicant: HOLDER
     - Type: RENEWAL
     - Subtype: HOLDER OF INTERNATIONAL MOBILITY RESIDENCE PERMIT
  4. Fill in Authorization:
     - Type: HIGHLY QUALIFIED NATIONAL PROFESSIONAL
     - Subtype: GRADUATES/POSTGRADUATES/SPECIALISTS
  5. Fill in personal details (name, NIE, passport, address, etc.)
  6. Enter NRC reference number from fee payment
  7. Fill in company details (name, NIF)
  8. Choose electronic notifications (recommend: "I agree")
  9. Upload 4 documents
  10. Review → Submit and Sign (AutoFirma)
  11. Download BOTH PDFs: Acuse de Recibo + Application details
  
  ⚠️ SAVE YOUR ACUSE DE RECIBO — contains your Número de registro
      │
[Step 5: Done! Now What?]
  - Congratulations screen
  - Summary:
    • Your TIE remains valid while processing
    • UGE has 20 business days to respond
    • No response = auto-approved (silencio administrativo)
  - Prompt: "Enter your Número de registro to track your status"
  → Transition to Flow 4
```

## Flow 4: Status Tracker (Post-Submission)

```
[Enter Application Details]
  - Número de registro (REGAGE format)
  - Submission date (Fecha alta)
  - NIE (optional, for SMS checking)
      │
[Status Dashboard]
      │
├─ Progress Timeline (main visual)
│   - Day 0: "Submitted" with date
│   - Progress bar: Day X / 20 business days
│   - Day 20 threshold marked prominently
│   - Current position highlighted
│   - Calendar view below showing business days, weekends (gray), holidays (red)
│
├─ Status Card (dynamic)
│   - day < 15: "In review — X business days remaining. This is normal."
│   - day 15-19: "Getting close — X days until auto-approval threshold."
│   - day = 20: "Today is the 20-day threshold! Check your status now."
│   - day > 20: "Past the 20-day threshold. If no requerimiento, your
│     renewal should be approved via silencio administrativo positivo."
│     → Show silencio guide (see below)
│
├─ "Check Your Status" — Quick Actions
│   1. 🌐 Law 14/2013 Portal (direct link to status check page)
│   2. 🌐 infoext2 Portal (no certificate needed)
│   3. 📱 SMS: "NIE [number]" → 651 714 610
│   4. 📞 Phone: 902 02 22 22
│
├─ Manual Status Log
│   User taps what they saw:
│   "Still in process" | "Documents requested" | "Approved!" | "Denied"
│   → Each triggers contextual guidance
│   → History log with timestamps
│
├─ If "Requerido" (Documents Requested)
│   ⚠️ Alert
│   - Check notifications section of portal (link)
│   - You have 10 business days to respond
│   - 20-day clock is PAUSED
│   - Show new deadline timer
│
├─ If "Favorable" (Approved!) 🎉
│   Next steps checklist:
│   □ Download resolution from portal notifications
│   □ Book TIE cita previa at police station
│   □ Prepare: resolution, passport, current TIE, photo, empadronamiento, Tasa 790-012
│   □ Attend appointment (fingerprints)
│   □ Collect new TIE in 30-45 days
│   □ Update expiry date in app for next renewal!
│
└─ If Past 20 Days + No Response (Silencio Guide)
    1. "First: confirm no requerimiento was issued"
       → Check notifications (link to tramiteSel=3)
       → Check infoext2
    2. "If confirmed → your renewal is legally approved"
    3. "Request certificate of positive silence from UGE-CE:"
       - Via Sede Electrónica (with certificate)
       - Via email to movilidad.internacional@inclusion.gob.es
       - Via any Registro Público
    4. "UGE-CE typically issues formal resolution shortly after"
    5. Once resolved → proceed to TIE appointment
```

## Flow 5: Permit Type Identifier ("I'm not sure what permit I have")

```
[Guided Diagnostic]
  Show TIE card diagram → where to find permit type
  Questions:
  1. Did your employer/company apply for your permit?
  2. Was it processed through UGE (not local office)?
  3. Are you earning above ~€40K/year?
  4. Was your initial permit for 2+ years?
  → Mostly yes: "You're likely on HQP/PAC"
  → Otherwise: brief info + suggest consulting a lawyer
```

---

## Edge Cases

1. **TIE expired, within 90 days:** Reassure + urgency. Can still file, risk of fine.
2. **TIE expired >90 days:** May need new application. Advise lawyer.
3. **Employer changed:** HQP is employer-tied. New application needed.
4. **Different permit type:** Graceful redirect — this tool is for HQP/PAC renewals.
5. **Requerimiento received:** Pause 20-day clock, show response deadline + guidance.
6. **No digital certificate:** Block submission steps, guide through obtaining one first.
7. **Lost registro number:** Check Acuse de Recibo PDF, or log into portal (it shows your applications).
8. **Past 20 days, still En trámite:** This is the founder's exact situation. Silencio guide is critical.
9. **Denied:** Show appeal process (recurso de alzada), suggest lawyer, provide UGE contact.

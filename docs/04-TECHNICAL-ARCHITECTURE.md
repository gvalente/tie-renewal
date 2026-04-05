# Technical Architecture & Implementation Plan

## Stack

- **Framework:** Next.js 14+ (App Router), TypeScript
- **Styling:** Tailwind CSS + shadcn/ui
- **Database + Auth:** Supabase (PostgreSQL + Auth + RLS)
- **Email:** Resend (free tier: 100 emails/day)
- **Cron:** Vercel Cron Functions (daily reminder checks)
- **Dates:** date-fns
- **i18n:** JSON locale files + helper function (next-intl for future)
- **Deploy:** Vercel (free tier)

## Data Model

```sql
-- ============================================================
-- PROFILES
-- ============================================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  full_name TEXT,
  nie TEXT,  -- Format: X/Y/Z + 7 digits + letter
  preferred_locale TEXT DEFAULT 'en',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- TIE_RECORDS — expiry tracking
-- ============================================================
CREATE TABLE tie_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  permit_type TEXT NOT NULL DEFAULT 'hqp_pac',
  tie_expiry_date DATE NOT NULL,
  
  -- Notifications
  notify_90_days BOOLEAN DEFAULT true,
  notify_60_days BOOLEAN DEFAULT true,
  notify_30_days BOOLEAN DEFAULT true,
  notify_14_days BOOLEAN DEFAULT true,
  notify_7_days BOOLEAN DEFAULT true,
  
  -- Computed
  renewal_window_start DATE GENERATED ALWAYS AS (tie_expiry_date - INTERVAL '60 days') STORED,
  late_deadline DATE GENERATED ALWAYS AS (tie_expiry_date + INTERVAL '90 days') STORED,
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- RENEWAL_APPLICATIONS — post-submission tracking
-- ============================================================
CREATE TABLE renewal_applications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  tie_record_id UUID REFERENCES tie_records(id) ON DELETE SET NULL,
  
  -- Application identifiers (from Acuse de Recibo)
  registro_number TEXT,  -- Format: REGAGE26eXXXXXXXXXXX
  nrc_reference TEXT,    -- NRC from fee payment (e.g., 7900381129304DZS28LMK8)
  submission_date DATE NOT NULL,  -- "Fecha alta"
  
  -- Status
  current_status TEXT DEFAULT 'submitted',
  -- 'submitted', 'en_tramite', 'pendiente_informes', 'requerido',
  -- 'resuelto_favorable', 'resuelto_no_favorable', 'silencio_positivo'
  
  -- 20-day tracking (threshold_date calculated by app, stored for convenience)
  threshold_date DATE,
  silencio_reached BOOLEAN DEFAULT false,
  
  -- Requerimiento
  requerimiento_date DATE,
  requerimiento_deadline DATE,
  requerimiento_responded BOOLEAN DEFAULT false,
  
  -- Resolution
  resolution_date DATE,
  resolution_type TEXT,  -- 'favorable', 'no_favorable', 'silencio_positivo'
  
  -- Document checklist (JSON)
  checklist_progress JSONB DEFAULT '{}',
  
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- STATUS_CHECKS — log of manual checks
-- ============================================================
CREATE TABLE status_checks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  application_id UUID NOT NULL REFERENCES renewal_applications(id) ON DELETE CASCADE,
  checked_at TIMESTAMPTZ DEFAULT NOW(),
  check_method TEXT NOT NULL,  -- 'portal', 'infoext2', 'sms', 'phone'
  status_found TEXT NOT NULL,
  notes TEXT
);

-- ============================================================
-- NOTIFICATIONS_LOG
-- ============================================================
CREATE TABLE notifications_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  notification_type TEXT NOT NULL,
  sent_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- SPANISH_HOLIDAYS — for business day calculation
-- ============================================================
CREATE TABLE spanish_holidays (
  id SERIAL PRIMARY KEY,
  holiday_date DATE NOT NULL UNIQUE,
  name_en TEXT NOT NULL,
  name_es TEXT,
  year INTEGER NOT NULL
);

INSERT INTO spanish_holidays (holiday_date, name_en, name_es, year) VALUES
  ('2025-01-01', 'New Year', 'Año Nuevo', 2025),
  ('2025-01-06', 'Epiphany', 'Epifanía', 2025),
  ('2025-04-18', 'Good Friday', 'Viernes Santo', 2025),
  ('2025-05-01', 'Labour Day', 'Día del Trabajador', 2025),
  ('2025-08-15', 'Assumption', 'Asunción', 2025),
  ('2025-10-12', 'National Day', 'Fiesta Nacional', 2025),
  ('2025-11-01', 'All Saints', 'Todos los Santos', 2025),
  ('2025-12-06', 'Constitution Day', 'Día de la Constitución', 2025),
  ('2025-12-08', 'Immaculate Conception', 'Inmaculada Concepción', 2025),
  ('2025-12-25', 'Christmas', 'Navidad', 2025),
  ('2026-01-01', 'New Year', 'Año Nuevo', 2026),
  ('2026-01-06', 'Epiphany', 'Epifanía', 2026),
  ('2026-04-03', 'Good Friday', 'Viernes Santo', 2026),
  ('2026-05-01', 'Labour Day', 'Día del Trabajador', 2026),
  ('2026-08-15', 'Assumption', 'Asunción', 2026),
  ('2026-10-12', 'National Day', 'Fiesta Nacional', 2026),
  ('2026-11-01', 'All Saints', 'Todos los Santos', 2026),
  ('2026-12-06', 'Constitution Day', 'Día de la Constitución', 2026),
  ('2026-12-08', 'Immaculate Conception', 'Inmaculada Concepción', 2026),
  ('2026-12-25', 'Christmas', 'Navidad', 2026),
  ('2027-01-01', 'New Year', 'Año Nuevo', 2027),
  ('2027-01-06', 'Epiphany', 'Epifanía', 2027),
  ('2027-03-26', 'Good Friday', 'Viernes Santo', 2027),
  ('2027-05-01', 'Labour Day', 'Día del Trabajador', 2027),
  ('2027-08-15', 'Assumption', 'Asunción', 2027),
  ('2027-10-12', 'National Day', 'Fiesta Nacional', 2027),
  ('2027-11-01', 'All Saints', 'Todos los Santos', 2027),
  ('2027-12-06', 'Constitution Day', 'Día de la Constitución', 2027),
  ('2027-12-08', 'Immaculate Conception', 'Inmaculada Concepción', 2027),
  ('2027-12-25', 'Christmas', 'Navidad', 2027);

-- ============================================================
-- ROW LEVEL SECURITY
-- ============================================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE tie_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE renewal_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE status_checks ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE spanish_holidays ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users own profile" ON profiles FOR ALL USING (auth.uid() = id);
CREATE POLICY "Users own tie_records" ON tie_records FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own applications" ON renewal_applications FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users own status_checks" ON status_checks FOR ALL
  USING (application_id IN (SELECT id FROM renewal_applications WHERE user_id = auth.uid()));
CREATE POLICY "Users own notifications" ON notifications_log FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Public holidays" ON spanish_holidays FOR SELECT USING (true);
```

## Business Day Calculator

```typescript
// lib/business-days.ts
import { eachDayOfInterval, isWeekend, format, addDays } from 'date-fns';

export function isBusinessDay(date: Date, holidays: string[]): boolean {
  if (isWeekend(date)) return false;
  return !holidays.includes(format(date, 'yyyy-MM-dd'));
}

export function countBusinessDays(start: Date, end: Date, holidays: string[]): number {
  if (end <= start) return 0;
  return eachDayOfInterval({ start: addDays(start, 1), end })
    .filter(d => isBusinessDay(d, holidays)).length;
}

export function addBusinessDays(start: Date, n: number, holidays: string[]): Date {
  let current = new Date(start);
  let count = 0;
  while (count < n) {
    current = addDays(current, 1);
    if (isBusinessDay(current, holidays)) count++;
  }
  return current;
}

export function calculateThresholdDate(submissionDate: Date, holidays: string[]): Date {
  return addBusinessDays(submissionDate, 20, holidays);
}

export interface TimelineStatus {
  businessDaysElapsed: number;
  businessDaysRemaining: number;
  thresholdDate: Date;
  isPastThreshold: boolean;
  percentComplete: number;
  urgency: 'normal' | 'approaching' | 'threshold' | 'past';
}

export function getTimelineStatus(submissionDate: Date, holidays: string[], today = new Date()): TimelineStatus {
  const elapsed = countBusinessDays(submissionDate, today, holidays);
  const thresholdDate = calculateThresholdDate(submissionDate, holidays);
  const capped = Math.min(elapsed, 20);
  
  return {
    businessDaysElapsed: capped,
    businessDaysRemaining: Math.max(0, 20 - elapsed),
    thresholdDate,
    isPastThreshold: today >= thresholdDate,
    percentComplete: Math.min(100, (capped / 20) * 100),
    urgency: capped >= 20 ? 'past' : capped >= 18 ? 'threshold' : capped >= 15 ? 'approaching' : 'normal',
  };
}

export interface ExpiryDates {
  renewalWindowOpens: Date;
  expiryDate: Date;
  lateDeadline: Date;
  phase: 'too_early' | 'window_open' | 'urgent' | 'expired_can_file' | 'expired_too_late';
  daysUntilExpiry: number;
}

export function getExpiryDates(tieExpiry: Date, today = new Date()): ExpiryDates {
  const windowOpens = addDays(tieExpiry, -60);
  const lateDeadline = addDays(tieExpiry, 90);
  const daysUntil = Math.ceil((tieExpiry.getTime() - today.getTime()) / 86400000);

  let phase: ExpiryDates['phase'];
  if (today < windowOpens) phase = 'too_early';
  else if (today < addDays(tieExpiry, -14)) phase = 'window_open';
  else if (today <= tieExpiry) phase = 'urgent';
  else if (today <= lateDeadline) phase = 'expired_can_file';
  else phase = 'expired_too_late';

  return { renewalWindowOpens: windowOpens, expiryDate: tieExpiry, lateDeadline, phase, daysUntilExpiry: daysUntil };
}
```

## Constants

```typescript
// lib/constants.ts
export const PORTAL = {
  BASE: 'https://expinterweb.inclusion.gob.es/iley11/inicio/showTramites.action?procedimientoSel=200&proc=1',
  SUBMIT: 'https://expinterweb.inclusion.gob.es/iley11/inicio/elegirTramite.action?tramiteSel=1&procedimientoSel=200&proc=1',
  STATUS: 'https://expinterweb.inclusion.gob.es/iley11/consultaSolicitud/verExptesPresentador.action',
  NOTIFICATIONS: 'https://expinterweb.inclusion.gob.es/iley11/inicio/elegirTramite.action?tramiteSel=3&procedimientoSel=200&proc=1',
  FEE_PAYMENT: 'https://expinterweb.inclusion.gob.es/Tasa038/presentarFormulario038.action',
  INFOEXT2: 'https://sede.administracionespublicas.gob.es/infoext2/',
  FNMT: 'https://www.sede.fnmt.gob.es',
  CLAVE: 'https://clave.gob.es',
  AUTOFIRMA: 'https://firmaelectronica.gob.es/Home/Descargas.html',
  INFO: 'https://sede.inclusion.gob.es/-/presentacion-solicitudes-autorizacion-residencia',
  FORMS: 'http://extranjeros.inclusion.gob.es/es/ModelosSolicitudes/ley_14_2013/index.html',
  DOCS_PDF: 'https://www.inclusion.gob.es/documents/1823432/1826095/renovaciones_ingles_feb_2018.pdf',
} as const;

export const CONTACT = {
  UGE_EMAIL: 'movilidad.internacional@inclusion.gob.es',
  SMS: '651 714 610',
  PHONE: '902 02 22 22',
  PHONE_ALT: '060',
} as const;

export const THRESHOLDS = {
  RENEWAL_WINDOW_DAYS: 60,
  LATE_FILING_DAYS: 90,
  SILENCIO_BUSINESS_DAYS: 20,
  REQUERIMIENTO_RESPONSE_DAYS: 10,
} as const;

export const FEE = {
  MODEL: '790',
  AMOUNT_EUR: 78.67,
  DESCRIPTION: 'Tasa modelo 790',
} as const;

export const STATUSES = {
  SUBMITTED: 'submitted',
  EN_TRAMITE: 'en_tramite',
  PENDIENTE_INFORMES: 'pendiente_informes',
  REQUERIDO: 'requerido',
  RESUELTO_FAVORABLE: 'resuelto_favorable',
  RESUELTO_NO_FAVORABLE: 'resuelto_no_favorable',
  SILENCIO_POSITIVO: 'silencio_positivo',
} as const;

// Verified document requirements (only 4!)
export const REQUIRED_DOCUMENTS = [
  { id: 'passport', label: 'Full passport copy', description: 'All pages, single PDF' },
  { id: 'fee_receipt', label: 'Tasa 790 payment receipt', description: 'Downloaded after paying €78.67 online' },
  { id: 'contract', label: 'Employment contract', description: 'Signed by you AND your company, all pages, PDF' },
  { id: 'formulario_mit', label: 'Formulario MIT (MOV-INT)', description: 'Application form, signed by you, PDF' },
] as const;
```

## Page Structure

```
app/
├── layout.tsx                    # Root layout
├── page.tsx                      # Landing page (3 entry points)
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── dashboard/
│   ├── page.tsx                  # Main hub
│   └── layout.tsx
├── track/page.tsx                # TIE expiry setup
├── renew/
│   ├── page.tsx                  # Overview / progress
│   ├── eligibility/page.tsx      # Step 0
│   ├── authentication/page.tsx   # Step 1
│   ├── payment/page.tsx          # Step 2
│   ├── documents/page.tsx        # Step 3
│   ├── submit/page.tsx           # Step 4
│   └── complete/page.tsx         # Step 5 → status tracker
├── status/
│   ├── page.tsx                  # Enter registro + date
│   └── [applicationId]/page.tsx  # Status dashboard
├── guide/
│   ├── page.tsx                  # Knowledge base
│   ├── hqp-overview/page.tsx
│   ├── authentication/page.tsx
│   ├── silencio/page.tsx
│   └── after-approval/page.tsx
├── api/cron/reminders/route.ts   # Daily cron
├── components/
│   ├── ui/                       # shadcn/ui
│   ├── Timeline.tsx
│   ├── BusinessDayCalendar.tsx
│   ├── StatusBadge.tsx
│   ├── DocumentChecklist.tsx
│   ├── CountdownCard.tsx
│   ├── QuickLinks.tsx
│   └── StepProgress.tsx
├── lib/
│   ├── business-days.ts
│   ├── constants.ts
│   ├── supabase/
│   │   ├── client.ts
│   │   └── server.ts
│   └── i18n.ts
└── locales/
    ├── en.json
    ├── es.json    # stub
    └── ca.json    # stub
```

## Milestones

### M1: Foundation (Day 1-2)
- [ ] Init Next.js + Tailwind + shadcn/ui
- [ ] Supabase project (tables, RLS, auth)
- [ ] i18n scaffolding (en.json + t())
- [ ] constants.ts with all portal URLs
- [ ] Business day calculator + unit tests
- [ ] Landing page
- [ ] Auth (signup, login, logout)

### M2: Status Tracker (Day 2-3) — HIGHEST PRIORITY
- [ ] Registro number + date input form
- [ ] Timeline status calculation
- [ ] Status dashboard with progress bar + countdown
- [ ] Business day calendar component
- [ ] Quick links (4 status check methods)
- [ ] Manual status logging
- [ ] Silencio administrativo guide (past 20 days)

### M3: TIE Expiry Tracker (Day 3-4)
- [ ] TIE details input form
- [ ] Expiry date calculations + timeline
- [ ] Dashboard hub
- [ ] Notification preferences UI

### M4: Guided Renewal (Day 4-5)
- [ ] Multi-step wizard
- [ ] Eligibility check
- [ ] Document checklist (4 items, persistent)
- [ ] Step content (auth, payment, docs, submit)
- [ ] Completion → status tracker transition

### M5: Notifications + Polish (Day 5-6)
- [ ] Resend integration
- [ ] Email templates
- [ ] Daily cron for reminders
- [ ] Responsive pass
- [ ] Legal disclaimer
- [ ] End-to-end testing

### M6: Deploy + Iterate (Day 7+)
- [ ] Deploy to Vercel
- [ ] Test with founder's live case (submitted March 2, past threshold)
- [ ] Fix bugs, iterate

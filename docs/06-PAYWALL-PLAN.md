# Paywall Implementation Plan — RenewMyTIE

## Context

RenewMyTIE currently offers all features free to authenticated users. The goal is to add a **$20 one-time payment** that unlocks "Pro" access, capturing value from users who need the full guided renewal experience and persistent status tracking — while keeping the top-of-funnel (guides, education, one-time status check, expiry notifications) free forever.

A one-time payment (not recurring subscription) is the right fit because:
- TIE holders renew every 2 years — subscriptions feel punitive for a seasonal task
- $20 lifetime unlock is a clear value exchange against a stressful, high-stakes process
- Subscription management overhead is not worth it at this scale

---

## Tier Definitions

### Free (no payment required, auth still needed for saved data)
| Feature | Notes |
|---|---|
| All `/guide/*` knowledge base articles | Public, no auth |
| TIE expiry date calculator (`/track`) | No save to dashboard |
| One-time status check (`/status` → `/status/tracker`) | No save, no history |
| Expiry reminder notification sign-up | Signup only; no tracking updates |
| General educational content on `/renew` (Steps 0–3) | Eligibility, docs, fee — the "what to prepare" |

### Pro — $20 one-time
| Feature | Notes |
|---|---|
| Full guided `/renew` walkthrough (Steps 4–5) | Submit + Done/What's Next |
| Persistent dashboard with saved applications & TIE records | Unlimited saves |
| Status tracking history (`status_checks` log) | All check methods logged |
| Automatic next-step email notifications | Silencio reached, requerimiento, upcoming deadlines |
| Saved TIE records with expiry notifications | Rich reminders via Resend |

**Design principle**: A free user can always check "where is my application today" by entering their registro number. A Pro user gets it saved, tracked over time, and emailed when something changes.

---

## Architecture

### Payment Provider: Stripe Checkout

Use **Stripe Checkout** (hosted payment page) — no custom card form, no PCI scope, fastest to ship. Single one-time `price` object in Stripe for $20 USD.

No need for Stripe Billing (subscriptions), Stripe Elements, or Stripe Connect.

### Subscription Status Storage: Supabase `profiles` table

Add a `profiles` table (1:1 with `auth.users`) that stores:
```sql
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  subscription_tier text not null default 'free', -- 'free' | 'pro'
  stripe_customer_id text,
  stripe_payment_intent_id text,
  pro_activated_at timestamptz,
  created_at timestamptz default now()
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into profiles (id) values (new.id);
  return new;
end;
$$ language plpgsql security definer;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure handle_new_user();
```

RLS: users can read only their own profile row. Only the service role (webhook handler) can update `subscription_tier`.

### Email: Resend (already configured, just needs implementation)

`RESEND_API_KEY` is already in `.env.local`. Email templates exist in `src/lib/email/`. The cron job at `/api/cron/reminders` already has the scaffold. Wire it up as part of this work.

---

## New Files & Routes

### `/src/app/pricing/page.tsx`
- Public page
- Shows Free vs Pro comparison table
- "Upgrade to Pro — $20" button → calls `/api/stripe/checkout`
- Show "You're already Pro" if user has `subscription_tier = 'pro'`

### `/src/app/api/stripe/checkout/route.ts` (POST)
1. Verify user is authenticated (or redirect to login first)
2. Create (or retrieve) Stripe customer for the user
3. Create a Stripe Checkout Session (mode: `payment`, one-time $20 price)
4. Pass `metadata: { user_id }` and `success_url`, `cancel_url`
5. Return `{ url }` — client redirects to Stripe

### `/src/app/api/stripe/webhooks/route.ts` (POST)
1. Verify Stripe webhook signature (`STRIPE_WEBHOOK_SECRET`)
2. On `checkout.session.completed`:
   - Read `metadata.user_id`
   - Update `profiles` row: `subscription_tier = 'pro'`, `stripe_customer_id`, `stripe_payment_intent_id`, `pro_activated_at`
3. Return 200

### `/src/app/upgrade/page.tsx` (post-payment success landing)
- "You're now Pro!" confirmation
- CTA to dashboard

### `/src/lib/subscription.ts`
```ts
export async function getUserTier(supabase): Promise<'free' | 'pro'>
export async function requirePro(supabase): Promise<void> // throws redirect('/pricing')
export function isProFeature(tier: string, feature: ProFeature): boolean
```

---

## Gating Logic

### Server components / server actions
Call `getUserTier()` at the top of any Pro-gated server component or action:

```ts
// In /renew page.tsx (Step 4 and 5 gate)
const tier = await getUserTier(supabase)
if (tier !== 'pro' && step >= 4) redirect('/pricing')
```

```ts
// In saveApplication / saveStatusCheck server actions
const tier = await getUserTier(supabase)
if (tier !== 'pro') return { error: 'Pro subscription required.' }
```

### `/renew` step gating
- Steps 0–3 (Eligibility, Auth Setup, Pay Fee, Gather Docs) = **free**
- Steps 4–5 (Submit Application, Done/Next Steps) = **Pro gate**
- At step 3→4 transition: show inline upgrade prompt (not a hard redirect) to preserve context

### Dashboard
Show the full dashboard to all authenticated users. Gate the **save** operations (not the view) behind Pro. Free users see an empty state with upgrade CTA.

### `/status/tracker`
- One-time view (no save) = free (current behavior, unchanged)
- "Save & Track" button (StatusLog component) = Pro gate

---

## Notifications (Pro only)

Wire up the existing cron scaffold in `/api/cron/reminders`:

**Trigger 1: Silencio reached**
- Query `renewal_applications` where `silencio_reached = false` and `threshold_date <= now()` and user is Pro
- Send email: "Your application has likely been approved by silencio administrativo"
- Update `silencio_reached = true`, log to `notifications_log`

**Trigger 2: TIE expiry reminder**
- Query `tie_records` where `renewal_window_start` is within 7 days and user is Pro
- Send email: "Your renewal window opens in 7 days"

**Trigger 3: Requerimiento follow-up** (future)
- If `current_status = 'requerido'` and >7 days old → nudge email

---

## Environment Variables to Add

```
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_...
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRO_PRICE_ID=price_...   # one-time $20 price created in Stripe dashboard
```

---

## Implementation Order

1. **Supabase schema** — `profiles` table, trigger, RLS policy
2. **`src/lib/subscription.ts`** — `getUserTier()`, `requirePro()` helpers
3. **Stripe setup** — Create product + $20 price in Stripe dashboard, add env vars
4. **`/api/stripe/checkout`** — Checkout session creation
5. **`/api/stripe/webhooks`** — Webhook handler to flip tier in DB
6. **`/pricing` page** — Free vs Pro comparison + upgrade CTA
7. **`/upgrade` success page** — Post-payment confirmation
8. **Gate `/renew` steps 4–5** — Inline upgrade prompt at step 3→4 boundary
9. **Gate `saveApplication` / `saveStatusCheck` server actions** — Return error if not Pro
10. **Gate `StatusLog` UI component** — Show upgrade CTA instead of form
11. **Wire Resend emails in `/api/cron/reminders`** — Silencio + expiry triggers (Pro only)
12. **Update nav** — Add "Pricing" link, show "Pro" badge in dashboard header if subscribed

---

## What Stays Free (Never Gated)

- `/guide/*` — fully public (SEO value, top-of-funnel)
- `/renew` steps 0–3 — educating users is how they convert
- `/status` one-time view — huge utility for post-submission search traffic
- `/track` expiry calculator — hook for future Pro converts
- Expiry notification signup — builds the email list

---

## Verification Checklist

- [ ] New user signup → `profiles` row auto-created with `subscription_tier = 'free'`
- [ ] `/renew` step 4 → redirect/prompt to `/pricing` for free users
- [ ] Click "Upgrade" → Stripe Checkout hosted page opens
- [ ] Pay with Stripe test card `4242 4242 4242 4242` → webhook fires → `profiles.subscription_tier = 'pro'`
- [ ] Return to `/renew` step 4 → access granted
- [ ] Save application via `/status` → appears on dashboard
- [ ] Log status check → saves to `status_checks`
- [ ] Trigger `/api/cron/reminders` manually → Pro user receives silencio email
- [ ] Free user tries to save → Pro gate CTA shown, no DB write

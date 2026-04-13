# RenewMyTIE — Agent / Developer Guide

TIE renewal guidance tool for HQP/PAC permit holders in Spain (Law 14/2013).

## Stack

- **Framework**: Next.js 16 (App Router, Turbopack) — requires **Node 20** (`nvm use 20`)
- **UI**: React 19, Tailwind CSS 4, shadcn/ui components in `src/components/ui/`
- **Auth + DB**: Supabase (server client in `src/lib/supabase/server.ts`, browser client in `src/lib/supabase/client.ts`)
- **Icons**: Lucide React — use only Lucide, no mixing icon libraries
- **Type safety**: TypeScript 5, strict mode

## Project structure

```
src/app/          — Next.js pages (route segments)
  (auth)/         — login, signup, forgot-password, reset-password
  dashboard/      — authenticated user dashboard
  guide/          — knowledge base articles
  renew/          — 6-step renewal walkthrough
  status/         — application status tracker
  track/          — TIE expiry date tracker
  privacy/        — privacy policy
src/components/   — shared components
  ui/             — shadcn primitives (don't edit directly)
src/lib/          — utilities, constants, Supabase clients, business-day logic
```

## Design system

All tokens are defined in `src/app/globals.css` using OKLCH (Tailwind 4 `@theme inline`).

| Token | Use |
|-------|-----|
| `terracotta` | Primary CTAs, active states, accent |
| `amber-warm` / `amber-soft` | Secondary highlights |
| `olive` / `olive-light` | Success, positive states |
| `espresso` | Dark text |
| `clay` | Secondary / muted text |
| `sand` / `sand-dark` / `cream` | Background surfaces |

Custom utility classes: `.warm-gradient`, `.texture-overlay`, `.azulejo-border`, `.card-warm`, `.divider-warm`.

**Never hardcode hex/rgb colors.** Use Tailwind token classes (`text-terracotta`, `bg-olive-light/15`, etc.).

## Navigation

- **`NavLink`** (`src/components/NavLink.tsx`) — use for all nav links that need active-state awareness. Uses `usePathname()` and applies `aria-current="page"`.
- **`MobileNav`** (`src/components/MobileNav.tsx`) — handles mobile drawer with focus trap, Escape key, scroll lock, and active-state highlighting.
- Desktop nav and MobileNav must stay in sync (same links, same active logic).

## Page patterns

Every page follows this structure:

```tsx
<div className="flex flex-col">
  {/* Page header */}
  <div className="warm-gradient texture-overlay border-b border-border/40">
    <div className="max-w-[N] mx-auto px-4 sm:px-6 py-12 sm:py-16 ...">
      ...badge, h1, subtitle...
    </div>
  </div>

  {/* Content */}
  <div className="max-w-[N] mx-auto px-4 sm:px-6 py-10 space-y-8 w-full">
    ...
  </div>
</div>
```

Max-width conventions:
- Home, root nav/footer: `max-w-5xl`
- Dashboard: `max-w-5xl`
- Forms, step guides, status tracker: `max-w-2xl`–`max-w-3xl`

## Accessibility requirements

All new UI must follow these rules (established via UX audit):

- **Skip link** is the first element in `<body>` — already in `layout.tsx`, don't remove it.
- **`aria-current="page"`** on active nav links — use `NavLink` component.
- **Form errors** must use `id` + `aria-describedby` on the relevant input, `aria-invalid={!!error}`, and `role="alert"` on the error element.
- **Progress bars** must have `role="progressbar"`, `aria-valuenow`, `aria-valuemin`, `aria-valuemax`, `aria-label`.
- **Modals / drawers** must trap focus, support Escape to close, and return focus to the trigger on close.
- **Destructive actions** must have a two-step confirmation (see `DeleteButton` pattern).
- **External links** must have `target="_blank" rel="noopener noreferrer"` and an `ExternalLink` icon.

## Persistence conventions

Client-side state that spans sessions uses `localStorage`:

| Key | Component | Contents |
|-----|-----------|----------|
| `renewDocChecklist` | `DocumentChecklist` | `Record<string, boolean>` — checked document IDs |
| `renewCurrentStep` | `renew/page.tsx` | `number` — current step index |

Always wrap `localStorage` access in `try/catch` (private browsing throws).

## Business logic

- `src/lib/business-days.ts` — `getExpiryDates()`, `getTimelineStatus()`, `calculateBusinessDaysSince()`
- `src/lib/holidays.ts` — Spanish national holidays used in business-day calculations
- `src/lib/constants.ts` — `THRESHOLDS`, `STATUS_LABELS`, `REQUIRED_DOCUMENTS`, `PORTAL` URLs, `FEE`, `CONTACT`
- Renewal window: 60 days before expiry. Late filing: 90 days after expiry. Silencio threshold: 20 business days from submission.

## Server actions

`src/app/actions/applications.ts` — `saveTIERecord`, `saveApplication`, `saveStatusCheck`, `deleteApplication`, `deleteTIERecord`.

All actions require an authenticated Supabase session. They return `{ error: string } | { id: string }`.

## Build

```bash
nvm use 20
npm run dev    # dev server
npm run build  # production build (must pass before committing)
```

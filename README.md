# LifeOS (bleeding edge)

> **This is the bleeding-edge version of LifeOS.** It receives every experimental update first, so it
> moves fast and may be unstable, incomplete, or broken at any given commit. Expect breaking changes to
> UI, data flow and APIs without notice. If you need something that won't change under you, pin to a
> specific commit instead of tracking this branch.

LifeOS is a personal operating system for managing your goals, journal and finances in one place, built
mobile-first with a desktop layout that scales up.

## Features

- **Dashboard**: level, XP and streak at a glance, active goals, finance summary and recent journal entries
- **Goals**: checklist and timed goals with milestones and tasks, each worth XP
- **Journal**: entries with mood and tags, plus search and tag filtering
- **Finance**: income and expense tracking with category breakdowns and charts
- **Auth**: email and password sign-up, sign-in, email verification and password reset
- **Responsive layout**: icon rail on desktop and tablet, bottom navigation on phones, bottom-sheet dialogs
- **REST API**: versioned endpoints under `/api/v1`, with interactive docs at `/api-docs`

## Tech stack

Next.js 16 (App Router) · React 19 · Tailwind CSS v4 · shadcn/ui on Radix · Zustand · Supabase · Recharts

## Getting started

Requires Node.js and [pnpm](https://pnpm.io).

```bash
pnpm install
pnpm dev        # http://localhost:3000
```

Other scripts: `pnpm build`, `pnpm start`, `pnpm lint`.

### Environment variables

Create a `.env.local` in the project root:

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_KEY=        # server-only, bypasses RLS. Never expose to the browser.

# Read by lib/env.js
SUPABASE_URL=
SUPABASE_ANON_KEY=
SUPABASE_JWT_SECRET=
CORS_ORIGINS=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
AUTH_RATE_LIMIT_MAX=20
```

## Project structure

```
app/
  (auth)/          sign-in, sign-up, verify-email, forgot / reset password
  (main)/          dashboard, goals, journal, finance (behind AuthGuard)
  api/v1/          finance, goals, journal, milestones, tasks route handlers
components/
  nav/             bottom nav, profile menu, shared nav items
  ui/              shadcn/ui primitives
lib/
  api/             request handling, auth, rate limiting, responses
  db/              Supabase queries used by the API layer
  services/        client-side API wrappers
  store/           Zustand stores (auth, goals, journal, finance)
```

## Responsive design

- **Below 768px**: bottom navigation, floating action button for the primary action on each page, dialogs
  open as bottom sheets.
- **768px and up**: the original icon rail and centered modals.
- The `(main)` layout owns all page padding. Pages should not add their own outer padding, `min-h-screen`
  or background.
- Use the `hoverable:` Tailwind variant for hover-only UI so touch devices always see the controls.

## Contributing to the bleeding edge

- Experimental work lands here first. Keep commits small and describe what is unfinished or risky.
- Run `pnpm build` before pushing, and test at 320px, 390px, 768px and 1440px.

# Mobile responsiveness: QA handoff

Phases 0-4 of the mobile plan are implemented. **Nothing has been built or run** (no network / node_modules in the
environment where this was written). Files were syntax-checked and all `@/` imports resolved, but Tailwind
compilation and runtime behaviour are untested. Start with the "Verify first" list.

## Setup
```
pnpm install && pnpm dev
```
Test in Chrome DevTools device mode AND on at least one real iPhone (Safari) and one Android (Chrome).
Widths: 320, 360, 390, 430, 640, 768, 1024, 1440. Also landscape phone (~667x375).

## Verify first (highest risk, could not be run)
1. `pnpm build` passes. Tailwind v4 custom variant `hoverable` (globals.css) and `max-sm:` dialog classes must compile.
2. Auth screens: error banner is red, success is green, secondary text is dimmer (new tokens in globals.css).
   If `--color-primary/accent/card/border` look wrong, `@theme inline` isn't emitting them: check computed values.
3. Dialogs on phone open as a bottom sheet, scroll internally, footer stays visible, Selects inside them open and can be picked.
4. Row "..." menu -> Edit opens the dialog and the page stays tappable afterwards (Radix menu -> dialog hand-off).
5. iPhone: bottom nav clears the home indicator; no zoom when focusing any input.

## Checklist
**Shell**
- [ ] <768px: bottom nav (Dashboard/Goals/Journal/Finance/You); >=768px: original icon rail. No overlap with content at any width.
- [ ] Active tab highlighted, correct on nested routes. Labels hide on landscape phone.
- [ ] "You" (mobile) and avatar (desktop rail) open a menu with Sign out; signing out returns to /sign-in.
- [ ] Content never sits under the nav; last item on every page scrolls fully clear of nav (and of the floating + button).
- [ ] Toasts appear top-centre.

**Pages (each at 320 / 390 / 768 / 1440)**
- [ ] Dashboard: stats 2x2 on phone, 4-across on large screens; finance card income/expenses side by side on phone.
- [ ] Journal: edit/delete reachable by touch ("..." menu <640px, inline icons >=640px, hover-reveal only for mouse); delete asks for confirmation; tag chips scroll horizontally on phone; search box usable.
- [ ] Goals: card meta wraps, no horizontal overflow; edit/delete work; delete asks for confirmation.
- [ ] Finance: stats, chart (shorter on phone, axis labels readable), line/bar toggle, all/income/expense segmented control, rows truncate long descriptions without pushing the amount off-screen, no inner scroll trap on phone.
- [ ] Floating + button (phone) opens the same dialogs as the header button on larger screens.
- [ ] No horizontal page scroll anywhere (check with 320px width).

**Dialogs (goal, milestones, finance, journal)**
- [ ] Phone: bottom sheet, max 92% height, scrolls, sticky footer, close button easy to hit; desktop: centred modal, widths as before (goal sm:max-w-xl, journal/milestones sm:max-w-2xl).
- [ ] Keyboard open: focused field remains visible; can still reach Save.
- [ ] Milestones dialog: rows stack cleanly; tapping a task label toggles its checkbox; add-task row usable.

**Auth**
- [ ] No iOS focus-zoom on any field (inputs are 16px on phones, 13px from 640px up).
- [ ] Keyboard does NOT auto-open on phones; DOES auto-focus first field on desktop.
- [ ] Sign-up names stack below 400px; show/hide password toggle is easy to tap; step 1 -> step 2 works.
- [ ] Forgot / reset / verify pages load (they previously imported a missing file, see below).
- [ ] Reduced-motion OS setting stops bounce/ping/pulse animations.

**Accessibility quick pass**
- [ ] Tab order + visible focus in nav, menus, dialogs. Screen reader: nav announces current page; icon-only buttons have names.
- [ ] Pinch-zoom works (no maximum-scale).

## What changed
New: `components/nav/{nav-items.js,bottom-nav.jsx,profile-menu.jsx}`, `components/{page-header,row-actions,confirm-delete-dialog}.jsx`,
`hooks/use-desktop-autofocus.js`, `lib/supabaseClient.js`.
Modified: root + (main) + (auth) layouts, `globals.css`, `sidebar.jsx`, all 4 (main) pages, 4 dialogs, finance chart,
AuthPrimitives, AuthGuard, sign-in/up/forgot/reset/verify, ui `card`/`dialog`/`select`/`sonner`.
Deleted (duplicates): `styles/globals.css`, `hooks/use-mobile.js` (the `.ts` version is kept; `ui/sidebar.tsx` uses it).

## Changes beyond pure layout (review these)
- `lib/supabaseClient.js` added: forgot-password, reset-password and verify-email imported `@/lib/supabaseClient`, which did not exist (those pages could not build). It re-exports the existing anon client.
- `finance-chart.jsx`: daily grouping was broken (compared `created_at` to a date label so every transaction got its own point) and amounts could string-concatenate; both fixed. Removed a bogus `@/app/providers` import.
- Finance dialog label "Amount ($)" -> "Amount (K)".
- Delete buttons on goals / journal entries / transactions now ask for confirmation.
- Sidebar profile: was a broken `<img>` (the store's `profile` is an array, so `profile.avatar_url` is undefined). The new menu reads both array and object shapes and falls back to initials. The store itself is unchanged.
- `ui/select.tsx`: `SelectTrigger` now defaults to `w-full` (was `w-fit`); `ui/sonner.tsx`: top-centre position.
- Dialogs: `max-w-*` overrides on callers were being beaten by `sm:max-w-lg`; they now use `sm:max-w-*`.

## Known issues NOT touched
- `AuthStore.initialize()` throws when there is no session (`session.user`) before registering `onAuthStateChange`; and `fetchProfile` should use `.single()`.
- `components/auth/RedirectIfAuthed.jsx` (-> `@/lib/store/useAuthStore`) and `hooks/use-toast.js` (-> `@/components/ui/toast`) import missing modules; nothing imports them, so they don't break the build.
- Root `<html className="dark">` is hard-coded while ThemeProvider uses `defaultTheme="system"`.

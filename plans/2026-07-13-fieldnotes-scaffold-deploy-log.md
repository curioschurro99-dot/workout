# Implementation Log: 2026-07-13 — FieldNotes scaffold + deploy

## What was implemented

### Project scaffold

- Created `AGENTS.md` with full project conventions (stack, workflow, git setup, dev commands, code conventions)
- Initialized Vite + React 18 + TypeScript + Tailwind CSS 4 project
- Configured ESLint flat config, Prettier, tsconfig (strict)
- Set up `.env`, `.gitignore`, auto-commit script
- Initialized git, pushed to `https://github.com/curioschurro99-dot/workout`

### Auth

- `src/lib/supabase.ts` — Supabase client singleton
- `src/lib/auth-context.tsx` — AuthProvider + useAuth hook (same pattern as phtracker/phrasecraft)
- `src/pages/LoginPage.tsx` — Sign-in form
- `src/pages/SignupPage.tsx` — Registration form

### Workout app (7 views in `src/App.tsx`)

- **TodayView** — Active program day with exercise checkboxes + interval timer (work/rest/rounds)
- **ProgramsView** — Program CRUD (create, set active, add days with multi-select exercises, delete)
- **LibraryView** — Exercise library with category filters (strength/cardio/mobility), add/remove exercises
- **ProgressView** — Stats (streak, total sessions, this week), goal bar, session history
- **KnowledgeView** — Built-in reference notes + personal notes CRUD
- **YogaView** — 50-pose library with category filters, pose detail modals with SVG shapes, guided 26-posture hot yoga flow with voice coach, YouTube video embedding, progress bar
- **NutritionView** — Macro dashboard with progress bars, edit targets; Food Library with category filters, per-100g macros; Meal Planner with weekly overview, meal suggestions, food logging per meal type

### Data files

- `src/lib/workout-data.ts` — Exercise types, 23 seed exercises, 7-day recomposition program, 50 yoga poses with SVG shapes, utility functions
- `src/lib/nutrition-data.ts` — Food types, 34 seed foods (plant-forward), 16 meal suggestions, macros per serving
- `src/lib/store.ts` — `useLocalStorage` hook
- `supabase-setup.sql` — 10 tables (`workout_*` prefix), trigger for auto-creating user rows, RLS policies

### Deployment

- Built `dist/` locally, copied to VPS at `/root/workout/`
- Added bind mount to phtracker's docker-compose.yml: `/root/workout:/var/www/workout`
- Added Caddy config entry for `workout.appletreegarden.com`
- Restarted Caddy container
- Verified HTTPS (HTTP/2 200) and DNS resolution

### Files created/modified

| File                        | Action               |
| --------------------------- | -------------------- |
| `AGENTS.md`                 | Created              |
| `package.json`              | Created              |
| `tsconfig.json`             | Created              |
| `vite.config.ts`            | Created              |
| `eslint.config.js`          | Created              |
| `.prettierrc`               | Created              |
| `.gitignore`                | Created              |
| `.env.example`              | Created              |
| `.env`                      | Created (gitignored) |
| `index.html`                | Created              |
| `scripts/auto-commit.ps1`   | Created              |
| `supabase-setup.sql`        | Created              |
| `src/main.tsx`              | Created              |
| `src/App.tsx`               | Created              |
| `src/index.css`             | Created              |
| `src/vite-env.d.ts`         | Created              |
| `src/pages/LoginPage.tsx`   | Created              |
| `src/pages/SignupPage.tsx`  | Created              |
| `src/lib/supabase.ts`       | Created              |
| `src/lib/auth-context.tsx`  | Created              |
| `src/lib/store.ts`          | Created              |
| `src/lib/workout-data.ts`   | Created              |
| `src/lib/nutrition-data.ts` | Created              |

## Bugs encountered

1. **Unused imports/params in strict TS** — `noUnusedLocals` and `noUnusedParameters` in tsconfig caught several unused imports and parameters (`SkipForward`, `SkipBack`, `SessionLog`, `Pose`, etc.). Fixed by removing unused imports and prefixing unused destructured params with underscore (`_openModal`, `_closeModal`, `_state`).

2. **`tsc -b` fails with `allowImportingTsExtensions`** — The `tsc -b` build mode requires `noEmit` or `emitDeclarationOnly` when using `allowImportingTsExtensions`. Changed build script to just `vite build` (Vite handles TS via esbuild). Added `npm run typecheck` as a separate command.

3. **Missing Vite client types** — `import.meta.env` needs `/// <reference types="vite/client" />` in a `vite-env.d.ts` file.

4. **GitHub repo didn't exist** — Had to ask user to create the repo first.

5. **Caddy container path issue** — The Caddyfile referenced `/root/workout` but the container can't access host paths directly. Fixed by adding a bind mount in docker-compose.yml (`/root/workout:/var/www/workout`) and updating Caddyfile to use `/var/www/workout`.

6. **Generated `.js` files committed** — Previous `tsc` run emitted `.js` files alongside `.tsx` files. Cleaned up and updated `.gitignore` to exclude `src/**/*.js`.

## Deviations from plan

- None significant. Architecture followed phrasecraft-style SPA + Supabase as planned.

## Verification steps

- `npm run typecheck` — pass (0 errors)
- `npm run build` — pass (3.12s, 452KB JS + 20KB CSS)
- `npm run format` — pass
- Deployed site responds with HTTPS 200 at `workout.appletreegarden.com`

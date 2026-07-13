# Project: workout

## Stack

| Layer     | Technology                                 |
| --------- | ------------------------------------------ |
| Framework | React 18                                   |
| Build     | Vite 6 + `@vitejs/plugin-react`            |
| Styling   | Tailwind CSS 4 via `@import "tailwindcss"` |
| Icons     | Lucide React                               |
| State     | localStorage + Supabase-backed per user    |
| Language  | TypeScript (strict mode)                   |

## Workflow

All features and fixes follow a three-step process.

### 1. Plan first

Before any implementation, write a dated plan file to `plans/`:

```
plans/YYYY-MM-DD-<short-description>.md
```

The plan must cover:

- Goal and scope
- Files to create / modify
- Implementation order
- Key architectural decisions and tradeoffs
- Future considerations (migration paths, open questions)

Write the plan, present it to the user, and get sign-off before writing any code.

### 2. Log after implementation

After the plan is fully implemented and committed, write a dated implementation log to `plans/`:

```
plans/YYYY-MM-DD-<short-description>-log.md
```

The log must record:

- What was implemented (list of changes per file)
- Any bugs encountered during development and how they were fixed
- Deviations from the original plan (if any) and why
- Verification steps taken (lint, format, build, manual test)

### 3. Capture lessons learned

After each implementation, update the **Lessons Learned** section at the bottom of this file. Record:

- Patterns that worked well (repeat for future tasks)
- Pitfalls to avoid
- Config or tooling quirks (e.g. Windows CRLF issues, ESLint rules, dependency gotchas)
- Any changes to team conventions

Lessons are cumulative — add new entries at the top so the most recent is easiest to find.

## Git setup

Git is installed via GitHub Desktop — not in the normal PATH.

**Git executable:**

```
C:\Users\ellis\AppData\Local\GitHubDesktop\app-3.6.2\resources\app\git\cmd\git.exe
```

**Remote:** `origin` → `https://github.com/curioschurro99-dot/workout.git` (`main` branch)

### Auto-commit script

After implementing any feature or fix, run the helper script from the project root:

```
scripts/auto-commit.ps1 "type: description of the change"
```

It stages all changes, commits with the given message, and pushes to `origin/main`.

### Commit message format

Use conventional commits:

| Prefix      | When                                         |
| ----------- | -------------------------------------------- |
| `feat:`     | New feature or enhancement                   |
| `fix:`      | Bug fix                                      |
| `refactor:` | Code restructuring (no behaviour change)     |
| `style:`    | Formatting, whitespace, styling-only changes |
| `chore:`    | Tooling, dependencies, config, maintenance   |
| `docs:`     | Documentation (AGENTS.md, README, etc.)      |

**Examples:**

```
scripts/auto-commit.ps1 "feat: add nutrition macro dashboard"
scripts/auto-commit.ps1 "fix: correct timer reset on round completion"
scripts/auto-commit.ps1 "chore: update dependencies"
```

### Important

- Never force-push, rebase, amend, or squash commits that have already been pushed.
- Keep `main` in a working state at all times.

## Dev commands

| Command             | What it does              |
| ------------------- | ------------------------- |
| `npm run dev`       | Start dev server with HMR |
| `npm run build`     | Production build          |
| `npm run preview`   | Preview production build  |
| `npm run lint`      | ESLint across the project |
| `npm run format`    | Prettier formatting       |
| `npm run typecheck` | TypeScript type checking  |

## Code conventions

- **No comments** in source files — code should be self-documenting.
- **No emojis** unless the user explicitly requests them.
- **Components:** Look at existing components before creating new ones — follow same patterns for imports, typing, and structure.
- **State:** Use `useLocalStorage` for device-local state. Use Supabase-backed hooks for cross-device state (user-scoped data).
- **File structure:**
  - `src/components/workout-app/` — feature-specific components
  - `src/lib/` — utilities, hooks, data definitions
  - `src/pages/` — page-level components (login, signup)
  - `src/data/` — static data files

## Lessons Learned

### 2026-07-13 — Add 6 workout programs

- **Single-file program data is easy to extend**: Adding new programs to `seedPrograms()` requires zero changes to UI, routing, or data structures. The ProgramDay/ProgramExercise model is flexible enough to add any number of programs.
- **Prettier may drift on existing code after large edits**: Running `npm run format` after editing a file may also reformat other files with pre-existing whitespace issues. Run format early to separate formatting changes from logic changes.
- **Rest days in programs**: Explicit rest/active recovery/mobility days make programs clearer for users — no ambiguity about what to do on Day 7. Yoga flow on the last day ties programs into the existing Yoga tab.
- **PowerShell doesn't support `&&`**: Use `; if ($?) { ... }` for sequential commands instead. This is a Windows-specific gotcha.

### 2026-07-13 — FieldNotes scaffold + VPS deploy

- **Static SPA on existing Caddy stack**: When adding a new static site to a VPS already running Docker + Caddy, you need to (1) add a bind mount in `docker-compose.yml` for the new directory, (2) add a Caddyfile block, and (3) restart the Caddy container. The Caddyfile path inside the container (`/var/www/...`) must match the mount target, not the host path.
- **`tsc -b` vs `vite build`**: Vite handles TypeScript compilation via esbuild internally. Using `tsc -b` before `vite build` requires special tsconfig settings. Simpler to just run `vite build` for the build step and keep `tsc --noEmit` as a separate `typecheck` script.
- **Vite client types for `import.meta.env`**: Always include a `src/vite-env.d.ts` file with `/// <reference types="vite/client" />` to avoid TS errors on `import.meta.env`.
- **Strict TS catches unused imports**: `noUnusedLocals` and `noUnusedParameters` will catch unused destructured props from function signatures. Prefix with underscore (`_unused`) to suppress.
- **`.gitignore` must exclude generated `.js` files**: Running `tsc` without `--noEmit` in the same directory as `.tsx` files will emit `.js` files. Always add `src/**/*.js` and `src/**/*.js.map` to `.gitignore`.
- **Supabase project sharing**: Using the same Supabase project for multiple apps works fine as long as table names are prefixed (`workout_*` vs phtracker's implicit naming). Auth is shared across apps.

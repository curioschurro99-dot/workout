# Project: fieldnotes

## Stack

| Layer     | Technology                                        |
| --------- | ------------------------------------------------- |
| Framework | React 18                                          |
| Build     | Vite 6 + `@vitejs/plugin-react`                   |
| Styling   | Tailwind CSS 4 via `@import "tailwindcss"`        |
| Icons     | Lucide React                                      |
| State     | localStorage + Supabase-backed per user           |
| Language  | TypeScript (strict mode)                          |

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

| Command           | What it does              |
| ----------------- | ------------------------- |
| `npm run dev`     | Start dev server with HMR |
| `npm run build`   | Production build          |
| `npm run preview` | Preview production build  |
| `npm run lint`    | ESLint across the project |
| `npm run format`  | Prettier formatting       |
| `npm run typecheck` | TypeScript type checking |

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


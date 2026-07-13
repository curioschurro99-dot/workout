# 2026-07-13 — Implementation Log: Add 6 workout programs

## What was implemented

Modified `src/lib/workout-data.ts`:

- Renamed `seedProgram()` → `seedPrograms()` which returns a `Program[]` array
- Preserved the existing "Magnus Method — 7 Day Recomposition" as the first entry
- Added 6 new `Program` objects to the array:

| #   | Program ID          | Name                                | Days                    |
| --- | ------------------- | ----------------------------------- | ----------------------- |
| —   | `magnus-recomp`     | Magnus Method — 7 Day Recomposition | 7 (existing, preserved) |
| 1   | `glute-leg-focus`   | Glute & Leg Focus                   | 7                       |
| 2   | `upper-lower-split` | Upper/Lower Split                   | 7                       |
| 3   | `fat-loss-ignite`   | Fat Loss Ignite                     | 7                       |
| 4   | `bodyweight-basics` | Bodyweight Basics                   | 7                       |
| 5   | `core-posture`      | Core & Posture                      | 7                       |
| 6   | `tomb-raider`       | Tomb Raider Training                | 7                       |

- Updated `seedState()` to call `seedPrograms()` instead of `[seedProgram()]`
- Ran `npm run format` (Prettier) which also fixed formatting in `App.tsx`, `nutrition-data.ts`, `LoginPage.tsx`, `SignupPage.tsx` (pre-existing formatting drift)

## Bugs encountered

None. All exercises referenced in the new programs exist in the exercise library. TypeScript strict mode passed cleanly.

## Deviations from plan

None.

## Verification

- `npm run build` — passes (production build)
- `npm run typecheck` — passes (tsc --noEmit)
- `npm run lint` — clean (0 errors, 1 pre-existing warning in auth-context.tsx)
- `npm run format` — applied (no further issues)
- Deployed to VPS: `scp dist/*` → `/root/workout/`, Caddy reloaded
- Site live at https://workout.appletreegarden.com

## Post-deploy

- Committed with `scripts/auto-commit.ps1 "feat: add 6 seven-day workout programs including Tomb Raider"`
- Plan file written to `plans/2026-07-13-six-programs.md`

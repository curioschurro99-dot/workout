# 2026-07-13 — Add 6 workout programs (all 7 days)

## Goal

Add 6 new workout programs to the app's seed data, each structured as a 7-day week. Five programs expand on previously proposed popular women's fitness programs; one is a "Tomb Raider" program inspired by Magnus Lygdback's real training for Alicia Vikander.

## Scope

- Modify `src/lib/workout-data.ts` only — add 6 new program objects to the `seedPrograms()` function.
- No new exercises, UI changes, or data structures needed.
- All exercises already exist in the library (44 total).

## Files to modify

1. `src/lib/workout-data.ts` — rename `seedProgram` to `seedPrograms`, add 6 new `Program` objects

## Implementation order

Add each program as a new entry in the `programs` array inside `seedPrograms()`:

### Program 1: Glute & Leg Focus (7 days)

- ID: `glute-leg-focus`
- Pattern: Lower strength → upper push/pull → glutes + core → active recovery → lower V2 → HIIT + core → yoga
- Diverse lower body stimulus (squat pattern, hinge, lunge, isolation)

### Program 2: Upper/Lower Split (7 days)

- ID: `upper-lower-split`
- Pattern: Lower quad → upper push → lower posterior → upper pull → rest → full body conditioning → yoga
- Classic 4-day split with 2 recovery days

### Program 3: Fat Loss Ignite (7 days)

- ID: `fat-loss-ignite`
- Pattern: Full body strength → HIIT → lower strength → HIIT → full body strength → active recovery → yoga
- 2 HIIT days, 3 strength days, 2 recovery

### Program 4: Bodyweight Basics (7 days)

- ID: `bodyweight-basics`
- Pattern: Lower → upper+core → full body → rest → lower V2 → core+cardio → yoga
- Zero equipment needed

### Program 5: Core & Posture (7 days)

- ID: `core-posture`
- Pattern: Core strength → posture+back → full body flow → rest → core V2 → cardio+mobility → yoga
- Complements the existing Yoga tab

### Program 6: Tomb Raider Training (7 days)

- ID: `tomb-raider`
- Pattern: HIIT+legs+core → cardio+back+shoulders → mobility+chest+arms → HIIT+legs+core → cardio+back+shoulders → full body adventure → yoga
- Mirrors the real Magnus Lygdback 5-day training split + recovery
- Captures the Lara Croft aesthetic: functional, lean muscle, HIIT-heavy, full-body capability

## Key decisions

- **Rest days are explicit**: Each program has clear rest/active recovery/yoga days so users know exactly what to do.
- **Yoga days**: Each program ends Day 7 with a yoga flow, tying into the existing Yoga tab.
- **No new exercises**: All exercises already exist. Only new program objects are added.
- **Thematic consistency**: "Tomb Raider" uses the same trainer (Magnus Lygdback) as the existing "Magnus Method" program.

## Verification

1. `npm run build` — must compile without errors
2. `npm run lint` — no new lint issues
3. `npm run typecheck` — no type errors
4. Manual: load the app, check Programs tab shows all 6 new programs, verify each day's exercises render

## Future considerations

- Programs could become user-customizable (edit sets/reps per exercise) — but that's future scope

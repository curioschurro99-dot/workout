# Implementation Log — 2026-07-13 Yoga Flow Vinyasa

## Changes

### `src/lib/workout-data.ts`
- Added `id: string` field to `Pose` interface
- Made `seq?: number | null` optional in `Pose` interface
- Added `id` to all existing ~58 poses (46 unique + ~12 alternate versions) using kebab-case ids (e.g. `"standing-deep-breathing"`)
- Added 6 new poses: Mountain Pose, Forward Fold, Half Forward Fold, Reverse Warrior, Shoulder Stand, Plow Pose (total 52+ unique pose definitions)
- Added 4 new SVG shapes to SHAPES dict: `forwardFold`, `reverseWarrior`, `shoulderStand`, `plowPose`
- Added `YOGA_FLOWS` const with two flows:
  - `hot26`: 26-pose Bikram-inspired sequence (references original seq poses by id)
  - `vinyasa`: 44-pose breath-linked vinyasa flow (sun salutations, standing poses, hip openers, inversions, cool-down)

### `src/App.tsx`
- Imported `YOGA_FLOWS` and `Pose` type from workout-data
- Added `[flowId, setFlowId]` state to YogaView (default `"hot26"`)
- Replaced `POSES.filter(p => p.seq)` with `flow.poseIds.map(id => POSES.find(...))` for guided sequence
- Replaced single "Start Guided Hot Yoga Flow" button with dual buttons: "Start Hot Yoga (26 Postures)" and "Start Vinyasa Flow"
- Updated description text (52+ poses) and flow-complete text (dynamic flow name)
- Passed Pose type guard filter for type-safe sequence derivation

## Bugs Encountered

1. **Missing `id` on many poses**: The original POSES array had ~58 entries (including alternate versions of the same pose with different cues/holds), not the 46 I initially estimated. After adding `id` to the first 46, typecheck revealed 11+ more missing ids in the second half of the array. Fixed by reading the full array and batch-adding ids with `-alt` suffix.

2. **`seq` should be optional**: Many poses don't have `seq` (they're extras not in the classic 26-posture sequence). Making `seq?: number | null` resolved ~20 type errors.

## Deviations from Plan

- Added `-alt` suffix for duplicate/alternate pose ids instead of the originally planned scheme (handles all ~12 alternate versions cleanly)
- Used Pose type predicate (`p is Pose`) in filter for TypeScript strict mode compliance

## Verification

- `npm run typecheck` — passes (0 errors)
- `npm run lint` — passes (1 pre-existing warning in auth-context.tsx)
- `npm run format` — no changes after initial format
- `npm run build` — succeeds (481 KB JS, 20 KB CSS)
- `scripts/auto-commit.ps1` — committed and pushed
- Deployed to VPS via SCP, Caddy reloaded
- Manual check: dist/ served at https://workout.appletreegarden.com

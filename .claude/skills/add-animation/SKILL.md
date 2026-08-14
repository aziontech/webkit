---
name: add-animation
description: Scaffold a new webkit animation into the semantic catalog (semantic/animations.js) + record the Theme gap. Used when a component needs an animation the catalog lacks, instead of a component-local @keyframes or an off-catalog animate-[…].
scope: webkit
enforced_by: [styling, no-invention, accessibility]
---

# Skill: add-animation

The animation catalog is the **single source of truth**. A component may only use an
`animate-*` utility that exists in it. When one is missing, add it here — never inline a
`@keyframes` in a `.vue`, never use `animate-[…]`, never hardcode `duration-[…]` /
`cubic-bezier(…)`. (`validate-tokens` blocks all of those; `validate-spec-compliance`
blocks an `animate-*` not in the catalog.)

## First: is this a catalog animation at all?

A keyframe is a **fixed** journey — it knows both ends before it runs. Three common needs are not
that, and adding a keyframe for them produces an animation that is wrong on every instance but the
one it was authored against. Do not add a catalog entry for these; use the recipe instead
(`transition-*` + `duration-*` / `ease-*` tokens, no new `animate-*`, no `@keyframes`):

| Need | Why it cannot be a keyframe | Recipe |
| --- | --- | --- |
| A box that resizes because its content changed (form step swap, panel level change, disclosure between two real heights) | Both heights are runtime facts; `auto` is not interpolable and must be the resting value | Measure → mutate → measure while still `auto` → pin the old value → **two** `requestAnimationFrame`s → set the new one → release to `auto` on `transitionend` **and** a fallback timer. `lib/animate-height.js` in the sample app is the working form. |
| A value that grows into place inside an element that keeps its size otherwise (a chip gaining its filter value) | The target width is the content's, unknown at author time | Single-column grid, `transition-[grid-template-columns]` from `grid-cols-[0fr]` to `grid-cols-[1fr]`; keep the clip bare and put padding on the row inside it |
| A composition assembling on first paint, its parts staggered from opposite edges | Per-instance offsets, direction, and a lead/follow delay — a keyframe would fix all three | `translate`/`opacity` on `data-[entered]:` variants, timing inline from the `duration` / `curve` tokens, flipped after two `requestAnimationFrame`s. `lib/auth-entrance.js` in the sample app is the working form. |

`animate-slide-down` (0 → auto disclosure) is the one *catalogued* size animation and stays that
way — it does not generalise to the incremental resizes above.

Two failure modes to check for before blaming the catalog, because both compile, lint, type-check
and animate **nothing**:

- **`transition-[transform]` beside a `translate-x-*` or `scale-*`.** Tailwind v4 compiles those to
  the standalone `translate` / `scale` properties. Name those; a `<TransitionGroup>` `move-class`
  names `transform,translate,scale,opacity` because its own move uses an inline `transform`.
- **A single `requestAnimationFrame` before flipping to the end state.** It can land in the frame
  the browser is already painting, so the start state is never committed and the move snaps.

The consumer-facing form of all of this — including the full glitch catalog — is the shipped
`webkit-motion-polish` skill. Keep the two in step: a recipe added here is added there.

## Inputs

- `<name>` — kebab-case animation name (e.g. `slide-left`). Utility: `.animate-<name>`.
  Keyframe identifier: camelCase of `<name>` (`slide-left` → `slideLeft`).
- `[component]` (optional) — the component that needs it (to record the Theme gap in its spec).

## Steps

### 1. Add the utility + keyframes to `packages/theme/src/tokens/semantic/animations.js`

In the `animations` object (inside `addUtilities`), add:

```js
'.animate-<name>': {
  animation: '<keyframeName> <duration> <easing>',
},
```

- `<duration>` and `<easing>` MUST come from the timing tokens, not raw literals — use a
  value from `primitives/animations/animate.js` (`duration`: fast-01 70ms, fast-02 110ms,
  moderate-01 150ms, moderate-02 240ms, slow-01 400ms, slow-02 700ms, slow-03 1100ms,
  slow-04 2100ms; `curve`: productive-entrance/-exit, expressive-entrance/-exit) or a
  generic `ease` from `primitives/animations/ease.js`. Mirror how the existing entries
  (`.animate-popup-scale-in`, etc.) reference the same timings.

In the `keyframes` object (inside `addComponents`), add the matching block:

```js
'@keyframes <keyframeName>': {
  '0%':   { /* from state */ },
  '100%': { /* to state */ },
},
```

Keep both in sync (the utility's `animation` references `<keyframeName>`).

### 2. Record the Theme gap (when a component is given)

Add a row to the component's `## Theme gaps` table in `.specs/<component>.md`:

```
| <name> animation | added to semantic/animations.js | done (this change) |
```

### 3. Regenerate the catalog

Run `pnpm --filter @aziontech/webkit catalog:build` (or `node packages/webkit/scripts/build-catalog.mjs`).
Confirm `<name>` now appears in `catalog.json → tokens.animations`. This is what makes
`validate-spec-compliance` accept `animate-<name>` in the component.

### 4. Remind about reduced motion

In the component, the motion-bearing class must pair with `motion-reduce:*` on the same
class string (e.g. `animate-<name> motion-reduce:animate-none`), and the spec's
`## Motion & Animations` table must list `animate-<name>` + its reduced-motion fallback.

### 5. Verify by measuring

Sample the animated property across `requestAnimationFrame` and assert there are interpolated frames
between the start and end values. A snap and a 150ms ease are indistinguishable by eye, and every
silent failure above renders a correct final state — a screenshot proves nothing.

## Do not

- Do **not** add a keyframe for a journey whose endpoints are only known at runtime (see
  **First: is this a catalog animation at all?**).
- Do **not** add a component-local `@keyframes` or `animate-[…]` / hardcoded timing.
- Do **not** edit `.claude/docs/DESIGN.md` (human mirror; updated separately).
- Do **not** invent a timing outside the `duration` / `curve` / `ease` token sets.

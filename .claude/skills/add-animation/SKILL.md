---
name: add-animation
description: Scaffold a new webkit animation into the semantic catalog (semantic/animations.js) + record the Theme gap. Used when a component needs an animation the catalog lacks, instead of a component-local @keyframes or an off-catalog animate-[…].
---

# Skill: add-animation

The animation catalog is the **single source of truth**. A component may only use an
`animate-*` utility that exists in it. When one is missing, add it here — never inline a
`@keyframes` in a `.vue`, never use `animate-[…]`, never hardcode `duration-[…]` /
`cubic-bezier(…)`. (`validate-tokens` blocks all of those; `validate-spec-compliance`
blocks an `animate-*` not in the catalog.)

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

## Do not

- Do **not** add a component-local `@keyframes` or `animate-[…]` / hardcoded timing.
- Do **not** edit `.claude/docs/DESIGN.md` (human mirror; updated separately).
- Do **not** invent a timing outside the `duration` / `curve` / `ease` token sets.

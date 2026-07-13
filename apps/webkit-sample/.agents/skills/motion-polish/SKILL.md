---
name: motion-polish
description: Make motion smooth using only @aziontech/theme animate tokens — animate-* utilities, duration-*/ease-*/curve tokens, compositor-props-only, ≤150ms interaction feedback, and a mandatory motion-reduce escape on every motion class. No external animation library, no inline cubic-bezier, no hardcoded ms.
status: active
last_updated: 2026-06-29
---

# Skill: motion-polish

## Purpose

Apply motion that feels native to the design system: token-driven, fast, accessible, and limited to
properties the compositor can animate cheaply. Motion should confirm an action or guide attention —
never decorate.

## How to use

- `/motion-polish`
  Apply the motion constraints below to any animated UI in this conversation.
- `/motion-polish <file>`
  Review the file's animations and output, per violation:
  - the exact line / snippet (quoted),
  - why it's wrong (1 short sentence),
  - the token-based fix.

## When to invoke

- After structure (`ux-heuristics`) and baseline (`baseline-ui`) are sound.
- Adding entrances/exits, hover/active feedback, or overlay open/close motion.
- The user asks to "make it smooth", "add a transition", "animate this".

## Constraints

### Use only the catalogued utilities

The `animate-*` utilities from [`DESIGN.md`](../../docs/DESIGN.md) § Animations — they ship with
`motion-safe` / `motion-reduce` variants:

| Utility | Behavior |
|---|---|
| `animate-fade-in` / `animate-fade-out` | opacity in / out |
| `animate-slide-down` | height 0 → auto (the one catalogued height animation — see note) |
| `animate-popup-scale-in` / `animate-popup-scale-out` | scale + fade for popovers/menus |
| `animate-blink` | caret/blink |
| `animate-highlight-fade` | row-flash highlight |

For `animate-popup-scale-in/out`, set `--popup-origin` per instance to match the trigger anchor.

### Timing only from tokens

- **Durations**: `duration-fast-01` (70ms), `duration-fast-02` (110ms), `duration-moderate-01`
  (150ms), `duration-moderate-02` (240ms), `duration-slow-01` (400ms), `duration-slow-02` (700ms).
- **Curves**: `ease-productive-entrance` / `ease-productive-exit` (UI chrome),
  `ease-expressive-entrance` / `ease-expressive-exit` (prominent surfaces), and the generic
  `ease-in` / `ease-out` / `ease-in-out`.
- **NEVER** a hardcoded `duration-[180ms]` / `transition: opacity 200ms`, and **NEVER** an inline
  `ease-[cubic-bezier(...)]`. The values live in `animate.js`.

### Property discipline

- **MUST** animate compositor props only: `transform` and `opacity`.
- **NEVER** animate layout props (`width`, `height`, `top`, `left`, `margin`, `padding`) — they
  thrash layout. (Exception: the catalogued `animate-slide-down` for disclosure height; don't roll
  your own height/width transition beyond it.)
- **SHOULD** avoid animating paint props (`background`, `color`) except small, local UI (a single
  icon, a chip). For hover/active surface fills use the `::before`/`::after` ghost-layer pattern from
  `DESIGN.md` § Interactive states (fade `opacity` on the pseudo-layer, not `background` on the root).

### Feel

- **Interaction feedback ≤ `duration-moderate-01` (150ms)** — use `fast-01`/`fast-02` for hover/active.
- **`ease-out` (decelerate) on entrance, `ease-in` (accelerate) on exit** — or the productive/
  expressive entrance/exit pair.
- **NEVER** introduce a custom easing curve unless explicitly requested.

### `data-state` / open-close motion

For overlays with `data-state="open|closed"` (or Vue `<Transition>`), follow the Drawer pattern in
`DESIGN.md` § Motion — a `presets/transitions.ts` helper that reads `duration` + `curve` from
`animate.js` and emits the inline `transition` per phase. Keep transform/opacity in classes; only
timing goes inline. Defer unmount until the longest close duration elapses.

### Accessibility & performance (mandatory)

- **MUST** pair every motion-bearing class with a `motion-reduce:*` escape on the same class string:
  `motion-reduce:transition-none`, `motion-reduce:transform-none`, `motion-reduce:animate-none`.
- **MUST** `aria-hidden="true"` on decorative spinning/looping elements; pause loops off-screen;
  nothing looping > 5s without being pausable.
- **NEVER** animate large `blur()` / `backdrop-filter` surfaces; **NEVER** `will-change` outside an
  active animation; **SHOULD** avoid animating full-screen surfaces or large images.

### Forbidden

- **NEVER** a component-local `@keyframes`, inline `cubic-bezier`, or hardcoded ms literal.
- **NEVER** an external animation library — no `gsap`, `framer-motion`, `motion`, `@vueuse/motion`,
  `@formkit/auto-animate`, lottie, popmotion. Use the utilities above + Vue `<Transition>` /
  `<TransitionGroup>`. See [`dependencies.md`](../../rules/dependencies.md).

## Review output

For `/motion-polish <file>`, list violations. Each:

```
✗ <file>:<line>  transition: all 0.3s cubic-bezier(0.2,0,0,1)
  why: hardcoded duration + inline curve + animates `all` (layout props); no reduced-motion escape.
  fix: transition-transform duration-moderate-01 ease-productive-entrance motion-reduce:transition-none
```

End with: `motion clean` or `N violations`.

## References

- Motion catalog: [`DESIGN.md`](../../docs/DESIGN.md) § Animations, § Motion primitives, § Interactive states, § Reduced motion.
- No-lib rule: [`dependencies.md`](../../rules/dependencies.md).
- Drawer preset reference: `packages/webkit/src/components/webkit/overlay/drawer/presets/transitions.ts`.

## Definition of Done

- [ ] Only `animate-*` utilities and `duration-*` / `ease-*` / `curve` tokens are used.
- [ ] Only `transform` / `opacity` animate (plus catalogued `animate-slide-down`).
- [ ] Interaction feedback ≤ 150ms; entrance `ease-out`, exit `ease-in`.
- [ ] Every motion class has a `motion-reduce:*` escape; decorative loops are `aria-hidden` and pause off-screen.
- [ ] No `@keyframes`, inline `cubic-bezier`, hardcoded ms, or external animation lib.

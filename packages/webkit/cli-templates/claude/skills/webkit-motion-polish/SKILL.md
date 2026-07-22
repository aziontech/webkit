---
name: webkit-motion-polish
description: Make motion smooth using only @aziontech/theme animate tokens — animate-* utilities, duration-*/ease-*/curve tokens, compositor-props-only, ≤150ms interaction feedback, and a mandatory motion-reduce escape on every motion class. No external animation library, no inline cubic-bezier, no hardcoded ms.
status: active
last_updated: 2026-07-20
scope: general
enforced_by: [webkit-motion, webkit-accessibility, ui-verify]
---

# Skill: webkit-motion-polish

## Purpose

Apply motion that feels native to the design system: token-driven, fast, accessible, and limited to
properties the compositor can animate cheaply. Motion should confirm an action or guide attention —
never decorate.

## How to use

- `/webkit-motion-polish`
  Apply the motion constraints below to any animated UI in this conversation.
- `/webkit-motion-polish <file>`
  Review the file's animations and output, per violation:
  - the exact line / snippet (quoted),
  - why it's wrong (1 short sentence),
  - the token-based fix.

## How to find the tokens

Never guess a duration, curve, or utility name. Resolve them the same way every time:

- Ask the **webkit MCP** — it lists the `animate-*` utilities and the `duration-*` / `ease-*` / `curve`
  tokens that ship in `@aziontech/theme`.
- If a utility or token name is not one the MCP lists, it does not exist — do not invent a
  `duration-[…]` or an inline `cubic-bezier`.

## When to invoke

- After structure (`webkit-ux-heuristics`) and baseline (`webkit-baseline-ui`) are sound.
- Adding entrances/exits, hover/active feedback, or overlay open/close motion.
- The user asks to "make it smooth", "add a transition", "animate this".

## Constraints

### Use only the catalogued utilities

The `animate-*` utilities from the animation token catalog (listed by the webkit MCP) — they ship with
`motion-safe` / `motion-reduce` variants:

| Utility                                              | Behavior                                                         |
| ---------------------------------------------------- | ---------------------------------------------------------------- |
| `animate-fade-in` / `animate-fade-out`               | opacity in / out                                                 |
| `animate-slide-down`                                 | height 0 → auto (the one catalogued height animation — see note) |
| `animate-popup-scale-in` / `animate-popup-scale-out` | scale + fade for popovers/menus                                  |
| `animate-slide-in-left` / `animate-slide-out-left`   | left-anchored panel enter/leave (sidebar, nav drawer)            |
| `animate-slide-in-right` / `animate-slide-out-right` | right-anchored panel enter/leave (settings/detail drawer)        |
| `animate-blink`                                      | caret/blink                                                      |
| `animate-highlight-fade`                             | row-flash highlight                                              |

For `animate-popup-scale-in/out`, set `--popup-origin` per instance to match the trigger anchor.

### The panel recipe (sidebar / drawer / any v-if region)

A conditionally rendered region never animates by itself — wrap the `v-if` in a Vue `Transition`
and hand the phases to the catalogued pair:

```vue
<Transition
  enter-active-class="animate-slide-in-left motion-reduce:animate-none"
  leave-active-class="animate-slide-out-left motion-reduce:animate-none"
>
  <aside v-if="sidebarOpen">...</aside>
</Transition>
```

Same shape with `animate-fade-in/out` for in-place content and backdrops, and
`animate-slide-down` for vertical disclosure.

### Timing only from tokens

- **Durations**: `duration-fast-01` (70ms), `duration-fast-02` (110ms), `duration-moderate-01`
  (150ms), `duration-moderate-02` (240ms), `duration-slow-01` (400ms), `duration-slow-02` (700ms).
- **Curves**: `ease-productive-entrance` / `ease-productive-exit` (UI chrome),
  `ease-expressive-entrance` / `ease-expressive-exit` (prominent surfaces), and the generic
  `ease-in` / `ease-out` / `ease-in-out`.
- **NEVER** a hardcoded `duration-[180ms]` / `transition: opacity 200ms`, and **NEVER** an inline
  `ease-[cubic-bezier(...)]` — use the `duration-*` / `ease-*` tokens (the webkit MCP lists them; they
  ship in `@aziontech/theme`).

### Property discipline

- **MUST** animate compositor props only: `transform` and `opacity`.
- **NEVER** animate layout props (`width`, `height`, `top`, `left`, `margin`, `padding`) — they
  thrash layout. (Exception: the catalogued `animate-slide-down` for disclosure height; don't roll
  your own height/width transition beyond it.)
- **SHOULD** avoid animating paint props (`background`, `color`) except small, local UI (a single
  icon, a chip). For hover/active surface fills use the `::before`/`::after` ghost-layer pattern from
  the Interactive states catalog (listed by the webkit MCP) — fade `opacity` on the pseudo-layer, not
  `background` on the root.

### Feel

- **Interaction feedback ≤ `duration-moderate-01` (150ms)** — use `fast-01`/`fast-02` for hover/active.
- **`ease-out` (decelerate) on entrance, `ease-in` (accelerate) on exit** — or the productive/
  expressive entrance/exit pair.
- **NEVER** introduce a custom easing curve unless explicitly requested.

### `data-state` / open-close motion

For overlays with `data-state="open|closed"` (or Vue `<Transition>`), read the `duration` + `curve`
tokens and emit an inline `transition` per phase; keep transform/opacity in classes, only timing goes
inline; defer unmount until the longest close duration elapses.

### Accessibility & performance (mandatory)

- **MUST** pair every motion-bearing class with a `motion-reduce:*` escape on the same class string:
  `motion-reduce:transition-none`, `motion-reduce:transform-none`, `motion-reduce:animate-none`. This
  is the consumer-facing rule — no motion class ships without its reduced-motion escape.
- **MUST** `aria-hidden="true"` on decorative spinning/looping elements; pause loops off-screen;
  nothing looping > 5s without being pausable.
- **NEVER** animate large `blur()` / `backdrop-filter` surfaces; **NEVER** `will-change` outside an
  active animation; **SHOULD** avoid animating full-screen surfaces or large images.

### Forbidden

- **NEVER** a component-local `@keyframes`, inline `cubic-bezier`, or hardcoded ms literal.
- **NEVER** an external animation library — use the animate tokens + Vue `<Transition>` /
  `<TransitionGroup>`.

## Review output

For `/webkit-motion-polish <file>`, list violations. Each:

```
✗ <file>:<line>  transition: all 0.3s cubic-bezier(0.2,0,0,1)
  why: hardcoded duration + inline curve + animates `all` (layout props); no reduced-motion escape.
  fix: transition-transform duration-moderate-01 ease-productive-entrance motion-reduce:transition-none
```

End with: `motion clean` or `N violations`.

## References

- Motion catalog (listed by the webkit MCP): Animations, Motion primitives, Interactive states,
  Reduced motion.

## Definition of Done

- [ ] Only `animate-*` utilities and `duration-*` / `ease-*` / `curve` tokens are used.
- [ ] Only `transform` / `opacity` animate (plus catalogued `animate-slide-down`).
- [ ] Interaction feedback ≤ 150ms; entrance `ease-out`, exit `ease-in`.
- [ ] Every motion class has a `motion-reduce:*` escape; decorative loops are `aria-hidden` and pause off-screen.
- [ ] No `@keyframes`, inline `cubic-bezier`, hardcoded ms, or external animation lib.

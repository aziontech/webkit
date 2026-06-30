# Rule: dependencies — CSS-only, zero external positioning/animation libs

The webkit layer **must not** depend on external libraries for positioning, anchoring, or animation. We control these concerns via plain CSS + the design tokens in [`packages/theme/src/tokens/`](../../packages/theme/src/tokens/). This rule is non-negotiable and exists for three reasons:

1. **Predictable surface.** External positioning libs (`@floating-ui/*`, `popper.js`, `tippy.js`) ship their own behavior tree, their own classes, their own conventions. Each one fights against DESIGN.md. We are the design system; we do not delegate.
2. **Smaller bundles.** Every external positioning/animation lib adds 5–30kb of runtime that CSS already handles.
3. **A11y owned by us.** When a third-party lib places an element, it decides focus, escape, scroll lock. We need those to follow our tokens and our patterns.

## Forbidden — never install or import

| Concern | Forbidden | Use instead |
|---|---|---|
| Positioning / anchoring | `@floating-ui/vue`, `@floating-ui/dom`, `@floating-ui/core`, `popper.js`, `@popperjs/core`, `tippy.js`, `@radix-ui/popper`, `@vue/popperjs` | Native CSS (`position: absolute/fixed`, `transform`, container queries, CSS anchor positioning, Popover API), Vue `<Teleport>` |
| Animation runtime | `gsap`, `framer-motion`, `motion`, `@motionone/vue`, `@vueuse/motion`, `@formkit/auto-animate`, `lottie-web`, `lottie-react`, `popmotion` | The semantic utilities in [`semantic/animations.js`](../../packages/theme/src/tokens/semantic/animations.js), Tailwind `transition-*` / `duration-*` / `ease-*` utilities, Vue `<Transition>` / `<TransitionGroup>`, the easing primitives in [`primitives/animations/ease.js`](../../packages/theme/src/tokens/primitives/animations/ease.js) |
| Drag & drop | `react-dnd`, `@vueuse/gesture`, `interact.js`, `sortablejs` | Native HTML5 DnD, Pointer Events |
| Form field engines | additional form engines beyond what `core/form/*` already wraps (VeeValidate is the established choice) | Existing `core/form/*` |
| Scroll virtualization | `@tanstack/virtual`, `vue-virtual-scroller` | Native scroll + CSS `content-visibility: auto` |

## Allowed (already installed, used as building blocks)

- **Vue 3** primitives — `<Teleport>`, `<Transition>`, `<TransitionGroup>`, `defineModel`, `provide`/`inject`.
- **`clsx` + `tailwind-merge`** via [`@aziontech/webkit/utils/cn`](../../packages/webkit/src/utils/cn.ts) — class merging only.
- **`@vueuse/core`** — small reactive utilities (e.g. `useElementVisibility`). **Not** `@vueuse/motion`.
- **VeeValidate** — only inside `core/form/*` per existing pattern.
- **`@tanstack/vue-table`** — headless table state engine (sorting, pagination, row selection, column models) **only** inside the single `data/table` component's data-driven mode (`data` + `columns`); `data/data-table` is an alias of `data/table`. Granted via the **Exceptions** process below. This is `@tanstack/vue-table` / `@tanstack/table-core` (headless logic) — **not** `@tanstack/virtual` (scroll virtualization), which remains forbidden in the table above.

## How to anchor / position without a lib

For overlays (tooltip, popover, dropdown, menu):

```html
<!-- Anchored via CSS — works in all evergreen browsers -->
<button class="anchor"><!-- trigger --></button>
<div class="absolute left-0 top-full mt-[var(--spacing-1)]"><!-- popover --></div>

<!-- Or via the native Popover API + CSS anchor positioning -->
<button popovertarget="menu">Open</button>
<div id="menu" popover class="absolute"><!-- ... --></div>
```

Use Vue `<Teleport to="body">` when the overlay must escape an `overflow: hidden` ancestor. Combine with `position: fixed` + CSS variables (`--popup-origin`) to anchor the transform.

## How to animate without a runtime lib

```html
<!-- Tailwind utilities composed with our tokens -->
<div class="transition-opacity duration-150 ease-out motion-reduce:transition-none">

<!-- The semantic animation utilities -->
<div class="animate-popup-scale-in motion-reduce:animate-none">

<!-- Vue <Transition> binding to the semantic classes -->
<Transition
  enter-active-class="animate-fade-in"
  leave-active-class="animate-fade-out"
>
  <div v-if="open">...</div>
</Transition>
```

The catalog is in [`.claude/docs/DESIGN.md`](./tokens.md#animations--semanticanimationsjs).

## Hook coverage

[`validate-references.mjs`](../hooks/validate-references.mjs) already blocks imports for any package not present in `node_modules/`. The simplest enforcement is therefore "do not install the lib in the first place." If a sub-agent needs an animation/positioning behavior and proposes installing a lib, emit:

```
BLOCKED: forbidden dependency <name>. Use CSS + tokens per .claude/rules/dependencies.md.
```

## Exceptions

If a future component genuinely cannot be built without an external lib (e.g. an embedded code editor like Monaco), it requires (a) a written rationale in the spec's **Purpose** section, (b) explicit human approval, and (c) an entry in this file's **Allowed** section.

### Granted exceptions

| Lib | Scope | Rationale | Approved |
|---|---|---|---|
| `@tanstack/vue-table` (`@tanstack/table-core`) | `data/table` only (data-driven mode) | A correct, accessible, headless table state engine (sorting / pagination / row selection / column visibility, client- and server-side) is large surface to own in-house and is a pure-logic library — it ships **no** markup, styles, positioning, or animation, so it does not fight DESIGN.md. Rendering stays 100% in our own `data/table` sub-components (our tokens, our a11y). Rationale recorded in `.specs/table.md` § Purpose (added when the data-driven mode lands). | Human-approved 2026-06-15 |

> The exception is **narrow**: `@tanstack/vue-table` is permitted only as the state engine behind the single `data/table` component. Do not import it in other components, and do not pull in `@tanstack/virtual` or any other `@tanstack/*` package without a new exception row.

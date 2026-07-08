# Rule: accessibility — role, keyboard, focus, motion, owned by the component

A component in this package is accessible **by construction**, not by the consumer's remediation. Every interactive component ships its role, its keyboard model, its focus behaviour, and its reduced-motion fallback. This rule fixes that contract so a consumer who drops in `<Dialog>` or `<Table>` gets WCAG-correct behaviour without wiring anything.

## The rule

> Every interactive component declares its **role / ARIA**, a **keyboard model**, correct **focus management** (`useId` for associations, `focus-visible` ring, focus trap + restore for overlays), and a **`motion-reduce:` fallback** for every animation. These are part of the spec and part of the component — never left to the consumer.

### Roles & ARIA

- Use the **native element** whose semantics match before reaching for `role` (`<button>`, `<a href>`, `<input>`); add `role` only when no native element fits.
- ARIA state attributes mirror the component's `data-*` state (`aria-expanded` with `data-state="open"`, `aria-disabled` with `data-disabled`, `aria-invalid` with `data-invalid`).
- Accessible name via **`ariaLabel`** prop (+ prefixed `xAriaLabel` for sub-parts) per [`prop-vocabulary.md`](./prop-vocabulary.md) — never `aria-label` as a raw prop name.

### Keyboard

- The spec's a11y section lists the **keyboard map** (e.g. dialog: `Esc` closes, `Tab` is trapped; menu: arrows move, `Enter` selects, `Esc` closes). The component implements exactly that map.
- Anything clickable is reachable and operable by keyboard — no `@click` on a non-interactive element without the matching key handler (enforced by `vuejs-accessibility/click-events-have-key-events`).

### Focus

- **`useId()`** for every id used in a `for`/`aria-labelledby`/`aria-describedby` association — stable across SSR, never a hand-rolled counter (see [`composables.md`](./composables.md)).
- **`focus-visible`** ring using the ring token (`focus-visible:ring-[var(--ring-color)]`), never a raw color (see [`styling.md`](./styling.md)).
- **Overlays trap focus and restore it**: focus moves into the overlay on open, is trapped while open, and returns to the trigger on close — via the focus-trap composable (VueUse primitive, per [`dependencies.md`](./dependencies.md)), not a hand-written trap.

### Motion

- Every motion-bearing class pairs with **`motion-reduce:`** (`motion-reduce:transition-none` / `motion-reduce:animate-none`). No animation is exempt (see [`styling.md`](./styling.md) and the animation catalog in [`tokens.md`](../docs/DESIGN.md)).

## Hard prohibitions

- Do not add `role`/ARIA to fake an interactive element when a native one fits.
- Do not put `@click` on a non-interactive element without a keyboard handler.
- Do not hand-roll ids — use `useId()`.
- Do not use a raw color for the focus ring — use the ring token.
- Do not open an overlay without trapping focus and restoring it to the trigger on close.
- Do not ship a motion class without its `motion-reduce:` fallback.
- Do not name the accessible-name prop `aria-label` — use `ariaLabel` (see [`prop-vocabulary.md`](./prop-vocabulary.md)).

## Enforcement

- **`eslint-plugin-vuejs-accessibility`** runs in the flat config ([`eslint.config.js`](../../eslint.config.js)) at `error` — today `alt-text`, `aria-props`, `aria-role`, and `click-events-have-key-events` are **blocking** in CI (`lint` job, zero warnings). Expanding to the full `flat/recommended` a11y set is a **ratchet**: enable the rest, fix the violations they surface, then keep them at `error`.
- **Automated a11y (`axe`)** runs per component story in the test layer (Storybook a11y addon + `axe` assertions) — the component-testing frontier. A component with an axe violation fails its story test.
- **[`validate-spec-compliance.mjs`](../hooks/validate-spec-compliance.mjs)** enforces the `ariaLabel` naming; the spec's a11y section (role + keyboard map) is required by [`.specs/_template.md`](../../.specs/_template.md).

## Why this rule exists

Accessibility lived as a "Best Practices" prose section in `COMPONENT_REQUIREMENTS.md`, and the ESLint a11y plugin caught only the static ~40% (missing `alt`, bad `role`). Focus trapping, restore-on-close, the keyboard map, and `useId` associations — the behavioural 60% — were left to whoever built the component. Making them a per-component contract (declared in the spec, implemented in the component, checked by `axe` in the test layer) is what lets a consumer trust every webkit component in a WCAG-audited app.

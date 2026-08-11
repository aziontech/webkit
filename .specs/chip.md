---
name: chip
category: inputs
structure: monolithic
status: approved
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=476-948
  node_id: 476:948
checksum: aa9ca91fe16be0c61abc721d182cdf9b822887ebac041be5d0e11236e4b89ac1
created: 2026-06-23
last_updated: 2026-08-11
---

# Chip — Component Spec

## Purpose

A Chip is a compact, pill-shaped token that labels a discrete value the user has applied — most often a filter on a data view. Unlike `tag` (a read-only status/category badge with severity color coding), a Chip carries no severity and exposes an optional trailing remove control: when `removable` is set, it renders a real `<button>` that emits `remove`, so the consumer can drop the value from a collection. This is the token consumed by the data table's `#filters` slot (`<Chip :label="f.label" removable @remove="dropFilter(f)" />`): each active filter becomes one removable Chip, and dismissing it removes that filter. Reach for a Chip when a value is user-applied and dismissible; reach for `tag` when it is a static status or category indicator.

`kind` covers the three jobs a chip does in a filter surface, so a consumer never restyles the component to get one of them:

- **`filled`** — a value that IS applied. The raised surface, default border and shadow: the loudest of the three, because it is state.
- **`outlined`** — a value the user COULD apply. Same border, no fill and no shadow: it recedes to an offer without becoming disabled, so a filter vocabulary can stay on screen instead of hiding inside a menu.
- **`dashed`** — the control that CREATES a chip ("Add filter"). A dashed outline is the standing convention for "add another one of these", which is what separates the thing that makes filters from the things that are filters.

**Presence is the consumer's, not the chip's.** `remove` fires the moment the control is activated; the chip does not animate itself away or unmount itself. A chip that hid itself on remove could only ever serve the one case where removing it also destroys it — a filter bar where a removed value stays on screen as an `outlined` offer was impossible, because the instance stayed invisible forever. Exit motion, if wanted, belongs to whatever owns the list (a `TransitionGroup` around the group).

## When to use

- Represent a selectable or removable token — active filters, multi-select values, entered keywords.
- Represent a value that is *available* but not applied (`kind="outlined"`), so the set of things a view can be narrowed by stays visible.
- Represent the "add another" affordance for such a set (`kind="dashed"`).
- The element is interactive (clickable / dismissible).

## When NOT to use

- It is a static count or one-glance status → use `badge`.
- It is a static descriptive label/category with no interaction → use `tag`.

## Related

- `badge` — static count/short-value indicator.
- `tag` — static labelled status/category chip.
- `tooltip` — composed by the remove control to name what it removes.

**Dependency note.** `removable` pulls in `tooltip` (and through it `use-placement` / `use-controllable`). That is deliberate — an unnamed `×` in a row of identical `×`s is the defect being fixed — but it is real weight on a component that renders in lists, so it belongs in the bundle budget when one is added for this entry.

## Best practices

- When removable, expose an accessible remove control with a clear label.
- Group related chips in a `chip-group` rather than ad-hoc layout.

## Usage

```vue
<script setup>
import Chip from '@aziontech/webkit/chip'
</script>

<template>
  <!-- applied: state -->
  <Chip label="Active" kind="filled" size="medium" clickable removable @click="onEdit" @remove="onRemove" />
  <!-- available: an offer -->
  <Chip label="Status" kind="outlined" size="medium" clickable @click="onPick" />
  <!-- the control that creates one -->
  <Chip label="Add filter" kind="dashed" size="medium" clickable @click="onAdd" />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `label` | `string` | `''` | false | Fallback text when the default slot is empty. |
| `kind` | `'filled' \| 'outlined' \| 'dashed'` | `'filled'` | false | Visual variant. Filled is an applied value, outlined an available one, dashed the control that adds one. |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token; `small` is a fixed 24px, `medium` a fixed 32px. |
| `removable` | `boolean` | `false` | false | When true, renders a trailing remove button that emits `remove`. |
| `clickable` | `boolean` | `false` | false | When true, the chip body becomes interactive (`role="button"`, focusable) and emits `click` on activation (click / Enter / Space). |

## Events

| Event | Payload | Notes |
|---|---|---|
| `remove` | `(event: MouseEvent, label: string)` | Fires when `removable` is true and the remove button is activated (click / Enter / Space), **immediately** — the chip does not hide or unmount itself first, so the consumer decides whether the chip disappears, stays, or becomes an `outlined` offer. `label` is the chip's `label` prop, identifying which chip was removed. |
| `click` | `(event: MouseEvent \| KeyboardEvent, label: string)` | Fires only when `clickable` is true and the chip body is activated — by pointer, or `Enter` / `Space` while the root is focused. `label` identifies which chip was clicked. The trailing remove button stops propagation, so activating it emits `remove` only, never `click`. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Chip content; falls back to `label` when empty. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`
- `data-kind` mirrors the `kind` prop (`filled` | `outlined` | `dashed`)
- `data-size` mirrors the `size` prop (`small` | `medium`)
- `data-removable` is present when the `removable` prop is true
- `data-clickable` is present when the `clickable` prop is true
- When `clickable`, the root is an interactive `role="button"` with `tabindex="0"`: it shows `cursor-pointer`, a `::before` ghost-layer darkening overlay (`--bg-hover`) on `hover` and `active`, a `--border-strong` border on `active` (the pressed state, per Figma), and a visible focus ring on `focus-visible`. When not clickable, the root stays a non-interactive container.
- The remove button (when `removable`) is always independently focusable and shows its own focus ring on `focus-visible`. It carries a **`tooltip`** naming what it removes, shown on hover and on keyboard focus — in a row of chips four identical `×` controls sit side by side, and the field name is what tells them apart.
- All three kinds share the same `--border-default` border at rest, so a row of chips reads as one family; the kinds differ only in **fill and elevation**. When `clickable`, hover raises the border to `--border-strong` — the same rest→hover pair `input-text` and `select-trigger` use. That pair is what makes the outline read as interactive at all: `--border-default` is 8% black, the *same value* as `--border-muted` in the light theme, so a static border of either token is indistinguishable. `filled` carries the raised surface and `--shadow-sm`; `outlined` drops both, which is what makes an applied value louder than an available one without changing the outline it is drawn with. `dashed` is `outlined` with a dashed border.

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| remove (chip dismiss) | **none — the chip does not animate its own removal.** It emits `remove` and leaves presence to the consumer; exit motion belongs to whatever owns the list. The chip sets **no inline `transition`**, so a consumer's own `transition-*` utilities on the root are never overridden (an inline style beats every class, which silently killed consumer-authored chip motion). | — | — |
| kind / border colour change | `transition-[color,background-color,border-color,box-shadow] duration-fast-02 ease-productive-entrance` | DESIGN.md § Interactive states | `motion-reduce:transition-none` |
| remove button hover/focus state change | `transition-colors duration-fast-02 ease-productive-entrance` | DESIGN.md § Interactive states | `motion-reduce:transition-none` |
| remove tooltip open / close | owned by `tooltip` (`animate-popup-scale-in` / `animate-popup-scale-out`) | semantic/animations.js | `motion-reduce:animate-none` (from `tooltip`) |
| clickable hover / active (chip body) | `::before` ghost-layer `opacity` overlay (`--bg-hover`) shown on `hover` and `active`, only when `clickable`; `active` also flips the border to `--border-strong` | `before:duration-fast-02 before:ease-productive-entrance` (DESIGN.md § Interactive states) | `motion-reduce:before:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| surface (`filled`) | `var(--bg-surface-raised)` |
| surface (`outlined`, `dashed`) | transparent — no fill |
| border (all kinds, rest) | `var(--border-default)` |
| border (clickable, hover) | `var(--border-strong)` |
| shape | fully rounded (pill) |
| elevation (`filled`) | `var(--shadow-sm)`; `outlined` / `dashed` carry none |
| typography (both sizes) | `.text-label-sm` + `leading-none` |
| text | `var(--text-default)` |
| spacing (medium padding) | `var(--spacing-sm)` / `var(--spacing-xs)` |
| spacing (small padding) | `var(--spacing-xs)` / `var(--spacing-xxs)` |
| spacing (label↔icon gap) | `var(--spacing-xxs)` |
| ring | `var(--ring-color)` |
| interactive overlay (clickable hover / active) | `var(--bg-hover)` (ghost layer) |
| border (clickable active) | `var(--border-strong)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| raised surface `var(--bg-surface-raised)` | `var(--bg-surface-raised)` (exists in the theme; not yet catalogued in DESIGN.md) | `TODO: catalogar --bg-surface-raised em DESIGN.md` |
| border width `var(--border-width-default)` | **1px, from the plain `border` utility.** `border-(length:--border-width-default)` emits no CSS at all in Tailwind v4 — verified against the built stylesheet — so the token cannot be applied through that syntax. It is used the same dead way in 10+ other components. | `TODO: repo-wide — replace the dead `border-(length:--border-width-default)` with a syntax that emits, or drop the token` |
| label↔icon gap `6px` | `var(--spacing-xxs)` (4px) | `TODO: tokenizar gap de 6px se virar recorrente` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: both the clickable root (when `clickable`) and the remove button use `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`.
- Keyboard map: when `clickable`, the root is focusable (`tabindex="0"`) and `Enter` / `Space` **dispatch a real DOM click** on the root (`preventDefault`ed first, so `Space` does not scroll), which in turn emits `click`. Dispatching rather than emitting directly is what lets a chip serve as an overlay trigger — `Popover.Trigger` and friends open on the DOM click that bubbles out of their child, so a chip that only emitted a Vue event would work with the mouse and do nothing from the keyboard. When `removable`, `Tab` reaches the remove button and `Enter` / `Space` activate it and emit `remove`. Keystrokes that originate on the remove button do not bubble to the root activation (the handler ignores events whose `target` is not the root itself).
- ARIA: when not `clickable`, the root is a non-interactive `<span>` container; when `clickable`, it is `role="button"` with `tabindex="0"`. The remove control is a real `<button type="button">`; the `pi pi-times` glyph is `aria-hidden="true"`. Its `aria-label` and its tooltip text are **the same derived string** — `Remove <label>` when `label` is set, `Remove` otherwise — so what is shown and what is announced cannot drift.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including the remove icon.
- `motion-reduce:transition-none` on every transition the chip declares (kind/border colour, remove-button colour). The chip declares no dismiss animation at all, so there is nothing to suppress there.
- Touch target: the remove control is **24×24 px at `medium`** — the WCAG 2.5.8 (AA) minimum — and 16×16 px at `small`, a justified deviation for the compact 24px token where the surrounding chip remains the visible affordance. The earlier build drew the control at 14×14 px at every size, which met neither.

## Stories (Storybook)

- Default — the baseline Chip with `label`.
- Types — composite story rendering `filled`, `outlined` and `dashed` side by side, justified because `kind` is a real axis with three values that carry different meanings (applied / available / adds one).
- Sizes — composite story rendering `small` and `medium` side by side, justified because `size` is a real axis with two values.
- Removable — args delta `removable: true`, wiring the `remove` event to the Actions panel; justified because `removable` is a real boolean state that changes the rendered anatomy (adds the trailing remove button) and the emitted event.
- Clickable — args delta `clickable: true`, wiring the `click` event to the Actions panel; justified because `clickable` is a real boolean state that turns the chip body into an interactive `role="button"` and emits a distinct event.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

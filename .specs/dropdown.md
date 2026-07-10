---
name: dropdown
category: navigation
structure: composition
status: implemented
spec_version: 2
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3775-16746&m=dev
  node_id: 3775:16746
checksum: 29f3a5abd7a8e37062a7624b0a0f70f49f3fdbe1b1f7b1ddd97bf03baf2c2bd3
created: 2026-06-26
last_updated: 2026-06-29
---

# Dropdown — Component Spec

## Purpose

Overlay menu that opens from a consumer-supplied trigger and renders a list of selectable options grouped into named sections. The root `Dropdown` owns open/closed state, positioning, focus return, and keyboard navigation; `Dropdown.Trigger` wires `aria-haspopup`/`aria-expanded`/`aria-controls` onto whatever element the consumer passes through its slot; `Dropdown.Group` groups options under an optional uppercase label; `Dropdown.Option` is the selectable row with left/right/command affordances. Replaces and removes the legacy monolithic input `dropdown` and the previous `dropdown-menu` composition — there is one `Dropdown` in the project, in `navigation/`.

## Usage

```vue
<script setup>
import Dropdown from '@aziontech/webkit/dropdown'
import Button from '@aziontech/webkit/button'
</script>

<template>
  <Dropdown @select="onSelect">
    <Dropdown.Trigger>
      <Button kind="secondary">Open menu</Button>
    </Dropdown.Trigger>

    <Dropdown.Group label="Account">
      <Dropdown.Option value="profile" label="Profile" command="⌘P" />
      <Dropdown.Option value="settings" label="Settings" command="⌘," />
      <Dropdown.Option value="billing" label="Billing" disabled />
    </Dropdown.Group>

    <Dropdown.Group label="Workspace">
      <Dropdown.Option value="invite" label="Invite members" />
      <Dropdown.Option value="logs" label="Audit log" selected />
    </Dropdown.Group>
  </Dropdown>
</template>
```

Tree-shaking alternative — the same sub-components as standalone imports:

```vue
<script setup>
import Dropdown from '@aziontech/webkit/dropdown'
import DropdownTrigger from '@aziontech/webkit/dropdown-trigger'
import DropdownGroup from '@aziontech/webkit/dropdown-group'
import DropdownOption from '@aziontech/webkit/dropdown-option'
</script>
```

## Sub-components

- `dropdown-trigger/dropdown-trigger.vue` — slot-only abstract wrapper. Reads `inject` for `isOpen`, `triggerId`, `contentId`, `setOpen`. Renders a single inline element that toggles the panel on click and exposes `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`.
  - Props: _none_.
  - Events: _none_ (the root handles `update:open`).
  - Slots: `default` with scope `{ isOpen: boolean }` — the consumer's trigger element. The wrapper attaches aria + click; the consumer must not bind those props itself.
- `dropdown-group/dropdown-group.vue` — labeled section. Renders an uppercase `label` row (`text-overline-sm`) above its default slot and a top divider when it is not the first group inside the panel.
  - Props: `label: string` default `''` — uppercase section label rendered above the options. Omit for an unlabeled group.
  - Events: _none_.
  - Slots: `default` — one or more `<Dropdown.Option>`; `top` — inline region rendered between the group label and the options (e.g. a per-section search or description); `bottom` — inline region rendered after the options (e.g. a "see all" link).
- `dropdown-option/dropdown-option.vue` — selectable row. Renders the left slot, the label, the right slot, and an optional `command` hint. Calls injected `selectOption(value, event)` on click / `Enter` / `Space`.
  - Props:
    - `value: string | number` (required) — identifier emitted on the root `select` event when this option is activated.
    - `label: string` default `''` — plain-text label; falls back to the default slot when omitted.
    - `command: string` default `''` — keyboard-shortcut hint rendered on the right side (e.g. `'⌘P'`, `'⇧⌘P'`, `'Ctrl+,'`). While the panel is open the root listens for `window` `keydown`, matches the shortcut against every mounted option, and emits `select` for the matching option (preventing the browser default). Shortcuts are active only while the panel is open, since options are only mounted then. Mutually exclusive with the `right` slot.
    - `disabled: boolean` default `false` — disables interaction and applies disabled tokens.
    - `selected: boolean` default `false` — marks the option as currently selected (background + checkmark).
  - Events: _none_ (root emits `select`).
  - Slots: `default` (override of the `label` prop, for rich label content), `left` (left icon / avatar), `right` (right icon / badge; mutually exclusive with `command`).

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `open` | `boolean` | `undefined` | no | Controlled open state. Use with `v-model:open` or `@update:open`. When omitted, the component is uncontrolled. |
| `placement` | `'auto' \| 'bottom-start' \| 'bottom-end' \| 'top-start' \| 'top-end'` | `'bottom-start'` | no | Where the panel opens relative to the trigger. `'auto'` picks the best-fitting corner at open time based on viewport space. |
| `offset` | `number` | `4` | no | Pixel gap between the trigger and the panel. |
| `disabled` | `boolean` | `false` | no | Prevents the trigger from opening the panel and applies disabled tokens. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:open` | `boolean` | Fires on every open/closed transition; supports `v-model:open`. |
| `select` | `(event: MouseEvent \| KeyboardEvent, value: string \| number)` | Fires when an enabled option is activated (click, `Enter`/`Space`, or a `command` shortcut). `event` is the activation event; `value` is the activated option's identifier. The panel closes automatically and focus returns to the trigger when activated from inside the open panel. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | Place `<Dropdown.Trigger>` followed by one or more `<Dropdown.Group>`. |
| `top` | — | Sticky region rendered above the scrollable group list (e.g. search input). |
| `bottom` | — | Sticky region rendered below the scrollable group list (e.g. footer action). |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`, `selected`
- `data-state` values (root + trigger): `open` | `closed`
- `data-disabled` mirrors the `disabled` prop on root, trigger, and option
- `data-selected` on option mirrors the `selected` prop
- `data-placement` on the root mirrors the `placement` prop (`'auto'` stays as `'auto'`)
- `data-placement` on the panel mirrors the resolved placement (`'bottom-start' | 'bottom-end' | 'top-start' | 'top-end'`)

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| panel open | `animate-popup-scale-in` (origin from `--popup-origin`) | semantic (`moderate-01` · `productive-entrance`) | `motion-reduce:animate-none` (instant) |
| panel close | `animate-popup-scale-out` | semantic (`fast-02` · `productive-exit`) | `motion-reduce:animate-none` (instant) |
| option hover / selected change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| panel surface | `var(--bg-surface)` |
| panel border | `var(--border-default)` |
| panel shape | `var(--shape-card)` |
| panel shadow | `var(--shadow-sm)` |
| panel typography (group label) | `.text-overline-sm` + `text-[var(--text-muted)]` |
| panel typography (option label) | `.text-label-sm` + `text-[var(--text-default)]` |
| option shape | `var(--shape-button)` |
| option spacing.x | `var(--spacing-sm)` |
| option spacing.y | `var(--spacing-xxs)` |
| option gap | `var(--spacing-xs)` |
| option hover surface | `var(--bg-hover)` |
| option selected surface | `var(--bg-selected)` |
| option disabled text | `var(--text-disabled)` |
| option command text | `text-[var(--text-muted)]` |
| group divider | `border-t border-[var(--border-default)]` |
| focus ring | `var(--ring-color)` |
| popup origin | `var(--popup-origin)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `--bg-surface-raised` (#141414) | `var(--bg-surface)` | `TODO: tokenizar bg-surface-raised como camada acima de bg-surface` |
| `--radius-md` (6px) | `var(--shape-card)` | `TODO: confirmar se panel deve usar 6px (md) ou herdar shape-card` |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on trigger and option.
- Keyboard map:
  - On the trigger: `Enter` / `Space` opens the panel and focuses the first enabled option; `Down` opens and focuses the first option; `Up` opens and focuses the last option.
  - Inside the panel: `Down` / `Up` move between enabled options (wrap-around); `Home` / `End` jump to first/last enabled option; `Enter` / `Space` activate the focused option; `Esc` closes the panel and returns focus to the trigger; `Tab` closes the panel and lets focus proceed to the next focusable element.
- ARIA: trigger exposes `aria-haspopup="menu"`, `aria-expanded`, `aria-controls`; panel uses `role="menu"`; each group uses `role="group"` + `aria-labelledby` pointing at its label id (when `label` is set); each option uses `role="menuitem"`, `aria-disabled` mirrors `disabled`; selected option uses `aria-current="true"`.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled state (validated via `--text-disabled` token).
- `motion-reduce:animate-none` on `animate-popup-scale-*`; `motion-reduce:transition-none` on `transition-colors` for hover/selected states.
- Touch target ≥40×40 px on the trigger; option rows are 32 px tall and are activated by full-row click + keyboard, satisfying the 24×24 px target floor for in-menu items per WCAG 2.5.8.

## Stories (Storybook)

Canonical layout — matches `apps/storybook/src/stories/webkit/actions/button/Button.stories.js`. Composite stories render every variant of one axis side-by-side in a single frame; state stories use the reusable `Template` with an args delta.

- Default — one trigger, one group, six options, no left/right affordances.
- Groups — composite story rendering two `<Dropdown.Group>` with labels and a divider between them; required because grouping is the central anatomy of this component and is not covered by `Default`.
- States — composite story rendering one panel with options in each option state side-by-side: `default`, `hover` (simulated via `data-state`), `selected`, `disabled`. Required because `Dropdown.Option` has no `kind` / `size` axis but a state axis that is the component's visual identity.
- Placements — composite story rendering all four explicit `placement` values (`bottom-start`, `bottom-end`, `top-start`, `top-end`) side-by-side. Required because `placement` is a multi-value prop axis with no other coverage; consumers need to see how each placement anchors against its trigger.
- AutoPlacement — composite story demonstrating `placement="auto"`: four triggers anchored near each viewport corner so the resolver opens the panel toward the corner with the most available space. Required because `'auto'` is the only `placement` value not covered by `Placements` and is the recommended default for consumer-positioned triggers.
- OptionAffordances — composite story rendering options that demonstrate the `command` prop and the `left` + `right` slots in a single panel. Required because these affordances are public Option API surface the existing stories do not exercise, and the spec calls out their mutual exclusivity.
- WithTopAndBottomSlots — single panel forced open showing the root `top` and `bottom` named slots in use (e.g. a search input on top, a footer action on bottom). Required because both slots are public root API documented in the Slots table and have no other coverage.
- GroupsWithTopAndBottomSlots — panel forced open with two `<Dropdown.Group>` each using its own `top` (per-section caption) and `bottom` (per-section action) slots. Required because the group-level `top`/`bottom` are public API on `Dropdown.Group` and behave differently from the root slots (inline, per-section — not sticky).
- CustomTriggers — composite story showing the abstract `<Dropdown.Trigger>` wrapping different elements (Button, IconButton, plain text). Required because the spec mandates the trigger is abstract and the consumer chooses the inner element; the existing stories only show a `Button`.

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
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export and the root `package.json` main/module point at `index.ts`, `types` at `index.d.ts`. Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

---
name: accordion
category: content
structure: composition
status: implemented
spec_version: 1
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=480-876
  node_id: "480:876"
checksum: 9622e5553d34740b37547c94095a517c81bec07e36ed29a7e03766753336a2f4
created: 2026-06-26
last_updated: 2026-06-26
---

# Accordion — Component Spec

## Purpose

A vertically stacked set of disclosure items: each item has a clickable header that expands or collapses its content panel. Use it to condense long content into scannable sections. Unlike `tab-view` (mutually-exclusive panels shown in place), an accordion can keep one item open at a time (`type="single"`) or several at once (`type="multiple"`), and its content expands inline below each header.

## Usage

```vue
<script setup>
import Accordion from '@aziontech/webkit/accordion'
</script>

<template>
  <Accordion
    type="single"
    collapsible
    default-value="overview"
    size="medium"
    arrow-position="right"
  >
    <Accordion.Item value="overview">
      <Accordion.Trigger>What is Azion?</Accordion.Trigger>
      <Accordion.Content>Azion runs your code at the edge, close to users.</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="pricing">
      <Accordion.Trigger>How does pricing work?</Accordion.Trigger>
      <Accordion.Content>Pay only for what you use, with no upfront cost.</Accordion.Content>
    </Accordion.Item>
    <Accordion.Item value="support" disabled>
      <Accordion.Trigger>Enterprise support</Accordion.Trigger>
      <Accordion.Content>Available on Business and Enterprise plans.</Accordion.Content>
    </Accordion.Item>
  </Accordion>
</template>
```

Tree-shaking alternative — the same sub-components as standalone imports:

```vue
<script setup>
import Accordion from '@aziontech/webkit/accordion'
import AccordionItem from '@aziontech/webkit/accordion-item'
import AccordionTrigger from '@aziontech/webkit/accordion-trigger'
import AccordionContent from '@aziontech/webkit/accordion-content'
</script>
```

## Sub-components

The root ships a **compound API**: an `index.ts` (beside `accordion.vue`) attaches every sub-component to the root so `<Accordion.Item>` / `<Accordion.Trigger>` / `<Accordion.Content>` resolve from one import; the standalone imports above remain the tree-shaking path. The root is a disclosure component with `data-state="open|closed"`, so `Trigger` / `Content` are the correct anatomy names. Shared open-state flows through `provide`/`inject` (`injection-key.ts`), so the consumer wires nothing.

- `accordion-item/accordion-item.vue` — One disclosure row. Registers itself with the root by `value`, derives its own open/closed state from the injected context, and groups a `Trigger` + a `Content`.
  - Props: `value: string` (**required** — unique identifier used by the open-state model), `disabled?: boolean` (default `false` — prevents this item from toggling; from the Figma component description).
  - Slot: `default` — the item's `Accordion.Trigger` and `Accordion.Content`.
- `accordion-trigger/accordion-trigger.vue` — The clickable header row (Figma "Header"): renders the title plus the `pi pi-chevron-down` glyph, toggles the item through the injected context, and exposes `aria-expanded` / `aria-controls`. To satisfy the ARIA accordion pattern, the `<button>` is wrapped in a heading element.
  - Props: `level?: 2 | 3 | 4 | 5 | 6` (default `3` — heading level of the wrapping `<h{level}>` for correct document outline).
  - Slot: `default` — header title content.
- `accordion-content/accordion-content.vue` — The collapsible panel. Mounts only when its item is open, reads the content/trigger ids from context, and exposes `role="region"` + `aria-labelledby`.
  - Slot: `default` — panel body content.

Resulting layout (no per-component `package.json` — dropped repo-wide; the root `packages/webkit/package.json#exports` resolves every path; `.d.ts` is generated at publish time, never committed):

```
packages/webkit/src/components/content/accordion/
├── accordion.vue                 (root; owns type/value/size/arrowPosition, provides context)
├── index.ts                      (compound: attaches Item / Trigger / Content to the root)
├── injection-key.ts              (shared AccordionContext)
├── accordion-item/
│   └── accordion-item.vue
├── accordion-trigger/
│   └── accordion-trigger.vue
└── accordion-content/
    └── accordion-content.vue
```

Exports to add to `packages/webkit/package.json#exports` (flat public names; category lives in the folder only):

```jsonc
"./accordion": "./src/components/content/accordion/index.ts",
"./accordion-item": "./src/components/content/accordion/accordion-item/accordion-item.vue",
"./accordion-trigger": "./src/components/content/accordion/accordion-trigger/accordion-trigger.vue",
"./accordion-content": "./src/components/content/accordion/accordion-content/accordion-content.vue"
```

## Props

Props below belong to the root `Accordion`. Sub-component props are documented in the **Sub-components** section above.

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `type` | `'single' \| 'multiple'` | `'single'` | no | Whether one or multiple items can be open at the same time. |
| `value` | `string \| string[] \| null` | `undefined` | no | Controlled open item(s): a single `value` string in single mode, an array of values in multiple mode. Use with `v-model:value`. |
| `defaultValue` | `string \| string[] \| null` | `null` | no | Initial open item(s) when uncontrolled. |
| `collapsible` | `boolean` | `true` | no | In single mode, lets the open item collapse so that no item is open. |
| `size` | `'medium' \| 'large'` | `'medium'` | no | Size token; affects header height, padding, and typography. Provided to every item via context. |
| `arrowPosition` | `'left' \| 'right'` | `'right'` | no | Side of the header the chevron sits on. Provided to every item via context. |

## Events

Events below are emitted by the root `Accordion`.

| Event | Payload | Notes |
|---|---|---|
| `update:value` | `string \| string[] \| null` | `v-model:value`. Fires when the open item(s) change. |
| `value-change` | `string \| string[] \| null` | Convenience event mirroring `update:value`. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | — | The `Accordion.Item` children. Each sub-component's own `default` slot is documented in the Sub-components section. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values: `open` | `closed` — on the item, the trigger, and the content
- `data-disabled` mirrors the per-item `disabled` prop
- `data-orientation`: `vertical`

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| chevron rotate on open | `transition-transform duration-150 ease-out` + `data-[state=open]:rotate-180` | inline (matches catalog) | `motion-reduce:transition-none` |
| content reveal on open (on `Accordion.Content` only) | fade-in semantic utility from `animations.js` | semantic (matches catalog) | reduced-motion fallback via the matching `motion-reduce` utility |
| header hover state change | `transition-colors duration-150 ease-out` | inline (matches catalog) | `motion-reduce:transition-none` |

> Figma declares no motion spec for this component (the open/closed/hover states are static variants). The transitions above are taken from our existing catalog — the chevron pattern mirrors `select-trigger.vue` (`data-[state=open]:rotate-180`), and the content reveal reuses the fade-in semantic utility (as `tab-view` does). No component-local `@keyframes`.

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| header title typography (large / medium) | `.text-body-md` / `.text-body-sm` |
| content body typography (large / medium) | `.text-body-sm` / `.text-body-xs` |
| header title text | `var(--text-default)` |
| content body text | `var(--text-muted)` |
| disabled text | `var(--text-disabled)` |
| header divider (bottom border) | `var(--border-default)` |
| item divider when closed | `var(--border-muted)` |
| header padding-x | `var(--spacing-md)` |
| header gap (arrow right / left) | `var(--spacing-sm)` / `var(--spacing-xs)` |
| content padding (large / medium) | `var(--spacing-xl)` / `var(--spacing-md)` |
| focus ring / ring offset | `var(--ring-color)` / `var(--bg-canvas)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| `Heading/xss` · `Heading/xs` (Sora Regular, line-height 1.4) used for the header title | `.text-body-sm` · `.text-body-md` (line-height 1.5, same 14px / 16px sizes, same Regular weight) | `TODO: decide whether to surface text-heading-xs/xxs in DESIGN.md, or keep the body family for the title` |
| `Hover=True` variant (delta not resolvable via the Figma MCP bound-variable API) | `hover:bg-[var(--bg-hover)]` on the trigger | `TODO: confirm the header hover treatment with design` |
| `--border-width-default` (0.8px header / item divider) | `border-b` (1px) | `TODO: tokenize the sub-pixel border width if it must match exactly` |

## Accessibility (WCAG 2.1 AA)

- Visible focus (Figma has no focus variant; we own it): `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on each `Accordion.Trigger`.
- Keyboard map: `Tab` / `Shift+Tab` move between triggers and into open content; `Enter` / `Space` toggle the focused item; `Arrow Down` / `Arrow Up` move focus to the next / previous trigger; `Home` / `End` move focus to the first / last trigger.
- ARIA: each trigger is a `<button>` with `aria-expanded` reflecting open state and `aria-controls` referencing its content; the trigger button is wrapped in a heading element (`<h{level}>`, default `h3`); the content panel has `role="region"` and `aria-labelledby` referencing its trigger. A `disabled` item sets `disabled` + `aria-disabled` on its trigger.
- Contrast ≥4.5:1 for text (title `--text-default`, body `--text-muted` on the surface) / ≥3:1 for the chevron glyph, including the disabled state (`--text-disabled`).
- `motion-reduce:transition-none motion-reduce:animate-none` on the chevron rotation and content reveal.
- Touch target: the `large` header is 40px tall and the full-width header row is the hit area (≥40×40). The `medium` header is 32px tall — a justified deviation matching the Figma `medium` size token, mitigated by the full-width clickable row.

## Stories (Storybook)

- **Default** — a single-mode accordion with a few items, one open via `default-value`.
- **Sizes** — composite story rendering `medium` and `large` side by side.
- **ArrowPosition** — composite story rendering `right` and `left` chevron placement side by side. _Justification:_ `arrowPosition` is a visual variant axis taken straight from the Figma variant matrix, exactly like `size`; the canonical one-composite-story-per-axis pattern applies.
- **Disabled** — an accordion whose middle item carries the per-item `disabled` prop, demonstrating the non-toggling state.
- **Multiple** — an accordion with `type="multiple"` and two items open at once. _Justification:_ single-vs-multiple is the component's core behavioral contract (called out in the Figma component description) and is the one mode the single-mode Default story cannot show.

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

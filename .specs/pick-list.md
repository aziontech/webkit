---
name: pick-list
category: data
structure: composition
status: approved
spec_version: 2
checksum: 784da2a102f546a61406dbc78eabecaeabff3692e5d244bf1f970333898f3b33
created: 2026-06-25
last_updated: 2026-06-30
---

# Pick List — Component Spec

## Purpose

Dual-list transfer control: a labelled **source** listbox and a labelled **target** listbox with a control column to move items between them. Use it when the consumer needs to build a subset from a pool of options where both the chosen set and the remaining pool stay visible. Derived from the PrimeVue PickList behavior but rewritten to our conventions (no Figma); the visual surface is a best-effort first draft to validate.

Compound, composition API: the root (`<PickList>`) owns the bound data (`v-model` = `[sourceItems, targetItems]`) and the shared selection/move state, and provides it through `provide`/`inject`. The consumer composes the anatomy — `<PickList.Source>`, `<PickList.Controls>`, `<PickList.Target>` — and the context-aware `<PickList.Controls>` wires the move buttons with no props. Each list is data-driven: items come from the root's bound pair and render through the list's `#item` slot (repeated data stays as props, not hand-authored rows). Double-clicking an option moves it to the opposite list (emitting `item-double-click`); this auto-move can be turned off with `move-on-double-click`. The two lists sit side by side on wider viewports and stack vertically (with the controls as a horizontal row between them) on narrow ones; the move arrows point left/right side-by-side and up/down when stacked.

## Usage

Composition — one import of the root; every part is reached via dot-notation (`<PickList.Source>`, `<PickList.Controls>`, `<PickList.Target>`). The root binding must be PascalCase (`PickList`).

```vue
<script setup>
import PickList from '@aziontech/webkit/pick-list'
import { ref } from 'vue'

const model = ref([
  [
    { id: 1, label: 'Edge Functions' },
    { id: 2, label: 'WAF' }
  ],
  [{ id: 3, label: 'Cache' }]
])
</script>

<template>
  <PickList v-model="model" data-key="id">
    <PickList.Source header="Available">
      <template #item="{ item }">{{ item.label }}</template>
    </PickList.Source>

    <PickList.Controls />

    <PickList.Target header="Selected">
      <template #item="{ item }">{{ item.label }}</template>
    </PickList.Target>
  </PickList>
</template>
```

Each part is also a standalone import (`import PickListSource from '@aziontech/webkit/pick-list-source'`, …), and the root is published standalone (tree-shakeable) as `@aziontech/webkit/pick-list-root` — the path to use when only a few parts are needed.

## Sub-components

- `pick-list-source/pick-list-source.vue` — The source listbox (the left/top list). Reads its items and selection from the injected context. Props: `header` (heading text / accessible name), `loading` (shows a spinner in place of options and locks its controls). Slots: `item` (`{ item, index, list }`) renders one option row; `header` overrides the heading content. Double-clicking an option moves it to the target (driven by the root via the injected context).
- `pick-list-target/pick-list-target.vue` — The target listbox (the right/bottom list). Same anatomy, props, and slots as `pick-list-source`, bound to the target side of the pair; double-clicking an option moves it back to the source.
- `pick-list-controls/pick-list-controls.vue` — The context-aware control column between the lists. Renders the four move buttons (move selected / move all, in each direction) as icon-only buttons; reads selection, item counts, loading, and disabled from the injected context and drives the moves. Takes no props. The arrows point left/right when the lists are side by side and rotate to up/down when they stack on narrow viewports.

<!-- Resulting layout (composition):

  packages/webkit/src/components/data/pick-list/
  ├── pick-list.vue
  ├── index.ts                    (entry: attaches PickList.Source / PickList.Target / PickList.Controls)
  ├── injection-key.ts            (shared context: items, selection, move, double-click, loading)
  ├── presets/
  │   └── transitions.ts          (item fade motion: duration/curve from @aziontech/theme/animations)
  ├── pick-list-source/
  │   └── pick-list-source.vue
  ├── pick-list-target/
  │   └── pick-list-target.vue
  └── pick-list-controls/
      └── pick-list-controls.vue

  The compound `./pick-list` entry (index.ts) attaches the sub-components for
  dot-notation (`PickList.Source`, `PickList.Target`, `PickList.Controls`) and
  re-exports them as named bindings from `@aziontech/webkit/pick-list`. The root
  is also published standalone (tree-shakeable) as `./pick-list-root`, and each
  sub-component as a flat export (`./pick-list-source`, `./pick-list-target`,
  `./pick-list-controls`). There is no per-component `package.json` — the root
  `packages/webkit/package.json#exports` points every public path at source. -->

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `modelValue` | `[unknown[], unknown[]]` | `() => [[], []]` | no | Bound pair of lists as `[sourceItems, targetItems]` (v-model). |
| `dataKey` | `string` | `''` | no | Item field that uniquely identifies a record; enables selection tracking and stable keys. |
| `disabled` | `boolean` | `false` | no | Disables all selection and move controls and applies disabled tokens. |
| `moveOnDoubleClick` | `boolean` | `true` | no | When true, double-clicking an item moves it to the opposite list. Set false to keep `item-double-click` firing without the move. |

## Events

| Event | Payload | Notes |
|---|---|---|
| `update:modelValue` | `[unknown[], unknown[]]` | v-model update with the new `[sourceItems, targetItems]` pair. |
| `move` | `{ direction: 'to-target' \| 'to-source'; items: unknown[] }` | Fired after items move between lists, with the moved items. |
| `item-double-click` | `(event: MouseEvent, payload: { list: 'source' \| 'target'; item: unknown; index: number })` | Fired when an option is double-clicked. `event` is the dblclick; `payload` carries the item, its index, and which list it was in. Fires regardless of `moveOnDoubleClick`, but not while the component is disabled or a list is loading. |

## Slots

| Slot | Scope | Notes |
|---|---|---|
| `default` | `{ move, moveAll, hasSelection, count, disabled, loading }` | Composition slot; receives `<PickList.Source>`, `<PickList.Controls>`, and `<PickList.Target>` in flow order. The scope exposes the move actions plus selection/loading state, so a consumer can render custom controls inside the root in place of `<PickList.Controls>`. |

The root also **exposes** `move`, `moveAll`, `hasSelection`, and `count` on its instance (via `defineExpose`), so controls rendered **outside** the root can drive it through a template ref. The signatures match the slot scope above.

## States

- Visual states: `default`, `hover` (option), `focus-visible` (option / control), `selected` (option), `disabled`, `loading`
- `data-disabled` on the root mirrors the `disabled` prop
- `data-loading` on a list (`pick-list-source` / `pick-list-target`) mirrors that list's `loading` prop
- A loading list renders a centered spinner instead of its options and sets `aria-busy="true"`; while any list is loading, both the move controls and double-click-to-move are disabled until loading clears
- Each option carries `data-selected` mirroring its selection and `aria-selected`

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| control hover/focus | `transition-colors duration-150 ease-out` on move buttons | inline (matches catalog) | `motion-reduce:transition-none` |
| item moved between lists | each list (`pick-list-source` / `pick-list-target`) is a `TransitionGroup`; an arriving item fades in (`opacity-0` → `opacity-100`) and a departing item fades out, via an inline `transition: opacity` built from the `duration` / `curve` primitives in `@aziontech/theme/animations` (centralized in `presets/transitions.ts`, mirroring `message` / `toast`). The same swap covers the loading spinner toggling in/out. | semantic (`duration` / `curve` from animate.js) | `motion-reduce:transition-none` on the enter/leave active class |
| loading | the composed `Spinner` component rotates continuously inside a loading list | semantic (owned by `Spinner`) | the `Spinner` carries its own reduced-motion fallback |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| typography (header) | `.text-label-lg` |
| typography (option) | `.text-body-md` |
| surface (list) | `var(--bg-surface)` |
| surface (option hover) | `var(--bg-hover)` |
| surface (option selected) | `var(--bg-selected)` |
| text | `var(--text-default)` |
| text (header) | `var(--text-muted)` |
| text (disabled) | `var(--text-disabled)` |
| surface (disabled) | `var(--bg-disabled)` |
| border | `var(--border-default)` |
| ring | `var(--ring-color)` |
| spacing (list padding) | `var(--spacing-xs)` |
| spacing (option padding) | `var(--spacing-sm)` |
| gap (lists + controls) | `var(--spacing-sm)` |
| shape (list) | `var(--shape-card)` |
| shape (option) | `var(--shape-elements)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-[var(--ring-color)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg-canvas)]` on each option and on every move control.
- Keyboard map: `Tab` moves between the two listboxes and the control column; within a listbox `Space`/`Enter` toggle the focused option's selection; the move controls are activated with `Enter`/`Space`. Double-click on an option is a pointer affordance for moving it to the opposite list; the same move is reachable via select + the move controls (no keyboard-only feature is double-click-only).
- ARIA: each list is `role="listbox"` with `aria-label` from its header text; options are `role="option"` with `aria-selected`; the source/target listboxes set `aria-multiselectable="true"`; every move control is an icon-only button with an explicit `aria-label`; `aria-disabled` mirrors `disabled`.
- Contrast ≥4.5:1 (text) / ≥3:1 (borders + icons), including the disabled state.
- A loading list sets `aria-busy="true"`; its `Spinner` is decorative (`aria-hidden`) and carries its own reduced-motion fallback. Control hover transitions pair with `motion-reduce:transition-none`.
- Touch target ≥40×40 px for every move control (medium icon-button height).

## Stories (Storybook)

- Default — also documents double-click-to-move (on by default); the `moveOnDoubleClick` control toggles the auto-move while `item-double-click` keeps firing.
- Disabled
- Loading — justified: the list `loading` prop swaps a list's items for a spinner and locks the move controls; the story documents both-sides and single-side loading, which no other story exercises.

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

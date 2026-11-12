---
name: tabs
category: navigation
structure: composition
status: implemented
spec_version: 3
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3374-6191
  node_id: 3374:6191
checksum: 30490bd131d55f95f355d09d2ae575c5468ec6492fe71ee9e5db8a7ece839a8b
created: 2026-05-22
last_updated: 2026-11-12
---

# Tab View — Component Spec

## Purpose

Helps users move between views or sections. Lives at `packages/webkit/src/components/navigation/tabs/`.

## When to use

- A page or panel holds several peer views and only one is shown at a time (Overview / Settings / Logs on a resource page).
- The tab row may outgrow its container — `Tabs.List` scrolls horizontally with edge fades instead of wrapping.
- Tabs that the user can close: set `closable` on the item and remove it from your data on `@close`.
- A tab whose form holds unsaved changes: set `dirty` on the item (bind it to `useUnsavedChanges().isDirty`) so the reader sees which section still needs a save.

## When NOT to use

- Several sections may need to be open at once, or the content should expand inline → use `accordion`.
- The tabs switch the media of a marketing band → use `media-tabs`.
- It moves the reader between pages of the app → use `navigation-menu` or `sidebar`.

## Related

- `accordion` — stacked disclosure sections; more than one can be open and content expands below each header.
- `media-tabs` — the marketing band that switches an illustration per tab.
- `breadcrumb` — location in a hierarchy, not sibling views.

## Best practices

- Give each `Tabs.Item` and its `Tabs.Panel` the same `value`; the panel is linked to its tab by that value for `aria-labelledby` and visibility.
- Type a variable that holds the active tab or a list of tab definitions with the exported `TabsValue` (`ref<TabsValue>('overview')`), never `string | number` spelled out or a cast.
- Drive the active tab with `v-model` on the root, or seed it with `default-value`; with neither, the first enabled tab is selected on mount.
- `closable` only emits `close` with `(event, value)` — remove the tab and its panel from your data yourself; when the active tab unmounts, the root moves to the first enabled tab.
- `dirty` only marks the tab (a dot after the label, "Unsaved changes" for screen readers); guard the switch itself with `useUnsavedChanges().confirmLeave()` in the setter of the root's `v-model` when leaving must ask first.
- Use the item's `selected` prop only for a standalone `Tabs.Item` outside a root; inside a root the selection comes from the root's value.
- Put spacing between the list and the panels on `Tabs.Content` (e.g. a top margin), not inside each panel.
- Centre the tab row with `<Tabs.List align="center">`, never with a `justify-center` class or a centring wrapper; keep the default `start` for tabs that head a resource page or a settings form.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import Tabs from '@aziontech/webkit/tabs'

  const active = ref('overview')
</script>

<template>
  <Tabs.Root v-model="active">
    <Tabs.List>
      <Tabs.Item
        value="overview"
        label="Overview"
      />
      <Tabs.Item
        value="settings"
        label="Settings"
      />
      <Tabs.Item
        value="logs"
        label="Logs"
        disabled
      />
    </Tabs.List>
    <Tabs.Content class="mt-(--spacing-md)">
      <Tabs.Panel value="overview">Overview content</Tabs.Panel>
      <Tabs.Panel value="settings">Settings content</Tabs.Panel>
      <Tabs.Panel value="logs">Logs content</Tabs.Panel>
    </Tabs.Content>
  </Tabs.Root>
</template>
```

## Sub-components

- `tab-view-item.vue` — Public sub-component `tabs-item`. Props include `dirty: boolean` (default `false`): a `size-1.5` `var(--warning-contrast)` dot after the label (`aria-hidden`, `CanvasText` under forced colors) plus a `sr-only` "Unsaved changes" from the `tabs.unsaved` catalog key, and `data-dirty` on the tab.
- `tab-view-list.vue` — Public sub-component `tabs-list`. Prop `align: 'start' | 'center'` (default `'start'`): `center` centres the tabs in the row (`data-align="center"`, `justify-center-safe`, so a row that overflows still scrolls from its first tab), for a page whose content below is centred, such as a catalog of cards.
- `tab-view-panel.vue` — Public sub-component `tabs-panel`.

## Props

| Prop           | Type                | Default | Required | JSDoc                                 |
| -------------- | ------------------- | ------- | -------- | ------------------------------------- |
| `defaultValue` | `TabsValue \| null` | `null`  | false    | Initial active tab when uncontrolled. |

Types (exported from `@aziontech/webkit/tabs`): `TabsValue = string | number`, the value of a tab and of its panel; `TabsListAlign = 'start' | 'center'`. The compound is typed from `index.ts` (`Tabs.Root`, `Tabs.List`, `Tabs.Item`, `Tabs.Content`, `Tabs.Panel`), so a wrong prop on a part is a type error.

## v-model

| Model     | Type                             | Default     | Emits               | Notes                                                                                                                                        |
| --------- | -------------------------------- | ----------- | ------------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `TabsValue \| null \| undefined` | `undefined` | `update:modelValue` | Active tab via `defineModel`. While unbound (`undefined`) the root is uncontrolled: it starts at `defaultValue`, else the first enabled tab. |

## Events

| _none_ | — | — |

## Slots

| Slot      | Scope | Notes |
| --------- | ----- | ----- |
| `default` | —     | —     |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-state` values on panels: `active` | `inactive`
- Dirty: `data-dirty` on a `Tabs.Item` with `dirty`; the dot is not the only cue for assistive tech (a hidden "Unsaved changes" joins the tab's name).
- Responsive: the tab list (`Tabs.List`) scrolls **horizontally** when the tabs exceed the available width (mobile / narrow viewports) instead of overflowing or wrapping; the scrollbar is visually hidden and the active indicator stays aligned while scrolling. Tabs keep their intrinsic width (`shrink-0`). A gradient edge-fade overlay on the scrollable side(s) (mirrored on `data-fade-start` / `data-fade-end`) hints at off-screen tabs; it fades in / out with the semantic `animate-fade-in` / `animate-fade-out` utilities, and a non-scrollable edge renders no overlay so the first / last tab is never covered at rest.

## Motion & Animations

| Trigger                           | Animation / Transition                                                                                                                                                                                                                                   | Token                                                                                       | Reduced-motion fallback         |
| --------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------- | ------------------------------- |
| scroll edge fade appears / leaves | `animate-fade-in` / `animate-fade-out`                                                                                                                                                                                                                   | semantic                                                                                    | `motion-reduce:animate-none`    |
| state change                      | `transition-colors duration-150 ease-out`                                                                                                                                                                                                                | inline                                                                                      | `motion-reduce:transition-none` |
| panel change                      | the incoming panel slides in from the side being navigated toward (`translate-x-(--spacing-md)` / negative) while fading; the panel active at first render is visible at once (also on the server, without JS), so the motion runs only on later changes | `duration['moderate-02']` + `curve['productive-entrance']` from the theme animation catalog | `motion-reduce:transition-none` |

## Tokens

| Region            | Token (DESIGN.md)                                  |
| ----------------- | -------------------------------------------------- |
| typography        | .text-body-sm                                      |
| surface           | `var(--bg-surface)`                                |
| text              | `var(--text-default)`                              |
| spacing           | `var(--spacing-3)`                                 |
| height (tab item) | `var(--size-8)` — 32 px, applied as `h-(--size-8)` |
| shape             | `var(--shape-elements)`                            |
| ring              | `var(--ring-color)`                                |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map (inside `Tabs.List`): `Tab` moves into the list onto the selected tab and out of it to the panel (roving `tabindex`: only the selected tab is `0`); `ArrowRight`/`ArrowLeft` select and focus the next/previous enabled tab and wrap, swapped under `dir="rtl"` (`useDirection`); `Home`/`End` select the first/last enabled tab; `Enter`/`Space` activate the focused tab; `Delete` on a `closable` tab emits `close` (the tab carries `aria-keyshortcuts="Delete"`). Focus after a close is the consumer's call (the neighbouring tab, as `split-view#Sessions` does).
- Close control: the `closable` glyph is a pointer target only (`aria-hidden="true"`, no role, no `tabindex`, a `title` with "Close tab"); keyboard and screen-reader users close with `Delete`, the WAI-ARIA tabs pattern. A focusable close button cannot sit next to the tab: anything focusable inside `role="tablist"` that is not a `tab` fails axe `aria-required-children` (unallowed child), and inside the tab it is `nested-interactive`.
- ARIA: inside `Tabs.List` each item is `role="tab"` with `aria-selected` and `aria-controls` (when its panel is mounted); a `Tabs.Item` rendered on its own, outside any `Tabs`, is a toggle `<button>` with `aria-pressed` and no `tab` role, because a `tab` outside a `tablist` fails `aria-required-parent`. `Tabs.Panel` is `role="tabpanel"` labelled by its tab.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state. The dirty dot is `var(--warning-contrast)` (≥3:1 on the canvas in both themes) and the tab's accessible name carries "Unsaved changes", so colour is never the only cue.
- `motion-reduce:transition-none motion-reduce:transform-none` on animated states.
- Touch target: the tab item is 32 px tall (`var(--size-8)`) — a justified deviation from 40×40 px matching the Figma tab-item size token, mitigated by the full label + padding being the hit area and by the tab list's own keyboard model.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: none mirror.
- Keyboard: `ArrowRight`/`ArrowLeft` move to the next/previous tab, swapped under `dir="rtl"` (`logicalArrowKey`); the indicator is anchored with a physical `left: 0` and moved by `offsetLeft`; scroll fades pair `bg-gradient-to-r` with `rtl:bg-gradient-to-l` and read `Math.abs(scrollLeft)`.
- Motion: panel slides mirror (`rtl:` flips the `translate-x` presets).
- User data: none.

## Examples

- Default
- Scrollable — many tabs in a width-constrained container; justified because the horizontal-scroll (mobile) behavior of `Tabs.List` is a distinct rendered state that the Default story (few tabs, no overflow) does not exercise.
- Centered — `Tabs.List align="center"` over a centred catalog; justified because `align` is a distinct rendered state of the list.
- Standalone — a `Tabs.Item` outside a `Tabs.Root`, selected / idle / disabled; justified because a context-free item reads its own `selected` prop and paints the pill itself (mask + hairline + `--shadow-xs`) rather than sitting on the List's sliding indicator, which no composed story renders.

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
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + per `kind` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

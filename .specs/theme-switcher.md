---
name: theme-switcher
category: input
structure: monolithic
status: implemented
spec_version: 7
figma:
  url: https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=5721-5138
  node_id: 5721:5138
checksum: 73bd1c56c3b3bfbda29d196d5638a5c5d947da65e7b6d573fcdd27c8ce9457ac
created: 2026-07-13
last_updated: 2026-11-24
---

# Theme Switcher — Component Spec

## Purpose

A compact segmented control drawn like `toggle-group` (same radius, surface and 28 / 32 / 40 heights, with the header outline `--border-default`, so it sits in a row of header controls beside an `IconButton`, `Select` or `SearchTrigger` of the same size) that lets the user pick the app color-theme mode — `system`, `dark`, or `light` — via three icon-only segments. It reflects and emits the selected mode through `v-model` and applies no global side effect itself (the app decides what each mode means). Unlike `switch` (a boolean toggle) or `tabs` (view navigation), it is a fixed three-way single-select over the theme modes.

## When to use

- Use ThemeSwitcher only for the system / light / dark choice in app chrome; for any other segmented choice use ToggleGroup, and for a choice in a form use RadioGroup.
- The app-wide color mode picker in a header, footer, account menu or settings page.

## When NOT to use

- A general on/off preference → use `switch`.
- Picking one of other mutually exclusive options → use `toggle-group`.
- Moving between views or panels → use `tabs`.

## Related

- `toggle-group` — the generic mutually exclusive option group, with labels and sizes; ThemeSwitcher shares its look (radius, surface, indicator, sizes), with the header controls' `--border-default` outline instead of its `--border-muted`, so a header row draws one outline colour.
- `switch` — boolean toggle for a single setting.

## Best practices

- Bind with `v-model` and apply the mode in the app (for example a `data-theme` attribute, resolving `system` from `prefers-color-scheme`); the component has no side effects.
- Persist the chosen mode on the app side so it survives a reload.
- Match `size` to the neighbouring controls: `medium` beside the 32 px header controls, `small` inside a 32 px menu row, `large` beside 40 px controls.
- Localize `ariaLabel`; the segment names (System, Dark, Light) are fixed in the component.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import ThemeSwitcher from '@aziontech/ui/theme-switcher'

  const theme = ref('system')
</script>

<template>
  <ThemeSwitcher v-model="theme" />
</template>
```

## Props

| Prop        | Type                                                   | Default    | Required | JSDoc                                                                                                 |
| ----------- | ------------------------------------------------------ | ---------- | -------- | ----------------------------------------------------------------------------------------------------- |
| `size`      | `ThemeSwitcherSize` (`'small' \| 'medium' \| 'large'`) | `'medium'` | false    | Size token, matching the height of a neighbouring IconButton, Select or ToggleGroup of the same size. |
| `disabled`  | `boolean`                                              | `false`    | false    | Disables the whole control and applies disabled tokens.                                               |
| `ariaLabel` | `string`                                               | `''`       | false    | Accessible name for the icon-only segmented group. Empty uses the locale catalog (`Theme`).           |

## v-model

| Model     | Type                            | Default    | Emits               | Notes                                                                                                                             |
| --------- | ------------------------------- | ---------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `'system' \| 'dark' \| 'light'` | `'system'` | `update:modelValue` | Selected theme mode via `defineModel`. Emits when the user selects a different mode; the component applies no side effect itself. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-size` mirrors `size` on the root: 28 px (`small`), 32 px (`medium`), 40 px (`large`) tall, the same rhythm as `toggle-group`, `icon-button` and `select`; segments are 24 / 28 / 36 px wide and fill the inner height
- `data-disabled` mirrors the `disabled` prop on the root
- Selected segment carries `aria-checked="true"` and `data-state="active"`; unselected segments `aria-checked="false"` and `data-state="inactive"`
- A single `aria-hidden` indicator element renders the selection highlight (`var(--bg-selected)`) and slides to the active segment (position and size measured from the active segment's box, so it follows every size); segments themselves stay transparent; the active icon uses `var(--text-default)`, the others `var(--text-muted)` until hovered

## Motion & Animations

| Trigger                   | Animation / Transition                                                                                                                                 | Token (see `contributing/docs/TOKENS.md` § Animations) | Reduced-motion fallback         |
| ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------ | ------------------------------- |
| hover / icon color change | `transition-colors duration-fast-02 ease-productive-entrance`                                                                                          | semantic (`animate.js`)                                | `motion-reduce:transition-none` |
| selection change          | indicator slides between segments via `transition-transform duration-moderate-02 ease-productive-entrance` (position measured from the active segment) | semantic (`animate.js`)                                | `motion-reduce:transition-none` |

## Tokens

| Region                   | Token (TOKENS.md)                                                     |
| ------------------------ | --------------------------------------------------------------------- |
| group surface            | `var(--bg-surface)`                                                   |
| group border             | `var(--border-default)`, the outline of the header controls beside it |
| group and segment radius | `var(--shape-button)` (as `toggle-group`, `button`, `icon-button`)    |
| height                   | `h-7` / `h-8` / `h-10` by `size`                                      |
| selected segment surface | `var(--bg-selected)`                                                  |
| hover segment surface    | `var(--bg-hover)`                                                     |
| icon color               | `var(--text-default)` (active, hover), `var(--text-muted)` (inactive) |
| icon size                | `text-label-sm` (`small`, `medium`), `text-label-md` (`large`)        |
| disabled icon            | `var(--text-disabled)`                                                |
| disabled group surface   | `var(--bg-disabled)`, the selected segment on `var(--bg-surface)`     |
| gap / padding            | `var(--spacing-2xs)`                                                  |
| ring                     | `var(--ring-color)`                                                   |
| ring offset              | `var(--bg-canvas)`                                                    |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the focused segment, drawn inside the group as on `toggle-group`.
- Keyboard map: `Tab` moves focus into the group (roving tabindex lands on the selected segment); `ArrowLeft`/`ArrowRight` (and `ArrowUp`/`ArrowDown`) move selection between segments; `Space`/`Enter` selects the focused segment.
- ARIA: root is `role="radiogroup"` with `aria-label` from `ariaLabel`; each segment is `role="radio"` with `aria-checked` and its own `aria-label` (`System` / `Dark` / `Light`); the glyph is `aria-hidden`. `aria-disabled` mirrors `disabled`.
- Each segment is wrapped in `@aziontech/ui/tooltip` (`side="bottom"`) surfacing its mode label (`System` / `Dark` / `Light`) on hover and keyboard focus; the tooltip owns its own `aria-describedby` wiring.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target: segments are drawn 24 / 28 / 36 px wide by `size` on a fine pointer; on a coarse pointer each segment is drawn at least 44 px wide (`pointer-coarse:min-w-11`) and carries an invisible `aria-hidden` child (`data-slot="touch-target"`) that extends its hit area to 44 px tall only, so a segment's hit area never covers its neighbour.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the sun, moon and monitor glyphs do not mirror.
- Keyboard: `ArrowRight`/`ArrowLeft` move to the next/previous theme, swapped under `dir="rtl"` (`logicalArrowKey`).
- Indicator: the selection highlight is anchored with a physical `left: 0` and moved by the measured offset, so it lands on the selected option in both directions.
- User data: none.

## Examples

- Default
- Sizes — `small`, `medium` and `large`, each beside an outline `IconButton` of the same size, so the matching height and radius are visible.
- Disabled — the only state example; the component has a single `variant`, so Types are omitted.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + per `variant` + per `size` + Disabled, unless the spec's "Examples" section explicitly justifies the addition.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.
</content>

</invoke>

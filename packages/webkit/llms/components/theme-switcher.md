# Theme Switcher

> A compact pill-shaped segmented control that lets the user pick the app color-theme mode — `system`, `dark`, or `light` — via three icon-only segments. It reflects and emits the selected mode through `v-model` and applies no global side effect itself (the app decides what each mode means). Unlike `switch` (a boolean toggle) or `tabs` (view navigation), it is a fixed three-way single-select over the theme modes.

- Import: `import ThemeSwitcher from '@aziontech/webkit/theme-switcher'`
- Category: inputs · Surface: product · Structure: monolithic
- API as JSON: [theme-switcher.json](https://github.com/aziontech/webkit/blob/main/.specs/theme-switcher.json)

## When to use

- The app-wide color mode picker in a header, footer, account menu or settings page.

## Do

- Bind with `v-model` and apply the mode in the app (for example a `data-theme` attribute, resolving `system` from `prefers-color-scheme`); the component has no side effects.
- Persist the chosen mode on the app side so it survives a reload.
- Localize `ariaLabel`; the segment names (System, Dark, Light) are fixed in the component.

## Don’t

- A general on/off preference → use `switch`.
- Picking one of other mutually exclusive options → use `toggle-group`.
- Moving between views or panels → use `tabs`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [toggle-group](toggle-group.md) — the generic mutually exclusive option group, with labels and sizes.
- [switch](switch.md) — boolean toggle for a single setting.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `disabled` | `boolean` | `false` | false | Disables the whole control and applies disabled tokens. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the icon-only segmented group. Empty uses the locale catalog (`Theme`). |
| `modelValue` | `ThemeSwitcherValue` | `'system'` | false | Two-way value (`v-model`). |

## v-model

| Model     | Type                            | Default    | Emits               | Notes                                                                                                                             |
| --------- | ------------------------------- | ---------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `'system' \| 'dark' \| 'light'` | `'system'` | `update:modelValue` | Selected theme mode via `defineModel`. Emits when the user selects a different mode; the component applies no side effect itself. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-disabled` mirrors the `disabled` prop on the root
- Selected segment carries `aria-checked="true"` and `data-state="active"`; unselected segments `aria-checked="false"` and `data-state="inactive"`
- A single `aria-hidden` indicator element renders the selection highlight (`var(--bg-selected)`) and slides to the active segment (position measured from the active segment's box); segments themselves stay transparent

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)` on the focused segment.
- Keyboard map: `Tab` moves focus into the group (roving tabindex lands on the selected segment); `ArrowLeft`/`ArrowRight` (and `ArrowUp`/`ArrowDown`) move selection between segments; `Space`/`Enter` selects the focused segment.
- ARIA: root is `role="radiogroup"` with `aria-label` from `ariaLabel`; each segment is `role="radio"` with `aria-checked` and its own `aria-label` (`System` / `Dark` / `Light`); the glyph is `aria-hidden`. `aria-disabled` mirrors `disabled`.
- Each segment is wrapped in `@aziontech/webkit/tooltip` (`placement="bottom"`) surfacing its mode label (`System` / `Dark` / `Light`) on hover and keyboard focus; the tooltip owns its own `aria-describedby` wiring.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons), including the disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target: segments follow the compact Figma sizing (28px pill height, 28×20px segments) and are below the 40×40 px target; justified deviation for a dense global control, consistent with the design.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: the sun, moon and monitor glyphs do not mirror.
- Keyboard: `ArrowRight`/`ArrowLeft` move to the next/previous theme, swapped under `dir="rtl"` (`logicalArrowKey`).
- Indicator: the selection pill is anchored with a physical `left: 0` and moved by the measured offset, so it lands on the selected option in both directions.
- User data: none.

## Examples

### Default

```vue
<script setup>
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const theme = ref('system')
</script>

<template>
  <ThemeSwitcher v-model="theme" />
</template>
```

### Disabled

```vue
<script setup>
  import ThemeSwitcher from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const theme = ref('system')
</script>

<template>
  <ThemeSwitcher
    v-model="theme"
    disabled
  />
</template>
```

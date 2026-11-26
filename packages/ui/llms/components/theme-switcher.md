# Theme Switcher

> A compact segmented control drawn like `toggle-group` (same radius, surface and 28 / 32 / 40 heights, with the header outline `--border-default`, so it sits in a row of header controls beside an `IconButton`, `Select` or `SearchTrigger` of the same size) that lets the user pick the app color-theme mode — `system`, `dark`, or `light` — via three icon-only segments. It reflects and emits the selected mode through `v-model` and applies no global side effect itself (the app decides what each mode means). Unlike `switch` (a boolean toggle) or `tabs` (view navigation), it is a fixed three-way single-select over the theme modes.

- Import: `import ThemeSwitcher from '@aziontech/ui/theme-switcher'`
- Category: input · Surface: app · Structure: monolithic
- API as JSON: [theme-switcher.json](theme-switcher.json)

## When to use

- Use ThemeSwitcher only for the system / light / dark choice in app chrome; for any other segmented choice use ToggleGroup, and for a choice in a form use RadioGroup.
- The app-wide color mode picker in a header, footer, account menu or settings page.

## Do

- Bind with `v-model` and apply the mode in the app (for example a `data-theme` attribute, resolving `system` from `prefers-color-scheme`); the component has no side effects.
- Persist the chosen mode on the app side so it survives a reload.
- Match `size` to the neighbouring controls: `medium` beside the 32 px header controls, `small` inside a 32 px menu row, `large` beside 40 px controls.
- Localize `ariaLabel`; the segment names (System, Dark, Light) are fixed in the component.

## Don’t

- A general on/off preference → use `switch`.
- Picking one of other mutually exclusive options → use `toggle-group`.
- Moving between views or panels → use `tabs`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [toggle-group](toggle-group.md) — the generic mutually exclusive option group, with labels and sizes; ThemeSwitcher shares its look (radius, surface, indicator, sizes), with the header controls' `--border-default` outline instead of its `--border-muted`, so a header row draws one outline colour.
- [switch](switch.md) — boolean toggle for a single setting.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `size` | ``ThemeSwitcherSize` (`'small' \| 'medium' \| 'large'`)` | `'medium'` | false | Size token, matching the height of a neighbouring IconButton, Select or ToggleGroup of the same size. |
| `disabled` | `boolean` | `false` | false | Disables the whole control and applies disabled tokens. |
| `ariaLabel` | `string` | `''` | false | Accessible name for the icon-only segmented group. Empty uses the locale catalog (`Theme`). |
| `modelValue` | `ThemeSwitcherValue` | `'system'` | false | Two-way value (`v-model`). |

## v-model

| Model     | Type                            | Default    | Emits               | Notes                                                                                                                             |
| --------- | ------------------------------- | ---------- | ------------------- | --------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `'system' \| 'dark' \| 'light'` | `'system'` | `update:modelValue` | Selected theme mode via `defineModel`. Emits when the user selects a different mode; the component applies no side effect itself. |

## States

- Visual states: `default`, `hover`, `focus-visible`, `active`, `disabled`
- `data-size` mirrors `size` on the root: 28 px (`small`), 32 px (`medium`), 40 px (`large`) tall, the same rhythm as `toggle-group`, `icon-button` and `select`; segments are 24 / 28 / 36 px wide and fill the inner height
- `data-disabled` mirrors the `disabled` prop on the root
- Selected segment carries `aria-checked="true"` and `data-state="active"`; unselected segments `aria-checked="false"` and `data-state="inactive"`
- A single `aria-hidden` indicator element renders the selection highlight (`var(--bg-selected)`) and slides to the active segment (position and size measured from the active segment's box, so it follows every size); segments themselves stay transparent; the active icon uses `var(--text-default)`, the others `var(--text-muted)` until hovered

## Accessibility

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

### Default

```vue
<script setup>
  import ThemeSwitcher from '@aziontech/ui/theme-switcher'
  import { ref } from 'vue'

  const theme = ref('system')
</script>

<template>
  <ThemeSwitcher v-model="theme" />
</template>
```

### Sizes

```vue
<script setup>
  import IconButton from '@aziontech/ui/icon-button'
  import ThemeSwitcher from '@aziontech/ui/theme-switcher'
  import { ref } from 'vue'

  const theme = ref('system')
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-md)">
    <div
      v-for="size in ['small', 'medium', 'large']"
      :key="size"
      class="flex items-center gap-(--spacing-xs)"
    >
      <ThemeSwitcher
        v-model="theme"
        :size="size"
      />
      <IconButton
        icon="az az-github"
        variant="outline"
        :size="size"
        aria-label="GitHub"
      />
    </div>
  </div>
</template>
```

### Disabled

```vue
<script setup>
  import ThemeSwitcher from '@aziontech/ui/theme-switcher'
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

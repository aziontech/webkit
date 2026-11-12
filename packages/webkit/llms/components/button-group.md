# Button Group

> A toolbar of icon actions that belong to one surface (a code panel, a table header, a preview), after Cloudscape's button group. Each item is an icon button that names itself in a tooltip: a plain action, an on / off toggle, or a menu of options. Items past `visibleCount` collapse into one More actions menu. The toolbar is one tab stop with roving focus, so a row of six icons costs the keyboard user one Tab, not six.

- Import: `import ButtonGroup from '@aziontech/webkit/button-group'`
- Category: actions · Surface: product · Structure: monolithic
- API as JSON: [button-group.json](https://github.com/aziontech/webkit/blob/main/.specs/button-group.json)

## When to use

- A row of icon actions on one surface: Copy, Format, Wrap lines, Download above a code editor.
- Compact actions in a panel header where labels would not fit, each explained by its tooltip.
- A mix of actions and on / off view toggles (wrap lines, show whitespace) that sit together.
- More actions than the space allows: keep the frequent ones visible and move the rest into the overflow menu with `visibleCount`.

## Do

- Give the toolbar an `aria-label` that names the surface ("Editor actions"), and every item a `label` that says what it does ("Copy code", not "Copy"). Write the kebab attribute (`aria-label`, `:aria-label` when the name changes, `aria-labelledby` when a visible heading already names the surface), never the camelCase `ariaLabel` attribute.
- The `ariaLabel` prop is optional in the types on purpose: vue-tsc does not camelize `aria-*` attributes onto props, so a required `ariaLabel` made the obvious `aria-label="…"` fail to type-check in a fresh create-vue app. The lint rule `webkit/accessible-name` keeps the name required instead: it flags a `ButtonGroup` with neither `aria-label` nor `aria-labelledby`.
- Keep the most used actions first; `visibleCount` moves the tail into More actions, never the head.
- Use a toggle only for a state the user can see change (wrapped lines); flip `pressed` in your `@toggle` handler — the component never stores it.
- Set `loading` on an action while its request runs instead of disabling the whole group.
- Use `kind="transparent"` on a surface that already has a border (a panel header) and `outlined` on the canvas.
- Do not mix text buttons into the group; a text action belongs beside it as its own `Button`.

## Don’t

- A choice of exactly one option among several (view mode, period) → use `toggle-group`.
- One primary action with related alternatives → use `split-button`.
- A single icon action → use `icon-button` (with a `tooltip`).
- Page or form actions with text labels (Save, Cancel, Create) → use `button`s laid out by the page.
- A long list of commands or navigation → use `dropdown-menu`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [icon-button](icon-button.md) — every item renders one; ButtonGroup adds the toolbar role, roving focus and overflow.
- [toggle-group](toggle-group.md) — a radiogroup of mutually exclusive options; ButtonGroup toggles are independent (`aria-pressed`).
- [split-button](split-button.md) — one main action plus a menu, with a visible text label.
- [dropdown-menu](dropdown-menu.md) — the menu behind menu items and the More actions overflow.
- [tooltip](tooltip.md) — the visible name of each icon.
- [code-editor](code-editor.md) — the usual host of an editor toolbar (`toolbar` slot).

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `ButtonGroupItem[]` | `[]` | false | Actions, toggles and menus, in reading order. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the toolbar, written as the `aria-label` attribute. Empty only when `aria-labelledby` names the toolbar; then no `aria-label` renders. |
| `kind` | `'transparent' \| 'outlined'` | `'transparent'` | false | Visual variant of every button. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token of every button. |
| `visibleCount` | `number` | `undefined` | false | Items shown as buttons; the rest go into the More actions menu. Unset shows every item. |
| `overflowLabel` | `string` | `''` | false | Label of the overflow button. Empty uses the locale catalog (`More actions`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `{ id: string }` | An action or a menu option was chosen (from the bar or the overflow). |
| `toggle` | `{ id: string; pressed: boolean }` | A toggle was activated; `pressed` is the new state to store. |

## Sub-components

_none_ — items are data (`items`), because every item has the same anatomy (icon, label, state) and the overflow menu must re-render the same items as menu options.

## States

- Visual states per item: `default`, `hover`, `focus-visible`, `pressed` (toggle, `data-pressed`, `--bg-selected`), `loading` (action), `disabled`.
- Root data attributes: `data-kind`, `data-size`; each item `data-button-group-item="<id>"`.
- Overflow: a pressed toggle shows a check and a hidden "On" in the More actions menu; a menu item becomes a labelled group of its options.

## Accessibility

- `role="toolbar"` with `aria-orientation="horizontal"` and a mandatory accessible name: `aria-label` (static or bound) or `aria-labelledby`. `webkit/accessible-name` flags a ButtonGroup with neither, and an empty name renders no `aria-label` attribute.
- Keyboard map: one tab stop (the last focused item, else the first enabled); `ArrowRight` / `ArrowLeft` move and wrap (swapped under `dir="rtl"` through `logicalArrowKey`); `Home` / `End` jump to the ends; `Enter` / `Space` activate; on a menu item `Enter`, `Space` or `ArrowDown` open the menu, `Escape` closes it and returns focus to its button.
- Each icon button's accessible name is its `label`; the tooltip shows the same text on hover and focus.
- Toggles expose `aria-pressed`; the pressed fill is backed by an outline in forced colors.
- Disabled items leave the roving order; loading actions keep focus and announce through the button's busy state.
- Contrast: icon buttons follow `IconButton` (≥ 3:1 for the glyph, ≥ 4.5:1 for focus ring and labels).

## Right-to-left

- Layout: the row follows the inline direction; the overflow button is always last (inline end).
- Icons: not mirrored (the consumer passes a directional icon when meaning depends on direction).
- Keyboard: arrows follow the visual order under `dir="rtl"`.

## Internationalization

| Key                       | English source | Override prop   |
| ------------------------- | -------------- | --------------- |
| `buttonGroup.moreActions` | `More actions` | `overflowLabel` |
| `buttonGroup.pressed`     | `On`           | —               |

- Item labels are consumer copy.

## Responsive

- The row wraps (`flex-wrap`) instead of overflowing a narrow container; use `visibleCount` to keep one line on small screens.
- Touch: targets follow `IconButton` sizes; prefer `size="large"` on touch-first surfaces.
- No hover-only affordance: every label is the accessible name and is reachable by focus.

## Examples

### Default

```vue
<script setup>
  import ButtonGroup from '@aziontech/webkit/button-group'
  import { computed, ref } from 'vue'

  const wrap = ref(false)
  const last = ref('')

  const items = [
    { id: 'copy', label: 'Copy code', icon: 'pi pi-copy' },
    { id: 'format', label: 'Format document', icon: 'pi pi-align-left' },
    { id: 'wrap', type: 'toggle', label: 'Wrap lines', icon: 'pi pi-arrows-h' },
    {
      id: 'download',
      type: 'menu',
      label: 'Download',
      icon: 'pi pi-download',
      options: [
        { id: 'download-js', label: 'Download as .js' },
        { id: 'download-zip', label: 'Download as .zip' }
      ]
    }
  ]

  const resolved = computed(() =>
    items.map((item) => (item.type === 'toggle' ? { ...item, pressed: wrap.value } : item))
  )

  const onToggle = ({ id, pressed }) => {
    if (id === 'wrap') wrap.value = pressed
    last.value = `${id}: ${pressed ? 'on' : 'off'}`
  }
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-sm)">
    <ButtonGroup
      :items="resolved"
      aria-label="Editor actions"
      @click="({ id }) => (last = id)"
      @toggle="onToggle"
    />
    <p
      class="m-0 text-body-sm text-(--text-muted)"
      aria-live="polite"
    >
      Last action: {{ last || 'none' }}
    </p>
  </div>
</template>
```

### WithOverflow

```vue
<script setup>
  import ButtonGroup from '@aziontech/webkit/button-group'
  import { computed, ref } from 'vue'

  const pinned = ref(true)

  const items = computed(() => [
    { id: 'refresh', label: 'Refresh', icon: 'pi pi-refresh' },
    {
      id: 'pin',
      type: 'toggle',
      label: 'Pin to home',
      icon: 'pi pi-star',
      pressedIcon: 'pi pi-star-fill',
      pressed: pinned.value
    },
    { id: 'share', label: 'Share', icon: 'pi pi-share-alt' },
    { id: 'duplicate', label: 'Duplicate', icon: 'pi pi-clone' },
    { id: 'archive', label: 'Archive', icon: 'pi pi-inbox', disabled: true },
    {
      id: 'export',
      type: 'menu',
      label: 'Export',
      icon: 'pi pi-file-export',
      options: [
        { id: 'export-csv', label: 'Export as CSV' },
        { id: 'export-json', label: 'Export as JSON' }
      ]
    }
  ])
</script>

<template>
  <ButtonGroup
    :items="items"
    :visible-count="3"
    kind="outlined"
    size="small"
    aria-label="Record actions"
    @toggle="({ pressed }) => (pinned = pressed)"
  />
</template>
```

# Copy Text

> CopyText shows one code value (a CSS custom property, a utility class, a CNAME, a key ID, a one-line command) in monospace inside a quiet bordered box, with an always-visible `CopyButton` at its inline end that copies the value. It composes `CopyButton` for the clipboard write, the copied confirmation, the live announcement and the manual-copy fallback, so it re-implements none of them. Unlike `CopyButton` (icon only, no visible value) and `TableCellId` (an identifier laid out for a table cell), CopyText is the inline "show this value and let me copy it" pattern for prose, key/value lists, token tables and cards.

- Import: `import CopyText from '@aziontech/webkit/copy-text'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [copy-text.json](copy-text.json)

## When to use

- Show a short code value the reader will paste elsewhere, next to its label: a design token (`--spacing-2xl`), a class (`p-(--spacing-2xl)`), a CNAME, an API key ID, a one-line CLI command.
- Token tables, key/value rows, setup steps and cards outside a data table.

## Do

- Pass the exact text in `value`; CopyText shows and copies the same string.
- Keep values to one line. A long value truncates with an ellipsis; the full value stays in the `title`, in the accessible name of the copy button and in the clipboard.
- Pass `ariaLabel` when the value alone does not say what it is (`Copy CNAME`); the default reads `Copy {value}`.
- Listen to `copy` for analytics or a toast; it fires only after the clipboard write succeeds.
- Use `size="small"` in dense tables and lists.

## Don’t

- The value is not shown, only copied → use `copy-button`.
- An identifier inside a data table cell → use `table-cell-id`.
- A multi-line snippet or a block of code → use `code-block`.
- A keyboard shortcut → use `kbd`.
- A secret that must stay masked until revealed → use `password-input` (`readonly`) with a `copy-button`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [copy-button](copy-button.md) — the control CopyText composes; use it alone when the value is not displayed.
- `table-cell-id` — the same idea laid out for a table cell (fills the cell, outline button).
- [code-block](code-block.md) — multi-line code with its own copy control.
- [kbd](kbd.md) — keycaps for shortcuts, not copyable values.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `value` | `string` | `—` | true | The code value shown and copied to the clipboard. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the copy button. Empty uses the locale catalog (`Copy {value}`). |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token; sets the code typography and the size of the copy button (28 px or 32 px). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `copy` | `(event: MouseEvent, value: string)` | Re-emitted from the composed `CopyButton` after a successful write; `value` is the copied text. |

## States

- Visual states: `idle`, `copied` (owned by the composed `CopyButton`: check glyph, tooltip and `role="status"` announcement for 2 s), `focus-visible` on the copy button.
- `data-size` mirrors `size` on the root.
- The composed `CopyButton` carries `data-state` (`idle` | `copied`).
- Clipboard blocked: the composed `CopyButton` opens its manual-copy popover (see `.specs/copy-button.md`); CopyText adds nothing.
- Empty `value`: the box renders empty and the copy click is a no-op (CopyButton ignores an empty value).
- `loading`, `error`, `disabled`, `readonly`, `invalid`, `open`/`closed`: not states of this component — it is a static value with one action.

## Accessibility

- Pattern: static text plus a native `button` (WAI-ARIA APG Button pattern, provided by `CopyButton`). The value is plain text, readable and selectable; only the copy button is interactive, so there is one tab stop.
- Visible focus: inherited from `IconButton` (`focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`).
- Keyboard map: `Tab` focuses the copy button; `Enter` / `Space` copies; `Esc` closes the manual-copy popover when the clipboard is blocked (owned by `CopyButton`).
- ARIA: the copy button's name is `ariaLabel` or `Copy {value}` (it carries the full value even when the visible text truncates); `Copied` replaces it for 2 s and is announced through CopyButton's `role="status"` region. The value has `title` set to the full value.
- Attributes: consumer `class`, `id` and listeners land on the root `span` (`inheritAttrs: false` + `v-bind="$attrs"`).
- Contrast ≥4.5:1 for the value (`--text-default` on `--bg-surface`) and ≥3:1 for the copy glyph.
- `motion-reduce:transition-none` on every motion (inherited).
- Touch target: the copy button is 28 px (`small`) or 32 px (`medium`), above the 24 px minimum, with IconButton's 44 px hit area on `pointer: coarse`.

## Right-to-left

- Layout: logical utilities only (`ps-`, `text-start`); the copy button sits at the inline end, so it moves to the left under `dir="rtl"`.
- Icons: the copy and check glyphs do not mirror.
- Keyboard: no arrow-key logic.
- User data: the value is code, rendered with `dir="ltr"` so `--spacing-2xl` and `p-(--spacing-2xl)` never reorder inside a right-to-left page.

## Internationalization

| Key             | English source | Override prop         |
| --------------- | -------------- | --------------------- |
| `copyText.copy` | `Copy {value}` | `ariaLabel`           |
| `common.copied` | `Copied`       | — (from `CopyButton`) |

- Formatting: none; the value is user data and is never translated.

## Responsive

- Container queries: none; the box is inline and as wide as its value, capped at `max-w-full`.
- Narrow (≤ 640 px or a narrow container): the value never wraps (`whitespace-nowrap`, no break at hyphens) and truncates with an ellipsis; the copy button never shrinks.
- Touch: the copy button is always visible (no hover-only affordance); 28 / 32 px with a 44 px hit area on `pointer: coarse`.
- Reflow: no horizontal scroll at 320 px and 200 % zoom — the value truncates instead.

## Examples

### Default

```vue
<script setup>
  import CopyText from '@aziontech/webkit/copy-text'
</script>

<template>
  <CopyText value="--spacing-2xl" />
</template>
```

### Sizes

```vue
<script setup>
  import CopyText from '@aziontech/webkit/copy-text'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <CopyText
      value="p-(--spacing-2xl)"
      size="small"
    />
    <CopyText
      value="p-(--spacing-2xl)"
      size="medium"
    />
  </div>
</template>
```

### Long value

```vue
<script setup>
  import CopyText from '@aziontech/webkit/copy-text'
</script>

<template>
  <div class="flex max-w-(--container-3xs) flex-col gap-(--spacing-xs)">
    <span class="text-label-sm text-(--text-muted)">CNAME</span>
    <CopyText
      value="acme-store-production.example.com"
      aria-label="Copy CNAME"
    />
  </div>
</template>
```

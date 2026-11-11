# Kbd

> Kbd renders keyboard input — a single key or a shortcut combination — as a compact, non-interactive keycap. It reads like a real key: a bordered surface with a thicker bottom edge for depth. Modifier keys are passed as boolean props (`meta`, `shift`, `alt`, `ctrl`) and rendered with the correct OS-aware glyph (⌘ on macOS, the catalog's `Ctrl` elsewhere), and named keys (`keyName`) print their localized name, so consumers never hardcode platform symbols or English key names. Use it for shortcut hints in prose, menus, and control suffixes (e.g. the ⌘K hint in `command`).

- Import: `import Kbd from '@aziontech/webkit/kbd'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [kbd.json](https://github.com/aziontech/webkit/blob/main/.specs/kbd.json)

## When to use

- Show a keyboard shortcut or a single key inline (a ⌘K hint on a search button, an `Esc` hint in a dialog, `/` to focus search).
- Present a modifier combination whose glyph should adapt to the user's OS.

## Do

- Keep the default slot to a single key or glyph (`K`, `7`, `Enter`, `Esc`, `/`); avoid lowercase words or sentences.
- Pass modifiers as boolean props rather than hardcoding `⌘`/`⇧` so the glyph adapts to the OS.
- Name a key with `key-name` (`<Kbd key-name="escape" />`) instead of typing `Esc` or `Enter`: the text comes from the locale catalog (`kbd.*`), so it follows `WebkitProvider` (`Espaço` in pt-BR, `Intro` in es) and a consumer renames it with `messages` (`{ kbd: { ctrl: 'Strg' } }`). The macOS symbols `⌘`, `⌃`, `⌥` and `⇧` are never translated.
- Place surrounding punctuation outside the element, not inside the keycap.

## Don’t

- The token is a status/category label, not a key → use `tag` or `badge`.
- You need an interactive control that fires on click → use `button` / `icon-button`; Kbd is a presentational hint only.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [command](command.md) — consumes Kbd for its per-item shortcut hints and its ⌘K trigger affordance.
- [badge](badge.md) — compact non-interactive indicator for counts/status; Kbd is specifically for keyboard keys.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `meta` | `boolean` | `false` | false | Prepend the meta/command modifier glyph (⌘ on macOS, Ctrl elsewhere). |
| `ctrl` | `boolean` | `false` | false | Prepend the Control modifier glyph (⌃ on macOS, Ctrl elsewhere). |
| `shift` | `boolean` | `false` | false | Prepend the Shift modifier glyph (⇧). |
| `alt` | `boolean` | `false` | false | Prepend the Alt/Option modifier glyph (⌥ on macOS, Alt elsewhere). |
| `size` | `'small' \| 'medium'` | `'medium'` | false | Size token; `small` is a denser keycap for menus, command bars, and table cells. |
| `keyName` | `'ctrl' \| 'alt' \| 'shift' \| 'escape' \| 'enter' \| 'space' \| 'tab' \| 'backspace' \| 'delete'` | `undefined` | false | Named key printed from the locale catalog (`escape` → `Esc`, `enter` → `Enter`); the slot still renders after it. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The single key or glyph rendered after any modifier glyphs (`K`, `Enter`, `Esc`). |

## States

Kbd is non-interactive: it has no hover, focus, active, or disabled states and emits no events. Variants are exposed as `data-*` attributes on the root for Tailwind variant styling and for test/Code-Connect hooks:

- `data-size` mirrors the `size` prop (`small` | `medium`).

## Accessibility

- Visible focus: not applicable — Kbd is non-interactive (no focus, no keyboard, no tab stop).
- Keyboard map: none — Kbd is a presentational hint and exposes no interactive affordance.
- ARIA: the root is the native `<kbd>` element so assistive tech announces it as keyboard input; modifier glyphs render as text so a combination like ⌘K is announced in reading order.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): `var(--text-default)` on `var(--bg-surface)` is theme-guaranteed in both light and dark.
- `motion-reduce:*`: not applicable — Kbd is static (no motion).
- Touch target: not applicable — Kbd is non-interactive.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: modifier symbols (`⌘`, `⌥`, `⇧`) never mirror.
- Keyboard: no horizontal arrow-key logic.
- Isolation: the keycap renders `dir="ltr"`, so a shortcut such as `Ctrl` `K` keeps its order inside right-to-left text; key names come from the locale catalog (`kbd.*`).

## Examples

### Default

```vue
<script setup>
  import Kbd from '@aziontech/webkit/kbd'
</script>

<template>
  <Kbd meta>K</Kbd>
</template>
```

### Sizes

```vue
<script setup>
  import Kbd from '@aziontech/webkit/kbd'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Kbd
      meta
      size="small"
      >K</Kbd
    >
    <Kbd
      meta
      size="medium"
      >K</Kbd
    >
  </div>
</template>
```

### Combinations

```vue
<script setup>
  import Kbd from '@aziontech/webkit/kbd'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Kbd>/</Kbd>
    <Kbd meta>K</Kbd>
    <Kbd
      meta
      shift
      >P</Kbd
    >
    <Kbd>Esc</Kbd>
  </div>
</template>
```

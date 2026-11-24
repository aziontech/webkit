# Kbd

> Kbd renders keyboard input — a single key or a shortcut combination — as a compact, non-interactive keycap. It reads like a real key: a bordered surface with a thicker bottom edge for depth. Modifier keys are passed as boolean props (`meta`, `shift`, `alt`, `ctrl`) and rendered with the correct OS-aware glyph (⌘ on macOS, the catalog's `Ctrl` elsewhere), and named keys (`keyName`) print their localized name, so consumers never hardcode platform symbols or English key names. The platform is read once mounted: the server and the first client render print the non-Mac names, then a Mac swaps in its glyphs, so hydration never mismatches. Use it for shortcut hints in prose, menus, and control suffixes (e.g. the ⌘K hint in `command`). A sequence can also be passed as a `keys` list (`['meta', 'shift', 'p']`, `['arrow-up', 'arrow-down']`), drawn either as one keycap (`variant="combined"`, the default) or as one keycap per key (`variant="separate"`, each a nested `<kbd>` as HTML specifies for key combinations). Arrow keys and the Return glyph (`↵`) are named keys like `escape`.

- Import: `import Kbd from '@aziontech/webkit/kbd'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [kbd.json](kbd.json)

## When to use

- Show a keyboard shortcut or a single key inline (a ⌘K hint on a search button, an `Esc` hint in a dialog, `/` to focus search).
- Present a modifier combination whose glyph should adapt to the user's OS.

## Do

- Keep the default slot to a single key or glyph (`K`, `7`, `Enter`, `Esc`, `/`); avoid lowercase words or sentences.
- Pass modifiers as boolean props rather than hardcoding `⌘`/`⇧` so the glyph adapts to the OS.
- Name a key with `key-name` (`<Kbd key-name="escape" />`) instead of typing `Esc` or `Enter`: the text comes from the locale catalog (`kbd.*`), so it follows `ConfigProvider` (`Espaço` in pt-BR, `Intro` in es) and a consumer renames it with `messages` (`{ kbd: { ctrl: 'Strg' } }`). The macOS symbols `⌘`, `⌃`, `⌥` and `⇧` are never translated.
- Place surrounding punctuation outside the element, not inside the keycap.
- Use `keys` when the shortcut comes from data (a command list, a settings table); use the boolean props when you write it by hand. Pick `variant="separate"` for a sequence pressed key by key or for arrow pairs (`↑` `↓` to navigate), `combined` for a chord pressed at once.
- Name the Return key `return` (`↵`) in compact hints (a footer "↵ to select"); keep `enter` (`Enter`) where the word reads better.

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
| `keyName` | `'' \| 'ctrl' \| 'alt' \| 'shift' \| 'escape' \| 'enter' \| 'space' \| 'tab' \| 'backspace' \| 'delete' \| 'return' \| 'arrowUp' \| 'arrowDown' \| 'arrowLeft' \| 'arrowRight'` | `''` | false | Named key printed from the locale catalog (`escape` → `Esc`, `enter` → `Enter`); the slot still renders after it. |
| `keys` | `string[]` | `[]` | false | A key sequence drawn after the modifier props and `keyName`: `meta`/`ctrl`/`alt`/`shift` print their OS-aware glyph, a named key prints from the catalog (matched without case or hyphens, so `arrowUp`, `arrow-up` and the DOM's `ArrowUp` are one key), a single character is upper-cased, anything else prints as written. |
| `variant` | `'combined' \| 'separate'` | `'combined'` | false | Visual variant: one keycap holding every key, or one keycap per key. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The single key or glyph rendered after any modifier glyphs (`K`, `Enter`, `Esc`). |

## States

Kbd is non-interactive: it has no hover, focus, active, or disabled states and emits no events. Variants are exposed as `data-*` attributes on the root for Tailwind variant styling and for test/Code-Connect hooks:

- `data-size` mirrors the `size` prop (`small` | `medium`).
- `data-variant` mirrors the `variant` prop (`combined` | `separate`). With `separate` the root drops its keycap chrome (border, surface, shadow, padding) and each key renders as a nested `<kbd>` keycap with the same size tokens, separated by `--spacing-2xs`.

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
- Keyboard: no horizontal arrow-key logic. The arrow glyphs name physical keys, so `arrowLeft` stays `←` under `dir="rtl"`.
- Isolation: the keycap renders `dir="ltr"`, so a shortcut such as `Ctrl` `K` keeps its order inside right-to-left text; key names come from the locale catalog (`kbd.*`).

## Internationalization

| Key                                  | English source                                     | Override prop |
| ------------------------------------ | -------------------------------------------------- | ------------- |
| `kbd.ctrl` / `kbd.alt` / `kbd.shift` | `Ctrl` / `Alt` / `Shift`                           | —             |
| `kbd.escape` … `kbd.delete`          | `Esc`, `Enter`, `Space`, `Tab`, `Backspace`, `Del` | —             |
| `kbd.return`                         | `↵`                                                | —             |
| `kbd.arrowUp` … `kbd.arrowRight`     | `↑` `↓` `←` `→`                                    | —             |

- The glyph entries (`return`, arrows) are the same in every locale; they live in the catalog so a consumer can rename them with `messages` like any key name.
- Literal `keys` entries and the slot are consumer copy.

## Responsive

- A keycap never wraps inside itself (`inline-flex`); a `separate` sequence wraps between keycaps only where the surrounding text wraps.
- No touch target and no hover affordance: Kbd is non-interactive.
- Inside a button, the keycap hides on a coarse pointer (`pointer-coarse:in-[button]:hidden`): a touch phone has no keyboard to press it with. On a fine pointer it stays, and a disabled button greys it with its label (`in-[button:disabled]:text-(--text-disabled)`), so the button never reads half enabled.

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

### Keys

```vue
<script setup>
  import Kbd from '@aziontech/webkit/kbd'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm) text-body-sm text-(--text-default)">
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Kbd :keys="['meta', 'shift', 'p']" />
      <Kbd
        :keys="['meta', 'shift', 'p']"
        variant="separate"
      />
    </div>
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Kbd
        :keys="['arrow-up', 'arrow-down']"
        variant="separate"
        size="small"
      />
      <span>to navigate</span>
      <Kbd
        key-name="return"
        size="small"
      />
      <span>to select</span>
      <Kbd
        key-name="escape"
        size="small"
      />
      <span>to close</span>
    </div>
    <div class="flex flex-wrap items-center gap-(--spacing-xs)">
      <Kbd
        :keys="['arrow-left', 'arrow-right']"
        variant="separate"
      />
      <span>to switch tabs</span>
    </div>
  </div>
</template>
```

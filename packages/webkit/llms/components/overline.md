# Overline

> Overline is the short uppercase label set above a headline to name the section, panel or group it opens (the "eyebrow"). It renders its default slot in `.text-overline-md` in the brand primary color, optionally behind a preset code-style prefix (`//`, `<>`, `</>`) and followed by a blinking terminal-style cursor. It is purely presentational text with no interaction; the marketing headers (`section-title`, `hero-title`, `call-to-action`, `media-split`, `ticker`) and several page sections render their eyebrow (the `eyebrow` prop, or `label` on `ticker`) through it.

- Import: `import Overline from '@aziontech/webkit/overline'`
- Category: content · Surface: product · Structure: monolithic
- API as JSON: [overline.json](https://github.com/aziontech/webkit/blob/main/.specs/overline.json)

## When to use

- Name a section, panel or column group with one or two words set above its headline.
- Build a custom marketing header that must match the eyebrow treatment of `section-title` and `hero-title` (the `//` prefix and the blinking cursor).
- Label a band inside a page section (a comparison group, a closing panel) with the same uppercase code-style mark.

## Do

- Keep the label to one or two words: it is set uppercase and, with the default `single-line`, stays on one line whenever it fits its container.
- Turn `single-line` off only when the label can be longer than its container (narrow columns, translated copy); the label then wraps under `text-pretty`, which avoids a lone word on the last line.
- Use a `prefix` from the preset set only (`//`, `<>`, `</>`); the prefix is decorative and hidden from screen readers (`aria-hidden="true"`), so never put meaning in it.
- Use `show-cursor` for one eyebrow per view at most; the blink stops under reduced motion.
- Keep the semantic heading in the element after the Overline; the Overline itself carries no heading role.

## Don’t

- The header has a headline, description and actions → use `section-title` (or `hero-title` for the hero), which already renders its `eyebrow` through Overline.
- The text is a status, count or category attached to an item → use `tag` or `badge`.
- The text is the heading itself → use a real heading element; Overline renders a `div` and is not a heading.
- The text is a keyboard shortcut → use `kbd`.
- The text is a field label → use `label`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [section-title](section-title.md) — the framed section header; renders its `eyebrow` as an Overline with `prefix="//"` and `show-cursor`.
- hero-title` — the hero copy block; renders its `eyebrow` as an Overline closed by the cursor, with `single-line` turned off.
- [tag](tag.md) — a compact label attached to an item, not a heading companion.
- [badge](badge.md) — a compact count or status indicator.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `singleLine` | `boolean` | `true` | false | Keeps the prefix unbroken and the label on one line while it fits; a longer label wraps instead of overflowing. |
| `showCursor` | `boolean` | `false` | false | Shows a blinking terminal-style cursor after the label. |
| `prefix` | `'' \| '//' \| '<>' \| '</>'` | `''` | false | Preset prefix rendered before the label; empty renders no prefix. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The label text, rendered uppercase in the brand primary color. |

## States

- Static: no hover, focus, active or disabled states; the root is a non-interactive `div`.
- Prefix: a `span` before the label is rendered only when `prefix` is not empty; it carries `aria-hidden="true"`.
- Cursor: a `span` after the label is rendered only when `showCursor` is set; the root drops its end padding (`pr-0`) while the cursor is shown and keeps `pr-(--spacing-xxs)` otherwise.
- Wrapping: with `singleLine` (default) the prefix carries `whitespace-nowrap` and the label sits on one line because the root is `w-fit`; it wraps (with `text-pretty`) only when the container is narrower than the label. With it off the prefix may wrap too.
- Attributes (including `class`) are forwarded to the root `div` (`inheritAttrs: false` + `v-bind="$attrs"`).
- Test ids: root `content-overline` (consumer `data-testid` wins).
- Reflow: the root is capped at the width of its container, and a label that does not fit wraps instead of overflowing at any width, at 200% zoom and with translated copy (no viewport breakpoint involved).

## Accessibility

- Visible focus: not applicable — the component renders no focusable element.
- Keyboard map: none; the component is not interactive.
- ARIA: no role; the root is a plain `div` and the label is read as text. The prefix `span` is decorative and carries `aria-hidden="true"`, so only the label is announced; the cursor `span` is empty and contributes no text.
- Contrast ≥4.5:1 (text): the label uses `var(--text-primary)` (`primary-700` in light, 4.77:1 or more on every light surface; `primary-500` in dark) and the prefix `var(--text-default)` on the surface the consumer places it on.
- `motion-reduce:animate-none` on the cursor's `animate-blink`.
- Touch target: not applicable (non-interactive).

## Examples

### Default

```vue
<script setup>
  import Overline from '@aziontech/webkit/overline'
</script>

<template>
  <Overline>OVERLINE TEXT</Overline>
</template>
```

### Prefixes

```vue
<script setup>
  import Overline from '@aziontech/webkit/overline'
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <Overline prefix="//">COMMENT STYLE</Overline>
    <Overline prefix="<>">CODE LABEL</Overline>
    <Overline prefix="</>">CLOSING TAG</Overline>
  </div>
</template>
```

### Cursor

```vue
<script setup>
  import Overline from '@aziontech/webkit/overline'
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <Overline
      show-cursor
      prefix="//"
      >OVERLINE TEXT</Overline
    >
    <Overline show-cursor>NO PREFIX</Overline>
  </div>
</template>
```

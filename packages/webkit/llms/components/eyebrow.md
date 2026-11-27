# Eyebrow

> Overline is the short uppercase label set above a headline to name the section, panel or group it opens (the "eyebrow"). It renders its default slot in `.text-overline-md` in `--text-default`, optionally behind a preset code-style prefix (`//`, `<>`, `</>`) and followed by a blinking terminal-style cursor. It is purely presentational text with no interaction; the marketing headers (`module-header`, `hero-title`, `call-to-action`, `media-split`, `marquee`) and several page sections render their eyebrow (the `eyebrow` prop, or `label` on `marquee`) through it.

- Import: `import Eyebrow from '@aziontech/webkit/eyebrow'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [eyebrow.json](eyebrow.json)

## When to use

- Name a section, panel or column group with one or two words set above its headline.
- Build a custom marketing header that must match the eyebrow treatment of `module-header` and `hero-title` (the `//` prefix and the blinking cursor).
- Label a band inside a page section (a comparison group, a closing panel) with the same uppercase code-style mark.

## Do

- Keep the label to one or two words: it is set uppercase and, with the default `single-line`, stays on one line whenever it fits its container.
- Turn `single-line` off only when the label can be longer than its container (narrow columns, translated copy); the label then wraps under `text-pretty`, which avoids a lone word on the last line.
- Use a `prefix` from the preset set only (`//`, `<>`, `</>`); the prefix is decorative and hidden from screen readers (`aria-hidden="true"`), so never put meaning in it.
- `//` marks marketing section headers (`module-header`, `call-to-action`, `media-split`, `hero-section`); `<>` / `</>` only for a band about code. No prefix in app or docs.
- No colour mark (dash, bar) before the eyebrow (EB-1).
- Use `cursor` for one eyebrow per view at most; it blinks four times and then stays solid, and never blinks under reduced motion.
- Keep the semantic heading in the element after the Eyebrow; the Eyebrow itself carries no heading role.

## Don’t

- The header has a headline, description and actions → use `module-header` (or `hero-title` for the hero), which already renders its `eyebrow` through Eyebrow.
- The text is a status, count or category attached to an item → use `tag` or `badge`.
- The text is the heading itself → use a real heading element; Eyebrow renders a `div` and is not a heading.
- The text is a keyboard shortcut → use `kbd`.
- The text is a field label → use `Field.Label`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [module-header](module-header.md) — the framed section header; renders its `eyebrow` as an Eyebrow with `prefix="//"` and `cursor`.
- `hero-title` — the hero copy block; renders its `eyebrow` as an Eyebrow closed by the cursor, with `single-line` turned off.
- [tag](tag.md) — a compact label attached to an item, not a heading companion.
- [badge](badge.md) — a compact count or status indicator.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `singleLine` | `boolean` | `true` | false | Keeps the prefix unbroken and the label on one line while it fits; a longer label wraps instead of overflowing. |
| `cursor` | `boolean` | `false` | false | Shows a blinking terminal-style cursor after the label. |
| `prefix` | `'' \| '//' \| '<>' \| '</>'` | `''` | false | Preset prefix rendered before the label; empty renders no prefix. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The label text, rendered uppercase in the brand primary color. |

## States

- Static: no hover, focus, active or disabled states; the root is a non-interactive `div`.
- Prefix: a `span` before the label is rendered only when `prefix` is not empty; it carries `aria-hidden="true"`. The prefix and the label are one inline text run, joined by a word joiner (U+2060, drawn as the prefix's `::after` content), so a label that wraps in a centred column keeps the prefix next to its first word instead of stranding it at the start of the row.
- Cursor: a decorative, `aria-hidden` `span` (`${testId}__cursor`) is rendered only when `cursor` is set, inline at the end of the label, so a wrapped label keeps it after its last word; the root carries `data-cursor` and drops its end padding (`data-[cursor]:pe-0`) while the cursor is shown.
- Wrapping: with `singleLine` (default) the root carries `data-single-line` and the prefix turns `whitespace-nowrap` and the label sits on one line because the root is `w-fit`; it wraps (with `text-pretty`) only when the container is narrower than the label. With it off the prefix may wrap too.
- Attributes (including `class`) are forwarded to the root `div` (`inheritAttrs: false` + `v-bind="$attrs"`).
- Test ids: root `eyebrow` (consumer `data-testid` wins); the label `<root>__label`.
- Reflow: the root is capped at the width of its container, and a label that does not fit wraps instead of overflowing at any width, at 200% zoom and with translated copy (no viewport breakpoint involved).

## Accessibility

- Visible focus: not applicable — the component renders no focusable element.
- Keyboard map: none; the component is not interactive.
- ARIA: no role; the root is a plain `div` and the label is read as text. The prefix `span` is decorative and carries `aria-hidden="true"`, so only the label is announced; the cursor `span` is empty and contributes no text.
- Contrast: the prefix and the label use `var(--text-default)` (≥4.5:1 on every surface); every part passes WCAG 2 AA with no exception (owner decision 2026-11-22).
- `motion-reduce:animate-none` on the cursor's `animate-blink-settle`.
- Pause, Stop, Hide (WCAG 2.2.2): the cursor blinks four times and stops by itself after 4 seconds, resting solid, so it needs no pause control.
- Touch target: not applicable (non-interactive).

## Examples

### Default

```vue
<script setup>
  import Eyebrow from '@aziontech/webkit/eyebrow'
</script>

<template>
  <Eyebrow>Platform</Eyebrow>
</template>
```

### Prefixes

```vue
<script setup>
  import Eyebrow from '@aziontech/webkit/eyebrow'
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <Eyebrow prefix="//">Functions</Eyebrow>
    <Eyebrow prefix="<>">Open source</Eyebrow>
    <Eyebrow prefix="</>">Built for developers</Eyebrow>
  </div>
</template>
```

### Cursor

```vue
<script setup>
  import Eyebrow from '@aziontech/webkit/eyebrow'
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <Eyebrow
      cursor
      prefix="//"
      >Developer platform</Eyebrow
    >
    <Eyebrow cursor>Pricing</Eyebrow>
  </div>
</template>
```

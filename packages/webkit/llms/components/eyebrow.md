# Eyebrow

> Overline is the short uppercase label set above a headline to name the section, panel or group it opens (the "eyebrow"). It renders its default slot in `.text-overline-md` in the brand orange (`--text-brand`: the logo orange `#F3652B` in light and dark), optionally behind a preset code-style prefix (`//`, `<>`, `</>`) and followed by a blinking terminal-style cursor. It is purely presentational text with no interaction; the marketing headers (`section-title`, `hero-title`, `call-to-action`, `media-split`, `marquee`) and several page sections render their eyebrow (the `eyebrow` prop, or `label` on `marquee`) through it.

- Import: `import Eyebrow from '@aziontech/webkit/eyebrow'`
- Category: content · Surface: app · Structure: monolithic
- API as JSON: [eyebrow.json](eyebrow.json)

## When to use

- Name a section, panel or column group with one or two words set above its headline.
- Build a custom marketing header that must match the eyebrow treatment of `section-title` and `hero-title` (the `//` prefix and the blinking cursor).
- Label a band inside a page section (a comparison group, a closing panel) with the same uppercase code-style mark.

## Do

- Keep the label to one or two words: it is set uppercase and, with the default `single-line`, stays on one line whenever it fits its container.
- Turn `single-line` off only when the label can be longer than its container (narrow columns, translated copy); the label then wraps under `text-pretty`, which avoids a lone word on the last line.
- Use a `prefix` from the preset set only (`//`, `<>`, `</>`); the prefix is decorative and hidden from screen readers (`aria-hidden="true"`), so never put meaning in it.
- Use `cursor` for one eyebrow per view at most; the blink stops under reduced motion.
- Keep the semantic heading in the element after the Eyebrow; the Eyebrow itself carries no heading role.

## Don’t

- The header has a headline, description and actions → use `section-title` (or `hero-title` for the hero), which already renders its `eyebrow` through Eyebrow.
- The text is a status, count or category attached to an item → use `tag` or `badge`.
- The text is the heading itself → use a real heading element; Eyebrow renders a `div` and is not a heading.
- The text is a keyboard shortcut → use `kbd`.
- The text is a field label → use `Field.Label`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [section-title](section-title.md) — the framed section header; renders its `eyebrow` as an Eyebrow with `prefix="//"` and `cursor`.
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
- Prefix: a `span` before the label is rendered only when `prefix` is not empty; it carries `aria-hidden="true"`.
- Cursor: a decorative, `aria-hidden` `span` after the label is rendered only when `cursor` is set; the root carries `data-cursor` and drops its end padding (`data-[cursor]:pe-0`) while the cursor is shown.
- Wrapping: with `singleLine` (default) the root carries `data-single-line` and the prefix turns `whitespace-nowrap` and the label sits on one line because the root is `w-fit`; it wraps (with `text-pretty`) only when the container is narrower than the label. With it off the prefix may wrap too.
- Attributes (including `class`) are forwarded to the root `div` (`inheritAttrs: false` + `v-bind="$attrs"`).
- Test ids: root `eyebrow` (consumer `data-testid` wins); the label `<root>__label`.
- Reflow: the root is capped at the width of its container, and a label that does not fit wraps instead of overflowing at any width, at 200% zoom and with translated copy (no viewport breakpoint involved).

## Accessibility

- Visible focus: not applicable — the component renders no focusable element.
- Keyboard map: none; the component is not interactive.
- ARIA: no role; the root is a plain `div` and the label is read as text. The prefix `span` is decorative and carries `aria-hidden="true"`, so only the label is announced; the cursor `span` is empty and contributes no text.
- Contrast: the prefix uses `var(--text-default)` (≥4.5:1). The label uses `var(--text-brand)`, the logo orange `primary-500` in both themes: 5.5:1 or more on every dark surface, but about 2.9–3.1:1 on the light surfaces, under WCAG 2 AA 4.5:1 and APCA Lc 60. This is an owner-accepted brand exception (the eyebrow matches the logo orange; owner decision 2026-11-16), recorded in `rules/webkit-tokens.md` § "Contrast: APCA and WCAG 2"; the automated axe checks skip `color-contrast` on the `<root>__label` part in light only.
- `motion-reduce:animate-none` on the cursor's `animate-blink`.
- Touch target: not applicable (non-interactive).

## Examples

### Default

```vue
<script setup>
  import Eyebrow from '@aziontech/webkit/eyebrow'
</script>

<template>
  <Eyebrow>OVERLINE TEXT</Eyebrow>
</template>
```

### Prefixes

```vue
<script setup>
  import Eyebrow from '@aziontech/webkit/eyebrow'
</script>

<template>
  <div class="flex flex-col items-start gap-4">
    <Eyebrow prefix="//">COMMENT STYLE</Eyebrow>
    <Eyebrow prefix="<>">CODE LABEL</Eyebrow>
    <Eyebrow prefix="</>">CLOSING TAG</Eyebrow>
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
      >OVERLINE TEXT</Eyebrow
    >
    <Eyebrow cursor>NO PREFIX</Eyebrow>
  </div>
</template>
```

# Skip Link

> The first focusable element of a page: a link that is visually hidden until it receives keyboard focus, then appears at the top-start corner and jumps to the page's main content, so a keyboard or screen-reader user bypasses the repeated header and navigation (WCAG 2.4.1 Bypass Blocks). On activation it also moves focus into the target, so the next `Tab` continues from the main content in every browser. It differs from `link` in that it is invisible at rest and owns its placement and focus hand-off.

- Import: `import SkipLink from '@aziontech/webkit/skip-link'`
- Category: navigation · Surface: app · Structure: monolithic
- API as JSON: [skip-link.json](skip-link.json)

## When to use

- Every page shell (console, marketing site, docs) that renders repeated navigation before the main content: place it as the first child of the shell.
- A layout whose `<main>` (or other main landmark) carries the `id` the link targets (`main` by default).

## Do

- Render one skip link per page, as the first element inside the shell, before the header; do not wrap it in `nav` or move it into the header.
- Give the main landmark the `id` the link points at (`id="main"` for the default `href`); a missing target makes the link a no-op.
- Keep the label short and name the destination ("Skip to content"); override it with `label` or the default slot only when the target is not the main content.

## Don’t

- A link inside content that should always be visible → use `link`.
- Jumping between sections of one page (an in-page table of contents) → use `link` with a `#hash` `href`.
- A page with no repeated block before its content (a bare sign-in form) gains nothing from one; do not add it there.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [link](link.md) — the always-visible navigation link; use it for any visible jump.
- [console-layout](console-layout.md), `site-layout`, `doc-layout` — the page shells that render the main landmark the skip link targets.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Visible label, the default slot's fallback. Empty uses the locale catalog (`Skip to content`). |
| `href` | `string` | `'#main'` | false | In-page hash of the element to jump to; the element with that `id` receives focus on activation. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The link text. Fallback: `label`, then the locale catalog. |

## States

- Visual states: `hidden` (at rest: clipped to 1 px and out of the layout, still in the tab order and the accessibility tree), `focused` (shown at the top-start corner of the viewport with the surface, border, shadow and focus ring), `hover` while shown (label underlined).
- Activation: when `href` is a `#hash` that resolves to an element, the element is focused; if it is not natively focusable and has no `tabindex`, it gets `tabindex="-1"` for the hand-off and loses it on `blur`. Native hash navigation (scroll and URL hash) still runs.
- A `href` that is empty, external or names no element: the link behaves as a plain anchor; no focus hand-off.
- Not applicable: `disabled`, `loading`, `readonly`, `invalid`, `empty`, `error`, `open`/`closed` — a skip link has none of these states; no `data-*` state attribute is rendered.
- Consumer attributes (`id`, `aria-*`, `data-*`, listeners, `class`) land on the anchor through `v-bind="$attrs"`.

## Accessibility

- Pattern: a native `a href` (no ARIA role); its accessible name is the visible label. It is the first focusable element so it is reached by the first `Tab` (WCAG 2.4.1 Bypass Blocks).
- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`; the link is fully shown on any focus (`:focus`), so it is never focused while invisible (WCAG 2.4.7), and the border keeps the outline in forced-colors mode.
- Keyboard map: `Tab` (first in the page) focuses and reveals it; `Enter` activates: the page jumps to the target and focus moves into it; `Tab` from there continues inside the main content; `Shift+Tab` / moving focus away hides it again.
- ARIA: none needed; the hidden state is visual only (clipped, not `display: none`, not `aria-hidden`), so screen readers list it.
- Contrast: `--text-default` on `--bg-surface` ≥ 4.5:1 in light and dark; the ring token ≥ 3:1 against `--bg-canvas`.
- Motion: none (see `## Motion & Animations`).
- Touch target: min height 40 px while shown (44 px on coarse pointers).
- Link safety: every `href` from props or data goes through the shared `safeHref` check (`src/utils/safe-href.ts`). A `javascript:`, `data:`, `vbscript:` or other script URL, a protocol-relative `//host` URL, and the same hidden behind mixed case, spaces, tabs or HTML entities is dropped: the link renders without an `href`, so it is not a link and not focusable. `http`, `https`, `mailto`, `tel`, relative and `#` links are kept.

## Right-to-left

- Layout: logical utilities only (`start-(--spacing-sm)`), so the link appears at the top-right corner under `dir="rtl"`.
- Icons: none.
- Keyboard: no arrow-key logic.
- User data: none; the label is a catalog string or the consumer's slot text.

## Internationalization

| Key              | English source    | Override prop                 |
| ---------------- | ----------------- | ----------------------------- |
| `skipLink.label` | `Skip to content` | `label` (or the default slot) |

- Formatting: none.

## Responsive

- Container queries: none: a fixed-position chip sized by its label.
- Narrow (≤ 640 px or a narrow container): the chip stays at the top-start corner; its width is capped at the viewport minus both offsets and the label wraps instead of overflowing.
- Touch: shown only on focus (keyboard, switch access, screen-reader focus); min height 40 px while shown, 44 px on `pointer: coarse` (`pointer-coarse:min-h-11`); hover only underlines the label, nothing depends on it.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the label wraps.

## Examples

### Default

```vue
<script setup>
  import Link from '@aziontech/webkit/link'
  import SkipLink from '@aziontech/webkit/skip-link'
</script>

<template>
  <div class="flex flex-col gap-(--spacing-md)">
    <SkipLink href="#skip-link-demo-content" />
    <nav
      aria-label="Product"
      class="flex flex-wrap gap-(--spacing-md)"
    >
      <Link
        label="Overview"
        href="https://example.com/overview"
        size="medium"
      />
      <Link
        label="Pricing"
        href="https://example.com/pricing"
        size="medium"
      />
      <Link
        label="Documentation"
        href="https://example.com/docs"
        size="medium"
      />
    </nav>
    <section
      id="skip-link-demo-content"
      aria-label="Content"
      class="text-body-md text-(--text-default)"
    >
      Focus lands here after the skip link is activated.
    </section>
  </div>
</template>
```

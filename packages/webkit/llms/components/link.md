# Link

> Helps users move between views or sections. Migrated from the existing implementation at `packages/webkit/src/components/navigation/link/`. Design source: [Webkit — Link](https://www.figma.com/design/t97pXRs7xME3SJDs5iZ5RF/Webkit?node-id=3548-578) (`Size` × `State` variants; hover handled in CSS).

- Import: `import Link from '@aziontech/webkit/link'`
- Category: navigation · Surface: app · Structure: monolithic
- API as JSON: [link.json](link.json)

## When to use

- Use Link when the text takes the person to another page, resource or URL.
- A standalone navigation link: a domain, a repository, a docs page, "View all".
- An in-console navigation action ("Add custom domain"): no trailing icon unless `icon` is set.
- A link inside a sentence: set `inline`, so it takes the size of the text around it and keeps the underline at rest.

## Do

- Always set `href` and a label that names the destination; an empty `href` renders `#` so the anchor stays focusable, and an empty label falls back to the locale catalog (`Learn more`).
- Pass the label as the default slot or the `label` prop; the slot wins when both are set.
- `target="_blank"` adds `rel="noopener noreferrer"` and, when `icon` is empty, the `az az-external-link` glyph so an off-site link reads as one; a `_blank` link also carries visually hidden text from the locale catalog (`common.newTab`, `(opens in a new tab)`) after its label, so a screen reader announces the new tab the glyph shows (the glyph stays `aria-hidden`); same-tab links show no icon unless `icon` is set.
- An icon is shown when `icon` is set.
- Match `size` to the controls around it; heights follow `button` (40 / 32 / 28 px).
- Inside running prose set `inline`: the link inherits the font size and line height of its sentence, wraps with it and keeps a quiet underline at rest (color alone fails WCAG 1.4.1); `size` does not apply.
- `disabled` drops it from the tab order and suppresses `click`; hide a link that can never be followed instead.

## Don’t

- An action that changes something instead of navigating → use `button`.
- A text action that runs something instead of navigating → use `button` with `variant="link"`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [button](button.md) — set `href` when a link must look like a button.
- [breadcrumb](breadcrumb.md) — a trail of links for hierarchical location.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Visible label, the default slot's fallback. Empty uses the locale catalog (`Learn more`). |
| `size` | `'small' \| 'medium' \| 'large'` | `'large'` | false | Size token; affects height and typography (large 40px, medium 32px, small 28px), matching Button. |
| `disabled` | `boolean` | `false` | false | Disables interaction and applies disabled tokens. |
| `icon` | `string` | `''` | false | Azion icon class for the trailing icon; set shows it. Empty shows `az az-external-link` only when `target` is `_blank`. |
| `href` | `string` | `''` | false | Destination URL for the anchor. Empty, or an unsafe URL (`javascript:`, `data:`), renders `#`. |
| `target` | `'_blank' \| '_self'` | `'_self'` | false | Link target when navigating. |
| `inline` | `boolean` | `false` | false | Renders the link inside running prose: it inherits the size and line height of the text around it, wraps with it and keeps the underline at rest; `size` does not apply. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `click` | `MouseEvent` | — |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` |  | The link text. Fallback: `label`, then the locale catalog. |

## Assets

- Icons: every valid name is in [icons.md](../foundations/icons.md) (MCP `list_assets({ kind: "icons" })`). An unknown class renders nothing.

## States

- Visual states: `default`, `hover`, `focus-visible`, `disabled`
- `hover` and `focus-visible` underline the label (`underline-offset-4`); there is no surface behind the link
- `data-disabled` mirrors the `disabled` prop
- `inline`: the anchor carries the `text-link` style (link colour, underline at rest, stronger on hover, outline focus ring) and `data-inline`; no box height
- Consumer attributes (`id`, `aria-*`, `download`, `rel`, `data-*`, listeners) land on the anchor through `v-bind="$attrs"`; a consumer `rel` overrides the computed one

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas)`
- Keyboard map: `Tab` focuses; `Enter` activates.
- ARIA: `aria-disabled` and `tabindex="-1"` when disabled.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons), including disabled state.
- `motion-reduce:transition-none` on animated states.
- Touch target ≥40×40 px where the control is interactive.
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): points at `#`.

## Right-to-left

- Layout: logical utilities only (`ms-`/`me-`, `ps-`/`pe-`, `start-`/`end-`, `text-start`), so the layout mirrors under `dir="rtl"`.
- Icons: a directional glyph passed to `icon` (chevrons, angles, arrows, carets, `sign-in`/`sign-out`, `reply`, `undo`: the list in `utils/directional-icons.ts`) gets `rtl:-scale-x-100`; external-link arrows, media and brand glyphs do not mirror.
- Keyboard: no horizontal arrow-key logic.
- User data: a URL printed as the link text is the consumer's; wrap it in `dir="ltr"` when it sits inside right-to-left prose.

## Examples

### Default

```vue
<script setup>
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <Link
    label="Learn more"
    size="large"
    href="https://example.com/docs"
    target="_blank"
  />
</template>
```

### Sizes

```vue
<script setup>
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <div class="flex flex-wrap items-center gap-4">
    <Link
      size="large"
      label="Learn more"
      icon="az az-external-link"
    />
    <Link
      size="medium"
      label="Learn more"
      icon="az az-external-link"
    />
    <Link
      size="small"
      label="Learn more"
      icon="az az-external-link"
    />
  </div>
</template>
```

### Inline

```vue
<script setup>
  import Link from '@aziontech/webkit/link'
</script>

<template>
  <p class="max-w-(--container-sm) text-body-md text-(--text-muted)">
    Point a CNAME record at the workload before you add the domain. Read the
    <Link
      href="https://example.com/docs/domains"
      target="_blank"
      inline
      >domains guide<span class="sr-only"> (opens in a new tab)</span></Link
    >
    or open the
    <Link
      href="/domains"
      inline
      >domain list</Link
    >.
  </p>
</template>
```

---
name: citation
category: ai
structure: monolithic
status: implemented
stability: preview
spec_version: 5
template: 2
checksum: 64512bb9c07ca7a919c3c8e15714a86cfb9dd98127f9089b19c703d73cd155f3
created: 2026-11-11
last_updated: 2026-11-23
---

# Citation — Component Spec

## Purpose

An inline reference in generated text: a small
rounded chip with the mark of the source's site (its favicon, its icon, or its first letter on a
colour of its own) and the site's name (`Azion`, else the host of `href` without `www.`), and `+N`
when one marker cites several sources (`[1][2]`, `[1, 2]`). Hovering, focusing or pressing the chip
opens one card that stacks every cited source. `StreamingResponse` renders it for every run of `[n]` markers.

## When to use

- A statement in a generated response that comes from one or more specific sources.

## When NOT to use

- A link the reader is meant to follow as part of the prose → a normal link.
- Footnotes in documentation → `doc-prose` conventions.

## Related

- `sources` — the pill and panel that list every source of the response.
- `streaming-response` — renders citations from `[n]` in Markdown.
- `hover-card` — the card a chip opens.

## Best practices

- Number in order of first use: [1], [2], [3]; the numbers stay in the accessible name.
- Give each web source a `site` name (`Azion`, `GitHub`) and, when you have one, its favicon as `image`; a bare host reads as a URL.
- Give each source its `publisher` and `publishedAt` when you have them.

## Usage

```vue
<script setup>
  import Citation from '@aziontech/webkit/citation'

  const sources = [
    {
      title: 'Real-Time Purge',
      href: 'https://www.azion.com/en/documentation/',
      description: 'Removes a cached object from every data center in a few seconds.',
      site: 'Azion',
      publisher: 'Azion Technologies',
      publishedAt: '2026-03-02'
    },
    { title: 'aziontech/azion', href: 'https://github.com/aziontech/azion', site: 'GitHub' }
  ]
</script>

<template>
  <p>
    Purges reach every data center in seconds
    <Citation :indexes="[1, 2]" :sources="sources" />.
  </p>
</template>
```

## Sub-components

_None. Exports: `"./citation"`. Composed DS components: `hover-card`, and the `sources` private
parts `sources/parts/sources-mark.vue` (the round mark) and `sources/parts/sources-item.vue` (one
source block, shared with the `Sources` panel)._

## Props

| Prop      | Type            | Default | Required | JSDoc                                                                                                                              |
| --------- | --------------- | ------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| `indexes` | `number[]`      | —       | true     | 1-based numbers of the sources this reference cites, in order: `[1]` gives `[1]`, `[1][3]` and `[1, 3]` give `[1, 3]`.             |
| `sources` | `SourcesItem[]` | `[]`    | false    | The sources of the response, in citation order; `indexes` point into it. A number with no source renders as a plain numbered note. |

## Events

_No events._

## Slots

_No slots._

## States

- A chip is a `button` that opens the card: after 300 ms of hover or focus, at once on a press; a mouse press keeps it open, a touch or keyboard press toggles it. `Escape`, a press outside or moving the pointer away closes it.
- `data-state="open|closed"` on the chip; `data-slot="citation"` on the root, so `ChatMessage`'s Read aloud skips it.
- The chip text is the first source's site name (else its host, else its title), cut with an ellipsis at `max-w-48`; `+N` counts the other sources.
- The card stacks every cited source in an `<ol>`, dividers between items only. Each item follows the `Sources` menu row: the 24 px mark at the inline start; the title (a link when `href` is safe, external URLs in a new tab), two lines; `site · publisher · date` (`publishedAt` as a medium date in the reader's locale; parts it lacks are left out). No hover fill, no underline, no `description`, no pager.
- No resolvable source: a `role="note"` chip with the numbers and no card.
- The mark is the source's `image` (favicon), else its `icon`, else its first letter on one of seven chart series colours picked by a stable hash of the host, so neighbouring sites rarely share a colour. A favicon that fails to load falls back to the letter.

## Motion & Animations

| Trigger    | Animation / Transition                                        | Token     | Reduced-motion fallback         |
| ---------- | ------------------------------------------------------------- | --------- | ------------------------------- |
| chip hover | `transition-colors duration-fast-02 ease-productive-entrance` | `fast-02` | `motion-reduce:transition-none` |

The card's entrance is `HoverCard`'s own, with its reduced-motion fallback.

## Tokens

| Region | Token                                                                                                                                                                                                |
| ------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| chip   | `var(--bg-selected)`, hover and open `var(--bg-active)`, `var(--shape-control)`, padding `var(--spacing-2xs)` / `var(--spacing-xs)`, gap `var(--spacing-2xs)`                                        |
| text   | `.text-label-sm`, `var(--text-default)`; the `+N` count `var(--text-muted)`                                                                                                                          |
| mark   | 14 px circle; favicon or icon on `var(--bg-surface-raised)` with `var(--border-default)`; a letter on `var(--chart-series-n)` mixed 30% into `var(--bg-surface-raised)`, ringed in the series colour |
| card   | `HoverCard`'s panel; items `var(--spacing-sm)` apart, 1px `var(--border-default)` between; title `.text-label-sm` `var(--text-default)`, meta `.text-body-xs` `var(--text-muted)` (the `DropdownMenu` item's type) |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the chip and the card links show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches the chip and opens the card after the delay; `Enter` / `Space` toggles it; `Tab` from an open chip moves into the card and through every source link in order; `Escape` closes it and returns focus to the chip.
- ARIA: the chip is named with the site first so the name holds the visible text (WCAG 2.5.3): `Source 1, Azion: Real-Time Purge`, `Azion +2, sources 1, 2, 3`, or `Source 1: <title>` without a site; it carries `aria-expanded` and, while open, `aria-controls` and `aria-describedby` to the card. The marks are `aria-hidden`; the card is an `<ol>`.
- Touch target: inline text reference; exempt from the 24 px minimum as inline text (WCAG 2.5.8 exception).
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`) or `image`: the title is plain text, the mark falls back to the icon or letter.
- Contrast: the letter is `--text-default` on a 30% tint, well above Lc 60; the series ring is a solid mark (Lc 30).

## Internationalization

| Key                      | English source                      | Override prop |
| ------------------------ | ----------------------------------- | ------------- |
| `citation.label`         | `Source {index}: {title}`           | —             |
| `citation.labelMany`     | `{site} +{more}, sources {indexes}` | —             |
| `citation.labelUntitled` | `Source {index}`                    | —             |
| `citation.labelWithSite` | `Source {index}, {site}: {title}`   | —             |
| `common.newTab`          | `(opens in a new tab)`              | —             |

- Formatting: `Intl.NumberFormat`; `publishedAt` with `Intl.DateTimeFormat` (`dateStyle: 'medium'`), a date-only string kept on its day.

## Right-to-left

- Layout: logical padding; the mark sits at the inline start of the chip and the card. In a response (`StreamingResponse`), one normal space separates the chip from the word before, none from the punctuation after (`.` `,` `;` `:` `)`).
- Icons: site icons and favicons do not mirror; the external-link glyph stays as drawn.
- Keyboard: none.
- User data: site names, titles and publishers render with the document direction.

## Responsive

- Container queries: none: the chip is at most 12rem wide and cuts its text; the card is at most `--container-xs` and fits the viewport.
- Narrow: unchanged.
- Touch: a tap toggles the card (hover is ignored for touch); a tap outside closes it. On coarse pointers the chip still answers a tap across 44 px through an invisible hit area, as `IconButton` does.
- Reflow: inline.

## Performance

- Bundle budget: see `.size-limit.json` (`citation`; includes `HoverCard` and the shared source block).
- Runtime budget: one document `pointerdown` listener, only while the card is open; favicons load lazily.
- Heavy parts: none.

## Examples

_Example in `packages/webkit/examples/citation/`: Default (one single and one double reference, with publishers and dates)._

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

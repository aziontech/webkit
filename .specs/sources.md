---
name: sources
category: ai
structure: monolithic
status: implemented
spec_version: 4
template: 2
checksum: daae9fbef98e3139dd5378b29d43475f78a96871826c92ef9f251dc7d22f50fe
created: 2026-11-11
last_updated: 2026-11-22
---

# Sources — Component Spec

## Purpose

The sources a generative AI response drew on (ChatGPT's Sources, Cloudscape's sources section, AI
Elements Sources): a small `Sources` pill with the overlapping marks of up to three cited sources
that opens a panel listing every source — mark, site name, linked title and snippet. The panel is a
side `Drawer` from the end on wide screens (non-modal, the answer stays readable beside it) and a
bottom sheet on a phone. Sources the answer searched but did not cite (`cited: false`) are listed
under More, after the Citations. The pill ends the message's action row (`ChatMessage.Actions`
`#trailing`), on the same line as the actions. Each mark is the site's favicon (`image`), its icon,
or its first letter on a colour of its own, so three sources never look alike.

## When to use

- A response is grounded in documents, pages or records the reader may want to open or verify.

## When NOT to use

- Related links that the response did not use → `help-panel` links or a plain list.
- A single source → cite it inline with `Citation`; a list of one is noise.

## Related

- `citation` — the inline chip whose numbers point at these items.
- `streaming-response` — renders the citations; pass it the same items.
- `chat-message` — the pill goes in the `#trailing` slot of `ChatMessage.Actions`, after the icon actions.
- `drawer` — the panel the pill opens.

## Best practices

- Order items as the response first cites them, so `[1]` is item 1; put uncited items (`cited: false`) last so the numbers stay aligned.
- Use the page title as the title and the site's own name as `site` (`Azion`, `GitHub`); without `site` the host of `href` shows.
- Give `image` the site's favicon URL when the app has one (from the search tool's result); otherwise `icon` for a site in the icon set, or nothing for the lettered mark.
- Keep the panel closed by default; the inline citations are the primary path.

## Usage

```vue
<script setup>
  import Sources from '@aziontech/webkit/sources'
</script>

<template>
  <Sources
    :items="[
      {
        title: 'Real-Time Purge',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Removes a cached object from every data center in a few seconds.',
        site: 'Azion'
      },
      {
        title: 'aziontech/azion',
        href: 'https://github.com/aziontech/azion',
        site: 'GitHub',
        image: 'https://github.com/favicon.ico'
      },
      { title: 'Cache-Control', href: 'https://www.w3.org/Protocols/', cited: false }
    ]"
  />
</template>
```

## Sub-components

_None. Data-driven: a source list is a record set the response already holds, like table rows.
Exports: `"./sources"`; exported type `SourcesItem` (`title`, `href?`, `description?`, `site?`,
`image?`, `icon?`, `cited?`) from `sources/types.ts`, shared with `StreamingResponse` and `Citation`.
Private parts: `parts/sources-mark.vue` draws one round mark (also used by `Citation`), and
`parts/sources-panel.vue` holds the panel, loaded on demand. Composed DS components: `drawer`._

## Props

| Prop          | Type            | Default | Required | JSDoc                                                                                                          |
| ------------- | --------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `items`       | `SourcesItem[]` | `[]`    | false    | The sources behind the response, in citation order; item `n` is what `[n]` points at.                          |
| `title`       | `string`        | `''`    | false    | Label of the pill that opens the panel. Empty shows `Sources` and names the pill with the count (`3 sources`). |
| `defaultOpen` | `boolean`       | `false` | false    | Initial open state when uncontrolled.                                                                          |

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                                                 |
| -------------- | --------- | ----------- | ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | The panel's open state, by the pill, the panel's close button, `Escape` or a press on the overlay (phone). Unbound, the state is local and starts from `defaultOpen`. |

## Events

_No events._

## Slots

_No slots._

## States

- `data-state="open|closed"` on the root and the pill (an open pill keeps the hover fill); renders nothing when `items` is empty.
- The root is `display: contents` and the pill does not wrap (`whitespace-nowrap`, `shrink-0`), so it sits at the end of the action row.
- The pill's marks are the first three cited items (all items when none is cited).
- Panel: from `md` a non-modal side `Drawer` (`size="small"`, from the end); below `md` the `Drawer`'s bottom sheet, modal. Its title is the pill's label.
- Groups: when some items have `cited: false`, the panel shows a Citations section and a More section with headings; otherwise one unheaded list.
- Mark: favicon (`image`, a safe URL), else `icon`, else the first letter of the site on one of seven `--chart-series-*` colours picked by a stable hash of the host; a favicon that fails to load falls back to the letter.

## Motion & Animations

| Trigger    | Animation / Transition                                        | Token     | Reduced-motion fallback         |
| ---------- | ------------------------------------------------------------- | --------- | ------------------------------- |
| pill hover | `transition-colors duration-fast-02 ease-productive-entrance` | `fast-02` | `motion-reduce:transition-none` |
| row hover  | `transition-colors duration-fast-02 ease-productive-entrance` | `fast-02` | `motion-reduce:transition-none` |

The panel slides with the `Drawer`'s own transition and its reduced-motion fallback.

## Tokens

| Region      | Token                                                                                                                                                                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pill        | `.text-label-md`, `var(--text-muted)`, hover and open `var(--bg-hover)` / `var(--text-default)`, `var(--shape-control)`, height 32 px                                                                                                                          |
| mark        | 20 px (pill) and 24 px (rows) circles; favicon or icon on `var(--bg-surface-raised)` with `var(--border-default)`; a letter on `var(--chart-series-n)` mixed 30% into `var(--bg-surface-raised)`, ringed in the series colour; overlap ring `var(--bg-canvas)` |
| group label | `.text-label-sm`, `var(--text-muted)`                                                                                                                                                                                                                          |
| row         | `var(--shape-control)`, padding `var(--spacing-xs)`, hover `var(--bg-hover)`; site `.text-label-sm` `var(--text-muted)`                                                                                                                                        |
| title       | `.text-label-md`, `var(--text-default)`, underline on hover, two lines                                                                                                                                                                                         |
| description | `.text-body-sm`, `var(--text-muted)`, two lines                                                                                                                                                                                                                |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the pill and the links show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` to the pill, `Enter` / `Space` opens the panel and moves focus into it; `Tab` through the links and the close button; `Escape` closes it and returns focus to the pill.
- ARIA: the pill is a `button` with `aria-haspopup="dialog"` and `aria-expanded`, named `3 sources` (it holds the visible `Sources`, WCAG 2.5.3) or by `title`; the marks are `aria-hidden`; the panel is the `Drawer`'s `dialog`, titled by the pill's label; each group is a `section` named Citations or More (or Sources when there is one group) holding an `<ol>`.
- Touch: the 32 px pill carries an invisible 44 px hit area on coarse pointers.
- External links open in a new tab with `rel="noopener noreferrer"`.
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): shows the title as plain text; an unsafe `image` is dropped.
- Contrast: the letter is `--text-default` on a 30% tint; the series ring is a solid mark (Lc 30).

## Internationalization

| Key             | English source               | Override prop |
| --------------- | ---------------------------- | ------------- |
| `sources.cited` | `Citations`                  | —             |
| `sources.count` | `{count} source(s)` (plural) | `title`       |
| `sources.label` | `Sources`                    | `title`       |
| `sources.more`  | `More`                       | —             |

- Formatting: `Intl.PluralRules` and `Intl.NumberFormat` through `t()`.

## Right-to-left

- Layout: logical utilities; the marks overlap toward the inline end (`-ms`), the mark sits at the inline start of each row; the side panel opens from the inline end.
- Icons: site glyphs and favicons are not mirrored.
- Keyboard: none.
- User data: site names, titles and snippets render with the document direction.

## Responsive

- Container queries: none.
- Narrow: below `md` the panel is the `Drawer`'s bottom sheet (full screen below `sm`); titles and snippets cut at two lines.
- Touch: the pill has a 44 px hit area on coarse pointers.
- Reflow: no horizontal scroll.

## Performance

- Bundle budget: see `.size-limit.json` (`sources`; the entry without the lazy panel chunk).
- Runtime budget: static; the panel (with `Drawer`) is a separate chunk loaded when the pointer enters or focus reaches the pill, or when it opens; one media query listener while the panel is mounted; favicons load lazily.
- Heavy parts: none.

## Examples

_Examples in `packages/webkit/examples/sources/`: Default (the pill, closed; one source under More), Open (the panel open)._

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

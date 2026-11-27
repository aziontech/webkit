---
name: sources
category: ai
structure: monolithic
status: implemented
stability: preview
spec_version: 6
template: 2
checksum: fef059566432fa97fe9cee74b38b29ec5ed4fc66922fc42ad82fdead817e1938
created: 2026-11-11
last_updated: 2026-11-23
---

# Sources — Component Spec

## Purpose

The sources a generative AI response drew on (ChatGPT's Sources, Cloudscape's sources section, AI
Elements Sources): a small `Sources` pill with the overlapping marks of up to three cited sources
that opens, in place, a `DropdownMenu` of link items, one per source. Sources the answer searched but did not cite (`cited: false`) are listed
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
- `dropdown-menu` — the menu the pill opens; its items draw every row.

## Best practices

- Order items as the response first cites them, so `[1]` is item 1; put uncited items (`cited: false`) last so the numbers stay aligned.
- Use the page title as the title and the site's own name as `site` (`Azion`, `GitHub`); without `site` the host of `href` shows.
- Pass `publisher` and `publishedAt` when you have them.
- Keep the panel closed by default; the inline citations are the primary path.
- Give `image` the site's favicon URL when the app has one (from the search tool's result); otherwise `icon` for a site in the icon set, or nothing for the lettered mark.

## Usage

```vue
<script setup>
  import Sources from '@aziontech/ui/sources'
</script>

<template>
  <Sources
    :items="[
      {
        title: 'Real-Time Purge',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Removes a cached object from every data center in a few seconds.',
        site: 'Azion',
        publisher: 'Azion Technologies',
        publishedAt: '2026-03-02'
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
`image?`, `icon?`, `publisher?`, `publishedAt?`, `cited?`) from `sources/types.ts`, shared with
`StreamingResponse` and `Citation`. Private parts: `parts/sources-mark.vue` draws one round mark
(also the leading slot of each menu item), and `parts/sources-item.vue` the `Citation` card row.
Composed DS components: `dropdown-menu` (`Trigger`, `Group`, `Item`)._

## Props

| Prop          | Type            | Default | Required | JSDoc                                                                                                          |
| ------------- | --------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------- |
| `items`       | `SourcesItem[]` | `[]`    | false    | The sources behind the response, in citation order; item `n` is what `[n]` points at.                          |
| `title`       | `string`        | `''`    | false    | Label of the pill that opens the panel. Empty shows `Sources` and names the pill with the count (`3 sources`). |
| `defaultOpen` | `boolean`       | `false` | false    | Initial open state when uncontrolled.                                                                          |

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                                                                  |
| -------------- | --------- | ----------- | ------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | The panel's open state, by the pill, `Escape` or a press outside the panel. Unbound, the state is local and starts from `defaultOpen`. |

## Events

_No events._

## Slots

_No slots._

## States

- `data-state="open|closed"` on the root and the pill (an open pill keeps the hover fill); renders nothing when `items` is empty.
- The root is `display: contents` and the pill does not wrap (`whitespace-nowrap`, `shrink-0`), so it sits at the end of the action row.
- The pill's marks are the first three cited items (all items when none is cited).
- Panel: a `DropdownMenu` (`side="auto"`, `align="start"`) on every width, never a `Drawer`; it scrolls when taller than the room left.
- Row: one `DropdownMenu.Item` per source: `value` its index, `label` the title, `href` (a safe URL), `target="_blank"` for an external URL, the 24 px mark in `#leading`, and `description` the line `site · publisher · date` (medium date in the reader's locale; parts it lacks are left out; none, a one-line row). Hover, focus, the highlighted fill with its 2px inset gap, padding and type are the menu item's; no underline. The item `description` (snippet) is not drawn.
- Groups: when some items have `cited: false`, the menu shows a Citations and a More `DropdownMenu.Group` with their labels and divider; otherwise one unlabelled group.
- Mark: favicon (`image`, a safe URL), else `icon`, else the first letter of the site on one of seven `--chart-series-*` colours picked by a stable hash of the host; a favicon that fails to load falls back to the letter.

## Motion & Animations

| Trigger    | Animation / Transition                                        | Token     | Reduced-motion fallback         |
| ---------- | ------------------------------------------------------------- | --------- | ------------------------------- |
| pill hover | `transition-colors duration-fast-02 ease-productive-entrance` | `fast-02` | `motion-reduce:transition-none` |

The menu and its rows animate with `DropdownMenu`'s own transitions and reduced-motion fallbacks.

## Tokens

| Region      | Token                                                                                                                                                                                                                                                          |
| ----------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| pill        | `.text-label-md`, `var(--text-muted)`, hover and open `var(--bg-hover)` / `var(--text-default)`, `var(--shape-control)`, height 32 px                                                                                                                          |
| mark        | 20 px (pill) and 24 px (rows) circles; favicon or icon on `var(--bg-surface-raised)` with `var(--border-default)`; a letter on `var(--chart-series-n)` mixed 30% into `var(--bg-surface-raised)`, ringed in the series colour; overlap ring `var(--bg-canvas)` |
| menu        | `DropdownMenu`'s panel, groups, labels, items and description line, unchanged                                                                                                                                                                                  |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the pill shows `focus-visible:ring-2 focus-visible:ring-(--ring-color)`; rows show the menu item's inset ring.
- Keyboard map: `DropdownMenu`'s: `Enter` / `Space` / `Down` on the pill opens and focuses the first source, `Up` the last; `Down` / `Up` / `Home` / `End` and typeahead move; `Enter` opens the link; `Escape` closes and returns focus to the pill; `Tab` closes.
- ARIA: the pill is a `button` with `aria-haspopup="menu"` and `aria-expanded`, named `3 sources` (it holds the visible `Sources`, WCAG 2.5.3) or by `title`; the marks are `aria-hidden`; the `menu` is labelled by the pill; each source is a link `menuitem` named by its title and described by its meta line; groups are `role="group"` named Citations or More.
- Touch: the 32 px pill carries an invisible 44 px hit area on coarse pointers.
- External links open in a new tab (`target="_blank"` on the item: `rel`, glyph and `common.newTab` hint).
- Unsafe `href` (`javascript:`, `data:`, any non-web scheme, `//host`): a plain item; an unsafe `image` is dropped.
- Contrast: the letter is `--text-default` on a 30% tint; the series ring is a solid mark (Lc 30).

## Internationalization

| Key             | English source               | Override prop |
| --------------- | ---------------------------- | ------------- |
| `sources.cited` | `Citations`                  | —             |
| `sources.count` | `{count} source(s)` (plural) | `title`       |
| `sources.label` | `Sources`                    | `title`       |
| `sources.more`  | `More`                       | —             |

- Formatting: `Intl.PluralRules` and `Intl.NumberFormat` through `t()`; `publishedAt` with `Intl.DateTimeFormat` (`dateStyle: 'medium'`), a date-only string kept on its day.

## Right-to-left

- Layout: logical utilities; the marks overlap toward the inline end (`-ms`); rows and the menu follow `DropdownMenu`.
- Icons: site glyphs and favicons are not mirrored.
- Keyboard: none.
- User data: site names, titles and snippets render with the document direction.

## Responsive

- Container queries: none.
- Narrow: the menu stays anchored and within the viewport; titles and meta lines cut at two lines.
- Touch: the pill has a 44 px hit area on coarse pointers.
- Reflow: no horizontal scroll.

## Performance

- Bundle budget: see `.size-limit.json` (`sources`; includes `DropdownMenu`).
- Runtime budget: the menu renders only while open; favicons load lazily.
- Heavy parts: none.

## Examples

_Examples in `packages/ui/examples/sources/`: Default (the pill, closed; one source under More), Open (the menu open)._

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
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

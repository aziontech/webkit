---
name: doc-markdown
category: documentation
structure: monolithic
status: implemented
spec_version: 2
template: 2
checksum: 29d7d830c9a35c9caf4a68e9331edf3f862405ecb5e31cc5acecab96c3861ccd
created: 2026-11-14
last_updated: 2026-11-15
---

# DocMarkdown — Component Spec

## Purpose

Renders a documentation page written in Markdown with Mintlify-style MDX component tags into the documentation components. Prose becomes plain semantic HTML (headings, paragraphs, lists, block quotes, rules, tables, inline code, links, bold, italic) that the surrounding `DocProse` styles, and the component tags (`<Note>`, `<Steps>`, `<CardGroup>`, `<Tabs>`, `<CodeGroup>`, `<Update>`, `<Tooltip>` …) mount `DocCallout`, `DocSteps`, `DocCardGroup`, `DocTabs`, `DocCodeGroup`, `DocUpdate`, `HoverCard` and the rest. Headings render as `DocHeading` with unique slug ids, and the named export `parseDocMarkdown` returns the same headings (for `DocOnThisPage` / `DocLayout`'s `outline`) and the frontmatter (for `DocPageHeader`). It is a small in-house reader of a fixed MDX subset, not an MDX compiler: no JSX expressions, no imports, no script, and no `v-html`, so a page's source can never run code.

## When to use

- Use DocMarkdown for a whole documentation page written in MDX; model Markdown that arrives while it renders uses StreamingResponse.
- A docs page whose content is authored as `.mdx` / Markdown text (a content folder, a CMS field, a string in data) instead of hand-composed Doc components.
- Copy held in data that carries inline markup (a sentence with code and a link in a block's fixture) and should render the same as a page paragraph.

## When NOT to use

- A page composed by hand from `DocHeading`, `DocCallout`, `DocSteps` … → compose them directly inside `DocProse`; there is nothing to parse.
- Chat or AI responses streamed as Markdown → `StreamingResponse` / `ChatMessage`.
- Arbitrary MDX with JSX expressions, imports or custom script → compile it with an MDX toolchain in the app; this component reads a fixed subset only.
- Code with no prose around it → `CodeBlock` or `DocCodeGroup`.

## Related

- `DocProse` — wrap this component in it; it owns the type scale, the block rhythm and the copyable inline code chips.
- `DocHeading` — every Markdown heading renders as one, with the slug id the outline points at.
- `DocLayout`, `DocOnThisPage` — take `parseDocMarkdown(source).headings` as `outline` / `items`.
- `DocPageHeader` — takes the frontmatter's `title` and `description`.
- `DocCallout`, `DocSteps`, `DocStep`, `DocCardGroup`, `DocCard`, `DocItem`, `DocAccordionGroup`, `DocAccordionItem`, `DocTabs`, `DocTab`, `DocCodeGroup`, `DocFrame`, `DocPrompt`, `DocUpdate` — what the tags mount.
- `HoverCard` — an inline `<Tooltip tip title linkLabel href>` tag renders as a HoverCard: the term is a dotted-underlined button, the card shows the title, the definition and an optional link.
- `FrameBox`, `ItemList` — the frame and list an `<ItemGroup>` renders its `<Item>` rows in.
- `StreamingResponse` — renders chat Markdown with the AI layer's reader; this component reuses that reader's inline tokenizer and `safeHref` and adds the MDX block tags, document heading levels and anchors a docs page needs, which a chat bubble must not have.

## Best practices

- Wrap it in `DocProse` and pass the page's headings to the layout from the same source: `const { headings, frontmatter } = parseDocMarkdown(source)`.
- Write one component tag per line block; a one-line callout (`<Note>Copy.</Note>`) is fine. Attribute values are strings, numbers, booleans or a string list (`tags={["API", "CLI"]}`); anything else stays literal text.
- Repeated headings are fine: the second `Test it` gets the id `test-it-2`, so anchors and the outline stay unique.
- Use `components` to swap the component a tag mounts (your own `Card`) or to add a block tag your docs use; never fork the parser.
- Write in-app links as root-relative paths (`/docs/domains`): they follow the app's router. `javascript:`, protocol-relative and other unsafe URLs render as their link text.

## Usage

```vue
<script setup lang="ts">
  import DocMarkdown, { parseDocMarkdown } from '@aziontech/webkit/doc-markdown'
  import DocProse from '@aziontech/webkit/doc-prose'

  const source = `---
title: First deploy
---

## Before you start

You need an Acme account. Run \`acme login\` first.

<Note>Deploys take about a minute.</Note>`

  const { headings, frontmatter } = parseDocMarkdown(source)
</script>

<template>
  <DocProse>
    <DocMarkdown :source="source" />
  </DocProse>
</template>
```

## Props

| Prop         | Type                        | Default | Required | JSDoc                                                                                                                                  |
| ------------ | --------------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `source`     | `string`                    | `''`    | false    | The page source: optional frontmatter, then Markdown with MDX component tags.                                                          |
| `components` | `Record<string, Component>` | `{}`    | false    | Replaces the component a block tag mounts, or adds a block tag, keyed by tag name (`Card`, `Note`). The tag's attributes become props. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default` only; the component renders what the source holds.
- Lazy tags: a code group, tabs, an accordion, a frame, an item row or a prompt renders once its async chunk loads (in place on the server and on hydration).
- Empty: an empty `source` renders the empty root (no placeholder; the page owns its empty state).
- Unknown or malformed input: an unknown capitalized tag, an unclosed tag or an unsupported attribute expression stays literal text rather than disappearing; an unclosed tag runs to the end of the source.
- Links: a root-relative `href` is followed with the app's router (`useAppNavigation`); an `http(s)` link opens in a new tab with `rel="noreferrer"` and an announced suffix; a URL that is not `http(s)`, `mailto`, root-relative or a `#fragment` renders as plain text (the shared `safeHref` of the AI layer's Markdown reader).
- Not applicable: `loading`, `error`, `disabled`, `readonly`, `invalid` (static content).

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
| ------- | ---------------------- | ------------------------------------------------- | ----------------------- |
| _none_  | —                      | —                                                 | —                       |

## Tokens

| Region                   | Token (DESIGN.md)                                       |
| ------------------------ | ------------------------------------------------------- |
| table frame              | `var(--border-default)`, `var(--bg-surface)`            |
| table corner             | `var(--shape-control)`                                  |
| table header cell        | `.text-label-sm`, `var(--text-muted)`                   |
| table body cell          | `.text-label-md`, `var(--text-default)`                 |
| table cell padding       | `var(--spacing-sm)`, `var(--spacing-xs)`                |
| callout paragraph gap    | `var(--spacing-xs)`                                     |
| item group frame surface | `var(--bg-surface)` (on `FrameBox`)                     |
| everything else          | the mounted Doc components' own tokens and `DocProse`'s |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Semantics: headings are real `h1`–`h4` (`DocHeading`) in source order with unique ids; lists are `ul` / `ol`; a table is a real `table` with `th scope="col"` header cells, wrapped in a horizontally scrollable region; a rule is `hr`; a quote is `blockquote`.
- Keyboard map: no keyboard handling of its own; links, heading anchors, tabs, accordions and code copy buttons are the mounted components' and follow their maps.
- Links: an external link announces `(opens in a new tab)` through a visually hidden suffix; link text is the author's.
- Visible focus: owned by `DocProse` (links) and the mounted components.
- Contrast: table header text `var(--text-muted)` and body text `var(--text-default)` on `var(--bg-surface)` meet 4.5:1 in both themes; no disabled state.
- Pattern: native document semantics; no WAI-ARIA APG widget of its own.
- Inside a callout, an item row or a prompt, paragraphs render as block spans so no `p` nests inside the component's own paragraph.

## Internationalization

| Key                  | English source         | Override prop |
| -------------------- | ---------------------- | ------------- |
| `docMarkdown.newTab` | `(opens in a new tab)` | —             |

- Formatting: none. All visible text is the source's; code sample labels fall back to `DocCodeGroup`'s language names.

## Right-to-left

- Layout: logical utilities only (`text-start` on table cells, logical list padding from `DocProse`); a column aligned with `:---:` / `---:` keeps the author's `center` / `end` alignment, with `right` mapped to `end`.
- Icons: none of its own; the mounted components mirror their glyphs.
- Keyboard: none of its own.
- User data: the source text renders as is; code renders inside `DocCodeGroup`, which isolates its direction.

## Responsive

- Container queries: none of its own; `DocCardGroup`, `DocUpdate` and the other mounted components respond to their containers.
- Narrow (≤ 640 px): a wide table scrolls inside its own region instead of the page; everything else reflows with `DocProse`.
- Touch: targets are the mounted components'; inline links follow `DocProse`.
- Reflow: no horizontal page scroll at 320 px and 200 % zoom; the exception is a wide table, which scrolls inside its region (WCAG 1.4.10 data-table exception).

## Performance

- Bundle budget: 15 KB gzip for the initial chunk of `./doc-markdown` in `.size-limit.json` (`entryOnly`; 14.5 KB measured). It statically imports `DocHeading`, `DocCallout`, `DocCard`, `DocCardGroup`, `DocSteps`, `DocStep`, `DocUpdate`, `HoverCard`, `FrameBox` and `ItemList`.
- Runtime budget: parsing is linear in the source length and recomputed only when `source` or `components` changes; a 1,000-line page parses in well under one frame.
- Heavy parts: `DocCodeGroup`, `DocTabs`, `DocTab`, `DocAccordionGroup`, `DocAccordionItem`, `DocFrame`, `DocItem` and `DocPrompt` are async chunks (`defineAsyncComponent`), loaded only when the page uses their tag; the server render and hydration render them in place. Syntax highlighting is `DocCodeGroup`'s own lazy chunk.

## Examples

- Default — a page source with frontmatter, headings, a paragraph with inline code and a link, a list, a callout, steps, a code group, a card group and a table, rendered inside `DocProse`.
- Components — a source whose `<Card>` tag is mounted by a component passed in `components`, with the outline built from `parseDocMarkdown`. Justified here because `components` is the one prop that changes what renders, and the Default example cannot show it.

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

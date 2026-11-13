---
name: article-index-blog
category: sections
structure: monolithic
status: implemented
spec_version: 1
created: 2026-11-05
last_updated: 2026-11-05
checksum: 364474d3316daf76692cf2596769c59a3fcdce82ff696b317b984d1c54e82033
---
# ArticleIndexBlog — Component Spec

## Purpose

Every article of the blog as one ruled list, with the controls to narrow it on one row: a category picker and a search field. Each article is a row — its cover on the left, and on the right its overline, headline, a two-line deck and its writers with the byline pinned to the foot; the row is one link named by its headline, and from `lg` up a read cue rises into its end on hover or keyboard focus. The category and the search combine; a load-more button closes the list. It is a page section — the site places it from a `{ _id: 'article-index-blog', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `segmented-button`, `input-text`, `avatar` and `button`; the selected category and the search term are local state.

## When to use

- For the blog's full list of posts, filtered by category and searched by text.

## When NOT to use

- For a resource hub filtered by facet dropdowns, with centred rows and no byline → use `article-index-resource-hub`.
- For a closing row of related articles → use `article-cards`.

## Related

- `article-index-resource-hub` — the sibling listing with facet dropdowns.
- `article-highlight` — the band that opens the blog above this list.

## Best practices

- List the articles newest first; file every article under at least one of `categories`.
- Keep the category list short enough to scroll on one row.

## Usage

```vue
<script setup>
import ArticleIndexBlog from '@aziontech/webkit/article-index-blog'
</script>

<template>
  <ArticleIndexBlog
    anchor="posts"
    all-label="All articles"
    category-label="Category"
    row-label="Read article"
    more-label="Load more"
    aria-label="Articles"
    :categories="['Developers', 'Serverless']"
    :search="{ placeholder: 'Search articles', label: 'Search articles' }"
    :items="[
      {
        key: 'ship-portfolio-two-commands-azion-cli',
        href: '/blog/ship-portfolio-two-commands-azion-cli',
        image: '/media/blog/ship-portfolio-two-commands.png',
        meta: 'Developers • SEP 25, 2026',
        title: 'How I Shipped My Portfolio in Just Two Commands',
        description: 'From template to live URL with two commands.',
        authors: [{ name: 'Patrick Menoti' }],
        byline: 'Patrick Menoti · 9 min read',
        categories: ['Developers']
      }
    ]"
  />
</template>
```

## Props

| Prop | Type | Default | Required | JSDoc |
|---|---|---|---|---|
| `anchor` | `string` | `''` | false | In-page id set on the band so a `#hash` link can scroll to it. |
| `items` | `ArticleIndexBlogItem[]` | `[]` | false | The articles, newest first; each is `{ key, href, image, meta, title, description, authors?, byline?, categories? }`. |
| `categories` | `string[]` | `[]` | false | Segments of the category picker after the show-all segment; the picker is omitted when empty. |
| `allLabel` | `string` | `''` | false | Label of the first segment, which shows every category. |
| `categoryLabel` | `string` | `''` | false | Accessible name of the category picker. |
| `search` | `ArticleIndexBlogSearch` | `undefined` | false | The search field's `placeholder` and accessible `label`; the field is omitted when absent. |
| `rowLabel` | `string` | `''` | false | Read cue revealed at the end of a row under hover or focus. |
| `moreLabel` | `string` | `''` | false | Label of the load-more button under the list; the button is omitted when empty. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list of articles. |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` (a row lights and its read cue rises in), `focus-visible` (inset ring on the row, the read cue rises in)
- Filtered: the selected category keeps the articles whose `categories` hold it, the show-all segment keeps every one; the search matches the title and the description; both combine
- Empty: when no article matches, the list and the load-more button are not rendered
- `data-kind="byline"` on the list: the copy is spread so the byline sits at the foot

## Motion & Animations

| Trigger | Animation / Transition | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback |
|---|---|---|---|
| hover fill of a row | `transition-colors duration-fast-02 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |
| read cue rising in on hover or focus | `transition-[opacity,translate] duration-moderate-01 ease-productive-entrance` | inline (matches catalog) | `motion-reduce:transition-none` |

## Tokens

| Region | Token (DESIGN.md) |
|---|---|
| row fill | hover `var(--bg-hover)` |
| cover cell | `var(--bg-surface)`, rule `var(--border-default)` |
| headline | `text-heading-sm`, `var(--text-default)` |
| overline, deck, byline | `text-overline-sm` / `text-body-sm`, `var(--text-muted)` |
| read cue | `text-overline-md`, `var(--text-default)` |
| avatar ring | `var(--bg-canvas)` |
| focus ring | `var(--ring-color)` |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
|---|---|---|
| _none_ | — | — |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the headline link draws an inset ring over the whole row; the picker, field and button own theirs.
- Keyboard map: `Tab` moves through the category picker, the search field, each row and the load-more button; the picker owns its arrow-key map.
- ARIA: the band is a `<section>` (unnamed, no header); the toolbar is a `search` landmark; the picker is a radio group named by `categoryLabel`, the field named by `search.label`; the list is named by `ariaLabel`; each row is an `article` whose headline (`h3`) link covers it; the cover is decorative (`alt=""`) and the read cue `aria-hidden`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every row is a full-row link.

## Stories (Storybook)

- Default

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

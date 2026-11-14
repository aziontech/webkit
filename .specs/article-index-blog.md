---
name: article-index-blog
category: sections
structure: monolithic
status: implemented
spec_version: 2
template: 2
created: 2026-11-05
last_updated: 2026-11-14
checksum: 0e9c49ae2974c684534b17b2843dbd39a78007c9a053944908d76dcfa53ca76e
---

# ArticleIndexBlog — Component Spec

## Purpose

Every article of the blog as one ruled list, with the controls to narrow it on one row: a category picker and a search field. Each article is a row — its cover on the left, and on the right its overline, headline, a two-line deck and its writers with the byline pinned to the foot; the row is one link named by its headline, and from `lg` up a read cue rises into its end on hover or keyboard focus. The category and the search combine; a load-more button reveals the next page, and when nothing matches an empty state offers to clear every filter. It is a page section — the site places it from a `{ _id: 'article-index-blog', props }` entry and binds `props` straight onto it — and it composes `section-module`, `frame-box`, `toggle-group`, `input`, `avatar`, `empty-state` and `button`; the selected category, the search term and the page count are local state. A row without a cover draws its client's mark in one flat ink that follows the theme.

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
- Set `empty` so a reader who filters everything away gets a way back; without it the list just disappears.
- Set `leading` to the number of articles a highlight band above already shows, so they are not listed twice until the reader filters.
- Keep the category list short enough to scroll on one row: the picker keeps every label at its full width and the row scrolls sideways on a phone instead of squeezing the labels.

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
    :page-size="12"
    :empty="{ title: 'No articles match these filters', action: 'View all articles' }"
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

| Prop            | Type                     | Default     | Required | JSDoc                                                                                                                 |
| --------------- | ------------------------ | ----------- | -------- | --------------------------------------------------------------------------------------------------------------------- |
| `anchor`        | `string`                 | `''`        | false    | In-page id set on the band so a `#hash` link can scroll to it.                                                        |
| `title`         | `string`                 | `''`        | false    | Headline beside the controls, rendered as the band's `h2`; it also names the band.                                     |
| `items`         | `ArticleIndexBlogItem[]` | `[]`        | false    | The articles, newest first; each is `{ key, href, image?, mark?, meta, title, description?, authors?, byline?, categories?, external? }`. |
| `categories`    | `string[]`               | `[]`        | false    | Segments of the category picker after the show-all segment; the picker is omitted when empty.                         |
| `allLabel`      | `string`                 | `''`        | false    | Label of the first segment, which shows every category.                                                               |
| `categoryLabel` | `string`                 | `''`        | false    | Accessible name of the category picker.                                                                               |
| `search`        | `ArticleIndexBlogSearch` | `undefined` | false    | The search field's `placeholder` and accessible `label`; the field is omitted when absent.                            |
| `rowLabel`      | `string`                 | `''`        | false    | Read cue revealed at the end of a row under hover or focus.                                                           |
| `moreLabel`     | `string`                 | `''`        | false    | Label of the load-more button under the list; without it every match is listed and no button renders.                |
| `pageSize`      | `number`                 | `12`        | false    | Rows listed per page when `moreLabel` is set; the load-more button reveals the next page.                              |
| `leading`       | `number`                 | `0`         | false    | Leading articles left out until a filter applies, because a band above already shows them.                            |
| `empty`         | `ArticleIndexBlogEmpty`  | `undefined` | false    | Copy of the state when nothing matches: `{ title, description?, action? }`; `action` labels a button that clears every filter. |
| `rowKind`       | `ArticleIndexBlogRowKind` | `'byline'` | false    | Row layout: `byline` pins the writers to the foot of the copy, `centered` centres the copy.                           |
| `categoryParam` | `string`                 | `''`        | false    | Name of a URL query parameter that preselects a category on load and scrolls the band into view; off when empty.      |
| `ariaLabel`     | `string`                 | `''`        | false    | Accessible name of the list of articles.                                                                              |

## Events

| _none_ | — | — |

## Slots

| _none_ | — | — |

## States

- Visual states: `default`, `hover` (a row lights and its read cue rises in), `focus-visible` (inset ring on the row, the read cue rises in)
- Filtered: the selected category keeps the articles whose `categories` hold it, the show-all segment keeps every one; the search matches the title and the description; both combine
- Paged: with `moreLabel` set, the first `pageSize` matches render and the load-more button, shown while more remain, adds the next `pageSize`; changing the category or the search returns to the first page
- Leading: until a category other than show-all or a search term applies, the first `leading` articles are skipped
- Empty: when no article matches, the list and the load-more button are not rendered; with `empty` set, an `EmptyState` (search icon) renders its title and description, and its `action` button clears the category and the search
- `data-kind` on the list mirrors `rowKind`: `byline` spreads the copy so the byline sits at the foot, `centered` centres it
- A row with no `image` draws its `mark` (the client's logo, flattened to one ink that inverts in the dark theme); an author with an `avatar` URL shows the photo, otherwise the initials
- An `external` row opens in a new tab (`target="_blank"`, `rel="noopener"`)
- `categoryParam`: on mount (client only) a query value that matches one of `categories` selects it and scrolls the band into view

## Motion & Animations

| Trigger                              | Animation / Transition                                                         | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| ------------------------------------ | ------------------------------------------------------------------------------ | ------------------------------------------------- | ------------------------------- |
| hover fill of a row                  | `transition-colors duration-fast-02 ease-productive-entrance`                  | inline (matches catalog)                          | `motion-reduce:transition-none` |
| read cue rising in on hover or focus | `transition-[opacity,translate] duration-moderate-01 ease-productive-entrance` | inline (matches catalog)                          | `motion-reduce:transition-none` |

## Tokens

| Region                 | Token (DESIGN.md)                                        |
| ---------------------- | -------------------------------------------------------- |
| row fill               | hover `var(--bg-hover)`                                  |
| cover cell             | `var(--bg-surface)`, rule `var(--border-default)`        |
| headline               | `text-heading-sm`, `var(--text-default)`                 |
| overline, deck, byline | `text-overline-sm` / `text-body-sm`, `var(--text-muted)` |
| read cue               | `text-overline-md`, `var(--text-default)`                |
| avatar ring            | `var(--bg-canvas)`                                       |
| band headline          | `text-heading-md`, `var(--text-default)`                 |
| focus ring             | `var(--ring-color)`                                      |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Visible focus: the headline link draws an inset ring over the whole row; the picker, field and button own theirs.
- Keyboard map: `Tab` moves through the category picker, the search field, each row and the load-more button; the picker owns its arrow-key map.
- ARIA: the band is a `<section>` named by `title` (`aria-label`) when one is set, with the title as its `h2`; the toolbar is a `search` landmark; the picker is a radio group named by `categoryLabel`, the field named by `search.label`; the list is named by `ariaLabel`; each row is an `article` whose headline (`h3`) link covers it; the cover is decorative (`alt=""`), a client mark is named by the client, and the read cue `aria-hidden`; an `external` row appends the visually hidden `(opens in a new tab)` to its link; the empty state is a `status`.
- Contrast ≥4.5:1 (text) / ≥3:1 (large + icons): text uses `--text-default` / `--text-muted`.
- `motion-reduce:transition-none` on every transition.
- Touch target ≥40×40 px — every row is a full-row link.

## Internationalization

| Key | English source | Override prop |
|---|---|---|
| `articleIndex.newTab` | `(opens in a new tab)` | — |

- Every other string (labels, placeholders, the empty state's copy) arrives through props.
- Formatting: none; dates arrive pre-formatted in `meta`.

## Right-to-left

- Layout: logical utilities only (`border-e`, `ps-`/`pe-`); the cover cell sits at the inline start.
- Icons: the read cue's `pi-arrow-up-right` and the search glyph do not mirror; client marks never mirror.
- Keyboard: the category picker owns its arrow-key map under `rtl`.
- User data: none.

## Responsive

- Container queries: none; from `lg` the toolbar sits on one row and each row splits cover and copy 2:5.
- Narrow (≤ 640 px): the toolbar stacks, the category picker scrolls sideways at full label width, and each row stacks its cover above the copy; the read cue is hidden.
- Touch: every row is a full-row link; the read cue is a hover/focus extra, never the only affordance.
- Reflow: no horizontal page scroll at 320 px; only the category picker scrolls inside its own box.

## Performance

- Bundle budget: the `./article-index-blog` entry in `.size-limit.json`.
- Runtime budget: filtering a few hundred articles on each keystroke stays under one frame; only `pageSize` rows render at once.
- Heavy parts: none; covers load lazily.

## Examples

- Default
- Empty — a search that matches nothing, showing the empty state with its clear-filters action (the filtered/empty state is the section's main non-default state).

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

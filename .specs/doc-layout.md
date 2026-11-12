---
name: doc-layout
category: documentation
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 522dda33225bfe5d7e197f7dbc40202664aa35291b1a79cc8680af1e6e315c2c
created: 2026-11-12
last_updated: 2026-11-12
---

# DocLayout — Component Spec

## Purpose

The documentation chrome, composed once in the app: a sticky header (the Azion Docs mark, the section links, `SearchTrigger` and the app's actions), the navigation rail (`Sidebar` + `Menu`) on the inline start, the article in the layout's `<main>`, the "On this page" rail (`DocOnThisPage`) on the inline end with its own slot below it, and the footer under the article. The **document** scrolls: the header and both rails are sticky, so a full-page capture shows the whole article, the browser's find and scroll restoration work, and the dark canvas is painted to the end. The outline follows the reading position, a jump clears the sticky header, and below `lg` the rail moves into a drawer opened from the header. The `Command` palette lists every navigation page. Doc pages are only their article, rendered through the default slot.

## When to use

- Every documentation page (guide, reference, legal, changelog): put one `DocLayout` in the app's root (around `RouterView`) and render each page's article as its default slot.
- A docs site that needs the navigation rail, the outline and the search palette without hand-composing `GlobalHeader`, `Sidebar`, `Menu`, `DocOnThisPage`, `Drawer` and `Command`.

## When NOT to use

- The signed-in console → `ConsoleLayout`. Marketing pages → `SiteLayout`.
- A docs landing page with no rail (the docs home) → render it with `DocHero` and the sections, without this layout, or pass an empty `navigation` and `outline`.

## Related

- `DocOnThisPage` — the outline rail; `outline` and `outlineGroups` are bound onto it.
- `DocHeading` — headings whose anchor links the layout scrolls to, clearing the sticky header.
- `DocPageHeader`, `DocProse`, `DocPagination` — the article parts rendered in the default slot.
- `Sidebar`, `Menu` — the navigation rail; `navigation` is mapped onto `Menu` groups.
- `SearchTrigger`, `Command` — the header search and the palette it opens.
- `shells/documentation` — the block that shows this layout with a sample docs tree.

## Best practices

- Compose the layout once, in the app's root; each route renders only its article. Never put a header, a rail or an inner scroll area in a page.
- Give every navigation row an `id` and an `href` (an in-app path is followed with the router; never `to`); leave `activeId` empty so the current page follows the route.
- Pass the page's headings as `outline` (`{ id, text, depth }`) with the same ids the `DocHeading`s carry; the layout tracks which one is in view.
- Put the theme switch in `navigation-footer`, the GitHub and Console links in `actions`, a call to action (`DocCta`) in `aside`, and the site footer (`Footer kind="content"`) in `footer`.
- The page renders no `<main>` and no `ScrollArea` around the article: the document scrolls.
- A drill row (`kind: 'drill'`) opens its level in place; the rail's Back then reads `Back to Docs` at the first level. Set `rootLabel` when the tree is not the whole docs (`Back to API reference`); never add a hand-made Back row to `navigation`.

## Usage

```vue
<script setup lang="ts">
  import DocLayout, { type DocLayoutNavGroup } from '@aziontech/webkit/doc-layout'

  const navigation: DocLayoutNavGroup[] = [
    {
      label: 'Get started',
      items: [{ id: 'first-deploy', label: 'First deploy', href: '/get-started/first-deploy' }]
    }
  ]
</script>

<template>
  <DocLayout
    :navigation="navigation"
    :outline="[{ id: 'before-you-start', text: 'Before you start', depth: 2 }]"
  >
    <RouterView />
  </DocLayout>
</template>
```

## Props

| Prop            | Type                  | Default | Required | JSDoc                                                                                                                                                                            |
| --------------- | --------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `navigation`    | `DocLayoutNavGroup[]` | `[]`    | false    | The docs tree: groups of rows, each `{ id, label, icon?, href?, tagValue?, disabled?, kind?, defaultOpen?, children? }`; an in-app `href` is followed with the router.           |
| `activeId`      | `string`              | `''`    | false    | Id of the current row. Empty matches the current route against each row's `href`.                                                                                                |
| `sections`      | `DocLayoutSection[]`  | `[]`    | false    | The header's section links (`Reference`, `Guides`), each `{ label, href? }`; shown from `lg`.                                                                                    |
| `home`          | `string`              | `'/'`   | false    | Where the Azion Docs mark links.                                                                                                                                                 |
| `outline`       | `DocTocItem[]`        | `[]`    | false    | The article's headings for the "On this page" rail, each `{ id, text, depth }`; the rail is not rendered when empty and the `aside` slot is unused.                              |
| `outlineGroups` | `DocTocGroup[]`       | `[]`    | false    | Complementary link groups under the outline (GitHub, Community).                                                                                                                 |
| `ariaLabel`     | `string`              | `''`    | false    | Accessible name of the navigation landmark. Empty uses the locale catalog (`Documentation`).                                                                                     |
| `rootLabel`     | `string`              | `''`    | false    | Names the top of the docs tree in the rail's Back button on the first drill level (`Back to Docs`); deeper levels name their parent row. Empty uses the locale catalog (`Docs`). |

## v-model

| Model                 | Type      | Default | Emits               | Notes                                                                         |
| --------------------- | --------- | ------- | ------------------- | ----------------------------------------------------------------------------- |
| `v-model:search-open` | `boolean` | `false` | `update:searchOpen` | Whether the search palette is open; the header search and ⌘K / Ctrl K set it. |

## Events

| Event           | Payload                                                         | Notes                                                                                                                                      |
| --------------- | --------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `navigate`      | `(event: MouseEvent \| KeyboardEvent, item: DocLayoutNavItem)`  | Fired when a navigation row or a palette page is chosen; the layout then follows its `href` (an in-app path with the router). Event first. |
| `search-select` | `(event: MouseEvent \| KeyboardEvent, value: string \| number)` | Fired when a palette item from the `search` slot is chosen. Event first.                                                                   |

## Slots

| Slot                | Scope               | Notes                                                                 |
| ------------------- | ------------------- | --------------------------------------------------------------------- |
| `default`           | —                   | The article, rendered inside the layout's `<main>`.                   |
| `actions`           | —                   | The header's end actions after the search (GitHub, Console).          |
| `navigation-footer` | —                   | The foot of the navigation rail and of the drawer (the theme switch). |
| `aside`             | —                   | Content under the outline in the end rail (a `DocCta`).               |
| `footer`            | —                   | The footer under the article (`Footer kind="content"`).               |
| `search`            | `{ query: string }` | Extra `Command.Group`s listed before the navigation pages.            |

## States

- Visual states: `default`; below `lg` the rail is a drawer (`open` / `closed`) opened from the header; the end rail shows from `xl` when `outline` or `aside` has content; the palette `open` / `closed`.
- Outline: the entry of the heading nearest the top of the viewport (under the header) carries `aria-current="location"`; choosing an entry or a heading anchor scrolls the heading under the header and updates the address hash.
- Not applicable: `loading`, `empty`, `error`, `disabled`, `readonly`, `invalid` (the article owns its states).

## Motion & Animations

| Trigger         | Animation / Transition                | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                       |
| --------------- | ------------------------------------- | ------------------------------------------------- | --------------------------------------------- |
| outline jump    | smooth window scroll                  | browser                                           | instant scroll under `prefers-reduced-motion` |
| brand hover     | `transition-opacity` on the mark link | `duration-fast-02` · `ease-productive-entrance`   | `motion-reduce:transition-none`               |
| drawer, palette | `Drawer`, `Command`                   | component                                         | handled by those components                   |

## Tokens

| Region             | Token (DESIGN.md)                                                     |
| ------------------ | --------------------------------------------------------------------- |
| canvas             | `var(--bg-canvas)`, `var(--text-default)`                             |
| sticky rail offset | `var(--layout-header-height)`                                         |
| rail widths        | `var(--container-2xs)` (navigation), `var(--container-3xs)` (outline) |
| rail rules         | `var(--border-default)`                                               |
| badge              | `.text-overline-sm`, `var(--text-muted)`, `var(--border-muted)`       |
| end rail padding   | `var(--spacing-md)`, `var(--spacing-lg)`                              |
| gaps               | `var(--spacing-xs)`, `var(--spacing-lg)`                              |
| ring               | `var(--ring-color)`, offset `var(--bg-canvas)`                        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Landmarks: the header is `GlobalHeader` (`<header>` named by the catalog `Documentation sections` on its section links); the rail is the `Sidebar` `<nav>` named by `ariaLabel`; the article is inside the single `<main>`; the end rail is an `<aside>` holding the `DocOnThisPage` navigation landmarks. A page must not render a second `<main>`.
- Keyboard map: `Tab` runs header → rail → article → end rail → footer; `⌘K` / `Ctrl K` opens the palette (`Command`); the compact menu button opens the drawer, `Escape` closes it and returns focus. Choosing an outline entry moves focus to its heading (made focusable with `tabindex="-1"`).
- Names: the mark link (`Azion Docs home`), the compact menu button (`Open documentation navigation`) and the search (`Search docs`) come from the locale catalog.
- Visible focus: composed controls own their rings; the mark link uses `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.

## Internationalization

| Key                        | English source                  | Override prop |
| -------------------------- | ------------------------------- | ------------- |
| `docLayout.navigation`     | `Documentation`                 | `ariaLabel`   |
| `docLayout.sections`       | `Documentation sections`        | —             |
| `docLayout.home`           | `Azion Docs home`               | —             |
| `docLayout.badge`          | `Docs`                          | —             |
| `docLayout.openNavigation` | `Open documentation navigation` | —             |
| `docLayout.search`         | `Search docs`                   | —             |
| `docLayout.searchEmpty`    | `No page matches your search.`  | —             |
| `docLayout.pages`          | `Pages`                         | —             |
| `docLayout.root`           | `Docs`                          | `rootLabel`   |

- Formatting: none. Navigation and outline text is consumer data.

## Right-to-left

- Layout: logical utilities only; the navigation rail sits at the inline start, the outline at the inline end, and the drawer opens from the inline start.
- Icons: the mark is not mirrored; `Menu` and `DocOnThisPage` mirror their own glyphs.
- Keyboard: arrow handling is `Menu`'s and `Command`'s, both direction-aware.
- User data: labels render with `dir="auto"` inside `Menu`, `DocOnThisPage` and `Command`.

## Responsive

- Breakpoints (viewport, because the layout is the page): the navigation rail shows from `lg` and is a drawer below; the outline rail shows from `xl`; the section links show from `lg`. The header is an `@container`, so `SearchTrigger collapsible` folds to the magnifier on a narrow header.
- Narrow: the article takes the full width; the end rail content (`aside`) is not repeated under the article.
- Touch: menu button and search are 32 px controls, 44 px on coarse pointers through their components.
- Reflow: no horizontal scroll at 320 px; the document scrolls, never an inner region.

## Performance

- Bundle budget: 65 KB gzip for `./doc-layout` in `.size-limit.json` (62.8 KB measured; it pulls `GlobalHeader`, `NavigationMenu`, `Sidebar`, `Menu`, `Drawer`, `DocOnThisPage` and `Command`).
- Runtime budget: one passive `scroll` listener (throttled to one read per animation frame) while `outline` is not empty; one `popstate` listener without a router.
- Heavy parts: none beyond the composed components.

## Examples

- Default — the layout with a docs tree, section links, an article with headings tracked by the outline, a call to action in the end rail and the footer.

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
- Do not change `structure` after `status: draft`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

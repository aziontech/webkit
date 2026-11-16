---
name: doc-layout
category: docs
structure: monolithic
status: implemented
spec_version: 6
template: 2
checksum: b3da9752ff0753a4d5748d42864246e607fafe83d5b58061279b532cc01e16d0
created: 2026-11-12
last_updated: 2026-11-16
---

# DocLayout — Component Spec

## Purpose

The documentation chrome, composed once in the app: a sticky header (the Azion Docs mark, the section links, `SearchTrigger` and the app's actions), the navigation rail (`Sidebar` + `SidebarMenu`) on the inline start, resizable by dragging its edge and collapsible to a thin edge that brings it back, the article in the layout's `<main>`, the "On this page" rail (`DocOnThisPage`) on the inline end with its own slot below it — filled from the page itself: every `DocHeading` of level 2 or 3 that carries an `anchor`, and every `DocChangelogEntry`, rendered anywhere in the default slot registers with the layout, and the rail lists them in document order, so a page composed once in the app needs no wiring to feed its outline — and the footer under the article. The **document** scrolls: the header and both rails are sticky, so a full-page capture shows the whole article, the browser's find and scroll restoration work, and the dark canvas is painted to the end. The outline follows the reading position, a jump clears the sticky header, and below `lg` the rail moves into a drawer opened from the header. The `Command` palette lists every navigation page. Doc pages are only their article (page bodies with no header, rail or footer of their own), rendered through the default slot.

## When to use

- Every documentation page (guide, reference, legal, changelog): put one `DocLayout` in the app's root (around `RouterView`) and render each page's article as its default slot.
- A docs site that needs the navigation rail, the outline and the search palette without hand-composing `AppHeader`, `Sidebar`, `SidebarMenu`, `DocOnThisPage`, `Drawer` and `Command`.

## When NOT to use

- The signed-in console → `ConsoleLayout`. Marketing pages → `SiteLayout`.
- Never as part of a page: a page body is only its article, so it never renders `DocLayout`. A docs home with no outline rail is still a page inside the one layout: its headings carry no `anchor`, so nothing registers and the end rail is not rendered.

## Related

- `DocOnThisPage` — the outline rail; the registered headings and `outlineGroups` are bound onto it.
- `DocHeading` — headings whose anchor links the layout scrolls to, clearing the sticky header; an anchored level 2 or 3 heading registers itself as an outline entry.
- `DocChangelogEntry` — each entry registers itself as a level 2 outline entry.
- `useHeadingOutline` (`@aziontech/webkit/use-heading-navigation`) — the registration a custom heading calls to join the outline.
- `DocPageHeader`, `DocProse`, `DocPagination` — the article parts rendered in the default slot.
- `Sidebar`, `SidebarMenu` — the navigation rail; `navigation` is mapped onto `SidebarMenu` groups.
- `SearchTrigger`, `Command` — the header search and the palette it opens.
- `shell/docs` — the block that shows this layout with a sample docs tree.

## Best practices

- Compose the layout once, in the app's root; each route renders only its article. Never put a header, a rail or an inner scroll area in a page.
- Give every navigation row an `id` and an `href` (an in-app path is followed with the router; never `to`); leave `activeId` empty so the current page follows the route.
- Never hand the outline to the layout: give each section heading a `DocHeading` with an `anchor` and the layout lists it, in document order, with the heading's own text, and tracks which one is in view. A heading without `anchor` stays out of the outline.
- Put the theme switch in `navigation-footer`, the GitHub and Console links in `actions`, a call to action (`DocCallToAction`) in `aside`, and the site footer (`Footer variant="content"`) in `footer`. The `aside` content shows only on pages with an outline, so a shared call to action never lands on the docs home.
- The page renders no `<main>` and no `ScrollArea` around the article: the document scrolls.
- Bind `v-model:navigation-open` and `v-model:navigation-width` to state the app persists (local storage, a cookie) so the rail keeps the reader's size and collapsed state across pages and reloads; leave them unbound and the rail resets on each mount.
- A drill row (`type: 'drill'`) opens its level in place; the rail's Back then reads `Back to Docs` at the first level. Set `rootLabel` when the tree is not the whole docs (`Back to API reference`); never add a hand-made Back row to `navigation`.

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
  <DocLayout :navigation="navigation">
    <RouterView />
  </DocLayout>
</template>
```

A page (the route's component) is only its article; its anchored headings fill the outline:

```vue
<script setup lang="ts">
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
</script>

<template>
  <article class="layout-column-content layout-boundary-inline">
    <DocPageHeader title="First deploy" />
    <DocProse>
      <DocHeading anchor="before-you-start">Before you start</DocHeading>
      <p>An Azion account.</p>
    </DocProse>
  </article>
</template>
```

## Props

| Prop            | Type                   | Default | Required | JSDoc                                                                                                                                                                            |
| --------------- | ---------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `navigation`    | `DocLayoutNavGroup[]`  | `[]`    | false    | The docs tree: groups of rows, each `{ id, label, icon?, href?, tagValue?, disabled?, kind?, defaultOpen?, children? }`; an in-app `href` is followed with the router.           |
| `activeId`      | `string`               | `''`    | false    | Id of the current row. Empty matches the current route against each row's `href`.                                                                                                |
| `sections`      | `DocLayoutSection[]`   | `[]`    | false    | The header's section links (`Reference`, `Guides`), each `{ label, href? }`; shown from `lg`.                                                                                    |
| `home`          | `string`               | `'/'`   | false    | Where the Azion Docs mark links.                                                                                                                                                 |
| `outlineGroups` | `DocOnThisPageGroup[]` | `[]`    | false    | Complementary link groups under the outline (GitHub, Community).                                                                                                                 |
| `ariaLabel`     | `string`               | `''`    | false    | Accessible name of the navigation landmark. Empty uses the locale catalog (`Documentation`).                                                                                     |
| `rootLabel`     | `string`               | `''`    | false    | Names the top of the docs tree in the rail's Back button on the first drill level (`Back to Docs`); deeper levels name their parent row. Empty uses the locale catalog (`Docs`). |

## v-model

| Model                      | Type             | Default | Emits                    | Notes                                                                                                                                                                                          |
| -------------------------- | ---------------- | ------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:search-open`      | `boolean`        | `false` | `update:searchOpen`      | Whether the search palette is open; the header search and ⌘K / Ctrl K set it.                                                                                                                  |
| `v-model:navigation-open`  | `boolean`        | `true`  | `update:navigationOpen`  | Whether the navigation rail is open from `lg`; `false` collapses it to the edge affordance that brings it back. No effect below `lg`, where the rail is a drawer.                              |
| `v-model:navigation-width` | `number \| null` | `null`  | `update:navigationWidth` | The rail's width in px after the reader drags its edge; `null` uses the natural width (`var(--container-2xs)`). Clamped by `Sidebar` between `var(--container-3xs)` and `var(--container-sm)`. |

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
| `aside`             | —                   | Content under the outline in the end rail (a `DocCallToAction`).      |
| `footer`            | —                   | The footer under the article (`Footer variant="content"`).            |
| `search`            | `{ query: string }` | Extra `Command.Group`s listed before the navigation pages.            |

## States

- Visual states: `default`; from `lg` the rail is `expanded` or `collapsed` (`Sidebar` `data-collapsed`, the edge affordance shown) and `resizing` while dragged; below `lg` the rail is a drawer (`open` / `closed`) opened from the header; the end rail shows from `xl` when the page registered at least one heading (the `aside` slot renders under the outline, never on its own); the palette `open` / `closed`.
- Outline: built from the headings the page registers, in document order, updated as a page mounts, changes or leaves (a route change swaps the entries); no heading registers on the server, so the server render and the first client render carry no outline rail and it appears once the page mounts. The entry of the heading nearest the top of the viewport (under the header) carries `aria-current="location"`; choosing an entry or a heading anchor scrolls the heading under the header and updates the address hash.
- Not applicable: `loading`, `empty`, `error`, `disabled`, `readonly`, `invalid` (the article owns its states).

## Motion & Animations

| Trigger                       | Animation / Transition                | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback                       |
| ----------------------------- | ------------------------------------- | ------------------------------------------------- | --------------------------------------------- |
| rail collapse, expand, resize | `Sidebar` rail width and panel slide  | component                                         | handled by `Sidebar`                          |
| outline jump                  | smooth window scroll                  | browser                                           | instant scroll under `prefers-reduced-motion` |
| brand hover                   | `transition-opacity` on the mark link | `duration-fast-02` · `ease-productive-entrance`   | `motion-reduce:transition-none`               |
| drawer, palette               | `Drawer`, `Command`                   | component                                         | handled by those components                   |

## Tokens

| Region             | Token (DESIGN.md)                                                                                              |
| ------------------ | -------------------------------------------------------------------------------------------------------------- |
| canvas             | `var(--bg-canvas)`, `var(--text-default)`                                                                      |
| sticky rail offset | `var(--layout-header-height)`                                                                                  |
| rail widths        | `var(--container-2xs)` (navigation, natural width through `--sidebar-width`), `var(--container-3xs)` (outline) |
| rail rules         | `var(--border-default)`                                                                                        |
| badge              | `.text-overline-sm`, `var(--text-muted)`, `var(--border-muted)`                                                |
| end rail padding   | `var(--spacing-md)`, `var(--spacing-lg)`                                                                       |
| gaps               | `var(--spacing-xs)`, `var(--spacing-lg)`                                                                       |
| ring               | `var(--ring-color)`, offset `var(--bg-canvas)`                                                                 |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Landmarks: the header is `AppHeader` (`<header>` named by the catalog `Documentation sections` on its section links); the rail is the `Sidebar` `<nav>` named by `ariaLabel`; the article is inside the single `<main>`; the end rail is an `<aside>` holding the `DocOnThisPage` navigation landmarks. A page must not render a second `<main>`.
- Keyboard map: `Tab` runs header → rail → article → end rail → footer; the rail's resize handle is a focusable `separator` (`Resize navigation`) moved with `ArrowLeft` / `ArrowRight`, its collapse button (`Collapse navigation`) folds the rail and the edge affordance's button (`Expand navigation`) brings it back, all owned by `Sidebar`; `⌘K` / `Ctrl K` opens the palette (`Command`); the compact menu button opens the drawer, `Escape` closes it and returns focus. Choosing an outline entry moves focus to its heading (made focusable with `tabindex="-1"`).
- Names: the mark link (`Azion Docs home`), the compact menu button (`Open documentation navigation`) and the search (`Search docs`) come from the locale catalog.
- Visible focus: composed controls own their rings; the mark link uses `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.

## Internationalization

| Key                            | English source                  | Override prop |
| ------------------------------ | ------------------------------- | ------------- |
| `docLayout.navigation`         | `Documentation`                 | `ariaLabel`   |
| `docLayout.sections`           | `Documentation sections`        | —             |
| `docLayout.home`               | `Azion Docs home`               | —             |
| `docLayout.badge`              | `Docs`                          | —             |
| `docLayout.openNavigation`     | `Open documentation navigation` | —             |
| `docLayout.search`             | `Search docs`                   | —             |
| `docLayout.noMatch`            | `No page matches your search.`  | —             |
| `docLayout.pages`              | `Pages`                         | —             |
| `docLayout.root`               | `Docs`                          | `rootLabel`   |
| `docLayout.collapseNavigation` | `Collapse navigation`           | —             |
| `docLayout.expandNavigation`   | `Expand navigation`             | —             |
| `docLayout.resizeNavigation`   | `Resize navigation`             | —             |

- Formatting: none. Navigation and outline text is consumer data.

## Right-to-left

- Layout: logical utilities only; the navigation rail sits at the inline start, the outline at the inline end, and the drawer opens from the inline start.
- Resize: dragging and the arrow keys follow the inline direction (`Sidebar` mirrors them under `dir="rtl"`); the collapse and expand glyphs mirror.
- Icons: the mark is not mirrored; `SidebarMenu` and `DocOnThisPage` mirror their own glyphs.
- Keyboard: arrow handling is `SidebarMenu`'s and `Command`'s, both direction-aware.
- User data: labels render with `dir="auto"` inside `SidebarMenu`, `DocOnThisPage` and `Command`.

## Responsive

- Breakpoints (viewport, because the layout is the page): the navigation rail shows from `lg`, resizable and collapsible, and is a drawer below (no resize or collapse there); the outline rail shows from `xl`; the section links show from `lg`. The header is an `@container`, so `SearchTrigger collapsible` folds to the magnifier on a narrow header.
- Narrow: the article takes the full width; the end rail content (`aside`) is not repeated under the article.
- Touch: menu button and search are 32 px controls, 44 px on coarse pointers through their components.
- Reflow: no horizontal scroll at 320 px; the document scrolls, never an inner region.

## Performance

- Bundle budget: 65 KB gzip for `./doc-layout` in `.size-limit.json` (63.6 KB measured; it pulls `AppHeader`, `NavigationMenu`, `Sidebar`, `SidebarMenu`, `Drawer`, `DocOnThisPage` and `Command`).
- Runtime budget: the rail's pointer listeners exist only while dragging (owned by `Sidebar`); one passive `scroll` listener (throttled to one read per animation frame); heading registration is one entry per anchored heading, ordered by document position when the outline is read; one `popstate` listener without a router.
- Heavy parts: none beyond the composed components.

## Examples

- Default — the layout with a docs tree, section links, an article whose anchored headings fill and drive the outline, a call to action in the end rail and the footer.
- Persisted rail — `v-model:navigation-open` and `v-model:navigation-width` bound to local storage, so the rail keeps its size and collapsed state across reloads.

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
- Do not change `structure` after `status: draft`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

# Doc Layout

> The documentation chrome, composed once in the app: a sticky header (the Azion Docs mark, the section links, `SearchTrigger` and the app's actions), the navigation rail (`Sidebar` + `SidebarMenu`) on the inline start, resizable by dragging its edge and collapsible to a thin edge that brings it back, the article in the layout's `<main>`, the "On this page" rail (`DocOnThisPage`) on the inline end with its own slot below it, and the footer under the article. The **document** scrolls: the header and both rails are sticky, so a full-page capture shows the whole article, the browser's find and scroll restoration work, and the dark canvas is painted to the end. The outline follows the reading position, a jump clears the sticky header, and below `lg` the rail moves into a drawer opened from the header. The `Command` palette lists every navigation page. Doc pages are only their article, rendered through the default slot.

- Import: `import DocLayout from '@aziontech/webkit/doc-layout'`
- Category: docs · Surface: docs · Structure: monolithic
- API as JSON: [doc-layout.json](https://github.com/aziontech/webkit/blob/main/.specs/doc-layout.json)

## When to use

- Every documentation page (guide, reference, legal, changelog): put one `DocLayout` in the app's root (around `RouterView`) and render each page's article as its default slot.
- A docs site that needs the navigation rail, the outline and the search palette without hand-composing `AppHeader`, `Sidebar`, `SidebarMenu`, `DocOnThisPage`, `Drawer` and `Command`.

## Do

- Compose the layout once, in the app's root; each route renders only its article. Never put a header, a rail or an inner scroll area in a page.
- Give every navigation row an `id` and an `href` (an in-app path is followed with the router; never `to`); leave `activeId` empty so the current page follows the route.
- Pass the page's headings as `outline` (`{ id, text, depth }`) with the same ids the `DocHeading`s carry; the layout tracks which one is in view.
- Put the theme switch in `navigation-footer`, the GitHub and Console links in `actions`, a call to action (`DocCallToAction`) in `aside`, and the site footer (`Footer variant="content"`) in `footer`.
- The page renders no `<main>` and no `ScrollArea` around the article: the document scrolls.
- Bind `v-model:navigation-open` and `v-model:navigation-width` to state the app persists (local storage, a cookie) so the rail keeps the reader's size and collapsed state across pages and reloads; leave them unbound and the rail resets on each mount.
- A drill row (`type: 'drill'`) opens its level in place; the rail's Back then reads `Back to Docs` at the first level. Set `rootLabel` when the tree is not the whole docs (`Back to API reference`); never add a hand-made Back row to `navigation`.

## Don’t

- The signed-in console → `ConsoleLayout`. Marketing pages → `SiteLayout`.
- A docs landing page with no rail (the docs home) → render it with `DocHero` and the sections, without this layout, or pass an empty `navigation` and `outline`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- DocOnThisPage` — the outline rail; `outline` and `outlineGroups` are bound onto it.
- DocHeading` — headings whose anchor links the layout scrolls to, clearing the sticky header.
- DocPageHeader`, `DocProse`, `DocPagination` — the article parts rendered in the default slot.
- Sidebar`, `SidebarMenu` — the navigation rail; `navigation` is mapped onto `SidebarMenu` groups.
- SearchTrigger`, `Command` — the header search and the palette it opens.
- shell/docs` — the block that shows this layout with a sample docs tree.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `navigation` | `DocLayoutNavGroup[]` | `[]` | false | The docs tree: groups of rows, each `{ id, label, icon?, href?, tagValue?, disabled?, kind?, defaultOpen?, children? }`; an in-app `href` is followed with the router. |
| `activeId` | `string` | `''` | false | Id of the current row. Empty matches the current route against each row's `href`. |
| `sections` | `DocLayoutSection[]` | `[]` | false | The header's section links (`Reference`, `Guides`), each `{ label, href? }`; shown from `lg`. |
| `home` | `string` | `'/'` | false | Where the Azion Docs mark links. |
| `outline` | `DocOnThisPageItem[]` | `[]` | false | The article's headings for the "On this page" rail, each `{ id, text, depth }`; the rail is not rendered when empty and the `aside` slot is unused. |
| `outlineGroups` | `DocOnThisPageGroup[]` | `[]` | false | Complementary link groups under the outline (GitHub, Community). |
| `ariaLabel` | `string` | `''` | false | Accessible name of the navigation landmark. Empty uses the locale catalog (`Documentation`). |
| `rootLabel` | `string` | `''` | false | Names the top of the docs tree in the rail's Back button on the first drill level (`Back to Docs`); deeper levels name their parent row. Empty uses the locale catalog (`Docs`). |
| `searchOpen` | `boolean` | `false` | false | Two-way value (`v-model:searchOpen`). |
| `navigationOpen` | `boolean` | `true` | false | Two-way value (`v-model:navigationOpen`). |
| `navigationWidth` | `number \| null` | `null` | false | Two-way value (`v-model:navigationWidth`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `navigate` | `(event: MouseEvent \| KeyboardEvent, item: DocLayoutNavItem)` | Fired when a navigation row or a palette page is chosen; the layout then follows its `href` (an in-app path with the router). Event first. |
| `search-select` | `(event: MouseEvent \| KeyboardEvent, value: string \| number)` | Fired when a palette item from the `search` slot is chosen. Event first. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The article, rendered inside the layout's `<main>`. |
| `actions` | — | The header's end actions after the search (GitHub, Console). |
| `navigation-footer` | — | The foot of the navigation rail and of the drawer (the theme switch). |
| `aside` | — | Content under the outline in the end rail (a `DocCallToAction`). |
| `footer` | — | The footer under the article (`Footer variant="content"`). |
| `search` | { query: string } | Extra `Command.Group`s listed before the navigation pages. |

## v-model

| Model                      | Type             | Default | Emits                    | Notes                                                                                                                                                                                          |
| -------------------------- | ---------------- | ------- | ------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:search-open`      | `boolean`        | `false` | `update:searchOpen`      | Whether the search palette is open; the header search and ⌘K / Ctrl K set it.                                                                                                                  |
| `v-model:navigation-open`  | `boolean`        | `true`  | `update:navigationOpen`  | Whether the navigation rail is open from `lg`; `false` collapses it to the edge affordance that brings it back. No effect below `lg`, where the rail is a drawer.                              |
| `v-model:navigation-width` | `number \| null` | `null`  | `update:navigationWidth` | The rail's width in px after the reader drags its edge; `null` uses the natural width (`var(--container-2xs)`). Clamped by `Sidebar` between `var(--container-3xs)` and `var(--container-sm)`. |

## States

- Visual states: `default`; from `lg` the rail is `expanded` or `collapsed` (`Sidebar` `data-collapsed`, the edge affordance shown) and `resizing` while dragged; below `lg` the rail is a drawer (`open` / `closed`) opened from the header; the end rail shows from `xl` when `outline` or `aside` has content; the palette `open` / `closed`.
- Outline: the entry of the heading nearest the top of the viewport (under the header) carries `aria-current="location"`; choosing an entry or a heading anchor scrolls the heading under the header and updates the address hash.
- Not applicable: `loading`, `empty`, `error`, `disabled`, `readonly`, `invalid` (the article owns its states).

## Accessibility

- Landmarks: the header is `AppHeader` (`<header>` named by the catalog `Documentation sections` on its section links); the rail is the `Sidebar` `<nav>` named by `ariaLabel`; the article is inside the single `<main>`; the end rail is an `<aside>` holding the `DocOnThisPage` navigation landmarks. A page must not render a second `<main>`.
- Keyboard map: `Tab` runs header → rail → article → end rail → footer; the rail's resize handle is a focusable `separator` (`Resize navigation`) moved with `ArrowLeft` / `ArrowRight`, its collapse button (`Collapse navigation`) folds the rail and the edge affordance's button (`Expand navigation`) brings it back, all owned by `Sidebar`; `⌘K` / `Ctrl K` opens the palette (`Command`); the compact menu button opens the drawer, `Escape` closes it and returns focus. Choosing an outline entry moves focus to its heading (made focusable with `tabindex="-1"`).
- Names: the mark link (`Azion Docs home`), the compact menu button (`Open documentation navigation`) and the search (`Search docs`) come from the locale catalog.
- Visible focus: composed controls own their rings; the mark link uses `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.

## Right-to-left

- Layout: logical utilities only; the navigation rail sits at the inline start, the outline at the inline end, and the drawer opens from the inline start.
- Resize: dragging and the arrow keys follow the inline direction (`Sidebar` mirrors them under `dir="rtl"`); the collapse and expand glyphs mirror.
- Icons: the mark is not mirrored; `SidebarMenu` and `DocOnThisPage` mirror their own glyphs.
- Keyboard: arrow handling is `SidebarMenu`'s and `Command`'s, both direction-aware.
- User data: labels render with `dir="auto"` inside `SidebarMenu`, `DocOnThisPage` and `Command`.

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

## Responsive

- Breakpoints (viewport, because the layout is the page): the navigation rail shows from `lg`, resizable and collapsible, and is a drawer below (no resize or collapse there); the outline rail shows from `xl`; the section links show from `lg`. The header is an `@container`, so `SearchTrigger collapsible` folds to the magnifier on a narrow header.
- Narrow: the article takes the full width; the end rail content (`aside`) is not repeated under the article.
- Touch: menu button and search are 32 px controls, 44 px on coarse pointers through their components.
- Reflow: no horizontal scroll at 320 px; the document scrolls, never an inner region.

## Examples

### Default

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DocCallToAction from '@aziontech/webkit/doc-call-to-action'
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocLayout, { type DocLayoutNavGroup } from '@aziontech/webkit/doc-layout'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import ThemeSwitcher, { type ThemeSwitcherValue } from '@aziontech/webkit/theme-switcher'
  import { ref } from 'vue'

  const navigation: DocLayoutNavGroup[] = [
    {
      label: 'Fundamentals',
      items: [
        { id: 'overview', label: 'Overview', href: '/docs' },
        {
          id: 'get-started',
          label: 'Get started',
          defaultOpen: true,
          children: [
            { id: 'create-account', label: 'Create an account', href: '/docs/create-account' },
            { id: 'first-deploy', label: 'First deploy', href: '/docs/first-deploy' }
          ]
        }
      ]
    }
  ]

  const outline = [
    { id: 'before-you-start', text: 'Before you start', depth: 2 },
    { id: 'deploy-with-cli', text: 'Deploy with Azion CLI', depth: 2 },
    { id: 'next-steps', text: 'Next steps', depth: 2 }
  ]

  const theme = ref<ThemeSwitcherValue>('system')
</script>

<template>
  <DocLayout
    :navigation="navigation"
    :sections="[
      { label: 'Guides', href: '/docs' },
      { label: 'Reference', href: '/docs/reference' }
    ]"
    :outline="outline"
    active-id="first-deploy"
  >
    <template #actions>
      <Button
        label="Console"
        variant="secondary"
        size="medium"
        href="https://console.azion.com"
      />
    </template>

    <template #navigation-footer>
      <ThemeSwitcher
        v-model="theme"
        aria-label="Theme"
      />
    </template>

    <template #aside>
      <DocCallToAction
        title="Ready to build?"
        label="Deploy your first application for free."
        :primary-action="{ label: 'Start for free', href: 'https://console.azion.com/signup' }"
      />
    </template>

    <div class="layout-boundary">
      <div class="layout-column-content flex flex-col gap-(--spacing-lg)">
        <DocPageHeader
          title="First deploy"
          description="Deploy a template and see it served from the edge."
          :breadcrumbs="[
            { label: 'Get started', href: '/docs/get-started' },
            { label: 'First deploy' }
          ]"
        />
        <DocProse>
          <DocHeading
            anchor="before-you-start"
            :level="2"
            >Before you start</DocHeading
          >
          <p>You need an Azion account and a GitHub account.</p>
          <DocHeading
            anchor="deploy-with-cli"
            :level="2"
            >Deploy with Azion CLI</DocHeading
          >
          <p>Install the CLI, log in and run the deploy command from your project folder.</p>
          <DocHeading
            anchor="next-steps"
            :level="2"
            >Next steps</DocHeading
          >
          <p>Add a domain and turn on the cache for your static assets.</p>
        </DocProse>
      </div>
    </div>
  </DocLayout>
</template>
```

### Persisted rail

```vue
<script setup lang="ts">
  import DocHeading from '@aziontech/webkit/doc-heading'
  import DocLayout, { type DocLayoutNavGroup } from '@aziontech/webkit/doc-layout'
  import DocPageHeader from '@aziontech/webkit/doc-page-header'
  import DocProse from '@aziontech/webkit/doc-prose'
  import { onMounted, ref, watch } from 'vue'

  const STORAGE_KEY = 'acme-docs-rail'

  const navigation: DocLayoutNavGroup[] = [
    {
      label: 'Fundamentals',
      items: [
        { id: 'overview', label: 'Overview', href: '/docs' },
        { id: 'first-deploy', label: 'First deploy', href: '/docs/first-deploy' },
        { id: 'domains', label: 'Domains', href: '/docs/domains' }
      ]
    }
  ]

  const open = ref(true)
  const width = ref<number | null>(null)

  onMounted(() => {
    try {
      const saved = JSON.parse(globalThis.localStorage.getItem(STORAGE_KEY) ?? 'null')
      if (saved) {
        open.value = saved.open !== false
        width.value = typeof saved.width === 'number' ? saved.width : null
      }
    } catch {
      return
    }
  })

  watch([open, width], () => {
    try {
      globalThis.localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ open: open.value, width: width.value })
      )
    } catch {
      return
    }
  })
</script>

<template>
  <DocLayout
    v-model:navigation-open="open"
    v-model:navigation-width="width"
    :navigation="navigation"
    :outline="[{ id: 'resize-the-rail', text: 'Resize the rail', depth: 2 }]"
    active-id="first-deploy"
  >
    <div class="layout-boundary">
      <div class="layout-column-content flex flex-col gap-(--spacing-lg)">
        <DocPageHeader
          title="First deploy"
          description="Drag the rail's edge or collapse it; reload and it keeps its size."
        />
        <DocProse>
          <DocHeading
            anchor="resize-the-rail"
            :level="2"
            >Resize the rail</DocHeading
          >
          <p>
            Drag the edge of the navigation, or focus it and use the arrow keys. Collapse it from
            the button at its foot and bring it back from the edge.
          </p>
        </DocProse>
      </div>
    </div>
  </DocLayout>
</template>
```

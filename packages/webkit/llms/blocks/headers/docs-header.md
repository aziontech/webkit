# DocsHeader (`headers/docs-header`)

> The documentation bar: a `GlobalHeader` in its default `content` placement, so it runs full bleed across the window and opens on the page boundary. Start: the navigation trigger below `lg`, the brand with the Docs tag, and the section links from `lg`. End: search, GitHub, then Console. Search leads the end cluster in every channel, so it sits at the start of the buttons wherever the reader is. The sample widens the search into a field carrying the ⌘K shortcut once the bar is wide enough; the control is an icon button below that, and an icon button here. Built from `GlobalHeader`, `NavigationMenu`, `IconButton`, `Button` and `Brand`.

- Surface: docs
- Source: `blocks/headers/docs-header/docs-header.vue` in `@aziontech/webkit`
- MCP: `get_pattern("headers/docs-header")`
- Components: [Brand](../../components/brand.md), [Button](../../components/button.md), [GlobalHeader](../../components/global-header.md), [IconButton](../../components/icon-button.md), [NavigationMenu](../../components/navigation-menu.md)
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

docs header; documentation header; docs top bar; documentation navbar; docs navigation bar; header with search and github; cabeçalho da documentação; barra da documentação; menu da documentação

The top bar of the documentation site. A reader arrives from search or from the console, mid-task, and needs three things: find another page (search, the section links), know which product's docs they are in (the brand with the Docs tag), and get back to building (Console). It runs full bleed across the window and opens on the page boundary, like the documentation shell under it.

## When to use

- On every documentation page, inside `shells/documentation`.
- On a docs-like reference site (API reference, changelog) that shares the documentation navigation.

## When not to use

- Marketing pages: use `headers/site-header`.
- Console pages: use `headers/resource-header`; focused flows use `headers/creation-header`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

Default `content` placement, `aria-label="Azion documentation"`. Start cluster in `GlobalHeader.Left`, an empty `GlobalHeader.Nav`, the actions in `GlobalHeader.Right`.

### B. Navigation trigger and end actions — `IconButton` (required)

Below `lg`, an outlined `pi-bars` icon button opens the documentation navigation (the rail leaves at that width). In the end cluster, Search leads, then GitHub (`href` with `target="_blank"`). Search can widen into a field with the ⌘K shortcut once the bar is wide enough; below that it stays an icon button.

### C. Brand — `Brand` (required)

Inside `GlobalHeader.Brand`, followed by a small `Docs` overline tag, both in one link to the docs home with `aria-label="Azion Docs home"`.

### D. Section links — `NavigationMenu` (required from lg)

The top-level sections (`Reference`, `Guides`, `Dev tools`) as `NavigationMenu.Trigger` links, with the popup (`Portal`, `Positioner` bottom-start, `Popup`, `Arrow`, `Viewport`) for sections that open a panel. Hidden below `lg`, where the trigger in B opens the same sections.

### E. Console — `Button` (required)

`kind="secondary"`, medium, last in the bar: the way back to the product.

## Do

- Keep Search first in the end cluster in every channel (docs, site, console), so it is always in the same place.
- Keep three to five section links; the per-product pages belong in the shell's sidebar.

## Don't

- Don't add Sign up or Start for free: the reader of docs is already a user or is evaluating; Console covers both.
- Don't duplicate the sidebar's page list in the menu.

## Copy

- **Section links:** nouns, sentence case, no verbs: `Reference`, `Guides`, `Dev tools`.
- **Icon button labels:** say the target: `Search documentation`, `Azion on GitHub`, `Open documentation navigation`.
- **Console:** the product name alone: `Console`.

## Accessibility

- Every icon-only button has an `aria-label`; the GitHub link opens a new tab and should say so in its label or with an external-link affordance if your product requires it.
- `NavigationMenu` carries `aria-label="Documentation sections"` so it is distinguishable from the sidebar navigation.
- At 320 px only the trigger, brand and end icons remain; nothing scrolls horizontally.

## States

- Default: the only state; the section links show from `lg`, the trigger below it.

## Related

- `shells/documentation` — the shell this bar heads.
- `headers/site-header` — the marketing counterpart, same anatomy with `kind="site"`.
- `headers/resource-header` — the console counterpart.

## Variants

- `Default` — primary (the code below)

Each variant is the same screen in another state: `get_pattern("headers/docs-header", { variant })`, or the file under `blocks/headers/docs-header/variants/`.

## Code (`Default`)

```vue
<script setup>
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import NavigationMenu from '@aziontech/webkit/navigation-menu'

  const sections = ['Reference', 'Guides', 'Dev tools']
</script>

<template>
  <div class="w-full bg-(--bg-canvas)">
    <GlobalHeader aria-label="Azion documentation">
      <GlobalHeader.Left>
        <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
          <div class="shrink-0 lg:hidden">
            <IconButton
              icon="pi pi-bars"
              kind="outlined"
              size="medium"
              aria-label="Open documentation navigation"
            />
          </div>
          <GlobalHeader.Brand>
            <a
              href="#"
              aria-label="Azion Docs home"
              class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) gap-(--spacing-xs)"
            >
              <Brand
                kind="default"
                size="small"
              />
              <span
                class="rounded-(--shape-elements) border border-(--border-muted) px-(--spacing-xxs) text-overline-sm text-(--text-muted)"
              >
                Docs
              </span>
            </a>
          </GlobalHeader.Brand>
          <div class="shrink-0 ms-(--spacing-xs) hidden lg:flex">
            <NavigationMenu aria-label="Documentation sections">
              <NavigationMenu.List>
                <NavigationMenu.Item
                  v-for="section in sections"
                  :key="section"
                >
                  <NavigationMenu.Trigger href="#">{{ section }}</NavigationMenu.Trigger>
                </NavigationMenu.Item>
              </NavigationMenu.List>
              <NavigationMenu.Portal>
                <NavigationMenu.Positioner
                  side="bottom"
                  align="start"
                  :side-offset="12"
                >
                  <NavigationMenu.Popup>
                    <NavigationMenu.Arrow />
                    <NavigationMenu.Viewport />
                  </NavigationMenu.Popup>
                </NavigationMenu.Positioner>
              </NavigationMenu.Portal>
            </NavigationMenu>
          </div>
        </div>
      </GlobalHeader.Left>
      <GlobalHeader.Nav />
      <GlobalHeader.Right>
        <IconButton
          icon="pi pi-search"
          kind="outlined"
          size="medium"
          aria-label="Search documentation"
          class="shrink-0"
        />
        <IconButton
          icon="pi pi-github"
          kind="outlined"
          size="medium"
          aria-label="Azion on GitHub"
          href="https://github.com/aziontech"
          target="_blank"
          class="shrink-0"
        />
        <Button
          label="Console"
          kind="secondary"
          size="medium"
          class="shrink-0"
          href="#"
        />
      </GlobalHeader.Right>
    </GlobalHeader>
  </div>
</template>
```

# ResourceHeader (`headers/resource-header`)

> The console bar for every page inside the persistent shell, at its first and second level of resource. A `GlobalHeader` in its default `content` placement, sitting in the content zone beside the navigation rail. Start: the navigation trigger below `md`, the brand, and the breadcrumb on every level from `md`. End: search first, then Create, the Agent button and the account avatar. The first level carries one unlinked crumb, the module; the second level names the module and the resource. Below `md` the sample collapses Create and Agent into icon buttons, and from a bar width of `--container-2xl` the `SearchTrigger` widens into the field with its ⌘K / Ctrl K keycap. Both thresholds are read from the theme tokens. Built from `GlobalHeader`, `Breadcrumb`, `IconButton`, `Tooltip`, `SearchTrigger`, `Button`, `ButtonHighlight`, `Avatar` and `Brand`.

- Surface: product
- Source: `blocks/headers/resource-header/resource-header.vue` in `@aziontech/webkit`
- MCP: `get_pattern("headers/resource-header")`
- Components: [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [ButtonHighlight](../../components/button-highlight.md), [GlobalHeader](../../components/global-header.md), [IconButton](../../components/icon-button.md), [SearchTrigger](../../components/search-trigger.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

console header; app header; resource header; header with breadcrumb; header with search and avatar; platform top bar; signed-in header; cabeçalho do console; cabeçalho da plataforma; barra superior do app

The top bar of every page inside the persistent console shell. It sits in the content zone beside the navigation rail and carries what the user needs on any browse page: where they are (a single unlinked crumb at the first level, the module and the resource from the second), search, the two ways to start something (Create and the Agent), and their account. It is the header that `shells/console` renders.

## When to use

- First-level pages the rail routes to (lists, Home, dashboards, settings hubs).
- Second-level pages of a resource (details, versions, a resource's settings).

## When not to use

- Create, edit and deploy flows: use `headers/creation-header`, which drops the rail and these actions.
- Signed-out screens: use `headers/auth-header`. Docs and marketing: `headers/docs-header`, `headers/site-header`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

Default `content` placement, `aria-label="Azion Console"`, in the content zone, never above the rail. Start cluster in `GlobalHeader.Left`, empty `GlobalHeader.Middle`, actions in `GlobalHeader.Right`.

### B. Navigation trigger — `IconButton` (required)

Below `md` an outlined `pi-bars` icon button opens the rail as a drawer. In the end cluster, `SearchTrigger` comes first. Below `md`, Create and Agent also collapse into icon buttons.

### C. Brand — `Brand` (required)

Linked to the home route with `aria-label="Azion home"`, before the breadcrumb.

### D. Create — `Button` (required)

`kind="primary"`, medium, `pi-plus-circle`: opens the Creation Center. One primary action in the bar.

### E. Agent — `ButtonHighlight` (required)

The AI assistant entry, medium, `ai-ask-azion` icon. It is the only highlight button on the page.

### F. Account — `Avatar` (required)

Inside a button labelled `Account settings`, always last.

### G. Location — `Breadcrumb` (required)

Shows from `md`, on every level. First level: one crumb, the module, with no link (`Applications`). Second level: the module with an `href`, then the resource's own name with no link. A tab is never a crumb.

### H. Search — `SearchTrigger` (required)

The header search, first in the end cluster: the field (`Search` with the ⌘K / Ctrl K keycap) while the bar is at least `--container-2xl` wide, the magnifier alone below that (`collapsible`, inside the header's `@container`). It emits `open` on click and on the shortcut and opens the `Command` palette. Never hand-rolled (rule `webkit-header-search`).

### I. Hints — `Tooltip` (required)

Names every icon-only control: the navigation trigger, and Create and Agent below `md`.

## Do

- Use the resource's name as the last crumb (`webkit-sample-vue`), not the page type.
- Keep the order of the end cluster: Search, Create, Agent, avatar.
- Read every breakpoint and width from tokens so the bar answers to the theme.

## Don't

- Don't render a second header in the content, or a `PageHeader` that repeats the last crumb.
- Don't add page-level actions here; they go in the page's controls row or tab row.
- Don't link the last crumb.

## Copy

- **Create:** the verb alone: `Create`. **Agent:** `Agent`.
- **Breadcrumb:** the module as the rail names it (`Applications`), then the resource name as the user typed it.
- **Icon labels:** `Search`, `Open navigation`, `Account settings`.

## Accessibility

- The ⌘K shortcut is announced with `aria-keyshortcuts="Meta+K"` on the search control.
- Icon-only states of Create and Agent keep their names as `aria-label` and a tooltip.
- One `GlobalHeader` landmark per page, labelled.

## States

- FirstLevel: a module page the rail routes to; one unlinked crumb names the module (`Applications`).
- SecondLevel: a resource inside a module; the breadcrumb names the module and the resource from `md`, last crumb unlinked.

## Related

- `shells/console` — the shell that renders this bar with the rail.
- `headers/creation-header` — the bar for focused flows.
- `platform/detail/details-page`, `platform/view/table-view` — the second- and first-level pages under it.

## Variants

- `FirstLevel` — primary (the code below)
- `SecondLevel` — A resource inside a module. The breadcrumb names the module and the resource, and shows from `md`; the last crumb is the current page and carries no link.

Each variant is the same screen in another state: `get_pattern("headers/resource-header", { variant })`, or the file under `blocks/headers/resource-header/variants/`.

## Code (`FirstLevel`)

```vue
<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Tooltip from '@aziontech/webkit/tooltip'

  const crumbs = [{ label: 'Applications' }]
</script>

<template>
  <div class="@container w-full bg-(--bg-canvas)">
    <GlobalHeader aria-label="Azion Console">
      <GlobalHeader.Left>
        <div class="flex min-w-0 items-center justify-start gap-(--spacing-xs)">
          <span class="contents md:hidden">
            <Tooltip
              text="Open navigation"
              placement="bottom"
            >
              <IconButton
                icon="pi pi-bars"
                kind="outlined"
                size="medium"
                aria-label="Open navigation"
              />
            </Tooltip>
          </span>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex w-fit items-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 motion-reduce:transition-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) h-6 shrink-0 px-(--spacing-xxs)"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
          <div class="-ms-(--spacing-xs) hidden w-fit min-w-0 shrink md:flex">
            <Breadcrumb
              :items="crumbs"
              class="w-full"
            />
          </div>
        </div>
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <SearchTrigger collapsible />
        <span class="contents md:hidden">
          <Tooltip
            text="Create"
            placement="bottom"
          >
            <IconButton
              icon="pi pi-plus-circle"
              kind="primary"
              size="medium"
              aria-label="Create"
            />
          </Tooltip>
          <Tooltip
            text="Agent"
            placement="bottom"
          >
            <IconButton
              icon="ai ai-ask-azion"
              kind="outlined"
              size="medium"
              aria-label="Agent"
            />
          </Tooltip>
        </span>
        <span class="hidden md:contents">
          <Button
            label="Create"
            kind="primary"
            size="medium"
            icon="pi pi-plus-circle"
          />
          <ButtonHighlight
            label="Agent"
            size="medium"
            icon="ai ai-ask-azion"
          />
        </span>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>
  </div>
</template>
```

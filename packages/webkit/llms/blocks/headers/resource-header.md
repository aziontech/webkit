# ResourceHeader (`headers/resource-header`)

> The console bar on its own, at its first and second level of resource, for apps that do not run on the console layout (inside `shells/console` the layout renders this bar). A `GlobalHeader` in its default `content` placement, sitting in the content zone beside the navigation rail. Start: the navigation trigger below `md`, the brand, and from the second level the breadcrumb from `md`. End: search first (it opens a `Command` palette), then Create, the Agent button and the account avatar (it opens the account `DropdownMenu`). The first level has no breadcrumb (the rail's active row names the module); the second level names the module and the resource. Below `md` the sample collapses Create and Agent into icon buttons, and from a bar width of `--container-2xl` the `SearchTrigger` widens into the field with its ⌘K / Ctrl K keycap. Both thresholds are read from the theme tokens. Built from `GlobalHeader`, `Breadcrumb` (second level), `IconButton`, `Tooltip`, `SearchTrigger`, `Button`, `ButtonHighlight`, `Avatar`, `DropdownMenu`, `Command` and `Brand`.

- Surface: product
- Source: `blocks/headers/resource-header/resource-header.vue` in `@aziontech/webkit`
- MCP: `get_pattern("headers/resource-header")`
- Components: [Avatar](../../components/avatar.md), [Brand](../../components/brand.md), [Breadcrumb](../../components/breadcrumb.md), [Button](../../components/button.md), [ButtonHighlight](../../components/button-highlight.md), [Command](../../components/command.md), [DropdownMenu](../../components/dropdown-menu.md), [GlobalHeader](../../components/global-header.md), [IconButton](../../components/icon-button.md), [SearchTrigger](../../components/search-trigger.md), [Tooltip](../../components/tooltip.md)
- Skills: `webkit-navigation`, `webkit-layout`

## Asked as

console header; app header; resource header; header with breadcrumb; header with search and avatar; platform top bar; signed-in header; cabeçalho do console; cabeçalho da plataforma; barra superior do app

The top bar of every page inside the persistent console shell. It sits in the content zone beside the navigation rail and carries what the user needs on any browse page: where they are (no breadcrumb at the first level, where the rail's active row already says it; the module and the resource from the second), search, the two ways to start something (Create and the Agent), and their account. It is the `ConsoleLayout` header on its own: `shells/console` renders the same bar through `ConsoleLayout`, so inside that shell use the layout and never this block. Copy this block only for an app that does not run on `ConsoleLayout`, or as a reference for the bar.

## When to use

- An app that does not use `ConsoleLayout` and needs the console bar on its own.
- First-level pages the rail routes to (lists, Home, dashboards, settings hubs).
- Second-level pages of a resource (details, versions, a resource's settings).

## When not to use

- Inside `shells/console`: `ConsoleLayout` already renders this bar, its search palette and its account menu; a second bar in the page is a bug.
- Create, edit and deploy flows: use `headers/creation-header`, which drops the rail and these actions.
- Signed-out screens: use `headers/auth-header`. Docs and marketing: `headers/docs-header`, `headers/site-header`.

## Building blocks

### A. Bar — `GlobalHeader` (required)

Default `content` placement, `aria-label="Console"` (the label every console bar uses), in the content zone, never above the rail. Start cluster in `GlobalHeader.Left`, empty `GlobalHeader.Middle`, actions in `GlobalHeader.Right`.

### B. Navigation trigger — `IconButton` (required)

Below `md` an outlined `pi-bars` icon button opens the rail as a drawer. In the end cluster, `SearchTrigger` comes first. Below `md`, Create and Agent also collapse into icon buttons.

### C. Brand — `Brand` (required)

Inside `GlobalHeader.Brand`, linked to the home route with `aria-label="Azion home"`. At the first level nothing follows it: the rail's active row names the module and the page opens on its own `PageHeader`, so the bar carries no breadcrumb, never a single crumb. From the second level (`SecondLevel`) a `Breadcrumb` follows it from `md`: the module with an `href`, then the resource's own name with no link. A tab is never a crumb.

### D. Create — `Button` (required)

`kind="primary"`, medium, `pi-plus-circle`: opens the Creation Center. One primary action in the bar.

### E. Agent — `ButtonHighlight` (required)

The AI assistant entry, medium, `ai-ask-azion` icon. It is the only highlight button on the page.

### F. Account — `DropdownMenu` + `Avatar` (required)

The avatar sits in a button labelled `Account menu` inside `DropdownMenu.Trigger`, always last. The menu opens the same groups as the `ConsoleLayout` account menu: the person's name and email on top, Account settings and Personal tokens, then Docs and Log out.

### G. Search — `SearchTrigger` (required)

The header search, first in the end cluster: the field (`Search` with the ⌘K / Ctrl K keycap) while the bar is at least `--container-2xl` wide, the magnifier alone below that (`collapsible`, inside the header's `@container`). It emits `open` on click and on the shortcut; the block binds `@open` to a `Command` palette (`v-model:open`) listing the pages. Never hand-rolled (rule `webkit-header-search`).

### H. Hints — `Tooltip` (required)

Names every icon-only control: the navigation trigger, and Create and Agent below `md`.

### I. Search palette — `Command` (required)

Opened by the search trigger with `v-model:open`: an input, a `Pages` group and an empty message (`No page matches your search.`).

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
- **Icon labels:** `Search`, `Open navigation`, `Account menu`.

## Accessibility

- The ⌘K shortcut is announced with `aria-keyshortcuts="Meta+K"` on the search control.
- Icon-only states of Create and Agent keep their names as `aria-label` and a tooltip.
- One `GlobalHeader` landmark per page, labelled.

## States

- FirstLevel: a module page the rail routes to; no breadcrumb (the rail's active row names the module).
- SecondLevel: a resource inside a module; the breadcrumb names the module and the resource from `md`, last crumb unlinked.

## Related

- `shells/console` — the shell whose `ConsoleLayout` renders this bar with the rail; use it instead of this block when you can.
- `headers/creation-header` — the bar for focused flows.
- `platform/detail/details-page`, `platform/view/table-view` — the second- and first-level pages under it.

## Variants

- `FirstLevel` — primary (the code below)
- `SecondLevel` — A resource inside a module. The breadcrumb names the module and the resource, and shows from `md`; the last crumb is the current page and carries no link.

Each variant is the same screen in another state: `get_pattern("headers/resource-header", { variant })`, or the file under `blocks/headers/resource-header/variants/`.

## Code (`FirstLevel`)

```vue
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Command from '@aziontech/webkit/command'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const account = { name: 'Amy Chen', email: 'amy.chen@example.com' }
  const searchPages = ['Home', 'Applications', 'Functions', 'Firewall', 'Settings']
  const searchOpen = ref(false)
</script>

<template>
  <div class="@container w-full bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
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
          <GlobalHeader.Brand>
            <a
              href="/home"
              aria-label="Azion home"
              class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            >
              <Brand
                kind="default"
                size="small"
              />
            </a>
          </GlobalHeader.Brand>
        </div>
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <SearchTrigger
          collapsible
          @open="searchOpen = true"
        />
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
        <DropdownMenu placement="bottom-end">
          <DropdownMenu.Trigger>
            <button
              type="button"
              aria-label="Account menu"
              class="rounded-(--shape-button) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
            >
              <Avatar
                :label="account.name"
                size="medium"
                kind="square"
              />
            </button>
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <template #top>
              <div class="flex min-w-0 flex-col">
                <span class="truncate text-label-md text-(--text-default)">{{ account.name }}</span>
                <span class="truncate text-body-xs text-(--text-muted)">{{ account.email }}</span>
              </div>
            </template>
            <DropdownMenu.Option
              value="settings"
              label="Account settings"
            >
              <template #right>
                <i
                  class="pi pi-cog"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Option>
            <DropdownMenu.Option
              value="personal-tokens"
              label="Personal tokens"
            >
              <template #right>
                <i
                  class="pi pi-key"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Option>
          </DropdownMenu.Group>
          <DropdownMenu.Group>
            <DropdownMenu.Option
              value="docs"
              label="Docs"
            >
              <template #right>
                <i
                  class="pi pi-book"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Option>
            <DropdownMenu.Option
              value="logout"
              label="Log out"
            >
              <template #right>
                <i
                  class="pi pi-sign-out"
                  aria-hidden="true"
                />
              </template>
            </DropdownMenu.Option>
          </DropdownMenu.Group>
        </DropdownMenu>
      </GlobalHeader.Right>
    </GlobalHeader>
    <Command v-model:open="searchOpen">
      <Command.Input placeholder="Search" />
      <Command.List>
        <Command.Empty>No page matches your search.</Command.Empty>
        <Command.Group heading="Pages">
          <Command.Item
            v-for="page in searchPages"
            :key="page"
            :value="page"
            >{{ page }}</Command.Item
          >
        </Command.Group>
      </Command.List>
    </Command>
  </div>
</template>
```

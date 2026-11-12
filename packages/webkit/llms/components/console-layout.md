# Console Layout

> The console chrome, composed once in the app: `AppLayout` with the navigation rail (`Sidebar` + `Menu`, the brand on top and the account at the foot), the global header (breadcrumbs, `SearchTrigger`, the app's own actions and the account avatar) and the `Command` search palette wired to the trigger and to ⌘K / Ctrl K. The navigation is data (`navigation`, each row with an `href` that is followed with the app's router when it is an in-app path), the active row follows the current route, and the page body is the default slot inside the layout's `<main>`. A page opens the palette with `useConsoleLayout().openSearch()`. Platform blocks are only page bodies rendered through this slot; they never carry the chrome themselves.

- Import: `import ConsoleLayout from '@aziontech/webkit/console-layout'`
- Category: layout · Surface: product · Structure: monolithic
- API as JSON: [console-layout.json](https://github.com/aziontech/webkit/blob/main/.specs/console-layout.json)

## When to use

- Every signed-in console page: put one `ConsoleLayout` in the app's root (around `RouterView`) and render each page block as its default slot.
- A product area that needs the console navigation, breadcrumbs, the ⌘K palette and the account menu without hand-composing `AppLayout`, `Sidebar`, `Menu`, `GlobalHeader`, `SearchTrigger` and `Command`.

## Do

- Compose the layout once, in the app's root, around `RouterView`; each route renders only its page body. Never copy the chrome into a page.
- Give every navigation row an `id` and an `href`: an in-app path (`/workloads`) is followed with the app's router when one is installed (a named route becomes a path through `router.resolve(...).href`), an external URL loads normally, and a row with no `href` is left to your `navigate` handler. Never `to`, `path` or `route` on a row (lint `webkit/menu-node-href`). Leave `activeId` empty so the active row follows the route; set it only for a page whose route matches no row.
- Pass the page's trail through `breadcrumbs` (derive it from the route meta); leave it empty on first-level pages.
- Put the app's own header actions (`Create`, `Agent`) in the `actions` slot and render them icon-only while `compact`.
- Put the account menu groups (`DropdownMenu.Group`) in the `account-menu` slot; the layout renders the avatar and the trigger.
- Put an account switcher in `header-start`, page-level flash messages in `notifications`, and help or the notifications list in `tools` (toggled from a bell in `actions` with `toggleTools`).
- Use the `breadcrumbs` slot only when a crumb is a control (an environment `Select`); otherwise pass the data prop.
- Bind `v-model:navigation-expanded` when the rail's state must survive a reload or be driven from elsewhere (a `Collapse sidebar` / `Expand sidebar` command in the `search` slot); persist it in the app. The rail's own collapse control and the edge affordance keep working either way.
- Open the palette from inside a page with `useConsoleLayout().openSearch()` (imported from `@aziontech/webkit/use-console-layout`); never mount a second `Command`.
- The page body renders no `<main>` of its own and no `AppLayout`: the layout owns the landmark. Frame the body with `layout-boundary` + `layout-column` for list and form pages, or flush (`PageTabs` first) for detail pages.

## Don’t

- A focused flow with no navigation rail (a creation wizard, sign-in) → render the page on its own or with the flow's own header.
- Public marketing pages → `SiteLayout`. Documentation → `DocLayout`.
- When the page needs the split panel → compose `AppLayout` directly; `ConsoleLayout` covers the navigation, header, notifications, tools and content regions.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- AppLayout` — the frame this layout fills; it owns the compact drawers and the scrolling content region.
- Sidebar`, `Menu` — the rail and the data-driven navigation tree (`navigation` is mapped onto `Menu` groups).
- SearchTrigger`, `Command` — the header search and the palette it opens; the palette lists every navigation page.
- Breadcrumb` — the header trail on wide layouts (`breadcrumbs`).
- shells/console` — the block that shows this layout with sample console navigation.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `navigation` | `ConsoleLayoutNavGroup[]` | `[]` | false | The navigation tree: groups of rows, each `{ id, label, icon?, href?, tagValue?, disabled?, kind?, children?, groups? }`; an in-app `href` is followed with the app's router. |
| `activeId` | `string` | `''` | false | Id of the current row. Empty matches the current route against each row's `href`. |
| `breadcrumbs` | `ConsoleLayoutCrumb[]` | `[]` | false | The trail shown in the header on wide layouts; each is `{ label, href? }` and the last one is the current page. |
| `home` | `string` | `'/'` | false | Where the brand mark links. |
| `account` | `ConsoleLayoutAccount` | `undefined` | false | The signed-in account, `{ name, email?, src? }`, shown at the foot of the rail and as the header avatar; nothing is rendered when absent. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the navigation landmark. Empty uses the locale catalog (`Main navigation`). |
| `searchPlaceholder` | `string` | `''` | false | Placeholder of the palette's input. Empty uses the locale catalog (`Search pages and commands`). |
| `toolsLabel` | `string` | `''` | false | Title of the tools region (help, notifications). Empty uses `AppLayout`'s catalog (`Help`). |
| `searchOpen` | `boolean` | `false` | false | Two-way value (`v-model:searchOpen`). |
| `toolsOpen` | `boolean` | `false` | false | Two-way value (`v-model:toolsOpen`). |
| `navigationExpanded` | `boolean` | `true` | false | Two-way value (`v-model:navigationExpanded`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `navigate` | `(event: MouseEvent \| KeyboardEvent, item: ConsoleLayoutNavItem)` | Fired when a navigation row or a palette page is chosen; the layout then follows its `href` (an in-app path with the app's router). A row without `href` is left to this handler. Event first. |
| `search-select` | `(event: MouseEvent \| KeyboardEvent, value: string \| number)` | Fired when a palette item from the `search` slot is chosen; `value` is that item's value. Event first. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The page body, rendered inside the layout's `<main>`. |
| `actions` | { compact: boolean, toggleTools: () => void } | The app's header actions, between the search trigger and the avatar; render them icon-only while `compact`; `toggleTools` opens and closes the tools region (a notifications bell). |
| `header-start` | { compact: boolean } | Content at the start of the header, before the breadcrumbs (an account or organization switcher). |
| `breadcrumbs` | — | A composed trail that replaces the one built from `breadcrumbs` (a last crumb that is an environment `Select`); hidden while compact. |
| `notifications` | — | Flash messages (`Alert`) above the page, kept in view while the page scrolls. |
| `tools` | — | The tools region's body (a `HelpPanel` or the notifications list), opened with `v-model:tools-open`. |
| `search` | { query: string } | Extra `Command.Group`s (recent resources, commands) listed before the navigation pages in the palette. |
| `account-menu` | — | DropdownMenu.Group`s of the account menu, opened from the account row in the rail and from the header avatar. |

## v-model

| Model                         | Type      | Default | Emits                       | Notes                                                                                                                                                                     |
| ----------------------------- | --------- | ------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:search-open`         | `boolean` | `false` | `update:searchOpen`         | Whether the search palette is open; the trigger, ⌘K / Ctrl K and `openSearch()` set it.                                                                                   |
| `v-model:tools-open`          | `boolean` | `false` | `update:toolsOpen`          | Whether the tools region (help or notifications) is open beside the content; a drawer while compact.                                                                      |
| `v-model:navigation-expanded` | `boolean` | `true`  | `update:navigationExpanded` | Whether the navigation rail is expanded on wide layouts; `false` collapses it (the Sidebar's collapsed rail). It has no effect while compact, where the rail is a drawer. |

## States

- Visual states: `default`, `compact` (from `AppLayout`: the rail becomes a drawer opened from the header, the breadcrumbs give way to the brand), the palette `open` / `closed`.
- `data-compact` and `data-navigation` come from `AppLayout` on the inner frame.
- Active navigation row: `Menu`'s `activeId`; a row inside a drill level opens that level, a row inside an inline row expands it.
- Not applicable: `loading`, `empty`, `error`, `disabled`, `readonly`, `invalid` (the page body owns its states).

## Accessibility

- Landmarks: the rail is the `Sidebar` `<nav>` named by `ariaLabel`; the header is `GlobalHeader` (`<header>`); the page body is inside the layout's single `<main>`. A page body must not render a second `<main>`.
- Keyboard map: `Tab` runs rail → header → page; `⌘K` / `Ctrl K` opens the palette (owned by `Command`); in the palette `ArrowUp` / `ArrowDown` move, `Enter` chooses, `Escape` closes and returns focus. The rail keyboard map is `Menu`'s; the compact drawer closes on `Escape` and returns focus to the hamburger (`AppLayout`).
- Names: the compact hamburger (`Open navigation`), the brand link (`Azion home`), the account trigger (`Account menu`) come from the locale catalog; the avatar carries the account name.
- Visible focus: every interactive part is a WebKit control with its own ring; the brand link and the avatar button use `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Choosing a row in the compact drawer closes it.

## Right-to-left

- Layout: logical utilities only; the rail sits at the inline start and `AppLayout` mirrors the drawer side.
- Icons: the breadcrumb separator and `Menu.Back` mirror through their own components; the brand and avatar are not mirrored.
- Keyboard: arrow handling is `Menu`'s and `Command`'s, both direction-aware.
- User data: labels render with `dir="auto"` inside `Menu`, `Breadcrumb` and `Command`.

## Internationalization

| Key                               | English source                            | Override prop       |
| --------------------------------- | ----------------------------------------- | ------------------- |
| `consoleLayout.navigation`        | `Main navigation`                         | `ariaLabel`         |
| `consoleLayout.home`              | `Azion home`                              | —                   |
| `consoleLayout.openNavigation`    | `Open navigation`                         | —                   |
| `consoleLayout.accountMenu`       | `Account menu`                            | —                   |
| `consoleLayout.searchPlaceholder` | `Search pages and commands`               | `searchPlaceholder` |
| `consoleLayout.searchEmpty`       | `No page or command matches your search.` | —                   |
| `consoleLayout.pages`             | `Pages`                                   | —                   |

- Formatting: none. Navigation, breadcrumb and account text is consumer data.

## Responsive

- Container queries: `AppLayout` measures its own width; below its `compactBelow` the rail is a drawer and the header shows the hamburger and the brand instead of the breadcrumbs. The header bar is an `@container`, so `SearchTrigger collapsible` folds to the magnifier on narrow headers.
- Narrow: the `actions` slot receives `compact` so the app renders icon-only actions; the breadcrumb truncates. Below the header's `@xs` (a 320 px phone) the header drops the brand mark and keeps the hamburger, so `header-start` and the actions fit; the brand stays in the navigation drawer.
- Touch: hamburger and avatar keep the 32 px controls of `IconButton` / `Avatar` and grow on coarse pointers through those components.
- Reflow: no horizontal scroll at 320 px; the page body scrolls inside `AppLayout`'s content region.

## Examples

### Default

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import Tooltip from '@aziontech/webkit/tooltip'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', href: '/workloads' }
      ]
    },
    {
      label: 'Build',
      items: [
        {
          id: 'applications',
          label: 'Applications',
          icon: 'ai ai-edge-application',
          href: '/applications'
        },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', href: '/functions' }
      ]
    },
    {
      label: 'Store',
      items: [
        {
          id: 'sql-database',
          label: 'SQL Database',
          icon: 'ai ai-edge-sql',
          href: '/sql-database',
          tagValue: 'Preview'
        }
      ]
    },
    {
      label: 'More',
      items: [
        {
          id: 'settings',
          label: 'Settings',
          icon: 'pi pi-cog',
          kind: 'drill',
          groups: [
            {
              label: 'Settings',
              items: [
                { id: 'settings-general', label: 'General', href: '/settings' },
                { id: 'settings-users', label: 'Users management', href: '/settings/users' }
              ]
            }
          ]
        }
      ]
    }
  ]
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    :breadcrumbs="[{ label: 'Workloads', href: '/workloads' }, { label: 'edge-shop' }]"
    :account="{ name: 'Ana Souza', email: 'ana.souza@example.com' }"
    active-id="workloads"
  >
    <template #actions="{ compact }">
      <Tooltip
        v-if="compact"
        text="Create"
        placement="bottom"
      >
        <IconButton
          icon="pi pi-plus-circle"
          kind="primary"
          size="medium"
          ariaLabel="Create"
        />
      </Tooltip>
      <template v-else>
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
      </template>
    </template>

    <template #search="{ query }">
      <Command.Group
        v-if="!query"
        heading="Recents"
      >
        <Command.Item value="recent:edge-shop">edge-shop</Command.Item>
        <Command.Item value="recent:auth-handler">auth-handler</Command.Item>
      </Command.Group>
    </template>

    <template #account-menu>
      <DropdownMenu.Group>
        <DropdownMenu.Option
          value="settings"
          label="Account settings"
        />
        <DropdownMenu.Option
          value="logout"
          label="Log out"
        />
      </DropdownMenu.Group>
    </template>

    <div class="layout-boundary">
      <div class="layout-column flex flex-col gap-(--layout-group-gap)">
        <PageHeader
          title="edge-shop"
          description="The workload that serves the storefront."
        />
        <EmptyState
          title="No deployments yet"
          description="Deploy the workload to see its history here."
        />
      </div>
    </div>
  </ConsoleLayout>
</template>
```

### PageOpensSearch

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout'
  import PageHeader from '@aziontech/webkit/page-header'
  import { useConsoleLayout } from '@aziontech/webkit/use-console-layout'
  import { defineComponent, h } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', href: '/workloads' },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', href: '/functions' }
      ]
    }
  ]

  const FindWorkload = defineComponent({
    name: 'FindWorkload',
    setup() {
      const { openSearch } = useConsoleLayout()
      return () =>
        h(Button, {
          label: 'Find a workload',
          icon: 'pi pi-search',
          kind: 'outlined',
          size: 'medium',
          onClick: openSearch
        })
    }
  })
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    active-id="workloads"
  >
    <div class="layout-boundary">
      <div class="layout-column flex flex-col gap-(--layout-group-gap)">
        <PageHeader
          title="Workloads"
          description="Open the same palette as the header search, from the page."
        >
          <template #actions>
            <FindWorkload />
          </template>
        </PageHeader>
      </div>
    </div>
  </ConsoleLayout>
</template>
```

### NavigationExpanded

```vue
<script setup lang="ts">
  import Command from '@aziontech/webkit/command'
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout'
  import PageHeader from '@aziontech/webkit/page-header'
  import { ref } from 'vue'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'overview', label: 'Overview', icon: 'ai ai-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', href: '/workloads' },
        { id: 'functions', label: 'Functions', icon: 'ai ai-edge-functions', href: '/functions' }
      ]
    }
  ]

  const navigationExpanded = ref(true)

  const onSearchSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'action:sidebar') navigationExpanded.value = !navigationExpanded.value
  }
</script>

<template>
  <ConsoleLayout
    v-model:navigation-expanded="navigationExpanded"
    :navigation="navigation"
    active-id="workloads"
    @search-select="onSearchSelect"
  >
    <template #search>
      <Command.Group heading="Actions">
        <Command.Item value="action:sidebar">
          <template #prefix>
            <i
              :class="navigationExpanded ? 'pi pi-angle-double-left' : 'pi pi-angle-double-right'"
              aria-hidden="true"
            />
          </template>
          {{ navigationExpanded ? 'Collapse sidebar' : 'Expand sidebar' }}
        </Command.Item>
      </Command.Group>
    </template>

    <div class="layout-boundary">
      <div class="layout-column">
        <PageHeader
          title="Workloads"
          description="Press ⌘K or Ctrl K and choose Collapse sidebar to fold the rail."
        />
      </div>
    </div>
  </ConsoleLayout>
</template>
```

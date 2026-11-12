---
name: webkit-navigation
description: Two navigation shells for UI on @aziontech/webkit — the persistent console shell is `ConsoleLayout` (@aziontech/webkit/console-layout), composed ONCE in App.vue around RouterView (navigation rail from `navigation` data with an href per row, header breadcrumbs, the ⌘K search palette, the account and its menu, the `actions` slot, `useConsoleLayout().openSearch()` from a page), and every browse page is only a body in its default slot with no `<main>` or chrome of its own; the focused creation shell (no rail, one GlobalHeader with back + brand + breadcrumb + avatar — the `headers/creation-header` block every platform/create block carries) heads create flows (`platform/create/*`: a new resource, an import, deploying a template) routed outside the layout; editing a resource and a resource's deploy progress are page bodies inside it. A page picks exactly ONE shell, renders exactly ONE GlobalHeader, and the signed-in user stays visible in both. Also fixes the page body inside the console: `layout-boundary` + a column class, a first-level list opening on its PageHeader (the create action, large) over one band of controls and a flush borderless Card table, tabbed detail pages opening flush on PageTabs with the primary button on the TAB ROW (medium), and the breadcrumb levels — no trail at first level, `module › resource name` at second level, never a tab.
status: active
last_updated: 2026-11-12
scope: general
enforced_by: [webkit-accessibility, webkit-prefer-over-custom, ui-verify]
---

# Skill: webkit-navigation

## Purpose

Every screen in a console lives in one of **two** navigation shells, and picking the wrong one — or
worse, blending them — is where a prototype stops feeling like one product. A browse page with no way
back to the rest of the console strands the user; a focused create flow that keeps the full sidebar
lets the user wander off mid-task and lose their work. This skill fixes which shell a page uses, how
each is composed on `@aziontech/webkit`, and the one invariant they share: **the signed-in user is
always visible.** It is the layout-shell companion to `webkit-form` (what goes _inside_ a focused
flow) and `webkit-ux-heuristics` (states + feedback).

## How to use

- `/webkit-navigation`
  Apply the shell rules below to any page or flow you build in this conversation.
- `/webkit-navigation <file>`
  Review the file against the rules and output, per gap:
  - the exact line / element (quoted),
  - which rule it breaks (1 short sentence),
  - the concrete fix, naming the shell or webkit primitive to use.

## When to invoke

- Starting a new page and deciding how it sits in the app (a hub page vs a create flow).
- The user asks "which header goes here", "should this have a sidebar", "how do I get back", "the user
  disappeared on the create screen".
- Reviewing a screen for whether it uses the right shell and shows exactly one header.

## How to find the components

Never guess an import path, and never copy one from another repo or sample app — files move. Resolve
every webkit primitive the same way:

- Ask the **webkit MCP** — `suggest_component` in plain words ("console layout", "breadcrumb", "page tabs").
- Or read **`node_modules/@aziontech/webkit/catalog.json`** — every key under `imports` is a real
  published subpath. If a subpath is not a key there, it does not exist.

**The persistent console shell is one webkit component:** `ConsoleLayout`
(`@aziontech/webkit/console-layout`), plus `useConsoleLayout` (`@aziontech/webkit/use-console-layout`)
for a page that opens its search palette. It already composes `AppLayout`, `Sidebar`, `Menu`,
`GlobalHeader`, `Breadcrumb`, `SearchTrigger` and `Command`, so you never assemble those into a shell
of your own. Start it from the `shells/console` block (`npx @aziontech/webkit add shells/console`, or
`get_pattern`): the block is the `App.vue`, with the real console navigation.

**The focused creation shell is a block, not a component:** `headers/creation-header`
(`npx @aziontech/webkit view headers/creation-header`), built from `global-header`, `icon-button`,
`brand`, `breadcrumb` and `avatar`. Every `platform/create/*` block already renders it above its own
`<main>`.

The page bodies use `page-header`, `page-tabs`, `tabs`, `card`, `table` — all resolved the same way.
For spacing / color / typography use the **@aziontech/theme tokens (the webkit MCP lists them)** and
the `layout-*` utilities (`/webkit-layout`) — never raw px.

## The two shells

A page picks **exactly one**. The choice is not stylistic — it follows from what the page is _for_.

|                      | **Persistent console shell**                                                                       | **Focused creation shell**                                                                                 |
| -------------------- | -------------------------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| What it is           | `ConsoleLayout`, composed **once** in `App.vue` around `RouterView`                                | The `headers/creation-header` bar: one `GlobalHeader` (back + brand + breadcrumb + avatar), no rail        |
| Use for              | Hubs, lists, dashboards, settings — anywhere the user _browses_ and moves laterally                | Create / import / deploy a template / wizard — a single task with a start and an end                       |
| Rail                 | **Yes** — the layout's navigation rail, built from your `navigation` data                          | **No** — removed so the task is the only focus                                                             |
| Header               | The layout's: `breadcrumbs`, `SearchTrigger` (⌘K palette), your `actions` slot, the account avatar | `GlobalHeader`: back button + Azion brand + breadcrumb + account avatar                                    |
| Way out              | Lateral — pick any other module from the rail or the ⌘K palette                                    | Linear — the **back** button (and breadcrumb) returns to where the flow started                            |
| Signed-in user       | The rail footer (account + `account-menu`) **and** the header avatar, both from `account`          | Header avatar (end of the bar)                                                                             |
| Where the page lives | In the layout's default slot: the page is **only its body** (no `<main>`, no chrome)               | A route rendered **outside** `ConsoleLayout`; the flow is a whole screen and owns its bar and its `<main>` |
| Typical pages        | dashboards, list / index pages, settings hubs, resource-detail pages                               | create / edit forms, multi-step wizards, deploy / publish flows (`platform/create/*`)                      |

### Shell 1 — persistent console: `ConsoleLayout`

For pages the user **browses**. The layout renders the navigation rail (brand on top, the grouped
console navigation, the account at its foot), one header (breadcrumbs, search, your actions, the
avatar), the ⌘K `Command` palette and the single `<main>`. Compose it **once**, in `App.vue`, around
`RouterView`; every route renders only its page body through the default slot.

```vue
<!-- App.vue — the console chrome, composed once. Focused create routes
     (meta.shell === 'focused') render outside it, with no rail. -->
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ConsoleLayout, { type ConsoleLayoutCrumb } from '@aziontech/webkit/console-layout'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'
  import { RouterView, useRoute } from 'vue-router'

  import { account, navigation } from './navigation'

  const route = useRoute()
  const focused = computed(() => route.meta.shell === 'focused')
  const breadcrumbs = computed(() => (route.meta.breadcrumbs ?? []) as ConsoleLayoutCrumb[])
</script>

<template>
  <RouterView v-if="focused" />
  <ConsoleLayout
    v-else
    :navigation="navigation"
    :breadcrumbs="breadcrumbs"
    :account="account"
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
          aria-label="Create"
        />
      </Tooltip>
      <Button
        v-else
        label="Create"
        kind="primary"
        size="medium"
        icon="pi pi-plus-circle"
      />
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

    <RouterView />
  </ConsoleLayout>
</template>
```

The navigation is **data**, kept in one file the rail and the palette both read:

```ts
// navigation.ts
import type { ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout'

export const navigation: ConsoleLayoutNavGroup[] = [
  { items: [{ id: 'home', label: 'Home', icon: 'ai ai-home', href: '/' }] },
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
            items: [{ id: 'settings-general', label: 'General', href: '/settings' }]
          }
        ]
      }
    ]
  }
]

export const account = { name: 'Ana Souza', email: 'ana.souza@example.com' }
```

A browse page then renders **only its body** — no shell import, no `<main>`, no header:

```vue
<!-- views/ApplicationsView.vue — a page body in ConsoleLayout's default slot -->
<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col">
      <PageHeader
        size="medium"
        title="Applications"
        description="Build, deploy, and manage your applications."
      />
      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <!-- the page's bands -->
      </section>
    </div>
  </div>
</template>
```

What each part of the layout takes:

- **`navigation`** — groups of rows `{ id, label, icon, href }`. An in-app `href` (`/workloads`) is
  followed with the app's router, a named route becomes one through `router.resolve(...).href`, an
  external URL loads normally. `kind: 'drill'` with `groups` opens a level in place (Settings);
  `tagValue` adds a badge (`Preview`). Never `to`, `path` or `route` on a row (lint
  `webkit/menu-node-href`). Leave `active-id` empty: the active row follows the route.
- **`breadcrumbs`** — the trail, `{ label, href? }[]`, derived from the route meta; empty on a
  first-level page (see "Breadcrumb" below). Hidden while compact. The `breadcrumbs` slot replaces it
  only when a crumb is a control (an environment `Select`).
- **`account`** + the **`account-menu`** slot — the signed-in user, `{ name, email?, src? }`, shown at
  the foot of the rail and as the header avatar; the slot holds the menu's `DropdownMenu.Group`s
  (identity, account settings, the theme, log out).
- **`actions`** slot — the app's own header actions (`Create`, `Agent`), icon-only with a `Tooltip`
  while its `compact` is true. Page actions never go here; they belong to the page's `PageHeader` or
  tab row.
- **`header-start`** (an account switcher), **`notifications`** (flash `Alert`s above the page) and
  **`tools`** (help or the notifications list, opened with `v-model:tools-open` or the `actions`
  slot's `toggleTools`).
- **`search`** slot + **`search-select`** — extra `Command.Group`s (recents, actions) listed before the
  navigation pages the palette already holds. A page opens the same palette with
  `useConsoleLayout().openSearch()`:

```ts
import { useConsoleLayout } from '@aziontech/webkit/use-console-layout'

const { openSearch } = useConsoleLayout()
```

- The rail is the way out — the user moves laterally to any other module. It is never removed on a
  browse page; it only collapses (below) or moves into a drawer when the layout is narrow.

#### Every browse header carries search (`SearchTrigger`, ⌘K / Ctrl K)

`ConsoleLayout`'s header already puts `SearchTrigger` first in its end cluster, wired to the ⌘K /
Ctrl K `Command` palette that lists every navigation page; it shows the field on a wide header and the
magnifier on a narrow one. Add what the palette should also offer through the `search` slot. Never add
a second `SearchTrigger`, a second `Command` or a ⌘K binding of your own. `SiteLayout` and `DocLayout`
carry the same search. The focused creation shell has no search: it stays on the task. Any header you
do compose yourself follows rule `webkit-header-search` (lint `webkit/header-search-trigger`).

#### The rail collapses; it never disappears

1. **Collapse.** The rail carries its own collapse control (and an edge affordance): collapsed, it is
   the `Sidebar`'s narrow rail of icons. Bind `v-model:navigation-expanded` when the state must survive
   a reload (persist it in the app) or be driven from elsewhere — a `Collapse sidebar` /
   `Expand sidebar` command in the `search` slot.
2. **Compact.** Below 768 px of the layout's own width the rail moves into a drawer opened from the
   header's menu button; choosing a row closes it, `Escape` closes it and returns focus. The header
   then shows the brand instead of the breadcrumbs.
3. **The user stays visible** in every state: the header avatar remains while the rail is collapsed
   or in the drawer.

- The breadcrumb and an in-page `PageHeader` are **different roles**: the crumb is top chrome that
  says _where you are_ once you are below a module; the `PageHeader` is the page's own title +
  description + actions.

### Shell 2 — focused creation: the `headers/creation-header` bar

For a **single task** — create a resource, import, deploy a template, a wizard step. Editing an existing resource and watching its deploy stay inside `ConsoleLayout` as page bodies. The rail is gone so nothing competes with
the form. The only chrome is one `GlobalHeader`: a **back** button, the Azion brand, the flow
breadcrumb and the account avatar.

There is no layout component for it today. It is the `headers/creation-header` block, and every
`platform/create/*` block (`single-page-create`, `multipage-create`, `source-wizard`,
`provision-wizard`, `create-hub`) already renders that bar above its own `<main>`. Route these flows
**outside** `ConsoleLayout` (`meta: { shell: 'focused' }` in the `App.vue` above), so the rail never
renders: a focused flow is a whole screen, the one kind of page that owns its header and its `<main>`.
Signed-out screens (`platform/auth`, headed by `headers/auth-header`) are routed outside the layout
the same way.

```ts
// router.ts — the flow's route opts out of the console layout
const routes = [
  { path: '/applications', component: ApplicationsView },
  {
    path: '/applications/new',
    component: CreateApplicationView,
    meta: { shell: 'focused' }
  }
]
```

When several flows share the bar, lift it once into your own shell, copied from the block
(`npx @aziontech/webkit add headers/creation-header`):

```vue
<!-- components/CreationShell.vue — the creation-header block, lifted once for
     every focused route. Not a webkit import. -->
<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'

  interface Props {
    /** The flow's trail: the module with an href, then the current page. */
    breadcrumb: { label: string; href?: string }[]
    /** Names where the back button goes, e.g. Back to Applications. */
    backLabel?: string
    /** A terminal screen (provisioning, success): no back button and no crumb. */
    terminal?: boolean
    /** The signed-in account, shown on the avatar. */
    account: string
  }

  withDefaults(defineProps<Props>(), { backLabel: '', terminal: false })
  const emit = defineEmits<{ back: [event: MouseEvent] }>()
  defineSlots<{ default(): unknown }>()
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          v-if="!terminal"
          icon="pi pi-chevron-left"
          :aria-label="backLabel"
          kind="outlined"
          size="small"
          @click="emit('back', $event)"
        />
        <GlobalHeader.Brand>
          <a
            href="/"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb
          v-if="!terminal"
          :items="breadcrumb"
        />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            :label="account"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

    <main class="flex min-h-0 flex-1 flex-col overflow-auto">
      <slot />
    </main>
  </div>
</template>
```

A create page uses **your** shell and wires the exit:

```vue
<script setup lang="ts">
  import CreationShell from '@/components/CreationShell.vue'
  import { useRouter } from 'vue-router'

  const router = useRouter()
  const cancel = () => router.push('/applications')
</script>

<template>
  <CreationShell
    :breadcrumb="[
      { label: 'Applications', href: '/applications' },
      { label: 'Create Application' }
    ]"
    back-label="Back to Applications"
    account="ana.souza@example.com"
    @back="cancel"
  >
    <!-- the focused task: the body of a platform/create/* block -->
  </CreationShell>
</template>
```

- The **back** button (and the breadcrumb links) are the _only_ way out — the exit is linear and
  explicit, so a half-finished task is never abandoned by an accidental rail click.
- Drop the back button and the crumb (`terminal`) only on a terminal screen (provisioning, success),
  where there is nowhere left to go back to. The avatar stays.

## The shared invariant — the user is never signed out

**Both shells keep the signed-in user visible.** A focused flow drops the rail, but it does **not**
drop the account avatar — it stays at the end of the bar, mirroring the console header. A user who is
mid-create must still see they're signed in and reach their account; a header with no identity reads
as "logged out" and breaks trust.

- **Persistent shell:** `ConsoleLayout` shows the user twice from `account` — the rail footer (opening
  your `account-menu`) and the header avatar. Never hide the avatar when the rail is collapsed or in
  the drawer.
- **Focused shell:** the bar's avatar is the persistent identity. It routes to the same account
  destination as the console header, so identity is continuous across shells.

Wire the focused avatar into the shell itself (as `CreationShell` does), so every creation page gets
it for free — a page must **not** have to remember to add it.

## Content layout (inside `ConsoleLayout`)

The layout frames the page; this is how the page body sits inside it. Every browse/list page and
every resource-detail page follows the **same** layout and spacing, so moving between modules never
feels like a different app.

### The page body owns its boundary; the layout pads nothing

`ConsoleLayout` renders the `<main>` and adds no padding, so the page body names its own inset and
measure with the `layout-*` utilities (`/webkit-layout`):

- **List, dashboard, settings, form:** `layout-boundary` + a column class (`layout-column` for data,
  `layout-column-form` for a settings form) on the body's outer blocks.
- **Detail page with tabs:** opens **flush** on a full-bleed `PageTabs`, kept sticky at the top of the
  layout's scrolling region; each tab's view then carries `layout-boundary` + its own column.

Never a bespoke `p-(--spacing-*)` page inset, never a `max-w-*` of your own, and never a `<main>`.

### First-level module list — the `PageHeader` leads, then one band

A **first-level** page is one the rail routes to directly (Applications, Workloads, Object Storage,
Deployments). It passes **no** breadcrumb, so its `PageHeader` is the only place the module's name
appears, and the module's create action lives in that heading. Below it, one band: the controls that
narrow the list and the table they narrow.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  Applications                                Documentation  + Create App…   │  ← PageHeader (create = large)
│  Build, deploy, and manage your applications.                               │
│                                                                              │
│  [ property filter …                                    ]  ⟳  ⤓  ⚙          │  ← controls row (medium)
│  ╭────────────────────────────────────────────────────────────────────────╮  │
│  │  table (flush, borderless, inside the card)                            │  │
│  ╰────────────────────────────────────────────────────────────────────────╯  │
└──────────────────────────────────────────────────────────────────────────────┘
```

```vue
<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col">
      <PageHeader
        size="medium"
        title="Applications"
        description="Build, deploy, and manage your applications."
      >
        <template #actions>
          <Button
            label="Documentation"
            kind="outlined"
            size="medium"
            icon="pi pi-book"
            href="https://www.azion.com/en/documentation/"
            target="_blank"
          />
          <Button
            label="Create Application"
            kind="primary"
            size="large"
            icon="pi pi-plus"
          />
        </template>
      </PageHeader>

      <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
        <!-- ONE band: the controls and the rows they narrow -->
        <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
          <div class="flex items-start gap-(--layout-group-gap)">
            <div class="flex min-w-0 grow">
              <PropertyFilter
                v-bind="propertyFilterProps"
                placeholder="Filter applications"
                aria-label="Filter applications"
              />
            </div>
            <CollectionPreferences v-bind="preferencesProps" />
          </div>
          <Card :padded="false">
            <template #content>
              <Table
                v-bind="tableProps"
                :bordered="false"
              />
            </template>
          </Card>
        </section>
      </section>
    </div>
  </div>
</template>
```

- **The heading names the module.** The trail starts at the second level, so at first level the
  `PageHeader` is the only place the name appears — never a lone crumb repeating it.
- **The create action is the heading's**, and it is the page's only `large` control; everything on the
  controls row is `medium`. Never move the create button onto the controls row.
- **The controls row and the table are ONE band**, stacked at the group step — not two sections.
- **The table is framed by the card, not itself:** `Card :padded="false"` + `Table :bordered="false"`
  — the card is the only border, so the table sits edge-to-edge.
- **`Documentation` is a first-level affordance only.** It introduces the module. An internal level is
  already inside the module, so it carries only the action that level can perform; reference material
  a band needs is a `documentation` link on that band's own section heading instead.
- The full list page — `useCollection`, the property filter, the preferences, the empty and no-match
  states — is `/webkit-lists` and the `platform/view/table-view` block.

## Second-level navigation — tabs, and where the primary button goes

A resource you navigate INTO (an application, a workload, a DNS zone, a database), and any module
whose contents split into more than one page, carries a **full-bleed tab bar** at the top of its body.
Each tab is **its own page**, not a filter.

**This is the rule that decides where the page's primary button lives — and there is exactly one
answer per page shape:**

| The page…                                     | Second-level nav   | The primary action sits…                                     | Size     |
| --------------------------------------------- | ------------------ | ------------------------------------------------------------ | -------- |
| **Has tabs** (detail page, or a split module) | full-bleed tab bar | **on the tab row**, trailing the tabs, at the end of the row | `medium` |
| **Has no tabs** (a plain first-level list)    | none               | **in the `PageHeader`'s actions**, above the controls row    | `large`  |

The reason is positional, not stylistic: on a tabbed page the action belongs to the **page**, so its
position must never move as tabs change — only its **label** does. On a page with no tabs the heading
names the page and owns what the page is for, so the create action rides it and the controls row
only narrows.

### Tabs → the button rides the tab row

The detail page's trail (`Applications › edge-app`) is `ConsoleLayout`'s `breadcrumbs`; the body
opens flush on the tab bar:

```vue
<template>
  <!-- The tab bar opens the body, full-bleed, and stays in view while the tab
       content scrolls under it. NO PageHeader and NO main on this page. -->
  <div class="sticky top-0 z-1 bg-(--bg-canvas)">
    <PageTabs v-model="activeTab">
      <Tabs.Item
        v-for="tab in tabs"
        :key="tab.value"
        :value="tab.value"
        :label="tab.label"
      />
      <template #actions>
        <Button
          v-if="activeView.action"
          :label="activeView.action.label"
          :icon="activeView.action.icon"
          :loading="actionPending"
          kind="primary"
          size="medium"
          @click="runTabAction"
        />
      </template>
    </PageTabs>
  </div>

  <!-- Each tab's view brings its own layout-boundary + column. -->
  <KeepAlive>
    <component
      :is="activeView.component"
      ref="viewRef"
      v-bind="activeView.props"
    />
  </KeepAlive>
</template>
```

- **Use `PageTabs` (`@aziontech/webkit/page-tabs`), not a hand-built bar.** It is `Tabs` plus the
  strip: full-bleed with the page inset, ruled at the bottom, the row `items-center` so a 32px
  `size="medium"` button centres against the 30px tab items, the tab list free to shrink and scroll
  instead of pushing the action off the row, and the `#actions` region holding a medium button's
  height so switching between a tab with an action and one without never shifts the page.
- **The tab owns the flow; the row only positions the button.** Declare the action's _label and icon_
  on the tab entry and its _behaviour_ in the view, reached through the mounted view's `defineExpose`
  — so the drawer, the form, and the pending flag never leave the file that renders them. A tab with
  nothing to create simply declares no action.
- **The active tab lives in the URL (`?tab=`)**, so it survives reload and is linkable.
- **A centred catalog centres its tabs with the prop, not a class.** A page whose content below is
  centred (the Marketplace: Templates / Integrations over a card grid) uses
  `<Tabs.List align="center">`; a `justify-center` class or a centring wrapper is a style override.
  Resource pages and settings keep the default `start` (and `PageTabs`).
- **Inside a tab, a list keeps its controls row for narrowing but takes no actions** — its create
  button was hoisted to the tab row. Two create buttons on one page is the failure this rule prevents.

### No tabs → the button rides the `PageHeader`

The first-level list above: the module's create action is in the heading's `#actions`
(`size="large"`), and the controls row below it only narrows the table.

### A tabbed page renders no `PageHeader`

The tab bar is **navigation**, not a heading — each tab is its own page, so the bar carries no `<h1>`,
and each tab's own heading (if it needs one) lives inside that tab's view. A `PageHeader` folded into
the bar would be a heading block that renders no heading.

The one page shape that shows **both** is a first-level list whose tabs sit _in content, below_ the
heading, with no border and no full-bleed inset — that is a different element, not this bar with a
flag flipped.

Each tab renders one of two bodies:

- **A list tab** → the list pattern above (controls row + flush borderless `Table`), with its create
  action **on the tab row**.
- **A settings tab** → the `ItemGroup` form: `SettingsSection` bands each over a flush `Card` +
  `Item.List` of `SettingRow` rows, committed as **one block** by a single `SaveBar` pinned below the
  scroll region (see `webkit-form` and `webkit-ui-states`).

## Breadcrumb — first level and second-level resource nav

In the console the trail is `ConsoleLayout`'s `breadcrumbs` prop, derived from the route meta. It is
top chrome that says _where you are_ below a module; it is not the page's title block, and it is
hidden while the layout is compact (the brand takes its place).

| Level                                              | Items                                                                                                    |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------- |
| **First level** — a module the rail routes to      | `[]` — no trail; the page's `PageHeader` names the module                                                |
| **Second level** — a resource you opened           | `[{ label: 'Applications', href: '/applications' }, { label: application.name }]`                        |
| **Second level** — a sub-page that is not a record | `[{ label: 'Deployments', href: '/deployments' }, { label: 'Async deployment' }]`                        |
| **Third level** — a typed sub-collection           | `[{ label: 'Edge DNS', href: '/edge-dns' }, { label: 'Zone', href: '/edge-dns' }, { label: zone.name }]` |
| **Focused creation flow** (the creation bar)       | `[{ label: 'Applications', href: '/applications' }, { label: 'Create Application' }]`                    |

These rules hold across every row:

1. **A first-level page passes no trail.** Its `PageHeader` already names the module; a lone crumb
   repeating it is a duplicate.
2. **The second-level crumb is the resource's own name**, not the page type: `webkit-sample-vue`, not
   `Application detail`. That name is the page's identity, which is exactly why a tabbed detail page
   needs no heading repeating it.
3. **Every non-last crumb links; the last crumb is the current page and never links.** In a focused
   flow the crumb links are the way out alongside the back button, and the last crumb repeats the
   create button's label exactly.
4. **A tab is never a crumb.** Switching tabs does not change the breadcrumb — the tab is second-level
   _navigation within one page_, and it already has its own visible bar. It travels in `?tab=`, not in
   the trail.
5. **A switcher that ends the trail reads as a crumb.** A resource that lives in several environments
   (or versions) ends its trail on the current one as a switcher: `Workloads › workload_01 ›
Production ⌄`. Compose it in `ConsoleLayout`'s `breadcrumbs` slot: `<Select kind="transparent" size="small">`
   with `aria-label` on `Select.Trigger` ("Switch environment") in the last `<li>` of
   `Breadcrumb.List`: no border or fill until hover, sized to its value. Never a bordered `Select` in
   the header, and never a trigger restyled with `!` overrides.

## Wiring Vue Router — `href` plus `@navigate`

Inside `ConsoleLayout` (and `DocLayout`) the navigation is already wired: give each row an `href` and
the layout follows it with the router and matches the active row against the route. The rest of this
section is for a `Menu` or `Breadcrumb` you render yourself inside a page.

`Menu` (and its `MenuNode` data), `Breadcrumb` items and `Menu.Item` take their destination in
**`href`**, and only there. There is no `to`, and a `path`, `to`, `url` or `route` key on a nav node
is not read: the row renders as a button with nowhere to go (lint `webkit/menu-node-href`). Do not
confuse it with `v-model:path` on `Menu`, which is the drill stack (ancestor node ids), not a URL.

With Vue Router, keep the rows real links and let the router do the navigation:

```vue
<script setup lang="ts">
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import type { MenuNode } from '@aziontech/webkit/menu'
  import Menu from '@aziontech/webkit/menu-root'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  const router = useRouter()
  const route = useRoute()

  const groups = [
    {
      label: 'Build',
      items: [
        { id: 'applications', label: 'Applications', href: '/applications' },
        { id: 'functions', label: 'Functions', href: router.resolve({ name: 'functions' }).href }
      ]
    }
  ]
  const activeId = computed(
    () =>
      groups.flatMap((group) => group.items).find((node) => route.path.startsWith(node.href))?.id ??
      ''
  )

  const follow = (event: MouseEvent, href: string) => {
    if (!href || event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) return
    event.preventDefault()
    router.push(href)
  }
</script>

<template>
  <Menu
    :groups="groups"
    :active-id="activeId"
    @navigate="(event: MouseEvent, node: MenuNode) => follow(event, node.href ?? '')"
  />
  <Breadcrumb
    :items="[{ label: 'Applications', href: '/applications' }, { label: 'edge-app' }]"
    @navigate="follow"
  />
</template>
```

- A named route becomes `href` through `router.resolve(to).href`; never put the route object on the node.
- `active-id` follows the route, not the click, so Back / Forward and deep links select the right row.
- A modified click (Ctrl, ⌘, Shift, middle button) is left to the browser, so open-in-new-tab works.
- The layouts do the same for their own rows: they push in-app hrefs through the router, match the
  active row against the route and leave a modified click to the browser.

## Hard rules

- **One shell per page.** A page is either a persistent-console page or a focused-creation page —
  never both, never neither.
- **`ConsoleLayout` is the console shell, composed once.** One `ConsoleLayout` in `App.vue` around
  `RouterView`; every browse page is only the body of its default slot. Never hand-compose
  `AppLayout`, `Sidebar`, `Menu`, `GlobalHeader`, `SearchTrigger` or `Command` into a shell of your
  own, and never copy the chrome into a page.
- **A browse page renders no `<main>`.** The layout owns the single `<main>`; the body starts on its
  `PageHeader` (or its `PageTabs`). Only a focused flow, rendered outside the layout, owns a `<main>`.
- **Exactly one `GlobalHeader` per page.** The layout's on a browse page; the creation bar on a focused
  flow. Never render a second header inside the content.
- **The user is always visible.** `ConsoleLayout` takes `account` (rail footer + header avatar); a
  focused flow keeps the avatar at the end of its bar. Never ship a screen where the user looks signed
  out.
- **Focused flows have no rail.** Route create flows outside `ConsoleLayout` (a route meta
  the `App.vue` reads); if such a page renders the rail, it is the wrong shell.
- **Focused flows have a back way out.** The creation bar without a working back button (or a
  terminal screen that justifies dropping it) strands the user.
- **The navigation is data.** Rows of `navigation` carry an `href` (never `to` / `path` / `route`);
  the active row follows the route, so `active-id` stays empty.
- **The breadcrumb names the level.** No trail at first level; `module › resource name` at second
  level; every non-last crumb links; a tab is never a crumb.
- **One search palette.** The layout's; add groups through its `search` slot and open it from a page
  with `useConsoleLayout().openSearch()`. Never a second `Command` or `SearchTrigger`.
- **The page body owns its boundary.** `layout-boundary` + a column class on a list, dashboard or
  form; a detail page opens flush on `PageTabs`. Never a bespoke `p-(--spacing-*)` inset or
  `max-w-*`.
- **A list table lives in a flush, borderless `Card`.** `Card :padded="false"` +
  `Table :bordered="false"`; the card is the only border. Never ship a bare bordered table, never wrap
  the table in a padded card, never bury the `PageHeader` in the card's `#header`.
- **A first-level module list opens on its `PageHeader`.** Title, one line of purpose, Documentation
  and the create action (`large`); the controls row (`medium`) and the table follow as one band.
- **One place for the page's primary button, decided by whether the page has tabs.** Tabs → the tab
  row (`size="medium"`, `items-center`, height reserved). No tabs → the `PageHeader`'s actions
  (`size="large"`). Never both: a tab's own list must not re-render the create button its tab row
  already carries.
- **A tabbed page renders no `PageHeader`.** The tab bar is navigation; each tab's heading lives
  inside that tab's view. The active tab travels in `?tab=`.

## Review output

For `/webkit-navigation <file>`, list gaps. Each:

```
✗ AppShell.vue:1  composes Sidebar + GlobalHeader + Command into a shell of its own
  rule: The console shell is ConsoleLayout, composed once in App.vue.
  fix: delete the shell; put ConsoleLayout (navigation data, breadcrumbs, account) around RouterView.

✗ ApplicationsView.vue:3  <main class="layout-column layout-boundary …">
  rule: A browse page renders no main — ConsoleLayout owns the landmark.
  fix: make the root a div with the same classes.

✗ CreateResource.vue:12  the create flow renders inside ConsoleLayout (the rail shows)
  rule: One shell per page — a create flow is the focused shell, which has no rail.
  fix: route it outside the layout (meta.shell = 'focused') and head it with the creation bar.

✗ NewResourceForm.vue:40  GlobalHeader.Right is empty on a focused flow
  rule: The user is always visible — a header with no identity reads as signed out.
  fix: render the account avatar at the end of the bar (your CreationShell should anchor it).

✗ router.ts:18  meta.breadcrumbs: [{ label: 'Applications' }] on the first-level list
  rule: A first-level page passes no trail — its PageHeader names the module.
  fix: drop the crumb; the trail starts at the second level.

✗ WorkloadDetail.vue:64  create button inside the Deployments tab's own controls row
  rule: One place for the primary button — a tabbed page puts it on the tab row, not per tab.
  fix: hoist it to the tab row (size="medium"), and reach the tab's flow via defineExpose.

✗ ApplicationDetail.vue:15  breadcrumb includes the active tab ("… › Build")
  rule: A tab is never a crumb — it is navigation within one page and travels in ?tab=.
  fix: end the trail at the resource name: [{ label: 'Applications', href }, { label: app.name }].
```

End with: `navigation sound` or `N gaps — fix before polish`.

## References

- **Persistent console shell** — `ConsoleLayout` (`@aziontech/webkit/console-layout`): the rail, the
  header, the ⌘K palette, the account and the single `<main>`, composed once in `App.vue`; its spec
  lists every prop, slot and event. `useConsoleLayout` (`@aziontech/webkit/use-console-layout`) opens
  its palette from a page. Start from the `shells/console` block (states `ListPage`, `DetailPage`,
  `Notifications`, `AccountSwitch`).
- **Focused creation shell** — the `headers/creation-header` block (one `GlobalHeader` with back,
  brand, flow breadcrumb and avatar, no rail), carried by every `platform/create/*` block; lift it into
  your own `CreationShell` when several flows share it.
- **The other app layouts** — `SiteLayout` (`@aziontech/webkit/site-layout`) for the marketing site and
  `DocLayout` (`@aziontech/webkit/doc-layout`) for documentation: same story, composed once around
  `RouterView`.
- **Page bodies** — `@aziontech/webkit/page-header`, `@aziontech/webkit/page-tabs`,
  `@aziontech/webkit/breadcrumb` (resolve each via the MCP / catalog).
- **Companion skills:** `webkit-layout` (the boundary and column of the body), `webkit-lists` (the
  index page around the table), `webkit-form` (what fills a focused flow), `webkit-errors` (where a
  failure on the page goes), `webkit-ux-heuristics` (states + feedback), `webkit-ui-states` (locking +
  toast), `webkit-baseline-ui` (components + tokens).

## Definition of Done

- [ ] The page uses exactly one shell (persistent console **or** focused creation), matching its job.
- [ ] The console chrome is one `ConsoleLayout` in `App.vue` around `RouterView`, fed by `navigation`
      data with an `href` on every row; no hand-composed `AppLayout` / `Sidebar` / `GlobalHeader`
      shell, and no chrome copied into a page.
- [ ] A browse page is only a body: no `<main>`, header, rail or `Command` of its own; it opens the
      palette with `useConsoleLayout().openSearch()` when it needs it.
- [ ] Exactly one `GlobalHeader` renders on the page.
- [ ] The signed-in user is visible: `account` on `ConsoleLayout` (rail footer + header avatar), or the
      avatar at the end of the creation bar.
- [ ] Focused flows route outside `ConsoleLayout` (no rail) and have a working back way out (the back
      button / breadcrumb), dropped only on a terminal screen.
- [ ] The body carries `layout-boundary` + its column (or opens flush on `PageTabs`); no bespoke
      `p-(--spacing-*)` inset; a table sits in a flush borderless `Card`, and the `PageHeader` is out
      of the card.
- [ ] A first-level module list opens on its `PageHeader` (the create action `large`) over one band:
      the controls row (`medium`) and the table.
- [ ] The page's primary button is in exactly one place: the tab row (`medium`) if the page has tabs,
      the `PageHeader` (`large`) if it doesn't — never duplicated inside a tab's own list.
- [ ] A tabbed page renders no `PageHeader`, keeps the tab row `items-center` with the action's height
      reserved, and carries the active tab in `?tab=`.
- [ ] The breadcrumb matches the level (no trail at first level; `module › resource name` at second
      level), every non-last crumb links, and no tab appears in the trail.

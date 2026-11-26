---
name: console-layout
category: layout
structure: composition
status: implemented
spec_version: 15
template: 2
checksum: e467ae45e7e6c9ebb3586bda66966e67858cd13117d5a5a408e56e6ea3126a12
created: 2026-11-12
last_updated: 2026-11-25
---

# ConsoleLayout — Component Spec

## Purpose

The console chrome, composed once in the app: `AppLayout` with the navigation rail (`Sidebar` + `SidebarMenu`, the brand on top and the account at the foot), the global header (breadcrumbs, `SearchTrigger`, the app's own actions and the account avatar) and the `Command` search palette wired to the trigger and to ⌘K / Ctrl K. The navigation is data (`navigation`, each row with an `href` that is followed with the app's router when it is an in-app path), the active row follows the current route, and the page body is the default slot inside the layout's `<main>`. A page opens the palette with `useConsoleLayout().openSearch()`, sets its own trail with `ConsoleLayout.Breadcrumb`, opens its help in the tools region with `ConsoleLayout.ToolsTrigger` (the `Info` link after its title), and fills a fixed-height main with `data-layout-fill` on its root. Platform blocks are only page bodies rendered through this slot; they never carry the chrome themselves.

## When to use

- Use ConsoleLayout once at the app root of the Azion console; every page is its body.
- Every signed-in console page: put one `ConsoleLayout` in the app's root (around `RouterView`) and render each page block as its default slot.
- A product area that needs the console navigation, breadcrumbs, the ⌘K palette and the account menu without hand-composing `AppLayout`, `Sidebar`, `SidebarMenu`, `AppHeader`, `SearchTrigger` and `Command`.

## When NOT to use

- A focused flow with no navigation rail (a creation wizard, sign-in) → render the page on its own or with the flow's own header.
- Public marketing pages → `SiteLayout`. Documentation → `DocLayout`.
- When the page needs the split panel → compose `AppLayout` directly; `ConsoleLayout` covers the navigation, header, notifications, tools and content regions.

## Related

- `AppLayout` — the frame this layout fills; it owns the compact drawers and the scrolling content region.
- `Sidebar`, `SidebarMenu` — the rail and the data-driven navigation tree (`navigation` is mapped onto `SidebarMenu` groups).
- `SearchTrigger`, `Command` — the header search and the palette it opens; the palette lists every navigation page.
- `Breadcrumb` — the header trail (`breadcrumbs`), given the free width of the header start so it shows whole whenever it fits and `Breadcrumb` folds it only when it does not; while compact it stays from a 28rem header up, or only a page's control crumbs when the page has them.
- `shell/shell-console` — the block that shows this layout with sample console navigation.

## Best practices

- Compose the layout once, in the app's root, around `RouterView`; each route renders only its page body. Never copy the chrome into a page.
- Give every navigation row an `id` and an `href`: an in-app path (`/workloads`) is followed with the app's router when one is installed (a named route becomes a path through `router.resolve(...).href`), an external URL loads normally, and a row with no `href` is left to your `navigate` handler. Never `to`, `path` or `route` on a row (lint `webkit/prefer-href-in-menu-node`). Leave `activeId` empty so the active row follows the route; set it only for a page whose route matches no row.
- Pass a static trail through `breadcrumbs` (derive it from the route meta); leave it empty on first-level pages.
- A page that owns its trail (a loaded name, a control crumb) renders `ConsoleLayout.Breadcrumb`: `items` are the crumbs, the default slot the trailing controls (a `Select` with `variant="ghost"`, `size="small"`, an `aria-label`, no `w-full`). It replaces the layout's trail while the page is mounted and renders nothing in place. While compact the crumbs are hidden, but the controls stay in the header in place of the brand, so a phone user always sees and can switch the environment.
- Put the app's own header actions (`Create`, `Agent`) in the `actions` slot and render them icon-only while `compact`.
- Put the account menu groups (`DropdownMenu.Group`) in the `account-menu` slot; the layout renders the avatar and the trigger.
- Put an account switcher in `sidebar-header` (full width under the wordmark, the design sample's rail) and, below the compact breakpoint, in `header-leading` while `compact`; page-level flash messages go in `notifications`, and help or the notifications list in `tools` (toggled from a bell in `actions` with `toggleTools`).
- A page's control crumb is its `ConsoleLayout.Breadcrumb`, never `App.vue`'s `breadcrumbs` slot.
- Page help (level D of the in-product help standard) is a `HelpPanel` in the `tools` slot, opened by `ConsoleLayout.ToolsTrigger` placed first in `PageHeader`'s `meta` slot, so the `Info` link sits right after the page title on the same line. One per page. Never a boxed `IconButton`, a typed `?` or a `Tooltip` to open page help; never hand-build the toggle with `useConsoleLayout()` and a `Button`.
- The app-wide help or notifications entry in the header (`actions` with `toggleTools`) and a page's `Info` link drive the same tools region: the page swaps the panel's topic in the trigger's `click` handler, which runs before the region toggles. To keep the region open while switching topic, call `event.preventDefault()` in the handler and then `useConsoleLayout().openTools()`.
- A section of a page (a `Subheader`, a `SettingsGroup`, a `Card` header) takes no `Info` link: one per page, after the h1. A section explains itself with its `description` (level A) or a `Hint` after its title (level C).
- A workspace page (editor, pinned panes) puts `data-layout-fill` on its root: the `<main>` becomes a fixed-height, non-scrolling region the root fills. Never size a body with `100dvh` or `calc(100dvh - var(--layout-header-height))` (lint `webkit/no-viewport-height-calc`, also run by the authoring ratchet over blocks and examples).
- Bind `v-model:navigation-open` when the rail's state must survive a reload or be driven from elsewhere (a `Collapse sidebar` / `Expand sidebar` command in the `search` slot); persist it in the app. The rail's own collapse control and the edge affordance keep working either way.
- Open the palette from inside a page with `useConsoleLayout().openSearch()` (imported from `@aziontech/webkit/use-console-layout`); never mount a second `Command`. `useConsoleLayout()` throws outside a `ConsoleLayout`, so a misplaced call fails loudly.
- A page body that also renders on its own (a block preview, a docs example, a test) calls `useConsoleLayout({ optional: true })`, which returns `null` outside a layout, and guards the call (`layout?.openSearch()`). Never wrap `useConsoleLayout()` in `try` / `catch`.
- The page entrance (`animate-page-enter`) plays on every route path change: the `<main>` is keyed on the path, so the page body remounts when the path changes and is kept when only the query or the hash changes. Keep state that must survive a path change (a list filter, a draft) in the route query or in the app's store, not in the page body; a `KeepAlive` belongs inside a page body (tabbed views), not around `RouterView`.
- The page body renders no `<main>` of its own and no `AppLayout`: the layout owns the landmark. Frame the body with `layout-boundary` + `layout-column` for list and form pages, or flush (`PageTabs` first) for detail pages.
- A destination appears once per screen (rule `webkit-navigation-levels`): never render a `SidebarMenu` in the page body: page navigation lives in the rail and a page has only its `PageTabs`. The rail holds two levels at most: a product with 3 or fewer resources lists them on level 1, a product with more is a drill row whose level lists them, and no drill level nests another. In development builds the layout scans the `SidebarMenu`s in its `<main>` after mount, on each route change and on page mutations, and when a row `href` has the same path (query and hash ignored) as a `navigation` row on screen (the top level, its inline children and the open drill level; a closed drill level is not on screen), it calls `console.warn` once per route with both labels and the route. Production builds drop the check (`import.meta.env.DEV`).

## Usage

A page body sets its own trail, ending on a control crumb, and fills the main region:

```vue
<script setup lang="ts">
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const environment = ref('production')
</script>

<template>
  <div
    data-layout-fill
    class="flex min-h-0 flex-col"
  >
    <ConsoleLayout.Breadcrumb
      :items="[
        { label: 'Applications', href: '/applications' },
        { label: 'azion-site', href: '/applications/azion-site' }
      ]"
    >
      <Select
        v-model="environment"
        variant="ghost"
        size="small"
      >
        <Select.Trigger aria-label="Switch environment" />
        <Select.Content>
          <Select.Item value="production">Production</Select.Item>
          <Select.Item value="preview">Preview</Select.Item>
        </Select.Content>
      </Select>
    </ConsoleLayout.Breadcrumb>
  </div>
</template>
```

The app's root renders only `<ConsoleLayout>`, so it imports the standalone root (`webkit/prefer-tree-shakeable-root`); the root entry also carries the types:

```vue
<script setup lang="ts">
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout-root'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'az az-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'az az-workloads', href: '/workloads' }
      ]
    }
  ]
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    :breadcrumbs="[{ label: 'Workloads' }]"
    :account="{ name: 'Jane Doe', email: 'jane.doe@example.com' }"
  >
    <RouterView />
  </ConsoleLayout>
</template>
```

A page opens its help topic from the `Info` link after its title; the app's `tools` slot holds the `HelpPanel` (see the HelpInfo example):

```vue
<script setup lang="ts">
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import PageHeader from '@aziontech/webkit/page-header'
</script>

<template>
  <PageHeader
    title="Workloads"
    description="Group the domains, applications and firewalls that serve one site."
  >
    <template #meta>
      <ConsoleLayout.ToolsTrigger aria-label="Info about workloads" />
    </template>
  </PageHeader>
</template>
```

`@aziontech/webkit/console-layout-breadcrumb` and `@aziontech/webkit/console-layout-tools-trigger` are the standalone parts.

## Sub-components

The root ships a compound API via `index.ts` (`Object.assign` attaches the part; vue-tsc emits `index.d.ts`), and `index.ts` re-exports the root's types (`ConsoleLayoutNavGroup`, `ConsoleLayoutNavItem`, `BreadcrumbItemData`, `ConsoleLayoutAccount`). Root binding is PascalCase `ConsoleLayout`.

```
packages/webkit/src/components/layout/console-layout/
├── console-layout.vue          (root — the chrome, provides the context)
├── index.ts                    (compound Object.assign)
├── injection-key.ts            (the page context and the trail registry)
├── composables/use-console-layout.ts
├── console-layout.test.ts
├── console-layout-breadcrumb/console-layout-breadcrumb.vue
└── console-layout-tools-trigger/console-layout-tools-trigger.vue
```

- `console-layout-breadcrumb/console-layout-breadcrumb.vue` — a page's own trail. Renders nothing in place; registers with the layout on mount and `KeepAlive` activation, unregisters on unmount and deactivation; the latest wins and replaces the layout's `breadcrumbs` prop and slot. Does nothing outside a `ConsoleLayout`. Crumbs are followed with the app's router.
  - Props: `items: BreadcrumbItemData[]` default `[]` — the page's crumbs, each `{ label, href? }`; without a control crumb the last one is the current page.
  - Events: _none_ (crumb clicks are followed by the layout).
  - Slots: `default` — one or more controls that end the trail (a `Select` with `variant="ghost"`, `size="small"` and an `aria-label`); each top-level element is its own crumb (environment then version: two `Select`s); they keep the page's reactivity.
- `console-layout-tools-trigger/console-layout-tools-trigger.vue` — the page's `Info` link: a `Button` with `variant="link"` (text only, `.text-body-sm`, the link colour) that opens and closes the layout's tools region. It reads the layout context with `useConsoleLayout({ optional: true })`: inside a `ConsoleLayout` it sets `aria-expanded` (`"true"` / `"false"`), `aria-controls` (the tools region body's id, only while open, when the region is in the page) and `data-state="open|closed"` from `v-model:tools-open`; a click first emits `click` and then toggles the region unless the handler called `event.preventDefault()`. Outside a layout (a block preview, a test) it still renders and emits `click`, and sets no `aria-expanded`, `aria-controls` or `data-state`. `data-testid` fallback `console-layout-tools-trigger`. Placed first in `PageHeader`'s `meta` slot.
  - Props: `label: string` default `''` — the visible label; empty uses the locale catalog (`consoleLayout.info`, `Info`). `ariaLabel: string` default `''` — a fuller accessible name that starts with the visible label (`Info about workloads`, WCAG 2.5.3); empty leaves the visible label as the name.
  - Events: `click` — `(event: MouseEvent)`, fired before the region toggles, so the page can set the `HelpPanel` topic first; `event.preventDefault()` keeps the region as it is.
  - Slots: _none_.

## Props

| Prop                | Type                      | Default     | Required | JSDoc                                                                                                                                                                         |
| ------------------- | ------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `navigation`        | `ConsoleLayoutNavGroup[]` | `[]`        | false    | The navigation tree: groups of rows, each `{ id, label, icon?, href?, tagValue?, disabled?, kind?, children?, groups? }`; an in-app `href` is followed with the app's router. |
| `activeId`          | `string`                  | `''`        | false    | Id of the current row. Empty matches the current route against each row's `href`.                                                                                             |
| `breadcrumbs`       | `BreadcrumbItemData[]`    | `[]`        | false    | The trail shown in the header (while compact, hidden below a 28rem header); each is `{ label, href? }` and the last one is the current page.                                  |
| `home`              | `string`                  | `'/'`       | false    | Where the brand mark links.                                                                                                                                                   |
| `account`           | `ConsoleLayoutAccount`    | `undefined` | false    | The signed-in account, `{ name, email?, src? }`, shown at the foot of the rail and as the header avatar; nothing is rendered when absent.                                     |
| `ariaLabel`         | `string`                  | `''`        | false    | Accessible name of the navigation landmark. Empty uses the locale catalog (`Main navigation`).                                                                                |
| `searchPlaceholder` | `string`                  | `''`        | false    | Placeholder of the palette's input. Empty uses the locale catalog (`Search pages and commands`).                                                                              |
| `toolsLabel`        | `string`                  | `''`        | false    | Title of the tools region (help, notifications). Empty uses `AppLayout`'s catalog (`Help`).                                                                                   |

## v-model

| Model                     | Type      | Default | Emits                   | Notes                                                                                                                                                                                                                                                                                      |
| ------------------------- | --------- | ------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `v-model:search-open`     | `boolean` | `false` | `update:searchOpen`     | Whether the search palette is open; the trigger, ⌘K / Ctrl K and `openSearch()` set it.                                                                                                                                                                                                    |
| `v-model:tools-open`      | `boolean` | `false` | `update:toolsOpen`      | Whether the tools region (help or notifications) is open beside the content; a drawer while compact.                                                                                                                                                                                       |
| `v-model:navigation-open` | `boolean` | `true`  | `update:navigationOpen` | Whether the navigation rail is shown on wide layouts; `false` collapses it (the Sidebar's `open`). The rail's collapse control, its edge affordance and ⌘B / Ctrl B all write it. It has no effect while compact, where the rail is a drawer. Same name as `AppLayout`'s `navigationOpen`. |

## Events

| Event            | Payload                                                            | Notes                                                                                                                                                                                            |
| ---------------- | ------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `navigate`       | `(event: MouseEvent \| KeyboardEvent, item: ConsoleLayoutNavItem)` | Fired when a navigation row or a palette page is chosen; the layout then follows its `href` (an in-app path with the app's router). A row without `href` is left to this handler. Event first.   |
| `search-select`  | `(event: MouseEvent \| KeyboardEvent, value: string \| number)`    | Fired when a palette item from the `search` slot is chosen; `value` is that item's value. Event first.                                                                                           |
| `account-select` | `(event: MouseEvent \| KeyboardEvent, value: string \| number)`    | Fired when an option of the `account-menu` slot is chosen, by click or by keyboard (`Enter` / `Space`), from the rail footer or the header avatar; `value` is the option's `value`. Event first. |

## Slots

| Slot             | Scope                                           | Notes                                                                                                                                                                                                                                                                                                                          |
| ---------------- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `default`        | —                                               | The page body, rendered inside the layout's `<main>`; a body whose root carries `data-layout-fill` fills a fixed-height, non-scrolling main.                                                                                                                                                                                   |
| `actions`        | `{ compact: boolean, toggleTools: () => void }` | The app's header actions, between the search trigger and the avatar; render them icon-only while `compact`; `toggleTools` opens and closes the tools region (a notifications bell).                                                                                                                                            |
| `header-leading` | `{ compact: boolean }`                          | Content at the start of the header, before the breadcrumbs (an account or organization switcher).                                                                                                                                                                                                                              |
| `sidebar-header` | `{ compact: boolean }`                          | Content in the rail under the wordmark, above the navigation (a full-width account or organization switcher); `compact` is true when the rail is the compact drawer (render nothing there to keep the switcher in `header-leading`). Rendered only when given; a region whose slot renders nothing (a false `v-if`) is hidden. |
| `breadcrumbs`    | —                                               | An app-wide composed trail that replaces the one built from `breadcrumbs`; a page's `ConsoleLayout.Breadcrumb` replaces both; while compact, hidden below a 28rem header.                                                                                                                                                      |
| `notifications`  | —                                               | Flash messages (`Alert`) above the page, kept in view while the page scrolls.                                                                                                                                                                                                                                                  |
| `tools`          | —                                               | The tools region's body (a `HelpPanel` or the notifications list), opened with `v-model:tools-open`.                                                                                                                                                                                                                           |
| `search`         | `{ query: string }`                             | Extra `Command.Group`s (recent resources, commands) listed before the navigation pages in the palette.                                                                                                                                                                                                                         |
| `account-menu`   | —                                               | `DropdownMenu.Group`s of the account menu, opened from the account row in the rail and from the header avatar; a chosen option is reported by `account-select`.                                                                                                                                                                |

## States

- Visual states: `default`, `compact` (from `AppLayout`: the rail becomes a drawer opened from the header, the brand joins the breadcrumbs, which hide only below a 28rem header (`@max-md`); when the page trail has control crumbs, they take the brand's place as a trail of their own, `__page-control`, and the brand stays in the navigation drawer; otherwise the brand is in the header beside the hamburger, so the drawer drops its brand row and the navigation starts under the close button), the palette `open` / `closed`.
- `data-compact` and `data-navigation` come from `AppLayout` on the inner frame.
- Fill: a direct child of the `<main>` with `data-layout-fill` makes the main a `flex-1 min-h-0 h-full overflow-hidden` item of `AppLayout`'s body (which turns into a fixed-height flex column while it holds a fill page), and the child `flex-1 min-h-0`; pure CSS, right in the server render. The page then never scrolls as a whole: a chat keeps its composer pinned and scrolls only its thread, at every width (styled test `src/test/layout-fill.test.ts`).
- Page entrance: the `<main>` is keyed on the current route path (the router's `currentRoute.path`, or `location.pathname` on `popstate` without a router); a path change replaces the main and remounts the page body, so `animate-page-enter` replays. The first path read after mount (no router) and a change of only the query or the hash keep the main.
- Page trail: registered on mount, so the server render shows the layout's trail and the page trail replaces it after hydration (no mismatch); use `breadcrumbs` when the first server paint must show it.
- Unsafe `href` on a navigation row, crumb, section or palette page (`javascript:`, `data:`, any non-web scheme, `//host`): the row renders with no link and choosing it, by pointer or keyboard, follows nothing; `navigate` still fires, so the handler decides.
- Active navigation row: `SidebarMenu`'s `activeId`; a row inside a drill level opens that level, a row inside an inline row expands it. On mount, when the rail (or the compact drawer) is rendered and whenever the active row changes, the rail's own scroller scrolls the minimum needed to bring the row into view, honouring the scroller's `scroll-padding` (the `ScrollArea` fade), with an instant jump (no smooth scroll); the page never scrolls.
- Rail header: the `sidebar-header` region sits under the wordmark with `--spacing-md` padding; it collapses with CSS (`:empty`) when the slot renders only a false `v-if`, so the server render and the client agree.
- Not applicable: `loading`, `empty`, `error`, `disabled`, `readonly`, `invalid` (the page body owns its states).

## Motion & Animations

| Trigger           | Animation / Transition                                  | Token (see `contributing/docs/TOKENS.md` § Animations) | Reduced-motion fallback         |
| ----------------- | ------------------------------------------------------- | ------------------------------------------------- | ------------------------------- |
| route path change | `animate-page-enter` on the `<main>`, keyed on the path | semantic (`page-enter`)                           | `motion-reduce:animate-none`    |
| brand hover       | `transition-opacity` on the brand link                  | `duration-fast-02` · `ease-productive-entrance`   | `motion-reduce:transition-none` |
| palette, drawer   | `Command`, `AppLayout` drawers                          | component                                         | handled by those components     |

## Tokens

| Region                | Token (TOKENS.md)                                      |
| --------------------- | ------------------------------------------------------ |
| rail width            | `var(--container-2xs)` through `--sidebar-width`       |
| rail brand row        | `var(--border-default)` rule, `var(--spacing-md)` pad  |
| account row text      | `.text-label-sm`, `var(--text-default)`                |
| account menu identity | `.text-label-md`, `.text-body-xs`, `var(--text-muted)` |
| gaps                  | `var(--spacing-xs)`                                    |
| ring                  | `var(--ring-color)`, offset `var(--bg-surface)`        |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- Landmarks: the rail is the `Sidebar` `<nav>` named by `ariaLabel`; the header is `AppHeader` (`<header>`); the page body is inside the layout's single `<main>`. A page body must not render a second `<main>`.
- Skip link: the first `Tab` stop is the `SkipLink` `AppLayout` renders (`Skip to content`); it jumps past the rail and the header to the content region that holds the `<main>`.
- Keyboard map: `Tab` runs skip link → rail (wordmark, `sidebar-header`, navigation) → header → page; `⌘K` / `Ctrl K` opens the palette (owned by `Command`); on wide layouts `⌘B` / `Ctrl B` toggles the rail and writes `v-model:navigation-open` (the Sidebar's `shortcut`, off while compact and while typing in a field); in the palette `ArrowUp` / `ArrowDown` move, `Enter` chooses, `Escape` closes and returns focus. `?` (`Shift /`) opens the layout's one `ShortcutsDialog`, which lists every shortcut the current screen registers with `useShortcuts` (`@aziontech/webkit/use-shortcuts`); the layout lists `⌘K` there (`consoleLayout.searchShortcut`) without binding it a second time (`Command` owns the key). The app does not mount a second `ShortcutsDialog` under the layout. Tests: `console-layout.test.ts` › shortcuts list. The rail keyboard map is `SidebarMenu`'s; the compact drawer closes on `Escape` and returns focus to the hamburger (`AppLayout`).
- Names: the compact hamburger (`Open navigation`), the brand link (`Azion home`), the rail account trigger (`Account menu`, an icon button) come from the locale catalog; the avatar carries the account name. The header avatar trigger shows the initials, so its name starts with them and then says whose menu it is (`JD, Jane Doe, account menu`, `consoleLayout.accountMenuFor`; the initials are the first letters of the first and last words of the name, as `Avatar` draws them) to meet WCAG 2.5.3 Label in Name (a speech user says what they see); with an account image it has no visible text and is named `Account menu`.
- Account menu: choosing an option by pointer or keyboard emits `account-select`; the keyboard map inside the menu is `DropdownMenu`'s.
- Visible focus: every interactive part is a WebKit control with its own ring; the brand link and the avatar button use `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Choosing a row in the compact drawer closes it, and so does any route change, so a link or a list in `sidebar-header` (a chat history) that navigates also closes the drawer and shows the page.
- A page's control crumb is the last item of the header's `Breadcrumb` list (while compact, the only items of a `Breadcrumb` list that holds just the controls); it carries its own accessible name (`aria-label` on `Select.Trigger`, e.g. `Switch environment`).
- Page help: `ConsoleLayout.ToolsTrigger` is a native `button` (a disclosure: `Enter` and `Space` toggle) with `aria-expanded` and, while open, `aria-controls` pointing at the tools region's body (`useId()`-based, stable in the server render). Its name is the visible `Info` or an `aria-label` that starts with it. Focus stays on the trigger when the region opens; the region's close button (`AppLayout`) and the trigger both close it. Tests: `console-layout.test.ts` › tools trigger.

## Internationalization

| Key                               | English source                            | Override prop          |
| --------------------------------- | ----------------------------------------- | ---------------------- |
| `consoleLayout.navigation`        | `Main navigation`                         | `ariaLabel`            |
| `consoleLayout.home`              | `Azion home`                              | —                      |
| `consoleLayout.openNavigation`    | `Open navigation`                         | —                      |
| `consoleLayout.accountMenu`       | `Account menu`                            | —                      |
| `consoleLayout.accountMenuFor`    | `{initials}, {name}, account menu`        | —                      |
| `consoleLayout.searchPlaceholder` | `Search pages and commands`               | `searchPlaceholder`    |
| `consoleLayout.noMatch`           | `No page or command matches your search.` | —                      |
| `consoleLayout.pages`             | `Pages`                                   | —                      |
| `consoleLayout.searchShortcut`    | `Search pages and commands`               | —                      |
| `consoleLayout.info`              | `Info`                                    | `ToolsTrigger` `label` |

- Formatting: none. Navigation, breadcrumb and account text is consumer data.

## Right-to-left

- Layout: logical utilities only; the rail sits at the inline start and `AppLayout` mirrors the drawer side.
- `sidebar-header` spans the rail's inline size with symmetric `--spacing-md` padding, so it needs no mirroring.
- Icons: the breadcrumb separator and `SidebarMenu.Back` mirror through their own components; the brand and avatar are not mirrored.
- Keyboard: arrow handling is `SidebarMenu`'s and `Command`'s, both direction-aware.
- User data: labels render with `dir="auto"` inside `SidebarMenu`, `Breadcrumb` and `Command`.

## Responsive

- Container queries: `AppLayout` measures its own width; below 1024px (the layout passes `compactBelow` 1024, so a 768px tablet does not lose a third of its width to an open rail) the rail is a drawer and the header shows the hamburger and the brand before the breadcrumbs, and drops the breadcrumbs only below a 28rem header, so a tablet still says where the page is; a page's control crumbs (the environment `Select`) stay, in place of the brand. The header bar is an `@container`, so `SearchTrigger collapsible` folds to the magnifier on narrow headers.
- Narrow: the `actions` slot receives `compact` so the app renders icon-only actions; the breadcrumb truncates only when the header runs out of room (its wrapper alone pulls the trail to the start edge, and the `Breadcrumb` inside drops its own negative start margin, so a trail that fits is never cut short); while compact the crumbs are hidden and the page's control crumbs stay, so the environment is never lost on a phone. Below the header's `@xs` (a 320 px phone) the header drops the brand mark and keeps the hamburger, so `header-leading` and the actions fit; the brand stays in the navigation drawer.
- Rail header: `sidebar-header` sits under the wordmark at the rail's width; it is hidden with the rest of the rail content when the rail collapses, and in the compact drawer it renders with `compact: true`.
- Touch: hamburger and avatar keep the 32 px controls of `IconButton` / `Avatar` and grow on coarse pointers through those components.
- Reflow: no horizontal scroll at 320 px; the page body scrolls inside `AppLayout`'s content region.

## Performance

- Bundle budget: 66.5 KB gzip for the root `.vue` (`console-layout` in `.size-limit.json`; 66.0 KB measured, up from 65.0 KB for the `sidebar-header` region and the `Avatar` marble pattern it carries; it pulls `AppLayout`, `Sidebar`, `SidebarMenu`, `AppHeader`, `Breadcrumb`, `SearchTrigger`, `Command`, `DropdownMenu`, `Avatar`, `Tooltip`) plus `ShortcutsDialog` (the `?` list) and a list-only `useShortcuts` entry, 1 KB for `./console-layout-breadcrumb` (0.42 KB measured), and 4.7 KB for `./console-layout-tools-trigger` (4.65 KB measured; it pulls `Button` and the locale lookup).
- Runtime budget: one `popstate` listener when no router is installed; one watcher on the route path that bumps the main's key; the active row is a computed match over the navigation leaves, and one post-flush watcher on it and on the rail element scrolls the row into view (one layout read per change); the page trail is a short list of registrations.
- Development warning: in development only, one `MutationObserver` on the `<main>` and a scan of its `SidebarMenu` links against the navigation tree; it is removed from production builds (0.02 KB measured in the root budget for the `<main>` ref).
- Heavy parts: none beyond the composed components; the palette content renders only while open (`Command`).

## Decisions and open questions

- **Page trail and fill mode (2026-11-12).** Platform detail pages need a crumb that is a control (an environment or version `Select`), and they had to put it in `App.vue`'s `breadcrumbs` slot, far from the page that owns it; workspace pages sized themselves with `calc(100dvh - var(--layout-header-height))`, which ignores the notifications region and breaks the moment the header changes. Decided: (1) a context-aware part, `ConsoleLayout.Breadcrumb`, rendered by the page, over a `useConsoleLayout()` method — a template part takes reactive props and a slot for the control, and it cleans up with the page by construction; it registers on mount, not in setup, because the server renders the header before the page body, so a setup-time registration could never reach the server markup either and mount keeps the server and the hydrated markup identical. The structure moves from monolithic to composition (`spec_version` 2; the compound `./console-layout` re-exports the root's types, and `./console-layout-root` is the standalone root). Consequence: an `App.vue` that renders only `<ConsoleLayout>` now imports `console-layout-root` (`webkit/prefer-tree-shakeable-root`, as for every compound). (2) Fill mode is a `data-layout-fill` marker on the page's root read by the main through `:has()`, not a prop bound per route or a composable call: it is pure CSS, so it is right in the server render, needs no wiring in `App.vue`, and ends with the page. `AppLayout` is unchanged: `ConsoleLayout` renders its trail in the header, not in `AppLayout`'s breadcrumbs row, so the main's `h-full` is exactly the content area under the header.
- **Optional page context (2026-11-12).** `contributing/rules/composables.md` has a context composable throw outside its provider. `useConsoleLayout` keeps that as its default, but takes `{ optional: true }` to return `null` instead: a console page body is also rendered alone (the block's docs preview, its test, the demo shell before the layout is wired) and must not crash there, and the home-dashboard empty variant had already reached for `try` / `catch` around the call. The exception is narrow and explicit at the call site — the bare call still fails loudly, and `ConsoleLayout.Breadcrumb` already does nothing outside a layout for the same reason. A separate `useConsoleLayoutOptional` export was rejected: one entry, one name, typed by overload (`{ optional: true }` returns `ConsoleLayoutContext | null`).
- **Page entrance on every route (2026-11-12).** The `<main>` played `animate-page-enter` once, on the first mount, because the page body changes inside a main that stays. Decided: key the `<main>` on the route path, the Vue idiom (`:key="$route.path"`) moved into the layout so no app has to remember it. The key is a counter bumped by a watcher on the path, not the path itself, so the no-router case (the path is read after mount) and a router's initial navigation from `/` do not remount the body the server rendered. Keyed on the path, not the full URL: a filter or a tab in the query must not replay the entrance or reset the page. Consequence: a `KeepAlive` around `RouterView` no longer keeps pages across routes; cache inside the page body instead. Restarting the CSS animation in place (the Web Animations API or a class toggle with a forced reflow) was rejected: a finished `page-enter` has no fill, so it is gone from `getAnimations()`, and a reflow toggle is timing code nothing can test without CSS.
- **Account selection, label in name and the active row in view (2026-11-14).** The console handled the account menu with `@click` plus `@keydown.enter` on each option, because the layout owns the `DropdownMenu` and did not forward its `select`; keyboard selection was lost otherwise. Decided: the layout re-emits it as `account-select` with `DropdownMenu`'s own `(event, value)` payload, as it does for the palette with `search-select`. The header avatar trigger was named `Account menu` while showing the initials (axe `label-content-name-mismatch`); its name now starts with the visible initials through an interpolated catalog message, rather than hiding the initials with `aria-hidden`, so a speech user can say what they see and a screen reader still hears whose menu it is. A low current row in a long rail rendered under the fade above the account footer; the layout now scrolls the rail's own scroller to it, computing the offset rather than calling `scrollIntoView`, which can also scroll the page and the frame.
- **The environment stays on phones (2026-11-17, owner decision AU5).** While compact the header hid the whole trail, the environment `Select` with it, so a phone user had to remember which environment they were editing (the round-2 audit's working-memory failure). Decided: the crumbs still collapse, but a page trail's control crumbs render in the compact header as a trail of their own (a `Breadcrumb` list holding only the controls, `__page-control`), after the hamburger and in place of the brand, which a 390 px header has no room for beside a control (the brand stays in the navigation drawer). The layout's `breadcrumbs` prop and slot, which hold no controls, stay hidden while compact. A page body that repeated its environment control under `md` because the header hid it drops the repeat.

- **Page help trigger (2026-11-23, in-product help standard, level D).** Agents hand-built page help as a boxed `IconButton` with a `?` opening a `Tooltip`, or wired `toggleTools` from the header into the page. Decided (HELP-B-1): a structural part, `ConsoleLayout.ToolsTrigger`, that the page renders after its title in `PageHeader`'s `meta` slot and that drives the layout's tools region through the context (`toolsOpen`, `openTools`, `closeTools`, `toggleTools`, `toolsId`), as Cloudscape's `Info` link opens its help panel. It is a `Trigger` because the tools region it opens has an open and closed state (`v-model:tools-open`, `data-state` on the trigger). It reuses `Button` `variant="link"` rather than `Link`, because it acts on the page and is not a navigation. The click is emitted before the toggle so one handler can swap the `HelpPanel` topic, and `preventDefault()` lets a page that switches topics keep the region open. Attached to the compound (it composes only `Button`, no overlay or input), with its own flat export.

## Examples

- Default — the layout with console navigation (a drill level and a preview badge), breadcrumbs, header actions, the account menu with an `account-select` handler and a list page body.
- Page opens search — a page body that opens the shared palette with `useConsoleLayout().openSearch()` from its own button.
- Navigation open — `v-model:navigation-open` driven by a `Collapse sidebar` / `Expand sidebar` command in the palette's `search` slot.
- Page breadcrumbs — a detail page body that sets its own trail with `ConsoleLayout.Breadcrumb`, ending on an environment `Select` (`variant="ghost"`, `size="small"`).
- Fill page — a workspace page body whose root carries `data-layout-fill`: the main stops scrolling and the body's own panes scroll.
- Sidebar header — an account switcher in `sidebar-header` under the wordmark, moved to `header-leading` while compact.
- Help info — a page whose `PageHeader` carries `ConsoleLayout.ToolsTrigger` in `meta`, opening a `HelpPanel` topic in the `tools` slot.

The second example is justified: opening the layout's palette from a page body is the integration the page needs and the only way to show the composable. The third is justified: the rail's bound state is behaviour no other example shows, and the palette command is how the console offered it. The fourth is justified: a page-owned trail with a control crumb is the sub-component's whole reason to exist. The fifth is justified: the fill mode only shows with a body that pins its own panes. The sixth is justified: the rail header region only shows with content in it, and the switcher's move to the header while compact is the pattern the slot exists for. The seventh is justified: the page help trigger only shows with a tools region and a help topic to open.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `contributing/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `contributing/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `contributing/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `contributing/docs/TOKENS.md` or `contributing/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `contributing/rules/compound-api.md`.
- Do not change `structure` after `status: draft`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

---
name: console-layout
category: layout
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: fd3194e617a707e1b0dd63b5491e6feeeb4f280b8c91e56e59d167ccc1f2ea98
created: 2026-11-12
last_updated: 2026-11-12
---

# ConsoleLayout — Component Spec

## Purpose

The console chrome, composed once in the app: `AppLayout` with the navigation rail (`Sidebar` + `Menu`, the brand on top and the account at the foot), the global header (breadcrumbs, `SearchTrigger`, the app's own actions and the account avatar) and the `Command` search palette wired to the trigger and to ⌘K / Ctrl K. The navigation is data (`navigation`, each row with an `href` that is followed with the app's router when it is an in-app path), the active row follows the current route, and the page body is the default slot inside the layout's `<main>`. A page opens the palette with `useConsoleLayout().openSearch()`. Platform blocks are only page bodies rendered through this slot; they never carry the chrome themselves.

## When to use

- Every signed-in console page: put one `ConsoleLayout` in the app's root (around `RouterView`) and render each page block as its default slot.
- A product area that needs the console navigation, breadcrumbs, the ⌘K palette and the account menu without hand-composing `AppLayout`, `Sidebar`, `Menu`, `GlobalHeader`, `SearchTrigger` and `Command`.

## When NOT to use

- A focused flow with no navigation rail (a creation wizard, sign-in) → render the page on its own or with the flow's own header.
- Public marketing pages → `SiteLayout`. Documentation → `DocLayout`.
- When the page needs the split panel → compose `AppLayout` directly; `ConsoleLayout` covers the navigation, header, notifications, tools and content regions.

## Related

- `AppLayout` — the frame this layout fills; it owns the compact drawers and the scrolling content region.
- `Sidebar`, `Menu` — the rail and the data-driven navigation tree (`navigation` is mapped onto `Menu` groups).
- `SearchTrigger`, `Command` — the header search and the palette it opens; the palette lists every navigation page.
- `Breadcrumb` — the header trail on wide layouts (`breadcrumbs`).
- `shells/console` — the block that shows this layout with sample console navigation.

## Best practices

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

## Usage

```vue
<script setup lang="ts">
  import ConsoleLayout, { type ConsoleLayoutNavGroup } from '@aziontech/webkit/console-layout'

  const navigation: ConsoleLayoutNavGroup[] = [
    {
      items: [
        { id: 'home', label: 'Home', icon: 'pi pi-home', href: '/' },
        { id: 'workloads', label: 'Workloads', icon: 'ai ai-workloads', href: '/workloads' }
      ]
    }
  ]
</script>

<template>
  <ConsoleLayout
    :navigation="navigation"
    :breadcrumbs="[{ label: 'Workloads' }]"
    :account="{ name: 'Ana', email: 'ana@example.com' }"
  >
    <RouterView />
  </ConsoleLayout>
</template>
```

## Props

| Prop                | Type                      | Default     | Required | JSDoc                                                                                                                                                                         |
| ------------------- | ------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `navigation`        | `ConsoleLayoutNavGroup[]` | `[]`        | false    | The navigation tree: groups of rows, each `{ id, label, icon?, href?, tagValue?, disabled?, kind?, children?, groups? }`; an in-app `href` is followed with the app's router. |
| `activeId`          | `string`                  | `''`        | false    | Id of the current row. Empty matches the current route against each row's `href`.                                                                                             |
| `breadcrumbs`       | `ConsoleLayoutCrumb[]`    | `[]`        | false    | The trail shown in the header on wide layouts; each is `{ label, href? }` and the last one is the current page.                                                               |
| `home`              | `string`                  | `'/'`       | false    | Where the brand mark links.                                                                                                                                                   |
| `account`           | `ConsoleLayoutAccount`    | `undefined` | false    | The signed-in account, `{ name, email?, src? }`, shown at the foot of the rail and as the header avatar; nothing is rendered when absent.                                     |
| `ariaLabel`         | `string`                  | `''`        | false    | Accessible name of the navigation landmark. Empty uses the locale catalog (`Main navigation`).                                                                                |
| `searchPlaceholder` | `string`                  | `''`        | false    | Placeholder of the palette's input. Empty uses the locale catalog (`Search pages and commands`).                                                                              |
| `toolsLabel`        | `string`                  | `''`        | false    | Title of the tools region (help, notifications). Empty uses `AppLayout`'s catalog (`Help`).                                                                                   |

## v-model

| Model                         | Type      | Default | Emits                       | Notes                                                                                                                                                                     |
| ----------------------------- | --------- | ------- | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:search-open`         | `boolean` | `false` | `update:searchOpen`         | Whether the search palette is open; the trigger, ⌘K / Ctrl K and `openSearch()` set it.                                                                                   |
| `v-model:tools-open`          | `boolean` | `false` | `update:toolsOpen`          | Whether the tools region (help or notifications) is open beside the content; a drawer while compact.                                                                      |
| `v-model:navigation-expanded` | `boolean` | `true`  | `update:navigationExpanded` | Whether the navigation rail is expanded on wide layouts; `false` collapses it (the Sidebar's collapsed rail). It has no effect while compact, where the rail is a drawer. |

## Events

| Event           | Payload                                                            | Notes                                                                                                                                                                                          |
| --------------- | ------------------------------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `navigate`      | `(event: MouseEvent \| KeyboardEvent, item: ConsoleLayoutNavItem)` | Fired when a navigation row or a palette page is chosen; the layout then follows its `href` (an in-app path with the app's router). A row without `href` is left to this handler. Event first. |
| `search-select` | `(event: MouseEvent \| KeyboardEvent, value: string \| number)`    | Fired when a palette item from the `search` slot is chosen; `value` is that item's value. Event first.                                                                                         |

## Slots

| Slot            | Scope                                           | Notes                                                                                                                                                                               |
| --------------- | ----------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default`       | —                                               | The page body, rendered inside the layout's `<main>`.                                                                                                                               |
| `actions`       | `{ compact: boolean, toggleTools: () => void }` | The app's header actions, between the search trigger and the avatar; render them icon-only while `compact`; `toggleTools` opens and closes the tools region (a notifications bell). |
| `header-start`  | `{ compact: boolean }`                          | Content at the start of the header, before the breadcrumbs (an account or organization switcher).                                                                                   |
| `breadcrumbs`   | —                                               | A composed trail that replaces the one built from `breadcrumbs` (a last crumb that is an environment `Select`); hidden while compact.                                               |
| `notifications` | —                                               | Flash messages (`Alert`) above the page, kept in view while the page scrolls.                                                                                                       |
| `tools`         | —                                               | The tools region's body (a `HelpPanel` or the notifications list), opened with `v-model:tools-open`.                                                                                |
| `search`        | `{ query: string }`                             | Extra `Command.Group`s (recent resources, commands) listed before the navigation pages in the palette.                                                                              |
| `account-menu`  | —                                               | `DropdownMenu.Group`s of the account menu, opened from the account row in the rail and from the header avatar.                                                                      |

## States

- Visual states: `default`, `compact` (from `AppLayout`: the rail becomes a drawer opened from the header, the breadcrumbs give way to the brand), the palette `open` / `closed`.
- `data-compact` and `data-navigation` come from `AppLayout` on the inner frame.
- Active navigation row: `Menu`'s `activeId`; a row inside a drill level opens that level, a row inside an inline row expands it.
- Not applicable: `loading`, `empty`, `error`, `disabled`, `readonly`, `invalid` (the page body owns its states).

## Motion & Animations

| Trigger         | Animation / Transition                 | Token (see `.claude/docs/DESIGN.md` § Animations) | Reduced-motion fallback         |
| --------------- | -------------------------------------- | ------------------------------------------------- | ------------------------------- |
| page body mount | `animate-page-enter` on the `<main>`   | semantic (`page-enter`)                           | `motion-reduce:animate-none`    |
| brand hover     | `transition-opacity` on the brand link | `duration-fast-02` · `ease-productive-entrance`   | `motion-reduce:transition-none` |
| palette, drawer | `Command`, `AppLayout` drawers         | component                                         | handled by those components     |

## Tokens

| Region                | Token (DESIGN.md)                                      |
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

- Landmarks: the rail is the `Sidebar` `<nav>` named by `ariaLabel`; the header is `GlobalHeader` (`<header>`); the page body is inside the layout's single `<main>`. A page body must not render a second `<main>`.
- Keyboard map: `Tab` runs rail → header → page; `⌘K` / `Ctrl K` opens the palette (owned by `Command`); in the palette `ArrowUp` / `ArrowDown` move, `Enter` chooses, `Escape` closes and returns focus. The rail keyboard map is `Menu`'s; the compact drawer closes on `Escape` and returns focus to the hamburger (`AppLayout`).
- Names: the compact hamburger (`Open navigation`), the brand link (`Azion home`), the account trigger (`Account menu`) come from the locale catalog; the avatar carries the account name.
- Visible focus: every interactive part is a WebKit control with its own ring; the brand link and the avatar button use `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Choosing a row in the compact drawer closes it.

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

## Right-to-left

- Layout: logical utilities only; the rail sits at the inline start and `AppLayout` mirrors the drawer side.
- Icons: the breadcrumb separator and `Menu.Back` mirror through their own components; the brand and avatar are not mirrored.
- Keyboard: arrow handling is `Menu`'s and `Command`'s, both direction-aware.
- User data: labels render with `dir="auto"` inside `Menu`, `Breadcrumb` and `Command`.

## Responsive

- Container queries: `AppLayout` measures its own width; below its `compactBelow` the rail is a drawer and the header shows the hamburger and the brand instead of the breadcrumbs. The header bar is an `@container`, so `SearchTrigger collapsible` folds to the magnifier on narrow headers.
- Narrow: the `actions` slot receives `compact` so the app renders icon-only actions; the breadcrumb truncates. Below the header's `@xs` (a 320 px phone) the header drops the brand mark and keeps the hamburger, so `header-start` and the actions fit; the brand stays in the navigation drawer.
- Touch: hamburger and avatar keep the 32 px controls of `IconButton` / `Avatar` and grow on coarse pointers through those components.
- Reflow: no horizontal scroll at 320 px; the page body scrolls inside `AppLayout`'s content region.

## Performance

- Bundle budget: 66 KB gzip for `./console-layout` in `.size-limit.json` (64.3 KB measured; it pulls `AppLayout`, `Sidebar`, `Menu`, `GlobalHeader`, `Breadcrumb`, `SearchTrigger`, `Command`, `DropdownMenu`, `Avatar`, `Tooltip`).
- Runtime budget: one `popstate` listener when no router is installed; the active row is a computed match over the navigation leaves.
- Heavy parts: none beyond the composed components; the palette content renders only while open (`Command`).

## Examples

- Default — the layout with console navigation (a drill level and a preview badge), breadcrumbs, header actions, the account menu and a list page body.
- Page opens search — a page body that opens the shared palette with `useConsoleLayout().openSearch()` from its own button.
- Navigation expanded — `v-model:navigation-expanded` driven by a `Collapse sidebar` / `Expand sidebar` command in the palette's `search` slot.

The second example is justified: opening the layout's palette from a page body is the integration the page needs and the only way to show the composable. The third is justified: the rail's bound state is behaviour no other example shows, and the palette command is how the console offered it.

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

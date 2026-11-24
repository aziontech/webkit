---
name: conversation-history
category: ai
structure: monolithic
status: implemented
spec_version: 8
template: 2
checksum: 8008e66953e50d2af77d0b86472e8e4cd12be8f11ca3f7a206a0dddd228fd1c1
created: 2026-11-11
last_updated: 2026-11-23
---

# ConversationHistory — Component Spec

## Purpose

The list of past conversations with an assistant, in a side panel on wide screens or a `Drawer` on phones: plain rows of titles grouped by when they were last active (Today, Yesterday, Previous 7 days, Previous 30 days, Older), the open one marked current, an optional Delete per row, and at the top an optional New chat row and a search field that filters the titles. With `projects` the panel organises chats like a chat sidebar: a Projects section (a collapsible header with an Organize menu that sorts the projects and an optional New project button, then one folder row per project that expands in place to show its chats) above a Recents section that holds the chats outside any project, still in their date groups. Choosing a row sets `v-model` to its id; the owner loads that conversation into `Conversation`.

## When to use

- An assistant keeps past conversations and the person returns to one.
- The left rail or a drawer of a chat page.

## When NOT to use

- Messages of the open conversation → `Conversation`.
- Navigation between product areas → `Sidebar` or `NavigationMenu`.
- A searchable table of records → `TableRoot`.

## Related

- `conversation` — shows the conversation the history selects.
- `drawer` — holds the history on narrow screens.

## Best practices

- Title each conversation from its first prompt, short; a title cut off by the panel width shows in full on hover through `title`.
- Put it in a side panel beside the conversation on wide screens and in a `Drawer` (`side="start"`) opened from a menu button on phones; close the drawer from `update:modelValue` and `create` so the chosen conversation shows at once (the Default example).
- Turn on `creatable` when the page has no other New chat control, and `searchable` once the list is long enough to scroll.
- Pass `projects` once people can file chats into projects; set `projectId` on each chat that belongs to one. Turn on `projectCreatable` and open the owner's own create-project dialog from `project-create`. Keep `v-model:openKeys`, `v-model:projectsOpen` and `v-model:projectSort` in the app's preferences when the panel should reopen the way the person left it.
- Fix the reference time so the groups match on the server and the client: set `now` on the app's `ConfigProvider` once (every time-relative component below reads it), or pass `now` here to override it for this list.
- Never delete on the first tap: open a `ConfirmDialog` from the `remove` handler and remove the item from `@confirm` (the Default example), or remove it at once and offer Undo in a toast.

## Usage

```vue
<script setup>
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import { ref } from 'vue'

  const items = [
    { id: 'c1', title: 'Purge the cache', updatedAt: '2026-11-11T09:12:00Z' },
    { id: 'c2', title: 'Fix the 502 errors', updatedAt: '2026-11-11T08:00:00Z', projectId: 'p1' }
  ]
  const active = ref('c1')
  const openProjects = ref(['p1'])
  const createProject = () => {}
</script>

<template>
  <ConversationHistory
    v-model="active"
    :items="items"
    creatable
    searchable
    @create="active = null"
  />

  <ConversationHistory
    v-model="active"
    v-model:open-keys="openProjects"
    :items="items"
    :projects="[{ id: 'p1', title: 'storefront' }]"
    project-creatable
    @project-create="createProject"
  />
</template>
```

## Props

| Prop               | Type                                                                                       | Default     | Required | JSDoc                                                                                                                                                                    |
| ------------------ | ------------------------------------------------------------------------------------------ | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `items`            | `{ id: string; title: string; updatedAt: string \| number \| Date; projectId?: string }[]` | `[]`        | false    | Conversations, any order; they are sorted newest first inside their group or project. A `projectId` that matches a project puts the chat under it instead of in Recents. |
| `projects`         | `{ id: string; title: string }[]`                                                          | `[]`        | false    | Projects shown in a Projects section above Recents; empty keeps the plain date groups.                                                                                   |
| `now`              | `string \| number \| Date`                                                                 | `undefined` | false    | Reference time for the groups. Empty uses the nearest `ConfigProvider`'s `now`, then the current time; set either when the list is rendered on the server.               |
| `removable`        | `boolean`                                                                                  | `false`     | false    | Shows a Delete button on each row that emits `remove`.                                                                                                                   |
| `creatable`        | `boolean`                                                                                  | `false`     | false    | Shows a New chat row at the top that emits `create`.                                                                                                                     |
| `projectCreatable` | `boolean`                                                                                  | `false`     | false    | Shows a New project button in the Projects header that emits `project-create`; the section shows even with no projects yet.                                              |
| `searchable`       | `boolean`                                                                                  | `false`     | false    | Shows a search field at the top that hides conversations whose title does not contain the typed text.                                                                    |
| `loading`          | `boolean`                                                                                  | `false`     | false    | Shows placeholder rows while the history loads.                                                                                                                          |
| `ariaLabel`        | `string`                                                                                   | `''`        | false    | Accessible name of the list. Empty uses the locale catalog (`Conversation history`).                                                                                     |

## v-model

| Model                  | Type                                                    | Default    | Emits                 | Notes                                                                                                                                                                 |
| ---------------------- | ------------------------------------------------------- | ---------- | --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model`              | `string \| null`                                        | `null`     | `update:modelValue`   | Id of the open conversation; its row is `aria-current="page"`, in a project or in Recents.                                                                            |
| `v-model:openKeys`     | `string[]`                                              | `[]`       | `update:openKeys`     | Ids of the expanded projects.                                                                                                                                         |
| `v-model:projectsOpen` | `boolean`                                               | `true`     | `update:projectsOpen` | Whether the Projects section is expanded (its header chevron).                                                                                                        |
| `v-model:projectSort`  | `'recent' \| 'name'` (`ConversationHistoryProjectSort`) | `'recent'` | `update:projectSort`  | Order of the projects, set from the Organize menu: by their newest conversation (projects without chats keep the given order, last), or by name in the active locale. |

## Events

| Event            | Payload                           | When                                                                                           |
| ---------------- | --------------------------------- | ---------------------------------------------------------------------------------------------- |
| `remove`         | `(event: MouseEvent, id: string)` | Delete pressed on a row (with `removable`); `id` is the row's item id. The owner removes it.   |
| `create`         | `(event: MouseEvent)`             | New chat pressed (with `creatable`). The owner starts an empty conversation.                   |
| `project-create` | `(event: MouseEvent)`             | New project pressed (with `projectCreatable`). The owner asks for a name and adds the project. |

## Slots

_none_

## States

- Groups render only when they have items; inside a group, newest first.
- Projects (with `projects` or `projectCreatable`): a Projects header (`data-state="open|closed"`, chevron down when open, toward the inline end when closed), then one row per project with a folder glyph (`az-folder`, `az-folder-open` while expanded). An expanded project lists its chats indented under it, newest first, or one muted line `No chats in this project yet.`. A Recents label then heads the date groups of the chats outside any project; with no such chat it is not shown. A `projectId` that matches no project leaves the chat in Recents.
- Organize: an `IconButton` (`az-sliders-horizontal`) shown with two or more projects opens a `DropdownMenu` with a Sort by group of two radio items, Recent activity and Name; the checked one is `v-model:projectSort`.
- Search across projects: while the search field holds text, the Projects section and every project with a matching chat show expanded with only their matches, projects without a match are hidden, and Recents keeps only its matches; `v-model:openKeys` and `v-model:projectsOpen` are not changed, so clearing the search restores the previous layout.
- Rows: every row (New chat, the Projects header, project rows, chats in a project, chats in Recents and the date groups) is the menu row of `SidebarMenuItem`: 32 px tall (44 px on coarse pointers), the fill inset 1 px from the top and bottom edge (`border-y border-transparent bg-clip-padding`, `forced-colors:border-y-0`) so two filled rows keep a 2 px gap, and no gap between the rows of a list.
- Hover and keyboard focus: the row fills with the hover surface; the Projects header also turns its label to the default text colour.
- Active row: `data-active` and `aria-current="page"`, the selected surface.
- Cut-off title: a chat or project title too long for the row truncates on one line; when the pointer enters a row whose title is cut off, the row's `title` holds the full title, and a row whose title fits has no `title`.
- Empty: one muted line, `No conversations yet.`; the Projects section still shows above it when it has projects or `projectCreatable`.
- No match: while the search field holds text that no title contains, one muted line, `No conversations match “{query}”.`; New chat and the search field stay.
- Loading: `aria-busy="true"` and five skeleton rows; no group headings.

## Motion & Animations

| Trigger                    | Animation / Transition               | Token                                           | Reduced-motion fallback         |
| -------------------------- | ------------------------------------ | ----------------------------------------------- | ------------------------------- |
| row hover / focus / active | background colour                    | `transition-colors` (the `SidebarMenuItem` row) | `motion-reduce:transition-none` |
| row hover / focus          | Delete fades in (fine pointers only) | `duration-fast-02 ease-productive-entrance`     | `motion-reduce:transition-none` |
| section header hover       | background and text colour           | `transition-colors` (the `SidebarMenuItem` row) | `motion-reduce:transition-none` |

## Tokens

| Region                    | Token                                                                                                                                                                                                                                                                                                          |
| ------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| group label, Recents      | the `SidebarMenuGroup` label: `min-h-8`, `var(--spacing-sm)` inline padding, `.text-label-sm`, `var(--text-muted)`                                                                                                                                                                                             |
| section header (Projects) | the row geometry below with `.text-label-sm`, `var(--text-muted)`; `var(--bg-hover)` and `var(--text-default)` on hover                                                                                                                                                                                        |
| project row, New chat     | the row below with a 32 px icon box (`var(--spacing-2xs)` start padding) and a 16 px glyph in `var(--text-muted)`, `var(--text-default)` on hover; a project's chats indent by `var(--spacing-md)`                                                                                                             |
| Organize, New project     | `IconButton` `variant="ghost"` `size="small"`; the menu is `DropdownMenu`                                                                                                                                                                                                                                      |
| row                       | `SidebarMenuItem`'s row: `h-8`, `pointer-coarse:min-h-11`, padding `var(--spacing-xs)` end, `var(--spacing-2xs)` block, `var(--spacing-sm)` start, `.text-label-md`, `var(--text-default)`, `var(--bg-hover)`, `var(--bg-selected)`, focus ring `var(--ring-color)` 2 px with a 2 px `var(--bg-canvas)` offset |
| row radius                | `var(--shape-control)`                                                                                                                                                                                                                                                                                         |
| search                    | `Input` (its own `var(--shape-control)`) with the `az-search` glyph                                                                                                                                                                                                                                            |
| empty                     | `.text-body-sm`, `var(--text-muted)`                                                                                                                                                                                                                                                                           |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is a `nav` named by `ariaLabel`; each group is a `ul` labelled by its visible heading (`aria-labelledby`).
- Each conversation is a `button` with its title as the name; the open one carries `aria-current="page"`. A row's `title` is set only while its visible title is cut off, so it never repeats a name the row already shows.
- Delete is an `IconButton` named `Delete <title>` on every row. On touch it is always shown; with a fine pointer it fades in on hover, on keyboard focus inside the row and on the open row, and it is always in the tab order, so it is reachable by keyboard, pointer and touch.
- The Projects header is a `button` named `Projects` with `aria-expanded` and `aria-controls` on the project list, which is a `ul` labelled by it. Each project is a `button` named by its title with `aria-expanded` and `aria-controls`; its chats are a `ul` labelled by that button. Recents is a visible label; the date groups under it keep their own labelled lists.
- Organize is an `IconButton` named `Organize projects` that opens a `menu` (`DropdownMenu`: arrow keys move, `Enter`/`Space` check, `Esc` closes and returns focus); Sort by is a `group` of two `menuitemradio`s with `aria-checked`. New project is an `IconButton` named `New project`.
- New chat is a `button` named `New chat`, first in the list. The search field is an `Input` with `role="searchbox"` (and `enterkeyhint="search"`) named `Search conversations`; filtering announces nothing, the rows change in place.
- Keyboard: `Tab` moves through the section header, Organize, New project, project rows, rows and their Delete; `Enter`/`Space` open a conversation or expand and collapse a project or the Projects section.
- Focus after a delete: when the owner removes the item whose Delete was pressed and focus was lost with it (on `body`, or on the closed `ConfirmDialog`), focus moves to the conversation that took its place, else the last one, else the list itself (`tabindex="-1"`). Tests: `conversation-history.test.ts` › moves focus to the next row after a delete.
- Loading sets `aria-busy` on the list.

## Internationalization

| Key                                     | English source                      | Override prop |
| --------------------------------------- | ----------------------------------- | ------------- |
| `conversationHistory.label`             | `Conversation history`              | `ariaLabel`   |
| `conversationHistory.today`             | `Today`                             | —             |
| `conversationHistory.yesterday`         | `Yesterday`                         | —             |
| `conversationHistory.previous7`         | `Previous 7 days`                   | —             |
| `conversationHistory.previous30`        | `Previous 30 days`                  | —             |
| `conversationHistory.older`             | `Older`                             | —             |
| `conversationHistory.emptyTitle`        | `No conversations yet.`             | —             |
| `conversationHistory.delete`            | `Delete {title}`                    | —             |
| `conversationHistory.newChat`           | `New chat`                          | —             |
| `conversationHistory.search`            | `Search conversations`              | —             |
| `conversationHistory.noMatch`           | `No conversations match “{query}”.` | —             |
| `conversationHistory.projects`          | `Projects`                          | —             |
| `conversationHistory.recents`           | `Recents`                           | —             |
| `conversationHistory.newProject`        | `New project`                       | —             |
| `conversationHistory.organizeProjects`  | `Organize projects`                 | —             |
| `conversationHistory.sortBy`            | `Sort by`                           | —             |
| `conversationHistory.sortRecent`        | `Recent activity`                   | —             |
| `conversationHistory.sortName`          | `Name`                              | —             |
| `conversationHistory.projectEmptyTitle` | `No chats in this project yet.`     | —             |

- Groups use calendar days in the browser's time zone, not 24-hour windows.
- Search compares titles case-insensitively with `toLocaleLowerCase` in the active locale.
- Sorting projects by name uses `localeCompare` in the active locale.

## Right-to-left

- Layout: logical spacing; Delete sits at the inline end of the row.
- Icons: the trash, pen, search, folder, plus and sliders glyphs are not mirrored; the collapsed section chevron (`az-chevron-right`) mirrors with the stylesheet, so it points to the inline end; project chats indent from the inline start.
- Keyboard: none beyond `Tab`.
- User data: conversation and project titles render in `<bdi>` with `dir="auto"`.

## Responsive

- Container queries: none; it fills the width it is given.
- Narrow: titles truncate on one line; a cut-off title shows in full in `title` on hover.
- Touch: every row is 44 px tall on coarse pointers (32 px with a fine pointer), the menu row of `SidebarMenuItem`; Delete sits at the row's inline end inside that 44 px band, keeps its 40 px touch target and is always shown. Organize and New project keep the `IconButton` touch target.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 12.1 KB gzip for `./conversation-history` in `.size-limit.json`, entry only (includes `useLazyChunks` and the search `Input`). The Organize menu (`DropdownMenu`) is a lazy chunk that loads when a list has two or more projects; until it lands a disabled Organize button holds its place.
- Runtime budget: one linear grouping pass per `items` change, plus one sort of the projects. Project chat lists are not chunked; a project holds a handful of chats. A group longer than 300 rows mounts in chunks of 100 (`useLazyChunks`): the first chunk renders, the rest are placeholders sized at 32 px a row that mount as they scroll near the viewport. `conversation-history-5k` in `perf-budgets.json` holds mounting 5k conversations and selecting one.
- Heavy parts: none.

## Examples

- Default — a chat page: the history in a side panel beside the conversation on wide screens and in a start-side `Drawer` opened from a menu button on phones, with New chat, search, conversations across all five groups, one open, and Delete on each row that asks in a `ConfirmDialog` before it removes the conversation.
- States — Empty and Loading.
- Projects — a chat side panel with three projects (one expanded), New project, the Organize menu and Recents below; the app keeps the projects and adds one on `project-create`.

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

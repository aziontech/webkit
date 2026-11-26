---
name: conversation-history
category: ai
structure: monolithic
status: implemented
spec_version: 11
template: 2
checksum: 975443459e654aa53cfa0cd23b3893bb6bdc6efe3c4f31afdd910f90dda0b1c3
created: 2026-11-11
last_updated: 2026-11-23
---

# ConversationHistory — Component Spec

## Purpose

The chat list of an assistant, in a side panel or a `Drawer` on phones: rows grouped by last activity (Today, Yesterday, Previous 7 days, Previous 30 days, Older) or by status (Working, Settled), the open one current, pinned chats on top, an optional Projects section of folders that expand in place, and on top a New chat row, a search field or a toolbar whose Search button opens the app's palette. A row is a title or a rich row (tag, description, age, status); per-row actions (pin, rename, share, lock, move, archive, delete) sit on hover and in a `DropdownMenu`. Choosing a row sets `v-model` to its id.

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

- Title each conversation from its first prompt, short.
- Put it beside the conversation on wide screens and in a start-side `Drawer` on phones; close the drawer from `update:modelValue` and `create`.
- Fix `now` on the app's `ConfigProvider` (or here) so groups and ages match on the server and the client.
- The component never changes `items`: apply each action event to the data (flip `pinned`, `archived`, `locked`, set `projectId`, the new `title`).
- Never delete on the first tap: open a `ConfirmDialog` from `remove` / `project-remove`, or remove at once and offer Undo.
- With `showToolbar`, open the app's `Command` palette from `search-open`; a mounted `Command` claims ⌘K, so the Search button does not bind it twice.

## Usage

```vue
<script setup>
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import { ref } from 'vue'

  const items = ref([
    { id: 'c1', title: 'Purge the cache', updatedAt: '2026-11-11T09:12:00Z', pinned: true },
    { id: 'c2', title: 'Fix the 502 errors', updatedAt: '2026-11-11T08:00:00Z', projectId: 'p1' }
  ])
  const active = ref('c1')
  const pin = (event, item) => {
    items.value = items.value.map((c) => (c.id === item.id ? { ...c, pinned: !c.pinned } : c))
  }
</script>

<template>
  <ConversationHistory
    v-model="active"
    :items="items"
    :projects="[{ id: 'p1', title: 'storefront' }]"
    :item-actions="['pin', 'rename', 'move', 'archive']"
    creatable
    removable
    show-toolbar
    @item-pin="pin"
  />
</template>
```

## Props

| Prop               | Type                                                                | Default     | Required | JSDoc                                                                                                                            |
| ------------------ | ------------------------------------------------------------------- | ----------- | -------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `items`            | `ConversationHistoryItem[]`                                         | `[]`        | false    | Conversations, any order; sorted newest first in their group or project.                                                         |
| `projects`         | `ConversationHistoryProject[]`                                      | `[]`        | false    | Projects shown in a Projects section above Recents; empty keeps the plain groups.                                                |
| `now`              | `string \| number \| Date`                                          | `undefined` | false    | Reference time for groups and ages. Empty uses the nearest ConfigProvider now, then the current time.                            |
| `removable`        | `boolean`                                                           | `false`     | false    | Lets each row be deleted (emits `remove`): a Delete button, or Delete in the row menu when `itemActions` is set.                 |
| `creatable`        | `boolean`                                                           | `false`     | false    | Shows New chat (a row, or a toolbar button with `showToolbar`) that emits `create`.                                              |
| `projectCreatable` | `boolean`                                                           | `false`     | false    | Shows New project (in the Projects header, or the toolbar) that emits `project-create`.                                          |
| `searchable`       | `boolean`                                                           | `false`     | false    | Shows a search field that hides conversations whose title does not contain the typed text.                                       |
| `showToolbar`      | `boolean`                                                           | `false`     | false    | Shows a top toolbar: a Search button that emits `search-open`, then New project and New chat as icon buttons.                    |
| `itemActions`      | `('pin' \| 'rename' \| 'share' \| 'lock' \| 'move' \| 'archive')[]` | `[]`        | false    | Row actions: a Pin button and a More menu on each row; `move` needs `projects`.                                                  |
| `projectActions`   | `('pin' \| 'settings' \| 'remove' \| 'chat-create')[]`              | `[]`        | false    | Project row actions: a More menu (pin, settings, remove) and a New chat button (`chat-create`).                                  |
| `groupBy`          | `'date' \| 'status'`                                                | `'date'`    | false    | Groups chats outside projects by last activity, or into Working (`status: 'running'`) and Settled (the rest and archived chats). |
| `showTime`         | `boolean`                                                           | `false`     | false    | Shows each chat's age (`10m`, `15h`, `3d`) at the end of its row.                                                                |
| `loading`          | `boolean`                                                           | `false`     | false    | Shows placeholder rows while the history loads.                                                                                  |
| `ariaLabel`        | `string`                                                            | `''`        | false    | Accessible name of the list. Empty uses the locale catalog (`Conversation history`).                                             |

Item fields (`ConversationHistoryItem`): `id`, `title`, `updatedAt` (sets the group, the order and the age), and optional `projectId` (files it under that project), `pinned` (Pinned group on top), `archived` (hidden by date; under Settled by status), `locked` (lock glyph, Unlock in the menu), `status` (`'running' | 'success' | 'error'`, `ConversationHistoryStatus`: running shows a `Spinner`, error a danger mark), `tag` (a short `Tag` before the title) and `description` (a second line). A project (`ConversationHistoryProject`) has `id`, `title` and optional `pinned` (listed first).

## v-model

| Model                     | Type                                                    | Default                  | Emits                    | Notes                                                                                                |
| ------------------------- | ------------------------------------------------------- | ------------------------ | ------------------------ | ---------------------------------------------------------------------------------------------------- |
| `v-model`                 | `string \| null`                                        | `null`                   | `update:modelValue`      | Id of the open conversation; its row is `aria-current="page"`.                                       |
| `v-model:openKeys`        | `string[]`                                              | `[]`                     | `update:openKeys`        | Ids of the expanded projects.                                                                        |
| `v-model:projectsOpen`    | `boolean`                                               | `true`                   | `update:projectsOpen`    | Whether the Projects section is expanded.                                                            |
| `v-model:projectSort`     | `'recent' \| 'name'` (`ConversationHistoryProjectSort`) | `'recent'`               | `update:projectSort`     | Project order from the Organize menu: by newest chat (empty projects last) or by name; pinned first. |
| `v-model:openSectionKeys` | `string[]`                                              | `['recents', 'working']` | `update:openSectionKeys` | Expanded sections, of `recents`, `working`, `settled` (`ConversationHistorySection`).                |

## Events

| Event                   | Payload                                                                     | When                                                                            |
| ----------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------- |
| `remove`                | `(event: MouseEvent \| KeyboardEvent, id: string)`                          | Delete chosen on a row (with `removable`).                                      |
| `create`                | `(event: MouseEvent)`                                                       | New chat pressed (with `creatable`).                                            |
| `project-create`        | `(event: MouseEvent)`                                                       | New project pressed (with `projectCreatable`).                                  |
| `search-open`           | `(event: MouseEvent \| KeyboardEvent)`                                      | The toolbar Search button pressed, or ⌘K / Ctrl+K (with `showToolbar`).         |
| `item-pin`              | `(event: MouseEvent \| KeyboardEvent, item: ConversationHistoryItem)`       | Pin or Unpin chosen; flip `item.pinned`.                                        |
| `item-rename`           | `(event: KeyboardEvent \| FocusEvent, payload: { item; title: string })`    | A new title saved from the inline rename field (Enter or blur; Escape cancels). |
| `item-share`            | `(event: MouseEvent \| KeyboardEvent, item: ConversationHistoryItem)`       | Share chosen.                                                                   |
| `item-lock`             | `(event: MouseEvent \| KeyboardEvent, item: ConversationHistoryItem)`       | Lock or Unlock chosen; flip `item.locked`.                                      |
| `item-move`             | `(event: MouseEvent \| KeyboardEvent, payload: { item; project })`          | A project chosen in Move to project; set `item.projectId`.                      |
| `item-archive`          | `(event: MouseEvent \| KeyboardEvent, item: ConversationHistoryItem)`       | Archive or Unarchive chosen; flip `item.archived`.                              |
| `project-pin`           | `(event: MouseEvent \| KeyboardEvent, project: ConversationHistoryProject)` | Pin or Unpin project chosen; flip `project.pinned`.                             |
| `project-settings-open` | `(event: MouseEvent \| KeyboardEvent, project: ConversationHistoryProject)` | Project settings chosen.                                                        |
| `project-remove`        | `(event: MouseEvent \| KeyboardEvent, project: ConversationHistoryProject)` | Delete project chosen.                                                          |
| `project-chat-create`   | `(event: MouseEvent, project: ConversationHistoryProject)`                  | New chat in project pressed.                                                    |

## Slots

| Slot           | Scope                               | Notes                                                                                                                                                                                                                                                                                                                                                     |
| -------------- | ----------------------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `item`         | `{ item: ConversationHistoryItem }` | Replaces a chat row's tag, title and description; the row keeps its button and actions.                                                                                                                                                                                                                                                                   |
| `item-meta`    | `{ item: ConversationHistoryItem }` | Replaces the end of a chat row (age, lock, status).                                                                                                                                                                                                                                                                                                       |
| `item-actions` | `{ item: ConversationHistoryItem }` | Replaces the row actions (Pin, More, Delete) with the app's own controls, outside the row button; they show like the built-in actions. The row content keeps its place while they show; set `--conversation-history-item-actions-width` on the list to make the row end that wide while they show (default: the row's own end padding, so nothing moves). |

## States

- Order from the top: toolbar, New chat row and search, Pinned, Projects, then Recents (by date) or Working and Settled (by status). A group renders only with items; inside a group, newest first. Pinned (`pinned`, not `archived`) leaves its project or group. By date, archived chats show nowhere.
- Sections: Projects, Recents (shown with Projects), Working and Settled are collapsible headers (`data-state="open|closed"`, chevron down when open, toward the inline end when closed); Working and Settled show their count. A collapsed section mounts no rows. Pinned and the date groups are labels.
- Projects: one folder row per project (`az-folder`, `az-folder-open` expanded) whose chats indent under it, or `No chats in this project yet.`; a `projectId` matching no project stays outside. Organize (two or more projects) opens a `DropdownMenu` with Sort by, Recent activity and Name.
- Search: matching projects and sections show expanded with only their matches; the models do not change.
- Rows: the `SidebarMenuItem` menu row, 32 px (44 px on coarse pointers), fill inset 1 px top and bottom (`border-y border-transparent bg-clip-padding`, `forced-colors:border-y-0`) for a 2 px gap between filled rows, no list gap. A row with a `description` is 56 px: title over the description (`text-body-xs`, muted, one line), `var(--spacing-xs)` block padding. Hover and focus fill the row; the active row is `data-active`, the selected surface.
- Row end: the age (`showTime`, narrow units in the active locale, `now` under a minute), a lock glyph (`locked`), a `Spinner` (running) or `az-circle-alert` in `var(--text-danger)` (error).
- Row actions: Pin and More (`itemActions`), or Delete alone (`removable` only), at the inline end; with a fine pointer they show on hover, focus inside the row, the active row and an open menu, on touch always. The `item-actions` slot replaces them with the app's own controls (Snooze, Settle), rendered as a sibling of the row button so the row never nests one control in another. More opens Pin (P), Rename (R), Share, Lock, Move to project (a sub-menu of the other projects), Archive (A), then Delete in `var(--text-danger)`; labels flip to Unpin, Unlock, Unarchive. Letter hints are `DropdownMenu.Item` `command`s, mounted only while the menu is open.
- Project actions: New chat (`az-square-pen`) and More: Pin project, Project settings, then Delete project in danger.
- Rename: the row becomes an `Input` holding the title; Enter or blur saves a changed, non-empty title, Escape cancels; Enter and Escape return focus to the row.
- Cut-off title: the row's `title` holds the full title only while it is cut off.
- Empty: `No conversations yet.`; no match: `No conversations match “{query}”.`. Loading: `aria-busy` and five skeleton rows.

## Motion & Animations

| Trigger                    | Animation / Transition              | Token                                           | Reduced-motion fallback         |
| -------------------------- | ----------------------------------- | ----------------------------------------------- | ------------------------------- |
| row hover / focus / active | background colour                   | `transition-colors` (the `SidebarMenuItem` row) | `motion-reduce:transition-none` |
| row hover / focus          | row actions fade in (fine pointers) | `duration-fast-02 ease-productive-entrance`     | `motion-reduce:transition-none` |
| section header hover       | background and text colour          | `transition-colors` (the `SidebarMenuItem` row) | `motion-reduce:transition-none` |

## Tokens

| Region                | Token                                                                                                                                                                                                                                                                                            |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| group label           | `min-h-8`, `var(--spacing-sm)` inline padding, `.text-label-sm`, `var(--text-muted)`                                                                                                                                                                                                             |
| section header        | the row below with `.text-label-sm`, `var(--text-muted)`; `var(--bg-hover)` and `var(--text-default)` on hover                                                                                                                                                                                   |
| project row, New chat | a 32 px icon box (`var(--spacing-2xs)` start padding), a 16 px glyph in `var(--text-muted)`; project chats indent `var(--spacing-md)`                                                                                                                                                            |
| row                   | `h-8`, `pointer-coarse:min-h-11`, padding `var(--spacing-xs)` end, `var(--spacing-2xs)` block, `var(--spacing-sm)` start, `.text-label-md`, `var(--text-default)`, `var(--bg-hover)`, `var(--bg-selected)`, `var(--shape-control)`, ring `var(--ring-color)` 2 px offset 2 px `var(--bg-canvas)` |
| rich row              | `min-h-14`, `var(--spacing-xs)` block padding; description `.text-body-xs` `var(--text-muted)`; age `.text-label-sm` `var(--text-muted)`; tag `Tag` `severity="neutral"` `size="small"`                                                                                                          |
| actions, toolbar      | `IconButton` `variant="ghost"`, `small` on rows, `medium` beside the `SearchTrigger`; menus `DropdownMenu`; danger items `var(--text-danger)`                                                                                                                                                    |
| search, rename        | `Input`                                                                                                                                                                                                                                                                                          |
| empty                 | `.text-body-sm`, `var(--text-muted)`                                                                                                                                                                                                                                                             |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is a `nav` named by `ariaLabel`; each group is a `ul` labelled by its heading (`aria-labelledby`).
- A chat is a `button` named by its title (`aria-labelledby`), described by its description and end (`aria-describedby`: age, `Locked`, `Working`, `Failed`); the open one is `aria-current="page"`.
- Section headers and project rows are `button`s with `aria-expanded` and `aria-controls`; the list they open is labelled by them. A header with a count is named `Working 2`.
- Row actions are `IconButton`s named `Pin <title>` / `Unpin <title>`, `More actions for <title>`, `Delete <title>`, `New chat in <project>`; always in the tab order. More and Organize open a `menu` (arrow keys, `Enter`/`Space`, `ArrowRight` opens Move to project, `Esc` closes and returns focus). After Pin, Lock, Archive or Move to project, focus follows the chat to its new place (the row button, marked `data-key`); a chat that no longer shows hands focus to the nearest row, as Delete does.
- The toolbar Search is a `SearchTrigger` (`aria-keyshortcuts`); the search field is a `searchbox` named `Search conversations`; the rename field is named `Rename <title>`.
- Focus after a delete: when the removed row took focus with it, focus moves to the row in its place, else the last, else the list (`tabindex="-1"`).

## Internationalization

| Key                                     | English source                                                          | Override prop |
| --------------------------------------- | ----------------------------------------------------------------------- | ------------- |
| `conversationHistory.label`             | `Conversation history`                                                  | `ariaLabel`   |
| `conversationHistory.today`             | `Today`                                                                 | —             |
| `conversationHistory.yesterday`         | `Yesterday`                                                             | —             |
| `conversationHistory.previous7`         | `Previous 7 days`                                                       | —             |
| `conversationHistory.previous30`        | `Previous 30 days`                                                      | —             |
| `conversationHistory.older`             | `Older`                                                                 | —             |
| `conversationHistory.emptyTitle`        | `No conversations yet.`                                                 | —             |
| `conversationHistory.emptyDescription`  | `Your chats with the assistant appear here after you ask it something.` | —             |
| `conversationHistory.delete`            | `Delete {title}`                                                        | —             |
| `conversationHistory.newChat`           | `New chat`                                                              | —             |
| `conversationHistory.search`            | `Search conversations`                                                  | —             |
| `conversationHistory.noMatch`           | `No conversations match “{query}”.`                                     | —             |
| `conversationHistory.projects`          | `Projects`                                                              | —             |
| `conversationHistory.recents`           | `Recents`                                                               | —             |
| `conversationHistory.newProject`        | `New project`                                                           | —             |
| `conversationHistory.organizeProjects`  | `Organize projects`                                                     | —             |
| `conversationHistory.sortBy`            | `Sort by`                                                               | —             |
| `conversationHistory.sortRecent`        | `Recent activity`                                                       | —             |
| `conversationHistory.sortName`          | `Name`                                                                  | —             |
| `conversationHistory.projectEmptyTitle` | `No chats in this project yet.`                                         | —             |
| `conversationHistory.pinned`            | `Pinned`                                                                | —             |
| `conversationHistory.working`           | `Working`                                                               | —             |
| `conversationHistory.settled`           | `Settled`                                                               | —             |
| `conversationHistory.failed`            | `Failed`                                                                | —             |
| `conversationHistory.locked`            | `Locked`                                                                | —             |
| `conversationHistory.justNow`           | `now`                                                                   | —             |
| `conversationHistory.searchChats`       | `Search chats`                                                          | —             |
| `conversationHistory.pin`               | `Pin`                                                                   | —             |
| `conversationHistory.unpin`             | `Unpin`                                                                 | —             |
| `conversationHistory.pinTitle`          | `Pin {title}`                                                           | —             |
| `conversationHistory.unpinTitle`        | `Unpin {title}`                                                         | —             |
| `conversationHistory.moreActions`       | `More actions for {title}`                                              | —             |
| `conversationHistory.rename`            | `Rename`                                                                | —             |
| `conversationHistory.renameTitle`       | `Rename {title}`                                                        | —             |
| `conversationHistory.share`             | `Share`                                                                 | —             |
| `conversationHistory.lock`              | `Lock`                                                                  | —             |
| `conversationHistory.unlock`            | `Unlock`                                                                | —             |
| `conversationHistory.moveToProject`     | `Move to project`                                                       | —             |
| `conversationHistory.archive`           | `Archive`                                                               | —             |
| `conversationHistory.unarchive`         | `Unarchive`                                                             | —             |
| `conversationHistory.remove`            | `Delete`                                                                | —             |
| `conversationHistory.pinProject`        | `Pin project`                                                           | —             |
| `conversationHistory.unpinProject`      | `Unpin project`                                                         | —             |
| `conversationHistory.projectSettings`   | `Project settings`                                                      | —             |
| `conversationHistory.removeProject`     | `Delete project`                                                        | —             |
| `conversationHistory.newChatIn`         | `New chat in {title}`                                                   | —             |

- Groups use calendar days in the browser's time zone; ages use `Intl.NumberFormat` narrow units of the active locale (`10m`, `15h` in English, `10 min` in Portuguese), minutes to years.
- Search compares with `toLocaleLowerCase`, project names sort with `localeCompare`, both in the active locale.

## Right-to-left

- Layout: logical spacing; actions and the age sit at the inline end; project chats indent from the inline start.
- Icons: only the collapsed chevron (`az-chevron-right`) mirrors, with the stylesheet; the Move to project sub-menu opens toward the inline end.
- Keyboard: `ArrowLeft` opens the sub-menu under `rtl` (the `DropdownMenu` rule).
- User data: titles, descriptions and tags render in `<bdi>` with `dir="auto"`.

## Responsive

- Container queries: none; it fills the width it is given.
- Narrow: titles and descriptions truncate on one line, with the full title in `title` on hover.
- Touch: rows are 44 px tall on coarse pointers (rich rows stay 56 px); row and project actions are always shown and keep their 40 px touch targets.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 17.25 KB gzip for `./conversation-history` in `.size-limit.json`, entry only (with `useLazyChunks`, `Input`, `Tag` and `Spinner`). The Organize, row and project menus (`DropdownMenu`) and the toolbar (`SearchTrigger`) are lazy chunks that load when a list needs them; until then a disabled button (or an empty 32 px row) holds their place. A row's menu items mount only while it is open.
- Runtime budget: one linear partition and grouping pass per `items` change, plus one sort of the projects. A group longer than 300 rows mounts in chunks of 100 (`useLazyChunks`, 32 px placeholder rows). `conversation-history-5k` in `perf-budgets.json` holds mounting 5k conversations and selecting one.
- Heavy parts: none.

## Examples

- Default — a chat page: the history beside the conversation, in a start-side `Drawer` on phones, with New chat, search, all five date groups and Delete that asks in a `ConfirmDialog`.
- States — Empty and Loading.
- Projects — three projects (one expanded), New project, Organize and Recents; adds a project on `project-create`.
- RichRows — the toolbar (Search, New project, New chat), Pinned, rows with a tag, a description, the age and a running status, and every row and project action applied to the data, Rename inline.
- StatusGroups — `groupBy="status"`: Working with two running chats, Settled with finished and archived chats, collapsed.

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

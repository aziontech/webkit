---
name: conversation-history
category: ai
structure: monolithic
status: implemented
spec_version: 6
template: 2
checksum: 3b6dba241243633a0a81cc9d1e33e653306b787227cc38274e0caf00c48258e1
created: 2026-11-11
last_updated: 2026-11-22
---

# ConversationHistory — Component Spec

## Purpose

The list of past conversations with an assistant, in a side panel on wide screens or a `Drawer` on phones: plain rows of titles grouped by when they were last active (Today, Yesterday, Previous 7 days, Previous 30 days, Older), the open one marked current, an optional Delete per row, and at the top an optional New chat row and a search field that filters the titles. Choosing a row sets `v-model` to its id; the owner loads that conversation into `Conversation`.

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

- Title each conversation from its first prompt, short; the full title shows on hover through `title`.
- Put it in a side panel beside the conversation on wide screens and in a `Drawer` (`side="start"`) opened from a menu button on phones; close the drawer from `update:modelValue` and `create` so the chosen conversation shows at once (the Default example).
- Turn on `creatable` when the page has no other New chat control, and `searchable` once the list is long enough to scroll.
- Fix the reference time so the groups match on the server and the client: set `now` on the app's `ConfigProvider` once (every time-relative component below reads it), or pass `now` here to override it for this list.
- Never delete on the first tap: open a `ConfirmDialog` from the `remove` handler and remove the item from `@confirm` (the Default example), or remove it at once and offer Undo in a toast.

## Usage

```vue
<script setup>
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import { ref } from 'vue'

  const items = [{ id: 'c1', title: 'Purge the cache', updatedAt: '2026-11-11T09:12:00Z' }]
  const active = ref('c1')
</script>

<template>
  <ConversationHistory
    v-model="active"
    :items="items"
    creatable
    searchable
    @create="active = null"
  />
</template>
```

## Props

| Prop         | Type                                                                   | Default     | Required | JSDoc                                                                                                                                                      |
| ------------ | ---------------------------------------------------------------------- | ----------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `items`      | `{ id: string; title: string; updatedAt: string \| number \| Date }[]` | `[]`        | false    | Conversations, any order; they are sorted newest first inside their group.                                                                                 |
| `now`        | `string \| number \| Date`                                             | `undefined` | false    | Reference time for the groups. Empty uses the nearest `ConfigProvider`'s `now`, then the current time; set either when the list is rendered on the server. |
| `removable`  | `boolean`                                                              | `false`     | false    | Shows a Delete button on each row that emits `remove`.                                                                                                     |
| `creatable`  | `boolean`                                                              | `false`     | false    | Shows a New chat row at the top that emits `create`.                                                                                                       |
| `searchable` | `boolean`                                                              | `false`     | false    | Shows a search field at the top that hides conversations whose title does not contain the typed text.                                                      |
| `loading`    | `boolean`                                                              | `false`     | false    | Shows placeholder rows while the history loads.                                                                                                            |
| `ariaLabel`  | `string`                                                               | `''`        | false    | Accessible name of the list. Empty uses the locale catalog (`Conversation history`).                                                                       |

## v-model

| Model     | Type             | Default | Emits               | Notes                                                          |
| --------- | ---------------- | ------- | ------------------- | -------------------------------------------------------------- |
| `v-model` | `string \| null` | `null`  | `update:modelValue` | Id of the open conversation; its row is `aria-current="page"`. |

## Events

| Event    | Payload                           | When                                                                                         |
| -------- | --------------------------------- | -------------------------------------------------------------------------------------------- |
| `remove` | `(event: MouseEvent, id: string)` | Delete pressed on a row (with `removable`); `id` is the row's item id. The owner removes it. |
| `create` | `(event: MouseEvent)`             | New chat pressed (with `creatable`). The owner starts an empty conversation.                 |

## Slots

_none_

## States

- Groups render only when they have items; inside a group, newest first.
- Active row: `data-active` and `aria-current="page"`, the selected surface.
- Empty: one muted line, `No conversations yet.`
- No match: while the search field holds text that no title contains, one muted line, `No conversations match “{query}”.`; New chat and the search field stay.
- Loading: `aria-busy="true"` and five skeleton rows; no group headings.

## Motion & Animations

| Trigger            | Animation / Transition               | Token                                       | Reduced-motion fallback         |
| ------------------ | ------------------------------------ | ------------------------------------------- | ------------------------------- |
| row hover / active | background colour                    | `duration-fast-02 ease-productive-entrance` | `motion-reduce:transition-none` |
| row hover / focus  | Delete fades in (fine pointers only) | `duration-fast-02 ease-productive-entrance` | `motion-reduce:transition-none` |

## Tokens

| Region      | Token                                                                                                                  |
| ----------- | ---------------------------------------------------------------------------------------------------------------------- |
| group label | `.text-label-sm`, `var(--text-muted)`                                                                                  |
| row         | `.text-label-md` (`.text-label-lg` on coarse pointers), `var(--text-default)`, `var(--bg-hover)`, `var(--bg-selected)` |
| row radius  | `var(--shape-control)`                                                                                                 |
| search      | `Input` (its own `var(--shape-control)`) with the `az-search` glyph                                                    |
| empty       | `.text-body-sm`, `var(--text-muted)`                                                                                   |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is a `nav` named by `ariaLabel`; each group is a `ul` labelled by its visible heading (`aria-labelledby`).
- Each conversation is a `button` with its title as the name; the open one carries `aria-current="page"`.
- Delete is an `IconButton` named `Delete <title>` on every row. On touch it is always shown; with a fine pointer it fades in on hover, on keyboard focus inside the row and on the open row, and it is always in the tab order, so it is reachable by keyboard, pointer and touch.
- New chat is a `button` named `New chat`, first in the list. The search field is an `Input` with `role="searchbox"` (and `enterkeyhint="search"`) named `Search conversations`; filtering announces nothing, the rows change in place.
- Keyboard: `Tab` moves through rows and their Delete; `Enter`/`Space` open a conversation.
- Focus after a delete: when the owner removes the item whose Delete was pressed and focus was lost with it (on `body`, or on the closed `ConfirmDialog`), focus moves to the conversation that took its place, else the last one, else the list itself (`tabindex="-1"`). Tests: `conversation-history.test.ts` › moves focus to the next row after a delete.
- Loading sets `aria-busy` on the list.

## Internationalization

| Key                              | English source                      | Override prop |
| -------------------------------- | ----------------------------------- | ------------- |
| `conversationHistory.label`      | `Conversation history`              | `ariaLabel`   |
| `conversationHistory.today`      | `Today`                             | —             |
| `conversationHistory.yesterday`  | `Yesterday`                         | —             |
| `conversationHistory.previous7`  | `Previous 7 days`                   | —             |
| `conversationHistory.previous30` | `Previous 30 days`                  | —             |
| `conversationHistory.older`      | `Older`                             | —             |
| `conversationHistory.emptyTitle` | `No conversations yet.`             | —             |
| `conversationHistory.delete`     | `Delete {title}`                    | —             |
| `conversationHistory.newChat`    | `New chat`                          | —             |
| `conversationHistory.search`     | `Search conversations`              | —             |
| `conversationHistory.noMatch`    | `No conversations match “{query}”.` | —             |

- Groups use calendar days in the browser's time zone, not 24-hour windows.
- Search compares titles case-insensitively with `toLocaleLowerCase` in the active locale.

## Right-to-left

- Layout: logical spacing; Delete sits at the inline end of the row.
- Icons: the trash, pen and search glyphs are not mirrored.
- Keyboard: none beyond `Tab`.
- User data: titles render in `<bdi>` with `dir="auto"`.

## Responsive

- Container queries: none; it fills the width it is given.
- Narrow: titles truncate on one line with the full title in `title`.
- Touch: rows are 44 px tall on coarse pointers (36 px with a fine pointer), titles one step larger, so the row and its Delete button share one 44 px band; Delete keeps its 40 px touch target and is always shown.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 9 KB gzip for `./conversation-history` in `.size-limit.json` (includes `useLazyChunks` and the search `Input`).
- Runtime budget: one linear grouping pass per `items` change. A group longer than 300 rows mounts in chunks of 100 (`useLazyChunks`): the first chunk renders, the rest are sized placeholders that mount as they scroll near the viewport. `conversation-history-5k` in `perf-budgets.json` holds mounting 5k conversations and selecting one.
- Heavy parts: none.

## Examples

- Default — a chat page: the history in a side panel beside the conversation on wide screens and in a start-side `Drawer` opened from a menu button on phones, with New chat, search, conversations across all five groups, one open, and Delete on each row that asks in a `ConfirmDialog` before it removes the conversation.
- States — Empty and Loading.

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

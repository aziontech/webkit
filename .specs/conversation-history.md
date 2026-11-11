---
name: conversation-history
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 4564e0ae837a8c56dd9717fef991b91aa1dd260c24d0f4af605b66e48afba752
created: 2026-11-11
last_updated: 2026-11-11
---

# ConversationHistory — Component Spec

## Purpose

The list of past conversations with an assistant, in a side panel or drawer: titles grouped by when they were last active (Today, Yesterday, Previous 7 days, Previous 30 days, Older), the open one marked current, and an optional Delete per row. Choosing a row sets `v-model` to its id; the owner loads that conversation into `Conversation`.

## When to use

- An assistant keeps past conversations and the person returns to one.
- The left rail or a drawer of a chat page.

## When NOT to use

- Messages of the open conversation → `Conversation`.
- Navigation between product areas → `SidebarNav` or `NavigationMenu`.
- A searchable table of records → `TableRoot`.

## Related

- `conversation` — shows the conversation the history selects.
- `drawer` — holds the history on narrow screens.

## Best practices

- Title each conversation from its first prompt, short; the full title shows on hover through `title`.
- Pass `now` from the server render (or a fixed reference) so the groups match on the server and the client.
- Confirm deletes of anything older than today with a `ConfirmDialog` in the `remove` handler.

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
  />
</template>
```

## Props

| Prop        | Type                                               | Default   | Required  | JSDoc                                                                                |
| ----------- | -------------------------------------------------- | --------- | --------- | ------------------------------------------------------------------------------------ |
| `items`     | `{ id: string; title: string; updatedAt: string \\ | number \\ | Date }[]` | `[]`                                                                                 | false | Conversations, any order; they are sorted newest first inside their group.                                              |
| `now`       | `string \\                                         | number \\ | Date`     | `undefined`                                                                          | false | Reference time for the groups. Empty uses the current time; pass a fixed value when the list is rendered on the server. |
| `removable` | `boolean`                                          | `false`   | false     | Shows a Delete button on each row that emits `remove`.                               |
| `loading`   | `boolean`                                          | `false`   | false     | Shows placeholder rows while the history loads.                                      |
| `label`     | `string`                                           | `''`      | false     | Accessible name of the list. Empty uses the locale catalog (`Conversation history`). |

## v-model

| Model     | Type       | Default | Emits  | Notes               |
| --------- | ---------- | ------- | ------ | ------------------- |
| `v-model` | `string \\ | null`   | `null` | `update:modelValue` | Id of the open conversation; its row is `aria-current="page"`. |

## Events

| Event    | Payload  | When                                                                    |
| -------- | -------- | ----------------------------------------------------------------------- |
| `remove` | `string` | Delete pressed on a row (with `removable`); the owner removes the item. |

## Slots

_none_

## States

- Groups render only when they have items; inside a group, newest first.
- Active row: `data-active` and `aria-current="page"`, the selected surface.
- Empty: one muted line, `No conversations yet.`
- Loading: `aria-busy="true"` and five skeleton rows; no group headings.

## Motion & Animations

| Trigger            | Animation / Transition | Token                                       | Reduced-motion fallback         |
| ------------------ | ---------------------- | ------------------------------------------- | ------------------------------- |
| row hover / active | background colour      | `duration-fast-02 ease-productive-entrance` | `motion-reduce:transition-none` |

## Tokens

| Region      | Token                                                                            |
| ----------- | -------------------------------------------------------------------------------- |
| group label | `.text-overline-sm`, `var(--text-muted)`                                         |
| row         | `.text-label-sm`, `var(--text-default)`, `var(--bg-hover)`, `var(--bg-selected)` |
| row radius  | `var(--shape-elements)`                                                          |
| empty       | `.text-body-sm`, `var(--text-muted)`                                             |

## Theme gaps

| Figma variable | Temporary primitive | Follow-up |
| -------------- | ------------------- | --------- |
| _none_         | —                   | —         |

## Accessibility (WCAG 2.1 AA)

- The root is a `nav` named by `label`; each group is a `ul` labelled by its visible heading (`aria-labelledby`).
- Each conversation is a `button` with its title as the name; the open one carries `aria-current="page"`.
- Delete is an `IconButton` named `Delete <title>`, shown on every row (not hover-only), so it is reachable by keyboard and touch.
- Keyboard: `Tab` moves through rows and their Delete; `Enter`/`Space` open a conversation.
- Loading sets `aria-busy` on the list.

## Internationalization

| Key                              | English source          | Override prop |
| -------------------------------- | ----------------------- | ------------- |
| `conversationHistory.label`      | `Conversation history`  | `label`       |
| `conversationHistory.today`      | `Today`                 | —             |
| `conversationHistory.yesterday`  | `Yesterday`             | —             |
| `conversationHistory.previous7`  | `Previous 7 days`       | —             |
| `conversationHistory.previous30` | `Previous 30 days`      | —             |
| `conversationHistory.older`      | `Older`                 | —             |
| `conversationHistory.empty`      | `No conversations yet.` | —             |
| `conversationHistory.remove`     | `Delete {title}`        | —             |

- Groups use calendar days in the browser's time zone, not 24-hour windows.

## Right-to-left

- Layout: logical spacing; Delete sits at the inline end of the row.
- Icons: the trash glyph is not mirrored.
- Keyboard: none beyond `Tab`.
- User data: titles render in `<bdi>` with `dir="auto"`.

## Responsive

- Container queries: none; it fills the width it is given.
- Narrow: titles truncate on one line with the full title in `title`.
- Touch: rows are 32 px tall with the Delete button's 40 px touch target.
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: 4.96 KB gzip for `./conversation-history` in `.size-limit.json`.
- Runtime budget: one grouping pass per `items` change; hundreds of rows render without virtualization.
- Heavy parts: none.

## Stories (Storybook)

- Default — a chat page rail with conversations across all five groups, one open, Delete on each row; Empty and Loading states.

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
- Do not add Figma references to Storybook stories. No `parameters.design`, no `parameters.figma`, no Figma URLs in `docs.description.*`, no `@storybook/addon-designs` import. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not use `parameters.actions.argTypesRegex` (deprecated in Storybook 8 and silently misroutes Vue 3 emits) or `parameters.actions.handles` (DOM-only). Declare every event explicitly in `argTypes` with a camelCase `on<Event>` key and `{ action: '<emitted-name>' }`. Do not use the legacy CSF2 `Name.args = {...}` form — always object-style CSF3.
- Do not add bespoke Storybook stories beyond Default + Types + Sizes + state stories (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Stories (Storybook)" section explicitly justifies the addition. Do not split Types/Sizes into one-story-per-variant — the composite stories are the canonical pattern.
- Do not duplicate the `## Usage` block from the spec inside the Storybook story body. The block is injected once into `parameters.docs.description.component` by the storybook-write skill; copy it nowhere else.
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

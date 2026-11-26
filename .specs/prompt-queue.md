---
name: prompt-queue
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 8906b81a46c25a20352f0ce6dbcbd2bc6bae9c0ca9a2fe348f2a72f22b48dc95
created: 2026-11-19
last_updated: 2026-11-22
---

# PromptQueue — Component Spec

## Purpose

Messages sent while a response is generating, waiting above the prompt input (TanStack AI `useChat` `queue`): each shows its text in send order with a button that removes it before it is sent; changes are announced politely.

## When to use

- A chat that lets the reader keep typing while a response streams and holds the extra messages.
- Directly above the `prompt-input`, in the composer area of the conversation.

## When NOT to use

- Prompts the reader may choose to send → `suggestion-group`.
- Messages already sent → `chat-message`.

## Related

- `prompt-input` — the composer it sits above.
- `suggestion-group` — prompts to send, not prompts waiting.

## Best practices

- Keep it mounted for the whole chat, so every change is announced.
- Keep each queued message's id, so a removal cancels the right one.
- When the queue empties, move focus back to the prompt input.

## Usage

```vue
<script setup>
  import PromptQueue from '@aziontech/ui/prompt-queue'
</script>

<template>
  <PromptQueue
    :items="[
      { id: 'q1', text: 'Also purge the cache for app.example.com' },
      { id: 'q2', text: 'Then show me the error rate for the last hour', attachmentCount: 1 }
    ]"
    @remove="(event, item) => cancelQueued(item.id)"
  />
</template>
```

## Sub-components

_None. Data-driven. `PromptQueueItem`: `{ id: string; text: string; attachmentCount?: number }` (text parts joined; non-text parts counted, shown above zero)._

## Props

| Prop        | Type                | Default | Required | JSDoc                                                                           |
| ----------- | ------------------- | ------- | -------- | ------------------------------------------------------------------------------- |
| `items`     | `PromptQueueItem[]` | `[]`    | false    | The waiting messages, in the order they will be sent.                           |
| `ariaLabel` | `string`            | `''`    | false    | Accessible name of the list. Empty uses the locale catalog (`Queued messages`). |

## Events

| Event    | Payload                                      | When                                                                                     |
| -------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `remove` | `(event: MouseEvent, item: PromptQueueItem)` | The reader removed a waiting message by pointer or keyboard; the owner cancels it by id. |

## Slots

_No slots._

## States

- Empty: no box, only the hidden status region; `data-empty` on the root.
- Populated: the box with the count line and one row per item.
- Clamped item: a message longer than two lines shows a `Show more` link under it; it expands that message in place (`data-state="open"` on the text) and reads `Show less` to fold it back, so the reader can review the whole message before it is sent.
- No `disabled`, `loading`, `invalid` or `error` state, and no component-level `open` state: a message leaves only through the owner.

## Motion & Animations

| Trigger                   | Animation / Transition        | Token     | Reduced-motion fallback         |
| ------------------------- | ----------------------------- | --------- | ------------------------------- |
| remove button hover/focus | `IconButton`'s own transition | `fast-02` | `motion-reduce:transition-none` |

## Tokens

| Region      | Token                                                                                                                                                           |
| ----------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| box         | the composer's surface: `var(--bg-surface-raised)` at 88% over what scrolls behind, `backdrop-blur-md`, `border border-(--border-default)`, `var(--shape-card)` |
| box padding | `var(--spacing-xs)` block / `var(--spacing-sm)` inline; rows gap `var(--spacing-2xs)`                                                                           |
| heading     | `.text-label-sm`, `var(--text-muted)`; glyph `az az-clock` `var(--text-muted)`                                                                                  |
| item text   | `.text-body-md`, `var(--text-default)`, two lines at most (`line-clamp-2`) until expanded; expand toggle `Button` `variant="link"` `size="small"`               |
| attachments | `.text-label-sm`, `var(--text-muted)`; glyph `az az-paperclip`                                                                                                  |
| remove      | `IconButton` `variant="ghost"` `size="small"` `icon="az az-x"`                                                                                                  |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the `IconButton` ring.
- Keyboard map: `Tab` moves between the remove buttons (and the `Show more` toggle of a clamped message) in queue order; `Enter` / `Space` removes or toggles.
- Focus: when a focused row leaves (removed or sent), focus moves to the remove button now at that position, else the last; an empty queue hands focus to the owner.
- ARIA: a native `ol` named `Queued messages` (`ariaLabel`); each remove button is named `Remove from queue` and described by its text; the `Show more` / `Show less` toggle carries `aria-expanded` and `aria-controls` pointing at its message; glyphs `aria-hidden`.
- Announcements: a hidden polite `role="status"` says `2 messages queued` on each count change after mount and `No messages queued` when empty.
- Touch target: 44 px on coarse pointers.

## Internationalization

| Key                       | English source                                                | Override prop |
| ------------------------- | ------------------------------------------------------------- | ------------- |
| `promptQueue.label`       | `Queued messages`                                             | `ariaLabel`   |
| `promptQueue.title`       | `{count} message queued` / `{count} messages queued` (plural) | —             |
| `promptQueue.empty`       | `No messages queued`                                          | —             |
| `promptQueue.remove`      | `Remove from queue`                                           | —             |
| `promptQueue.attachments` | `{count} attachment` / `{count} attachments` (plural)         | —             |
| `promptQueue.showMore`    | `Show more`                                                   | —             |
| `promptQueue.showLess`    | `Show less`                                                   | —             |

- Formatting: the counts go through the catalog plural rules of the active locale.

## Right-to-left

- Layout: logical utilities; the remove button sits at the inline end.
- Icons: `az-clock`, `az-paperclip`, `az-x` are not directional.
- Keyboard: Tab follows queue order.
- User data: message text has `dir="auto"`.

## Responsive

- Container queries: none.
- Narrow: the box takes the composer width; text wraps and clamps at two lines.
- Touch: remove buttons 44 px on coarse pointers.
- Reflow: no horizontal scroll at 320 px or 200 % zoom; `wrap-anywhere` breaks long URLs inside the clamp.

## Performance

- Bundle budget: see `.size-limit.json` (`prompt-queue`), 4.7 KB gzip, IconButton included.
- Runtime budget: static; one watcher on the item ids.
- Heavy parts: none.

## Examples

_Examples in `packages/ui/examples/prompt-queue/`: Default (two waiting messages, one with an attachment, above a streaming PromptInput; removal cancels by id), LongMessage (a long message clamped to two lines, a long URL wrapped)._

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/ui/*` path must exist in `packages/ui/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
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

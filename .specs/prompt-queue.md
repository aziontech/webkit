---
name: prompt-queue
category: ai
structure: monolithic
status: approved
spec_version: 1
template: 2
checksum: 135ae01dc145b2df7448677bbfa83c0c89dcebbf58df3439cb387eb338705207
created: 2026-11-19
last_updated: 2026-11-19
---

# PromptQueue — Component Spec

## Purpose

The messages the reader sent while a response was still being generated, waiting their turn above
the prompt input (AI Elements Queue; TanStack AI `useChat` `queue` of `QueuedMessage`). Each
waiting message shows its text, in the order it will be sent, with a remove button that takes it
out of the queue before it is sent; changes to the queue are announced politely. Unlike
`suggestion-group`, which offers prompts to send, it shows prompts already sent and not yet
delivered.

## When to use

- A chat that lets the reader keep typing while a response streams, and holds the extra messages
  until the response settles.
- Directly above the `prompt-input`, inside the composer area of the conversation.

## When NOT to use

- Prompts the reader may choose to send → `suggestion-group`.
- Messages already sent to the assistant → `chat-message` in the `conversation`.
- A list of tasks the assistant is working through → `tool-call` / `log-viewer`.

## Related

- `prompt-input` — the composer it sits above; a message reaches the queue when the owner sends it while a response is still generating.
- `suggestion-group` — prompts to send, not prompts waiting.
- `chat-message` — where a queued message appears once it is sent.

## Best practices

- Keep it mounted for the whole chat and pass the queue as `items`: with no items it draws no
  box and keeps only its visually hidden status region, so the first message joining the queue and
  the last one leaving it are both announced.
- Map each queued message one to one, keeping its id, so a removal cancels the right message.
- Keep the queue short: the composer stays the main control, and five or more waiting messages
  usually mean the reader wants to stop the response instead.
- When the queue empties (removed or sent), move focus back to the prompt input.

## Usage

```vue
<script setup>
  import PromptQueue from '@aziontech/webkit/prompt-queue'
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

_None. Data-driven (`items`), like `suggestion-group`. Exports: `"./prompt-queue"`; types
`PromptQueueItem`, `PromptQueueProps`._

`PromptQueueItem`: `{ id: string; text: string; attachmentCount?: number }` — `id` is the queued
message id returned in `remove`; `text` is the message text (the text parts joined when the
message is multimodal); `attachmentCount` is the number of non-text parts (images, audio, video,
documents), shown as a count when above zero; a missing value means 0.

## Props

| Prop        | Type                | Default | Required | JSDoc                                                                                  |
| ----------- | ------------------- | ------- | -------- | -------------------------------------------------------------------------------------- |
| `items`     | `PromptQueueItem[]` | `[]`    | false    | The waiting messages, in the order they will be sent.                                  |
| `ariaLabel` | `string`            | `''`    | false    | Accessible name of the list. Empty uses the locale catalog (`Queued messages`).        |

## Events

| Event    | Payload                                      | When                                                                                     |
| -------- | -------------------------------------------- | ---------------------------------------------------------------------------------------- |
| `remove` | `(event: MouseEvent, item: PromptQueueItem)` | The reader removed a waiting message by pointer or keyboard; the owner cancels it by id. |

## Slots

_No slots._

## States

- Empty: `items` is empty → only the polite status region renders (no visible box), so the
  announcement of the last removal still reaches assistive technology.
- Populated: the visible box with the count heading and one row per item.
- `data-empty` on the root while `items` is empty.
- Not applicable: `disabled`, `loading`, `readonly`, `invalid`, `error` and `open`/`closed`. A
  message leaves the queue only through the owner (sent or cancelled), each removal is final, and
  there is no disclosure: the list is always shown while it has items.

## Motion & Animations

| Trigger                    | Animation / Transition                                        | Token     | Reduced-motion fallback         |
| -------------------------- | ------------------------------------------------------------- | --------- | ------------------------------- |
| remove button hover/focus  | `IconButton`'s own transition                                 | `fast-02` | `motion-reduce:transition-none` |

## Tokens

| Region       | Token                                                                                   |
| ------------ | --------------------------------------------------------------------------------------- |
| box          | `var(--bg-surface)`, `border border-(--border-default)`, `var(--shape-card)`            |
| box padding  | `var(--spacing-xs)` block / `var(--spacing-sm)` inline; rows gap `var(--spacing-2xs)`   |
| heading      | `.text-label-sm`, `var(--text-muted)`; glyph `az az-clock` `var(--text-muted)`          |
| item text    | `.text-body-md`, `var(--text-default)`, two lines at most (`line-clamp-2`)               |
| attachments  | `.text-label-sm`, `var(--text-muted)`; glyph `az az-paperclip`                          |
| remove       | `IconButton` `variant="ghost"` `size="small"` `icon="az az-x"`                           |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the `IconButton` ring (`focus-visible:ring-2 focus-visible:ring-(--ring-color)`).
- Keyboard map: `Tab` moves between the remove buttons in queue order; `Enter` / `Space` removes.
  No APG widget pattern applies: a native `ol` of rows, each with a native button.
- Focus: when a row leaves `items` while its remove button has focus (the reader removed it, or
  the owner sent it), focus moves to the remove button now at that position, or else the last one.
  Only when the list empties does focus go back to the owner, which moves it to the prompt input.
- ARIA: the rows are an ordered list (`ol`) named by `ariaLabel` (`Queued messages`); each remove
  button is named `Remove from queue` and described by its message text (`aria-describedby`, ids
  from `useId()`); glyphs are `aria-hidden`; a visually hidden `role="status"` (polite) region
  announces `2 messages queued` on every count change after mount, the first message joining an
  empty queue (0 to 1) included, and `No messages queued` when it empties. Mounting with items
  already present announces nothing: the list is on screen and in the reading order.
- The visible count line (`2 messages queued`) is plain text (a `p`), not a heading: the queue is
  a small part of the composer, not a section of the page.
- Contrast: `--text-default` and `--text-muted` on `--bg-surface` pass the theme pairs.
- Touch target: the small `IconButton` grows to 44 px on coarse pointers.

## Internationalization

| Key                       | English source                                      | Override prop |
| ------------------------- | --------------------------------------------------- | ------------- |
| `promptQueue.label`       | `Queued messages`                                   | `ariaLabel`   |
| `promptQueue.title`       | `{count} message queued` / `{count} messages queued` (plural) | —             |
| `promptQueue.empty`       | `No messages queued`                                | —             |
| `promptQueue.remove`      | `Remove from queue`                                 | —             |
| `promptQueue.attachments` | `{count} attachment` / `{count} attachments` (plural) | —           |

- Formatting: the counts go through the catalog plural rules of the active locale.

## Right-to-left

- Layout: logical utilities (`ps-*`, `pe-*`, `text-start`, `ms-auto`); the remove button sits at
  the inline end.
- Icons: `az-clock`, `az-paperclip` and `az-x` are not directional and are not mirrored.
- Keyboard: Tab order follows the queue order.
- User data: message text follows the document direction (`dir="auto"` on the text).

## Responsive

- Container queries: none.
- Narrow: the box takes the composer width; the text wraps and clamps at two lines.
- Touch: remove buttons 44 px on coarse pointers.
- Reflow: no horizontal scroll at 320 px and at 200 % zoom; the message text breaks long unbroken
  strings (a URL, a hostname) with `wrap-anywhere` inside its two-line clamp.

## Performance

- Bundle budget: see `.size-limit.json` (`prompt-queue`), 6 KB gzip, IconButton included.
- Runtime budget: static; one watcher on the item ids.
- Heavy parts: none.

## Examples

_Examples in `packages/webkit/examples/prompt-queue/`: Default (two waiting messages, one with an
attachment, above a running PromptInput with the group gap between the two boxes, removal
cancels by id), LongMessage (a long message clamped to
two lines next to short ones)._

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

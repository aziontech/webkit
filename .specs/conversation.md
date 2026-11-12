---
name: conversation
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: 627aa144ce93f2f1c6af633bd604b761d5953677609d6d29669e3eb0b3d9a23f
created: 2026-11-11
last_updated: 2026-11-11
---

# Conversation — Component Spec

## Purpose

The scrolling message log of a generative AI chat. It holds the thread (`ChatMessage` items, then
whatever follows the last response: suggestions, an approval card), keeps the newest message in view
while the reader is at the end, and stops following the moment they scroll up to read or copy an
older message — a "Scroll to the latest message" button brings them back. It is a `role="log"` whose
own live behavior is off, so streamed tokens are never read one by one; instead each `ChatMessage`
that finishes (or fails) hands its text to the conversation's polite live region, once.

It also sets where messages sit for the whole thread (`alignment`): `split` for a full chat page,
`start` for a dense side panel or drawer (Cloudscape's rule for embedded surfaces).

## When to use

- Any surface where a person and the generative AI assistant exchange messages: the assistant page, the assistant drawer, an in-flow helper.
- A transcript that grows while the reader watches it (streaming responses, tool calls appearing).

## When NOT to use

- A one-shot generated block on a page (a summary card, an explanation beside a chart) → render `StreamingResponse` in place.
- A log of system events with timestamps and filtering → use `log-view`.
- A list of past conversations → a `table` or `item` list; this is one thread.

## Related

- `chat-message` — the item the log holds; announces itself through this component.
- `prompt-input` — the composer pinned under the log (outside it; only the log scrolls).
- `suggestion-group` — follow-up questions after the last response, or support prompts in the empty state.
- `empty-state` — what the panel shows before the first message (the block renders it instead of the log).
- `log-view` — machine logs, not conversations.

## Best practices

- Pin the prompt input under the conversation; only the log scrolls.
- Never auto-scroll while the reader is reading an older message: the component already stops following when they scroll up.
- Use `alignment="start"` in drawers and side panels, `split` on a full page.
- Keep one conversation per surface; a second thread is a second page or a history list.

## Usage

```vue
<script setup>
  import Conversation from '@aziontech/webkit/conversation'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
</script>

<template>
  <Conversation class="h-96">
    <ChatMessage from="user">How do I purge the cache of one URL?</ChatMessage>
    <ChatMessage from="assistant">
      <StreamingResponse content="Open **Real-Time Purge**, choose *URL* and paste the address." />
    </ChatMessage>
  </Conversation>
</template>
```

## Sub-components

_None — a single root. Messages reach it through `provide`/`inject` (`injection-key.ts`): the
conversation provides `alignment`, a `ready` flag (true after mount, so only messages added later are
announced) and `announce(author, text)`._

Exports: `"./conversation": "./src/components/ai/conversation/conversation.vue"`. Exported type:
`ConversationAlignment = 'split' | 'start'`. Composed DS components: `icon-button` (scroll to latest).

## Props

| Prop        | Type                 | Default   | Required | JSDoc                                                                                                                                           |
| ----------- | -------------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaLabel` | `string`             | `''`      | false    | Accessible name of the message log. Empty uses the locale catalog (`Conversation`).                                                             |
| `alignment` | `'split' \| 'start'` | `'split'` | false    | `split` puts the user's messages at the inline end (a full chat page); `start` keeps every message at the inline start (a side panel or drawer). |

## Events

_No events. `scrollToBottom()` is exposed for owners that need to jump to the end after sending._

## Slots

| Slot      | Scope | Notes                                                                                                                         |
| --------- | ----- | ----------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | The thread: `ChatMessage` items in order, oldest first, plus anything that follows the last response (suggestions, an approval card). |

## States

- `data-pinned` on the root while the log follows the newest message; absent once the reader scrolled up (the Scroll to latest button shows). Only the reader's own scrolling unpins it (wheel, touch, pointer on the scrollbar, keys): a scroll the browser causes — a host moving the log in the DOM, a drawer opening — is corrected back to the end while pinned.
- `data-alignment` mirrors `alignment`.
- No `data-state` — nothing opens or closes.

## Motion & Animations

| Trigger                 | Animation / Transition         | Token     | Reduced-motion fallback                         |
| ----------------------- | ------------------------------ | --------- | ----------------------------------------------- |
| Scroll to latest button | `scrollTo({ behavior: 'smooth' })` | browser   | `prefers-reduced-motion: reduce` jumps (`auto`) |
| New content while pinned | instant jump to the end        | none      | same                                            |

## Tokens

| Region                      | Token                     |
| --------------------------- | ------------------------- |
| gap between messages        | `var(--spacing-lg)`       |
| padding of the thread       | `var(--spacing-md)`       |
| reading width               | `var(--layout-measure-content)` |
| scroll button surface       | `var(--bg-surface)`, `var(--shadow-sm)` |
| focus ring of the log       | `var(--ring-color)`       |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the log is focusable (`tabindex="0"`) so keyboard users can scroll it; it shows an inset `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches the log, arrows / Page Up / Page Down scroll it; `Tab` continues into the messages' controls; the Scroll to latest button is a normal button.
- ARIA: `role="log"` with `aria-live="off"` (streaming chunks are not read) and `aria-label`; a separate visually hidden `aria-live="polite"` `aria-atomic="true"` region receives `"<author>: <text>"` when an assistant or system message completes or fails. User messages are not announced (the reader just typed them).
- Contrast ≥4.5:1 (text) / ≥3:1 (icons) on the scroll button.
- Reduced motion: smooth scrolling is replaced by a jump.
- Touch target: the scroll button is a medium `IconButton` (≥32 px, 44 px on coarse pointers through `IconButton`).

## Internationalization

| Key                          | English source                   | Override prop |
| ---------------------------- | -------------------------------- | ------------- |
| `conversation.label`         | `Conversation`                   | `ariaLabel`   |
| `conversation.scrollToLatest`| `Scroll to the latest message`   | —             |
| `conversation.announcement`  | `{author}: {text}`               | —             |

- Formatting: none.

## Right-to-left

- Layout: logical utilities only; `split` puts user messages at the inline end, so they move to the left under `dir="rtl"`.
- Icons: the arrow-down glyph is not mirrored.
- Keyboard: no horizontal keys.
- User data: messages carry their own `dir` where needed (`StreamingResponse` code is `dir="ltr"`).

## Responsive

- Container queries: none; the thread centers at `--layout-measure-content` and fills narrower hosts.
- Narrow (≤ 640 px or a drawer): full width; the owner should pass `alignment="start"`.
- Touch: scroll button meets 44 px on coarse pointers.
- Reflow: no horizontal scroll at 320 px; wide code and tables scroll inside their own blocks.

## Performance

- Bundle budget: see `.size-limit.json` (`conversation`).
- Runtime budget: one `ResizeObserver` on the thread; no per-token work beyond a scroll assignment while pinned.
- Heavy parts: none; long threads are the owner's to window (keep the last N turns rendered).

## Examples

_Examples in `packages/webkit/examples/conversation/`: Default (a short thread), Drawer alignment (`start`), Long thread (scroll to latest)._

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
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

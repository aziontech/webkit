---
name: conversation
category: ai
structure: monolithic
status: approved
spec_version: 3
template: 2
checksum: bc3e07e2c3f6a0bf0f1ecba3ee65c4b14e728a1ba3c8f369d4ecf7d4af28293c
created: 2026-11-11
last_updated: 2026-11-19
---

# Conversation — Component Spec

## Purpose

The scrolling message log of a generative AI chat. It holds the thread (`ChatMessage` items, then
whatever follows the last response: suggestions, an approval card), keeps the newest message in view
while the reader is at the end, and stops following the moment they scroll up to read or copy an
older message — a "Scroll to the latest message" button brings them back. It is a `role="log"` whose
own live behavior is off, so streamed tokens are never read one by one; instead each `ChatMessage`
that finishes (or fails) hands its text to the conversation's polite live region, once.

A long thread does not have to arrive whole. When the app keeps only the latest turns and older
ones exist on the server, it sets `moreMessages`: a Load earlier messages button opens the thread,
and the log also asks for them (`load-more`) on its own as the reader scrolls near the top. While
`loadingMore` is true the button shows its spinner and reads `Loading earlier messages`. When the
older messages arrive above the first one, the message the reader was looking at stays exactly where
it was on screen: the log moves its scroll position by the height that was added above it.

It also sets where messages sit for the whole thread (`layout`): `split` for a full chat page,
`start` for a dense side panel or drawer (Cloudscape's rule for embedded surfaces).

## When to use

- Any surface where a person and the generative AI assistant exchange messages: the assistant page, the assistant drawer, an in-flow helper.
- A transcript that grows while the reader watches it (streaming responses, tool calls appearing).

## When NOT to use

- A one-shot generated block on a page (a summary card, an explanation beside a chart) → render `StreamingResponse` in place.
- A log of system events with timestamps and filtering → use `log-viewer`.
- A list of past conversations → a `table` or `item` list; this is one thread.
- A lost or resuming connection to the model (`Reconnecting…`, `Connection lost`) → it is the app's state, not the log's: show an `Alert` (`severity="warning"`) or a `StatusIndicator` (`loading`) above the prompt input, where the reader looks before sending.

## Related

- `chat-message` — the item the log holds; announces itself through this component.
- `prompt-input` — the composer pinned under the log (outside it; only the log scrolls).
- `suggestion-group` — follow-up questions after the last response, or support prompts in the empty state.
- `empty-state` — what the panel shows before the first message (the block renders it instead of the log).
- `log-viewer` — machine logs, not conversations.

## Best practices

- Pin the prompt input under the conversation; only the log scrolls.
- Never auto-scroll while the reader is reading an older message: the component already stops following when they scroll up.
- Use `layout="start"` in drawers and side panels, `split` on a full page.
- Keep one conversation per surface; a second thread is a second page or a history list.
- With `moreMessages`, set `loadingMore` while the older messages load and prepend them in the same update that sets it back to `false`, so the log keeps the reader's place and does not announce the old messages as new.

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

Loading older messages (`moreMessages`, `loadingMore`, `load-more`):

```vue
<Conversation :more-messages="hasOlder" :loading-more="loadingOlder" @load-more="loadOlder">
  <ChatMessage v-for="message in messages" :key="message.id" :from="message.from">
    {{ message.text }}
  </ChatMessage>
</Conversation>
```

## Sub-components

_None — a single root. Messages reach it through `provide`/`inject` (`injection-key.ts`): the
conversation provides its layout (context member `alignment`), a `ready` flag (true after mount, so only messages added later are
announced) and `announce(author, text)`._

Exports: `"./conversation": "./src/components/ai/conversation/conversation.vue"`. Exported type:
`ConversationLayout = 'split' | 'start'`. Composed DS components: `icon-button` (scroll to latest),
`button` (load earlier messages: `variant="ghost"`, `size="small"`, leading `az-arrow-up` icon, centered
as the first row of the thread; its own `loading` state while they load).

Announcing new messages: a message announces itself only when it mounts after the conversation's
`ready` flag is true (or when its status turns to `success` / `error`). The conversation sets `ready`
to `false` from the moment it emits `load-more` (or `loadingMore` turns on) until the update that ends
the load has rendered (older messages were prepended, or the render after `loadingMore` turns back to `false`), so
messages prepended in that update mount while `ready` is false and are never read as new.

## Props

| Prop           | Type                 | Default   | Required | JSDoc                                                                                                                                                       |
| -------------- | -------------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaLabel`    | `string`             | `''`      | false    | Accessible name of the message log. Empty uses the locale catalog (`Conversation`).                                                                         |
| `layout`       | `'split' \| 'start'` | `'split'` | false    | `split` puts the user's messages at the inline end (a full chat page); `start` keeps every message at the inline start (a side panel or drawer).            |
| `moreMessages` | `boolean`            | `false`   | false    | Older messages exist above the first one. A Load earlier messages button opens the thread and the log emits `load-more` as the reader scrolls near the top. |
| `loadingMore`  | `boolean`            | `false`   | false    | The older messages are loading; the button at the top of the thread shows its spinner and holds further `load-more` requests.                               |

## Events

| Event       | Payload          | Notes                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ----------- | ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `load-more` | `(event: Event)` | `moreMessages`: the Load earlier messages button was pressed (its click), or the top of the thread came within 200 px of the viewport (`new Event('load-more')`). The app prepends the older messages and sets `loadingMore` meanwhile. Not repeated while `loadingMore` is true. After a request, the top row emits again only once older messages were prepended (the first message of the thread changed); if nothing was added (the load failed), only the Load earlier messages button asks again. |

`scrollToBottom()` is exposed for owners that need to jump to the end after sending.

## Slots

| Slot      | Scope | Notes                                                                                                                                 |
| --------- | ----- | ------------------------------------------------------------------------------------------------------------------------------------- |
| `default` | —     | The thread: `ChatMessage` items in order, oldest first, plus anything that follows the last response (suggestions, an approval card). |

## States

- `data-pinned` on the root while the log follows the newest message; absent once the reader scrolled up (the Scroll to latest button shows). Only the reader's own scrolling unpins it (wheel, touch, pointer on the scrollbar, keys): a scroll the browser causes — a host moving the log in the DOM, a drawer opening — is corrected back to the end while pinned.
- `data-layout` mirrors `layout`; each message carries it as `data-alignment`.
- `data-loading-more` on the root and `aria-busy="true"` on the log while `loadingMore`; the button at the top of the thread is in its `loading` state (spinner, `aria-busy`, `aria-disabled`) and reads `Loading earlier messages`.
- With `moreMessages` or `loadingMore`, the top of the thread shows the Load earlier messages button (`__load-more`); with neither, nothing is shown above the first message.
- Scroll anchoring: while the reader is not at the end, the first message in view is the anchor; when the thread grows above it (older messages prepended, the top row changing height), the log moves its scroll position by the same amount, so nothing the reader sees moves. While the Load earlier messages button holds focus (a keyboard press, or a click in a browser that focuses buttons) the button is the anchor instead: it stays where it was and the loaded messages appear right under it, next in the reading and `Tab` order. The native `overflow-anchor` is turned off on the log so the browser does not move it a second time. While pinned to the end, the log stays at the end.
- The top row (`__older`) is observed with an `IntersectionObserver` whose root is the log and whose `rootMargin` reaches 200 px above it; it renders only while `moreMessages` or `loadingMore`. The row holds only the button: no separate sentinel element, nothing hidden for assistive technology.
- Load failure: the app keeps `moreMessages` true and sets `loadingMore` back to `false` without prepending. The button returns to its idle label as the retry path; the top row does not ask again until older messages are prepended; `Earlier messages loaded` is not announced. The error message is the app's (an `Alert` in the block), not the log's.
- No `disabled`, `readonly` or `invalid` state, and no built-in `empty` or `error` rendering: an empty thread renders nothing, or only the Load earlier messages button with `moreMessages`; a failed load is described above.
- No `data-state` — nothing opens or closes.

## Motion & Animations

| Trigger                  | Animation / Transition                | Token          | Reduced-motion fallback                         |
| ------------------------ | ------------------------------------- | -------------- | ----------------------------------------------- |
| Scroll to latest button  | `scrollTo({ behavior: 'smooth' })`    | browser        | `prefers-reduced-motion: reduce` jumps (`auto`) |
| New content while pinned | instant jump to the end               | none           | same                                            |
| Older messages prepended | instant scroll correction (no motion) | none           | same                                            |
| Loading earlier messages | the `Button` spinner                  | `Button`'s own | `Button`'s own `motion-reduce:` fallback        |

## Tokens

| Region                | Token                                   |
| --------------------- | --------------------------------------- |
| gap between messages  | `var(--spacing-lg)`                     |
| padding of the thread | `var(--spacing-md)`                     |
| reading width         | `var(--layout-measure-content)`         |
| scroll button surface | `var(--bg-surface)`, `var(--shadow-sm)` |
| focus ring of the log | `var(--ring-color)`                     |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the log is focusable (`tabindex="0"`) so keyboard users can scroll it; it shows an inset `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches the log, arrows / Page Up / Page Down scroll it; `Tab` continues into the messages' controls (the Load earlier messages button first, when shown); the Scroll to latest button is a normal button. Loading older messages never depends on scrolling: the button is the keyboard and screen-reader path.
- Focus is kept through a load: the button stays mounted and focusable while loading (`aria-disabled`, not `disabled`); if it unmounts because no older messages remain while it held focus, the log takes focus (never the document body).
- ARIA: `role="log"` with `aria-live="off"` (streaming chunks are not read) and `aria-label`; a separate visually hidden `aria-live="polite"` `aria-atomic="true"` region receives `"<author>: <text>"` when an assistant or system message completes or fails. User messages are not announced (the reader just typed them). The same region says `Loading earlier messages` when `loadingMore` turns on and `Earlier messages loaded` only when the first message of the thread changed (older messages were prepended) after a request; prepended messages are never announced (see Sub-components, Announcing new messages).
- Contrast ≥4.5:1 (text) / ≥3:1 (icons) on the scroll button and on the Load earlier messages button, idle (ghost: `--text-default` on the thread's surface) and loading (`--text-disabled` on `--bg-disabled`, `Button`'s own inert colors).
- Reduced motion: smooth scrolling is replaced by a jump.
- Touch target: the scroll button is a medium `IconButton` (≥32 px, 44 px on coarse pointers through `IconButton`).

## Internationalization

| Key                           | English source                 | Override prop |
| ----------------------------- | ------------------------------ | ------------- |
| `conversation.label`          | `Conversation`                 | `ariaLabel`   |
| `conversation.scrollToLatest` | `Scroll to the latest message` | —             |
| `conversation.announcement`   | `{author}: {text}`             | —             |
| `conversation.loadMore`       | `Load earlier messages`        | —             |
| `conversation.loadingMore`    | `Loading earlier messages`     | —             |
| `conversation.moreLoaded`     | `Earlier messages loaded`      | —             |

- Formatting: none.

## Right-to-left

- Layout: logical utilities only; `split` puts user messages at the inline end, so they move to the left under `dir="rtl"`.
- Icons: the arrow-down and arrow-up glyphs are vertical and not mirrored.
- Keyboard: no horizontal keys.
- User data: messages carry their own `dir` where needed (`StreamingResponse` code is `dir="ltr"`).

## Responsive

- Container queries: none; the thread centers at `--layout-measure-content` and fills narrower hosts.
- Narrow (≤ 640 px or a drawer): full width; the owner should pass `layout="start"`.
- Touch: the scroll button and the Load earlier messages button meet 44 px on coarse pointers (both through their own `pointer-coarse` hit area).
- Reflow: no horizontal scroll at 320 px; wide code and tables scroll inside their own blocks; the Load earlier messages label fits at 320 px and 200 % zoom without horizontal scroll.

## Performance

- Bundle budget: 4.75 KB gzip (`conversation` in `.size-limit.json`), including the `Button` dependency (it shares `Spinner` with `IconButton`).
- Runtime budget: one `ResizeObserver` on the thread; no per-token work beyond a scroll assignment while pinned. With `moreMessages`, one `IntersectionObserver` on the top row; the scroll anchor is found with a binary search over the thread's children on each scroll event.
- Heavy parts: none; long threads are the owner's to window (keep the last N turns rendered).

## Examples

_Examples in `packages/webkit/examples/conversation/`: Default (a short thread), Drawer layout (`start`), Long thread (scroll to latest), Earlier messages (`more-messages` with `@load-more` prepending three older turns after a short simulated delay while `loading-more`, until the start of the thread; justified because loading older messages is a distinct behavior with its own loading state and scroll anchoring)._

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

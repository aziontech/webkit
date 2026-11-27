---
name: conversation
category: ai
structure: monolithic
status: implemented
stability: preview
spec_version: 5
template: 2
checksum: e2a3ca8fd620cd5a3ed13afb9f30a5fdb6f96911bc3703241ef56dc057472327
created: 2026-11-11
last_updated: 2026-11-23
---

# Conversation — Component Spec

## Purpose

The scrolling message log of a generative AI chat. It holds the thread (`ChatMessage` items, then
whatever follows the last response: suggestions, an approval card), keeps the newest message in view
while the reader is at the end, and stops following the moment they scroll up to read or copy an
older message — a "Scroll to the latest message" button brings them back. It is a `role="log"` whose
own live behavior is off, so streamed tokens are never read one by one; instead each `ChatMessage`
that finishes (or fails) hands its text to the conversation's polite live region, once.

With `moreMessages`, a Load earlier messages button opens the thread and the log also emits
`load-more` as the reader scrolls near the top; prepended messages never move what the reader sees.

It also sets where messages sit for the whole thread (`layout`): `split` for a full chat page,
`start` for a dense side panel or drawer (Cloudscape's rule for embedded surfaces).

The thread is a centred reading column 752 px wide (`--container-2xl`, closest to ChatGPT's 48 rem)
inside a 16 px gutter, with one even gap between messages: 36 px from `sm`, 28 px on a phone. The `composer` slot floats the composer over the bottom of
the column: the thread scrolls under it behind a fade and is padded by its height; the Scroll
to latest button floats just above it.

## When to use

- Any surface where a person and the generative AI assistant exchange messages: the assistant page, the assistant drawer, an in-flow helper.
- A transcript that grows while the reader watches it (streaming responses, tool calls appearing).

## When NOT to use

- A one-shot generated block on a page (a summary card, an explanation beside a chart) → render `StreamingResponse` in place.
- A log of system events with timestamps and filtering → use `log-viewer`.
- A list of past conversations → a `table` or `item` list; this is one thread.
- A lost or resuming connection (`Reconnecting…`) → the app's state, not the log's: an `Alert` or `StatusIndicator` above the prompt input.

## Related

- `chat-message` — the item the log holds; announces itself through this component.
- `prompt-input` — the composer, floated over the bottom of the log through the `composer` slot (outside the log; only the log scrolls).
- `suggestion-group` — follow-up questions after the last response, or support prompts in the empty state.
- `empty-state` — what the panel shows before the first message; render it in the default slot (the thread column is at least the log's height, so `my-auto` centres it) so the composer in `composer` never remounts when the first message is sent.
- `log-viewer` — machine logs, not conversations.

## Best practices

- Put the prompt input in the `composer` slot; only the log scrolls, and the thread scrolls under the composer.
- Never auto-scroll while the reader is reading an older message: the component already stops following when they scroll up.
- Use `layout="start"` in drawers and side panels, `split` on a full page.
- Keep one conversation per surface; a second thread is a second page or a history list.
- Prepend older messages in the same update that sets `loadingMore` back to `false`.

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
`button` (load earlier messages: ghost, small, `az-arrow-up`, centered first row; its `loading` state).

Announcing: a message announces on mount only while the context's `ready` is true. `ready` is false
from a request (or `loadingMore`) until the render that ends the load, so prepended messages are
never read as new.

## Props

| Prop           | Type                 | Default   | Required | JSDoc                                                                                                                                                       |
| -------------- | -------------------- | --------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ariaLabel`    | `string`             | `''`      | false    | Accessible name of the message log. Empty uses the locale catalog (`Conversation`).                                                                         |
| `layout`       | `'split' \| 'start'` | `'split'` | false    | `split` puts the user's messages at the inline end (a full chat page); `start` keeps every message at the inline start (a side panel or drawer).            |
| `moreMessages` | `boolean`            | `false`   | false    | Older messages exist above the first one. A Load earlier messages button opens the thread and the log emits `load-more` as the reader scrolls near the top. |
| `loadingMore`  | `boolean`            | `false`   | false    | The older messages are loading; the button at the top of the thread shows its spinner and holds further `load-more` requests.                               |

## Events

| Event       | Payload          | Notes                                                                                                                                                                                                                                                    |
| ----------- | ---------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `load-more` | `(event: Event)` | The button's click, or the top row came within 200 px of the viewport (`new Event('load-more')`). Not repeated while `loadingMore`, nor until older messages were prepended (the first message changed); after a failed load only the button asks again. |

`scrollToBottom()` is exposed for owners that need to jump to the end after sending.

## Slots

| Slot       | Scope | Notes                                                                                                                                                                                         |
| ---------- | ----- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `default`  | —     | The thread: `ChatMessage` items in order, oldest first, plus anything that follows the last response (suggestions, an approval card), or the empty state before the first message.            |
| `composer` | —     | The composer floating over the bottom of the thread, in the reading column: `PromptInput`, with any status, alert or queue above it. Rendered outside the log, after it in the reading order. |

## States

- `data-pinned` on the root while the log follows the newest message; absent once the reader scrolled up (the Scroll to latest button shows). Only the reader's own scrolling unpins it (wheel, touch, pointer on the scrollbar, keys): a scroll the browser causes — a host moving the log in the DOM, a drawer opening — is corrected back to the end while pinned.
- `data-layout` mirrors `layout`; each message carries it as `data-alignment`.
- With the `composer` slot, the root sets `--conversation-composer-height` (the measured height of the composer area, its fade included); the thread's bottom padding and the Scroll to latest button's offset read it. `--conversation-composer-fade` is the colour the fade blends into; the root does not set it and falls back to `var(--bg-canvas)`, so a host on another surface sets it on any ancestor (a panel or a drawer body: `class="[--conversation-composer-fade:var(--bg-surface)]"`) and the fade matches that surface.
- `data-loading-more` on the root and `aria-busy` on the log while `loadingMore`; the button is in its `loading` state.
- With `moreMessages` or `loadingMore` the first row (`__older`, observed by an `IntersectionObserver`) holds the button (`__load-more`).
- Scroll anchoring: while not pinned, the first message in view (or the button, while it has focus) is the anchor; growth above it is offset in the scroll position. Native `overflow-anchor` is off.
- Load failure: `loadingMore` returns to `false` with nothing prepended; the idle button is the retry path, nothing is announced, the error is the app's (an `Alert`).
- No `disabled`, `readonly`, `invalid`, `empty` or `error` state of its own.
- No `data-state` — nothing opens or closes.

## Motion & Animations

| Trigger                  | Animation / Transition                | Token          | Reduced-motion fallback                         |
| ------------------------ | ------------------------------------- | -------------- | ----------------------------------------------- |
| Scroll to latest button  | `scrollTo({ behavior: 'smooth' })`    | browser        | `prefers-reduced-motion: reduce` jumps (`auto`) |
| New content while pinned | instant jump to the end               | none           | same                                            |
| Older messages prepended | instant scroll correction (no motion) | none           | same                                            |
| Loading earlier messages | the `Button` spinner                  | `Button`'s own | `Button`'s own `motion-reduce:` fallback        |

## Tokens

| Region                | Token                                                                                                                                |
| --------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| gap between messages  | `var(--spacing-lg)` + `var(--spacing-sm)` (36 px from `sm`, 28 px on a phone), the same before every message                         |
| padding of the thread | `var(--spacing-md)`; bottom `var(--conversation-composer-height)` + `var(--spacing-md)`                                              |
| reading width         | `var(--container-2xl)` of content inside the `var(--spacing-md)` gutter, the thread and the composer alike                           |
| scroll button surface | large `IconButton` (`var(--shape-button)`): `var(--bg-surface-raised)` at 88 %, `backdrop-blur-md`, `var(--shadow-md)`               |
| composer area         | fade `linear-gradient` from `var(--conversation-composer-fade, var(--bg-canvas))`; padding `var(--spacing-lg)` / `var(--spacing-md)` |
| focus ring of the log | `var(--ring-color)`                                                                                                                  |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the log is focusable (`tabindex="0"`) so keyboard users can scroll it; it shows an inset `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches the log, arrows / Page Up / Page Down scroll it; `Tab` continues into the messages' controls (the Load earlier messages button first); the Scroll to latest button is a normal button.
- Focus: the button stays focusable while loading (`aria-disabled`); if it leaves while focused, the log takes focus.
- ARIA: `role="log"` with `aria-live="off"` (streaming chunks are not read) and `aria-label`; a separate visually hidden `aria-live="polite"` `aria-atomic="true"` region receives `"<author>: <text>"` when an assistant or system message completes or fails. User messages are not announced (the reader just typed them). It also says `Loading earlier messages`, then `Earlier messages loaded` once older messages were prepended.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons) on both buttons, idle and loading (`Button`'s own colors).
- Reduced motion: smooth scrolling is replaced by a jump.
- Touch target: the scroll button is a large `IconButton` (40 px, 44 px on coarse pointers through `IconButton`).
- Reading order: the composer area follows the log in the DOM, so `Tab` leaves the log's last control and reaches the composer.

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

- Container queries: none; the thread and the composer centre at `--container-2xl` and fill narrower hosts with the `--spacing-md` gutter.
- Narrow (≤ 640 px or a drawer): full width; the owner should pass `layout="start"`.
- Touch: the scroll button and the Load earlier messages button meet 44 px on coarse pointers (both through their own `pointer-coarse` hit area).
- Safe area: the composer row keeps at least the bottom safe-area inset (`env(safe-area-inset-bottom)`) under it, so on a phone with a home indicator the composer stays above it while the thread scrolls behind.
- Reflow: no horizontal scroll at 320 px; wide code and tables scroll inside their own blocks; the Load earlier messages label fits at 320 px and 200 % zoom without horizontal scroll.

## Performance

- Bundle budget: 6.4 KB gzip (`conversation` in `.size-limit.json`), raised from 4.75 KB in v3 for the composed `Button` (about 1.2 KB, it shares `Spinner` with `IconButton`) and the scroll anchoring.
- Runtime budget: one `ResizeObserver` on the thread; no per-token work beyond a scroll assignment while pinned. With `moreMessages`, one `IntersectionObserver` on the top row; the scroll anchor is found with a binary search over the thread's children on each scroll event.
- Heavy parts: none; long threads are the owner's to window (keep the last N turns rendered).

## Examples

_Examples in `packages/webkit/examples/conversation/`: Default (a short thread with the composer in `composer`), Drawer layout (`start`), Long thread (scroll to latest above the floating composer), Earlier messages (`more-messages` + `@load-more` prepending three turns after a simulated delay; justified: a distinct behavior with its own loading state)._

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

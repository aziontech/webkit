---
name: chat-message
category: ai
structure: composition
status: implemented
spec_version: 4
template: 2
checksum: 39eccc91fdb5af11d71f2ba464674c1efdc4da56abb66083871db5d0bbff3457
created: 2026-11-11
last_updated: 2026-11-22
---

# ChatMessage — Component Spec

## Purpose

One message in a generative AI conversation (Cloudscape's chat bubble, AI Elements' Message): the
content and — once the response is complete — the action row a reader uses on it (copy, the
helpful / not helpful thumbs, regenerate, read aloud, the sources). It owns the message lifecycle:
`pending` (waiting for the first token: the loading text), `streaming` (content arriving, busy, no
actions), `success` (actions shown; announced once to screen readers through the `Conversation`) and
`error` (an error line with Try again).

Assistant messages are plain text across the reading column (`.text-body-lg`): no avatar, name,
time or bubble. User messages are a filled bubble at the inline end, at most 80 % wide; system
messages a muted centered line. Author and time live in the accessible name (the time also shows on
hover over the user's bubble). Alignment comes from the enclosing `Conversation`.

## When to use

- Every turn of a chat with the generative AI assistant: the person's prompt, the assistant's response, a system note ("Conversation restarted").
- A response that must show its lifecycle (loading, streaming, failure) and its actions.

## When NOT to use

- A generated block outside a conversation (a summary on a page) → `StreamingResponse` alone.
- A notification or toast about the product → `alert` / `toast`.
- A comment thread between people → not this component; it carries AI semantics (feedback thumbs, regenerate).

## Related

- `conversation` — the log that holds messages, sets alignment and announces finished ones.
- `streaming-response` — the safe Markdown renderer for assistant content.
- `reasoning`, `sources`, `tool-call`, `artifact-preview` — parts that stack inside an assistant message.
- `copy-button`, `icon-button` — the actions composed into `ChatMessage.Actions`.
- `response-loading` — what `pending` renders.

## Best practices

- Pass `status` from your request: `pending` until the first token, `streaming` while tokens arrive, then `success` or `error`.
- Keep the action row always visible: Copy, the thumbs, Regenerate, app actions (Share), Read aloud, then the `Sources` pill in `#trailing`; give `CopyButton` and `IconButton` `size="large"` (40 px targets).
- Use `grouped` for a second message by the same author so stacked messages read as one turn.
- Never put the feedback thumbs on non-AI content.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CopyButton from '@aziontech/webkit/copy-button'
  import Sources from '@aziontech/webkit/sources'
  import StreamingResponse from '@aziontech/webkit/streaming-response'

  const feedback = ref(null)
  const sources = [{ title: 'Real-Time Purge', href: 'https://www.azion.com/en/documentation/' }]
  const answer = 'Open **Real-Time Purge** and choose *URL* [1].'
</script>

<template>
  <ChatMessage
    from="assistant"
    timestamp="10:42"
    status="success"
  >
    <StreamingResponse
      :content="answer"
      :sources="sources"
      anchor="answer-1"
    />
    <template #actions>
      <ChatMessage.Actions show-read-aloud>
        <CopyButton
          size="large"
          :value="answer"
        />
        <ChatMessage.Feedback v-model="feedback" />
        <template #trailing>
          <Sources
            :items="sources"
            anchor="answer-1"
          />
        </template>
      </ChatMessage.Actions>
    </template>
  </ChatMessage>
</template>
```

## Sub-components

Compound API through `index.ts` (`ChatMessage.Actions`, `ChatMessage.Feedback`); standalone entries
`chat-message-root`, `chat-message-actions`, `chat-message-feedback`. The root provides
`{ from, status, contentText }` (`injection-key.ts`; `contentText()` reads the `StreamingResponse` text, `lib/content-text.ts`); `useChatMessageContext()` throws outside a `ChatMessage`.

- `chat-message-actions/chat-message-actions.vue` — `role="group"` row of actions, wrapping when narrow; renders nothing unless `status` is `success`. Order: `default`, Read aloud, `trailing`.
  - Props: `ariaLabel?: string` (default `''` — empty uses `Message actions`); `showReadAloud?: boolean` (default `false` — shows Read aloud); `readAloudText?: string` (default `''` — the text Read aloud speaks; empty reads `contentText()`).
  - Slots: `default` — the icon actions; `trailing` — the `Sources` pill.
  - Read aloud (private part `parts/chat-message-read-aloud.vue`, test id `chat-message-actions__read-aloud`): a 40 px ghost `IconButton` that speaks the text with `speechSynthesis` in the active locale; while speaking it is `Stop reading` (`data-speaking`). Pressing it again, another message's Read aloud or unmounting stops it. Rendered after mount, only where the browser has speech synthesis.
  - `data-testid` fallback: `chat-message-actions`.
- `chat-message-feedback/chat-message-feedback.vue` — thumbs up / down (`aria-pressed`, large ghost `IconButton`s), each with a tooltip (`Helpful`, `Not helpful`); after a choice the other thumb disables and a `role="status"` line reads `Submitting feedback` (while `loading`) then `Feedback submitted`. A choice is final.
  - Props: `loading?: boolean` (default `false`).
  - v-model: `'up' | 'down' | null` through `defineModel` (default `null`; emits `update:modelValue`).
  - `data-testid` fallback: `chat-message-feedback`.

Exported types: `ChatMessageFrom`, `ChatMessageStatus`, `ChatMessageFeedbackValue`. Composed DS
components: `button`, `response-loading`, `icon-button`, `tooltip`.

```
packages/webkit/src/components/ai/chat-message/
├── chat-message.vue
├── chat-message.test.ts
├── index.ts
├── injection-key.ts
├── composables/use-chat-message-context.ts
├── lib/content-text.ts
├── parts/chat-message-read-aloud.vue
├── chat-message-actions/chat-message-actions.vue
└── chat-message-feedback/chat-message-feedback.vue
```

## Props

| Prop           | Type                                               | Default       | Required | JSDoc                                                                                                                                                      |
| -------------- | -------------------------------------------------- | ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`         | `'user' \| 'assistant' \| 'system'`                | `'assistant'` | false    | Who wrote the message: the person (`user`), the generative AI assistant, or the product (`system`).                                                        |
| `author`       | `string`                                           | `''`          | false    | Author name read in the message's accessible name; it is not shown. Empty uses the locale catalog (`You`, `AI assistant`, `System`).                       |
| `timestamp`    | `string`                                           | `''`          | false    | Time the message was sent, already formatted for display (`10:42`). Added to the accessible name and shown on hover over the user's bubble.                |
| `status`       | `'pending' \| 'streaming' \| 'success' \| 'error'` | `'success'`   | false    | Lifecycle: `pending` shows the loading text, `streaming` marks the content busy, `success` shows the actions, `error` shows the error line with Try again. |
| `grouped`      | `boolean`                                          | `false`       | false    | Follows a message by the same author: tightens the gap above it so stacked messages read as one turn.                                                      |
| `errorMessage` | `string`                                           | `''`          | false    | Error text shown while `status` is `error`. Empty uses the locale catalog.                                                                                 |
| `loadingLabel` | `string`                                           | `''`          | false    | Loading text shown while `status` is `pending`. Empty uses `ResponseLoading`'s own (`Generating a response`).                                              |

## Events

| Event   | Payload               | When                                               |
| ------- | --------------------- | -------------------------------------------------- |
| `retry` | `(event: MouseEvent)` | The reader pressed Try again on a failed response. |

## Slots

| Slot      | Scope | Notes                                                                                                    |
| --------- | ----- | -------------------------------------------------------------------------------------------------------- |
| `default` | —     | The content: text, `StreamingResponse`, `Reasoning`, `Sources`, artifacts. Not rendered while `pending`. |
| `actions` | —     | The action row, usually `ChatMessage.Actions`; shown only when `status` is `success`.                    |

## States

- `data-from` (`user` | `assistant` | `system`), `data-status` (mirrors `status`), `data-alignment` (from the conversation), `data-grouped`.
- A visually hidden line (`__author`, dropped when `grouped`) reads the accessible name; the user bubble has the time as `title`.
- `aria-busy="true"` while `pending` or `streaming`.
- `pending`: `ResponseLoading` (inline, no delay — the owner decides when a message exists) in place of the content.
- `error`: the content (whatever streamed) stays; an error line with a danger glyph and a Try again `Button` follows.
- `success`: the `actions` slot renders.

## Motion & Animations

_No motion of its own — `ResponseLoading` owns the pulsing dots shown while `pending`, `IconButton` its loading spinner and hover fades._

## Tokens

| Region              | Token                                                                                                |
| ------------------- | ---------------------------------------------------------------------------------------------------- |
| user bubble surface | `var(--bg-surface-raised)`, `var(--shape-card)` (the largest rounded shape token), at most 80 % wide |
| bubble padding      | `var(--spacing-md)` / `var(--spacing-sm)`                                                            |
| content             | `.text-body-lg`, `var(--text-default)`; blocks `var(--spacing-md)` apart                             |
| system line         | `.text-body-sm`, `var(--text-muted)`                                                                 |
| error line          | `.text-body-sm`, `var(--danger-foreground)`                                                          |
| gaps                | `var(--spacing-sm)`, `var(--spacing-xs)`, `var(--spacing-2xs)`                                       |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the composed controls carry their own `focus-visible` rings.
- Keyboard map: `Tab` through links in the content, then the actions in order; Enter / Space activate. The message adds no key handling.
- ARIA: `<article aria-label="<author> at <time>">` so each message has a unique name (Cloudscape), repeated in a visually hidden line at its start for browse mode; `aria-busy` while loading or streaming; actions are a `role="group"` named `Message actions`; feedback thumbs use `aria-pressed`, the feedback status is `role="status"`.
- Announcement: when an assistant or system message turns `success` or `error` (or mounts finished after the conversation is ready), its text is read once through the `Conversation` live region.
- Never rely on alignment alone: every message names its author in its accessible name and hidden line (or is `grouped` after one that does).
- Contrast ≥4.5:1 on the muted time and system text.

## Internationalization

| Key                              | English source                         | Override prop         |
| -------------------------------- | -------------------------------------- | --------------------- |
| `chatMessage.user`               | `You`                                  | `author`              |
| `chatMessage.assistant`          | `AI assistant`                         | `author`              |
| `chatMessage.system`             | `System`                               | `author`              |
| `chatMessage.labelWithTime`      | `{author} at {time}`                   | —                     |
| `chatMessage.error`              | `The response could not be generated.` | `errorMessage`        |
| `chatMessage.retry`              | `Try again`                            | —                     |
| `chatMessage.actions`            | `Message actions`                      | `ariaLabel` (Actions) |
| `chatMessage.helpful`            | `Helpful`                              | —                     |
| `chatMessage.notHelpful`         | `Not helpful`                          | —                     |
| `chatMessage.feedback`           | `Response feedback`                    | —                     |
| `chatMessage.feedbackSubmitting` | `Submitting feedback`                  | —                     |
| `chatMessage.feedbackSubmitted`  | `Feedback submitted`                   | —                     |
| `chatMessage.readAloud`          | `Read aloud`                           | —                     |
| `chatMessage.stopReading`        | `Stop reading`                         | —                     |

- Formatting: the owner formats `timestamp` (`Intl.DateTimeFormat` with the provider locale).

## Right-to-left

- Layout: logical utilities; in `split` the user bubble sits at the inline end (left in RTL); the action row's pull is `-ms`.
- Icons: thumbs, refresh, speaker and stop are not mirrored.
- Keyboard: no arrow keys.
- User data: content renders `dir` per block (code is `dir="ltr"`).

## Responsive

- Container queries: none; user bubbles cap at 80 % of the thread width, assistant content fills it.
- Narrow: same layout; the action row wraps, and an open `Sources` list takes the full width under it.
- Touch: Feedback and Read aloud are 40 px `IconButton`s; the `Sources` pill has a 44 px hit area on coarse pointers.
- Reflow: long words break (`break-words`); code and tables scroll in their own blocks.

## Performance

- Bundle budget: see `.size-limit.json` (`chat-message`, `chat-message-root`, `chat-message-actions`, `chat-message-feedback`).
- Runtime budget: no work per token; the announcement reads `textContent` once on completion.
- Heavy parts: none.

## Examples

_Examples in `packages/webkit/examples/chat-message/`: Default (user bubble and plain assistant text), Actions (Copy, feedback, Regenerate, Read aloud and the Sources pill), Pending and streaming, Error with retry, Grouped and system._

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

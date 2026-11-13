---
name: chat-message
category: ai
structure: composition
status: implemented
spec_version: 2
template: 2
checksum: 134629a4f5fab879fe6db827f3ee17ea4eda6a923a140aef1b2fbe87ee9e80e2
created: 2026-11-11
last_updated: 2026-11-13
---

# ChatMessage — Component Spec

## Purpose

One message in a generative AI conversation (Cloudscape's chat bubble, AI Elements' Message): who
wrote it (avatar and author line), the content, and — once the response is complete — the inline
actions a reader takes on it (copy, regenerate, thumbs up / down). It owns the message lifecycle:
`pending` (waiting for the first token: the loading text), `streaming` (content arriving, busy, no
actions), `complete` (actions shown; announced once to screen readers through the `Conversation`) and
`error` (an error line with Try again).

User messages sit in a filled bubble; assistant messages are flat, full width, beside the assistant
mark; system messages are a muted centered line. Alignment comes from the enclosing `Conversation`.

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
- `ai-loading` — what `pending` renders.

## Best practices

- Pass `state` from your request: `pending` until the first token, `streaming` while tokens arrive, then `complete` or `error`.
- Keep actions to five or fewer, always visible (no hover-only): copy, regenerate, feedback.
- Use `grouped` for a second message by the same author so stacked bubbles read as one turn (only the first shows the avatar).
- Never put the feedback thumbs on non-AI content.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CopyButton from '@aziontech/webkit/copy-button'
  import StreamingResponse from '@aziontech/webkit/streaming-response'

  const feedback = ref(null)
  const answer = 'Open **Real-Time Purge** and choose *URL*.'
</script>

<template>
  <ChatMessage from="assistant" timestamp="10:42" state="complete">
    <StreamingResponse :content="answer" />
    <template #actions>
      <ChatMessage.Actions>
        <CopyButton :value="answer" />
        <ChatMessage.Feedback v-model="feedback" />
      </ChatMessage.Actions>
    </template>
  </ChatMessage>
</template>
```

## Sub-components

Compound API through `index.ts` (`ChatMessage.Actions`, `ChatMessage.Feedback`); standalone entries
`chat-message-root`, `chat-message-actions`, `chat-message-feedback`. The root provides
`{ from, state }` (`injection-key.ts`); `useChatMessageContext()` throws outside a `ChatMessage`.

- `chat-message-actions/chat-message-actions.vue` — `role="group"` row of inline actions; renders nothing unless the message `state` is `complete`.
  - Props: `ariaLabel?: string` (default `''` — empty uses `Message actions`).
  - Slot: `default` — the icon actions.
  - `data-testid` fallback: `ai-chat-message-actions`.
- `chat-message-feedback/chat-message-feedback.vue` — thumbs up / down (`aria-pressed`), each with a tooltip (`Helpful`, `Not helpful`); after a choice the other thumb disables and a `role="status"` line reads `Submitting feedback` (while `loading`) then `Feedback submitted`. A choice is final.
  - Props: `loading?: boolean` (default `false`).
  - v-model: `'up' | 'down' | null` through `defineModel` (default `null`; emits `update:modelValue`).
  - `data-testid` fallback: `ai-chat-message-feedback`.

Exported types: `ChatMessageFrom`, `ChatMessageState`, `ChatMessageFeedbackValue`. Composed DS
components: `avatar`, `button`, `ai-loading`, `icon-button`, `tooltip`.

```
packages/webkit/src/components/ai/chat-message/
├── chat-message.vue
├── chat-message.test.ts
├── index.ts
├── injection-key.ts
├── composables/use-chat-message-context.ts
├── chat-message-actions/chat-message-actions.vue
└── chat-message-feedback/chat-message-feedback.vue
```

## Props

| Prop           | Type                                               | Default       | Required | JSDoc                                                                                                                                         |
| -------------- | -------------------------------------------------- | ------------- | -------- | --------------------------------------------------------------------------------------------------------------------------------------------- |
| `from`         | `'user' \| 'assistant' \| 'system'`                | `'assistant'` | false    | Who wrote the message: the person (`user`), the generative AI assistant, or the product (`system`).                                           |
| `author`       | `string`                                           | `''`          | false    | Author name shown over the message and read in its accessible name. Empty uses the locale catalog (`You`, `AI assistant`, `System`).          |
| `timestamp`    | `string`                                           | `''`          | false    | Time the message was sent, already formatted for display (`10:42`). Added to the accessible name.                                             |
| `state`        | `'pending' \| 'streaming' \| 'complete' \| 'error'` | `'complete'`  | false    | Lifecycle: `pending` shows the loading text, `streaming` marks the content busy, `complete` shows the actions, `error` shows the error line with Try again. |
| `grouped`      | `boolean`                                          | `false`       | false    | Follows a message by the same author: drops the avatar and the author line so stacked messages read as one turn.                               |
| `errorMessage` | `string`                                           | `''`          | false    | Error text shown while `state` is `error`. Empty uses the locale catalog.                                                                    |
| `loadingLabel` | `string`                                           | `''`          | false    | Loading text shown while `state` is `pending`. Empty uses `AiLoading`'s own (`Generating a response`).                                        |

## Events

| Event   | Payload               | When                                               |
| ------- | --------------------- | -------------------------------------------------- |
| `retry` | `(event: MouseEvent)` | The reader pressed Try again on a failed response. |

## Slots

| Slot      | Scope | Notes                                                                                                  |
| --------- | ----- | ------------------------------------------------------------------------------------------------------ |
| `default` | —     | The content: text, `StreamingResponse`, `Reasoning`, `Sources`, artifacts. Not rendered while `pending`. |
| `avatar`  | —     | Replaces the default avatar (person glyph for the user, the assistant mark for the AI).                 |
| `actions` | —     | Inline actions, usually `ChatMessage.Actions`; shown only when `state` is `complete`.                   |

## States

- `data-from` (`user` | `assistant` | `system`), `data-status` (mirrors `state`), `data-alignment` (from the conversation), `data-grouped`.
- `aria-busy="true"` while `pending` or `streaming`.
- `pending`: `AiLoading` (inline, no delay — the owner decides when a message exists) in place of the content.
- `error`: the content (whatever streamed) stays; an error line with a danger glyph and a Try again `Button` follows.
- `complete`: the `actions` slot renders.

## Motion & Animations

_No motion of its own — `AiLoading` owns the pulsing dots shown while `pending`, `IconButton` its loading spinner._

## Tokens

| Region                         | Token                                   |
| ------------------------------ | --------------------------------------- |
| user bubble surface            | `var(--bg-surface-raised)`, `var(--shape-card)` |
| bubble padding                 | `var(--spacing-md)` / `var(--spacing-sm)` |
| author line                    | `.text-label-sm`, `var(--text-default)`; time `.text-body-xs`, `var(--text-muted)` |
| content                        | `.text-body-md`, `var(--text-default)`  |
| system line                    | `.text-body-sm`, `var(--text-muted)`    |
| error line                     | `.text-body-sm`, `var(--danger-contrast)` |
| gaps                           | `var(--spacing-sm)`, `var(--spacing-xs)`, `var(--spacing-xxs)` |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: the composed controls carry their own `focus-visible` rings.
- Keyboard map: `Tab` through links in the content, then the actions in order; Enter / Space activate. The message adds no key handling.
- ARIA: `<article aria-label="<author> at <time>">` so each message has a unique name (Cloudscape); avatar wrapper `aria-hidden` (the author line names the author); `aria-busy` while loading or streaming; actions are a `role="group"` named `Message actions`; feedback thumbs use `aria-pressed`, the feedback status is `role="status"`.
- Announcement: when an assistant or system message turns `complete` or `error` (or mounts complete after the conversation is ready), its text is read once through the `Conversation` live region.
- Never rely on alignment alone: every message has the avatar and author line (or `grouped` after one that has).
- Contrast ≥4.5:1 on the muted time and system text.

## Internationalization

| Key                              | English source                           | Override prop  |
| -------------------------------- | ---------------------------------------- | -------------- |
| `chatMessage.user`               | `You`                                    | `author`       |
| `chatMessage.assistant`          | `AI assistant`                           | `author`       |
| `chatMessage.system`             | `System`                                 | `author`       |
| `chatMessage.labelWithTime`      | `{author} at {time}`                     | —              |
| `chatMessage.error`              | `The response could not be generated.`   | `errorMessage` |
| `chatMessage.retry`              | `Try again`                              | —              |
| `chatMessage.actions`            | `Message actions`                        | `ariaLabel` (Actions) |
| `chatMessage.helpful`            | `Helpful`                                | —              |
| `chatMessage.notHelpful`         | `Not helpful`                            | —              |
| `chatMessage.feedback`           | `Response feedback`                      | —              |
| `chatMessage.feedbackSubmitting` | `Submitting feedback`                    | —              |
| `chatMessage.feedbackSubmitted`  | `Feedback submitted`                     | —              |

- Formatting: the owner formats `timestamp` (`Intl.DateTimeFormat` with the provider locale).

## Right-to-left

- Layout: logical utilities; in `split` the user message reverses the row so it sits at the inline end (left in RTL).
- Icons: thumbs, refresh and the assistant mark are not mirrored.
- Keyboard: no arrow keys.
- User data: content renders `dir` per block (code is `dir="ltr"`).

## Responsive

- Container queries: none; user bubbles cap at 85 % of the thread width, assistant content fills it.
- Narrow: same layout; the avatar column is 32 px.
- Touch: actions are `IconButton`s (44 px on coarse pointers).
- Reflow: long words break (`break-words`); code and tables scroll in their own blocks.

## Performance

- Bundle budget: see `.size-limit.json` (`chat-message`, `chat-message-root`, `chat-message-actions`, `chat-message-feedback`).
- Runtime budget: no work per token; the announcement reads `textContent` once on completion.
- Heavy parts: none.

## Examples

_Examples in `packages/webkit/examples/chat-message/`: Default (user and assistant), Actions and feedback, Pending and streaming, Error with retry, Grouped and system._

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

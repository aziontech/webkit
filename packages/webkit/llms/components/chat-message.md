# Chat Message

> One message in a generative AI conversation (Cloudscape's chat bubble, AI Elements' Message): who wrote it (avatar and author line), the content, and — once the response is complete — the inline actions a reader takes on it (copy, regenerate, thumbs up / down). It owns the message lifecycle: `pending` (waiting for the first token: the loading text), `streaming` (content arriving, busy, no actions), `complete` (actions shown; announced once to screen readers through the `Conversation`) and `error` (an error line with Try again). User messages sit in a filled bubble; assistant messages are flat, full width, beside the assistant mark; system messages are a muted centered line. Alignment comes from the enclosing `Conversation`.

- Import: `import ChatMessageRoot from '@aziontech/webkit/chat-message-root'`
- Compound import (dot notation, not tree-shakeable): `import ChatMessage from '@aziontech/webkit/chat-message'`
- Category: ai · Surface: product · Structure: composition
- API as JSON: [chat-message.json](https://github.com/aziontech/webkit/blob/main/.specs/chat-message.json)

## When to use

- Every turn of a chat with the generative AI assistant: the person's prompt, the assistant's response, a system note ("Conversation restarted").
- A response that must show its lifecycle (loading, streaming, failure) and its actions.

## Do

- Pass `state` from your request: `pending` until the first token, `streaming` while tokens arrive, then `complete` or `error`.
- Keep actions to five or fewer, always visible (no hover-only): copy, regenerate, feedback.
- Use `grouped` for a second message by the same author so stacked bubbles read as one turn (only the first shows the avatar).
- Never put the feedback thumbs on non-AI content.

## Don’t

- A generated block outside a conversation (a summary on a page) → `StreamingResponse` alone.
- A notification or toast about the product → `alert` / `toast`.
- A comment thread between people → not this component; it carries AI semantics (feedback thumbs, regenerate).
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [conversation](conversation.md) — the log that holds messages, sets alignment and announces finished ones.
- [streaming-response](streaming-response.md) — the safe Markdown renderer for assistant content.
- [reasoning](reasoning.md), `sources`, `tool-call`, `artifact-preview` — parts that stack inside an assistant message.
- [copy-button](copy-button.md), `icon-button` — the actions composed into `ChatMessage.Actions`.
- [ai-loading](ai-loading.md) — what `pending` renders.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `from` | `'user' \| 'assistant' \| 'system'` | `'assistant'` | false | Who wrote the message: the person (`user`), the generative AI assistant, or the product (`system`). |
| `author` | `string` | `''` | false | Author name shown over the message and read in its accessible name. Empty uses the locale catalog (`You`, `AI assistant`, `System`). |
| `timestamp` | `string` | `''` | false | Time the message was sent, already formatted for display (`10:42`). Added to the accessible name. |
| `state` | `'pending' \| 'streaming' \| 'complete' \| 'error'` | `'complete'` | false | Lifecycle: `pending` shows the loading text, `streaming` marks the content busy, `complete` shows the actions, `error` shows the error line with Try again. |
| `grouped` | `boolean` | `false` | false | Follows a message by the same author: drops the avatar and the author line so stacked messages read as one turn. |
| `errorMessage` | `string` | `''` | false | Error text shown while `state` is `error`. Empty uses the locale catalog. |
| `loadingLabel` | `string` | `''` | false | Loading text shown while `state` is `pending`. Empty uses `AiLoading`'s own (`Generating a response`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `retry` | `—` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The content: text, `StreamingResponse`, `Reasoning`, `Sources`, artifacts. Not rendered while `pending`. |
| `avatar` | — | Replaces the default avatar (person glyph for the user, the assistant mark for the AI). |
| `actions` | — | Inline actions, usually `ChatMessage.Actions`; shown only when `state` is `complete`. |

## Sub-component imports

- `@aziontech/webkit/chat-message-actions`
- `@aziontech/webkit/chat-message-feedback`

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

## States

- `data-from` (`user` | `assistant` | `system`), `data-status` (mirrors `state`), `data-alignment` (from the conversation), `data-grouped`.
- `aria-busy="true"` while `pending` or `streaming`.
- `pending`: `AiLoading` (inline, no delay — the owner decides when a message exists) in place of the content.
- `error`: the content (whatever streamed) stays; an error line with a danger glyph and a Try again `Button` follows.
- `complete`: the `actions` slot renders.

## Accessibility

- Visible focus: the composed controls carry their own `focus-visible` rings.
- Keyboard map: `Tab` through links in the content, then the actions in order; Enter / Space activate. The message adds no key handling.
- ARIA: `<article aria-label="<author> at <time>">` so each message has a unique name (Cloudscape); avatar wrapper `aria-hidden` (the author line names the author); `aria-busy` while loading or streaming; actions are a `role="group"` named `Message actions`; feedback thumbs use `aria-pressed`, the feedback status is `role="status"`.
- Announcement: when an assistant or system message turns `complete` or `error` (or mounts complete after the conversation is ready), its text is read once through the `Conversation` live region.
- Never rely on alignment alone: every message has the avatar and author line (or `grouped` after one that has).
- Contrast ≥4.5:1 on the muted time and system text.

## Right-to-left

- Layout: logical utilities; in `split` the user message reverses the row so it sits at the inline end (left in RTL).
- Icons: thumbs, refresh and the assistant mark are not mirrored.
- Keyboard: no arrow keys.
- User data: content renders `dir` per block (code is `dir="ltr"`).

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

## Responsive

- Container queries: none; user bubbles cap at 85 % of the thread width, assistant content fills it.
- Narrow: same layout; the avatar column is 32 px.
- Touch: actions are `IconButton`s (44 px on coarse pointers).
- Reflow: long words break (`break-words`); code and tables scroll in their own blocks.

## Examples

### Default

```vue
<script setup>
  import ChatMessageRoot from '@aziontech/webkit/chat-message-root'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-lg)">
    <ChatMessageRoot
      from="user"
      author="Jane Doe"
      timestamp="10:41"
    >
      How do I purge the cache of one URL?
    </ChatMessageRoot>
    <ChatMessageRoot timestamp="10:41">
      <StreamingResponse
        content="Open **Real-Time Purge**, choose *URL* as the purge type and paste the address. The purge reaches every edge location in a few seconds."
      />
    </ChatMessageRoot>
  </div>
</template>
```

### Actions

```vue
<script setup>
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CopyButton from '@aziontech/webkit/copy-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { ref } from 'vue'

  const answer =
    'Set **Cache by query string** to *Allowlist* and keep only `page` and `lang`. Campaign parameters such as `utm_source` stop creating new cache keys.'
  const feedback = ref(null)
  const sending = ref(false)

  function send(value) {
    feedback.value = value
    sending.value = true
    setTimeout(() => (sending.value = false), 800)
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ChatMessage timestamp="10:44">
      <StreamingResponse :content="answer" />
      <template #actions>
        <ChatMessage.Actions>
          <CopyButton :value="answer" />
          <IconButton
            icon="pi pi-refresh"
            aria-label="Regenerate response"
            kind="transparent"
            size="small"
          />
          <ChatMessage.Feedback
            :model-value="feedback"
            :loading="sending"
            @update:model-value="send"
          />
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
  </div>
</template>
```

### Lifecycle

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CopyButton from '@aziontech/webkit/copy-button'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const full =
    'The 502 responses started at 14:05, when the **origin certificate** expired. Upload the renewed certificate and the errors stop.'
  const state = ref('pending')
  const content = ref('')
  let timer

  function play() {
    clearTimeout(timer)
    clearInterval(timer)
    state.value = 'pending'
    content.value = ''
    timer = setTimeout(() => {
      state.value = 'streaming'
      let index = 0
      timer = setInterval(() => {
        index = Math.min(full.length, index + 3)
        content.value = full.slice(0, index)
        if (index >= full.length) {
          clearInterval(timer)
          state.value = 'complete'
        }
      }, 40)
    }, 1500)
  }

  onMounted(play)
  onBeforeUnmount(() => {
    clearTimeout(timer)
    clearInterval(timer)
  })
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col items-start gap-(--spacing-md)">
    <ChatMessage :state="state">
      <StreamingResponse
        :content="content"
        :streaming="state === 'streaming'"
      />
      <template #actions>
        <ChatMessage.Actions>
          <CopyButton :value="full" />
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
    <Button
      label="Replay"
      kind="outlined"
      size="small"
      icon="pi pi-refresh"
      :disabled="state !== 'complete'"
      @click="play"
    />
  </div>
</template>
```

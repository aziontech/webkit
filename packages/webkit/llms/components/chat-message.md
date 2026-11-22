# Chat Message

> One message in a generative AI conversation (Cloudscape's chat bubble, AI Elements' Message): the content and — once the response is complete — the action row a reader uses on it (copy, the helpful / not helpful thumbs, regenerate, read aloud, the sources). It owns the message lifecycle: `pending` (waiting for the first token: the loading text), `streaming` (content arriving, busy, no actions), `success` (actions shown; announced once to screen readers through the `Conversation`) and `error` (an error line with Try again). Assistant messages are plain text across the reading column (`.text-body-lg`): no avatar, name, time or bubble. User messages are a filled bubble at the inline end, at most 80 % wide; system messages a muted centered line. Author and time live in the accessible name (the time also shows on hover over the user's bubble). Alignment comes from the enclosing `Conversation`.

- Import: `import ChatMessageRoot from '@aziontech/webkit/chat-message-root'`
- Compound import (dot notation, not tree-shakeable): `import ChatMessage from '@aziontech/webkit/chat-message'`
- Category: ai · Surface: app · Structure: composition
- API as JSON: [chat-message.json](chat-message.json)

## When to use

- Every turn of a chat with the generative AI assistant: the person's prompt, the assistant's response, a system note ("Conversation restarted").
- A response that must show its lifecycle (loading, streaming, failure) and its actions.

## Do

- Pass `status` from your request: `pending` until the first token, `streaming` while tokens arrive, then `success` or `error`.
- Keep the action row always visible: Copy, the thumbs, Regenerate, app actions (Share), Read aloud, then the `Sources` pill in `#trailing`; give `CopyButton` and `IconButton` `size="large"` (40 px targets).
- Use `grouped` for a second message by the same author so stacked messages read as one turn.
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
- [response-loading](response-loading.md) — what `pending` renders.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `from` | `'user' \| 'assistant' \| 'system'` | `'assistant'` | false | Who wrote the message: the person (`user`), the generative AI assistant, or the product (`system`). |
| `author` | `string` | `''` | false | Author name read in the message's accessible name; it is not shown. Empty uses the locale catalog (`You`, `AI assistant`, `System`). |
| `timestamp` | `string` | `''` | false | Time the message was sent, already formatted for display (`10:42`). Added to the accessible name and shown on hover over the user's bubble. |
| `status` | `'pending' \| 'streaming' \| 'success' \| 'error'` | `'success'` | false | Lifecycle: `pending` shows the loading text, `streaming` marks the content busy, `success` shows the actions, `error` shows the error line with Try again. |
| `grouped` | `boolean` | `false` | false | Follows a message by the same author: tightens the gap above it so stacked messages read as one turn. |
| `errorMessage` | `string` | `''` | false | Error text shown while `status` is `error`. Empty uses the locale catalog. |
| `loadingLabel` | `string` | `''` | false | Loading text shown while `status` is `pending`. Empty uses `ResponseLoading`'s own (`Generating a response`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `retry` | `(event: MouseEvent)` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The content: text, `StreamingResponse`, `Reasoning`, `Sources`, artifacts. Not rendered while `pending`. |
| `actions` | — | The action row, usually `ChatMessage.Actions`; shown only when `status` is `success`. |

## Sub-component imports

- `@aziontech/webkit/chat-message-actions`
- `@aziontech/webkit/chat-message-feedback`

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

## States

- `data-from` (`user` | `assistant` | `system`), `data-status` (mirrors `status`), `data-alignment` (from the conversation), `data-grouped`.
- A visually hidden line (`__author`, dropped when `grouped`) reads the accessible name; the user bubble has the time as `title`.
- `aria-busy="true"` while `pending` or `streaming`.
- `pending`: `ResponseLoading` (inline, no delay — the owner decides when a message exists) in place of the content.
- `error`: the content (whatever streamed) stays; an error line with a danger glyph and a Try again `Button` follows.
- `success`: the `actions` slot renders.

## Accessibility

- Visible focus: the composed controls carry their own `focus-visible` rings.
- Keyboard map: `Tab` through links in the content, then the actions in order; Enter / Space activate. The message adds no key handling.
- ARIA: `<article aria-label="<author> at <time>">` so each message has a unique name (Cloudscape), repeated in a visually hidden line at its start for browse mode; `aria-busy` while loading or streaming; actions are a `role="group"` named `Message actions`; feedback thumbs use `aria-pressed`, the feedback status is `role="status"`.
- Announcement: when an assistant or system message turns `success` or `error` (or mounts finished after the conversation is ready), its text is read once through the `Conversation` live region.
- Never rely on alignment alone: every message names its author in its accessible name and hidden line (or is `grouped` after one that does).
- Contrast ≥4.5:1 on the muted time and system text.

## Right-to-left

- Layout: logical utilities; in `split` the user bubble sits at the inline end (left in RTL); the action row's pull is `-ms`.
- Icons: thumbs, refresh, speaker and stop are not mirrored.
- Keyboard: no arrow keys.
- User data: content renders `dir` per block (code is `dir="ltr"`).

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

## Responsive

- Container queries: none; user bubbles cap at 80 % of the thread width, assistant content fills it.
- Narrow: same layout; the action row wraps, and an open `Sources` list takes the full width under it.
- Touch: Feedback and Read aloud are 40 px `IconButton`s; the `Sources` pill has a 44 px hit area on coarse pointers.
- Reflow: long words break (`break-words`); code and tables scroll in their own blocks.

## Examples

### Default

```vue
<script setup>
  import ChatMessageRoot from '@aziontech/webkit/chat-message-root'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xl)">
    <ChatMessageRoot
      from="user"
      author="Jane Doe"
      timestamp="10:41"
    >
      How do I purge the cache of one URL?
    </ChatMessageRoot>
    <ChatMessageRoot timestamp="10:41">
      <StreamingResponse
        content="Open **Real-Time Purge**, choose *URL* as the purge type and paste the address. The purge reaches every data center in a few seconds."
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
  import Sources from '@aziontech/webkit/sources'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { ref } from 'vue'

  const sources = [
    { title: 'Cache settings', href: 'https://www.azion.com/en/documentation/' },
    { title: 'aziontech/azion', href: 'https://github.com/aziontech/azion', icon: 'az az-github' },
    { title: 'HTTP Caching', href: 'https://www.w3.org/Protocols/' }
  ]
  const answer =
    'Set **Cache by query string** to *Allowlist* and keep only `page` and `lang` [1]. Campaign parameters such as `utm_source` stop creating new cache keys [3].'
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
      <StreamingResponse
        :content="answer"
        :sources="sources"
        anchor="cache-answer"
      />
      <template #actions>
        <ChatMessage.Actions show-read-aloud>
          <CopyButton
            size="large"
            :value="answer"
          />
          <ChatMessage.Feedback
            :model-value="feedback"
            :loading="sending"
            @update:model-value="send"
          />
          <IconButton
            icon="az az-refresh"
            aria-label="Regenerate response"
            variant="ghost"
            size="large"
          />
          <template #trailing>
            <Sources
              :items="sources"
              anchor="cache-answer"
            />
          </template>
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
  const status = ref('pending')
  const content = ref('')
  let timer

  function play() {
    clearTimeout(timer)
    clearInterval(timer)
    status.value = 'pending'
    content.value = ''
    timer = setTimeout(() => {
      status.value = 'streaming'
      let index = 0
      timer = setInterval(() => {
        index = Math.min(full.length, index + 3)
        content.value = full.slice(0, index)
        if (index >= full.length) {
          clearInterval(timer)
          status.value = 'success'
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
    <ChatMessage :status="status">
      <StreamingResponse
        :content="content"
        :streaming="status === 'streaming'"
      />
      <template #actions>
        <ChatMessage.Actions>
          <CopyButton
            size="large"
            :value="full"
          />
        </ChatMessage.Actions>
      </template>
    </ChatMessage>
    <Button
      label="Replay"
      variant="outline"
      size="small"
      icon="az az-refresh"
      :disabled="status !== 'success'"
      @click="play"
    />
  </div>
</template>
```

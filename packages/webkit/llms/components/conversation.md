# Conversation

> The scrolling message log of a generative AI chat. It holds the thread (`ChatMessage` items, then whatever follows the last response: suggestions, an approval card), keeps the newest message in view while the reader is at the end, and stops following the moment they scroll up to read or copy an older message — a "Scroll to the latest message" button brings them back. It is a `role="log"` whose own live behavior is off, so streamed tokens are never read one by one; instead each `ChatMessage` that finishes (or fails) hands its text to the conversation's polite live region, once. With `moreMessages`, a Load earlier messages button opens the thread and the log also emits `load-more` as the reader scrolls near the top; prepended messages never move what the reader sees. It also sets where messages sit for the whole thread (`layout`): `split` for a full chat page, `start` for a dense side panel or drawer (Cloudscape's rule for embedded surfaces).

- Import: `import Conversation from '@aziontech/webkit/conversation'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [conversation.json](conversation.json)

## When to use

- Any surface where a person and the generative AI assistant exchange messages: the assistant page, the assistant drawer, an in-flow helper.
- A transcript that grows while the reader watches it (streaming responses, tool calls appearing).

## Do

- Pin the prompt input under the conversation; only the log scrolls.
- Never auto-scroll while the reader is reading an older message: the component already stops following when they scroll up.
- Use `layout="start"` in drawers and side panels, `split` on a full page.
- Keep one conversation per surface; a second thread is a second page or a history list.
- Prepend older messages in the same update that sets `loadingMore` back to `false`.

## Don’t

- A one-shot generated block on a page (a summary card, an explanation beside a chart) → render `StreamingResponse` in place.
- A log of system events with timestamps and filtering → use `log-viewer`.
- A list of past conversations → a `table` or `item` list; this is one thread.
- A lost or resuming connection (`Reconnecting…`) → the app's state, not the log's: an `Alert` or `StatusIndicator` above the prompt input.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [chat-message](chat-message.md) — the item the log holds; announces itself through this component.
- [prompt-input](prompt-input.md) — the composer pinned under the log (outside it; only the log scrolls).
- [suggestion-group](suggestion-group.md) — follow-up questions after the last response, or support prompts in the empty state.
- [empty-state](empty-state.md) — what the panel shows before the first message (the block renders it instead of the log).
- [log-viewer](log-viewer.md) — machine logs, not conversations.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `ariaLabel` | `string` | `''` | false | Accessible name of the message log. Empty uses the locale catalog (`Conversation`). |
| `layout` | `'split' \| 'start'` | `'split'` | false | `split` puts the user's messages at the inline end (a full chat page); `start` keeps every message at the inline start (a side panel or drawer). |
| `moreMessages` | `boolean` | `false` | false | Older messages exist above the first one. A Load earlier messages button opens the thread and the log emits `load-more` as the reader scrolls near the top. |
| `loadingMore` | `boolean` | `false` | false | The older messages are loading; the button at the top of the thread shows its spinner and holds further `load-more` requests. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `load-more` | `(event: Event)` | The button's click, or the top row came within 200 px of the viewport (`new Event('load-more')`). Not repeated while `loadingMore`, nor until older messages were prepended (the first message changed); after a failed load only the button asks again. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The thread: `ChatMessage` items in order, oldest first, plus anything that follows the last response (suggestions, an approval card). |

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

## States

- `data-pinned` on the root while the log follows the newest message; absent once the reader scrolled up (the Scroll to latest button shows). Only the reader's own scrolling unpins it (wheel, touch, pointer on the scrollbar, keys): a scroll the browser causes — a host moving the log in the DOM, a drawer opening — is corrected back to the end while pinned.
- `data-layout` mirrors `layout`; each message carries it as `data-alignment`.
- `data-loading-more` on the root and `aria-busy` on the log while `loadingMore`; the button is in its `loading` state.
- With `moreMessages` or `loadingMore` the first row (`__older`, observed by an `IntersectionObserver`) holds the button (`__load-more`).
- Scroll anchoring: while not pinned, the first message in view (or the button, while it has focus) is the anchor; growth above it is offset in the scroll position. Native `overflow-anchor` is off.
- Load failure: `loadingMore` returns to `false` with nothing prepended; the idle button is the retry path, nothing is announced, the error is the app's (an `Alert`).
- No `disabled`, `readonly`, `invalid`, `empty` or `error` state of its own.
- No `data-state` — nothing opens or closes.

## Accessibility

- Visible focus: the log is focusable (`tabindex="0"`) so keyboard users can scroll it; it shows an inset `focus-visible:ring-2 focus-visible:ring-(--ring-color)`.
- Keyboard map: `Tab` reaches the log, arrows / Page Up / Page Down scroll it; `Tab` continues into the messages' controls (the Load earlier messages button first); the Scroll to latest button is a normal button.
- Focus: the button stays focusable while loading (`aria-disabled`); if it leaves while focused, the log takes focus.
- ARIA: `role="log"` with `aria-live="off"` (streaming chunks are not read) and `aria-label`; a separate visually hidden `aria-live="polite"` `aria-atomic="true"` region receives `"<author>: <text>"` when an assistant or system message completes or fails. User messages are not announced (the reader just typed them). It also says `Loading earlier messages`, then `Earlier messages loaded` once older messages were prepended.
- Contrast ≥4.5:1 (text) / ≥3:1 (icons) on both buttons, idle and loading (`Button`'s own colors).
- Reduced motion: smooth scrolling is replaced by a jump.
- Touch target: the scroll button is a medium `IconButton` (≥32 px, 44 px on coarse pointers through `IconButton`).

## Right-to-left

- Layout: logical utilities only; `split` puts user messages at the inline end, so they move to the left under `dir="rtl"`.
- Icons: the arrow-down and arrow-up glyphs are vertical and not mirrored.
- Keyboard: no horizontal keys.
- User data: messages carry their own `dir` where needed (`StreamingResponse` code is `dir="ltr"`).

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

## Responsive

- Container queries: none; the thread centers at `--layout-measure-content` and fills narrower hosts.
- Narrow (≤ 640 px or a drawer): full width; the owner should pass `layout="start"`.
- Touch: the scroll button and the Load earlier messages button meet 44 px on coarse pointers (both through their own `pointer-coarse` hit area).
- Reflow: no horizontal scroll at 320 px; wide code and tables scroll inside their own blocks; the Load earlier messages label fits at 320 px and 200 % zoom without horizontal scroll.

## Examples

### Default

````vue
<script setup>
  import ChatMessageRoot from '@aziontech/webkit/chat-message-root'
  import Conversation from '@aziontech/webkit/conversation'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'

  const followUps = [
    { id: 'wildcard', label: 'How do I purge a whole folder?' },
    { id: 'ttl', label: 'What TTL should my images use?' }
  ]
</script>

<template>
  <div
    class="flex h-[28rem] w-full max-w-(--container-3xl) flex-col rounded-(--shape-card) border border-(--border-default)"
  >
    <Conversation>
      <ChatMessageRoot
        from="user"
        timestamp="10:41"
      >
        How do I purge the cache of one URL?
      </ChatMessageRoot>
      <ChatMessageRoot timestamp="10:41">
        <StreamingResponse
          content="Open **Real-Time Purge**, choose *URL* as the purge type and paste the address."
        />
      </ChatMessageRoot>
      <ChatMessageRoot
        from="user"
        timestamp="10:43"
      >
        Can I do it from the CLI?
      </ChatMessageRoot>
      <ChatMessageRoot timestamp="10:43">
        <StreamingResponse
          :content="'Yes:\n\n```bash\nazion purge urls --urls https://www.example.com/styles.css\n```'"
        />
      </ChatMessageRoot>
      <SuggestionGroup
        :items="followUps"
        aria-label="Follow-up questions"
      />
    </Conversation>
  </div>
</template>
````

### StartAlignment

````vue
<script setup>
  import ChatMessageRoot from '@aziontech/webkit/chat-message-root'
  import Conversation from '@aziontech/webkit/conversation'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SuggestionGroup from '@aziontech/webkit/suggestion-group'

  const followUps = [
    { id: 'wildcard', label: 'How do I purge a whole folder?' },
    { id: 'ttl', label: 'What TTL should my images use?' }
  ]
</script>

<template>
  <div
    class="flex h-[28rem] w-full max-w-(--container-xs) flex-col rounded-(--shape-card) border border-(--border-default)"
  >
    <Conversation layout="start">
      <ChatMessageRoot
        from="user"
        timestamp="10:41"
      >
        How do I purge the cache of one URL?
      </ChatMessageRoot>
      <ChatMessageRoot timestamp="10:41">
        <StreamingResponse
          content="Open **Real-Time Purge**, choose *URL* as the purge type and paste the address."
        />
      </ChatMessageRoot>
      <ChatMessageRoot
        from="user"
        timestamp="10:43"
      >
        Can I do it from the CLI?
      </ChatMessageRoot>
      <ChatMessageRoot timestamp="10:43">
        <StreamingResponse
          :content="'Yes:\n\n```bash\nazion purge urls --urls https://www.example.com/styles.css\n```'"
        />
      </ChatMessageRoot>
      <SuggestionGroup
        :items="followUps"
        aria-label="Follow-up questions"
      />
    </Conversation>
  </div>
</template>
````

### LongThread

```vue
<script setup>
  import ChatMessageRoot from '@aziontech/webkit/chat-message-root'
  import Conversation from '@aziontech/webkit/conversation'

  const questions = [
    'Which domains does storefront answer on?',
    'Is the certificate of shop.example.com valid?',
    'When does it expire?',
    'Can it renew on its own?',
    'What is the cache hit ratio today?',
    'Which paths miss the cache most?'
  ]
  const answers = [
    'storefront answers on www.example.com and shop.example.com.',
    'Yes, it is a valid Let’s Encrypt certificate.',
    'On 14 January, in 64 days.',
    'Yes. Automatic renewal is on for both domains.',
    '91% over the last 24 hours.',
    'The search pages, because every query is a new cache key.'
  ]
</script>

<template>
  <div
    class="flex h-[24rem] w-full max-w-(--container-3xl) flex-col rounded-(--shape-card) border border-(--border-default)"
  >
    <Conversation>
      <template
        v-for="(question, index) in questions"
        :key="question"
      >
        <ChatMessageRoot from="user">{{ question }}</ChatMessageRoot>
        <ChatMessageRoot>{{ answers[index] }}</ChatMessageRoot>
      </template>
    </Conversation>
  </div>
</template>
```

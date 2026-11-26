# Prompt Queue

> Messages sent while a response is generating, waiting above the prompt input (TanStack AI `useChat` `queue`): each shows its text in send order with a button that removes it before it is sent; changes are announced politely.

- Import: `import PromptQueue from '@aziontech/ui/prompt-queue'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [prompt-queue.json](prompt-queue.json)

## When to use

- A chat that lets the reader keep typing while a response streams and holds the extra messages.
- Directly above the `prompt-input`, in the composer area of the conversation.

## Do

- Keep it mounted for the whole chat, so every change is announced.
- Keep each queued message's id, so a removal cancels the right one.
- When the queue empties, move focus back to the prompt input.

## Don’t

- Prompts the reader may choose to send → `suggestion-group`.
- Messages already sent → `chat-message`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [prompt-input](prompt-input.md) — the composer it sits above.
- [suggestion-group](suggestion-group.md) — prompts to send, not prompts waiting.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `items` | `PromptQueueItem[]` | `[]` | false | The waiting messages, in the order they will be sent. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the list. Empty uses the locale catalog (`Queued messages`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `remove` | `(event: MouseEvent, item: PromptQueueItem)` |  |

## Sub-components

_None. Data-driven. `PromptQueueItem`: `{ id: string; text: string; attachmentCount?: number }` (text parts joined; non-text parts counted, shown above zero)._

## States

- Empty: no box, only the hidden status region; `data-empty` on the root.
- Populated: the box with the count line and one row per item.
- Clamped item: a message longer than two lines shows a `Show more` link under it; it expands that message in place (`data-state="open"` on the text) and reads `Show less` to fold it back, so the reader can review the whole message before it is sent.
- No `disabled`, `loading`, `invalid` or `error` state, and no component-level `open` state: a message leaves only through the owner.

## Accessibility

- Visible focus: the `IconButton` ring.
- Keyboard map: `Tab` moves between the remove buttons (and the `Show more` toggle of a clamped message) in queue order; `Enter` / `Space` removes or toggles.
- Focus: when a focused row leaves (removed or sent), focus moves to the remove button now at that position, else the last; an empty queue hands focus to the owner.
- ARIA: a native `ol` named `Queued messages` (`ariaLabel`); each remove button is named `Remove from queue` and described by its text; the `Show more` / `Show less` toggle carries `aria-expanded` and `aria-controls` pointing at its message; glyphs `aria-hidden`.
- Announcements: a hidden polite `role="status"` says `2 messages queued` on each count change after mount and `No messages queued` when empty.
- Touch target: 44 px on coarse pointers.

## Right-to-left

- Layout: logical utilities; the remove button sits at the inline end.
- Icons: `az-clock`, `az-paperclip`, `az-x` are not directional.
- Keyboard: Tab follows queue order.
- User data: message text has `dir="auto"`.

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

## Responsive

- Container queries: none.
- Narrow: the box takes the composer width; text wraps and clamps at two lines.
- Touch: remove buttons 44 px on coarse pointers.
- Reflow: no horizontal scroll at 320 px or 200 % zoom; `wrap-anywhere` breaks long URLs inside the clamp.

## Examples

### Default

```vue
<script setup>
  import PromptInput from '@aziontech/ui/prompt-input-root'
  import PromptQueue from '@aziontech/ui/prompt-queue'
  import { ref } from 'vue'

  const prompt = ref('')
  const queue = ref([
    { id: 'q1', text: 'Also purge the cache for app.example.com' },
    { id: 'q2', text: 'Then show me the error rate for the last hour', attachmentCount: 1 }
  ])
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--layout-group-gap)">
    <PromptQueue
      :items="queue"
      @remove="(event, item) => (queue = queue.filter((entry) => entry.id !== item.id))"
    />
    <PromptInput
      v-model="prompt"
      status="streaming"
    />
  </div>
</template>
```

### LongMessage

```vue
<script setup>
  import PromptQueue from '@aziontech/ui/prompt-queue'
  import { ref } from 'vue'

  const queue = ref([
    {
      id: 'q1',
      text:
        'After this finishes, compare the cache hit ratio of the production and staging applications over the last ' +
        'seven days, list the five paths with the most misses in each, and suggest a TTL for every one of them'
    },
    {
      id: 'q2',
      text: 'Check https://app.example.com/assets/images/products/acme-store/summer-collection/hero-banner-large-retina.webp'
    },
    { id: 'q3', text: 'Thanks' }
  ])
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <PromptQueue
      :items="queue"
      @remove="(event, item) => (queue = queue.filter((entry) => entry.id !== item.id))"
    />
  </div>
</template>
```

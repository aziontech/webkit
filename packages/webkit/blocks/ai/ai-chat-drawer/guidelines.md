# AI chat drawer

The generative AI assistant beside the work: the reader is on a resource page — here a workload whose error rate is up — and opens the assistant in a drawer to ask about what they see, without losing the page. The drawer carries the same conversation as the full assistant page, laid out for a narrow column: every message at the inline start, a shorter composer, and support prompts written about this resource. It is a page body for `ConsoleLayout`: the app renders it in the layout's default slot, and the layout owns the rail, the header and the `main`.

## When to use

- Use ai-chat-drawer when the questions are about the page the user is on and they should keep it in view.
- A resource or list page where questions are about what is on screen: why a metric moved, what a setting does, how to fix a status.
- A global Agent entry point in the console header, when the reader should keep their place.
- A short exchange that ends back on the page (the reader acts on the answer there).

## When not to use

- Long, open-ended work with the assistant as the main task: use `ai/ai-chat`.
- Static help about the page that does not need a conversation: use `HelpPanel` in a drawer.
- An action the assistant proposes: show `ai/ai-action-approval` inside this conversation; never let the drawer change the page on its own.
- A create or edit form: use `create/create-drawer`.

## Building blocks

### A. Page behind — `PageHeader`, `Card`, `KeyValueList`, `StatusIndicator`

The resource page the reader is on. The assistant's support prompts and answers refer to it, so keep it visible and undimmed: the drawer has no overlay.

### B. Entry point — `Button`

An outlined Agent `Button` with the assistant mark in the page header actions, `aria-expanded` while the drawer is open. A console-wide entry point lives in the global header instead.

### C. Drawer frame — `Drawer`, `DrawerContent`

A medium right-side `Drawer` with no so the resource page beside it stays undimmed and readable while the reader asks about it. Escape and the close button dismiss it. Inside `ConsoleLayout` on a wide screen, put the same conversation in the layout's tools region (`v-model:tools-open`, as the console Notifications do) and keep the drawer for narrow screens; the conversation survives closing and reopening during the visit.

### D. Header — `PanelHeader`, `DrawerTitle`, `Tag`, `IconButton`

`DrawerTitle` with the assistant's name, a Preview `Tag`, New chat as an `IconButton`, then the drawer's own close button.

### E. Empty state — `EmptyState`, `SuggestionGroup`

A small `EmptyState` titled with the resource ("Ask about storefront") and three support prompts about it, stacked.

### F. Message log — `Conversation`

`layout="start"`: every message at the inline start, distinguished by avatar and author line, as Cloudscape asks for dense side panels. It is the only part of the drawer that scrolls.

### G. Messages — `ChatMessage`, `Reasoning`, `StreamingResponse`, `Sources`, `CopyButton`

The same prompt and response anatomy as the full page: loading, thinking, streaming with citations, sources, and `ChatMessage.Actions` with `CopyButton`, Regenerate and feedback.

### H. Follow-up questions — `SuggestionGroup`

After the last complete response, aligned with its text.

### I. Composer — `PromptInput`

At the foot of the drawer above a divider: four rows at most, a placeholder that names the resource, Stop while generating, and the short disclaimer as its hint.

## Data

The block takes the conversation through props and emits every action; it calls no model. `AiChatDrawerMessage`, `AiChatDrawerProps` and `AiChatDrawerFeedback` are exported from `ai-chat-drawer.vue`, and `sample.ts` holds the starter prompts the empty state renders when `suggestions` is left out, plus the sample threads the variants pass. The draft in the composer stays local.

| Prop           | Type                    | What it does                                                                                                                                |
| -------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`     | `AiChatDrawerMessage[]` | The conversation, oldest first: the reader's text, the assistant's Markdown with its reasoning and sources. Empty, the empty state renders. |
| `suggestions`  | `SuggestionGroupItem[]` | The starter prompts under the empty state.                                                                                                  |
| `followUps`    | `SuggestionGroupItem[]` | Follow-up questions under the last finished answer.                                                                                         |
| `loading`      | `boolean`               | The assistant is answering: the last assistant message thinks while its `content` is empty, then streams; the composer shows Stop.          |
| `error`        | `string`                | Why the last answer failed, shown on it with Try again; its partial text stays.                                                             |
| `v-model:open` | `boolean`               | Whether the drawer is open (open by default); Agent opens it and its close button closes it.                                                |

| Event      | Payload                | When                                                                                      |
| ---------- | ---------------------- | ----------------------------------------------------------------------------------------- |
| `send`     | `(event, text)`        | The composer, a starter prompt or a follow-up; append the reader's message and the reply. |
| `stop`     | `(event)`              | Stop while the answer streams; keep the text and set `stopped` on it.                     |
| `retry`    | `(event, message)`     | Try again on a failed answer or Regenerate response.                                      |
| `new-chat` | `(event)`              | New chat; clear `messages`.                                                               |
| `feedback` | `({ message, value })` | The reader rated an answer.                                                               |

To go live, render the block from a page that owns the conversation and the model call:

```vue
<script setup lang="ts">
  import AiChatDrawer from './ai-chat-drawer.vue'

  const { messages, streaming, error, send, stop, retry, reset } = useAssistant()
  const failed = 'The connection was interrupted before the response finished.'
</script>

<template>
  <AiChatDrawer
    :messages="messages"
    :loading="streaming"
    :error="error ? failed : ''"
    @send="(_event, text) => send(text)"
    @stop="stop"
    @retry="(_event, message) => retry(message)"
    @new-chat="reset"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Write support prompts and the placeholder about the resource on screen.
- Keep the page visible and unchanged while the drawer is open.
- Keep the conversation when the drawer closes and reopens during the visit.
- Use `layout="start"` for every message in the drawer.

## Don't

- Don't change the page from a response; propose the change and ask for approval.
- Don't stack a second drawer from the assistant; link to the page that does the job.
- Don't open the drawer on its own; the reader opens it.
- Don't repeat the page title in every response; the context is implied.

## Copy

- **Entry point:** `Agent`, the name the console header's `HighlightButton` gives the same assistant; the panel title says what it is, `AI assistant`.
- **Drawer title:** `AI assistant`, with the Preview tag while in preview.
- **Empty state:** "Ask about <resource>" and one sentence saying the assistant reads this resource's settings and metrics.
- **Placeholder:** "Ask about <resource>".
- **Disclaimer:** "The AI assistant can make mistakes. Check important information."
- Errors, loading and feedback strings follow `ai/ai-chat` and `skills/webkit-microcopy`.

## Accessibility

- The drawer traps focus while open and returns it to Agent when it closes; `DrawerTitle` names the dialog.
- Agent exposes `aria-expanded`.
- The log is a named `role="log"` with live behavior off; finished responses are announced once through the conversation's polite region.
- New chat is an icon button with an accessible name; it is disabled while the thread is empty.
- Keyboard order inside the drawer: header controls, log, message actions, follow-ups, composer.

## States

- Empty: the drawer open with `messages` left out, on the empty state with three support prompts about storefront.
- Streaming: `loading` with a response part-way written about the errors of the workload behind the drawer.
- Error: `error` set: a failed response with its partial text and Try again.
- LongThread: six earlier turns as `messages` that overflow the drawer's log.

## Related

- `ai/ai-chat` — the full-page assistant.
- `ai/ai-action-approval` — authorization of an action the assistant proposes.
- `create/create-drawer` — the drawer for forms, not conversations.
- `skills/webkit-ai-surfaces` — the rules for generative AI surfaces.

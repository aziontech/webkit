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

### J. Tool calls — `ToolCall`, `ToolApproval`, `CodeBlock`

A `tool-call` part draws in its place in the response as a `ToolCall` with the tool name in code, the `title` the `tools` prop gives it, and its input and output in a `CodeBlock` when opened; it reads streaming (its arguments arriving), running, completed, failed, canceled (a `cancelled` result) or denied from the call's `state` and its `tool-result`. A call that needs approval draws a `ToolApproval` card first, with the question, verb and danger variant from `tools` and the call's input in a `CodeBlock`; a tool with `editable` shows its arguments as JSON the reader can edit, Approve staying off while they do not parse. Deny and the approve button resolve the matching `useChat` interrupt (an edit as `{ editedArgs }`), and an approved call runs as a `ToolCall` under the card. The card stays busy until the run that asked for it ends. See `ai/ai-action-approval` for the whole approval flow.

### K. Media — `ImageGallery`, `AudioPlayer`, `VideoPlayer`, `FilePreview`

Media parts draw in their place in the response. Consecutive `image` parts are one `ImageGallery` (a URL becomes `src`, base64 data becomes `data` with its `mimeType`, `metadata.alt` its alternative text); an `audio` part is an `AudioPlayer` and a `video` part a `VideoPlayer`, each from its URL or a `data:` URL; a `document` part is a `FilePreview` from its URL or base64, named by `metadata.name` (else `Document`). A `file` source (a provider file handle) has no bytes to draw and is skipped.

### L. Agent work — `AgentActivity`, `SubagentCard`, `AgentQuestion`

The `activity` parts of a response, and the `activity` messages between the reader's prompt and it, are one `AgentActivity` at the top of the response. A `subagent` part is a `SubagentCard` named by the helper, with its input in a `CodeBlock` and its own answer in `StreamingResponse` when opened: running is running, finished is completed, suspended waits, and an error reads canceled when its message is `Stopped`; Stop shows when the part carries `stop()` and calls it. A pending generic interrupt is an `AgentQuestion` in an assistant message after the turn it arrived in: its `message` is the question, `metadata.options` (or `payload.options`) the choices, else a text field; Submit calls `resolveInterrupt(answer)` and Skip calls `cancel()`. The card stays with the answer, or Skipped, after the interrupt leaves `interrupts`.

### M. Queue and connection — `PromptQueue`, `StatusIndicator`, `Alert`

With `queue` the composer keeps Submit beside Stop while a response runs (`queueable`), and the waiting messages show in a `PromptQueue` above it, each removable. Above the composer a warning `StatusIndicator` reads Reconnecting while `connection` is `connecting` or `resuming` is set, and a danger `Alert` says the connection was lost while it is `disconnected` or `error`.

## Data

The block draws a conversation in the message shape of TanStack AI: each message has an `id`, a `role` and its `parts` in order (`text`, `thinking`, `tool-call`, `tool-result`, `image`, `audio`, `video`, `document`, `activity`, `subagent`), so the values `useChat` from `@tanstack/ai-vue` returns go straight into its props, with no conversion. The block calls no model and depends on no AI library; `messages.ts` declares the same shape itself (`AiChatDrawerMessage`, `AiChatDrawerPart`, `AiChatDrawerTool`, `AiChatDrawerInterrupt`, re-exported from `ai-chat-drawer.vue`), so any source that produces it works. Parts it does not draw (structured output, `ui-resource`) are skipped. `sample.ts` holds the sample threads the variants pass. The draft in the composer stays local.

An activity step reads, by convention, `content.title` (else its `activityType`), `content.status` (`pending`, `running`, `success` or `complete`, `error`, `canceled` or `cancelled`, `skipped`; left out, running) and `content.detail` as the line under it.

What TanStack AI does not carry, the app adds in `metadata`: `sources` (the documents the response cites, numbered in order), `reasoningSeconds` (left out, the block measures the thinking time) and `stopped` (the block also marks the response that Stop ended). A message's time is its `createdAt`, formatted in the reader's locale.

| Prop           | Type                               | What it does                                                                                                                                                        |
| -------------- | ---------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`     | `AiChatDrawerMessage[]`            | The conversation, oldest first, as `useChat` returns it. Empty, the empty state renders.                                                                            |
| `suggestions`  | `SuggestionGroupItem[]`            | The starter prompts under the empty state.                                                                                                                          |
| `followUps`    | `SuggestionGroupItem[]`            | Follow-up questions under the last finished response.                                                                                                               |
| `loading`      | `boolean`                          | `isLoading` from `useChat`: the last response thinks, then streams, and the composer shows Stop.                                                                    |
| `error`        | `string \| Error`                  | `error` from `useChat` shows the standard sentence on the last response with Try again; a string shows that sentence instead.                                       |
| `tools`        | `Record<string, AiChatDrawerTool>` | How each tool reads, by name: `title` for the call, `question`, `description`, `approveLabel`, `variant` `confirmationPhrase` and `editable` for its approval card. |
| `interrupts`   | `interrupts` of `useChat`          | The pending approvals and questions; the approve button and Deny resolve the one whose `toolCallId` matches the call, and a generic one asks its question.          |
| `queue`        | `queue` of `useChat`               | The messages waiting to be sent, shown above the composer; given, the composer sends while a response runs.                                                         |
| `moreMessages` | `boolean`                          | `hasOlderMessages` of `useChat`: the log offers Load earlier messages.                                                                                              |
| `loadingMore`  | `boolean`                          | The older messages are loading.                                                                                                                                     |
| `connection`   | `connectionStatus` of `useChat`    | `connecting` shows Reconnecting, `disconnected` or `error` shows Connection lost; default `connected`.                                                              |
| `resuming`     | `boolean`                          | `resuming` of `useChat`: Reconnecting while a run is rejoined.                                                                                                      |
| `v-model:open` | `boolean`                          | Whether the drawer is open (open by default); Agent opens it and its close button closes it.                                                                        |

| Event           | Payload                 | When                                                                                                                                              |
| --------------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `send`          | `(event, text)`         | The composer, a starter prompt or a follow-up: call `sendMessage(text)`.                                                                          |
| `stop`          | `(event)`               | Stop while the response streams: call `stop()`. The block marks the stopped response.                                                             |
| `retry`         | `(event, message)`      | Try again or Regenerate response: call `reload()`.                                                                                                |
| `new-chat`      | `(event)`               | New chat: call `clear()`.                                                                                                                         |
| `feedback`      | `({ message, value })`  | The reader rated a response.                                                                                                                      |
| `approve`       | `(event, call, input?)` | The approve button on an approval card; `input` is the edited arguments of an `editable` tool. The block already resolved the matching interrupt. |
| `remove-queued` | `(event, item)`         | Remove on a queued message: call `cancelQueued(item.id)`.                                                                                         |
| `load-more`     | `(event)`               | Load earlier messages, or the top of the log reached: call `loadOlderMessages()`.                                                                 |
| `deny`          | `(event, call)`         | Deny on an approval card; the block already resolved the matching interrupt.                                                                      |

To go live, install `@tanstack/ai`, `@tanstack/ai-vue` and the adapter of your model (`@tanstack/ai-anthropic`, `@tanstack/ai-openai`…), add a server route that streams the model, and bind `useChat` to the block:

```ts
// server: POST /api/chat
import { chat, chatParamsFromRequest, toServerSentEventsResponse } from '@tanstack/ai'

export async function POST(request: Request) {
  const params = await chatParamsFromRequest(request)
  return toServerSentEventsResponse(chat({ adapter: yourModelAdapter, ...params, tools: [] }))
}
```

```vue
<script setup lang="ts">
  import { fetchServerSentEvents, useChat } from '@tanstack/ai-vue'

  import AiChatDrawer from './ai-chat-drawer.vue'

  const {
    messages,
    isLoading,
    error,
    interrupts,
    queue,
    hasOlderMessages,
    connectionStatus,
    resuming,
    sendMessage,
    stop,
    reload,
    clear,
    cancelQueued,
    loadOlderMessages
  } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
    threadId: 'assistant'
  })
</script>

<template>
  <AiChatDrawer
    :messages="messages"
    :loading="isLoading"
    :error="error"
    :interrupts="interrupts"
    :queue="queue"
    :more-messages="hasOlderMessages"
    :connection="connectionStatus"
    :resuming="resuming"
    @send="(_event, text) => sendMessage(text)"
    @remove-queued="(_e, item) => cancelQueued(item.id)"
    @load-more="loadOlderMessages()"
    @stop="stop()"
    @retry="reload()"
    @new-chat="clear()"
  />
</template>
```

A tool that needs approval is declared once with `toolDefinition({ name, inputSchema, needsApproval: true })`, run on the server with `.server(...)` and passed to `useChat({ tools: [definition] })` too, so the client can match the approval request to the call. Then delete `sample.ts` and its import. `apps/demos` runs this block on `useChat` with TanStack AI's `fakeText` model (`src/lib/assistant-model.ts`), no server and no key.

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
- **Connection:** `Reconnecting`; `Connection lost` with "Your messages send when the connection returns."

## Accessibility

- The drawer traps focus while open and returns it to Agent when it closes; `DrawerTitle` names the dialog.
- Agent exposes `aria-expanded`.
- The log is a named `role="log"` with live behavior off; finished responses are announced once through the conversation's polite region.
- New chat is an icon button with an accessible name; it is disabled while the thread is empty.
- Keyboard order inside the drawer: header controls, log, message actions, follow-ups, composer.
- Reconnecting is a polite status and Connection lost an alert; the queued messages are a list named Queued messages, each with Remove from queue; a question card is a group named by its question.

## States

- Empty: the drawer open with `messages` left out, on the empty state with three support prompts about storefront.
- Streaming: `loading` with a response part-way written about the errors of the workload behind the drawer.
- Error: `error` set: a failed response with its partial text and Try again.
- Tools: a `tool-call` part draws as a `ToolCall` titled from `tools`; one with `approval` draws the `ToolApproval` card first (see `ai/ai-action-approval`).
- LongThread: six earlier turns as `messages` that overflow the drawer's log.
- Media and agent parts, the queue, older messages and the connection draw as in `ai/ai-chat` (its Media and Agent variants).

## Related

- `ai/ai-chat` — the full-page assistant.
- `ai/ai-action-approval` — authorization of an action the assistant proposes.
- `create/create-drawer` — the drawer for forms, not conversations.
- `skills/webkit-ai-surfaces` — the rules for generative AI surfaces.

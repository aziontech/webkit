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

A medium end-side `Drawer` with no backdrop (`:modal="false"`), so the resource page beside it stays undimmed and readable while the reader asks about it. From the `lg` breakpoint the page reserves the drawer's width while it is open (`data-drawer-open` on the block root sets `padding-inline-end` to the medium drawer width), so nothing on the page sits under the conversation; below `lg` the drawer covers the page, so it turns modal there (`:modal="!wide"`): focus stays in the conversation and Tab never reaches the hidden page. Escape and the close button dismiss it. Inside `ConsoleLayout` on a wide screen, put the same conversation in the layout's tools region (`v-model:tools-open`, as the console Notifications do) and keep the drawer for narrow screens; the conversation survives closing and reopening during the visit.

### D. Header — `PanelHeader`, `DrawerTitle`, `Tag`, `IconButton`

A `PanelHeader` on the drawer's surface over the canvas of the thread: `DrawerTitle` with the assistant's name, a Preview `Tag`, New chat as an `IconButton`, then the drawer's own close button. The drawer has no history panel; the full-page `ai/ai-chat` keeps the history.

### E. Empty state — `EmptyState`, `SuggestionGroup`

A small `EmptyState` titled with the resource ("Ask about storefront") and three support prompts about it, stacked, centered inside the log so the composer stays mounted when the thread starts.

### F. Message log — `Conversation`

The same layout as the full page: the reader's prompts in a bubble at the inline end, responses as plain text across the panel, no avatars. It is the only part of the drawer that scrolls, and it sits on the drawer's own surface: the body sets `--conversation-composer-fade` to `--bg-surface` so the fade under the composer matches it, and the prompt bubbles (`--bg-selected`) stand apart from it in both themes; the composer floats over its foot.

### G. Messages — `ChatMessage`, `Reasoning`, `StreamingResponse`, `Sources`, `ResponseBranches`, `FeedbackReasonDialog`

The same prompt and response anatomy as the full page: loading, thinking, streaming with site-name citation chips, and `ChatMessage.Actions` with Copy, Feedback (Good response and Bad response in a menu), Read aloud, Share, Try again and More (in the drawer's narrow column Good response, Bad response and Try again sit in More), the Sources pill at its end on the same line, a `ResponseBranches` pager after Try again, and Copy and Edit under each prompt. The files a reader attached draw under their prompt as media does in a response (section K).

### H. Follow-up questions — `SuggestionGroup`

After the last complete response, aligned with its text.

### I. Composer — `PromptInput`, `PromptInputAttachButton`, `PromptInputDictateButton`

The `#composer` of `Conversation`: one floating pill at the foot of the drawer, no divider, four rows at most, a placeholder that names the resource, Stop while generating, and the short disclaimer as its hint until the first message is sent, then no disclaimer. The "+" menu (`attachable`, `toolOptions`, `v-model:toolKeys`; pass the keys as `sendMessage(content, { body: { tools: toolKeys } })`), attachments (`accept`, `maxFiles`, `maxFileSize`), the multimodal `send` content and Dictate work as in `ai/ai-chat`. The composer is disabled while the conversation is restored.

### J. Tool calls — `ToolCall`, `ToolApproval`, `CodeBlock`

A `tool-call` part draws in its place in the response as a `ToolCall` with the tool name in code, the `title` the `tools` prop gives it, and its input and output in a `CodeBlock` when opened; it reads streaming (its arguments arriving), running, completed, failed, canceled (a `cancelled` result) or denied from the call's `state` and its `tool-result`. A call that needs approval draws a `ToolApproval` card first, with the question, verb and danger variant from `tools` and the call's input in a `CodeBlock`; a tool with `editable` shows its arguments as JSON the reader can edit, Approve staying off while they do not parse. Deny and the approve button resolve the matching `useChat` interrupt (an edit as `{ editedArgs }`), and an approved call runs as a `ToolCall` under the card. The card stays busy until the run that asked for it ends. See `ai/ai-action-approval` for the whole approval flow. A `tool-result` whose `content` is a list of text and image parts draws as text and an `ImageGallery` in the output, not as JSON. A tool marked `answerable` in `tools` is one the reader answers (a client tool with no `execute`): until it has an output it draws as an `AgentQuestion` with its `question` and `options` (else a text field), and Submit emits `answer-tool` with the payload `addToolResult` takes.

### K. Media — `ImageGallery`, `AudioPlayer`, `VideoPlayer`, `FilePreview`

Media parts draw in their place in the response. Consecutive `image` parts are one `ImageGallery` (a URL becomes `src`, base64 data becomes `data` with its `mimeType`, `metadata.alt` its alternative text); an `audio` part is an `AudioPlayer` and a `video` part a `VideoPlayer`, each from its URL or a `data:` URL; a `document` part is a `FilePreview` from its URL or base64, named by `metadata.name` (else `Document`). A `file` source (a provider file handle) has no bytes to draw and is skipped. A media or document part given as a URL loads as soon as it draws, with no click from the reader, so the browser fetches whatever address the model or a tool returned. Before the parts reach the block, keep URLs only from origins the app trusts (its own, its storage bucket) and turn any other into a plain link the reader chooses to open. `FilePreview` accepts only `http(s)`, `blob:` and `data:` addresses; a policy with `object-src 'none'` stops its PDF viewer, so allow `object-src 'self' blob:` where documents preview.

### L. Agent work — `AgentActivity`, `SubagentCard`, `AgentQuestion`

The `activity` parts of a response, and the `activity` messages between the reader's prompt and it, are one `AgentActivity` at the top of the response. A `subagent` part is a `SubagentCard` named by the helper, with its input in a `CodeBlock` and its own answer in `StreamingResponse` when opened: running is running, finished is completed, suspended waits, and an error reads canceled when its message is `Stopped`; Stop shows when the part carries `stop()` and calls it. A pending generic interrupt is an `AgentQuestion` in an assistant message after the turn it arrived in: its `message` is the question, `metadata.options` (or `payload.options`) the choices, else a text field; Submit calls `resolveInterrupt(answer)` and Skip calls `cancel()`. The card stays with the answer, or Skipped, after the interrupt leaves `interrupts`. An `unbound` interrupt (one the chat cannot resolve, such as a workflow engine's approval) is asked the same way without Skip; Submit emits `answer-interrupt` so the app routes the answer to whatever owns the pause, and the card shows it as sending until the interrupt leaves.

### M. Queue and connection — `PromptQueue`, `StatusIndicator`, `Alert`

With `queue` the composer keeps Submit beside Stop while a response runs (`queueable`), and the waiting messages show in a `PromptQueue` above it, each removable. Above the composer a warning `StatusIndicator` reads Reconnecting while `connection` is `connecting` or `resuming` is set, a danger `Alert` says the connection was lost while it is `disconnected` or `error`, and an info `StatusIndicator` reads Responding in another tab while `sessionGenerating` is set and this tab is not loading. When `interruptErrors` holds a failed answer, a danger `Alert` says Your answer was not sent with its reason, and Retry (shown when one is retryable) emits `retry-interrupts`.

### N. Tool widgets — `McpAppFrame`

A `ui-resource` part (an MCP app a tool returned) draws as a `McpAppFrame` under its call: a sandboxed frame with no network and no reach into the page, titled from `tools` or the tool name. Inline HTML shows as it is; a widget given only by address shows when `resolveAppUrl` returns a trusted `https` address for it. Every message the widget sends reaches the app through `app-message` with a `reply` that answers the widget; the block never acts on one, so the app decides which tool a widget may call and sends sensitive ones through approval.

### O. Structured answers — `CodeBlock`, `Alert`

A `structured-output` part (an answer against a schema) draws as a JSON `CodeBlock`: the progressive `partial` (else `raw`) while it streams, `data` once complete. Its `reasoning` joins the response's `Reasoning`. On `error` a danger `Alert` says The structured answer failed with its `errorMessage`.

### P. Restoring — `Skeleton`

While `hydrating` (`isHydrating` of `useChat`) and no message is in place yet, three `Skeleton` rows stand in for the conversation in a status named Loading the conversation, instead of the empty state.

## Data

The block draws a conversation in the message shape of TanStack AI: each message has an `id`, a `role` and its `parts` in order (`text`, `thinking`, `tool-call`, `tool-result`, `image`, `audio`, `video`, `document`, `activity`, `subagent`, `structured-output`, `ui-resource`), so the values `useChat` from `@tanstack/ai-vue` returns go straight into its props, with no conversion. The block calls no model and runs no AI library; `@aziontech/ui/utils/ai-chat` names TanStack AI's own message types, imported from `@tanstack/ai` as types only (an optional peer, `^1.5.0`), with the helpers that read them (`AiChatMessage`, `AiChatPart`, `AiChatTool`, `AiChatInterrupt`, `AiChatSendContent`; import the types from there), so the shape follows TanStack when you update it, and any source that produces it works. A part of another type is skipped. `sample.ts` holds the sample threads the variants pass. The draft in the composer stays local.

An activity step reads, by convention, `content.title` (else its `activityType`), `content.status` (`pending`, `running`, `success` or `complete`, `error`, `canceled` or `cancelled`, `skipped`; left out, running) and `content.detail` as the line under it.

What TanStack AI does not carry, the app adds in `metadata`: `sources` (the documents the response cites, numbered in order), `reasoningSeconds` (left out, the block measures the thinking time) and `stopped` (the block also marks the response that Stop ended). A message's time is its `createdAt`, formatted in the reader's locale.

| Prop                | Type                                      | What it does                                                                                                                                                                                                                   |
| ------------------- | ----------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `messages`          | `AiChatMessage[]`                         | The conversation, oldest first, as `useChat` returns it. Empty, the empty state renders.                                                                                                                                       |
| `suggestions`       | `SuggestionGroupItem[]`                   | The starter prompts under the empty state.                                                                                                                                                                                     |
| `followUps`         | `SuggestionGroupItem[]`                   | Follow-up questions under the last finished response.                                                                                                                                                                          |
| `loading`           | `boolean`                                 | `isLoading` from `useChat`: the last response thinks, then streams, and the composer shows Stop.                                                                                                                               |
| `error`             | `string \| Error`                         | `error` from `useChat` shows the standard sentence on the last response with Try again; a string shows that sentence instead.                                                                                                  |
| `tools`             | `Record<string, AiChatTool>`              | How each tool reads, by name: `title` for the call, `question`, `description`, `approveLabel`, `variant` `confirmationPhrase` and `editable` for its approval card.; `answerable` and `options` for a tool the reader answers. |
| `interrupts`        | `interrupts` of `useChat`                 | The pending approvals and questions; the approve button and Deny resolve the one whose `toolCallId` matches the call, a generic one asks its question, and an unbound one asks it for the app to route.                        |
| `interruptErrors`   | `interruptErrors` of `useChat`            | Answers that were not sent: an alert with the reason, and Retry when one is retryable.                                                                                                                                         |
| `queue`             | `queue` of `useChat`                      | The messages waiting to be sent, shown above the composer; given, the composer sends while a response runs.                                                                                                                    |
| `moreMessages`      | `boolean`                                 | `hasOlderMessages` of `useChat`: the log offers Load earlier messages.                                                                                                                                                         |
| `loadingMore`       | `boolean`                                 | The older messages are loading.                                                                                                                                                                                                |
| `connection`        | `connectionStatus` of `useChat`           | `connecting` shows Reconnecting, `disconnected` or `error` shows Connection lost; default `connected`.                                                                                                                         |
| `resuming`          | `boolean`                                 | `resuming` of `useChat`: Reconnecting while a run is rejoined.                                                                                                                                                                 |
| `hydrating`         | `boolean`                                 | `isHydrating` of `useChat`: placeholders stand in for the conversation and the composer waits.                                                                                                                                 |
| `sessionGenerating` | `boolean`                                 | `sessionGenerating` of `useChat`: Responding in another tab while this tab is not loading.                                                                                                                                     |
| `attachable`        | `boolean`                                 | The Attach "+" at the start of the composer; `send` then hands over multimodal content. Default `true`.                                                                                                                        |
| `accept`            | `string`                                  | The files the reader may attach; default `image/*,application/pdf`.                                                                                                                                                            |
| `maxFiles`          | `number`                                  | Most files on one message; default 4.                                                                                                                                                                                          |
| `maxFileSize`       | `number`                                  | Largest file in bytes; default 10 MB.                                                                                                                                                                                          |
| `resolveAppUrl`     | `(resource) => string \| Promise<string>` | Gives a widget that has no inline HTML a trusted `https` address; left out, only inline widgets show.                                                                                                                          |
| `toolOptions`       | `PromptInputMenuOption[]`                 | The tools the composer's "+" menu turns on; left out, the sample tools. The turned-on ones are `v-model:toolKeys`.                                                                                                             |
| `v-model:open`      | `boolean`                                 | Whether the drawer is open (open by default); Agent opens it and its close button closes it.                                                                                                                                   |

| Event              | Payload                     | When                                                                                                                                                                |
| ------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `send`             | `(event, content)`          | The composer, a starter prompt or a follow-up: call `sendMessage(content)`. `content` is the text, or with attachments `{ content: parts }`.                        |
| `stop`             | `(event)`                   | Stop while the response streams: call `stop()`. The block marks the stopped response.                                                                               |
| `retry`            | `(event, message)`          | Try again: call `reload()`. The block keeps the earlier answer as a version.                                                                                        |
| `edit`             | `(event, message, text)`    | The reader sent an edited prompt: call `setMessages` with the messages before `message`, then `sendMessage(text)`. The block keeps the earlier prompt as a version. |
| `version-change`   | `(messages)`                | The reader paged to another version of a prompt or an answer: call `setMessages(messages)`.                                                                         |
| `share`            | `(event, message)`          | Share on a response: make a link to it.                                                                                                                             |
| `branch`           | `(event, message)`          | Branch in new chat: start a new chat with the messages up to `message`.                                                                                             |
| `new-chat`         | `(event)`                   | New chat: call `clear()`.                                                                                                                                           |
| `feedback`         | `(value, message, reason?)` | The reader rated a response (`value` is `null` when cleared); after Bad response a second `feedback` carries `reason` (`{ reason, details }`) from the dialog.      |
| `approve`          | `(event, call, input?)`     | The approve button on an approval card; `input` is the edited arguments of an `editable` tool. The block already resolved the matching interrupt.                   |
| `remove-queued`    | `(event, item)`             | Remove on a queued message: call `cancelQueued(item.id)`.                                                                                                           |
| `app-message`      | `(message, part, reply)`    | A widget sent a message: check it against the tools the widget may call, then answer with `reply(message)`.                                                         |
| `load-more`        | `(event)`                   | Load earlier messages, or the top of the log reached: call `loadOlderMessages()`.                                                                                   |
| `deny`             | `(event, call)`             | Deny on an approval card; the block already resolved the matching interrupt.                                                                                        |
| `answer-tool`      | `(event, answer)`           | The reader answered an `answerable` tool: call `addToolResult(answer)` (`{ toolCallId, tool, output }`).                                                            |
| `answer-interrupt` | `(event, interrupt, value)` | The reader answered an unbound interrupt: send `value` to whatever owns it.                                                                                         |
| `retry-interrupts` | `(event)`                   | Retry on the alert of `interruptErrors`: call `retryInterrupts()`.                                                                                                  |

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
    interruptErrors,
    queue,
    hasOlderMessages,
    connectionStatus,
    resuming,
    isHydrating,
    sessionGenerating,
    sendMessage,
    addToolResult,
    retryInterrupts,
    stop,
    reload,
    setMessages,
    clear,
    cancelQueued,
    loadOlderMessages
  } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
    threadId: 'assistant'
  })

  function edit(message, text) {
    setMessages(messages.value.slice(0, messages.value.findIndex((entry) => entry.id === message.id)))
    sendMessage(text)
  }
</script>

<template>
  <AiChatDrawer
    :messages="messages"
    :loading="isLoading"
    :error="error"
    :interrupts="interrupts"
    :interrupt-errors="interruptErrors"
    :queue="queue"
    :more-messages="hasOlderMessages"
    :connection="connectionStatus"
    :resuming="resuming"
    :hydrating="isHydrating"
    :session-generating="sessionGenerating"
    attachable
    @send="(_event, content) => sendMessage(content)"
    @answer-tool="(_event, answer) => addToolResult(answer)"
    @retry-interrupts="retryInterrupts()"
    @remove-queued="(_e, item) => cancelQueued(item.id)"
    @load-more="loadOlderMessages()"
    @stop="stop()"
    @retry="reload()"
    @edit="(_event, message, text) => edit(message, text)"
    @version-change="(next) => setMessages(next)"
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
- **Disclaimer:** "The AI assistant can make mistakes. Check important information before you act on it.", word for word the one `ai/ai-chat` uses, shown only before the first message.
- Errors, loading and feedback strings follow `ai/ai-chat` and `skills/azion-ui-microcopy`.
- **Connection:** `Reconnecting`; `Connection lost` with "Your messages send when the connection returns."
- **Elsewhere and failed answers:** `Responding in another tab`; `Your answer was not sent` with the reason and Retry; `The structured answer failed`.

## Accessibility

- On open, focus goes to the prompt, never to New chat, so a stray Enter sends nothing and wipes nothing. The drawer returns focus to Agent when it closes; `DrawerTitle` names the dialog.
- Agent exposes `aria-expanded`.
- The log is a named `role="log"` with live behavior off; finished responses are announced once through the conversation's polite region.
- New chat is an icon button with an accessible name; it is disabled while the thread is empty.
- Keyboard order inside the drawer: header controls, log, message actions, follow-ups, composer.
- Reconnecting is a polite status and Connection lost an alert; the queued messages are a list named Queued messages, each with Remove from queue; a question card is a group named by its question; the placeholders while restoring are a status named Loading the conversation.

## States

- Empty: the drawer open with `messages` left out, on the empty state with three support prompts about storefront.
- Streaming: `loading` with a response part-way written about the errors of the workload behind the drawer.
- Error: `error` set: a failed response with its partial text and Try again.
- Tools: a `tool-call` part draws as a `ToolCall` titled from `tools`; one with `approval` draws the `ToolApproval` card first (see `ai/ai-action-approval`).
- LongThread: six earlier turns as `messages` that overflow the drawer's log.
- Media and agent parts, attachments, structured answers, rich tool results, the queue, older messages, restoring and the connection draw as in `ai/ai-chat` (its Media and Agent variants).

## Related

- `ai/ai-chat` — the full-page assistant.
- `ai/ai-action-approval` — authorization of an action the assistant proposes.
- `create/create-drawer` — the drawer for forms, not conversations.
- `skills/azion-ui-ai-surfaces` — the rules for generative AI surfaces.

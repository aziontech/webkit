# AiChat (`ai/ai-chat`)

> The full-page generative AI assistant: a header with the assistant's name, a Preview `Tag` and New chat; before the first message an `EmptyState` that says what the assistant knows, over vertical support prompts from `SuggestionGroup`; then a `Conversation` where the reader's prompts sit at the inline end and each response is a `ChatMessage` that goes pending (loading text), thinking (`Reasoning`), streaming (`StreamingResponse` with numbered citations) and complete (collapsed `Sources`, Copy, Regenerate and the feedback thumbs), followed by follow-up questions; a `PromptInput` pinned under the log with a 4,000-character limit, Stop while a response is generated, and the disclaimer under it. The primary state is the empty assistant; sending a support prompt runs the whole response cycle. Built from `ChatMessage`, `Conversation`, `PromptInput`, `StreamingResponse`, `Reasoning`, `Sources`, `SuggestionGroup`, `EmptyState`, `Tag`, `Button`, `IconButton` and `CopyButton`. Takes the messages of TanStack AI's `useChat` as they are. A page body for ConsoleLayout that fills its content region.

- Surface: app
- Source: `blocks/ai/ai-chat/ai-chat.vue` in `@aziontech/webkit`
- MCP: `get_block("ai/ai-chat")`
- Components: [AgentActivity](../../components/agent-activity.md), [AgentQuestion](../../components/agent-question.md), [Alert](../../components/alert.md), [ArtifactCanvas](../../components/artifact-canvas.md), [ArtifactPreview](../../components/artifact-preview.md), `branches`, `placeholderClip`, `usageChart`, [AudioPlayer](../../components/audio-player.md), [Button](../../components/button.md), [ChatMessage](../../components/chat-message.md), [ChatMessage](../../components/chat-message.md), [CodeBlock](../../components/code-block.md), [Conversation](../../components/conversation.md), [CopyButton](../../components/copy-button.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [EmptyState](../../components/empty-state.md), [FilePreview](../../components/file-preview.md), [IconButton](../../components/icon-button.md), [ImageGallery](../../components/image-gallery.md), [McpAppFrame](../../components/mcp-app-frame.md), `PromptInputAttachButton`, [PromptInput](../../components/prompt-input.md), [PromptQueue](../../components/prompt-queue.md), [Reasoning](../../components/reasoning.md), [Resizable](../../components/resizable.md), [Skeleton](../../components/skeleton.md), [Sources](../../components/sources.md), [StatusIndicator](../../components/status-indicator.md), [StreamingResponse](../../components/streaming-response.md), [SubagentCard](../../components/subagent-card.md), [SuggestionGroup](../../components/suggestion-group.md), [Tag](../../components/tag.md), [ToolApproval](../../components/tool-approval.md), [ToolCall](../../components/tool-call.md), `use-locale`, `utils/ai-chat`, `utils/ai-chat-questions`, [VideoPlayer](../../components/video-player.md)
- Skills: `webkit-ai-surfaces`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

ai chat; ai assistant; chatbot; copilot; chat with ai; generative ai chat; assistant page; ask ai; llm chat; conversational ui; prompt and response; streaming response; chat de ia; assistente de ia; assistente virtual; conversa com ia; chat con ia; asistente de ia; artifact; artifact canvas; generated file; code canvas; canvas de artefato; artefato gerado; full page chat; tanstack ai; usechat; agent activity; subagent; agent question

A full page where a person talks with the generative AI assistant about their account: they ask in their own words, watch the response arrive, check where it came from, and keep going with a follow-up or a new question. The page is the conversation; everything else (header, composer) stays still while only the log scrolls. Use it as the assistant's home; on a resource page, open the same conversation in a drawer with `ai/ai-chat-drawer`. It is a page body for `ConsoleLayout`: it fills the layout's content region (`grow basis-0 min-h-0`, never `h-dvh`), so only the log scrolls, and the layout owns the rail, the header and the `main`.

## When to use

- Use ai-chat when the conversation is the page (an assistant page).
- A dedicated assistant page (Console → AI assistant) where the conversation is the main task.
- Open-ended questions across the whole account: how-to, troubleshooting, explaining settings or metrics.
- A conversation the reader expects to scroll back through and continue.

## When not to use

- Help about the page the reader is on, next to their work: use `ai/ai-chat-drawer`.
- The assistant proposes an action that changes the account: add `ai/ai-action-approval` to the conversation, never run it from a response.
- One generated paragraph in a page (a summary of a chart): render `StreamingResponse` in place, no chat.
- Searching documentation by keyword: a search field and results list are faster than a conversation.

## Building blocks

### A. Header — `Tag`, `Button`

The assistant's name as the page heading, a Preview `Tag` while the feature is in preview, and a transparent New chat `Button` at the inline end, disabled while the thread is empty. New chat clears the thread without confirmation; the previous thread belongs in a history list, not in a dialog.

### B. Empty state — `EmptyState`, `SuggestionGroup`

Before the first message: an `EmptyState` with the assistant mark, one question as the title and one sentence on what the assistant can read, over a vertical `SuggestionGroup` of up to five support prompts with icons. Selecting a prompt sends it as the first message.

### C. Message log — `Conversation`

Fills the space between header and composer and is the only part that scrolls. It follows the newest message while the reader is at the end, stops when they scroll up, and offers Scroll to the latest message. It announces each finished response once; streaming text is never read token by token.

### D. Prompt — `ChatMessage`, `ImageGallery`, `FilePreview`

The reader's prompt at the inline end in a filled bubble with their name and time. The files they attached draw under the text the way media draws in a response (section L): images in an `ImageGallery`, a document in a `FilePreview`, audio and video in their players.

### E. Response — `ChatMessage`, `Reasoning`, `StreamingResponse`

The assistant's response at the inline start beside its mark. It shows the loading text while pending, a collapsed `Reasoning` that reads Thinking and then Thought for N seconds, and the Markdown answer in `StreamingResponse` with a caret while it streams. Numbered citations link to the sources. On failure the partial text stays with the error line and Try again.

### F. Sources — `Sources`

Under a complete response that used documents: collapsed under the count, opened by a citation. Item n is citation [n].

### G. Response actions — `ChatMessage`, `CopyButton`, `IconButton`

`ChatMessage.Actions` under a complete response, always visible: Copy (`CopyButton`), Regenerate (`IconButton`, disabled while another response is generating) and `ChatMessage.Feedback` with Helpful and Not helpful.

### H. Follow-up questions — `SuggestionGroup`

After the last complete response, two or three questions that narrow it, as wrapping chips aligned with the response text. They disappear as soon as the reader sends anything else.

### I. Composer — `PromptInput`, `PromptInputAttachButton`

Pinned under the log, centered on the reading width. Enter submits, Shift+Enter adds a line, a 4,000-character limit shows its counter, and Submit becomes Stop while a response is pending or streaming. The disclaimer is its hint. With `attachable`, a `PromptInputAttachButton` (and drop and paste) attaches up to `maxFiles` files of `accept` (images and PDF by default) under `maxFileSize` (10 MB); `send` then hands over TanStack AI's multimodal content, the text and one `image`, `audio`, `video` or `document` part per file with its base64 bytes, ready for `sendMessage`. The composer is disabled while the conversation is restored.

### J. Artifact canvas — `ChatMessage`, `PromptInput` (Artifact)

Variant Artifact only; it adds `ArtifactPreview`, `ArtifactCanvas`, `Resizable`, `CodeBlock` and a `Drawer` for narrow screens.

When an answer produces something longer than a message (a query, a configuration, a table), the message carries an `ArtifactPreview` with Open and the whole artifact opens in an `ArtifactCanvas` beside the conversation: a `Resizable.Pane` (`min` 320, `max` 880) after a `Resizable.Handle` named `Resize the artifact`, so the reader widens or narrows it with the pointer or the arrow keys. Under the md breakpoint the pane and handle are hidden and Open shows the same canvas in a full-height `Drawer`. Every follow-up that changes the artifact adds a version: the canvas moves to it, `streaming` locks the pager and marks the body busy while it is written, and each message's preview names its version (`Version 3`) and opens that one. Open moves focus to the canvas title; Close (or Escape inside the canvas) hides it and returns focus to the Open that showed it; `Show artifact` in the header brings a closed canvas back.

### K. Tool calls — `ToolCall`, `ToolApproval`, `CodeBlock`

A `tool-call` part draws in its place in the response as a `ToolCall` with the tool name in code, the `title` the `tools` prop gives it, and its input and output in a `CodeBlock` when opened; it reads streaming (its arguments arriving), running, completed, failed, canceled (a `cancelled` result) or denied from the call's `state` and its `tool-result`. A call that needs approval draws a `ToolApproval` card first, with the question, verb and danger variant from `tools` and the call's input in a `CodeBlock`; a tool with `editable` shows its arguments as JSON the reader can edit, Approve staying off while they do not parse. Deny and the approve button resolve the matching `useChat` interrupt (an edit as `{ editedArgs }`), and an approved call runs as a `ToolCall` under the card. The card stays busy until the run that asked for it ends. See `ai/ai-action-approval` for the whole approval flow. A `tool-result` whose `content` is a list of text and image parts draws as text and an `ImageGallery` in the output, not as JSON. A tool marked `answerable` in `tools` is one the reader answers (a client tool with no `execute`): until it has an output it draws as an `AgentQuestion` with its `question` and `options` (else a text field), and Submit emits `answer-tool` with the payload `addToolResult` takes.

### L. Media — `ImageGallery`, `AudioPlayer`, `VideoPlayer`, `FilePreview`

Media parts draw in their place in the response. Consecutive `image` parts are one `ImageGallery` (a URL becomes `src`, base64 data becomes `data` with its `mimeType`, `metadata.alt` its alternative text); an `audio` part is an `AudioPlayer` and a `video` part a `VideoPlayer`, each from its URL or a `data:` URL; a `document` part is a `FilePreview` from its URL or base64, named by `metadata.name` (else `Document`). A `file` source (a provider file handle) has no bytes to draw and is skipped.

### M. Agent work — `AgentActivity`, `SubagentCard`, `AgentQuestion`

The `activity` parts of a response, and the `activity` messages between the reader's prompt and it, are one `AgentActivity` at the top of the response. A `subagent` part is a `SubagentCard` named by the helper, with its input in a `CodeBlock` and its own answer in `StreamingResponse` when opened: running is running, finished is completed, suspended waits, and an error reads canceled when its message is `Stopped`; Stop shows when the part carries `stop()` and calls it. A pending generic interrupt is an `AgentQuestion` in an assistant message after the turn it arrived in: its `message` is the question, `metadata.options` (or `payload.options`) the choices, else a text field; Submit calls `resolveInterrupt(answer)` and Skip calls `cancel()`. The card stays with the answer, or Skipped, after the interrupt leaves `interrupts`. An `unbound` interrupt (one the chat cannot resolve, such as a workflow engine's approval) is asked the same way without Skip; Submit emits `answer-interrupt` so the app routes the answer to whatever owns the pause, and the card shows it as sending until the interrupt leaves.

### N. Queue and connection — `PromptQueue`, `StatusIndicator`, `Alert`

With `queue` the composer keeps Submit beside Stop while a response runs (`queueable`), and the waiting messages show in a `PromptQueue` above it, each removable. Above the composer a warning `StatusIndicator` reads Reconnecting while `connection` is `connecting` or `resuming` is set, a danger `Alert` says the connection was lost while it is `disconnected` or `error`, and an info `StatusIndicator` reads Responding in another tab while `sessionGenerating` is set and this tab is not loading. When `interruptErrors` holds a failed answer, a danger `Alert` says Your answer was not sent with its reason, and Retry (shown when one is retryable) emits `retry-interrupts`.

### O. Tool widgets — `McpAppFrame`

A `ui-resource` part (an MCP app a tool returned) draws as a `McpAppFrame` under its call: a sandboxed frame with no network and no reach into the page, titled from `tools` or the tool name. Inline HTML shows as it is; a widget given only by address shows when `resolveAppUrl` returns a trusted `https` address for it. Every message the widget sends reaches the app through `app-message` with a `reply` that answers the widget; the block never acts on one, so the app decides which tool a widget may call and sends sensitive ones through approval.

### P. Structured answers — `CodeBlock`, `Alert`

A `structured-output` part (an answer against a schema) draws as a JSON `CodeBlock`: the progressive `partial` (else `raw`) while it streams, `data` once complete. Its `reasoning` joins the response's `Reasoning`. On `error` a danger `Alert` says The structured answer failed with its `errorMessage`.

### Q. Restoring — `Skeleton`

While `hydrating` (`isHydrating` of `useChat`) and no message is in place yet, three `Skeleton` rows stand in for the conversation in a status named Loading the conversation, instead of the empty state.

## Data

The block draws a conversation in the message shape of TanStack AI: each message has an `id`, a `role` and its `parts` in order (`text`, `thinking`, `tool-call`, `tool-result`, `image`, `audio`, `video`, `document`, `activity`, `subagent`, `structured-output`, `ui-resource`), so the values `useChat` from `@tanstack/ai-vue` returns go straight into its props, with no conversion. The block calls no model and runs no AI library; `@aziontech/webkit/utils/ai-chat` names TanStack AI's own message types, imported from `@tanstack/ai` as types only (an optional peer, `^1.5.0`), with the helpers that read them (`AiChatMessage`, `AiChatPart`, `AiChatTool`, `AiChatInterrupt`, `AiChatSendContent`; import the types from there), so the shape follows TanStack when you update it, and any source that produces it works. A part of another type is skipped. `sample.ts` holds the sample threads the variants pass. The draft in the composer stays local.

An activity step reads, by convention, `content.title` (else its `activityType`), `content.status` (`pending`, `running`, `success` or `complete`, `error`, `canceled` or `cancelled`, `skipped`; left out, running) and `content.detail` as the line under it.

What TanStack AI does not carry, the app adds in `metadata`: `sources` (the documents the response cites, numbered in order), `reasoningSeconds` (left out, the block measures the thinking time) and `stopped` (the block also marks the response that Stop ended). A message's time is its `createdAt`, formatted in the reader's locale.

| Prop                | Type                                      | What it does                                                                                                                                                                                                                  |
| ------------------- | ----------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`          | `AiChatMessage[]`                         | The conversation, oldest first, as `useChat` returns it. Empty, the empty state renders.                                                                                                                                      |
| `suggestions`       | `SuggestionGroupItem[]`                   | The starter prompts under the empty state.                                                                                                                                                                                    |
| `followUps`         | `SuggestionGroupItem[]`                   | Follow-up questions under the last finished response.                                                                                                                                                                         |
| `loading`           | `boolean`                                 | `isLoading` from `useChat`: the last response thinks, then streams, and the composer shows Stop.                                                                                                                              |
| `error`             | `string \| Error`                         | `error` from `useChat` shows the standard sentence on the last response with Try again; a string shows that sentence instead.                                                                                                 |
| `tools`             | `Record<string, AiChatTool>`              | How each tool reads, by name: `title` for the call, `question`, `description`, `approveLabel`, `variant` `confirmationPhrase` and `editable` for its approval card; `answerable` and `options` for a tool the reader answers. |
| `interrupts`        | `interrupts` of `useChat`                 | The pending approvals and questions; the approve button and Deny resolve the one whose `toolCallId` matches the call, a generic one asks its question, and an unbound one asks it for the app to route.                       |
| `interruptErrors`   | `interruptErrors` of `useChat`            | Answers that were not sent: an alert with the reason, and Retry when one is retryable.                                                                                                                                        |
| `queue`             | `queue` of `useChat`                      | The messages waiting to be sent, shown above the composer; given, the composer sends while a response runs.                                                                                                                   |
| `moreMessages`      | `boolean`                                 | `hasOlderMessages` of `useChat`: the log offers Load earlier messages.                                                                                                                                                        |
| `loadingMore`       | `boolean`                                 | The older messages are loading.                                                                                                                                                                                               |
| `connection`        | `connectionStatus` of `useChat`           | `connecting` shows Reconnecting, `disconnected` or `error` shows Connection lost; default `connected`.                                                                                                                        |
| `resuming`          | `boolean`                                 | `resuming` of `useChat`: Reconnecting while a run is rejoined.                                                                                                                                                                |
| `hydrating`         | `boolean`                                 | `isHydrating` of `useChat`: placeholders stand in for the conversation and the composer waits.                                                                                                                                |
| `sessionGenerating` | `boolean`                                 | `sessionGenerating` of `useChat`: Responding in another tab while this tab is not loading.                                                                                                                                    |
| `attachable`        | `boolean`                                 | The reader may attach files; `send` then hands over multimodal content.                                                                                                                                                       |
| `accept`            | `string`                                  | The files the reader may attach; default `image/*,application/pdf`.                                                                                                                                                           |
| `maxFiles`          | `number`                                  | Most files on one message; default 4.                                                                                                                                                                                         |
| `maxFileSize`       | `number`                                  | Largest file in bytes; default 10 MB.                                                                                                                                                                                         |
| `resolveAppUrl`     | `(resource) => string \| Promise<string>` | Gives a widget that has no inline HTML a trusted `https` address; left out, only inline widgets show.                                                                                                                         |

| Event              | Payload                     | When                                                                                                                                              |
| ------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `send`             | `(event, content)`          | The composer, a starter prompt or a follow-up: call `sendMessage(content)`. `content` is the text, or with attachments `{ content: parts }`.      |
| `stop`             | `(event)`                   | Stop while the response streams: call `stop()`. The block marks the stopped response.                                                             |
| `retry`            | `(event, message)`          | Try again or Regenerate response: call `reload()`.                                                                                                |
| `new-chat`         | `(event)`                   | New chat: call `clear()`.                                                                                                                         |
| `feedback`         | `({ message, value })`      | The reader rated a response.                                                                                                                      |
| `approve`          | `(event, call, input?)`     | The approve button on an approval card; `input` is the edited arguments of an `editable` tool. The block already resolved the matching interrupt. |
| `remove-queued`    | `(event, item)`             | Remove on a queued message: call `cancelQueued(item.id)`.                                                                                         |
| `app-message`      | `(message, part, reply)`    | A widget sent a message: check it against the tools the widget may call, then answer with `reply(message)`.                                       |
| `load-more`        | `(event)`                   | Load earlier messages, or the top of the log reached: call `loadOlderMessages()`.                                                                 |
| `deny`             | `(event, call)`             | Deny on an approval card; the block already resolved the matching interrupt.                                                                      |
| `answer-tool`      | `(event, answer)`           | The reader answered an `answerable` tool: call `addToolResult(answer)` (`{ toolCallId, tool, output }`).                                          |
| `answer-interrupt` | `(event, interrupt, value)` | The reader answered an unbound interrupt: send `value` to whatever owns it.                                                                       |
| `retry-interrupts` | `(event)`                   | Retry on the alert of `interruptErrors`: call `retryInterrupts()`.                                                                                |

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

  import AiChat from './ai-chat.vue'

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
    clear,
    cancelQueued,
    loadOlderMessages
  } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
    threadId: 'assistant'
  })
</script>

<template>
  <AiChat
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
    @new-chat="clear()"
  />
</template>
```

A tool that needs approval is declared once with `toolDefinition({ name, inputSchema, needsApproval: true })`, run on the server with `.server(...)` and passed to `useChat({ tools: [definition] })` too, so the client can match the approval request to the call. Then delete `sample.ts` and its import. `apps/demos` runs this block on `useChat` with TanStack AI's `fakeText` model (`src/lib/assistant-model.ts`), no server and no key.

## Do

- Show the loading text only after a second; a response that arrives faster streams directly.
- Keep actions visible on every complete response, not on hover.
- Cite sources inline with numbers and list them under the response.
- Let the reader stop a response and keep what streamed, marked as stopped.
- Keep the composer usable while a response streams so the reader can draft the next prompt.
- Return focus to the composer when a response finishes.

## Don't

- Don't auto-scroll while the reader is reading an older message.
- Don't render model output as HTML; `StreamingResponse` renders Markdown as elements only.
- Don't show actions or feedback on a response that is still loading or streaming.
- Don't use the feedback thumbs for anything but the AI response.
- Don't put more than five support prompts or three follow-ups on screen.
- Don't call the assistant by a person's name or make it apologize; state what happened.

## Copy

- **Title of the page:** `AI assistant`; the Preview tag while in preview.
- **Empty state:** a question the reader would ask themselves, e.g. "How can I help with your Azion account?", and one sentence on what the assistant can read.
- **Support prompts and follow-ups:** written as the reader would ask, under 72 characters, e.g. "How do I purge the cache of one URL?".
- **Placeholder:** `Ask a question`, no end punctuation.
- **Disclaimer (hint):** "The AI assistant can make mistakes. Check important information before you act on it."
- **Loading:** `Generating a response` (built in); `Loading <what>` when fetching data.
- **Error:** what happened, in one sentence, e.g. "The connection was interrupted before the response finished.", with Try again.
- **Stopped:** "You stopped this response."
- **Feedback:** Helpful, Not helpful, Feedback submitted (built in).
- Follow `skills/webkit-microcopy`: sentence case, "select" not "click", "response" not "answer", no "please".
- **Connection:** `Reconnecting`; `Connection lost` with "Your messages send when the connection returns."
- **Elsewhere and failed answers:** `Responding in another tab`; `Your answer was not sent` with the reason and Retry; `The structured answer failed`.

## Accessibility

- The log is a named `role="log"` whose own live behavior is off; a polite live region reads each finished response once, with its author.
- Each message is an `article` named by author and time; avatars are hidden from assistive tech because the author line names the author.
- Responses are `aria-busy` while loading or streaming; the caret is hidden.
- The composer is named Prompt, described by its counter and disclaimer; Enter submits and an IME composition never does.
- Feedback thumbs are toggle buttons with `aria-pressed`, and the submitted state is a status message.
- Keyboard order: header, log (focusable to scroll), each message's links and actions, follow-ups, composer.
- Alignment never carries meaning alone: every message has its author line.
- Reconnecting is a polite status and Connection lost an alert; the queued messages are a list named Queued messages, each with Remove from queue; a question card is a group named by its question; the placeholders while restoring are a status named Loading the conversation.

## States

- Empty: `messages` left out or `[]`, with the empty state and four support prompts; selecting one emits `send`.
- Streaming: `loading` with the last assistant message part-way written: its caret, the busy region and Stop in the composer.
- Error: `error` set: the last response keeps its partial text, with the error line and Try again; with no response yet, a pending response shows the error.
- Tools: a `tool-call` part draws as a `ToolCall` titled from `tools`, its input and output in code; one with `approval` draws the `ToolApproval` card first (see `ai/ai-action-approval`).
- Artifact: two turns that wrote top-orders.sql in two versions, the canvas open beside them on version 2; a follow-up fills the composer.
- LongThread: six earlier turns as `messages` that overflow the log, opened on the newest response, with `followUps`.
- Media: an answer with two charts in an `ImageGallery`, a CSV report in a `FilePreview` and an audio summary.
- Agent: activity steps, a finished `SubagentCard` and a pending `AgentQuestion`; answering it resolves the interrupt and the card keeps the answer.
- Restoring: `hydrating` with no messages yet shows the `Skeleton` rows and a disabled composer.
- Attachments, structured answers and rich tool results: a prompt with an image and a PDF, a `structured-output` part as JSON and a tool result with text and an image (variant Media).
- Queue, older messages and connection: `queue` shows a `PromptQueue` over the composer, `moreMessages` a Load earlier messages button, and `connection` a Reconnecting status or a Connection lost alert.

## Related

- `artifact-canvas` — the side panel of the Artifact variant; `artifact-preview` — its card in the message.
- `ai/ai-chat-drawer` — the same conversation in a drawer over a resource page.
- `ai/ai-action-approval` — when a response proposes a change the reader must authorize.
- `state/state-async-submit` — long-running work outside a conversation.
- `skills/webkit-ai-surfaces` — the rules this block follows: loading stages, streaming, citations, feedback, authorization.

## Variants

- `Empty` — primary (the code below)
- `Streaming` — A response arriving: the reader asked why storefront returns 502 errors and the answer streams in with its caret, a table on the way, the region busy and Stop in the composer; when it ends the sources, actions and follow-up questions appear.
- `Error` — A response that failed mid-stream: the partial text stays, the error line says the connection was interrupted and Try again regenerates the response in place.
- `LongThread` — Six earlier turns about one workload that overflow the log: it opens on the newest response, stops following when the reader scrolls up, and Scroll to the latest message brings them back; follow-up questions close the thread.
- `Artifact` — An answer that produced a file: the message carries an `ArtifactPreview` of top-orders.sql and the `ArtifactCanvas` sits beside the conversation in a `Resizable` pane (a `Drawer` under the md breakpoint) with its versions, Copy, Download and Close; a follow-up question fills the composer. While a new version is written the canvas takes `streaming`, which locks its pager.
- `Media` — A prompt with an attached image, then an answer with a chart tool result, two charts in an `ImageGallery`, a structured answer, a CSV in a `FilePreview` and an audio summary; the composer attaches files.
- `Agent` — `AgentActivity` steps, a finished `SubagentCard` and a pending `AgentQuestion` that keeps its answer.

Each variant is the same screen in another state: `get_block("ai/ai-chat", { variant })`, or the file under `blocks/ai/ai-chat/variants/`.

## Code (`Empty`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { ChatMessageFeedbackValue, ChatMessageStatus } from '@aziontech/webkit/chat-message'
  import ChatMessage from '@aziontech/webkit/chat-message-root'
  import Conversation from '@aziontech/webkit/conversation'
  import {
    type McpAppFrameMessage,
    type McpAppFrameResource
  } from '@aziontech/webkit/mcp-app-frame'
  import type { PromptInputFile, PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptInputAttachButton from '@aziontech/webkit/prompt-input-attach-button'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import PromptQueue from '@aziontech/webkit/prompt-queue'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import {
    type AiChatConnection,
    type AiChatInterrupt,
    type AiChatInterruptError,
    type AiChatMessage,
    type AiChatQuestion,
    type AiChatQueuedMessage,
    type AiChatSendContent,
    type AiChatTool,
    type AiChatToolAnswer,
    type AiChatToolCallPart,
    type AiChatUiResourcePart,
    contentOf,
    hasAnswer,
    interruptErrorText,
    isQuestion,
    json,
    queueItemOf,
    resolveInterrupt,
    toolQuestionOf
  } from '@aziontech/webkit/utils/ai-chat'
  import {
    answerQuestion,
    groupQuestions,
    skipQuestion
  } from '@aziontech/webkit/utils/ai-chat-questions'
  import { computed, onMounted, ref, watch } from 'vue'

  import AiChatConnectionStatus from './parts/ai-chat-connection-status.vue'
  import AiChatHeader from './parts/ai-chat-header.vue'
  import AiChatStart from './parts/ai-chat-start.vue'
  import AiChatTurn from './parts/ai-chat-turn.vue'
  import { sampleSuggestions } from './sample'

  /** A rating the reader gave a response. */
  export interface AiChatFeedback {
    /** The rated response. */
    message: AiChatMessage
    /** Helpful, not helpful, or cleared. */
    value: ChatMessageFeedbackValue | null
  }

  export interface AiChatProps {
    /** The conversation, oldest first, as TanStack AI's `useChat` returns `messages`. Empty, the empty state renders. */
    messages?: ReadonlyArray<AiChatMessage>
    /** Starter prompts under the empty state. Left out, the sample prompts render. */
    suggestions?: SuggestionGroupItem[]
    /** Follow-up questions shown under the last finished response. */
    followUps?: SuggestionGroupItem[]
    /** The assistant is responding, as `useChat` returns `isLoading`. */
    loading?: boolean
    /** Why the last response failed: a sentence, or the `error` of `useChat`, which shows the standard sentence. */
    error?: string | { message: string } | null
    /** How each tool reads, by tool name; a tool left out shows its name. */
    tools?: Record<string, AiChatTool>
    /** Pending requests, as `useChat` returns `interrupts`; Approve and Deny resolve the matching approval, a generic one asks its question, and an unbound one asks it for the app to route. */
    interrupts?: ReadonlyArray<AiChatInterrupt>
    /** Why the answers to pending requests were not sent, as `useChat` returns `interruptErrors`; a retryable one offers Retry. */
    interruptErrors?: ReadonlyArray<AiChatInterruptError>
    /** Messages waiting to be sent, as `useChat` returns `queue`; given, the composer sends while a response runs. */
    queue?: ReadonlyArray<AiChatQueuedMessage>
    /** Older messages exist, as `useChat` returns `hasOlderMessages`. */
    moreMessages?: boolean
    /** The older messages are loading. */
    loadingMore?: boolean
    /** The connection to the chat, as `useChat` returns `connectionStatus`. */
    connection?: AiChatConnection
    /** The chat is rejoining a run after a reload, as `useChat` returns `resuming`. */
    resuming?: boolean
    /** The conversation is being restored, as `useChat` returns `isHydrating`; placeholders show in place of the empty state. */
    hydrating?: boolean
    /** A response is being generated for this chat elsewhere, as `useChat` returns `sessionGenerating`. */
    sessionGenerating?: boolean
    /** The reader may attach files; `send` then hands over the multimodal content `sendMessage` takes. */
    attachable?: boolean
    /** The files the reader may attach, in the native accept syntax. */
    accept?: string
    /** Most files attached to one message. */
    maxFiles?: number
    /** Largest file in bytes. */
    maxFileSize?: number
    /** Turns a widget's resource into a trusted https address when it has no inline HTML; left out, only inline widgets show. */
    resolveAppUrl?: (resource: McpAppFrameResource) => string | Promise<string>
  }

  const props = withDefaults(defineProps<AiChatProps>(), {
    messages: () => [],
    suggestions: undefined,
    followUps: undefined,
    loading: false,
    error: '',
    tools: () => ({}),
    interrupts: () => [],
    interruptErrors: () => [],
    queue: undefined,
    moreMessages: false,
    loadingMore: false,
    connection: 'connected',
    resuming: false,
    hydrating: false,
    sessionGenerating: false,
    attachable: false,
    accept: 'image/*,application/pdf',
    maxFiles: 4,
    maxFileSize: 10485760,
    resolveAppUrl: undefined
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, content: AiChatSendContent]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent, message: AiChatMessage]
    'new-chat': [event: MouseEvent]
    feedback: [feedback: AiChatFeedback]
    approve: [event: MouseEvent, call: AiChatToolCallPart, input?: unknown]
    deny: [event: MouseEvent, call: AiChatToolCallPart]
    'remove-queued': [event: MouseEvent, item: AiChatQueuedMessage]
    'app-message': [
      message: McpAppFrameMessage,
      part: AiChatUiResourcePart,
      reply: (message: McpAppFrameMessage) => void
    ]
    'load-more': [event: Event]
    'answer-interrupt': [event: Event, interrupt: AiChatInterrupt, value: string]
    'answer-tool': [event: Event, answer: AiChatToolAnswer]
    'retry-interrupts': [event: MouseEvent]
  }>()

  const { formatDate } = useLocale()

  const prompt = ref('')
  const files = ref<PromptInputFile[]>([])
  const composerEl = ref<InstanceType<typeof PromptInput> | null>(null)
  const ratings = ref<Record<string, ChatMessageFeedbackValue | null>>({})
  const stoppedIds = ref<Set<string>>(new Set())
  const edits = ref<Record<string, string>>({})
  const answers = ref<Record<string, string>>({})
  const askedAfter = ref<Record<string, string>>({})
  const settled = ref<Record<string, AiChatQuestion>>({})
  const routed = ref<Record<string, boolean>>({})
  const toolAnswers = ref<Record<string, AiChatQuestion>>({})

  const turns = computed(() =>
    props.messages.filter((message) => message.role === 'user' || message.role === 'assistant')
  )
  const starters = computed(() => props.suggestions ?? sampleSuggestions)
  const last = computed(() => turns.value[turns.value.length - 1])
  const failure = computed(() => {
    if (!props.error) return ''
    if (typeof props.error === 'string') return props.error
    return 'The connection was interrupted before the response finished.'
  })
  const waiting = computed(
    () => (props.loading || Boolean(failure.value)) && last.value?.role === 'user'
  )

  function statusOf(turn: AiChatMessage): ChatMessageStatus {
    if (turn.role === 'user' || turn !== last.value) return 'success'
    if (failure.value) return 'error'
    if (props.loading) return hasAnswer(turn) ? 'streaming' : 'pending'
    return 'success'
  }

  const queueable = computed(() => props.queue !== undefined)
  const queued = computed(() => (props.queue ?? []).map(queueItemOf))
  const retryable = computed(() => props.interruptErrors.some((error) => error.retryable !== false))

  const pendingQuestions = computed(() => props.interrupts.filter(isQuestion))
  watch(
    pendingQuestions,
    (now) => {
      for (const interrupt of now) askedAfter.value[interrupt.id!] ??= last.value?.id ?? ''
    },
    { immediate: true }
  )

  const questions = computed(() =>
    groupQuestions({
      pending: pendingQuestions.value,
      settled: settled.value,
      routed: routed.value,
      askedAfter: askedAfter.value,
      turns: turns.value,
      lastId: last.value?.id ?? ''
    })
  )

  function answer(event: Event, question: AiChatQuestion, value: string) {
    const state = { pending: pendingQuestions.value, settled: settled.value, routed: routed.value }
    const interrupt = answerQuestion(state, question, value)
    if (interrupt) emit('answer-interrupt', event, interrupt, value)
  }

  function askOf(call: AiChatToolCallPart): AiChatQuestion {
    return toolAnswers.value[call.id] ?? toolQuestionOf(call, toolOf(call))
  }

  function answerTool(event: Event, call: AiChatToolCallPart, value: string) {
    toolAnswers.value[call.id] = { ...toolQuestionOf(call, toolOf(call)), status: 'running' }
    emit('answer-tool', event, { toolCallId: call.id, tool: call.name, output: value })
  }

  function skip(question: AiChatQuestion) {
    skipQuestion({ pending: pendingQuestions.value, settled: settled.value }, question)
  }

  function editOf(call: AiChatToolCallPart): string {
    return edits.value[call.id] ?? json(call.input ?? call.arguments)
  }

  const state = computed<PromptInputStatus>(() => {
    if (!props.loading) return 'ready'
    return last.value?.role === 'assistant' && hasAnswer(last.value) ? 'streaming' : 'pending'
  })

  function stopped(turn: AiChatMessage): boolean {
    return Boolean(turn.metadata?.stopped) || stoppedIds.value.has(turn.id)
  }

  const lastAnswer = computed(() => {
    const turn = last.value
    return turn?.role === 'assistant' && statusOf(turn) === 'success' && !stopped(turn)
      ? turn
      : null
  })

  function timeOf(turn: AiChatMessage): string {
    return turn.createdAt ? formatDate(turn.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''
  }

  function toolOf(call: AiChatToolCallPart): AiChatTool {
    return props.tools[call.name] ?? { title: '' }
  }

  onMounted(() => composerEl.value?.focus())

  watch(
    () => props.loading,
    (now, before) => {
      if (before && !now) composerEl.value?.focus()
    }
  )

  async function send(event: MouseEvent | KeyboardEvent, text: string) {
    const attached = files.value
    const picked = attached.flatMap((item) => (item.file instanceof File ? [item.file] : []))
    if ((!text.trim() && !picked.length) || (state.value !== 'ready' && !queueable.value)) return
    prompt.value = ''
    files.value = []
    let content: AiChatSendContent
    try {
      content = await contentOf(text, picked)
    } catch {
      prompt.value = text
      files.value = attached
      return
    }
    emit('send', event, content)
  }

  function stop(event: MouseEvent) {
    if (props.loading && last.value?.role === 'assistant') stoppedIds.value.add(last.value.id)
    emit('stop', event)
  }

  function newChat(event: MouseEvent) {
    prompt.value = ''
    files.value = []
    stoppedIds.value.clear()
    edits.value = {}
    answers.value = {}
    askedAfter.value = {}
    settled.value = {}
    routed.value = {}
    toolAnswers.value = {}
    emit('new-chat', event)
  }

  function rate(message: AiChatMessage, value: ChatMessageFeedbackValue | null) {
    ratings.value[message.id] = value
    emit('feedback', { message, value })
  }

  function removeQueued(event: MouseEvent, id: string) {
    const item = props.queue?.find((entry) => entry.id === id)
    if (item) emit('remove-queued', event, item)
  }

  function approve(event: MouseEvent, call: AiChatToolCallPart, text: string) {
    const edited =
      toolOf(call).editable && text !== json(call.input ?? call.arguments)
        ? (JSON.parse(text) as unknown)
        : undefined
    emit('approve', event, call, edited)
    resolveInterrupt(props.interrupts, call, true, edited)
  }

  function deny(event: MouseEvent, call: AiChatToolCallPart) {
    emit('deny', event, call)
    resolveInterrupt(props.interrupts, call, false)
  }
</script>

<template>
  <section
    aria-labelledby="ai-chat-title"
    class="flex min-h-0 w-full grow basis-0 flex-col"
  >
    <AiChatHeader
      :empty="!turns.length"
      @new-chat="newChat"
    />
    <div class="flex min-h-0 flex-1 flex-col">
      <AiChatStart
        v-if="!turns.length"
        :hydrating="hydrating"
        :starters="starters"
        @select="(event, item) => send(event, item.label)"
      />
      <Conversation
        v-else
        aria-label="Conversation with the AI assistant"
        :more-messages="moreMessages"
        :loading-more="loadingMore"
        @load-more="emit('load-more', $event)"
      >
        <AiChatTurn
          v-for="turn in turns"
          :key="turn.id"
          v-model:answers="answers"
          :turn="turn"
          :messages="messages"
          :status="statusOf(turn)"
          :time="timeOf(turn)"
          :failure="failure"
          :tools="tools"
          :busy="loading && turn === last"
          :ready="state === 'ready'"
          :stopped="stopped(turn)"
          :rating="ratings[turn.id] ?? null"
          :questions="questions[turn.id]"
          :ask-of="askOf"
          :edit-of="editOf"
          :resolve-app-url="resolveAppUrl"
          @retry="emit('retry', $event, turn)"
          @rate="(value) => rate(turn, value)"
          @answer-tool="answerTool"
          @edit="(call, text) => (edits[call.id] = text)"
          @approve="approve"
          @deny="deny"
          @answer="answer"
          @skip="skip"
          @app-message="(message, part, reply) => emit('app-message', message, part, reply)"
        />
        <ChatMessage
          v-if="waiting && last"
          :status="failure ? 'error' : 'pending'"
          :error-message="failure || undefined"
          @retry="emit('retry', $event, last)"
        />
        <div
          v-if="lastAnswer && followUps?.length"
          class="ps-[calc(2rem+var(--spacing-sm))]"
        >
          <SuggestionGroup
            :items="followUps"
            aria-label="Follow-up questions"
            @select="(event, item) => send(event, item.label)"
          />
        </div>
      </Conversation>
    </div>
    <footer
      class="layout-column-content layout-boundary-inline flex flex-col gap-(--spacing-xs) pb-(--spacing-md)"
    >
      <AiChatConnectionStatus
        :connection="connection"
        :resuming="resuming"
        :session-generating="sessionGenerating"
        :loading="loading"
      />
      <Alert
        key="alert-2"
        v-if="interruptErrors.length"
        severity="danger"
        size="small"
        title="Your answer was not sent"
        :action-label="retryable ? 'Retry' : ''"
        @action="emit('retry-interrupts', $event)"
      >
        {{ interruptErrorText(interruptErrors) }}
      </Alert>
      <PromptQueue
        v-if="queued.length"
        :items="queued"
        @remove="(event, item) => removeQueued(event, item.id)"
      />
      <PromptInput
        ref="composerEl"
        v-model="prompt"
        v-model:files="files"
        :status="state"
        :queueable="queueable"
        :disabled="hydrating"
        :accept="accept"
        :max-files="maxFiles"
        :max-file-size="maxFileSize"
        :max-length="4000"
        @submit="(event, { value }) => send(event, value)"
        @stop="stop"
      >
        <template
          v-if="attachable"
          #actions
        >
          <PromptInputAttachButton />
        </template>
        <template #hint>
          The AI assistant can make mistakes. Check important information before you act on it.
        </template>
      </PromptInput>
    </footer>
  </section>
</template>
```

## `sample.ts`

````ts
import type { SourcesItem } from '@aziontech/webkit/sources'
import type { SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
import type { AiChatInterrupt, AiChatMessage } from '@aziontech/webkit/utils/ai-chat'

const at = (time: string): Date => new Date(`2026-11-19T${time}:00`)

const user = (id: string, text: string, time: string): AiChatMessage => ({
  id,
  role: 'user',
  parts: [{ type: 'text', content: text }],
  createdAt: at(time)
})

const assistant = (
  id: string,
  text: string,
  time: string,
  extra: { reasoning?: string; reasoningSeconds?: number; sources?: SourcesItem[] } = {}
): AiChatMessage => ({
  id,
  role: 'assistant',
  parts: [
    ...(extra.reasoning ? [{ type: 'thinking' as const, content: extra.reasoning }] : []),
    { type: 'text', content: text }
  ],
  createdAt: at(time),
  metadata: { reasoningSeconds: extra.reasoningSeconds, sources: extra.sources }
})

const cacheAnswer = [
  'Use **Real-Time Purge** with the *URL* type. It removes one object from every data center in a few seconds [1].',
  '',
  '1. Open Real-Time Purge from the products menu.',
  '2. Choose **URL** and paste the address.',
  '3. Select Purge.',
  '',
  'The same purge from the Azion CLI [2]:',
  '',
  '```bash',
  'azion purge urls --urls https://www.example.com/styles.css',
  '```'
].join('\n')

const errorsAnswer = [
  'The **502** responses on storefront started at 14:05, when the TLS certificate of the origin `api.example.com` expired [1].',
  '',
  '| Time | 5xx rate | Cause |',
  '| --- | --- | --- |',
  '| 14:00 | 0.1% | — |',
  '| 14:05 | 38% | Origin certificate expired |',
  '',
  'Renew the certificate at the origin, or let the origin accept plain HTTP from the edge while you renew it.'
].join('\n')

export const sampleStreamingMessages: AiChatMessage[] = [
  user('m1', 'Why is storefront answering with 502 errors?', '14:12'),
  assistant('m2', errorsAnswer.slice(0, 120), '14:12', {
    reasoning:
      'The reader asks about errors on storefront. The error rate rose at 14:05; the certificate of the origin expired at the same minute.',
    reasoningSeconds: 2,
    sources: [
      {
        title: 'Troubleshooting 502 responses',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Azion documentation · Observe'
      }
    ]
  })
]

export const sampleInterruptedMessages: AiChatMessage[] = [
  user('m1', 'How do I purge the cache of one URL?', '10:41'),
  assistant('m2', cacheAnswer.slice(0, 104), '10:41', {
    reasoning:
      'The question is about one URL, so a full purge would be too broad. Real-Time Purge by URL is the narrowest option, and the CLI does the same from a terminal.',
    reasoningSeconds: 2,
    sources: [
      {
        title: 'Real-Time Purge',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Azion documentation · Cache'
      },
      {
        title: 'Azion CLI: purge',
        href: 'https://www.azion.com/en/documentation/',
        description: 'Azion documentation · CLI'
      }
    ]
  })
]
export const sampleInterruptedError = 'The connection was interrupted before the response finished.'

const history: [string, string][] = [
  [
    'Which domains does storefront answer on?',
    'storefront answers on **www.example.com** and **shop.example.com**.'
  ],
  [
    'Is the certificate of shop.example.com valid?',
    'Yes. It is a Let’s Encrypt certificate, valid until **14 January**.'
  ],
  [
    'Can it renew on its own?',
    'Yes. Automatic renewal is on for both domains, 30 days before expiry.'
  ],
  ['What is the cache hit ratio today?', '**91%** over the last 24 hours, up from 87% last week.'],
  [
    'Which paths miss the cache most?',
    'The search pages under `/search`, because every query string is a new cache key.'
  ],
  [
    'How do I fix that?',
    'Set *Cache by query string* to **Allowlist** and keep only `q` and `page`.'
  ]
]

export const sampleLongThread: AiChatMessage[] = history.flatMap(
  ([question, answer], index): AiChatMessage[] => [
    user(`q${index}`, question, `09:${10 + index * 4}`),
    assistant(`a${index}`, answer, `09:${11 + index * 4}`, {
      reasoning: 'Reading the workload settings of storefront.',
      reasoningSeconds: 2,
      sources: []
    })
  ]
)

export const sampleLongThreadFollowUps: SuggestionGroupItem[] = [
  { id: 'apply', label: 'Apply the allowlist to storefront' },
  { id: 'ratio', label: 'How much would the hit ratio improve?' }
]

export const sampleSuggestions: SuggestionGroupItem[] = [
  { id: 'purge', label: 'How do I purge the cache of one URL?', icon: 'az az-bolt' },
  {
    id: 'errors',
    label: 'Why is storefront answering with 502 errors?',
    icon: 'az az-triangle-alert'
  },
  { id: 'deploy', label: 'Deploy a Next.js app from GitHub', icon: 'az az-github' },
  { id: 'waf', label: 'Protect my site with a WAF', icon: 'az az-shield' }
]

export const sampleArtifactVersions: string[] = [
  'SELECT id, customer_id, total\nFROM orders\nORDER BY total DESC\nLIMIT 10;',
  "SELECT id, customer_id, total\nFROM orders\nWHERE created_at > now() - interval '7 days'\nORDER BY total DESC\nLIMIT 10;"
]

export const sampleArtifactThread: (AiChatMessage & { version?: number })[] = [
  user('q1', 'Write a query for the ten biggest orders', '10:00'),
  {
    ...assistant('a1', 'Here is a query for the ten biggest orders, newest total first.', '10:01'),
    version: 0
  },
  user('q2', 'Only this week', '10:02'),
  {
    ...assistant('a2', 'Done. Version 2 keeps the orders of the last seven days.', '10:03'),
    version: 1
  }
]

export const sampleArtifactFollowUps: SuggestionGroupItem[] = [
  { id: 'email', label: 'Show the customer email too' },
  { id: 'items', label: 'Count the items of each order' }
]

export const sampleReportCsv =
  'ZGF0ZSxyZXF1ZXN0cyxjYWNoZSBoaXQgcmF0aW8KMjAyNi0xMS0xNiwxMjA0MzMxLDkwJQoyMDI2LTExLTE3LDExODcyMDIsOTElCjIwMjYtMTEtMTgsMTI1MTk0MCw5MiUK'

export const sampleAgentMessages: AiChatMessage[] = [
  user('q1', 'Find why checkout got slower this week', '15:20'),
  {
    id: 'act1',
    role: 'activity',
    parts: [
      {
        type: 'activity',
        activityType: 'search',
        content: { title: 'Reading the metrics of acme-store', status: 'success' }
      },
      {
        type: 'activity',
        activityType: 'compare',
        content: {
          title: 'Comparing the last two deployments',
          status: 'success',
          detail: 'Builds 1041 and 1042'
        }
      }
    ]
  },
  {
    id: 'a1',
    role: 'assistant',
    parts: [
      {
        type: 'activity',
        activityType: 'wait',
        content: { title: 'Waiting for your answer', status: 'pending' }
      },
      {
        type: 'subagent',
        subagent: {
          id: 'researcher-1',
          name: 'researcher',
          description: 'Comparing the two deployments',
          status: 'finished',
          input: { application: 'acme-store', builds: [1041, 1042] },
          messages: [
            {
              id: 'r1',
              role: 'assistant',
              parts: [
                {
                  type: 'text',
                  content:
                    'Build **1042** added a function on `/checkout` that calls `api.example.com` on every request.'
                }
              ]
            }
          ]
        }
      },
      {
        type: 'text',
        content:
          'Checkout slowed down when build 1042 went live: its new function waits on the origin for every request. I can cache the origin response or roll back to build 1041.'
      }
    ],
    createdAt: at('15:21')
  }
]

export const sampleAgentInterrupts: AiChatInterrupt[] = [
  {
    kind: 'generic',
    id: 'question-fix',
    message: 'How should I fix checkout?',
    metadata: {
      options: [
        { value: 'cache', label: 'Cache the origin response for 60 seconds' },
        { value: 'rollback', label: 'Roll back to build 1041' }
      ]
    },
    status: 'pending',
    errors: []
  }
]
````

## `parts/ai-chat-connection-status.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import type { AiChatConnection } from '@aziontech/webkit/utils/ai-chat'
  import { computed, ref, watch } from 'vue'

  const props = defineProps<{
    connection: AiChatConnection
    resuming: boolean
    sessionGenerating: boolean
    loading: boolean
  }>()

  const wasConnected = ref(props.connection === 'connected')
  watch(
    () => props.connection,
    (value) => {
      if (value === 'connected') wasConnected.value = true
    }
  )
  const reconnecting = computed(
    () => (wasConnected.value && props.connection === 'connecting') || props.resuming
  )
  const offline = computed(
    () =>
      !reconnecting.value &&
      (props.connection === 'error' || (wasConnected.value && props.connection === 'disconnected'))
  )
</script>

<template>
  <StatusIndicator
    v-if="reconnecting"
    key="reconnecting"
    severity="warning"
    label="Reconnecting"
    loading
  />
  <Alert
    v-else-if="offline"
    key="offline"
    severity="danger"
    size="small"
    title="Connection lost"
  >
    Your messages send when the connection returns.
  </Alert>
  <StatusIndicator
    v-else-if="sessionGenerating && !loading"
    key="elsewhere"
    severity="info"
    label="Responding in another tab"
    loading
  />
</template>
```

## `parts/ai-chat-header.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Tag from '@aziontech/webkit/tag'

  defineProps<{ empty: boolean }>()

  const emit = defineEmits<{ 'new-chat': [event: MouseEvent] }>()
</script>

<template>
  <header
    class="flex items-center justify-between gap-(--spacing-sm) border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
  >
    <div class="flex items-center gap-(--spacing-xs)">
      <h1
        id="ai-chat-title"
        class="text-heading-xs text-(--text-default)"
      >
        AI assistant
      </h1>
      <Tag
        label="Preview"
        severity="info"
        size="small"
      />
    </div>
    <Button
      label="New chat"
      variant="ghost"
      size="small"
      icon="az az-plus"
      :disabled="empty"
      @click="emit('new-chat', $event)"
    />
  </header>
</template>
```

## `parts/ai-chat-media-segment.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AudioPlayer from '@aziontech/webkit/audio-player'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FilePreview from '@aziontech/webkit/file-preview'
  import ImageGallery from '@aziontech/webkit/image-gallery'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SubagentCard from '@aziontech/webkit/subagent-card'
  import {
    type AiChatSegment,
    documentNameOf,
    json,
    stopSubagent,
    structuredOf,
    subagentStatusOf,
    subagentTextOf
  } from '@aziontech/webkit/utils/ai-chat'
  import VideoPlayer from '@aziontech/webkit/video-player'

  defineProps<{ segment: AiChatSegment }>()
</script>

<template>
  <ImageGallery
    v-if="segment.type === 'gallery'"
    :items="segment.images"
  />
  <AudioPlayer
    v-else-if="segment.type === 'audio'"
    :src="segment.src"
  />
  <VideoPlayer
    v-else-if="segment.type === 'video'"
    :src="segment.src"
    :mime-type="segment.mimeType"
  />
  <FilePreview
    v-else-if="segment.type === 'document'"
    :file-name="documentNameOf(segment.part)"
    :mime-type="segment.part.source.mimeType"
    :src="segment.part.source.type === 'url' ? segment.part.source.value : ''"
    :base64="segment.part.source.type === 'data' ? segment.part.source.value : ''"
  />
  <SubagentCard
    v-else-if="segment.type === 'subagent'"
    :name="segment.part.subagent.name"
    :title="segment.part.subagent.description"
    :description="segment.part.subagent.error?.message"
    :status="subagentStatusOf(segment.part)"
    :stoppable="typeof segment.part.subagent.stop === 'function'"
    @stop="stopSubagent(segment.part)"
  >
    <StreamingResponse
      v-if="subagentTextOf(segment.part)"
      :content="subagentTextOf(segment.part)"
    />
    <template
      v-if="json(segment.part.subagent.input)"
      #input
    >
      <CodeBlock
        :code="json(segment.part.subagent.input)"
        language="json"
        :show-line-numbers="false"
      />
    </template>
  </SubagentCard>
  <template v-else-if="segment.type === 'structured'">
    <Alert
      v-if="segment.part.status === 'error'"
      severity="danger"
      size="small"
      title="The structured answer failed"
    >
      {{ segment.part.errorMessage || 'The answer did not match the expected format.' }}
    </Alert>
    <CodeBlock
      v-else-if="structuredOf(segment.part)"
      :code="structuredOf(segment.part)"
      language="json"
      :show-line-numbers="false"
      :aria-busy="segment.part.status === 'streaming' || undefined"
    />
  </template>
</template>
```

## `parts/ai-chat-start.vue`

```ts
<script setup lang="ts">
  import EmptyState from '@aziontech/webkit/empty-state'
  import Skeleton from '@aziontech/webkit/skeleton'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'

  defineProps<{ hydrating: boolean; starters: SuggestionGroupItem[] }>()

  const emit = defineEmits<{
    select: [event: MouseEvent | KeyboardEvent, item: SuggestionGroupItem]
  }>()
</script>

<template>
  <div
    v-if="hydrating"
    role="status"
    aria-label="Loading the conversation"
    class="layout-column-content layout-boundary-inline flex flex-1 flex-col gap-(--spacing-lg) py-(--spacing-md)"
  >
    <div
      v-for="row in 3"
      :key="row"
      class="flex gap-(--spacing-sm)"
    >
      <Skeleton
        variant="circle"
        width="2rem"
        height="2rem"
      />
      <div class="flex flex-1 flex-col gap-(--spacing-xs)">
        <Skeleton width="25%" />
        <Skeleton :width="row === 2 ? '50%' : '85%'" />
      </div>
    </div>
  </div>
  <div
    v-else
    class="layout-column-content layout-boundary-inline flex flex-1 flex-col justify-center gap-(--spacing-lg) py-(--spacing-md)"
  >
    <EmptyState
      title="How can I help with your Azion account?"
      description="Ask about your workloads, cache, security rules and deployments. Answers cite the documentation they come from."
      icon="az az-ask-azion"
    />
    <SuggestionGroup
      :items="starters"
      orientation="vertical"
      @select="(event, item) => emit('select', event, item)"
    />
  </div>
</template>
```

## `parts/ai-chat-tool-segment.vue`

```ts
<script setup lang="ts">
  import AgentQuestion from '@aziontech/webkit/agent-question'
  import CodeBlock from '@aziontech/webkit/code-block'
  import ImageGallery from '@aziontech/webkit/image-gallery'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import ToolCall from '@aziontech/webkit/tool-call'
  import {
    type AiChatQuestion,
    type AiChatTool,
    type AiChatToolCallPart,
    type AiChatToolResultPart,
    answerable,
    approvalOf,
    json,
    needsApproval,
    parsesAsJson,
    toolContentOf,
    toolStatusOf
  } from '@aziontech/webkit/utils/ai-chat'

  defineProps<{
    call: AiChatToolCallPart
    result?: AiChatToolResultPart
    tool: AiChatTool
    ask: AiChatQuestion
    edit: string
    busy: boolean
  }>()

  const emit = defineEmits<{
    answer: [event: Event, value: string]
    edit: [text: string]
    approve: [event: MouseEvent, text: string]
    deny: [event: MouseEvent]
  }>()

  const answer = defineModel<string>('answer')
</script>

<template>
  <AgentQuestion
    v-if="answerable(tool, call, result)"
    v-model="answer"
    :title="ask.title"
    :type="ask.options.length ? 'choice' : 'text'"
    :options="ask.options"
    :status="ask.status"
    @submit="(event, value) => emit('answer', event, value)"
  />
  <template v-else>
    <ToolApproval
      v-if="needsApproval(call)"
      :title="tool.question || tool.title || `Run ${call.name}?`"
      :description="tool.description"
      :approve-label="tool.approveLabel"
      :variant="tool.variant"
      :confirmation-phrase="tool.confirmationPhrase"
      :status="approvalOf(call)"
      :loading="busy"
      :editable="tool.editable"
      :invalid="tool.editable && !parsesAsJson(edit)"
      :model-value="edit"
      @update:model-value="(text) => emit('edit', text)"
      @approve="(event, text) => emit('approve', event, text)"
      @deny="emit('deny', $event)"
    >
      <CodeBlock
        v-if="!tool.editable && json(call.input ?? call.arguments)"
        :code="json(call.input ?? call.arguments)"
        language="json"
        :show-line-numbers="false"
      />
    </ToolApproval>
    <ToolCall
      v-if="!needsApproval(call) || approvalOf(call) === 'approved'"
      :name="call.name"
      :title="tool.title"
      :status="toolStatusOf(call, result)"
    >
      <template
        v-if="json(call.input ?? call.arguments)"
        #input
      >
        <CodeBlock
          :code="json(call.input ?? call.arguments)"
          language="json"
          :show-line-numbers="false"
        />
      </template>
      <template
        v-if="!result?.error && call.output === undefined && toolContentOf(result?.content)"
        #output
      >
        <p
          v-if="toolContentOf(result?.content)?.text"
          class="whitespace-pre-line text-body-sm text-(--text-default)"
        >
          {{ toolContentOf(result?.content)?.text }}
        </p>
        <ImageGallery
          v-if="toolContentOf(result?.content)?.images.length"
          :items="toolContentOf(result?.content)?.images ?? []"
        />
      </template>
      <template
        v-else-if="json(result?.error || call.output || result?.content)"
        #output
      >
        <CodeBlock
          :code="json(result?.error || call.output || result?.content)"
          language="json"
          :show-line-numbers="false"
        />
      </template>
    </ToolCall>
  </template>
</template>
```

## `parts/ai-chat-turn.vue`

```ts
<script setup lang="ts">
  import AgentActivity from '@aziontech/webkit/agent-activity'
  import AgentQuestion from '@aziontech/webkit/agent-question'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageStatus
  } from '@aziontech/webkit/chat-message'
  import CopyButton from '@aziontech/webkit/copy-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import McpAppFrame, {
    type McpAppFrameMessage,
    type McpAppFrameResource
  } from '@aziontech/webkit/mcp-app-frame'
  import Reasoning from '@aziontech/webkit/reasoning'
  import Sources from '@aziontech/webkit/sources'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import {
    activitiesBefore,
    type AiChatMessage,
    type AiChatQuestion,
    type AiChatSegment,
    type AiChatTool,
    type AiChatToolCallPart,
    type AiChatUiResourcePart,
    segmentsOf,
    textOf
  } from '@aziontech/webkit/utils/ai-chat'

  import AiChatMediaSegment from './ai-chat-media-segment.vue'
  import AiChatToolSegment from './ai-chat-tool-segment.vue'

  const props = defineProps<{
    turn: AiChatMessage
    messages: ReadonlyArray<AiChatMessage>
    status: ChatMessageStatus
    time: string
    failure: string
    tools: Record<string, AiChatTool>
    busy: boolean
    ready: boolean
    stopped: boolean
    rating: ChatMessageFeedbackValue | null
    questions?: AiChatQuestion[]
    askOf: (call: AiChatToolCallPart) => AiChatQuestion
    editOf: (call: AiChatToolCallPart) => string
    resolveAppUrl?: (resource: McpAppFrameResource) => string | Promise<string>
  }>()

  const emit = defineEmits<{
    retry: [event: MouseEvent]
    rate: [value: ChatMessageFeedbackValue | null]
    'answer-tool': [event: Event, call: AiChatToolCallPart, value: string]
    edit: [call: AiChatToolCallPart, text: string]
    approve: [event: MouseEvent, call: AiChatToolCallPart, text: string]
    deny: [event: MouseEvent, call: AiChatToolCallPart]
    answer: [event: Event, question: AiChatQuestion, value: string]
    skip: [question: AiChatQuestion]
    'app-message': [
      message: McpAppFrameMessage,
      part: AiChatUiResourcePart,
      reply: (message: McpAppFrameMessage) => void
    ]
  }>()

  const answers = defineModel<Record<string, string>>('answers', { required: true })

  const MEDIA_TYPES = new Set(['gallery', 'audio', 'video', 'document', 'subagent', 'structured'])
  const isMedia = (segment: AiChatSegment) => MEDIA_TYPES.has(segment.type)

  function toolOf(call: AiChatToolCallPart): AiChatTool {
    return props.tools[call.name] ?? { title: '' }
  }

  const appFrames = new Map<string, InstanceType<typeof McpAppFrame>>()

  function setAppFrame(key: string, el: unknown) {
    if (el) appFrames.set(key, el as InstanceType<typeof McpAppFrame>)
    else appFrames.delete(key)
  }

  function forwardAppMessage(key: string, part: AiChatUiResourcePart, message: McpAppFrameMessage) {
    emit('app-message', message, part, (reply) => appFrames.get(key)?.post(reply))
  }
</script>

<template>
  <ChatMessage
    :from="turn.role === 'user' ? 'user' : 'assistant'"
    :status="status"
    :timestamp="time"
    :error-message="status === 'error' ? failure : undefined"
    @retry="emit('retry', $event)"
  >
    <template v-if="turn.role === 'user'">{{ textOf(turn, '\n') }}</template>
    <template
      v-for="segment in segmentsOf(
        turn,
        turn.role === 'assistant' ? activitiesBefore(messages, turn) : []
      )"
      :key="segment.key"
    >
      <template v-if="turn.role === 'user' && segment.type === 'text'" />
      <AgentActivity
        v-else-if="segment.type === 'activity'"
        :steps="segment.steps"
      />
      <Reasoning
        v-else-if="segment.type === 'reasoning'"
        :streaming="status === 'pending'"
        :duration="status === 'pending' ? undefined : turn.metadata?.reasoningSeconds"
      >
        <p class="whitespace-pre-line">{{ segment.content }}</p>
      </Reasoning>
      <StreamingResponse
        v-else-if="segment.type === 'text'"
        :content="segment.content"
        :streaming="status === 'streaming'"
        :sources="turn.metadata?.sources ?? []"
        :anchor="`answer-${turn.id}`"
      />
      <AiChatToolSegment
        v-else-if="segment.type === 'tool'"
        v-model:answer="answers[segment.call.id]"
        :call="segment.call"
        :result="segment.result"
        :tool="toolOf(segment.call)"
        :ask="askOf(segment.call)"
        :edit="editOf(segment.call)"
        :busy="busy"
        @answer="(event, value) => emit('answer-tool', event, segment.call, value)"
        @edit="(text) => emit('edit', segment.call, text)"
        @approve="(event, text) => emit('approve', event, segment.call, text)"
        @deny="(event) => emit('deny', event, segment.call)"
      />
      <AiChatMediaSegment
        v-else-if="isMedia(segment)"
        :segment="segment"
      />
      <McpAppFrame
        v-else-if="segment.type === 'app'"
        :ref="(el) => setAppFrame(segment.key, el)"
        :resource="segment.part.resource"
        :title="(tools[segment.part.toolName] ?? { title: '' }).title || segment.part.toolName"
        :resolve-url="resolveAppUrl"
        @message="(message) => forwardAppMessage(segment.key, segment.part, message)"
      />
    </template>
    <template v-if="turn.role === 'assistant'">
      <p
        v-if="stopped"
        class="text-body-sm text-(--text-muted)"
      >
        You stopped this response.
      </p>
      <Sources
        v-if="status === 'success' && !stopped"
        :items="turn.metadata?.sources ?? []"
        :anchor="`answer-${turn.id}`"
      />
    </template>
    <template
      v-if="turn.role === 'assistant'"
      #actions
    >
      <ChatMessage.Actions>
        <CopyButton
          size="small"
          :value="textOf(turn)"
        />
        <IconButton
          icon="az az-refresh"
          aria-label="Regenerate response"
          variant="ghost"
          size="small"
          :disabled="!ready"
          @click="emit('retry', $event)"
        />
        <ChatMessage.Feedback
          :model-value="rating"
          @update:model-value="(value) => emit('rate', value)"
        />
      </ChatMessage.Actions>
    </template>
  </ChatMessage>
  <ChatMessage
    v-if="questions?.length"
    from="assistant"
  >
    <AgentQuestion
      v-for="question in questions"
      :key="question.id"
      v-model="answers[question.id]"
      :title="question.title"
      :type="question.options.length ? 'choice' : 'text'"
      :options="question.options"
      :status="question.status"
      :error="question.error"
      :skippable="question.bound"
      @submit="(event, value) => emit('answer', event, question, value)"
      @skip="emit('skip', question)"
    />
  </ChatMessage>
</template>
```

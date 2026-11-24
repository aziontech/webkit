# AiChatDrawer (`ai/ai-chat-drawer`)

> The generative AI assistant in a right-side drawer over a resource page, so the reader asks about what they are looking at without leaving it: a workload page (`PageHeader` with an Agent `Button`, the name the console header gives the assistant, a `Card` of `KeyValueList` with a `StatusIndicator`) beside a medium `Drawer` with `:modal="false"` (no overlay), so the page stays undimmed and readable whose `PanelHeader` holds `DrawerTitle`, a Preview `Tag`, New chat and the drawer's own close button. Inside, an `EmptyState` with support prompts about this workload (`SuggestionGroup`), then a `Conversation` with the reader's prompts in bubbles at the inline end and plain-text responses that think (`Reasoning`), stream (`StreamingResponse` with site-name citation chips) and carry Copy, Read aloud, Share and More (with Good response, Bad response, Try again and Branch in new chat) and a `Sources` pill on the same line, prompts with Copy and Edit, and `ResponseBranches` over their versions, and a `PromptInput` pill floating at the foot with the disclaimer, the thread on the canvas. Built from `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `ChatMessage`, `Conversation`, `PromptInput`, `IconButton`, `ResponseBranches` and `FeedbackReasonDialog`. Takes the messages of TanStack AI's `useChat` as they are. A page body for ConsoleLayout, rendered in its default slot; inside ConsoleLayout on a wide screen the same conversation can go in the layout's tools region (`v-model:tools-open`) instead.

- Surface: app
- Source: `blocks/ai/ai-chat-drawer/ai-chat-drawer.vue` in `@aziontech/webkit`
- MCP: `get_block("ai/ai-chat-drawer")`
- Components: [AgentActivity](../../components/agent-activity.md), [AgentQuestion](../../components/agent-question.md), [Alert](../../components/alert.md), [AudioPlayer](../../components/audio-player.md), [Button](../../components/button.md), [Card](../../components/card.md), [ChatMessage](../../components/chat-message.md), [ChatMessage](../../components/chat-message.md), [CodeBlock](../../components/code-block.md), [Conversation](../../components/conversation.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [EmptyState](../../components/empty-state.md), [FeedbackReasonDialog](../../components/feedback-reason-dialog.md), [FilePreview](../../components/file-preview.md), [IconButton](../../components/icon-button.md), [ImageGallery](../../components/image-gallery.md), [KeyValueList](../../components/key-value-list.md), [McpAppFrame](../../components/mcp-app-frame.md), [PageHeader](../../components/page-header.md), `PanelHeader`, `PromptInputAttachButton`, `PromptInputDictateButton`, [PromptInput](../../components/prompt-input.md), [PromptQueue](../../components/prompt-queue.md), [Reasoning](../../components/reasoning.md), [ResponseBranches](../../components/response-branches.md), [Skeleton](../../components/skeleton.md), [Sources](../../components/sources.md), [StatusIndicator](../../components/status-indicator.md), [StreamingResponse](../../components/streaming-response.md), [SubagentCard](../../components/subagent-card.md), [SuggestionGroup](../../components/suggestion-group.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToolApproval](../../components/tool-approval.md), [ToolCall](../../components/tool-call.md), `use-ai-chat-tools`, `use-ai-chat-versions`, `use-locale`, `utils/ai-chat`, [VideoPlayer](../../components/video-player.md)
- Skills: `webkit-ai-surfaces`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

ai assistant drawer; ask ai about this page; contextual ai help; copilot panel; ai side panel; chat drawer; assistant over console page; ai help drawer; assistente de ia na gaveta; perguntar à ia; painel lateral de ia; asistente de ia en panel lateral; ask about this page; assistant side panel; tanstack ai; usechat

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

A medium end-side `Drawer` with no backdrop (`:modal="false"`), so the resource page beside it stays undimmed and readable while the reader asks about it. From the `lg` breakpoint the page reserves the drawer's width while it is open (`data-drawer-open` on the block root sets `padding-inline-end` to the medium drawer width), so nothing on the page sits under the conversation; below `lg` the drawer overlays the page. Escape and the close button dismiss it. Inside `ConsoleLayout` on a wide screen, put the same conversation in the layout's tools region (`v-model:tools-open`, as the console Notifications do) and keep the drawer for narrow screens; the conversation survives closing and reopening during the visit.

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

The `#composer` of `Conversation`: one floating pill at the foot of the drawer, no divider, four rows at most, a placeholder that names the resource, Stop while generating, and the short disclaimer as its hint. The "+" at the start (`attachable`, on by default: a `PromptInputAttachButton` with `tools`, and drop and paste) opens a menu with Camera (touch screens), Photos and Files, then the tools of `toolOptions`; a turned-on tool rides in the composer as a removable chip and is `v-model:toolKeys` (pass it as `sendMessage(content, { body: { tools: toolKeys } })`). It attaches up to `maxFiles` files of `accept` (images and PDF by default) under `maxFileSize` (10 MB); `send` then hands over TanStack AI's multimodal content, the text and one `image`, `audio`, `video` or `document` part per file with its base64 bytes, ready for `sendMessage`. Dictate (a `PromptInputDictateButton`, the microphone before Send) writes speech into the prompt with the browser's speech recognition and hides itself where the browser has none; an app that runs its own transcriber swaps in `PromptInputDictateButton` with `transcriber="app"` and writes the text itself. The composer is disabled while the conversation is restored.

### J. Tool calls — `ToolCall`, `ToolApproval`, `CodeBlock`

A `tool-call` part draws in its place in the response as a `ToolCall` with the tool name in code, the `title` the `tools` prop gives it, and its input and output in a `CodeBlock` when opened; it reads streaming (its arguments arriving), running, completed, failed, canceled (a `cancelled` result) or denied from the call's `state` and its `tool-result`. A call that needs approval draws a `ToolApproval` card first, with the question, verb and danger variant from `tools` and the call's input in a `CodeBlock`; a tool with `editable` shows its arguments as JSON the reader can edit, Approve staying off while they do not parse. Deny and the approve button resolve the matching `useChat` interrupt (an edit as `{ editedArgs }`), and an approved call runs as a `ToolCall` under the card. The card stays busy until the run that asked for it ends. See `ai/ai-action-approval` for the whole approval flow. A `tool-result` whose `content` is a list of text and image parts draws as text and an `ImageGallery` in the output, not as JSON. A tool marked `answerable` in `tools` is one the reader answers (a client tool with no `execute`): until it has an output it draws as an `AgentQuestion` with its `question` and `options` (else a text field), and Submit emits `answer-tool` with the payload `addToolResult` takes.

### K. Media — `ImageGallery`, `AudioPlayer`, `VideoPlayer`, `FilePreview`

Media parts draw in their place in the response. Consecutive `image` parts are one `ImageGallery` (a URL becomes `src`, base64 data becomes `data` with its `mimeType`, `metadata.alt` its alternative text); an `audio` part is an `AudioPlayer` and a `video` part a `VideoPlayer`, each from its URL or a `data:` URL; a `document` part is a `FilePreview` from its URL or base64, named by `metadata.name` (else `Document`). A `file` source (a provider file handle) has no bytes to draw and is skipped.

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

The block draws a conversation in the message shape of TanStack AI: each message has an `id`, a `role` and its `parts` in order (`text`, `thinking`, `tool-call`, `tool-result`, `image`, `audio`, `video`, `document`, `activity`, `subagent`, `structured-output`, `ui-resource`), so the values `useChat` from `@tanstack/ai-vue` returns go straight into its props, with no conversion. The block calls no model and runs no AI library; `@aziontech/webkit/utils/ai-chat` names TanStack AI's own message types, imported from `@tanstack/ai` as types only (an optional peer, `^1.5.0`), with the helpers that read them (`AiChatMessage`, `AiChatPart`, `AiChatTool`, `AiChatInterrupt`, `AiChatSendContent`; import the types from there), so the shape follows TanStack when you update it, and any source that produces it works. A part of another type is skipped. `sample.ts` holds the sample threads the variants pass. The draft in the composer stays local.

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
- **Disclaimer:** "The AI assistant can make mistakes. Check important information before you act on it.", word for word the one `ai/ai-chat` uses; `ai/ai-action-approval` adds "It runs nothing in your account without your approval."
- Errors, loading and feedback strings follow `ai/ai-chat` and `skills/webkit-microcopy`.
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
- `skills/webkit-ai-surfaces` — the rules for generative AI surfaces.

## Variants

- `Empty` — primary (the code below)
- `Streaming` — The drawer open on a response streaming in about the 502 errors of the workload behind it, with the caret, Stop in the composer and the busy region.
- `Error` — A response that failed mid-stream inside the drawer: the partial text, the error line and Try again.
- `LongThread` — Six earlier turns about the workload in the narrow drawer: the log opens on the newest response and Scroll to the latest message returns after scrolling up.

Each variant is the same screen in another state: `get_block("ai/ai-chat-drawer", { variant })`, or the file under `blocks/ai/ai-chat-drawer/variants/`.

## Code (`Empty`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import type { ChatMessageFeedbackValue, ChatMessageStatus } from '@aziontech/webkit/chat-message'
  import ChatMessage from '@aziontech/webkit/chat-message-root'
  import Conversation from '@aziontech/webkit/conversation'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import type { FeedbackReasonDialogPayload } from '@aziontech/webkit/feedback-reason-dialog'
  import {
    type McpAppFrameMessage,
    type McpAppFrameResource
  } from '@aziontech/webkit/mcp-app-frame'
  import type {
    PromptInputFile,
    PromptInputMenuOption,
    PromptInputStatus
  } from '@aziontech/webkit/prompt-input'
  import PromptQueue from '@aziontech/webkit/prompt-queue'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import { useAiChatTools } from '@aziontech/webkit/use-ai-chat-tools'
  import { useAiChatVersions } from '@aziontech/webkit/use-ai-chat-versions'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import {
    type AiChatConnection,
    type AiChatInterrupt,
    type AiChatInterruptError,
    type AiChatMessage,
    type AiChatQueuedMessage,
    type AiChatSendContent,
    type AiChatTool,
    type AiChatToolAnswer,
    type AiChatToolCallPart,
    type AiChatUiResourcePart,
    contentOf,
    hasAnswer,
    interruptErrorText,
    queueItemOf
  } from '@aziontech/webkit/utils/ai-chat'
  import { computed, nextTick, ref, watch } from 'vue'

  import AiChatConnectionStatus from './parts/ai-chat-connection-status.vue'
  import AiChatTurn from './parts/ai-chat-turn.vue'
  import DrawerChatComposer from './parts/drawer-chat-composer.vue'
  import DrawerChatHeader from './parts/drawer-chat-header.vue'
  import DrawerChatStart from './parts/drawer-chat-start.vue'
  import WorkloadOverview from './parts/workload-overview.vue'
  import { sampleSuggestions, sampleTools } from './sample'

  export interface AiChatDrawerProps {
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
    /** The reader may attach files from the Attach control at the start of the composer; `send` then hands over the multimodal content `sendMessage` takes. */
    attachable?: boolean
    /** The files the reader may attach, in the native accept syntax. */
    accept?: string
    /** Most files attached to one message. */
    maxFiles?: number
    /** Largest file in bytes. */
    maxFileSize?: number
    /** Turns a widget's resource into a trusted https address when it has no inline HTML; left out, only inline widgets show. */
    resolveAppUrl?: (resource: McpAppFrameResource) => string | Promise<string>
    /** The tools the composer's "+" menu turns on (web search, deep research); left out, the sample tools show. Read the turned-on ones from `v-model:toolKeys`. */
    toolOptions?: PromptInputMenuOption[]
  }

  const props = withDefaults(defineProps<AiChatDrawerProps>(), {
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
    attachable: true,
    accept: 'image/*,application/pdf',
    maxFiles: 4,
    maxFileSize: 10485760,
    resolveAppUrl: undefined,
    toolOptions: undefined
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, content: AiChatSendContent]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    share: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    branch: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    edit: [event: MouseEvent | KeyboardEvent, message: AiChatMessage, text: string]
    'version-change': [messages: AiChatMessage[]]
    'new-chat': [event: MouseEvent]
    feedback: [
      value: ChatMessageFeedbackValue | null,
      message: AiChatMessage,
      reason?: FeedbackReasonDialogPayload
    ]
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

  /** Whether the assistant drawer is open; Agent opens it and its close button closes it. */
  const open = defineModel<boolean>('open', { default: true })
  /** The tools turned on in the composer's "+" menu, in `toolOptions` order; pass them to `sendMessage` as `{ body: { tools } }`. */
  const toolKeys = defineModel<string[]>('toolKeys', { default: () => [] })

  const { formatDate } = useLocale()
  const versions = useAiChatVersions(() => props.messages)

  const prompt = ref('')
  const files = ref<PromptInputFile[]>([])
  const composerEl = ref<InstanceType<typeof DrawerChatComposer> | null>(null)
  const stoppedIds = ref<Set<string>>(new Set())
  const answers = ref<Record<string, string>>({})

  const turns = computed(() =>
    props.messages.filter((message) => message.role === 'user' || message.role === 'assistant')
  )
  const chatTools = useAiChatTools({
    turns: () => turns.value,
    interrupts: () => props.interrupts,
    tools: () => props.tools,
    onAnswerInterrupt: (event, interrupt, value) =>
      emit('answer-interrupt', event, interrupt, value),
    onAnswerTool: (event, answer) => emit('answer-tool', event, answer),
    onApprove: (event, call, input) => emit('approve', event, call, input),
    onDeny: (event, call) => emit('deny', event, call)
  })
  const starters = computed(() => props.suggestions ?? sampleSuggestions)
  const composerTools = computed(() => props.toolOptions ?? sampleTools)
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

  watch(
    () => props.loading,
    (now, before) => {
      if (before && !now) composerEl.value?.focus()
    }
  )

  watch(
    open,
    async (isOpen) => {
      if (!isOpen) return
      await nextTick()
      composerEl.value?.focus()
    },
    { flush: 'post' }
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
    answers.value = {}
    chatTools.reset()
    versions.clear()
    emit('new-chat', event)
  }

  function removeQueued(event: MouseEvent, id: string) {
    const item = props.queue?.find((entry) => entry.id === id)
    if (item) emit('remove-queued', event, item)
  }
</script>

<template>
  <div
    :data-drawer-open="open || null"
    class="w-full lg:data-drawer-open:pe-[max(30vw,var(--container-md))]"
  >
    <WorkloadOverview
      :open="open"
      @open="open = true"
    />

    <Drawer
      v-model:open="open"
      side="end"
      size="medium"
      :modal="false"
    >
      <DrawerContent>
        <div class="flex min-h-0 flex-1 flex-col">
          <DrawerChatHeader
            :empty="!turns.length"
            @new-chat="newChat"
          />
          <div
            class="flex min-h-0 flex-1 flex-col [--conversation-composer-fade:var(--bg-surface)]"
          >
            <Conversation
              aria-label="Conversation with the AI assistant"
              :more-messages="moreMessages"
              :loading-more="loadingMore"
              @load-more="emit('load-more', $event)"
            >
              <DrawerChatStart
                v-if="!turns.length"
                :hydrating="hydrating"
                :starters="starters"
                @select="(event, item) => send(event, item.label)"
              />
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
                :questions="chatTools.questions.value[turn.id]"
                :ask-of="chatTools.askOf"
                :edit-of="chatTools.editOf"
                :resolve-app-url="resolveAppUrl"
                :versions="versions"
                @retry="emit('retry', $event, turn)"
                @rate="(value, reason) => emit('feedback', value, turn, reason)"
                @share="(event) => emit('share', event, turn)"
                @branch="(event) => emit('branch', event, turn)"
                @edit-prompt="(event, text) => emit('edit', event, turn, text)"
                @version-change="(next) => emit('version-change', next)"
                @answer-tool="chatTools.answerTool"
                @edit="chatTools.setEdit"
                @approve="chatTools.approve"
                @deny="chatTools.deny"
                @answer="chatTools.answer"
                @skip="chatTools.skip"
                @app-message="(message, part, reply) => emit('app-message', message, part, reply)"
              />
              <ChatMessage
                v-if="waiting && last"
                :status="failure ? 'error' : 'pending'"
                :error-message="failure || undefined"
                @retry="emit('retry', $event, last)"
              />
              <SuggestionGroup
                v-if="lastAnswer && followUps?.length"
                :items="followUps"
                aria-label="Follow-up questions"
                @select="(event, item) => send(event, item.label)"
              />
              <template #composer>
                <AiChatConnectionStatus
                  :connection="connection"
                  :resuming="resuming"
                  :session-generating="sessionGenerating"
                  :loading="loading"
                />
                <Alert
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
                <DrawerChatComposer
                  ref="composerEl"
                  v-model="prompt"
                  v-model:files="files"
                  v-model:tool-keys="toolKeys"
                  :state="state"
                  :queueable="queueable"
                  :hydrating="hydrating"
                  :accept="accept"
                  :max-files="maxFiles"
                  :max-file-size="maxFileSize"
                  :attachable="attachable"
                  :tools="composerTools"
                  @submit="send"
                  @stop="stop"
                />
              </template>
            </Conversation>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
```

## `sample.ts`

````ts
import type { PromptInputMenuOption } from '@aziontech/webkit/prompt-input'
import type { SourcesItem } from '@aziontech/webkit/sources'
import type { SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
import type { AiChatMessage } from '@aziontech/webkit/utils/ai-chat'

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
    'Set *Cache by query string* to **Allowlist** and keep only `q` and `page` [1]. Campaign parameters such as `utm_source` then stop creating new cache keys [3].'
  ]
]

const cacheKeySources: SourcesItem[] = [
  {
    title: 'Cache settings',
    href: 'https://www.azion.com/en/documentation/',
    description: 'Azion documentation · Cache'
  },
  {
    title: 'aziontech/azion',
    href: 'https://github.com/aziontech/azion',
    description: 'Azion CLI on GitHub',
    icon: 'az az-github'
  },
  {
    title: 'HTTP Caching',
    href: 'https://www.w3.org/Protocols/',
    description: 'W3C · HTTP'
  }
]

export const sampleLongThread: AiChatMessage[] = history.flatMap(
  ([question, answer], index): AiChatMessage[] => [
    user(`q${index}`, question, `09:${10 + index * 4}`),
    assistant(`a${index}`, answer, `09:${11 + index * 4}`, {
      reasoning: 'Reading the workload settings of storefront.',
      reasoningSeconds: 2,
      sources: index === history.length - 1 ? cacheKeySources : []
    })
  ]
)

export const sampleLongThreadFollowUps: SuggestionGroupItem[] = [
  { id: 'apply', label: 'Apply the allowlist to storefront' },
  { id: 'ratio', label: 'How much would the hit ratio improve?' }
]

export const sampleSuggestions: SuggestionGroupItem[] = [
  {
    id: 'errors',
    label: 'Why is storefront answering with 502 errors?',
    icon: 'az az-triangle-alert'
  },
  { id: 'purge', label: 'How do I purge the cache of one URL?', icon: 'az az-bolt' },
  { id: 'domains', label: 'Which domains does storefront answer on?', icon: 'az az-globe' }
]

export const sampleTools: PromptInputMenuOption[] = [
  { value: 'web-search', label: 'Web search', icon: 'az az-globe' },
  { value: 'deep-research', label: 'Deep research', icon: 'az az-lightbulb' },
  { value: 'create-image', label: 'Create image', icon: 'az az-image' }
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
  import FeedbackReasonDialog, {
    type FeedbackReasonDialogPayload
  } from '@aziontech/webkit/feedback-reason-dialog'
  import McpAppFrame, {
    type McpAppFrameMessage,
    type McpAppFrameResource
  } from '@aziontech/webkit/mcp-app-frame'
  import Reasoning from '@aziontech/webkit/reasoning'
  import ResponseBranches from '@aziontech/webkit/response-branches'
  import Sources from '@aziontech/webkit/sources'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import { toast } from '@aziontech/webkit/toast'
  import type { UseAiChatVersionsReturn } from '@aziontech/webkit/use-ai-chat-versions'
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
  import { computed, ref } from 'vue'

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
    versions: UseAiChatVersionsReturn
    questions?: AiChatQuestion[]
    askOf: (call: AiChatToolCallPart) => AiChatQuestion
    editOf: (call: AiChatToolCallPart) => string
    resolveAppUrl?: (resource: McpAppFrameResource) => string | Promise<string>
  }>()

  const emit = defineEmits<{
    retry: [event: MouseEvent | KeyboardEvent]
    rate: [value: ChatMessageFeedbackValue | null, reason?: FeedbackReasonDialogPayload]
    share: [event: MouseEvent]
    branch: [event: MouseEvent | KeyboardEvent]
    'edit-prompt': [event: MouseEvent | KeyboardEvent, text: string]
    'version-change': [messages: AiChatMessage[]]
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

  const reasonOpen = ref(false)
  const rating = ref<ChatMessageFeedbackValue | null>(null)
  const versionsOfTurn = computed(() => props.versions.versionsOf(props.turn))

  function regenerate(event: MouseEvent | KeyboardEvent) {
    props.versions.fork(props.turn)
    emit('retry', event)
  }

  function editPrompt(event: MouseEvent | KeyboardEvent, text: string) {
    props.versions.fork(props.turn)
    emit('edit-prompt', event, text)
  }

  function page(index: number) {
    const next = props.versions.select(props.turn, index)
    if (next) emit('version-change', next)
  }

  function rate(value: ChatMessageFeedbackValue | null) {
    rating.value = value
    emit('rate', value)
    if (value === 'up') toast('Thanks for your feedback')
    if (value === 'down') reasonOpen.value = true
  }

  function sendReason(reason: FeedbackReasonDialogPayload) {
    reasonOpen.value = false
    emit('rate', 'down', reason)
    toast('Thanks for your feedback')
  }

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
    @edit="editPrompt"
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
    </template>
    <template
      v-if="turn.role === 'user'"
      #actions
    >
      <ChatMessage.Actions
        copyable
        editable
        :copy-text="textOf(turn, '\n')"
        :disabled="!ready"
      >
        <template
          v-if="versionsOfTurn"
          #leading
        >
          <ResponseBranches
            :model-value="versionsOfTurn.index"
            :count="versionsOfTurn.count"
            aria-label="Prompt versions"
            :disabled="!ready"
            @update:model-value="page"
          />
        </template>
      </ChatMessage.Actions>
    </template>
    <template
      v-else
      #actions
    >
      <ChatMessage.Actions
        copyable
        show-feedback
        show-read-aloud
        shareable
        retryable
        branchable
        :copy-text="textOf(turn)"
        :read-aloud-text="textOf(turn)"
        :feedback="rating"
        :disabled="!ready"
        @update:feedback="rate"
        @share="emit('share', $event)"
        @retry="regenerate"
        @branch="emit('branch', $event)"
      >
        <template
          v-if="versionsOfTurn"
          #leading
        >
          <ResponseBranches
            :model-value="versionsOfTurn.index"
            :count="versionsOfTurn.count"
            :disabled="!ready"
            @update:model-value="page"
          />
        </template>
        <template
          v-if="!stopped && turn.metadata?.sources?.length"
          #trailing
        >
          <Sources :items="turn.metadata.sources" />
        </template>
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
  <FeedbackReasonDialog
    v-if="turn.role === 'assistant'"
    v-model:open="reasonOpen"
    @submit="(_event, reason) => sendReason(reason)"
  />
</template>
```

## `parts/drawer-chat-composer.vue`

```ts
<script setup lang="ts">
  import type {
    PromptInputFile,
    PromptInputMenuOption,
    PromptInputStatus
  } from '@aziontech/webkit/prompt-input'
  import PromptInputAttachButton from '@aziontech/webkit/prompt-input-attach-button'
  import PromptInputDictateButton from '@aziontech/webkit/prompt-input-dictate-button'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import { ref } from 'vue'

  defineProps<{
    state: PromptInputStatus
    queueable: boolean
    hydrating: boolean
    accept: string
    maxFiles: number
    maxFileSize: number
    attachable: boolean
    tools: PromptInputMenuOption[]
  }>()

  const emit = defineEmits<{
    submit: [event: MouseEvent | KeyboardEvent, value: string]
    stop: [event: MouseEvent]
  }>()

  const prompt = defineModel<string>({ required: true })
  const files = defineModel<PromptInputFile[]>('files', { required: true })
  const toolKeys = defineModel<string[]>('toolKeys', { required: true })

  const inputEl = ref<InstanceType<typeof PromptInput> | null>(null)

  defineExpose({ focus: () => inputEl.value?.focus() })
</script>

<template>
  <PromptInput
    ref="inputEl"
    v-model="prompt"
    v-model:files="files"
    :status="state"
    :queueable="queueable"
    :disabled="hydrating"
    :accept="accept"
    :max-files="maxFiles"
    :max-file-size="maxFileSize"
    :max-rows="4"
    placeholder="Ask about storefront"
    @submit="(event, { value }) => emit('submit', event, value)"
    @stop="emit('stop', $event)"
  >
    <template
      v-if="attachable"
      #actions
    >
      <PromptInputAttachButton
        v-model="toolKeys"
        :tools="tools"
      />
    </template>
    <template #end>
      <PromptInputDictateButton />
    </template>
    <template #hint
      >The AI assistant can make mistakes. Check important information before you act on
      it.</template
    >
  </PromptInput>
</template>
```

## `parts/drawer-chat-header.vue`

```ts
<script setup lang="ts">
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import IconButton from '@aziontech/webkit/icon-button'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Tag from '@aziontech/webkit/tag'

  defineProps<{ empty: boolean }>()

  const emit = defineEmits<{ 'new-chat': [event: MouseEvent] }>()
</script>

<template>
  <PanelHeader class="w-full">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <DrawerTitle>AI assistant</DrawerTitle>
      <Tag
        label="Preview"
        severity="info"
        size="small"
      />
    </div>
    <div class="flex items-center gap-(--spacing-2xs)">
      <IconButton
        icon="az az-square-pen"
        aria-label="New chat"
        variant="ghost"
        size="medium"
        :disabled="empty"
        @click="emit('new-chat', $event)"
      />
    </div>
  </PanelHeader>
</template>
```

## `parts/drawer-chat-start.vue`

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
    class="flex flex-col gap-(--spacing-xl)"
  >
    <template
      v-for="row in 2"
      :key="row"
    >
      <Skeleton
        width="55%"
        height="2.75rem"
        class="self-end"
      />
      <div class="flex flex-col gap-(--spacing-xs)">
        <Skeleton width="90%" />
        <Skeleton :width="row === 2 ? '40%' : '70%'" />
      </div>
    </template>
  </div>
  <div
    v-else
    class="my-auto flex flex-col gap-(--spacing-lg) py-(--spacing-md)"
  >
    <EmptyState
      title="Ask about storefront"
      description="The assistant reads this workload’s settings and metrics to answer. It cites the documentation it uses."
      icon="az az-ask-azion"
      size="small"
    />
    <SuggestionGroup
      :items="starters"
      orientation="vertical"
      @select="(event, item) => emit('select', event, item)"
    />
  </div>
</template>
```

## `parts/workload-overview.vue`

```ts
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'

  defineProps<{ open: boolean }>()

  const emit = defineEmits<{ open: [] }>()
</script>

<template>
  <div class="layout-column layout-boundary flex min-w-0 flex-col">
    <div class="layout-section-start flex flex-col gap-(--layout-section-gap)">
      <PageHeader
        title="storefront"
        description="Workload · Production"
      >
        <template #actions>
          <Button
            label="Agent"
            variant="outline"
            size="medium"
            icon="az az-ask-azion"
            :aria-expanded="open ? 'true' : 'false'"
            @click="emit('open')"
          />
        </template>
      </PageHeader>
      <Card>
        <template #default>
          <div class="p-(--spacing-md)">
            <KeyValueList
              :columns="3"
              aria-label="Workload details"
            >
              <KeyValueList.Item label="Status">
                <StatusIndicator
                  severity="danger"
                  label="Errors above 30%"
                />
              </KeyValueList.Item>
              <KeyValueList.Item label="Domains"
                >www.example.com, shop.example.com</KeyValueList.Item
              >
              <KeyValueList.Item label="Origin">api.example.com</KeyValueList.Item>
              <KeyValueList.Item label="Cache hit ratio">91%</KeyValueList.Item>
              <KeyValueList.Item label="Last deployment">Today, 13:58</KeyValueList.Item>
              <KeyValueList.Item label="Region">US East (Washington)</KeyValueList.Item>
            </KeyValueList>
          </div>
        </template>
      </Card>
    </div>
  </div>
</template>
```

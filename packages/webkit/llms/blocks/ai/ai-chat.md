# AiChat (`ai/ai-chat`)

> The full-page generative AI assistant in the chat-app look: a conversation history (`ConversationHistory` with New chat and search) in a side panel on desktop and a start `Drawer` behind a round menu button on a phone; no header bar, only round floating buttons on a phone and a quiet row on desktop; before the first message an `EmptyState` over vertical support prompts from `SuggestionGroup`, inside the log; then a `Conversation` in a centered reading column where the reader's prompts sit in bubbles at the inline end and each response is plain text in a `ChatMessage` that goes pending (loading text), thinking (`Reasoning`), streaming (`StreamingResponse` with site-name citation chips) and complete (Copy, Good and Bad response, Read aloud, Share, Try again and More, with the `Sources` pill on the same line; a `FeedbackReasonDialog` after Bad response and a `ResponseBranches` pager over regenerated answers and edited prompts, which carry Copy and Edit), followed by follow-up questions; a `PromptInput` pill floating at the foot of the column with the Attach "+" at the start, Dictate before the round button at the end (Start voice conversation while empty, Send once there is text, Stop while a response is generated), a 4,000-character limit whose counter appears near it, and the disclaimer under it. The primary state is the empty assistant; sending a support prompt runs the whole response cycle. Built from `ChatMessage`, `Conversation`, `ConversationHistory`, `Drawer`, `PromptInput`, `StreamingResponse`, `Reasoning`, `Sources`, `SuggestionGroup`, `EmptyState`, `Tag`, `Button`, `IconButton`, `ResponseBranches` and `FeedbackReasonDialog`. Takes the messages of TanStack AI's `useChat` as they are. A page body for ConsoleLayout that fills its content region.

- Surface: app
- Source: `blocks/ai/ai-chat/ai-chat.vue` in `@aziontech/webkit`
- MCP: `get_block("ai/ai-chat")`
- Components: [AgentActivity](../../components/agent-activity.md), [AgentQuestion](../../components/agent-question.md), [Alert](../../components/alert.md), [ArtifactCanvas](../../components/artifact-canvas.md), [ArtifactPreview](../../components/artifact-preview.md), `branches`, `placeholderClip`, `usageChart`, [AudioPlayer](../../components/audio-player.md), [Button](../../components/button.md), [ChatMessage](../../components/chat-message.md), [ChatMessage](../../components/chat-message.md), [CodeBlock](../../components/code-block.md), [Conversation](../../components/conversation.md), [ConversationHistory](../../components/conversation-history.md), `DrawerBody`, `DrawerContent`, `DrawerHeader`, [Drawer](../../components/drawer.md), `DrawerTitle`, [EmptyState](../../components/empty-state.md), [FeedbackReasonDialog](../../components/feedback-reason-dialog.md), [FilePreview](../../components/file-preview.md), [IconButton](../../components/icon-button.md), [ImageGallery](../../components/image-gallery.md), [McpAppFrame](../../components/mcp-app-frame.md), `PromptInputAttachButton`, `PromptInputDictateButton`, [PromptInput](../../components/prompt-input.md), [PromptQueue](../../components/prompt-queue.md), [Reasoning](../../components/reasoning.md), [Resizable](../../components/resizable.md), [ResponseBranches](../../components/response-branches.md), [Skeleton](../../components/skeleton.md), [Sources](../../components/sources.md), [StatusIndicator](../../components/status-indicator.md), [StreamingResponse](../../components/streaming-response.md), [SubagentCard](../../components/subagent-card.md), [SuggestionGroup](../../components/suggestion-group.md), [Tag](../../components/tag.md), [Toast](../../components/toast.md), [ToolApproval](../../components/tool-approval.md), [ToolCall](../../components/tool-call.md), `use-ai-chat-versions`, `use-locale`, `utils/ai-chat`, `utils/ai-chat-questions`, [VideoPlayer](../../components/video-player.md)
- Skills: `webkit-ai-surfaces`, `webkit-ui-states`, `webkit-microcopy`

## Asked as

ai chat; ai assistant; chatbot; copilot; chat with ai; generative ai chat; assistant page; ask ai; llm chat; conversational ui; prompt and response; streaming response; chat de ia; assistente de ia; assistente virtual; conversa com ia; chat con ia; asistente de ia; artifact; artifact canvas; generated file; code canvas; canvas de artefato; artefato gerado; full page chat; tanstack ai; usechat; agent activity; subagent; agent question

A full page where a person talks with the generative AI assistant about their account: they ask in their own words, watch the response arrive, check where it came from, and keep going with a follow-up or a new question. The page is the conversation: one reading column the thread scrolls in, with the header controls and the composer floating over it. Beside it, the conversation history. Use it as the assistant's home; on a resource page, open the same conversation in a drawer with `ai/ai-chat-drawer`. It is a page body for `ConsoleLayout`: it fills the layout's content region (`grow basis-0 min-h-0`, never `h-dvh`), so only the log scrolls, and the layout owns the rail, the header and the `main`.

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

### A. Header — `IconButton`, `Tag`, `Button`

No bar and no border: the thread scrolls under it. On a phone it is two round floating `IconButton`s over the thread, blurred over a translucent raised surface: Open conversation history at the inline start and New chat at the inline end; the page heading stays for assistive tech only. From the md breakpoint it is a quiet row over a fade of the canvas: a Show or Hide conversation history toggle (`aria-expanded`), the assistant's name in a small label, a Preview `Tag` while the feature is in preview, and a transparent New chat `Button` at the inline end. New chat is disabled while the thread is empty and clears it without confirmation; the previous thread stays in the history.

### A2. History — `ConversationHistory`, `Drawer`

The reader's earlier conversations, grouped by date, with a New chat row and a search field (`creatable`, `searchable`). From the md breakpoint a side panel at the inline start, open by default and folded away by the header toggle; on a phone a start-side `Drawer` the round menu button opens, closed by picking a conversation or New chat. The open conversation is `v-model:activeKey`; the list comes from `sample.ts` until the app gives its own.

### B. Empty state — `EmptyState`, `SuggestionGroup`

Before the first message, inside the log so the composer stays mounted and keeps focus when the thread starts: an `EmptyState` with the assistant mark, one question as the title and one sentence on what the assistant can read, over a vertical `SuggestionGroup` of up to five support prompts with icons. Selecting a prompt sends it as the first message.

### C. Message log — `Conversation`

Fills the page and is the only part that scrolls, in a centered reading column; the header controls and the composer float over it. It follows the newest message while the reader is at the end, stops when they scroll up, and offers Scroll to the latest message. It announces each finished response once; streaming text is never read token by token.

### D. Prompt — `ChatMessage`, `ImageGallery`, `FilePreview`

The reader's prompt at the inline end in a filled bubble with the stacked composer's radius, no avatar, no visible name or time (both stay in its accessible name; the time is its tooltip). Under it, Copy and Edit show on hover or focus (always on a touch screen). Edit turns the bubble into a field with Cancel and Send; Send emits `edit`, and once the app has sent the new prompt the bubble carries a `ResponseBranches` pager (`‹ 2/2 ›`) to page back to the earlier prompt and its answers. The files they attached draw under the text the way media draws in a response (section L): images in an `ImageGallery`, a document in a `FilePreview`, audio and video in their players.

### E. Response — `ChatMessage`, `Reasoning`, `StreamingResponse`

The assistant's response as plain text across the reading column, in the larger reading size, with no avatar, bubble or visible name. It shows the loading text while pending, a collapsed `Reasoning` that reads Thinking and then Thought for N seconds, and the Markdown answer in `StreamingResponse` with a caret while it streams. Each citation is a small chip with the source's site name that links to it. On failure the partial text stays with the error line and Try again.

### F. Sources — `Sources`

At the end of the action row of a complete response that used documents: a pill with up to three overlapping site marks, named by the count, that opens the list under the row; a citation opens it too. Item n is citation [n].

### G. Response actions — `ChatMessage`, `ResponseBranches`, `FeedbackReasonDialog`

`ChatMessage.Actions` under a complete response, always visible and always one line, with its built-in actions in ChatGPT's order: Copy, Good response, Bad response, Read aloud (hidden where the browser has no speech synthesis), Share, Try again (disabled while another response is generating), More (Branch in new chat), then the Sources pill in `#trailing`. When the row is narrower than 480px (a phone, the drawer) it keeps Copy, Read aloud, Share and More, and More also holds Good response, Bad response and Try again. A rating fills its thumb and hides the other; pressing it again clears it. Good response raises the toast Thanks for your feedback; Bad response opens `FeedbackReasonDialog`, and sending it emits `feedback` again with the reason, then the toast. After Try again the row starts with a `ResponseBranches` pager (`‹ 2/2 ›`) over the versions of that response. Icons draw at 16px inside a 40px target.

### H. Follow-up questions — `SuggestionGroup`

After the last complete response, two or three questions that narrow it, as wrapping pills aligned with the response text. They disappear as soon as the reader sends anything else.

### I. Composer — `PromptInput`, `PromptInputAttachButton`, `PromptInputDictateButton`

The `#composer` of `Conversation`: one floating pill at the foot of the reading column, over a fade of the canvas the thread scrolls under, with the connection status, an alert and the queue above it. It stacks into a rounded rectangle when the text runs to more lines or files are attached. Enter submits, Shift+Enter adds a line, a 4,000-character limit shows its counter once the prompt passes 3,200 characters, and Submit becomes Stop while a response is pending or streaming. While the composer is empty the round button at the end is Start voice conversation (`voice`, on by default), which emits `voice-start` for the app to open its audio session. The disclaimer is its hint. The Attach "+" at the start (`attachable`, on by default: a `PromptInputAttachButton`, and drop and paste) attaches up to `maxFiles` files of `accept` (images and PDF by default) under `maxFileSize` (10 MB); `send` then hands over TanStack AI's multimodal content, the text and one `image`, `audio`, `video` or `document` part per file with its base64 bytes, ready for `sendMessage`. Dictate (a `PromptInputDictateButton`, the microphone before Send) writes speech into the prompt with the browser's speech recognition and hides itself where the browser has none; an app that runs its own transcriber swaps in `PromptInputDictateButton` with `transcriber="app"` and writes the text itself. The composer is disabled while the conversation is restored.

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
| `attachable`        | `boolean`                                 | The Attach "+" at the start of the composer; `send` then hands over multimodal content. Default `true`.                                                                                                                       |
| `voice`             | `boolean`                                 | An empty composer shows Start voice conversation in place of Send; it emits `voice-start`. Default `true`.                                                                                                                    |
| `accept`            | `string`                                  | The files the reader may attach; default `image/*,application/pdf`.                                                                                                                                                           |
| `maxFiles`          | `number`                                  | Most files on one message; default 4.                                                                                                                                                                                         |
| `maxFileSize`       | `number`                                  | Largest file in bytes; default 10 MB.                                                                                                                                                                                         |
| `resolveAppUrl`     | `(resource) => string \| Promise<string>` | Gives a widget that has no inline HTML a trusted `https` address; left out, only inline widgets show.                                                                                                                         |

The open conversation of the history is `v-model:activeKey` (`string | null`): picking a row sets it, New chat clears it; load that conversation's messages when it changes.

| Event              | Payload                     | When                                                                                                                                                                |
| ------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `send`             | `(event, content)`          | The composer, a starter prompt or a follow-up: call `sendMessage(content)`. `content` is the text, or with attachments `{ content: parts }`.                        |
| `stop`             | `(event)`                   | Stop while the response streams: call `stop()`. The block marks the stopped response.                                                                               |
| `voice-start`      | `(event)`                   | Start voice conversation on an empty composer: open the app's audio session (set `voice` to `false` when there is none).                                            |
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
    @edit="(_event, message, text) => edit(message, text)"
    @version-change="(next) => setMessages(next)"
    @new-chat="clear()"
  />
</template>
```

A tool that needs approval is declared once with `toolDefinition({ name, inputSchema, needsApproval: true })`, run on the server with `.server(...)` and passed to `useChat({ tools: [definition] })` too, so the client can match the approval request to the call. Then delete `sample.ts` and its import. `apps/demos` runs this block on `useChat` with TanStack AI's `fakeText` model (`src/lib/assistant-model.ts`), no server and no key.

## Do

- Show the loading text only after a second; a response that arrives faster streams directly.
- Keep actions visible on every complete response, not on hover.
- Cite sources inline with site-name chips and open the list from the Sources pill.
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
- **Feedback:** Good response, Bad response (built in); the toast says Thanks for your feedback.
- Follow `skills/webkit-microcopy`: sentence case, "select" not "click", "response" not "answer", no "please".
- **Connection:** `Reconnecting`; `Connection lost` with "Your messages send when the connection returns."
- **Elsewhere and failed answers:** `Responding in another tab`; `Your answer was not sent` with the reason and Retry; `The structured answer failed`.

## Accessibility

- The log is a named `role="log"` whose own live behavior is off; a polite live region reads each finished response once, with its author.
- Each message is an `article` named by author and time; the author and time are visually hidden, never removed.
- Responses are `aria-busy` while loading or streaming; the caret is hidden.
- The composer is named Prompt, described by its counter and disclaimer; Enter submits and an IME composition never does.
- Feedback thumbs are toggle buttons with `aria-pressed`, and the rating is confirmed by a visually hidden status message and the toast; the row shows no text.
- A prompt's Copy and Edit are transparent until hover or focus, never removed from the tab order; the editor's field is named Edit your message, `Escape` cancels and `Ctrl`/`Cmd` + `Enter` sends.
- Keyboard order: history panel, header, log (focusable to scroll), each message's links and actions, follow-ups, composer.
- The phone history is a `Drawer` named Conversation history that returns focus to the menu button; the desktop toggle names what it does and carries `aria-expanded`.
- Alignment never carries meaning alone: every message's accessible name says who wrote it.
- Reconnecting is a polite status and Connection lost an alert; the queued messages are a list named Queued messages, each with Remove from queue; a question card is a group named by its question; the placeholders while restoring are a status named Loading the conversation.

## States

- Empty: `messages` left out or `[]`, with the empty state and four support prompts; selecting one emits `send`.
- Streaming: `loading` with the last assistant message part-way written: its caret, the busy region and Stop in the composer.
- Error: `error` set: the last response keeps its partial text, with the error line and Try again; with no response yet, a pending response shows the error.
- Tools: a `tool-call` part draws as a `ToolCall` titled from `tools`, its input and output in code; one with `approval` draws the `ToolApproval` card first (see `ai/ai-action-approval`).
- Artifact: two turns that wrote top-orders.sql in two versions, the canvas open beside them on version 2; a follow-up fills the composer.
- LongThread: six earlier turns as `messages` that overflow the log, opened on the newest response with its Sources pill, with `followUps`.
- Media: an answer with two charts in an `ImageGallery`, a CSV report in a `FilePreview` and an audio summary.
- Agent: activity steps, a finished `SubagentCard` and a pending `AgentQuestion`; answering it resolves the interrupt and the card keeps the answer.
- Restoring: `hydrating` with no messages yet shows `Skeleton` bubbles and lines and a disabled composer.
- History: the side panel on desktop, the start drawer on a phone, with New chat and search.
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
- `LongThread` — Six earlier turns about one workload that overflow the log: it opens on the newest response and its Sources pill, stops following when the reader scrolls up, and the round Scroll to the latest message button above the composer brings them back; follow-up questions close the thread.
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
  import type { FeedbackReasonDialogPayload } from '@aziontech/webkit/feedback-reason-dialog'
  import {
    type McpAppFrameMessage,
    type McpAppFrameResource
  } from '@aziontech/webkit/mcp-app-frame'
  import type { PromptInputFile, PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptQueue from '@aziontech/webkit/prompt-queue'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import { useAiChatVersions } from '@aziontech/webkit/use-ai-chat-versions'
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
  import { computed, ref, watch } from 'vue'

  import AiChatComposer from './parts/ai-chat-composer.vue'
  import AiChatConnectionStatus from './parts/ai-chat-connection-status.vue'
  import AiChatHeader from './parts/ai-chat-header.vue'
  import AiChatHistory from './parts/ai-chat-history.vue'
  import AiChatStart from './parts/ai-chat-start.vue'
  import AiChatTurn from './parts/ai-chat-turn.vue'
  import { sampleSuggestions } from './sample'

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
    /** The reader may attach files from the Attach control at the start of the composer; `send` then hands over the multimodal content `sendMessage` takes. */
    attachable?: boolean
    /** An empty composer shows the round Start voice conversation control in place of Send; it emits `voice-start` and the app owns the audio session. */
    voice?: boolean
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
    attachable: true,
    voice: true,
    accept: 'image/*,application/pdf',
    maxFiles: 4,
    maxFileSize: 10485760,
    resolveAppUrl: undefined
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, content: AiChatSendContent]
    stop: [event: MouseEvent]
    'voice-start': [event: MouseEvent]
    retry: [event: MouseEvent | KeyboardEvent, message: AiChatMessage]
    share: [event: MouseEvent, message: AiChatMessage]
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

  const activeKey = defineModel<string | null>('activeKey', { default: null })

  const { formatDate } = useLocale()
  const versions = useAiChatVersions(() => props.messages)

  const prompt = ref('')
  const files = ref<PromptInputFile[]>([])
  const composerEl = ref<InstanceType<typeof AiChatComposer> | null>(null)
  const stoppedIds = ref<Set<string>>(new Set())
  const edits = ref<Record<string, string>>({})
  const answers = ref<Record<string, string>>({})
  const askedAfter = ref<Record<string, string>>({})
  const settled = ref<Record<string, AiChatQuestion>>({})
  const routed = ref<Record<string, boolean>>({})
  const toolAnswers = ref<Record<string, AiChatQuestion>>({})
  const historyPanel = ref(true)
  const historyDrawer = ref(false)

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
    versions.clear()
    activeKey.value = null
    emit('new-chat', event)
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
    class="flex min-h-0 w-full grow basis-0"
  >
    <AiChatHistory
      v-model="activeKey"
      v-model:drawer-open="historyDrawer"
      :panel-open="historyPanel"
      @create="newChat"
    />
    <div class="relative flex min-h-0 min-w-0 flex-1 flex-col">
      <AiChatHeader
        :empty="!turns.length"
        :history-open="historyPanel"
        @new-chat="newChat"
        @open-history="historyDrawer = true"
        @toggle-history="historyPanel = !historyPanel"
      />
      <Conversation
        aria-label="Conversation with the AI assistant"
        :more-messages="moreMessages"
        :loading-more="loadingMore"
        @load-more="emit('load-more', $event)"
      >
        <div
          aria-hidden="true"
          class="h-(--spacing-lg) shrink-0"
        />
        <AiChatStart
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
          :questions="questions[turn.id]"
          :ask-of="askOf"
          :edit-of="editOf"
          :resolve-app-url="resolveAppUrl"
          :versions="versions"
          @retry="emit('retry', $event, turn)"
          @rate="(value, reason) => emit('feedback', value, turn, reason)"
          @share="(event) => emit('share', event, turn)"
          @branch="(event) => emit('branch', event, turn)"
          @edit-prompt="(event, text) => emit('edit', event, turn, text)"
          @version-change="(next) => emit('version-change', next)"
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
          <AiChatComposer
            ref="composerEl"
            v-model="prompt"
            v-model:files="files"
            :state="state"
            :queueable="queueable"
            :hydrating="hydrating"
            :accept="accept"
            :max-files="maxFiles"
            :max-file-size="maxFileSize"
            :attachable="attachable"
            :voice="voice"
            @submit="send"
            @stop="stop"
            @voice-start="emit('voice-start', $event)"
          />
        </template>
      </Conversation>
    </div>
  </section>
</template>
```

## `sample.ts`

````ts
import type { ConversationHistoryItem } from '@aziontech/webkit/conversation-history'
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

export const sampleHistoryNow = '2026-11-19T12:00:00'

export const sampleHistory: ConversationHistoryItem[] = [
  { id: 'h1', title: 'Why does storefront return 502 errors?', updatedAt: '2026-11-19T11:02:00' },
  { id: 'h2', title: 'Purge the cache after a deploy', updatedAt: '2026-11-19T09:40:00' },
  { id: 'h3', title: 'A WAF rule for login attempts', updatedAt: '2026-11-18T17:15:00' },
  { id: 'h4', title: 'Top orders query for acme-store', updatedAt: '2026-11-16T10:20:00' },
  { id: 'h5', title: 'Move DNS records to Azion', updatedAt: '2026-11-04T14:05:00' },
  { id: 'h6', title: 'Image optimization for docs-site', updatedAt: '2026-09-28T08:30:00' }
]
````

## `parts/ai-chat-composer.vue`

```ts
<script setup lang="ts">
  import type { PromptInputFile, PromptInputStatus } from '@aziontech/webkit/prompt-input'
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
    voice: boolean
  }>()

  const emit = defineEmits<{
    submit: [event: MouseEvent | KeyboardEvent, value: string]
    stop: [event: MouseEvent]
    'voice-start': [event: MouseEvent]
  }>()

  const prompt = defineModel<string>({ required: true })
  const files = defineModel<PromptInputFile[]>('files', { required: true })

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
    :max-length="4000"
    :voice="voice"
    @submit="(event, { value }) => emit('submit', event, value)"
    @stop="emit('stop', $event)"
    @voice-start="emit('voice-start', $event)"
  >
    <template
      v-if="attachable"
      #actions
    >
      <PromptInputAttachButton />
    </template>
    <template #end>
      <PromptInputDictateButton />
    </template>
    <template #hint>
      The AI assistant can make mistakes. Check important information before you act on it.
    </template>
  </PromptInput>
</template>
```

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
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'

  defineProps<{ empty: boolean; historyOpen: boolean }>()

  const emit = defineEmits<{
    'new-chat': [event: MouseEvent]
    'open-history': [event: MouseEvent]
    'toggle-history': [event: MouseEvent]
  }>()

  const HEADER_CLASS =
    'pointer-events-none absolute inset-x-0 top-0 z-2 flex items-center justify-between gap-(--spacing-sm) p-(--spacing-sm) ' +
    'md:bg-[linear-gradient(to_bottom,var(--bg-canvas)_55%,transparent)] md:px-(--spacing-md)'

  const FLOATING_CLASS =
    'pointer-events-auto inline-flex overflow-hidden rounded-(--shape-button) border border-(--border-default) ' +
    'bg-[color-mix(in_srgb,var(--bg-surface-raised)_80%,transparent)] shadow-(--shadow-md) backdrop-blur-md md:hidden'
</script>

<template>
  <header :class="HEADER_CLASS">
    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
      <span :class="FLOATING_CLASS">
        <IconButton
          icon="az az-menu"
          aria-label="Open conversation history"
          variant="ghost"
          @click="emit('open-history', $event)"
        />
      </span>
      <span class="pointer-events-auto inline-flex max-md:hidden">
        <IconButton
          icon="az az-history"
          :aria-label="historyOpen ? 'Hide conversation history' : 'Show conversation history'"
          :aria-expanded="historyOpen"
          aria-controls="ai-chat-history"
          variant="ghost"
          size="medium"
          @click="emit('toggle-history', $event)"
        />
      </span>
      <h1
        id="ai-chat-title"
        class="sr-only text-label-md text-(--text-default) md:not-sr-only"
      >
        AI assistant
      </h1>
      <span class="inline-flex max-md:hidden">
        <Tag
          label="Preview"
          severity="info"
          size="small"
        />
      </span>
    </div>
    <span :class="FLOATING_CLASS">
      <IconButton
        icon="az az-square-pen"
        aria-label="New chat"
        variant="ghost"
        :disabled="empty"
        @click="emit('new-chat', $event)"
      />
    </span>
    <span class="pointer-events-auto inline-flex max-md:hidden">
      <Button
        label="New chat"
        variant="ghost"
        size="small"
        icon="az az-square-pen"
        :disabled="empty"
        @click="emit('new-chat', $event)"
      />
    </span>
  </header>
</template>
```

## `parts/ai-chat-history.vue`

```ts
<script setup lang="ts">
  import ConversationHistory from '@aziontech/webkit/conversation-history'
  import DrawerBody from '@aziontech/webkit/drawer-body'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerHeader from '@aziontech/webkit/drawer-header'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import { watch } from 'vue'

  import { sampleHistory, sampleHistoryNow } from '../sample'

  defineProps<{ panelOpen: boolean }>()

  const emit = defineEmits<{ create: [event: MouseEvent] }>()

  const active = defineModel<string | null>({ required: true })
  const drawerOpen = defineModel<boolean>('drawerOpen', { required: true })

  watch(active, () => {
    drawerOpen.value = false
  })

  function create(event: MouseEvent) {
    drawerOpen.value = false
    emit('create', event)
  }
</script>

<template>
  <aside
    v-if="panelOpen"
    id="ai-chat-history"
    aria-label="Conversation history"
    class="flex w-(--container-3xs) shrink-0 flex-col overflow-y-auto bg-(--bg-surface) p-(--spacing-xs) max-md:hidden"
  >
    <ConversationHistory
      v-model="active"
      :items="sampleHistory"
      :now="sampleHistoryNow"
      creatable
      searchable
      @create="create"
    />
  </aside>
  <Drawer
    v-model:open="drawerOpen"
    side="start"
    size="small"
  >
    <DrawerContent>
      <DrawerHeader class="w-full">
        <DrawerTitle>Conversation history</DrawerTitle>
      </DrawerHeader>
      <DrawerBody>
        <ConversationHistory
          v-model="active"
          :items="sampleHistory"
          :now="sampleHistoryNow"
          creatable
          searchable
          @create="create"
        />
      </DrawerBody>
    </DrawerContent>
  </Drawer>
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
    class="flex flex-col gap-(--spacing-xl)"
  >
    <template
      v-for="row in 2"
      :key="row"
    >
      <Skeleton
        width="45%"
        height="2.75rem"
        class="self-end"
      />
      <div class="flex flex-col gap-(--spacing-xs)">
        <Skeleton width="90%" />
        <Skeleton width="80%" />
        <Skeleton :width="row === 2 ? '40%' : '60%'" />
      </div>
    </template>
  </div>
  <div
    v-else
    class="my-auto flex flex-col gap-(--spacing-lg) py-(--spacing-md)"
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

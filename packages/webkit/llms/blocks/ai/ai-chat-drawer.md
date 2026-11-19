# AiChatDrawer (`ai/ai-chat-drawer`)

> The generative AI assistant in a right-side drawer over a resource page, so the reader asks about what they are looking at without leaving it: a workload page (`PageHeader` with an Agent `Button`, the name the console header gives the assistant, a `Card` of `KeyValueList` with a `StatusIndicator`) beside a medium `Drawer` with `:modal="false"` (no overlay), so the page stays undimmed and readable whose `PanelHeader` holds `DrawerTitle`, a Preview `Tag`, New chat and the drawer's own close button. Inside, an `EmptyState` with support prompts about this workload (`SuggestionGroup`), then a `Conversation` with every message at the inline start, responses that think (`Reasoning`), stream (`StreamingResponse`), cite (`Sources`) and carry Copy, Regenerate and feedback, and a `PromptInput` pinned at the foot with the disclaimer. Built from `Drawer`, `DrawerContent`, `DrawerTitle`, `PanelHeader`, `ChatMessage`, `Conversation`, `PromptInput`, `IconButton` and `CopyButton`. Takes the messages of TanStack AI's `useChat` as they are. A page body for ConsoleLayout, rendered in its default slot; inside ConsoleLayout on a wide screen the same conversation can go in the layout's tools region (`v-model:tools-open`) instead.

- Surface: app
- Source: `blocks/ai/ai-chat-drawer/ai-chat-drawer.vue` in `@aziontech/webkit`
- MCP: `get_block("ai/ai-chat-drawer")`
- Components: [AgentActivity](../../components/agent-activity.md), [AgentQuestion](../../components/agent-question.md), [Alert](../../components/alert.md), [AudioPlayer](../../components/audio-player.md), [Button](../../components/button.md), [Card](../../components/card.md), [ChatMessage](../../components/chat-message.md), [CodeBlock](../../components/code-block.md), [Conversation](../../components/conversation.md), [CopyButton](../../components/copy-button.md), `DrawerContent`, [Drawer](../../components/drawer.md), `DrawerTitle`, [EmptyState](../../components/empty-state.md), [FilePreview](../../components/file-preview.md), [IconButton](../../components/icon-button.md), [ImageGallery](../../components/image-gallery.md), [KeyValueList](../../components/key-value-list.md), [PageHeader](../../components/page-header.md), `PanelHeader`, [PromptInput](../../components/prompt-input.md), [PromptQueue](../../components/prompt-queue.md), [Reasoning](../../components/reasoning.md), [Sources](../../components/sources.md), [StatusIndicator](../../components/status-indicator.md), [StreamingResponse](../../components/streaming-response.md), [SubagentCard](../../components/subagent-card.md), [SuggestionGroup](../../components/suggestion-group.md), [Tag](../../components/tag.md), [ToolApproval](../../components/tool-approval.md), [ToolCall](../../components/tool-call.md), `use-locale`, [VideoPlayer](../../components/video-player.md)
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

## Variants

- `Empty` — primary (the code below)
- `Streaming` — The drawer open on a response streaming in about the 502 errors of the workload behind it, with the caret, Stop in the composer and the busy region.
- `Error` — A response that failed mid-stream inside the drawer: the partial text, the error line and Try again.
- `LongThread` — Six earlier turns about the workload in the narrow drawer: the log opens on the newest response and Scroll to the latest message returns after scrolling up.

Each variant is the same screen in another state: `get_block("ai/ai-chat-drawer", { variant })`, or the file under `blocks/ai/ai-chat-drawer/variants/`.

## Code (`Empty`)

```vue
<script setup lang="ts">
  import AgentActivity from '@aziontech/webkit/agent-activity'
  import AgentQuestion from '@aziontech/webkit/agent-question'
  import Alert from '@aziontech/webkit/alert'
  import AudioPlayer from '@aziontech/webkit/audio-player'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ChatMessage, {
    type ChatMessageFeedbackValue,
    type ChatMessageStatus
  } from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import FilePreview from '@aziontech/webkit/file-preview'
  import IconButton from '@aziontech/webkit/icon-button'
  import ImageGallery from '@aziontech/webkit/image-gallery'
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import type { PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import PromptQueue from '@aziontech/webkit/prompt-queue'
  import Reasoning from '@aziontech/webkit/reasoning'
  import Sources from '@aziontech/webkit/sources'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SubagentCard from '@aziontech/webkit/subagent-card'
  import SuggestionGroup, { type SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'
  import Tag from '@aziontech/webkit/tag'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import ToolCall from '@aziontech/webkit/tool-call'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import VideoPlayer from '@aziontech/webkit/video-player'
  import { computed, ref, watch } from 'vue'

  import {
    activitiesBefore,
    type AiChatDrawerConnection,
    type AiChatDrawerInterrupt,
    type AiChatDrawerMessage,
    type AiChatDrawerQuestion,
    type AiChatDrawerQueuedMessage,
    type AiChatDrawerTool,
    type AiChatDrawerToolCallPart,
    answerInterrupt,
    approvalOf,
    documentNameOf,
    hasText,
    isQuestion,
    json,
    needsApproval,
    parsesAsJson,
    questionOf,
    queueItemOf,
    resolveInterrupt,
    segmentsOf,
    skipInterrupt,
    stopSubagent,
    subagentStatusOf,
    subagentTextOf,
    textOf,
    toolStatusOf
  } from './messages'
  import { sampleSuggestions } from './sample'

  export type {
    AiChatDrawerActivityPart,
    AiChatDrawerAudioPart,
    AiChatDrawerConnection,
    AiChatDrawerDocumentPart,
    AiChatDrawerImagePart,
    AiChatDrawerInterrupt,
    AiChatDrawerMediaSource,
    AiChatDrawerMessage,
    AiChatDrawerMessageMetadata,
    AiChatDrawerOtherPart,
    AiChatDrawerPart,
    AiChatDrawerQueuedMessage,
    AiChatDrawerRole,
    AiChatDrawerSubagentPart,
    AiChatDrawerSubagentStatus,
    AiChatDrawerTextPart,
    AiChatDrawerThinkingPart,
    AiChatDrawerTool,
    AiChatDrawerToolCallPart,
    AiChatDrawerToolCallState,
    AiChatDrawerToolResultPart,
    AiChatDrawerVideoPart
  } from './messages'

  /** A rating the reader gave a response. */
  export interface AiChatDrawerFeedback {
    /** The rated response. */
    message: AiChatDrawerMessage
    /** Helpful, not helpful, or cleared. */
    value: ChatMessageFeedbackValue | null
  }

  export interface AiChatDrawerProps {
    /** The conversation, oldest first, as TanStack AI's `useChat` returns `messages`. Empty, the empty state renders. */
    messages?: ReadonlyArray<AiChatDrawerMessage>
    /** Starter prompts under the empty state. Left out, the sample prompts render. */
    suggestions?: SuggestionGroupItem[]
    /** Follow-up questions shown under the last finished response. */
    followUps?: SuggestionGroupItem[]
    /** The assistant is responding, as `useChat` returns `isLoading`. */
    loading?: boolean
    /** Why the last response failed: a sentence, or the `error` of `useChat`, which shows the standard sentence. */
    error?: string | { message: string } | null
    /** How each tool reads, by tool name; a tool left out shows its name. */
    tools?: Record<string, AiChatDrawerTool>
    /** Pending requests, as `useChat` returns `interrupts`; Approve and Deny resolve the matching approval, and a generic one asks its question. */
    interrupts?: ReadonlyArray<AiChatDrawerInterrupt>
    /** Messages waiting to be sent, as `useChat` returns `queue`; given, the composer sends while a response runs. */
    queue?: ReadonlyArray<AiChatDrawerQueuedMessage>
    /** Older messages exist, as `useChat` returns `hasOlderMessages`. */
    moreMessages?: boolean
    /** The older messages are loading. */
    loadingMore?: boolean
    /** The connection to the chat, as `useChat` returns `connectionStatus`. */
    connection?: AiChatDrawerConnection
    /** The chat is rejoining a run after a reload, as `useChat` returns `resuming`. */
    resuming?: boolean
  }

  const props = withDefaults(defineProps<AiChatDrawerProps>(), {
    messages: () => [],
    suggestions: undefined,
    followUps: undefined,
    loading: false,
    error: '',
    tools: () => ({}),
    interrupts: () => [],
    queue: undefined,
    moreMessages: false,
    loadingMore: false,
    connection: 'connected',
    resuming: false
  })

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, text: string]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent, message: AiChatDrawerMessage]
    'new-chat': [event: MouseEvent]
    feedback: [feedback: AiChatDrawerFeedback]
    approve: [event: MouseEvent, call: AiChatDrawerToolCallPart, input?: unknown]
    deny: [event: MouseEvent, call: AiChatDrawerToolCallPart]
    'remove-queued': [event: MouseEvent, item: AiChatDrawerQueuedMessage]
    'load-more': [event: Event]
  }>()

  /** Whether the assistant drawer is open; Agent opens it and its close button closes it. */
  const open = defineModel<boolean>('open', { default: true })

  const { formatDate } = useLocale()

  const prompt = ref('')
  const composerEl = ref<InstanceType<typeof PromptInput> | null>(null)
  const ratings = ref<Record<string, ChatMessageFeedbackValue | null>>({})
  const stoppedIds = ref<Set<string>>(new Set())
  const edits = ref<Record<string, string>>({})
  const answers = ref<Record<string, string>>({})
  const askedAfter = ref<Record<string, string>>({})
  const settled = ref<Record<string, AiChatDrawerQuestion>>({})

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

  function statusOf(turn: AiChatDrawerMessage): ChatMessageStatus {
    if (turn.role === 'user' || turn !== last.value) return 'success'
    if (failure.value) return 'error'
    if (props.loading) return hasText(turn) ? 'streaming' : 'pending'
    return 'success'
  }

  const queueable = computed(() => props.queue !== undefined)
  const queued = computed(() => (props.queue ?? []).map(queueItemOf))
  const reconnecting = computed(() => props.connection === 'connecting' || props.resuming)
  const offline = computed(
    () =>
      !reconnecting.value && (props.connection === 'disconnected' || props.connection === 'error')
  )

  const pendingQuestions = computed(() => props.interrupts.filter(isQuestion))
  watch(
    pendingQuestions,
    (now) => {
      for (const interrupt of now) askedAfter.value[interrupt.id!] ??= last.value?.id ?? ''
    },
    { immediate: true }
  )

  const questions = computed(() => {
    const live = pendingQuestions.value.map(questionOf)
    const ids = new Set(live.map((question) => question.id))
    const known = new Set(turns.value.map((turn) => turn.id))
    const groups: Record<string, AiChatDrawerQuestion[]> = {}
    for (const question of [
      ...live,
      ...Object.values(settled.value).filter((question) => !ids.has(question.id))
    ]) {
      const after = askedAfter.value[question.id] ?? ''
      ;(groups[known.has(after) ? after : (last.value?.id ?? '')] ??= []).push(question)
    }
    return groups
  })

  function answer(question: AiChatDrawerQuestion, value: string) {
    const interrupt = pendingQuestions.value.find((item) => item.id === question.id)
    settled.value[question.id] = { ...question, status: 'success', error: '' }
    answerInterrupt(interrupt, value)
  }

  function skip(question: AiChatDrawerQuestion) {
    const interrupt = pendingQuestions.value.find((item) => item.id === question.id)
    settled.value[question.id] = { ...question, status: 'skipped', error: '' }
    skipInterrupt(interrupt)
  }

  function editOf(call: AiChatDrawerToolCallPart): string {
    return edits.value[call.id] ?? json(call.input ?? call.arguments)
  }

  const state = computed<PromptInputStatus>(() => {
    if (!props.loading) return 'ready'
    return last.value?.role === 'assistant' && hasText(last.value) ? 'streaming' : 'pending'
  })

  function stopped(turn: AiChatDrawerMessage): boolean {
    return Boolean(turn.metadata?.stopped) || stoppedIds.value.has(turn.id)
  }

  const lastAnswer = computed(() => {
    const turn = last.value
    return turn?.role === 'assistant' && statusOf(turn) === 'success' && !stopped(turn)
      ? turn
      : null
  })

  function timeOf(turn: AiChatDrawerMessage): string {
    return turn.createdAt ? formatDate(turn.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''
  }

  function toolOf(call: AiChatDrawerToolCallPart): AiChatDrawerTool {
    return props.tools[call.name] ?? { title: '' }
  }

  watch(
    () => props.loading,
    (now, before) => {
      if (before && !now) composerEl.value?.focus()
    }
  )

  function send(event: MouseEvent | KeyboardEvent, text: string) {
    if (!text.trim() || (state.value !== 'ready' && !queueable.value)) return
    prompt.value = ''
    emit('send', event, text)
  }

  function stop(event: MouseEvent) {
    if (props.loading && last.value?.role === 'assistant') stoppedIds.value.add(last.value.id)
    emit('stop', event)
  }

  function newChat(event: MouseEvent) {
    prompt.value = ''
    stoppedIds.value.clear()
    edits.value = {}
    answers.value = {}
    askedAfter.value = {}
    settled.value = {}
    emit('new-chat', event)
  }

  function rate(message: AiChatDrawerMessage, value: ChatMessageFeedbackValue | null) {
    ratings.value[message.id] = value
    emit('feedback', { message, value })
  }

  function removeQueued(event: MouseEvent, id: string) {
    const item = props.queue?.find((entry) => entry.id === id)
    if (item) emit('remove-queued', event, item)
  }

  function approve(event: MouseEvent, call: AiChatDrawerToolCallPart, text: string) {
    const edited =
      toolOf(call).editable && text !== json(call.input ?? call.arguments)
        ? (JSON.parse(text) as unknown)
        : undefined
    emit('approve', event, call, edited)
    resolveInterrupt(props.interrupts, call, true, edited)
  }

  function deny(event: MouseEvent, call: AiChatDrawerToolCallPart) {
    emit('deny', event, call)
    resolveInterrupt(props.interrupts, call, false)
  }
</script>

<template>
  <div class="w-full">
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
              @click="open = true"
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

    <Drawer
      v-model:open="open"
      side="end"
      size="medium"
      :modal="false"
    >
      <DrawerContent>
        <div class="flex min-h-0 flex-1 flex-col">
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
                icon="az az-plus"
                aria-label="New chat"
                variant="ghost"
                size="small"
                :disabled="!turns.length"
                @click="newChat"
              />
            </div>
          </PanelHeader>
          <div class="flex min-h-0 flex-1 flex-col">
            <div
              v-if="!turns.length"
              class="flex flex-1 flex-col justify-center gap-(--spacing-lg) p-(--spacing-md)"
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
                @select="(event, item) => send(event, item.label)"
              />
            </div>
            <Conversation
              v-else
              layout="start"
              aria-label="Conversation with the AI assistant"
              :more-messages="moreMessages"
              :loading-more="loadingMore"
              @load-more="emit('load-more', $event)"
            >
              <template
                v-for="turn in turns"
                :key="turn.id"
              >
                <ChatMessage
                  :from="turn.role === 'user' ? 'user' : 'assistant'"
                  :status="statusOf(turn)"
                  :timestamp="timeOf(turn)"
                  :error-message="statusOf(turn) === 'error' ? failure : undefined"
                  @retry="emit('retry', $event, turn)"
                >
                  <template v-if="turn.role === 'user'">{{ textOf(turn, '\n') }}</template>
                  <template v-else>
                    <template
                      v-for="segment in segmentsOf(turn, activitiesBefore(messages, turn))"
                      :key="segment.key"
                    >
                      <AgentActivity
                        v-if="segment.type === 'activity'"
                        :steps="segment.steps"
                      />
                      <Reasoning
                        v-else-if="segment.type === 'reasoning'"
                        :streaming="statusOf(turn) === 'pending'"
                        :duration="
                          statusOf(turn) === 'pending' ? undefined : turn.metadata?.reasoningSeconds
                        "
                      >
                        <p class="whitespace-pre-line">{{ segment.content }}</p>
                      </Reasoning>
                      <StreamingResponse
                        v-else-if="segment.type === 'text'"
                        :content="segment.content"
                        :streaming="statusOf(turn) === 'streaming'"
                        :sources="turn.metadata?.sources ?? []"
                        :anchor="`answer-${turn.id}`"
                      />
                      <template v-else-if="segment.type === 'tool'">
                        <ToolApproval
                          v-if="needsApproval(segment.call)"
                          :title="
                            toolOf(segment.call).question ||
                            toolOf(segment.call).title ||
                            `Run ${segment.call.name}?`
                          "
                          :description="toolOf(segment.call).description"
                          :approve-label="toolOf(segment.call).approveLabel"
                          :variant="toolOf(segment.call).variant"
                          :confirmation-phrase="toolOf(segment.call).confirmationPhrase"
                          :status="approvalOf(segment.call)"
                          :loading="loading && turn === last"
                          :editable="toolOf(segment.call).editable"
                          :invalid="
                            toolOf(segment.call).editable && !parsesAsJson(editOf(segment.call))
                          "
                          :model-value="editOf(segment.call)"
                          @update:model-value="(text) => (edits[segment.call.id] = text)"
                          @approve="(event, text) => approve(event, segment.call, text)"
                          @deny="deny($event, segment.call)"
                        >
                          <CodeBlock
                            v-if="
                              !toolOf(segment.call).editable &&
                              json(segment.call.input ?? segment.call.arguments)
                            "
                            :code="json(segment.call.input ?? segment.call.arguments)"
                            language="json"
                            :show-line-numbers="false"
                          />
                        </ToolApproval>
                        <ToolCall
                          v-if="
                            !needsApproval(segment.call) || approvalOf(segment.call) === 'approved'
                          "
                          :name="segment.call.name"
                          :title="toolOf(segment.call).title"
                          :status="toolStatusOf(segment.call, segment.result)"
                        >
                          <template
                            v-if="json(segment.call.input ?? segment.call.arguments)"
                            #input
                          >
                            <CodeBlock
                              :code="json(segment.call.input ?? segment.call.arguments)"
                              language="json"
                              :show-line-numbers="false"
                            />
                          </template>
                          <template
                            v-if="
                              json(
                                segment.result?.error ||
                                  segment.call.output ||
                                  segment.result?.content
                              )
                            "
                            #output
                          >
                            <CodeBlock
                              :code="
                                json(
                                  segment.result?.error ||
                                    segment.call.output ||
                                    segment.result?.content
                                )
                              "
                              language="json"
                              :show-line-numbers="false"
                            />
                          </template>
                        </ToolCall>
                      </template>
                      <ImageGallery
                        v-else-if="segment.type === 'gallery'"
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
                        :base64="
                          segment.part.source.type === 'data' ? segment.part.source.value : ''
                        "
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
                    </template>
                    <p
                      v-if="stopped(turn)"
                      class="text-body-sm text-(--text-muted)"
                    >
                      You stopped this response.
                    </p>
                    <Sources
                      v-if="statusOf(turn) === 'success' && !stopped(turn)"
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
                        :disabled="state !== 'ready'"
                        @click="emit('retry', $event, turn)"
                      />
                      <ChatMessage.Feedback
                        :model-value="ratings[turn.id] ?? null"
                        @update:model-value="(value) => rate(turn, value)"
                      />
                    </ChatMessage.Actions>
                  </template>
                </ChatMessage>
                <ChatMessage
                  v-if="questions[turn.id]?.length"
                  from="assistant"
                >
                  <AgentQuestion
                    v-for="question in questions[turn.id]"
                    :key="question.id"
                    v-model="answers[question.id]"
                    :title="question.title"
                    :type="question.options.length ? 'choice' : 'text'"
                    :options="question.options"
                    :status="question.status"
                    :error="question.error"
                    skippable
                    @submit="(_event, value) => answer(question, value)"
                    @skip="skip(question)"
                  />
                </ChatMessage>
              </template>
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
          <div
            class="flex flex-col gap-(--spacing-xs) border-t border-(--border-default) p-(--spacing-sm)"
          >
            <StatusIndicator
              v-if="reconnecting"
              severity="warning"
              label="Reconnecting"
              loading
            />
            <Alert
              v-else-if="offline"
              severity="danger"
              size="small"
              title="Connection lost"
            >
              Your messages send when the connection returns.
            </Alert>
            <PromptQueue
              v-if="queued.length"
              :items="queued"
              @remove="(event, item) => removeQueued(event, item.id)"
            />
            <PromptInput
              ref="composerEl"
              v-model="prompt"
              :status="state"
              :queueable="queueable"
              :max-rows="4"
              placeholder="Ask about storefront"
              @submit="(event, { value }) => send(event, value)"
              @stop="stop"
            >
              <template #hint
                >The AI assistant can make mistakes. Check important information.</template
              >
            </PromptInput>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  </div>
</template>
```

## `messages.ts`

```ts
import type { AgentActivityStatus, AgentActivityStep } from '@aziontech/webkit/agent-activity'
import type { AgentQuestionOption, AgentQuestionStatus } from '@aziontech/webkit/agent-question'
import type { ImageGalleryItem } from '@aziontech/webkit/image-gallery'
import type { PromptQueueItem } from '@aziontech/webkit/prompt-queue'
import type { SourcesItem } from '@aziontech/webkit/sources'
import type { SubagentCardStatus } from '@aziontech/webkit/subagent-card'
import type { ToolApprovalVariant } from '@aziontech/webkit/tool-approval'
import type { ToolCallStatus } from '@aziontech/webkit/tool-call'

/** Who wrote a message; the conversation draws the reader's and the assistant's. */
export type AiChatDrawerRole = 'system' | 'user' | 'assistant' | 'activity'

/** Text of a message: plain for the reader, Markdown for the assistant. */
export interface AiChatDrawerTextPart {
  type: 'text'
  content: string
}

/** How the assistant reached the answer, shown in the collapsible Reasoning. */
export interface AiChatDrawerThinkingPart {
  type: 'thinking'
  content: string
}

/** Where a tool call stands. */
export type AiChatDrawerToolCallState =
  | 'awaiting-input'
  | 'input-streaming'
  | 'input-complete'
  | 'approval-requested'
  | 'approval-responded'
  | 'complete'
  | 'error'

/** A tool the assistant calls; one that needs approval carries `approval`. */
export interface AiChatDrawerToolCallPart {
  type: 'tool-call'
  id: string
  name: string
  arguments: string
  input?: unknown
  state: AiChatDrawerToolCallState
  output?: unknown
  approval?: {
    id: string
    needsApproval: boolean
    approved?: boolean
  }
}

/** What a tool returned, matched to its call by `toolCallId`. */
export interface AiChatDrawerToolResultPart {
  type: 'tool-result'
  toolCallId: string
  content: unknown
  state: 'streaming' | 'complete' | 'error'
  outcome?: 'cancelled' | 'denied'
  error?: string
}

/** Where the bytes of an image, audio, video or document come from: a URL, base64 data, or a provider file the block cannot draw. */
export interface AiChatDrawerMediaSource {
  type: 'url' | 'data' | 'file'
  value: string
  mimeType?: string
}

/** An image the message carries; consecutive images draw as one gallery. */
export interface AiChatDrawerImagePart {
  type: 'image'
  id?: string
  source: AiChatDrawerMediaSource
  metadata?: unknown
}

/** An audio clip the message carries. */
export interface AiChatDrawerAudioPart {
  type: 'audio'
  id?: string
  source: AiChatDrawerMediaSource
  metadata?: unknown
}

/** A video the message carries. */
export interface AiChatDrawerVideoPart {
  type: 'video'
  id?: string
  source: AiChatDrawerMediaSource
  metadata?: unknown
}

/** A document the message carries, such as a PDF; `metadata.name` names it. */
export interface AiChatDrawerDocumentPart {
  type: 'document'
  id?: string
  source: AiChatDrawerMediaSource
  metadata?: unknown
}

/** A step the agent reports; `content.title`, `content.status` and `content.detail` draw it. */
export interface AiChatDrawerActivityPart {
  type: 'activity'
  activityType: string
  content: Record<string, unknown>
}

/** Where a helper agent stands. */
export type AiChatDrawerSubagentStatus = 'running' | 'finished' | 'error' | 'suspended'

/** A helper agent the assistant started, with its own messages. */
export interface AiChatDrawerSubagentPart {
  type: 'subagent'
  subagent: {
    name: string
    description?: string
    status: AiChatDrawerSubagentStatus
    messages: ReadonlyArray<AiChatDrawerMessage>
    input?: unknown
    error?: { message: string }
    stop?: unknown
  }
}

/** A part the conversation does not draw, such as structured output. */
export interface AiChatDrawerOtherPart {
  type: string
}

/** One piece of a message, in the order it arrived. */
export type AiChatDrawerPart =
  | AiChatDrawerTextPart
  | AiChatDrawerThinkingPart
  | AiChatDrawerToolCallPart
  | AiChatDrawerToolResultPart
  | AiChatDrawerImagePart
  | AiChatDrawerAudioPart
  | AiChatDrawerVideoPart
  | AiChatDrawerDocumentPart
  | AiChatDrawerActivityPart
  | AiChatDrawerSubagentPart
  | AiChatDrawerOtherPart

/** What the app adds to a message beside its parts. */
export interface AiChatDrawerMessageMetadata {
  /** The documents the response cites, numbered in order. */
  sources?: SourcesItem[]
  /** How long the assistant thought, in seconds; left out, the block measures it while it streams. */
  reasoningSeconds?: number
  /** The reader stopped this response; the block also marks the response Stop ends. */
  stopped?: boolean
}

/** One message, in the shape TanStack AI's `useChat` returns. */
export interface AiChatDrawerMessage {
  /** Stable key. */
  id: string
  /** Who wrote it; `system` and `activity` messages are not drawn. */
  role: AiChatDrawerRole
  /** The text, reasoning and tool calls, in order. */
  parts: ReadonlyArray<AiChatDrawerPart>
  /** When it was written. */
  createdAt?: Date
  /** Sources, the thinking time and the stopped flag. */
  metadata?: AiChatDrawerMessageMetadata & Record<string, unknown>
}

/** How a tool reads in the conversation and on its approval card. */
export interface AiChatDrawerTool {
  /** What the call does, in plain words. */
  title: string
  /** The question on the approval card, naming the action; left out, the title. */
  question?: string
  /** What changes and what stays, on the approval card. */
  description?: string
  /** The approve button label, the verb of the title. */
  approveLabel?: string
  /** Danger for an irreversible action. */
  variant?: ToolApprovalVariant
  /** The phrase the reader types before an irreversible action enables. */
  confirmationPhrase?: string
  /** The reader may edit the call's arguments, as JSON, before approving. */
  editable?: boolean
}

/** A pending request from the chat, as TanStack AI's `useChat` returns it in `interrupts`. */
export interface AiChatDrawerInterrupt {
  kind: string
  id?: string
  toolCallId?: string
  message?: string
  metadata?: Readonly<Record<string, unknown>>
  payload?: unknown
  status?: string
  errors?: ReadonlyArray<{ message: string }>
  resolveInterrupt?: unknown
  cancel?: unknown
}

/** A message waiting to be sent, as `useChat` returns it in `queue`. */
export interface AiChatDrawerQueuedMessage {
  id: string
  content: unknown
}

/** The state of the connection to the chat, as `useChat` returns `connectionStatus`. */
export type AiChatDrawerConnection = 'disconnected' | 'connecting' | 'connected' | 'error'

/** A question the agent asked through a generic interrupt, as the block draws it. */
export interface AiChatDrawerQuestion {
  id: string
  title: string
  options: AgentQuestionOption[]
  status: AgentQuestionStatus
  error: string
}

/** A rendered piece of an assistant message. */
export type AiChatDrawerSegment =
  | { type: 'activity'; key: string; steps: AgentActivityStep[] }
  | { type: 'reasoning'; key: string; content: string }
  | { type: 'text'; key: string; content: string }
  | {
      type: 'tool'
      key: string
      call: AiChatDrawerToolCallPart
      result?: AiChatDrawerToolResultPart
    }
  | { type: 'gallery'; key: string; images: ImageGalleryItem[] }
  | { type: 'audio'; key: string; src: string }
  | { type: 'video'; key: string; src: string; mimeType: string }
  | { type: 'document'; key: string; part: AiChatDrawerDocumentPart }
  | { type: 'subagent'; key: string; part: AiChatDrawerSubagentPart }

export const isTextPart = (part: AiChatDrawerPart): part is AiChatDrawerTextPart =>
  part.type === 'text'

export const isThinkingPart = (part: AiChatDrawerPart): part is AiChatDrawerThinkingPart =>
  part.type === 'thinking'

export const isToolCallPart = (part: AiChatDrawerPart): part is AiChatDrawerToolCallPart =>
  part.type === 'tool-call'

export const isToolResultPart = (part: AiChatDrawerPart): part is AiChatDrawerToolResultPart =>
  part.type === 'tool-result'

export const isImagePart = (part: AiChatDrawerPart): part is AiChatDrawerImagePart =>
  part.type === 'image'

export const isAudioPart = (part: AiChatDrawerPart): part is AiChatDrawerAudioPart =>
  part.type === 'audio'

export const isVideoPart = (part: AiChatDrawerPart): part is AiChatDrawerVideoPart =>
  part.type === 'video'

export const isDocumentPart = (part: AiChatDrawerPart): part is AiChatDrawerDocumentPart =>
  part.type === 'document'

export const isActivityPart = (part: AiChatDrawerPart): part is AiChatDrawerActivityPart =>
  part.type === 'activity'

export const isSubagentPart = (part: AiChatDrawerPart): part is AiChatDrawerSubagentPart =>
  part.type === 'subagent'

export function mediaUrl(source: AiChatDrawerMediaSource): string {
  if (source.type === 'url') return source.value
  if (source.type !== 'data') return ''
  if (source.value.startsWith('data:')) return source.value
  return `data:${source.mimeType ?? 'application/octet-stream'};base64,${source.value}`
}

function metadataText(metadata: unknown, key: string): string {
  if (!metadata || typeof metadata !== 'object' || !(key in metadata)) return ''
  const value = (metadata as Record<string, unknown>)[key]
  return typeof value === 'string' ? value : ''
}

export function imageOf(part: AiChatDrawerImagePart, index: number): ImageGalleryItem | null {
  const key = part.id ?? `image-${index}`
  const alt = metadataText(part.metadata, 'alt')
  if (part.source.type === 'url') return { key, src: part.source.value, alt }
  if (part.source.type === 'data')
    return { key, data: part.source.value, mimeType: part.source.mimeType, alt }
  return null
}

export function documentNameOf(part: AiChatDrawerDocumentPart): string {
  return metadataText(part.metadata, 'name') || 'Document'
}

const ACTIVITY_STATUS: Record<string, AgentActivityStatus> = {
  pending: 'pending',
  running: 'running',
  success: 'success',
  complete: 'success',
  error: 'error',
  canceled: 'canceled',
  cancelled: 'canceled',
  skipped: 'skipped'
}

export function activityStepOf(part: AiChatDrawerActivityPart, key: string): AgentActivityStep {
  const { title, status, detail } = part.content
  return {
    key,
    title: typeof title === 'string' && title ? title : part.activityType,
    status: (typeof status === 'string' && ACTIVITY_STATUS[status]) || 'running',
    description: typeof detail === 'string' && detail ? detail : undefined
  }
}

export function activitiesBefore(
  messages: ReadonlyArray<AiChatDrawerMessage>,
  turn: AiChatDrawerMessage
): AiChatDrawerActivityPart[] {
  const parts: AiChatDrawerActivityPart[] = []
  for (let index = messages.indexOf(turn) - 1; index >= 0; index--) {
    const message = messages[index]!
    if (message.role === 'user' || message.role === 'assistant') break
    if (message.role === 'activity') parts.unshift(...message.parts.filter(isActivityPart))
  }
  return parts
}

export function subagentStatusOf(part: AiChatDrawerSubagentPart): SubagentCardStatus {
  const { status, error } = part.subagent
  if (status === 'finished') return 'success'
  if (status === 'suspended') return 'pending'
  if (status === 'error') return error?.message === 'Stopped' ? 'canceled' : 'error'
  return 'running'
}

export function subagentTextOf(part: AiChatDrawerSubagentPart): string {
  return part.subagent.messages
    .filter((message) => message.role === 'assistant')
    .map((message) => textOf(message))
    .filter(Boolean)
    .join('\n\n')
}

export function stopSubagent(part: AiChatDrawerSubagentPart): void {
  const stop = part.subagent.stop
  if (typeof stop === 'function') stop.call(part.subagent)
}

export function textOf(message: AiChatDrawerMessage, separator = '\n\n'): string {
  return message.parts
    .filter(isTextPart)
    .map((part) => part.content)
    .filter(Boolean)
    .join(separator)
}

export function hasText(message: AiChatDrawerMessage): boolean {
  return message.parts.some((part) => isTextPart(part) && part.content.length > 0)
}

export function hasThinking(message: AiChatDrawerMessage): boolean {
  return message.parts.some(isThinkingPart)
}

export function segmentsOf(
  message: AiChatDrawerMessage,
  activities: ReadonlyArray<AiChatDrawerActivityPart> = []
): AiChatDrawerSegment[] {
  const results = new Map<string, AiChatDrawerToolResultPart>()
  for (const part of message.parts) {
    if (isToolResultPart(part)) results.set(part.toolCallId, part)
  }
  const steps = [...activities, ...message.parts.filter(isActivityPart)].map((part, index) =>
    activityStepOf(part, `step-${index}`)
  )
  const segments: AiChatDrawerSegment[] = steps.length
    ? [{ type: 'activity', key: 'activity', steps }]
    : []
  const thinking = message.parts
    .filter(isThinkingPart)
    .map((part) => part.content)
    .join('\n\n')
  if (thinking) segments.push({ type: 'reasoning', key: 'reasoning', content: thinking })
  message.parts.forEach((part, index) => {
    const previous = segments[segments.length - 1]
    if (isTextPart(part)) {
      if (!part.content) return
      if (previous?.type === 'text') previous.content = `${previous.content}\n\n${part.content}`
      else segments.push({ type: 'text', key: `text-${index}`, content: part.content })
    } else if (isToolCallPart(part)) {
      segments.push({ type: 'tool', key: part.id, call: part, result: results.get(part.id) })
    } else if (isImagePart(part)) {
      const image = imageOf(part, index)
      if (!image) return
      if (previous?.type === 'gallery') previous.images.push(image)
      else segments.push({ type: 'gallery', key: `gallery-${index}`, images: [image] })
    } else if (isAudioPart(part)) {
      const src = mediaUrl(part.source)
      if (src) segments.push({ type: 'audio', key: part.id ?? `audio-${index}`, src })
    } else if (isVideoPart(part)) {
      const src = mediaUrl(part.source)
      if (src)
        segments.push({
          type: 'video',
          key: part.id ?? `video-${index}`,
          src,
          mimeType: part.source.mimeType ?? ''
        })
    } else if (isDocumentPart(part)) {
      if (part.source.type === 'url' || part.source.type === 'data')
        segments.push({ type: 'document', key: part.id ?? `document-${index}`, part })
    } else if (isSubagentPart(part)) {
      segments.push({ type: 'subagent', key: `subagent-${index}`, part })
    }
  })
  return segments
}

export function toolStatusOf(
  call: AiChatDrawerToolCallPart,
  result?: AiChatDrawerToolResultPart
): ToolCallStatus {
  if (result?.outcome === 'denied' || call.approval?.approved === false) return 'denied'
  if (result?.outcome === 'cancelled') return 'canceled'
  if (call.state === 'error' || result?.state === 'error') return 'error'
  if (call.state === 'complete' || result?.state === 'complete') return 'success'
  if (call.state === 'awaiting-input' || call.state === 'input-streaming') return 'streaming'
  return 'running'
}

export function needsApproval(call: AiChatDrawerToolCallPart): boolean {
  return call.state === 'approval-requested' || Boolean(call.approval?.needsApproval)
}

export function approvalOf(call: AiChatDrawerToolCallPart): 'pending' | 'approved' | 'denied' {
  if (call.approval?.approved === true) return 'approved'
  if (call.approval?.approved === false) return 'denied'
  return 'pending'
}

export function json(value: unknown): string {
  if (value === undefined || value === null || value === '') return ''
  if (typeof value === 'string') {
    try {
      return JSON.stringify(JSON.parse(value), null, 2)
    } catch {
      return value
    }
  }
  try {
    return JSON.stringify(value, null, 2)
  } catch {
    return String(value)
  }
}

export function parsesAsJson(text: string): boolean {
  try {
    JSON.parse(text)
    return true
  } catch {
    return false
  }
}

export function resolveInterrupt(
  interrupts: ReadonlyArray<AiChatDrawerInterrupt> | undefined,
  call: AiChatDrawerToolCallPart,
  approved: boolean,
  editedArgs?: unknown
): void {
  const interrupt = interrupts?.find(
    (item) => item.kind === 'tool-approval' && item.toolCallId === call.id
  )
  const resolve = interrupt?.resolveInterrupt
  if (typeof resolve !== 'function') return
  if (editedArgs === undefined) resolve.call(interrupt, approved)
  else resolve.call(interrupt, approved, { editedArgs })
}

export function isQuestion(interrupt: AiChatDrawerInterrupt): boolean {
  return interrupt.kind === 'generic' && Boolean(interrupt.id)
}

function optionsIn(value: unknown): AgentQuestionOption[] {
  if (!value || typeof value !== 'object' || !('options' in value)) return []
  const options = (value as { options?: unknown }).options
  if (!Array.isArray(options)) return []
  return options.flatMap((option): AgentQuestionOption[] => {
    if (typeof option === 'string') return [{ value: option, label: option }]
    if (option && typeof option === 'object' && 'value' in option) {
      const { value: answer, label } = option as { value?: unknown; label?: unknown }
      if (typeof answer !== 'string') return []
      return [{ value: answer, label: typeof label === 'string' ? label : answer }]
    }
    return []
  })
}

const QUESTION_STATUS: Record<string, AgentQuestionStatus> = {
  validating: 'running',
  staged: 'running',
  submitting: 'running',
  error: 'error'
}

export function questionOf(interrupt: AiChatDrawerInterrupt): AiChatDrawerQuestion {
  const options = optionsIn(interrupt.metadata)
  return {
    id: interrupt.id ?? '',
    title: interrupt.message || 'The agent needs an answer to continue.',
    options: options.length ? options : optionsIn(interrupt.payload),
    status: QUESTION_STATUS[interrupt.status ?? ''] ?? 'pending',
    error: interrupt.errors?.[0]?.message ?? ''
  }
}

export function answerInterrupt(interrupt: AiChatDrawerInterrupt | undefined, value: string): void {
  const resolve = interrupt?.resolveInterrupt
  if (typeof resolve === 'function') resolve.call(interrupt, value)
}

export function skipInterrupt(interrupt: AiChatDrawerInterrupt | undefined): void {
  const cancel = interrupt?.cancel
  if (typeof cancel === 'function') cancel.call(interrupt)
}

export function queueItemOf(message: AiChatDrawerQueuedMessage): PromptQueueItem {
  const content =
    message.content && typeof message.content === 'object' && 'content' in message.content
      ? (message.content as { content: unknown }).content
      : message.content
  if (typeof content === 'string') return { id: message.id, text: content }
  const parts: unknown[] = Array.isArray(content) ? content : []
  const texts = parts.flatMap((part) =>
    part &&
    typeof part === 'object' &&
    (part as { type?: unknown }).type === 'text' &&
    typeof (part as { content?: unknown }).content === 'string'
      ? [(part as { content: string }).content]
      : []
  )
  return { id: message.id, text: texts.join(' '), attachmentCount: parts.length - texts.length }
}
```

## `sample.ts`

````ts
import type { SourcesItem } from '@aziontech/webkit/sources'
import type { SuggestionGroupItem } from '@aziontech/webkit/suggestion-group'

import type { AiChatDrawerMessage } from './messages'

const at = (time: string): Date => new Date(`2026-11-19T${time}:00`)

const user = (id: string, text: string, time: string): AiChatDrawerMessage => ({
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
): AiChatDrawerMessage => ({
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

export const sampleStreamingMessages: AiChatDrawerMessage[] = [
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

export const sampleInterruptedMessages: AiChatDrawerMessage[] = [
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

export const sampleLongThread: AiChatDrawerMessage[] = history.flatMap(
  ([question, answer], index): AiChatDrawerMessage[] => [
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
  {
    id: 'errors',
    label: 'Why is storefront answering with 502 errors?',
    icon: 'az az-triangle-alert'
  },
  { id: 'purge', label: 'How do I purge the cache of one URL?', icon: 'az az-bolt' },
  { id: 'domains', label: 'Which domains does storefront answer on?', icon: 'az az-globe' }
]
````

# AiActionApproval (`ai/ai-action-approval`)

> A user-authorized action inside a generative AI conversation, from the messages of TanStack AI's `useChat`: the read-only call shows as a completed `ToolCall`, the explanation in `StreamingResponse`, and the call that needs approval as a `ToolApproval` card with its input in a `CodeBlock`. Deploy or Deny resolves the `useChat` interrupt; approved, the call runs under the card and the assistant reports what changed, with Copy and Retry after a failure. Built from `Conversation`, `ChatMessage`, `ToolCall`, `StreamingResponse`, `ToolApproval`, `CodeBlock`, `CopyButton`, `Button` and `PromptInput`. A page body for ConsoleLayout that fills its content region.

- Surface: app
- Source: `blocks/ai/ai-action-approval/ai-action-approval.vue` in `@aziontech/webkit`
- MCP: `get_block("ai/ai-action-approval")`
- Components: [Button](../../components/button.md), [ChatMessage](../../components/chat-message.md), [CodeBlock](../../components/code-block.md), [Conversation](../../components/conversation.md), [CopyButton](../../components/copy-button.md), [PromptInput](../../components/prompt-input.md), [StreamingResponse](../../components/streaming-response.md), [ToolApproval](../../components/tool-approval.md), [ToolCall](../../components/tool-call.md), `use-locale`
- Skills: `webkit-ai-surfaces`, `webkit-ui-states`, `webkit-errors`

## Asked as

ai action approval; approve ai action; user authorized action; agent asks permission; human in the loop; tool call approval; confirm agent command; allow tool; aprovar ação da ia; autorizar ação do agente; confirmar comando; aprobar acción de la ia; approve an agent action; tool approval in chat

The moment an assistant needs permission. The reader asked for something that changes their account — a deployment, a purge, a deletion — and the assistant stops before doing it: it says what it found, shows exactly what will run, and waits for Approve or Deny. The decision stays in the thread as text, and the assistant reports what happened next, so the conversation is also the record of what ran and who allowed it. It is a page body for `ConsoleLayout`: it fills the layout's content region (`grow basis-0 min-h-0`, never `h-dvh`), so only the log scrolls, and the layout owns the rail, the header and the `main`.

## When to use

- Use ai-action-approval when an AI assistant proposes an action with side effects inside a conversation (ToolApproval).
- The assistant is about to call a tool or run a command with side effects: deploy, purge, change a rule, delete.
- A one-time decision about a consequential action, made inside the conversation.
- An irreversible action: add a typed confirmation to the card.

## When not to use

- Read-only calls (listing, reading metrics): record them with `ToolCall` and continue without asking.
- Tools the reader already allowed for this conversation: record the call, do not ask again.
- A destructive action the reader started from the UI, not the assistant: use `ConfirmDialog` (see `edit/edit-delete-dialog`).
- Several fields to fill before acting: link to the create or edit page; the card only approves or denies.

## Building blocks

### A. Conversation frame — `Conversation`, `PromptInput`

The thread and its composer, as in `ai/ai-chat`. While an approved action runs, the composer shows Stop, which emits `stop`; the page cancels the run with `stop()` of `useChat`.

### B. Request — `ChatMessage`

The reader's request at the inline end, in their words.

### C. What the assistant checked — `ToolCall`, `StreamingResponse`

Each read-only call it made, as a completed `ToolCall` with the tool name in code and a plain description, then one or two sentences on what it found and why it needs approval.

### D. Authorization card — `ToolApproval`, `CodeBlock`

The question names the action and its target, with the command or tool in code. The description says what changes and what stays. The body is the call's input in a `CodeBlock`. Deny (outlined) and the approve button, labelled with the verb of the title (Deploy, Delete), sit at the inline end. For irreversible actions use `variant="danger"` and `confirmation-phrase` with the resource name. After a decision the buttons give way to Approved or Denied. The body shows the call's input as JSON; a tool with `editable` lets the reader edit it, Approve stays off while it does not parse, and the edit resolves the interrupt as `{ editedArgs }`.

### E. The action running — `ToolCall`

After approval, the call appears as a running `ToolCall` under the card and completes or fails in place; a denial records it as denied.

### F. Outcome — `ChatMessage`, `CopyButton`, `Button`

A new response that says what changed (or that nothing ran), with Copy in its actions. When the approved action fails or is stopped, the response says what failed and that the previous version still serves, and an outlined Retry `Button` beside Copy runs the action again; an action never ends in silence.

## Data

The block draws a conversation in the message shape of TanStack AI: each message has an `id`, a `role` and its `parts` in order (`text`, `thinking`, `tool-call`, `tool-result`), so the values `useChat` from `@tanstack/ai-vue` returns go straight into its props, with no conversion. The block calls no model and depends on no AI library; `messages.ts` declares the same shape itself (`AiActionApprovalMessage`, `AiActionApprovalPart`, `AiActionApprovalTool`, `AiActionApprovalInterrupt`, re-exported from `ai-action-approval.vue`), so any source that produces it works. Parts it does not draw (images, audio) are skipped. `sample.ts` holds the sample threads the variants pass. The draft in the composer stays local.

What TanStack AI does not carry, the app adds in `metadata`: `sources` (the documents the response cites, numbered in order), `reasoningSeconds` (left out, the block measures the thinking time) and `stopped` (the block also marks the response that Stop ended). A message's time is its `createdAt`, formatted in the reader's locale.

| Prop         | Type                                   | What it does                                                                                                                                                         |
| ------------ | -------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`   | `AiActionApprovalMessage[]`            | The conversation, oldest first, as `useChat` returns it. Left out, the sample deployment renders.                                                                    |
| `loading`    | `boolean`                              | `isLoading` from `useChat`: the last response thinks, then streams, and the composer shows Stop.                                                                     |
| `error`      | `string \| Error`                      | `error` from `useChat` shows the standard sentence on the last response with Try again; a string shows that sentence instead.                                        |
| `tools`      | `Record<string, AiActionApprovalTool>` | How each tool reads, by name: `title` for the call, `question`, `description`, `approveLabel`, `variant`, `confirmationPhrase` and `editable` for its approval card. |
| `interrupts` | `interrupts` of `useChat`              | The pending approvals; the approve button and Deny resolve the one whose `toolCallId` matches the call.                                                              |

| Event     | Payload                 | When                                                                                                                                              |
| --------- | ----------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `send`    | `(event, text)`         | The composer: call `sendMessage(text)`.                                                                                                           |
| `stop`    | `(event)`               | Stop while the response streams: call `stop()`. The block marks the stopped response.                                                             |
| `retry`   | `(event, message)`      | Try again or Regenerate response: call `reload()`.                                                                                                |
| `approve` | `(event, call, input?)` | The approve button on an approval card; `input` is the edited arguments of an `editable` tool. The block already resolved the matching interrupt. |
| `deny`    | `(event, call)`         | Deny on an approval card; the block already resolved the matching interrupt.                                                                      |

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

  import AiActionApproval from './ai-action-approval.vue'

  const { messages, isLoading, error, interrupts, sendMessage, stop, reload, clear } = useChat({
    connection: fetchServerSentEvents('/api/chat'),
    threadId: 'assistant'
  })
</script>

<template>
  <AiActionApproval
    :messages="messages"
    :loading="isLoading"
    :error="error"
    :interrupts="interrupts"
    @send="(_event, text) => sendMessage(text)"
    @stop="stop()"
    @retry="reload()"
  />
</template>
```

A tool that needs approval is declared once with `toolDefinition({ name, inputSchema, needsApproval: true })`, run on the server with `.server(...)` and passed to `useChat({ tools: [definition] })` too, so the client can match the approval request to the call. Then delete `sample.ts` and its import. `apps/demos` runs this block on `useChat` with TanStack AI's `fakeText` model (`src/lib/assistant-model.ts`), no server and no key.

## Do

- Show exactly what will run, with the real identifiers.
- Label the approve button with the verb of the title.
- Dismiss the buttons as soon as the reader decides and show the outcome in text.
- Acknowledge a denial and say nothing ran.
- Expire a request the reader leaves undecided and say nothing ran.
- Require typing the resource name before an irreversible action.

## Don't

- Don't run anything before Approve.
- Don't focus or pre-select Approve, and don't trap focus in the card; it is part of the conversation, not a dialog.
- Don't ask again for a tool the reader allowed for this conversation.
- Don't hide the command behind a summary; show it.
- Don't show secrets or tokens in the command or the tool details.

## Copy

- **Title:** a question naming the action, with the command or tool in code: ``Allow `azion deploy --env production`?``, "Delete the domain `old.example.com`?".
- **Description:** what changes and what stays, e.g. "Deploys build `b-4821` of storefront to production. The current version stays available for rollback."
- **Buttons:** Deny and the verb of the title (Deploy, Delete); "Approve" only for a generic tool call.
- **Typed confirmation:** "Type old.example.com to confirm" (built in).
- **Outcomes:** Approved, Denied (built in).
- **Assistant after a denial:** "Got it, nothing was deployed."
- Follow `skills/webkit-microcopy`: sentence case, no "please", present tense.

## Accessibility

- The card is a group named by its title and described by its description; it does not trap or take focus.
- Outcomes are text announced through a polite live region; status color is never the only signal.
- Tool calls announce their status changes (Running, Completed, Failed) through `StatusIndicator`.
- The typed confirmation has a visible label; Approve is disabled until it matches.
- Keyboard order: request, tool calls, response text, command, phrase field, Deny, approve.

## States

- Pending: the deployment call in `approval-requested`, waiting for Deny or Deploy; Deploy emits `approve` and resolves the matching interrupt, and the run goes on.
- Irreversible: a domain deletion whose tool has `variant: 'danger'` and `confirmationPhrase` in `tools`, so Delete enables only after the domain name is typed.
- Running: the call approved (`approval.approved: true`) and still running under the card, with `loading`, so the composer shows Stop.
- Approved: the call `complete` with its output, and the assistant's report after it.
- Denied: `approval.approved: false` and a `tool-result` with `outcome: 'denied'`; the card reads Denied, the call is recorded as denied and the assistant says nothing ran.
- Error: the approved call in `error` with its `tool-result` error, and a report that says what failed and that `b-4790` still serves, with Retry.

## Related

- `ai/ai-chat` — the conversation this card lives in.
- `ai/ai-chat-drawer` — the same flow in a drawer over a resource page.
- `edit/edit-delete-dialog` — confirming a destructive action the reader started.
- `skills/webkit-ai-surfaces` — when to ask, what to show and how to record the outcome.

## Variants

- `Pending` — primary (the code below)
- `Irreversible` — The assistant proposes deleting a domain nobody uses: the card turns danger and Delete stays disabled until the reader types the domain name.
- `Approved` — After Deploy: the card reads Approved, the deployment call completed, and the assistant reports the new build is live with the previous one kept for rollback.
- `Denied` — After Deny: the card reads Denied, the deployment call is recorded as denied, and the assistant acknowledges that nothing was deployed.
- `Running` — After Deploy: the card reads Approved, the deployment call runs under it and the composer shows Stop until it finishes.
- `Error` — The approved deployment fails: the deployment call reads failed, and the assistant says what failed and that production still serves the previous version, with Retry beside Copy.

Each variant is the same screen in another state: `get_block("ai/ai-action-approval", { variant })`, or the file under `blocks/ai/ai-action-approval/variants/`.

## Code (`Pending`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ChatMessage, { type ChatMessageStatus } from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import type { PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import ToolCall from '@aziontech/webkit/tool-call'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import {
    type AiActionApprovalInterrupt,
    type AiActionApprovalMessage,
    type AiActionApprovalTool,
    type AiActionApprovalToolCallPart,
    approvalOf,
    hasText,
    isToolCallPart,
    isToolResultPart,
    json,
    needsApproval,
    parsesAsJson,
    resolveInterrupt,
    segmentsOf,
    textOf,
    toolStatusOf
  } from './messages'
  import { sampleMessages, sampleTools } from './sample'

  export type {
    AiActionApprovalInterrupt,
    AiActionApprovalMessage,
    AiActionApprovalMessageMetadata,
    AiActionApprovalOtherPart,
    AiActionApprovalPart,
    AiActionApprovalRole,
    AiActionApprovalTextPart,
    AiActionApprovalThinkingPart,
    AiActionApprovalTool,
    AiActionApprovalToolCallPart,
    AiActionApprovalToolCallState,
    AiActionApprovalToolResultPart
  } from './messages'

  export interface AiActionApprovalProps {
    /** The conversation, oldest first, as TanStack AI's `useChat` returns `messages`. Left out, the sample deployment renders. */
    messages?: ReadonlyArray<AiActionApprovalMessage>
    /** The assistant is responding or an approved call runs, as `useChat` returns `isLoading`. */
    loading?: boolean
    /** Why the last response failed: a sentence, or the `error` of `useChat`, which shows the standard sentence. */
    error?: string | { message: string } | null
    /** How each tool reads, by tool name: the call's title, the approval question, its verb and whether it is irreversible. */
    tools?: Record<string, AiActionApprovalTool>
    /** Pending requests, as `useChat` returns `interrupts`; the approve button and Deny resolve the matching one. */
    interrupts?: ReadonlyArray<AiActionApprovalInterrupt>
  }

  const props = withDefaults(defineProps<AiActionApprovalProps>(), {
    messages: undefined,
    loading: false,
    error: '',
    tools: undefined,
    interrupts: () => []
  })

  const emit = defineEmits<{
    approve: [event: MouseEvent, call: AiActionApprovalToolCallPart, input?: unknown]
    deny: [event: MouseEvent, call: AiActionApprovalToolCallPart]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent, message: AiActionApprovalMessage]
    send: [event: MouseEvent | KeyboardEvent, text: string]
  }>()

  const { formatDate } = useLocale()

  const prompt = ref('')
  const edits = ref<Record<string, string>>({})

  const turns = computed(() =>
    (props.messages ?? sampleMessages).filter(
      (message) => message.role === 'user' || message.role === 'assistant'
    )
  )
  const toolLabels = computed(() => props.tools ?? (props.messages ? {} : sampleTools))
  const last = computed(() => turns.value[turns.value.length - 1])
  const failure = computed(() => {
    if (!props.error) return ''
    if (typeof props.error === 'string') return props.error
    return 'The connection was interrupted before the response finished.'
  })

  function statusOf(turn: AiActionApprovalMessage): ChatMessageStatus {
    if (turn.role === 'user' || turn !== last.value) return 'success'
    if (failure.value) return 'error'
    if (props.loading && !runs(turn)) return hasText(turn) ? 'streaming' : 'pending'
    return 'success'
  }

  function runs(turn: AiActionApprovalMessage): boolean {
    return turn.parts.some(
      (part) =>
        isToolCallPart(part) &&
        ['running', 'streaming'].includes(toolStatusOf(part)) &&
        (!needsApproval(part) || approvalOf(part) === 'approved')
    )
  }

  function failed(turn: AiActionApprovalMessage): boolean {
    const results = turn.parts.filter(isToolResultPart)
    return turn.parts.some(
      (part) =>
        isToolCallPart(part) &&
        toolStatusOf(
          part,
          results.find((result) => result.toolCallId === part.id)
        ) === 'error'
    )
  }

  const state = computed<PromptInputStatus>(() => {
    if (!props.loading) return 'ready'
    return last.value?.role === 'assistant' && (hasText(last.value) || runs(last.value))
      ? 'streaming'
      : 'pending'
  })

  function timeOf(turn: AiActionApprovalMessage): string {
    return turn.createdAt ? formatDate(turn.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''
  }

  function toolOf(call: AiActionApprovalToolCallPart): AiActionApprovalTool {
    return toolLabels.value[call.name] ?? { title: '' }
  }

  function editOf(call: AiActionApprovalToolCallPart): string {
    return edits.value[call.id] ?? json(call.input ?? call.arguments)
  }

  function approve(event: MouseEvent, call: AiActionApprovalToolCallPart, text: string) {
    const edited =
      toolOf(call).editable && text !== json(call.input ?? call.arguments)
        ? (JSON.parse(text) as unknown)
        : undefined
    emit('approve', event, call, edited)
    resolveInterrupt(props.interrupts, call, true, edited)
  }

  function deny(event: MouseEvent, call: AiActionApprovalToolCallPart) {
    emit('deny', event, call)
    resolveInterrupt(props.interrupts, call, false)
  }

  function send(event: MouseEvent | KeyboardEvent, value: string) {
    if (!value.trim() || state.value !== 'ready') return
    prompt.value = ''
    emit('send', event, value)
  }
</script>

<template>
  <section
    aria-labelledby="ai-approval-title"
    class="flex min-h-0 w-full grow basis-0 flex-col"
  >
    <header class="border-b border-(--border-default) px-(--spacing-md) py-(--spacing-sm)">
      <h1
        id="ai-approval-title"
        class="text-heading-xs text-(--text-default)"
      >
        AI assistant
      </h1>
    </header>
    <Conversation aria-label="Conversation with the AI assistant">
      <ChatMessage
        v-for="turn in turns"
        :key="turn.id"
        :from="turn.role === 'user' ? 'user' : 'assistant'"
        :status="statusOf(turn)"
        :timestamp="timeOf(turn)"
        :error-message="statusOf(turn) === 'error' ? failure : undefined"
        @retry="emit('retry', $event, turn)"
      >
        <template v-if="turn.role === 'user'">{{ textOf(turn, '\n') }}</template>
        <template v-else>
          <template
            v-for="segment in segmentsOf(turn)"
            :key="segment.key"
          >
            <StreamingResponse
              v-if="segment.type === 'text'"
              :content="segment.content"
              :streaming="statusOf(turn) === 'streaming'"
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
                :invalid="toolOf(segment.call).editable && !parsesAsJson(editOf(segment.call))"
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
                v-if="!needsApproval(segment.call) || approvalOf(segment.call) !== 'pending'"
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
                    json(segment.result?.error || segment.call.output || segment.result?.content)
                  "
                  #output
                >
                  <CodeBlock
                    :code="
                      json(segment.result?.error || segment.call.output || segment.result?.content)
                    "
                    language="json"
                    :show-line-numbers="false"
                  />
                </template>
              </ToolCall>
            </template>
          </template>
        </template>
        <template
          v-if="
            turn.role === 'assistant' &&
            hasText(turn) &&
            statusOf(turn) === 'success' &&
            !(loading && turn === last)
          "
          #actions
        >
          <ChatMessage.Actions>
            <CopyButton
              size="small"
              :value="textOf(turn)"
            />
            <Button
              v-if="turn === last && failed(turn)"
              label="Retry"
              variant="outline"
              size="small"
              icon="az az-refresh"
              @click="emit('retry', $event, turn)"
            />
          </ChatMessage.Actions>
        </template>
      </ChatMessage>
    </Conversation>
    <footer class="layout-column-content layout-boundary-inline pb-(--spacing-md)">
      <PromptInput
        v-model="prompt"
        :status="state"
        @submit="(event, { value }) => send(event, value)"
        @stop="emit('stop', $event)"
      >
        <template #hint>
          The assistant runs nothing in your account without your approval.
        </template>
      </PromptInput>
    </footer>
  </section>
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
export type AiActionApprovalRole = 'system' | 'user' | 'assistant' | 'activity'

/** Text of a message: plain for the reader, Markdown for the assistant. */
export interface AiActionApprovalTextPart {
  type: 'text'
  content: string
}

/** How the assistant reached the answer, shown in the collapsible Reasoning. */
export interface AiActionApprovalThinkingPart {
  type: 'thinking'
  content: string
}

/** Where a tool call stands. */
export type AiActionApprovalToolCallState =
  | 'awaiting-input'
  | 'input-streaming'
  | 'input-complete'
  | 'approval-requested'
  | 'approval-responded'
  | 'complete'
  | 'error'

/** A tool the assistant calls; one that needs approval carries `approval`. */
export interface AiActionApprovalToolCallPart {
  type: 'tool-call'
  id: string
  name: string
  arguments: string
  input?: unknown
  state: AiActionApprovalToolCallState
  output?: unknown
  approval?: {
    id: string
    needsApproval: boolean
    approved?: boolean
  }
}

/** What a tool returned, matched to its call by `toolCallId`. */
export interface AiActionApprovalToolResultPart {
  type: 'tool-result'
  toolCallId: string
  content: unknown
  state: 'streaming' | 'complete' | 'error'
  outcome?: 'cancelled' | 'denied'
  error?: string
}

/** Where the bytes of an image, audio, video or document come from: a URL, base64 data, or a provider file the block cannot draw. */
export interface AiActionApprovalMediaSource {
  type: 'url' | 'data' | 'file'
  value: string
  mimeType?: string
}

/** An image the message carries; consecutive images draw as one gallery. */
export interface AiActionApprovalImagePart {
  type: 'image'
  id?: string
  source: AiActionApprovalMediaSource
  metadata?: unknown
}

/** An audio clip the message carries. */
export interface AiActionApprovalAudioPart {
  type: 'audio'
  id?: string
  source: AiActionApprovalMediaSource
  metadata?: unknown
}

/** A video the message carries. */
export interface AiActionApprovalVideoPart {
  type: 'video'
  id?: string
  source: AiActionApprovalMediaSource
  metadata?: unknown
}

/** A document the message carries, such as a PDF; `metadata.name` names it. */
export interface AiActionApprovalDocumentPart {
  type: 'document'
  id?: string
  source: AiActionApprovalMediaSource
  metadata?: unknown
}

/** A step the agent reports; `content.title`, `content.status` and `content.detail` draw it. */
export interface AiActionApprovalActivityPart {
  type: 'activity'
  activityType: string
  content: Record<string, unknown>
}

/** Where a helper agent stands. */
export type AiActionApprovalSubagentStatus = 'running' | 'finished' | 'error' | 'suspended'

/** A helper agent the assistant started, with its own messages. */
export interface AiActionApprovalSubagentPart {
  type: 'subagent'
  subagent: {
    name: string
    description?: string
    status: AiActionApprovalSubagentStatus
    messages: ReadonlyArray<AiActionApprovalMessage>
    input?: unknown
    error?: { message: string }
    stop?: unknown
  }
}

/** A part the conversation does not draw, such as structured output. */
export interface AiActionApprovalOtherPart {
  type: string
}

/** One piece of a message, in the order it arrived. */
export type AiActionApprovalPart =
  | AiActionApprovalTextPart
  | AiActionApprovalThinkingPart
  | AiActionApprovalToolCallPart
  | AiActionApprovalToolResultPart
  | AiActionApprovalImagePart
  | AiActionApprovalAudioPart
  | AiActionApprovalVideoPart
  | AiActionApprovalDocumentPart
  | AiActionApprovalActivityPart
  | AiActionApprovalSubagentPart
  | AiActionApprovalOtherPart

/** What the app adds to a message beside its parts. */
export interface AiActionApprovalMessageMetadata {
  /** The documents the response cites, numbered in order. */
  sources?: SourcesItem[]
  /** How long the assistant thought, in seconds; left out, the block measures it while it streams. */
  reasoningSeconds?: number
  /** The reader stopped this response; the block also marks the response Stop ends. */
  stopped?: boolean
}

/** One message, in the shape TanStack AI's `useChat` returns. */
export interface AiActionApprovalMessage {
  /** Stable key. */
  id: string
  /** Who wrote it; `system` and `activity` messages are not drawn. */
  role: AiActionApprovalRole
  /** The text, reasoning and tool calls, in order. */
  parts: ReadonlyArray<AiActionApprovalPart>
  /** When it was written. */
  createdAt?: Date
  /** Sources, the thinking time and the stopped flag. */
  metadata?: AiActionApprovalMessageMetadata & Record<string, unknown>
}

/** How a tool reads in the conversation and on its approval card. */
export interface AiActionApprovalTool {
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
export interface AiActionApprovalInterrupt {
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
export interface AiActionApprovalQueuedMessage {
  id: string
  content: unknown
}

/** The state of the connection to the chat, as `useChat` returns `connectionStatus`. */
export type AiActionApprovalConnection = 'disconnected' | 'connecting' | 'connected' | 'error'

/** A question the agent asked through a generic interrupt, as the block draws it. */
export interface AiActionApprovalQuestion {
  id: string
  title: string
  options: AgentQuestionOption[]
  status: AgentQuestionStatus
  error: string
}

/** A rendered piece of an assistant message. */
export type AiActionApprovalSegment =
  | { type: 'activity'; key: string; steps: AgentActivityStep[] }
  | { type: 'reasoning'; key: string; content: string }
  | { type: 'text'; key: string; content: string }
  | {
      type: 'tool'
      key: string
      call: AiActionApprovalToolCallPart
      result?: AiActionApprovalToolResultPart
    }
  | { type: 'gallery'; key: string; images: ImageGalleryItem[] }
  | { type: 'audio'; key: string; src: string }
  | { type: 'video'; key: string; src: string; mimeType: string }
  | { type: 'document'; key: string; part: AiActionApprovalDocumentPart }
  | { type: 'subagent'; key: string; part: AiActionApprovalSubagentPart }

export const isTextPart = (part: AiActionApprovalPart): part is AiActionApprovalTextPart =>
  part.type === 'text'

export const isThinkingPart = (part: AiActionApprovalPart): part is AiActionApprovalThinkingPart =>
  part.type === 'thinking'

export const isToolCallPart = (part: AiActionApprovalPart): part is AiActionApprovalToolCallPart =>
  part.type === 'tool-call'

export const isToolResultPart = (
  part: AiActionApprovalPart
): part is AiActionApprovalToolResultPart => part.type === 'tool-result'

export const isImagePart = (part: AiActionApprovalPart): part is AiActionApprovalImagePart =>
  part.type === 'image'

export const isAudioPart = (part: AiActionApprovalPart): part is AiActionApprovalAudioPart =>
  part.type === 'audio'

export const isVideoPart = (part: AiActionApprovalPart): part is AiActionApprovalVideoPart =>
  part.type === 'video'

export const isDocumentPart = (part: AiActionApprovalPart): part is AiActionApprovalDocumentPart =>
  part.type === 'document'

export const isActivityPart = (part: AiActionApprovalPart): part is AiActionApprovalActivityPart =>
  part.type === 'activity'

export const isSubagentPart = (part: AiActionApprovalPart): part is AiActionApprovalSubagentPart =>
  part.type === 'subagent'

export function mediaUrl(source: AiActionApprovalMediaSource): string {
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

export function imageOf(part: AiActionApprovalImagePart, index: number): ImageGalleryItem | null {
  const key = part.id ?? `image-${index}`
  const alt = metadataText(part.metadata, 'alt')
  if (part.source.type === 'url') return { key, src: part.source.value, alt }
  if (part.source.type === 'data')
    return { key, data: part.source.value, mimeType: part.source.mimeType, alt }
  return null
}

export function documentNameOf(part: AiActionApprovalDocumentPart): string {
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

export function activityStepOf(part: AiActionApprovalActivityPart, key: string): AgentActivityStep {
  const { title, status, detail } = part.content
  return {
    key,
    title: typeof title === 'string' && title ? title : part.activityType,
    status: (typeof status === 'string' && ACTIVITY_STATUS[status]) || 'running',
    description: typeof detail === 'string' && detail ? detail : undefined
  }
}

export function activitiesBefore(
  messages: ReadonlyArray<AiActionApprovalMessage>,
  turn: AiActionApprovalMessage
): AiActionApprovalActivityPart[] {
  const parts: AiActionApprovalActivityPart[] = []
  for (let index = messages.indexOf(turn) - 1; index >= 0; index--) {
    const message = messages[index]!
    if (message.role === 'user' || message.role === 'assistant') break
    if (message.role === 'activity') parts.unshift(...message.parts.filter(isActivityPart))
  }
  return parts
}

export function subagentStatusOf(part: AiActionApprovalSubagentPart): SubagentCardStatus {
  const { status, error } = part.subagent
  if (status === 'finished') return 'success'
  if (status === 'suspended') return 'pending'
  if (status === 'error') return error?.message === 'Stopped' ? 'canceled' : 'error'
  return 'running'
}

export function subagentTextOf(part: AiActionApprovalSubagentPart): string {
  return part.subagent.messages
    .filter((message) => message.role === 'assistant')
    .map((message) => textOf(message))
    .filter(Boolean)
    .join('\n\n')
}

export function stopSubagent(part: AiActionApprovalSubagentPart): void {
  const stop = part.subagent.stop
  if (typeof stop === 'function') stop.call(part.subagent)
}

export function textOf(message: AiActionApprovalMessage, separator = '\n\n'): string {
  return message.parts
    .filter(isTextPart)
    .map((part) => part.content)
    .filter(Boolean)
    .join(separator)
}

export function hasText(message: AiActionApprovalMessage): boolean {
  return message.parts.some((part) => isTextPart(part) && part.content.length > 0)
}

export function hasThinking(message: AiActionApprovalMessage): boolean {
  return message.parts.some(isThinkingPart)
}

export function segmentsOf(
  message: AiActionApprovalMessage,
  activities: ReadonlyArray<AiActionApprovalActivityPart> = []
): AiActionApprovalSegment[] {
  const results = new Map<string, AiActionApprovalToolResultPart>()
  for (const part of message.parts) {
    if (isToolResultPart(part)) results.set(part.toolCallId, part)
  }
  const steps = [...activities, ...message.parts.filter(isActivityPart)].map((part, index) =>
    activityStepOf(part, `step-${index}`)
  )
  const segments: AiActionApprovalSegment[] = steps.length
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
  call: AiActionApprovalToolCallPart,
  result?: AiActionApprovalToolResultPart
): ToolCallStatus {
  if (result?.outcome === 'denied' || call.approval?.approved === false) return 'denied'
  if (result?.outcome === 'cancelled') return 'canceled'
  if (call.state === 'error' || result?.state === 'error') return 'error'
  if (call.state === 'complete' || result?.state === 'complete') return 'success'
  if (call.state === 'awaiting-input' || call.state === 'input-streaming') return 'streaming'
  return 'running'
}

export function needsApproval(call: AiActionApprovalToolCallPart): boolean {
  return call.state === 'approval-requested' || Boolean(call.approval?.needsApproval)
}

export function approvalOf(call: AiActionApprovalToolCallPart): 'pending' | 'approved' | 'denied' {
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
  interrupts: ReadonlyArray<AiActionApprovalInterrupt> | undefined,
  call: AiActionApprovalToolCallPart,
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

export function isQuestion(interrupt: AiActionApprovalInterrupt): boolean {
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

export function questionOf(interrupt: AiActionApprovalInterrupt): AiActionApprovalQuestion {
  const options = optionsIn(interrupt.metadata)
  return {
    id: interrupt.id ?? '',
    title: interrupt.message || 'The agent needs an answer to continue.',
    options: options.length ? options : optionsIn(interrupt.payload),
    status: QUESTION_STATUS[interrupt.status ?? ''] ?? 'pending',
    error: interrupt.errors?.[0]?.message ?? ''
  }
}

export function answerInterrupt(
  interrupt: AiActionApprovalInterrupt | undefined,
  value: string
): void {
  const resolve = interrupt?.resolveInterrupt
  if (typeof resolve === 'function') resolve.call(interrupt, value)
}

export function skipInterrupt(interrupt: AiActionApprovalInterrupt | undefined): void {
  const cancel = interrupt?.cancel
  if (typeof cancel === 'function') cancel.call(interrupt)
}

export function queueItemOf(message: AiActionApprovalQueuedMessage): PromptQueueItem {
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

```ts
import type {
  AiActionApprovalMessage,
  AiActionApprovalPart,
  AiActionApprovalTool,
  AiActionApprovalToolCallPart
} from './messages'

const at = (time: string): Date => new Date(`2026-11-19T${time}:00`)

const request = (id: string, text: string): AiActionApprovalMessage => ({
  id,
  role: 'user',
  parts: [{ type: 'text', content: text }],
  createdAt: at('15:02')
})

const response = (id: string, parts: AiActionApprovalPart[]): AiActionApprovalMessage => ({
  id,
  role: 'assistant',
  parts,
  createdAt: at('15:02')
})

const deployInput = { workload: 'storefront', build: 'b-4821', environment: 'production' }

const readBuild: AiActionApprovalToolCallPart = {
  type: 'tool-call',
  id: 'call-build',
  name: 'get_build',
  arguments: JSON.stringify({ workload: 'storefront' }),
  input: { workload: 'storefront' },
  state: 'complete',
  output: { build: 'b-4821', checks: 'passed', finishedAt: '14:56' }
}

const explanation: AiActionApprovalPart = {
  type: 'text',
  content: 'Build `b-4821` passed its checks 6 minutes ago. Deploying it needs your approval.'
}

const deploy = (
  state: AiActionApprovalToolCallPart['state'],
  approved?: boolean
): AiActionApprovalToolCallPart => ({
  type: 'tool-call',
  id: 'call-deploy',
  name: 'deploy_workload',
  arguments: JSON.stringify(deployInput),
  input: deployInput,
  state,
  approval: { id: 'approval-deploy', needsApproval: true, approved }
})

const deployRequest = request('m1', 'Deploy the current build of storefront to production')

export const sampleTools: Record<string, AiActionApprovalTool> = {
  get_build: { title: 'Reading the latest build of storefront' },
  deploy_workload: {
    title: 'Deploying storefront to production',
    question: 'Allow `deploy_workload` on production?',
    description:
      'Deploys build `b-4821` of storefront to production. The current version stays available for rollback.',
    approveLabel: 'Deploy'
  },
  get_domain_traffic: { title: 'Reading the traffic of old.example.com' },
  delete_domain: {
    title: 'Deleting old.example.com',
    question: 'Delete the domain `old.example.com`?',
    description:
      'The domain stops answering at once and its certificate is revoked. This cannot be undone.',
    approveLabel: 'Delete',
    variant: 'danger',
    confirmationPhrase: 'old.example.com'
  }
}

export const sampleMessages: AiActionApprovalMessage[] = [
  deployRequest,
  response('m2', [readBuild, explanation, deploy('approval-requested')])
]

export const sampleRunningMessages: AiActionApprovalMessage[] = [
  deployRequest,
  response('m2', [readBuild, explanation, deploy('approval-responded', true)])
]

export const sampleApprovedMessages: AiActionApprovalMessage[] = [
  deployRequest,
  response('m2', [
    readBuild,
    explanation,
    { ...deploy('complete', true), output: { status: 'live', build: 'b-4821' } },
    {
      type: 'text',
      content:
        'storefront is live on production with build `b-4821`. The previous version `b-4790` stays available for rollback.'
    }
  ])
]

export const sampleDeniedMessages: AiActionApprovalMessage[] = [
  deployRequest,
  response('m2', [
    readBuild,
    explanation,
    deploy('approval-responded', false),
    {
      type: 'tool-result',
      toolCallId: 'call-deploy',
      content: '',
      state: 'error',
      outcome: 'denied'
    },
    {
      type: 'text',
      content: 'Got it, nothing was deployed. Build `b-4821` stays ready if you change your mind.'
    }
  ])
]

export const sampleFailedMessages: AiActionApprovalMessage[] = [
  deployRequest,
  response('m2', [
    readBuild,
    explanation,
    deploy('error', true),
    {
      type: 'tool-result',
      toolCallId: 'call-deploy',
      content: '',
      state: 'error',
      error: 'Upload to the edge failed: connection reset.'
    },
    {
      type: 'text',
      content:
        'The deployment of build `b-4821` failed while uploading the build to the edge. Nothing changed: production still serves the previous version `b-4790`.'
    }
  ])
]

export const sampleDeleteMessages: AiActionApprovalMessage[] = [
  request('m1', 'Delete the domain old.example.com, nobody uses it anymore'),
  response('m2', [
    {
      type: 'tool-call',
      id: 'call-traffic',
      name: 'get_domain_traffic',
      arguments: JSON.stringify({ domain: 'old.example.com', days: 30 }),
      input: { domain: 'old.example.com', days: 30 },
      state: 'complete',
      output: { requests: 0 }
    },
    {
      type: 'text',
      content:
        'old.example.com had no requests in the last 30 days. Deleting it needs your approval, and you need to type its name.'
    },
    {
      type: 'tool-call',
      id: 'call-delete',
      name: 'delete_domain',
      arguments: JSON.stringify({ domain: 'old.example.com' }),
      input: { domain: 'old.example.com' },
      state: 'approval-requested',
      approval: { id: 'approval-delete', needsApproval: true }
    }
  ])
]
```

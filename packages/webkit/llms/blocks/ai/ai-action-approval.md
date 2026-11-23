# AiActionApproval (`ai/ai-action-approval`)

> A user-authorized action inside a generative AI conversation, from the messages of TanStack AI's `useChat`: the read-only call shows as a completed `ToolCall`, the explanation in `StreamingResponse`, and the call that needs approval as a `ToolApproval` card with its input in a `CodeBlock`. Deploy or Deny resolves the `useChat` interrupt; approved, the call runs under the card and the assistant reports what changed, with Copy and Retry after a failure. Built from `Conversation`, `ChatMessage`, `ToolCall`, `StreamingResponse`, `ToolApproval`, `CodeBlock`, `Button` and `PromptInput`. A page body for ConsoleLayout that fills its content region.

- Surface: app
- Source: `blocks/ai/ai-action-approval/ai-action-approval.vue` in `@aziontech/webkit`
- MCP: `get_block("ai/ai-action-approval")`
- Components: [AgentQuestion](../../components/agent-question.md), [Alert](../../components/alert.md), [Button](../../components/button.md), [ChatMessage](../../components/chat-message.md), [CodeBlock](../../components/code-block.md), [Conversation](../../components/conversation.md), [ImageGallery](../../components/image-gallery.md), `PromptInputAttachButton`, `PromptInputDictateButton`, [PromptInput](../../components/prompt-input.md), [StreamingResponse](../../components/streaming-response.md), [ToolApproval](../../components/tool-approval.md), [ToolCall](../../components/tool-call.md), `use-locale`, `utils/ai-chat`
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

The thread and its composer, as in `ai/ai-chat`: a quiet title row with no divider, and the `PromptInput` pill floating in the `#composer` of `Conversation`, with the alert of unsent decisions above it. The pill holds the Attach "+" at the start (`attachable`, on by default: up to 4 images or PDFs of 10 MB each, sent as TanStack AI's multimodal content) and Dictate before Send. Dictate (`PromptInputDictateButton`) writes speech into the prompt with the browser's speech recognition and hides itself where the browser has none; an app that runs its own transcriber swaps in `PromptInputDictateButton` with `transcriber="app"` and writes the text itself. While an approved action runs, the composer shows Stop, which emits `stop`; the page cancels the run with `stop()` of `useChat`.

### B. Request — `ChatMessage`

The reader's request at the inline end, in their words.

### C. What the assistant checked — `ToolCall`, `StreamingResponse`

Each read-only call it made, as a completed `ToolCall` with the tool name in code and a plain description, then one or two sentences on what it found and why it needs approval.

### D. Authorization card — `ToolApproval`, `CodeBlock`

The question names the action and its target, with the command or tool in code. The description says what changes and what stays. The body is the call's input in a `CodeBlock`. Deny (outlined) and the approve button, labelled with the verb of the title (Deploy, Delete), sit at the inline end. For irreversible actions use `variant="danger"` and `confirmation-phrase` with the resource name. After a decision the buttons give way to Approved or Denied. The body shows the call's input as JSON; a tool with `editable` lets the reader edit it, Approve stays off while it does not parse, and the edit resolves the interrupt as `{ editedArgs }`.

### E. The action running — `ToolCall`, `ImageGallery`

After approval, the call appears as a running `ToolCall` under the card and completes or fails in place; a denial records it as denied. A `tool-result` whose `content` is a list of text and image parts draws as text and an `ImageGallery` in the output, not as JSON.

### F. Outcome — `ChatMessage`, `Button`

A new response that says what changed (or that nothing ran), with Copy and Read aloud in its actions. When the approved action fails or is stopped, the response says what failed and that the previous version still serves, and an outlined `Button` beside Copy runs the action again, named for it: the tool's `approveLabel` plus `again` (`Deploy again`), `Retry` only for a tool with no verb, so one tap never re-runs an approved production change behind a bare word; an action never ends in silence. The retried call should come back as a new approval card: the earlier approval covered one run.

### G. Questions and failed decisions — `AgentQuestion`, `Alert`

A pending generic interrupt is an `AgentQuestion` after the conversation: its `message` is the question, `metadata.options` (or `payload.options`) the choices, else a text field; Submit calls `resolveInterrupt(answer)` and Skip calls `cancel()`. An `unbound` interrupt (an approval a workflow engine owns, which the chat cannot resolve) is asked the same way without Skip, and Submit emits `answer-interrupt` so the app sends the answer to its owner. When `interruptErrors` holds a decision that was not sent, a danger `Alert` above the composer says Your decision was not sent with its reason, and Retry (shown when one is retryable) emits `retry-interrupts`.

### H. Structured answers — `CodeBlock`, `Alert`

A `structured-output` part draws as a JSON `CodeBlock`: the progressive `partial` (else `raw`) while it streams, `data` once complete; on `error` a danger `Alert` says The structured answer failed with its `errorMessage`.

## Data

The block draws a conversation in the message shape of TanStack AI: each message has an `id`, a `role` and its `parts` in order (`text`, `thinking`, `tool-call`, `tool-result`, `structured-output`), so the values `useChat` from `@tanstack/ai-vue` returns go straight into its props, with no conversion. The block calls no model and runs no AI library; `@aziontech/webkit/utils/ai-chat` names TanStack AI's own message types, imported from `@tanstack/ai` as types only (an optional peer, `^1.5.0`), with the helpers that read them (`AiChatMessage`, `AiChatPart`, `AiChatTool`, `AiChatInterrupt`; import the types from there), so the shape follows TanStack when you update it, and any source that produces it works. Parts it does not draw (images, audio) are skipped. `sample.ts` holds the sample threads the variants pass. The draft in the composer stays local.

What TanStack AI does not carry, the app adds in `metadata`: `sources` (the documents the response cites, numbered in order), `reasoningSeconds` (left out, the block measures the thinking time) and `stopped` (the block also marks the response that Stop ended). A message's time is its `createdAt`, formatted in the reader's locale.

| Prop              | Type                           | What it does                                                                                                                                                                                            |
| ----------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `messages`        | `AiChatMessage[]`              | The conversation, oldest first, as `useChat` returns it. Left out, the sample deployment renders.                                                                                                       |
| `loading`         | `boolean`                      | `isLoading` from `useChat`: the last response thinks, then streams, and the composer shows Stop.                                                                                                        |
| `error`           | `string \| Error`              | `error` from `useChat` shows the standard sentence on the last response with Try again; a string shows that sentence instead.                                                                           |
| `tools`           | `Record<string, AiChatTool>`   | How each tool reads, by name: `title` for the call, `question`, `description`, `approveLabel`, `variant`, `confirmationPhrase` and `editable` for its approval card.                                    |
| `interrupts`      | `interrupts` of `useChat`      | The pending approvals and questions; the approve button and Deny resolve the one whose `toolCallId` matches the call, a generic one asks its question, and an unbound one asks it for the app to route. |
| `interruptErrors` | `interruptErrors` of `useChat` | Decisions that were not sent: an alert with the reason, and Retry when one is retryable.                                                                                                                |
| `attachable`      | `boolean`                      | The Attach "+" at the start of the composer; `send` then hands over multimodal content. Default `true`.                                                                                                 |

| Event              | Payload                     | When                                                                                                                                              |
| ------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `send`             | `(event, content)`          | The composer: call `sendMessage(content)`. `content` is the text, or with attachments `{ content: parts }`.                                       |
| `stop`             | `(event)`                   | Stop while the response streams: call `stop()`. The block marks the stopped response.                                                             |
| `retry`            | `(event, message)`          | Try again or Regenerate response: call `reload()`.                                                                                                |
| `approve`          | `(event, call, input?)`     | The approve button on an approval card; `input` is the edited arguments of an `editable` tool. The block already resolved the matching interrupt. |
| `deny`             | `(event, call)`             | Deny on an approval card; the block already resolved the matching interrupt.                                                                      |
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

  import AiActionApproval from './ai-action-approval.vue'

  const {
    messages,
    isLoading,
    error,
    interrupts,
    interruptErrors,
    sendMessage,
    retryInterrupts,
    stop,
    reload
  } = useChat({
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
    :interrupt-errors="interruptErrors"
    @send="(_event, content) => sendMessage(content)"
    @retry-interrupts="retryInterrupts()"
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
- **Decision not sent:** `Your decision was not sent` with the reason and Retry.
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
- Questions and failed decisions: a generic or unbound interrupt asks its `AgentQuestion` after the conversation; `interruptErrors` shows the alert with Retry.
- Error: the approved call in `error` with its `tool-result` error, and a report that says what failed and that `b-4790` still serves, with Deploy again.

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
- `Error` — The approved deployment fails: the deployment call reads failed, and the assistant says what failed and that production still serves the previous version, with Deploy again (the action named, never a bare Retry) beside Copy.

Each variant is the same screen in another state: `get_block("ai/ai-action-approval", { variant })`, or the file under `blocks/ai/ai-action-approval/variants/`.

## Code (`Pending`)

```vue
<script setup lang="ts">
  import AgentQuestion from '@aziontech/webkit/agent-question'
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import ChatMessage, { type ChatMessageStatus } from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import ImageGallery from '@aziontech/webkit/image-gallery'
  import type { PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import ToolCall from '@aziontech/webkit/tool-call'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import {
    type AiChatInterrupt,
    type AiChatInterruptError,
    type AiChatMessage,
    type AiChatQuestion,
    type AiChatSendContent,
    type AiChatTool,
    type AiChatToolCallPart,
    answerInterrupt,
    approvalOf,
    hasAnswer,
    hasText,
    interruptErrorText,
    isQuestion,
    isToolCallPart,
    isToolResultPart,
    json,
    needsApproval,
    parsesAsJson,
    questionOf,
    resolveInterrupt,
    segmentsOf,
    skipInterrupt,
    structuredOf,
    textOf,
    toolContentOf,
    toolStatusOf
  } from '@aziontech/webkit/utils/ai-chat'
  import { computed, ref } from 'vue'

  import AiActionApprovalComposer from './parts/ai-action-approval-composer.vue'
  import { sampleMessages, sampleTools } from './sample'

  export interface AiActionApprovalProps {
    /** The conversation, oldest first, as TanStack AI's `useChat` returns `messages`. Left out, the sample deployment renders. */
    messages?: ReadonlyArray<AiChatMessage>
    /** The assistant is responding or an approved call runs, as `useChat` returns `isLoading`. */
    loading?: boolean
    /** Why the last response failed: a sentence, or the `error` of `useChat`, which shows the standard sentence. */
    error?: string | { message: string } | null
    /** How each tool reads, by tool name: the call's title, the approval question, its verb and whether it is irreversible. */
    tools?: Record<string, AiChatTool>
    /** Pending requests, as `useChat` returns `interrupts`; the approve button and Deny resolve the matching one, a generic one asks its question, and an unbound one asks it for the app to route. */
    interrupts?: ReadonlyArray<AiChatInterrupt>
    /** Why the decisions were not sent, as `useChat` returns `interruptErrors`; a retryable one offers Retry. */
    interruptErrors?: ReadonlyArray<AiChatInterruptError>
    /** The reader may attach images and PDFs (up to 4, 10 MB each) from the Attach control at the start of the composer; `send` then hands over the multimodal content `sendMessage` takes. */
    attachable?: boolean
  }

  const props = withDefaults(defineProps<AiActionApprovalProps>(), {
    messages: undefined,
    loading: false,
    error: '',
    tools: undefined,
    interrupts: () => [],
    interruptErrors: () => [],
    attachable: true
  })

  const emit = defineEmits<{
    approve: [event: MouseEvent, call: AiChatToolCallPart, input?: unknown]
    deny: [event: MouseEvent, call: AiChatToolCallPart]
    stop: [event: MouseEvent]
    retry: [event: MouseEvent, message: AiChatMessage]
    send: [event: MouseEvent | KeyboardEvent, content: AiChatSendContent]
    'answer-interrupt': [event: Event, interrupt: AiChatInterrupt, value: string]
    'retry-interrupts': [event: MouseEvent]
  }>()

  const { formatDate } = useLocale()

  const edits = ref<Record<string, string>>({})
  const answers = ref<Record<string, string>>({})
  const settled = ref<Record<string, AiChatQuestion>>({})
  const routed = ref<Record<string, boolean>>({})

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

  function statusOf(turn: AiChatMessage): ChatMessageStatus {
    if (turn.role === 'user' || turn !== last.value) return 'success'
    if (failure.value) return 'error'
    if (props.loading && !runs(turn)) return hasAnswer(turn) ? 'streaming' : 'pending'
    return 'success'
  }

  function runs(turn: AiChatMessage): boolean {
    return turn.parts.some(
      (part) =>
        isToolCallPart(part) &&
        ['running', 'streaming'].includes(toolStatusOf(part)) &&
        (!needsApproval(part) || approvalOf(part) === 'approved')
    )
  }

  function failedCall(turn: AiChatMessage): AiChatToolCallPart | undefined {
    const results = turn.parts.filter(isToolResultPart)
    return turn.parts.find(
      (part): part is AiChatToolCallPart =>
        isToolCallPart(part) &&
        toolStatusOf(
          part,
          results.find((result) => result.toolCallId === part.id)
        ) === 'error'
    )
  }

  function retryLabelOf(turn: AiChatMessage): string {
    const call = failedCall(turn)
    const verb = call ? toolOf(call).approveLabel : ''
    return verb ? `${verb} again` : 'Retry'
  }

  const state = computed<PromptInputStatus>(() => {
    if (!props.loading) return 'ready'
    return last.value?.role === 'assistant' && (hasAnswer(last.value) || runs(last.value))
      ? 'streaming'
      : 'pending'
  })

  function timeOf(turn: AiChatMessage): string {
    return turn.createdAt ? formatDate(turn.createdAt, { hour: '2-digit', minute: '2-digit' }) : ''
  }

  function toolOf(call: AiChatToolCallPart): AiChatTool {
    return toolLabels.value[call.name] ?? { title: '' }
  }

  function editOf(call: AiChatToolCallPart): string {
    return edits.value[call.id] ?? json(call.input ?? call.arguments)
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

  const pendingQuestions = computed(() => props.interrupts.filter(isQuestion))
  const retryable = computed(() => props.interruptErrors.some((error) => error.retryable !== false))

  const questions = computed(() => {
    const live = pendingQuestions.value
      .map(questionOf)
      .map((question) =>
        !question.bound && routed.value[question.id]
          ? { ...question, status: 'running' as const }
          : question
      )
    const ids = new Set(live.map((question) => question.id))
    return [...live, ...Object.values(settled.value).filter((question) => !ids.has(question.id))]
  })

  function answer(event: Event, question: AiChatQuestion, value: string) {
    const interrupt = pendingQuestions.value.find((item) => item.id === question.id)
    settled.value[question.id] = { ...question, status: 'success', error: '' }
    if (question.bound) {
      answerInterrupt(interrupt, value)
    } else {
      routed.value[question.id] = true
      if (interrupt) emit('answer-interrupt', event, interrupt, value)
    }
  }

  function skip(question: AiChatQuestion) {
    const interrupt = pendingQuestions.value.find((item) => item.id === question.id)
    settled.value[question.id] = { ...question, status: 'skipped', error: '' }
    skipInterrupt(interrupt)
  }
</script>

<template>
  <section
    aria-labelledby="ai-approval-title"
    class="flex min-h-0 w-full grow basis-0 flex-col"
  >
    <header class="px-(--spacing-md) py-(--spacing-sm)">
      <h1
        id="ai-approval-title"
        class="text-label-md text-(--text-default)"
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
                    !segment.result?.error &&
                    segment.call.output === undefined &&
                    toolContentOf(segment.result?.content)
                  "
                  #output
                >
                  <p
                    v-if="toolContentOf(segment.result?.content)?.text"
                    class="whitespace-pre-line text-body-sm text-(--text-default)"
                  >
                    {{ toolContentOf(segment.result?.content)?.text }}
                  </p>
                  <ImageGallery
                    v-if="toolContentOf(segment.result?.content)?.images.length"
                    :items="toolContentOf(segment.result?.content)?.images ?? []"
                  />
                </template>
                <template
                  v-else-if="
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
          <ChatMessage.Actions
            copyable
            show-read-aloud
            :copy-text="textOf(turn)"
            :read-aloud-text="textOf(turn)"
          >
            <Button
              v-if="turn === last && failedCall(turn)"
              :label="retryLabelOf(turn)"
              variant="outline"
              size="small"
              icon="az az-refresh"
              @click="emit('retry', $event, turn)"
            />
          </ChatMessage.Actions>
        </template>
      </ChatMessage>
      <ChatMessage
        v-if="questions.length"
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
          @submit="(event, value) => answer(event, question, value)"
          @skip="skip(question)"
        />
      </ChatMessage>
      <template #composer>
        <Alert
          v-if="interruptErrors.length"
          severity="danger"
          size="small"
          title="Your decision was not sent"
          :action-label="retryable ? 'Retry' : ''"
          @action="emit('retry-interrupts', $event)"
        >
          {{ interruptErrorText(interruptErrors) }}
        </Alert>
        <AiActionApprovalComposer
          :state="state"
          :attachable="attachable"
          @send="(event, content) => emit('send', event, content)"
          @stop="emit('stop', $event)"
        />
      </template>
    </Conversation>
  </section>
</template>
```

## `sample.ts`

```ts
import type {
  AiChatMessage,
  AiChatPart,
  AiChatTool,
  AiChatToolCallPart
} from '@aziontech/webkit/utils/ai-chat'

const at = (time: string): Date => new Date(`2026-11-19T${time}:00`)

const request = (id: string, text: string): AiChatMessage => ({
  id,
  role: 'user',
  parts: [{ type: 'text', content: text }],
  createdAt: at('15:02')
})

const response = (id: string, parts: AiChatPart[]): AiChatMessage => ({
  id,
  role: 'assistant',
  parts,
  createdAt: at('15:02')
})

const deployInput = { workload: 'storefront', build: 'b-4821', environment: 'production' }

const readBuild: AiChatToolCallPart = {
  type: 'tool-call',
  id: 'call-build',
  name: 'get_build',
  arguments: JSON.stringify({ workload: 'storefront' }),
  input: { workload: 'storefront' },
  state: 'complete',
  output: { build: 'b-4821', checks: 'passed', finishedAt: '14:56' }
}

const explanation: AiChatPart = {
  type: 'text',
  content: 'Build `b-4821` passed its checks 6 minutes ago. Deploying it needs your approval.'
}

const deploy = (state: AiChatToolCallPart['state'], approved?: boolean): AiChatToolCallPart => ({
  type: 'tool-call',
  id: 'call-deploy',
  name: 'deploy_workload',
  arguments: JSON.stringify(deployInput),
  input: deployInput,
  state,
  approval: { id: 'approval-deploy', needsApproval: true, approved }
})

const deployRequest = request('m1', 'Deploy the current build of storefront to production')

export const sampleTools: Record<string, AiChatTool> = {
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

export const sampleMessages: AiChatMessage[] = [
  deployRequest,
  response('m2', [readBuild, explanation, deploy('approval-requested')])
]

export const sampleRunningMessages: AiChatMessage[] = [
  deployRequest,
  response('m2', [readBuild, explanation, deploy('approval-responded', true)])
]

export const sampleApprovedMessages: AiChatMessage[] = [
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

export const sampleDeniedMessages: AiChatMessage[] = [
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

export const sampleFailedMessages: AiChatMessage[] = [
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

export const sampleDeleteMessages: AiChatMessage[] = [
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

## `parts/ai-action-approval-composer.vue`

```ts
<script setup lang="ts">
  import type { PromptInputFile, PromptInputStatus } from '@aziontech/webkit/prompt-input'
  import PromptInputAttachButton from '@aziontech/webkit/prompt-input-attach-button'
  import PromptInputDictateButton from '@aziontech/webkit/prompt-input-dictate-button'
  import PromptInput from '@aziontech/webkit/prompt-input-root'
  import { type AiChatSendContent, contentOf } from '@aziontech/webkit/utils/ai-chat'
  import { ref } from 'vue'

  const props = defineProps<{
    state: PromptInputStatus
    attachable: boolean
  }>()

  const emit = defineEmits<{
    send: [event: MouseEvent | KeyboardEvent, content: AiChatSendContent]
    stop: [event: MouseEvent]
  }>()

  const prompt = ref('')
  const files = ref<PromptInputFile[]>([])

  async function send(event: MouseEvent | KeyboardEvent, text: string) {
    const attached = files.value
    const picked = attached.flatMap((item) => (item.file instanceof File ? [item.file] : []))
    if ((!text.trim() && !picked.length) || props.state !== 'ready') return
    prompt.value = ''
    files.value = []
    try {
      emit('send', event, await contentOf(text, picked))
    } catch {
      prompt.value = text
      files.value = attached
    }
  }
</script>

<template>
  <PromptInput
    v-model="prompt"
    v-model:files="files"
    :status="state"
    :max-files="4"
    :max-file-size="10485760"
    accept="image/*,application/pdf"
    @submit="(event, { value }) => send(event, value)"
    @stop="emit('stop', $event)"
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
    <template #hint>The assistant runs nothing in your account without your approval.</template>
  </PromptInput>
</template>
```

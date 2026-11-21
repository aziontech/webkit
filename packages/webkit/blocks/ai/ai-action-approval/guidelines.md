# AI action approval

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

### E. The action running — `ToolCall`, `ImageGallery`

After approval, the call appears as a running `ToolCall` under the card and completes or fails in place; a denial records it as denied. A `tool-result` whose `content` is a list of text and image parts draws as text and an `ImageGallery` in the output, not as JSON.

### F. Outcome — `ChatMessage`, `CopyButton`, `Button`

A new response that says what changed (or that nothing ran), with Copy in its actions. When the approved action fails or is stopped, the response says what failed and that the previous version still serves, and an outlined Retry `Button` beside Copy runs the action again; an action never ends in silence.

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

| Event              | Payload                     | When                                                                                                                                              |
| ------------------ | --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------- |
| `send`             | `(event, text)`             | The composer: call `sendMessage(text)`.                                                                                                           |
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
    @send="(_event, text) => sendMessage(text)"
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
- Error: the approved call in `error` with its `tool-result` error, and a report that says what failed and that `b-4790` still serves, with Retry.

## Related

- `ai/ai-chat` — the conversation this card lives in.
- `ai/ai-chat-drawer` — the same flow in a drawer over a resource page.
- `edit/edit-delete-dialog` — confirming a destructive action the reader started.
- `skills/webkit-ai-surfaces` — when to ask, what to show and how to record the outcome.

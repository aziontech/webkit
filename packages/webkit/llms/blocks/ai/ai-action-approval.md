# AiActionApproval (`ai/ai-action-approval`)

> A user-authorized action inside a generative AI conversation: the reader asks the assistant to deploy, the assistant records the read-only call it made (`ToolCall`), explains in `StreamingResponse` and proposes the deployment as an `ToolApproval` card whose title names the command in code, whose body shows the exact command in a `CodeBlock`, and whose Deny and Deploy buttons decide. Approving turns the card into Approved and adds a running `ToolCall` that completes, followed by a `ChatMessage` that reports what changed with Copy (`CopyButton`); denying or letting the request expire records the outcome on the card and the assistant says nothing ran. The `PromptInput` shows Stop while the approved action runs. Built from `Conversation`, `ChatMessage`, `ToolCall`, `StreamingResponse`, `ToolApproval`, `CodeBlock`, `CopyButton` and `PromptInput`. A page body for ConsoleLayout that fills its content region.

- Surface: app
- Source: `blocks/ai/ai-action-approval/ai-action-approval.vue` in `@aziontech/webkit`
- MCP: `get_block("ai/ai-action-approval")`
- Components: [Button](../../components/button.md), [ChatMessage](../../components/chat-message.md), [CodeBlock](../../components/code-block.md), [Conversation](../../components/conversation.md), [CopyButton](../../components/copy-button.md), [PromptInput](../../components/prompt-input.md), [StreamingResponse](../../components/streaming-response.md), [ToolApproval](../../components/tool-approval.md), [ToolCall](../../components/tool-call.md)
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
- A destructive action the reader started from the UI, not the assistant: use `ConfirmDialog` (see `edit/delete-dialog`).
- Several fields to fill before acting: link to the create or edit page; the card only approves or denies.

## Building blocks

### A. Conversation frame — `Conversation`, `PromptInput`

The thread and its composer, as in `ai/ai-chat`. While an approved action runs, the composer shows Stop, which cancels it and marks the call failed.

### B. Request — `ChatMessage`

The reader's request at the inline end, in their words.

### C. What the assistant checked — `ToolCall`, `StreamingResponse`

Each read-only call it made, as a completed `ToolCall` with the tool name in code and a plain description, then one or two sentences on what it found and why it needs approval.

### D. Authorization card — `ToolApproval`, `CodeBlock`

The question names the action and its target, with the command or tool in code. The description says what changes and what stays. The body is the exact command in a `CodeBlock`. Deny (outlined) and the approve button, labelled with the verb of the title (Deploy, Delete), sit at the inline end. For irreversible actions use `variant="danger"` and `confirmation-phrase` with the resource name. After a decision the buttons give way to Approved, Denied or Request expired.

### E. The action running — `ToolCall`

After approval, the call appears as a running `ToolCall` under the card and completes or fails in place; a denial records it as denied.

### F. Outcome — `ChatMessage`, `CopyButton`, `Button`

A new response that says what changed (or that nothing ran), with Copy in its actions. When the approved action fails or is stopped, the response says what failed and that the previous version still serves, and an outlined Retry `Button` beside Copy runs the action again; an action never ends in silence.

## Data

The block takes the proposed action and its outcome through props and emits every decision; it runs nothing. `AiActionApprovalAction`, `AiActionApprovalOutcome` and `AiActionApprovalProps` are exported from `ai-action-approval.vue`, and `sample.ts` holds the sample deployment the block renders when `action` is left out.

| Prop               | Type                      | What it does                                                                                                                                                                                     |
| ------------------ | ------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `action`           | `AiActionApprovalAction`  | The request, the read-only call, the explanation, the card (title, description, verb, command) and the call to run. Set `variant: 'danger'` and `confirmationPhrase` for an irreversible action. |
| `v-model:decision` | `ToolApprovalStatus`      | `pending`, `approved`, `denied` or `expired`. Deny and the approve button set it; pass `expired` when the request times out.                                                                     |
| `run`              | `ToolCallStatus \| ''`    | Where the approved call stands: `running` (the composer shows Stop), `success`, `error` (Retry shows). Empty before it starts; a denial records the call as denied.                              |
| `outcome`          | `AiActionApprovalOutcome` | The assistant's report after the decision, with its time.                                                                                                                                        |

| Event     | Payload           | When                                                         |
| --------- | ----------------- | ------------------------------------------------------------ |
| `approve` | `(event, action)` | The approve button; the card reads Approved. Start the call. |
| `deny`    | `(event, action)` | Deny; the card reads Denied.                                 |
| `stop`    | `(event, action)` | Stop in the composer while the call runs.                    |
| `retry`   | `(event, action)` | Retry beside Copy after a failed or stopped run.             |
| `send`    | `(event, text)`   | The reader sent a message from the composer.                 |

To go live, let the page own the decision and the call:

```vue
<script setup lang="ts">
  import AiActionApproval from './ai-action-approval.vue'

  const { action, decision, run, outcome, start, cancel } = useAgentAction()
</script>

<template>
  <AiActionApproval
    v-model:decision="decision"
    :action="action"
    :run="run"
    :outcome="outcome"
    @approve="start"
    @retry="start"
    @stop="cancel"
  />
</template>
```

Then delete `sample.ts` and its import.

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
- **Outcomes:** Approved, Denied, Request expired (built in).
- **Assistant after a denial:** "Got it, nothing was deployed."; **after expiry:** "This request expired. Nothing was deployed."
- Follow `skills/webkit-microcopy`: sentence case, no "please", present tense.

## Accessibility

- The card is a group named by its title and described by its description; it does not trap or take focus.
- Outcomes are text announced through a polite live region; status color is never the only signal.
- Tool calls announce their status changes (Running, Completed, Failed) through `StatusIndicator`.
- The typed confirmation has a visible label; Approve is disabled until it matches.
- Keyboard order: request, tool calls, response text, command, phrase field, Deny, approve.

## States

- Pending: the deployment waiting for Deny or Deploy (`decision` left at `pending`); Deploy emits `approve` and the page runs the call.
- Irreversible: a domain deletion (an `action` with `variant: 'danger'` and `confirmationPhrase`) that needs the domain name typed before Delete enables.
- Approved: `decision="approved"`, `run="success"` and the assistant's report as `outcome`.
- Denied: `decision="denied"`, `run="denied"` and the assistant's acknowledgement as `outcome`.
- Expired: `decision="expired"` and an `outcome` that says nothing ran.
- Error: `decision="approved"`, `run="error"` and an `outcome` that says what failed and that `b-4790` still serves, with Retry.

## Related

- `ai/ai-chat` — the conversation this card lives in.
- `ai/ai-chat-drawer` — the same flow in a drawer over a resource page.
- `edit/delete-dialog` — confirming a destructive action the reader started.
- `skills/webkit-ai-surfaces` — when to ask, what to show and how to record the outcome.

## Variants

- `Pending` — primary (the code below)
- `Irreversible` — The assistant proposes deleting a domain nobody uses: the card turns danger and Delete stays disabled until the reader types the domain name.
- `Approved` — After Deploy: the card reads Approved, the deployment call completed, and the assistant reports the new build is live with the previous one kept for rollback.
- `Denied` — After Deny: the card reads Denied, the deployment call is recorded as denied, and the assistant acknowledges that nothing was deployed.
- `Expired` — Nobody decided in time: the card reads Request expired and the assistant says nothing was deployed.
- `Error` — The approved deployment fails: the deployment call reads failed, and the assistant says what failed and that production still serves the previous version, with Retry beside Copy.

Each variant is the same screen in another state: `get_block("ai/ai-action-approval", { variant })`, or the file under `blocks/ai/ai-action-approval/variants/`.

## Code (`Pending`)

```vue
<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import PromptInput from '@aziontech/webkit/prompt-input'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import ToolApproval, {
    type ToolApprovalStatus,
    type ToolApprovalVariant
  } from '@aziontech/webkit/tool-approval'
  import ToolCall, { type ToolCallStatus } from '@aziontech/webkit/tool-call'
  import { computed, ref } from 'vue'

  import { sampleAction } from './sample'

  /** A tool call the assistant makes, as the conversation records it. */
  export interface AiActionApprovalCall {
    /** The tool name, shown in code. */
    name: string
    /** What the call does, in plain words. */
    title: string
  }

  /** The action the assistant proposes and the conversation that led to it. */
  export interface AiActionApprovalAction {
    /** The reader's request, in their words. */
    request: string
    /** When the reader asked and the assistant answered, already formatted. */
    time: string
    /** The read-only call the assistant made before asking. */
    check: AiActionApprovalCall
    /** What the assistant found and why it needs approval, in Markdown. */
    explanation: string
    /** The question on the card, naming the action with the command in code. */
    title: string
    /** What changes and what stays. */
    description: string
    /** The approve button label, the verb of the title. */
    approveLabel: string
    /** The exact command that runs once approved. */
    command: string
    /** Danger for an irreversible action. */
    variant?: ToolApprovalVariant
    /** The phrase the reader types before an irreversible action enables. */
    confirmationPhrase?: string
    /** The call that runs once approved. */
    run: AiActionApprovalCall
  }

  /** The assistant's report once the action was decided or ran. */
  export interface AiActionApprovalOutcome {
    /** What changed, or that nothing ran, in Markdown. */
    content: string
    /** When the assistant reported, already formatted. */
    time: string
  }

  export interface AiActionApprovalProps {
    /** The proposed action. Left out, the sample deployment renders. */
    action?: AiActionApprovalAction
    /** Where the approved call stands (running, success, error); empty before it starts. */
    run?: ToolCallStatus | ''
    /** The assistant's report after the decision; a failed run shows Retry beside Copy. */
    outcome?: AiActionApprovalOutcome
  }

  const props = withDefaults(defineProps<AiActionApprovalProps>(), {
    action: undefined,
    run: '',
    outcome: undefined
  })

  const emit = defineEmits<{
    approve: [event: MouseEvent, action: AiActionApprovalAction]
    deny: [event: MouseEvent, action: AiActionApprovalAction]
    stop: [event: MouseEvent, action: AiActionApprovalAction]
    retry: [event: MouseEvent, action: AiActionApprovalAction]
    send: [event: MouseEvent | KeyboardEvent, text: string]
  }>()

  /** The decision on the card; Deny or the approve button sets it and emits. */
  const decision = defineModel<ToolApprovalStatus>('decision', { default: 'pending' })

  const prompt = ref('')

  const current = computed(() => props.action ?? sampleAction)
  const runStatus = computed<ToolCallStatus | ''>(
    () => props.run || (decision.value === 'denied' ? 'denied' : '')
  )
  const followUp = computed(() => props.outcome?.content ?? '')
  const composerState = computed(() =>
    decision.value === 'approved' && runStatus.value === 'running' ? 'streaming' : 'ready'
  )

  function approve(event: MouseEvent) {
    decision.value = 'approved'
    emit('approve', event, current.value)
  }

  function deny(event: MouseEvent) {
    decision.value = 'denied'
    emit('deny', event, current.value)
  }

  function send(event: MouseEvent | KeyboardEvent, value: string) {
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
        from="user"
        :timestamp="current.time"
      >
        {{ current.request }}
      </ChatMessage>
      <ChatMessage :timestamp="current.time">
        <ToolCall
          :name="current.check.name"
          :title="current.check.title"
          status="success"
        />
        <StreamingResponse :content="current.explanation" />
        <ToolApproval
          :title="current.title"
          :description="current.description"
          :approve-label="current.approveLabel"
          :variant="current.variant"
          :confirmation-phrase="current.confirmationPhrase"
          :status="decision"
          @approve="approve"
          @deny="deny"
        >
          <CodeBlock
            :tabs="[{ label: 'Shell', value: 'command', code: current.command, language: 'bash' }]"
            :show-line-numbers="false"
          />
        </ToolApproval>
        <ToolCall
          v-if="runStatus"
          :name="current.run.name"
          :title="current.run.title"
          :status="runStatus"
        />
      </ChatMessage>
      <ChatMessage
        v-if="followUp"
        :timestamp="outcome?.time"
      >
        <StreamingResponse :content="followUp" />
        <template #actions>
          <ChatMessage.Actions>
            <CopyButton
              size="small"
              :value="followUp"
            />
            <Button
              v-if="runStatus === 'error'"
              label="Retry"
              variant="outline"
              size="small"
              icon="az az-refresh"
              @click="emit('retry', $event, current)"
            />
          </ChatMessage.Actions>
        </template>
      </ChatMessage>
    </Conversation>
    <footer class="layout-column-content layout-boundary-inline pb-(--spacing-md)">
      <PromptInput
        v-model="prompt"
        :status="composerState"
        @submit="(event, { value }) => send(event, value)"
        @stop="emit('stop', $event, current)"
      >
        <template #hint>
          The assistant runs nothing in your account without your approval.
        </template>
      </PromptInput>
    </footer>
  </section>
</template>
```

## `sample.ts`

```ts
import type { AiActionApprovalAction, AiActionApprovalOutcome } from './ai-action-approval.vue'

export const sampleAction: AiActionApprovalAction = {
  request: 'Deploy the current build of storefront to production',
  time: '15:02',
  check: { name: 'get_build', title: 'Reading the latest build of storefront' },
  explanation: 'Build `b-4821` passed its checks 6 minutes ago. Deploying it needs your approval.',
  title: 'Allow `azion deploy --env production`?',
  description:
    'Deploys build `b-4821` of storefront to production. The current version stays available for rollback.',
  approveLabel: 'Deploy',
  command: 'azion deploy --workload storefront --build b-4821 --env production',
  run: { name: 'deploy_workload', title: 'Deploying storefront to production' }
}

export const sampleDeleteAction: AiActionApprovalAction = {
  request: 'Delete the domain old.example.com, nobody uses it anymore',
  time: '15:02',
  check: { name: 'get_domain_traffic', title: 'Reading the traffic of old.example.com' },
  explanation:
    'old.example.com had no requests in the last 30 days. Deleting it needs your approval, and you need to type its name.',
  title: 'Delete the domain `old.example.com`?',
  description:
    'The domain stops answering at once and its certificate is revoked. This cannot be undone.',
  approveLabel: 'Delete',
  command: 'azion delete domain --name old.example.com',
  variant: 'danger',
  confirmationPhrase: 'old.example.com',
  run: { name: 'delete_domain', title: 'Deleting old.example.com' }
}

export const sampleOutcomes: Record<
  'approved' | 'denied' | 'expired' | 'stopped' | 'failed',
  AiActionApprovalOutcome
> = {
  approved: {
    content:
      'storefront is live on production with build `b-4821`. The previous version `b-4790` stays available for rollback.',
    time: '15:04'
  },
  denied: {
    content: 'Got it, nothing was deployed. Build `b-4821` stays ready if you change your mind.',
    time: '15:04'
  },
  expired: { content: 'This request expired. Nothing was deployed.', time: '15:04' },
  stopped: {
    content:
      'You stopped the deployment before it finished. Production still serves the previous version `b-4790`.',
    time: '15:04'
  },
  failed: {
    content:
      'The deployment of build `b-4821` failed while uploading the build to the edge. Nothing changed: production still serves the previous version `b-4790`.',
    time: '15:04'
  }
}
```

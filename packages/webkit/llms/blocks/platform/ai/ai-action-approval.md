# AiActionApproval (`platform/ai/ai-action-approval`)

> A user-authorized action inside a generative AI conversation: the reader asks the assistant to deploy, the assistant records the read-only call it made (`ToolCall`), explains in `StreamingResponse` and proposes the deployment as an `ActionConfirmation` card whose title names the command in code, whose body shows the exact command in a `CodeBlock`, and whose Deny and Deploy buttons decide. Approving turns the card into Approved and adds a running `ToolCall` that completes, followed by a `ChatMessage` that reports what changed with Copy (`CopyButton`); denying or letting the request expire records the outcome on the card and the assistant says nothing ran. The `PromptInput` shows Stop while the approved action runs. Built from `Conversation`, `ChatMessage`, `ToolCall`, `StreamingResponse`, `ActionConfirmation`, `CodeBlock`, `CopyButton` and `PromptInput`. A page body for ConsoleLayout that fills its content region.

- Surface: product
- Source: `blocks/platform/ai/ai-action-approval/ai-action-approval.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/ai/ai-action-approval")`
- Components: [ActionConfirmation](../../../components/action-confirmation.md), [ChatMessage](../../../components/chat-message.md), [CodeBlock](../../../components/code-block.md), [Conversation](../../../components/conversation.md), [CopyButton](../../../components/copy-button.md), [PromptInput](../../../components/prompt-input.md), [StreamingResponse](../../../components/streaming-response.md), [ToolCall](../../../components/tool-call.md)
- Skills: `webkit-genai`, `webkit-ui-states`, `webkit-errors`

## Asked as

ai action approval; approve ai action; user authorized action; agent asks permission; human in the loop; tool call approval; confirm agent command; allow tool; aprovar ação da ia; autorizar ação do agente; confirmar comando; aprobar acción de la ia

The moment an assistant needs permission. The reader asked for something that changes their account — a deployment, a purge, a deletion — and the assistant stops before doing it: it says what it found, shows exactly what will run, and waits for Approve or Deny. The decision stays in the thread as text, and the assistant reports what happened next, so the conversation is also the record of what ran and who allowed it. It is a page body for `ConsoleLayout`: it fills the layout's content region (`grow basis-0 min-h-0`, never `h-dvh`), so only the log scrolls, and the layout owns the rail, the header and the `main`.

## When to use

- The assistant is about to call a tool or run a command with side effects: deploy, purge, change a rule, delete.
- A one-time decision about a consequential action, made inside the conversation.
- An irreversible action: add a typed confirmation to the card.

## When not to use

- Read-only calls (listing, reading metrics): record them with `ToolCall` and continue without asking.
- Tools the reader already allowed for this conversation: record the call, do not ask again.
- A destructive action the reader started from the UI, not the assistant: use `ConfirmDialog` (see `platform/delete/delete-with-confirmation`).
- Several fields to fill before acting: link to the create or edit page; the card only approves or denies.

## Building blocks

### A. Conversation frame — `Conversation`, `PromptInput`

The thread and its composer, as in `platform/ai/ai-chat`. While an approved action runs, the composer shows Stop, which cancels it and marks the call failed.

### B. Request — `ChatMessage`

The reader's request at the inline end, in their words.

### C. What the assistant checked — `ToolCall`, `StreamingResponse`

Each read-only call it made, as a completed `ToolCall` with the tool name in code and a plain description, then one or two sentences on what it found and why it needs approval.

### D. Authorization card — `ActionConfirmation`, `CodeBlock`

The question names the action and its target, with the command or tool in code. The description says what changes and what stays. The body is the exact command in a `CodeBlock`. Deny (outlined) and the approve button, labelled with the verb of the title (Deploy, Delete), sit at the inline end. For irreversible actions use `kind="danger"` and `confirmation-phrase` with the resource name. After a decision the buttons give way to Approved, Denied or Request expired.

### E. The action running — `ToolCall`

After approval, the call appears as a running `ToolCall` under the card and completes or fails in place; a denial records it as denied.

### F. Outcome — `ChatMessage`, `CopyButton`

A new response that says what changed (or that nothing ran), with Copy in its actions.

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

- Pending: the deployment waiting for Deny or Deploy; approving runs the deployment to completion.
- Irreversible: a domain deletion that needs the domain name typed before Delete enables.
- Approved: the card approved, the deployment completed and the assistant's report.
- Denied: the card denied, the call recorded as denied and the assistant's acknowledgement.
- Expired: the request expired and the assistant says nothing ran.

## Related

- `platform/ai/ai-chat` — the conversation this card lives in.
- `platform/ai/ai-chat-drawer` — the same flow in a drawer over a resource page.
- `platform/delete/delete-with-confirmation` — confirming a destructive action the reader started.
- `skills/webkit-genai` — when to ask, what to show and how to record the outcome.

## Variants

- `Pending` — primary (the code below)
- `Irreversible` — The assistant proposes deleting a domain nobody uses: the card turns danger and Delete stays disabled until the reader types the domain name.
- `Approved` — After Deploy: the card reads Approved, the deployment call completed, and the assistant reports the new build is live with the previous one kept for rollback.
- `Denied` — After Deny: the card reads Denied, the deployment call is recorded as denied, and the assistant acknowledges that nothing was deployed.
- `Expired` — Nobody decided in time: the card reads Request expired and the assistant says nothing was deployed.

Each variant is the same screen in another state: `get_pattern("platform/ai/ai-action-approval", { variant })`, or the file under `blocks/platform/ai/ai-action-approval/variants/`.

## Code (`Pending`)

```vue
<script setup lang="ts">
  import ActionConfirmation, {
    type ActionConfirmationState
  } from '@aziontech/webkit/action-confirmation'
  import ChatMessage from '@aziontech/webkit/chat-message'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Conversation from '@aziontech/webkit/conversation'
  import CopyButton from '@aziontech/webkit/copy-button'
  import PromptInput from '@aziontech/webkit/prompt-input'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import ToolCall, { type ToolCallState } from '@aziontech/webkit/tool-call'
  import { computed, onBeforeUnmount, ref } from 'vue'

  const command = 'azion deploy --workload storefront --build b-4821 --env production'
  const decision = ref<ActionConfirmationState>('pending')
  const run = ref<ToolCallState | ''>('')
  const prompt = ref('')
  let timer: ReturnType<typeof setTimeout> | undefined

  const followUp = computed(() => {
    if (decision.value === 'denied')
      return 'Got it, nothing was deployed. Build `b-4821` stays ready if you change your mind.'
    if (decision.value === 'expired') return 'This request expired. Nothing was deployed.'
    if (run.value === 'success')
      return 'storefront is live on production with build `b-4821`. The previous version `b-4790` stays available for rollback.'
    return ''
  })
  const composerState = computed(() =>
    decision.value === 'approved' && run.value === 'running' ? 'streaming' : 'ready'
  )

  function approve() {
    decision.value = 'approved'
    run.value = 'running'
    timer = setTimeout(() => (run.value = 'success'), 2500)
  }

  function deny() {
    decision.value = 'denied'
    run.value = 'denied'
  }

  function stop() {
    clearTimeout(timer)
    run.value = 'error'
  }

  onBeforeUnmount(() => clearTimeout(timer))
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
        timestamp="15:02"
      >
        Deploy the current build of storefront to production
      </ChatMessage>
      <ChatMessage timestamp="15:02">
        <ToolCall
          name="get_build"
          title="Reading the latest build of storefront"
          state="success"
        />
        <StreamingResponse
          content="Build `b-4821` passed its checks 6 minutes ago. Deploying it needs your approval."
        />
        <ActionConfirmation
          title="Allow `azion deploy --env production`?"
          description="Deploys build `b-4821` of storefront to production. The current version stays available for rollback."
          approve-label="Deploy"
          :state="decision"
          @approve="approve"
          @deny="deny"
        >
          <CodeBlock
            :tabs="[{ label: 'Shell', value: 'command', code: command, language: 'bash' }]"
            :show-line-numbers="false"
          />
        </ActionConfirmation>
        <ToolCall
          v-if="run"
          name="deploy_workload"
          title="Deploying storefront to production"
          :state="run"
        />
      </ChatMessage>
      <ChatMessage
        v-if="followUp"
        timestamp="15:04"
      >
        <StreamingResponse :content="followUp" />
        <template #actions>
          <ChatMessage.Actions>
            <CopyButton :value="followUp" />
          </ChatMessage.Actions>
        </template>
      </ChatMessage>
    </Conversation>
    <footer class="layout-column-content layout-boundary-inline pb-(--spacing-md)">
      <PromptInput
        v-model="prompt"
        :state="composerState"
        @stop="stop"
      >
        <template #hint>
          The assistant runs nothing in your account without your approval.
        </template>
      </PromptInput>
    </footer>
  </section>
</template>
```

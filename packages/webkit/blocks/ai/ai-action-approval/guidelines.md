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
- `edit/edit-delete-dialog` — confirming a destructive action the reader started.
- `skills/webkit-ai-surfaces` — when to ask, what to show and how to record the outcome.

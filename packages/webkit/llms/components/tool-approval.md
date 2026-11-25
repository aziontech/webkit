# Tool Approval

> A user-authorized action in a conversation (Cloudscape user-authorized actions, AI Elements Confirmation): the agent proposes something with consequences — call a tool, run a command, deploy, delete — and the reader approves or denies it before anything runs. The card states the action as a question (``Allow `npm test`?``), says what will happen, shows exactly what will run in its body (a `CodeBlock` with the command, `KeyValueList` with parameters), and offers Deny and Approve. Once decided, the buttons give way to the outcome in text (`Approved`, `Denied`, `Request expired`) so the decision stays in the thread. Irreversible actions (`variant="danger"`) turn Approve destructive and can require typing a phrase first. With `editable` (opt-in) the reader corrects the call's arguments in a code field before approving; the edit comes back through `v-model` and `approve`. It is a card in the conversation, not a dialog: it does not trap focus and does not take initial focus; `focus()` moves focus to its heading when the owner wants to bring the reader to it.

- Import: `import ToolApproval from '@aziontech/webkit/tool-approval'`
- Category: ai · Surface: app · Structure: monolithic
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- API as JSON: [tool-approval.json](tool-approval.json)

## When to use

- Use ToolApproval only inside an AI conversation when an agent asks permission to run a tool or command; for a person confirming an action they started use ConfirmDialog.
- One-time authorization of a consequential action proposed by an agent: a production deployment, a purge, a command.
- An irreversible action (delete): add `confirmationPhrase`.
- Arguments the reader may want to correct first (a URL list, a limit): add `editable`.

## Do

- Title is a question naming the action and target; put tool and command names in backticks (code).
- Match the approve label to the title verb (`Deploy`, `Delete`) when it is not a generic tool call.
- Never pre-focus or pre-select Approve for a risky action.
- Do not leave a request pending forever: expire it (`status="expired"`) and have the assistant say nothing ran.
- After Deny, the assistant acknowledges in the conversation ("Skipping that step.").
- With `editable`, bind `v-model` to the arguments as formatted JSON, set `invalid` while they do not parse, and run the call with the `input` that `approve` carries.
- Keep `editable` off for irreversible actions unless the edit is the point: the phrase confirms the target, the edit can change it.

## Don’t

- Tools already trusted for the session → record the call with `tool-call`, do not ask again.
- A destructive action the reader started themselves in the UI → `confirm-dialog`.
- A form → this card only approves or denies.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tool-call](tool-call.md) — the record of the call after it is approved (or `denied`).
- [confirm-dialog](confirm-dialog.md) — confirmation of the reader's own destructive action.
- [code-block](code-block.md), `key-value-list` — what will run, in the body.
- [chat-message](chat-message.md) — the assistant acknowledges the decision in the next message.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The question, naming the action: ``Allow `npm test`?``, `Approve deployment to production?`. Backticks render as code. |
| `description` | `string` | `''` | false | One or two sentences on what will happen and to what; backticks render as code. |
| `status` | `'pending' \| 'approved' \| 'denied' \| 'expired'` | `'pending'` | false | `pending` asks; `approved`, `denied` and `expired` replace the buttons with the outcome in text. |
| `variant` | `'primary' \| 'danger'` | `'primary'` | false | `danger` for an action that cannot be undone: the approve button turns destructive. |
| `confirmationPhrase` | `string` | `''` | false | A word the reader must type before Approve enables, for irreversible actions (the resource name). Empty asks for no typing. |
| `approveLabel` | `string` | `''` | false | Text of the approve button, the verb of the title (`Deploy`, `Delete`). Empty uses the locale catalog (`Approve`). |
| `denyLabel` | `string` | `''` | false | Text of the deny button. Empty uses the locale catalog (`Deny`). |
| `loading` | `boolean` | `false` | false | A decision is being sent; both buttons are inert and Approve shows its loading state. |
| `editable` | `boolean` | `false` | false | Lets the reader edit the call's input in a code field before approving; the edit comes back through `v-model` and `approve`. |
| `invalid` | `boolean` | `false` | false | The edited input cannot be used (it does not parse): the field shows an error and Approve stays disabled. Has no effect without `editable`. |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `approve` | `(event: MouseEvent, input: string)` |  |
| `deny` | `(event: MouseEvent)` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | What exactly will run: a `CodeBlock`, or `KeyValueList` with parameters. |

## Sub-components

_None. Exports: `"./tool-approval"`; types `ToolApprovalStatus`, `ToolApprovalVariant`.
Composed DS components: `button`, `status-indicator`; for `editable`, `field-root`, `textarea` and `field-error` under a plain `<label>` (no `field-label`, to keep its `Hint` out of the bundle); the title and description reuse
`StreamingResponse`'s inline renderer so backticks render as code (no HTML). Exposes `focus()`._

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                         |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | The call's arguments as text (usually JSON); the reader edits them with `editable`. Unbound, local and empty. |

## States

- `data-status` mirrors `status`; `data-variant`.
- `pending`: phrase field (when `confirmationPhrase`; the phrase in its label is inline code), Deny (outlined) and Approve (primary, or danger with `variant="danger"`); Approve disabled until the phrase matches. Once the typed text is as long as the phrase and still differs, the field is `aria-invalid` with a `FieldError` (`toolApproval.phraseMismatch`).
- `editable` + `pending`: a monospace `Textarea` labelled `Arguments` under the body, growing to 12 lines, then scrolling; disabled while `loading`.
- `invalid` (with `editable` + `pending`): the field is `aria-invalid` with its `FieldError`; Approve is disabled (with `confirmationPhrase`, it also needs the phrase).
- `editable` once resolved: the field stays `readonly` as the record of the arguments that ran.
- `approved` (success), `denied` (warning), `expired` (neutral): a `StatusIndicator` with the outcome; the typed phrase resets when the card returns to `pending`. When the status leaves `pending` while focus was inside the card (or on the page body), focus moves to the heading so it never falls to the page.

## Accessibility

- Visible focus: buttons and the phrase input show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`; the heading shows a ring when `focus()` moves focus to it.
- Keyboard map: `Tab` through the body, the arguments field (with `editable`), the phrase field, Deny, Approve; in the arguments field `Enter` adds a line and `Tab` leaves it; `Enter` / `Space` activate Deny and Approve. No focus trap, no initial focus (Cloudscape: the one-time decision card is not a dialog).
- ARIA: `role="group"` labelled by its `h3` title and described by the description; both fields have visible `<label>`s; the invalid arguments field and a mismatched phrase field are `aria-invalid` and described by their `FieldError` (`role="alert"`); the phrase field sets `autocapitalize="off"`; a polite live region announces the outcome; outcomes are text, never color alone.

## Right-to-left

- Layout: logical utilities; buttons align to the inline end.
- Icons: the shield is not mirrored.
- Keyboard: none.
- User data: code in the title and body is `dir="ltr"`; the arguments field is `dir="ltr"` (arguments are code).

## Internationalization

| Key                             | English source                                            | Override prop  |
| ------------------------------- | --------------------------------------------------------- | -------------- |
| `toolApproval.approve`          | `Approve`                                                 | `approveLabel` |
| `toolApproval.deny`             | `Deny`                                                    | `denyLabel`    |
| `toolApproval.approved`         | `Approved`                                                | —              |
| `toolApproval.denied`           | `Denied`                                                  | —              |
| `toolApproval.expired`          | `Request expired`                                         | —              |
| `toolApproval.confirmLabel`     | `Type {phrase} to confirm`                                | —              |
| `toolApproval.arguments`        | `Arguments`                                               | —              |
| `toolApproval.invalidArguments` | `These arguments are not valid. Correct them to approve.` | —              |
| `toolApproval.phraseMismatch`   | `This does not match {phrase}. Type it exactly to confirm.` | —            |

- Formatting: none.

## Responsive

- Container queries: none.
- Narrow: buttons wrap; the title wraps between words (inline code included, breaking inside a word only when it cannot fit), so a flag such as `--env` is never split and the whole command stays readable. What will run must be readable without scrolling sideways before Approve: prefer a `KeyValueList` (or a `CodeBlock` whose lines are short, such as pretty-printed JSON) in the body, since a `CodeBlock` scrolls a long line inside itself.
- Touch: medium buttons (44 px on coarse pointers).
- Reflow: no page-level horizontal scroll at 320 px; the arguments field keeps each line of code whole (`wrap="off"`), grows to 12 lines, then scrolls inside itself, sideways for a long line.
- Touch: on coarse pointers (`pointer-coarse:`) the confirmation-phrase field and the arguments field (a `Textarea`) type at 16 px (`text-body-md`), so iOS Safari does not zoom the page on focus.

## Examples

### Default

```vue
<script setup>
  import KeyValueList from '@aziontech/webkit/key-value-list'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import { ref } from 'vue'

  const status = ref('pending')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ToolApproval
      title="Allow `azion deploy --env production`?"
      description="Deploys the current build of storefront to production. The previous version stays available for rollback."
      approve-label="Deploy"
      :status="status"
      @approve="status = 'approved'"
      @deny="status = 'denied'"
    >
      <KeyValueList aria-label="Command to run">
        <KeyValueList.Item label="Command">
          <code
            class="rounded-(--shape-control) bg-(--bg-subtle) px-(--spacing-xs) py-(--spacing-2xs) text-body-code-sm [overflow-wrap:break-word] text-(--text-default)"
            >azion deploy <span class="whitespace-nowrap">--env production</span>
            <span class="whitespace-nowrap">--workload storefront</span></code
          >
        </KeyValueList.Item>
        <KeyValueList.Item label="Environment">production</KeyValueList.Item>
        <KeyValueList.Item label="Workload">storefront</KeyValueList.Item>
      </KeyValueList>
    </ToolApproval>
  </div>
</template>
```

### Irreversible

```vue
<script setup>
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import { ref } from 'vue'

  const status = ref('pending')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ToolApproval
      title="Delete the domain `www.example.com`?"
      description="The domain stops answering at once and its certificate is revoked. This cannot be undone."
      variant="danger"
      confirmation-phrase="www.example.com"
      approve-label="Delete"
      :status="status"
      @approve="status = 'approved'"
      @deny="status = 'denied'"
    />
  </div>
</template>
```

### Editable

```vue
<script setup>
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import { computed, ref } from 'vue'

  const status = ref('pending')
  const input = ref(
    JSON.stringify(
      { urls: ['https://www.example.com/styles.css', 'https://www.example.com/app.js'] },
      null,
      2
    )
  )

  const invalid = computed(() => {
    try {
      JSON.parse(input.value)
      return false
    } catch {
      return true
    }
  })

  function onApprove(event, value) {
    input.value = JSON.stringify(JSON.parse(value), null, 2)
    status.value = 'approved'
  }
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ToolApproval
      v-model="input"
      title="Allow `purge_urls`?"
      description="Purges these URLs from every data center. Edit the list before you approve."
      approve-label="Purge"
      editable
      :invalid="invalid"
      :status="status"
      @approve="onApprove"
      @deny="status = 'denied'"
    />
  </div>
</template>
```

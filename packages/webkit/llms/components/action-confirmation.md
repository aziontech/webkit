# Action Confirmation

> A user-authorized action in a conversation (Cloudscape user-authorized actions, AI Elements Confirmation): the agent proposes something with consequences — call a tool, run a command, deploy, delete — and the reader approves or denies it before anything runs. The card states the action as a question (``Allow `npm test`?``), says what will happen, shows exactly what will run in its body (a `CodeBlock` with the command, `KeyValuePairs` with parameters), and offers Deny and Approve. Once decided, the buttons give way to the outcome in text (`Approved`, `Denied`, `Request expired`) so the decision stays in the thread. Irreversible actions (`kind="danger"`) turn Approve destructive and can require typing a phrase first. It is a card in the conversation, not a dialog: it does not trap focus and does not take initial focus; `focus()` moves focus to its heading when the owner wants to bring the reader to it.

- Import: `import ActionConfirmation from '@aziontech/webkit/action-confirmation'`
- Category: ai · Surface: product · Structure: monolithic
- API as JSON: [action-confirmation.json](https://github.com/aziontech/webkit/blob/main/.specs/action-confirmation.json)

## When to use

- One-time authorization of a consequential action proposed by an agent: a production deployment, a purge, a command.
- An irreversible action (delete): add `confirmationPhrase`.

## Do

- Title is a question naming the action and target; put tool and command names in backticks (code).
- Match the approve label to the title verb (`Deploy`, `Delete`) when it is not a generic tool call.
- Never pre-focus or pre-select Approve for a risky action.
- Do not leave a request pending forever: expire it (`state="expired"`) and have the assistant say nothing ran.
- After Deny, the assistant acknowledges in the conversation ("Skipping that step.").

## Don’t

- Tools already trusted for the session → record the call with `tool-call`, do not ask again.
- A destructive action the reader started themselves in the UI → `confirm-dialog`.
- A form → this card only approves or denies.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tool-call](tool-call.md) — the record of the call after it is approved (or `denied`).
- [confirm-dialog](confirm-dialog.md) — confirmation of the reader's own destructive action.
- [code-block](code-block.md), `key-value-pairs` — what will run, in the body.
- [chat-message](chat-message.md) — the assistant acknowledges the decision in the next message.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The question, naming the action: ``Allow `npm test`?``, `Approve deployment to production?`. Backticks render as code. |
| `description` | `string` | `''` | false | One or two sentences on what will happen and to what; backticks render as code. |
| `state` | `'pending' \| 'approved' \| 'denied' \| 'expired'` | `'pending'` | false | pending` asks; `approved`, `denied` and `expired` replace the buttons with the outcome in text. |
| `kind` | `'default' \| 'danger'` | `'default'` | false | danger` for an action that cannot be undone: the approve button turns destructive. |
| `confirmationPhrase` | `string` | `''` | false | A word the reader must type before Approve enables, for irreversible actions (the resource name). Empty asks for no typing. |
| `approveLabel` | `string` | `''` | false | Text of the approve button, the verb of the title (`Deploy`, `Delete`). Empty uses the locale catalog (`Approve`). |
| `denyLabel` | `string` | `''` | false | Text of the deny button. Empty uses the locale catalog (`Deny`). |
| `loading` | `boolean` | `false` | false | A decision is being sent; both buttons are inert and Approve shows its loading state. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `approve` | `(event: MouseEvent)` |  |
| `deny` | `(event: MouseEvent)` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | What exactly will run: a `CodeBlock`, or `KeyValuePairs` with parameters. |

## Sub-components

_None. Exports: `"./action-confirmation"`; types `ActionConfirmationState`, `ActionConfirmationKind`.
Composed DS components: `button`, `status-indicator`; the title and description reuse
`StreamingResponse`'s inline renderer so backticks render as code (no HTML). Exposes `focus()`._

## States

- `data-status` mirrors `state`; `data-kind`.
- `pending`: phrase field (when `confirmationPhrase`), Deny (outlined) and Approve (primary, or danger with `kind="danger"`); Approve disabled until the phrase matches.
- `approved` (success), `denied` (warning), `expired` (neutral): a `StatusIndicator` with the outcome; the typed phrase resets when the card returns to `pending`.

## Accessibility

- Visible focus: buttons and the phrase input show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`; the heading shows a ring when `focus()` moves focus to it.
- Keyboard map: `Tab` through the body, the phrase field, Deny, Approve; `Enter` / `Space` activates. No focus trap, no initial focus (Cloudscape: the one-time decision card is not a dialog).
- ARIA: `role="group"` labelled by its `h3` title and described by the description; the phrase field has a visible `<label>`; a polite live region announces the outcome; outcomes are text, never color alone.

## Right-to-left

- Layout: logical utilities; buttons align to the inline end.
- Icons: the shield is not mirrored.
- Keyboard: none.
- User data: code in the title and body is `dir="ltr"`.

## Internationalization

| Key                               | English source             | Override prop |
| --------------------------------- | -------------------------- | ------------- |
| `actionConfirmation.approve`      | `Approve`                  | `approveLabel`|
| `actionConfirmation.deny`         | `Deny`                     | `denyLabel`   |
| `actionConfirmation.approved`     | `Approved`                 | —             |
| `actionConfirmation.denied`       | `Denied`                   | —             |
| `actionConfirmation.expired`      | `Request expired`          | —             |
| `actionConfirmation.confirmLabel` | `Type {phrase} to confirm` | —             |

- Formatting: none.

## Responsive

- Container queries: none.
- Narrow: buttons wrap; the body's code scrolls inside its block.
- Touch: medium buttons (44 px on coarse pointers).
- Reflow: no horizontal scroll at 320 px.

## Examples

### Command

```vue
<script setup>
  import ActionConfirmation from '@aziontech/webkit/action-confirmation'
  import CodeBlock from '@aziontech/webkit/code-block'
  import { ref } from 'vue'

  const state = ref('pending')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ActionConfirmation
      title="Allow `azion deploy --env production`?"
      description="Deploys the current build of storefront to production. The previous version stays available for rollback."
      approve-label="Deploy"
      :state="state"
      @approve="state = 'approved'"
      @deny="state = 'denied'"
    >
      <CodeBlock
        :tabs="[
          {
            label: 'Shell',
            value: 'cmd',
            code: 'azion deploy --env production --workload storefront',
            language: 'bash'
          }
        ]"
        :show-line-numbers="false"
      />
    </ActionConfirmation>
  </div>
</template>
```

### Irreversible

```vue
<script setup>
  import ActionConfirmation from '@aziontech/webkit/action-confirmation'
  import { ref } from 'vue'

  const state = ref('pending')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <ActionConfirmation
      title="Delete the domain `www.example.com`?"
      description="The domain stops answering at once and its certificate is revoked. This cannot be undone."
      kind="danger"
      confirmation-phrase="www.example.com"
      approve-label="Delete"
      :state="state"
      @approve="state = 'approved'"
      @deny="state = 'denied'"
    />
  </div>
</template>
```

### Resolved

```vue
<script setup>
  import ActionConfirmation from '@aziontech/webkit/action-confirmation'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-sm)">
    <ActionConfirmation
      title="Allow `purge_urls`?"
      description="Purges https://www.example.com/styles.css from every edge location."
      state="approved"
    />
    <ActionConfirmation
      title="Approve deployment to production?"
      description="Deploys the current build of storefront to production."
      state="denied"
    />
    <ActionConfirmation
      title="Allow `delete_cache_rule`?"
      description="Removes the rule that caches images for one day."
      state="expired"
    />
  </div>
</template>
```

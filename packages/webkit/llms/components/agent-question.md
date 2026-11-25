# Agent Question

> A question the agent asks the reader in the middle of a run, before it can go on (a human-in-the-loop interrupt, Cloudscape follow-up input, the "ask the user" step of coding agents): pick one of a few options, type a short answer, or say yes or no. The card states the question, says why the agent asks, shows the answer control the question needs (`type`: options as radios, a one-line text field, or Yes and No buttons), and offers Submit and, when the run can go on without an answer, Skip. While the answer is sent the controls are inert and Submit shows its loading state; once answered, the controls give way to the answer in text (`Answered: Staging`) so the exchange stays in the thread; a failed send keeps the controls and shows the error line under them. It differs from `tool-approval`, which approves or denies a tool call with consequences: this card collects information the agent needs, and nothing runs on the reader's behalf. It also says "answer in flight" with `status="running"` instead of tool-approval's `loading` boolean, on purpose: the pause it renders already has a lifecycle (TanStack AI's `pending`, `validating` / `submitting`, `error`), and one `status` maps onto it without a second flag that could disagree with it. A block maps the interrupt like this: `pending` → `pending`; `validating`, `staged` and `submitting` → `running`; `error` → `error`, with the first of `errors[]` as `error`; a resolved interrupt → `success`; `cancel()` after Skip → `skipped`; an interrupt the run dropped → `canceled`. It is a card in the conversation, not a dialog: it does not trap focus and does not take initial focus; `focus()` moves focus to its heading when the owner wants to bring the reader to it.

- Import: `import AgentQuestion from '@aziontech/webkit/agent-question'`
- Category: ai · Surface: app · Structure: monolithic
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- API as JSON: [agent-question.json](agent-question.json)

## When to use

- Use AgentQuestion only inside an AI conversation, when the agent pauses a run to ask the reader for information it cannot infer (a TanStack AI generic interrupt, an "ask the user" tool).
- A choice between two to six named options: which environment, which plan, which of two fixes (`type="choice"`).
- A short free-text answer: a name, a domain, a value the agent is missing (`type="text"`).
- A yes-or-no question where both answers let the run go on (`type="confirm"`).

## Do

- Ask one thing per card, as a question that ends with a question mark; put names and values in backticks (code).
- Keep options short and mutually exclusive; give an option a `description` only when the label alone does not say what happens.
- Offer Skip (`skippable`) only when the agent can continue without the answer, and have it say what it assumed.
- Name the submit action after the outcome when it is not a generic answer (`Use this domain`).
- Do not leave a question pending forever: when the run no longer needs it, set `status="canceled"`.
- Offer at most six options; more than that is a search or a form, not a question.

## Don’t

- The agent asks permission to run a tool or command with consequences → `tool-approval`.
- Follow-up prompts the reader may send or ignore, with no paused run → `suggestion-group`.
- A destructive action the reader started in the UI → `confirm-dialog`.
- A form with several fields → `schema-form` in the page, not a chat card.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tool-approval](tool-approval.md) — approve or deny an agent's tool call; same card language, different decision.
- [suggestion-group](suggestion-group.md) — optional follow-ups that start a new message instead of answering a paused run.
- [chat-message](chat-message.md) — the card sits in the assistant message; the assistant goes on in the next one.
- [radio-group](radio-group.md), `input`, `button`, `status-indicator` — the parts the card is built from.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `—` | true | The question the agent asks, ending with a question mark. Backticks render as code. |
| `description` | `string` | `''` | false | One or two sentences on why the agent asks or what it does with the answer; backticks render as code. |
| `type` | `'choice' \| 'text' \| 'confirm'` | `'choice'` | false | The answer control: `choice` lists `options` as radios, `text` shows a one-line field, `confirm` shows No and Yes buttons. |
| `options` | `AgentQuestionOption[]` | `[]` | false | The answers of a `choice` question: `{ value, label, description?, disabled? }`. Ignored by the other types. |
| `placeholder` | `string` | `''` | false | Short example shown in the empty field of a `text` question. |
| `status` | `'pending' \| 'running' \| 'success' \| 'error' \| 'canceled' \| 'skipped'` | `'pending'` | false | `pending` asks; `running` sends the answer; `success`, `skipped` and `canceled` replace the controls with the outcome; `error` asks again. |
| `error` | `string` | `''` | false | Why the last answer was not accepted, shown under the controls. Empty with `status="error"` uses the locale catalog. |
| `skippable` | `boolean` | `false` | false | Offers Skip, for a question the agent can go on without. |
| `submitLabel` | `string` | `''` | false | Text of the submit button (Yes on a `confirm` question). Empty uses the locale catalog (`Submit`, `Yes`). |
| `declineLabel` | `string` | `''` | false | Text of the No button of a `confirm` question. Empty uses the locale catalog (`No`). |
| `skipLabel` | `string` | `''` | false | Text of the Skip button. Empty uses the locale catalog (`Skip`). |
| `modelValue` | `string` | `''` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `submit` | `(event: Event, value: string)` |  |
| `skip` | `(event: MouseEvent)` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | Context the reader needs to answer, between the question and the control: a `CodeBlock`, a `KeyValueList`. |

## Sub-components

_None. Exports: `"./agent-question"`; types `AgentQuestionType`, `AgentQuestionStatus`,
`AgentQuestionOption`. Composed DS components: `radio-group`, `input`, `button`, `status-indicator`;
the title and description render through the shared `ai/lib/markdown-inline` renderer and
`parseInline` from `ai/lib/parse-markdown` (the ones `tool-approval` uses), so backticks render as code
(no HTML). Exposes `focus()`, which moves focus to the heading._

## States

- `data-status` mirrors `status`; `data-type` mirrors `type`.
- `pending`: the control for `type`, then Skip (ghost, when `skippable`) and Submit (primary) at the inline end; Submit is disabled while the answer is empty or blank. A `confirm` question shows No (outline) and Yes (primary) instead of Submit, both submit.
- `running`: controls and buttons inert, Submit (or the pressed confirm button) in its loading state, `aria-busy="true"` on the card.
- `error`: like `pending`, plus the error line under the controls in danger text; the field (or radio group) is `invalid` and described by the line.
- `success`: a `StatusIndicator` (success) reading `Answered: <answer>`, where the answer is the picked option's label (or the raw `modelValue` when it matches no option), the typed text, or the label of the confirm button that was pressed (`submitLabel` / `declineLabel` when set, otherwise the catalog Yes / No). The answer is isolated for bidirectional text: the card passes the answer to `{answer}` already wrapped in U+2068 FIRST STRONG ISOLATE … U+2069 POP DIRECTIONAL ISOLATE, because `StatusIndicator`'s `label` has no slot for a `bdi`; the catalog strings carry no isolates. A long answer is truncated to one line by `StatusIndicator`; the label text in the DOM and the live region carry the full answer. An empty answer reads `Answered`.
- `skipped`, `canceled`: a `StatusIndicator` (neutral) reading `Skipped` or `Question canceled`.
- A polite live region announces each outcome and the error line.
- The answer is kept when the status goes from `error` back to `pending` (or `running`): the model is never cleared by the card.
- A `choice` question with empty `options` renders no radios; Submit stays disabled and only Skip (when `skippable`) can move the run on. The block must pass options.
- States the card does not have: no `disabled` or `readonly` (`status="running"` makes it inert), no `loading` prop (`status="running"` is the loading state), no `invalid` prop (the control is invalid only while the error line shows), and no empty state.

## Accessibility

- Visible focus: radios, the field and the buttons keep their own `focus-visible` rings; the heading shows `focus-visible:ring-2 focus-visible:ring-(--ring-color)` when `focus()` moves focus to it.
- Keyboard map: `Tab` through the body slot, the control, Skip and Submit; arrow keys move the choice inside the radio group; `Space` on a focused radio selects it and does not submit; `Enter` in the text field or on a focused radio submits the answer through the card's form (the browser's implicit submission, with the same guard as Submit: nothing is sent while the answer is empty or the card is `running`); `Enter` / `Space` activates a button. No focus trap, no initial focus.
- Focus across status changes: while `running`, the pressed button keeps focus (its loading state is `aria-disabled`, not native `disabled`). When a status change disables or removes the control that holds focus (`Enter` in the field, then `running`; the receipt replacing the buttons on `success`, `skipped` or `canceled`), focus moves to the heading, never to the body.
- ARIA: the root is a `div` with `role="group"`, labelled by its `h3` title (`aria-labelledby`) and described by the description (`aria-describedby`). The control and the buttons sit in an unnamed `form` (no accessible name, so no form landmark per card), which gives `Enter` in the field its submit. The `h3` carries `tabindex="-1"`: the target of `focus()`, kept out of the Tab order. The question glyph is `aria-hidden="true"`. The radio group and the text field are labelled by the title; the error line is linked with `aria-describedby` and the control is `aria-invalid` (the radio group on `choice`, the field on `text`; on `confirm`, which has no field, the root group's `aria-describedby` adds the error line and the No and Yes buttons are not marked invalid); Skip and No are `type="button"`, so implicit submission only ever uses Submit; `aria-busy` while `running`; a polite live region announces the outcome and the error; outcomes are text, never color alone.
- Contrast from the theme's documented pairs only; touch targets come from `Button`, `RadioGroup` and `Input` (44 px on coarse pointers).

## Right-to-left

- Layout: logical utilities only; the buttons align to the inline end, the glyph sits at the inline start.
- Icons: the question glyph is not mirrored.
- Keyboard: the options are native radios in a stacked group: ArrowDown and ArrowUp move to the next and previous option in both directions; ArrowLeft and ArrowRight follow the text direction (ArrowLeft moves to the next option under `dir="rtl"`), as `RadioGroup` provides.
- User data: code in the title and description is `dir="ltr"`; the typed answer keeps `dir="auto"` from `Input`; `RadioGroup` does not isolate its labels, so the card renders each option label in a `bdi` through RadioGroup's `option` slot; the card passes the success receipt's answer to `{answer}` already wrapped in Unicode isolates (FSI … PDI); the catalog strings carry no isolates.

## Internationalization

| Key                                  | English source                             | Override prop  |
| ------------------------------------ | ------------------------------------------ | -------------- |
| `agentQuestion.submit`               | `Submit`                                   | `submitLabel`  |
| `agentQuestion.yes`                  | `Yes`                                      | `submitLabel`  |
| `agentQuestion.no`                   | `No`                                       | `declineLabel` |
| `agentQuestion.skip`                 | `Skip`                                     | `skipLabel`    |
| `agentQuestion.answered`             | `Answered: {answer}`                       | —              |
| `agentQuestion.answeredWithoutValue` | `Answered`                                 | —              |
| `agentQuestion.skipped`              | `Skipped`                                  | —              |
| `agentQuestion.canceled`             | `Question canceled`                        | —              |
| `agentQuestion.error`                | `The answer could not be sent. Try again.` | `error`        |

- Formatting: none.

## Responsive

- Container queries: none: the card fills the message column.
- Narrow: intrinsic wrapping only: the button row is `flex-wrap` and its buttons drop to a new line when they do not fit; options stay stacked.
- Touch: targets from `Button`, `RadioGroup` and `Input` (44 px on `pointer: coarse`); no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import AgentQuestion from '@aziontech/webkit/agent-question'
  import { ref } from 'vue'

  const answer = ref('')
  const status = ref('pending')
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <AgentQuestion
      v-model="answer"
      title="Which environment should the new `waf-rules` set go to?"
      description="The rule set exists in both workloads. I can add it to one now and copy it to the other later."
      :options="[
        { value: 'staging', label: 'Staging', description: 'Preview traffic only.' },
        { value: 'production', label: 'Production', description: 'Serves live traffic.' }
      ]"
      :status="status"
      submit-label="Use this environment"
      skippable
      @submit="status = 'success'"
      @skip="status = 'skipped'"
    />
  </div>
</template>
```

### Types

```vue
<script setup>
  import AgentQuestion from '@aziontech/webkit/agent-question'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-md)">
    <AgentQuestion
      title="Which plan should Acme Inc. move to?"
      :options="[
        { value: 'pro', label: 'Pro' },
        { value: 'business', label: 'Business' },
        { value: 'enterprise', label: 'Enterprise' }
      ]"
      submit-label="Change plan"
    />
    <AgentQuestion
      type="text"
      title="Which domain should the new workload answer on?"
      description="I could not find a domain in the repository settings."
      placeholder="shop.example.com"
      submit-label="Use this domain"
    />
    <AgentQuestion
      type="confirm"
      title="Turn on Brotli compression for the new workload?"
      description="Text responses get smaller; older clients still receive gzip."
      submit-label="Turn it on"
      decline-label="Leave it off"
    />
  </div>
</template>
```

### Loading

```vue
<script setup>
  import AgentQuestion from '@aziontech/webkit/agent-question'
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <AgentQuestion
      type="text"
      title="Which domain should the new workload answer on?"
      model-value="shop.example.com"
      status="running"
      submit-label="Use this domain"
    />
  </div>
</template>
```

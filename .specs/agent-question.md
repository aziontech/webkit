---
name: agent-question
category: ai
structure: monolithic
status: draft
spec_version: 1
template: 2
created: 2026-11-19
last_updated: 2026-11-19
---

# AgentQuestion — Component Spec

## Purpose

A question the agent asks the reader in the middle of a run, before it can go on (a human-in-the-loop
interrupt, Cloudscape follow-up input, the "ask the user" step of coding agents): pick one of a few
options, type a short answer, or say yes or no. The card states the question, says why the agent
asks, shows the answer control the question needs (`type`: options as radios, a one-line text field,
or Yes and No buttons), and offers Submit and, when the run can go on without an answer, Skip. While
the answer is sent the controls are inert and Submit shows its loading state; once answered, the
controls give way to the answer in text (`Answered: Staging`) so the exchange stays in the thread; a
failed send keeps the controls and shows the error line under them.

It differs from `tool-approval`, which approves or denies a tool call with consequences: this card
collects information the agent needs, and nothing runs on the reader's behalf. It also says "answer in
flight" with `status="running"` instead of tool-approval's `loading` boolean, on purpose: the pause it
renders already has a lifecycle (TanStack AI's `pending`, `validating` / `submitting`, `error`), and one
`status` maps onto it without a second flag that could disagree with it. A block maps the interrupt
like this: `pending` → `pending`; `validating`, `staged` and `submitting` → `running`; `error` →
`error`, with the first of `errors[]` as `error`; a resolved interrupt → `success`; `cancel()` after
Skip → `skipped`; an interrupt the run dropped → `canceled`. It is a card in the
conversation, not a dialog: it does not trap focus and does not take initial focus; `focus()` moves
focus to its heading when the owner wants to bring the reader to it.

## When to use

- Use AgentQuestion only inside an AI conversation, when the agent pauses a run to ask the reader for information it cannot infer (a TanStack AI generic interrupt, an "ask the user" tool).
- A choice between two to six named options: which environment, which plan, which of two fixes (`type="choice"`).
- A short free-text answer: a name, a domain, a value the agent is missing (`type="text"`).
- A yes-or-no question where both answers let the run go on (`type="confirm"`).

## When NOT to use

- The agent asks permission to run a tool or command with consequences → `tool-approval`.
- Follow-up prompts the reader may send or ignore, with no paused run → `suggestion-group`.
- A destructive action the reader started in the UI → `confirm-dialog`.
- A form with several fields → `schema-form` in the page, not a chat card.

## Related

- `tool-approval` — approve or deny an agent's tool call; same card language, different decision.
- `suggestion-group` — optional follow-ups that start a new message instead of answering a paused run.
- `chat-message` — the card sits in the assistant message; the assistant goes on in the next one.
- `radio-group`, `input`, `button`, `status-indicator` — the parts the card is built from.

## Best practices

- Ask one thing per card, as a question that ends with a question mark; put names and values in backticks (code).
- Keep options short and mutually exclusive; give an option a `description` only when the label alone does not say what happens.
- Offer Skip (`skippable`) only when the agent can continue without the answer, and have it say what it assumed.
- Name the submit action after the outcome when it is not a generic answer (`Use this domain`).
- Do not leave a question pending forever: when the run no longer needs it, set `status="canceled"`.
- Offer at most six options; more than that is a search or a form, not a question.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import AgentQuestion from '@aziontech/webkit/agent-question'

  const answer = ref('')
  const status = ref('pending')
</script>

<template>
  <AgentQuestion
    v-model="answer"
    title="Which environment should the new rule go to?"
    description="The rule set exists in both workloads. I can add it to one now and copy it later."
    :options="[
      { value: 'staging', label: 'Staging' },
      { value: 'production', label: 'Production' }
    ]"
    :status="status"
    skippable
    @submit="status = 'success'"
    @skip="status = 'skipped'"
  />
</template>
```

## Sub-components

_None. Exports: `"./agent-question"`; types `AgentQuestionType`, `AgentQuestionStatus`,
`AgentQuestionOption`. Composed DS components: `radio-group`, `input`, `button`, `status-indicator`;
the title and description render through the shared `ai/lib/markdown-inline` renderer and
`parseInline` from `ai/lib/parse-markdown` (the ones `tool-approval` uses), so backticks render as code
(no HTML). Exposes `focus()`, which moves focus to the heading._

## Props

| Prop           | Type                                                                        | Default     | Required | JSDoc                                                                                                                                      |
| -------------- | --------------------------------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `title`        | `string`                                                                    | —           | true     | The question the agent asks, ending with a question mark. Backticks render as code.                                                        |
| `description`  | `string`                                                                    | `''`        | false    | One or two sentences on why the agent asks or what it does with the answer; backticks render as code.                                      |
| `type`         | `'choice' \| 'text' \| 'confirm'`                                           | `'choice'`  | false    | The answer control: `choice` lists `options` as radios, `text` shows a one-line field, `confirm` shows No and Yes buttons.                 |
| `options`      | `AgentQuestionOption[]`                                                     | `[]`        | false    | The answers of a `choice` question: `{ value, label, description?, disabled? }`. Ignored by the other types.                               |
| `placeholder`  | `string`                                                                    | `''`        | false    | Short example shown in the empty field of a `text` question.                                                                               |
| `status`       | `'pending' \| 'running' \| 'success' \| 'error' \| 'canceled' \| 'skipped'` | `'pending'` | false    | `pending` asks; `running` sends the answer; `success`, `skipped` and `canceled` replace the controls with the outcome; `error` asks again. |
| `error`        | `string`                                                                    | `''`        | false    | Why the last answer was not accepted, shown under the controls. Empty with `status="error"` uses the locale catalog.                       |
| `skippable`    | `boolean`                                                                   | `false`     | false    | Offers Skip, for a question the agent can go on without.                                                                                   |
| `submitLabel`  | `string`                                                                    | `''`        | false    | Text of the submit button (Yes on a `confirm` question). Empty uses the locale catalog (`Submit`, `Yes`).                                  |
| `declineLabel` | `string`                                                                    | `''`        | false    | Text of the No button of a `confirm` question. Empty uses the locale catalog (`No`).                                                       |
| `skipLabel`    | `string`                                                                    | `''`        | false    | Text of the Skip button. Empty uses the locale catalog (`Skip`).                                                                           |

Two-way model: `v-model` (`modelValue: string`, default `''`) holds the answer: the `value` of the
picked option, the typed text, or `yes` / `no` on a `confirm` question. It is the answer the
`success` outcome shows.

## Events

| Event    | Payload                         | When                                                                                                                                                 |
| -------- | ------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `submit` | `(event: Event, value: string)` | Submit pressed (or `Enter` in the field or on a radio), or Yes / No on a `confirm` question, while `pending` or `error` and the answer is not empty. |
| `skip`   | `(event: MouseEvent)`           | Skip pressed while `pending` or `error`.                                                                                                             |

## Slots

| Slot      | Scope | Notes                                                                                                      |
| --------- | ----- | ---------------------------------------------------------------------------------------------------------- |
| `default` | —     | Context the reader needs to answer, between the question and the control: a `CodeBlock`, a `KeyValueList`. |

## States

- `data-status` mirrors `status`; `data-type` mirrors `type`.
- `pending`: the control for `type`, then Skip (ghost, when `skippable`) and Submit (primary) at the inline end; Submit is disabled while the answer is empty or blank. A `confirm` question shows No (outline) and Yes (primary) instead of Submit, both submit.
- `running`: controls and buttons inert, Submit (or the pressed confirm button) in its loading state, `aria-busy="true"` on the card.
- `error`: like `pending`, plus the error line under the controls in danger text; the field (or radio group) is `invalid` and described by the line.
- `success`: a `StatusIndicator` (success) reading `Answered: <answer>`, where the answer is the picked option's label, the typed text, or the label of the confirm button that was pressed (`submitLabel` / `declineLabel` when set, otherwise the catalog Yes / No). The answer is isolated for bidirectional text: the label string wraps `{answer}` in Unicode isolates (U+2068 FIRST STRONG ISOLATE … U+2069 POP DIRECTIONAL ISOLATE), because `StatusIndicator`'s `label` has no slot for a `bdi`. An empty answer reads `Answered`.
- `skipped`, `canceled`: a `StatusIndicator` (neutral) reading `Skipped` or `Question canceled`.
- A polite live region announces each outcome and the error line.
- The answer is kept when the status goes from `error` back to `pending` (or `running`): the model is never cleared by the card.
- A `choice` question with empty `options` renders no radios; Submit stays disabled and only Skip (when `skippable`) can move the run on. The block must pass options.
- States the card does not have: no `disabled` or `readonly` (`status="running"` makes it inert), no `loading` prop (`status="running"` is the loading state), no `invalid` prop (the control is invalid only while the error line shows), and no empty state.

## Motion & Animations

_none_ — no motion of its own; `Button` handles its loading spinner and `Input` its color transition.

## Tokens

| Region         | Token                                                                               |
| -------------- | ----------------------------------------------------------------------------------- |
| frame          | `var(--bg-surface)`, `var(--border-default)`, `var(--shape-card)`                   |
| title          | `.text-heading-2xs`, `var(--text-default)`                                          |
| description    | `.text-body-sm`, `var(--text-muted)`                                                |
| question glyph | `az az-circle-help`, `var(--text-muted)`                                            |
| error line     | `.text-body-sm`, `var(--text-danger)`                                               |
| padding/gaps   | `var(--spacing-md)`, `var(--spacing-sm)`, `var(--spacing-xs)`, `var(--spacing-2xs)` |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: radios, the field and the buttons keep their own `focus-visible` rings; the heading shows `focus-visible:ring-2 focus-visible:ring-(--ring-color)` when `focus()` moves focus to it.
- Keyboard map: `Tab` through the body slot, the control, Skip and Submit; arrow keys move the choice inside the radio group; `Space` on a focused radio selects it and does not submit; `Enter` in the text field or on a focused radio submits the answer through the card's form (the browser's implicit submission, with the same guard as Submit: nothing is sent while the answer is empty or the card is `running`); `Enter` / `Space` activates a button. No focus trap, no initial focus.
- Focus across status changes: while `running`, the pressed button keeps focus (its loading state is `aria-disabled`, not native `disabled`). When a status change disables or removes the control that holds focus (`Enter` in the field, then `running`; the receipt replacing the buttons on `success`, `skipped` or `canceled`), focus moves to the heading, never to the body.
- ARIA: the root is a `div` with `role="group"`, labelled by its `h3` title (`aria-labelledby`) and described by the description (`aria-describedby`). The control and the buttons sit in an unnamed `form` (no accessible name, so no form landmark per card), which gives `Enter` in the field its submit. The `h3` carries `tabindex="-1"`: the target of `focus()`, kept out of the Tab order. The question glyph is `aria-hidden="true"`. The radio group and the text field are labelled by the title; the error line is linked with `aria-describedby` and the control is `aria-invalid` (the radio group on `choice`, the field on `text`; on `confirm`, which has no field, the root group's `aria-describedby` adds the error line and the No and Yes buttons are not marked invalid); Skip and No are `type="button"`, so implicit submission only ever uses Submit; `aria-busy` while `running`; a polite live region announces the outcome and the error; outcomes are text, never color alone.
- Contrast from the theme's documented pairs only; touch targets come from `Button`, `RadioGroup` and `Input` (44 px on coarse pointers).

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

## Right-to-left

- Layout: logical utilities only; the buttons align to the inline end, the glyph sits at the inline start.
- Icons: the question glyph is not mirrored.
- Keyboard: the options are native radios in a stacked group: ArrowDown and ArrowUp move to the next and previous option in both directions; ArrowLeft and ArrowRight follow the text direction (ArrowLeft moves to the next option under `dir="rtl"`), as `RadioGroup` provides.
- User data: code in the title and description is `dir="ltr"`; the typed answer keeps `dir="auto"` from `Input`; `RadioGroup` does not isolate its labels, so the card renders each option label in a `bdi` through RadioGroup's `option` slot; the success receipt isolates the answer with Unicode isolates (FSI … PDI) around `{answer}`.

## Responsive

- Container queries: none: the card fills the message column.
- Narrow: intrinsic wrapping only: the button row is `flex-wrap` and its buttons drop to a new line when they do not fit; options stay stacked.
- Touch: targets from `Button`, `RadioGroup` and `Input` (44 px on `pointer: coarse`); no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: at most 16 KB gzip for the `agent-question` entry in `.size-limit.json` (tool-approval is 11.65 KB; this card also bundles `RadioGroup` and `Input`); no new runtime dependency.
- Runtime budget: none: static.
- Heavy parts: none (the body slot is the owner's).

## Examples

_Examples in `packages/webkit/examples/agent-question/`:_

- Default — a `choice` question with two options and Skip; Submit sends, then the card shows the answer.
- Types — the three answer controls side by side: `choice`, `text`, `confirm`. Justified: `type` picks the control, so this is the composite example of the axis.
- Loading — `status="running"`: the answer is being sent.
- Resolved — the outcomes that stay in the thread: `success`, `skipped`, `canceled`, and `error` with its line. Justified: `status` is the card's state axis, as in `tool-approval`'s Resolved example.

## Constraints — DO NOT

<!-- This block is injected VERBATIM into every sub-agent prompt.
     spec-validator rejects the spec if this block is missing or shorter than the template. -->

- Do not add props beyond the Props table above. If you need a prop that is not listed, emit `BLOCKED: missing prop <name>` and stop — do not invent.
- Do not add events beyond the Events table above. Same rule for slots and sub-components.
- Do not invent imports. Every `@aziontech/webkit/*` path must exist in `packages/webkit/package.json#exports`. Every relative import must resolve to a real file. Every npm package must be installed.
- Do not use HEX/RGB/HSL colors, Tailwind palette names (e.g. `bg-blue-500`), raw typography classes (e.g. `text-sm`), `any`, `@ts-ignore`, or `class` inside `defineProps`.
- Do not install or import positioning/animation libraries (`@floating-ui/*`, `popper.js`, `tippy.js`, `gsap`, `framer-motion`, `motion`, `@vueuse/motion`, `@formkit/auto-animate`, drag-drop runtimes, scroll virtualization libs). Use CSS + Vue primitives (`<Teleport>`, `<Transition>`). See `.claude/rules/dependencies.md`.
- Do not improvise animations. Every `animate-*` / `transition-*` class must come from `packages/theme/src/tokens/semantic/animations.js`; every motion-bearing class pairs with `motion-reduce:*` on the same class string; no component-local `@keyframes`.
- Do not create class presets in JavaScript (`const kindClasses = {...}`, `const sharedClasses = [...]`, `const sizeClasses = {...}`, `const rootClasses = computed(...)`). Variants live on `data-*` attributes consumed by Tailwind `data-[attr=value]:`. All utilities live inline on the root element's `class` attribute. No `<style>` block, no component-local `.css`/`.scss`. See `.claude/rules/styling.md`.
- Do not inherit artifacts as-is from another design system, Figma file, library, or pre-existing `CONTRACT.md` / `README.md`. Rewrite to our conventions. See `.claude/rules/migration.md`.
- Do not add Figma references to examples. No Figma URLs or node IDs in `examples/<name>/` files or `examples.json`. The Figma link is owned by `<name>.figma.ts` (Code Connect). See `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not add examples beyond Default + Types + Sizes + state examples (`Loading`, `Disabled`) for the props the component actually declares, unless the spec's "Examples" section explicitly justifies the addition. Do not split Types/Sizes into one-example-per-variant — the composite examples are the canonical pattern.
- Do not edit `.claude/docs/DESIGN.md` or `.claude/docs/COMPONENT_REQUIREMENTS.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

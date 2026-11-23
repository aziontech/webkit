---
name: tool-approval
category: ai
structure: monolithic
status: implemented
spec_version: 9
template: 2
checksum: be225220beba90c0ddd29c1858261cdababb025f8b833de6f2eea14b37951275
created: 2026-11-11
last_updated: 2026-11-19
---

# ToolApproval — Component Spec

## Purpose

A user-authorized action in a conversation (Cloudscape user-authorized actions, AI Elements
Confirmation): the agent proposes something with consequences — call a tool, run a command, deploy,
delete — and the reader approves or denies it before anything runs. The card states the action as a
question (``Allow `npm test`?``), says what will happen, shows exactly what will run in its body (a
`CodeBlock` with the command, `KeyValueList` with parameters), and offers Deny and Approve. Once
decided, the buttons give way to the outcome in text (`Approved`, `Denied`, `Request expired`) so the
decision stays in the thread. Irreversible actions (`variant="danger"`) turn Approve destructive and can
require typing a phrase first. With `editable` (opt-in) the reader corrects the call's arguments in a
code field before approving; the edit comes back through `v-model` and `approve`.

It is a card in the conversation, not a dialog: it does not trap focus and does not take initial
focus; `focus()` moves focus to its heading when the owner wants to bring the reader to it.

## When to use

- Use ToolApproval only inside an AI conversation when an agent asks permission to run a tool or command; for a person confirming an action they started use ConfirmDialog.
- One-time authorization of a consequential action proposed by an agent: a production deployment, a purge, a command.
- An irreversible action (delete): add `confirmationPhrase`.
- Arguments the reader may want to correct first (a URL list, a limit): add `editable`.

## When NOT to use

- Tools already trusted for the session → record the call with `tool-call`, do not ask again.
- A destructive action the reader started themselves in the UI → `confirm-dialog`.
- A form → this card only approves or denies.

## Related

- `tool-call` — the record of the call after it is approved (or `denied`).
- `confirm-dialog` — confirmation of the reader's own destructive action.
- `code-block`, `key-value-list` — what will run, in the body.
- `chat-message` — the assistant acknowledges the decision in the next message.

## Best practices

- Title is a question naming the action and target; put tool and command names in backticks (code).
- Match the approve label to the title verb (`Deploy`, `Delete`) when it is not a generic tool call.
- Never pre-focus or pre-select Approve for a risky action.
- Do not leave a request pending forever: expire it (`status="expired"`) and have the assistant say nothing ran.
- After Deny, the assistant acknowledges in the conversation ("Skipping that step.").
- With `editable`, bind `v-model` to the arguments as formatted JSON, set `invalid` while they do not parse, and run the call with the `input` that `approve` carries.
- Keep `editable` off for irreversible actions unless the edit is the point: the phrase confirms the target, the edit can change it.

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import ToolApproval from '@aziontech/webkit/tool-approval'
  import CodeBlock from '@aziontech/webkit/code-block'

  const status = ref('pending')
</script>

<template>
  <ToolApproval
    title="Allow `azion deploy --env production`?"
    description="Deploys the current build of storefront to production."
    approve-label="Deploy"
    :status="status"
    @approve="status = 'approved'"
    @deny="status = 'denied'"
  >
    <CodeBlock
      :tabs="[
        { label: 'Shell', value: 'cmd', code: 'azion deploy --env production', language: 'bash' }
      ]"
      :show-line-numbers="false"
    />
  </ToolApproval>
</template>
```

With editable arguments:

```vue
<script setup>
  import { computed, ref } from 'vue'
  import ToolApproval from '@aziontech/webkit/tool-approval'

  const status = ref('pending')
  const args = ref(JSON.stringify({ urls: ['https://www.example.com/app.js'] }, null, 2))
  const approvedArgs = ref(null)
  const invalid = computed(() => {
    try {
      JSON.parse(args.value)
      return false
    } catch {
      return true
    }
  })

  function onApprove(event, input) {
    status.value = 'approved'
    approvedArgs.value = JSON.parse(input)
  }
</script>

<template>
  <ToolApproval
    v-model="args"
    title="Allow `purge_urls`?"
    approve-label="Purge"
    editable
    :invalid="invalid"
    :status="status"
    @approve="onApprove"
    @deny="status = 'denied'"
  />
</template>
```

## Sub-components

_None. Exports: `"./tool-approval"`; types `ToolApprovalStatus`, `ToolApprovalVariant`.
Composed DS components: `button`, `status-indicator`; for `editable`, `field-root`, `textarea` and `field-error` under a plain `<label>` (no `field-label`, to keep its `Hint` out of the bundle); the title and description reuse
`StreamingResponse`'s inline renderer so backticks render as code (no HTML). Exposes `focus()`._

## Props

| Prop                 | Type                                               | Default     | Required | JSDoc                                                                                                                                       |
| -------------------- | -------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| `title`              | `string`                                           | —           | true     | The question, naming the action: ``Allow `npm test`?``, `Approve deployment to production?`. Backticks render as code.                      |
| `description`        | `string`                                           | `''`        | false    | One or two sentences on what will happen and to what; backticks render as code.                                                             |
| `status`             | `'pending' \| 'approved' \| 'denied' \| 'expired'` | `'pending'` | false    | `pending` asks; `approved`, `denied` and `expired` replace the buttons with the outcome in text.                                            |
| `variant`            | `'primary' \| 'danger'`                            | `'primary'` | false    | `danger` for an action that cannot be undone: the approve button turns destructive.                                                         |
| `confirmationPhrase` | `string`                                           | `''`        | false    | A word the reader must type before Approve enables, for irreversible actions (the resource name). Empty asks for no typing.                 |
| `approveLabel`       | `string`                                           | `''`        | false    | Text of the approve button, the verb of the title (`Deploy`, `Delete`). Empty uses the locale catalog (`Approve`).                          |
| `denyLabel`          | `string`                                           | `''`        | false    | Text of the deny button. Empty uses the locale catalog (`Deny`).                                                                            |
| `loading`            | `boolean`                                          | `false`     | false    | A decision is being sent; both buttons are inert and Approve shows its loading state.                                                       |
| `editable`           | `boolean`                                          | `false`     | false    | Lets the reader edit the call's input in a code field before approving; the edit comes back through `v-model` and `approve`.                |
| `invalid`            | `boolean`                                          | `false`     | false    | The edited input cannot be used (it does not parse): the field shows an error and Approve stays disabled. Has no effect without `editable`. |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                         |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------- |
| `v-model` | `string` | `''`    | `update:modelValue` | The call's arguments as text (usually JSON); the reader edits them with `editable`. Unbound, local and empty. |

## Events

| Event     | Payload                              | When                                                                                                                                                                                                                                           |
| --------- | ------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `approve` | `(event: MouseEvent, input: string)` | Approve pressed while `pending`, not `loading`, not `invalid` (with `editable`), and the phrase (if any) matches. `input` is the model value at that moment: the reader's edit with `editable`, otherwise the value bound (`''` when unbound). |
| `deny`    | `(event: MouseEvent)`                | Deny pressed while `pending` and not `loading`.                                                                                                                                                                                                |

- Payload change in spec_version 9: `approve` gained the trailing `input` argument. The DOM event stays first, so existing `(event) => …` handlers keep working and no codemod entry is needed.

## Slots

| Slot      | Scope | Notes                                                                    |
| --------- | ----- | ------------------------------------------------------------------------ |
| `default` | —     | What exactly will run: a `CodeBlock`, or `KeyValueList` with parameters. |

## States

- `data-status` mirrors `status`; `data-variant`.
- `pending`: phrase field (when `confirmationPhrase`; the phrase in its label is inline code), Deny (outlined) and Approve (primary, or danger with `variant="danger"`); Approve disabled until the phrase matches. Once the typed text is as long as the phrase and still differs, the field is `aria-invalid` with a `FieldError` (`toolApproval.phraseMismatch`).
- `editable` + `pending`: a monospace `Textarea` labelled `Arguments` under the body, growing to 12 lines, then scrolling; disabled while `loading`.
- `invalid` (with `editable` + `pending`): the field is `aria-invalid` with its `FieldError`; Approve is disabled (with `confirmationPhrase`, it also needs the phrase).
- `editable` once resolved: the field stays `readonly` as the record of the arguments that ran.
- `approved` (success), `denied` (warning), `expired` (neutral): a `StatusIndicator` with the outcome; the typed phrase resets when the card returns to `pending`. When the status leaves `pending` while focus was inside the card (or on the page body), focus moves to the heading so it never falls to the page.

## Motion & Animations

_No motion of its own; `Button` handles its loading spinner._

## Tokens

| Region          | Token                                                                                                      |
| --------------- | ---------------------------------------------------------------------------------------------------------- |
| frame           | `var(--bg-surface)`, `var(--border-default)` (danger pending: `var(--danger-border)`), `var(--shape-card)` |
| title           | `.text-heading-2xs`, `var(--text-default)`                                                                 |
| description     | `.text-body-sm`, `var(--text-muted)`                                                                       |
| shield glyph    | `var(--text-muted)` / `var(--danger-mark)`                                                                 |
| phrase input    | `Input` tokens in a `Field`; the phrase in the label `.text-label-code-sm` on `var(--bg-surface-raised)`   |
| arguments field | `Textarea` tokens (`monospace`); label `.text-label-sm`, `var(--text-default)`; error `FieldError` tokens  |
| padding/gaps    | `var(--spacing-md)`, `var(--spacing-sm)`, `var(--spacing-xs)`                                              |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: buttons and the phrase input show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`; the heading shows a ring when `focus()` moves focus to it.
- Keyboard map: `Tab` through the body, the arguments field (with `editable`), the phrase field, Deny, Approve; in the arguments field `Enter` adds a line and `Tab` leaves it; `Enter` / `Space` activate Deny and Approve. No focus trap, no initial focus (Cloudscape: the one-time decision card is not a dialog).
- ARIA: `role="group"` labelled by its `h3` title and described by the description; both fields have visible `<label>`s; the invalid arguments field and a mismatched phrase field are `aria-invalid` and described by their `FieldError` (`role="alert"`); the phrase field sets `autocapitalize="off"`; a polite live region announces the outcome; outcomes are text, never color alone.

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

## Right-to-left

- Layout: logical utilities; buttons align to the inline end.
- Icons: the shield is not mirrored.
- Keyboard: none.
- User data: code in the title and body is `dir="ltr"`; the arguments field is `dir="ltr"` (arguments are code).

## Responsive

- Container queries: none.
- Narrow: buttons wrap; the title wraps anywhere, inline code included, so the whole command in it stays readable. What will run must be readable without scrolling sideways before Approve: prefer a `KeyValueList` (or a `CodeBlock` whose lines are short, such as pretty-printed JSON) in the body, since a `CodeBlock` scrolls a long line inside itself.
- Touch: medium buttons (44 px on coarse pointers).
- Reflow: no page-level horizontal scroll at 320 px; the arguments field keeps each line of code whole (`wrap="off"`), grows to 12 lines, then scrolls inside itself, sideways for a long line.
- Touch: on coarse pointers (`pointer-coarse:`) the confirmation-phrase field and the arguments field (a `Textarea`) type at 16 px (`text-body-md`), so iOS Safari does not zoom the page on focus.

## Performance

- Bundle budget: see `.size-limit.json` (`tool-approval`).
- Runtime budget: static; with `editable`, the field resizes to its content on input (the `Textarea` auto-resize).
- Heavy parts: `field-root`, `textarea` and `field-error` load with the component (static imports, rendered only with `editable`); about 3 KB gzip. They are not split into an async chunk: the card is small, sits in a chat that already loads `Textarea` for its prompt, and an async chunk would make the field flash in on first use. The `tool-approval` budget is re-measured with them and raised by the measured growth, with the reason recorded in the change.

## Examples

_Examples in `packages/webkit/examples/tool-approval/`: Default (pending), Irreversible (typed phrase), Editable (the reader corrects the arguments before approving; `invalid` while they do not parse; once approved the field stays read-only as the record — a state example for the `editable` and `invalid` props), Resolved (approved, denied, expired)._

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

---
name: action-confirmation
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: e761c689a0068e9c974ad12899aea4fa958ff0f060cfa3948f2ed9caa11bcb10
created: 2026-11-11
last_updated: 2026-11-13
---

# ActionConfirmation — Component Spec

## Purpose

A user-authorized action in a conversation (Cloudscape user-authorized actions, AI Elements
Confirmation): the agent proposes something with consequences — call a tool, run a command, deploy,
delete — and the reader approves or denies it before anything runs. The card states the action as a
question (``Allow `npm test`?``), says what will happen, shows exactly what will run in its body (a
`CodeBlock` with the command, `KeyValuePairs` with parameters), and offers Deny and Approve. Once
decided, the buttons give way to the outcome in text (`Approved`, `Denied`, `Request expired`) so the
decision stays in the thread. Irreversible actions (`kind="danger"`) turn Approve destructive and can
require typing a phrase first.

It is a card in the conversation, not a dialog: it does not trap focus and does not take initial
focus; `focus()` moves focus to its heading when the owner wants to bring the reader to it.

## When to use

- One-time authorization of a consequential action proposed by an agent: a production deployment, a purge, a command.
- An irreversible action (delete): add `confirmationPhrase`.

## When NOT to use

- Tools already trusted for the session → record the call with `tool-call`, do not ask again.
- A destructive action the reader started themselves in the UI → `confirm-dialog`.
- A form → this card only approves or denies.

## Related

- `tool-call` — the record of the call after it is approved (or `denied`).
- `confirm-dialog` — confirmation of the reader's own destructive action.
- `code-block`, `key-value-pairs` — what will run, in the body.
- `chat-message` — the assistant acknowledges the decision in the next message.

## Best practices

- Title is a question naming the action and target; put tool and command names in backticks (code).
- Match the approve label to the title verb (`Deploy`, `Delete`) when it is not a generic tool call.
- Never pre-focus or pre-select Approve for a risky action.
- Do not leave a request pending forever: expire it (`state="expired"`) and have the assistant say nothing ran.
- After Deny, the assistant acknowledges in the conversation ("Skipping that step.").

## Usage

```vue
<script setup>
  import { ref } from 'vue'
  import ActionConfirmation from '@aziontech/webkit/action-confirmation'
  import CodeBlock from '@aziontech/webkit/code-block'

  const state = ref('pending')
</script>

<template>
  <ActionConfirmation
    title="Allow `azion deploy --env production`?"
    description="Deploys the current build of storefront to production."
    approve-label="Deploy"
    :state="state"
    @approve="state = 'approved'"
    @deny="state = 'denied'"
  >
    <CodeBlock :tabs="[{ label: 'Shell', value: 'cmd', code: 'azion deploy --env production', language: 'bash' }]" :show-line-numbers="false" />
  </ActionConfirmation>
</template>
```

## Sub-components

_None. Exports: `"./action-confirmation"`; types `ActionConfirmationState`, `ActionConfirmationKind`.
Composed DS components: `button`, `status-indicator`; the title and description reuse
`StreamingResponse`'s inline renderer so backticks render as code (no HTML). Exposes `focus()`._

## Props

| Prop                 | Type                                                 | Default     | Required | JSDoc                                                                                                       |
| -------------------- | ---------------------------------------------------- | ----------- | -------- | ----------------------------------------------------------------------------------------------------------- |
| `title`              | `string`                                             | —           | true     | The question, naming the action: ``Allow `npm test`?``, `Approve deployment to production?`. Backticks render as code. |
| `description`        | `string`                                             | `''`        | false    | One or two sentences on what will happen and to what; backticks render as code.                             |
| `state`              | `'pending' \| 'approved' \| 'denied' \| 'expired'`   | `'pending'` | false    | `pending` asks; `approved`, `denied` and `expired` replace the buttons with the outcome in text.            |
| `kind`               | `'default' \| 'danger'`                              | `'default'` | false    | `danger` for an action that cannot be undone: the approve button turns destructive.                         |
| `confirmationPhrase` | `string`                                             | `''`        | false    | A word the reader must type before Approve enables, for irreversible actions (the resource name). Empty asks for no typing. |
| `approveLabel`       | `string`                                             | `''`        | false    | Text of the approve button, the verb of the title (`Deploy`, `Delete`). Empty uses the locale catalog (`Approve`). |
| `denyLabel`          | `string`                                             | `''`        | false    | Text of the deny button. Empty uses the locale catalog (`Deny`).                                            |
| `loading`            | `boolean`                                            | `false`     | false    | A decision is being sent; both buttons are inert and Approve shows its loading state.                       |

## Events

| Event     | Payload               | When                                                                             |
| --------- | --------------------- | -------------------------------------------------------------------------------- |
| `approve` | `(event: MouseEvent)` | Approve pressed while `pending`, not `loading`, and the phrase (if any) matches. |
| `deny`    | `(event: MouseEvent)` | Deny pressed while `pending` and not `loading`.                                  |

## Slots

| Slot      | Scope | Notes                                                              |
| --------- | ----- | ------------------------------------------------------------------ |
| `default` | —     | What exactly will run: a `CodeBlock`, or `KeyValuePairs` with parameters. |

## States

- `data-status` mirrors `state`; `data-kind`.
- `pending`: phrase field (when `confirmationPhrase`), Deny (outlined) and Approve (primary, or danger with `kind="danger"`); Approve disabled until the phrase matches.
- `approved` (success), `denied` (warning), `expired` (neutral): a `StatusIndicator` with the outcome; the typed phrase resets when the card returns to `pending`.

## Motion & Animations

_No motion of its own; `Button` handles its loading spinner._

## Tokens

| Region       | Token                                                              |
| ------------ | ------------------------------------------------------------------ |
| frame        | `var(--bg-surface)`, `var(--border-default)` (danger pending: `var(--danger-border)`), `var(--shape-card)` |
| title        | `.text-heading-xxs`, `var(--text-default)`                         |
| description  | `.text-body-sm`, `var(--text-muted)`                               |
| shield glyph | `var(--text-muted)` / `var(--danger-contrast)`                     |
| phrase input | `var(--border-default)`, `var(--shape-elements)`, `.text-body-sm`  |
| padding/gaps | `var(--spacing-md)`, `var(--spacing-sm)`, `var(--spacing-xs)`      |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: buttons and the phrase input show `focus-visible:ring-2 focus-visible:ring-(--ring-color)`; the heading shows a ring when `focus()` moves focus to it.
- Keyboard map: `Tab` through the body, the phrase field, Deny, Approve; `Enter` / `Space` activates. No focus trap, no initial focus (Cloudscape: the one-time decision card is not a dialog).
- ARIA: `role="group"` labelled by its `h3` title and described by the description; the phrase field has a visible `<label>`; a polite live region announces the outcome; outcomes are text, never color alone.

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

## Right-to-left

- Layout: logical utilities; buttons align to the inline end.
- Icons: the shield is not mirrored.
- Keyboard: none.
- User data: code in the title and body is `dir="ltr"`.

## Responsive

- Container queries: none.
- Narrow: buttons wrap; the body's code scrolls inside its block.
- Touch: medium buttons (44 px on coarse pointers).
- Reflow: no horizontal scroll at 320 px.

## Performance

- Bundle budget: see `.size-limit.json` (`action-confirmation`).
- Runtime budget: static.
- Heavy parts: none (body content is the owner's).

## Examples

_Examples in `packages/webkit/examples/action-confirmation/`: Command (pending), Irreversible (typed phrase), Resolved (approved, denied, expired)._

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
- Do not edit `.claude/docs/DESIGN.md`, `.claude/docs/COMPONENT_REQUIREMENTS.md`, or `.claude/docs/PRIMEVUE_ABSTRACTION.md`.
- Do not edit the root `package.json` or `.github/workflows/*`.
- Do not export composition sub-components without attaching them to the root compound (`index.ts` via `Object.assign`; vue-tsc generates `index.d.ts` — never hand-write it); the root export points at `index.ts`, and a standalone `./<name>-root` export points at the root `.vue` (tree-shaking). Do not invent overlay part names (`Trigger` / `Content`) on a component with no `data-state=open|closed`, and do not collapse a slot-shaped concern into a config-array prop. See `.claude/rules/compound-api.md`.
- Do not change `structure` after `status: approved`. To change structure, bump `spec_version` and re-author the spec.
- Do not create files outside the paths declared by your task (the orchestrator tells you exactly which files to write).
- Do not run `git` commands, `pnpm install`, or any command that changes the lockfile.
- If anything in the spec is ambiguous or contradicts the rules, emit `BLOCKED: <one-sentence reason>` and write nothing.

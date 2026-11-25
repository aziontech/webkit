---
name: subagent-card
category: ai
structure: monolithic
status: implemented
stability: preview
spec_version: 1
template: 2
checksum: efd5a86c94484d88318efb77516b42338c515713846d0955d09ac18210a18554
created: 2026-11-19
last_updated: 2026-11-22
---

# SubagentCard — Component Spec

## Purpose

One helper agent the main agent handed part of the work to, shown inside the conversation
(TanStack AI `subagent` parts, AG-UI sub-agent runs; benchmarks: Vercel AI Elements Task,
Cloudscape generative AI progressive steps). A card names the helper agent, says in plain words
what it is doing, shows its status (`Waiting`, `Running`, `Completed`, `Failed`, `Stopped`) and
how long it has been working, offers `Stop` while it runs, and opens to the helper's own messages.
The component renders no messages itself: the owner puts the child run's messages (a
`StreamingResponse`, a `ToolCall`, a nested `SubagentCard`) in the default slot.

It is its own component, not new props on `tool-call`: a helper run carries its own message
stream (the default slot), a stop action, an elapsed clock, a summary line and a `canceled`
status, which would add three props, an event, a slot and a status value that a single tool call
never uses.

## When to use

- A response delegates a step to a helper agent (a researcher, a reviewer, a planner) whose run has its own status and its own messages.
- The reader may need to stop the helper without stopping the conversation.

## When NOT to use

- One tool or command the agent called → `tool-call`.
- Asking the reader to allow an action → `tool-approval`.
- The model's own reasoning → `reasoning`.
- A long job outside a chat → `progress` or `status-indicator` on the resource.

## Related

- `tool-call` — the same row for a single tool call; a helper's tool calls go in this card's slot.
- `status-indicator` — the status the row shows.
- `streaming-response` — the helper's text in the slot.
- `reasoning` — same elapsed time and skip pattern for thinking.

## Best practices

- Name the helper as it is defined (`researcher`) and say what it is doing in the reader's words (`Comparing cache plans`).
- Keep the card collapsed while the main answer is the point; open it when the helper fails so the reader sees why.
- Offer `Stop` only when the host can stop the helper (`stoppable`), and set the status to `canceled` once it stops.
- Put the error message in `description` when the helper fails.

## Usage

```vue
<script setup>
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SubagentCard from '@aziontech/webkit/subagent-card'
</script>

<template>
  <SubagentCard
    name="researcher"
    title="Comparing cache plans"
    status="running"
    stoppable
    @stop="stopResearcher"
  >
    <StreamingResponse content="Reading the pricing page of each plan." />
  </SubagentCard>
</template>
```

## Sub-components

_None. Exports: `"./subagent-card"`; type `SubagentCardStatus`. Composed DS components: `status-indicator`, `button`._

## Props

| Prop          | Type                                                           | Default     | Required | JSDoc                                                                                                                                                   |
| ------------- | -------------------------------------------------------------- | ----------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`        | `string`                                                       | —           | true     | The helper agent's identifier, shown in code font (`researcher`).                                                                                       |
| `title`       | `string`                                                       | `''`        | false    | What the helper is doing in the reader's words (`Comparing cache plans`). Empty shows only the name.                                                    |
| `description` | `string`                                                       | `''`        | false    | One summary line under the row: the latest step, the result, or the error message. Empty hides the line.                                                |
| `status`      | `'pending' \| 'running' \| 'success' \| 'error' \| 'canceled'` | `'running'` | false    | `pending` waits on the reader, `running` is in flight, then `success`, `error` or `canceled` (stopped).                                                 |
| `duration`    | `number`                                                       | `undefined` | false    | Seconds the helper has worked, when the host knows it. Without it the card counts its own running time, held while `pending`, frozen once the run ends. |
| `stoppable`   | `boolean`                                                      | `false`     | false    | Offers `Stop` while the status is `running` or `pending`.                                                                                               |
| `defaultOpen` | `boolean`                                                      | `false`     | false    | Initial open state when uncontrolled; the helper's messages start collapsed.                                                                            |

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                      |
| -------------- | --------- | ----------- | ------------- | ------------------------------------------------------------------------------------------ |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Messages expanded or collapsed. Unbound, the state is local and starts from `defaultOpen`. |

## Events

| Event  | Payload               | Notes                                                                                  |
| ------ | --------------------- | -------------------------------------------------------------------------------------- |
| `stop` | `(event: MouseEvent)` | The reader pressed `Stop`; the owner stops the helper and sets `status` to `canceled`. |

## Slots

| Slot      | Scope | Notes                                                                                 |
| --------- | ----- | ------------------------------------------------------------------------------------- |
| `default` | —     | The helper's own messages (`StreamingResponse`, `ToolCall`, a nested `SubagentCard`). |
| `input`   | —     | The task the main agent gave the helper (`CodeBlock`, `KeyValueList`, or a sentence). |

## States

- `data-status` mirrors `status`; `data-state="open|closed"` only when a slot makes the card expandable.
- Status mapping: `pending` neutral, `running` info with spinner, `success` success, `error` danger, `canceled` warning.
- Without `default` / `input` content the row is static (no toggle button).
- `Stop` renders only when `stoppable` and the status is `running` or `pending`.
- Elapsed time: `duration` when given; otherwise counted live on the client, once a second, while `running`. The count adds up running time across `running → pending → running` (a helper that waits on the reader) and shows its held value while `pending`; it freezes when the status becomes `success`, `error` or `canceled`. Hidden when unknown (a restored card with no `duration` and no running time seen). Format: `12s`, `2m 5s`, `1h 2m`.
- The `Task` section and its heading render only when the `input` slot is passed; the `Activity` section and its heading only when the default slot is passed.
- Error: `data-status="error"`, a danger `StatusIndicator`, and the error message in `description`.
- `disabled`, `readonly`, `invalid`, `loading` and `empty` do not apply.

## Motion & Animations

| Trigger            | Animation / Transition                                          | Token     | Reduced-motion fallback         |
| ------------------ | --------------------------------------------------------------- | --------- | ------------------------------- |
| chevron open/close | `transition-[rotate] duration-fast-02 ease-productive-entrance` | `fast-02` | `motion-reduce:transition-none` |
| running spinner    | `Spinner` inside `StatusIndicator`                              | component | handled by `Spinner`            |

## Tokens

| Region        | Token                                                                                                                                                   |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| frame         | none: a quiet row in the assistant column, at least 40 px tall; the panel hangs under a 1 px `border-s var(--border-default)` rule, `var(--spacing-md)` |
| title         | `.text-body-sm`, `var(--text-muted)` → hover `var(--text-default)`                                                                                      |
| name          | `.text-body-code-sm` with a 1 px block padding (room for descenders), `var(--bg-surface-raised)`, `var(--text-muted)`                                   |
| description   | `.text-body-sm`, `var(--text-muted)`, indented to the title's start                                                                                     |
| elapsed       | `.text-label-sm`, `tabular-nums`, `var(--text-muted)`                                                                                                   |
| section label | `.text-label-sm`, `var(--text-muted)`                                                                                                                   |
| padding       | `var(--spacing-sm)`, `var(--spacing-xs)`                                                                                                                |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the toggle; `Button` owns its own ring.
- Keyboard map: `Tab` to the toggle, `Enter` / `Space` opens or closes the messages; `Tab` to `Stop`, `Enter` / `Space` stops. The toggle and `Stop` are siblings, never nested.
- ARIA: the toggle is a `button` with `aria-expanded` / `aria-controls`; the status is a `StatusIndicator` inside a `role="status"` region the card owns, so a change from Running to Completed is announced; the live elapsed time sits outside that region so its ticking is not announced; the `Stop` button's name includes the helper (`Stop researcher`); Task and Activity are `section`s labelled by their `h4`.
- Status is conveyed in text, never by color alone.
- Focus: when `Stop` leaves the DOM while it holds focus (the status becomes `canceled`), focus moves to the toggle, or to the card root (`tabindex="-1"`) when the row is static; the `role="status"` region announces `Stopped`.
- Accessible name of the toggle: its text, the title and the helper name; the status is announced by the status region.
- Contrast: `--text-default` and `--text-muted` on the canvas (`--bg-canvas`), and `--text-muted` on `--bg-surface-raised` (the name chip), pass WCAG 2.1 AA and their APCA targets; status colours come from `StatusIndicator`, and the status is always text. No disabled state.

## Internationalization

| Key                      | English source | Override prop |
| ------------------------ | -------------- | ------------- |
| `subagentCard.pending`   | `Waiting`      | —             |
| `subagentCard.running`   | `Running`      | —             |
| `subagentCard.success`   | `Completed`    | —             |
| `subagentCard.error`     | `Failed`       | —             |
| `subagentCard.canceled`  | `Stopped`      | —             |
| `subagentCard.stop`      | `Stop`         | —             |
| `subagentCard.stopAgent` | `Stop {name}`  | —             |
| `subagentCard.input`     | `Task`         | —             |
| `subagentCard.activity`  | `Activity`     | —             |

- Formatting: elapsed time through `Intl.NumberFormat` with `style: 'unit'` (`second`, `minute`, `hour`, `unitDisplay: 'narrow'`) in the active locale: `12s`, `2m 5s`, `1h 2m`.

## Right-to-left

- Layout: logical utilities (`ms-auto` on the chevron, `text-start`).
- Icons: git-fork, chevron-down and stop are not mirrored.
- Keyboard: none.
- User data: the helper name is `dir="ltr"` code.

## Responsive

- Container queries: none.
- Narrow: the elapsed time, status and `Stop` keep their size and wrap to a second line, aligned to the end, when the row cannot give the name 12rem; the title wraps to two lines before it clamps, and the agent name drops to its own line under it when there is no room for both, truncating only past the row's width; the description wraps.
- Touch: 40 px row; the toggle reaches 44 px on coarse pointers (`pointer-coarse:min-h-11`) and `Stop` uses `Button`'s own 44 px coarse-pointer hit area. Hover-only affordances: none.
- Reflow: slot content reflows inside the panel; code in it scrolls inside its block.

## Performance

- Bundle budget: 6.1 KB gzip for `./subagent-card` in `.size-limit.json` (measured 6.00 KB: it composes both `Button`, like reasoning at 4.65 KB, and `StatusIndicator`, like tool-call at 3.5 KB, plus a timer).
- Runtime budget: one interval of 1 s while `running` without `duration`, cleared when the status leaves `running` or the card unmounts.
- Heavy parts: none (slot content is the owner's).

## Examples

_Examples in `packages/webkit/examples/subagent-card/`: Default (every status as a static row, with elapsed time and a summary line), With messages (a running helper opened with its messages, `Stop`, a nested helper, and a failed helper with its task)._

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

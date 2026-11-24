---
name: agent-activity
category: ai
structure: monolithic
status: implemented
spec_version: 1
template: 2
checksum: f7c9abfee257e6a69774d45130badabccc0883afa238cfb1155439c1dc33e496
created: 2026-11-19
last_updated: 2026-11-22
---

# AgentActivity — Component Spec

## Purpose

Shows what an agent is doing while it works (Cloudscape progressive steps, AI Elements Chain of
Thought): the current step with a running indicator (`Searching the docs`, `Reading 3 files`) and,
behind a disclosure, the list of every step with its status from the shared status set. It is the
display of the short progress updates an agent streams (TanStack AI `activity` parts and
`role: 'activity'` messages), filled from plain props so it stays library-neutral. Screen readers hear
a step only when it has been the current one for a second, and the outcome once, never every tick.

## When to use

- An agent works through several steps before or while it answers, and the reader should see which step it is on (`Searching the docs`, `Reading 3 files`, `Writing the answer`).
- A plan the agent ticks over, step by step, inside a chat message.

## When NOT to use

- Nothing to report but that an answer is coming → `response-loading`.
- The model's free-text thinking trace → `reasoning`.
- A call with side effects, its input and output → `tool-call`; one asking for approval → `tool-approval`.
- A build or deploy run with log lines per step → `log-viewer-steps`.
- Moving through the pages of a form or wizard → `stepper`.

## Related

- `response-loading` — the waiting state before the first step arrives.
- `reasoning` — thinking, not doing.
- `tool-call` — one call in detail; an activity step can summarize it.
- `chat-message` — the bubble the activity sits in.

## Best practices

- Title each step `<Verb>ing <what>` in the reader's words, no end punctuation: `Searching the docs`, never a tool identifier.
- Keep one step `running` at a time; later steps stay `pending` until they start.
- When a step fails, mark it `error` and the steps that will no longer run `canceled`.
- Keep the steps collapsed in a chat once the answer arrives; the answer is the main content.
- Key each step by something stable, such as the id of the activity message it comes from.
- Use 3 to 7 steps; merge fine-grained ticks into one step and update its `description` instead.

## Usage

```vue
<script setup>
  import AgentActivity from '@aziontech/webkit/agent-activity'
</script>

<template>
  <AgentActivity
    :steps="[
      { key: 'search', title: 'Searching the docs', status: 'success' },
      { key: 'read', title: 'Reading 3 files', status: 'running', description: 'cache-settings.md' },
      { key: 'write', title: 'Writing the answer', status: 'pending' }
    ]"
  />
</template>
```

## Props

| Prop          | Type                  | Default | Required | JSDoc                                                                                                                                                                                                                                                                                        |
| ------------- | --------------------- | ------- | -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `steps`       | `AgentActivityStep[]` | `[]`    | false    | The steps of the work, in order: each has a `key`, a `title`, a `status` from the shared status set and an optional `description`. The current step is the first running one, else the first failed one, else the last canceled one of a stopped run, else the last one that is not pending. |
| `defaultOpen` | `boolean`             | `false` | false    | Initial open state of the step list when uncontrolled; collapsed shows only the current step.                                                                                                                                                                                                |
| `ariaLabel`   | `string`              | `''`    | false    | Accessible name of the activity. Empty uses the locale catalog (`Agent activity`).                                                                                                                                                                                                           |

Exported types:

- `AgentActivityStatus` = `'pending' \| 'running' \| 'success' \| 'error' \| 'canceled' \| 'skipped'`.
- `AgentActivityStep` = `{ key: string; title: string; status: AgentActivityStatus; description?: string }`.

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                               |
| -------------- | --------- | ----------- | ------------- | --------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | The step list was expanded or collapsed. Unbound, the state is local and starts from `defaultOpen`. |

## Events

_No events beyond `update:open` (v-model above)._

## Slots

_No slots._

## States

- `data-status` on the root mirrors the current step's status; `data-state="open|closed"` when there is more than one step.
- Current step (the one rule): the first `running` step, else the first `error` step, else, when the run is stopped (see Outcomes), the last `canceled` step, else the last step that is not `pending` (between two steps, the one just finished, so the root reads `success` while the next step has not started), else the first step (a plan that has not started). Collapsed shows only it, so a failed run shows the failed step, never a trailing `canceled` one; open shows every step in order, the current one marked `aria-current="step"`. `data-status` mirrors the same step.
- The step list `ol` (id from `useId()`) is always rendered: collapsed it holds only the current step's `li`, open it holds every step.
- The disclosure (`{count} steps`, chevron) appears only with two or more steps.
- Step glyphs: `running` a `Spinner`; `success` `az az-circle-check`; `error` `az az-circle-x`; `canceled` `az az-circle-stop`; `skipped` `az az-circle-minus`; `pending` a CSS ring at the glyph size (`rounded-full border border-dashed border-(--text-muted)`), not an icon. Pending, canceled and skipped titles are muted.
- Outcomes: the run is failed when a step is `error`; stopped when no step is `running`, `pending` or `error` and at least one is `canceled` (the reader or the owner stopped it; the current-step rule then picks the last `canceled` step, so `data-status` is `canceled`); finished when every step is `success` or `skipped`.
- No steps: the root renders no rows and no `data-status`; the polite region stays in the DOM, so the first step announced after an empty mount is heard.
- `loading`, `disabled`, `readonly` and `invalid` do not apply: progress is carried by the `running` step status, and the toggle is the only control.

## Motion & Animations

| Trigger            | Animation / Transition                                           | Token     | Reduced-motion fallback                                         |
| ------------------ | ---------------------------------------------------------------- | --------- | --------------------------------------------------------------- |
| running step       | `Spinner` component                                              | spinner   | the Spinner's own `motion-reduce` fallback; `aria-hidden` glyph |
| chevron open/close | `transition-transform duration-fast-02 ease-productive-entrance` | `fast-02` | `motion-reduce:transition-none`                                 |
| toggle color hover | `transition-colors duration-fast-02 ease-productive-entrance`    | `fast-02` | `motion-reduce:transition-none`                                 |

## Tokens

| Region           | Token                                                                                                                                                                                 |
| ---------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| step title       | `.text-body-md`, `var(--text-default)`; pending, canceled, skipped `var(--text-muted)`                                                                                                |
| step description | `.text-body-sm`, `var(--text-muted)`                                                                                                                                                  |
| toggle           | `.text-body-sm`, `var(--text-muted)` → hover `var(--text-default)`                                                                                                                    |
| glyphs           | `az-circle-check` `var(--success-mark)`, `az-circle-x` `var(--danger-mark)`; `az-circle-stop`, `az-circle-minus`, the running Spinner and the pending ring border `var(--text-muted)` |
| gaps             | `var(--spacing-2xs)`, `var(--spacing-xs)`                                                                                                                                             |
| ring             | `var(--ring-color)`                                                                                                                                                                   |

## Theme gaps

_None._

## Accessibility (WCAG 2.1 AA)

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the toggle.
- Pattern: the toggle and the step list follow the WAI-ARIA APG Disclosure (Show/Hide) pattern; the step list is a static ordered list.
- Keyboard map: `Tab` to the toggle, `Enter` / `Space` expands or collapses the step list. The steps are not focusable.
- ARIA: the root is a `role="group"` named by `ariaLabel`; the steps are an ordered list (`ol`); the current step has `aria-current="step"`; each glyph is `aria-hidden` and a visually hidden status word (`Done`, `Failed`, …) follows each title; the toggle is a `button` with `aria-expanded` and `aria-controls`, which always targets the step list `ol` (rendered in both states).
- Announcements: one visually hidden `aria-live="polite"` region, outside the list. It announces a running step's title once it has stayed current for one second (fast ticks are never read), then the outcome once: `Finished {count} steps` when the run becomes finished, `Stopped after {count} steps` when it becomes stopped ({count} is the number of `success` steps in both), or `Failed: {title}` when a step errors. A stopped run is never announced as finished. An outcome is announced only when it changes after mount: an instance mounted with a finished or failed run (a chat history re-render) announces nothing; a step already running at mount is live work and is announced after the same one-second dwell. The one-second timer is cleared on every step change and on unmount (`onScopeDispose`). The list itself is not live.
- Contrast ≥4.5:1 on titles and the muted text; every glyph colour (`--success-mark`, `--danger-mark`, `--text-muted`) meets 3:1 and APCA Lc 45 for icons.
- Reduced motion: the spinner and the chevron stop moving; the status words carry the state.

## Internationalization

| Key                      | English source                           | Override prop |
| ------------------------ | ---------------------------------------- | ------------- |
| `agentActivity.label`    | `Agent activity`                         | `ariaLabel`   |
| `agentActivity.steps`    | `{count} step(s)` (plural)               | —             |
| `agentActivity.finished` | `Finished {count} step(s)` (plural)      | —             |
| `agentActivity.stopped`  | `Stopped after {count} step(s)` (plural) | —             |
| `agentActivity.failed`   | `Failed: {title}`                        | —             |
| `agentActivity.pending`  | `Pending`                                | —             |
| `agentActivity.running`  | `Running`                                | —             |
| `agentActivity.success`  | `Done`                                   | —             |
| `agentActivity.error`    | `Failed`                                 | —             |
| `agentActivity.canceled` | `Canceled`                               | —             |
| `agentActivity.skipped`  | `Skipped`                                | —             |

- Formatting: plural rules through `Intl.PluralRules` and the count through `Intl.NumberFormat`, both with the provider locale (the same locale the messages resolve from); a plural form the catalog lacks falls back to `other`. Step titles and descriptions come translated from the owner.

## Right-to-left

- Layout: logical utilities only (`ms-`, `ps-`, `text-start`); the glyph column sits on the inline start. The list has no guide rule.
- Icons: chevron-down and the status circles are not mirrored.
- Keyboard: none beyond the toggle.
- User data: titles and descriptions render with `dir="auto"`, so a file name or identifier keeps its own direction.

## Responsive

- Container queries: none — a single column whose rows wrap, the same at every container width.
- Hover: only the toggle's colour changes on hover; nothing is hover-only.
- Narrow: titles and descriptions wrap; nothing truncates.
- Touch: the toggle is text-sized with a 24 px minimum height (44 px on coarse pointers).
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Performance

- Bundle budget: `4 KB` gzip for `./agent-activity` (Spinner included) in `.size-limit.json`, ratcheted to measured plus headroom at build.
- Runtime budget: one render per step update; a single one-second timer for the announcement.
- Heavy parts: none.

## Examples

_Examples in `packages/webkit/examples/agent-activity/`: Default (a step running, two done, one pending, collapsed), Statuses (every status in the open list), Streaming (steps tick over on a timer the reader starts, ending done)._

The Statuses example is justified because the component has a closed `status` set and no `variant`; Streaming shows the live behaviour (the announcement and the current-step swap) that a static render cannot.

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

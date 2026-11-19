# Agent Activity

> Shows what an agent is doing while it works (Cloudscape progressive steps, AI Elements Chain of Thought): the current step with a running indicator (`Searching the docs`, `Reading 3 files`) and, behind a disclosure, the list of every step with its status from the shared status set. It is the display of the short progress updates an agent streams (TanStack AI `activity` parts and `role: 'activity'` messages), filled from plain props so it stays library-neutral. Screen readers hear a step only when it has been the current one for a second, and the outcome once, never every tick.

- Import: `import AgentActivity from '@aziontech/webkit/agent-activity'`
- Category: ai · Surface: app · Structure: monolithic
- API as JSON: [agent-activity.json](agent-activity.json)

## When to use

- An agent works through several steps before or while it answers, and the reader should see which step it is on (`Searching the docs`, `Reading 3 files`, `Writing the answer`).
- A plan the agent ticks over, step by step, inside a chat message.

## Do

- Title each step `<Verb>ing <what>` in the reader's words, no end punctuation: `Searching the docs`, never a tool identifier.
- Keep one step `running` at a time; later steps stay `pending` until they start.
- When a step fails, mark it `error` and the steps that will no longer run `canceled`.
- Keep the steps collapsed in a chat once the answer arrives; the answer is the main content.
- Key each step by something stable, such as the id of the activity message it comes from.
- Use 3 to 7 steps; merge fine-grained ticks into one step and update its `description` instead.

## Don’t

- Nothing to report but that an answer is coming → `response-loading`.
- The model's free-text thinking trace → `reasoning`.
- A call with side effects, its input and output → `tool-call`; one asking for approval → `tool-approval`.
- A build or deploy run with log lines per step → `log-viewer-steps`.
- Moving through the pages of a form or wizard → `stepper`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [response-loading](response-loading.md) — the waiting state before the first step arrives.
- [reasoning](reasoning.md) — thinking, not doing.
- [tool-call](tool-call.md) — one call in detail; an activity step can summarize it.
- [chat-message](chat-message.md) — the bubble the activity sits in.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `steps` | `AgentActivityStep[]` | `[]` | false | The steps of the work, in order: each has a `key`, a `title`, a `status` from the shared status set and an optional `description`. The current step is the first running one, else the first failed one, else the last canceled one of a stopped run, else the last one that is not pending. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state of the step list when uncontrolled; collapsed shows only the current step. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the activity. Empty uses the locale catalog (`Agent activity`). |
| `open` | `boolean` | `undefined as never` | false | Two-way value (`v-model:open`). |

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                               |
| -------------- | --------- | ----------- | ------------- | --------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `undefined` | `update:open` | The step list was expanded or collapsed. Unbound, the state is local and starts from `defaultOpen`. |

## States

- `data-status` on the root mirrors the current step's status; `data-state="open|closed"` when there is more than one step.
- Current step (the one rule): the first `running` step, else the first `error` step, else, when the run is stopped (see Outcomes), the last `canceled` step, else the last step that is not `pending` (between two steps, the one just finished, so the root reads `success` while the next step has not started), else the first step (a plan that has not started). Collapsed shows only it, so a failed run shows the failed step, never a trailing `canceled` one; open shows every step in order, the current one marked `aria-current="step"`. `data-status` mirrors the same step.
- The step list `ol` (id from `useId()`) is always rendered: collapsed it holds only the current step's `li`, open it holds every step.
- The disclosure (`{count} steps`, chevron) appears only with two or more steps.
- Step glyphs: `running` a `Spinner`; `success` `az az-circle-check`; `error` `az az-circle-x`; `canceled` `az az-circle-stop`; `skipped` `az az-circle-minus`; `pending` a CSS ring at the glyph size (`rounded-full border border-dashed border-(--text-muted)`), not an icon. Pending, canceled and skipped titles are muted.
- Outcomes: the run is failed when a step is `error`; stopped when no step is `running`, `pending` or `error` and at least one is `canceled` (the reader or the owner stopped it; the current-step rule then picks the last `canceled` step, so `data-status` is `canceled`); finished when every step is `success` or `skipped`.
- No steps: the root renders no rows and no `data-status`; the polite region stays in the DOM, so the first step announced after an empty mount is heard.
- `loading`, `disabled`, `readonly` and `invalid` do not apply: progress is carried by the `running` step status, and the toggle is the only control.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the toggle.
- Pattern: the toggle and the step list follow the WAI-ARIA APG Disclosure (Show/Hide) pattern; the step list is a static ordered list.
- Keyboard map: `Tab` to the toggle, `Enter` / `Space` expands or collapses the step list. The steps are not focusable.
- ARIA: the root is a `role="group"` named by `ariaLabel`; the steps are an ordered list (`ol`); the current step has `aria-current="step"`; each glyph is `aria-hidden` and a visually hidden status word (`Done`, `Failed`, …) follows each title; the toggle is a `button` with `aria-expanded` and `aria-controls`, which always targets the step list `ol` (rendered in both states).
- Announcements: one visually hidden `aria-live="polite"` region, outside the list. It announces a running step's title once it has stayed current for one second (fast ticks are never read), then the outcome once: `Finished {count} steps` when the run becomes finished, `Stopped after {count} steps` when it becomes stopped ({count} is the number of `success` steps in both), or `Failed: {title}` when a step errors. A stopped run is never announced as finished. An outcome is announced only when it changes after mount: an instance mounted with a finished or failed run (a chat history re-render) announces nothing; a step already running at mount is live work and is announced after the same one-second dwell. The one-second timer is cleared on every step change and on unmount (`onScopeDispose`). The list itself is not live.
- Contrast ≥4.5:1 on titles and the muted text; every glyph colour (`--success-mark`, `--danger-mark`, `--text-muted`) meets 3:1 and APCA Lc 45 for icons.
- Reduced motion: the spinner and the chevron stop moving; the status words carry the state.

## Right-to-left

- Layout: logical utilities only (`ms-`, `ps-`, `text-start`); the glyph column sits on the inline start. The list has no guide rule.
- Icons: chevron-down and the status circles are not mirrored.
- Keyboard: none beyond the toggle.
- User data: titles and descriptions render with `dir="auto"`, so a file name or identifier keeps its own direction.

## Internationalization

| Key                       | English source                    | Override prop |
| ------------------------- | --------------------------------- | ------------- |
| `agentActivity.label`     | `Agent activity`                  | `ariaLabel`   |
| `agentActivity.steps`     | `{count} step(s)` (plural)        | —             |
| `agentActivity.finished`  | `Finished {count} step(s)` (plural) | —           |
| `agentActivity.stopped`   | `Stopped after {count} step(s)` (plural) | —      |
| `agentActivity.failed`    | `Failed: {title}`                 | —             |
| `agentActivity.pending`   | `Pending`                         | —             |
| `agentActivity.running`   | `Running`                         | —             |
| `agentActivity.success`   | `Done`                            | —             |
| `agentActivity.error`     | `Failed`                          | —             |
| `agentActivity.canceled`  | `Canceled`                        | —             |
| `agentActivity.skipped`   | `Skipped`                         | —             |

- Formatting: plural rules through `Intl.PluralRules` and the count through `Intl.NumberFormat`, both with the provider locale (the same locale the messages resolve from); a plural form the catalog lacks falls back to `other`. Step titles and descriptions come translated from the owner.

## Responsive

- Container queries: none — a single column whose rows wrap, the same at every container width.
- Hover: only the toggle's colour changes on hover; nothing is hover-only.
- Narrow: titles and descriptions wrap; nothing truncates.
- Touch: the toggle is text-sized with a 24 px minimum height (44 px on coarse pointers).
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import AgentActivity from '@aziontech/webkit/agent-activity'

  const steps = [
    { key: 'search', title: 'Searching the docs', status: 'success' },
    { key: 'settings', title: 'Reading the cache settings', status: 'success' },
    {
      key: 'read',
      title: 'Reading 3 files',
      status: 'running',
      description: 'cache-settings.md'
    },
    { key: 'write', title: 'Writing the answer', status: 'pending' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <AgentActivity :steps="steps" />
  </div>
</template>
```

### Statuses

```vue
<script setup>
  import AgentActivity from '@aziontech/webkit/agent-activity'

  const steps = [
    { key: 'search', title: 'Searching the docs', status: 'success' },
    {
      key: 'purge',
      title: 'Purging the cache of example.com',
      status: 'error',
      description: 'The purge quota for this hour is used up.'
    },
    { key: 'retry', title: 'Retrying the purge', status: 'running' },
    { key: 'deploy', title: 'Deploying the workload', status: 'canceled' },
    { key: 'notify', title: 'Notifying the team', status: 'skipped' },
    { key: 'report', title: 'Writing the report', status: 'pending' }
  ]
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <AgentActivity
      :steps="steps"
      default-open
    />
  </div>
</template>
```

### Streaming

```vue
<script setup>
  import AgentActivity from '@aziontech/webkit/agent-activity'
  import Button from '@aziontech/webkit/button'
  import { computed, onBeforeUnmount, ref } from 'vue'

  const titles = [
    'Searching the docs',
    'Reading 3 files',
    'Checking the workload of app.example.com',
    'Writing the answer'
  ]

  const reached = ref(-1)
  let timer

  const steps = computed(() =>
    titles.map((title, index) => ({
      key: String(index),
      title,
      status: index < reached.value ? 'success' : index === reached.value ? 'running' : 'pending'
    }))
  )

  function start() {
    clearInterval(timer)
    reached.value = 0
    timer = setInterval(() => {
      reached.value += 1
      if (reached.value >= titles.length) clearInterval(timer)
    }, 1500)
  }

  onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col items-start gap-(--spacing-md)">
    <Button
      label="Run the agent"
      variant="secondary"
      size="medium"
      @click="start"
    />
    <AgentActivity
      v-if="reached >= 0"
      :steps="steps"
    />
  </div>
</template>
```

# Subagent Card

> One helper agent the main agent handed part of the work to, shown inside the conversation (TanStack AI `subagent` parts, AG-UI sub-agent runs; benchmarks: Vercel AI Elements Task, Cloudscape generative AI progressive steps). A card names the helper agent, says in plain words what it is doing, shows its status (`Waiting`, `Running`, `Completed`, `Failed`, `Stopped`) and how long it has been working, offers `Stop` while it runs, and opens to the helper's own messages. The component renders no messages itself: the owner puts the child run's messages (a `StreamingResponse`, a `ToolCall`, a nested `SubagentCard`) in the default slot. It is its own component, not new props on `tool-call`: a helper run carries its own message stream (the default slot), a stop action, an elapsed clock, a summary line and a `canceled` status, which would add three props, an event, a slot and a status value that a single tool call never uses.

- Import: `import SubagentCard from '@aziontech/webkit/subagent-card'`
- Category: ai · Surface: app · Structure: monolithic
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- API as JSON: [subagent-card.json](subagent-card.json)

## When to use

- A response delegates a step to a helper agent (a researcher, a reviewer, a planner) whose run has its own status and its own messages.
- The reader may need to stop the helper without stopping the conversation.

## Do

- Name the helper as it is defined (`researcher`) and say what it is doing in the reader's words (`Comparing cache plans`).
- Keep the card collapsed while the main answer is the point; open it when the helper fails so the reader sees why.
- Offer `Stop` only when the host can stop the helper (`stoppable`), and set the status to `canceled` once it stops.
- Put the error message in `description` when the helper fails.

## Don’t

- One tool or command the agent called → `tool-call`.
- Asking the reader to allow an action → `tool-approval`.
- The model's own reasoning → `reasoning`.
- A long job outside a chat → `progress` or `status-indicator` on the resource.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [tool-call](tool-call.md) — the same row for a single tool call; a helper's tool calls go in this card's slot.
- [status-indicator](status-indicator.md) — the status the row shows.
- [streaming-response](streaming-response.md) — the helper's text in the slot.
- [reasoning](reasoning.md) — same elapsed time and skip pattern for thinking.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `name` | `string` | `—` | true | The helper agent's identifier, shown in code font (`researcher`). |
| `title` | `string` | `''` | false | What the helper is doing in the reader's words (`Comparing cache plans`). Empty shows only the name. |
| `description` | `string` | `''` | false | One summary line under the row: the latest step, the result, or the error message. Empty hides the line. |
| `status` | `'pending' \| 'running' \| 'success' \| 'error' \| 'canceled'` | `'running'` | false | `pending` waits on the reader, `running` is in flight, then `success`, `error` or `canceled` (stopped). |
| `duration` | `number` | `undefined` | false | Seconds the helper has worked, when the host knows it. Without it the card counts its own running time, held while `pending`, frozen once the run ends. |
| `stoppable` | `boolean` | `false` | false | Offers `Stop` while the status is `running` or `pending`. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled; the helper's messages start collapsed. |
| `open` | `boolean` | `undefined` | false | Two-way value (`v-model:open`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `stop` | `(event: MouseEvent)` | The reader pressed `Stop`; the owner stops the helper and sets `status` to `canceled`. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The helper's own messages (`StreamingResponse`, `ToolCall`, a nested `SubagentCard`). |
| `input` | — | The task the main agent gave the helper (`CodeBlock`, `KeyValueList`, or a sentence). |

## Sub-components

_None. Exports: `"./subagent-card"`; type `SubagentCardStatus`. Composed DS components: `status-indicator`, `button`._

## v-model

| Model          | Type      | Default     | Emits         | Notes                                                                                      |
| -------------- | --------- | ----------- | ------------- | ------------------------------------------------------------------------------------------ |
| `v-model:open` | `boolean` | `undefined` | `update:open` | Messages expanded or collapsed. Unbound, the state is local and starts from `defaultOpen`. |

## States

- `data-status` mirrors `status`; `data-state="open|closed"` only when a slot makes the card expandable.
- Status mapping: `pending` neutral, `running` info with spinner, `success` success, `error` danger, `canceled` warning.
- Without `default` / `input` content the row is static (no toggle button).
- `Stop` renders only when `stoppable` and the status is `running` or `pending`.
- Elapsed time: `duration` when given; otherwise counted live on the client, once a second, while `running`. The count adds up running time across `running → pending → running` (a helper that waits on the reader) and shows its held value while `pending`; it freezes when the status becomes `success`, `error` or `canceled`. Hidden when unknown (a restored card with no `duration` and no running time seen). Format: `12s`, `2m 5s`, `1h 2m`.
- The `Task` section and its heading render only when the `input` slot is passed; the `Activity` section and its heading only when the default slot is passed.
- Error: `data-status="error"`, a danger `StatusIndicator`, and the error message in `description`.
- `disabled`, `readonly`, `invalid`, `loading` and `empty` do not apply.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the toggle; `Button` owns its own ring.
- Keyboard map: `Tab` to the toggle, `Enter` / `Space` opens or closes the messages; `Tab` to `Stop`, `Enter` / `Space` stops. The toggle and `Stop` are siblings, never nested.
- ARIA: the toggle is a `button` with `aria-expanded` / `aria-controls`; the status is a `StatusIndicator` inside a `role="status"` region the card owns, so a change from Running to Completed is announced; the live elapsed time sits outside that region so its ticking is not announced; the `Stop` button's name includes the helper (`Stop researcher`); Task and Activity are `section`s labelled by their `h4`.
- Status is conveyed in text, never by color alone.
- Focus: when `Stop` leaves the DOM while it holds focus (the status becomes `canceled`), focus moves to the toggle, or to the card root (`tabindex="-1"`) when the row is static; the `role="status"` region announces `Stopped`.
- Accessible name of the toggle: its text, the title and the helper name; the status is announced by the status region.
- Contrast: `--text-default` and `--text-muted` on the canvas (`--bg-canvas`), and `--text-muted` on `--bg-surface-raised` (the name chip), pass WCAG 2.1 AA and their APCA targets; status colours come from `StatusIndicator`, and the status is always text. No disabled state.

## Right-to-left

- Layout: logical utilities (`ms-auto` on the chevron, `text-start`).
- Icons: git-fork, chevron-down and stop are not mirrored.
- Keyboard: none.
- User data: the helper name is `dir="ltr"` code.

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

## Responsive

- Container queries: none.
- Narrow: the elapsed time, status and `Stop` keep their size and wrap to a second line, aligned to the end, when the row cannot give the name 12rem; the title wraps to two lines before it clamps, and the agent name drops to its own line under it when there is no room for both, truncating only past the row's width; the description wraps.
- Touch: 40 px row; the toggle reaches 44 px on coarse pointers (`pointer-coarse:min-h-11`) and `Stop` uses `Button`'s own 44 px coarse-pointer hit area. Hover-only affordances: none.
- Reflow: slot content reflows inside the panel; code in it scrolls inside its block.

## Examples

### Default

```vue
<script setup>
  import SubagentCard from '@aziontech/webkit/subagent-card'
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xs)">
    <SubagentCard
      name="deployer"
      title="Deploying the new cache rules"
      description="Waiting for you to allow the deploy to production."
      status="pending"
      :duration="18"
    />
    <SubagentCard
      name="researcher"
      title="Comparing cache plans"
      description="Reading the pricing page of each plan."
      status="running"
      :duration="42"
    />
    <SubagentCard
      name="reviewer"
      title="Reviewing the function code"
      description="Found two places that read the request body twice."
      status="success"
      :duration="95"
    />
    <SubagentCard
      name="analyst"
      title="Reading the error rate of www.example.com"
      description="The metrics service did not answer in 30 seconds."
      status="error"
      :duration="31"
    />
    <SubagentCard
      name="planner"
      title="Planning the migration of acme-store"
      description="Stopped by Jane Doe."
      status="canceled"
      :duration="7"
    />
  </div>
</template>
```

### WithMessages

```vue
<script setup>
  import CodeBlock from '@aziontech/webkit/code-block'
  import StreamingResponse from '@aziontech/webkit/streaming-response'
  import SubagentCard from '@aziontech/webkit/subagent-card'
  import ToolCall from '@aziontech/webkit/tool-call'
  import { ref } from 'vue'

  const status = ref('running')
  const task = JSON.stringify({ workload: 'acme-store', plans: ['Starter', 'Business'] }, null, 2)
</script>

<template>
  <div class="flex w-full max-w-(--container-3xl) flex-col gap-(--spacing-xs)">
    <SubagentCard
      name="researcher"
      title="Comparing cache plans for acme-store"
      :description="
        status === 'running'
          ? 'Reading the pricing page of each plan.'
          : 'Stopped before it finished.'
      "
      :status="status"
      :duration="42"
      stoppable
      default-open
      @stop="status = 'canceled'"
    >
      <template #input>
        <CodeBlock
          :tabs="[{ label: 'JSON', value: 'task', code: task, language: 'json' }]"
          :show-line-numbers="false"
        />
      </template>
      <ToolCall
        name="fetch_page"
        title="Reading https://example.com/pricing"
        status="success"
      />
      <StreamingResponse
        content="The **Business** plan keeps cached objects for 30 days; **Starter** keeps them for 7."
      />
      <SubagentCard
        name="summarizer"
        title="Writing the comparison table"
        status="running"
        :duration="9"
      />
    </SubagentCard>
    <SubagentCard
      name="analyst"
      title="Reading the error rate of www.example.com"
      description="The metrics service did not answer in 30 seconds."
      status="error"
      :duration="31"
    >
      <template #input>
        <p class="m-0 text-body-sm text-(--text-default)">
          Find the hour with the most 5xx responses on www.example.com yesterday.
        </p>
      </template>
    </SubagentCard>
  </div>
</template>
```

# Reasoning

> Shows the model's thinking before its response (Cloudscape Thinking pattern, AI Elements Reasoning): a disclosure whose label reads `Thinking` (pulsing) while the model reasons and `Thought for 14 seconds` once it is done, with the trace inside. Collapsed by default in a chat, where the response is the main content. The duration comes from the server (`duration`) or is measured from `streaming` turning on to turning off, rounded to whole seconds. An optional `Skip thinking` lets the reader ask for the response now.

- Import: `import Reasoning from '@aziontech/webkit/reasoning'`
- Category: ai · Surface: product · Structure: monolithic
- API as JSON: [reasoning.json](https://github.com/aziontech/webkit/blob/main/.specs/reasoning.json)

## When to use

- The model performs extended reasoning before answering, and the trace helps the reader trust or check the response.

## Do

- Keep it collapsed in chat; open it by default only where reasoning is the point (an editor, a review).
- Never show secrets, token counts or system prompts in the trace.
- Do not replace the label with trace text; the label stays `Thinking` until done.
- Offer `skippable` only when the model can answer meaningfully without finishing.

## Don’t

- Ordinary loading with no reasoning → `ai-loading`.
- Agent actions with side effects (calls, commands) → `tool-call` and `action-confirmation`.
- Progressive steps of a long task → a `stepper` or a list of `tool-call`s.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [ai-loading](ai-loading.md) — loading without a trace.
- [tool-call](tool-call.md) — what the agent did, rather than what it thought.
- [streaming-response](streaming-response.md) — renders a Markdown trace inside the slot.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `streaming` | `boolean` | `false` | false | The model is still reasoning: the label reads `Thinking` and pulses; when it turns false the label shows how long it took. |
| `duration` | `number` | `undefined` | false | Seconds the reasoning took, when the server reports it. Without it the component measures from `streaming` turning on to turning off. |
| `open` | `boolean` | `undefined` | false | Controlled open state. Use with `v-model:open`. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled; collapsed is the default in a chat, where the response is the main content. |
| `skippable` | `boolean` | `false` | false | Offers `Skip thinking` while streaming, for a model that can answer before it finishes reasoning. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `update:open` | `boolean` |  |
| `skip` | `(event: MouseEvent)` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The trace: short narration, steps, inline code. Kept as it was once thinking ends. |

## Sub-components

_None. Exports: `"./reasoning"`. Composed DS components: `button` (Skip thinking)._

## States

- `data-state="open|closed"` (disclosure), `data-streaming`.
- Label: `Thinking` while streaming; `Thought for {n} seconds` with a duration; `Thought for a few seconds` when neither was measured nor given.

## Accessibility

- Visible focus: `focus-visible:ring-2 focus-visible:ring-(--ring-color)` on the trigger.
- Keyboard map: `Tab` to the trigger, `Enter` / `Space` toggles; `Tab` to Skip thinking.
- ARIA: a `button` with `aria-expanded` and `aria-controls` the trace; glyphs `aria-hidden`; a polite visually hidden status announces the completed label (`Thought for 14 seconds`) when thinking ends. The trace is not live.
- Contrast ≥4.5:1 on the muted label and trace.

## Right-to-left

- Layout: `border-s` / `ps-` put the trace rule on the inline start.
- Icons: sparkles and chevron-down are not mirrored.
- Keyboard: none.
- User data: none.

## Internationalization

| Key                        | English source                                | Override prop |
| -------------------------- | --------------------------------------------- | ------------- |
| `reasoning.thinking`       | `Thinking`                                    | —             |
| `reasoning.thought`        | `Thought for {count} second(s)` (plural)       | —             |
| `reasoning.thoughtBriefly` | `Thought for a few seconds`                   | —             |
| `reasoning.skip`           | `Skip thinking`                               | —             |

- Formatting: plural rules through `Intl.PluralRules`; the count through `Intl.NumberFormat`.

## Responsive

- Container queries: none.
- Narrow: the trigger and Skip wrap.
- Touch: the trigger is text-sized; Skip is a small `Button` (44 px on coarse pointers).
- Reflow: no horizontal scroll.

## Examples

### Default

```vue
<script setup>
  import Reasoning from '@aziontech/webkit/reasoning'
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <Reasoning :duration="14">
      <p>The reader asks why the cache hit ratio of storefront dropped this week.</p>
      <p>
        Checking the cache settings of <code>storefront</code>: query strings are part of the cache
        key, and a campaign started on Monday adds <code>utm_source</code> to every link.
      </p>
      <p>Each campaign link is a new cache key, so most requests miss the cache.</p>
    </Reasoning>
  </div>
</template>
```

### Streaming

```vue
<script setup>
  import Reasoning from '@aziontech/webkit/reasoning'
  import { onBeforeUnmount, onMounted, ref } from 'vue'

  const steps = [
    'Reading the error rate of the workload over the last hour.',
    'The 502 responses started at 14:05, when the origin certificate expired.',
    'Checking whether a renewed certificate is already uploaded.'
  ]

  const shown = ref([])
  const streaming = ref(true)
  let timer

  function stop() {
    clearInterval(timer)
    streaming.value = false
  }

  onMounted(() => {
    timer = setInterval(() => {
      if (shown.value.length < steps.length) shown.value = steps.slice(0, shown.value.length + 1)
      else stop()
    }, 1500)
  })
  onBeforeUnmount(() => clearInterval(timer))
</script>

<template>
  <div class="w-full max-w-(--container-3xl)">
    <Reasoning
      :streaming="streaming"
      default-open
      skippable
      @skip="stop"
    >
      <p
        v-for="step in shown"
        :key="step"
      >
        {{ step }}
      </p>
    </Reasoning>
  </div>
</template>
```

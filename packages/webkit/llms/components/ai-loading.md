# Ai Loading

> The loading state of a generative AI response (Cloudscape generative AI loading states and loading bar, AI Elements Loader): visible loading text — `Generating a response`, `Loading list of workloads` — paired with three pulsing dots (`inline`, for text) or an indeterminate bar (`bar`, where a table, list or code block is about to appear). It waits `delay` milliseconds before showing anything, so a response that arrives within a second never flickers a loading state.

- Import: `import AiLoading from '@aziontech/webkit/ai-loading'`
- Category: ai · Surface: product · Structure: monolithic
- API as JSON: [ai-loading.json](https://github.com/aziontech/webkit/blob/main/.specs/ai-loading.json)

## When to use

- Processing: the model has the prompt but has produced nothing yet (`ChatMessage` renders it for `state="pending"`).
- Generation of mixed content: a bar where a table or code block will appear while text streams.

## Do

- Text says `[Generating|Loading] <what>` without end punctuation: `Generating a response`, `Loading list of workloads`.
- Keep the default 1 s delay; set `delay` to 0 only when the owner already delayed.
- Use the bar only for non-text content; stream text instead of loading it.

## Don’t

- Model reasoning with a trace → `reasoning`.
- Loading a page or table of product data → `skeleton`, `spinner`, `progress`.
- Determinate progress → `progress`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [chat-message](chat-message.md) — renders this while `pending`.
- [progress](progress.md) — the indeterminate bar it draws.
- [reasoning](reasoning.md) — thinking with a trace.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `label` | `string` | `''` | false | Visible loading text, `Generating <what>` or `Loading <what>`, with no end punctuation. Empty uses the locale catalog (`Generating a response`). |
| `kind` | `'inline' \| 'bar'` | `'inline'` | false | inline` pulses three dots beside the text (text responses); `bar` draws an indeterminate bar under it, where a table, list or code block is about to appear. |
| `delay` | `number` | `1000` | false | Milliseconds to wait before showing anything, so a fast response never flickers a loading state. |

## Sub-components

_None. Exports: `"./ai-loading"`; type `AiLoadingKind`. Composed DS components: `progress`._

## States

- `data-kind`; `data-visible` once the delay has passed. Before that the `role="status"` region exists but is empty, so the text is announced when it appears.

## Accessibility

- Visible focus: nothing focusable.
- Keyboard map: none.
- ARIA: `role="status"` (polite) holds the visible text; dots and bar are `aria-hidden`. Loading is always conveyed in text, not only in motion.
- Reduced motion: dots stop pulsing; the bar stops sweeping.

## Right-to-left

- Layout: logical utilities; the bar sweeps from the inline start (handled by `Progress`).
- Icons: none.
- Keyboard: none.
- User data: none.

## Internationalization

| Key                    | English source          | Override prop |
| ---------------------- | ----------------------- | ------------- |
| `aiLoading.generating` | `Generating a response` | `label`       |

- Formatting: none.

## Responsive

- Container queries: none.
- Narrow: the bar fills the width up to `--container-xs`.
- Touch: nothing interactive.
- Reflow: wraps.

## Examples

### Inline

```vue
<script setup>
  import AiLoading from '@aziontech/webkit/ai-loading'
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <AiLoading />
  </div>
</template>
```

### Bar

```vue
<script setup>
  import AiLoading from '@aziontech/webkit/ai-loading'
</script>

<template>
  <div class="w-full max-w-(--container-md)">
    <AiLoading
      kind="bar"
      label="Generating a table of cache hits by country"
    />
  </div>
</template>
```

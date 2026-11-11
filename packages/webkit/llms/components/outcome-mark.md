# Outcome Mark

> A small round mark that states how something ended: a check for success, a cross for danger, an exclamation for warning and a dash for neutral (not set, not run). It replaces the design sample's `StateMark` and `SuccessMark`. With `animated` the disc scales in and the glyph draws itself when the mark appears and every time its severity changes, so an outcome screen or a finished row can mark the moment a run lands; under reduced motion it shows at once.

- Import: `import OutcomeMark from '@aziontech/webkit/outcome-mark'`
- Category: feedback · Surface: product · Structure: monolithic
- API as JSON: [outcome-mark.json](https://github.com/aziontech/webkit/blob/main/.specs/outcome-mark.json)

## When to use

- At the head of an outcome screen (deploy succeeded or failed), at the large size, animated.
- In a checklist or a list of steps, at the small size, to say a step is done or not set.
- Beside a label that reports a finished run, when the run's state turns from running to an outcome.

## Do

- Pair the mark with words that say the same thing; the mark is not the only cue.
- Animate only the mark that just changed; a list of animated marks on load is noise.
- Give a specific `ariaLabel` (`Deployed`, `Done`) when the catalog name is too generic.

## Don’t

- A state that is still running → use `spinner` or `status-indicator` with `loading`.
- A labelled status pill in a table cell → use `tag` or `status-indicator`.
- A message with text and actions → use `alert` or `toast`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [status-indicator](status-indicator.md) — a coloured dot with a label, for live states.
- [tag](tag.md) — a labelled pill for a state.
- [toast](toast.md) — reports the outcome of an async action wherever the user is.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `severity` | `'success' \| 'danger' \| 'warning' \| 'neutral'` | `'success'` | false | The outcome the mark shows: a check, a cross, an exclamation or a dash. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Size token: 16, 20 or 48 px. |
| `animated` | `boolean` | `false` | false | Scales the disc in and draws the glyph when it appears or its severity changes; static under reduced motion. |
| `ariaLabel` | `string` | `''` | false | Accessible name. Empty uses the locale catalog name of the severity. |

## States

- `data-severity`: `success` | `danger` | `warning` | `neutral`; `data-size`: `small` | `medium` | `large`
- `data-state`: `pending` (disc scaled down and transparent, glyph undrawn) | `settled`; a static mark is always `settled`
- `data-animated` mirrors the `animated` prop

## Accessibility

- Not focusable; no keyboard map.
- ARIA: the root `svg` is `role="img"` named by `ariaLabel` or the catalog name of the severity.
- The shape of the glyph tells the outcomes apart without colour (WCAG 1.4.1); glyph against disc meets 3:1 (WCAG 1.4.11) in both themes.
- Motion is decorative and skipped under `prefers-reduced-motion`.

## Right-to-left

- Layout: no layout of its own.
- Icons: the check, cross, exclamation and dash are not mirrored.
- Keyboard: none.
- User data: none.

## Internationalization

| Key                    | English source  | Override prop |
| ---------------------- | --------------- | ------------- |
| `outcomeMark.success` | Succeeded       | `ariaLabel`   |
| `outcomeMark.danger`  | Failed          | `ariaLabel`   |
| `outcomeMark.warning` | Needs attention | `ariaLabel`   |
| `outcomeMark.neutral` | Not set         | `ariaLabel`   |

- Formatting: none.

## Responsive

- Container queries: none: fixed size per `size`.
- Narrow: unchanged.
- Touch: not interactive.
- Reflow: no horizontal scroll at 320 px.

## Examples

### Default

```vue
<script setup>
  import OutcomeMark from '@aziontech/webkit/outcome-mark'
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-lg)">
    <OutcomeMark severity="success" />
    <OutcomeMark severity="danger" />
    <OutcomeMark severity="warning" />
    <OutcomeMark severity="neutral" />
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import OutcomeMark from '@aziontech/webkit/outcome-mark'
</script>

<template>
  <ul class="flex flex-col gap-(--spacing-md)">
    <li class="flex items-center gap-(--spacing-xs) text-body-sm text-(--text-default)">
      <OutcomeMark
        size="small"
        aria-label="Done"
      />
      Add a custom domain
    </li>
    <li class="flex items-center gap-(--spacing-xs) text-label-md text-(--text-default)">
      <OutcomeMark aria-label="Deployed" />
      web-app is live in Production
    </li>
    <li class="flex flex-col items-start gap-(--spacing-sm)">
      <OutcomeMark
        size="large"
        aria-label="Deployed"
      />
      <span class="text-heading-sm text-(--text-default)">Service deployed</span>
    </li>
  </ul>
</template>
```

### Animated

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import OutcomeMark from '@aziontech/webkit/outcome-mark'
  import { computed, ref } from 'vue'

  const severity = ref('neutral')

  const message = computed(
    () =>
      ({
        neutral: 'web-app has not been deployed yet.',
        success: 'web-app is live in Production.',
        danger: "web-app wasn't deployed. The routing rules were refused."
      })[severity.value]
  )
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-md)">
    <div class="flex items-center gap-(--spacing-sm)">
      <OutcomeMark
        :severity="severity"
        size="large"
        animated
      />
      <p
        class="text-body-sm text-(--text-default)"
        role="status"
      >
        {{ message }}
      </p>
    </div>
    <div class="flex flex-wrap gap-(--spacing-xs)">
      <Button
        label="Finish with success"
        kind="outlined"
        size="small"
        @click="severity = 'success'"
      />
      <Button
        label="Finish with a failure"
        kind="outlined"
        size="small"
        @click="severity = 'danger'"
      />
    </div>
  </div>
</template>
```

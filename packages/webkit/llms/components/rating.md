# Rating

> Rating is a row of stars that picks a whole score from 1 to `max` (5 by default), the way a customer rates a support conversation (CSAT) or a product review. It renders as a native radio group, one radio per star named "1 star" … "5 stars", so it is one tab stop, the arrow keys move the score and the value posts with a form. With `readonly` it becomes a display of a score, including a fractional average rounded to the nearest half star (4.5 shows four and a half stars), announced as one image ("Rated 4.5 out of 5").

- Import: `import Rating from '@aziontech/webkit/rating'`
- Category: input · Surface: app · Structure: monolithic
- Stability: preview. The API may still change in a minor release, named in the changelog, until the owner marks it GA.
- API as JSON: [rating.json](rating.json)

## When to use

- Ask a customer to rate a support conversation, an answer or a resolved ticket on a 1-to-5 scale (customer satisfaction, CSAT): the star they pick is the answer, sent on `select`.
- Collect a star score in a review or feedback form, inside a `Field` with a label, a description and a required error.
- Show a stored score or an average of scores as stars in a ticket, a table cell or a review list (`readonly`).

## Do

- Name the group: put it in a `Field` with a `Field.Title`, or set `aria-label` on the root ("Rate this conversation").
- Keep `max` at 5 for satisfaction and reviews; scales above 5 are hard to tell apart at a glance.
- When the score is the whole answer (a CSAT question), send it on `select` and add no Send button: the pick is the submit, as in Intercom and Help Scout. Then replace the stars with a short thank-you ("Thanks, your rating was sent.") in a `role="status"` element and move focus to it. A comment, when you ask for one, comes after the score is already saved.
- Start empty (`0`) when you ask for a rating, so nobody submits a score they did not choose; set `required` when the score is mandatory.
- Set `clearable` when a score is optional, so a person can take it back with the keyboard and a screen reader, not only by reloading.
- Show averages with `readonly`; print the count of ratings beside it in text ("4.5 · 128 reviews"), the stars do not carry it.
- Do not put a rating in a dense table row as an input; show it `readonly` and edit it in a dialog or a detail page.

## Don’t

- A good / bad (thumbs up / thumbs down) answer → use `ToggleGroup` with two options, or `ChatMessageFeedback` under an AI answer.
- A score on a scale wider than 10 or a continuous value → use `Slider` or `NumberInput`.
- A choice between named options (plans, channels) → use `RadioGroup`.
- A score shown as a number or a bar (NPS breakdown, a meter) → use `StatTile` or `Progress`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [radio-group](radio-group.md) — the same native radio pattern, for picking one labelled option instead of a score.
- [toggle-group](toggle-group.md) — two or three compact options such as good / bad.
- `chat-message-feedback` — thumbs up / thumbs down under an AI chat answer.
- [field](field.md) — wraps the rating with its label, description and error; the label names the group.
- [slider](slider.md) — a number on a wide or continuous scale.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `max` | `number` | `5` | false | Number of stars, the highest score. Rounded to a whole number and kept between 1 and 10. |
| `size` | `'small' \| 'medium' \| 'large'` | `'medium'` | false | Star size: 16, 20 or 24 px glyphs in 24, 28 or 32 px targets. `RatingSize`, exported. |
| `name` | `string` | `''` | false | Form field name shared by every star radio; the score submits under it. Empty uses a generated name so the radios still group. |
| `readonly` | `boolean` | `false` | false | Shows the score instead of asking for it: no radios, the value rounded to the nearest half star, announced as one image. |
| `disabled` | `boolean` | `false` | false | Disables every star and the clear button; the row shows at 50 % opacity with a not-allowed cursor. |
| `required` | `boolean` | `false` | false | Requires a score: sets `aria-required` on the group and `required` on the radios, so a native form blocks an empty submit. |
| `invalid` | `boolean` | `false` | false | Marks the rating invalid: sets `aria-invalid` on the group and draws the empty stars in the danger mark colour. |
| `clearable` | `boolean` | `false` | false | Shows a clear button after the stars that resets the score to 0 and moves focus to the first star. Not shown while `readonly`. |
| `modelValue` | `number` | `0` | false | Two-way value (`v-model`). |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `select` | `(event: MouseEvent \| KeyboardEvent, value: number)` |  |

## v-model

| Model     | Type     | Default | Emits               | Notes                                                                                                                                                                                                                                                                           |
| --------- | -------- | ------- | ------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model` | `number` | `0`     | `update:modelValue` | The score via `defineModel`; `0` means no score. Picking a star emits its whole number (1 … `max`); the clear button emits `0`. Unbound, the rating keeps its own score. As an input a fractional value shows rounded to a whole star; `readonly` shows it to the nearest half. |

## States

- Visual states: `default`, `hover` (preview), `focus-visible`, `checked`, `disabled`, `invalid`, `readonly`
- Root: `role="radiogroup"` as an input, `role="img"` while `readonly`; `data-size` mirrors `size`; `data-readonly`, `data-disabled`, `data-required` and `data-invalid` mirror the state (the `Field` state included); `data-preview` while a fine pointer hovers a star.
- Each star: `data-fill="full" | "half" | "empty"` on its glyph; `half` only while `readonly`. A filled or half star draws in `var(--warning-mark)`, an empty star in `var(--text-muted)`, or `var(--danger-mark)` while invalid. Each star label carries `data-checked` on the star whose value is the score.
- Hover preview: on a fine pointer (`pointerType === 'mouse'`), hovering star `n` fills stars 1 … `n` until the pointer leaves the row; it never changes the model, and it does not run while `disabled` or `readonly`. Touch and pen get no preview: the tap selects.
- Picking the selected star again keeps the score (native radio) and fires `select` again; the score is cleared only by the clear button.
- `select` versus `update:modelValue`: the arrow keys change the score (and `v-model`) one star at a time on the way to the one a person wants, so a score that is sent as soon as it is chosen listens to `select`, which fires only on a click, a tap, `Enter` or `Space`.
- While `readonly`, `required`, `invalid`, `name` and `clearable` have no effect: the display renders no inputs and no clear button, and sets no `aria-required` / `aria-invalid`; `disabled` only dims it.
- Not states of this component: `loading`, `empty` and `error` (the `Field.Error` carries the message).

## Accessibility

- Visible focus: `ring-2 ring-(--ring-color) ring-offset-1 ring-offset-(--bg-canvas)` on the focused star's target (the native radio inside is invisible).
- Keyboard map (APG radio group, native radios sharing one `name`): `Tab` enters on the checked star, or, when none is checked, on the first star (`Shift+Tab` enters on the last), and the next `Tab` moves to the clear button when shown, then out; `ArrowRight` / `ArrowDown` select the next star and `ArrowLeft` / `ArrowUp` the previous one, wrapping at the ends, all handled by the browser (it swaps `ArrowLeft` / `ArrowRight` under `dir="rtl"`); the component adds no key handling of its own; `Space` selects the focused star and fires `select`; `Enter` fires `select` with the focused star (the arrow keys never do); `Enter` / `Space` on the clear button reset the score to 0 and move focus to the first star.
- Clear affordance: a separate `IconButton` ("Clear rating"), chosen over "click the selected star again" because a native radio cannot be unchecked from the keyboard, a toggle on re-click is not announced to screen readers and surprises people who double-click; the button is named, focusable and disabled while the score is 0.
- ARIA: root `role="radiogroup"` with `aria-labelledby` (the `Field` label ids) or the consumer's `aria-label`, `aria-describedby` (the `Field.Description` / `Field.Error` ids), `aria-required` and `aria-invalid`; each star is a native `type="radio"` input with `aria-label` "1 star" … "5 stars"; the glyphs are `aria-hidden`. While `readonly` the root is `role="img"`, renders no inputs, and is named by `aria-labelledby`: the `Field` label ids (when inside a `Field`) followed by a visually hidden summary, "Rated 4.5 out of 5" ("Not rated" at 0), whose `{value}` is the half-rounded value the stars show (4.37 reads "4.5"); a consumer `aria-label` is not used in this mode, put context in the text beside it.
- Contrast: star glyphs in documented icon pairs (`--warning-mark`, `--text-muted`, `--danger-mark` on the surfaces); filled and empty differ in shape as well as colour. The disabled row (50 % opacity) is an inactive control, exempt from WCAG 1.4.3 / 1.4.11, as in `radio-group` and `checkbox`.
- `motion-reduce:transition-none` on the star glyph transition.
- Touch target: each star target is 24, 28 or 32 px on a fine pointer and grows to 44 × 44 px on `pointer: coarse` (decision TT01, the row widens); the clear button follows `IconButton`'s coarse-pointer target.

## Right-to-left

- Layout: a flex row that follows `dir`, so star 1 sits at the inline start and stars fill from the inline start; the clear button sits at the inline end (`gap-*`, no physical sides).
- Icons: `az-star` and `az-star-fill` are symmetric; `az-star-half-fill` (left half filled) is mirrored with `rtl:-scale-x-100`, so the filled half faces the inline start.
- Keyboard: native radios — `ArrowRight` / `ArrowDown` move to the next star and `ArrowLeft` / `ArrowUp` to the previous one; under `dir="rtl"` the browser swaps `ArrowLeft` / `ArrowRight`, so the key that points toward the inline end still raises the score.
- User data: none.

## Internationalization

| Key            | English source                                 | Override prop |
| -------------- | ---------------------------------------------- | ------------- |
| `rating.star`  | `{count} star` (one) / `{count} stars` (other) | —             |
| `rating.value` | `Rated {value} out of {max}`                   | —             |
| `rating.empty` | `Not rated`                                    | —             |
| `rating.clear` | `Clear rating`                                 | —             |

- Formatting: plurals through `Intl.PluralRules` (the `t()` plural form) with the locale from `ConfigProvider`; `{value}` and `{max}` through `Intl.NumberFormat` (at most one fraction digit, so 4.5 reads "4,5" in pt-BR). Overrides go through `ConfigProvider` messages.

## Responsive

- Container queries: none: fixed size.
- Narrow (≤ 640 px or a narrow container): the row does not wrap; 10 large stars on a coarse pointer are 440 px plus the clear button, so keep `max` at 5 on phones.
- Touch: targets ≥ 24 px, 44 px on `pointer: coarse`; the hover preview is fine-pointer only and touch selects on tap with no preview.
- Reflow: no horizontal scroll at 320 px and 200 % zoom with `max` 5 (5 × 44 px + the clear button).

## Examples

### Default

```vue
<script setup>
  import Rating from '@aziontech/webkit/rating'
  import { ref } from 'vue'

  const score = ref(0)
</script>

<template>
  <div class="flex items-center gap-(--spacing-sm)">
    <Rating
      v-model="score"
      name="satisfaction"
      aria-label="Rate this conversation"
      clearable
    />
    <span
      class="text-body-sm text-(--text-muted)"
      aria-live="polite"
      >{{ score ? `${score} of 5` : 'No score yet' }}</span
    >
  </div>
</template>
```

### Sizes

```vue
<script setup>
  import Rating from '@aziontech/webkit/rating'
</script>

<template>
  <div class="flex flex-col items-start gap-(--spacing-md)">
    <Rating
      :model-value="4"
      size="small"
      aria-label="Small rating"
    />
    <Rating
      :model-value="4"
      size="medium"
      aria-label="Medium rating"
    />
    <Rating
      :model-value="4"
      size="large"
      aria-label="Large rating"
    />
  </div>
</template>
```

### Readonly

```vue
<script setup>
  import Rating from '@aziontech/webkit/rating'

  const products = [
    { name: 'Acme Storage', average: 4.5, reviews: 128 },
    { name: 'Acme Functions', average: 3, reviews: 42 },
    { name: 'Acme Queues', average: 0, reviews: 0 }
  ]
</script>

<template>
  <ul class="flex flex-col gap-(--spacing-sm)">
    <li
      v-for="product in products"
      :key="product.name"
      class="flex flex-wrap items-center gap-(--spacing-xs)"
    >
      <span class="min-w-40 text-body-sm text-(--text-default)">{{ product.name }}</span>
      <Rating
        :model-value="product.average"
        readonly
        size="small"
      />
      <span class="text-body-sm text-(--text-muted)">{{
        product.reviews ? `${product.average} · ${product.reviews} reviews` : 'No reviews yet'
      }}</span>
    </li>
  </ul>
</template>
```

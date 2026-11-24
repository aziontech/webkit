# Hint

> Click-open note (a "toggletip") on a small muted `az az-circle-info` glyph. A click, a tap, `Enter` or `Space` on the glyph opens a small panel, anchored below the glyph and aligned to its start, that holds one to three sentences and an optional "Learn more" link to the docs. It is level C of the in-product help standard: the way to attach a "why does this matter?" note to a field name, a setting or a column header without spending a line of vertical space on it. `Field.Label`, `SettingsRow` and `SettingsGroup` render it from their own `hint` prop.

- Import: `import Hint from '@aziontech/webkit/hint'`
- Category: input · Surface: app · Structure: monolithic
- API as JSON: [hint.json](hint.json)

## When to use

- A field, switch or setting whose name is clear but whose consequence is not (what "Sensitive" does to a stored value).
- A note of one to three sentences that is useful but not needed to complete the task, optionally with a link to the docs page that explains more.
- Beside a label, a heading, a stat or a column header, where a permanent line of helper text would add noise.

## Do

- One to three plain sentences, each ending in a period.
- Place the glyph 4px after the label text, on the same line. Never at the end of the row, never on its own line.
- One Hint per label. Never stack two glyphs, and never put a Hint inside a Tooltip or another Hint.
- Never draw a typed "?" or a boxed icon button as a help trigger; Hint is the only help glyph.
- Add `href` when a docs page explains more; leave `linkLabel` empty for the localized "Learn more".
- Never hide required information behind a Hint.

## Don’t

- Information needed to fill the field → `field-description`, which stays on screen.
- Naming a control or expanding an abbreviation → `tooltip`.
- Help longer than three sentences, steps or several links → `help-panel`.
- Validation messages → `field-error`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `field-description` — level A, the default: a short muted line under the field that is always visible.
- [tooltip](tooltip.md) — level B: names a control or expands an abbreviation in a few words (about 80 characters at most).
- [help-panel](help-panel.md) — level D: page-level help in the console's tools region, opened from an "Info" link after the page title.
- [popover](popover.md) — the overlay Hint composes; use it for interactive content.
- `Field.Label`, `settings-row`, `settings-group` — render a Hint from their `hint` prop.
- `/webkit-in-product-help` — the consumer skill that picks the level of help.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `content` | `string` | `''` | true | The note, one to three sentences, shown when the glyph is clicked and read as the glyph's description. |
| `side` | `'top' \| 'bottom' \| 'start' \| 'end' \| 'auto'` | `'bottom'` | false | Side of the glyph the note opens on, flipped when it does not fit; `'auto'` picks the side with the most room. |
| `href` | `string` | `''` | false | Docs URL linked under the note; empty renders no link. |
| `linkLabel` | `string` | `''` | false | Text of the docs link; empty uses the locale catalog (`Learn more`). |
| `target` | `'_blank' \| '_self'` | `'_blank'` | false | Where the docs link opens. |
| `ariaLabel` | `string` | `''` | false | Accessible name of the glyph button; empty uses the locale catalog (`More information`). |
| `open` | `boolean` | `false` | false | Two-way value (`v-model:open`). |

## v-model

| Model          | Type      | Default | Emits         | Notes                                                                                                                                                            |
| -------------- | --------- | ------- | ------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `v-model:open` | `boolean` | `false` | `update:open` | Open state via `defineModel('open')`. Fires on every open and close: glyph click, `Enter`, `Space`, `Esc`, outside click. Unbound, the Hint keeps its own state. |

## States

- Visual states of the glyph: `default`, `hover`, `focus-visible`, open (`aria-expanded="true"`, the glyph takes `var(--text-default)`).
- `data-state` values (on the root, owned by `Popover`): `open` | `closed`.
- `data-side` (on the root and the panel, owned by `Popover`): the side the panel landed on.

## Accessibility

- The trigger is a native `<button type="button">` named by `ariaLabel` (fallback `More information`, from the locale catalog). It carries `aria-haspopup="dialog"`, `aria-expanded` and `aria-controls` (from `Popover.Trigger`).
- The note is also in an always-rendered `hidden` element the button points at with `aria-describedby`, so a screen reader reads the note on focus without opening the panel.
- The panel is `role="dialog"` (non-modal), named by the trigger. It opens on activation only, never on hover.
- Keyboard map: `Tab` focuses the glyph; `Enter` or `Space` opens and closes the note; opening moves focus to the docs link when there is one; `Esc` closes and returns focus to the glyph. A second click or an outside click also closes it.
- The click default is prevented, so a Hint inside a `<label>` never toggles or focuses the labelled control.
- The glyph is decorative (`aria-hidden="true"`); the focus ring uses `var(--ring-color)`.
- Touch target: a `[data-slot=touch-target]` span extends the 20 px glyph's hit area to 24 px, and to 44 px on a coarse pointer.

## Internationalization

- The glyph's fallback name is `hint.label` (`More information`, `Mais informações`, `Más información`); the link's fallback text is `Link`'s `link.label` (`Learn more`).
- `content` and `linkLabel` come translated from the consumer.

## Examples

### Default

```vue
<script setup>
  import Hint from '@aziontech/webkit/hint'
</script>

<template>
  <Hint content="Values are encrypted at rest and never displayed again after saving." />
</template>
```

### Placements

```vue
<script setup>
  import Hint from '@aziontech/webkit/hint'
</script>

<template>
  <div class="flex items-center justify-center gap-(--spacing-lg) py-(--spacing-2xl)">
    <Hint
      content="Opens above the glyph."
      side="top"
    />
    <Hint
      content="Opens on the end side of the glyph."
      side="end"
    />
    <Hint
      content="Opens below the glyph."
      side="bottom"
    />
    <Hint
      content="Opens on the start side of the glyph."
      side="start"
    />
  </div>
</template>
```

### WithLink

```vue
<script setup>
  import Field from '@aziontech/webkit/field'
  import Hint from '@aziontech/webkit/hint'
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  const ttl = ref('3600')
</script>

<template>
  <Field class="max-w-(--container-xs)">
    <Field.Label>
      Cache TTL
      <Hint
        content="How many seconds the edge serves the cached copy before it asks the origin again."
        href="https://example.com/docs/cache-settings"
      />
    </Field.Label>
    <Input
      v-model="ttl"
      inputmode="numeric"
    />
    <Field.Description>In seconds.</Field.Description>
  </Field>
</template>
```

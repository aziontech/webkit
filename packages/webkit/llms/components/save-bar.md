# Save Bar

> The bar at the bottom of a settings or create page that holds the status of unsaved work and its Discard (or Cancel) and Save actions. `floating` overlays the bottom of the scroll region without moving the content and is shown while the form is dirty; `docked` takes its own row at the bottom; `plain` closes a form column saved as one unit, always shown; `fade` closes a wizard step with no border or surface, the step content fading into the canvas above Back and Next; `centered` floats the actions as a raised card centred over the bottom of a create page, always shown.

- Import: `import SaveBar from '@aziontech/webkit/save-bar'`
- Category: layout · Surface: product · Structure: monolithic
- API as JSON: [save-bar.json](https://github.com/aziontech/webkit/blob/main/.specs/save-bar.json)

## When to use

- A settings page whose changes are staged and saved together: show the floating bar while the form is dirty or saving.
- A create page or account form with one Save for the whole page (`plain`).
- A full-page wizard step: Back in `leading`, the step's primary action in `actions` (`fade`).
- A create page (Create Team, Create Zone, Create Function): Cancel and Create in a raised card centred at the bottom of the form, over the content, at every width (`centered`). This is the design sample's create-page footer; use it instead of a full-width `floating` bar there.

## Do

- Render the floating bar with `v-if="dirty || saving"` inside a `Transition`, so it slides in when the first change is made.
- Say what changed and when it takes effect in the status sentence; keep it to one line.
- Disable Discard and set `loading` on Save while saving.
- Do not build a centred action pill by hand (a sticky footer with a bordered card and a shadow): that is `kind="centered"`.
- floating` and `docked` are for the dirty state of a settings page; `centered` and `plain` are for a create page or a form saved as one unit and stay on screen.

## Don’t

- A card that saves on its own → put the actions in the card footer.
- A drawer or dialog form → use the `PanelFooter` of `drawer` or `dialog`.
- A one-off confirmation → use `confirm-dialog`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [button](button.md) — the actions: an outlined Discard or Cancel, then a primary Save with `loading` while it runs.
- [settings-section](settings-section.md) — the bands the bar saves.
- [confirm-dialog](confirm-dialog.md) — the guard shown when someone leaves with unsaved changes.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `kind` | `'floating' \| 'docked' \| 'plain' \| 'fade' \| 'centered'` | `'floating'` | false | How the bar sits at the bottom of its scroll region. |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The status sentence on the left, such as You have unsaved changes. |
| `leading` | — | Replaces the whole leading region (the info icon and the sentence) with your own content, such as a `StatusIndicator` (Saving…, Saved) or an unsaved-changes count. Takes precedence over `default`. |
| `actions` | — | Discard or Cancel, then Save, on the right. |

## States

- Visual states: `default`
- `data-kind` mirrors the `kind` prop on the root
- Responsive: the root is the `@container/save-bar`. `floating` and `docked` put the message and the actions on one row from `@xl` of the bar; below it the actions stack full width under the message, Save on top. `plain` stacks the same way below `@md`. `fade` keeps `leading` (Back) and the actions on one row at every width, the actions at the inline end. `centered` keeps the card centred and one row at every width: the optional `leading` or `default` content first, then the actions; the card never grows wider than the bar and lets clicks through around it. The bar keeps `env(safe-area-inset-bottom)` clear on phones.

## Accessibility

- Visible focus: owned by the action buttons.
- Keyboard map: `Tab` reaches Discard, then Save, in reading order (the column is reversed visually on a phone so Save sits on top).
- ARIA: the root is a `footer`; the status glyph is `aria-hidden`.
- Contrast ≥4.5:1 for the status sentence.

## Examples

### Floating

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
  import { ref } from 'vue'

  const saving = ref(false)

  const save = () => {
    saving.value = true
    setTimeout(() => {
      saving.value = false
    }, 1200)
  }
</script>

<template>
  <div class="relative flex h-64 flex-col overflow-auto">
    <div class="layout-boundary-inline flex-1 py-(--spacing-lg) text-body-sm text-(--text-muted)">
      The settings form scrolls under the bar.
    </div>
    <SaveBar>
      You have unsaved changes.
      <template #actions>
        <Button
          type="button"
          label="Discard"
          kind="outlined"
          size="medium"
          :disabled="saving"
        />
        <Button
          label="Save"
          kind="primary"
          size="medium"
          :loading="saving"
          @click="save"
        />
      </template>
    </SaveBar>
  </div>
</template>
```

### Docked

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
</script>

<template>
  <SaveBar kind="docked">
    Project settings changed.
    <span class="text-(--text-muted)">Saving publishes them on the next deployment.</span>
    <template #actions>
      <Button
        type="button"
        label="Discard"
        kind="outlined"
        size="medium"
      />
      <Button
        label="Save"
        kind="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
```

### Plain

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import SaveBar from '@aziontech/webkit/save-bar'
</script>

<template>
  <SaveBar kind="plain">
    <template #actions>
      <Button
        type="button"
        label="Cancel"
        kind="outlined"
        size="medium"
      />
      <Button
        label="Save"
        kind="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
```

# Save Bar

> The bar at the bottom of a settings or create page that holds the status of unsaved work and its Discard (or Cancel) and Save actions. `floating` overlays the bottom of the scroll region without moving the content and is shown while the form is dirty; `docked` takes its own row at the bottom; `plain` closes a form column saved as one unit, always shown; `fade` closes a wizard step with no border or surface, the step content fading into the canvas above Back and Next; `centered` floats the actions as a raised card centred over the bottom of a create page, always shown.

- Import: `import SaveBar from '@aziontech/ui/save-bar'`
- Category: layout · Surface: app · Structure: monolithic
- API as JSON: [save-bar.json](save-bar.json)

## When to use

- A settings page whose changes are staged and saved together: show the floating bar while the form is dirty or saving.
- A create page or account form with one Save for the whole page (`plain`).
- A full-page wizard step: Back in `leading`, the step's primary action in `actions` (`fade`).
- A create page (Create Team, Create Zone, Create Function): Cancel and Create in a raised card centred at the bottom of the form, over the content, at every width (`centered`). This is the design sample's create-page footer; use it instead of a full-width `floating` bar there.

## Do

- Render the floating bar with `v-if="dirty || saving"` inside a `Transition`, so it slides in when the first change is made.
- Say what changed and when it takes effect in the status sentence; keep it to one line.
- Disable Discard and set `loading` on Save while saving.
- Do not build a centred action pill by hand (a sticky footer with a bordered card and a shadow): that is `variant="centered"`.
- `floating` and `docked` are for the dirty state of a settings page; `centered` and `plain` are for a create page or a form saved as one unit and stay on screen.
- Listen to `save` to give the page `⌘ S` (`Ctrl S` off Apple): run the same save as the Save button, and do nothing when the form has no unsaved changes. Show the shortcut on Save with `Kbd` and `aria-keyshortcuts="Meta+S Control+S"` (the console keyboard standard, `rules/azion-ui-keyboard.md`).

## Don’t

- A card that saves on its own → put the actions in the card footer.
- A drawer or dialog form → use the `PanelFooter` of `drawer` or `dialog`.
- A one-off confirmation → use `confirm-dialog`.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- [button](button.md) — the actions: an outlined Discard or Cancel, then a primary Save with `loading` while it runs.
- [settings-group](settings-group.md) — the bands the bar saves.
- [confirm-dialog](confirm-dialog.md) — the guard shown when someone leaves with unsaved changes.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `variant` | `'floating' \| 'docked' \| 'plain' \| 'fade' \| 'centered'` | `'floating'` | false | How the bar sits at the bottom of its scroll region. See the variant table below. |
| `column` | `'full' \| 'form' \| 'focused'` | `'full'` | false | Lines the content of a `floating` or `docked` bar up with the page column above it (`layout-column-form` / `layout-column-focused`); the bar's border and fill still span the region. Ignored by `plain`, `fade` and `centered`. |

## Events

| Event | Payload | Notes |
| --- | --- | --- |
| `save` | `(event: KeyboardEvent)` |  |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `default` | — | The status sentence on the left, such as You have unsaved changes. |
| `leading` | — | Replaces the whole leading region (the info icon and the sentence) with your own content, such as a `StatusIndicator` (Saving…, Saved) or an unsaved-changes count. Takes precedence over `default`. |
| `actions` | — | Discard or Cancel, then Save, on the right. |

## States

- Visual states: `default`
- `data-variant` mirrors the `variant` prop on the root
- `data-column` mirrors the `column` prop on the content row of a `floating` or `docked` bar
- Floating inset: while a `floating` bar is mounted it publishes its measured height on the document root as `--save-bar-inset` (for a scroll region of its own, such as a code editor, to pad its bottom) and `--save-bar-height` (so the `toaster` stacks above the bar, on top of any `--toast-offset-bottom` the app sets for its own bottom chrome, which the bar never overwrites), and updates both when the bar resizes. When the bar would cover the end of the content, the root grows to the bar's height so the last field can scroll clear of it, whether the content scrolls in a scroll region of its own or the page itself scrolls; when there is nothing left to cover, the root stays at zero height. Both properties are removed when the bar unmounts or changes to another `variant`. Every other variant sits at the bottom too, so it publishes `--save-bar-height` the same way (a toast never covers its Save or Discard) but no `--save-bar-inset` and no reserved height.
- Responsive: the root is the `@container/save-bar`. `floating` and `docked` put the message and the actions on one row from `@xl` of the bar; below it the actions stack full width under the message, Discard above Save, so the screen order is the focus order. `plain` stacks the same way below `@md`. `fade` keeps `leading` (Back) and the actions on one row at every width, the actions at the inline end. `centered` keeps the card centred and one row at every width: the optional `leading` or `default` content first, then the actions; the card never grows wider than the bar and lets clicks through around it. The bar keeps `env(safe-area-inset-bottom)` clear on phones.

## Accessibility

- Visible focus: owned by the action buttons.
- Keyboard map: `Tab` reaches Discard, then Save, in reading order; on a phone the actions stack in the same order, Save last at the bottom nearest the thumb, so the screen order matches the focus order. With a `save` listener, `⌘ S` (`Ctrl S` off Apple) emits `save` from anywhere on the page, also while typing in a field (a shortcut with a modifier), and the browser's Save page dialog never opens; inside an open modal layer it fires only for a bar inside that layer (registered through `useShortcuts` with the bar as its element). Tests: `save-bar.test.ts` › save shortcut.
- ARIA: the root is a `footer`; the status glyph is `aria-hidden`. The message region (`__message`, the `leading` / default slot) is a polite live region (`role="status"`), so a bar that appears when the form turns dirty announces its status sentence (WCAG 4.1.3 Status Messages) without moving focus.
- Contrast ≥4.5:1 for the status sentence.

## Right-to-left

- Layout: logical utilities only (`ms-auto`, `me-auto`, `ps-`); the message sits at the inline start and the actions at the inline end.
- Icons: the info glyph is not mirrored.
- Keyboard: none of its own; `Tab` order follows the actions in the slot.
- User data: none.

## Internationalization

The status sentence and the action labels come from the consumer's slots. One built-in string labels the shortcut in the `ShortcutsDialog` list:

| Key                    | English source | Override prop |
| ---------------------- | -------------- | ------------- |
| `saveBar.saveShortcut` | `Save changes` | —             |

- Formatting: none.

## Responsive

- Container queries: the root is `@container/save-bar`; `floating` and `docked` go to one row from `@xl`, `plain` stacks below `@md`.
- Narrow (≤ 640 px or a narrow container): the actions stack full width under the message, Save last at the bottom (screen order is focus order); the bar keeps `env(safe-area-inset-bottom)` clear.
- Touch: the actions are `Button` at `medium`, full width when stacked; no hover-only affordance.
- Reflow: no horizontal scroll at 320 px and 200 % zoom; the floating bar reserves scroll room so it never hides the last field.

## Examples

### Floating

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import Kbd from '@aziontech/ui/kbd'
  import SaveBar from '@aziontech/ui/save-bar'
  import { ref } from 'vue'

  const saving = ref(false)

  const save = () => {
    if (saving.value) return
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
    <SaveBar @save="save">
      You have unsaved changes.
      <template #actions>
        <Button
          type="button"
          label="Discard"
          variant="outline"
          size="medium"
          :disabled="saving"
        />
        <Button
          variant="primary"
          size="medium"
          aria-keyshortcuts="Meta+S Control+S"
          :loading="saving"
          @click="save"
        >
          Save
          <span class="inline-flex pointer-coarse:hidden">
            <Kbd
              meta
              size="small"
              aria-hidden="true"
              >S</Kbd
            >
          </span>
        </Button>
      </template>
    </SaveBar>
  </div>
</template>
```

### Docked

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import SaveBar from '@aziontech/ui/save-bar'
</script>

<template>
  <SaveBar variant="docked">
    Project settings changed.
    <span class="text-(--text-muted)">Saving publishes them on the next deployment.</span>
    <template #actions>
      <Button
        type="button"
        label="Discard"
        variant="outline"
        size="medium"
      />
      <Button
        label="Save"
        variant="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
```

### Plain

```vue
<script setup>
  import Button from '@aziontech/ui/button'
  import SaveBar from '@aziontech/ui/save-bar'
</script>

<template>
  <SaveBar variant="plain">
    <template #actions>
      <Button
        type="button"
        label="Cancel"
        variant="outline"
        size="medium"
      />
      <Button
        label="Save"
        variant="primary"
        size="medium"
      />
    </template>
  </SaveBar>
</template>
```

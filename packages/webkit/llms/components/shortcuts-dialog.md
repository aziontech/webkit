# Shortcuts Dialog

> The list of every keyboard shortcut the current screen offers, opened with `?` (Shift+/) as the console keyboard standard asks. It reads the shortcuts screens register with `useShortcuts` (`@aziontech/webkit/use-shortcuts`), so the list is generated, never written by hand: a shortcut that a screen stops offering leaves the list with it. Built from `Dialog`, the `Panel` parts and `Kbd`.

- Import: `import ShortcutsDialog from '@aziontech/webkit/shortcuts-dialog'`
- Category: overlay · Surface: app · Structure: monolithic
- API as JSON: [shortcuts-dialog.json](shortcuts-dialog.json)

## When to use

- Once per app, in the app shell (beside the header search), so `?` works on every screen.
- With a `trigger` (a Help menu item, a keyboard icon button) so pointer and touch users find the list too.

## Do

- Mount one ShortcutsDialog per app, never one per page: the list already follows the screen.
- Register shortcuts with a `label` and a `group` (`Page`, `Table`, `Editor`); a shortcut without a `label` works but stays out of the list.
- Label a shortcut with the action it runs, in sentence case (`Save changes`, `Focus search`), never the key.
- Keep the default `?` binding; an empty `shortcut` leaves only the trigger.
- Give the control in the `trigger` slot `aria-keyshortcuts` with `toAriaKeyshortcuts(shortcut)` from `use-shortcuts`, as the Default example does.
- An app with more than one Vue root, or one that needs isolated shortcuts, calls `provideShortcuts()` in the shell above both the screens and the ShortcutsDialog; otherwise every screen and the dialog share the page-wide registry.

## Don’t

- A shortcut hint beside one action → use `Kbd` inside the button, menu item or tooltip, with `aria-keyshortcuts`.
- Searching commands and pages → use `Command` (`⌘K` / `Ctrl K`).
- Help content that is not keyboard shortcuts → use `HelpPanel` or a `Dialog` with your own body.
- Only layout utilities (margin, flex and grid placement, width, order, self-alignment) go on the component tag. Colors, borders, padding, typography and every other look come from the component props; put anything else on a wrapper element or inside a slot.

## Related

- `use-shortcuts` — the composable screens register shortcuts with; this dialog only lists them.
- [kbd](kbd.md) — draws each key, with `⌘` on Apple platforms and `Ctrl` elsewhere.
- [command](command.md) — the command palette; it binds `⌘K` itself and can be listed here with a `useShortcuts` entry that has no `handler`.
- [dialog](dialog.md) — the overlay it composes.

## Props

| Prop | Type | Default | Required | Description |
| --- | --- | --- | --- | --- |
| `title` | `string` | `''` | false | Dialog title. Empty uses the locale catalog (`Keyboard shortcuts`). |
| `shortcut` | `string` | `'?'` | false | Keys that open the list, in the `useShortcuts` syntax; listed under the general group. Empty binds no key. |
| `defaultOpen` | `boolean` | `false` | false | Initial open state when uncontrolled (`v-model:open` unbound). |
| `open` | `boolean` | `undefined` | false | Two-way value (`v-model:open`). |

## Slots

| Slot | Scope | Notes |
| --- | --- | --- |
| `trigger` | — | The control that opens the list (a menu item, an icon button). |

## v-model

- **`v-model:open`** — `boolean`, default `undefined` (uncontrolled, starts at `defaultOpen`), the same open contract as `Dialog`. The `shortcut` key, the trigger, `Esc`, the overlay and the close button update it.

## States

- Visual states: `closed`, `open`
- `data-state` on the root: `open` | `closed` (from `dialog`)
- The list holds at least the dialog's own `shortcut` row (general group). Only with an empty `shortcut` and nothing registered is it empty: the body then shows `EmptyState` with the catalog text.
- The dialog's `shortcut` entry follows the prop: when it changes, the old keys stop working and the new ones start.
- Not applicable: `loading`, `error`, `disabled`, `readonly`, `invalid`. The list is read-only and has no async source; empty is the `EmptyState` case above.

## Accessibility

- Visible focus: owned by `dialog` (the close button) and the trigger.
- Keyboard map: `?` (Shift+/ on a US layout; the key is matched by the character, so any layout that types `?` works) opens the list from anywhere except while typing in a field (input, textarea, contenteditable, combobox), while a modifier other than Shift is held (Command, Control or Alt), during IME composition, and while a modal layer is open (the dialog's own entry has no `element`, so it does not fire inside another layer). With the list open, `?` does nothing. `Esc` closes it; `Tab` is trapped in the dialog; on close focus returns to the element that had it before the list opened (from `dialog`). Tests: `shortcuts-dialog.test.ts`.
- ARIA: `role="dialog"`, `aria-modal`, named by its title (`DialogTitle`, an `h2`). Each group is a `div role="group"` with `aria-labelledby` pointing at its `h3` heading (no region landmark per group); each row is a `dt` (the action) and a `dd` (the keys) in a `dl`, so a screen reader reads the action, then the keys as `Kbd` text. List rows carry no `aria-keyshortcuts`; the keys are read as `Kbd` text.
- The control in the `trigger` slot carries `aria-keyshortcuts` for the `shortcut` keys. `DialogTrigger` forwards only `aria-haspopup` and `aria-expanded`, so the consumer sets it with `toAriaKeyshortcuts(shortcut)`; the Default example shows it.
- Contrast ≥4.5:1 from the tokens above; `Kbd` owns its keycap contrast.
- Touch: the trigger slot carries the touch target; the list itself has no controls besides the close button (44 px from `dialog`).

## Right-to-left

- Layout: logical utilities only; the label sits at the inline start and the keys at the inline end.
- Icons: none.
- Keyboard: no arrow keys.
- User data: keys render `dir="ltr"` inside `Kbd`; labels follow the page direction.

## Internationalization

| Key                          | English source              | Override prop |
| ---------------------------- | --------------------------- | ------------- |
| `shortcutsDialog.title`      | `Keyboard shortcuts`        | `title`       |
| `shortcutsDialog.show`       | `Show keyboard shortcuts`   | — (the label of the dialog's own `shortcut` row) |
| `shortcutsDialog.general`    | `General`                   | — (the heading of shortcuts registered without a `group`) |
| `shortcutsDialog.emptyTitle` | `No keyboard shortcuts here` | —            |

- The general heading shows on every list, also when the general group is the only one, so the list always reads as headed groups.
- Formatting: none. Key glyphs come from the `kbd` catalog (`Ctrl`, `Alt`, `Enter`, `Esc`).
- Registered labels and group names are the screen's own strings; the screen translates them (a getter keeps them current when the locale changes).

## Responsive

- Container queries: none: the dialog owns its width (`medium`).
- Narrow: rows keep the label and the keys on one line and wrap the label; the body scrolls inside the dialog.
- Touch: the list opens from the `trigger` slot on touch screens, where there is no `?` key.
- Reflow: no horizontal scroll at 320 px and 200 % zoom.

## Examples

### Default

```vue
<script setup>
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import ShortcutsDialog from '@aziontech/webkit/shortcuts-dialog'
  import { toAriaKeyshortcuts, useShortcuts } from '@aziontech/webkit/use-shortcuts'
  import { ref } from 'vue'

  const searchEl = ref(null)
  const saved = ref(false)

  useShortcuts([
    {
      keys: '/',
      label: 'Focus search',
      group: 'Page',
      handler: () => searchEl.value?.focus()
    },
    {
      keys: 'meta+s',
      label: 'Save changes',
      group: 'Page',
      handler: () => {
        saved.value = true
      }
    },
    {
      keys: 'meta+enter',
      label: 'Submit the form',
      group: 'Editor',
      handler: () => {
        saved.value = true
      }
    }
  ])
</script>

<template>
  <div class="flex w-full max-w-md flex-col gap-(--spacing-md)">
    <Input
      ref="searchEl"
      aria-label="Search domains"
      placeholder="Search domains"
    />
    <p
      class="text-body-sm text-(--text-muted)"
      aria-live="polite"
    >
      {{ saved ? 'Changes saved.' : 'Press ? to see every shortcut.' }}
    </p>
    <ShortcutsDialog>
      <template #trigger>
        <Button
          label="Keyboard shortcuts"
          variant="outline"
          size="medium"
          :aria-keyshortcuts="toAriaKeyshortcuts('?')"
        />
      </template>
    </ShortcutsDialog>
  </div>
</template>
```

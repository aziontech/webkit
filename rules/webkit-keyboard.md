# Rule: keyboard — one set of keys on every console screen

A console screen answers the keyboard the same way everywhere: the same key opens, closes, submits,
saves, searches and lists the shortcuts, on every page. WebKit components already own the keys
inside them (a `Dialog` traps focus and closes on `Esc`, a `DropdownMenu` moves with the arrows,
`Command` owns `⌘K`). This rule is the contract for the screen around them: where focus lands when
a page opens, what `Esc` means, which shortcuts exist, and what never fires while someone types.
It completes [`webkit-accessibility`](./webkit-accessibility.md), which covers the keyboard map of
one control.

## The contract

| Moment                                             | Behaviour                                                                                                                                                            |
| -------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Opening a task (create page, drawer, form dialog)  | Focus lands in the first field.                                                                                                                                      |
| Opening a page you browse (list, detail, settings) | Focus lands on the page `h1` (`tabindex="-1"`, no visible ring), so a screen reader announces the page.                                                              |
| `Esc`                                              | Closes the top layer only: menu, then dialog, then drawer. On a full-page task it means Cancel, through the unsaved-changes guard. On a browse page it does nothing. |
| `Enter`, `⌘ Enter` (`Ctrl Enter` off Apple)        | `Enter` submits a short single-line form; `⌘ Enter` submits from a textarea or the code editor.                                                                      |
| `⌘ S` (`Ctrl S`)                                   | Saves a page that has a `SaveBar`, and stops the browser's own save.                                                                                                 |
| `⌘ K` (`Ctrl K`)                                   | Opens the command palette (rule [`webkit-header-search`](./webkit-header-search.md)).                                                                                |
| `/`                                                | Focuses the page's search field, when the page has one.                                                                                                              |
| `?` (`Shift /`)                                    | Opens the list of every shortcut the current screen offers.                                                                                                          |
| Lists and tables                                   | Arrow keys move between rows, `Enter` opens, `Space` selects, `Delete` asks before it deletes.                                                                       |
| After an action                                    | Closing returns focus to the trigger; deleting moves focus to the next row, else the previous row, else the list.                                                    |
| Always                                             | A single-key shortcut never fires while typing in a field (`input`, `textarea`, `contenteditable`, a combobox) or with a modifier held.                              |

`⌘` is the Command key on Apple platforms; everywhere else the same shortcut is `Ctrl`. Write the
shortcut once with the Apple key in code (`meta`) and let `Kbd` print the platform's key: `⌘` on
macOS, `Ctrl` on Windows, Linux and ChromeOS.

## Do

- Put focus in the first field when a task opens. A form `Dialog` or `Drawer` already moves focus
  into its content; on a create page, call the field's own `focus()` once on mount:

  ```vue
  <script setup>
    import Input from '@aziontech/webkit/input'
    import PageHeader from '@aziontech/webkit/page-header'
    import { onMounted, ref } from 'vue'

    const name = ref('')
    const nameEl = ref(null)

    onMounted(() => nameEl.value?.focus())
  </script>

  <template>
    <PageHeader title="Create application" />
    <Input
      ref="nameEl"
      v-model="name"
      label="Name"
    />
  </template>
  ```

- Put focus on the `h1` when a browse page opens, so the page is announced and the next `Tab`
  starts at the top of its content. `PageHeader` takes a `title-id` for it:

  ```vue
  <script setup>
    import PageHeader from '@aziontech/webkit/page-header'
    import { onMounted } from 'vue'

    onMounted(() => {
      const title = document.getElementById('page-title')
      title?.setAttribute('tabindex', '-1')
      title?.focus({ preventScroll: true })
    })
  </script>

  <template>
    <PageHeader
      title="Applications"
      title-id="page-title"
    />
  </template>
  ```

- Let `Esc` close one layer at a time. `DropdownMenu`, `Popover`, `Dialog` and `Drawer` share one
  overlay stack and handle `Esc` only while they are on top, so a menu inside a drawer closes the
  menu first.
- Route `Esc` on a full-page task through the same guard as the Cancel button
  (`useUnsavedChanges` from `@aziontech/webkit/use-unsaved-changes`), so unsaved work is never lost
  to a key.
- Save with `⌘ S` on a page that has a `SaveBar`, and say so in the bar with `Kbd`:

  ```vue
  <script setup>
    import Button from '@aziontech/webkit/button'
    import Kbd from '@aziontech/webkit/kbd'
    import SaveBar from '@aziontech/webkit/save-bar'
    import { onBeforeUnmount, onMounted } from 'vue'

    const save = () => {}

    const onKeydown = (event) => {
      if ((event.metaKey || event.ctrlKey) && !event.altKey && event.key.toLowerCase() === 's') {
        event.preventDefault()
        save()
      }
    }

    onMounted(() => window.addEventListener('keydown', onKeydown))
    onBeforeUnmount(() => window.removeEventListener('keydown', onKeydown))
  </script>

  <template>
    <SaveBar>
      You have unsaved changes. Press <Kbd meta>S</Kbd> to save.
      <template #actions>
        <Button
          label="Save"
          aria-keyshortcuts="Meta+S Control+S"
          @click="save"
        />
      </template>
    </SaveBar>
  </template>
  ```

- Give a menu action its shortcut through `DropdownMenu.Item`'s `command`: the item prints the
  keycap and runs the same action when the key is pressed.
- Bind `/` to the page's search field (`TableSearch`, `Input type="search"`), and keep `⌘ K` for
  the palette the layout already renders.
- Register every shortcut a screen adds where the `?` list can read it, so the list always matches
  what the screen does. A shortcut that is not in the list does not exist for the person using it.
- Let a `DataTable` move with the arrow keys, open the row with `Enter` and select it with
  `Space`. `Delete` opens a `ConfirmDialog`, never deletes on the key alone; after the delete,
  move focus to the next row, else the previous row, else the table.
- Return focus to the trigger when anything closes. `Dialog`, `Drawer`, `Popover` and
  `DropdownMenu` do it for you; a panel you build yourself must do the same.
- Show every shortcut where the action is offered: `Kbd` in the menu item or beside the control
  (a `Tooltip` holds plain text only), and `aria-keyshortcuts` on the control
  (`Meta+S Control+S`).

## Don't

- Do not put focus on a button, the first link or the page body when a page opens; a task starts
  in its first field and a browse page on its `h1`.
- Do not draw a focus ring on the `h1` that took focus: it is a heading, not a control.
- Do not let `Esc` close two layers at once, leave a full-page task without the unsaved-changes
  guard, or do anything on a browse page.
- Do not submit a textarea or the code editor on a bare `Enter`: there `Enter` is a new line and
  `⌘ Enter` submits.
- Do not bind `⌘ S` on a page without a `SaveBar`, and do not let it fall through to the browser's
  "Save page as".
- Do not bind `⌘ K` yourself: `SearchTrigger` and `Command` own it (rule
  [`webkit-header-search`](./webkit-header-search.md)).
- Do not fire a single-key shortcut (`/`, `?`, a letter) while focus is in an `input`, a
  `textarea`, a `contenteditable` element or a combobox, or while `⌘`, `Ctrl` or `Alt` is held.
- Do not take a key the browser or the screen reader needs: `Tab`, `F6`, `⌘ L`, `⌘ W`, `⌘ T`,
  `⌘ R`, and arrow keys outside a list, grid or menu.
- Do not delete on `Delete` without asking first, and do not leave focus on `body` after a delete.
- Do not print a shortcut as plain text (`Cmd+S`) or hard-code one platform's key: use `Kbd`.

## Enforced

- **Inside WebKit components** — focus trap and restore, `Esc` closing one layer, arrow-key
  movement and `Enter` / `Space` on rows are asserted by each component's browser test (`Dialog`,
  `Drawer`, `Popover`, `DropdownMenu`, `Command`, `DataTable`, `Tree`).
- **On WebKit blocks and demos** — the `keyboard` check of the styled visual suite drives every
  block and demo screen in a real browser: focus on open, `Esc`, the shortcuts in this table, the
  `?` list, and no single-key shortcut firing inside a field.
- **In your app** — `/webkit-ui-verify` runs the same keyboard pass over the routes you built, and
  review (`/webkit-ux-heuristics`) holds the rest.
- **`⌘ K`** — `webkit/require-header-search` (ESLint) flags a `Meta+K` / `Control+K` shortcut
  outside `SearchTrigger`.

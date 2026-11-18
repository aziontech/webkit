# Rule: floating overlays open on the reader's action, never on load

A floating overlay sits above the page: a popover, a tooltip, a dropdown menu, a context menu, a
hover card, the list of a select, multi-select or combobox, a date picker panel, a command
palette, a dialog or a drawer. It opens when the person clicks, hovers, focuses or presses a key
on its trigger. A page, an example or a block never opens one by itself when it loads.

An overlay that is already open on load covers what the person came to read, steals focus or
the scroll lock before they did anything, and reads like a bug. On a docs page full of examples
it stacks several panels over the text.

## Do

- Leave the overlay closed: no `open`, `:open="true"`, `default-open` or `v-model:open` bound to
  a `ref(true)` on its root.
- Give the trigger a label that says what it opens (`Open top-left`, `Move to…`), and say in the
  example summary how to open it ("Click the trigger", "Right-click the area", "Hover or focus").
- To teach an open state (placement, option states, a sub-menu), let the reader open it: the
  state shows as soon as they click. One shared "Open all" button that the reader presses is
  fine when several panels must be compared side by side.
- A part inside an overlay may start open with it: a `DropdownMenu.Sub` with `default-open`
  opens when the reader opens the menu, not before.
- In a test, open the overlay through its trigger first (`userEvent.click`, `hover`, a
  `contextmenu` event), then assert on the panel.

## Inline disclosures are not overlays

Content that stays in the page flow may start open: an accordion, a sidebar group, `Reasoning`,
`Sources`, `ToolCall` details, a tree node, a settings section, a resizable pane. They push the
content down instead of covering it.

## Block states

A block's primary state follows this rule. A block **variant** whose job is to show an overlay
state (`delete-dialog` › Error, `shell/shell-console` › Notifications) renders it open: the reader picks
that state from the state switcher, and it renders inside its own frame.

## Enforcement

- `packages/webkit/test/standards/overlays-closed-on-load.test.mjs` (the `toolkit` tests) scans
  every example and every block's primary file and fails on a floating overlay root with `open`,
  `:open="true"`, `default-open` or `v-model:open` bound to a `ref(true)`.
- `packages/webkit/src/test/overlays-closed-on-load.test.ts` (the browser suite) mounts every
  example and fails when a dialog, menu, listbox, tooltip or open panel is visible outside it on
  mount.

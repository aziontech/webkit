# Rules list

An ordered list of rules grouped by phase: the Rules tab of an application (Request and Response phases) or a firewall (Request only). Order is behavior here, so the list is built to change the order safely: drag, keys, a typed position or Move up and Move down move a rule, every move is announced, and nothing runs in the new order until the user reviews the changes and saves.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/console`), which owns the rail, the header and the `main`.

## When to use

- A resource runs an ordered program of rules and the user needs to see it, reorder it and turn rules on or off: application rules engine, firewall rules, routing rules.
- Rules split into phases that never interleave (request and response), each with its own order.
- Changes to the order must be reviewed before they apply to live traffic.

## When not to use

- Records whose order does not matter: use `view/table-view`.
- Writing or editing one rule's criteria and behaviors: use `edit/rule-builder`, which this list opens from Add Rule and from a rule's name.
- Fewer than two rules that can move: show the list without the Order controls.

## Building blocks

### A. Header — `PageHeader`, `Button` (required)

`PageHeader` at `size="small"` titled Rules, with a one-sentence description that says order is behavior and that an inactive rule keeps its place. Actions: outlined Documentation, then outlined Add Rule on the outer edge.

### B. Search — `Input`, `Alert` (required)

A medium `Input` with a search icon, named "Search rules", matching name, description and author. While it holds text, an info `Alert` says reordering is off and how to turn it back on; phases with matches open, and each trigger reads "n of total".

### C. Phases — `Card`, `Accordion` (required)

A flush `Card` holding an `Accordion` with `type="multiple"`, `size="large"`, the arrow on the start side, one item per phase, all open by default. Each trigger is an `h2` reading "Request phase" with the rule count in muted tabular figures. A resource with a single phase keeps the same anatomy with one item.

### D. Rules table — `DataTable`, `Tag`, `Field`, `Switch` (required)

A data-driven `DataTable` per phase (`row-key="id"`, no sorting: order is the data's, `reorderable` with `:row-reorderable` and `@update:data`; no `stackable`, so on a phone the grid keeps its columns and scrolls sideways inside the panel): the table's own grip column (Order), Position (168 px), Name (principal, a link that opens the rule in the rule builder, with a secondary "Default" `Tag` on a locked rule), Description (muted, truncated), Status (a `Switch` named "Run <rule>" beside a visible Active or Inactive, inside a 40 px label) and Last modified ("2 days ago by Maya Chen"). The table draws the drag: the grip, the dragged row's dashed outline, the 2 px drop line and its own polite announcement ("Moved Docs rewrite to position 4 of 5."); the block only writes the new order back to its phase on `update:data`.

### E. Order controls — `Input`, `IconButton`, `Tooltip` (required)

The grip comes from `Table` `reorderable`: drag it, or focus it and press Arrow Up, Arrow Down, Home or End. `row-reorderable` returns false for a locked rule, while a search narrows the list and while saving, so those grips are disabled and no row can be dropped on or moved past a pinned rule. The Position cell starts with a small numeric `Input` showing the rule's position: type a number and press Enter (or leave the field) to move the rule there, clamped below the pinned rules and to the end of the phase; Escape or a value that is not a number keeps the rule in place, and after Enter focus stays in the field on the moved rule. On a locked rule, while searching and while saving the field is disabled and its name and `Tooltip` carry the reason ("Position 1 of Default rule in the Request phase. The default rule runs first and stays first."). Then the cell holds Move up and Move down `IconButton`s, the single-pointer way to reorder (WCAG 2.5.7); each is named after its rule and, when disabled, carries the reason ("Move Default rule down. The default rule runs first and stays first."), which its `Tooltip` repeats. After a move with them, focus returns to the same button on the moved rule (the other one, or the grip, when that one is now disabled) and the block's polite status region says "Docs rewrite moved to position 3 of 5 in the Request phase."

### F. Save bar and review — `SaveBar`, `Button`, `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `PanelHeader`, `PanelBody`, `PanelFooter`, `Alert` (required)

Any move or status change raises a `SaveBar` counting the changes, with Discard (outlined, restores the saved order and announces it) and Review changes (primary). Review changes opens a medium `Dialog` titled "Review changes": a description of what saving does, then one section per phase with an `h3` and a list of lines such as "Docs rewrite moves from position 5 to 3." and "Maintenance page is turned on." The footer has Cancel and Save; Save emits `save` with every rule in its new order, shows its loading state while `saving` is set, and the dialog cannot be dismissed while saving. On success (`saving` turns off with no `saveError`) the dialog closes, focus moves to the rules region (the Review changes button is gone) and a success toast says "Rule order saved." On failure (`saveError` set) the dialog stays open with a danger `Alert` at the top saying the rules still run in the saved order, and Save becomes Save again. This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/console` does), so the page never renders a `Toaster`.

### G. States — `EmptyState`, `Alert` (required)

Loading: triggers read Loading, the search and Add Rule are disabled and each `DataTable` shows its skeleton rows (`loading`). Load failure: the heading and the disabled search stay and a danger `Alert`, "Couldn't load the rules. Check your connection and retry.", with Retry takes the phases' place. Empty phase: a small `EmptyState` ("No request rules yet") with an outlined Add Rule. No match in a phase: a small `EmptyState` in the table's `empty` slot, "No request rule matches “cache”", with an outlined Clear search.

A rule's name is a `Button variant="link"` named "Edit <rule>" that emits `edit` with the event and the rule; the page opens `edit/rule-builder` from it, as EditRule shows.

Each phase renders every rule, unpaged: paging an ordered list would hide the neighbours a move lands between. A phase is sized for the tens of rules people manage by hand; past about 200 rules, split them across phases or rule sets rather than paging one phase.

## Data

The block takes its rules through props and emits every action; it fetches nothing. `RuleListRule`, `RuleListEdit` and `RuleListProps` are exported from `rule-list.vue`, and `sample.ts` holds the sample application and firewall rules the block renders when `rules` is left out (and never while `loading` or `error` is set). Moves and switches stay a local draft until Save.

| Prop                | Type                          | What it does                                                                                                 |
| ------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `subject`           | `'application' \| 'firewall'` | What runs the rules: an application has Request and Response phases, a firewall only Request. Sets the copy. |
| `rules`             | `RuleListRule[]`              | The saved rules, each phase in run order. Pass `[]` for none.                                                |
| `loading`           | `boolean`                     | The rules are loading: each phase reads Loading and shows skeleton rows; the search and Add Rule disable.    |
| `error`             | `string`                      | Why the rules failed to load, shown in the danger `Alert` with Retry that replaces the phases.               |
| `saving`            | `boolean`                     | The save is in flight. When it turns off with no `saveError`, the draft becomes the saved order.             |
| `saveError`         | `string`                      | Why the save failed, shown at the top of the review dialog; Save reads Save again.                           |
| `defaultEdits`      | `RuleListEdit[]`              | Unsaved moves and switches the list opens with.                                                              |
| `defaultSearch`     | `string`                      | The search the list opens with.                                                                              |
| `defaultReviewOpen` | `boolean`                     | Opens the Review changes dialog.                                                                             |

| Event    | Payload           | When                                                            |
| -------- | ----------------- | --------------------------------------------------------------- |
| `edit`   | `(event, rule)`   | A rule's name.                                                  |
| `create` | `(event, phase?)` | Add Rule in the heading, or in an empty phase (with its phase). |
| `retry`  | `(event)`         | Retry in the load error alert.                                  |
| `save`   | `(event, rules)`  | Save in the review dialog; every rule of every phase, in order. |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import RuleList, { type RuleListRule } from './rule-list.vue'

  const { data, pending, error, refresh } = useRules()
  const { run: saveOrder, pending: saving, error: saveFailed } = useSaveRuleOrder()
  const save = (_event: MouseEvent, rules: RuleListRule[]) => saveOrder(rules)
</script>

<template>
  <RuleList
    :rules="data ?? []"
    :loading="pending"
    :error="error ? 'Couldn\'t load the rules. Check your connection and retry.' : ''"
    :saving="saving"
    :save-error="
      saveFailed
        ? 'The new order wasn\'t saved. The rules still run in the saved order; save again to apply it.'
        : ''
    "
    @retry="refresh"
    @save="save"
  />
</template>
```

Then delete `sample.ts` and its import.

## Do

- Keep phases separate: a rule moves only within its phase, and drag ignores drops on another phase.
- Offer every way to move: drag for a pointer, arrow keys, Home and End on the grip, a typed position for long jumps, and Move up and Move down for touch and switch access.
- Say why a control is disabled, in its accessible name and its tooltip.
- Collect changes and apply them only after Review changes and Save; the review lists every rule whose position changes, not only the one the user dragged.
- Let a rule be turned off in place; an inactive rule keeps its position and is skipped at runtime.
- Follow `skills/webkit-tables` for the table, `skills/webkit-form` for the save bar and `skills/webkit-errors` for the failed save.

## Don't

- Don't save on every drop; one wrong drag would reorder live traffic.
- Don't allow reordering while a search hides rows; positions would be ambiguous.
- Don't let anything move above a locked default rule, or turn it off.
- Don't put the review in a toast or a popover; it is a decision with a list to read.
- Don't offer drag as the only way to reorder.

## Copy

- **Phase triggers:** "Request phase", "Response phase", with "5 rules" or "2 of 5" beside.
- **Order control names:** "Reorder Docs rewrite, position 5 of 5" (the table's grip, described by its drag-or-arrow hint), "Position of Docs rewrite in the Request phase. Type a number from 2 to 5 to move it.", "Move Docs rewrite up", and when disabled "Move Default rule down. The default rule runs first and stays first."
- **Disabled reasons:** "The default rule runs first and stays first.", "Clear the search to change the order rules run in.", "There is no other rule in this phase to move it past."
- **Announcements:** "Docs rewrite moved to position 3 of 5 in the Request phase.", "Changes discarded. The rules are back in their saved order."
- **Save bar:** "3 changes to the rules, not saved yet." with Discard and Review changes.
- **Review lines:** "<Rule> moves from position 5 to 3.", "<Rule> is turned on."
- **Failure:** "The new order wasn't saved. The rules still run in the saved order; save again to apply it."
- **Success toast:** "Rule order saved." with "The application runs its rules in the new order."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- Each phase is a disclosure: the trigger is a button inside an `h2` with `aria-expanded`, and the panel is a region named by it.
- Every Order control has a name that includes the rule and the phase; disabled controls include the reason.
- Keyboard: Tab reaches the grip, the position field, Move up, Move down, the rule link and its switch, in that order; the grip moves the rule with Up, Down, Home and End and Escape cancels a drag. Focus follows the moved rule.
- Moves and discards are announced once in a polite `role="status"` region that exists from the first render.
- The `Switch` is named "Run <rule>"; its visible Active or Inactive text is hidden from the accessibility tree so the state is read once, from `aria-checked`.
- The review dialog traps focus, returns it to Review changes on close, and is not dismissible while saving; the failure `Alert` is read when it appears.
- Drop targets show a 2 px accent line and the dragged row fades; transitions respect reduced motion.

## States

- Application: the default `subject`; Request and Response phases, a locked Default rule first in Request, one inactive rule per phase.
- Firewall: `subject="firewall"`; one Request phase, every rule movable.
- ReviewChanges: `defaultEdits` (two moves and one status change) and `defaultReviewOpen`: the save bar and the review dialog open.
- SaveError: the same with `saveError` set: the failure `Alert` and Save again.
- Searching: `defaultSearch` "cache": reordering off with its `Alert`, phases reading "n of total".
- Empty: `subject="firewall"` and `rules` `[]`: the Request phase shows its `EmptyState`.
- Loading: `loading`: skeleton rows in each phase, the search and Add Rule disabled.
- LoadError: `error` set: a danger `Alert` with Retry replaces the phases.
- EditRule: the list composed with `edit/rule-builder`. A rule's name is a button ("Edit Docs rewrite") that opens the builder `Drawer` as Edit Rule, seeded with the rule and its phase locked; Add Rule in the header or in an empty phase opens it as Add Rule in that phase. Saving an edit updates the row and says so in a toast; a new rule lands last in its phase with a toast that offers Edit. Neither is an order change, so the `SaveBar` still counts only moves and switches. Product pages (an application's or a firewall's Rules tab) compose the two the same way.

## Related

- `edit/rule-builder` — the drawer that adds or edits one rule.
- `view/table-view` — lists whose order does not matter.
- `state/form-validation` (SectionRejected) — the failed-save `Alert` pattern the review dialog follows.
- `view/waf-tuning` — the WAF tuning list a firewall's WAF rule links to.

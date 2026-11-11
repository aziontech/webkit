# Rules list

An ordered list of rules grouped by phase: the Rules tab of an application (Request and Response phases) or a firewall (Request only). Order is behavior here, so the list is built to change the order safely: drag, keys or a typed position move a rule, every move is announced, and nothing runs in the new order until the user reviews the changes and saves.

## When to use

- A resource runs an ordered program of rules and the user needs to see it, reorder it and turn rules on or off: application rules engine, firewall rules, routing rules.
- Rules split into phases that never interleave (request and response), each with its own order.
- Changes to the order must be reviewed before they apply to live traffic.

## When not to use

- Records whose order does not matter: use `platform/view/table-view`.
- Writing or editing one rule's criteria and behaviors: use `platform/edit/rule-builder`, which this list opens from Add Rule and from a rule's name.
- Fewer than two rules that can move: show the list without the Order controls.

## Building blocks

### A. Header — `PageHeader`, `Button` (required)

`PageHeader` at `size="small"` titled Rules, with a one-sentence description that says order is behavior and that an inactive rule keeps its place. Actions: outlined Documentation, then outlined Add Rule on the outer edge.

### B. Search — `Input`, `Alert` (required)

A medium `Input` with a search icon, named "Search rules", matching name, description and author. While it holds text, an info `Alert` says reordering is off and how to turn it back on; phases with matches open, and each trigger reads "n of total".

### C. Phases — `Card`, `Accordion` (required)

A flush `Card` holding an `Accordion` with `type="multiple"`, `size="large"`, the arrow on the start side, one item per phase, all open by default. Each trigger is an `h2` reading "Request phase" with the rule count in muted tabular figures. A resource with a single phase keeps the same anatomy with one item.

### D. Rules table — `Table`, `Table.Header`, `Table.Row`, `Table.HeadCell`, `Table.Cell`, `Tag`, `Switch` (required)

A composed `Table` per phase: Order (fixed width), Name (principal, a link that opens the rule in the rule builder, with a secondary "Default" `Tag` on a locked rule), Description (muted, truncated), Status (a `Switch` named "Run <rule>" beside a visible Active or Inactive, inside a 40 px label) and Last modified ("2 days ago by Maya Chen").

### E. Order controls — `Input`, `IconButton`, `Tooltip` (required)

In the Order cell, in this order: a small position `Input` (numeric, centered; Enter or blur moves the rule there, Escape cancels), a grip `IconButton` (`pi pi-bars`) that is the drag handle and moves the rule one place with the up and down arrow keys, and Move up and Move down `IconButton`s. Each control is named after its rule and phase, and its `Tooltip` repeats the action or, when it is disabled, the reason. Leading locked rules are pinned: their controls are disabled and nothing can move above them. After a move, focus returns to the same control on the moved rule (the grip when that control is now disabled), and a polite status region says "Docs rewrite moved to position 3 of 5 in the Request phase."

### F. Save bar and review — `SaveBar`, `Button`, `Dialog`, `PanelHeader`, `PanelContent`, `PanelFooter`, `Alert`, `Toaster` (required)

Any move or status change raises a `SaveBar` counting the changes, with Discard (outlined, restores the saved order and announces it) and Review changes (primary). Review changes opens a medium `Dialog` titled "Review changes": a description of what saving does, then one section per phase with an `h3` and a list of lines such as "Docs rewrite moves from position 5 to 3." and "Maintenance page is turned on." The footer has Cancel and Save; Save shows its loading state and the dialog cannot be dismissed while saving. On success the dialog closes and a success toast says "Rule order saved." On failure the dialog stays open with a danger `Alert` at the top saying the rules still run in the saved order, and Save becomes Save again.

### G. States — `Skeleton`, `EmptyState` (required)

Loading: triggers read Loading, the search is disabled and each table shows three skeleton rows shaped like its columns. Empty phase: a small `EmptyState` ("No request rules yet") with an outlined Add Rule. No match in a phase: one muted line, "No request rule matches “cache”."

## Do

- Keep phases separate: a rule moves only within its phase, and drag ignores drops on another phase.
- Offer every way to move: drag for a pointer, arrow keys on the grip, Move up and Move down for touch and switch access, and a typed position for long lists.
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
- **Order control names:** "Reorder Docs rewrite, position 5 of 5 in the Request phase. Use the up and down arrow keys to move it.", "Move Docs rewrite up".
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
- Keyboard: Tab reaches the position field, grip, Move up, Move down, the rule link and its switch, in that order; the grip moves the rule with Up and Down; Enter in the position field commits and Escape cancels. Focus follows the moved rule.
- Moves and discards are announced once in a polite `role="status"` region that exists from the first render.
- The `Switch` is named "Run <rule>"; its visible Active or Inactive text is hidden from the accessibility tree so the state is read once, from `aria-checked`.
- The review dialog traps focus, returns it to Review changes on close, and is not dismissible while saving; the failure `Alert` is read when it appears.
- Drop targets show a 2 px accent line and the dragged row fades; transitions respect reduced motion.

## States

- Application: Request and Response phases, a locked Default rule first in Request, one inactive rule per phase.
- Firewall: one Request phase, every rule movable.
- ReviewChanges: two moves and one status change, the save bar and the review dialog open.
- SaveFailed: the review dialog open with the failure `Alert` and Save again.
- Searching: "cache" typed, reordering off with its `Alert`, phases reading "n of total".
- Empty: a firewall with no rules, the Request phase showing its `EmptyState`.
- Loading: skeleton rows in each phase.

## Related

- `platform/edit/rule-builder` — the drawer that adds or edits one rule.
- `platform/view/table-view` — lists whose order does not matter.
- `platform/states/form-error` — the failed-save `Alert` pattern the review dialog follows.
- `platform/view/waf-tuning` — the WAF tuning list a firewall's WAF rule links to.

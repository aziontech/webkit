# WAF tuning

The Tuning tab of a WAF rule set. It shows the requests the rule set matched, grouped by the rule that matched them, with enough context (hits, top addresses, countries and paths) for the user to tell an attack from a false positive, and turns the legitimate ones into allowed rules with a recorded reason.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shells/console`), which owns the rail, the header and the `main`.

## When to use

- A security rule set blocks or flags traffic, and users need to review what it caught and allow what is legitimate.
- Each finding is a rule that matched many requests, summarized by its sources and targets.
- Allowing changes what the rule set lets through, so it needs a reason that stays with the change.

## When not to use

- A plain list of records to browse and act on one at a time: use `platform/view/table-view`.
- Charts of attack volume over time: use `platform/dashboard/security-dashboard`.
- Editing the allowed rules once created: an `edit-resource` form on the Allowed Rules tab.

## Building blocks

### A. Header — `PageHeader`, `Button` (required)

`PageHeader` at `size="small"` titled Tuning, with a description that says what the list is and what to do with it. Actions: outlined Export to CSV (disabled while loading or empty) and the allow action, which reads Add Allowed Rule and is disabled until rows are checked, then reads "Allow 2 selected".

### B. Threshold settings — `Field`, `Select`, `Input`, `IconButton`, `Tooltip` (required)

A wrapping row above the table: a Time range `Select` (Last hour, Last 24 hours, Last 7 days) and a Minimum hits `Input` (numeric; "Use a whole number." under it when it is not one), each a `Field` with a visible label; a search `Input` named "Search matched requests" that grows to fill the row; and an outlined Refresh `IconButton` with its `Tooltip`. Settings apply as they change, with no Apply button. Hidden when the rule set has no match at all.

### C. Matches table — `Card`, `TableRoot`, `Tag`, `EmptyState` (required)

A flush `Card` with a data-driven `TableRoot`: row selection, sorting (Hits high to low by default), `row-key` the rule id. Columns: Rule ID (principal, code font), Threat, Hits (tabular, grouped thousands), Top IP addresses and Top paths (code font), Top countries; list cells show two values and a small `Tag` with "+n". The `empty` slot is a small `EmptyState` naming the minimum and the range and saying how to widen them.

### D. Allow dialog — `Dialog`, `DialogPortal`, `DialogOverlay`, `DialogContent`, `DialogTitle`, `DialogClose`, `DialogDescription`, `PanelHeader`, `PanelContent`, `PanelFooter`, `Alert`, `Field`, `Textarea`, `Button` (required)

A medium `Dialog` holding a `form` titled "Allow 2 rules": the description says requests these rules matched on their paths will no longer be blocked and how many allowed rules will be created (one per rule and path); a list of the selected rules with their threat and path count; and a required Reason `Textarea` with a description saying it is kept with the allowed rules. "Enter why these requests are legitimate." shows under it only after Allow rules is pressed with it empty, and focus moves to it. Footer: Cancel and primary Allow rules, which shows its loading state; the dialog cannot be dismissed while it runs.

### E. Outcome — `Alert` (required)

Success closes the dialog, clears the selection, moves focus to the matched-requests region and raises a success toast: "6 allowed rules created." with "Requests that match them are no longer blocked by this rule set." Failure keeps the dialog and its input, puts a danger `Alert` at the top ("The allowed rules weren't created. Nothing changed in the rule set; try again.") and renames the submit button Try again (see `platform/states/form-error`). This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shells/console` does), so the page never renders a `Toaster`.

## Do

- Sort by hits so the noisiest rules come first, and keep the sort when settings change.
- Show sources and targets as samples with a count of the rest, not as full lists.
- Say how many allowed rules the action creates before the user confirms it.
- Require a reason, and validate it only after the user tries to allow.
- Keep the selection when settings change, so the user can narrow the list and still act on what they checked.

## Don't

- Don't allow from a single click on a row; allowing changes what the rule set blocks.
- Don't hide the threshold settings in a menu; they decide what the list shows.
- Don't put a free-text reason in a toast or a confirm without a field.
- Don't use real or customer addresses in examples; use documentation ranges (192.0.2.0/24, 198.51.100.0/24, 203.0.113.0/24).

## Copy

- **Header action:** "Add Allowed Rule", then "Allow 2 selected".
- **Settings labels:** "Time range", "Minimum hits".
- **Empty after threshold:** "No rule reaches the minimum", "No rule matched 100 times or more in the last 24 hours. Lower the minimum hits or widen the time range."
- **First use:** "No matches yet", "This rule set has not matched any request. Matches appear here as traffic arrives."
- **Dialog:** title "Allow 2 rules", submit "Allow rules", reason error "Enter why these requests are legitimate."
- **Outcome:** "6 allowed rules created." and "The allowed rules weren't created. Nothing changed in the rule set; try again."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- Time range and Minimum hits have visible labels; the search and Refresh have accessible names.
- The selection checkboxes and sort buttons come from `TableRoot` and are named per row and column.
- The dialog is a labelled `form`: its title names it, the reason is a required `Field` whose error is tied by `aria-describedby`, and Enter in a text field does not submit by accident because the reason is a `Textarea`.
- The failure `Alert` is read when it appears; focus stays in the dialog and returns to the allow action on close.
- Code-font values (rule ids, addresses, paths) are plain text; nothing depends on color.

## States

- Default: five rules matched in the last 24 hours, minimum 100 hits.
- Allow: two rules checked and the dialog open.
- AllowFailed: the dialog with the failure `Alert` and Try again.
- Empty: no match yet, no settings.
- Loading: settings disabled, skeleton rows.

## Related

- `platform/view/rules-list` — the firewall's rules, where a WAF rule set is applied.
- `platform/view/table-view` — the list recipe this table follows.
- `platform/states/form-error` — the failure pattern in the dialog.
- `platform/dashboard/security-dashboard` — attack volume over time.

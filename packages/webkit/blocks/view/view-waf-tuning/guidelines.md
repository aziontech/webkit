# WAF tuning

The Tuning tab of a WAF rule set. It shows the requests the rule set matched, grouped by the rule that matched them, with enough context (hits, top addresses, countries and paths) for the user to tell an attack from a false positive, and turns the legitimate ones into allowed rules with a recorded reason.

This block is a page body: render it in the default slot of `ConsoleLayout` (`shell/shell-console`), which owns the rail, the header and the `main`.

## When to use

- A security rule set blocks or flags traffic, and users need to review what it caught and allow what is legitimate.
- Each finding is a rule that matched many requests, summarized by its sources and targets.
- Allowing changes what the rule set lets through, so it needs a reason that stays with the change.

## When not to use

- A plain list of records to browse and act on one at a time: use `view/view-table`.
- Charts of attack volume over time: use `dashboard/dashboard-security`.
- Editing the allowed rules once created: an `edit-resource` form on the Allowed Rules tab.

## Building blocks

### A. Header — `PageHeader`, `Button` (required)

`PageHeader` at `size="small"` titled Tuning, with a description that says what the list is and what to do with it. Actions: outlined Export to CSV (disabled while loading or empty) and the allow action, which reads Allow selected and is disabled until rows are checked, then reads "Allow 2 selected".

### B. Threshold settings — `Field`, `Select`, `Input`, `IconButton`, `Tooltip` (required)

A wrapping row above the table: a Time range `Select` (Last hour, Last 24 hours, Last 7 days) and a Minimum hits `Input` (numeric; "Use a whole number." under it when it is not one), each a `Field` with a visible label; a search `Input` named "Search matched requests" that grows to fill the row; and an outlined Refresh `IconButton` with its `Tooltip`. Settings apply as they change, with no Apply button. Hidden when the rule set has no match at all.

### C. Matches table — `Card`, `DataTable`, `TableCellTags`, `EmptyState`, `Alert` (required)

A flush `Card` with a data-driven `DataTable`: row selection, sorting (Hits high to low by default), `row-key` the rule id. Columns: Rule ID (principal, code font), Threat, Hits (tabular, grouped thousands), Top IP addresses and Top paths (code font), Top countries; list cells are `TableCellTags`: as many values as fit, and a `+N` that opens the rest in a popover named by its noun (IP addresses, countries, paths). The `empty` slot is a small `EmptyState`: with a search set, No matching rules with an outlined Clear search; otherwise it names the minimum and the range and says how to widen them. When the matches fail to load, a danger `Alert` with Retry takes the card's place.

### D. Allow dialog — `Dialog`, `DialogContent`, `DialogTitle`, `DialogDescription`, `PanelHeader`, `PanelBody`, `PanelFooter`, `Alert`, `Field`, `Textarea`, `Button` (required)

A medium `Dialog` holding a `form` titled "Allow 2 rules": the description says requests these rules matched on their paths will no longer be blocked and how many allowed rules will be created (one per rule and path); a list of the selected rules with their threat and path count; and a required Reason `Textarea` with a description saying it is kept with the allowed rules. "Enter why these requests are legitimate." shows under it only after Allow rules is pressed with it empty, and focus moves to it. Footer: Cancel and primary Allow rules, which shows its loading state; the dialog cannot be dismissed while it runs.

### E. Outcome — `Alert` (required)

Allow rules emits `allow`; the page sets `allowing` while the request runs. Success (`allowing` turns off with no `allowError`) closes the dialog, clears the selection, moves focus to the matched-requests region and raises a success toast: "6 allowed rules created." with "Requests that match them are no longer blocked by this rule set." Failure (`allowError` set) keeps the dialog and its input, puts a danger `Alert` at the top ("The allowed rules weren't created. Nothing changed in the rule set; try again.") and renames the submit button Try again (see `state/state-form-validation` (SectionRejected)). This page body only calls `toast` from `@aziontech/webkit/toast`; the app mounts the one toast region (`ToastPlugin`, or one `Toaster` at its root, as `shell/shell-console` does), so the page never renders a `Toaster`.

## Data

The block takes its matches through props and emits every action; it fetches nothing. `WafTuningMatch`, `WafTuningAllowPayload` and `WafTuningProps` are exported from `view-waf-tuning.vue`, and `sample.ts` holds the sample matches the block renders when `matches` is left out (and never while `loading` or `error` is set). The allow dialog is the private part `parts/allow-dialog.vue`; it keeps the reason and its validation, and the page keeps the outcome.

| Prop                  | Type                    | What it does                                                                                                                                                   |
| --------------------- | ----------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `matches`             | `WafTuningMatch[]`      | The matched rules for the range; the minimum hits and the search filter them in the browser. Pass `[]` for a rule set with no match yet.                       |
| `v-model:range`       | `'1h' \| '24h' \| '7d'` | The time range; refetch the matches when it changes. Defaults to `24h`.                                                                                        |
| `loading`             | `boolean`               | The matches are loading: the settings and actions disable and the table shows skeleton rows.                                                                   |
| `error`               | `string`                | Why the matches failed to load, shown in the danger `Alert` with Retry that replaces the table.                                                                |
| `defaultSelectedKeys` | `string[]`              | Rule ids checked when the block opens.                                                                                                                         |
| `defaultOpen`         | `boolean`               | Opens the allow dialog on the checked rules.                                                                                                                   |
| `allowing`            | `boolean`               | The allow request is in flight: the dialog locks and Allow rules spins. When it turns off with no `allowError`, the dialog closes and the success toast shows. |
| `allowError`          | `string`                | Why the allowed rules were not created, shown at the top of the dialog; the submit reads Try again.                                                            |

| Event          | Payload                        | When                               |
| -------------- | ------------------------------ | ---------------------------------- |
| `refresh`      | `(event)`                      | Refresh.                           |
| `retry`        | `(event)`                      | Retry in the load error alert.     |
| `allow`        | `(event, { matches, reason })` | Allow rules with a reason entered. |
| `update:range` | `(range)`                      | A new time range was picked.       |

To go live, render the block from a page that owns the requests and pass what they return:

```vue
<script setup lang="ts">
  import ViewWafTuning, { type WafTuningAllowPayload } from './view-waf-tuning.vue'

  const range = ref<'1h' | '24h' | '7d'>('24h')
  const { data, pending, error, refresh } = useWafMatches(range)
  const { run: createAllowed, pending: allowing, error: allowFailed } = useCreateAllowedRules()
  const allow = (_event: Event, payload: WafTuningAllowPayload) => createAllowed(payload)
</script>

<template>
  <ViewWafTuning
    v-model:range="range"
    :matches="data ?? []"
    :loading="pending"
    :error="error ? 'Couldn\'t load the matched requests. Check your connection and retry.' : ''"
    :allowing="allowing"
    :allow-error="
      allowFailed
        ? 'The allowed rules weren\'t created. Nothing changed in the rule set; try again.'
        : ''
    "
    @refresh="refresh"
    @retry="refresh"
    @allow="allow"
  />
</template>
```

Then delete `sample.ts` and its import.

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

- **Header action:** "Allow selected" (disabled), then "Allow 2 selected".
- **No match:** "No matching rules", "No rule, IP address, country or path matches “cache”.", "Clear search".
- **Settings labels:** "Time range", "Minimum hits".
- **Empty after threshold:** "No rule reaches the minimum", "No rule matched 100 times or more in the last 24 hours. Lower the minimum hits or widen the time range."
- **First use:** "No matches yet", "This rule set has not matched any request. Matches appear here as traffic arrives."
- **Dialog:** title "Allow 2 rules", submit "Allow rules", reason error "Enter why these requests are legitimate."
- **Outcome:** "6 allowed rules created." and "The allowed rules weren't created. Nothing changed in the rule set; try again."
- Follow `skills/webkit-microcopy`: sentence case, no em dash, no "please", no exclamation marks.

## Accessibility

- Time range and Minimum hits have visible labels; the search and Refresh have accessible names.
- The selection checkboxes and sort buttons come from `DataTable` and are named per row and column.
- The dialog is a labelled `form`: its title names it, the reason is a required `Field` whose error is tied by `aria-describedby`, and Enter in a text field does not submit by accident because the reason is a `Textarea`.
- The failure `Alert` is read when it appears; focus stays in the dialog and returns to the allow action on close.
- Code-font values (rule ids, addresses, paths) are plain text; nothing depends on color.

## States

- Default: the matches passed in `matches` (the sample when it is left out), minimum 100 hits.
- Allow: `defaultSelectedKeys` checks two rules and `defaultOpen` opens the dialog.
- AllowError: the same dialog with `allowError` set: the failure `Alert` and Try again.
- Empty: `matches` is `[]`: no match yet, no settings.
- Loading: `loading`: settings disabled, skeleton rows.
- LoadError: `error` set: a danger `Alert` with Retry takes the table's place and Export to CSV is disabled.

## Related

- `view/view-rule-list` — the firewall's rules, where a WAF rule set is applied.
- `view/view-table` — the list recipe this table follows.
- `state/state-form-validation` (SectionRejected) — the failure pattern in the dialog.
- `dashboard/dashboard-security` — attack volume over time.

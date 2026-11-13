# WafTuning (`platform/view/waf-tuning`)

> The Tuning tab of a WAF rule set: the requests it matched, grouped by rule, so the user can allow the legitimate ones. A `PageHeader` with Export to CSV and an allow action that reads Allow n selected once rows are checked; threshold settings above the table (a Time range `Select`, a Minimum hits `Input` that validates as a whole number, a search `Input` and a Refresh `IconButton`); and a flush `Card` with a data-driven `TableRoot` with row selection and sorting (Rule ID, Threat, Hits sorted high to low, and the top IP addresses, countries and paths, two shown and a `Tag` counting the rest). Rows below the minimum hits drop out, and a table with none left shows a small `EmptyState` saying how to widen it. Allowing opens a `Dialog` form listing the selected rules and how many allowed rules will be created (one per rule and path), with a required Reason `Textarea` whose error shows only after Allow rules is pressed; success closes it, clears the selection and raises a success toast, failure keeps it open with a danger `Alert` and Try again. Built from `PageHeader`, `Button`, `Field`, `Select`, `Input`, `IconButton`, `Tooltip`, `Card`, `TableRoot`, `Tag`, `EmptyState`, `Dialog` and its parts, `PanelHeader`, `PanelContent`, `PanelFooter`, `Alert`, `Textarea`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: product
- Source: `blocks/platform/view/waf-tuning/waf-tuning.vue` in `@aziontech/webkit`
- MCP: `get_pattern("platform/view/waf-tuning")`
- Components: [Alert](../../../components/alert.md), [Button](../../../components/button.md), [Card](../../../components/card.md), [Dialog](../../../components/dialog.md), `DialogClose`, `DialogContent`, `DialogDescription`, `DialogOverlay`, `DialogPortal`, `DialogTitle`, [EmptyState](../../../components/empty-state.md), [Field](../../../components/field.md), [IconButton](../../../components/icon-button.md), [Input](../../../components/input.md), [PageHeader](../../../components/page-header.md), `PanelContent`, `PanelFooter`, `PanelHeader`, [Select](../../../components/select.md), `TableRoot`, [Tag](../../../components/tag.md), [Textarea](../../../components/textarea.md), [Toast](../../../components/toast.md), [Tooltip](../../../components/tooltip.md)
- Skills: `webkit-tables`, `webkit-lists`, `webkit-form`, `webkit-errors`

## Asked as

waf tuning; web application firewall; allow rules; false positives; attacks table; matched requests; waf allowed rules; threshold; ajuste do waf; falsos positivos; permitir regras; ajuste de waf; falsos positivos waf

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

## Variants

- `Default` — primary (the code below)
- `Allow` — Two rules checked and the Allow 2 rules dialog open: rule 1005 (SQL injection on 3 paths) and 1201 (Cross-site scripting on 3 paths), 6 allowed rules in all, and an empty Reason.
- `AllowFailed` — The same dialog after the allowed rules could not be created: a danger Alert says nothing changed in the rule set, and the submit button reads Try again.
- `Empty` — A rule set that has not matched any request: no threshold settings, and an EmptyState saying matches appear as traffic arrives.
- `Loading` — While the matches load: the settings and actions are disabled and the table shows skeleton rows.

Each variant is the same screen in another state: `get_pattern("platform/view/waf-tuning", { variant })`, or the file under `blocks/platform/view/waf-tuning/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Select from '@aziontech/webkit/select'
  import TableRoot, { type TableColumn, type TableExposed } from '@aziontech/webkit/table-root'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, nextTick, ref } from 'vue'

  interface Match {
    ruleId: string
    threat: string
    hits: number
    ips: string[]
    countries: string[]
    paths: string[]
  }

  const RANGES = [
    { value: '1h', label: 'Last hour', factor: 0.04 },
    { value: '24h', label: 'Last 24 hours', factor: 1 },
    { value: '7d', label: 'Last 7 days', factor: 6.2 }
  ]

  const MATCHES: Match[] = [
    {
      ruleId: '1005',
      threat: 'SQL injection',
      hits: 18432,
      ips: ['203.0.113.41', '198.51.100.7', '203.0.113.90', '192.0.2.15'],
      countries: ['United States', 'Brazil', 'Germany'],
      paths: ['/api/v1/search', '/api/v1/login', '/checkout']
    },
    {
      ruleId: '1015',
      threat: 'Unwanted access',
      hits: 6210,
      ips: ['198.51.100.22', '203.0.113.8'],
      countries: ['United States', 'Netherlands'],
      paths: ['/admin', '/wp-login.php']
    },
    {
      ruleId: '1201',
      threat: 'Cross-site scripting',
      hits: 2288,
      ips: ['192.0.2.31', '198.51.100.12', '203.0.113.77'],
      countries: ['Singapore', 'India'],
      paths: ['/v2/comments', '/v2/profile', '/search']
    },
    {
      ruleId: '1302',
      threat: 'File upload',
      hits: 934,
      ips: ['192.0.2.77'],
      countries: ['Ireland'],
      paths: ['/api/v1/upload']
    },
    {
      ruleId: '1402',
      threat: 'Evading tricks',
      hits: 120,
      ips: ['203.0.113.5', '198.51.100.61'],
      countries: ['Chile'],
      paths: ['/v2/graphql']
    }
  ]

  const INITIAL_ROWS = MATCHES
  const INITIAL_LOADING = false
  const INITIAL_SELECTION: Record<string, boolean> = {}
  const ALLOW_ON_START = false
  const FAILED_ON_START = false
  const ALLOW_FAILURES = 0

  const columns: TableColumn[] = [
    {
      accessorKey: 'ruleId',
      header: 'Rule ID',
      enableSorting: true,
      principal: true,
      hideable: false
    },
    { accessorKey: 'threat', header: 'Threat', grow: 2 },
    { accessorKey: 'hits', header: 'Hits', enableSorting: true, minWidth: 80 },
    { accessorKey: 'ips', header: 'Top IP addresses', grow: 3 },
    { accessorKey: 'countries', header: 'Top countries', grow: 2 },
    { accessorKey: 'paths', header: 'Top paths', grow: 3 }
  ]

  const range = ref('24h')
  const threshold = ref('100')
  const search = ref('')
  const loading = ref(INITIAL_LOADING)
  const selection = ref({ ...INITIAL_SELECTION })
  const sorting = ref([{ id: 'hits', desc: true }])

  const rangeLabel = (value: string) => RANGES.find((item) => item.value === value)?.label ?? ''
  const minimumHits = computed(() => {
    const value = Number.parseInt(threshold.value, 10)
    return Number.isFinite(value) && value > 0 ? value : 0
  })
  const thresholdInvalid = computed(
    () => threshold.value.trim() !== '' && !/^\d+$/.test(threshold.value.trim())
  )

  const rows = computed(() => {
    const factor = RANGES.find((item) => item.value === range.value)?.factor ?? 1
    return INITIAL_ROWS.map((row) => ({ ...row, hits: Math.round(row.hits * factor) })).filter(
      (row) => row.hits >= minimumHits.value
    )
  })
  const selected = computed(() => rows.value.filter((row) => selection.value[row.ruleId]))
  const pathCount = computed(() => selected.value.reduce((sum, row) => sum + row.paths.length, 0))
  const formatHits = (value: number) => new Intl.NumberFormat('en-US').format(value)

  const tuningTable = ref<TableExposed<Match> | null>(null)
  const resultsEl = ref<HTMLElement | null>(null)
  const exportCsv = () => tuningTable.value?.exportCsv({ filename: 'waf-tuning.csv' })

  const refresh = () => {
    if (loading.value) return
    loading.value = true
    setTimeout(() => {
      loading.value = false
    }, 700)
  }

  const allowOpen = ref(ALLOW_ON_START)
  const allowFailed = ref(FAILED_ON_START)
  const reason = ref('')
  const submitted = ref(false)
  const allowing = ref(false)
  const reasonMissing = computed(() => submitted.value && !reason.value.trim())
  const reasonField = ref<HTMLElement | null>(null)
  let failuresLeft = ALLOW_FAILURES

  const openAllow = () => {
    reason.value = ''
    submitted.value = false
    allowFailed.value = false
    allowOpen.value = true
  }

  const allow = () => {
    submitted.value = true
    if (allowing.value) return
    if (!reason.value.trim()) {
      nextTick(() => reasonField.value?.querySelector('textarea')?.focus())
      return
    }
    allowing.value = true
    allowFailed.value = false
    setTimeout(() => {
      allowing.value = false
      if (failuresLeft > 0) {
        failuresLeft -= 1
        allowFailed.value = true
        return
      }
      const created = pathCount.value
      allowOpen.value = false
      selection.value = {}
      setTimeout(() => resultsEl.value?.focus(), 0)
      toast.success(`${created} allowed ${created === 1 ? 'rule' : 'rules'} created.`, {
        description: 'Requests that match them are no longer blocked by this rule set.'
      })
    }, 900)
  }
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-h-full flex-col">
      <PageHeader
        title="Tuning"
        description="Requests this rule set matched, grouped by rule. Review them, then allow the ones that are legitimate."
        size="small"
      >
        <template #actions>
          <Button
            label="Export to CSV"
            icon="pi pi-download"
            kind="outlined"
            size="medium"
            :disabled="!rows.length || loading"
            @click="exportCsv"
          />
          <Button
            :label="selected.length ? `Allow ${selected.length} selected` : 'Add Allowed Rule'"
            icon="pi pi-check"
            kind="outlined"
            size="medium"
            :disabled="!selected.length || loading"
            @click="openAllow"
          />
        </template>
      </PageHeader>

      <section
        ref="resultsEl"
        tabindex="-1"
        class="layout-section-start flex min-w-0 flex-col gap-(--layout-group-gap) pb-(--layout-boundary-end) outline-none"
        aria-label="Matched requests"
      >
        <div
          v-if="INITIAL_ROWS.length"
          class="flex min-w-0 flex-wrap items-end gap-(--spacing-sm)"
        >
          <div class="w-full sm:w-48">
            <Field>
              <Field.Label>Time range</Field.Label>
              <Select
                v-model="range"
                size="medium"
                :display-value="rangeLabel"
                :disabled="loading"
              >
                <Select.Trigger />
                <Select.Content>
                  <Select.Option
                    v-for="option in RANGES"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Option>
                </Select.Content>
              </Select>
            </Field>
          </div>
          <div class="w-full sm:w-40">
            <Field :invalid="thresholdInvalid">
              <Field.Label>Minimum hits</Field.Label>
              <Input
                v-model="threshold"
                size="medium"
                inputmode="numeric"
                autocomplete="off"
                :disabled="loading"
              />
              <Field.Error v-if="thresholdInvalid">Use a whole number.</Field.Error>
            </Field>
          </div>
          <div class="min-w-36 grow basis-(--container-2xs)">
            <Input
              v-model="search"
              size="medium"
              placeholder="Search by rule, IP, country or path"
              aria-label="Search matched requests"
              class="w-full"
              :disabled="loading"
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
          <Tooltip text="Refresh">
            <IconButton
              icon="pi pi-refresh"
              kind="outlined"
              size="medium"
              aria-label="Refresh matched requests"
              :disabled="loading"
              @click="refresh"
            />
          </Tooltip>
        </div>

        <Card :padded="false">
          <template #content>
            <EmptyState
              v-if="!INITIAL_ROWS.length"
              icon="pi pi-shield"
              title="No matches yet"
              description="This rule set has not matched any request. Matches appear here as traffic arrives."
            />
            <TableRoot
              v-else
              ref="tuningTable"
              v-model:global-filter="search"
              v-model:row-selection="selection"
              v-model:sorting="sorting"
              :data="rows"
              :columns="columns"
              row-key="ruleId"
              enable-row-selection
              enable-sorting
              :bordered="false"
              :loading="loading"
              export-filename="waf-tuning.csv"
            >
              <template #cell-ruleId="{ value }">
                <span class="min-w-0 truncate font-code tabular-nums">{{ value }}</span>
              </template>
              <template #cell-hits="{ value }">
                <span class="tabular-nums">{{ formatHits(value) }}</span>
              </template>
              <template #cell-ips="{ value }">
                <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                  <span class="truncate font-code text-body-sm">{{
                    value.slice(0, 2).join(', ')
                  }}</span>
                  <Tag
                    v-if="value.length > 2"
                    :label="`+${value.length - 2}`"
                    size="small"
                  />
                </span>
              </template>
              <template #cell-countries="{ value }">
                <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                  <span class="truncate">{{ value.slice(0, 2).join(', ') }}</span>
                  <Tag
                    v-if="value.length > 2"
                    :label="`+${value.length - 2}`"
                    size="small"
                  />
                </span>
              </template>
              <template #cell-paths="{ value }">
                <span class="flex min-w-0 items-center gap-(--spacing-xxs)">
                  <span class="truncate font-code text-body-sm">{{
                    value.slice(0, 2).join(', ')
                  }}</span>
                  <Tag
                    v-if="value.length > 2"
                    :label="`+${value.length - 2}`"
                    size="small"
                  />
                </span>
              </template>
              <template #empty>
                <EmptyState
                  size="small"
                  title="No rule reaches the minimum"
                  :description="`No rule matched ${formatHits(minimumHits)} times or more in the ${rangeLabel(range).toLowerCase()}. Lower the minimum hits or widen the time range.`"
                />
              </template>
            </TableRoot>
          </template>
        </Card>
      </section>
    </div>

    <Dialog
      v-model:open="allowOpen"
      :dismissible="!allowing"
      size="medium"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <form
            class="flex min-h-0 flex-1 flex-col"
            novalidate
            aria-labelledby="waf-allow-title"
            @submit.prevent="allow"
          >
            <PanelHeader class="w-full">
              <DialogTitle id="waf-allow-title">
                Allow {{ selected.length }} {{ selected.length === 1 ? 'rule' : 'rules' }}
              </DialogTitle>
              <DialogClose />
            </PanelHeader>
            <PanelContent>
              <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
                <Alert
                  v-if="allowFailed"
                  severity="danger"
                  label="The allowed rules weren't created. Nothing changed in the rule set; try again."
                />
                <DialogDescription>
                  Requests these rules matched on their paths will no longer be blocked. One allowed
                  rule is created for each rule and path:
                  {{ pathCount }} in all.
                </DialogDescription>
                <ul class="m-0 flex list-none flex-col gap-(--spacing-xxs) p-0">
                  <li
                    v-for="row in selected"
                    :key="row.ruleId"
                    class="flex min-w-0 items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)"
                  >
                    <span class="shrink-0 font-code text-(--text-default)">{{ row.ruleId }}</span>
                    <span class="min-w-0 truncate"
                      >{{ row.threat }} on {{ row.paths.length }}
                      {{ row.paths.length === 1 ? 'path' : 'paths' }}</span
                    >
                  </li>
                </ul>
                <div ref="reasonField">
                  <Field
                    required
                    :invalid="reasonMissing"
                    :disabled="allowing"
                  >
                    <Field.Label>Reason</Field.Label>
                    <Textarea
                      v-model="reason"
                      :rows="4"
                      placeholder="Search accepts quotes in free-text queries."
                    />
                    <Field.Description
                      >Kept with the allowed rules, so the next person knows why.</Field.Description
                    >
                    <Field.Error v-if="reasonMissing"
                      >Enter why these requests are legitimate.</Field.Error
                    >
                  </Field>
                </div>
              </div>
            </PanelContent>
            <PanelFooter
              ><div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
                <div class="w-full md:w-fit">
                  <Button
                    class="w-full"
                    type="button"
                    label="Cancel"
                    kind="outlined"
                    :disabled="allowing"
                    @click="allowOpen = false"
                  />
                </div>
                <div class="w-full md:w-fit">
                  <Button
                    class="w-full"
                    type="submit"
                    :label="allowFailed ? 'Try again' : 'Allow rules'"
                    kind="primary"
                    :loading="allowing"
                  />
                </div></div
            ></PanelFooter>
          </form>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </div>
</template>
```

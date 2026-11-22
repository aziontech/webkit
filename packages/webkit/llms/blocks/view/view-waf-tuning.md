# ViewWafTuning (`view/view-waf-tuning`)

> The Tuning tab of a WAF rule set: the requests it matched, grouped by rule, so the user can allow the legitimate ones. A `PageHeader` with Export to CSV and an allow action that reads Allow selected, then Allow n selected once rows are checked; threshold settings above the table (a Time range `Select`, a Minimum hits `Input` that validates as a whole number, a search `Input` and a Refresh `IconButton`); and a flush `Card` with a data-driven `DataTable` with row selection and sorting (Rule ID, Threat, Hits sorted high to low, and the top IP addresses, countries and paths, as `TableCellTags` whose `+N` popover lists the rest). Rows below the minimum hits drop out, and a table with none left shows a small `EmptyState` saying how to widen it; a search that matches nothing shows No matching rules with Clear search, and a load failure shows a danger `Alert` with Retry. Allowing opens a `Dialog` form listing the selected rules and how many allowed rules will be created (one per rule and path), with a required Reason `Textarea` whose error shows only after Allow rules is pressed; success closes it, clears the selection and raises a success toast, failure keeps it open with a danger `Alert` and Try again. Built from `PageHeader`, `Button`, `Field`, `Select`, `Input`, `IconButton`, `Tooltip`, `Card`, `DataTable`, `TableCellTags`, `EmptyState`, `Dialog` and its parts, `PanelHeader`, `PanelBody`, `PanelFooter`, `Alert`, `Textarea`; its toasts go through `toast` into the app's one toast region (ToastPlugin, or one Toaster at the app root), never a Toaster in the page body. A page body: render it in the default slot of ConsoleLayout, which owns the rail, the header and the main.

- Surface: app
- Source: `blocks/view/view-waf-tuning/view-waf-tuning.vue` in `@aziontech/webkit`
- MCP: `get_block("view/view-waf-tuning")`
- Components: [Alert](../../components/alert.md), [Button](../../components/button.md), [Card](../../components/card.md), [DataTable](../../components/data-table.md), `DialogContent`, `DialogDescription`, [Dialog](../../components/dialog.md), `DialogTitle`, [EmptyState](../../components/empty-state.md), [Field](../../components/field.md), [IconButton](../../components/icon-button.md), [Input](../../components/input.md), [PageHeader](../../components/page-header.md), `PanelBody`, `PanelFooter`, `PanelHeader`, [Select](../../components/select.md), `TableCellTags`, [Textarea](../../components/textarea.md), [Toast](../../components/toast.md), [Tooltip](../../components/tooltip.md), `use-locale`
- Skills: `webkit-tables`, `webkit-lists`, `webkit-form`, `webkit-errors`

## Asked as

waf tuning; web application firewall; allow rules; false positives; attacks table; matched requests; waf allowed rules; threshold; ajuste do waf; falsos positivos; permitir regras; ajuste de waf; falsos positivos waf

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

## Variants

- `Default` — primary (the code below)
- `Allow` — Two rules checked and the Allow 2 rules dialog open: rule 1005 (SQL injection on 3 paths) and 1201 (Cross-site scripting on 3 paths), 6 allowed rules in all, and an empty Reason.
- `AllowError` — The same dialog after the allowed rules could not be created: a danger Alert says nothing changed in the rule set, and the submit button reads Try again.
- `Empty` — A rule set that has not matched any request: no threshold settings, and an EmptyState saying matches appear as traffic arrives.
- `LoadError` — The matched requests could not load: the heading and the settings stay, Export to CSV is disabled, and a danger Alert with Retry takes the table's place.
- `Loading` — While the matches load: the settings and actions are disabled and the table shows skeleton rows.

Each variant is the same screen in another state: `get_block("view/view-waf-tuning", { variant })`, or the file under `blocks/view/view-waf-tuning/variants/`.

## Code (`Default`)

```vue
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn, type TableExposed } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import TableCellTags from '@aziontech/webkit/table-cell-tags'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref, watch } from 'vue'

  import AllowDialog from './parts/allow-dialog.vue'
  import { sampleMatches } from './sample'

  /** A time range the matches are counted over. */
  export type WafTuningRange = '1h' | '24h' | '7d'

  /** One rule of the rule set and the requests it matched. */
  export interface WafTuningMatch {
    /** The rule id, the row key. */
    ruleId: string
    /** The threat the rule detects. */
    threat: string
    /** How many requests it matched in the range. */
    hits: number
    /** The addresses it matched most. */
    ips: string[]
    /** The countries it matched most. */
    countries: string[]
    /** The paths it matched on; one allowed rule is created per path. */
    paths: string[]
  }

  /** What Allow rules sends. */
  export interface WafTuningAllowPayload {
    /** The checked rules. */
    matches: WafTuningMatch[]
    /** Why their requests are legitimate. */
    reason: string
  }

  export interface WafTuningProps {
    /** The matched rules for the range. Pass an empty list for a rule set with no match yet. Left out, the sample renders. */
    matches?: WafTuningMatch[]
    /** The matches are loading: the settings and actions disable and the table shows skeleton rows. */
    loading?: boolean
    /** Why the matches could not load; a danger alert with Retry takes the table's place. */
    error?: string
    /** Rule ids checked when the block opens. */
    defaultSelectedKeys?: string[]
    /** Opens the allow dialog on the checked rules when the block opens. */
    defaultOpen?: boolean
    /** The allow request is in flight: the dialog locks and Allow rules spins. */
    allowing?: boolean
    /** Why the allowed rules were not created, shown at the top of the dialog. */
    allowError?: string
  }

  const props = withDefaults(defineProps<WafTuningProps>(), {
    matches: undefined,
    loading: false,
    error: '',
    defaultSelectedKeys: () => [],
    defaultOpen: false,
    allowing: false,
    allowError: ''
  })

  const emit = defineEmits<{
    refresh: [event: MouseEvent]
    retry: [event: MouseEvent]
    allow: [event: Event, payload: WafTuningAllowPayload]
  }>()

  const range = defineModel<WafTuningRange>('range', { default: '24h' })

  const RANGES: { value: WafTuningRange; label: string }[] = [
    { value: '1h', label: 'Last hour' },
    { value: '24h', label: 'Last 24 hours' },
    { value: '7d', label: 'Last 7 days' }
  ]

  const columns: TableColumn[] = [
    {
      accessorKey: 'ruleId',
      header: 'Rule ID',
      sortable: true,
      principal: true,
      hideable: false
    },
    { accessorKey: 'threat', header: 'Threat', grow: 2 },
    { accessorKey: 'hits', header: 'Hits', sortable: true, minWidth: 80 },
    { accessorKey: 'ips', header: 'Top IP addresses', grow: 3 },
    { accessorKey: 'countries', header: 'Top countries', grow: 2 },
    { accessorKey: 'paths', header: 'Top paths', grow: 3 }
  ]

  const source = computed<WafTuningMatch[]>(
    () => props.matches ?? (props.loading || props.error ? [] : sampleMatches)
  )
  const loading = computed(() => props.loading)
  const loadFailed = computed(() => props.error !== '')
  const noMatches = computed(() => !props.loading && !loadFailed.value && !source.value.length)

  const threshold = ref('100')
  const search = ref('')
  const selectedKeys = ref<string[]>([...props.defaultSelectedKeys])
  const sorting = ref([{ id: 'hits', desc: true }])

  const rangeLabel = (value: string) => RANGES.find((item) => item.value === value)?.label ?? ''
  const minimumHits = computed(() => {
    const value = Number.parseInt(threshold.value, 10)
    return Number.isFinite(value) && value > 0 ? value : 0
  })
  const thresholdInvalid = computed(
    () => threshold.value.trim() !== '' && !/^\d+$/.test(threshold.value.trim())
  )

  const rows = computed(() => source.value.filter((row) => row.hits >= minimumHits.value))
  const selected = computed(() =>
    rows.value.filter((row) => selectedKeys.value.includes(row.ruleId))
  )
  const pathCount = computed(() => selected.value.reduce((sum, row) => sum + row.paths.length, 0))
  const { formatNumber } = useLocale()

  const formatHits = (value: number) => formatNumber(value)

  const tuningTableEl = ref<TableExposed<WafTuningMatch> | null>(null)
  const resultsEl = ref<HTMLElement | null>(null)
  const exportCsv = () => tuningTableEl.value?.exportCsv({ filename: 'waf-tuning.csv' })

  const allowOpen = ref(props.defaultOpen)
  const allowing = computed(() => props.allowing)

  const openAllow = () => {
    allowOpen.value = true
  }

  const allow = (event: Event, reason: string) => {
    emit('allow', event, { matches: [...selected.value], reason })
  }

  watch(
    () => props.allowing,
    (now, before) => {
      if (!before || now) return
      if (props.allowError) return
      const created = pathCount.value
      allowOpen.value = false
      selectedKeys.value = []
      setTimeout(() => resultsEl.value?.focus(), 0)
      toast.success(`${created} allowed ${created === 1 ? 'rule' : 'rules'} created.`, {
        description: 'Requests that match them are no longer blocked by this rule set.'
      })
    }
  )
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
            icon="az az-download"
            variant="outline"
            size="medium"
            :disabled="!rows.length || loading || loadFailed"
            @click="exportCsv"
          />
          <Button
            :label="selected.length ? `Allow ${selected.length} selected` : 'Allow selected'"
            icon="az az-check"
            variant="outline"
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
          v-if="!noMatches"
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
                  <Select.Item
                    v-for="option in RANGES"
                    :key="option.value"
                    :value="option.value"
                  >
                    {{ option.label }}
                  </Select.Item>
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
              <template #leading>
                <i
                  class="az az-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </div>
          <Tooltip content="Refresh">
            <IconButton
              icon="az az-refresh"
              variant="outline"
              size="medium"
              aria-label="Refresh matched requests"
              :disabled="loading"
              @click="(event: MouseEvent) => emit('refresh', event)"
            />
          </Tooltip>
        </div>

        <Alert
          v-if="loadFailed"
          severity="danger"
          :label="error"
          action-label="Retry"
          @action="(event: MouseEvent) => emit('retry', event)"
        />
        <Card
          v-else
          :padded="false"
        >
          <template #default>
            <EmptyState
              v-if="noMatches"
              icon="az az-shield"
              title="No matches yet"
              description="This rule set has not matched any request. Matches appear here as traffic arrives."
            />
            <DataTable
              v-else
              ref="tuningTableEl"
              v-model:global-filter="search"
              v-model:selected-keys="selectedKeys"
              v-model:sorting="sorting"
              :data="rows"
              :columns="columns"
              row-key="ruleId"
              selectable
              sortable
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
                <TableCellTags
                  :items="value"
                  :noun="{ one: 'IP address', other: 'IP addresses' }"
                />
              </template>
              <template #cell-countries="{ value }">
                <TableCellTags
                  :items="value"
                  :noun="{ one: 'country', other: 'countries' }"
                />
              </template>
              <template #cell-paths="{ value }">
                <TableCellTags
                  :items="value"
                  :noun="{ one: 'path', other: 'paths' }"
                />
              </template>
              <template #empty>
                <EmptyState
                  key="empty-state-1"
                  v-if="search.trim()"
                  size="small"
                  icon="az az-search"
                  title="No matching rules"
                  :description="`No rule, IP address, country or path matches “${search.trim()}”.`"
                >
                  <template #actions>
                    <Button
                      label="Clear search"
                      variant="outline"
                      size="small"
                      @click="search = ''"
                    />
                  </template>
                </EmptyState>
                <EmptyState
                  key="empty-state-2"
                  v-else
                  size="small"
                  title="No rule reaches the minimum"
                  :description="`No rule matched ${formatHits(minimumHits)} times or more in the ${rangeLabel(range).toLowerCase()}. Lower the minimum hits or widen the time range.`"
                />
              </template>
            </DataTable>
          </template>
        </Card>
      </section>
    </div>

    <AllowDialog
      v-model:open="allowOpen"
      :selected="selected"
      :path-count="pathCount"
      :allowing="allowing"
      :allow-error="allowError"
      @allow="allow"
    />
  </div>
</template>
```

## `sample.ts`

```ts
import type { WafTuningMatch } from './view-waf-tuning.vue'

export const sampleMatches: WafTuningMatch[] = [
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
```

## `parts/allow-dialog.vue`

```ts
<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogDescription from '@aziontech/webkit/dialog-description'
  import Dialog from '@aziontech/webkit/dialog-root'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Field from '@aziontech/webkit/field'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Textarea from '@aziontech/webkit/textarea'
  import { computed, nextTick, ref, watch } from 'vue'

  import type { WafTuningMatch } from '../view-waf-tuning.vue'

  const props = defineProps<{
    selected: WafTuningMatch[]
    pathCount: number
    allowing: boolean
    allowError: string
  }>()

  const emit = defineEmits<{
    allow: [event: Event, reason: string]
  }>()

  const open = defineModel<boolean>('open', { default: false })

  const allowFailed = ref(props.allowError !== '')
  const reason = ref('')
  const submitted = ref(false)
  const reasonMissing = computed(() => submitted.value && !reason.value.trim())
  const reasonFieldEl = ref<HTMLElement | null>(null)

  const allow = (event: Event) => {
    submitted.value = true
    if (props.allowing) return
    if (!reason.value.trim()) {
      nextTick(() => reasonFieldEl.value?.querySelector('textarea')?.focus())
      return
    }
    allowFailed.value = false
    emit('allow', event, reason.value.trim())
  }

  watch(open, (now) => {
    if (!now) return
    reason.value = ''
    submitted.value = false
    allowFailed.value = false
  })

  watch(
    () => props.allowError,
    (next) => {
      allowFailed.value = next !== ''
    }
  )

  watch(
    () => props.allowing,
    (now, before) => {
      if (before && !now && props.allowError) allowFailed.value = true
    }
  )
</script>

<template>
  <Dialog
    v-model:open="open"
    :dismissible="!allowing"
    :closable="!allowing"
    size="medium"
  >
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
        </PanelHeader>
        <PanelBody>
          <div class="flex min-w-0 flex-col gap-(--spacing-lg)">
            <Alert
              v-if="allowFailed"
              severity="danger"
              :label="allowError"
            />
            <DialogDescription>
              Requests these rules matched on their paths will no longer be blocked. One allowed
              rule is created for each rule and path:
              {{ pathCount }} in all.
            </DialogDescription>
            <ul class="m-0 flex list-none flex-col gap-(--spacing-2xs) p-0">
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
            <div ref="reasonFieldEl">
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
        </PanelBody>
        <PanelFooter
          ><div class="flex w-full flex-col gap-(--spacing-sm) md:flex-row md:justify-end">
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                type="button"
                label="Cancel"
                variant="outline"
                :disabled="allowing"
                @click="open = false"
              />
            </div>
            <div class="w-full md:w-fit">
              <Button
                class="w-full"
                type="submit"
                :label="allowFailed ? 'Try again' : 'Allow rules'"
                variant="primary"
                :loading="allowing"
              />
            </div></div
        ></PanelFooter>
      </form>
    </DialogContent>
  </Dialog>
</template>
```

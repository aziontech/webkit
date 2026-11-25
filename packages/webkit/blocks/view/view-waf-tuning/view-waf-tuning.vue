<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DataTable, { type TableColumn, type TableExposed } from '@aziontech/webkit/data-table'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Field from '@aziontech/webkit/field'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import NumberInput from '@aziontech/webkit/number-input'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import TableCellTags from '@aziontech/webkit/table-cell-tags'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { matchesText } from '@aziontech/webkit/use-collection'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { useShortcuts } from '@aziontech/webkit/use-shortcuts'
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
    /** The reason the allow dialog opens with, as a failed submit keeps it. */
    defaultReason?: string
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
    defaultReason: '',
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
  const WIDEST_RANGE: WafTuningRange = '7d'

  const columns: TableColumn[] = [
    {
      accessorKey: 'ruleId',
      header: 'Rule ID',
      sortable: true,
      principal: true,
      hideable: false,
      minWidth: 64
    },
    { accessorKey: 'hits', header: 'Hits', sortable: true, minWidth: 80 },
    { accessorKey: 'threat', header: 'Threat', grow: 2 },
    { accessorKey: 'ips', header: 'Top IP addresses', minWidth: 120 },
    { accessorKey: 'countries', header: 'Top countries', minWidth: 120 },
    { accessorKey: 'paths', header: 'Top paths', minWidth: 120 }
  ]

  const source = computed<WafTuningMatch[]>(
    () => props.matches ?? (props.loading || props.error ? [] : sampleMatches)
  )
  const loading = computed(() => props.loading)
  const loadFailed = computed(() => props.error !== '')
  const noMatches = computed(() => !props.loading && !loadFailed.value && !source.value.length)

  const threshold = ref(100)
  const search = ref('')
  const searchEl = ref<InstanceType<typeof Input> | null>(null)
  useShortcuts({
    keys: '/',
    label: 'Focus search',
    element: () => (searchEl.value?.$el as HTMLElement | null | undefined) ?? null,
    when: () => !props.loading,
    handler: () => searchEl.value?.focus()
  })
  const selectedKeys = ref<string[]>([...props.defaultSelectedKeys])
  const sorting = ref([{ id: 'hits', desc: true }])

  const rangeLabel = (value: string) => RANGES.find((item) => item.value === value)?.label ?? ''
  const minimumHits = computed(() => threshold.value)

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
  const matchingRows = computed(() =>
    rows.value.filter((row) =>
      matchesText(
        row,
        search.value,
        columns.flatMap((column) => column.accessorKey ?? [])
      )
    )
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
        <div class="flex min-w-0 flex-wrap items-end gap-(--spacing-sm)">
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
            <Field>
              <Field.Label>Minimum hits</Field.Label>
              <NumberInput
                v-model="threshold"
                size="medium"
                :min="0"
                :disabled="loading || noMatches"
              />
            </Field>
          </div>
          <div class="min-w-36 grow basis-(--container-2xs)">
            <Input
              ref="searchEl"
              v-model="search"
              size="medium"
              placeholder="Search by rule, IP, country or path"
              aria-keyshortcuts="/"
              aria-label="Search matched requests"
              class="w-full"
              :disabled="loading || noMatches"
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
              :title="`No matches in the ${rangeLabel(range).toLowerCase()}`"
              :description="`This rule set matched no request in the ${rangeLabel(range).toLowerCase()}. Widen the time range, or come back as traffic arrives.`"
            >
              <template
                v-if="range !== WIDEST_RANGE"
                #actions
              >
                <Button
                  :label="`Show the ${rangeLabel(WIDEST_RANGE).toLowerCase()}`"
                  variant="outline"
                  size="small"
                  @click="range = WIDEST_RANGE"
                />
              </template>
            </EmptyState>
            <DataTable
              v-else
              ref="tuningTableEl"
              v-model:selected-keys="selectedKeys"
              v-model:sorting="sorting"
              :data="matchingRows"
              :columns="columns"
              row-key="ruleId"
              selectable
              sortable
              :bordered="false"
              :loading="loading"
            >
              <template #cell-ruleId="{ value }">
                <span class="min-w-0 truncate tabular-nums">{{ value }}</span>
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
      :default-reason="defaultReason"
      @allow="allow"
    />
  </div>
</template>

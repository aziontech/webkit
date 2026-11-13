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

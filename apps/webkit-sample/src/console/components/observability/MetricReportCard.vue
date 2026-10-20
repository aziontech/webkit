<script setup lang="ts">
  import ChartCard from '@aziontech/webkit/chart-card'
  import Dialog from '@aziontech/webkit/dialog'
  import DialogClose from '@aziontech/webkit/dialog-close'
  import DialogContent from '@aziontech/webkit/dialog-content'
  import DialogOverlay from '@aziontech/webkit/dialog-overlay'
  import DialogPortal from '@aziontech/webkit/dialog-portal'
  import DialogTitle from '@aziontech/webkit/dialog-title'
  import Dropdown from '@aziontech/webkit/dropdown'
  import Hint from '@aziontech/webkit/hint'
  import IconButton from '@aziontech/webkit/icon-button'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Tag from '@aziontech/webkit/tag'
  import { toast } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { downloadCsv, toCsv } from '@aziontech/webkit/utils/csv'
  import { computed, nextTick, ref, watch } from 'vue'

  import { aggregationLabel, variationTone } from '../../lib/data/real-time-metrics'
  import MetricBreakdownTable from './MetricBreakdownTable.vue'
  import MetricPlot from './MetricPlot.vue'

  interface Props {
    report: Record<string, any>
    empty?: boolean
    loading?: boolean
    refetching?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    empty: false,
    loading: false,
    refetching: false
  })

  const activeIndex = defineModel<number | null>('activeIndex', { default: null })

  defineSlots<{
    footer(): unknown
  }>()

  const form = ref('line')
  const expanded = ref(false)
  const expandButton = ref(null)

  watch(expanded, async (open) => {
    if (open) return
    await nextTick()
    expandButton.value?.$el?.focus()
  })

  const FORMS = [
    { label: 'Line', value: 'line' },
    { label: 'Bar', value: 'bar' }
  ]

  const isTimeseries = computed(() => props.report.type === 'line')
  const isBreakdown = computed(() => props.report.type === 'list')

  const variation = computed(() => {
    if (!props.report.variation || props.empty) return null
    const delta = props.report.delta
    const sign = delta > 0 ? '+' : ''
    return {
      label: `${sign}${delta.toFixed(2)}%`,
      severity: variationTone(delta, props.report.variation),
      icon: delta > 0 ? 'pi pi-arrow-up-right' : 'pi pi-arrow-down-left'
    }
  })

  const fileName = computed(() => `${props.report.id}-${props.report.period}.csv`)

  const csv = () => {
    const { report } = props
    if (isBreakdown.value) {
      return toCsv({ columns: report.fields, rows: report.rows })
    }
    if (isTimeseries.value) {
      return toCsv({
        columns: [
          { id: 'ts', header: 'Time' },
          ...report.series.map((entry) => ({ id: entry.id, header: entry.name }))
        ],
        rows: report.labels.map((label, index) => ({
          ts: label.toISOString(),
          ...Object.fromEntries(report.series.map((entry) => [entry.id, entry.values[index]]))
        }))
      })
    }
    return toCsv({
      columns: [
        { id: 'name', header: 'Name' },
        { id: 'value', header: 'Requests' }
      ],
      rows: report.series.map((entry) => ({ name: entry.name, value: entry.values[0] }))
    })
  }

  const query = () => {
    const { report } = props
    const begin = report.labels[0]?.toISOString() ?? ''
    const end = report.labels.at(-1)?.toISOString() ?? ''
    const fields = isBreakdown.value
      ? report.fields.map((field) => field.id)
      : ['ts', ...(report.series ?? []).map((entry) => entry.id)]
    return [
      'query {',
      `  ${report.dataset}(`,
      '    limit: 5000',
      `    aggregate: { ${report.aggregation}: requests }`,
      `    filter: { tsRange: { begin: "${begin}", end: "${end}" } }`,
      '    orderBy: [ts_ASC]',
      '  ) {',
      ...fields.map((field) => `    ${field}`),
      '  }',
      '}'
    ].join('\n')
  }

  const onOption = async (event, value) => {
    if (value === 'export') {
      downloadCsv(fileName.value, csv())
      toast.success('CSV exported.', { description: fileName.value })
      return
    }
    try {
      await globalThis.navigator.clipboard.writeText(query())
      toast.success('Query copied.', {
        description: 'Paste it into any GraphQL client that sends your token.'
      })
    } catch {
      toast.error('The query could not be copied.')
    }
  }
</script>

<template>
  <ChartCard :span="report.columns">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
        <ChartCard.Title>{{ report.label }}</ChartCard.Title>
        <Hint :text="report.description" />
      </span>
      <ChartCard.Controls>
        <span
          :data-wide="report.columns === 12 || null"
          class="hidden items-center gap-(--spacing-xs) sm:flex lg:hidden xl:flex data-wide:lg:flex"
        >
          <Tag
            :label="aggregationLabel(report.aggregation)"
            severity="secondary"
            size="small"
            icon="pi pi-calculator"
          />
          <Tag
            v-if="variation"
            :label="variation.label"
            :severity="variation.severity"
            :icon="variation.icon"
            size="small"
          />
          <SegmentedButton
            v-if="isTimeseries"
            v-model="form"
            :options="FORMS"
            size="small"
            :aria-label="`Chart form for ${report.label}`"
          />
        </span>
        <Tooltip text="Expand">
          <IconButton
            ref="expandButton"
            icon="pi pi-window-maximize"
            kind="transparent"
            size="small"
            :aria-label="`Expand ${report.label}`"
            @click="expanded = true"
          />
        </Tooltip>
        <Dropdown
          placement="bottom-end"
          @select="onOption"
        >
          <Dropdown.Trigger>
            <IconButton
              icon="pi pi-ellipsis-h"
              kind="transparent"
              size="small"
              :aria-label="`More options for ${report.label}`"
            />
          </Dropdown.Trigger>
          <Dropdown.Group>
            <Dropdown.Option
              value="query"
              label="Copy query"
            />
            <Dropdown.Option
              value="export"
              label="Export CSV"
            />
          </Dropdown.Group>
        </Dropdown>
      </ChartCard.Controls>
    </ChartCard.Header>

    <ChartCard.Content>
      <MetricBreakdownTable
        v-if="isBreakdown"
        :report="report"
        :loading="loading"
      />
      <MetricPlot
        v-else
        v-model:active-index="activeIndex"
        :report="report"
        :form="form"
        :loading="loading"
        :refetching="refetching"
      />
    </ChartCard.Content>

    <ChartCard.Footer v-if="$slots.footer">
      <slot name="footer" />
    </ChartCard.Footer>

    <Dialog
      v-model:open="expanded"
      size="large"
    >
      <DialogPortal>
        <DialogOverlay />
        <DialogContent>
          <PanelHeader>
            <DialogTitle>{{ report.label }}</DialogTitle>
            <DialogClose />
          </PanelHeader>
          <PanelContent>
            <div class="flex min-w-0 flex-col gap-(--spacing-md)">
              <p class="m-0 text-body-sm text-(--text-muted)">{{ report.description }}</p>
              <div v-if="isTimeseries">
                <SegmentedButton
                  v-model="form"
                  :options="FORMS"
                  size="small"
                  :aria-label="`Chart form for ${report.label}`"
                />
              </div>
              <MetricBreakdownTable
                v-if="isBreakdown"
                :report="report"
                :page-size="10"
              />
              <MetricPlot
                v-else
                :report="report"
                :form="form"
                :height="420"
              />
            </div>
          </PanelContent>
        </DialogContent>
      </DialogPortal>
    </Dialog>
  </ChartCard>
</template>

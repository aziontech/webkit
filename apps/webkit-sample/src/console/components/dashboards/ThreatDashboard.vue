<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Skeleton from '@aziontech/webkit/skeleton'
  import StatTile from '@aziontech/webkit/stat-tile'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import {
    resolveThreatFigures,
    resolveThreatReports,
    THREAT_ATTENTION
  } from '../../lib/data/dashboards/threats'
  import MetricReportCard from '../observability/MetricReportCard.vue'

  interface Props {
    period: string
    comparison: string
    loading?: boolean
    refetching?: boolean
    empty?: boolean
  }

  const props = withDefaults(defineProps<Props>(), {
    loading: false,
    refetching: false,
    empty: false
  })

  const activeIndex = ref<number | null>(null)

  const figures = computed(() => resolveThreatFigures(props.period, { empty: props.empty }))
  const reports = computed(() => resolveThreatReports(props.period, { empty: props.empty }))
  const timeline = computed(() => reports.value[0])
  const breakdowns = computed(() => reports.value.slice(1))
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
      <li
        v-for="figure in figures"
        :key="figure.id"
        class="flex min-w-0 flex-col"
      >
        <StatTile
          :label="figure.label"
          :value="empty ? null : figure.value"
          :format-value="figure.format"
          :delta="empty ? null : figure.delta"
          :delta-label="comparison"
          :inverse="figure.variation === 'inverse'"
          :trend="figure.trend"
          :loading="loading"
        >
          <template #aside>
            <Hint :text="figure.description" />
          </template>
        </StatTile>
      </li>
    </ul>

    <EmptyState
      v-if="empty && !loading"
      title="No firewall protects your workloads"
      description="Threat metrics and the Needs attention list appear once a firewall with a WAF rule set protects a workload."
      icon="pi pi-shield"
      bordered
    >
      <template #actions>
        <Button
          label="Add firewall"
          kind="primary"
          size="medium"
          icon="pi pi-plus"
          href="/firewall"
        />
      </template>
    </EmptyState>

    <div
      v-else
      class="grid grid-cols-1 gap-(--spacing-md) [--chart-grid-columns:1] lg:grid-cols-12 lg:[--chart-grid-columns:12]"
    >
      <MetricReportCard
        v-model:active-index="activeIndex"
        :report="timeline"
        :empty="empty"
        :loading="loading"
        :refetching="refetching"
      />

      <ChartCard :span="4">
        <ChartCard.Header>
          <span class="inline-flex min-w-0 items-center gap-(--spacing-xxs)">
            <ChartCard.Title>Needs attention</ChartCard.Title>
            <Hint text="Settings and traffic on your workloads that ask for a decision." />
          </span>
          <ChartCard.Controls>
            <Tag
              v-if="!loading && THREAT_ATTENTION.length"
              :label="`${THREAT_ATTENTION.length} open`"
              severity="secondary"
              size="small"
            />
          </ChartCard.Controls>
        </ChartCard.Header>

        <ChartCard.Content>
          <div
            v-if="loading"
            class="flex flex-col gap-(--spacing-md)"
          >
            <div
              v-for="row in 3"
              :key="row"
              class="flex flex-col gap-(--spacing-xs)"
            >
              <Skeleton
                width="60%"
                height="0.875rem"
              />
              <Skeleton
                width="90%"
                height="0.75rem"
              />
            </div>
          </div>

          <EmptyState
            v-else-if="!THREAT_ATTENTION.length"
            title="Nothing needs attention"
            description="Every firewall blocks what it logs and no workload shows a threat spike."
            icon="pi pi-check-circle"
            size="small"
          />

          <Item.List v-else>
            <Item
              v-for="entry in THREAT_ATTENTION"
              :key="entry.id"
              role="listitem"
              kind="inline"
              size="small"
            >
              <Item.Media>
                <i
                  :class="entry.icon"
                  class="text-body-sm leading-none text-(--text-muted)"
                  aria-hidden="true"
                />
              </Item.Media>
              <Item.Content>
                <Item.Title>{{ entry.title }}</Item.Title>
                <Item.Description>{{ entry.description }}</Item.Description>
                <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                  <Tag
                    :label="entry.tag"
                    :severity="entry.severity"
                    size="small"
                  />
                  <Link
                    :label="entry.action.label"
                    :href="entry.action.href"
                    size="small"
                    :show-icon="false"
                  />
                </span>
              </Item.Content>
            </Item>
          </Item.List>
        </ChartCard.Content>
      </ChartCard>

      <MetricReportCard
        v-for="report in breakdowns"
        :key="report.id"
        :report="report"
        :empty="empty"
        :loading="loading"
        :refetching="refetching"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import StatTile from '@aziontech/webkit/stat-tile'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  const fallbackPeriod = {
    value: '24h',
    label: 'Last 24 hours',
    comparison: 'vs previous 24 hours'
  }
  const periods = [
    { value: '1h', label: 'Last hour', comparison: 'vs previous hour' },
    fallbackPeriod,
    { value: '7d', label: 'Last 7 days', comparison: 'vs previous 7 days' },
    { value: '30d', label: 'Last 30 days', comparison: 'vs previous 30 days' }
  ]
  const period = ref(fallbackPeriod.value)
  const periodLabel = (value: string) => periods.find((entry) => entry.value === value)?.label ?? ''
  const currentPeriod = computed(
    () => periods.find((entry) => entry.value === period.value) ?? fallbackPeriod
  )
  const periodComparison = computed(() => currentPeriod.value.comparison)

  const { formatNumber } = useLocale()

  const compact = (value: number) =>
    formatNumber(value, { notation: 'compact', maximumFractionDigits: 1 })
  const formatCount = (value: number) => compact(value)
  const formatPercent = (value: number) => `${value.toFixed(value >= 10 ? 0 : 1)}%`
</script>

<template>
  <div class="layout-boundary">
    <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
      <PageHeader
        title="Security"
        description="Requests your rules blocked and inspected, and the settings that need a decision."
      >
        <template #actions>
          <Select
            v-model="period"
            size="medium"
            :display-value="periodLabel"
          >
            <Select.Trigger aria-label="Period" />
            <Select.Content>
              <Select.Option
                v-for="option in periods"
                :key="option.value"
                :value="option.value"
              >
                {{ option.label }}
              </Select.Option>
            </Select.Content>
          </Select>
        </template>
      </PageHeader>
      <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Requests blocked"
            :value="null"
            :format-value="formatCount"
            :delta-label="periodComparison"
            inverse
          >
            <template #aside>
              <Hint
                text="Requests a security rule identified as attacks and blocked before they reached a service."
              />
            </template>
          </StatTile>
        </li>
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Requests inspected"
            :value="null"
            :format-value="formatCount"
            :delta-label="periodComparison"
          >
            <template #aside>
              <Hint text="Requests checked against security rules across every service." />
            </template>
          </StatTile>
        </li>
        <li class="flex min-w-0 flex-col">
          <StatTile
            label="Block rate"
            :value="null"
            :format-value="formatPercent"
            :delta-label="periodComparison"
            inverse
          >
            <template #aside>
              <Hint text="Share of inspected requests blocked as attacks." />
            </template>
          </StatTile>
        </li>
      </ul>
      <EmptyState
        title="No security rules protect your services"
        description="Security metrics and the Needs attention list appear once a rule set protects a service."
        icon="ai ai-shield"
        bordered
      >
        <template #actions>
          <Button
            label="Add rule set"
            kind="primary"
            size="medium"
            icon="ai ai-plus"
            href="/security/rules"
          />
        </template>
      </EmptyState>
    </div>
  </div>
</template>

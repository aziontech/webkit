<script setup>
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import StatTile from '@aziontech/webkit/stat-tile'

  const compact = new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 })
  const formatCount = (value) => compact.format(value)
  const formatPercent = (value) => `${value.toFixed(value >= 10 ? 0 : 1)}%`
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <ul class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-3">
      <li class="flex min-w-0 flex-col">
        <StatTile
          label="Requests blocked"
          :value="null"
          :format-value="formatCount"
          delta-label="vs previous 24 hours"
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
          delta-label="vs previous 24 hours"
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
          delta-label="vs previous 24 hours"
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
      icon="pi pi-shield"
      bordered
    >
      <template #actions>
        <Button
          label="Add rule set"
          kind="primary"
          size="medium"
          icon="pi pi-plus"
          href="/security/rules"
        />
      </template>
    </EmptyState>
  </div>
</template>

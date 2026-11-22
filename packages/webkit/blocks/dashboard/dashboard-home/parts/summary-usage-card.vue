<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Link from '@aziontech/webkit/link'

  import { sampleSummaryUsage } from '../sample'

  const monthlyUsage = sampleSummaryUsage
</script>

<template>
  <Card title="Monthly usage">
    <template #default>
      <dl class="flex flex-col gap-(--spacing-sm)">
        <div
          v-for="usage in monthlyUsage"
          :key="usage.id"
          class="flex items-center justify-between gap-(--spacing-md)"
        >
          <dt class="min-w-0 truncate text-body-sm text-(--text-muted)">
            {{ usage.label }}
          </dt>
          <dd class="m-0 shrink-0 text-label-sm tabular-nums text-(--text-default)">
            {{ usage.value }}
          </dd>
        </div>
      </dl>
    </template>
    <template #footer>
      <Link
        label="View all usage"
        size="medium"
        href="#"
      />
    </template>
  </Card>
</template>

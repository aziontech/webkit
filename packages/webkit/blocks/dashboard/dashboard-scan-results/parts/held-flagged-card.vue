<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import Link from '@aziontech/webkit/link'
  import Skeleton from '@aziontech/webkit/skeleton'

  import type { ScanResultsSummary } from '../dashboard-scan-results.vue'

  export interface HeldFlaggedCardProps {
    /** The summary figures; null holds the skeleton. */
    summary: ScanResultsSummary | null
    /** The period is loading. */
    loading: boolean
    /** Why the period could not load; shows a danger alert with Retry. */
    error: string
    /** Writes a count. */
    formatCount: (value: number) => string
  }

  defineProps<HeldFlaggedCardProps>()

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()
</script>

<template>
  <div class="lg:col-span-4">
    <Card title="Held and flagged">
      <template #default>
        <Alert
          v-if="error"
          severity="danger"
          :label="`Couldn't load held and flagged submissions. ${error}`"
          action-label="Retry"
          @action="(event: MouseEvent) => emit('retry', event)"
        />
        <div
          v-else-if="loading || !summary"
          aria-busy="true"
          class="flex flex-col gap-(--spacing-sm)"
        >
          <Skeleton
            v-for="width in ['90%', '30%', '80%', '40%']"
            :key="width"
            :width="width"
            height="1rem"
          />
        </div>
        <div
          v-else
          class="flex flex-col gap-(--spacing-md)"
        >
          <div class="flex flex-col items-start gap-(--spacing-2xs)">
            <p class="text-pretty text-body-sm text-(--text-default)">
              {{ formatCount(summary.held) }} deliveries held for a verdict now,
              {{ formatCount(summary.heldLast24h) }} in the last 24 hours.
            </p>
            <Link
              label="Held deliveries"
              href="#held"
              size="small"
            />
          </div>
          <div class="flex flex-col items-start gap-(--spacing-2xs)">
            <p class="text-pretty text-body-sm text-(--text-default)">
              {{ formatCount(summary.alertsOpen) }} open alerts of
              {{ formatCount(summary.alertsTotal) }} for items delivered before they were flagged.
            </p>
            <Link
              label="Early delivery alerts"
              href="#alerts"
              size="small"
            />
          </div>
        </div>
      </template>
    </Card>
  </div>
</template>

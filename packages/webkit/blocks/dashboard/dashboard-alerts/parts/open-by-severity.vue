<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import SeverityTag from '@aziontech/webkit/severity-tag'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed } from 'vue'

  import type { AlertsDashboardLevelCount } from '../dashboard-alerts.vue'

  export interface OpenBySeverityProps {
    /** Open alerts by severity level. */
    levels: AlertsDashboardLevelCount[]
    /** The period is loading. */
    loading?: boolean
    /** Why the period could not load. */
    error?: string
  }

  const props = withDefaults(defineProps<OpenBySeverityProps>(), { loading: false, error: '' })

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()

  const openTotal = computed(() => props.levels.reduce((sum, level) => sum + level.count, 0))
</script>

<template>
  <div class="lg:col-span-4">
    <Card title="Open by severity">
      <template #default>
        <Alert
          v-if="error"
          severity="danger"
          :label="`Couldn't load open alerts by severity. ${error}`"
          action-label="Retry"
          @action="(event: MouseEvent) => emit('retry', event)"
        />
        <ul
          v-else-if="loading"
          aria-busy="true"
          class="flex flex-col gap-(--spacing-md)"
        >
          <li
            v-for="index in 5"
            :key="index"
            class="flex items-center justify-between gap-(--spacing-sm)"
          >
            <Skeleton
              width="30%"
              height="1.25rem"
            />
            <Skeleton
              width="20%"
              height="1rem"
            />
          </li>
        </ul>
        <ul
          v-else-if="levels.length"
          class="flex flex-col gap-(--spacing-md)"
        >
          <li
            v-for="level in levels"
            :key="level.id"
            class="flex items-center justify-between gap-(--spacing-sm)"
          >
            <SeverityTag :severity="level.id" />
            <span class="flex items-baseline gap-(--spacing-xs) tabular-nums">
              <span class="text-body-md text-(--text-default)">{{ level.count }}</span>
              <span class="w-10 text-end text-body-sm text-(--text-muted)"
                >{{ Math.round((level.count / openTotal) * 100) }}%</span
              >
            </span>
          </li>
        </ul>
        <EmptyState
          v-else
          size="small"
          icon="az az-circle-check"
          title="No open alerts"
          description="Every alert raised in the period has been closed."
        />
      </template>
    </Card>
  </div>
</template>

<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Progress from '@aziontech/webkit/progress'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'

  import type {
    ExecutiveSummaryDashboardFormat,
    ExecutiveSummaryDashboardGoal
  } from '../dashboard-executive-summary.vue'

  export interface GoalsCardProps {
    /** The quarter the goals belong to. */
    quarter: string
    /** The quarter goals. */
    goals: ExecutiveSummaryDashboardGoal[]
    /** Writes a figure in each format. */
    formatters: Record<ExecutiveSummaryDashboardFormat, (value: number) => string>
    /** The goals are loading. */
    loading: boolean
    /** Why the goals could not load. */
    error: string
  }

  defineProps<GoalsCardProps>()
</script>

<template>
  <Card :title="quarter + ' goals'">
    <template #default>
      <p
        v-if="error"
        class="text-body-sm text-(--text-muted)"
      >
        Not available.
      </p>
      <ul
        v-else-if="loading"
        aria-busy="true"
        class="flex flex-col gap-(--spacing-md)"
      >
        <li
          v-for="index in 5"
          :key="index"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <Skeleton
            width="60%"
            height="1rem"
          />
          <Skeleton height="0.5rem" />
          <Skeleton
            width="40%"
            height="0.75rem"
          />
        </li>
      </ul>
      <ul
        v-else-if="goals.length"
        class="flex flex-col gap-(--spacing-md)"
      >
        <li
          v-for="goal in goals"
          :key="goal.id"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <div class="flex min-w-0 items-center justify-between gap-(--spacing-sm)">
            <span class="truncate text-label-md text-(--text-default)">{{ goal.label }}</span>
            <Tag
              :label="goal.status.label"
              :severity="goal.status.severity"
              size="small"
            />
          </div>
          <Progress
            :value="goal.current"
            :max="goal.target"
            size="small"
            :severity="goal.status.severity"
            :aria-label="goal.label"
            :aria-valuetext="
              formatters[goal.format](goal.current) + ' of ' + formatters[goal.format](goal.target)
            "
          />
          <div
            class="flex items-center justify-between gap-(--spacing-sm) text-body-sm text-(--text-muted)"
          >
            <span
              class="tabular-nums"
              dir="auto"
            >
              {{ formatters[goal.format](goal.current) }} of
              {{ formatters[goal.format](goal.target) }}
            </span>
            <span
              class="tabular-nums"
              dir="ltr"
              >{{ Math.round((goal.current / goal.target) * 100) }}%</span
            >
          </div>
        </li>
      </ul>
      <EmptyState
        v-else
        size="small"
        icon="az az-flag"
        :title="'No goal results for ' + quarter"
        description="Progress appears once the quarter reports its first month."
      />
    </template>
  </Card>
</template>

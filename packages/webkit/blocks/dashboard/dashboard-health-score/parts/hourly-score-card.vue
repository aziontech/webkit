<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import ChartCard from '@aziontech/webkit/chart-card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Hint from '@aziontech/webkit/hint'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'
  import Tracker from '@aziontech/webkit/tracker'

  import type { HealthScoreHourlyRow } from '../dashboard-health-score.vue'

  export interface HourlyScoreCardProps {
    /** One tracker row per application. */
    hourly: HealthScoreHourlyRow[]
    /** The period is loading. */
    loading: boolean
    /** Why the period could not load. */
    error: string
    /** The period in words, for the empty state. */
    phrase: string
  }

  defineProps<HourlyScoreCardProps>()

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()
</script>

<template>
  <ChartCard :span="12">
    <ChartCard.Header>
      <span class="inline-flex min-w-0 items-center gap-(--spacing-2xs)">
        <ChartCard.Title>Hourly score</ChartCard.Title>
        <Hint content="One block per hour for each application, colored by its band." />
      </span>
    </ChartCard.Header>
    <ChartCard.Content>
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load hourly score. ${error}`"
        action-label="Retry"
        @action="(event) => emit('retry', event)"
      />
      <ul
        v-else-if="loading"
        aria-busy="true"
        class="flex flex-col gap-(--spacing-sm)"
      >
        <li
          v-for="index in 4"
          :key="index"
          class="grid grid-cols-1 items-center gap-(--spacing-xs) md:grid-cols-[minmax(0,9rem)_1fr_4rem] md:gap-(--spacing-md)"
        >
          <Skeleton
            width="70%"
            height="1rem"
          />
          <Tracker
            :items="[]"
            loading
          />
          <Skeleton
            width="3rem"
            height="1.25rem"
          />
        </li>
      </ul>
      <ul
        v-else-if="hourly.length"
        class="flex flex-col gap-(--spacing-sm)"
      >
        <li
          v-for="application in hourly"
          :key="application.id"
          class="grid grid-cols-1 items-center gap-(--spacing-xs) md:grid-cols-[minmax(0,9rem)_1fr_4rem] md:gap-(--spacing-md)"
        >
          <span class="truncate text-label-md text-(--text-default)">{{ application.name }}</span>
          <Tracker
            :items="application.blocks"
            :aria-label="application.name + ', score per hour'"
          />
          <span class="flex md:justify-end">
            <Tag
              :label="application.band.label"
              :severity="application.band.severity"
              size="small"
            />
          </span>
        </li>
      </ul>
      <EmptyState
        v-else
        size="small"
        icon="az az-chart-bar"
        :title="'No samples in ' + phrase"
        description="Each application gets a row once its first sample arrives. Select a longer period."
      />
    </ChartCard.Content>
  </ChartCard>
</template>

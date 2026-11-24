<script setup lang="ts">
  import EmptyState from '@aziontech/webkit/empty-state'
  import Timeline, { type TimelineItemSeverity } from '@aziontech/webkit/timeline'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed } from 'vue'

  import type { DetailCustomerEvent, DetailCustomerEventType } from '../detail-customer.vue'

  export interface CustomerActivityTabProps {
    /** The account activity, newest first. */
    activity: DetailCustomerEvent[]
    /** The customer's name, for the list's accessible name. */
    name?: string
    /** Placeholder items stand in for the activity. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<CustomerActivityTabProps>(), {
    name: '',
    loading: false
  })

  const markers: Record<DetailCustomerEventType, { icon: string; severity: TimelineItemSeverity }> =
    {
      joined: { icon: 'az az-user-plus', severity: 'info' },
      created: { icon: 'az az-ticket', severity: 'neutral' },
      replied: { icon: 'az az-reply', severity: 'neutral' },
      rated: { icon: 'az az-star', severity: 'warning' },
      merged: { icon: 'az az-git-merge', severity: 'info' },
      solved: { icon: 'az az-circle-check', severity: 'success' }
    }

  const { formatDate } = useLocale()

  const days = computed(() => {
    const groups: { label: string; events: DetailCustomerEvent[] }[] = []
    for (const event of props.activity) {
      const label = formatDate(event.at, { dateStyle: 'long' })
      const last = groups.at(-1)
      if (last?.label === label) last.events.push(event)
      else groups.push({ label, events: [event] })
    }
    return groups
  })
</script>

<template>
  <EmptyState
    v-if="!loading && !activity.length"
    size="small"
    icon="az az-history"
    title="No activity yet"
    description="Tickets, replies and ratings show here as they happen."
  />
  <Timeline
    v-else
    :loading="loading"
    time-format="relative"
    :aria-label="name ? `Activity of ${name}` : 'Activity'"
  >
    <Timeline.Group
      v-for="day in days"
      :key="day.label"
      :label="day.label"
    >
      <Timeline.Item
        v-for="event in day.events"
        :key="event.id"
        :title="event.title"
        :description="event.description"
        :actor="event.actor"
        :time="event.at"
        :icon="markers[event.type].icon"
        :severity="markers[event.type].severity"
      />
    </Timeline.Group>
  </Timeline>
</template>

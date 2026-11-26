<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Timeline from '@aziontech/ui/timeline'
  import { computed } from 'vue'

  import type { DetailTicketActivity } from '../detail-ticket.vue'
  import { activityDays } from '../lib/ticket-fields'

  export interface TicketActivityProps {
    /** The ticket's activity, newest first. */
    activity: DetailTicketActivity[]
    /** The ticket is loading. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<TicketActivityProps>(), { loading: false })

  const days = computed(() => activityDays(props.activity))
</script>

<template>
  <Card title="Activity">
    <Timeline
      size="small"
      time-format="relative"
      aria-label="Ticket activity"
      :loading="loading"
    >
      <Timeline.Group
        v-for="day in days"
        :key="day.label"
        :label="day.label"
      >
        <Timeline.Item
          v-for="entry in day.items"
          :key="entry.id"
          :title="entry.title"
          :actor="entry.actor"
          :time="entry.time"
          :severity="entry.severity"
          :icon="entry.icon"
        />
      </Timeline.Group>
    </Timeline>
  </Card>
</template>

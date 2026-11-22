<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Tag from '@aziontech/webkit/tag'

  import type { HealthScoreIncident } from '../dashboard-health-score.vue'

  export interface OpenIncidentsCardProps {
    /** The incidents still open. */
    incidents: HealthScoreIncident[]
    /** The period is loading. */
    loading: boolean
    /** Why the period could not load. */
    error: string
    /** The period in words, for the empty state. */
    phrase: string
  }

  defineProps<OpenIncidentsCardProps>()

  const emit = defineEmits<{ retry: [event: MouseEvent] }>()
</script>

<template>
  <Card
    title="Open incidents"
    :padded="error !== ''"
  >
    <template #default>
      <Alert
        v-if="error"
        severity="danger"
        :label="`Couldn't load open incidents. ${error}`"
        action-label="Retry"
        @action="(event) => emit('retry', event)"
      />
      <Item.List
        v-else-if="loading"
        key="item.list-1"
        aria-busy="true"
      >
        <Item
          v-for="index in 3"
          :key="index"
          size="small"
          role="listitem"
        >
          <Item.Media>
            <Skeleton
              variant="rectangle"
              width="2rem"
              height="2rem"
            />
          </Item.Media>
          <Item.Content>
            <div class="flex flex-col gap-(--spacing-xs)">
              <Skeleton
                width="30%"
                height="1rem"
              />
              <Skeleton
                width="55%"
                height="0.75rem"
              />
            </div>
          </Item.Content>
        </Item>
      </Item.List>
      <Item.List
        key="item.list-2"
        v-else-if="incidents.length"
      >
        <Item
          v-for="incident in incidents"
          :key="incident.id"
          :href="`/incidents/${incident.id}`"
          size="small"
        >
          <Item.Media type="icon">
            <i
              :class="incident.icon"
              aria-hidden="true"
            />
          </Item.Media>
          <Item.Content>
            <Item.Title>{{ incident.name }} · {{ incident.cause }}</Item.Title>
            <Item.Description>
              {{ incident.scope }} · {{ incident.devices }} devices, {{ incident.share }}% of
              samples · Opened
              <time :datetime="incident.opened">{{ incident.openedLabel }}</time>
            </Item.Description>
          </Item.Content>
          <Item.Actions>
            <Tag
              :label="incident.band.label"
              :severity="incident.band.severity"
              size="small"
            />
          </Item.Actions>
        </Item>
      </Item.List>
      <div
        v-else
        class="p-(--spacing-md)"
      >
        <EmptyState
          size="small"
          icon="az az-circle-check"
          :title="'No open incidents in ' + phrase"
          description="An incident opens when an application or a location stays poor for several samples in a row."
        />
      </div>
    </template>
  </Card>
</template>

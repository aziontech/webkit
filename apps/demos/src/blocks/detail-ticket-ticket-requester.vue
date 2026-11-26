<script setup lang="ts">
  import Avatar from '@aziontech/ui/avatar'
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import Skeleton from '@aziontech/ui/skeleton'
  import { computed } from 'vue'

  import type { DetailTicketRequester } from './detail-ticket.vue'

  export interface TicketRequesterProps {
    /** The customer who asked; absent while the ticket loads. */
    requester?: DetailTicketRequester
    /** The ticket is loading. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<TicketRequesterProps>(), {
    requester: undefined,
    loading: false
  })

  const emit = defineEmits<{
    open: [event: MouseEvent, requester: DetailTicketRequester]
  }>()

  const others = computed(() => {
    const count = props.requester?.otherTickets ?? 0
    if (!count) return 'No other tickets'
    return `${count} other ${count === 1 ? 'ticket' : 'tickets'}`
  })
</script>

<template>
  <Card title="Requester">
    <div
      v-if="!requester && loading"
      class="flex items-center gap-(--spacing-sm)"
      aria-hidden="true"
    >
      <Skeleton
        variant="circle"
        width="2rem"
        height="2rem"
      />
      <div class="flex grow flex-col gap-(--spacing-2xs)">
        <Skeleton width="60%" />
        <Skeleton width="80%" />
      </div>
    </div>
    <div
      v-else-if="requester"
      class="flex min-w-0 flex-col gap-(--spacing-sm)"
    >
      <div class="flex min-w-0 items-center gap-(--spacing-sm)">
        <Avatar
          :label="requester.name"
          size="medium"
          aria-hidden="true"
          class="shrink-0"
        />
        <div class="flex min-w-0 flex-col">
          <bdi class="truncate text-label-md text-(--text-default)">{{ requester.name }}</bdi>
          <span
            class="truncate text-body-sm text-(--text-muted)"
            dir="ltr"
            >{{ requester.email }}</span
          >
        </div>
      </div>
      <p class="flex flex-wrap gap-x-(--spacing-sm) text-body-sm text-(--text-muted)">
        <bdi>{{ requester.organization }}</bdi>
        <span>{{ others }}</span>
      </p>
      <Button
        label="View customer profile"
        variant="link"
        size="small"
        class="self-start"
        @click="(event: MouseEvent) => emit('open', event, requester!)"
      />
    </div>
  </Card>
</template>

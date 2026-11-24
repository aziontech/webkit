<script setup lang="ts">
  import MessageThread from '@aziontech/webkit/message-thread'
  import Subheader from '@aziontech/webkit/subheader'
  import { computed } from 'vue'

  import type { DetailTicketMessage } from '../detail-ticket.vue'
  import TicketMessage from './ticket-message.vue'

  export interface TicketConversationProps {
    /** The conversation, oldest first. */
    messages: DetailTicketMessage[]
    /** Ticket number, read in the list's name. */
    ticketId: string
    /** The conversation is loading. */
    loading?: boolean
  }

  const props = withDefaults(defineProps<TicketConversationProps>(), { loading: false })

  const COLLAPSE_AFTER = 8
  const KEEP_FIRST = 2
  const KEEP_LAST = 3

  const collapsed = computed(() => props.messages.length > COLLAPSE_AFTER)
  const head = computed(() =>
    collapsed.value ? props.messages.slice(0, KEEP_FIRST) : props.messages
  )
  const earlier = computed(() =>
    collapsed.value ? props.messages.slice(KEEP_FIRST, -KEEP_LAST) : []
  )
  const latest = computed(() => (collapsed.value ? props.messages.slice(-KEEP_LAST) : []))
  const label = computed(() =>
    props.ticketId ? `Ticket ${props.ticketId} conversation` : 'Conversation'
  )
</script>

<template>
  <section class="flex min-w-0 flex-col gap-(--layout-group-gap)">
    <Subheader title="Conversation" />
    <MessageThread
      :aria-label="label"
      :loading="loading"
    >
      <TicketMessage
        v-for="message in head"
        :key="message.id"
        :message="message"
      />
      <MessageThread.Group
        v-if="earlier.length"
        :count="earlier.length"
      >
        <TicketMessage
          v-for="message in earlier"
          :key="message.id"
          :message="message"
        />
      </MessageThread.Group>
      <TicketMessage
        v-for="message in latest"
        :key="message.id"
        :message="message"
      />
    </MessageThread>
  </section>
</template>

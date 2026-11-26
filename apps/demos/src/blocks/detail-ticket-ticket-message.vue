<script setup lang="ts">
  import FileTokenGroup from '@aziontech/ui/file-token-group'
  import MessageThreadItem from '@aziontech/ui/message-thread-item'
  import { computed } from 'vue'

  import type { DetailTicketMessage } from './detail-ticket.vue'

  export interface TicketMessageProps {
    /** The conversation item. */
    message: DetailTicketMessage
  }

  const props = defineProps<TicketMessageProps>()

  const files = computed(() => props.message.attachments.map((file) => ({ file })))
</script>

<template>
  <MessageThreadItem
    :type="message.type"
    :author="message.author"
    :from="message.from"
    :channel="message.channel || undefined"
    :timestamp="message.sentAt"
    :to="message.to"
    :cc="message.cc"
  >
    {{ message.body }}
    <template
      v-if="files.length"
      #attachments
    >
      <FileTokenGroup
        :items="files"
        orientation="horizontal"
        readonly
      />
    </template>
    <template
      v-if="message.quoted"
      #quoted
      >{{ message.quoted }}</template
    >
  </MessageThreadItem>
</template>

<script setup>
  import MessageThread from '@aziontech/ui/message-thread'
  import { ref } from 'vue'

  const quotedOpen = ref(false)
  const quoted =
    'On Nov 20, 2026, Jane Doe wrote:\nCould you confirm the domain you want to move?\n\nOn Nov 19, 2026, Alex Morgan wrote:\nI want to move my domain to Acme.'
</script>

<template>
  <MessageThread aria-label="Ticket 4120 conversation">
    <MessageThread.Item
      v-model:quoted-open="quotedOpen"
      author="Alex Morgan"
      channel="email"
      timestamp="2026-11-21T07:50:00Z"
      :to="['support@example.com']"
      :cc="['priya.patel@example.com', 'sam.lee@example.com']"
    >
      Yes, it is app.example.com.
      <template #quoted>{{ quoted }}</template>
    </MessageThread.Item>
  </MessageThread>
</template>

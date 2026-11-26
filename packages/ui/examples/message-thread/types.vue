<script setup>
  import MessageThread from '@aziontech/ui/message-thread'
</script>

<template>
  <MessageThread aria-label="Ticket 2187 conversation">
    <MessageThread.Item
      type="reply"
      author="Priya Patel"
      from="customer"
      channel="chat"
      timestamp="2026-11-21T14:05:00Z"
    >
      My site returns a 502 error since this morning.
    </MessageThread.Item>
    <MessageThread.Item
      type="note"
      author="John Smith"
      from="agent"
      timestamp="2026-11-21T14:09:00Z"
    >
      The origin for acme-store is timing out. Escalating to the networking team.
    </MessageThread.Item>
    <MessageThread.Item
      type="event"
      timestamp="2026-11-21T14:10:00Z"
    >
      John Smith assigned the ticket to Networking
    </MessageThread.Item>
  </MessageThread>
</template>

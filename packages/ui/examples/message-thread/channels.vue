<script setup>
  import MessageThread from '@aziontech/ui/message-thread'
</script>

<template>
  <MessageThread aria-label="Messages by channel">
    <MessageThread.Item
      author="Alex Morgan"
      channel="email"
      timestamp="2026-11-19T08:00:00Z"
      :to="['support@example.com']"
    >
      Sent by email.
    </MessageThread.Item>
    <MessageThread.Item
      author="Sam Lee"
      channel="chat"
      timestamp="2026-11-19T09:00:00Z"
    >
      Sent from the chat on example.com.
    </MessageThread.Item>
    <MessageThread.Item
      author="Jane Doe"
      from="agent"
      channel="phone"
      timestamp="2026-11-19T10:00:00Z"
    >
      Call summary: the customer confirmed the new billing address.
    </MessageThread.Item>
    <MessageThread.Item
      author="Priya Patel"
      channel="web"
      timestamp="2026-11-19T11:00:00Z"
    >
      Sent from the contact form at example.com/support.
    </MessageThread.Item>
    <MessageThread.Item
      author="Acme Monitoring"
      channel="api"
      timestamp="2026-11-19T12:00:00Z"
    >
      Created through the API by the monitoring integration.
    </MessageThread.Item>
  </MessageThread>
</template>

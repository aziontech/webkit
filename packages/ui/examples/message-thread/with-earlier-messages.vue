<script setup>
  import MessageThread from '@aziontech/ui/message-thread'

  const earlier = [
    {
      id: 'm3',
      author: 'Jane Doe',
      from: 'agent',
      time: '2026-11-17T10:00:00Z',
      text: 'Could you send the request ID from the error page?'
    },
    {
      id: 'm4',
      author: 'Alex Morgan',
      from: 'customer',
      time: '2026-11-17T11:20:00Z',
      text: 'Sure, it is 7f3a-91c2.'
    },
    {
      id: 'm5',
      author: 'Jane Doe',
      from: 'agent',
      time: '2026-11-17T12:05:00Z',
      text: 'Thanks. I can see the timeouts on our side too.'
    },
    {
      id: 'm6',
      author: 'Alex Morgan',
      from: 'customer',
      time: '2026-11-18T08:45:00Z',
      text: 'Any update? Checkout is still slow.'
    },
    {
      id: 'm7',
      author: 'Jane Doe',
      from: 'agent',
      time: '2026-11-18T09:30:00Z',
      text: 'We are rolling out a fix to the affected edge locations.'
    },
    {
      id: 'm8',
      author: 'Alex Morgan',
      from: 'customer',
      time: '2026-11-18T15:10:00Z',
      text: 'Thanks for the quick work.'
    }
  ]
</script>

<template>
  <MessageThread aria-label="Ticket 3051 conversation">
    <MessageThread.Item
      author="Alex Morgan"
      channel="web"
      timestamp="2026-11-17T08:30:00Z"
    >
      Checkout on acme-store returns a timeout for some customers.
    </MessageThread.Item>
    <MessageThread.Item
      author="Jane Doe"
      from="agent"
      channel="email"
      timestamp="2026-11-17T09:15:00Z"
      :to="['alex.morgan@example.com']"
    >
      Thanks, Alex. I am looking into it now.
    </MessageThread.Item>
    <MessageThread.Group :count="earlier.length">
      <MessageThread.Item
        v-for="message in earlier"
        :key="message.id"
        :author="message.author"
        :from="message.from"
        channel="email"
        :timestamp="message.time"
      >
        {{ message.text }}
      </MessageThread.Item>
    </MessageThread.Group>
    <MessageThread.Item
      type="event"
      timestamp="2026-11-19T09:00:00Z"
    >
      Jane Doe changed status to Solved
    </MessageThread.Item>
    <MessageThread.Item
      author="Jane Doe"
      from="agent"
      channel="email"
      timestamp="2026-11-19T09:01:00Z"
      :to="['alex.morgan@example.com']"
    >
      The fix is live everywhere. Let us know if checkout slows down again.
    </MessageThread.Item>
  </MessageThread>
</template>

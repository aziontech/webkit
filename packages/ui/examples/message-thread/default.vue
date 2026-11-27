<script setup>
  import DropdownMenu from '@aziontech/ui/dropdown-menu'
  import FileTokenGroup from '@aziontech/ui/file-token-group'
  import IconButton from '@aziontech/ui/icon-button'
  import MessageThread from '@aziontech/ui/message-thread'

  const attachments = [{ file: { name: 'invoice-1042.pdf', size: 84000, type: 'application/pdf' } }]
  const body =
    'Hi, I was charged twice for the November invoice. Can you refund one of the payments?\n\nThanks,\nAlex'
  const quoted = 'On Nov 18, 2026, Acme Billing wrote:\nYour invoice 1042 for $49.00 is ready.'
</script>

<template>
  <MessageThread aria-label="Ticket 1042 conversation">
    <MessageThread.Item
      author="Alex Morgan"
      from="customer"
      channel="email"
      timestamp="2026-11-20T09:12:00Z"
      :to="['support@example.com']"
      :cc="['sam.lee@example.com']"
    >
      {{ body }}
      <template #attachments>
        <FileTokenGroup
          :items="attachments"
          orientation="horizontal"
          readonly
        />
      </template>
      <template #quoted>{{ quoted }}</template>
    </MessageThread.Item>
    <MessageThread.Item
      type="event"
      timestamp="2026-11-20T09:40:00Z"
    >
      Jane Doe changed status to Pending
    </MessageThread.Item>
    <MessageThread.Item
      author="Jane Doe"
      from="agent"
      channel="email"
      timestamp="2026-11-20T10:02:00Z"
      :to="['alex.morgan@example.com']"
    >
      Hi Alex, thanks for letting us know. The refund for the second payment is on its way and will
      reach your card in 5 to 10 business days.
      <template #actions>
        <IconButton
          icon="az az-reply"
          variant="ghost"
          size="small"
          aria-label="Reply"
        />
        <DropdownMenu>
          <DropdownMenu.Trigger>
            <IconButton
              icon="az az-ellipsis"
              variant="ghost"
              size="small"
              aria-label="More actions"
            />
          </DropdownMenu.Trigger>
          <DropdownMenu.Group>
            <DropdownMenu.Item
              value="forward"
              label="Forward"
            />
            <DropdownMenu.Item
              value="copy-link"
              label="Copy link"
            />
          </DropdownMenu.Group>
        </DropdownMenu>
      </template>
    </MessageThread.Item>
  </MessageThread>
</template>

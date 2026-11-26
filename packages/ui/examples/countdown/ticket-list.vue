<script setup>
  import ConfigProvider from '@aziontech/ui/config-provider'
  import Countdown from '@aziontech/ui/countdown'
  import Table from '@aziontech/ui/table'

  const NOW = Date.UTC(2026, 10, 24, 14, 45)

  const tickets = [
    {
      id: '4812',
      subject: 'Custom domain returns a certificate error',
      requester: 'Jane Doe',
      due: '2026-11-24T14:30:00Z',
      paused: false
    },
    {
      id: '4815',
      subject: 'Cache purge does not reach every edge location',
      requester: 'John Smith',
      due: '2026-11-24T15:20:00Z',
      paused: false
    },
    {
      id: '4818',
      subject: 'Invoice shows the wrong billing address',
      requester: 'Priya Patel',
      due: '2026-11-24T19:00:00Z',
      paused: true
    },
    {
      id: '4821',
      subject: 'Add a teammate to the Acme account',
      requester: 'Alex Morgan',
      due: '2026-11-25T16:00:00Z',
      paused: false
    }
  ]
</script>

<template>
  <ConfigProvider :now="NOW">
    <Table bordered>
      <Table.Header>
        <Table.Row>
          <Table.HeadCell principal>Subject</Table.HeadCell>
          <Table.HeadCell>First reply</Table.HeadCell>
          <Table.HeadCell>Requester</Table.HeadCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        <Table.Row
          v-for="ticket in tickets"
          :key="ticket.id"
        >
          <Table.Cell principal
            ><span class="min-w-0 flex-1 truncate">{{ ticket.subject }}</span></Table.Cell
          >
          <Table.Cell>
            <Countdown
              :deadline="ticket.due"
              :paused="ticket.paused"
              size="small"
            />
          </Table.Cell>
          <Table.Cell
            ><span class="min-w-0 flex-1 truncate">{{ ticket.requester }}</span></Table.Cell
          >
        </Table.Row>
      </Table.Body>
    </Table>
  </ConfigProvider>
</template>

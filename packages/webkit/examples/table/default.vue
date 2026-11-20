<script setup>
  import Table from '@aziontech/webkit/table'

  const items = [
    { id: '1001', name: 'Workload Alpha', status: 'Active', editor: 'user1@example.com' },
    { id: '1002', name: 'Workload Bravo', status: 'Inactive', editor: 'user2@example.com' },
    { id: '1003', name: 'Workload Charlie', status: 'Degraded', editor: 'user3@example.com' },
    { id: '1004', name: 'Workload Delta', status: 'Active', editor: 'user4@example.com' },
    { id: '1005', name: 'Workload Echo', status: 'Inactive', editor: 'user5@example.com' }
  ]
</script>

<template>
  <Table bordered>
    <Table.Header>
      <Table.Row>
        <Table.HeadCell principal>Name</Table.HeadCell>
        <Table.HeadCell>Status</Table.HeadCell>
        <Table.HeadCell>Last Editor</Table.HeadCell>
      </Table.Row>
    </Table.Header>
    <Table.Body>
      <Table.Row
        v-for="item in items"
        :key="item.id"
      >
        <Table.Cell principal
          ><span class="min-w-0 flex-1 truncate">{{ item.name }}</span></Table.Cell
        >
        <Table.Cell
          ><span class="min-w-0 flex-1 truncate">{{ item.status }}</span></Table.Cell
        >
        <Table.Cell
          ><span class="min-w-0 flex-1 truncate">{{ item.editor }}</span></Table.Cell
        >
      </Table.Row>
    </Table.Body>
  </Table>
</template>

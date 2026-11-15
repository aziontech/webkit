<script setup>
  import DataGrid from '@aziontech/webkit/data-grid'
  import { ref } from 'vue'

  const rows = ref([
    { id: '1', name: 'Acme Inc.', plan: 'business', seats: 12, active: true },
    { id: '2', name: 'Jane Doe', plan: 'free', seats: 1, active: true },
    { id: '3', name: 'John Smith', plan: 'pro', seats: 3, active: false },
    { id: '4', name: 'Priya Patel', plan: 'pro', seats: 5, active: true },
    { id: '5', name: 'Sam Lee', plan: 'free', seats: 1, active: false }
  ])

  const columns = [
    { id: 'name', header: 'Name', type: 'text', width: 200 },
    {
      id: 'plan',
      header: 'Plan',
      type: 'select',
      options: [
        { label: 'Free', value: 'free' },
        { label: 'Pro', value: 'pro' },
        { label: 'Business', value: 'business' }
      ]
    },
    { id: 'seats', header: 'Seats', type: 'number', align: 'end', width: 120 },
    { id: 'active', header: 'Active', type: 'boolean', width: 120 },
    { id: 'id', header: 'ID', editable: false, width: 96 }
  ]
</script>

<template>
  <DataGrid
    v-model="rows"
    :columns="columns"
    aria-label="Customers"
    frozen-first-column
  />
</template>

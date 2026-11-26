<script setup>
  import FilterMenu from '@aziontech/ui/filter-menu'
  import { ref } from 'vue'

  const fields = [
    {
      id: 'owner',
      label: 'Author',
      options: [
        { value: 'jane', label: 'Jane Doe', avatar: '' },
        { value: 'john', label: 'John Smith', avatar: '' },
        { value: 'priya', label: 'Priya Patel', avatar: '' }
      ]
    },
    {
      id: 'status',
      label: 'Status',
      type: 'single',
      options: [
        { value: 'live', label: 'Live' },
        { value: 'inactive', label: 'Inactive' }
      ]
    },
    { id: 'modified', label: 'Last modified', type: 'date' }
  ]

  const filters = ref({ owner: ['jane', 'priya'] })
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <FilterMenu
      v-model="filters"
      :fields="fields"
    />
    <FilterMenu.ChipGroup
      v-model="filters"
      :fields="fields"
    />
  </div>
</template>

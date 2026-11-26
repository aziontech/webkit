<script setup>
  import FilterMenu from '@aziontech/ui/filter-menu-root'
  import { ref } from 'vue'

  const fields = [
    {
      id: 'status',
      label: 'Status',
      options: [
        { value: 'live', label: 'Live' },
        { value: 'inactive', label: 'Inactive' }
      ]
    }
  ]

  const small = ref({ status: ['live'] })
  const medium = ref({ status: ['live'] })
  const large = ref({ status: ['live'] })
</script>

<template>
  <div class="flex flex-wrap items-center gap-(--spacing-md)">
    <FilterMenu
      v-model="small"
      :fields="fields"
      size="small"
    />
    <FilterMenu
      v-model="medium"
      :fields="fields"
      size="medium"
    />
    <FilterMenu
      v-model="large"
      :fields="fields"
      size="large"
    />
  </div>
</template>

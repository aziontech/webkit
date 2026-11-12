<script setup>
  import PickList from '@aziontech/webkit/pick-list'
  import { ref } from 'vue'

  const model = ref([
    [
      { id: 1, label: 'Edge Functions' },
      { id: 2, label: 'WAF' },
      { id: 3, label: 'Image Processor' }
    ],
    [{ id: 4, label: 'Cache' }]
  ])
</script>

<template>
  <PickList
    v-model="model"
    data-key="id"
  >
    <PickList.Source title="Available">
      <template #item="{ item }">{{ item.label }}</template>
    </PickList.Source>

    <PickList.Controls />

    <PickList.Target title="Selected">
      <template #item="{ item }">{{ item.label }}</template>
    </PickList.Target>
  </PickList>
</template>

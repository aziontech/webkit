<script setup>
  import TransferList from '@aziontech/webkit/transfer-list'
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
  <TransferList
    v-model="model"
    track-by="id"
    disabled
  >
    <TransferList.Source title="Available">
      <template #item="{ item }">{{ item.label }}</template>
    </TransferList.Source>

    <TransferList.Controls />

    <TransferList.Target title="Selected">
      <template #item="{ item }">{{ item.label }}</template>
    </TransferList.Target>
  </TransferList>
</template>

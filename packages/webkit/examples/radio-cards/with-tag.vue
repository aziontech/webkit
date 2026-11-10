<script setup>
  import RadioCards from '@aziontech/webkit/radio-cards'
  import Tag from '@aziontech/webkit/tag'
  import { ref } from 'vue'

  const items = [
    {
      value: 'hobby',
      icon: 'pi pi-sparkles',
      label: 'Hobby',
      description: 'For learning and small personal projects.',
      ariaLabel: 'Hobby plan',
      tag: 'Hobby Plan'
    },
    {
      value: 'pro',
      icon: 'pi pi-chart-line',
      label: 'Pro',
      description: 'For professional or commercial applications.',
      ariaLabel: 'Pro plan',
      tag: 'Pro Plan'
    },
    {
      value: 'scale',
      icon: 'pi pi-file-check',
      label: 'Scale',
      description: 'For businesses requiring advanced security and compliance.',
      ariaLabel: 'Scale plan',
      tag: 'Scale Plan'
    }
  ]
  const selected = ref('hobby')
</script>

<template>
  <RadioCards
    v-model="selected"
    :items="items"
  >
    <template #tag="{ item }">
      <Tag
        :label="item.tag"
        severity="info"
      />
    </template>
  </RadioCards>
</template>

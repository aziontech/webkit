<script setup>
  import BoxGridSelection from '@aziontech/webkit/box-grid-selection'
  import { ref } from 'vue'

  const items = [
    {
      value: 'option1',
      icon: 'pi pi-check',
      label: 'Option One',
      description: 'First option description'
    },
    {
      value: 'option2',
      icon: 'pi pi-times',
      label: 'Option Two',
      description: 'Second option description'
    },
    {
      value: 'option3',
      icon: 'pi pi-star',
      label: 'Option Three',
      description: 'Third option description'
    }
  ]
  const selected = ref('option1')
</script>

<template>
  <BoxGridSelection
    v-model="selected"
    :items="items"
  />
</template>

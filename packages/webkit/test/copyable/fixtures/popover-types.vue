<script setup lang="ts">
  import Popover, { type PopoverAlign, type PopoverSide } from '@aziontech/webkit/popover'
  import { ref } from 'vue'

  const side: PopoverSide = 'end'
  const sides: (PopoverSide | 'auto')[] = ['auto', 'start', 'top', side]
  const align: PopoverAlign = 'end'
  const open = ref(false)
  const lastOpen = ref<boolean>(false)
  const record = (value: boolean): void => {
    lastOpen.value = value
  }
  const label = (text: string): string => text.trim()
</script>

<template>
  <Popover
    v-for="item in sides"
    :key="item"
    v-model:open="open"
    :side="item"
    :align="align"
  >
    <Popover.Trigger><button type="button">Open</button></Popover.Trigger>
    <Popover.Content>{{ item }}</Popover.Content>
  </Popover>

  <Popover
    side="start"
    @update:open="(value) => record(value)"
  >
    <Popover.Trigger><button type="button">Left</button></Popover.Trigger>
  </Popover>

  <!-- @vue-expect-error update:open carries a boolean, not a string -->
  <Popover @update:open="(value) => label(value)" />

  <!-- @vue-expect-error left is not a side: sides are logical -->
  <Popover side="left" />
</template>

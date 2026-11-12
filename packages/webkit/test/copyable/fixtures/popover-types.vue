<script setup lang="ts">
  import Popover, {
    type PopoverPlacement,
    type PopoverPlacementInput
  } from '@aziontech/webkit/popover'
  import { ref } from 'vue'

  const side: PopoverPlacement = 'right-start'
  const placements: PopoverPlacementInput[] = ['auto', 'left-end', 'top', side]
  const open = ref(false)
  const lastOpen = ref<boolean>(false)
  const record = (value: boolean): void => {
    lastOpen.value = value
  }
  const label = (text: string): string => text.trim()
</script>

<template>
  <Popover
    v-for="placement in placements"
    :key="placement"
    v-model:open="open"
    :placement="placement"
  >
    <Popover.Trigger><button type="button">Open</button></Popover.Trigger>
    <Popover.Content>{{ placement }}</Popover.Content>
  </Popover>

  <Popover
    placement="left"
    @update:open="(value) => record(value)"
  >
    <Popover.Trigger><button type="button">Left</button></Popover.Trigger>
  </Popover>

  <!-- @vue-expect-error update:open carries a boolean, not a string -->
  <Popover @update:open="(value) => label(value)" />

  <!-- @vue-expect-error center is not a placement -->
  <Popover placement="center" />
</template>

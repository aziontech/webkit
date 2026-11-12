<script setup lang="ts">
  import Drawer from '@aziontech/webkit/drawer'
  import { ref } from 'vue'

  const open = ref<boolean>(false)
  const onOpen = (value: boolean | undefined): void => {
    open.value = value === true
  }
</script>

<template>
  <Drawer
    :open="open"
    @update:open="onOpen"
  />
  <Drawer v-model:open="open" />
  <!-- @vue-expect-error update:open sends a boolean -->
  <Drawer @update:open="(value: string) => value.trim()" />
</template>

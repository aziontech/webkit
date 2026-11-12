<script setup lang="ts">
  import Command from '@aziontech/webkit/command'
  import Dialog from '@aziontech/webkit/dialog'
  import Drawer from '@aziontech/webkit/drawer'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Menu from '@aziontech/webkit/menu'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  const open = ref<boolean>(false)
  const lastOpen = ref<boolean>(false)
  const onOpen = (value: boolean): void => {
    lastOpen.value = value
  }
  const label = (text: string): string => text.trim()
</script>

<template>
  <Dialog
    :open="open"
    @update:open="onOpen"
  />
  <Dialog v-model:open="open" />
  <Drawer
    :open="open"
    @update:open="onOpen"
  />
  <Drawer v-model:open="open" />
  <Tooltip
    text="Hint"
    @update:open="onOpen"
  >
    <button type="button">Hint</button>
  </Tooltip>
  <Tooltip
    v-model:open="open"
    text="Hint"
  />
  <Command
    :open="open"
    @update:open="(value) => onOpen(value)"
  />
  <Command v-model:open="open" />
  <DropdownMenu @update:open="onOpen" />
  <DropdownMenu v-model:open="open" />
  <Menu>
    <Menu.Sub @update:open="onOpen" />
    <Menu.Sub v-model:open="open" />
  </Menu>

  <!-- @vue-expect-error update:open sends a boolean -->
  <Dialog @update:open="(value) => label(value)" />
  <!-- @vue-expect-error update:open sends a boolean -->
  <Drawer @update:open="(value: string) => value.trim()" />
  <!-- @vue-expect-error update:open sends a boolean -->
  <Tooltip
    text="Hint"
    @update:open="(value) => label(value)"
  />
  <!-- @vue-expect-error update:open sends a boolean -->
  <Command @update:open="(value) => label(value)" />
  <!-- @vue-expect-error update:open sends a boolean -->
  <DropdownMenu @update:open="(value) => label(value)" />
  <!-- @vue-expect-error update:open sends a boolean -->
  <Menu.Sub @update:open="(value) => label(value)" />
</template>

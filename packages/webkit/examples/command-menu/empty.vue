<script setup>
  import { ref } from 'vue'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import CommandMenuInput from '@aziontech/webkit/command-menu-input'
  import CommandMenuList from '@aziontech/webkit/command-menu-list'
  import CommandMenuEmpty from '@aziontech/webkit/command-menu-empty'
  import Button from '@aziontech/webkit/button'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open empty palette"
    kind="primary"
    @click="open = true"
  />

  <CommandMenu
    v-model:open="open"
    shortcut=""
  >
    <CommandMenuInput placeholder="Search commands…" />
    <CommandMenuList>
      <CommandMenuEmpty>No commands found.</CommandMenuEmpty>
    </CommandMenuList>
  </CommandMenu>
</template>

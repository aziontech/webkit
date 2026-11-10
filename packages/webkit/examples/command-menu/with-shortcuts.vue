<script setup>
  import { ref } from 'vue'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import CommandMenuInput from '@aziontech/webkit/command-menu-input'
  import CommandMenuList from '@aziontech/webkit/command-menu-list'
  import CommandMenuGroup from '@aziontech/webkit/command-menu-group'
  import CommandMenuItem from '@aziontech/webkit/command-menu-item'
  import Button from '@aziontech/webkit/button'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open palette with shortcuts"
    kind="primary"
    @click="open = true"
  />

  <CommandMenu
    v-model:open="open"
    shortcut=""
  >
    <CommandMenuInput placeholder="Search commands…" />
    <CommandMenuList>
      <CommandMenuGroup heading="Actions">
        <CommandMenuItem
          value="command-menu"
          shortcut="meta+k"
          >Open Command Menu</CommandMenuItem
        >
        <CommandMenuItem
          value="command-palette"
          shortcut="meta+shift+p"
          >Open Command Palette</CommandMenuItem
        >
        <CommandMenuItem
          value="close"
          shortcut="esc"
          >Close Overlay</CommandMenuItem
        >
      </CommandMenuGroup>
    </CommandMenuList>
  </CommandMenu>
</template>

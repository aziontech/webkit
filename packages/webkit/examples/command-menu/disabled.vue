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
    label="Open palette with a disabled item"
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
        <CommandMenuItem value="deploy">Deploy Project</CommandMenuItem>
        <CommandMenuItem
          value="publish"
          disabled
          >Publish Release</CommandMenuItem
        >
        <CommandMenuItem value="new-app">Create Application</CommandMenuItem>
      </CommandMenuGroup>
    </CommandMenuList>
  </CommandMenu>
</template>

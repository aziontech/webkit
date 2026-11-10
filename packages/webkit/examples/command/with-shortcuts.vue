<script setup>
  import { ref } from 'vue'
  import Command from '@aziontech/webkit/command'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandItem from '@aziontech/webkit/command-item'
  import Button from '@aziontech/webkit/button'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open palette with shortcuts"
    kind="primary"
    @click="open = true"
  />

  <Command
    v-model:open="open"
    shortcut=""
  >
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup heading="Actions">
        <CommandItem
          value="command"
          shortcut="meta+k"
          >Open Command Menu</CommandItem
        >
        <CommandItem
          value="command-palette"
          shortcut="meta+shift+p"
          >Open Command Palette</CommandItem
        >
        <CommandItem
          value="close"
          shortcut="esc"
          >Close Overlay</CommandItem
        >
      </CommandGroup>
    </CommandList>
  </Command>
</template>

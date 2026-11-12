<script setup>
  import Button from '@aziontech/webkit/button'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandRoot from '@aziontech/webkit/command-root'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open palette with shortcuts"
    kind="primary"
    @click="open = true"
  />

  <CommandRoot
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
  </CommandRoot>
</template>

<script setup>
  import Button from '@aziontech/ui/button'
  import CommandEmpty from '@aziontech/ui/command-empty'
  import CommandGroup from '@aziontech/ui/command-group'
  import CommandInput from '@aziontech/ui/command-input'
  import CommandItem from '@aziontech/ui/command-item'
  import CommandList from '@aziontech/ui/command-list'
  import CommandRoot from '@aziontech/ui/command-root'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open palette with shortcuts"
    variant="primary"
    @click="open = true"
  />

  <CommandRoot
    v-model:open="open"
    shortcut=""
  >
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup label="Actions">
        <CommandItem
          value="command"
          shortcut="meta+k"
          >Open command menu</CommandItem
        >
        <CommandItem
          value="command-palette"
          shortcut="meta+shift+p"
          >Open command palette</CommandItem
        >
        <CommandItem
          value="close"
          shortcut="esc"
          >Close overlay</CommandItem
        >
      </CommandGroup>
      <CommandEmpty />
    </CommandList>
  </CommandRoot>
</template>

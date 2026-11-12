<script setup>
  import Button from '@aziontech/webkit/button'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import Command from '@aziontech/webkit/command-root'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open palette with a disabled item"
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
        <CommandItem value="deploy">Deploy Project</CommandItem>
        <CommandItem
          value="publish"
          disabled
          >Publish Release</CommandItem
        >
        <CommandItem value="new-app">Create Application</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>

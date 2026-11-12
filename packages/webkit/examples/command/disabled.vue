<script setup>
  import { ref } from 'vue'
  import CommandRoot from '@aziontech/webkit/command-root'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandItem from '@aziontech/webkit/command-item'
  import Button from '@aziontech/webkit/button'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open palette with a disabled item"
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
        <CommandItem value="deploy">Deploy Project</CommandItem>
        <CommandItem
          value="publish"
          disabled
          >Publish Release</CommandItem
        >
        <CommandItem value="new-app">Create Application</CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandRoot>
</template>

<script setup>
  import CommandRoot from '@aziontech/webkit/command-root'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import SearchTrigger from '@aziontech/webkit/search-trigger'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <SearchTrigger @open="open = true" />

  <CommandRoot
    v-model:open="open"
    shortcut="meta+k"
  >
    <CommandInput placeholder="Search commands…" />
    <CommandList>
      <CommandGroup heading="Suggestions">
        <CommandItem value="deploy">Deploy Project</CommandItem>
        <CommandItem value="new-app">Create Application</CommandItem>
        <CommandItem value="settings">Go to Settings</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Commands">
        <CommandItem
          value="search"
          shortcut="meta+k"
          >Search everything</CommandItem
        >
        <CommandItem
          value="new-app-cmd"
          shortcut="meta+n"
          >New Application</CommandItem
        >
        <CommandItem
          value="toggle-theme"
          shortcut="meta+shift+l"
          >Toggle Theme</CommandItem
        >
      </CommandGroup>
    </CommandList>
  </CommandRoot>
</template>

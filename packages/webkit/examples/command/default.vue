<script setup>
  import CommandEmpty from '@aziontech/webkit/command-empty'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandRoot from '@aziontech/webkit/command-root'
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
      <CommandGroup label="Suggestions">
        <CommandItem value="deploy">Deploy project</CommandItem>
        <CommandItem value="new-app">Create application</CommandItem>
        <CommandItem value="settings">Go to settings</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup label="Commands">
        <CommandItem
          value="search"
          shortcut="meta+k"
          >Search everything</CommandItem
        >
        <CommandItem
          value="new-app-cmd"
          shortcut="meta+n"
          >New application</CommandItem
        >
        <CommandItem
          value="toggle-theme"
          shortcut="meta+shift+l"
          >Toggle theme</CommandItem
        >
      </CommandGroup>
      <CommandEmpty />
    </CommandList>
  </CommandRoot>
</template>

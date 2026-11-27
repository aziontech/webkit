<script setup>
  import CommandEmpty from '@aziontech/ui/command-empty'
  import CommandGroup from '@aziontech/ui/command-group'
  import CommandInput from '@aziontech/ui/command-input'
  import CommandItem from '@aziontech/ui/command-item'
  import CommandList from '@aziontech/ui/command-list'
  import CommandRoot from '@aziontech/ui/command-root'
  import CommandSeparator from '@aziontech/ui/command-separator'
  import SearchTrigger from '@aziontech/ui/search-trigger'
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

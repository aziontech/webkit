<script setup>
  import { ref } from 'vue'
  import Command from '@aziontech/webkit/command'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import Input from '@aziontech/webkit/input'
  import Kbd from '@aziontech/webkit/kbd'

  const open = ref(false)
</script>

<template>
  <Input
    model-value=""
    placeholder="Search…"
    size="large"
    readonly
    aria-keyshortcuts="Meta+K"
    class="max-w-[360px] cursor-pointer"
    @click="open = true"
    @keydown.enter="open = true"
  >
    <template #iconLeft>
      <span
        class="pi pi-search"
        aria-hidden="true"
      />
    </template>
    <template #iconRight>
      <Kbd
        meta
        size="small"
        >K</Kbd
      >
    </template>
  </Input>

  <Command
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
          >Search Everything</CommandItem
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
  </Command>
</template>

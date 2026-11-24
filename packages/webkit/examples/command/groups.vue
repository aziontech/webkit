<script setup>
  import Button from '@aziontech/webkit/button'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import CommandRoot from '@aziontech/webkit/command-root'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open grouped palette"
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
        <CommandItem value="deploy">
          <template #leading
            ><i
              class="az az-cloud-upload"
              aria-hidden="true"
          /></template>
          Deploy project
        </CommandItem>
        <CommandItem value="new-app">Create application</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup label="Navigation">
        <CommandItem value="settings">
          <template #leading
            ><i
              class="az az-settings"
              aria-hidden="true"
          /></template>
          Go to settings
        </CommandItem>
        <CommandItem value="billing">Go to billing</CommandItem>
      </CommandGroup>
      <CommandGroup label="Account">
        <CommandItem value="profile">
          <template #leading
            ><i
              class="az az-user"
              aria-hidden="true"
          /></template>
          View profile
        </CommandItem>
        <CommandItem value="logout">Log out</CommandItem>
      </CommandGroup>
    </CommandList>
  </CommandRoot>
</template>

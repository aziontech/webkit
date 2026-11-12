<script setup>
  import Button from '@aziontech/webkit/button'
  import CommandGroup from '@aziontech/webkit/command-group'
  import CommandInput from '@aziontech/webkit/command-input'
  import CommandItem from '@aziontech/webkit/command-item'
  import CommandList from '@aziontech/webkit/command-list'
  import Command from '@aziontech/webkit/command-root'
  import CommandSeparator from '@aziontech/webkit/command-separator'
  import { ref } from 'vue'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open grouped palette"
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
        <CommandItem value="deploy">
          <template #prefix
            ><i
              class="pi pi-cloud-upload"
              aria-hidden="true"
          /></template>
          Deploy Project
        </CommandItem>
        <CommandItem value="new-app">Create Application</CommandItem>
      </CommandGroup>
      <CommandSeparator />
      <CommandGroup heading="Navigation">
        <CommandItem value="settings">
          <template #prefix
            ><i
              class="pi pi-cog"
              aria-hidden="true"
          /></template>
          Go to Settings
        </CommandItem>
        <CommandItem value="billing">Go to Billing</CommandItem>
      </CommandGroup>
      <CommandGroup heading="Account">
        <CommandItem value="profile">
          <template #prefix
            ><i
              class="pi pi-user"
              aria-hidden="true"
          /></template>
          View Profile
        </CommandItem>
        <CommandItem value="logout">Log Out</CommandItem>
      </CommandGroup>
    </CommandList>
  </Command>
</template>

<script setup>
  import { ref } from 'vue'
  import CommandMenu from '@aziontech/webkit/command-menu'
  import CommandMenuInput from '@aziontech/webkit/command-menu-input'
  import CommandMenuList from '@aziontech/webkit/command-menu-list'
  import CommandMenuGroup from '@aziontech/webkit/command-menu-group'
  import CommandMenuItem from '@aziontech/webkit/command-menu-item'
  import CommandMenuSeparator from '@aziontech/webkit/command-menu-separator'
  import Button from '@aziontech/webkit/button'

  const open = ref(false)
</script>

<template>
  <Button
    label="Open grouped palette"
    kind="primary"
    @click="open = true"
  />

  <CommandMenu
    v-model:open="open"
    shortcut=""
  >
    <CommandMenuInput placeholder="Search commands…" />
    <CommandMenuList>
      <CommandMenuGroup heading="Actions">
        <CommandMenuItem value="deploy">
          <template #prefix
            ><i
              class="pi pi-cloud-upload"
              aria-hidden="true"
          /></template>
          Deploy Project
        </CommandMenuItem>
        <CommandMenuItem value="new-app">Create Application</CommandMenuItem>
      </CommandMenuGroup>
      <CommandMenuSeparator />
      <CommandMenuGroup heading="Navigation">
        <CommandMenuItem value="settings">
          <template #prefix
            ><i
              class="pi pi-cog"
              aria-hidden="true"
          /></template>
          Go to Settings
        </CommandMenuItem>
        <CommandMenuItem value="billing">Go to Billing</CommandMenuItem>
      </CommandMenuGroup>
      <CommandMenuGroup heading="Account">
        <CommandMenuItem value="profile">
          <template #prefix
            ><i
              class="pi pi-user"
              aria-hidden="true"
          /></template>
          View Profile
        </CommandMenuItem>
        <CommandMenuItem value="logout">Log Out</CommandMenuItem>
      </CommandMenuGroup>
    </CommandMenuList>
  </CommandMenu>
</template>

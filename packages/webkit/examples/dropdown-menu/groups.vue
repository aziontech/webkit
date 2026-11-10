<script setup>
  import DropdownMenu, {
    DropdownMenuGroup,
    DropdownMenuOption,
    DropdownMenuTrigger
  } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenu>
    <DropdownMenuTrigger>
      <IconButton
        kind="outlined"
        icon="pi pi-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup label="Account">
      <DropdownMenuOption
        value="profile"
        label="Profile"
        command="⌘P"
      />
      <DropdownMenuOption
        value="settings"
        label="Settings"
      />
    </DropdownMenuGroup>
    <DropdownMenuGroup label="Workspace">
      <DropdownMenuOption
        value="invite"
        label="Invite members"
      />
      <DropdownMenuOption
        value="logs"
        label="Audit log"
        selected
      />
    </DropdownMenuGroup>
  </DropdownMenu>
</template>

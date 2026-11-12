<script setup>
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
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

<script setup>
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <IconButton
        variant="outline"
        icon="ai ai-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup label="Account">
      <DropdownMenuItem
        value="profile"
        label="Profile"
        command="⌘P"
      />
      <DropdownMenuItem
        value="settings"
        label="Settings"
      />
    </DropdownMenuGroup>
    <DropdownMenuGroup label="Workspace">
      <DropdownMenuItem
        value="invite"
        label="Invite members"
      />
      <DropdownMenuItem
        value="logs"
        label="Audit log"
        selected
      />
    </DropdownMenuGroup>
  </DropdownMenuRoot>
</template>

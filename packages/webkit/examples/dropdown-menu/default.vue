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
        kind="outlined"
        icon="ai ai-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuItem
        value="profile"
        label="Profile"
      />
      <DropdownMenuItem
        value="settings"
        label="Settings"
      />
      <DropdownMenuItem
        value="billing"
        label="Billing"
      />
      <DropdownMenuItem
        value="invite"
        label="Invite members"
      />
      <DropdownMenuItem
        value="logs"
        label="Audit log"
      />
      <DropdownMenuItem
        value="signout"
        label="Sign out"
      />
    </DropdownMenuGroup>
  </DropdownMenuRoot>
</template>

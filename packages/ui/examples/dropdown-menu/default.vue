<script setup>
  import DropdownMenuGroup from '@aziontech/ui/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/ui/dropdown-menu-item'
  import DropdownMenuRoot from '@aziontech/ui/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/ui/dropdown-menu-trigger'
  import IconButton from '@aziontech/ui/icon-button'
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <IconButton
        variant="outline"
        icon="az az-user"
        aria-label="Account menu"
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

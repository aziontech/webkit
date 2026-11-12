<script setup>
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot>
    <DropdownMenuTrigger>
      <IconButton
        kind="outlined"
        icon="pi pi-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>
    <DropdownMenuGroup>
      <DropdownMenuOption
        value="profile"
        label="Profile"
      />
      <DropdownMenuOption
        value="settings"
        label="Settings"
      />
      <DropdownMenuOption
        value="billing"
        label="Billing"
      />
      <DropdownMenuOption
        value="invite"
        label="Invite members"
      />
      <DropdownMenuOption
        value="logs"
        label="Audit log"
      />
      <DropdownMenuOption
        value="signout"
        label="Sign out"
      />
    </DropdownMenuGroup>
  </DropdownMenuRoot>
</template>

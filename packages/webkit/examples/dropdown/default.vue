<script setup>
  import Dropdown, {
    DropdownGroup,
    DropdownOption,
    DropdownTrigger
  } from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <Dropdown>
    <DropdownTrigger>
      <IconButton
        kind="outlined"
        icon="pi pi-plus"
        aria-label="Open menu"
      />
    </DropdownTrigger>
    <DropdownGroup>
      <DropdownOption
        value="profile"
        label="Profile"
      />
      <DropdownOption
        value="settings"
        label="Settings"
      />
      <DropdownOption
        value="billing"
        label="Billing"
      />
      <DropdownOption
        value="invite"
        label="Invite members"
      />
      <DropdownOption
        value="logs"
        label="Audit log"
      />
      <DropdownOption
        value="signout"
        label="Sign out"
      />
    </DropdownGroup>
  </Dropdown>
</template>

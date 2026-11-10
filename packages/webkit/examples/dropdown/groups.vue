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
    <DropdownGroup label="Account">
      <DropdownOption
        value="profile"
        label="Profile"
        command="⌘P"
      />
      <DropdownOption
        value="settings"
        label="Settings"
      />
    </DropdownGroup>
    <DropdownGroup label="Workspace">
      <DropdownOption
        value="invite"
        label="Invite members"
      />
      <DropdownOption
        value="logs"
        label="Audit log"
        selected
      />
    </DropdownGroup>
  </Dropdown>
</template>

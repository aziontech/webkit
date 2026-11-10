<script setup>
  import Dropdown, {
    DropdownGroup,
    DropdownOption,
    DropdownTrigger
  } from '@aziontech/webkit/dropdown'
  import Avatar from '@aziontech/webkit/avatar'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <div class="flex flex-wrap gap-(--spacing-lg) items-center">
    <Dropdown>
      <DropdownTrigger>
        <IconButton
          icon="pi pi-ellipsis-h"
          aria-label="More actions"
        />
      </DropdownTrigger>
      <DropdownGroup>
        <DropdownOption
          value="edit"
          label="Edit"
        />
        <DropdownOption
          value="duplicate"
          label="Duplicate"
        />
        <DropdownOption
          value="delete"
          label="Delete"
        />
      </DropdownGroup>
    </Dropdown>

    <Dropdown>
      <DropdownTrigger>
        <Avatar
          label="IB"
          aria-label="Account menu"
          class="cursor-pointer"
        />
      </DropdownTrigger>
      <DropdownGroup label="Account">
        <DropdownOption
          value="profile"
          label="Profile"
        />
        <DropdownOption
          value="settings"
          label="Settings"
        />
        <DropdownOption
          value="signout"
          label="Sign out"
        />
      </DropdownGroup>
    </Dropdown>
  </div>
</template>

<script setup>
  import DropdownMenu, {
    DropdownMenuGroup,
    DropdownMenuOption,
    DropdownMenuTrigger
  } from '@aziontech/webkit/dropdown-menu'
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
</script>

<template>
  <DropdownMenu :open="true">
    <DropdownMenuTrigger>
      <IconButton
        kind="outlined"
        icon="pi pi-plus"
        aria-label="Open menu"
      />
    </DropdownMenuTrigger>

    <template #top>
      <div class="p-(--spacing-xxs)">
        <Input
          placeholder="Search options…"
          size="small"
        />
      </div>
    </template>

    <DropdownMenuGroup label="Suggestions">
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
    </DropdownMenuGroup>

    <template #bottom>
      <div class="flex justify-end p-(--spacing-xxs)">
        <Button
          kind="text"
          size="small"
          label="View all"
        />
      </div>
    </template>
  </DropdownMenu>
</template>

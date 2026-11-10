<script setup>
  import DropdownMenu, {
    DropdownMenuGroup,
    DropdownMenuOption,
    DropdownMenuTrigger
  } from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
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
    <DropdownMenuGroup label="Option states">
      <DropdownMenuOption
        value="default"
        label="Default"
      />
      <DropdownMenuOption
        value="selected"
        label="Selected"
        selected
      />
      <DropdownMenuOption
        value="disabled"
        label="Disabled"
        disabled
      />
    </DropdownMenuGroup>
  </DropdownMenu>
</template>

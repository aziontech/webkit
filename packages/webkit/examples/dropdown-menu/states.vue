<script setup>
  import DropdownMenuRoot from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuOption from '@aziontech/webkit/dropdown-menu-option'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <DropdownMenuRoot :open="true">
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
  </DropdownMenuRoot>
</template>

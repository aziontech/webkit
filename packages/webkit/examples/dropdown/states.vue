<script setup>
  import Dropdown, {
    DropdownGroup,
    DropdownOption,
    DropdownTrigger
  } from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
</script>

<template>
  <Dropdown :open="true">
    <DropdownTrigger>
      <IconButton
        kind="outlined"
        icon="pi pi-plus"
        aria-label="Open menu"
      />
    </DropdownTrigger>
    <DropdownGroup label="Option states">
      <DropdownOption
        value="default"
        label="Default"
      />
      <DropdownOption
        value="selected"
        label="Selected"
        selected
      />
      <DropdownOption
        value="disabled"
        label="Disabled"
        disabled
      />
    </DropdownGroup>
  </Dropdown>
</template>

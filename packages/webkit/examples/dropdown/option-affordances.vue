<script setup>
  import Dropdown, {
    DropdownGroup,
    DropdownOption,
    DropdownTrigger
  } from '@aziontech/webkit/dropdown'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
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
    <DropdownGroup label="Affordances">
      <DropdownOption
        value="plain"
        label="Plain label"
      />
      <DropdownOption
        value="command"
        label="With command hint"
        command="⌘P"
      />
      <DropdownOption value="left">
        <template #left>
          <i
            class="pi pi-user"
            aria-hidden="true"
          />
        </template>
        Left icon
      </DropdownOption>
      <DropdownOption
        value="right"
        label="Right slot"
      >
        <template #right>
          <Tag label="New" />
        </template>
      </DropdownOption>
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

<script setup>
  import Dropdown, {
    DropdownGroup,
    DropdownOption,
    DropdownTrigger
  } from '@aziontech/webkit/dropdown'
  import Button from '@aziontech/webkit/button'
  import IconButton from '@aziontech/webkit/icon-button'
  import InputText from '@aziontech/webkit/input-text'
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

    <template #top>
      <div class="p-(--spacing-xxs)">
        <InputText
          placeholder="Search options…"
          size="small"
        />
      </div>
    </template>

    <DropdownGroup label="Suggestions">
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
    </DropdownGroup>

    <template #bottom>
      <div class="flex justify-end p-(--spacing-xxs)">
        <Button
          kind="text"
          size="small"
          label="View all"
        />
      </div>
    </template>
  </Dropdown>
</template>

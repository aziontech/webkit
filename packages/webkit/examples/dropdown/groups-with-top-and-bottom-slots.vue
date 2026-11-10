<script setup>
  import Dropdown, {
    DropdownGroup,
    DropdownOption,
    DropdownTrigger
  } from '@aziontech/webkit/dropdown'
  import Button from '@aziontech/webkit/button'
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

    <DropdownGroup label="Account">
      <template #top>
        <span class="text-label-sm text-(--text-muted)">Signed in as jordan.silva@example.com</span>
      </template>

      <DropdownOption
        value="profile"
        label="Profile"
        command="⌘P"
      />
      <DropdownOption
        value="settings"
        label="Settings"
      />

      <template #bottom>
        <Button
          kind="text"
          size="small"
          label="Manage account"
          class="w-full"
        />
      </template>
    </DropdownGroup>

    <DropdownGroup label="Workspace">
      <template #top>
        <span class="text-label-sm text-(--text-muted)">Azion · 12 members</span>
      </template>

      <DropdownOption
        value="invite"
        label="Invite members"
      />
      <DropdownOption
        value="logs"
        label="Audit log"
      />

      <template #bottom>
        <Button
          kind="text"
          size="small"
          label="Workspace settings"
          class="w-full"
        />
      </template>
    </DropdownGroup>
  </Dropdown>
</template>

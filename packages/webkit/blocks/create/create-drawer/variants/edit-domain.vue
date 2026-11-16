<script setup lang="ts">
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot, {
    type DropdownMenuItemValue
  } from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'

  import CreateDrawer from '../create-drawer.vue'

  const onRowAction = (value: DropdownMenuItemValue, open: () => void) => {
    if (value === 'edit') open()
  }
</script>

<template>
  <CreateDrawer
    title="Edit Domain"
    description="Change where it answers, the address, or the certificate it is served with."
    submit-label="Save Domain"
    :default-values="{
      kind: 'own',
      domain: 'www.example.com',
      environment: 'Production',
      certificate: 'cert-8801'
    }"
  >
    <template #trigger="{ open }">
      <DropdownMenuRoot
        placement="bottom-end"
        @select="(_event, value) => onRowAction(value, open)"
      >
        <DropdownMenuTrigger>
          <Tooltip content="Row actions">
            <IconButton
              icon="ai ai-ellipsis"
              variant="outline"
              size="small"
              aria-label="Actions for www.example.com"
            />
          </Tooltip>
        </DropdownMenuTrigger>
        <DropdownMenuGroup>
          <DropdownMenuItem
            value="edit"
            label="Edit"
          >
            <template #leading
              ><i
                class="ai ai-pencil"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem
            value="delete"
            label="Delete"
          >
            <template #leading
              ><i
                class="ai ai-trash"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuRoot>
    </template>
  </CreateDrawer>
</template>

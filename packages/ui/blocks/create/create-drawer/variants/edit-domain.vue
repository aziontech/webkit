<script setup lang="ts">
  import DropdownMenuGroup from '@aziontech/ui/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/ui/dropdown-menu-item'
  import DropdownMenuRoot, { type DropdownMenuItemValue } from '@aziontech/ui/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/ui/dropdown-menu-trigger'
  import IconButton from '@aziontech/ui/icon-button'
  import Tooltip from '@aziontech/ui/tooltip'

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
        side="bottom"
        align="end"
        @select="(_event, value) => onRowAction(value, open)"
      >
        <DropdownMenuTrigger>
          <Tooltip content="Row actions">
            <IconButton
              icon="az az-ellipsis"
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
                class="az az-pencil"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuGroup>
          <DropdownMenuItem
            value="delete"
            label="Delete"
            severity="danger"
          >
            <template #leading
              ><i
                class="az az-trash"
                aria-hidden="true"
            /></template>
          </DropdownMenuItem>
        </DropdownMenuGroup>
      </DropdownMenuRoot>
    </template>
  </CreateDrawer>
</template>

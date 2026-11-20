<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import DropdownMenuGroup from '@aziontech/webkit/dropdown-menu-group'
  import DropdownMenuItem from '@aziontech/webkit/dropdown-menu-item'
  import DropdownMenuRoot, {
    type DropdownMenuItemValue
  } from '@aziontech/webkit/dropdown-menu-root'
  import DropdownMenuTrigger from '@aziontech/webkit/dropdown-menu-trigger'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  import CreateDrawer from '../create-drawer.vue'
  import { sampleConnectedEnvironments } from '../sample'

  const ADD_ENVIRONMENT = '__add-environment__'
  const selectedEnvironment = ref('Production')
  const onSelect = (value: DropdownMenuItemValue, open: () => void) => {
    if (typeof value !== 'string') return
    if (value === ADD_ENVIRONMENT) {
      open()
      return
    }
    selectedEnvironment.value = value
  }
</script>

<template>
  <CreateDrawer title="Add Environment">
    <template #trigger="{ open }">
      <Tooltip
        content="Select an environment to see its deployment and settings, or add another one"
      >
        <DropdownMenuRoot
          side="bottom"
          align="end"
          @select="(_event, value) => onSelect(value, open)"
        >
          <DropdownMenuTrigger>
            <Button
              :label="selectedEnvironment"
              variant="outline"
              size="medium"
              icon="az az-chevron-down"
              icon-position="trailing"
            />
          </DropdownMenuTrigger>
          <DropdownMenuGroup label="Environments">
            <DropdownMenuItem
              v-for="name in sampleConnectedEnvironments"
              :key="name"
              :value="name"
              :label="name"
              :selected="name === selectedEnvironment"
            />
          </DropdownMenuGroup>
          <DropdownMenuGroup>
            <DropdownMenuItem
              :value="ADD_ENVIRONMENT"
              label="Add Environment"
            >
              <template #leading
                ><i
                  class="az az-plus"
                  aria-hidden="true"
              /></template>
            </DropdownMenuItem>
          </DropdownMenuGroup>
        </DropdownMenuRoot>
      </Tooltip>
    </template>
  </CreateDrawer>
</template>

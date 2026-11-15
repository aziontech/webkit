<script setup>
  import Button from '@aziontech/webkit/button'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import { reactive, ref } from 'vue'

  const columns = reactive({ status: true, region: true, updated: false })
  const density = ref('comfortable')

  const onSelect = (event, value) => {
    if (value in columns) columns[value] = !columns[value]
    else density.value = String(value)
  }
</script>

<template>
  <DropdownMenu
    :open="true"
    @select="onSelect"
  >
    <DropdownMenu.Trigger>
      <Button
        kind="secondary"
        icon="pi pi-sliders-h"
        label="View"
      />
    </DropdownMenu.Trigger>

    <DropdownMenu.Group label="Columns">
      <DropdownMenu.Item
        value="status"
        label="Status"
        kind="checkbox"
        :selected="columns.status"
      />
      <DropdownMenu.Item
        value="region"
        label="Region"
        kind="checkbox"
        :selected="columns.region"
      />
      <DropdownMenu.Item
        value="updated"
        label="Last updated"
        kind="checkbox"
        :selected="columns.updated"
      />
    </DropdownMenu.Group>

    <DropdownMenu.Group label="Density">
      <DropdownMenu.Item
        value="comfortable"
        label="Comfortable"
        kind="radio"
        :selected="density === 'comfortable'"
      />
      <DropdownMenu.Item
        value="compact"
        label="Compact"
        kind="radio"
        :selected="density === 'compact'"
      />
    </DropdownMenu.Group>
  </DropdownMenu>
</template>

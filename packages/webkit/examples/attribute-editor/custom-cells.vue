<script setup>
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Select from '@aziontech/webkit/select'
  import Switch from '@aziontech/webkit/switch'
  import { ref } from 'vue'

  const definition = [
    { key: 'name', label: 'Header', placeholder: 'X-Request-Id' },
    { key: 'action', label: 'Action' },
    { key: 'enabled', label: 'Enabled' }
  ]

  const actions = [
    { value: 'set', label: 'Set' },
    { value: 'append', label: 'Append' },
    { value: 'remove', label: 'Remove' }
  ]

  const items = ref([
    { name: 'Cache-Control', action: 'set', enabled: true },
    { name: 'X-Frame-Options', action: 'set', enabled: false }
  ])

  const newItem = () => ({ name: '', action: 'set', enabled: true })
</script>

<template>
  <AttributeEditor
    v-model:items="items"
    :definition="definition"
    :new-item="newItem"
    add-button-label="Add header"
    remove-button-label="Remove header"
    aria-label="Response headers"
  >
    <template #cell-action="{ value, update }">
      <Select
        :model-value="value"
        size="medium"
        @update:model-value="update"
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Option
            v-for="action in actions"
            :key="action.value"
            :value="action.value"
            >{{ action.label }}</Select.Option
          >
        </Select.Content>
      </Select>
    </template>
    <template #cell-enabled="{ value, update }">
      <div class="flex h-8 items-center">
        <Switch
          :model-value="Boolean(value)"
          @update:model-value="update"
        />
      </div>
    </template>
  </AttributeEditor>
</template>

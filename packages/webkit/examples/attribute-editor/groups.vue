<script setup>
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Select from '@aziontech/webkit/select'
  import { ref } from 'vue'

  const definition = [
    { key: 'variable', label: 'Variable' },
    { key: 'operator', label: 'Operator' },
    { key: 'argument', label: 'Argument', placeholder: '/api/' }
  ]

  const operators = [
    { value: 'is-equal', label: 'is equal' },
    { value: 'starts-with', label: 'starts with' },
    { value: 'matches', label: 'matches' }
  ]

  const groups = ref([
    [
      { variable: '${uri}', operator: 'starts-with', argument: '/api/' },
      { variable: '${request_method}', operator: 'is-equal', argument: 'POST' }
    ],
    [{ variable: '${host}', operator: 'is-equal', argument: 'admin.example.com' }]
  ])

  const newItem = () => ({ variable: '${uri}', operator: 'is-equal', argument: '' })
</script>

<template>
  <AttributeEditor
    v-model:groups="groups"
    :definition="definition"
    :new-item="newItem"
    :limit="10"
    :group-limit="5"
    :min-items="1"
    add-button-label="Add condition"
    add-group-label="Add OR group"
    remove-button-label="Remove condition"
    aria-label="Criteria"
  >
    <template #cell-operator="{ value, update }">
      <Select
        :model-value="value"
        size="medium"
        @update:model-value="update"
      >
        <Select.Trigger />
        <Select.Content>
          <Select.Option
            v-for="operator in operators"
            :key="operator.value"
            :value="operator.value"
            >{{ operator.label }}</Select.Option
          >
        </Select.Content>
      </Select>
    </template>
  </AttributeEditor>
</template>

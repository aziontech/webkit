<script setup lang="ts">
  import AttributeEditor, {
    type AttributeEditorCellScope,
    type AttributeEditorColumn
  } from '@aziontech/webkit/attribute-editor'
  import Input from '@aziontech/webkit/input'
  import { ref } from 'vue'

  interface Variable {
    key: string
    value: string
    secret: boolean
    ttl: number
  }

  const variables = ref<Variable[]>([{ key: 'API_URL', value: '', secret: false, ttl: 60 }])
  const criteria = ref<Variable[][]>([[{ key: 'host', value: '', secret: false, ttl: 0 }]])
  const definition: AttributeEditorColumn[] = [
    { key: 'key', label: 'Key' },
    { key: 'value', label: 'Value' },
    { key: 'secret', label: 'Secret' }
  ]
  const plainDefinition = [{ key: 'name', label: 'Name', required: true }]
  const newVariable = (): Variable => ({ key: '', value: '', secret: false, ttl: 60 })
  const setSecret = (on: boolean): boolean => on
  const describe = (scope: AttributeEditorCellScope<Variable, number>): string =>
    `${scope.item.key}: ${scope.value.toFixed(0)}`
</script>

<template>
  <AttributeEditor
    v-model:items="variables"
    :definition="definition"
    :new-item="newVariable"
    :item-removable="(item) => !item.secret"
    @remove="(_event, { item }) => item.key.trim()"
  >
    <template #cell-key="{ value, update }">
      <input
        :value="value.toUpperCase()"
        @input="update(($event.target as HTMLInputElement).value)"
      />
    </template>
    <template #cell-secret="{ item, value, update }">
      <input
        type="checkbox"
        :checked="setSecret(value)"
        :aria-label="item.key"
        @change="update(!value)"
      />
      <span>
        <!-- @vue-expect-error secret is a boolean -->
        {{ value.toUpperCase() }}
      </span>
    </template>
    <template #cell-value="{ value, update }">
      <Input
        :model-value="value"
        @update:model-value="update"
      />
    </template>
    <template #cell-ttl="scope">{{ describe(scope) }}</template>
    <template #row-actions="{ item, remove }">
      <button
        type="button"
        :disabled="item.secret"
        @click="remove"
      >
        {{ item.value.length }}
      </button>
    </template>
  </AttributeEditor>

  <AttributeEditor
    v-model:groups="criteria"
    :definition="definition"
  >
    <template #row="{ item, update }">
      <button
        type="button"
        @click="update('ttl', item.ttl + 1)"
      >
        {{ item.key }}
      </button>
      <!-- @vue-expect-error a field the row does not have -->
      <button @click="update('missing', 1)" />
    </template>
  </AttributeEditor>

  <AttributeEditor :definition="plainDefinition">
    <template #cell-name="{ value }">
      <span>
        <!-- @vue-expect-error untyped rows keep unknown values -->
        {{ value.toUpperCase() }}
      </span>
    </template>
  </AttributeEditor>
</template>

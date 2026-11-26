<script setup lang="ts">
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Combobox from '@aziontech/webkit/combobox'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import { computed } from 'vue'

  import { type Condition, OPERATORS } from '../lib/rule-behavior-data'
  import { operatorLabel, takesArgument, variablesFor } from '../lib/rule-catalog'
  import { criteriaColumns } from '../lib/rule-form'

  const props = defineProps<{
    phase: string
    disabled: boolean
    errors: Record<string, string | undefined>[][]
    newItem: () => Condition
  }>()

  const criteria = defineModel<Condition[][]>('criteria', { required: true })

  const variablesForPhase = computed(() => variablesFor(props.phase))
</script>

<template>
  <SettingsGroup
    label="Criteria"
    hint="The conditions that decide whether the rule runs. Every condition in a group must match, and any one group is enough."
  >
    <AttributeEditor
      v-model:groups="criteria"
      :definition="criteriaColumns"
      :new-item="newItem"
      :errors="errors"
      :limit="10"
      :group-limit="5"
      :min-items="1"
      :disabled="disabled"
      reorderable
      size="large"
      add-button-label="Add condition"
      add-group-label="Add OR group"
      remove-button-label="Remove condition"
      aria-label="Criteria"
    >
      <template #cell-variable="{ value, update, invalid }">
        <div class="contents">
          <Combobox
            :model-value="value"
            :options="variablesForPhase"
            size="large"
            placeholder="${uri}"
            empty-title="No variable matches. Type the one you need."
            required
            :invalid="invalid"
            :disabled="disabled"
            @update:model-value="update"
          />
        </div>
      </template>
      <template #cell-operator="{ value, update }">
        <Select
          :model-value="value"
          size="large"
          class="w-full"
          :disabled="disabled"
          :display-value="operatorLabel"
          @update:model-value="update"
        >
          <Select.Trigger />
          <Select.Content>
            <Select.Item
              v-for="op in OPERATORS"
              :key="op.value"
              :value="op.value"
            >
              {{ op.label }}
            </Select.Item>
          </Select.Content>
        </Select>
      </template>
      <template #cell-argument="{ item, value, update }">
        <Input
          v-if="takesArgument(item.operator)"
          key="argument"
          :model-value="value"
          size="large"
          class="w-full"
          autocomplete="off"
          :spellcheck="false"
          :disabled="disabled"
          @update:model-value="update"
        />
        <Input
          v-else
          key="no-argument"
          model-value=""
          size="large"
          class="w-full"
          placeholder="No argument"
          disabled
        />
      </template>
    </AttributeEditor>
  </SettingsGroup>
</template>

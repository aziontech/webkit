<script setup lang="ts">
  import AttributeEditor from '@aziontech/webkit/attribute-editor'
  import Combobox from '@aziontech/webkit/combobox'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'

  import {
    type Condition,
    criteriaColumns,
    operatorLabel,
    OPERATORS,
    takesArgument
  } from '../lib/rule-builder'

  export interface RuleCriteriaEditorProps {
    /** Builds an empty condition. */
    newCondition: () => Condition
    /** The errors per group and condition. */
    errors: Record<string, string>[][]
    /** The variables of the rule's phase. */
    variables: { value: string }[]
    /** The form is saving. */
    submitting: boolean
  }

  defineProps<RuleCriteriaEditorProps>()

  const groups = defineModel<Condition[][]>('groups', { required: true })
</script>

<template>
  <AttributeEditor
    v-model:groups="groups"
    :definition="criteriaColumns"
    :new-item="newCondition"
    :errors="errors"
    :limit="10"
    :group-limit="5"
    :min-items="1"
    :disabled="submitting"
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
          :options="variables"
          size="large"
          placeholder="${uri}"
          empty-title="No variable matches. Type the one you need."
          required
          :invalid="invalid"
          :disabled="submitting"
          @update:model-value="update"
        />
      </div>
    </template>
    <template #cell-operator="{ value, update }">
      <Select
        :model-value="value"
        size="large"
        class="w-full"
        :disabled="submitting"
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
        :disabled="submitting"
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
</template>

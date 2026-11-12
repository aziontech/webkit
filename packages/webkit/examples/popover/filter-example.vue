<script setup>
  import Button from '@aziontech/webkit/button'
  import FieldLegend from '@aziontech/webkit/field-legend'
  import Input from '@aziontech/webkit/input'
  import PopoverClose from '@aziontech/webkit/popover-close'
  import PopoverContent from '@aziontech/webkit/popover-content'
  import PopoverDescription from '@aziontech/webkit/popover-description'
  import PopoverFooter from '@aziontech/webkit/popover-footer'
  import PopoverHeader from '@aziontech/webkit/popover-header'
  import PopoverRoot from '@aziontech/webkit/popover-root'
  import PopoverTitle from '@aziontech/webkit/popover-title'
  import PopoverTrigger from '@aziontech/webkit/popover-trigger'
  import SelectContent from '@aziontech/webkit/select-content'
  import SelectOption from '@aziontech/webkit/select-option'
  import SelectRoot from '@aziontech/webkit/select-root'
  import SelectTrigger from '@aziontech/webkit/select-trigger'
  import { ref } from 'vue'

  const open = ref(false)
  const field = ref('last-editor')
  const operator = ref('equals')
  const value = ref('')

  const fields = [
    { value: 'name', label: 'Name' },
    { value: 'id', label: 'ID' },
    { value: 'infrastructure', label: 'Infrastructure' },
    { value: 'status', label: 'Status' },
    { value: 'last-editor', label: 'Last Editor' }
  ]
  const operators = [
    { value: 'equals', label: 'Equals' },
    { value: 'not-equals', label: 'Not Equals' }
  ]

  function apply() {
    open.value = false
  }
  function cancel() {
    open.value = false
  }
</script>

<template>
  <PopoverRoot
    v-model:open="open"
    :dismissible="false"
    width="large"
  >
    <PopoverTrigger>
      <Button
        size="small"
        kind="secondary"
        icon="pi pi-filter"
        label="Filter"
      />
    </PopoverTrigger>

    <PopoverContent>
      <PopoverHeader>
        <PopoverTitle>Filter</PopoverTitle>
        <PopoverDescription>Each combination of operator can only be used once.</PopoverDescription>
        <PopoverClose />
      </PopoverHeader>

      <fieldset class="m-0 flex min-w-0 flex-col gap-(--spacing-xs) border-0 p-(--spacing-md)">
        <FieldLegend kind="label">New Filter</FieldLegend>
        <div class="flex items-start gap-(--spacing-sm)">
          <div class="min-w-0 flex-1">
            <SelectRoot
              v-model="field"
              size="small"
              placeholder="Field"
            >
              <SelectTrigger aria-label="Field" />
              <SelectContent>
                <SelectOption
                  v-for="option in fields"
                  :key="option.value"
                  :value="option.value"
                  >{{ option.label }}</SelectOption
                >
              </SelectContent>
            </SelectRoot>
          </div>
          <div class="min-w-0 flex-1">
            <SelectRoot
              size="small"
              v-model="operator"
              placeholder="Operator"
            >
              <SelectTrigger aria-label="Operator" />
              <SelectContent>
                <SelectOption
                  v-for="option in operators"
                  :key="option.value"
                  :value="option.value"
                  >{{ option.label }}</SelectOption
                >
              </SelectContent>
            </SelectRoot>
          </div>
          <div class="min-w-0 flex-1">
            <Input
              size="small"
              v-model="value"
              placeholder="Value"
              aria-label="Value"
            />
          </div>
        </div>
      </fieldset>

      <PopoverFooter>
        <Button
          size="small"
          kind="outlined"
          label="Cancel"
          @click="cancel"
        />
        <Button
          size="small"
          kind="primary"
          label="Apply"
          @click="apply"
        />
      </PopoverFooter>
    </PopoverContent>
  </PopoverRoot>
</template>

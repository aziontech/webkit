<script setup>
  import { ref } from 'vue'
  import Popover, {
    PopoverTrigger,
    PopoverContent,
    PopoverHeader,
    PopoverTitle,
    PopoverDescription,
    PopoverClose,
    PopoverFooter
  } from '@aziontech/webkit/popover'
  import Select, { SelectTrigger, SelectContent, SelectOption } from '@aziontech/webkit/select'
  import Input from '@aziontech/webkit/input'
  import Label from '@aziontech/webkit/label'
  import Button from '@aziontech/webkit/button'

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
  <Popover
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

      <div class="flex flex-col gap-(--spacing-xs) p-(--spacing-md)">
        <Label>New Filter</Label>
        <div class="flex items-start gap-(--spacing-sm)">
          <div class="min-w-0 flex-1">
            <Select
              v-model="field"
              size="small"
              placeholder="Field"
            >
              <SelectTrigger />
              <SelectContent>
                <SelectOption
                  v-for="option in fields"
                  :key="option.value"
                  :value="option.value"
                  >{{ option.label }}</SelectOption
                >
              </SelectContent>
            </Select>
          </div>
          <div class="min-w-0 flex-1">
            <Select
              size="small"
              v-model="operator"
              placeholder="Operator"
            >
              <SelectTrigger />
              <SelectContent>
                <SelectOption
                  v-for="option in operators"
                  :key="option.value"
                  :value="option.value"
                  >{{ option.label }}</SelectOption
                >
              </SelectContent>
            </Select>
          </div>
          <div class="min-w-0 flex-1">
            <Input
              size="small"
              v-model="value"
              placeholder="Value"
            />
          </div>
        </div>
      </div>

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
  </Popover>
</template>

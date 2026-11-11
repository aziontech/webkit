<script setup>
  import MultiSelect from '@aziontech/webkit/multi-select'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectOption from '@aziontech/webkit/multi-select-option'
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import { computed, ref } from 'vue'

  const value = ref([])
  const search = ref('')
  const options = ref([
    { value: 'opt-1', label: 'Option 1' },
    { value: 'opt-2', label: 'Option 2' },
    { value: 'opt-3', label: 'Option 3' },
    { value: 'opt-4', label: 'Option 4' }
  ])
  const filtered = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return options.value
    return options.value.filter((o) => o.label.toLowerCase().includes(q))
  })
  const onCreate = () => {
    const label = search.value.trim()
    if (!label) return
    const next = { value: `opt-${options.value.length + 1}`, label }
    options.value = [...options.value, next]
    value.value = [...value.value, next.value]
    search.value = ''
  }
</script>

<template>
  <div style="width: 280px">
    <MultiSelect
      aria-label="Options"
      v-model="value"
      placeholder="Select options"
    >
      <MultiSelectTrigger />
      <MultiSelectContent>
        <template #search>
          <Input
            v-model="search"
            size="small"
            placeholder="Search"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </Input>
        </template>
        <MultiSelectOption
          v-for="o in filtered"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</MultiSelectOption
        >
        <template #footer>
          <Button
            label="Create new item"
            icon="pi pi-plus-circle"
            kind="transparent"
            size="small"
            class="w-full"
            @click="onCreate"
          />
        </template>
      </MultiSelectContent>
    </MultiSelect>
  </div>
</template>

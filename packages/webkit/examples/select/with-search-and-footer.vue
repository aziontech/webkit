<script setup>
  import Select from '@aziontech/webkit/select'
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import { computed, ref } from 'vue'

  const value = ref('')
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
    value.value = next.value
    search.value = ''
  }
</script>

<template>
  <div class="w-[280px]">
    <Select
      v-model="value"
      placeholder="Select an option"
    >
      <Select.Trigger />
      <Select.Content>
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
        <Select.Option
          v-for="o in filtered"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</Select.Option
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
      </Select.Content>
    </Select>
  </div>
</template>

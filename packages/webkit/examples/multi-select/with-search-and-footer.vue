<script setup>
  import Button from '@aziontech/webkit/button'
  import Input from '@aziontech/webkit/input'
  import MultiSelectContent from '@aziontech/webkit/multi-select-content'
  import MultiSelectItem from '@aziontech/webkit/multi-select-item'
  import MultiSelectRoot from '@aziontech/webkit/multi-select-root'
  import MultiSelectTrigger from '@aziontech/webkit/multi-select-trigger'
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
  <div class="w-full max-w-70">
    <MultiSelectRoot
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
            aria-label="Search options"
          >
            <template #leading>
              <i
                class="az az-search"
                aria-hidden="true"
              />
            </template>
          </Input>
        </template>
        <MultiSelectItem
          v-for="o in filtered"
          :key="o.value"
          :value="o.value"
          >{{ o.label }}</MultiSelectItem
        >
        <template #footer>
          <Button
            label="Create new item"
            icon="az az-circle-plus"
            variant="ghost"
            size="small"
            class="w-full"
            @click="onCreate"
          />
        </template>
      </MultiSelectContent>
    </MultiSelectRoot>
  </div>
</template>

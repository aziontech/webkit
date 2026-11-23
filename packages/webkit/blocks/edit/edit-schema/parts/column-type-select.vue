<script setup lang="ts">
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import { computed } from 'vue'

  import { filterTypes, glyphOf, TYPES } from '../lib/column-types'

  const props = withDefaults(defineProps<{ searchable?: boolean }>(), { searchable: false })

  const type = defineModel<string>('type', { required: true })
  const query = defineModel<string>('query', { default: '' })

  const typeName = (value: string) => value

  const types = computed(() => (props.searchable ? filterTypes(query.value) : TYPES))
</script>

<template>
  <Select
    v-model="type"
    size="large"
    class="w-full"
    :display-value="typeName"
  >
    <Select.Trigger>
      <template #leading>
        <span
          class="shrink-0 font-code text-label-code-sm text-(--text-muted)"
          aria-hidden="true"
          >{{ glyphOf(type) }}</span
        >
      </template>
    </Select.Trigger>
    <Select.Content>
      <template
        v-if="searchable"
        #search
      >
        <Input
          v-model="query"
          size="medium"
          class="w-full"
          placeholder="Search types"
          aria-label="Search types"
          @keydown.home.stop
          @keydown.end.stop
        />
      </template>
      <Select.Group label="Data types">
        <Select.Item
          v-for="item in types"
          :key="item.value"
          :value="item.value"
        >
          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
            <span class="font-code text-label-code-sm">{{ item.value }}</span>
            <span class="truncate text-body-xs text-(--text-muted)">{{ item.description }}</span>
          </span>
        </Select.Item>
      </Select.Group>
    </Select.Content>
  </Select>
</template>

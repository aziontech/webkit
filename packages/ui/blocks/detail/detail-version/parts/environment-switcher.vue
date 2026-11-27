<script setup lang="ts">
  import Input from '@aziontech/ui/input'
  import Select from '@aziontech/ui/select'
  import Tag from '@aziontech/ui/tag'
  import { computed } from 'vue'

  import type { VersionDetailEnvironment } from '../detail-version.vue'
  import { ADD_ENVIRONMENT } from '../detail-version-states'

  export interface EnvironmentSwitcherProps {
    /** Every environment of the resource. */
    environments: VersionDetailEnvironment[]
    /** The environment the page is on. */
    environmentName: string
  }

  const props = defineProps<EnvironmentSwitcherProps>()

  const emit = defineEmits<{
    pick: [value: unknown]
    add: [event: MouseEvent | KeyboardEvent]
  }>()

  const environmentQuery = defineModel<string>('query', { required: true })

  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return props.environments
    return props.environments.filter((entry) => entry.name.toLowerCase().includes(needle))
  })
</script>

<template>
  <Select
    :model-value="environmentName"
    :display-value="(value) => String(value ?? '')"
    @update:model-value="(value) => emit('pick', value)"
    @update:open="
      (open) => {
        if (!open) environmentQuery = ''
      }
    "
  >
    <Select.Trigger aria-label="Switch environment" />
    <Select.Content>
      <template #search>
        <Input
          v-model="environmentQuery"
          size="small"
          placeholder="Search environments"
          aria-label="Search environments"
          @keydown.home.stop
          @keydown.end.stop
        >
          <template #leading>
            <i
              class="az az-search"
              aria-hidden="true"
            />
          </template>
        </Input>
      </template>
      <Select.Group label="Environments">
        <Select.Item
          v-for="entry in environmentMatches"
          :key="entry.name"
          :value="entry.name"
        >
          {{ entry.name }}
          <template #tag>
            <Tag
              :label="entry.policy"
              severity="neutral"
              size="small"
            />
          </template>
        </Select.Item>
        <p
          v-if="!environmentMatches.length"
          class="px-(--spacing-xs) py-(--spacing-2xs) text-body-sm text-(--text-muted)"
        >
          No environments match "{{ environmentQuery }}".
        </p>
      </Select.Group>
      <template #footer>
        <Select.Item
          :value="ADD_ENVIRONMENT"
          class="w-full"
          @click="(event: MouseEvent) => emit('add', event)"
          @keydown.enter="(event: KeyboardEvent) => emit('add', event)"
        >
          <span class="flex items-center gap-(--spacing-xs)">
            <i
              class="az az-circle-plus"
              aria-hidden="true"
            />
            Add Environment
          </span>
        </Select.Item>
      </template>
    </Select.Content>
  </Select>
</template>

<script setup lang="ts">
  import ConsoleLayout from '@aziontech/ui/console-layout'
  import Input from '@aziontech/ui/input'
  import Select from '@aziontech/ui/select'
  import Tag from '@aziontech/ui/tag'
  import { computed, ref } from 'vue'

  const leadingCrumbs = [
    { label: 'Applications', href: '/applications' },
    { label: 'azion-site', href: '/applications/azion-site' }
  ]

  const environments = [
    { name: 'Production', policy: 'Single' },
    { name: 'Preview', policy: 'Versioned' }
  ]
  const environment = ref('Production')
  const environmentQuery = ref('')

  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return environments
    return environments.filter((entry) => entry.name.toLowerCase().includes(needle))
  })

  const environmentLabel = (value: string) => value

  const pickEnvironment = (value: string) => {
    if (value !== '__create-environment__') environment.value = value
  }

  const onEnvironmentOpen = (open: boolean) => {
    if (!open) environmentQuery.value = ''
  }
</script>

<template>
  <ConsoleLayout.Breadcrumb :items="leadingCrumbs">
    <Select
      :model-value="environment"
      :display-value="environmentLabel"
      variant="ghost"
      size="small"
      @update:model-value="pickEnvironment"
      @update:open="onEnvironmentOpen"
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
            value="__create-environment__"
            class="w-full"
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
  </ConsoleLayout.Breadcrumb>
</template>

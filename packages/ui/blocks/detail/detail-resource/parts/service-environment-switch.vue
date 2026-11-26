<script setup lang="ts">
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import Input from '@aziontech/webkit/input'
  import Select from '@aziontech/webkit/select'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  import { serviceEnvironments as environments } from '../sample'

  export interface ServiceEnvironmentSwitchProps {
    /** The service name, the last crumb before the environment. */
    service: string
  }

  defineProps<ServiceEnvironmentSwitchProps>()

  const environment = defineModel<string>('environment', { required: true })

  const environmentQuery = ref('')
  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return environments
    return environments.filter((option) => option.name.toLowerCase().includes(needle))
  })
</script>

<template>
  <ConsoleLayout.Breadcrumb
    :items="[
      { label: 'Services', href: '/services' },
      { label: service, href: '/services/1020655' }
    ]"
  >
    <Select
      :model-value="environment"
      :display-value="(value) => String(value ?? '')"
      variant="ghost"
      size="small"
      @update:model-value="
        (value) => {
          if (value !== '__add-environment__') environment = String(value)
        }
      "
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
            v-for="option in environmentMatches"
            :key="option.name"
            :value="option.name"
          >
            {{ option.name }}
            <template #tag>
              <Tag
                :label="option.policy"
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
            value="__add-environment__"
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

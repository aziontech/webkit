<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Select from '@aziontech/webkit/select'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import ShellConsole from '../shell-console.vue'

  const emit = defineEmits<{ 'sign-out': [event: MouseEvent | KeyboardEvent] }>()

  const leadingCrumbs = [
    { label: 'Applications', href: '/applications' },
    { label: 'azion-site', href: '/applications/azion-site' }
  ]

  const environments = [
    { name: 'Production', policy: 'Single' },
    { name: 'Preview', policy: 'Versioned' }
  ]

  const tabs = [
    { value: 'overview', label: 'Overview' },
    { value: 'deployments', label: 'Deployments' },
    { value: 'settings', label: 'Settings' }
  ]

  const activeTab = ref('overview')
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
  <ShellConsole @sign-out="(event) => emit('sign-out', event)">
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
              @keydown.stop
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

    <nav
      aria-label="Application"
      class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs) md:hidden"
    >
      <Tooltip content="Back to Applications">
        <IconButton
          icon="az az-arrow-left"
          variant="ghost"
          size="medium"
          href="/applications"
          aria-label="Back to Applications"
        />
      </Tooltip>
      <a
        href="/applications/azion-site"
        class="min-w-0 shrink truncate rounded-(--shape-button) text-label-md text-(--text-default) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
        >azion-site</a
      >
    </nav>

    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
        <template #actions>
          <Button
            label="Deploy"
            variant="outline"
            size="medium"
            icon="az az-cloud-upload"
          />
        </template>
      </PageTabs>
    </div>

    <div class="layout-boundary">
      <div class="layout-column flex min-w-0 flex-col">
        <section class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap)">
          <Card :padded="false">
            <template #default>
              <div
                class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
              >
                The page body: detail/detail-resource
              </div>
            </template>
          </Card>
        </section>
      </div>
    </div>
  </ShellConsole>
</template>

<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import ButtonHighlight from '@aziontech/webkit/button-highlight'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayout, { type ConsoleLayoutCrumb } from '@aziontech/webkit/console-layout-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import ThemeSwitcher, { type ThemeSwitcherValue } from '@aziontech/webkit/theme-switcher'
  import { Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import WebkitProvider from '@aziontech/webkit/webkit-provider'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import DemoBar from './components/demo-bar.vue'
  import { account, navigation } from './lib/navigation'
  import { settings } from './lib/settings'
  import { resources } from './lib/store'

  const catalogs = { 'pt-BR': ptBR }
  const route = useRoute()
  const router = useRouter()
  const focused = computed(() => route.meta.shell === 'focused')
  const breadcrumbs = computed(() => (route.meta.breadcrumbs ?? []) as ConsoleLayoutCrumb[])

  const recents = computed(() =>
    resources.value.slice(0, 3).map((resource) => ({
      id: resource.id,
      label: resource.name,
      icon: 'ai ai-box',
      type: 'Resource'
    }))
  )

  const theme = computed<ThemeSwitcherValue>({
    get: () => settings.theme,
    set: (value) => {
      settings.theme =
        value === 'system'
          ? globalThis.matchMedia?.('(prefers-color-scheme: dark)').matches
            ? 'dark'
            : 'light'
          : value
    }
  })

  const onSearchSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    const [scope, id] = String(value).split(':')
    if (scope === 'recent') router.push(`/resources/${id}`)
    if (value === 'action:create') router.push('/resources/new')
    if (value === 'action:theme') theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }
</script>

<template>
  <WebkitProvider
    :locale="settings.locale"
    :catalogs="catalogs"
    :dir="settings.dir"
    class="min-h-dvh"
  >
    <RouterView v-if="focused" />
    <ConsoleLayout
      v-else
      :navigation="navigation"
      :breadcrumbs="breadcrumbs"
      :account="account"
      @search-select="onSearchSelect"
    >
      <template #actions="{ compact }">
        <template v-if="compact">
          <Tooltip
            content="Create"
            placement="bottom"
          >
            <IconButton
              icon="ai ai-circle-plus"
              variant="primary"
              size="medium"
              ariaLabel="Create"
              @click="router.push('/resources/new')"
            />
          </Tooltip>
          <Tooltip
            content="Agent"
            placement="bottom"
          >
            <IconButton
              icon="ai ai-ask-azion"
              variant="outline"
              size="medium"
              ariaLabel="Agent"
              @click="router.push('/assistant')"
            />
          </Tooltip>
        </template>
        <template v-else>
          <Button
            label="Create"
            variant="primary"
            size="medium"
            icon="ai ai-circle-plus"
            @click="router.push('/resources/new')"
          />
          <ButtonHighlight
            label="Agent"
            size="medium"
            icon="ai ai-ask-azion"
            @click="router.push('/assistant')"
          />
        </template>
      </template>

      <template #search="{ query }">
        <Command.Group
          v-if="!query"
          label="Recents"
        >
          <Command.Item
            v-for="row in recents"
            :key="row.id"
            :value="`recent:${row.id}`"
          >
            <template #leading>
              <i
                :class="row.icon"
                aria-hidden="true"
              />
            </template>
            {{ row.label }}
            <template #trailing>
              <span class="text-label-sm text-(--text-muted)">{{ row.type }}</span>
            </template>
          </Command.Item>
        </Command.Group>
        <Command.Group label="Actions">
          <Command.Item value="action:create">
            <template #leading>
              <i
                class="ai ai-circle-plus"
                aria-hidden="true"
              />
            </template>
            Create Resource
          </Command.Item>
          <Command.Item value="action:theme">
            <template #leading>
              <i
                class="ai ai-moon"
                aria-hidden="true"
              />
            </template>
            Switch theme
          </Command.Item>
        </Command.Group>
      </template>

      <template #account-menu>
        <DropdownMenu.Group>
          <template #header>
            <div class="flex min-w-0 flex-col">
              <span class="truncate text-label-md text-(--text-default)">{{ account.name }}</span>
              <span class="truncate text-body-xs text-(--text-muted)">{{ account.email }}</span>
            </div>
          </template>
          <DropdownMenu.Item
            value="settings"
            label="Account settings"
          >
            <template #trailing>
              <i
                class="ai ai-settings"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            value="personal-tokens"
            label="Personal tokens"
          >
            <template #trailing>
              <i
                class="ai ai-key"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          <div
            class="flex h-8 min-h-8 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-sm) py-(--spacing-2xs)"
          >
            <span class="flex-1 truncate text-start text-label-sm text-(--text-default)"
              >Theme</span
            >
            <ThemeSwitcher
              v-model="theme"
              aria-label="Theme"
            />
          </div>
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            value="docs"
            label="Docs"
          >
            <template #trailing>
              <i
                class="ai ai-book"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            value="logout"
            label="Log out"
          >
            <template #trailing>
              <i
                class="ai ai-log-out"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          <div class="flex flex-col gap-(--spacing-sm) px-(--spacing-2xs) py-(--spacing-2xs)">
            <Button
              label="Upgrade to Pro"
              variant="secondary"
              size="medium"
              class="w-full"
            />
            <div class="flex justify-center px-(--spacing-xs)">
              <StatusIndicator
                severity="success"
                label="All systems normal"
              />
            </div>
          </div>
        </DropdownMenu.Group>
      </template>

      <RouterView />
      <RouterView name="dialog" />
    </ConsoleLayout>
    <DemoBar />
    <Toaster position="bottom-right" />
  </WebkitProvider>
</template>

<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Command from '@aziontech/webkit/command'
  import ConfigProvider from '@aziontech/webkit/config-provider'
  import ConsoleLayoutRoot, { type BreadcrumbItemData } from '@aziontech/webkit/console-layout-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import HighlightButton from '@aziontech/webkit/highlight-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import { ptBR } from '@aziontech/webkit/locales/pt-BR'
  import ShortcutsDialog from '@aziontech/webkit/shortcuts-dialog'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import type { ThemeSwitcherValue } from '@aziontech/webkit/theme-switcher'
  import { Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import { sampleHistory } from './blocks/ai-chat.sample'
  import CopilotHistory from './components/copilot-history.vue'
  import DemoBar from './components/demo-bar.vue'
  import { account, navigation } from './lib/navigation'
  import { resolvedTheme, settings } from './lib/settings'
  import { resources } from './lib/store'
  import { announcement } from './router'

  const consolePages = [
    { label: 'Resources', icon: 'az az-box', href: '/resources' },
    { label: 'Settings', icon: 'az az-settings', href: '/settings' }
  ]

  const catalogs = { 'pt-BR': ptBR }
  const route = useRoute()
  const router = useRouter()
  const focused = computed(() => route.meta.shell === 'focused')
  const copilot = computed(() => route.meta.shell === 'copilot')
  const breadcrumbs = computed(() => (route.meta.breadcrumbs ?? []) as BreadcrumbItemData[])

  const recents = computed(() =>
    resources.value.slice(0, 3).map((resource) => ({
      id: resource.id,
      label: resource.name,
      icon: 'az az-box',
      type: 'Resource'
    }))
  )

  const theme = computed<ThemeSwitcherValue>({
    get: () => settings.theme,
    set: (value) => {
      settings.theme = value
    }
  })

  const onSearchSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    const [scope, id] = String(value).split(':')
    if (scope === 'recent') router.push(`/resources/${id}`)
    if (scope === 'chat') router.push(`/assistant/c/${id}`)
    if (scope === 'page') router.push(String(value).slice('page:'.length))
    if (value === 'action:create') router.push('/resources/new')
    if (value === 'action:theme') theme.value = resolvedTheme.value === 'dark' ? 'light' : 'dark'
  }

  const createItems = [
    { value: '/resources/new', label: 'Resource' },
    { value: '/support/tickets/new', label: 'Ticket' }
  ]

  const onCreateSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    router.push(String(value))
  }

  const ACCOUNT_ROUTES: Record<string, string> = {
    settings: '/settings',
    'api-keys': '/settings/api-keys',
    upgrade: '/onboarding/plan',
    logout: '/onboarding'
  }

  const onAccountSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'theme:system' || value === 'theme:dark' || value === 'theme:light')
      theme.value = value.slice('theme:'.length) as ThemeSwitcherValue
    const path = ACCOUNT_ROUTES[String(value)]
    if (path) router.push(path)
  }
</script>

<template>
  <ConfigProvider
    :locale="settings.locale"
    :catalogs="catalogs"
    :dir="settings.dir"
    class="min-h-dvh"
  >
    <template v-if="focused">
      <RouterView />
      <ShortcutsDialog />
    </template>
    <ConsoleLayoutRoot
      v-else
      :navigation="copilot ? [] : navigation"
      :breadcrumbs="breadcrumbs"
      :account="account"
      class="max-h-(--demo-viewport-height)"
      @search-select="onSearchSelect"
      @account-select="onAccountSelect"
    >
      <template #actions="{ compact }">
        <template v-if="compact">
          <DropdownMenu @select="onCreateSelect">
            <DropdownMenu.Trigger>
              <IconButton
                icon="az az-circle-plus"
                variant="outline"
                size="medium"
                aria-label="Create"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Item
              v-for="item in createItems"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </DropdownMenu>
          <Tooltip
            content="AI Copilot"
            side="bottom"
          >
            <IconButton
              icon="az az-ask-azion"
              variant="outline"
              size="medium"
              aria-label="AI Copilot"
              @click="router.push('/assistant')"
            />
          </Tooltip>
        </template>
        <template v-else>
          <DropdownMenu @select="onCreateSelect">
            <DropdownMenu.Trigger>
              <Button
                label="Create"
                variant="outline"
                size="medium"
                icon="az az-circle-plus"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Item
              v-for="item in createItems"
              :key="item.value"
              :value="item.value"
              :label="item.label"
            />
          </DropdownMenu>
          <HighlightButton
            label="AI Copilot"
            size="medium"
            icon="az az-ask-azion"
            @click="router.push('/assistant')"
          />
        </template>
      </template>

      <template
        v-if="copilot"
        #sidebar-header
      >
        <CopilotHistory />
      </template>

      <template #search="{ query }">
        <Command.Group
          v-if="copilot"
          label="Chats"
        >
          <Command.Item
            v-for="chat in sampleHistory"
            :key="chat.id"
            :value="`chat:${chat.id}`"
          >
            <template #leading>
              <i
                class="az az-comment"
                aria-hidden="true"
              />
            </template>
            {{ chat.title }}
          </Command.Item>
        </Command.Group>
        <Command.Group
          key="command.group-2"
          v-if="copilot"
          label="Console"
        >
          <Command.Item
            v-for="page in consolePages"
            :key="page.href"
            :value="`page:${page.href}`"
          >
            <template #leading>
              <i
                :class="page.icon"
                aria-hidden="true"
              />
            </template>
            {{ page.label }}
          </Command.Item>
        </Command.Group>
        <Command.Group
          key="command.group-3"
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
                class="az az-circle-plus"
                aria-hidden="true"
              />
            </template>
            Create Resource
          </Command.Item>
          <Command.Item value="action:theme">
            <template #leading>
              <i
                class="az az-moon"
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
                class="az az-settings"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            value="api-keys"
            label="Integration keys"
          >
            <template #trailing>
              <i
                class="az az-key"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Group label="Theme">
          <DropdownMenu.Item
            value="theme:system"
            label="System"
            type="radio"
            :selected="theme === 'system'"
          >
            <template #trailing>
              <i
                class="az az-desktop"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            value="theme:dark"
            label="Dark"
            type="radio"
            :selected="theme === 'dark'"
          >
            <template #trailing>
              <i
                class="az az-moon"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
          <DropdownMenu.Item
            value="theme:light"
            label="Light"
            type="radio"
            :selected="theme === 'light'"
          >
            <template #trailing>
              <i
                class="az az-sun"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            value="docs"
            label="Docs"
            href="https://example.com/docs"
          >
            <template #trailing>
              <i
                class="az az-book"
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
                class="az az-log-out"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
        </DropdownMenu.Group>
        <DropdownMenu.Group>
          <DropdownMenu.Item
            value="upgrade"
            label="Upgrade to Pro"
          >
            <template #trailing>
              <i
                class="az az-sparkles"
                aria-hidden="true"
              />
            </template>
          </DropdownMenu.Item>
          <div class="flex justify-center px-(--spacing-xs) py-(--spacing-2xs)">
            <StatusIndicator
              severity="success"
              label="All systems normal"
            />
          </div>
        </DropdownMenu.Group>
      </template>

      <RouterView />
      <RouterView name="dialog" />
    </ConsoleLayoutRoot>
    <DemoBar />
    <p
      class="sr-only"
      aria-live="polite"
    >
      {{ announcement }}
    </p>
    <Toaster position="bottom-end" />
  </ConfigProvider>
</template>

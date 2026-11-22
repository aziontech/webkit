<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Command from '@aziontech/webkit/command'
  import ConsoleLayoutRoot, {
    type ConsoleLayoutAccount,
    type ConsoleLayoutNavGroup
  } from '@aziontech/webkit/console-layout-root'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import HighlightButton from '@aziontech/webkit/highlight-button'
  import IconButton from '@aziontech/webkit/icon-button'
  import PageHeader from '@aziontech/webkit/page-header'
  import StatusIndicator from '@aziontech/webkit/status-indicator'
  import { Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useColorMode } from '@aziontech/webkit/use-color-mode'

  import { sampleAccount, sampleNavigation, sampleRecents } from './sample'

  /** A page the search palette lists under Recents. */
  export interface ShellConsoleRecent {
    /** Stable key; the palette value is `recent:` followed by it. */
    id: string
    /** The resource name. */
    label: string
    /** Icon class of the resource kind. */
    icon: string
    /** The resource kind, shown after the name. */
    type: string
  }

  export interface ShellConsoleProps {
    /** Accessible name of the tools region the tools slot fills. */
    toolsLabel?: string
    /** The rail's navigation tree. Left out, the sample console tree renders. */
    navigation?: ConsoleLayoutNavGroup[]
    /** The signed-in account at the rail's foot. Left out, the sample account renders. */
    account?: ConsoleLayoutAccount
    /** The pages the search palette lists under Recents. Left out, the sample renders. */
    recents?: ShellConsoleRecent[]
  }

  withDefaults(defineProps<ShellConsoleProps>(), {
    toolsLabel: '',
    navigation: () => sampleNavigation,
    account: () => sampleAccount,
    recents: () => sampleRecents
  })

  const emit = defineEmits<{ 'sign-out': [event: MouseEvent | KeyboardEvent] }>()

  const toolsOpen = defineModel<boolean>('toolsOpen', { default: false })

  defineSlots<{
    /** The page body; a stand-in list page when empty. */
    default(): unknown
    /** Header actions after Create and Agent. */
    actions(props: { compact: boolean }): unknown
    /** Content before the breadcrumbs in the header. */
    'header-leading'(props: { compact: boolean }): unknown
    /** Content under the wordmark in the rail. */
    'sidebar-header'(props: { compact: boolean }): unknown
    /** Flash messages above the page body. */
    notifications(): unknown
    /** The tools region beside the content. */
    tools(): unknown
  }>()

  const { mode: theme } = useColorMode()

  const onSearchSelect = (_event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'action:theme') theme.value = theme.value === 'dark' ? 'light' : 'dark'
  }

  const onAccountSelect = (event: MouseEvent | KeyboardEvent, value: string | number) => {
    if (value === 'logout') emit('sign-out', event)
    else if (value === 'theme:system' || value === 'theme:dark' || value === 'theme:light')
      theme.value = value.slice('theme:'.length) as typeof theme.value
  }
</script>

<template>
  <ConsoleLayoutRoot
    :navigation="navigation"
    :account="account"
    active-id="applications"
    v-model:tools-open="toolsOpen"
    :tools-label="toolsLabel"
    @search-select="onSearchSelect"
    @account-select="onAccountSelect"
  >
    <template
      v-if="$slots['sidebar-header']"
      #sidebar-header="{ compact }"
    >
      <slot
        name="sidebar-header"
        :compact="compact"
      />
    </template>

    <template
      v-if="$slots['header-leading']"
      #header-leading="{ compact }"
    >
      <slot
        name="header-leading"
        :compact="compact"
      />
    </template>

    <template #actions="{ compact }">
      <template v-if="compact">
        <Tooltip
          content="Create"
          side="bottom"
        >
          <IconButton
            icon="az az-circle-plus"
            variant="primary"
            size="medium"
            aria-label="Create"
          />
        </Tooltip>
        <Tooltip
          content="Agent"
          side="bottom"
        >
          <IconButton
            icon="az az-ask-azion"
            variant="outline"
            size="medium"
            aria-label="Agent"
          />
        </Tooltip>
      </template>
      <template v-else>
        <Button
          label="Create"
          variant="primary"
          size="medium"
          icon="az az-circle-plus"
        />
        <HighlightButton
          label="Agent"
          size="medium"
          icon="az az-ask-azion"
        />
      </template>
      <slot
        name="actions"
        :compact="compact"
      />
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
              class="az az-circle-plus"
              aria-hidden="true"
            />
          </template>
          Create Application
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
          value="personal-tokens"
          label="Personal tokens"
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
            label="All systems operational"
          />
        </div>
      </DropdownMenu.Group>
    </template>

    <template
      v-if="$slots.notifications"
      #notifications
    >
      <slot name="notifications" />
    </template>

    <template
      v-if="$slots.tools"
      #tools
    >
      <slot name="tools" />
    </template>

    <slot>
      <div class="layout-boundary">
        <div class="layout-column flex flex-col gap-(--layout-group-gap)">
          <PageHeader
            title="Applications"
            description="Build, deploy, and manage your applications."
          >
            <template #actions>
              <Button
                label="Documentation"
                icon="az az-book"
                variant="outline"
                size="medium"
                href="https://www.azion.com/en/documentation/"
                target="_blank"
              />
              <Button
                label="Create Application"
                icon="az az-plus"
                variant="outline"
                size="medium"
              />
            </template>
          </PageHeader>

          <Card :padded="false">
            <template #default>
              <div
                class="flex min-h-(--container-3xs) items-center justify-center text-body-sm text-(--text-muted)"
              >
                The page body: view/view-table
              </div>
            </template>
          </Card>
        </div>
      </div>
    </slot>
    <Toaster position="bottom-end" />
  </ConsoleLayoutRoot>
</template>

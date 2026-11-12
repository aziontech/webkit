<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConfirmDialog from '@aziontech/webkit/confirm-dialog'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PageHeader from '@aziontech/webkit/page-header'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Resizable from '@aziontech/webkit/resizable'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import SettingRow from '@aziontech/webkit/setting-row'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import { toast, Toaster } from '@aziontech/webkit/toast'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, onBeforeUnmount, reactive, ref } from 'vue'

  const tabs = [
    { value: 'main-settings', label: 'Settings' },
    { value: 'source', label: 'Source' },
    { value: 'variables', label: 'Variables' },
    { value: 'cache-settings', label: 'Cache Settings' },
    { value: 'custom-code', label: 'Custom Code' },
    { value: 'rules', label: 'Rules' }
  ]
  const versions = [
    {
      id: 'ADA8FMMR',
      name: 'ADA8FMMR',
      state: 'draft',
      tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
      comment: 'Cache static assets for 30 days',
      author: 'Herbert Júlio',
      createdAgo: '14 hours ago'
    },
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Rafael Umman',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Marcus Grando',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function"ab-test" arguments',
      author: 'Bruno Germano',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable"API_URL"',
      author: 'Gab Lisboa',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Robson Junior',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Isaque Böck',
      createdAgo: '1 week ago'
    }
  ]
  const version = {
    id: 'AEO25I38',
    name: 'AEO25I38',
    state: 'active',
    tag: { label: 'Deployed', severity: 'primary', icon: '' },
    comment: 'Remove rule"Legacy load balancer"',
    author: 'Rafael Umman',
    createdAgo: '1 day ago'
  }
  const earlier = [
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Marcus Grando',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function"ab-test" arguments',
      author: 'Bruno Germano',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable"API_URL"',
      author: 'Gab Lisboa',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Robson Junior',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Isaque Böck',
      createdAgo: '1 week ago'
    }
  ]
  const defaultModules = [
    {
      key: 'protocol_optimization',
      title: 'Protocol Optimization',
      description: 'Optimize protocols and manage dynamic content delivery.'
    },
    { key: 'cache', title: 'Cache', description: 'Customize advanced cache settings.' },
    {
      key: 'device_detection',
      title: 'Device Detection',
      description: 'Detect device types to configure responsive rules.'
    },
    {
      key: 'custom_code',
      title: 'Custom Code',
      description: 'Run your own code on every request.'
    },
    {
      key: 'image_optimization',
      title: 'Image Optimization',
      description: 'Enable dynamic image editing options.'
    },
    {
      key: 'load_balancing',
      title: 'Load Balancing',
      description:
        'Balance traffic to your origins ensuring reliability and network congestion control.'
    }
  ]

  const versionId = ref('AK7D0ZX4')
  const query = ref('')
  const activeTab = ref('main-settings')
  const settings = reactive({
    name: 'web-app',
    active: true,
    modules: {
      protocol_optimization: true,
      cache: true,
      device_detection: true,
      custom_code: true,
      image_optimization: false,
      load_balancing: true,
      web_socket_proxy: false
    }
  })
  const historyCollapsed = ref(false)
  const historyBasis = ref(348)
  const description = ref('Remove rule"Legacy load balancer"')

  const VIEWED = 'AK7D0ZX4'
  const RUN_TOAST = 'version-detail-revert'
  const RUN_MS = 3000
  const changes = [
    { setting: 'Device Detection', from: 'Off', to: 'On' },
    { setting: 'Load Balancing', from: 'Off', to: 'On' },
    { setting: 'Image Optimization', from: 'On', to: 'Off' }
  ]
  const ruleChanges = { added: 1, removed: 0 }
  const deployedId = ref('AEO25I38')
  const confirmOpen = ref(false)
  const reverting = ref(false)
  const addVersionHost = ref(null)
  let runTimer = 0

  const tagFor = (entry) => {
    if (entry.state === 'draft') return entry.tag
    return entry.id === deployedId.value
      ? { label: 'Deployed', severity: 'primary', icon: '' }
      : { label: 'Ready', severity: 'success', icon: '' }
  }
  const viewedDeployed = computed(() => deployedId.value === VIEWED)

  const edit = () => {
    toast.dismiss(RUN_TOAST)
    addVersionHost.value?.querySelector('button')?.focus()
  }

  const finish = () => {
    reverting.value = false
    deployedId.value = VIEWED
    toast.success(`${VIEWED} is deployed.`, {
      id: RUN_TOAST,
      description: `Production serves ${VIEWED} again. AEO25I38 stays in the version history.`,
      duration: 0,
      closable: true,
      actions: [
        { label: 'Edit', onClick: edit },
        { label: 'Redeploy', onClick: () => run() }
      ]
    })
  }

  const run = () => {
    clearTimeout(runTimer)
    reverting.value = true
    toast.loading(`Reverting to ${VIEWED}…`, {
      id: RUN_TOAST,
      description: `web-app on Production. It keeps running if you leave.`
    })
    runTimer = setTimeout(finish, RUN_MS)
  }

  const confirmRevert = () => {
    confirmOpen.value = false
    run()
  }

  onBeforeUnmount(() => {
    clearTimeout(runTimer)
    toast.dismiss(RUN_TOAST)
  })
  const draftText = ref('')
  const editing = ref(false)
  const shown = ref(5)

  const matches = computed(() =>
    versions.filter((entry) => entry.name.toLowerCase().includes(query.value.trim().toLowerCase()))
  )

  const openHistory = (event, value) => {
    if (value === 'history' && !historyCollapsed.value) {
      historyCollapsed.value = true
      return
    }
    editing.value = value === 'edit'
    if (editing.value) draftText.value = description.value
    historyCollapsed.value = false
  }
</script>

<template>
  <div
    data-layout-fill
    class="flex h-dvh min-h-0 flex-col"
  >
    <ConsoleLayout.Breadcrumbs
      :items="[
        { label: 'Resources', href: '/resources' },
        { label: 'web-app', href: '/resources/1784552864' }
      ]"
    >
      <Select
        kind="transparent"
        size="small"
        :model-value="versionId"
        :display-value="
          (id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')
        "
        @update:open="
          (open) => {
            if (!open) query = ''
          }
        "
      >
        <Select.Trigger aria-label="Switch version" />
        <Select.Content>
          <template #search>
            <Input
              v-model="query"
              size="small"
              placeholder="Search versions"
              aria-label="Search versions"
              @keydown.stop
            >
              <template #iconLeft>
                <i
                  class="pi pi-search"
                  aria-hidden="true"
                />
              </template>
            </Input>
          </template>
          <Select.Group label="Versions">
            <Select.Option
              v-for="entry in matches"
              :key="entry.id"
              :value="entry.id"
            >
              {{ entry.name }}
              <template #tag>
                <Tag
                  :label="tagFor(entry).label"
                  :severity="tagFor(entry).severity"
                  :icon="tagFor(entry).icon"
                  size="small"
                />
              </template>
            </Select.Option>
            <p
              v-if="!matches.length"
              class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
            >
              No versions match"{{ query }}".
            </p>
          </Select.Group>
          <template #footer>
            <Select.Option
              value="__create-version__"
              class="w-full"
            >
              <span class="flex items-center gap-(--spacing-xs)">
                <i
                  class="pi pi-plus-circle"
                  aria-hidden="true"
                />
                Add Version
              </span>
            </Select.Option>
          </template>
        </Select.Content>
      </Select>
    </ConsoleLayout.Breadcrumbs>
    <nav
      aria-label="Breadcrumb"
      class="flex min-w-0 items-center gap-(--spacing-xs) border-b border-(--border-default) bg-(--bg-surface) px-(--spacing-md) py-(--spacing-xs) md:hidden"
    >
      <Tooltip text="Back to web-app versions">
        <IconButton
          icon="pi pi-arrow-left"
          kind="transparent"
          size="medium"
          href="/resources/1784552864?tab=versions"
          aria-label="Back to web-app versions"
        />
      </Tooltip>
      <div class="min-w-0 flex-1">
        <Select
          :model-value="versionId"
          :display-value="
            (id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')
          "
          class="w-full"
          @update:open="
            (open) => {
              if (!open) query = ''
            }
          "
        >
          <Select.Trigger aria-label="Switch version" />
          <Select.Content>
            <template #search>
              <Input
                v-model="query"
                size="small"
                placeholder="Search versions"
                aria-label="Search versions"
                @keydown.stop
              >
                <template #iconLeft>
                  <i
                    class="pi pi-search"
                    aria-hidden="true"
                  />
                </template>
              </Input>
            </template>
            <Select.Group label="Versions">
              <Select.Option
                v-for="entry in matches"
                :key="entry.id"
                :value="entry.id"
              >
                {{ entry.name }}
                <template #tag>
                  <Tag
                    :label="tagFor(entry).label"
                    :severity="tagFor(entry).severity"
                    :icon="tagFor(entry).icon"
                    size="small"
                  />
                </template>
              </Select.Option>
              <p
                v-if="!matches.length"
                class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
              >
                No versions match"{{ query }}".
              </p>
            </Select.Group>
            <template #footer>
              <Select.Option
                value="__create-version__"
                class="w-full"
              >
                <span class="flex items-center gap-(--spacing-xs)">
                  <i
                    class="pi pi-plus-circle"
                    aria-hidden="true"
                  />
                  Add Version
                </span>
              </Select.Option>
            </template>
          </Select.Content>
        </Select>
      </div>
    </nav>
    <div class="grid min-h-0 flex-1">
      <Resizable
        orientation="horizontal"
        aria-label="Version workspace"
      >
        <Resizable.Pane aria-label="Version settings">
          <div class="flex min-h-0 min-w-0 flex-1 flex-col">
            <PageTabs v-model="activeTab">
              <Tabs.Item
                v-for="tab in tabs"
                :key="tab.value"
                :value="tab.value"
                :label="tab.label"
              />
              <template #actions>
                <span class="hidden text-body-sm text-(--text-muted) md:inline">
                  Created Nov 5, 2026
                </span>
                <Tag
                  :label="viewedDeployed ? 'Deployed' : 'Ready'"
                  :severity="viewedDeployed ? 'primary' : 'success'"
                  size="medium"
                />
                <DropdownMenu
                  placement="bottom-end"
                  @select="openHistory"
                >
                  <DropdownMenu.Trigger>
                    <IconButton
                      icon="pi pi-ellipsis-h"
                      kind="transparent"
                      size="small"
                      aria-label="Version actions"
                    />
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Group>
                    <DropdownMenu.Option
                      value="history"
                      :label="historyCollapsed ? 'Show version history' : 'Hide version history'"
                    >
                      <template #left>
                        <i
                          class="pi pi-history"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
                  </DropdownMenu.Group>
                </DropdownMenu>
              </template>
            </PageTabs>

            <section
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
              <ScrollArea
                aria-label="Version settings"
                fade
              >
                <div class="flex min-h-full flex-col">
                  <fieldset
                    disabled
                    class="contents"
                  >
                    <legend class="sr-only">web-app AK7D0ZX4, read-only</legend>
                    <form
                      class="flex min-h-full flex-col"
                      aria-label="Main settings"
                      novalidate
                      @submit.prevent
                    >
                      <div
                        class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap)"
                      >
                        <PageHeader
                          title="Settings"
                          description="Core configuration for this resource."
                          size="small"
                        />

                        <fieldset
                          class="mx-0 mt-(--layout-section-gap) flex min-w-0 flex-col border-0 p-0"
                        >
                          <legend class="sr-only">Main settings</legend>

                          <SettingsSection
                            title="General"
                            hint="How this resource is identified across the console, and whether it is serving traffic."
                            anchor="general"
                          >
                            <Card :padded="false">
                              <template #content>
                                <Item.List>
                                  <SettingRow
                                    title="Name"
                                    description="A unique and descriptive name to identify the resource."
                                  >
                                    <Input
                                      v-model="settings.name"
                                      size="large"
                                      class="w-full"
                                      aria-label="Name"
                                    />
                                  </SettingRow>
                                  <SettingRow
                                    title="Active"
                                    description="When disabled, the resource stops serving traffic."
                                    kind="compact"
                                  >
                                    <Switch
                                      v-model="settings.active"
                                      aria-label="Active"
                                    />
                                  </SettingRow>
                                </Item.List>
                              </template>
                            </Card>
                          </SettingsSection>

                          <SettingsSection
                            title="Modules"
                            hint="The capabilities this resource runs with, each of which can be toggled here."
                            anchor="modules"
                          >
                            <Card :padded="false">
                              <template #content>
                                <Item.List>
                                  <SettingRow
                                    v-for="mod in defaultModules"
                                    :key="mod.key"
                                    :title="mod.title"
                                    :description="mod.description"
                                    kind="compact"
                                  >
                                    <Switch
                                      v-model="settings.modules[mod.key]"
                                      :aria-label="mod.title"
                                    />
                                  </SettingRow>
                                </Item.List>
                              </template>
                            </Card>
                          </SettingsSection>

                          <SettingsSection
                            title="Subscription modules"
                            hint="Paid add-ons that are activated with sales, not from this page."
                            anchor="subscription-modules"
                          >
                            <Card :padded="false">
                              <template #content>
                                <Item.List>
                                  <SettingRow
                                    title="WebSocket Proxy"
                                    kind="compact"
                                  >
                                    <template #description>
                                      Enhance real-time data exchange between your resource and
                                      backend services using the WebSocket protocol.
                                      <a
                                        href="https://example.com/contact-sales"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                                      >
                                        Contact sales
                                        <i
                                          class="pi pi-external-link shrink-0 text-body-sm leading-none"
                                          aria-hidden="true"
                                        />
                                      </a>
                                    </template>
                                    <Tooltip text="Contact sales to activate this module.">
                                      <Switch
                                        v-model="settings.modules.web_socket_proxy"
                                        disabled
                                        aria-label="WebSocket Proxy"
                                      />
                                    </Tooltip>
                                  </SettingRow>
                                </Item.List>
                              </template>
                            </Card>
                          </SettingsSection>
                        </fieldset>
                      </div>
                    </form>
                  </fieldset>
                </div>
              </ScrollArea>
            </section>

            <Transition
              appear
              enter-active-class="transition-[translate,opacity] duration-moderate-02 ease-productive-entrance motion-reduce:transition-none"
              enter-from-class="translate-y-2 opacity-0"
            >
              <footer
                class="flex min-h-14 shrink-0 flex-col border-t border-(--border-default) bg-(--bg-surface)"
                data-testid="version-detail-bar"
              >
                <div
                  class="layout-boundary-inline flex min-w-0 flex-1 items-center gap-(--spacing-sm) py-(--spacing-xs)"
                >
                  <div
                    class="flex min-w-0 flex-1 flex-col"
                    role="status"
                  >
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm text-(--text-default)">{{
                        reverting
                          ? `Reverting to ${VIEWED}…`
                          : viewedDeployed
                            ? 'Viewing a deployed version'
                            : 'Viewing an earlier version'
                      }}</span>
                      <span class="hidden shrink-0 sm:inline-flex">
                        <Tag
                          label="Read-only"
                          severity="secondary"
                          icon="pi pi-lock"
                          size="small"
                        />
                      </span>
                    </div>
                    <p
                      class="hidden truncate text-body-xs text-(--text-muted) data-dirty:text-(--text-default) md:block"
                      title="Cache static assets for 30 days"
                    >
                      Cache static assets for 30 days
                    </p>
                  </div>

                  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                    <span
                      ref="addVersionHost"
                      class="contents"
                    >
                      <Button
                        label="Add Version"
                        kind="outlined"
                        size="medium"
                        icon="pi pi-plus"
                      />
                    </span>
                    <Button
                      v-if="viewedDeployed"
                      label="Redeploy"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-refresh"
                      @click="run"
                    />
                    <ConfirmDialog
                      v-else
                      v-model:open="confirmOpen"
                      :title="`Revert to ${VIEWED}?`"
                      :description="`Reverting deploys ${VIEWED} to Production in place of AEO25I38. AEO25I38 stays in the version history, so you can redeploy it later.`"
                      :confirm-label="`Revert to ${VIEWED}`"
                      kind="primary"
                      size="medium"
                      @confirm="confirmRevert"
                    >
                      <template #trigger>
                        <Button
                          :label="`Revert to ${VIEWED}`"
                          kind="primary"
                          size="medium"
                          icon="pi pi-undo"
                          :loading="reverting"
                        />
                      </template>
                      <div class="flex min-w-0 flex-col gap-(--spacing-md) pt-(--spacing-md)">
                        <section
                          aria-labelledby="revert-settings-title"
                          class="flex min-w-0 flex-col gap-(--spacing-xs)"
                        >
                          <h3
                            id="revert-settings-title"
                            class="text-label-md text-(--text-default)"
                          >
                            What changes against AEO25I38
                          </h3>
                          <ul
                            class="flex min-w-0 flex-col divide-y divide-(--border-muted) rounded-(--shape-elements) border border-(--border-default)"
                          >
                            <li
                              v-for="change in changes"
                              :key="change.setting"
                              class="flex min-w-0 items-center justify-between gap-(--spacing-sm) px-(--spacing-sm) py-(--spacing-xs)"
                            >
                              <span class="truncate text-body-sm text-(--text-default)">{{
                                change.setting
                              }}</span>
                              <span class="sr-only">{{
                                `changes from ${change.from} to ${change.to}`
                              }}</span>
                              <span
                                class="flex shrink-0 items-center gap-(--spacing-xs) text-body-sm"
                                aria-hidden="true"
                              >
                                <span class="text-(--text-muted) line-through">{{
                                  change.from
                                }}</span>
                                <i class="pi pi-arrow-right text-body-xs text-(--text-muted)" />
                                <span class="text-(--text-default)">{{ change.to }}</span>
                              </span>
                            </li>
                          </ul>
                        </section>
                        <p class="text-body-sm text-(--text-default)">
                          Rules: {{ ruleChanges.added }} added, {{ ruleChanges.removed }}
                          removed. The rule"Legacy load balancer" comes back.
                        </p>
                      </div>
                    </ConfirmDialog>
                  </div>
                </div>
              </footer>
            </Transition>
          </div>
        </Resizable.Pane>
        <Resizable.Handle
          v-if="!historyCollapsed"
          aria-label="Resize the version history"
        />
        <Resizable.Pane
          v-model:basis="historyBasis"
          v-model:collapsed="historyCollapsed"
          collapsible
          :min="280"
          :max="560"
          aria-label="Version history"
        >
          <aside
            :inert="historyCollapsed"
            aria-labelledby="version-history-title"
            class="flex min-h-0 min-w-0 flex-1 flex-col bg-(--bg-surface)"
            data-testid="version-detail-history"
            @keydown.esc="historyCollapsed = true"
          >
            <header
              class="flex min-h-14 shrink-0 items-center justify-between gap-(--spacing-xs) border-b border-(--border-default) py-(--spacing-xs) ps-(--spacing-lg) pe-(--spacing-sm)"
            >
              <h2
                id="version-history-title"
                class="truncate text-label-lg text-(--text-default)"
              >
                Version history
              </h2>
              <IconButton
                icon="pi pi-times"
                kind="transparent"
                size="small"
                aria-label="Close version history"
                @click="historyCollapsed = true"
              />
            </header>
            <div class="min-h-0 flex-1 overflow-y-auto overscroll-contain p-(--spacing-lg)">
              <ol class="flex flex-col">
                <li class="relative flex gap-(--spacing-sm) pb-(--spacing-lg)">
                  <span
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <span
                    class="relative flex size-7 shrink-0 items-center justify-center rounded-full bg-(--accent) text-(--accent-contrast)"
                    aria-hidden="true"
                  >
                    <i class="pi pi-code text-body-xs" />
                  </span>
                  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-label-md text-(--text-default)">
                        {{ version.name }}
                      </span>
                      <span class="flex shrink-0">
                        <Tag
                          :label="tagFor(version).label"
                          :severity="tagFor(version).severity"
                          size="small"
                        />
                      </span>
                    </div>
                    <p class="text-label-sm text-(--text-muted)">Current version</p>

                    <p
                      :data-empty="!description || null"
                      class="text-body-sm text-(--text-default) data-empty:text-(--text-muted)"
                    >
                      {{ description || 'No description' }}
                    </p>
                    <span
                      class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                    >
                      <span class="flex shrink-0">
                        <Avatar
                          :alt="version.author"
                          :label="version.author"
                          size="small"
                          kind="square"
                        />
                      </span>
                      <span class="truncate">{{ version.author }} · {{ version.createdAgo }}</span>
                    </span>
                  </div>
                </li>

                <li
                  v-for="(entry, index) in earlier.slice(0, shown)"
                  :key="entry.id"
                  class="relative flex pb-(--spacing-lg) last:pb-0"
                >
                  <span
                    v-if="index < earlier.slice(0, shown).length - 1"
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <button
                    type="button"
                    :aria-current="entry.id === VIEWED || undefined"
                    class="group flex w-full min-w-0 gap-(--spacing-sm) rounded-(--shape-button) text-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
                  >
                    <span
                      class="relative flex size-7 shrink-0 items-center justify-center rounded-full border border-(--border-default) bg-(--bg-surface) text-(--text-default)"
                      aria-hidden="true"
                    >
                      <i class="pi pi-code text-body-xs" />
                    </span>
                    <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
                      <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                        <span
                          class="truncate text-label-md text-(--text-default) group-hover:underline"
                        >
                          {{ entry.name }}
                        </span>
                        <span class="flex shrink-0">
                          <Tag
                            :label="tagFor(entry).label"
                            :severity="tagFor(entry).severity"
                            size="small"
                          />
                        </span>
                        <span
                          v-if="entry.id === VIEWED"
                          class="flex shrink-0"
                        >
                          <Tag
                            label="Viewing"
                            severity="info"
                            size="small"
                          />
                        </span>
                      </span>
                      <span class="line-clamp-2 text-body-sm text-(--text-muted)">
                        {{ entry.comment }}
                      </span>
                      <span
                        class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                      >
                        <span class="flex shrink-0">
                          <Avatar
                            :alt="entry.author"
                            :label="entry.author"
                            size="small"
                            kind="square"
                          />
                        </span>
                        <span class="truncate">{{ entry.author }} · {{ entry.createdAgo }}</span>
                      </span>
                    </span>
                  </button>
                </li>
              </ol>

              <div
                v-if="earlier.length > shown"
                class="pt-(--spacing-sm)"
              >
                <Button
                  label="Show older"
                  kind="transparent"
                  size="small"
                  @click="shown += 5"
                />
              </div>
            </div>
          </aside>
        </Resizable.Pane>
      </Resizable>
    </div>

    <Toaster position="bottom-right" />
  </div>
</template>

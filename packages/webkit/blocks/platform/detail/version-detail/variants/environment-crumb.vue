<script setup>
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Field from '@aziontech/webkit/field'
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
  import SplitButton from '@aziontech/webkit/split-button'
  import Switch from '@aziontech/webkit/switch'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import Textarea from '@aziontech/webkit/textarea'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, reactive, ref } from 'vue'

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
    id: 'ADA8FMMR',
    name: 'ADA8FMMR',
    state: 'draft',
    tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
    comment: 'Cache static assets for 30 days',
    author: 'Herbert Júlio',
    createdAgo: '14 hours ago'
  }
  const earlier = [
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
  const saveOptions = [
    { label: 'Save and deploy', value: 'deploy' },
    { label: 'Save and build', value: 'build' },
    { label: 'Save', value: 'save' }
  ]

  const versionId = ref('ADA8FMMR')
  const query = ref('')

  const environments = [
    { name: 'Production', policy: 'Single', serves: 'AEO25I38' },
    { name: 'Preview', policy: 'Versioned', serves: 'AG1VVDJP' },
    { name: 'Staging', policy: 'Versioned', serves: '' }
  ]
  const environment = ref('Production')
  const environmentQuery = ref('')
  const environmentMatches = computed(() => {
    const needle = environmentQuery.value.trim().toLowerCase()
    if (!needle) return environments
    return environments.filter((entry) => entry.name.toLowerCase().includes(needle))
  })
  const servedIn = (id) =>
    environments.filter((entry) => entry.serves === id).map((entry) => entry.name)
  const pickEnvironment = (value) => {
    if (value === '__create-environment__') return
    environment.value = value
    const served = environments.find((entry) => entry.name === value)?.serves
    if (served) versionId.value = served
  }
  const pickVersion = (value) => {
    if (value !== '__create-version__') versionId.value = value
  }
  const activeTab = ref('main-settings')
  const settings = reactive({
    name: 'web-app',
    active: true,
    modules: {
      protocol_optimization: true,
      cache: true,
      device_detection: false,
      custom_code: true,
      image_optimization: false,
      load_balancing: false,
      web_socket_proxy: false
    }
  })
  const saveAction = ref('deploy')
  const historyCollapsed = ref(true)
  const historyBasis = ref(348)
  const description = ref('Cache static assets for 30 days')
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
  <div class="flex h-[calc(100dvh-var(--layout-header-height))] min-h-0 flex-col">
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
          :model-value="environment"
          :display-value="(value) => String(value ?? '')"
          class="w-full"
          @update:model-value="pickEnvironment"
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
            <Select.Group label="Environments">
              <Select.Option
                v-for="entry in environmentMatches"
                :key="entry.name"
                :value="entry.name"
              >
                {{ entry.name }}
                <template #tag>
                  <Tag
                    :label="entry.policy"
                    severity="secondary"
                    size="small"
                  />
                </template>
              </Select.Option>
              <p
                v-if="!environmentMatches.length"
                class="px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-muted)"
              >
                No environments match"{{ environmentQuery }}".
              </p>
            </Select.Group>
            <template #footer>
              <Select.Option
                value="__create-environment__"
                class="w-full"
              >
                <span class="flex items-center gap-(--spacing-xs)">
                  <i
                    class="pi pi-plus-circle"
                    aria-hidden="true"
                  />
                  Add Environment
                </span>
              </Select.Option>
            </template>
          </Select.Content>
        </Select>
      </div>
      <div class="min-w-0 flex-1">
        <Select
          :model-value="versionId"
          @update:model-value="pickVersion"
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
                <span
                  v-if="servedIn(entry.id).length"
                  class="text-body-xs text-(--text-muted)"
                  >Live in {{ servedIn(entry.id).join(', ') }}</span
                >
                <template #tag>
                  <Tag
                    :label="entry.tag.label"
                    :severity="entry.tag.severity"
                    :icon="entry.tag.icon"
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
                <Tag
                  label="Draft"
                  severity="warning"
                  icon="pi pi-file-edit"
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
                      value="edit"
                      label="Edit version info"
                    >
                      <template #left>
                        <i
                          class="pi pi-pencil"
                          aria-hidden="true"
                        />
                      </template>
                    </DropdownMenu.Option>
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
                  <fieldset class="contents">
                    <legend class="sr-only">web-app ADA8FMMR</legend>
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
                                        class="inline-flex items-center gap-(--spacing-xxs) rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) underline hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
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
                  <span
                    class="hidden size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface-raised) md:flex"
                    aria-hidden="true"
                  >
                    <i class="pi pi-file-edit text-body-sm text-(--text-default)" />
                  </span>
                  <div
                    class="flex min-w-0 flex-1 flex-col"
                    role="status"
                  >
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm text-(--text-default)">Draft</span>
                      <span class="hidden shrink-0 sm:inline-flex">
                        <Tag
                          label="Editable"
                          severity="info"
                          size="small"
                        />
                      </span>
                    </div>
                    <p
                      class="hidden truncate text-body-xs text-(--text-muted) data-dirty:text-(--text-default) md:block"
                      title="This version is open for editing. Deploy it when ready."
                    >
                      This version is open for editing. Deploy it when ready.
                    </p>
                  </div>

                  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                    <SplitButton
                      :label="saveOptions.find((option) => option.value === saveAction).label"
                      :icon="saveAction === 'deploy' ? 'pi pi-cloud-upload' : ''"
                      kind="primary"
                      size="medium"
                      :model="saveOptions"
                      @item-click="(event, item) => (saveAction = item.value)"
                    />
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
                    <i class="pi pi-file-edit text-body-xs" />
                  </span>
                  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs) pt-0.5">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-label-md text-(--text-default)">
                        {{ version.name }}
                      </span>
                      <span class="flex shrink-0">
                        <Tag
                          :label="version.tag.label"
                          :severity="version.tag.severity"
                          size="small"
                        />
                      </span>
                      <span
                        v-if="!editing"
                        class="ms-auto shrink-0"
                      >
                        <IconButton
                          icon="pi pi-pencil"
                          kind="transparent"
                          size="small"
                          aria-label="Edit version info"
                          @click="
                            () => {
                              draftText = description
                              editing = true
                            }
                          "
                        />
                      </span>
                    </div>
                    <p class="text-label-sm text-(--text-muted)">Current version</p>

                    <div
                      v-if="editing"
                      class="flex flex-col gap-(--spacing-sm) pt-(--spacing-xs)"
                    >
                      <Field>
                        <Field.Label>Description</Field.Label>
                        <Textarea
                          v-model="draftText"
                          placeholder="What changed in this version?"
                        />
                        <Field.Description
                          >Shows in the version list and on the deployment.</Field.Description
                        >
                      </Field>
                      <div class="flex justify-end gap-(--spacing-xs)">
                        <Button
                          label="Cancel"
                          kind="outlined"
                          size="small"
                          @click="editing = false"
                        />
                        <Button
                          label="Save"
                          kind="primary"
                          size="small"
                          @click="
                            () => {
                              description = draftText.trim()
                              editing = false
                            }
                          "
                        />
                      </div>
                    </div>
                    <template v-else>
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
                        <span class="truncate"
                          >{{ version.author }} · {{ version.createdAgo }}</span
                        >
                      </span>
                    </template>
                  </div>
                </li>

                <li class="relative flex flex-col pb-(--spacing-lg)">
                  <span
                    class="absolute bottom-0 start-3.5 top-7 w-px -translate-x-1/2 bg-(--border-default)"
                    aria-hidden="true"
                  />
                  <p class="flex gap-(--spacing-sm)">
                    <span
                      class="relative flex size-7 shrink-0 items-center justify-center"
                      aria-hidden="true"
                    >
                      <span
                        class="size-2 rounded-full border border-(--border-strong) bg-(--bg-surface)"
                      />
                    </span>
                    <span class="pt-1 text-body-sm text-(--text-muted)">
                      No changes yet. Each change you save shows up here.
                    </span>
                  </p>
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
                            :label="entry.tag.label"
                            :severity="entry.tag.severity"
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
  </div>
</template>

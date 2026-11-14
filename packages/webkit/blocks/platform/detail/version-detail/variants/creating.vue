<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import ConsoleLayout from '@aziontech/webkit/console-layout'
  import DropdownMenu, { type DropdownMenuOptionValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import Resizable from '@aziontech/webkit/resizable'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import Spinner from '@aziontech/webkit/spinner'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag, { type TagSeverity } from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  type VersionEntry = {
    id: string
    name: string
    state: string
    tag: { label: string; severity: TagSeverity; icon: string }
    comment: string
    author: string
    createdAgo: string
  }

  const tabs = [
    { value: 'main-settings', label: 'Settings' },
    { value: 'source', label: 'Source' },
    { value: 'device-groups', label: 'Device Groups' },
    { value: 'cache-settings', label: 'Cache Settings' },
    { value: 'functions-instances', label: 'Functions Instances' },
    { value: 'rules-engine', label: 'Rules Engine' }
  ]
  const versions: VersionEntry[] = [
    {
      id: 'ADA8FMMR',
      name: 'ADA8FMMR',
      state: 'draft',
      tag: { label: 'Draft', severity: 'warning', icon: 'pi pi-file-edit' },
      comment: 'Cache static assets for 30 days',
      author: 'John Smith',
      createdAgo: '14 hours ago'
    },
    {
      id: 'AEO25I38',
      name: 'AEO25I38',
      state: 'active',
      tag: { label: 'Deployed', severity: 'primary', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Sam Lee',
      createdAgo: '1 day ago'
    },
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Priya Patel',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function"ab-test" arguments',
      author: 'Chris Taylor',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable"API_URL"',
      author: 'Riley Carter',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Ethan Brooks',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Jordan Kim',
      createdAgo: '1 week ago'
    }
  ]
  const version: VersionEntry = {
    id: 'AEO25I38',
    name: 'AEO25I38',
    state: 'active',
    tag: { label: 'Deployed', severity: 'primary', icon: '' },
    comment: 'Remove rule"Legacy load balancer"',
    author: 'Sam Lee',
    createdAgo: '1 day ago'
  }
  const earlier: VersionEntry[] = [
    {
      id: 'AG1VVDJP',
      name: 'AG1VVDJP',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Enable image optimization',
      author: 'Priya Patel',
      createdAgo: '3 days ago'
    },
    {
      id: 'AHFPL906',
      name: 'AHFPL906',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Update function"ab-test" arguments',
      author: 'Chris Taylor',
      createdAgo: '3 days ago'
    },
    {
      id: 'AITJB4GN',
      name: 'AITJB4GN',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Add variable"API_URL"',
      author: 'Riley Carter',
      createdAgo: '4 days ago'
    },
    {
      id: 'AK7D0ZX4',
      name: 'AK7D0ZX4',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Cache static assets for 30 days',
      author: 'Ethan Brooks',
      createdAgo: '6 days ago'
    },
    {
      id: 'ALL6QVDL',
      name: 'ALL6QVDL',
      state: 'ready',
      tag: { label: 'Ready', severity: 'success', icon: '' },
      comment: 'Remove rule"Legacy load balancer"',
      author: 'Jordan Kim',
      createdAgo: '1 week ago'
    }
  ]

  const versionId = ref('AEO25I38')
  const wireSections = [
    { id: 'general', rows: ['62%', '48%'] },
    { id: 'modules', rows: ['54%', '66%', '44%'] }
  ]
  const query = ref('')
  const activeTab = ref('main-settings')
  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')
  const historyCollapsed = ref(true)
  const historyBasis = ref(348)
  const description = ref('Remove rule"Legacy load balancer"')
  const draftText = ref('')
  const editing = ref(false)
  const shown = ref(5)

  const matches = computed(() =>
    versions.filter((entry) => entry.name.toLowerCase().includes(query.value.trim().toLowerCase()))
  )

  const openHistory = (_event: MouseEvent | KeyboardEvent, value: DropdownMenuOptionValue) => {
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
        :display-value="(id) => versions.find((entry) => entry.id === id)?.name ?? String(id ?? '')"
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
                <span class="hidden text-body-sm text-(--text-muted) md:inline">
                  Created Nov 5, 2026
                </span>
                <Tag
                  label="Deployed"
                  severity="primary"
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
              v-if="activeTab === 'main-settings'"
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
              <ScrollArea
                aria-label="Version settings"
                fade
              >
                <div
                  role="status"
                  aria-busy="true"
                  class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap) animate-fade-in motion-reduce:animate-none"
                  data-testid="version-detail-wire"
                >
                  <span class="sr-only">Creating a new version from AEO25I38.</span>
                  <div
                    class="flex flex-col gap-(--spacing-xs)"
                    aria-hidden="true"
                  >
                    <Skeleton
                      width="8rem"
                      height="1.25rem"
                    />
                    <Skeleton
                      width="18rem"
                      height="0.875rem"
                    />
                  </div>
                  <div
                    class="mt-(--layout-section-gap) flex flex-col gap-(--layout-section-gap)"
                    aria-hidden="true"
                  >
                    <div
                      v-for="section in wireSections"
                      :key="section.id"
                      class="flex flex-col gap-(--layout-group-gap)"
                    >
                      <Skeleton
                        width="6rem"
                        height="1rem"
                      />
                      <Card :padded="false">
                        <template #content>
                          <div class="flex flex-col divide-y divide-(--border-default)">
                            <div
                              v-for="(width, index) in section.rows"
                              :key="index"
                              class="flex items-center gap-(--spacing-md) p-(--spacing-md)"
                            >
                              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
                                <Skeleton
                                  width="7rem"
                                  height="0.875rem"
                                />
                                <Skeleton
                                  :width="width"
                                  height="0.75rem"
                                />
                              </div>
                              <span class="flex shrink-0">
                                <Skeleton
                                  width="2.25rem"
                                  height="1.25rem"
                                />
                              </span>
                            </div>
                          </div>
                        </template>
                      </Card>
                    </div>
                  </div>
                </div>
              </ScrollArea>
            </section>
            <section
              v-else
              class="grid min-h-0 flex-1 grid-rows-[minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-processing:opacity-32 motion-reduce:transition-none"
            >
              <div class="layout-column layout-boundary flex min-w-0 flex-col">
                <div class="layout-section-start">
                  <EmptyState
                    size="medium"
                    icon="pi pi-external-link"
                    :title="tabLabel"
                    :description="`${tabLabel} opens on its own page.`"
                  >
                    <template #actions>
                      <Button
                        :label="`Open ${tabLabel}`"
                        kind="outlined"
                        size="small"
                        :href="`/resources/web-app/${activeTab}`"
                      />
                    </template>
                  </EmptyState>
                </div>
              </div>
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
                    <Spinner />
                  </span>
                  <div
                    class="flex min-w-0 flex-1 flex-col"
                    role="status"
                  >
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="truncate text-body-sm text-(--text-default)"
                        >Creating new version…</span
                      >
                    </div>
                    <p
                      class="hidden truncate text-body-xs text-(--text-muted) md:block"
                      title="Copying AEO25I38 into a new draft."
                    >
                      Copying AEO25I38 into a new draft.
                    </p>
                  </div>

                  <div class="flex shrink-0 items-center gap-(--spacing-xs)">
                    <Button
                      label="Add Version"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-plus"
                      loading
                    />
                    <Button
                      label="Redeploy"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-refresh"
                      disabled
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
                    <i class="pi pi-code text-body-xs" />
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
                  <a
                    :href="`/resources/web-app/versions/${entry.name}`"
                    class="group flex w-full min-w-0 gap-(--spacing-sm) rounded-(--shape-button) text-start no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color)"
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
                  </a>
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

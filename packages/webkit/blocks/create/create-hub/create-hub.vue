<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import IntegrationCard from '@aziontech/webkit/integration-card'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, ref, watch } from 'vue'

  import { sampleRepositories, sampleTemplates } from './sample'

  /** A GitHub account or organization the person can import from. */
  export interface CreateHubAccount {
    /** The name shown in the scope Select. */
    label: string
    /** The scope key. */
    value: string
  }

  /** One repository in the selected scope, most recently pushed first. */
  export interface CreateHubRepository {
    /** The repository name. */
    name: string
    /** When it was last pushed, already phrased (2 hours ago). */
    age: string
    /** The framework or kind glyph, an icon class. */
    icon: string
  }

  /** One template tile. */
  export interface CreateHubTemplate {
    /** The key of its deploy page. */
    slug: string
    /** The template name. */
    title: string
    /** One sentence on what it deploys. */
    description: string
    /** Who publishes it, shown beside the title on list tiles. */
    vendor?: string
    /** The framework or kind glyph, an icon class. */
    icon: string
    /** Extra classes on the glyph, such as the dark-theme invert. */
    markClass: string
  }

  /** How a template section lays out its tiles. */
  export type CreateHubTemplateSectionKind = 'cards' | 'list'

  /** A group of templates under one heading. */
  export interface CreateHubTemplateSection {
    /** Stable key. */
    id: string
    /** The section heading. */
    label: string
    /** Recommended cards in three columns, or two-column integration tiles. */
    kind: CreateHubTemplateSectionKind
    /** The templates in the section. */
    items: CreateHubTemplate[]
  }

  export interface CreateHubProps {
    /** The connected GitHub accounts; empty, the connect state shows. */
    accounts?: CreateHubAccount[]
    /** The repositories of the selected scope. Left out, the sample renders. */
    repositories?: CreateHubRepository[]
    /** The template sections. Left out, the sample renders. */
    templates?: CreateHubTemplateSection[]
    /** The GitHub authorization is in flight; Continue with GitHub spins. */
    connecting?: boolean
    /** Why the GitHub connection failed, shown under Continue with GitHub. */
    connectError?: string
    /** The repositories of the selected scope are loading; skeleton rows show. */
    loading?: boolean
    /** Why the repositories failed to load; a danger alert with Retry replaces the list. */
    error?: string
  }

  const props = withDefaults(defineProps<CreateHubProps>(), {
    accounts: () => [],
    repositories: undefined,
    templates: undefined,
    connecting: false,
    connectError: '',
    loading: false,
    error: ''
  })

  const emit = defineEmits<{
    connect: [event: MouseEvent]
    retry: [event: MouseEvent]
    import: [event: MouseEvent, repository: CreateHubRepository]
    upload: [event: Event, files: File[]]
  }>()

  const scope = defineModel<string>('scope', { default: '' })

  const breadcrumb = [{ label: 'Creation Center', active: true }]
  const REPO_PAGE = 10
  const skeletonRows = 6

  const search = ref('')
  const repoLimit = ref(REPO_PAGE)
  const templateSearch = ref('')
  const fileInputEl = ref<HTMLInputElement | null>(null)
  const folderInputEl = ref<HTMLInputElement | null>(null)

  const accounts = computed(() => props.accounts)
  const activeScope = computed(() => scope.value || props.accounts[0]?.value || '')
  const reposLoading = computed(() => props.loading)
  const reposFailed = computed(() => props.error !== '')
  const repos = computed<CreateHubRepository[]>(
    () => props.repositories ?? (props.loading || props.error ? [] : sampleRepositories)
  )
  const sections = computed<CreateHubTemplateSection[]>(() => props.templates ?? sampleTemplates)

  watch(activeScope, () => {
    repoLimit.value = REPO_PAGE
  })

  const onSelectScope = (value: string) => {
    if (!value || value === '__add-account__' || value === activeScope.value) return
    scope.value = value
  }

  const filteredRepos = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return repos.value
    return repos.value.filter((repo) => repo.name.toLowerCase().includes(q))
  })
  const shownRepos = computed(() => filteredRepos.value.slice(0, repoLimit.value))
  const hiddenRepoCount = computed(() => filteredRepos.value.length - shownRepos.value.length)

  const showMoreRepos = () => {
    repoLimit.value += REPO_PAGE
  }

  const clearSearch = () => {
    search.value = ''
  }

  const templateMatches = (item: CreateHubTemplate, query: string) =>
    item.title.toLowerCase().includes(query) || item.description.toLowerCase().includes(query)

  const filteredSections = computed(() => {
    const q = templateSearch.value.trim().toLowerCase()
    if (!q) return sections.value
    return sections.value
      .map((section) => ({
        ...section,
        items: section.items.filter((item) => templateMatches(item, q))
      }))
      .filter((section) => section.items.length > 0)
  })

  const clearTemplateSearch = () => {
    templateSearch.value = ''
  }

  const templateHref = (item: CreateHubTemplate) => `/create/templates/${item.slug}`

  const openFilePicker = () => fileInputEl.value?.click()
  const openFolderPicker = () => folderInputEl.value?.click()

  const onPick = (event: Event) => {
    const input = event.target as HTMLInputElement
    const picked = input.files ? Array.from(input.files) : []
    if (!picked.length) return
    emit('upload', event, picked)
    input.value = ''
  }
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <AppHeader aria-label="Console">
      <AppHeader.Start>
        <IconButton
          icon="az az-chevron-left"
          aria-label="Back to Home"
          variant="outline"
          size="small"
        />
        <AppHeader.Brand
          href="/home"
          aria-label="Azion home"
        >
          <Brand
            variant="default"
            size="small"
          />
        </AppHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </AppHeader.Start>
      <AppHeader.Center />
      <AppHeader.End>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            variant="square"
          />
        </button>
      </AppHeader.End>
    </AppHeader>

    <main
      class="animate-page-enter motion-reduce:animate-none relative flex min-w-0 flex-1 flex-col overflow-hidden lg:min-h-0"
    >
      <div class="flex min-h-0 flex-1 flex-col overflow-auto lg:overflow-hidden">
        <div class="layout-boundary flex flex-col lg:min-h-0 lg:flex-1">
          <PageHeader
            title="Start a new project"
            size="large"
          >
            <template #description>
              Start from a repository or use a framework template. You can also upload your project:
              select a
              <Button
                variant="link"
                label="file"
                @click="openFilePicker"
              />
              or a
              <Button
                variant="link"
                label="folder"
                @click="openFolderPicker"
              />.
              <input
                ref="fileInputEl"
                type="file"
                multiple
                class="sr-only"
                tabindex="-1"
                aria-hidden="true"
                @change="onPick"
              />
              <input
                ref="folderInputEl"
                type="file"
                webkitdirectory
                class="sr-only"
                tabindex="-1"
                aria-hidden="true"
                @change="onPick"
              />
            </template>
          </PageHeader>

          <div
            class="layout-section-start flex flex-col gap-(--layout-boundary-start) lg:min-h-0 lg:flex-1 lg:flex-row lg:gap-(--layout-section-gap)"
          >
            <section
              class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1"
            >
              <header class="flex min-h-(--size-8) items-center px-(--spacing-xs)">
                <h2 class="text-heading-2xs text-(--text-default)">Import from GitHub</h2>
              </header>

              <div class="flex flex-col lg:min-h-0 lg:flex-1">
                <div
                  v-if="!accounts.length"
                  class="flex lg:min-h-0 lg:flex-1"
                >
                  <EmptyState
                    bordered
                    size="medium"
                    title="Connect your repository"
                    description="Select a Git provider to connect your repository and start the deployment process."
                    class="w-full"
                  >
                    <template #icon>
                      <span class="relative flex size-10 items-center justify-center">
                        <span
                          aria-hidden="true"
                          class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                        />
                        <span
                          aria-hidden="true"
                          class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                        />
                        <span
                          class="relative flex size-10 items-center justify-center rounded-(--shape-control) border border-(--border-default) bg-(--bg-surface)"
                        >
                          <i
                            class="az az-github text-body-md leading-none text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                    </template>
                    <template #actions>
                      <Button
                        label="Continue with GitHub"
                        icon="az az-github"
                        variant="secondary"
                        size="large"
                        class="self-center"
                        :loading="connecting"
                        @click="(event: MouseEvent) => emit('connect', event)"
                      />
                      <Alert
                        v-if="connectError"
                        severity="danger"
                        size="small"
                        :label="connectError"
                        class="w-full"
                      />
                      <Link
                        label="Manage connected providers"
                        href="#"
                        size="large"
                        class="self-center"
                        @click.prevent
                      />
                    </template>
                  </EmptyState>
                </div>

                <div
                  v-else
                  class="flex flex-col gap-(--layout-group-gap) lg:min-h-0 lg:max-h-full"
                >
                  <div class="flex flex-col gap-(--spacing-sm) sm:flex-row">
                    <div class="shrink-0 sm:w-(--container-3xs)">
                      <Select
                        :model-value="activeScope"
                        aria-label="Git account scope"
                        size="large"
                        :display-value="
                          (value) =>
                            accounts.find((account) => account.value === value)?.label ?? ''
                        "
                        class="w-full"
                        @update:model-value="onSelectScope"
                      >
                        <Select.Trigger>
                          <template #leading>
                            <i
                              class="az az-github text-body-md leading-none shrink-0 text-(--text-default)"
                              aria-hidden="true"
                            />
                          </template>
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Item
                            v-for="account in accounts"
                            :key="account.value"
                            :value="account.value"
                          >
                            {{ account.label }}
                          </Select.Item>
                          <Select.Item
                            value="__add-account__"
                            icon="az az-circle-plus"
                          >
                            Add GitHub account
                          </Select.Item>
                        </Select.Content>
                      </Select>
                    </div>

                    <div class="flex w-full flex-1">
                      <Input
                        v-model="search"
                        size="large"
                        placeholder="Search repositories or paste a repository URL"
                        aria-label="Search repositories or paste a repository URL"
                        class="w-full"
                      >
                        <template #leading>
                          <i class="az az-search" />
                        </template>
                      </Input>
                    </div>
                  </div>

                  <div class="flex lg:min-h-0">
                    <Card
                      :padded="false"
                      class="w-full"
                    >
                      <template #default>
                        <div class="overflow-y-auto overscroll-contain lg:min-h-0">
                          <div
                            v-if="reposFailed"
                            key="repos-failed"
                            class="p-(--spacing-md)"
                          >
                            <Alert
                              severity="danger"
                              :label="error"
                              action-label="Retry"
                              @action="(event: MouseEvent) => emit('retry', event)"
                            />
                          </div>
                          <div
                            v-else-if="reposLoading"
                            key="repos-loading"
                            aria-busy="true"
                          >
                            <p
                              role="status"
                              class="sr-only"
                            >
                              Loading repositories
                            </p>
                            <Item.List aria-hidden="true">
                              <Item
                                v-for="n in skeletonRows"
                                :key="'repo-skeleton-' + n"
                                size="small"
                              >
                                <Item.Media>
                                  <Skeleton
                                    variant="rectangle"
                                    width="1.75rem"
                                    height="1.75rem"
                                  />
                                </Item.Media>
                                <Item.Content>
                                  <div class="flex flex-col gap-(--spacing-xs)">
                                    <Skeleton
                                      width="40%"
                                      height="0.875rem"
                                    />
                                    <Skeleton
                                      width="25%"
                                      height="0.75rem"
                                    />
                                  </div>
                                </Item.Content>
                                <Item.Actions>
                                  <Skeleton
                                    width="4.5rem"
                                    height="1.75rem"
                                  />
                                </Item.Actions>
                              </Item>
                            </Item.List>
                          </div>
                          <div
                            v-else-if="filteredRepos.length"
                            key="repos-list"
                          >
                            <Item.List :aria-label="`Repositories in ${activeScope}`">
                              <Item
                                v-for="repo in shownRepos"
                                :key="repo.name"
                                size="small"
                              >
                                <Item.Media>
                                  <span
                                    class="flex size-7 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                                  >
                                    <i
                                      :class="repo.icon"
                                      class="text-body-md leading-none text-(--text-default)"
                                      aria-hidden="true"
                                    />
                                  </span>
                                </Item.Media>
                                <Item.Content>
                                  <Item.Title>{{ repo.name }}</Item.Title>
                                  <Item.Description>
                                    <span
                                      class="flex items-center gap-(--spacing-2xs) text-body-xs"
                                    >
                                      <i
                                        class="az az-history"
                                        aria-hidden="true"
                                      />
                                      {{ repo.age }}
                                    </span>
                                  </Item.Description>
                                </Item.Content>
                                <Item.Actions>
                                  <Button
                                    label="Import"
                                    variant="secondary"
                                    size="small"
                                    :aria-label="`Import ${repo.name}`"
                                    @click="(event: MouseEvent) => emit('import', event, repo)"
                                  />
                                </Item.Actions>
                              </Item>
                            </Item.List>
                            <div
                              v-if="hiddenRepoCount > 0"
                              class="flex justify-center border-t border-(--border-muted) p-(--spacing-sm)"
                            >
                              <Button
                                :label="`Load more (${hiddenRepoCount})`"
                                variant="ghost"
                                size="small"
                                @click="showMoreRepos"
                              />
                            </div>
                          </div>
                          <EmptyState
                            v-else
                            size="small"
                            icon="az az-search"
                            title="No repositories match"
                            :description="`Nothing in ${activeScope} is named like “${search}”.`"
                          >
                            <template #actions>
                              <Button
                                label="Clear search"
                                variant="outline"
                                size="small"
                                @click="clearSearch"
                              />
                            </template>
                          </EmptyState>
                        </div>
                      </template>
                    </Card>
                  </div>
                </div>
              </div>
            </section>

            <section
              class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1"
            >
              <div class="flex flex-col gap-(--spacing-sm)">
                <div
                  class="flex min-h-(--size-8) flex-wrap items-center justify-between gap-(--spacing-md)"
                >
                  <h2 class="px-(--spacing-xs) text-heading-2xs text-(--text-default)">
                    Start from template
                  </h2>

                  <div class="flex w-full shrink-0 items-center sm:w-(--container-3xs)">
                    <Input
                      v-model="templateSearch"
                      size="medium"
                      placeholder="Search templates"
                      aria-label="Search templates"
                      class="w-full"
                    >
                      <template #leading>
                        <i class="az az-search" />
                      </template>
                    </Input>
                  </div>
                </div>
              </div>

              <div class="lg:flex lg:min-h-0 lg:flex-1 lg:flex-col">
                <div class="flex lg:min-h-0 lg:flex-1">
                  <ScrollArea
                    fade
                    aria-label="Start from template results"
                    class="w-full"
                  >
                    <div class="pb-(--spacing-2xs) pe-(--spacing-2xs)">
                      <EmptyState
                        v-if="!filteredSections.length"
                        size="small"
                        icon="az az-search"
                        title="No templates match"
                        :description="`Nothing is named like “${templateSearch}”.`"
                      >
                        <template #actions>
                          <Button
                            label="Clear search"
                            variant="outline"
                            size="small"
                            @click="clearTemplateSearch"
                          />
                        </template>
                      </EmptyState>
                      <div
                        v-else
                        class="flex flex-col gap-(--layout-section-gap)"
                      >
                        <section
                          v-for="section in filteredSections"
                          :key="section.id"
                          class="flex flex-col gap-(--layout-group-gap)"
                        >
                          <h3 class="px-(--spacing-xs) text-label-sm text-(--text-muted)">
                            {{ section.label }}
                          </h3>

                          <div
                            v-if="section.kind === 'list'"
                            class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2"
                          >
                            <IntegrationCard
                              v-for="item in section.items"
                              :key="item.slug"
                              :title="item.title"
                              :logo="`${item.icon} ${item.markClass}`.trim()"
                              :vendor="item.vendor ?? ''"
                              :description="item.description"
                              :href="templateHref(item)"
                            />
                          </div>

                          <div
                            v-else
                            class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
                          >
                            <div
                              v-for="item in section.items"
                              :key="item.slug"
                              class="flex group relative min-h-(--size-44)"
                            >
                              <Card class="w-full">
                                <template #default>
                                  <div class="isolate flex flex-1 flex-col">
                                    <span
                                      aria-hidden="true"
                                      class="pointer-events-none absolute inset-0 -z-1 overflow-hidden rounded-(--shape-card) opacity-0 transition-opacity duration-moderate-01 ease-productive-entrance group-focus-within:opacity-100 group-hover:opacity-100 motion-reduce:transition-none"
                                    >
                                      <i
                                        :class="[item.icon, item.markClass]"
                                        class="absolute start-(--spacing-xl) top-(--spacing-xl) scale-600 text-body-lg leading-none text-(--primary) opacity-25 blur-sm"
                                      />
                                    </span>
                                    <div
                                      class="relative z-10 flex flex-col items-start gap-(--spacing-md) text-start"
                                    >
                                      <span
                                        class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                                      >
                                        <i
                                          :class="[item.icon, item.markClass]"
                                          class="text-body-lg leading-none text-(--text-default) grayscale transition duration-moderate-01 ease-productive-entrance group-focus-within:grayscale-0 group-hover:grayscale-0 motion-reduce:transition-none"
                                          aria-hidden="true"
                                        />
                                      </span>
                                      <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                                        <h4 class="text-label-md text-(--text-default)">
                                          <a
                                            :href="templateHref(item)"
                                            class="text-(--text-default) no-underline outline-none after:absolute after:inset-0 after:z-20 after:rounded-(--shape-card) after:content-[''] focus-visible:after:ring-2 focus-visible:after:ring-inset focus-visible:after:ring-(--ring-color)"
                                          >
                                            {{ item.title }}
                                          </a>
                                        </h4>
                                        <p class="text-pretty text-body-sm text-(--text-muted)">
                                          {{ item.description }}
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </template>
                              </Card>
                            </div>
                          </div>
                        </section>
                      </div>
                    </div>
                  </ScrollArea>
                </div>
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

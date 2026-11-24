<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import AppHeader from '@aziontech/webkit/app-header'
  import AppHeaderAccount from '@aziontech/webkit/app-header-account'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb-root'
  import Button from '@aziontech/webkit/button'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import Select from '@aziontech/webkit/select'
  import { useFilePicker } from '@aziontech/webkit/use-file-picker'
  import { computed, ref } from 'vue'

  import RepositoryList from './parts/repository-list.vue'
  import TemplateGallery from './parts/template-gallery.vue'
  import { sampleRepositories, sampleTemplates } from './sample'
  import type { CreateHubAccount, CreateHubRepository, CreateHubTemplateSection } from './types'

  export type {
    CreateHubAccount,
    CreateHubRepository,
    CreateHubTemplate,
    CreateHubTemplateSection,
    CreateHubTemplateSectionKind
  } from './types'

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

  const search = ref('')
  const filePicker = useFilePicker({ multiple: true })
  const folderPicker = useFilePicker({ directory: true })

  const accounts = computed(() => props.accounts)
  const activeScope = computed(() => scope.value || props.accounts[0]?.value || '')
  const repos = computed<CreateHubRepository[]>(
    () => props.repositories ?? (props.loading || props.error ? [] : sampleRepositories)
  )
  const sections = computed<CreateHubTemplateSection[]>(() => props.templates ?? sampleTemplates)

  const onSelectScope = (value: string) => {
    if (!value || value === '__add-account__' || value === activeScope.value) return
    scope.value = value
  }

  const filteredRepos = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return repos.value
    return repos.value.filter((repo) => repo.name.toLowerCase().includes(q))
  })
  const clearSearch = () => {
    search.value = ''
  }

  const pickFrom = async (event: MouseEvent, picker: typeof filePicker) => {
    const picked = await picker.open()
    if (picked.length) emit('upload', event, picked)
  }
  const openFilePicker = (event: MouseEvent) => pickFrom(event, filePicker)
  const openFolderPicker = (event: MouseEvent) => pickFrom(event, folderPicker)
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
        <AppHeaderAccount
          name="name@example.com"
          aria-label="Account settings"
        />
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
            </template>
          </PageHeader>

          <div
            class="layout-section-start flex flex-col gap-(--layout-boundary-start) lg:min-h-0 lg:flex-1 lg:flex-row lg:gap-(--layout-section-gap)"
          >
            <section
              class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1"
            >
              <header class="flex min-h-(--size-8) items-center">
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
                      <div
                        v-if="connectError"
                        class="w-(--container-xs) max-w-full"
                        data-testid="create-hub__connect-error"
                      >
                        <Alert
                          severity="danger"
                          size="small"
                          :label="connectError"
                        />
                      </div>
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

                  <RepositoryList
                    :repositories="filteredRepos"
                    :query="search"
                    :scope="activeScope"
                    :loading="loading"
                    :error="error"
                    @import="
                      (event: MouseEvent, repository: CreateHubRepository) =>
                        emit('import', event, repository)
                    "
                    @retry="(event: MouseEvent) => emit('retry', event)"
                    @clear-search="clearSearch"
                  />
                </div>
              </div>
            </section>

            <TemplateGallery :sections="sections" />
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

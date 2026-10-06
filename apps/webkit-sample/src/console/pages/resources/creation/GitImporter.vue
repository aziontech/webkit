<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, onBeforeUnmount, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import GitProviderConnect from '../../../components/creation/GitProviderConnect.vue'
  import {
    connectGitProvider,
    GIT_PROVIDER,
    gitAccounts,
    gitConnected
  } from '../../../lib/state/git-provider'

  const route = useRoute()
  const router = useRouter()

  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const importRepo = (repo) =>
    router.push({
      path: '/deploy',
      query: {
        email: userEmail.value,
        repo: repo.name,
        owner: scope.value,
        framework: repo.tech
      }
    })

  const search = ref('')

  const reposLoading = ref(false)

  let reposTimer = null

  const loadRepos = () => {
    reposLoading.value = true
    if (reposTimer) clearTimeout(reposTimer)
    reposTimer = setTimeout(() => {
      reposLoading.value = false
    }, 900)
  }

  const scope = ref('')

  const selectScope = (value) => {
    if (!value || value === scope.value) return
    scope.value = value
    loadRepos()
  }

  const ADD_ACCOUNT = '__add-account__'

  const linkAccount = async () => {
    selectScope(await connectGitProvider())
  }

  const onSelectScope = (value) => {
    if (value === ADD_ACCOUNT) {
      linkAccount()
      return
    }
    selectScope(value)
  }

  watch(
    gitAccounts,
    (accounts) => {
      if (!accounts.length) return
      if (accounts.some((account) => account.value === scope.value)) return
      selectScope(accounts[0].value)
    },
    { immediate: true }
  )

  const listScroll = ref(null)
  const listHeight = ref(0)
  let listObserver = null

  const SKELETON_ROW_HEIGHT = 60

  const skeletonRowCount = computed(() =>
    Math.max(6, Math.floor(listHeight.value / SKELETON_ROW_HEIGHT))
  )

  watch(listScroll, (el) => {
    listObserver?.disconnect()
    listObserver = null
    if (!el) return
    listObserver = new ResizeObserver(([entry]) => {
      listHeight.value = entry.contentRect.height
    })
    listObserver.observe(el)
  })

  onBeforeUnmount(() => {
    if (reposTimer) clearTimeout(reposTimer)
    listObserver?.disconnect()
  })

  const repos = [
    { name: 'next-js-boilerplate', age: '2 hours ago', tech: 'next', icon: 'ai-cor ai-next' },
    { name: 'azion-docs-site', age: '5 hours ago', tech: 'astro', icon: 'ai-cor ai-astro' },
    { name: 'edge-functions-playground', age: 'yesterday', tech: 'vue', icon: 'ai-cor ai-vue' },
    { name: 'storefront-checkout', age: '3 days ago', tech: 'react', icon: 'ai-cor ai-react' },
    {
      name: 'observability-dashboard',
      age: '6 days ago',
      tech: 'svelte',
      icon: 'ai-cor ai-svelte'
    },
    { name: 'marketing-landing', age: '2 weeks ago', tech: 'nuxt', icon: 'ai-cor ai-nuxt' },
    { name: 'internal-admin', age: 'last month', tech: 'angular', icon: 'ai-cor ai-angular' }
  ]

  const filteredRepos = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return repos
    return repos.filter((r) => r.name.toLowerCase().includes(q))
  })
</script>

<template>
  <section class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1">
    <header class="flex min-h-(--size-8) items-center px-(--spacing-xs)">
      <h2 class="text-heading-xxs text-(--text-default)">Import from GitHub</h2>
    </header>

    <div class="flex flex-col lg:min-h-0 lg:flex-1">
      <GitProviderConnect
        v-if="!gitConnected"
        class="lg:min-h-0 lg:flex-1"
      />

      <div
        v-else
        class="flex flex-col gap-(--layout-group-gap) lg:min-h-0 lg:max-h-full"
      >
        <div class="flex flex-col gap-(--spacing-sm) sm:flex-row">
          <Select
            :model-value="scope"
            aria-label="Git account scope"
            size="large"
            :display-value="(v) => gitAccounts.find((s) => s.value === v)?.label ?? ''"
            @update:model-value="onSelectScope"
            class="shrink-0 sm:w-(--container-3xs)"
          >
            <Select.Trigger>
              <template #iconLeft>
                <i
                  :class="GIT_PROVIDER.icon"
                  class="text-body-md leading-none shrink-0 text-(--text-default)"
                  aria-hidden="true"
                />
              </template>
            </Select.Trigger>
            <Select.Content>
              <Select.Option
                v-for="s in gitAccounts"
                :key="s.value"
                :value="s.value"
              >
                {{ s.label }}
              </Select.Option>
              <Select.Option
                :value="ADD_ACCOUNT"
                icon="pi pi-plus-circle"
              >
                Add {{ GIT_PROVIDER.label }} Account
              </Select.Option>
            </Select.Content>
          </Select>

          <InputText
            v-model="search"
            size="large"
            placeholder="Search project or enter a Git Repository URL"
            aria-label="Search project or enter a Git Repository URL"
            class="w-full flex-1"
          >
            <template #iconLeft>
              <i class="pi pi-search" />
            </template>
          </InputText>
        </div>

        <CardBox
          :padded="false"
          class="lg:min-h-0"
        >
          <template #content>
            <div
              ref="listScroll"
              class="overflow-y-auto overscroll-contain lg:min-h-0"
            >
              <Item.List
                v-if="reposLoading"
                key="repos-loading"
                aria-busy="true"
              >
                <Item
                  v-for="n in skeletonRowCount"
                  :key="`repo-skeleton-${n}`"
                  size="small"
                >
                  <Item.Media>
                    <Skeleton
                      kind="shape"
                      width="1.75rem"
                      height="1.75rem"
                    />
                  </Item.Media>
                  <Item.Content class="gap-(--spacing-xs)">
                    <Skeleton
                      width="40%"
                      height="0.875rem"
                    />
                    <Skeleton
                      width="25%"
                      height="0.75rem"
                    />
                  </Item.Content>
                  <Item.Actions>
                    <Skeleton
                      width="4.5rem"
                      height="1.75rem"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
              <Item.List
                v-else-if="filteredRepos.length"
                key="repos-list"
              >
                <Item
                  v-for="(repo, i) in filteredRepos"
                  :key="`${repo.name}-${i}`"
                  size="small"
                >
                  <Item.Media>
                    <span
                      class="flex size-7 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
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
                    <Item.Description class="flex items-center gap-(--spacing-xxs) text-body-xs">
                      <i
                        class="pi pi-history"
                        aria-hidden="true"
                      />
                      {{ repo.age }}
                    </Item.Description>
                  </Item.Content>
                  <Item.Actions>
                    <Button
                      label="Import"
                      kind="secondary"
                      size="small"
                      @click="importRepo(repo)"
                    />
                  </Item.Actions>
                </Item>
              </Item.List>
              <p
                v-else
                class="px-(--spacing-md) py-(--spacing-lg) text-center text-body-sm text-(--text-muted)"
              >
                No repositories match “{{ search }}”.
              </p>
            </div>
          </template>
        </CardBox>
      </div>
    </div>
  </section>
</template>

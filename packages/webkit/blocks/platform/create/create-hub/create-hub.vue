<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Brand from '@aziontech/webkit/brand'
  import Breadcrumb from '@aziontech/webkit/breadcrumb'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import GlobalHeader from '@aziontech/webkit/global-header'
  import IconButton from '@aziontech/webkit/icon-button'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import PageHeader from '@aziontech/webkit/page-header'
  import ScrollArea from '@aziontech/webkit/scroll-area'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, ref } from 'vue'

  interface Account {
    label: string
    value: string
  }
  interface HubItem {
    slug: string
    title: string
    description: string
    vendor?: string
    icon: string
    markClass: string
  }
  interface HubSection {
    id: string
    label: string
    kind: 'cards' | 'list'
    items: HubItem[]
  }

  const breadcrumb = [{ label: 'Creation Center', current: true }]
  const ACCOUNTS: Account[] = [
    { label: 'jane-doe', value: 'jane-doe' },
    { label: 'acme', value: 'acme' },
    { label: 'acme-labs', value: 'acme-labs' }
  ]
  const repos = [
    { name: 'next-js-boilerplate', age: '2 hours ago', icon: 'ai-cor ai-next' },
    { name: 'docs-site', age: '5 hours ago', icon: 'ai-cor ai-astro' },
    { name: 'api-playground', age: 'yesterday', icon: 'ai-cor ai-vue' },
    { name: 'storefront-checkout', age: '3 days ago', icon: 'ai-cor ai-react' },
    { name: 'observability-dashboard', age: '6 days ago', icon: 'ai-cor ai-svelte' },
    { name: 'marketing-landing', age: '2 weeks ago', icon: 'ai-cor ai-nuxt' },
    { name: 'internal-admin', age: 'last month', icon: 'ai-cor ai-angular' }
  ]
  const sections: HubSection[] = [
    {
      id: 'recommended',
      label: 'Recommended',
      kind: 'cards',
      items: [
        {
          slug: 'next-boilerplate',
          title: 'Next.js Boilerplate',
          description: 'Deploy a full-stack Next.js application in a few steps.',
          icon: 'ai-cor ai-next',
          markClass: '[[data-theme=dark]_&]:invert'
        },
        {
          slug: 'react-boilerplate',
          title: 'React Boilerplate',
          description: 'Automate your React.js deployment process.',
          icon: 'ai-cor ai-react',
          markClass: ''
        },
        {
          slug: 'vue-boilerplate',
          title: 'Vue.js starter',
          description: 'A lightweight template to rapidly build Vue.js applications.',
          icon: 'ai-cor ai-vue',
          markClass: ''
        },
        {
          slug: 'angular-boilerplate',
          title: 'Angular Boilerplate',
          description: 'Automate your Angular deployment process with this template.',
          icon: 'ai-cor ai-angular',
          markClass: ''
        },
        {
          slug: 'nuxt-ecommerce',
          title: 'Nuxt E-commerce',
          description: 'Launch a Nuxt e-commerce or content app.',
          icon: 'ai-cor ai-nuxt',
          markClass: ''
        },
        {
          slug: 'astro-starter',
          title: 'Astro Starter',
          description: 'Ship a content-driven Astro site that renders.',
          icon: 'ai-cor ai-astro',
          markClass: ''
        },
        {
          slug: 'svelte-boilerplate',
          title: 'Svelte Boilerplate',
          description: 'Accelerate the deployment of Svelte applications.',
          icon: 'ai-cor ai-svelte',
          markClass: ''
        },
        {
          slug: 'preact-starter',
          title: 'Preact Starter',
          description: 'Deploy a Preact app: the React API in a fraction of the bundle.',
          icon: 'ai ai-preact',
          markClass: ''
        },
        {
          slug: 'qwik-starter',
          title: 'Qwik Starter',
          description: 'Ship a resumable Qwik app that hydrates only what the reader touches.',
          icon: 'ai ai-qwik',
          markClass: ''
        }
      ]
    },
    {
      id: 'starters',
      label: 'Starter templates',
      kind: 'list',
      items: [
        {
          slug: 'static-site',
          title: 'Static Site',
          description: 'Publish a folder of built files and serve it as-is.',
          vendor: 'Acme',
          icon: 'pi pi-file',
          markClass: ''
        },
        {
          slug: 'reverse-proxy',
          title: 'Reverse Proxy',
          description: 'Front an origin you already run and pass its traffic on.',
          vendor: 'Acme',
          icon: 'pi pi-server',
          markClass: ''
        },
        {
          slug: 'api-service',
          title: 'API Service',
          description: 'Run a small HTTP API with routing and JSON responses.',
          vendor: 'Acme',
          icon: 'pi pi-code',
          markClass: ''
        },
        {
          slug: 'scheduled-job',
          title: 'Scheduled Job',
          description: 'Run a task on a schedule, with its runs and logs kept.',
          vendor: 'Acme',
          icon: 'pi pi-clock',
          markClass: ''
        },
        {
          slug: 'ai-inference',
          title: 'AI Inference',
          description: 'Serve a model behind an endpoint that streams its answers.',
          vendor: 'Acme',
          icon: 'pi pi-bolt',
          markClass: ''
        },
        {
          slug: 'image-optimization',
          title: 'Image Optimization',
          description: 'Resize and compress images on request, cached after the first.',
          vendor: 'Acme',
          icon: 'pi pi-image',
          markClass: ''
        },
        {
          slug: 'storefront',
          title: 'Storefront',
          description: 'A server-rendered commerce storefront with cart and checkout.',
          vendor: 'Acme',
          icon: 'pi pi-shopping-cart',
          markClass: ''
        },
        {
          slug: 'multi-tenant-app',
          title: 'Multi-tenant App',
          description: 'One codebase that serves each tenant on its own domain.',
          vendor: 'Acme',
          icon: 'pi pi-users',
          markClass: ''
        },
        {
          slug: 'auth-gateway',
          title: 'Auth Gateway',
          description: 'Check a token before a request reaches the service behind it.',
          vendor: 'Acme',
          icon: 'pi pi-lock',
          markClass: ''
        },
        {
          slug: 'database-app',
          title: 'Database App',
          description: 'A starter wired to a database, with a table and its queries.',
          vendor: 'Acme',
          icon: 'pi pi-database',
          markClass: ''
        },
        {
          slug: 'blog',
          title: 'Blog',
          description: 'A content site with posts, tags and a feed.',
          vendor: 'Community',
          icon: 'pi pi-pencil',
          markClass: ''
        },
        {
          slug: 'landing-page',
          title: 'Landing Page',
          description: 'A single page with a hero, features and a sign-up form.',
          vendor: 'Community',
          icon: 'pi pi-desktop',
          markClass: ''
        },
        {
          slug: 'docs-site',
          title: 'Documentation Site',
          description: 'Searchable docs with versioned sections.',
          vendor: 'Community',
          icon: 'pi pi-book',
          markClass: ''
        },
        {
          slug: 'status-page',
          title: 'Status Page',
          description: 'Publish uptime and incidents for the services you run.',
          vendor: 'Community',
          icon: 'pi pi-chart-line',
          markClass: ''
        }
      ]
    },
    {
      id: 'frameworks',
      label: 'All frameworks',
      kind: 'list',
      items: [
        {
          slug: 'opennextjs-starter',
          title: 'OpenNext Starter',
          description: 'Deploy Next.js through the OpenNext adapter, server routes included.',
          vendor: '',
          icon: 'ai-cor ai-next',
          markClass: '[[data-theme=dark]_&]:invert'
        },
        {
          slug: 'nitro-starter',
          title: 'Nitro Starter',
          description: 'Deploy a Nitro server build, the engine behind Nuxt, on its own.',
          vendor: '',
          icon: 'pi pi-server',
          markClass: ''
        },
        {
          slug: 'gatsby-starter',
          title: 'Gatsby Starter',
          description: 'Publish a Gatsby site built at deploy time and served worldwide.',
          vendor: '',
          icon: 'ai ai-gatsby',
          markClass: ''
        },
        {
          slug: 'docusaurus-starter',
          title: 'Docusaurus Starter',
          description: 'Publish a Docusaurus documentation site.',
          vendor: '',
          icon: 'ai ai-docusaurus',
          markClass: ''
        },
        {
          slug: 'vitepress-starter',
          title: 'VitePress Starter',
          description: 'Publish a VitePress documentation site.',
          vendor: '',
          icon: 'ai ai-vitepress',
          markClass: ''
        },
        {
          slug: 'vuepress-starter',
          title: 'VuePress Starter',
          description: 'Publish a VuePress documentation site.',
          vendor: '',
          icon: 'ai ai-vuepress',
          markClass: ''
        },
        {
          slug: 'hugo-starter',
          title: 'Hugo Starter',
          description: 'Deploy a Hugo site with thousands of pages built in seconds.',
          vendor: '',
          icon: 'ai ai-hugo',
          markClass: ''
        },
        {
          slug: 'jekyll-starter',
          title: 'Jekyll Starter',
          description: 'Publish a Jekyll site straight from its source.',
          vendor: '',
          icon: 'ai ai-jekyll',
          markClass: ''
        },
        {
          slug: 'hexo-starter',
          title: 'Hexo Starter',
          description: 'Publish a Hexo blog.',
          vendor: '',
          icon: 'ai ai-hexo',
          markClass: ''
        },
        {
          slug: 'eleventy-starter',
          title: 'Eleventy Starter',
          description: 'Publish an Eleventy site with no framework runtime shipped to the reader.',
          vendor: '',
          icon: 'ai ai-eleventy',
          markClass: ''
        },
        {
          slug: 'stencil-starter',
          title: 'Stencil Starter',
          description: 'Build framework-agnostic web components with Stencil.',
          vendor: '',
          icon: 'pi pi-code',
          markClass: ''
        },
        {
          slug: 'html-starter',
          title: 'Static HTML Starter',
          description: 'Serve a folder of HTML, CSS and JavaScript with no build step.',
          vendor: '',
          icon: 'ai-cor ai-html',
          markClass: ''
        },
        {
          slug: 'javascript-starter',
          title: 'JavaScript Starter',
          description: 'Run plain JavaScript with no framework, only a handler.',
          vendor: '',
          icon: 'ai-cor ai-js',
          markClass: ''
        },
        {
          slug: 'typescript-starter',
          title: 'TypeScript Starter',
          description: 'Run a TypeScript handler, compiled on build.',
          vendor: '',
          icon: 'ai-cor ai-ts',
          markClass: ''
        },
        {
          slug: 'rustwasm-starter',
          title: 'Rust WASM Starter',
          description: 'Compile Rust to WebAssembly and run it.',
          vendor: '',
          icon: 'pi pi-microchip',
          markClass: ''
        },
        {
          slug: 'emscripten-starter',
          title: 'Emscripten Starter',
          description: 'Bring C or C++, compiled to WebAssembly with Emscripten.',
          vendor: '',
          icon: 'pi pi-microchip',
          markClass: ''
        }
      ]
    }
  ]
  const skeletonRows = 6

  const accounts = ref<Account[]>([])
  const connecting = ref(false)
  const scope = ref('')
  const reposLoading = ref(false)
  const search = ref('')

  const loadRepos = () => {
    reposLoading.value = true
    setTimeout(() => {
      reposLoading.value = false
    }, 900)
  }

  const connect = () => {
    connecting.value = true
    setTimeout(() => {
      connecting.value = false
      accounts.value = ACCOUNTS
      scope.value = ACCOUNTS[0].value
      loadRepos()
    }, 1500)
  }

  const onSelectScope = (value: string) => {
    if (!value || value === '__add-account__' || value === scope.value)
      return
    scope.value = value
    loadRepos()
  }

  const filteredRepos = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return repos
    return repos.filter((repo) => repo.name.toLowerCase().includes(q))
  })
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
    <GlobalHeader aria-label="Console">
      <GlobalHeader.Left>
        <IconButton
          icon="pi pi-chevron-left"
          aria-label="Back to Home"
          kind="outlined"
          size="small"
        />
        <GlobalHeader.Brand>
          <a
            href="/home"
            aria-label="Azion home"
            class="inline-flex shrink-0 items-center self-center rounded-(--shape-elements) transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
          >
            <Brand
              kind="default"
              size="small"
            />
          </a>
        </GlobalHeader.Brand>
        <Breadcrumb :items="breadcrumb" />
      </GlobalHeader.Left>
      <GlobalHeader.Middle />
      <GlobalHeader.Right>
        <button
          type="button"
          aria-label="Account settings"
          class="rounded-full transition-opacity duration-fast-02 ease-productive-entrance hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-surface) motion-reduce:transition-none"
        >
          <Avatar
            label="name@example.com"
            size="medium"
            kind="square"
          />
        </button>
      </GlobalHeader.Right>
    </GlobalHeader>

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
              Start from a repository or use a framework template. You can also drag and drop your
              project, or select a
              <Button
                kind="link"
                label="file"
              />
              or a
              <Button
                kind="link"
                label="folder"
              />.
            </template>
          </PageHeader>

          <div
            class="layout-section-start flex flex-col gap-(--layout-boundary-start) lg:min-h-0 lg:flex-1 lg:flex-row lg:gap-(--layout-section-gap)"
          >
            <section
              class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1"
            >
              <header class="flex min-h-(--size-8) items-center px-(--spacing-xs)">
                <h2 class="text-heading-xxs text-(--text-default)">Import from GitHub</h2>
              </header>

              <div class="flex flex-col lg:min-h-0 lg:flex-1">
                <div
                  v-if="!accounts.length"
                  class="flex lg:min-h-0 lg:flex-1"
                >
                  <Card class="w-full">
                    <template #content>
                      <div
                        class="flex rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) lg:min-h-0 lg:flex-1"
                      >
                        <EmptyState
                          size="medium"
                          title="Connect your repository"
                          description="Select a Git provider to connect your repository and start the deployment process."
                          class="w-full"
                        >
                          <template #icon>
                            <span class="relative flex size-10 items-center justify-center">
                              <span
                                aria-hidden="true"
                                class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-(--border-strong) bg-(--bg-canvas) opacity-5"
                              />
                              <span
                                aria-hidden="true"
                                class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-card) border border-(--border-strong) bg-(--bg-canvas) opacity-10"
                              />
                              <span
                                class="relative flex size-10 items-center justify-center rounded-(--shape-elements) border border-(--border-default) bg-(--bg-surface)"
                              >
                                <i
                                  class="ai ai-github text-body-md leading-none text-(--text-default)"
                                  aria-hidden="true"
                                />
                              </span>
                            </span>
                          </template>
                          <template #actions>
                            <Button
                              label="Continue with GitHub"
                              icon="ai ai-github"
                              kind="secondary"
                              size="large"
                              class="self-center"
                              :loading="connecting"
                              @click="connect"
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
                    </template>
                  </Card>
                </div>

                <div
                  v-else
                  class="flex flex-col gap-(--layout-group-gap) lg:min-h-0 lg:max-h-full"
                >
                  <div class="flex flex-col gap-(--spacing-sm) sm:flex-row">
                    <div class="shrink-0 sm:w-(--container-3xs)">
                      <Select
                        :model-value="scope"
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
                          <template #iconLeft>
                            <i
                              class="ai ai-github text-body-md leading-none shrink-0 text-(--text-default)"
                              aria-hidden="true"
                            />
                          </template>
                        </Select.Trigger>
                        <Select.Content>
                          <Select.Option
                            v-for="account in accounts"
                            :key="account.value"
                            :value="account.value"
                          >
                            {{ account.label }}
                          </Select.Option>
                          <Select.Option
                            value="__add-account__"
                            icon="pi pi-plus-circle"
                          >
                            Add GitHub account
                          </Select.Option>
                        </Select.Content>
                      </Select>
                    </div>

                    <div class="flex w-full flex-1">
                      <Input
                        v-model="search"
                        size="large"
                        placeholder="Search projects or enter a Git repository URL"
                        aria-label="Search projects or enter a Git repository URL"
                        class="w-full"
                      >
                        <template #iconLeft>
                          <i class="pi pi-search" />
                        </template>
                      </Input>
                    </div>
                  </div>

                  <div class="flex lg:min-h-0">
                    <Card
                      :padded="false"
                      class="w-full"
                    >
                      <template #content>
                        <div class="overflow-y-auto overscroll-contain lg:min-h-0">
                          <Item.List
                            v-if="reposLoading"
                            key="repos-loading"
                            aria-busy="true"
                          >
                            <Item
                              v-for="n in skeletonRows"
                              :key="'repo-skeleton-' + n"
                              size="small"
                            >
                              <Item.Media>
                                <Skeleton
                                  kind="shape"
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
                          <Item.List
                            v-else-if="filteredRepos.length"
                            key="repos-list"
                          >
                            <Item
                              v-for="repo in filteredRepos"
                              :key="repo.name"
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
                                <Item.Description>
                                  <span class="flex items-center gap-(--spacing-xxs) text-body-xs">
                                    <i
                                      class="pi pi-history"
                                      aria-hidden="true"
                                    />
                                    {{ repo.age }}
                                  </span>
                                </Item.Description>
                              </Item.Content>
                              <Item.Actions>
                                <Button
                                  label="Import"
                                  kind="secondary"
                                  size="small"
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
                  <p class="px-(--spacing-xs) text-heading-xxs text-(--text-default)">
                    Start from template
                  </p>

                  <div class="flex shrink-0 items-center">
                    <Button
                      label="Filter"
                      kind="outlined"
                      size="medium"
                      icon="pi pi-filter"
                    />
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
                    <div class="pb-(--spacing-xxs) pe-(--spacing-xxs)">
                      <div class="flex flex-col gap-(--layout-section-gap)">
                        <section
                          v-for="section in sections"
                          :key="section.id"
                          class="flex flex-col gap-(--layout-group-gap)"
                        >
                          <p class="px-(--spacing-xs) text-label-sm text-(--text-muted)">
                            {{ section.label }}
                          </p>

                          <div
                            v-if="section.kind === 'list'"
                            class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2"
                          >
                            <div
                              v-for="item in section.items"
                              :key="item.slug"
                              class="group relative cursor-pointer transition-colors duration-moderate-01 ease-productive-entrance motion-reduce:transition-none"
                            >
                              <Card
                                role="button"
                                tabindex="0"
                              >
                                <template #content>
                                  <div class="flex items-start gap-(--spacing-md)">
                                    <span
                                      class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                    >
                                      <i
                                        :class="[item.icon, item.markClass]"
                                        class="text-body-lg leading-none text-(--text-default)"
                                        aria-hidden="true"
                                      />
                                    </span>
                                    <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                                      <div
                                        class="flex flex-wrap items-baseline gap-x-(--spacing-xs)"
                                      >
                                        <h3 class="text-label-md text-(--text-default)">
                                          {{ item.title }}
                                        </h3>
                                        <span
                                          v-if="item.vendor"
                                          class="text-body-xs text-(--text-muted)"
                                          >by {{ item.vendor }}</span
                                        >
                                      </div>
                                      <p class="text-pretty text-body-sm text-(--text-muted)">
                                        {{ item.description }}
                                      </p>
                                    </div>
                                  </div>
                                </template>
                              </Card>
                            </div>
                          </div>

                          <div
                            v-else
                            class="grid grid-cols-1 gap-(--spacing-md) sm:grid-cols-2 lg:grid-cols-3"
                          >
                            <div
                              v-for="item in section.items"
                              :key="item.slug"
                              class="flex group relative min-h-(--size-44) cursor-pointer"
                            >
                              <Card
                                class="w-full"
                                role="button"
                                tabindex="0"
                              >
                                <template #content>
                                  <div
                                    class="relative z-10 flex flex-col items-start gap-(--spacing-md) text-start"
                                  >
                                    <span
                                      class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                                    >
                                      <i
                                        :class="[item.icon, item.markClass]"
                                        class="text-body-lg leading-none text-(--text-default) grayscale transition duration-moderate-01 ease-productive-entrance group-hover:grayscale-0 motion-reduce:transition-none"
                                        aria-hidden="true"
                                      />
                                    </span>
                                    <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
                                      <h3 class="text-label-md text-(--text-default)">
                                        {{ item.title }}
                                      </h3>
                                      <p class="text-pretty text-body-sm text-(--text-muted)">
                                        {{ item.description }}
                                      </p>
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

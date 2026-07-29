<script setup>
  // CreationCenter — the two ways to start a deploy, side by side on one page:
  // import a repository from a connected Git provider, or clone a framework
  // template. Both routes end in the same /deploy flow.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, onBeforeUnmount, onMounted, reactive, ref } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import CreationHeader from './ui/CreationHeader.vue'
  import PageHeading from './ui/PageHeading.vue'
  import TemplateBrowser from './ui/TemplateBrowser.vue'

  const route = useRoute()
  const router = useRouter()

  // Carry the signed-in user across the flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const goHome = () => router.push({ path: '/home', query: { email: userEmail.value } })

  // Map a chosen template to a deploy-flow catalog slug. The template's precise
  // `tech` drives the mapping; techs without a dedicated demo template fall back to
  // the closest available boilerplate.
  const TECH_TO_SLUG = {
    next: 'next-boilerplate',
    react: 'react-boilerplate',
    vue: 'vue-boilerplate',
    angular: 'angular-boilerplate',
    astro: 'astro-starter',
    svelte: 'svelte-boilerplate',
    nuxt: 'nuxt-ecommerce',
    solidjs: 'solidjs-starter',
    redwood: 'redwood-boilerplate',
    flutter: 'flutter-web'
  }

  // Clicking a template card opens the deploy flow with its catalog slug.
  const deployTemplate = (tpl) =>
    router.push({
      path: '/deploy',
      query: {
        email: userEmail.value,
        template: TECH_TO_SLUG[tpl.tech] ?? 'nuxt-ecommerce'
      }
    })

  // Importing a repository routes into the same deploy flow, cloning the selected
  // repo under the current account scope instead of a catalog template.
  const importRepo = (repo) =>
    router.push({
      path: '/deploy',
      query: { email: userEmail.value, repo: repo.name, owner: scope.value }
    })

  const search = ref('')

  // Git provider connection. Starts disconnected, showing the "Connect your
  // Repository" empty state; clicking "Continue with GitHub" runs a brief loading
  // state that simulates the OAuth handshake, then reveals the connected importer
  // (account scope + repos).
  const gitConnected = ref(false)
  const connecting = ref(false)

  // Once connected (or when the account scope changes), the repository list is
  // "fetched": the scope + search chrome appear immediately, but the list itself
  // shows Skeleton rows for a beat so the reveal never pops in blank.
  const reposLoading = ref(false)

  let connectTimer = null
  let reposTimer = null

  const loadRepos = () => {
    reposLoading.value = true
    if (reposTimer) clearTimeout(reposTimer)
    reposTimer = setTimeout(() => {
      reposLoading.value = false
    }, 900)
  }

  const connectGit = () => {
    connecting.value = true
    connectTimer = setTimeout(() => {
      connecting.value = false
      gitConnected.value = true
      loadRepos()
    }, 1500)
  }

  // GitHub is the only connected provider in this prototype. Account scopes are
  // the GitHub accounts the user has linked; the Select lets them add another.
  const scopes = reactive([{ label: 'cesaroeduardo', value: 'cesaroeduardo' }])
  const scope = ref(scopes[0].value)

  // Sentinel value for the trailing "Add GitHub Account" option — selecting it
  // runs the connect flow instead of becoming the chosen scope.
  const ADD_ACCOUNT = '__add-account__'

  // Mock "connect another GitHub account": append a linked account and select it,
  // standing in for the GitHub OAuth flow. Switching scope re-fetches the repos.
  let linkedCount = 0
  const onSelectScope = (value) => {
    if (value !== ADD_ACCOUNT) {
      if (value === scope.value) return
      scope.value = value
      loadRepos()
      return
    }
    linkedCount += 1
    const account = `github-account-${linkedCount}`
    scopes.push({ label: account, value: account })
    scope.value = account
    loadRepos()
  }

  // The importer is content-sized (it no longer stretches to the templates
  // column's height), and it swaps between three very different heights: the
  // "Connect your Repository" empty state, the skeleton rows, then the real list.
  // Snapping between them jumps the layout, so the wrapper's height is animated: a
  // ResizeObserver mirrors the measured content height onto it and CSS eases the
  // change. `overflow-hidden` only while the transition runs, so a focus ring on
  // the first/last control isn't clipped at rest.
  const importerContent = ref(null)
  const importerHeight = ref(null)
  const importerAnimating = ref(false)
  let importerObserver = null

  onMounted(() => {
    if (!importerContent.value) return
    importerObserver = new ResizeObserver(([entry]) => {
      const next = `${entry.contentRect.height}px`
      if (next === importerHeight.value) return
      // The very first measurement only records the height already rendered —
      // animating from `auto` to the same value would be a no-op frame anyway.
      if (importerHeight.value !== null) importerAnimating.value = true
      importerHeight.value = next
    })
    importerObserver.observe(importerContent.value)
  })

  onBeforeUnmount(() => {
    if (connectTimer) clearTimeout(connectTimer)
    if (reposTimer) clearTimeout(reposTimer)
    importerObserver?.disconnect()
  })

  // Mock repositories for the selected account, carrying the colored brand logo
  // (`ai-cor ai-*`) of the framework each was scaffolded from.
  const repos = [{ name: 'next-js-boilerplate', age: '2 hours ago', icon: 'ai-cor ai-next' }]

  const filteredRepos = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return repos
    return repos.filter((r) => r.name.toLowerCase().includes(q))
  })

  // Templates — the full Marketplace framework set. Colored brand logos from
  // @aziontech/icons (`ai-cor ai-*`), each with the framework's brand hex for the
  // soft hover glow. Rendered via the shared TemplateBrowser module.
  const templates = [
    {
      title: 'Next.js Boilerplate',
      description: 'Deploy a full-stack Next.js application to the edge in a few steps.',
      icon: 'ai-cor ai-next',
      color: '#0070f3',
      tech: 'next',
      useCases: ['ai', 'ecommerce', 'marketing']
    },
    {
      title: 'React Boilerplate',
      description: 'Automate your React.js deployment process on the edge.',
      icon: 'ai-cor ai-react',
      color: '#61dafb',
      tech: 'react',
      useCases: ['ai', 'marketing']
    },
    {
      title: 'Vue.js Quick Setup',
      description: 'A lightweight template to rapidly build Vue.js applications on the edge.',
      icon: 'ai-cor ai-vue',
      color: '#42b883',
      tech: 'vue',
      useCases: ['blog', 'marketing']
    },
    {
      title: 'Angular Boilerplate',
      description: 'Automate your Angular deployment process with this template.',
      icon: 'ai-cor ai-angular',
      color: '#dd0031',
      tech: 'angular',
      useCases: ['multi-tenant']
    },
    {
      title: 'Astro Starter',
      description: 'Ship a content-driven Astro site that renders at the edge.',
      icon: 'ai-cor ai-astro',
      color: '#ff5d01',
      tech: 'astro',
      useCases: ['blog', 'marketing']
    },
    {
      title: 'Svelte Boilerplate',
      description: 'Accelerate the deployment of Svelte applications to run on the edge.',
      icon: 'ai-cor ai-svelte',
      color: '#ff3e00',
      tech: 'svelte',
      useCases: ['blog']
    },
    {
      title: 'Nuxt E-commerce',
      description: 'Launch a Nuxt e-commerce or content app on the edge.',
      icon: 'ai-cor ai-nuxt',
      color: '#00dc82',
      tech: 'nuxt',
      useCases: ['ecommerce', 'multi-tenant']
    },
    {
      title: 'SolidJS Starter',
      description: 'Build a fine-grained reactive SolidJS app on the edge.',
      icon: 'ai-cor ai-solidjs',
      color: '#4f88c6',
      tech: 'solidjs',
      useCases: ['ai']
    },
    {
      title: 'RedwoodJS Boilerplate',
      description: 'Deploy a full-stack RedwoodJS application on the edge.',
      icon: 'ai-cor ai-redwood',
      color: '#bf4722',
      tech: 'redwood',
      useCases: ['ecommerce', 'multi-tenant']
    },
    {
      title: 'Flutter Web',
      description: 'Serve a cross-platform Flutter web build from the edge.',
      icon: 'ai-cor ai-flutter',
      color: '#54c5f8',
      tech: 'flutter',
      useCases: ['marketing']
    }
  ]

  // Template filter options — two labelled groups (Use Cases / Technology) fed to
  // the TemplateBrowser module's Filter Dropdown. Option values are unique across
  // both groups, so the group a value belongs to is recoverable from them.
  const useCaseOptions = [
    { value: 'ai', label: 'AI/Agent', icon: 'pi pi-star' },
    { value: 'ecommerce', label: 'Ecommerce', icon: 'pi pi-shopping-cart' },
    { value: 'blog', label: 'Blog', icon: 'pi pi-pencil' },
    { value: 'marketing', label: 'Marketing sites', icon: 'pi pi-megaphone' },
    { value: 'multi-tenant', label: 'Multi-tenant platforms', icon: 'pi pi-sitemap' }
  ]
  const technologyOptions = [
    { value: 'next', label: 'Next.js', icon: 'ai-cor ai-next' },
    { value: 'react', label: 'React', icon: 'ai-cor ai-react' },
    { value: 'vue', label: 'Vue.js', icon: 'ai-cor ai-vue' },
    { value: 'angular', label: 'Angular', icon: 'ai-cor ai-angular' },
    { value: 'astro', label: 'Astro', icon: 'ai-cor ai-astro' },
    { value: 'svelte', label: 'Svelte', icon: 'ai-cor ai-svelte' },
    { value: 'nuxt', label: 'Nuxt', icon: 'ai-cor ai-nuxt' },
    { value: 'solidjs', label: 'SolidJS', icon: 'ai-cor ai-solidjs' },
    { value: 'redwood', label: 'RedwoodJS', icon: 'ai-cor ai-redwood' },
    { value: 'flutter', label: 'Flutter', icon: 'ai-cor ai-flutter' }
  ]
</script>

<template>
  <div class="flex h-dvh flex-col bg-[var(--bg-canvas)]">
    <!-- Global header: back to console, brand + breadcrumb. -->
    <CreationHeader
      :breadcrumb="[{ label: 'Creation Center', current: true }]"
      back-label="Back to Home"
      @back="goHome"
    />

    <!-- Flow content. From `lg` up the page is height-bounded: the whole layout
         fits the viewport and the only scroll box is the template grid (see
         TemplateBrowser's `scrollable`). Below `lg` the two columns stack, so
         the page scrolls normally — a clamped stack would squeeze both halves
         into unusable slivers. -->
    <main class="flex min-w-0 flex-1 flex-col overflow-auto lg:min-h-0 lg:overflow-hidden">
      <div
        class="layout-measure flex flex-col gap-[var(--layout-section-gap)] px-[var(--layout-boundary-inline)] pt-[var(--layout-boundary-start)] lg:min-h-0 lg:flex-1 lg:pb-0"
      >
        <PageHeading
          size="large"
          title="Build on the most reliable network on earth"
          description="Start from a repository or use a framework template."
        />

        <!-- Both ways in are sections on one page, not tabs: they don't exclude
             each other, and a tab bar hid half the entry points behind a click.

             The two columns no longer terminate at the same y: the importer is
             `self-start`, so it is exactly as tall as its content (one card, or
             the scope row plus a short list) and its height animates as that
             content swaps. Stretching it padded a mostly-empty card down the
             viewport just to match the catalog beside it. The templates column
             keeps stretching — it is the one that owns the page's slack. -->
        <div class="flex flex-col gap-[var(--layout-section-gap)] lg:min-h-0 lg:flex-1 lg:flex-row">
          <section
            class="flex w-full min-w-0 flex-col gap-[var(--layout-group-gap)] lg:flex-1 lg:self-start"
          >
            <header class="flex min-h-[var(--size-8)] items-center px-[var(--spacing-xs)]">
              <h2 class="text-heading-xxs text-[var(--text-default)]">Import from Git</h2>
            </header>

            <!-- Height-animated box around the swap: the wrapper follows the
                 measured height of its content (see `importerObserver`), so
                 connecting a provider and loading the repositories eases the
                 column open instead of snapping it. -->
            <div
              class="transition-[height] duration-200 ease-out motion-reduce:transition-none"
              :class="importerAnimating ? 'overflow-hidden' : 'overflow-visible'"
              :style="importerHeight ? { height: importerHeight } : undefined"
              @transitionend.self="importerAnimating = false"
            >
              <div ref="importerContent">
                <!-- Importer: an empty state until a Git provider is connected,
                     then the account scope + repository list. A solid CardBox
                     framing a dashed, raised EmptyState surface (per Figma). -->
                <CardBox v-if="!gitConnected">
                  <template #content>
                    <EmptyState
                      size="medium"
                      title="Connect your Repository"
                      description="Choose a Git provider to connect your repository and start the deployment process."
                      class="rounded-[var(--shape-card)] border border-dashed border-[var(--border-default)] bg-[var(--bg-surface-raised)]"
                    >
                      <template #icon>
                        <!-- Featured icon: a solid GitHub tile framed by two
                             concentric translucent squares. -->
                        <span class="relative flex size-10 items-center justify-center">
                          <span
                            aria-hidden="true"
                            class="absolute left-1/2 top-1/2 size-14 -translate-x-1/2 -translate-y-1/2 rounded-[var(--radius-xl,12px)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-5"
                          />
                          <span
                            aria-hidden="true"
                            class="absolute left-1/2 top-1/2 size-12 -translate-x-1/2 -translate-y-1/2 rounded-[var(--shape-card)] border border-[var(--border-strong)] bg-[var(--bg-canvas)] opacity-10"
                          />
                          <span
                            class="relative flex size-10 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-default)] bg-[var(--bg-surface)]"
                          >
                            <i
                              class="pi pi-github text-[1rem] leading-none text-[var(--text-default)]"
                              aria-hidden="true"
                            />
                          </span>
                        </span>
                      </template>
                      <template #actions>
                        <Button
                          label="Continue with Github"
                          icon="pi pi-github"
                          kind="secondary"
                          size="large"
                          :loading="connecting"
                          @click="connectGit"
                        />
                        <Link
                          label="Manage connected providers"
                          href="#"
                          size="small"
                          @click.prevent
                        />
                      </template>
                    </EmptyState>
                  </template>
                </CardBox>

                <!-- Connected: the account scope + search above the repository
                     list. Both are content-sized — the column grows with the
                     list, and the wrapper above animates that growth. -->
                <div
                  v-else
                  class="flex flex-col gap-[var(--layout-group-gap)]"
                >
                  <!-- Account scope + search -->
                  <div class="flex flex-col gap-[var(--spacing-sm)] sm:flex-row">
                    <Select
                      :model-value="scope"
                      aria-label="Git account scope"
                      size="large"
                      :display-value="(v) => scopes.find((s) => s.value === v)?.label ?? ''"
                      @update:model-value="onSelectScope"
                      class="shrink-0 sm:w-[var(--container-3xs)]"
                    >
                      <Select.Trigger>
                        <template #iconLeft>
                          <i
                            class="pi pi-github text-[1rem] leading-none shrink-0 text-[var(--text-default)]"
                            aria-hidden="true"
                          />
                        </template>
                      </Select.Trigger>
                      <Select.Content>
                        <Select.Option
                          v-for="s in scopes"
                          :key="s.value"
                          :value="s.value"
                        >
                          {{ s.label }}
                        </Select.Option>
                        <Select.Option
                          :value="ADD_ACCOUNT"
                          icon="pi pi-plus-circle"
                        >
                          Add GitHub Account
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

                  <!-- Repository list — Item.List inside a flush CardBox so the
                       row dividers span edge to edge. -->
                  <CardBox :padded="false">
                    <template #content>
                      <!-- Fetching the account's repositories: reserve the row
                           layout with Skeleton rows so the list never pops in
                           blank once the connection settles. -->
                      <Item.List
                        v-if="reposLoading"
                        key="repos-loading"
                        aria-busy="true"
                      >
                        <Item
                          v-for="n in 3"
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
                          <Item.Content>
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
                              class="flex size-7 shrink-0 items-center justify-center rounded-[var(--shape-elements)] border border-[var(--border-muted)] bg-[var(--bg-surface-raised)]"
                            >
                              <i
                                :class="repo.icon"
                                class="text-[1rem] leading-none text-[var(--text-default)]"
                                aria-hidden="true"
                              />
                            </span>
                          </Item.Media>
                          <Item.Content>
                            <Item.Title>{{ repo.name }}</Item.Title>
                            <Item.Description
                              class="flex items-center gap-[var(--spacing-xxs)] text-body-xs"
                            >
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
                        class="px-[var(--spacing-md)] py-[var(--spacing-lg)] text-center text-body-sm text-[var(--text-muted)]"
                      >
                        No repositories match “{{ search }}”.
                      </p>
                    </template>
                  </CardBox>
                </div>
              </div>
            </div>
          </section>

          <!-- Templates: the shared TemplateBrowser module. Its own title row
               is the same height as the header beside it, so the two columns'
               contents start on the same line. `scrollable` makes its grid the
               page's only scroll box, so the catalog can grow without pushing
               the layout past the viewport. -->
          <TemplateBrowser
            class="w-full min-w-0 lg:min-h-0 lg:flex-1"
            scrollable
            title="Start from Template"
            :templates="templates"
            :use-case-options="useCaseOptions"
            :technology-options="technologyOptions"
            grid-class="grid-cols-1 sm:grid-cols-2"
            @select="deployTemplate"
          />
        </div>
      </div>
    </main>
  </div>
</template>

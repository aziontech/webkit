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
  import { computed, onBeforeUnmount, reactive, ref, watch } from 'vue'
  import { useRoute, useRouter } from 'vue-router'

  import TemplateBrowser from '../../components/marketplace/TemplateBrowser.vue'
  import CreationHeader from '../../components/page/CreationHeader.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import {
    deployTemplateRoute,
    FRAMEWORKS,
    technologyOptions,
    useCaseOptions
  } from '../../lib/data/frameworks'

  const route = useRoute()
  const router = useRouter()

  // Carry the signed-in user across the flow (falls back to a placeholder).
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  const goHome = () => router.push({ path: '/home', query: { email: userEmail.value } })

  // Clicking a template card opens the deploy flow with its catalog slug. The
  // tech → slug map moved to ../lib/frameworks.js with the catalog itself: this page
  // is no longer the only screen that offers a framework (Applications' first use
  // offers the same four), and a second copy of either would drift on the first one
  // anybody edits.
  const deployTemplate = (tpl) => {
    const target = deployTemplateRoute(tpl.tech)
    router.push({ path: target.path, query: { ...target.query, email: userEmail.value } })
  }

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

  // The importer's height is the layout's, not the content's: it fills its column
  // beside the catalog, and stacked it is as tall as whatever state is showing.
  // It used to animate between those states — a ResizeObserver mirrored the
  // measured content height onto the wrapper and CSS eased it — which was there to
  // cover the jump from the empty state to a short list. The box no longer jumps:
  // connecting swaps the card's contents inside a box that keeps its size, so the
  // animation had nothing left to smooth and only made the swap feel slower.

  // How many placeholder rows the loading list lays out — measured from the box
  // it is filling, not fixed at three. Reloading an account then reserves the
  // height the list already had, and when the list is long enough to hit the
  // column's ceiling the placeholder fills that whole scroll box.
  const listScroll = ref(null)
  const listHeight = ref(0)
  let listObserver = null

  // One loading row: an Item at `small` carrying a two-line content block —
  // 60px, matching the ~62px a resolved row measures (28px media / two bars
  // spaced by `--spacing-xs` inside `py-(--spacing-sm)`). Being a pixel or two
  // off only decides whether the last row is partly cut — the list scrolls, and
  // a clipped final row reads as "more below" anyway.
  const SKELETON_ROW_HEIGHT = 60

  // Floor of six: stacked, the box is content-sized, so on the very first load
  // there is no height to measure yet and the placeholder is what reserves the
  // space — three rows reserved a third of what arrived and the list snapped open.
  const skeletonRowCount = computed(() =>
    Math.max(6, Math.floor(listHeight.value / SKELETON_ROW_HEIGHT))
  )

  // The scroll box only exists once a provider is connected, so observe it when
  // the ref resolves. Stacked, the box is content-sized, so what it measures is
  // the list already in it — a reload then reserves exactly the height the
  // repositories had, instead of collapsing to the floor and expanding again.
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
    if (connectTimer) clearTimeout(connectTimer)
    if (reposTimer) clearTimeout(reposTimer)
    listObserver?.disconnect()
  })

  // Mock repositories for the selected account, carrying the colored brand logo
  // (`ai-cor ai-*`) of the framework each was scaffolded from. A connected account
  // has more than one repo — the list is what the column's height is for, and one
  // row in a full-height box reads as a broken empty state.
  const repos = [
    { name: 'next-js-boilerplate', age: '2 hours ago', icon: 'ai-cor ai-next' },
    { name: 'azion-docs-site', age: '5 hours ago', icon: 'ai-cor ai-astro' },
    { name: 'edge-functions-playground', age: 'yesterday', icon: 'ai-cor ai-vue' },
    { name: 'storefront-checkout', age: '3 days ago', icon: 'ai-cor ai-react' },
    { name: 'observability-dashboard', age: '6 days ago', icon: 'ai-cor ai-svelte' },
    { name: 'marketing-landing', age: '2 weeks ago', icon: 'ai-cor ai-nuxt' },
    { name: 'internal-admin', age: 'last month', icon: 'ai-cor ai-angular' }
  ]

  const filteredRepos = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return repos
    return repos.filter((r) => r.name.toLowerCase().includes(q))
  })

  // Templates, and the two axes the filter offers — all three now come from
  // ../lib/frameworks.js. This page used to own them, which was right while /create
  // was the only screen that offered a framework; Applications' first use offers the
  // same four (src/product-empty-states.js), so the catalog moved to where both can
  // read it and the filter options are derived from it rather than typed twice.
  const templates = FRAMEWORKS
</script>

<template>
  <div class="flex h-dvh flex-col bg-(--bg-canvas)">
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
    <main
      class="animate-page-enter motion-reduce:animate-none flex min-w-0 flex-1 flex-col overflow-auto lg:min-h-0 lg:overflow-hidden"
    >
      <!-- `.layout-boundary` — the same inset every other page carries, instead of
           the inline `px`/`pt` pair this used to spell out. That pair had no
           `padding-block-end` at all, so below `lg` (where the page scrolls) the
           last template ran flush into the viewport edge; the class brings the
           bottom boundary with it. From `lg` up the layout is height-bounded and
           only the template grid scrolls, so the same bottom inset simply ends that
           scroll box one step above the edge — which is what the boundary is for.

           No `gap` on the stack: the band below owns its own top space via
           `.layout-section-start` (= --layout-boundary-start, the same step this
           container's boundary puts above the heading). -->
      <div class="layout-boundary flex flex-col lg:min-h-0 lg:flex-1">
        <PageHeading
          size="large"
          title="Build on the most reliable network on earth"
          description="Start from a repository or use a framework template."
        />

        <!-- Both ways in are sections on one page, not tabs: they don't exclude
             each other, and a tab bar hid half the entry points behind a click.

             From `lg` up both columns terminate at the same y: the page is
             height-bounded there, so the importer stretches to the catalog's
             height instead of ending mid-page. Two boxes of the same width that
             stop on different lines read as one unfinished half, and the ragged
             edge moved every time the importer swapped content. Below `lg` the
             halves stack and the importer is content-sized. -->
        <!-- Stacked below `lg`, the `gap` is band rhythm and takes the boundary
             step like every other band top; from `lg` up it is the column gutter
             between the two halves, which wants the larger section step. -->
        <div
          class="layout-section-start flex flex-col gap-(--layout-boundary-start) lg:min-h-0 lg:flex-1 lg:flex-row lg:gap-(--layout-section-gap)"
        >
          <section
            class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1"
          >
            <header class="flex min-h-(--size-8) items-center px-(--spacing-xs)">
              <h2 class="text-heading-xxs text-(--text-default)">Import from Git</h2>
            </header>

            <div class="flex flex-col lg:min-h-0 lg:flex-1">
              <!-- Importer: an empty state until a Git provider is connected,
                     then the account scope + repository list. A solid CardBox
                     framing a dashed, raised EmptyState surface (per Figma). -->
              <CardBox
                v-if="!gitConnected"
                class="lg:min-h-0 lg:flex-1"
              >
                <template #content>
                  <!-- `lg:flex-1`: the dashed surface fills the card, which fills
                         the column — so the empty state's content stays centred in
                         the same box the catalog occupies beside it. -->
                  <EmptyState
                    size="medium"
                    title="Connect your repository"
                    description="Choose a Git provider to connect your repository and start the deployment process."
                    class="rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised) lg:min-h-0 lg:flex-1"
                  >
                    <template #icon>
                      <!-- Featured icon: a solid GitHub tile framed by two
                             concentric translucent squares. -->
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
                            class="pi pi-github text-[1rem] leading-none text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </span>
                    </template>
                    <template #actions>
                      <Button
                        label="Continue with GitHub"
                        icon="pi pi-github"
                        kind="secondary"
                        size="large"
                        :loading="connecting"
                        @click="connectGit"
                      />
                      <!-- Same `size` as the Button above it: the two are one
                             stacked action group, so they sit on one step of the
                             ramp (h-10 / text-button-lg) rather than two. -->
                      <Link
                        label="Manage connected providers"
                        href="#"
                        size="large"
                        @click.prevent
                      />
                    </template>
                  </EmptyState>
                </template>
              </CardBox>

              <!-- Connected: the account scope + search above the repository
                     list. The list card is as tall as its rows — it does not take
                     the column's slack, because a card that ends far below its
                     last row reads as a list that failed to load the rest.
                     `lg:max-h-full` is the ceiling, not the height: once the rows
                     would run past the column, the card stops there and scrolls
                     inside itself (see the scroll box below). -->
              <div
                v-else
                class="flex flex-col gap-(--layout-group-gap) lg:min-h-0 lg:max-h-full"
              >
                <!-- Account scope + search -->
                <div class="flex flex-col gap-(--spacing-sm) sm:flex-row">
                  <Select
                    :model-value="scope"
                    aria-label="Git account scope"
                    size="large"
                    :display-value="(v) => scopes.find((s) => s.value === v)?.label ?? ''"
                    @update:model-value="onSelectScope"
                    class="shrink-0 sm:w-(--container-3xs)"
                  >
                    <Select.Trigger>
                      <template #iconLeft>
                        <i
                          class="pi pi-github text-[1rem] leading-none shrink-0 text-(--text-default)"
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
                <CardBox
                  :padded="false"
                  class="lg:min-h-0"
                >
                  <template #content>
                    <!-- Past the column's height the rows scroll inside this box
                           rather than growing it: a plain block scroller, so the
                           list keeps its natural row heights instead of being
                           squeezed by the flex column above it. -->
                    <div
                      ref="listScroll"
                      class="overflow-y-auto overscroll-contain lg:min-h-0"
                    >
                      <!-- Fetching the account's repositories: reserve the row
                           layout with Skeleton rows so the list never pops in
                           blank once the connection settles. The count is measured
                           from this box (see `skeletonRowCount`), so a reload
                           reserves the height the list already had. -->
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
                          <!-- Item.Content stacks flush by design — a real row's
                               title and description space themselves through
                               their line-height. Fixed-height Skeletons have
                               none, so without this gap the two bars fuse into
                               one block; `--spacing-xs` stands in for the
                               leading the text would have carried. -->
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
                                class="text-[1rem] leading-none text-(--text-default)"
                                aria-hidden="true"
                              />
                            </span>
                          </Item.Media>
                          <Item.Content>
                            <Item.Title>{{ repo.name }}</Item.Title>
                            <Item.Description
                              class="flex items-center gap-(--spacing-xxs) text-body-xs"
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

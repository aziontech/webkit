<script setup>
  // GITIMPORTER — the Creation Center's "import a repository" pane.
  //
  // It lived inside ../CreationCenter.vue, which was right while that page WAS these two
  // halves side by side. The page is now a rail over a pane, and the pane holds one of six
  // views — this one, the template catalog, and the four resource creates — so the page
  // owns the rail and each view owns itself. What is left here is exactly what importing a
  // repository needs: a provider to connect, an account scope, and the repositories under
  // it.
  //
  // Everything in it is a MOCK of the GitHub handshake — connecting, "fetching" the account
  // and switching scope are timers, and the repositories are a fixture. The flow they lead
  // to is real: Import routes into /deploy with the repo and owner, the same screen a
  // template lands on.
  //
  // THE CONNECTION IS NOT THIS PANE'S. It used to be a `ref` here, which made it look like
  // a fact about this screen; it is a fact about the ACCOUNT, and the template deploy flow
  // needs the same answer for the same reason (it creates a repository too). Both read it
  // from ../../../lib/state/git-provider.js, so a reader who connects on either screen
  // finds the other one already connected, and the two scope Selects list one roster.
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

  // Carry the signed-in user across the flow (falls back to a placeholder), like every
  // other screen in this console.
  const userEmail = computed(() => route.query.email || 'myemail@azion.com')

  // Importing a repository routes into the same deploy flow, cloning the selected
  // repo under the current account scope instead of a catalog template.
  const importRepo = (repo) =>
    router.push({
      path: '/deploy',
      query: { email: userEmail.value, repo: repo.name, owner: scope.value }
    })

  const search = ref('')

  // Once connected (or when the account scope changes), the repository list is
  // "fetched": the scope + search chrome appear immediately, but the list itself
  // shows Skeleton rows for a beat so the reveal never pops in blank.
  const reposLoading = ref(false)

  let reposTimer = null

  const loadRepos = () => {
    reposLoading.value = true
    if (reposTimer) clearTimeout(reposTimer)
    reposTimer = setTimeout(() => {
      reposLoading.value = false
    }, 900)
  }

  // Which linked account the repositories are listed under. The ROSTER is the account's,
  // not this pane's (../../../lib/state/git-provider.js) — the template deploy flow creates
  // repositories under the same accounts, so the two screens cannot be allowed to disagree
  // about which ones exist. The SELECTION is this pane's: it is what the reader is browsing.
  const scope = ref('')

  const selectScope = (value) => {
    if (!value || value === scope.value) return
    scope.value = value
    loadRepos()
  }

  // Sentinel value for the trailing "Add GitHub Account" option — selecting it
  // runs the connect flow instead of becoming the chosen scope.
  const ADD_ACCOUNT = '__add-account__'

  // Linking another account is the SAME mock handshake as the first connection; it just
  // appends to a roster that is no longer empty. Either way it hands back the scope to
  // select, and switching scope re-fetches the repos.
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

  // Whatever filled the roster — the connect card below, another account linked from the
  // Select, or a connection made on the deploy page before the reader ever opened this
  // pane — the first account is the one to browse. Guarded on membership, so an account
  // linked from the Select is not overridden by this before `linkAccount` selects it.
  watch(
    gitAccounts,
    (accounts) => {
      if (!accounts.length) return
      if (accounts.some((account) => account.value === scope.value)) return
      selectScope(accounts[0].value)
    },
    { immediate: true }
  )

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
</script>

<template>
  <section class="flex w-full min-w-0 flex-col gap-(--layout-group-gap) lg:min-h-0 lg:flex-1">
    <header class="flex min-h-(--size-8) items-center px-(--spacing-xs)">
      <h2 class="text-heading-xxs text-(--text-default)">Import from GitHub</h2>
    </header>

    <div class="flex flex-col lg:min-h-0 lg:flex-1">
      <!-- No provider connected yet — the connect card is the whole pane, since there is
         nothing to list until there is an account to list it from. Shared with the
         template deploy flow, which opens on the same card for the same reason
         (../../../components/creation/GitProviderConnect.vue).

         CONTENT-SIZED, not column-height. The card used to stretch to fill the column so
         its dashed surface ended on the same line as the template catalog beside it; with
         one pane at a time there is nothing to line up with, and a full-height dashed box
         on a wide window is a screenful of nothing above a single button. It sits at the
         top of the pane instead. -->
      <GitProviderConnect
        v-if="!gitConnected"
        class="lg:min-h-0"
      />

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
            :display-value="(v) => gitAccounts.find((s) => s.value === v)?.label ?? ''"
            @update:model-value="onSelectScope"
            class="shrink-0 sm:w-(--container-3xs)"
          >
            <Select.Trigger>
              <template #iconLeft>
                <i
                  :class="GIT_PROVIDER.icon"
                  class="text-[1rem] leading-none shrink-0 text-(--text-default)"
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

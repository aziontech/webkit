<script setup>
  // PART 2, GIT FLOW — WHICH REPOSITORY. One question, and now one way to answer it:
  // connect the Git account that owns the code, then pick the repository out of it.
  //
  // THE PASTE-A-URL FIELD IS GONE, deliberately. It described a deploy this console does
  // not do. Importing from Git means Azion watches the repository and ships every push
  // to it, and watching is precisely what a pasted URL cannot grant — so the field
  // either dead-ended on the first private repository or asked the reader to answer the
  // same question twice, once as a string and once as an authorization. Connecting is
  // not a wall in front of the answer here; it IS the answer.
  //
  // What is left is two states of ONE band: connect, then choose. The chosen row emits
  // the same source shape the template part emits (see `emitSource`), so the Configure
  // part and the provisioning call never learn which flow filled it in.
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import EmptyState from '@aziontech/webkit/empty-state'
  import InputText from '@aziontech/webkit/input-text'
  import Item from '@aziontech/webkit/item'
  import Select from '@aziontech/webkit/select'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { computed, ref } from 'vue'

  import SuccessMark from '../../../components/page/SuccessMark.vue'
  import { ADD_ACCOUNT, useGitAccount } from '../../../lib/behavior/git-account'
  import { useScrollFade } from '../../../lib/behavior/scroll-fade'
  import { GIT_REPOSITORIES } from '../../../lib/data/git-repositories'

  const props = defineProps({
    // The source already chosen, so coming BACK to this part shows the reader's answer
    // instead of an empty list. Null until something is picked.
    source: { type: Object, default: null },
    // The flow-wide lock while the commit is in flight.
    disabled: { type: Boolean, default: false }
  })

  const emit = defineEmits(['update:source'])

  // ONE SHAPE, the same one the template part emits. `settings: []` because an imported
  // repository has no template schema to fill in — the Configure part reads the same key
  // either way.
  const emitSource = ({ owner, name, framework = '', icon = 'pi pi-github' }) => {
    emit('update:source', {
      kind: 'git',
      title: name,
      description: `Imported from ${owner}/${name}.`,
      framework,
      icon,
      repoOwner: owner,
      repoPath: name,
      defaultName: name,
      // A repository arrives with code, so the Configure part asks how to build it.
      requiresBuild: true,
      settings: []
    })
  }

  // --- Connect, then browse -------------------------------------------------
  // The authorization, the account switcher and the beat before the rows arrive live in
  // ../../../lib/behavior/git-account.js, shared with the template flow's repository part
  // — that one asks GitHub for the same thing to CREATE a repository, this one to browse
  // the ones already there, and two copies of one connect is how the two drift.
  const { connected, connecting, reposLoading, scopes, scope, connect, selectScope } =
    useGitAccount()

  const search = ref('')

  // The repo list scrolls inside the card past its ceiling, so its edges dissolve rather
  // than cutting the rows they land on. It re-measures itself through the whole sequence
  // this part goes through — skeletons while the repos load, the real rows replacing
  // them, then the search narrowing them — with nothing declared per state.
  //
  // 32px, half a row — the same band ../applications/wizard/TemplateSourceStep.vue
  // keeps, and for the same reason: the page-level 64 would erase a whole row and
  // compound with the page scroller's band at the card's bottom edge.
  const { scroller, fadeStyle } = useScrollFade({ max: 32 })

  const filteredRepos = computed(() => {
    const q = search.value.trim().toLowerCase()
    if (!q) return GIT_REPOSITORIES
    return GIT_REPOSITORIES.filter((repo) => repo.name.toLowerCase().includes(q))
  })

  const chooseRepo = (repo) => {
    emitSource({
      owner: scope.value,
      name: repo.name,
      framework: repo.framework,
      icon: repo.icon
    })
  }

  // Which repository is the current answer, so the list MARKS it. A list where the
  // answer is invisible makes the reader press Next to find out whether their click
  // registered.
  const chosenRepoName = computed(() => (props.source?.kind === 'git' ? props.source.repoPath : ''))
</script>

<template>
  <div class="flex min-w-0 flex-col gap-(--layout-section-gap)">
    <!-- ONE band, two states, and the title does not change between them — the reader
         connects inside the same box they then choose in. -->
    <CardBox
      v-if="!connected"
      key="connect"
      title="Repository"
    >
      <template #content>
        <!-- The dashed, raised surface this console gives every connect-a-provider
             empty state (the Creation Center's own front door uses the same one), so
             the two places that ask for a Git account look like the same ask. The
             featured GitHub tile is EmptyState's own adornment — nothing hand-rolled. -->
        <EmptyState
          icon="pi pi-github"
          size="medium"
          title="Connect a Git account"
          description="Azion imports the repository you pick and deploys every push to it. Authorize once — the account stays available for the applications you create later."
          class="rounded-(--shape-card) border border-dashed border-(--border-default) bg-(--bg-surface-raised)"
        >
          <template #actions>
            <Button
              type="button"
              label="Connect GitHub"
              icon="pi pi-github"
              kind="secondary"
              size="large"
              :loading="connecting"
              :disabled="disabled"
              @click="connect"
            />
          </template>
        </EmptyState>
      </template>
    </CardBox>

    <CardBox
      v-else
      key="repositories"
      :padded="false"
      title="Repository"
    >
      <template #content>
        <!-- The account scope + search stay pinned while the list below them reloads. -->
        <div
          class="flex flex-col gap-(--spacing-sm) border-b border-(--border-default) p-(--spacing-md) sm:flex-row"
        >
          <Select
            :model-value="scope"
            aria-label="Git account"
            size="large"
            :disabled="disabled"
            :display-value="(v) => scopes.find((s) => s.value === v)?.label ?? ''"
            class="shrink-0 sm:w-(--container-3xs)"
            @update:model-value="selectScope"
          >
            <Select.Trigger>
              <template #iconLeft>
                <i
                  class="pi pi-github shrink-0 text-[1rem] leading-none text-(--text-default)"
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
                Add GitHub account
              </Select.Option>
            </Select.Content>
          </Select>

          <InputText
            v-model="search"
            size="large"
            class="w-full flex-1"
            placeholder="Search repositories"
            aria-label="Search repositories"
            :disabled="disabled"
          >
            <template #iconLeft>
              <i
                class="pi pi-search"
                aria-hidden="true"
              />
            </template>
          </InputText>
        </div>

        <!-- Past the card's ceiling the rows scroll inside it rather than growing it, so
             the action bar stays reachable however long the list is.
             `overscroll-contain` keeps a flick at the end of the list from carrying on
             into the page behind it. -->
        <div
          ref="scroller"
          :style="fadeStyle"
          class="max-h-[22rem] overflow-y-auto overscroll-contain"
        >
          <Item.List
            v-if="reposLoading"
            key="repos-loading"
            aria-busy="true"
          >
            <Item
              v-for="n in 5"
              :key="`repo-skeleton-${n}`"
              size="small"
            >
              <Item.Media>
                <Skeleton
                  kind="shape"
                  width="2rem"
                  height="2rem"
                />
              </Item.Media>
              <!-- Item.Content stacks flush by design — a real row's two lines space
                   themselves through their line-height. Fixed-height Skeletons have none,
                   so this gap stands in for the leading the text would carry. -->
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
            </Item>
          </Item.List>

          <Item.List
            v-else-if="filteredRepos.length"
            key="repos-list"
          >
            <Item
              v-for="repo in filteredRepos"
              :key="repo.name"
              as-child
              size="small"
            >
              <button
                type="button"
                class="w-full text-left"
                :disabled="disabled"
                :aria-pressed="repo.name === chosenRepoName"
                @click="chooseRepo(repo)"
              >
                <Item.Media>
                  <span
                    class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
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
                  <!-- The chosen row wears the same success mark the progress and the deploy
                       pipeline use, so "this one is settled" looks identical wherever the
                       reader meets it in this flow. -->
                  <SuccessMark
                    v-if="repo.name === chosenRepoName"
                    key="chosen"
                  />
                  <i
                    v-else
                    class="pi pi-chevron-right text-(--text-muted)"
                    aria-hidden="true"
                  />
                </Item.Actions>
              </button>
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
</template>

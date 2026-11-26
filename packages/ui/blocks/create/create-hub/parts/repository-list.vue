<script setup lang="ts">
  import Alert from '@aziontech/webkit/alert'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import EmptyState from '@aziontech/webkit/empty-state'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref, watch } from 'vue'

  import type { CreateHubRepository } from '../types'

  export interface RepositoryListProps {
    /** The repositories that match the search. */
    repositories: CreateHubRepository[]
    /** The search typed above the list. */
    query: string
    /** The scope the list shows; picking another one pages back to the start. */
    scope: string
    /** The repositories are loading; skeleton rows show. */
    loading?: boolean
    /** Why the repositories failed to load. */
    error?: string
  }

  const props = withDefaults(defineProps<RepositoryListProps>(), { loading: false, error: '' })

  const emit = defineEmits<{
    import: [event: MouseEvent, repository: CreateHubRepository]
    retry: [event: MouseEvent]
    'clear-search': []
  }>()

  const REPO_PAGE = 10
  const skeletonRows = 6

  const limit = ref(REPO_PAGE)

  watch(
    () => props.scope,
    () => {
      limit.value = REPO_PAGE
    }
  )

  const failed = computed(() => props.error !== '')
  const shown = computed(() => props.repositories.slice(0, limit.value))
  const hidden = computed(() => props.repositories.length - shown.value.length)

  const showMore = () => {
    limit.value += REPO_PAGE
  }

  const relativeTime = useLocale().formatRelativeTime
  const ago = (value: Date | string) => (value ? relativeTime(new Date(value)) : '')
</script>

<template>
  <div class="flex lg:min-h-0">
    <Card
      :padded="false"
      class="w-full"
    >
      <template #default>
        <div class="overflow-y-auto overscroll-contain lg:min-h-0">
          <div
            v-if="failed"
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
            v-else-if="loading"
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
            v-else-if="repositories.length"
            key="repos-list"
          >
            <Item.List :aria-label="`Repositories in ${scope}`">
              <Item
                v-for="repo in shown"
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
                    <span class="flex items-center gap-(--spacing-2xs) text-body-xs">
                      <i
                        class="az az-history"
                        aria-hidden="true"
                      />
                      {{ ago(repo.pushedAt) }}
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
              v-if="hidden > 0"
              class="flex justify-center border-t border-(--border-muted) p-(--spacing-sm)"
            >
              <Button
                :label="`Load more (${hidden})`"
                variant="ghost"
                size="small"
                @click="showMore"
              />
            </div>
          </div>
          <EmptyState
            v-else
            size="small"
            icon="az az-search"
            title="No repositories match"
            :description="`Nothing in ${scope} is named like “${query}”.`"
          >
            <template #actions>
              <Button
                label="Clear search"
                variant="outline"
                size="small"
                @click="emit('clear-search')"
              />
            </template>
          </EmptyState>
        </div>
      </template>
    </Card>
  </div>
</template>

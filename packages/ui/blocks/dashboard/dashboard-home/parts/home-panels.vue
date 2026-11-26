<script setup lang="ts">
  import EmptyState from '@aziontech/ui/empty-state'
  import Item from '@aziontech/ui/item'
  import Link from '@aziontech/ui/link'
  import Skeleton from '@aziontech/ui/skeleton'

  import type { HomeDashboardResource } from '../dashboard-home.vue'

  /** One resource panel of the grid. */
  export interface HomePanel {
    /** Stable key. */
    key: string
    /** The panel heading. */
    label: string
    /** The page the heading links to; empty shows plain text. */
    path: string
    /** The panel lists recently opened resources. */
    recent: boolean
    /** The rows carry the project preset icon. */
    marked: boolean
    /** The rows. */
    resources: HomeDashboardResource[]
  }

  export interface HomePanelsProps {
    /** The panels, in the order they render. */
    panels: HomePanel[]
    /** The rows are loading. */
    loading: boolean
    /** Why the rows could not load; empty shows the rows. */
    error: string
  }

  defineProps<HomePanelsProps>()

  const CARD_GRID_CLASS =
    'animate-content-enter motion-reduce:animate-none mt-(--spacing-lg) grid w-full min-w-0 grid-cols-1 gap-(--layout-group-gap) ' +
    'sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:flex-1 xl:grid-cols-5 xl:gap-(--layout-section-gap) ' +
    '[--content-enter-delay:var(--transition-duration-fast-01)]'
</script>

<template>
  <section
    :class="CARD_GRID_CLASS"
    aria-label="Resources"
  >
    <div
      v-for="panel in panels"
      :key="panel.key"
      class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
      :class="panel.recent ? 'sm:col-span-2 lg:col-span-3 xl:col-span-2' : ''"
    >
      <h2
        class="flex min-h-(--size-6) items-center gap-(--spacing-xs) text-label-sm text-(--text-default)"
      >
        <span
          v-if="panel.marked || panel.recent"
          class="shrink-0"
          aria-hidden="true"
        />
        <Link
          v-if="panel.path"
          :href="panel.path"
          :label="panel.label"
          size="small"
          icon="az az-chevron-right"
        />
        <span v-else>{{ panel.label }}</span>
      </h2>

      <div class="min-w-0 xl:min-h-0 xl:flex-1 xl:overflow-y-auto xl:overscroll-contain">
        <p
          v-if="error"
          class="text-body-sm text-(--text-muted)"
        >
          Not available.
        </p>
        <div
          v-else-if="loading"
          key="panel-loading"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <Skeleton
            v-for="line in 3"
            :key="line"
            height="2rem"
          />
        </div>
        <Item.List
          v-else-if="panel.resources.length"
          key="panel-rows"
        >
          <Item
            v-for="resource in panel.resources"
            :key="resource.href"
            :href="resource.href"
            size="small"
          >
            <Item.Content>
              <Item.Title class="w-full">
                <template v-if="panel.recent">
                  <span
                    class="flex shrink-0 items-center justify-center"
                    aria-hidden="true"
                  >
                    <i class="az az-history text-body-xs leading-none text-(--text-muted)" />
                  </span>
                  <span class="min-w-(--size-24) shrink-0 text-body-sm text-(--text-muted)"
                    >{{ resource.typeLabel }} /</span
                  >
                </template>

                <span
                  v-else-if="panel.marked"
                  class="flex shrink-0 items-center justify-center"
                  aria-hidden="true"
                >
                  <i
                    v-if="resource.presetIcon"
                    :class="resource.presetIcon"
                    class="text-body-lg leading-none"
                    :title="resource.presetLabel"
                  />
                </span>
                <span
                  class="min-w-0 truncate text-label-md text-(--text-default)"
                  dir="auto"
                >
                  {{ resource.name }}
                </span>
              </Item.Title>
            </Item.Content>

            <Item.Actions>
              <i
                class="az az-chevron-right shrink-0 text-body-xs text-(--text-muted)"
                aria-hidden="true"
              />
            </Item.Actions>
          </Item>
        </Item.List>

        <EmptyState
          v-else
          size="small"
          :title="panel.recent ? 'Nothing opened yet' : `No ${panel.label.toLowerCase()} yet`"
          :description="
            panel.recent
              ? 'Resources you open show up here.'
              : `${panel.label} you create show up here.`
          "
        />
      </div>
    </div>
  </section>
</template>

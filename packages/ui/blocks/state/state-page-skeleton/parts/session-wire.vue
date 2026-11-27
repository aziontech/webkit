<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Skeleton from '@aziontech/ui/skeleton'

  import StatePageSkeleton from '../state-page-skeleton.vue'
  import SessionFields from './session-fields.vue'

  export type SessionWirePage = 'list' | 'detail' | 'form' | 'home'

  export interface SessionWireProps {
    /** The family of page drawn beside the navigation rail. */
    page: SessionWirePage
  }

  defineProps<SessionWireProps>()

  const navGroups = [
    { id: 'top', labelled: false, items: ['40%', '52%', '58%', '56%'] },
    { id: 'build', labelled: true, items: ['62%', '46%', '48%', '54%', '66%'] },
    { id: 'store', labelled: true, items: ['64%', '58%'] },
    { id: 'secure', labelled: true, items: ['42%', '50%', '54%', '72%', '60%'] }
  ]

  const SIDEBAR_CLASS =
    'hidden w-(--container-2xs) shrink-0 flex-col gap-(--spacing-lg) overflow-hidden border-e-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-sm) ' +
    'md:flex'

  const tableCells = ['18%', '15%', '9%', '17%', '11%', '8%']

  const detailTabs = ['6rem', '3rem', '7.5rem', '8rem', '9rem', '6.5rem']
</script>

<template>
  <div class="flex min-h-0 flex-1">
    <div :class="SIDEBAR_CLASS">
      <Skeleton height="2.5rem" />

      <div
        v-for="group in navGroups"
        :key="group.id"
        class="flex flex-col gap-(--spacing-md)"
      >
        <Skeleton
          v-if="group.labelled"
          width="30%"
          height="0.5rem"
        />
        <Skeleton
          v-for="(item, index) in group.items"
          :key="index"
          :width="item"
          height="0.875rem"
        />
      </div>

      <div class="mt-auto flex items-center gap-(--spacing-xs)">
        <Skeleton
          width="1.5rem"
          height="1.5rem"
        />
        <Skeleton
          width="50%"
          height="0.75rem"
        />
      </div>
    </div>

    <div
      v-if="page === 'list'"
      class="flex min-w-0 flex-1 flex-col"
    >
      <div class="layout-boundary min-h-0 flex-1 overflow-hidden">
        <div class="layout-column flex min-w-0 flex-col gap-(--layout-group-gap)">
          <div class="flex items-center gap-(--spacing-sm)">
            <Skeleton
              width="2.5rem"
              height="2.5rem"
            />
            <div class="flex grow">
              <Skeleton
                class="w-full"
                height="2.5rem"
              />
            </div>
            <Skeleton
              width="10rem"
              height="2.5rem"
            />
          </div>

          <Card :padded="false">
            <template #default>
              <div
                class="flex items-center gap-(--spacing-md) border-b-(length:--border-width-default) border-(--border-default) px-(--spacing-md) py-(--spacing-md)"
              >
                <Skeleton
                  v-for="(cell, index) in tableCells"
                  :key="index"
                  :width="cell"
                  height="0.75rem"
                />
              </div>
              <div
                v-for="row in 8"
                :key="row"
                class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-md)"
              >
                <Skeleton
                  v-for="(cell, index) in tableCells"
                  :key="index"
                  :width="cell"
                  height="0.875rem"
                />
              </div>
              <div
                class="flex items-center justify-between gap-(--spacing-md) border-t-(length:--border-width-default) border-(--border-default) px-(--spacing-md) py-(--spacing-sm)"
              >
                <Skeleton
                  width="11rem"
                  height="0.75rem"
                />
                <div class="flex items-center gap-(--spacing-xs)">
                  <Skeleton
                    v-for="index in 4"
                    :key="index"
                    width="2rem"
                    height="2rem"
                  />
                </div>
              </div>
            </template>
          </Card>
        </div>
      </div>
    </div>

    <div
      v-else-if="page === 'detail'"
      class="flex min-w-0 flex-1 flex-col"
    >
      <div
        class="layout-boundary-inline flex h-14 shrink-0 items-center gap-(--spacing-lg) border-b-(length:--border-width-default) border-(--border-muted)"
      >
        <Skeleton
          v-for="(tab, index) in detailTabs"
          :key="index"
          :width="tab"
          height="0.875rem"
        />
      </div>

      <div class="layout-boundary min-h-0 flex-1 overflow-hidden">
        <SessionFields class="layout-column" />
      </div>
    </div>

    <div
      v-else-if="page === 'form'"
      class="flex min-w-0 flex-1 flex-col"
    >
      <div class="layout-boundary min-h-0 flex-1 overflow-hidden">
        <SessionFields class="layout-form-create" />
      </div>

      <div
        class="layout-boundary-inline flex shrink-0 items-center justify-end gap-(--spacing-sm) border-t-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) py-(--spacing-sm)"
      >
        <Skeleton
          width="5.5rem"
          height="2.5rem"
        />
        <Skeleton
          width="7rem"
          height="2.5rem"
        />
      </div>
    </div>

    <div
      v-else
      class="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
    >
      <StatePageSkeleton label="Session expired. Signing you out." />
    </div>
  </div>
</template>

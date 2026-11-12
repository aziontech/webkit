<script setup>
  import Card from '@aziontech/webkit/card'
  import Skeleton from '@aziontech/webkit/skeleton'

  const navGroups = [
    { id: 'top', labelled: false, items: ['40%', '52%', '58%', '56%'] },
    { id: 'build', labelled: true, items: ['62%', '46%', '48%', '54%', '66%'] },
    { id: 'store', labelled: true, items: ['64%', '58%'] },
    { id: 'secure', labelled: true, items: ['42%', '50%', '54%', '72%', '60%'] }
  ]

  const tableCells = ['18%', '15%', '9%', '17%', '11%', '8%']
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    class="flex h-screen flex-col overflow-hidden bg-(--bg-canvas) animate-fade-in motion-reduce:animate-none"
  >
    <span class="sr-only">Session expired. Signing you out.</span>

    <div
      class="flex h-14 shrink-0 items-center gap-(--spacing-xs) border-b-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) px-(--spacing-md)"
    >
      <Skeleton
        width="1.25rem"
        height="1.25rem"
      />
      <Skeleton
        width="5rem"
        height="0.875rem"
      />
      <Skeleton
        width="4.5rem"
        height="0.875rem"
      />
      <div class="hidden md:block">
        <Skeleton
          width="6rem"
          height="0.875rem"
        />
      </div>
      <div class="hidden lg:block">
        <Skeleton
          width="8rem"
          height="0.875rem"
        />
      </div>

      <div class="ms-auto flex items-center gap-(--spacing-xs)">
        <Skeleton
          width="5.5rem"
          height="2rem"
        />
        <div class="hidden md:block">
          <Skeleton
            width="4.5rem"
            height="2rem"
          />
        </div>
        <Skeleton
          kind="circle"
          width="2rem"
          height="2rem"
        />
      </div>
    </div>

    <div class="flex min-h-0 flex-1">
      <div
        class="hidden w-(--container-2xs) shrink-0 flex-col gap-(--spacing-lg) overflow-hidden border-e-(length:--border-width-default) border-(--border-muted) bg-(--bg-surface) p-(--spacing-sm) md:flex"
      >
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

      <div class="flex min-w-0 flex-1 flex-col">
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
              <template #content>
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
    </div>
  </div>
</template>

<script setup>
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'

  const navGroups = [
    { id: 'top', labelled: false, items: ['40%', '52%', '58%', '56%'] },
    { id: 'build', labelled: true, items: ['62%', '46%', '48%', '54%', '66%'] },
    { id: 'store', labelled: true, items: ['64%', '58%'] },
    { id: 'secure', labelled: true, items: ['42%', '50%', '54%', '72%', '60%'] }
  ]

  const panels = [1, 2, 3, 4]
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
          <div class="layout-column flex min-h-full min-w-0 flex-col justify-center">
            <div
              class="flex flex-col gap-(--layout-boundary-start) xl:min-h-0 xl:flex-1"
              aria-hidden="true"
            >
              <div class="flex items-center">
                <Skeleton
                  width="12rem"
                  height="1.5rem"
                />
              </div>

              <div
                class="flex w-full shrink-0 flex-col gap-(--layout-group-gap) xl:flex-row xl:items-stretch xl:gap-(--layout-section-gap)"
              >
                <div class="flex min-w-0 xl:flex-1">
                  <Card
                    :padded="false"
                    class="w-full"
                  >
                    <template #content>
                      <div class="grid grow grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                        <div
                          v-for="metric in 4"
                          :key="metric"
                          class="flex min-w-0 flex-col justify-center gap-(--spacing-sm) border-(--border-default) p-(--spacing-md) max-sm:nth-[n+2]:border-t sm:max-xl:[&:nth-child(n+3)]:border-t sm:[&:nth-child(even)]:border-s xl:[&:nth-child(n+2)]:border-s"
                        >
                          <Skeleton
                            width="60%"
                            height="0.875rem"
                          />
                          <div class="flex items-center justify-between gap-(--spacing-sm)">
                            <Skeleton
                              width="40%"
                              height="1.75rem"
                            />
                            <Skeleton
                              width="3.25rem"
                              height="1.25rem"
                            />
                          </div>
                        </div>
                      </div>
                    </template>
                  </Card>
                </div>

                <div class="w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)">
                  <Card :padded="false">
                    <template #content>
                      <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
                        <div class="flex items-center [&>*+*]:-ms-2">
                          <Skeleton
                            v-for="mark in 4"
                            :key="mark"
                            kind="shape"
                            width="2rem"
                            height="2rem"
                          />
                        </div>
                        <div class="flex flex-col gap-(--spacing-xxs)">
                          <Skeleton
                            width="70%"
                            height="1.125rem"
                          />
                          <Skeleton height="1.0625rem" />
                          <Skeleton
                            width="55%"
                            height="1.0625rem"
                          />
                        </div>
                      </div>
                    </template>
                  </Card>
                </div>
              </div>

              <div
                class="grid grid-cols-1 gap-(--layout-group-gap) sm:grid-cols-2 lg:grid-cols-3 xl:min-h-0 xl:grow xl:grid-cols-5 xl:gap-(--layout-section-gap)"
              >
                <div
                  v-for="panel in panels"
                  :key="panel"
                  class="flex min-w-0 flex-col gap-(--spacing-xs) xl:min-h-0"
                  :class="panel === 4 ? 'sm:col-span-2 lg:col-span-3 xl:col-span-2' : ''"
                >
                  <div
                    class="flex min-h-(--size-6) items-center gap-(--spacing-xs) px-[calc(var(--spacing-md)+1px)]"
                  >
                    <span
                      v-if="panel === 1 || panel === 4"
                      class="shrink-0"
                    />
                    <Skeleton
                      width="5rem"
                      height="0.875rem"
                    />
                  </div>

                  <div class="xl:min-h-0 xl:flex-1 xl:overflow-hidden">
                    <Item.List>
                      <Item
                        v-for="row in 3"
                        :key="row"
                        role="listitem"
                        size="small"
                      >
                        <Item.Content>
                          <div
                            class="flex h-(--size-5) flex-col justify-center"
                            :class="
                              panel === 1 || panel === 4
                                ? 'ps-[calc(var(--size-4)+var(--spacing-xs))]'
                                : ''
                            "
                          >
                            <Skeleton
                              :width="row % 2 ? '55%' : '42%'"
                              height="0.875rem"
                            />
                          </div>
                        </Item.Content>
                      </Item>
                    </Item.List>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

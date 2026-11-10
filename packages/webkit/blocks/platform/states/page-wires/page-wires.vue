<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Item from '@aziontech/webkit/item'
  import Skeleton from '@aziontech/webkit/skeleton'

  const panels = [1, 2, 3, 4]
</script>

<template>
  <div
    class="layout-column layout-boundary relative flex min-h-full flex-col justify-center xl:h-full xl:min-h-0 xl:justify-start"
  >
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
          <CardBox
            :padded="false"
            class="w-full"
          >
            <template #content>
              <div class="grid grow grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
                <div
                  v-for="metric in 4"
                  :key="metric"
                  class="flex min-w-0 flex-col justify-center gap-(--spacing-sm) border-(--border-default) p-(--spacing-md) max-sm:nth-[n+2]:border-t sm:max-xl:[&:nth-child(n+3)]:border-t sm:[&:nth-child(even)]:border-l xl:[&:nth-child(n+2)]:border-l"
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
          </CardBox>
        </div>

        <div class="w-full shrink-0 xl:w-[30%] xl:max-w-(--container-xs)">
          <CardBox :padded="false">
            <template #content>
              <div class="flex flex-col gap-(--spacing-md) p-(--spacing-md)">
                <div class="flex items-center [&>*+*]:-ml-2">
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
          </CardBox>
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
                      panel === 1 || panel === 4 ? 'pl-[calc(var(--size-4)+var(--spacing-xs))]' : ''
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
</template>

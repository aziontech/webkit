<script setup>
  import CardBox from '@aziontech/webkit/card-box'
  import Skeleton from '@aziontech/webkit/skeleton'

  const DOORS = 3
</script>

<template>
  <div
    class="flex min-h-full flex-col justify-center gap-(--layout-section-gap) py-(--spacing-xl)"
    aria-hidden="true"
  >
    <div class="flex flex-col items-center gap-(--spacing-lg)">
      <Skeleton
        width="19rem"
        height="2.375rem"
      />
      <div class="flex w-full max-w-(--container-2xl) flex-col items-stretch">
        <Skeleton height="2.5rem" />
      </div>
    </div>

    <div class="grid grid-cols-1 gap-(--spacing-lg) md:grid-cols-3">
      <CardBox
        v-for="door in DOORS"
        :key="door"
        :padded="false"
      >
        <template #content>
          <div class="flex h-full flex-col p-(--spacing-sm)">
            <div
              class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
            >
              <Skeleton
                width="170px"
                height="128px"
              />
            </div>
            <div
              class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
            >
              <div class="flex flex-1 flex-col gap-(--spacing-xs)">
                <Skeleton
                  width="55%"
                  height="1.25rem"
                />
                <Skeleton height="1.25rem" />
                <Skeleton
                  width="70%"
                  height="1.25rem"
                />
              </div>
              <div class="flex items-center">
                <Skeleton
                  width="8rem"
                  height="2.5rem"
                />
              </div>
            </div>
          </div>
        </template>
      </CardBox>
    </div>
  </div>
</template>

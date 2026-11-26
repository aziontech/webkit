<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Skeleton from '@aziontech/webkit/skeleton'
</script>

<template>
  <ul class="m-0 grid list-none grid-cols-1 gap-(--spacing-md) p-0 sm:grid-cols-2 xl:grid-cols-3">
    <li
      v-for="tile in 6"
      :key="tile"
      class="flex min-w-0"
    >
      <Card class="w-full">
        <template #default>
          <div class="flex flex-col gap-(--spacing-md)">
            <div class="flex items-start gap-(--spacing-md)">
              <Skeleton
                width="2.5rem"
                height="2.5rem"
              />
              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
                <Skeleton
                  width="50%"
                  height="1rem"
                />
                <Skeleton height="0.875rem" />
                <Skeleton
                  width="75%"
                  height="0.875rem"
                />
              </div>
            </div>
            <div class="flex items-center justify-between">
              <Skeleton
                width="5rem"
                height="1.25rem"
              />
              <Skeleton
                width="4.5rem"
                height="2rem"
              />
            </div>
          </div>
        </template>
      </Card>
    </li>
  </ul>
</template>

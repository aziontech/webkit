<script setup lang="ts">
  import Card from '@aziontech/ui/card'
  import Skeleton from '@aziontech/ui/skeleton'
</script>

<template>
  <div
    class="flex flex-col gap-(--layout-section-gap)"
    role="status"
    aria-label="Loading contacts and agents"
  >
    <Card
      v-for="band in 3"
      :key="band"
    >
      <div class="flex flex-col gap-(--spacing-md)">
        <div
          v-for="row in 2"
          :key="row"
          class="flex flex-col gap-(--spacing-xs)"
        >
          <Skeleton
            width="var(--size-24)"
            height="var(--size-3)"
          />
          <Skeleton height="var(--size-10)" />
        </div>
      </div>
    </Card>
  </div>
</template>

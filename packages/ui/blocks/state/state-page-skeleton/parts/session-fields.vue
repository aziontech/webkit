<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import Skeleton from '@aziontech/webkit/skeleton'

  const formRows = ['58%', '44%', '66%']
</script>

<template>
  <div class="flex min-w-0 flex-col">
    <div class="flex flex-col gap-(--spacing-xs)">
      <Skeleton
        width="14rem"
        height="1.5rem"
      />
      <Skeleton
        width="26rem"
        height="0.875rem"
      />
    </div>

    <div class="layout-section-start flex flex-col gap-(--layout-section-gap)">
      <div
        v-for="section in 2"
        :key="section"
        class="flex flex-col gap-(--layout-group-gap)"
      >
        <Skeleton
          width="7rem"
          height="1rem"
        />
        <Card :padded="false">
          <template #default>
            <div
              v-for="(field, index) in formRows"
              :key="index"
              :data-divided="index > 0 || null"
              class="flex items-center gap-(--spacing-md) px-(--spacing-md) py-(--spacing-md) data-divided:border-t-(length:--border-width-default) data-divided:border-(--border-default)"
            >
              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
                <Skeleton
                  width="6rem"
                  height="0.875rem"
                />
                <Skeleton
                  :width="field"
                  height="0.75rem"
                />
              </div>
              <div class="layout-field-control">
                <Skeleton height="2.5rem" />
              </div>
            </div>
          </template>
        </Card>
      </div>
    </div>
  </div>
</template>

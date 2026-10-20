<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import Skeleton from '@aziontech/webkit/skeleton'

  interface Props {
    label?: string
  }

  withDefaults(defineProps<Props>(), { label: 'Loading version.' })

  const SECTIONS = [
    { id: 'general', rows: ['62%', '48%'] },
    { id: 'modules', rows: ['54%', '66%', '44%'] }
  ]
</script>

<template>
  <div
    role="status"
    aria-live="polite"
    aria-busy="true"
    data-testid="application-version-wire"
    class="layout-column-form layout-boundary-inline flex min-w-0 flex-col pb-(--layout-section-gap) pt-(--layout-section-gap) animate-fade-in motion-reduce:animate-none"
  >
    <span class="sr-only">{{ label }}</span>

    <div class="flex flex-col gap-(--spacing-xs)">
      <Skeleton
        width="8rem"
        height="1.25rem"
      />
      <Skeleton
        width="18rem"
        height="0.875rem"
      />
    </div>

    <div class="mt-(--layout-section-gap) flex flex-col gap-(--layout-section-gap)">
      <div
        v-for="section in SECTIONS"
        :key="section.id"
        class="flex flex-col gap-(--layout-group-gap)"
      >
        <Skeleton
          width="6rem"
          height="1rem"
        />
        <CardBox :padded="false">
          <template #content>
            <div class="flex flex-col divide-y divide-(--border-default)">
              <div
                v-for="(width, index) in section.rows"
                :key="index"
                class="flex items-center gap-(--spacing-md) p-(--spacing-md)"
              >
                <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xs)">
                  <Skeleton
                    width="7rem"
                    height="0.875rem"
                  />
                  <Skeleton
                    :width="width"
                    height="0.75rem"
                  />
                </div>
                <span class="flex shrink-0">
                  <Skeleton
                    width="2.25rem"
                    height="1.25rem"
                  />
                </span>
              </div>
            </div>
          </template>
        </CardBox>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import Illustration from '@aziontech/webkit/illustration'

  interface Props {
    illustration: string
    title: string
    description: string
    illustrationLabel?: string
  }

  withDefaults(defineProps<Props>(), {
    illustrationLabel: ''
  })

  defineSlots<{
    action(): unknown
  }>()
</script>

<template>
  <CardBox :padded="false">
    <template #content>
      <div class="flex h-full flex-col p-(--spacing-sm)">
        <div
          class="flex aspect-4/3 shrink-0 items-center justify-center overflow-hidden rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
        >
          <Illustration
            :name="illustration"
            :aria-label="illustrationLabel"
          />
        </div>

        <div
          class="flex flex-1 flex-col gap-(--spacing-md) px-(--spacing-sm) pb-(--spacing-sm) pt-(--spacing-md)"
        >
          <div class="flex flex-1 flex-col gap-(--spacing-xs)">
            <h3 class="text-label-md text-(--text-default)">{{ title }}</h3>
            <p class="text-pretty text-body-sm text-(--text-muted)">{{ description }}</p>
          </div>
          <div class="flex items-center gap-(--spacing-xs)">
            <slot name="action" />
          </div>
        </div>
      </div>
    </template>
  </CardBox>
</template>

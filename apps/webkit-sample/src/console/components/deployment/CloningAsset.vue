<script setup lang="ts">
  import { computed, useAttrs } from 'vue'

  defineOptions({ name: 'CloningAsset', inheritAttrs: false })

  interface Props {
    /** Icon class of the source the code comes from. */
    icon?: string
    /** Extra class that keeps a brand mark legible on the tile. */
    markClass?: string
  }

  withDefaults(defineProps<Props>(), {
    icon: 'ai ai-github',
    markClass: ''
  })

  const attrs = useAttrs()
  const testId = computed(() => (attrs['data-testid'] as string) ?? 'cloning-asset')

  const AZION_MARK =
    'M18.2868 0L0.490892 14.9821L0 17.561H2.5639L16.349 5.96141L14.1271 17.561H17.4898L20.8537 0H18.2868Z'
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    class="flex items-center"
    aria-hidden="true"
  >
    <span
      class="flex size-10 shrink-0 items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) text-(--text-default)"
      :data-testid="`${testId}__source`"
    >
      <i
        :class="[icon, markClass]"
        class="text-body-lg leading-none"
      />
    </span>

    <svg
      class="h-0.5 w-20 shrink-0 text-(--primary)"
      viewBox="0 0 80 2"
      preserveAspectRatio="none"
    >
      <line
        x1="0"
        y1="1"
        x2="80"
        y2="1"
        stroke="currentColor"
        stroke-width="2"
        stroke-dasharray="2 2"
        class="animate-flow-dash motion-reduce:animate-none"
      />
    </svg>

    <span
      class="flex size-20 shrink-0 items-center justify-center rounded-(--shape-card) border border-(--border-default) bg-(--bg-canvas) text-(--primary)"
      :data-testid="`${testId}__target`"
    >
      <svg
        viewBox="0 0 21 18"
        fill="currentColor"
        class="size-8"
      >
        <path :d="AZION_MARK" />
      </svg>
    </span>
  </div>
</template>

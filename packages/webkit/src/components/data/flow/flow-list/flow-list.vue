<script setup lang="ts">
  import { computed, inject, ref, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useFlowConnectors } from '../connectors'
  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowList',
    inheritAttrs: false
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FlowInjectionKey)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'data-flow'}__list`
  )

  const containerRef = ref<HTMLElement | null>(null)
  const { paths, viewBox } = useFlowConnectors(containerRef, 'sequence')

  const rootClasses = computed(() =>
    cn(
      'relative flex flex-row items-center gap-[var(--spacing-xl)]',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <div
    ref="containerRef"
    role="presentation"
    data-flow-kind="list"
    :data-testid="testId"
    :class="rootClasses"
  >
    <svg
      v-if="paths.length"
      :viewBox="viewBox"
      preserveAspectRatio="none"
      fill="none"
      aria-hidden="true"
      class="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
    >
      <template
        v-for="(path, index) in paths"
        :key="index"
      >
        <path
          :d="path.d"
          stroke-width="1"
          class="stroke-[var(--border-default)]"
          :class="{ 'opacity-50': path.faded }"
        />
        <polygon
          v-if="path.arrow"
          :points="`${path.arrow.x - 7},${path.arrow.y - 4} ${path.arrow.x},${path.arrow.y} ${path.arrow.x - 7},${path.arrow.y + 4}`"
          class="fill-[var(--border-default)]"
          :class="{ 'opacity-50': path.faded }"
        />
      </template>
    </svg>
    <slot />
  </div>
</template>

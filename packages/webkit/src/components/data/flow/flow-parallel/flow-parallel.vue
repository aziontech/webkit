<script setup lang="ts">
  import { computed, inject, ref, useAttrs } from 'vue'

  import { cn } from '../../../../utils/cn'
  import { useFlowConnectors } from '../connectors'
  import { FlowInjectionKey } from '../injection-key'

  defineOptions({
    name: 'FlowParallel',
    inheritAttrs: false
  })

  withDefaults(
    defineProps<{
      /** Horizontal alignment of the parallel branches: `start` left-aligns, `end` right-aligns. */
      align?: 'start' | 'end'
    }>(),
    {
      align: 'start'
    }
  )

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()
  const ctx = inject(FlowInjectionKey)

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? `${ctx?.testId ?? 'data-flow'}__parallel`
  )

  const containerRef = ref<HTMLElement | null>(null)
  const { paths, viewBox } = useFlowConnectors(containerRef, 'parallel')

  const rootClasses = computed(() =>
    cn(
      'relative flex flex-col gap-[var(--spacing-md)] px-[var(--spacing-xl)] data-[align=start]:items-start data-[align=end]:items-end',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <div
    ref="containerRef"
    role="group"
    data-flow-kind="parallel"
    :data-align="align"
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

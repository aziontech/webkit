<script setup lang="ts">
  import { computed, provide, ref, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { useFlowConnectors } from './connectors'
  import { type FlowAlign, FlowInjectionKey } from './injection-key'

  defineOptions({
    name: 'Flow',
    inheritAttrs: false
  })

  const props = withDefaults(
    defineProps<{
      /** Vertical alignment of nodes within the diagram. */
      align?: FlowAlign
    }>(),
    {
      align: 'start'
    }
  )

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(() => (attrs['data-testid'] as string | undefined) ?? 'data-flow')

  const containerRef = ref<HTMLElement | null>(null)
  const { paths, viewBox } = useFlowConnectors(containerRef, 'sequence')

  provide(FlowInjectionKey, {
    testId: testId.value,
    align: props.align
  })

  const outerClasses = computed(() =>
    cn('w-full overflow-x-auto p-[var(--spacing-md)]', attrs.class as string | undefined)
  )
</script>

<template>
  <div
    role="list"
    :data-testid="testId"
    :class="outerClasses"
  >
    <div
      ref="containerRef"
      :data-align="align"
      class="relative flex w-fit flex-row gap-[var(--spacing-xl)] text-[var(--text-default)] data-[align=center]:items-center data-[align=start]:items-start"
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
  </div>
</template>

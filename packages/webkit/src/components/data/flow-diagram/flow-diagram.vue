<script setup lang="ts">
  import { useResizeObserver } from '@vueuse/core'
  import { computed, provide, ref, useAttrs } from 'vue'

  import { cn } from '../../../utils/cn'
  import { useFlowDiagramConnectors } from './composables/use-flow-diagram-connectors'
  import { type FlowDiagramAlign, FlowDiagramInjectionKey } from './injection-key'

  defineOptions({
    name: 'FlowDiagram',
    inheritAttrs: false
  })

  export interface FlowDiagramProps {
    /** Vertical alignment of nodes within the diagram. */
    align?: FlowDiagramAlign
  }

  const props = withDefaults(defineProps<FlowDiagramProps>(), {
    align: 'start'
  })

  defineSlots<{
    default(): unknown
  }>()

  const attrs = useAttrs()

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'flow-diagram'
  )

  const rootEl = ref<HTMLElement | null>(null)
  const containerEl = ref<HTMLElement | null>(null)
  const { paths, viewBox } = useFlowDiagramConnectors(containerEl)

  const overflowing = ref(false)
  const measureOverflow = () => {
    const el = rootEl.value
    overflowing.value = !!el && el.scrollWidth > el.clientWidth + 1
  }
  useResizeObserver(rootEl, measureOverflow)
  useResizeObserver(containerEl, measureOverflow)

  provide(FlowDiagramInjectionKey, {
    testId,
    align: computed(() => props.align)
  })

  const outerClass = computed(() =>
    cn(
      'w-full overflow-x-auto p-(--spacing-md) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset',
      attrs.class as string | undefined
    )
  )
</script>

<template>
  <div
    ref="rootEl"
    v-bind="$attrs"
    role="list"
    :data-testid="testId"
    :tabindex="overflowing ? 0 : undefined"
    :class="outerClass"
  >
    <div
      ref="containerEl"
      :data-align="align"
      class="relative flex w-fit flex-row gap-(--spacing-xl) text-(--text-default) data-[align=center]:items-center data-[align=start]:items-start [&>[data-flow-leading]_[data-slot=flow-port][data-side=end]]:hidden [&>[data-flow-trailing]_[data-slot=flow-port][data-side=start]]:hidden [&_[data-flow-terminal]_[data-slot=flow-port][data-side=start]]:hidden"
    >
      <svg
        v-if="paths.length"
        :viewBox="viewBox"
        preserveAspectRatio="none"
        fill="none"
        aria-hidden="true"
        class="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          v-for="(path, index) in paths"
          :key="index"
          :d="path.d"
          stroke-width="1"
          stroke-dasharray="4 4"
          :data-faded="path.faded || null"
          class="animate-flow-dash stroke-(--accent) motion-reduce:animate-none data-[faded]:animate-none data-[faded]:opacity-50"
        />
      </svg>
      <slot />
    </div>
  </div>
</template>

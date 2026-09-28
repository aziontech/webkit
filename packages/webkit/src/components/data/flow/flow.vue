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
  const { paths, viewBox } = useFlowConnectors(containerRef)

  provide(FlowInjectionKey, {
    testId: testId.value,
    align: props.align
  })

  const outerClass = computed(() =>
    cn('w-full overflow-x-auto p-(--spacing-md)', attrs.class as string | undefined)
  )
</script>

<template>
  <div
    v-bind="$attrs"
    role="list"
    :data-testid="testId"
    :class="outerClass"
  >
    <!-- The three port-hiding rules below drop ports that would attach to nothing:
         leading child (no incoming), trailing child (no outgoing), terminal node
         (originates none). connectors.ts stamps leading/trailing as it measures; the
         terminal rule is a descendant match so it also covers ports a flow-anchor
         renders inside a terminal node. -->
    <div
      ref="containerRef"
      :data-align="align"
      class="relative flex w-fit flex-row gap-(--spacing-xl) text-(--text-default) data-[align=center]:items-center data-[align=start]:items-start [&>[data-flow-leading]_[data-flow-port=end]]:hidden [&>[data-flow-trailing]_[data-flow-port=start]]:hidden [&_[data-flow-terminal]_[data-flow-port=start]]:hidden"
    >
      <!-- Connectors run port-to-port; each end terminates under a node's port, which
           paints over it (nodes sit a layer above this svg). The marching dash reads as
           a live link: dash cycle 8, offset travels 24 to 0, so the pattern lands where
           it started and the loop has no seam. A faded connector (an endpoint node is
           disabled) is not flowing — it keeps the dashes and drops the motion. -->
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

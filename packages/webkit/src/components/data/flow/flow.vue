<script setup lang="ts">
  import { computed, provide, ref, useAttrs, useId } from 'vue'

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
  const { paths, size, viewBox } = useFlowConnectors(containerRef)

  provide(FlowInjectionKey, {
    testId: testId.value,
    align: props.align
  })

  const outerClass = computed(() =>
    cn('w-full overflow-x-auto p-(--spacing-md)', attrs.class as string | undefined)
  )

  // Parallel branches share one clock, so without a stagger every packet leaves at the same
  // instant and the diagram pulses instead of carrying traffic. The step is deliberately not a
  // divisor of the cycle, so the set never collapses back into a single beat.
  const PACKET_STAGGER_MS = 260

  const packetDelay = (index: number): string => `${index * PACKET_STAGGER_MS}ms`

  // One column per `--flow-enter-step`: the node lands on the first half, its outgoing
  // connectors draw on the second — node, line, node, line.
  const revealDelay = (step: number): string => `calc(var(--flow-enter-step) * ${step + 0.5})`

  const revealMaskId = `flow-reveal-${useId()}`

  // The mask region must be user-space: the default is the masked box, and a straight
  // connector's box is zero-height, which would mask the line away. The bleed keeps the
  // reveal stroke's caps inside the region.
  const MASK_BLEED = 16

  const maskRegion = computed(() => ({
    x: -MASK_BLEED,
    y: -MASK_BLEED,
    width: size.value.width + MASK_BLEED * 2,
    height: size.value.height + MASK_BLEED * 2
  }))
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
      class="relative flex w-fit flex-row gap-(--spacing-xl) text-(--text-default) [--flow-enter-step:calc(var(--transition-duration-moderate-02)*2)] data-[align=center]:items-center data-[align=start]:items-start [&>[data-flow-leading]_[data-flow-port=end]]:hidden [&>[data-flow-trailing]_[data-flow-port=start]]:hidden [&_[data-flow-terminal]_[data-flow-port=start]]:hidden"
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
        <!-- One mask for the set: each connector is drawn in by its own stroke, wider
             than everything it reveals, so the line arrives in the direction it carries.
             `white` is full luminance here, not a color. Its resting state is fully
             open, which is what reduced motion leaves behind. -->
        <defs>
          <mask
            :id="revealMaskId"
            maskUnits="userSpaceOnUse"
            :x="maskRegion.x"
            :y="maskRegion.y"
            :width="maskRegion.width"
            :height="maskRegion.height"
          >
            <path
              v-for="(path, index) in paths"
              :key="`reveal-${index}`"
              :d="path.d"
              pathLength="100"
              stroke="white"
              stroke-width="8"
              stroke-linecap="round"
              :style="{ animationDelay: revealDelay(path.step) }"
              class="animate-flow-connector-draw motion-reduce:animate-none"
            />
          </mask>
        </defs>

        <g :mask="`url(#${revealMaskId})`">
          <path
            v-for="(path, index) in paths"
            :key="index"
            :d="path.d"
            stroke-width="1"
            stroke-dasharray="4 4"
            :data-faded="path.faded || null"
            class="animate-flow-dash stroke-(--accent) motion-reduce:animate-none data-[faded]:animate-none data-[faded]:opacity-50"
          />

          <path
            v-for="(path, index) in paths"
            v-show="!path.faded"
            :key="`packet-${index}`"
            :d="path.d"
            pathLength="100"
            stroke-width="2"
            stroke-linecap="butt"
            :style="{ animationDelay: packetDelay(index) }"
            class="animate-flow-packet stroke-(--primary) motion-reduce:animate-none"
          />
        </g>
      </svg>
      <slot />
    </div>
  </div>
</template>

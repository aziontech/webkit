<script setup lang="ts">
  import { computed, ref, useAttrs } from 'vue'

  import { useDiagramConnectors } from './composables/use-diagram-connectors'
  import DiagramLayout from './diagram-layout/diagram-layout.vue'
  import type { DiagramNode, DiagramSpec } from './types'

  defineOptions({ name: 'Diagram', inheritAttrs: false })

  export type {
    DiagramEdge,
    DiagramGroupFill,
    DiagramGroupKind,
    DiagramLayoutItem,
    DiagramNode,
    DiagramNodeKind,
    DiagramNodeStatus,
    DiagramRowAlign,
    DiagramRowGap,
    DiagramSpec
  } from './types'

  interface Props {
    /** The nodes, their layout and the edges between them. */
    spec: DiagramSpec
    /** Accessible description of the whole diagram; when set, the root is announced as one image with this name. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), { ariaLabel: '' })

  const attrs = useAttrs()

  const canvas = ref<globalThis.HTMLElement | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'marketing-diagram')
  const nodes = computed<Record<string, DiagramNode>>(() =>
    Object.fromEntries(props.spec.nodes.map((node) => [node.key, node]))
  )

  const { width, height, paths, labels, ports, ready } = useDiagramConnectors(
    canvas,
    () => props.spec.edges
  )

  const at = (x: number, y: number) => ({ left: `${x}px`, top: `${y}px` })
</script>

<template>
  <figure
    v-bind="$attrs"
    :data-testid="testId"
    :role="ariaLabel ? 'img' : undefined"
    :aria-label="ariaLabel || undefined"
    class="@container m-0 w-full min-w-0 p-(--spacing-md) select-none @3xl:p-(--spacing-xl)"
  >
    <div
      ref="canvas"
      aria-hidden="true"
      :data-testid="`${testId}__canvas`"
      :data-ready="ready || null"
      class="relative mx-auto w-fit max-w-full opacity-0 transition-opacity duration-moderate-02 ease-productive-entrance data-[ready]:opacity-100 motion-reduce:transition-none"
    >
      <svg
        :viewBox="`0 0 ${width} ${height}`"
        fill="none"
        class="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
      >
        <path
          v-for="path in paths"
          :key="path.key"
          :d="path.d"
          :data-active="path.active || null"
          class="stroke-(--border-default) [stroke-width:var(--border-width-default)] data-[active]:stroke-(--accent)"
        />
      </svg>

      <div class="relative">
        <DiagramLayout
          :item="spec.layout"
          :nodes="nodes"
        />
      </div>

      <span
        v-for="port in ports"
        :key="port.key"
        :data-active="port.active || null"
        :data-side="port.side"
        class="absolute size-(--size-2) rounded-(--radius-sm) border-(length:--border-width-default) border-(--border-muted) bg-(--border-default) data-[active]:bg-(--accent) data-[side=bottom]:-translate-x-1/2 data-[side=left]:-translate-x-full data-[side=left]:-translate-y-1/2 data-[side=right]:-translate-y-1/2 data-[side=top]:-translate-x-1/2 data-[side=top]:-translate-y-full"
        :style="at(port.x, port.y)"
      />

      <span
        v-for="chip in labels"
        :key="chip.key"
        :data-active="chip.active || null"
        class="absolute -translate-1/2 rounded-full border-(length:--border-width-default) border-(--border-default) bg-(--bg-surface) px-(--spacing-sm) py-(--spacing-xxs) text-label-code-sm whitespace-nowrap text-(--text-muted) data-[active]:text-(--text-default)"
        :style="at(chip.x, chip.y)"
      >
        {{ chip.label }}
      </span>
    </div>
  </figure>
</template>

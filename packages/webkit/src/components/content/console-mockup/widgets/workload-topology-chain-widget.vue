<script setup lang="ts">
  import { onMounted, onScopeDispose, ref } from 'vue'

  import StatusIndicator from '../../../feedback/status-indicator/status-indicator.vue'
  import Tag from '../../tag/tag.vue'
  import {
    type TopologyArrangement,
    type TopologyDrawing,
    type TopologyLayout,
    type TopologySide,
    WORKLOAD_TOPOLOGY_ARRANGEMENTS
  } from '../lib/workload-topology-data'
  import ConsoleMockupShell, {
    type ConsoleMockupShellFade,
    type ConsoleMockupShellVariant
  } from '../parts/console-mockup-shell.vue'
  import ConsoleMockupShellItem from '../parts/console-mockup-shell-item.vue'

  defineOptions({ name: 'WorkloadTopologyChainWidget' })

  interface Props {
    /** How the mockup is plated. */
    variant?: ConsoleMockupShellVariant
    /** Draw the console bar over the body. */
    chrome?: boolean
    /** Design width of the frame from `md` up. */
    width?: number
    /** Edge the mockup fades out along. */
    fade?: ConsoleMockupShellFade
    /** Whether this widget is the one showing. */
    active?: boolean
  }

  withDefaults(defineProps<Props>(), {
    variant: 'bare',
    chrome: false,
    width: 600,
    fade: 'none',
    active: true
  })

  const CORNER = 10

  const EMPTY: TopologyDrawing = { viewBox: '0 0 0 0', paths: [] }

  const drawings = ref<Record<TopologyLayout, TopologyDrawing>>({ chain: EMPTY, compact: EMPTY })

  const canvases = new Map<TopologyLayout, globalThis.HTMLElement>()

  let observer: globalThis.ResizeObserver | null = null

  const portsOf = (arrangement: TopologyArrangement, key: string): TopologySide[] => [
    ...new Set(
      arrangement.edges.flatMap((edge): TopologySide[] => [
        ...(edge.to === key ? (['start'] as const) : []),
        ...(edge.from === key ? (['end'] as const) : [])
      ])
    )
  ]

  const offsetWithin = (node: globalThis.HTMLElement, canvas: globalThis.HTMLElement) => {
    let left = 0
    let top = 0
    let current: globalThis.Element | null = node
    while (current instanceof globalThis.HTMLElement && current !== canvas) {
      left += current.offsetLeft
      top += current.offsetTop
      current = current.offsetParent
    }
    return { left, top }
  }

  const anchor = (
    node: globalThis.HTMLElement,
    canvas: globalThis.HTMLElement,
    side: TopologySide
  ) => {
    const { left, top } = offsetWithin(node, canvas)
    const y = top + node.offsetHeight / 2
    return side === 'start' ? { x: left, y } : { x: left + node.offsetWidth, y }
  }

  const elbow = (fromX: number, fromY: number, toX: number, toY: number) => {
    if (Math.abs(fromY - toY) < 0.5) return `M${fromX},${fromY} L${toX},${toY}`
    const busX = fromX + (toX - fromX) / 2
    const dir = toY > fromY ? 1 : -1
    const radius = Math.max(0, Math.min(CORNER, Math.abs(toY - fromY) / 2, Math.abs(busX - fromX)))
    return [
      `M${fromX},${fromY}`,
      `H${busX - radius}`,
      `Q${busX},${fromY} ${busX},${fromY + dir * radius}`,
      `V${toY - dir * radius}`,
      `Q${busX},${toY} ${busX + radius},${toY}`,
      `H${toX}`
    ].join(' ')
  }

  const draw = (arrangement: TopologyArrangement): TopologyDrawing => {
    const canvas = canvases.get(arrangement.key)
    if (!canvas?.offsetWidth) return EMPTY
    const nodeOf = (key: string) =>
      canvas.querySelector<globalThis.HTMLElement>(`[data-topology-node="${key}"]`)
    const paths = arrangement.edges.flatMap((edge) => {
      const source = nodeOf(edge.from)
      const target = nodeOf(edge.to)
      if (!source || !target) return []
      const from = anchor(source, canvas, 'end')
      const to = anchor(target, canvas, 'start')
      return [elbow(from.x, from.y, to.x, to.y)]
    })
    return { viewBox: `0 0 ${canvas.offsetWidth} ${canvas.offsetHeight}`, paths }
  }

  const measure = () => {
    drawings.value = {
      chain: draw(WORKLOAD_TOPOLOGY_ARRANGEMENTS[0]),
      compact: draw(WORKLOAD_TOPOLOGY_ARRANGEMENTS[1])
    }
  }

  const bindCanvas = (key: TopologyLayout, element: unknown) => {
    if (element instanceof globalThis.HTMLElement) canvases.set(key, element)
    else canvases.delete(key)
  }

  onMounted(() => {
    observer = new globalThis.ResizeObserver(measure)
    canvases.forEach((canvas) => {
      observer?.observe(canvas)
      canvas.querySelectorAll('[data-topology-node]').forEach((node) => observer?.observe(node))
    })
    measure()
  })

  onScopeDispose(() => observer?.disconnect())

  const PORT_CLASS =
    'absolute top-1/2 size-2 -translate-y-1/2 rounded-(--radius-sm) border border-(--border-muted) bg-(--accent) ' +
    'data-[side=start]:-start-px data-[side=start]:-translate-x-full data-[side=end]:-end-px data-[side=end]:translate-x-full'
</script>

<template>
  <ConsoleMockupShell
    :variant="variant"
    :chrome="chrome"
    :width="width"
    :fade="fade"
    :active="active"
  >
    <div
      v-for="arrangement in WORKLOAD_TOPOLOGY_ARRANGEMENTS"
      :key="arrangement.key"
      :ref="(element) => bindCanvas(arrangement.key, element)"
      :data-layout="arrangement.key"
      class="group/topology relative grid h-full grid-cols-3 items-center gap-x-(--spacing-xl) p-(--spacing-xs) data-[layout=chain]:hidden md:data-[layout=chain]:grid md:data-[layout=compact]:hidden"
    >
      <ConsoleMockupShellItem
        :order="3"
        class="pointer-events-none absolute inset-0"
      >
        <svg
          v-if="drawings[arrangement.key].paths.length"
          :viewBox="drawings[arrangement.key].viewBox"
          preserveAspectRatio="none"
          fill="none"
          aria-hidden="true"
          class="absolute inset-0 h-full w-full overflow-visible"
        >
          <path
            v-for="(path, index) in drawings[arrangement.key].paths"
            :key="index"
            :d="path"
            stroke-width="1.5"
            class="stroke-(--accent)"
          />
        </svg>
      </ConsoleMockupShellItem>
      <ConsoleMockupShellItem
        v-for="column in arrangement.columns"
        :key="column.key"
        :order="column.order"
        class="min-w-0 self-center"
      >
        <div
          class="flex min-w-0 flex-col gap-(--spacing-lg) group-data-[layout=compact]/topology:gap-(--spacing-2xl)"
        >
          <div
            v-for="node in column.nodes"
            :key="node.key"
            :data-topology-node="node.key"
            class="relative flex min-w-0 flex-col gap-(--spacing-xs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface) p-(--spacing-sm) shadow-(--shadow-xs)"
          >
            <span
              v-for="side in portsOf(arrangement, node.key)"
              :key="side"
              :data-side="side"
              :class="PORT_CLASS"
              aria-hidden="true"
            />
            <div
              v-if="arrangement.key === 'compact'"
              class="flex min-w-0 flex-col items-center gap-(--spacing-xs) py-(--spacing-2xs) text-center"
            >
              <i
                :class="node.icon"
                class="shrink-0 text-heading-sm leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="max-w-full truncate text-label-md text-(--text-default)">{{
                node.eyebrow
              }}</span>
            </div>
            <div
              v-else
              class="flex items-center gap-(--spacing-2xs)"
            >
              <i
                :class="node.icon"
                class="shrink-0 text-label-sm leading-none text-(--text-muted)"
                aria-hidden="true"
              />
              <span class="truncate text-label-sm text-(--text-muted)">{{ node.eyebrow }}</span>
              <span class="ms-auto inline-flex shrink-0">
                <StatusIndicator
                  v-if="node.indicator"
                  :label="node.label"
                />
                <Tag
                  v-else
                  :label="node.label"
                  severity="neutral"
                  size="small"
                />
              </span>
            </div>
            <span
              v-if="arrangement.key !== 'compact'"
              class="truncate text-label-md text-(--text-default)"
              >{{ node.title }}</span
            >
          </div>
        </div>
      </ConsoleMockupShellItem>
    </div>
  </ConsoleMockupShell>
</template>

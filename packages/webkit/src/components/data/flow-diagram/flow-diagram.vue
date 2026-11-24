<script setup lang="ts">
  import { computed, defineAsyncComponent, provide, ref, useAttrs, useSlots } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { cn } from '../../../utils/cn'
  import { useFlowDiagramConnectors } from './composables/use-flow-diagram-connectors'
  import { useFlowDiagramFit } from './composables/use-flow-diagram-fit'
  import FlowDiagramGroup from './flow-diagram-group/flow-diagram-group.vue'
  import FlowDiagramNode from './flow-diagram-node/flow-diagram-node.vue'
  import { FlowDiagramInjectionKey } from './injection-key'
  import { rankColumns } from './lib/rank'
  import type { FlowDiagramAlign, FlowDiagramEdgeData, FlowDiagramNodeData } from './types'

  export type {
    FlowDiagramAlign,
    FlowDiagramBindOption,
    FlowDiagramEdgeData,
    FlowDiagramNodeData,
    FlowDiagramNodeField,
    FlowDiagramNodeMetric,
    FlowDiagramSeverity
  } from './types'

  defineOptions({
    name: 'FlowDiagram',
    inheritAttrs: false
  })

  /** How the diagram lays its steps out. */
  export type FlowDiagramOrientation = 'horizontal' | 'vertical' | 'responsive'

  export interface FlowDiagramProps {
    /** Nodes of a data-driven diagram; each renders as a full card. Leave empty to compose the parts by hand. */
    nodes?: FlowDiagramNodeData[]
    /** Connectors between nodes by id; they also decide the columns. Empty joins each step to the next. */
    edges?: FlowDiagramEdgeData[]
    /** Lays the steps out in a row, in a column, or in a row that stacks when its container is narrow. */
    orientation?: FlowDiagramOrientation
    /** Vertical alignment of the steps in a row. */
    align?: FlowDiagramAlign
    /** Gives every step the width and height of the largest one. */
    uniform?: boolean
    /** Shows placeholder steps while the diagram loads. */
    loading?: boolean
    /** Accessible name of the diagram. Empty uses the locale catalog (`Diagram`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<FlowDiagramProps>(), {
    nodes: () => [],
    edges: () => [],
    orientation: 'responsive',
    align: 'start',
    uniform: false,
    loading: false,
    ariaLabel: ''
  })

  const openKeys = defineModel<string[]>('openKeys', { default: () => [] })

  defineSlots<{
    /** Hand-composed steps: nodes and groups, in flow order. */
    default(): unknown
    /** Controls at the end of a data node's title row. */
    actions(props: { node: FlowDiagramNodeData }): unknown
    /** Replaces the empty state shown when there are no nodes. */
    empty(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const FlowDiagramCard = defineAsyncComponent(() => import('./parts/flow-diagram-card.vue'))
  const EmptyState = defineAsyncComponent(
    () => import('../../feedback/empty-state/empty-state.vue')
  )
  const Skeleton = defineAsyncComponent(() => import('../../feedback/skeleton/skeleton.vue'))
  const { t } = useTranslate({ flowDiagram: en.flowDiagram })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'flow-diagram'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(
      Object.entries(attrs).filter(([key]) => key !== 'data-testid' && key !== 'class')
    )
  )
  const label = computed<string>(() => props.ariaLabel || t('flowDiagram.label'))

  const composed = (): boolean => !props.nodes.length && Boolean(slots['default'])
  const empty = (): boolean => !props.loading && !composed() && !props.nodes.length

  const PLACEHOLDER: FlowDiagramNodeData[][] = [
    [{ id: 'a' }],
    [{ id: 'b' }],
    [{ id: 'c' }, { id: 'd', terminal: true }]
  ]
  const columns = computed<FlowDiagramNodeData[][]>(() =>
    props.loading ? PLACEHOLDER : rankColumns(props.nodes, props.edges)
  )
  const grouped = computed<boolean>(() => props.loading || props.edges.length > 0)
  const labelled = computed<boolean>(() => props.edges.some((edge) => Boolean(edge.label)))
  const titleOf = (id: string): string => {
    const node = props.nodes.find((entry) => entry.id === id)
    return node?.title || node?.eyebrow || id
  }

  const scrollEl = ref<HTMLElement | null>(null)
  const containerEl = ref<HTMLElement | null>(null)
  const { paths, labels, viewBox, vertical } = useFlowDiagramConnectors(containerEl, () =>
    props.loading ? [] : props.edges
  )

  const { direction, overflowStart, overflowEnd, overflowBlock, measureEdges } = useFlowDiagramFit(
    scrollEl,
    containerEl,
    () => props.orientation
  )
  const scrollable = computed<boolean>(
    () => overflowStart.value || overflowEnd.value || overflowBlock.value
  )

  provide(FlowDiagramInjectionKey, {
    testId,
    align: computed(() => props.align)
  })

  const isOpen = (key: string): boolean => openKeys.value.includes(key)
  const toggle = (key: string): void => {
    openKeys.value = isOpen(key)
      ? openKeys.value.filter((entry) => entry !== key)
      : [...openKeys.value, key]
  }

  const rootClass = computed(() =>
    cn('@container/flow-diagram w-full min-w-0 text-(--text-default)', attrs.class as string)
  )

  const VIEWPORT_CLASS =
    'w-full overflow-x-auto overscroll-x-contain p-(--spacing-md) outline-none [scrollbar-width:thin] [scrollbar-color:var(--border-muted)_transparent] ' +
    'focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset ' +
    '[--flow-diagram-fade-direction:to_right] rtl:[--flow-diagram-fade-direction:to_left] ' +
    'data-[overflow-start]:[--flow-diagram-fade-start:transparent] ' +
    'data-[overflow-end]:[--flow-diagram-fade-end:transparent] ' +
    '[&:is([data-overflow-start],[data-overflow-end])]:[mask-image:linear-gradient(var(--flow-diagram-fade-direction),var(--flow-diagram-fade-start,black)_0,black_var(--spacing-2xl),black_calc(100%-var(--spacing-2xl)),var(--flow-diagram-fade-end,black)_100%)]'

  const EDGE_PATH_CLASS =
    'animate-flow-dash-settle stroke-(--accent) ' +
    'data-[severity=danger]:stroke-(--danger-mark) data-[severity=warning]:stroke-(--warning-mark) data-[severity=success]:stroke-(--success-mark) ' +
    'data-[severity=info]:stroke-(--info-mark) data-[severity=neutral]:stroke-(--border-strong) ' +
    'motion-reduce:animate-none ' +
    'data-[faded]:animate-none data-[faded]:opacity-50'

  const LIST_CLASS =
    'relative flex w-full gap-(--spacing-xl) ' +
    'data-[direction=column]:flex-col data-[direction=column]:max-w-(--container-xl) data-[direction=row]:w-fit data-[direction=row]:min-w-full data-[direction=row]:data-[align=start]:items-start ' +
    'data-[direction=row]:data-[align=center]:items-center ' +
    'data-[labelled]:gap-x-(--spacing-2xl) ' +
    'data-[direction=row]:data-[uniform]:grid data-[direction=row]:data-[uniform]:auto-cols-fr data-[direction=row]:data-[uniform]:grid-flow-col ' +
    'data-[direction=row]:data-[uniform]:*:self-stretch ' +
    'data-[stacked]:[&_[data-slot=flow-diagram-port]]:hidden ' +
    '[&_[data-slot=flow-diagram-node]:not([data-entry])_[data-slot=flow-diagram-port][data-side=end]]:hidden ' +
    '[&_[data-slot=flow-diagram-node]:not([data-exit])_[data-slot=flow-diagram-port][data-side=start]]:hidden'

  const EDGE_LABEL_CLASS =
    'pointer-events-none absolute z-2 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-control) border border-solid border-(--border-default) bg-(--bg-canvas) px-(--spacing-2xs) ' +
    'text-body-xs whitespace-nowrap text-(--text-muted) tabular-nums ' +
    'data-[beside]:translate-x-0 ' +
    'rtl:data-[beside]:-translate-x-full ' +
    'data-[severity=danger]:border-(--danger-border) data-[severity=danger]:text-(--danger-foreground) data-[severity=warning]:border-(--warning-border) ' +
    'data-[severity=warning]:text-(--warning-foreground) data-[severity=success]:border-(--success-border) data-[severity=success]:text-(--success-foreground)'
</script>

<template>
  <div
    v-bind="rootAttrs"
    role="group"
    :aria-label="label"
    :aria-busy="loading || undefined"
    :data-testid="testId"
    data-plain-ground
    :data-loading="loading || null"
    :class="rootClass"
  >
    <div
      v-if="empty()"
      :data-testid="`${testId}__empty`"
      class="p-(--spacing-md)"
    >
      <slot name="empty">
        <EmptyState
          size="small"
          icon="az az-sitemap"
          :title="t('flowDiagram.emptyTitle')"
        />
      </slot>
    </div>
    <div
      v-else
      ref="scrollEl"
      :tabindex="scrollable ? 0 : undefined"
      :data-overflow-start="overflowStart || null"
      :data-overflow-end="overflowEnd || null"
      :data-testid="`${testId}__viewport`"
      @scroll.passive="measureEdges"
      :class="VIEWPORT_CLASS"
    >
      <span
        v-if="loading"
        role="status"
        class="sr-only"
        >{{ t('flowDiagram.loading') }}</span
      >
      <div class="relative w-fit min-w-full">
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
            :data-severity="path.severity"
            :class="EDGE_PATH_CLASS"
          />
        </svg>
        <div
          ref="containerEl"
          role="list"
          :aria-hidden="loading || undefined"
          :data-orientation="orientation"
          :data-direction="direction"
          :data-align="align"
          :data-uniform="uniform || null"
          :data-labelled="labelled || null"
          :data-stacked="vertical || null"
          :data-testid="`${testId}__list`"
          :class="LIST_CLASS"
        >
          <slot v-if="composed()" />
          <template v-else>
            <template
              v-for="(column, index) in columns"
              :key="index"
            >
              <FlowDiagramGroup
                v-if="grouped"
                :data-testid="`${testId}__column`"
                class="min-w-(--size-56) flex-1"
              >
                <template
                  v-for="node in column"
                  :key="node.id"
                >
                  <FlowDiagramNode
                    v-if="loading"
                    :terminal="node.terminal"
                    class="w-full"
                  >
                    <span class="flex w-full flex-col gap-(--spacing-sm) py-(--spacing-2xs)">
                      <Skeleton
                        height="var(--size-3)"
                        width="50%"
                      />
                      <Skeleton
                        height="var(--size-4)"
                        width="80%"
                      />
                    </span>
                  </FlowDiagramNode>
                  <FlowDiagramCard
                    v-else
                    :node="node"
                    :open="isOpen(node.id)"
                    :test-id="testId"
                    card
                    @toggle="() => toggle(node.id)"
                  >
                    <template
                      v-if="$slots['actions']"
                      #actions
                    >
                      <slot
                        name="actions"
                        :node="node"
                      />
                    </template>
                  </FlowDiagramCard>
                </template>
              </FlowDiagramGroup>
              <FlowDiagramCard
                v-for="node in column"
                v-else
                :key="node.id"
                :node="node"
                :open="isOpen(node.id)"
                :test-id="testId"
                :card="uniform"
                @toggle="() => toggle(node.id)"
              >
                <template
                  v-if="$slots['actions']"
                  #actions
                >
                  <slot
                    name="actions"
                    :node="node"
                  />
                </template>
              </FlowDiagramCard>
            </template>
          </template>
        </div>
        <span
          v-for="(mark, index) in labels"
          :key="`label-${index}`"
          aria-hidden="true"
          :data-severity="mark.severity"
          :data-beside="mark.beside || null"
          :data-testid="`${testId}__edge-label`"
          :style="{ left: `${mark.x}px`, top: `${mark.y}px` }"
          :class="EDGE_LABEL_CLASS"
          >{{ mark.text }}</span
        >
      </div>
      <ul
        v-if="!composed() && !loading && edges.length"
        :aria-label="t('flowDiagram.connections')"
        :data-testid="`${testId}__connections`"
        class="sr-only"
      >
        <li
          v-for="edge in edges"
          :key="`${edge.from}-${edge.to}`"
        >
          {{ t('flowDiagram.connection', { from: titleOf(edge.from), to: titleOf(edge.to) })
          }}{{ edge.label ? `, ${edge.label}` : '' }}
        </li>
      </ul>
    </div>
  </div>
</template>

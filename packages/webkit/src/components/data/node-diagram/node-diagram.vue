<script setup lang="ts">
  import { useResizeObserver } from '@vueuse/core'
  import { computed, defineAsyncComponent, provide, ref, useAttrs, useSlots } from 'vue'

  import { useTranslate } from '../../../composables/use-translate'
  import * as en from '../../../locales/en'
  import { cn } from '../../../utils/cn'
  import EmptyState from '../../feedback/empty-state/empty-state.vue'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { useNodeDiagramConnectors } from './composables/use-node-diagram-connectors'
  import { NodeDiagramInjectionKey } from './injection-key'
  import { rankColumns } from './lib/rank'
  import NodeDiagramGroup from './node-diagram-group/node-diagram-group.vue'
  import NodeDiagramNode from './node-diagram-node/node-diagram-node.vue'
  import type { NodeDiagramAlign, NodeDiagramEdgeData, NodeDiagramNodeData } from './types'

  export type {
    NodeDiagramAlign,
    NodeDiagramBindOption,
    NodeDiagramEdgeData,
    NodeDiagramNodeData,
    NodeDiagramNodeField,
    NodeDiagramNodeMetric,
    NodeDiagramSeverity
  } from './types'

  defineOptions({
    name: 'NodeDiagram',
    inheritAttrs: false
  })

  /** How the diagram lays its steps out. */
  export type NodeDiagramOrientation = 'horizontal' | 'vertical' | 'responsive'

  export interface NodeDiagramProps {
    /** Nodes of a data-driven diagram; each renders as a full card. Leave empty to compose the parts by hand. */
    nodes?: NodeDiagramNodeData[]
    /** Connectors between nodes by id; they also decide the columns. Empty joins each step to the next. */
    edges?: NodeDiagramEdgeData[]
    /** Lays the steps out in a row, in a column, or in a row that stacks when its container is narrow. */
    orientation?: NodeDiagramOrientation
    /** Vertical alignment of the steps in a row. */
    align?: NodeDiagramAlign
    /** Gives every step the width and height of the largest one. */
    uniform?: boolean
    /** Shows placeholder steps while the diagram loads. */
    loading?: boolean
    /** Accessible name of the diagram. Empty uses the locale catalog (`Diagram`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<NodeDiagramProps>(), {
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
    actions(props: { node: NodeDiagramNodeData }): unknown
    /** Replaces the empty state shown when there are no nodes. */
    empty(): unknown
  }>()

  const attrs = useAttrs()
  const slots = useSlots()
  const NodeDiagramCard = defineAsyncComponent(() => import('./parts/node-diagram-card.vue'))
  const { t } = useTranslate({ nodeDiagram: en.nodeDiagram })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'node-diagram'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(
      Object.entries(attrs).filter(([key]) => key !== 'data-testid' && key !== 'class')
    )
  )
  const label = computed<string>(() => props.ariaLabel || t('nodeDiagram.label'))

  const composed = (): boolean => !props.nodes.length && Boolean(slots['default'])
  const empty = (): boolean => !props.loading && !composed() && !props.nodes.length

  const PLACEHOLDER: NodeDiagramNodeData[][] = [
    [{ id: 'a' }],
    [{ id: 'b' }],
    [{ id: 'c' }, { id: 'd', terminal: true }]
  ]
  const columns = computed<NodeDiagramNodeData[][]>(() =>
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
  const scrollable = ref<boolean>(false)
  const { paths, labels, viewBox, vertical } = useNodeDiagramConnectors(containerEl, () =>
    props.loading ? [] : props.edges
  )

  useResizeObserver(
    () => scrollEl.value,
    () => {
      const el = scrollEl.value
      scrollable.value = Boolean(el && el.scrollWidth > el.clientWidth + 1)
    }
  )

  provide(NodeDiagramInjectionKey, {
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
    cn('@container/node-diagram w-full min-w-0 text-(--text-default)', attrs.class as string)
  )
</script>

<template>
  <div
    v-bind="rootAttrs"
    role="group"
    :aria-label="label"
    :aria-busy="loading || undefined"
    :data-testid="testId"
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
          :title="t('nodeDiagram.emptyTitle')"
        />
      </slot>
    </div>
    <div
      v-else
      ref="scrollEl"
      :tabindex="scrollable ? 0 : undefined"
      class="w-full overflow-x-auto overscroll-x-contain p-(--spacing-md) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
    >
      <span
        v-if="loading"
        role="status"
        class="sr-only"
        >{{ t('nodeDiagram.loading') }}</span
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
            class="animate-flow-dash-settle stroke-(--accent) data-[severity=danger]:stroke-(--danger-mark) data-[severity=warning]:stroke-(--warning-mark) data-[severity=success]:stroke-(--success-mark) data-[severity=info]:stroke-(--info-mark) data-[severity=neutral]:stroke-(--border-strong) motion-reduce:animate-none data-[faded]:animate-none data-[faded]:opacity-50"
          />
        </svg>
        <div
          ref="containerEl"
          role="list"
          :aria-hidden="loading || undefined"
          :data-orientation="orientation"
          :data-align="align"
          :data-uniform="uniform || null"
          :data-labelled="labelled || null"
          :data-stacked="vertical || null"
          :data-testid="`${testId}__list`"
          class="relative flex w-full gap-(--spacing-xl) data-[orientation=vertical]:flex-col data-[orientation=responsive]:flex-col @xl/node-diagram:data-[orientation=responsive]:flex-row data-[orientation=horizontal]:w-fit data-[orientation=horizontal]:min-w-full @xl/node-diagram:data-[orientation=responsive]:w-fit @xl/node-diagram:data-[orientation=responsive]:min-w-full data-[orientation=horizontal]:data-[align=start]:items-start data-[orientation=horizontal]:data-[align=center]:items-center @xl/node-diagram:data-[orientation=responsive]:data-[align=start]:items-start @xl/node-diagram:data-[orientation=responsive]:data-[align=center]:items-center data-[labelled]:gap-x-(--spacing-2xl) data-[orientation=horizontal]:data-[uniform]:grid data-[orientation=horizontal]:data-[uniform]:auto-cols-fr data-[orientation=horizontal]:data-[uniform]:grid-flow-col data-[orientation=horizontal]:data-[uniform]:*:self-stretch @xl/node-diagram:data-[orientation=responsive]:data-[uniform]:grid @xl/node-diagram:data-[orientation=responsive]:data-[uniform]:auto-cols-fr @xl/node-diagram:data-[orientation=responsive]:data-[uniform]:grid-flow-col @xl/node-diagram:data-[orientation=responsive]:data-[uniform]:*:self-stretch data-[stacked]:[&_[data-slot=node-diagram-port]]:hidden [&_[data-slot=node-diagram-node]:not([data-entry])_[data-slot=node-diagram-port][data-side=end]]:hidden [&_[data-slot=node-diagram-node]:not([data-exit])_[data-slot=node-diagram-port][data-side=start]]:hidden"
        >
          <slot v-if="composed()" />
          <template v-else>
            <template
              v-for="(column, index) in columns"
              :key="index"
            >
              <NodeDiagramGroup
                v-if="grouped"
                :data-testid="`${testId}__column`"
                class="min-w-(--size-56) flex-1"
              >
                <template
                  v-for="node in column"
                  :key="node.id"
                >
                  <NodeDiagramNode
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
                  </NodeDiagramNode>
                  <NodeDiagramCard
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
                  </NodeDiagramCard>
                </template>
              </NodeDiagramGroup>
              <NodeDiagramCard
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
              </NodeDiagramCard>
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
          class="pointer-events-none absolute z-2 -translate-x-1/2 -translate-y-1/2 rounded-(--shape-control) border border-solid border-(--border-default) bg-(--bg-canvas) px-(--spacing-2xs) text-body-xs whitespace-nowrap text-(--text-muted) tabular-nums data-[beside]:translate-x-0 rtl:data-[beside]:-translate-x-full data-[severity=danger]:border-(--danger-border) data-[severity=danger]:text-(--danger-foreground) data-[severity=warning]:border-(--warning-border) data-[severity=warning]:text-(--warning-foreground) data-[severity=success]:border-(--success-border) data-[severity=success]:text-(--success-foreground)"
          >{{ mark.text }}</span
        >
      </div>
      <ul
        v-if="!composed() && !loading && edges.length"
        :aria-label="t('nodeDiagram.connections')"
        :data-testid="`${testId}__connections`"
        class="sr-only"
      >
        <li
          v-for="edge in edges"
          :key="`${edge.from}-${edge.to}`"
        >
          {{ t('nodeDiagram.connection', { from: titleOf(edge.from), to: titleOf(edge.to) })
          }}{{ edge.label ? `, ${edge.label}` : '' }}
        </li>
      </ul>
    </div>
  </div>
</template>

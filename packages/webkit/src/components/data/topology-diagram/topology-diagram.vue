<script setup lang="ts">
  import { useResizeObserver } from '@vueuse/core'
  import { computed, ref, useAttrs } from 'vue'

  import { useTranslate } from '../../../composables/use-locale/use-translate'
  import * as en from '../../../i18n/messages/en'
  import Skeleton from '../../feedback/skeleton/skeleton.vue'
  import { useFlowConnectors } from '../flow/connectors'
  import TopologyDiagramNode from './topology-node/topology-node.vue'
  import type { TopologyLevel, TopologyNode } from './types'

  export type {
    TopologyBindOption,
    TopologyLevel,
    TopologyNode,
    TopologyNodeField,
    TopologyNodeSeverity
  } from './types'

  defineOptions({
    name: 'TopologyDiagram',
    inheritAttrs: false
  })

  interface Props {
    /** Columns of the diagram, from the entry point to the last dependency. */
    levels?: TopologyLevel[]
    /** Shows placeholder cards while the topology loads. */
    loading?: boolean
    /** Accessible name of the diagram. Empty uses the locale catalog (`Deployment topology`). */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    levels: () => [],
    loading: false,
    ariaLabel: ''
  })

  const expanded = defineModel<string[]>('expanded', { default: () => [] })

  const emit = defineEmits<{
    /** An existing option was picked in a node's bind control. */
    bind: [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      binding: { key: string; value: string }
    ]
    /** The remove control of a bound node was activated. */
    remove: [event: globalThis.MouseEvent, key: string]
    /** Create was picked in a node's bind control. */
    create: [event: globalThis.MouseEvent | globalThis.KeyboardEvent, key: string]
  }>()

  defineSlots<{
    /** Extra controls in a node's identity row, before the bind control. */
    actions(props: { node: TopologyNode }): unknown
    /** Replaces the line shown when there are no levels. */
    empty(): unknown
  }>()

  const attrs = useAttrs()
  const { t } = useTranslate({ topologyDiagram: en.topologyDiagram })

  const testId = computed<string>(
    () => (attrs['data-testid'] as string | undefined) ?? 'data-topology-diagram'
  )
  const rootAttrs = computed(() =>
    Object.fromEntries(Object.entries(attrs).filter(([key]) => key !== 'data-testid'))
  )
  const label = computed<string>(() => props.ariaLabel || t('topologyDiagram.label'))

  const PLACEHOLDER: TopologyLevel[] = [
    { key: 'a', nodes: [{ key: 'a', kind: '' }] },
    { key: 'b', nodes: [{ key: 'b', kind: '' }] },
    {
      key: 'c',
      nodes: [
        { key: 'c', kind: '' },
        { key: 'd', kind: '', terminal: true }
      ]
    }
  ]
  const shown = computed<TopologyLevel[]>(() => (props.loading ? PLACEHOLDER : props.levels))

  const scrollRef = ref<HTMLElement | null>(null)
  const containerRef = ref<HTMLElement | null>(null)
  const scrollable = ref<boolean>(false)
  const { paths, viewBox } = useFlowConnectors(containerRef)

  useResizeObserver(
    () => scrollRef.value,
    () => {
      const el = scrollRef.value
      scrollable.value = Boolean(el && el.scrollWidth > el.clientWidth)
    }
  )

  const isOpen = (key: string): boolean => expanded.value.includes(key)
  const toggle = (key: string): void => {
    expanded.value = isOpen(key)
      ? expanded.value.filter((entry) => entry !== key)
      : [...expanded.value, key]
  }
</script>

<template>
  <section
    v-bind="rootAttrs"
    :aria-label="label"
    :aria-busy="loading || undefined"
    :data-testid="testId"
    :data-loading="loading || null"
    class="w-full min-w-0 text-(--text-default)"
  >
    <div
      v-if="!loading && !levels.length"
      :data-testid="`${testId}__empty`"
      class="p-(--spacing-md) text-body-sm text-(--text-muted)"
    >
      <slot name="empty">
        <p>{{ t('topologyDiagram.empty') }}</p>
      </slot>
    </div>
    <div
      v-else
      ref="scrollRef"
      :tabindex="scrollable ? 0 : undefined"
      :aria-label="scrollable ? label : undefined"
      :role="scrollable ? 'group' : undefined"
      class="w-full overflow-x-auto overscroll-x-contain p-(--spacing-md) outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-inset"
    >
      <span
        v-if="loading"
        role="status"
        class="sr-only"
        >{{ t('topologyDiagram.loading') }}</span
      >
      <div class="relative w-full min-w-fit">
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
        <ol
          ref="containerRef"
          :aria-hidden="loading || undefined"
          class="relative m-0 flex w-full list-none flex-row items-start gap-(--spacing-xl) p-0 [&>[data-flow-leading]_[data-flow-port=end]]:hidden [&>[data-flow-trailing]_[data-flow-port=start]]:hidden [&_[data-flow-terminal]_[data-flow-port=start]]:hidden"
        >
          <li
            v-for="level in shown"
            :key="level.key"
            data-flow-kind="parallel"
            :data-testid="`${testId}__level`"
            class="flex min-w-(--size-56) flex-1 flex-col items-start gap-(--spacing-md)"
          >
            <span
              v-if="level.label"
              class="sr-only"
              >{{ level.label }}</span
            >
            <div
              v-for="node in level.nodes"
              :key="node.key"
              data-flow-kind="node"
              :data-flow-terminal="node.terminal ? 'true' : null"
              class="relative z-1 w-full"
            >
              <div
                v-if="loading"
                data-flow-anchor="both"
                class="flex w-full flex-col gap-(--spacing-sm) rounded-(--shape-card) border border-solid border-(--border-muted) bg-(--bg-surface) p-(--spacing-md)"
              >
                <Skeleton
                  height="var(--size-3)"
                  width="50%"
                />
                <Skeleton
                  height="var(--size-4)"
                  width="80%"
                />
              </div>
              <TopologyDiagramNode
                v-else
                :node="node"
                :open="isOpen(node.key)"
                :test-id="testId"
                @toggle="toggle(node.key)"
                @bind="(event, value) => emit('bind', event, { key: node.key, value })"
                @remove="(event) => emit('remove', event, node.key)"
                @create="(event) => emit('create', event, node.key)"
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
              </TopologyDiagramNode>
            </div>
          </li>
        </ol>
      </div>
    </div>
  </section>
</template>

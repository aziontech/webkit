<script setup lang="ts">
  import { computed, ref, shallowRef, useAttrs, watch } from 'vue'

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

  export type DiagramName =
    | 'ai-gateway'
    | 'ai-gateway-latency-routing'
    | 'ai-gateway-model-routing'
    | 'ai-gateway-provider-failover'
    | 'ai-gateway-response-cache'
    | 'ai-inference'
    | 'application-accelerator'
    | 'applications'
    | 'bot-manager'
    | 'cache'
    | 'data-stream'
    | 'ddos-protection'
    | 'edge-dns'
    | 'firewall'
    | 'functions'
    | 'image-processor'
    | 'kv-store'
    | 'load-balancer'
    | 'network-shield'
    | 'object-storage'
    | 'real-time-events'
    | 'real-time-metrics'
    | 'sql-database'
    | 'web-application-firewall'
    | 'workloads'
    | 'workloads-gradual-rollout'
    | 'workloads-isolate-per-request'
    | 'workloads-security'

  interface Props {
    /** Name of an official diagram in the asset library; ignored when spec is set. */
    name?: DiagramName
    /** The nodes, their layout and the edges between them, for a diagram the library does not have. */
    spec?: DiagramSpec
    /** Accessible description of the whole diagram; empty uses the description the spec carries. */
    ariaLabel?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    name: undefined,
    spec: undefined,
    ariaLabel: ''
  })

  const attrs = useAttrs()

  const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true

  const canvas = ref<globalThis.HTMLElement | null>(null)
  const named = shallowRef<DiagramSpec | null>(null)

  const testId = computed(() => (attrs['data-testid'] as string | undefined) ?? 'marketing-diagram')
  const drawn = computed<DiagramSpec | null>(() => props.spec ?? named.value)
  const label = computed(() => props.ariaLabel || drawn.value?.ariaLabel || '')
  const nodes = computed<Record<string, DiagramNode>>(() =>
    Object.fromEntries((drawn.value?.nodes ?? []).map((node) => [node.key, node]))
  )

  watch(
    () => props.name,
    (name) => {
      named.value = null
      if (!name) return
      import('../../../assets/diagrams/registry')
        .then(({ resolveDiagram }) => {
          const load = resolveDiagram(name)
          if (!load) throw new Error('not in the diagram library')
          return load()
        })
        .then((loaded) => {
          if (props.name === name) named.value = loaded.default
        })
        .catch((error: unknown) => {
          if (dev) console.warn(`[webkit] <Diagram>: could not load "${name}".`, error)
        })
    },
    { immediate: true }
  )

  const { width, height, paths, labels, ports, ready } = useDiagramConnectors(
    canvas,
    () => drawn.value?.edges ?? []
  )

  const at = (x: number, y: number) => ({ left: `${x}px`, top: `${y}px` })
</script>

<template>
  <figure
    v-bind="$attrs"
    :data-testid="testId"
    :data-name="spec ? undefined : name"
    :role="label ? 'img' : undefined"
    :aria-label="label || undefined"
    class="@container m-0 w-full min-w-0 p-(--spacing-md) select-none @3xl:p-(--spacing-xl)"
  >
    <div
      v-if="drawn"
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
          :item="drawn.layout"
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

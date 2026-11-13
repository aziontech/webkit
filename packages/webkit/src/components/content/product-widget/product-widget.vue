<script setup lang="ts">
  import { type Component, computed, markRaw, provide, shallowRef, useAttrs, watch } from 'vue'

  import type { TextureMaterialKind } from '../../marketing/texture-material/texture-material.vue'
  import type { ShellMockupFade, ShellMockupKind } from '../shell-mockup/shell-mockup.vue'
  import { ProductWidgetInjectionKey } from './injection-key'
  import type * as Plates from './plates'
  import { resolveProductWidget } from './registry'

  defineOptions({ name: 'ProductWidget', inheritAttrs: false })

  export type ProductWidgetName =
    | 'ai-inference-function'
    | 'ai-inference-model'
    | 'ai-inference-template'
    | 'application-accelerator-cookie'
    | 'application-accelerator-method'
    | 'application-accelerator-query-string'
    | 'application-cache'
    | 'application-function'
    | 'application-rule'
    | 'application-version'
    | 'applications-create-method'
    | 'applications-device-group'
    | 'applications-rule-phases'
    | 'bot-manager-metrics'
    | 'bot-manager-rule'
    | 'bot-manager-traffic'
    | 'cli-terminal-deploy'
    | 'cli-terminal-start'
    | 'data-stream-connector'
    | 'data-stream-sampling'
    | 'data-stream-source'
    | 'ddos-firewall-modules'
    | 'ddos-http-events'
    | 'ddos-requests-metric'
    | 'edge-dns-dnssec'
    | 'edge-dns-nameserver'
    | 'edge-dns-record'
    | 'firewall-function'
    | 'firewall-modules'
    | 'firewall-rules-order'
    | 'function-code'
    | 'functions-start'
    | 'image-processor-events'
    | 'image-processor-module'
    | 'image-processor-rule'
    | 'kv-store-function'
    | 'kv-store-key'
    | 'kv-store-security-list'
    | 'load-balancer-address'
    | 'load-balancer-method'
    | 'load-balancer-origins'
    | 'network-shield-ip-list'
    | 'network-shield-lists'
    | 'network-shield-rule'
    | 'object-storage-access'
    | 'object-storage-browser'
    | 'object-storage-buckets'
    | 'real-time-events-filter'
    | 'real-time-events-log'
    | 'real-time-events-volume'
    | 'real-time-metrics-dashboard'
    | 'real-time-metrics-filter'
    | 'real-time-metrics-panel'
    | 'sql-database-query'
    | 'sql-database-row'
    | 'sql-database-table'
    | 'waf-allowed-rule'
    | 'waf-firewall-rule'
    | 'waf-threat'
    | 'workload-deploy'
    | 'workload-deploy-logs'
    | 'workload-deployments'
    | 'workload-domain'
    | 'workload-domains'
    | 'workload-overview'
    | 'workload-rollout-rows'
    | 'workload-topology-chain'
    | 'workload-topology'
    | 'workload-topology-flow'
    | 'workloads-list'

  export type ProductWidgetTab =
    | 'agents'
    | 'console'
    | 'cli'
    | 'overview'
    | 'topology'
    | 'deploy'
    | 'main-settings'
    | 'cache-settings'
    | 'device-groups'
    | 'functions'
    | 'rules-engine'

  interface Props {
    /** Name of the console widget to draw. */
    name: ProductWidgetName
    /** Whether this widget is the one showing; it replays its entrance each time it becomes active. */
    active?: boolean
    /** Whether the pointer is over the host; a fragment plays its beat while it is. */
    hover?: boolean
    /** How the widget is plated (window or bare): a workload screen re-plates its own frame, a fragment is drawn bare or framed in a console window, and unset keeps the widget's own plating. */
    kind?: ShellMockupKind
    /** Draws the console bar on a workload screen or on the window a framed fragment is drawn in; unset keeps the widget's own bar, and a bare fragment ignores it. */
    chrome?: boolean
    /** Design width of a workload screen from md up; fragments keep their own width, and unset keeps the widget's own. */
    width?: number
    /** Edge a workload screen, workload-overview or application-version fades out along; fragments keep their own fade. */
    fade?: ShellMockupFade
    /** Texture a full-screen widget is grounded with. */
    texture?: TextureMaterialKind
    /** Tab a tabbed widget plays (workload-overview, application-version, functions-start); other widgets ignore it, and unset plays the first tab. */
    tab?: ProductWidgetTab
    /** Draws the named collaborator cursor a fragment acts its beat with; turn it off for a still console picture. Widgets without a cursor ignore it. */
    cursor?: boolean
    /** Milliseconds between revealed log lines in the deploy logs widget; unset keeps its own pace. */
    interval?: number
  }

  const props = withDefaults(defineProps<Props>(), {
    active: true,
    hover: false,
    kind: undefined,
    chrome: undefined,
    width: undefined,
    fade: 'none',
    texture: 'none',
    tab: undefined,
    cursor: true,
    interval: undefined
  })

  const attrs = useAttrs()

  const dev = (import.meta as ImportMeta & { env?: { DEV?: boolean } }).env?.DEV === true

  const widget = shallowRef<Component | null>(null)
  const declared = shallowRef<string[]>([])
  const plates = shallowRef<typeof Plates | null>(null)

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-product-widget'
  )

  const plate = computed(
    () =>
      (plates.value?.productWidgetPlates as Partial<Record<string, Plates.ProductWidgetPlating>>)?.[
        props.name
      ]
  )

  const plating = computed(() => plate.value && (props.kind ?? plate.value.kind))

  provide(ProductWidgetInjectionKey, { cursor: computed(() => props.cursor) })

  function warnIgnored(name: ProductWidgetName, keys: string[]) {
    if (!dev) return
    const set: Record<string, boolean> = {
      kind: props.kind !== undefined,
      chrome: props.chrome !== undefined,
      width: props.width !== undefined,
      fade: props.fade !== 'none',
      texture: props.texture !== 'none',
      tab: props.tab !== undefined,
      interval: props.interval !== undefined
    }
    const plated = plating.value ? ['kind', plating.value === 'window' ? 'chrome' : ''] : []
    const ignored = Object.keys(set).filter(
      (key) => set[key] && !keys.includes(key) && !plated.includes(key)
    )
    if (!ignored.length) return
    console.warn(
      `[webkit] <ProductWidget name="${name}">: ${ignored.join(', ')} ${ignored.length > 1 ? 'have' : 'has'} no effect on this widget. Fragments keep their own width and fade and take only kind, and chrome while framed; the workload screens take kind, chrome, width and fade (see the product-widget spec).`
    )
  }

  watch(
    () => props.name,
    (name) => {
      widget.value = null
      declared.value = []
      const load = resolveProductWidget(name)
      if (!load) {
        if (dev)
          console.warn(`[webkit] <ProductWidget>: no widget registered under name "${name}".`)
        return
      }
      Promise.all([load(), import('./plates')])
        .then(([{ default: component }, module]) => {
          if (props.name !== name) return
          plates.value = module
          declared.value = Object.keys((component as { props?: object }).props ?? {})
          widget.value = markRaw(component)
          warnIgnored(name, declared.value)
        })
        .catch((error: unknown) => {
          if (dev) console.warn(`[webkit] <ProductWidget>: could not load "${name}".`, error)
        })
    },
    { immediate: true }
  )
</script>

<template>
  <div
    v-bind="$attrs"
    :data-testid="testId"
    :data-name="name"
    :data-kind="plating"
    class="h-full w-full min-w-0"
  >
    <component
      :is="plates.ProductWidgetPlate"
      v-if="widget && plates"
      v-bind="{ testId, kind: plating, plate, widget, declared, values: props }"
    />
  </div>
</template>

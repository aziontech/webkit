<script setup lang="ts">
  import { type Component, computed, markRaw, shallowRef, useAttrs, watch } from 'vue'

  import type { TextureMaterialKind } from '../../marketing/texture-material/texture-material.vue'
  import type { ShellMockupFade, ShellMockupKind } from '../shell-mockup/shell-mockup.vue'
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
    | 'workloads-list'

  export type ProductWidgetTab =
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
    /** How a framed widget is plated; unset keeps the widget's own plating. */
    kind?: ShellMockupKind
    /** Draws the console bar on a framed widget; unset keeps the widget's own bar. */
    chrome?: boolean
    /** Design width of a framed widget from md up; unset keeps the widget's own width. */
    width?: number
    /** Edge a framed widget fades out along. */
    fade?: ShellMockupFade
    /** Texture a full-screen widget is grounded with. */
    texture?: TextureMaterialKind
    /** Tab a tabbed widget plays; unset plays its first tab. */
    tab?: ProductWidgetTab
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
    interval: undefined
  })

  const attrs = useAttrs()

  const widget = shallowRef<Component | null>(null)
  const declared = shallowRef<string[]>([])

  const testId = computed(
    () => (attrs['data-testid'] as string | undefined) ?? 'content-product-widget'
  )

  const forwarded = computed(() => {
    const values: Record<string, unknown> = {
      active: props.active,
      hover: props.hover,
      kind: props.kind,
      chrome: props.chrome,
      width: props.width,
      fade: props.fade,
      texture: props.texture,
      tab: props.tab,
      interval: props.interval
    }
    return Object.fromEntries(
      Object.entries(values).filter(
        ([key, value]) => value !== undefined && declared.value.includes(key)
      )
    )
  })

  watch(
    () => props.name,
    (name) => {
      const load = resolveProductWidget(name)
      if (!load) {
        console.warn(`[webkit] <ProductWidget>: no widget registered under name "${name}".`)
        widget.value = null
        declared.value = []
        return
      }
      load()
        .then(({ default: component }) => {
          if (props.name !== name) return
          declared.value = Object.keys((component as { props?: object }).props ?? {})
          widget.value = markRaw(component)
        })
        .catch((error: unknown) => {
          console.warn(`[webkit] <ProductWidget>: could not load "${name}".`, error)
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
    class="h-full w-full min-w-0"
  >
    <component
      :is="widget"
      v-if="widget"
      v-bind="forwarded"
    />
  </div>
</template>

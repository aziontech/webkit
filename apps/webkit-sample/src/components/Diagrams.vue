<script setup>
  // Diagrams — a node-graph canvas built on @vue-flow/core, re-skinned with
  // @aziontech/theme tokens (see ../lib/vue-flow-theme.css). It renders an Azion
  // edge-request architecture: a client request flowing through the edge
  // (firewall → functions / cache) out to the origins. Vue Flow's stock
  // `theme-default.css` is intentionally NOT imported — only its layout
  // `style.css` — so every color/shape comes from design tokens and the graph
  // tracks the active light/dark theme like the rest of the console.
  import { Position, VueFlow, useVueFlow } from '@vue-flow/core'
  import '@vue-flow/core/dist/style.css'

  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { ref } from 'vue'

  import '../lib/vue-flow-theme.css'
  import AppLayout from './ui/AppLayout.vue'
  import PageHeading from './ui/PageHeading.vue'

  // A left-to-right flow: nodes emit from their right edge and receive on their
  // left, so handles line up horizontally. Per-node accent is driven purely by a
  // token via the `--vf-node-color` custom property the theme CSS consumes.
  const flow = (color) => ({
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { '--vf-node-color': `var(${color})` }
  })

  const nodes = ref([
    {
      id: 'client',
      type: 'input',
      position: { x: 0, y: 140 },
      data: { label: 'Client Request' },
      ...flow('--info')
    },
    {
      id: 'waf',
      position: { x: 260, y: 140 },
      data: { label: 'Edge Firewall · WAF' },
      ...flow('--danger')
    },
    {
      id: 'functions',
      position: { x: 540, y: 30 },
      data: { label: 'Edge Functions' },
      ...flow('--accent')
    },
    {
      id: 'cache',
      position: { x: 540, y: 250 },
      data: { label: 'Edge Cache' },
      ...flow('--success')
    },
    {
      id: 'origin',
      type: 'output',
      position: { x: 840, y: 30 },
      data: { label: 'Origin Server' },
      ...flow('--primary')
    },
    {
      id: 'storage',
      type: 'output',
      position: { x: 840, y: 250 },
      data: { label: 'Object Storage' },
      ...flow('--info')
    }
  ])

  const edges = ref([
    { id: 'e-client-waf', source: 'client', target: 'waf', label: 'HTTPS', animated: true },
    { id: 'e-waf-fn', source: 'waf', target: 'functions', label: 'allow' },
    { id: 'e-waf-cache', source: 'waf', target: 'cache', label: 'route' },
    { id: 'e-fn-origin', source: 'functions', target: 'origin', label: 'fetch', animated: true },
    { id: 'e-cache-storage', source: 'cache', target: 'storage', label: 'miss' }
  ])

  // The canvas controls (zoom / fit) reuse the webkit IconButton so they match
  // the rest of the console; they drive the Vue Flow instance rendered below.
  const { fitView, zoomIn, zoomOut } = useVueFlow()
</script>

<template>
  <AppLayout
    active="diagrams"
    :padded="false"
    :breadcrumb="[{ label: 'Diagrams' }]"
  >
    <div class="flex h-full w-full flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]">
      <PageHeading
        title-id="diagrams-title"
        title="Diagrams"
        description="An interactive node graph built on @vue-flow/core, re-skinned entirely with Azion design tokens — nodes, edges, handles, and canvas all follow the active theme. Drag nodes, pan the canvas, and zoom with the controls."
      >
        <template #actions>
          <Tag
            label="@vue-flow/core"
            severity="secondary"
            size="small"
          />
        </template>
      </PageHeading>

      <!-- The graph canvas. `wk-vue-flow` scopes the tokenized override; the
           relative wrapper anchors the floating control cluster. -->
      <div class="relative min-h-0 flex-1">
        <VueFlow
          :nodes="nodes"
          :edges="edges"
          class="wk-vue-flow h-full w-full"
          fit-view-on-init
          :min-zoom="0.4"
          :max-zoom="2"
        />

        <!-- Floating, themed canvas controls — webkit IconButtons over the graph. -->
        <div
          class="absolute bottom-[var(--spacing-md)] left-[var(--spacing-md)] flex flex-col gap-[var(--spacing-xxs)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface-overlay)] p-[var(--spacing-xxs)] shadow-sm"
        >
          <Tooltip text="Zoom in" placement="right">
            <IconButton
              icon="pi pi-plus"
              aria-label="Zoom in"
              kind="transparent"
              size="small"
              @click="() => zoomIn()"
            />
          </Tooltip>
          <Tooltip text="Zoom out" placement="right">
            <IconButton
              icon="pi pi-minus"
              aria-label="Zoom out"
              kind="transparent"
              size="small"
              @click="() => zoomOut()"
            />
          </Tooltip>
          <Tooltip text="Fit view" placement="right">
            <IconButton
              icon="pi pi-expand"
              aria-label="Fit view"
              kind="transparent"
              size="small"
              @click="() => fitView()"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

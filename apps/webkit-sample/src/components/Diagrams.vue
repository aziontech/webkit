<script setup>
  // Diagrams — a node-graph canvas built on @vue-flow/core, re-skinned with
  // @aziontech/theme tokens (see ../lib/vue-flow-theme.css). It renders an Azion
  // edge-request architecture around a single Application: a client request
  // reaching the application, which fans out to functions / cache and on to the
  // origins. Vue Flow's stock `theme-default.css` is intentionally NOT imported
  // — only its layout `style.css` — so every color/shape comes from design
  // tokens and the graph tracks the active light/dark theme like the console.
  //
  // Application-level bindings (Edge Firewall, Custom Page) are optional, so the
  // graph shows them as EMPTY nodes: a dashed placeholder that keeps the slot
  // visible on the canvas and carries the CTA that fills it (see
  // ./diagrams/nodes/EmptyNode.vue). Binding one swaps the placeholder for a
  // real node and solidifies its edges.
  import '@vue-flow/core/dist/style.css'
  import '../lib/vue-flow-theme.css'

  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { Position, useVueFlow,VueFlow } from '@vue-flow/core'
  import { computed, ref } from 'vue'

  import EmptyNode from './diagrams/nodes/EmptyNode.vue'
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

  // The two Application-level slots the graph can fill. `empty` is what the
  // placeholder renders; `bound` is the node it becomes once the CTA is used.
  const BINDABLE = {
    firewall: {
      empty: {
        title: 'Edge Firewall',
        description: 'Not bound — requests reach the application uninspected.',
        icon: 'pi pi-shield',
        ctaLabel: 'Bind Firewall',
        target: true,
        source: true
      },
      boundLabel: 'Edge Firewall · WAF',
      color: '--danger'
    },
    'custom-page': {
      empty: {
        title: 'Custom Page',
        description: 'Not bound — 4xx/5xx fall back to the default page.',
        icon: 'pi pi-file',
        ctaLabel: 'Bind Custom Page',
        target: true,
        source: false
      },
      boundLabel: 'Custom Page · 4xx/5xx',
      color: '--warning'
    }
  }

  // Which Application-level slots are filled. Drives the empty/bound node shape
  // and whether the edges touching them read as provisional (dashed) or real.
  const bound = ref({ firewall: false, 'custom-page': false })

  const createNodes = () => [
    {
      id: 'client',
      type: 'input',
      position: { x: 0, y: 210 },
      data: { label: 'Client Request' },
      ...flow('--info')
    },
    {
      id: 'firewall',
      type: 'empty',
      position: { x: 260, y: 170 },
      data: { ...BINDABLE.firewall.empty },
      ...flow('--border-strong')
    },
    {
      id: 'application',
      position: { x: 570, y: 210 },
      data: { label: 'Application' },
      ...flow('--primary')
    },
    {
      id: 'functions',
      position: { x: 860, y: 60 },
      data: { label: 'Edge Functions' },
      ...flow('--accent')
    },
    {
      id: 'cache',
      position: { x: 860, y: 230 },
      data: { label: 'Edge Cache' },
      ...flow('--success')
    },
    {
      id: 'custom-page',
      type: 'empty',
      position: { x: 860, y: 360 },
      data: { ...BINDABLE['custom-page'].empty },
      ...flow('--border-strong')
    },
    {
      id: 'origin',
      type: 'output',
      position: { x: 1160, y: 60 },
      data: { label: 'Origin Server' },
      ...flow('--primary')
    },
    {
      id: 'storage',
      type: 'output',
      position: { x: 1160, y: 230 },
      data: { label: 'Object Storage' },
      ...flow('--info')
    }
  ]

  const nodes = ref(createNodes())

  // Edges derive from `bound`: while a slot is empty its edges are dashed and
  // muted, so the canvas reads as "this path is not wired yet". Only node
  // positions need to survive a drag, so deriving edges here is safe.
  const pending = { strokeDasharray: '5 5' }

  const edges = computed(() => [
    {
      id: 'e-client-firewall',
      source: 'client',
      target: 'firewall',
      label: 'HTTPS',
      animated: bound.value.firewall,
      style: bound.value.firewall ? undefined : pending
    },
    {
      id: 'e-firewall-app',
      source: 'firewall',
      target: 'application',
      label: bound.value.firewall ? 'allow' : 'not bound',
      style: bound.value.firewall ? undefined : pending
    },
    { id: 'e-app-functions', source: 'application', target: 'functions', label: 'execute' },
    { id: 'e-app-cache', source: 'application', target: 'cache', label: 'cache' },
    {
      id: 'e-app-custom-page',
      source: 'application',
      target: 'custom-page',
      label: bound.value['custom-page'] ? 'on 4xx/5xx' : 'not bound',
      style: bound.value['custom-page'] ? undefined : pending
    },
    { id: 'e-fn-origin', source: 'functions', target: 'origin', label: 'fetch', animated: true },
    { id: 'e-cache-storage', source: 'cache', target: 'storage', label: 'miss' }
  ])

  // The canvas controls (zoom / fit) reuse the webkit IconButton so they match
  // the rest of the console; they drive the Vue Flow instance rendered below.
  const { fitView, updateNode, zoomIn, zoomOut } = useVueFlow()

  // Filling a slot: the placeholder becomes an ordinary node with the resource's
  // accent. `updateNode` patches the live node so a dragged layout is preserved.
  const bindResource = (id) => {
    const resource = BINDABLE[id]
    if (!resource || bound.value[id]) return

    bound.value[id] = true
    updateNode(id, {
      type: 'default',
      data: { label: resource.boundLabel },
      style: { '--vf-node-color': `var(${resource.color})` }
    })
  }

  // Puts every slot back to empty so the placeholder state stays demo-able.
  const resetDiagram = () => {
    bound.value = { firewall: false, 'custom-page': false }
    nodes.value = createNodes()
  }
</script>

<template>
  <AppLayout
    active="diagrams"
    :padded="false"
    :breadcrumb="[{ label: 'Diagrams' }]"
  >
    <div class="flex h-full w-full flex-col gap-[var(--spacing-lg)] p-[var(--spacing-lg)]">
      <PageHeading
        size="large"
        title-id="diagrams-title"
        title="Diagrams"
        description="An interactive node graph built on @vue-flow/core, re-skinned entirely with Azion design tokens — nodes, edges, handles, and canvas all follow the active theme. Application-level slots that are not bound yet (Edge Firewall, Custom Page) render as dashed empty nodes carrying a bind CTA. Drag nodes, pan the canvas, and zoom with the controls."
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
        >
          <!-- `type: 'empty'` nodes render the dashed placeholder + bind CTA.
               The slot content lives in this scope, so the node's `bind` event
               is handled here, on the page that owns the graph state. -->
          <template #node-empty="nodeProps">
            <EmptyNode
              :id="nodeProps.id"
              :data="nodeProps.data"
              @bind="(event, id) => bindResource(id)"
            />
          </template>
        </VueFlow>

        <!-- Floating, themed canvas controls — webkit IconButtons over the graph. -->
        <div
          class="absolute bottom-[var(--spacing-md)] left-[var(--spacing-md)] flex flex-col gap-[var(--spacing-xxs)] rounded-[var(--shape-card)] border border-[var(--border-default)] bg-[var(--bg-surface-overlay)] p-[var(--spacing-xxs)] shadow-sm"
        >
          <Tooltip
            text="Zoom in"
            placement="right"
          >
            <IconButton
              icon="pi pi-plus"
              aria-label="Zoom in"
              kind="transparent"
              size="small"
              @click="() => zoomIn()"
            />
          </Tooltip>
          <Tooltip
            text="Zoom out"
            placement="right"
          >
            <IconButton
              icon="pi pi-minus"
              aria-label="Zoom out"
              kind="transparent"
              size="small"
              @click="() => zoomOut()"
            />
          </Tooltip>
          <Tooltip
            text="Fit view"
            placement="right"
          >
            <IconButton
              icon="pi pi-expand"
              aria-label="Fit view"
              kind="transparent"
              size="small"
              @click="() => fitView()"
            />
          </Tooltip>
          <!-- Unbinds both Application-level slots, so the empty-node state can
               be replayed without a reload. -->
          <Tooltip
            text="Reset bindings"
            placement="right"
          >
            <IconButton
              icon="pi pi-refresh"
              aria-label="Reset bindings"
              kind="transparent"
              size="small"
              @click="resetDiagram"
            />
          </Tooltip>
        </div>
      </div>
    </div>
  </AppLayout>
</template>

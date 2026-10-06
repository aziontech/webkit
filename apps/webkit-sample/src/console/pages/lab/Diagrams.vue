<script setup>
  import '@vue-flow/core/dist/style.css'
  import '../../components/diagrams/vue-flow-theme.css'

  import IconButton from '@aziontech/webkit/icon-button'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { Position, useVueFlow, VueFlow } from '@vue-flow/core'
  import { computed, ref } from 'vue'

  import EmptyNode from '../../components/diagrams/nodes/EmptyNode.vue'
  import PageHeading from '../../components/page/PageHeading.vue'
  import AppLayout from '../../components/shell/AppLayout.vue'

  const flow = (color) => ({
    sourcePosition: Position.Right,
    targetPosition: Position.Left,
    style: { '--vf-node-color': `var(${color})` }
  })

  const BINDABLE = {
    firewall: {
      empty: {
        title: 'Edge Firewall',
        description: 'Not bound. Requests reach the application uninspected.',
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
        description: 'Not bound. 4xx and 5xx fall back to the default page.',
        icon: 'pi pi-file',
        ctaLabel: 'Bind Custom Page',
        target: true,
        source: false
      },
      boundLabel: 'Custom Page · 4xx/5xx',
      color: '--warning'
    }
  }

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
      data: { label: 'Origin server' },
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

  const { fitView, updateNode, zoomIn, zoomOut } = useVueFlow()

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
    <div class="flex h-full w-full flex-col gap-(--spacing-lg) p-(--spacing-lg)">
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

      <div class="relative min-h-0 flex-1">
        <VueFlow
          :nodes="nodes"
          :edges="edges"
          class="wk-vue-flow h-full w-full"
          fit-view-on-init
          :min-zoom="0.4"
          :max-zoom="2"
        >
          <template #node-empty="nodeProps">
            <EmptyNode
              :id="nodeProps.id"
              :data="nodeProps.data"
              @bind="(event, id) => bindResource(id)"
            />
          </template>
        </VueFlow>

        <div
          class="absolute bottom-(--spacing-md) left-(--spacing-md) flex flex-col gap-(--spacing-xxs) rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-overlay) p-(--spacing-xxs) shadow-sm"
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

<script setup>
  import ConfirmDialog from '@aziontech/ui/confirm-dialog'
  import FlowDiagramBind from '@aziontech/ui/flow-diagram-bind'
  import FlowDiagram from '@aziontech/ui/flow-diagram-root'
  import IconButton from '@aziontech/ui/icon-button'
  import Tooltip from '@aziontech/ui/tooltip'
  import { computed, reactive, ref } from 'vue'

  const options = {
    policy: [
      { value: 'edge-guard', label: 'edge-guard' },
      { value: 'strict-waf', label: 'strict-waf' }
    ],
    'error-page': [{ value: 'maintenance', label: 'maintenance' }]
  }

  const bound = reactive({ policy: 'edge-guard', 'error-page': '' })

  const slot = (id, eyebrow, icon, unbound, extra = {}) => ({
    id,
    eyebrow,
    icon,
    bindable: true,
    removable: true,
    bindOptions: options[id],
    boundValue: bound[id],
    title: bound[id],
    status: bound[id] ? 'Active' : '',
    severity: bound[id] ? 'success' : 'neutral',
    message: bound[id] ? '' : unbound,
    ...extra
  })

  const nodes = computed(() => [
    {
      id: 'domains',
      eyebrow: 'Domains',
      icon: 'az az-globe',
      title: 'shop.example.com',
      status: '2 domains',
      severity: 'info',
      fields: [
        { label: 'Platform domain', value: 'web-app-k3x9q2.example.net', copyable: true },
        { label: 'Custom domain', value: 'shop.example.com', copyable: true }
      ]
    },
    {
      id: 'project',
      eyebrow: 'Project',
      icon: 'az az-folder',
      title: 'web-app',
      href: '#project',
      status: 'Live',
      severity: 'success',
      fields: [{ label: 'ID', value: '1482736015', copyable: true }]
    },
    slot('policy', 'Policy', 'az az-shield', 'Requests reach the service without inspection.'),
    {
      id: 'service',
      eyebrow: 'Service',
      icon: 'az az-server',
      title: 'web-app',
      href: '#service',
      status: 'Active',
      severity: 'success',
      metrics: [{ label: 'Version', value: 'AEO25I38' }]
    },
    slot('error-page', 'Error page', 'az az-file', 'Errors answer with the default page.'),
    {
      id: 'cache',
      eyebrow: 'Cache rule',
      icon: 'az az-bolt',
      title: 'static-assets',
      status: 'Active',
      severity: 'success',
      metrics: [{ label: 'Lifetime', value: '30 days' }]
    },
    {
      id: 'storage',
      eyebrow: 'Storage',
      icon: 'az az-inbox',
      title: 'web-app-assets',
      status: 'Private',
      severity: 'neutral',
      metrics: [{ label: 'Objects', value: '24' }]
    }
  ])

  const edges = [
    { from: 'domains', to: 'project' },
    { from: 'project', to: 'policy' },
    { from: 'policy', to: 'service' },
    { from: 'policy', to: 'error-page' },
    { from: 'service', to: 'cache' },
    { from: 'cache', to: 'storage' }
  ]

  const openKeys = ref([])
  const note = ref('')

  const onBind = (id, value) => {
    bound[id] = value
    note.value = `${value} bound to ${id}.`
  }
  const removing = ref('')
  const confirmingRemove = computed({
    get: () => removing.value !== '',
    set: (open) => {
      if (!open) removing.value = ''
    }
  })
  const onRemove = (id) => {
    removing.value = id
  }
  const confirmRemove = () => {
    const id = removing.value
    bound[id] = ''
    note.value = `Removed the ${id} binding.`
    removing.value = ''
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <FlowDiagram
      v-model:open-keys="openKeys"
      :nodes="nodes"
      :edges="edges"
      aria-label="Deployment topology"
    >
      <template #actions="{ node }">
        <Tooltip
          v-if="node.id === 'domains'"
          content="Add domain"
        >
          <IconButton
            icon="az az-plus"
            variant="outline"
            size="small"
            aria-label="Add domain"
            @click="note = 'Add a domain.'"
          />
        </Tooltip>
        <FlowDiagramBind
          v-if="node.bindable"
          :label="node.eyebrow"
          :options="node.bindOptions"
          :value="node.boundValue"
          :removable="node.removable"
          @bind="(event, value) => onBind(node.id, value)"
          @remove="() => onRemove(node.id)"
          @create="() => (note = `Create a new ${node.eyebrow}.`)"
        />
      </template>
    </FlowDiagram>
    <ConfirmDialog
      v-model:open="confirmingRemove"
      :title="`Unbind ${bound[removing] || 'this resource'}`"
      :description="`The ${removing} step stops using it as soon as you confirm. You can bind it again later.`"
      confirm-label="Unbind"
      @confirm="confirmRemove"
    />
    <p
      role="status"
      class="text-body-sm text-(--text-muted)"
    >
      {{ note }}
    </p>
  </div>
</template>

<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'
  import { computed, reactive, ref } from 'vue'

  const policies = [
    { value: 'edge-guard', label: 'edge-guard' },
    { value: 'strict-waf', label: 'strict-waf' }
  ]
  const errorPages = [{ value: 'maintenance', label: 'maintenance' }]

  const bound = reactive({ policy: 'edge-guard', 'error-page': '' })

  const bindingFields = (value, unbound) =>
    value
      ? { name: value, boundValue: value, status: 'Active', severity: 'success', message: '' }
      : { name: '', boundValue: '', status: '', severity: 'neutral', message: unbound }

  const levels = computed(() => [
    {
      id: 'domains',
      label: 'Domains',
      nodes: [
        {
          id: 'domains',
          type: 'Domains',
          icon: 'az az-globe',
          name: 'shop.example.com',
          status: '2 domains',
          severity: 'info',
          fields: [
            {
              label: 'Platform domain',
              value: 'web-app-k3x9q2.example.net',
              href: 'https://web-app-k3x9q2.example.net',
              copyable: true
            },
            {
              label: 'Custom domain',
              value: 'shop.example.com',
              href: 'https://shop.example.com',
              copyable: true
            }
          ]
        }
      ]
    },
    {
      id: 'project',
      label: 'Project',
      nodes: [
        {
          id: 'project',
          type: 'Project',
          icon: 'az az-folder',
          name: 'web-app',
          status: 'Live',
          severity: 'success',
          href: '#project',
          fields: [
            { label: 'ID', value: '1482736015', copyable: true },
            { label: 'Environment', value: 'Production' }
          ]
        }
      ]
    },
    {
      id: 'policy',
      label: 'Policy',
      nodes: [
        {
          id: 'policy',
          type: 'Policy',
          icon: 'az az-shield',
          href: '#policy',
          bindable: true,
          bindOptions: policies,
          removable: true,
          ...bindingFields(bound.policy, 'Requests reach the service without inspection.'),
          fields: [{ label: 'Rules', value: '12 rules, 3 rate limits' }]
        }
      ]
    },
    {
      id: 'service',
      label: 'Service',
      nodes: [
        {
          id: 'service',
          type: 'Service',
          icon: 'az az-server',
          name: 'web-app',
          status: 'Active',
          severity: 'success',
          href: '#service',
          fields: [{ label: 'Version', value: 'AEO25I38' }]
        },
        {
          id: 'error-page',
          type: 'Error page',
          icon: 'az az-file',
          terminal: true,
          bindable: true,
          bindOptions: errorPages,
          removable: true,
          ...bindingFields(bound['error-page'], 'Errors answer with the default page.')
        }
      ]
    },
    {
      id: 'cache',
      label: 'Cache rules',
      nodes: [
        {
          id: 'cache-static',
          type: 'Cache rule',
          icon: 'az az-bolt',
          name: 'static-assets',
          status: 'Active',
          severity: 'success',
          fields: [{ label: 'Lifetime', value: '30 days' }]
        },
        {
          id: 'cache-api',
          type: 'Cache rule',
          icon: 'az az-bolt',
          name: 'api-bypass',
          status: 'Active',
          severity: 'success',
          fields: [{ label: 'Lifetime', value: 'Bypass' }]
        }
      ]
    },
    {
      id: 'integration',
      label: 'Integration',
      nodes: [
        {
          id: 'integration',
          type: 'Integration',
          icon: 'az az-link',
          name: 'web-app-origin',
          status: 'Active',
          severity: 'success',
          message:
            'Routes traffic from the service to its origin. It can be re-pointed but not removed.',
          fields: [{ label: 'Origin', value: 'origin.example.com', copyable: true }]
        }
      ]
    },
    {
      id: 'storage',
      label: 'Storage',
      nodes: [
        {
          id: 'storage',
          type: 'Storage',
          icon: 'az az-inbox',
          name: 'web-app-assets',
          status: 'Private',
          severity: 'neutral',
          terminal: true,
          fields: [{ label: 'Objects', value: '24 files, 1.2 MB' }]
        }
      ]
    }
  ])

  const openKeys = ref(['project'])
  const note = ref('')

  const bind = (event, { id, value }) => {
    bound[id] = value
    note.value = `${value} bound to ${id}.`
  }
  const remove = (event, id) => {
    bound[id] = ''
    note.value = `Removed the ${id} binding.`
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <div class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)">
      <TopologyDiagram
        v-model:open-keys="openKeys"
        :levels="levels"
        @bind="bind"
        @remove="remove"
        @create="(event, id) => (note = `Create a new ${id}.`)"
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
        </template>
      </TopologyDiagram>
    </div>
    <p
      role="status"
      class="text-body-sm text-(--text-muted)"
    >
      {{ note }}
    </p>
  </div>
</template>

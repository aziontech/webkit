<script setup>
  import IconButton from '@aziontech/webkit/icon-button'
  import Tooltip from '@aziontech/webkit/tooltip'
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'
  import { ref } from 'vue'

  const policies = [
    { value: 'edge-guard', label: 'edge-guard' },
    { value: 'strict-waf', label: 'strict-waf' }
  ]
  const errorPages = [{ value: 'maintenance', label: 'maintenance' }]

  const levels = [
    {
      key: 'domains',
      label: 'Domains',
      nodes: [
        {
          key: 'domains',
          kind: 'Domains',
          icon: 'pi pi-globe',
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
      key: 'project',
      label: 'Project',
      nodes: [
        {
          key: 'project',
          kind: 'Project',
          icon: 'pi pi-folder',
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
      key: 'policy',
      label: 'Policy',
      nodes: [
        {
          key: 'policy',
          kind: 'Policy',
          icon: 'pi pi-shield',
          name: 'edge-guard',
          status: 'Active',
          severity: 'success',
          href: '#policy',
          bindable: true,
          bindOptions: policies,
          boundValue: 'edge-guard',
          removable: true,
          fields: [{ label: 'Rules', value: '12 rules, 3 rate limits' }]
        }
      ]
    },
    {
      key: 'service',
      label: 'Service',
      nodes: [
        {
          key: 'service',
          kind: 'Service',
          icon: 'pi pi-server',
          name: 'web-app',
          status: 'Active',
          severity: 'success',
          href: '#service',
          fields: [{ label: 'Version', value: 'AEO25I38' }]
        },
        {
          key: 'error-page',
          kind: 'Error page',
          icon: 'pi pi-file',
          terminal: true,
          bindable: true,
          bindOptions: errorPages,
          message: 'Errors answer with the default page.'
        }
      ]
    },
    {
      key: 'cache',
      label: 'Cache rules',
      nodes: [
        {
          key: 'cache-static',
          kind: 'Cache rule',
          icon: 'pi pi-bolt',
          name: 'static-assets',
          status: 'Active',
          severity: 'success',
          fields: [{ label: 'Lifetime', value: '30 days' }]
        },
        {
          key: 'cache-api',
          kind: 'Cache rule',
          icon: 'pi pi-bolt',
          name: 'api-bypass',
          status: 'Active',
          severity: 'success',
          fields: [{ label: 'Lifetime', value: 'Bypass' }]
        }
      ]
    },
    {
      key: 'integration',
      label: 'Integration',
      nodes: [
        {
          key: 'integration',
          kind: 'Integration',
          icon: 'pi pi-link',
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
      key: 'storage',
      label: 'Storage',
      nodes: [
        {
          key: 'storage',
          kind: 'Storage',
          icon: 'pi pi-inbox',
          name: 'web-app-assets',
          status: 'Private',
          severity: 'neutral',
          terminal: true,
          fields: [{ label: 'Objects', value: '24 files, 1.2 MB' }]
        }
      ]
    }
  ]

  const expanded = ref(['project'])
  const event = ref('')
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <TopologyDiagram
      v-model:expanded="expanded"
      :levels="levels"
      class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)"
      @bind="(key, value) => (event = `Bind ${value} to ${key}.`)"
      @remove="(key) => (event = `Remove ${key}.`)"
      @create="(key) => (event = `Create a new ${key}.`)"
    >
      <template #actions="{ node }">
        <Tooltip
          v-if="node.key === 'domains'"
          text="Add domain"
        >
          <IconButton
            icon="pi pi-plus"
            kind="outlined"
            size="small"
            aria-label="Add domain"
            @click="event = 'Add a domain.'"
          />
        </Tooltip>
      </template>
    </TopologyDiagram>
    <p
      role="status"
      class="text-body-sm text-(--text-muted)"
    >
      {{ event }}
    </p>
  </div>
</template>

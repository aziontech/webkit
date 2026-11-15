<script setup>
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'
  import { computed, reactive, ref } from 'vue'

  const targets = {
    policy: {
      type: 'Policy',
      icon: 'ai ai-shield',
      options: [
        { value: 'edge-guard', label: 'edge-guard' },
        { value: 'strict-waf', label: 'strict-waf' }
      ],
      unbound: 'Requests reach the service without inspection.'
    },
    'error-page': {
      type: 'Error page',
      icon: 'ai ai-file',
      options: [{ value: 'maintenance', label: 'maintenance' }],
      unbound: 'Errors answer with the default page.'
    }
  }

  const deployed = { policy: 'edge-guard', 'error-page': '' }
  const staged = reactive({})
  const openKeys = ref(['policy'])
  const note = ref('')

  const slot = (key) => {
    const target = targets[key]
    const pick = staged[key]
    const removing = pick === ''
    const value = pick === undefined ? deployed[key] : pick
    const base = {
      id: key,
      type: target.type,
      icon: target.icon,
      bindable: true,
      bindOptions: target.options,
      removable: true
    }
    if (!value) {
      return {
        ...base,
        status: removing ? 'Staged' : '',
        severity: removing ? 'warning' : 'neutral',
        dashed: true,
        message: removing ? `Deploy to remove this ${target.type.toLowerCase()}.` : target.unbound
      }
    }
    return {
      ...base,
      name: value,
      boundValue: value,
      status: pick === undefined ? 'Active' : 'Staged',
      severity: pick === undefined ? 'success' : 'warning',
      dashed: pick !== undefined,
      message: pick === undefined ? '' : `Deploy to apply this ${target.type.toLowerCase()}.`
    }
  }

  const levels = computed(() => [
    {
      id: 'project',
      nodes: [
        {
          id: 'project',
          type: 'Project',
          icon: 'ai ai-folder',
          name: 'web-app',
          status: 'Live',
          severity: 'success'
        }
      ]
    },
    { id: 'policy', nodes: [slot('policy')] },
    {
      id: 'service',
      nodes: [
        {
          id: 'service',
          type: 'Service',
          icon: 'ai ai-server',
          name: 'web-app',
          status: 'Active',
          severity: 'success'
        },
        { ...slot('error-page'), terminal: true }
      ]
    }
  ])

  const stagedCount = computed(() => Object.keys(staged).length)

  const bind = (event, { id: key, value }) => {
    if (value === deployed[key]) delete staged[key]
    else staged[key] = value
    note.value = `${value} staged on ${targets[key].type.toLowerCase()}.`
  }
  const remove = (event, key) => {
    if (deployed[key]) staged[key] = ''
    else delete staged[key]
    note.value = `${targets[key].type} staged for removal.`
  }
  const create = (event, key) => {
    note.value = `Opens the create flow for a new ${targets[key].type.toLowerCase()}.`
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
        @create="create"
      />
    </div>
    <p
      role="status"
      class="text-body-sm text-(--text-muted)"
    >
      {{ stagedCount ? `${stagedCount} staged. ${note}` : note }}
    </p>
  </div>
</template>

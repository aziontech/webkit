<script setup>
  import TopologyDiagram from '@aziontech/webkit/topology-diagram'
  import { computed, reactive, ref } from 'vue'

  const targets = {
    policy: {
      kind: 'Policy',
      icon: 'pi pi-shield',
      options: [
        { value: 'edge-guard', label: 'edge-guard' },
        { value: 'strict-waf', label: 'strict-waf' }
      ],
      unbound: 'Requests reach the service without inspection.'
    },
    'error-page': {
      kind: 'Error page',
      icon: 'pi pi-file',
      options: [{ value: 'maintenance', label: 'maintenance' }],
      unbound: 'Errors answer with the default page.'
    }
  }

  const deployed = { policy: 'edge-guard', 'error-page': '' }
  const staged = reactive({})
  const expanded = ref(['policy'])
  const note = ref('')

  const slot = (key) => {
    const target = targets[key]
    const pick = staged[key]
    const removing = pick === ''
    const value = pick === undefined ? deployed[key] : pick
    const base = {
      key,
      kind: target.kind,
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
        message: removing ? `Deploy to remove this ${target.kind.toLowerCase()}.` : target.unbound
      }
    }
    return {
      ...base,
      name: value,
      boundValue: value,
      status: pick === undefined ? 'Active' : 'Staged',
      severity: pick === undefined ? 'success' : 'warning',
      dashed: pick !== undefined,
      message: pick === undefined ? '' : `Deploy to apply this ${target.kind.toLowerCase()}.`
    }
  }

  const levels = computed(() => [
    {
      key: 'project',
      nodes: [
        {
          key: 'project',
          kind: 'Project',
          icon: 'pi pi-folder',
          name: 'web-app',
          status: 'Live',
          severity: 'success'
        }
      ]
    },
    { key: 'policy', nodes: [slot('policy')] },
    {
      key: 'service',
      nodes: [
        {
          key: 'service',
          kind: 'Service',
          icon: 'pi pi-server',
          name: 'web-app',
          status: 'Active',
          severity: 'success'
        },
        { ...slot('error-page'), terminal: true }
      ]
    }
  ])

  const stagedCount = computed(() => Object.keys(staged).length)

  const bind = (event, { key, value }) => {
    if (value === deployed[key]) delete staged[key]
    else staged[key] = value
    note.value = `${value} staged on ${targets[key].kind.toLowerCase()}.`
  }
  const remove = (event, key) => {
    if (deployed[key]) staged[key] = ''
    else delete staged[key]
    note.value = `${targets[key].kind} staged for removal.`
  }
  const create = (event, key) => {
    note.value = `Opens the create flow for a new ${targets[key].kind.toLowerCase()}.`
  }
</script>

<template>
  <div class="flex flex-col gap-(--spacing-sm)">
    <div class="rounded-(--shape-card) border border-(--border-default) bg-(--bg-surface-raised)">
      <TopologyDiagram
        v-model:expanded="expanded"
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

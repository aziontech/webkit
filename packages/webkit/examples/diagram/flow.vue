<script setup>
  import Diagram from '@aziontech/webkit/diagram'

  const spec = {
    ariaLabel:
      'You run azion deploy in a terminal, in the project folder; the Azion CLI calls the Azion API, which creates the resources in your account.',
    nodes: [
      { key: 'terminal', type: 'pill', title: 'Terminal', icon: 'az az-desktop', active: true },
      {
        key: 'project',
        type: 'card',
        eyebrow: 'Project folder',
        title: 'azion.config.js',
        icon: 'az az-folder',
        active: true
      },
      {
        key: 'cli',
        type: 'card',
        eyebrow: 'Azion CLI',
        title: 'azion deploy',
        icon: 'az az-code',
        active: true,
        lit: true
      },
      {
        key: 'api',
        type: 'card',
        eyebrow: 'Azion API',
        title: 'api.azion.com',
        icon: 'az az-cloud'
      },
      {
        key: 'resources',
        type: 'card',
        eyebrow: 'Account resources',
        title: 'Workloads, applications, functions',
        icon: 'az az-server'
      }
    ],
    layout: {
      gap: 'wide',
      row: [
        { node: 'terminal' },
        { node: 'project' },
        { node: 'cli' },
        { node: 'api' },
        { node: 'resources' }
      ]
    },
    edges: [
      { from: 'terminal', to: 'project', active: true },
      { from: 'project', to: 'cli', label: 'azion deploy', active: true },
      { from: 'cli', to: 'api' },
      { from: 'api', to: 'resources' }
    ]
  }
</script>

<template>
  <div class="max-w-[640px]">
    <Diagram :spec="spec" />
  </div>
</template>

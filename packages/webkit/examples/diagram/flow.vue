<script setup>
  import Diagram from '@aziontech/webkit/diagram'

  const spec = {
    ariaLabel:
      'You run azion deploy in a terminal, in the project folder; the Azion CLI calls the Azion API, which creates the resources in your account.',
    nodes: [
      { key: 'terminal', kind: 'pill', title: 'Terminal', icon: 'pi pi-desktop', active: true },
      {
        key: 'project',
        kind: 'card',
        eyebrow: 'Project folder',
        title: 'azion.config.js',
        icon: 'pi pi-folder',
        active: true
      },
      {
        key: 'cli',
        kind: 'card',
        eyebrow: 'Azion CLI',
        title: 'azion deploy',
        icon: 'pi pi-code',
        active: true,
        lit: true
      },
      {
        key: 'api',
        kind: 'card',
        eyebrow: 'Azion API',
        title: 'api.azion.com',
        icon: 'pi pi-cloud'
      },
      {
        key: 'resources',
        kind: 'card',
        eyebrow: 'Account resources',
        title: 'Workloads, applications, functions',
        icon: 'pi pi-server'
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

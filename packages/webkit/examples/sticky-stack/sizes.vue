<script setup>
  import Illustration from '@aziontech/webkit/illustration'
  import StickyStack from '@aziontech/webkit/sticky-stack'

  const scenes = ['ai-applications', 'live-debugging', 'deploy-secure-mcp-server']

  const items = [
    {
      title: 'Automated deployment via Git or CLI',
      description:
        'Push to a branch or run one command; the platform builds the project and puts the result in every location, with the build before it a rollback away.'
    },
    {
      title: 'Infrastructure as code with Terraform',
      description:
        'Declare workloads, rules and domains in the provider and apply them the same way as the rest of your estate, with the same review and the same plan.'
    },
    {
      title: 'Metrics and events via GraphQL API',
      description:
        'Query the same numbers the console charts, from one endpoint, so a dashboard you already run can carry the platform alongside everything else.'
    }
  ]
</script>

<template>
  <div class="flex flex-col gap-(--spacing-xxl)">
    <StickyStack
      size="small"
      :items="items"
    >
      <template #media="{ index }">
        <Illustration :name="scenes[index]" />
      </template>
    </StickyStack>
    <StickyStack
      size="medium"
      :items="items"
    >
      <template #media="{ index }">
        <Illustration :name="scenes[index]" />
      </template>
    </StickyStack>
    <StickyStack
      size="large"
      :items="items"
    >
      <template #media="{ index }">
        <Illustration :name="scenes[index]" />
      </template>
    </StickyStack>
  </div>
</template>

<script setup lang="ts">
  import PageHeader from '@aziontech/webkit/page-header'

  import DeploymentProtectionCard from '../parts/deployment-protection-card.vue'
  import PreviewToolbarCard from '../parts/preview-toolbar-card.vue'

  export interface SavePerCardProps {
    /** Preview Toolbar opens with its save in flight: its selects are disabled and its Save spins. */
    defaultSavingToolbar?: boolean
  }

  const props = withDefaults(defineProps<SavePerCardProps>(), { defaultSavingToolbar: false })
</script>

<template>
  <div class="layout-boundary flex w-full flex-col">
    <PageHeader
      title="Project settings"
      description="Configure how the deployments of this project are previewed and protected."
      size="small"
    />

    <PreviewToolbarCard :default-saving="props.defaultSavingToolbar" />

    <DeploymentProtectionCard />
  </div>
</template>

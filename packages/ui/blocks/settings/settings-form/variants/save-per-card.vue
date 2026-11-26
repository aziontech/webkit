<script setup lang="ts">
  import PageHeader from '@aziontech/ui/page-header'

  import DeploymentProtectionCard, {
    type DeploymentProtectionCardProps,
    type DeploymentProtectionValues
  } from '../parts/deployment-protection-card.vue'
  import PreviewToolbarCard, {
    type PreviewToolbarCardProps,
    type PreviewToolbarValues
  } from '../parts/preview-toolbar-card.vue'

  /** Which card a Save sent, and its values. */
  export type SavePerCardSubmit =
    | { card: 'preview-toolbar'; values: PreviewToolbarValues }
    | { card: 'deployment-protection'; values: DeploymentProtectionValues }

  export interface SavePerCardProps {
    /** The Preview Toolbar card: saved values, opening draft, and its own save loading and error. */
    previewToolbar?: PreviewToolbarCardProps
    /** The Deployment Protection card: saved values, opening draft, and its own save loading and error. */
    deploymentProtection?: DeploymentProtectionCardProps
  }

  const props = withDefaults(defineProps<SavePerCardProps>(), {
    previewToolbar: () => ({}),
    deploymentProtection: () => ({})
  })

  const emit = defineEmits<{ submit: [event: Event, payload: SavePerCardSubmit] }>()
</script>

<template>
  <div class="layout-boundary flex w-full flex-col">
    <PageHeader
      title="Project settings"
      description="Configure how the deployments of this project are previewed and protected."
      size="small"
    />

    <PreviewToolbarCard
      v-bind="props.previewToolbar"
      @submit="(event, values) => emit('submit', event, { card: 'preview-toolbar', values })"
    />

    <DeploymentProtectionCard
      v-bind="props.deploymentProtection"
      @submit="(event, values) => emit('submit', event, { card: 'deployment-protection', values })"
    />
  </div>
</template>

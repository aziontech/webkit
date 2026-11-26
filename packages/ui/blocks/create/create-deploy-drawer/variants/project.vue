<script setup lang="ts">
  import Alert from '@aziontech/ui/alert'
  import SettingsGroup from '@aziontech/ui/settings-group'
  import { computed, ref, watch } from 'vue'

  import DeployDrawerFrame from '../parts/deploy-drawer-frame.vue'
  import DeployResourcesCard from '../parts/deploy-resources-card.vue'
  import EnvironmentChoices from '../parts/environment-choices.vue'
  import {
    sampleProjectEnvironments as environmentChoices,
    sampleProjectResources as resources
  } from '../sample'

  const open = ref(false)
  const picks = ref<Record<string, string>>({})
  const environment = ref('Production')

  const setting = computed(
    () =>
      (
        environmentChoices.find((entry) => entry.name === environment.value) ??
        environmentChoices[0]
      ).setting
  )

  const sharedWith = computed(() => (setting.value.shared ? setting.value.projects : []))

  watch(open, (isOpen) => {
    if (!isOpen) return
    picks.value = {}
    environment.value = 'Production'
  })
</script>

<template>
  <DeployDrawerFrame
    v-model:open="open"
    description="Deploy project-01. Review what goes live and where."
  >
    <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
      <legend class="sr-only">Deploy</legend>
      <SettingsGroup
        label="Resources"
        hint="Everything this project serves, at the version this deployment sends live, with the version of every dependency they reference."
      >
        <DeployResourcesCard
          v-model:picks="picks"
          :resources="resources"
        />
      </SettingsGroup>

      <SettingsGroup
        label="Environment"
        hint="Where the deployment goes live. Each environment goes live with its own Deployment Settings."
      >
        <EnvironmentChoices
          v-model="environment"
          :environments="environmentChoices"
          name="project-deploy-environment"
        />

        <Alert
          v-if="sharedWith.length"
          severity="warning"
          size="small"
          :label="`Deploying with ${setting.name} also deploys to ${sharedWith.join(', ')}.`"
        />
      </SettingsGroup>
    </fieldset>
  </DeployDrawerFrame>
</template>

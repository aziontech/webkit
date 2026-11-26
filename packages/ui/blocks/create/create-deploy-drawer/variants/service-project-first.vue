<script setup lang="ts">
  import SettingsGroup from '@aziontech/ui/settings-group'
  import { computed, ref, watch } from 'vue'

  import { type DeployDrawerProject } from '../create-deploy-drawer.vue'
  import BoundProjectCard from '../parts/bound-project-card.vue'
  import DeployDrawerFrame from '../parts/deploy-drawer-frame.vue'
  import DeployResourcesCard from '../parts/deploy-resources-card.vue'
  import EnvironmentChoices from '../parts/environment-choices.vue'
  import {
    sampleBoundProjects as boundProjects,
    sampleNewProject,
    sampleResources,
    sampleServiceEnvironments as environmentChoices
  } from '../sample'

  type ProjectView = DeployDrawerProject

  const resources = sampleResources

  const newProject = sampleNewProject

  const open = ref(false)
  const picks = ref<Record<string, string>>({})
  const projectMode = ref('existing')
  const projectId = ref(boundProjects[0].id)
  const environment = ref('Production')

  const project = computed<ProjectView>(() =>
    projectMode.value === 'new'
      ? newProject
      : (boundProjects.find((entry) => entry.id === projectId.value) ?? boundProjects[0])
  )

  const isLastUsed = computed(
    () => projectMode.value === 'existing' && project.value.id === boundProjects[0].id
  )

  watch(open, (isOpen) => {
    if (!isOpen) return
    picks.value = {}
    projectMode.value = 'existing'
    projectId.value = boundProjects[0].id
    environment.value = 'Production'
  })
</script>

<template>
  <DeployDrawerFrame v-model:open="open">
    <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
      <legend class="sr-only">Deploy</legend>
      <SettingsGroup
        label="Resources"
        hint="The service version this deployment sends live, and the version of every module and integration it references."
      >
        <DeployResourcesCard
          v-model:picks="picks"
          :resources="resources"
        />
      </SettingsGroup>

      <SettingsGroup
        label="Project"
        hint="The project whose domains serve the service. Create one to deploy it on a new domain."
      >
        <BoundProjectCard
          v-model:project-mode="projectMode"
          v-model:project-id="projectId"
          :project="project"
          :bound-projects="boundProjects"
          :last-used="isLastUsed"
        />
      </SettingsGroup>

      <SettingsGroup
        label="Environment"
        hint="Where the deployment goes live. Each environment goes live with its own Deployment Settings."
      >
        <EnvironmentChoices
          v-model="environment"
          :environments="environmentChoices"
          name="service-deploy-environment"
        />
      </SettingsGroup>
    </fieldset>
  </DeployDrawerFrame>
</template>

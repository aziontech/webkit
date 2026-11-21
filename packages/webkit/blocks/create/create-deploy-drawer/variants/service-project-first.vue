<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Popover from '@aziontech/webkit/popover'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import SettingsGroup from '@aziontech/webkit/settings-group'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref, watch } from 'vue'

  import {
    type DeployDrawerEnvironment,
    type DeployDrawerProject
  } from '../create-deploy-drawer.vue'
  import DeployDrawerFrame from '../parts/deploy-drawer-frame.vue'
  import DeployResourcesCard from '../parts/deploy-resources-card.vue'
  import { sampleEnvironments, sampleNewProject, sampleResources } from '../sample'

  type ProjectView = DeployDrawerProject

  const resources = sampleResources

  const projectModes = [
    { value: 'existing', label: 'Use existing' },
    { value: 'new', label: 'Create new' }
  ]

  const newProject = sampleNewProject

  const boundProjects = [
    {
      id: '1020655',
      name: 'project-01',
      domain: 'project-1.example.com',
      environment: 'Production'
    }
  ]

  const environmentChoices: DeployDrawerEnvironment[] = [
    ...sampleEnvironments,
    {
      name: 'Stage',
      description: 'A rehearsal before Production. Each version keeps its own URL.',
      tag: ''
    }
  ]

  const open = ref(false)
  const picks = ref<Record<string, string>>({})
  const projectMode = ref('existing')
  const projectId = ref(boundProjects[0].id)
  const projectOpen = ref(false)
  const environment = ref('Production')

  const project = computed<ProjectView>(() =>
    projectMode.value === 'new'
      ? newProject
      : (boundProjects.find((entry) => entry.id === projectId.value) ?? boundProjects[0])
  )

  const isLastUsed = computed(
    () => projectMode.value === 'existing' && project.value.id === boundProjects[0].id
  )

  const pickProject = (id: string) => {
    projectId.value = id
    projectOpen.value = false
  }

  watch(open, (isOpen) => {
    if (!isOpen) return
    picks.value = {}
    projectMode.value = 'existing'
    projectId.value = boundProjects[0].id
    projectOpen.value = false
    environment.value = 'Production'
  })

  const PROJECT_OPTION_CLASS =
    'flex w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-start transition-colors duration-fast-02 ' +
    'ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none'
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
        <Card :padded="false">
          <template #header>
            <ToggleGroup
              v-model="projectMode"
              :options="projectModes"
              size="medium"
              fluid
              aria-label="Project"
              class="w-full"
            />
          </template>
          <template #default>
            <div class="p-(--spacing-lg)">
              <Item
                variant="outline"
                size="small"
              >
                <Item.Media>
                  <span
                    class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                  >
                    <i
                      class="az az-box text-body-xs text-(--text-default)"
                      aria-hidden="true"
                    />
                  </span>
                </Item.Media>
                <Item.Content>
                  <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                    <Item.Title>{{ project.name }}</Item.Title>
                    <Tag
                      v-if="isLastUsed"
                      label="Last used"
                      severity="info"
                      size="small"
                      class="shrink-0"
                    />
                  </span>
                  <Item.Description>{{ project.domain }}</Item.Description>
                </Item.Content>
                <Item.Actions
                  v-if="projectMode === 'existing'"
                  class="basis-full sm:basis-auto"
                >
                  <Popover
                    v-model:open="projectOpen"
                    side="bottom"
                    align="end"
                    size="small"
                  >
                    <Popover.Trigger>
                      <Button
                        label="Change"
                        variant="outline"
                        size="small"
                        icon="az az-chevron-down"
                        icon-position="trailing"
                      />
                    </Popover.Trigger>
                    <Popover.Content>
                      <div class="flex min-w-0 flex-col p-(--spacing-2xs)">
                        <p
                          class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)"
                        >
                          Projects serving web-app
                        </p>
                        <div class="max-h-72 overflow-y-auto overscroll-contain">
                          <button
                            v-for="(entry, index) in boundProjects"
                            :key="entry.id"
                            type="button"
                            :aria-current="entry.id === project.id || undefined"
                            :class="PROJECT_OPTION_CLASS"
                            @click="pickProject(entry.id)"
                          >
                            <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-2xs)">
                              <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                <span class="truncate text-body-sm text-(--text-default)">
                                  {{ entry.name }}
                                </span>
                                <Tag
                                  v-if="index === 0 && entry.environment"
                                  label="Last used"
                                  severity="info"
                                  size="small"
                                  class="shrink-0"
                                />
                              </span>
                              <span
                                v-if="entry.environment"
                                class="truncate text-body-xs text-(--text-muted)"
                              >
                                {{ entry.environment }}
                              </span>
                            </span>
                            <i
                              v-if="entry.id === project.id"
                              class="az az-check shrink-0 text-body-xs text-(--text-default)"
                              aria-hidden="true"
                            />
                          </button>
                        </div>
                      </div>
                    </Popover.Content>
                  </Popover>
                </Item.Actions>
              </Item>
            </div>
          </template>
        </Card>
      </SettingsGroup>

      <SettingsGroup
        label="Environment"
        hint="Where the deployment goes live. Each environment goes live with its own Deployment Settings."
      >
        <RadioGroup
          v-model="environment"
          variant="card"
          name="service-deploy-environment"
          aria-label="Environment"
        >
          <RadioGroup.Item
            v-for="entry in environmentChoices"
            :key="entry.name"
            :value="entry.name"
            :description="entry.description"
          >
            {{ entry.name }}
            <template
              v-if="entry.tag"
              #tag
            >
              <Tag
                :label="entry.tag"
                severity="info"
                size="small"
              />
            </template>
          </RadioGroup.Item>
        </RadioGroup>
      </SettingsGroup>
    </fieldset>
  </DeployDrawerFrame>
</template>

<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Item from '@aziontech/webkit/item'
  import Popover from '@aziontech/webkit/popover'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { ref } from 'vue'

  import type { DeployDrawerBoundProject } from '../sample'
  import type { DeployDrawerProject } from '../types'

  export interface BoundProjectCardProps {
    /** The project the deployment goes live on. */
    project: DeployDrawerProject
    /** The projects the service is bound to, the last used first. */
    boundProjects: DeployDrawerBoundProject[]
    /** The picked project is the one last deployed to. */
    lastUsed?: boolean
  }

  withDefaults(defineProps<BoundProjectCardProps>(), { lastUsed: false })

  /** Use an existing project or create one. */
  const projectMode = defineModel<string>('projectMode', { required: true })

  /** The existing project picked. */
  const projectId = defineModel<string>('projectId', { required: true })

  const projectModes = [
    { value: 'existing', label: 'Use existing' },
    { value: 'new', label: 'Create new' }
  ]

  const projectOpen = ref(false)

  const pickProject = (id: string) => {
    projectId.value = id
    projectOpen.value = false
  }
</script>

<template>
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
                v-if="lastUsed"
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
                  <p class="px-(--spacing-xs) py-(--spacing-2xs) text-label-sm text-(--text-muted)">
                    Projects serving web-app
                  </p>
                  <div class="max-h-72 overflow-y-auto overscroll-contain">
                    <Item
                      v-for="(entry, index) in boundProjects"
                      :key="entry.id"
                      clickable
                      variant="option"
                      :aria-current="entry.id === project.id || undefined"
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
                    </Item>
                  </div>
                </div>
              </Popover.Content>
            </Popover>
          </Item.Actions>
        </Item>
      </div>
    </template>
  </Card>
</template>

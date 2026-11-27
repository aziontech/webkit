<script setup lang="ts">
  import Button from '@aziontech/ui/button'
  import Card from '@aziontech/ui/card'
  import DropdownMenu from '@aziontech/ui/dropdown-menu'
  import Item from '@aziontech/ui/item'
  import Tag from '@aziontech/ui/tag'
  import ToggleGroup from '@aziontech/ui/toggle-group'

  import type {
    DeployDrawerProject,
    DeployDrawerProjectGroup,
    DeployDrawerProjectMode
  } from '../types'
  import DomainGroupItem from './domain-group-item.vue'
  import ProjectMedia from './project-media.vue'

  export interface ProjectCardProps {
    /** The project the deployment goes live on. */
    project: DeployDrawerProject
    /** The projects to pick from, in groups. */
    projectGroups: DeployDrawerProjectGroup[]
  }

  defineProps<ProjectCardProps>()

  /** Use an existing project or create one. */
  const projectMode = defineModel<DeployDrawerProjectMode>('projectMode', { required: true })

  /** The existing project picked. */
  const projectId = defineModel<string>('projectId', { required: true })

  const projectModes = [
    { value: 'existing', label: 'Use existing' },
    { value: 'new', label: 'Create new' }
  ]
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
      <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
        <Item
          variant="outline"
          size="small"
        >
          <ProjectMedia />
          <Item.Content>
            <span class="flex min-w-0 items-center gap-(--spacing-xs)">
              <Item.Title>{{ project.name }}</Item.Title>
              <Tag
                v-if="projectMode === 'new'"
                label="New"
                severity="success"
                size="small"
                class="shrink-0"
              />
            </span>
            <Item.Description v-if="projectMode === 'new'">
              Gets its domains on the first deploy.
            </Item.Description>
            <ul
              v-else
              class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-2xs) p-0"
            >
              <DomainGroupItem
                v-for="domainGroup in project.domains"
                :key="domainGroup.environment"
                :group="domainGroup"
              />
            </ul>
          </Item.Content>
          <Item.Actions
            v-if="projectMode === 'existing'"
            class="basis-full sm:basis-auto"
          >
            <DropdownMenu
              side="bottom"
              align="end"
              @select="(_event, id) => (projectId = String(id))"
            >
              <DropdownMenu.Trigger>
                <Button
                  label="Change"
                  variant="outline"
                  size="small"
                  icon="az az-chevron-down"
                  icon-position="trailing"
                />
              </DropdownMenu.Trigger>
              <DropdownMenu.Group
                v-for="group in projectGroups"
                :key="group.key"
                :label="group.label"
              >
                <DropdownMenu.Item
                  v-for="entry in group.projects"
                  :key="entry.id"
                  :value="entry.id"
                  :label="entry.name"
                  :selected="entry.id === project.id"
                >
                  <template #trailing>
                    <span class="truncate text-body-xs text-(--text-muted)">
                      {{ entry.detail }}
                    </span>
                  </template>
                </DropdownMenu.Item>
              </DropdownMenu.Group>
            </DropdownMenu>
          </Item.Actions>
        </Item>
      </div>
    </template>
  </Card>
</template>

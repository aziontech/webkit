<script setup lang="ts">
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import Drawer from '@aziontech/webkit/drawer-root'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelBody from '@aziontech/webkit/panel-body'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import RadioGroup from '@aziontech/webkit/radio-group'
  import Separator from '@aziontech/webkit/separator'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, reactive, ref, watch } from 'vue'

  import {
    type DeployDrawerDependency,
    type DeployDrawerEnvironment,
    type DeployDrawerProject
  } from '../deploy-drawer.vue'
  import { sampleEnvironments, sampleNewProject, sampleResources } from '../sample'

  type Dependency = DeployDrawerDependency
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
  const picks = reactive<Record<string, string>>({})
  const versionOpen = reactive<Record<string, boolean>>({})
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

  const versionOf = (row: Dependency) =>
    row.versions.find((entry) => entry.id === picks[row.key]) ?? row.versions[0]

  const versionSummary = (row: Dependency) =>
    row.total > row.versions.length
      ? `${row.versions.length} of ${row.total} Ready versions`
      : `${row.total} Ready versions`

  const pickVersion = (row: Dependency, id: string) => {
    picks[row.key] = id
    versionOpen[row.key] = false
  }

  watch(open, (isOpen) => {
    if (!isOpen) return
    Object.keys(picks).forEach((key) => delete picks[key])
    Object.keys(versionOpen).forEach((key) => delete versionOpen[key])
    projectMode.value = 'existing'
    projectId.value = boundProjects[0].id
    projectOpen.value = false
    environment.value = 'Production'
  })
</script>

<template>
  <Drawer
    v-model:open="open"
    size="large"
    side="end"
  >
    <DrawerTrigger>
      <Button
        label="Deploy"
        variant="outline"
        size="medium"
        icon="ai ai-cloud-upload"
      />
    </DrawerTrigger>

    <DrawerContent>
      <form
        class="flex min-h-0 flex-1 flex-col"
        aria-label="Deploy"
        novalidate
        @submit.prevent="open = false"
      >
        <PanelHeader class="w-full">
          <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
            <DrawerTitle>Deploy</DrawerTitle>
          </div>
        </PanelHeader>

        <PanelBody>
          <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
            <legend class="sr-only">Deploy</legend>
            <SettingsSection
              title="Resources"
              hint="The service version this deployment sends live, and the version of every module and integration it references."
            >
              <Card :padded="false">
                <template #default>
                  <template
                    v-for="(row, index) in resources"
                    :key="row.key"
                  >
                    <Separator v-if="index" />
                    <Item
                      variant="inline"
                      size="small"
                    >
                      <Item.Media>
                        <span
                          class="flex size-7 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface-raised)"
                        >
                          <i
                            :class="row.icon"
                            class="text-body-xs text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </Item.Media>
                      <Item.Content>
                        <span class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                          <span class="shrink-0 text-body-sm text-(--text-muted)">
                            {{ row.label }}
                          </span>
                          <Item.Title>{{ row.name }}</Item.Title>
                          <Tag
                            v-if="!row.note"
                            :label="row.versions.length ? 'Ready' : 'No ready version'"
                            :severity="row.versions.length ? 'success' : 'warning'"
                            size="small"
                            class="shrink-0"
                          />
                        </span>
                        <Item.Description>
                          {{ row.note || versionOf(row).name }}
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions
                        v-if="!row.note"
                        class="basis-full sm:basis-auto"
                      >
                        <DropdownMenu
                          v-model:open="versionOpen[row.key]"
                          side="bottom"
                          align="end"
                          @select="(_event, id) => pickVersion(row, String(id))"
                        >
                          <DropdownMenu.Trigger>
                            <Button
                              label="Change version"
                              :aria-label="`Change version of ${row.name}`"
                              variant="outline"
                              size="small"
                              icon="ai ai-chevron-down"
                              icon-position="trailing"
                              :disabled="!row.versions.length"
                            />
                          </DropdownMenu.Trigger>
                          <template #header>
                            <div
                              class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)"
                            >
                              <p class="text-label-sm text-(--text-muted)">
                                {{ versionSummary(row) }}
                              </p>
                              <Input
                                v-if="row.total > row.versions.length"
                                size="medium"
                                placeholder="Search versions"
                                aria-label="Search versions"
                              >
                                <template #leading>
                                  <i
                                    class="ai ai-search"
                                    aria-hidden="true"
                                  />
                                </template>
                              </Input>
                            </div>
                          </template>
                          <DropdownMenu.Group>
                            <DropdownMenu.Item
                              v-for="entry in row.versions"
                              :key="entry.id"
                              :value="entry.id"
                              :label="entry.name"
                              :selected="entry.id === versionOf(row).id"
                              :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                            >
                              <template #leading>
                                <Avatar
                                  :alt="entry.author"
                                  :label="entry.author"
                                  size="small"
                                  variant="square"
                                />
                              </template>
                              <span class="inline-flex min-w-0 items-center gap-(--spacing-xs)">
                                <span class="truncate">{{ entry.name }}</span>
                                <Tag
                                  v-if="entry.active"
                                  label="Active"
                                  severity="success"
                                  size="small"
                                  class="shrink-0"
                                />
                              </span>
                              <template #trailing>
                                <span class="text-body-xs text-(--text-muted)">{{
                                  entry.createdAgo
                                }}</span>
                              </template>
                            </DropdownMenu.Item>
                          </DropdownMenu.Group>
                          <template
                            v-if="row.total > row.versions.length"
                            #bottom
                          >
                            <div
                              class="border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-2xs)"
                            >
                              <Button
                                :label="`Load ${Math.min(row.versions.length, row.total - row.versions.length)} more`"
                                variant="ghost"
                                size="small"
                                class="w-full"
                              />
                            </div>
                          </template>
                        </DropdownMenu>
                      </Item.Actions>
                    </Item>
                    <template v-if="row.owner">
                      <Separator />
                      <Accordion
                        type="single"
                        collapsible
                        size="medium"
                      >
                        <Accordion.Item value="dependencies">
                          <Accordion.Trigger>
                            <span class="text-label-sm text-(--text-default)">Dependencies</span>
                          </Accordion.Trigger>
                          <Accordion.Content>
                            <div class="min-w-0 px-(--spacing-md) py-(--spacing-md)">
                              <p
                                v-if="!row.dependencies.length"
                                class="text-body-sm text-(--text-muted)"
                              >
                                {{ row.name }} references no other resources.
                              </p>
                              <Item.Group v-else>
                                <Item
                                  v-for="dependency in row.dependencies"
                                  :key="dependency.key"
                                  variant="inline"
                                  size="small"
                                >
                                  <Item.Media>
                                    <span class="flex size-5 items-center justify-center">
                                      <i
                                        :class="dependency.icon"
                                        class="text-body-xs text-(--text-muted)"
                                        aria-hidden="true"
                                      />
                                    </span>
                                  </Item.Media>
                                  <Item.Content>
                                    <span
                                      class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)"
                                    >
                                      <span class="shrink-0 text-body-sm text-(--text-muted)">
                                        {{ dependency.label }}
                                      </span>
                                      <Item.Title>{{ dependency.name }}</Item.Title>
                                      <Tag
                                        v-if="!dependency.note"
                                        :label="
                                          dependency.versions.length ? 'Ready' : 'No ready version'
                                        "
                                        :severity="
                                          dependency.versions.length ? 'success' : 'warning'
                                        "
                                        size="small"
                                        class="shrink-0"
                                      />
                                    </span>
                                    <Item.Description>
                                      {{ dependency.note || versionOf(dependency).name }}
                                    </Item.Description>
                                  </Item.Content>
                                  <Item.Actions v-if="!dependency.note">
                                    <DropdownMenu
                                      v-model:open="versionOpen[dependency.key]"
                                      side="bottom"
                                      align="end"
                                      @select="(_event, id) => pickVersion(dependency, String(id))"
                                    >
                                      <DropdownMenu.Trigger>
                                        <Button
                                          label="Change version"
                                          :aria-label="`Change version of ${dependency.name}`"
                                          variant="outline"
                                          size="small"
                                          icon="ai ai-chevron-down"
                                          icon-position="trailing"
                                          :disabled="!dependency.versions.length"
                                        />
                                      </DropdownMenu.Trigger>
                                      <template #header>
                                        <div
                                          class="flex flex-col gap-(--spacing-xs) px-(--spacing-xs) pb-(--spacing-xs)"
                                        >
                                          <p class="text-label-sm text-(--text-muted)">
                                            {{ versionSummary(dependency) }}
                                          </p>
                                          <Input
                                            v-if="dependency.total > dependency.versions.length"
                                            size="medium"
                                            placeholder="Search versions"
                                            aria-label="Search versions"
                                          >
                                            <template #leading>
                                              <i
                                                class="ai ai-search"
                                                aria-hidden="true"
                                              />
                                            </template>
                                          </Input>
                                        </div>
                                      </template>
                                      <DropdownMenu.Group>
                                        <DropdownMenu.Item
                                          v-for="entry in dependency.versions"
                                          :key="entry.id"
                                          :value="entry.id"
                                          :label="entry.name"
                                          :selected="entry.id === versionOf(dependency).id"
                                          :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                                        >
                                          <template #leading>
                                            <Avatar
                                              :alt="entry.author"
                                              :label="entry.author"
                                              size="small"
                                              variant="square"
                                            />
                                          </template>
                                          <span
                                            class="inline-flex min-w-0 items-center gap-(--spacing-xs)"
                                          >
                                            <span class="truncate">{{ entry.name }}</span>
                                            <Tag
                                              v-if="entry.active"
                                              label="Active"
                                              severity="success"
                                              size="small"
                                              class="shrink-0"
                                            />
                                          </span>
                                          <template #trailing>
                                            <span class="text-body-xs text-(--text-muted)">{{
                                              entry.createdAgo
                                            }}</span>
                                          </template>
                                        </DropdownMenu.Item>
                                      </DropdownMenu.Group>
                                      <template
                                        v-if="dependency.total > dependency.versions.length"
                                        #bottom
                                      >
                                        <div
                                          class="border-t border-(--border-default) px-(--spacing-2xs) pt-(--spacing-2xs)"
                                        >
                                          <Button
                                            :label="`Load ${Math.min(dependency.versions.length, dependency.total - dependency.versions.length)} more`"
                                            variant="ghost"
                                            size="small"
                                            class="w-full"
                                          />
                                        </div>
                                      </template>
                                    </DropdownMenu>
                                  </Item.Actions>
                                </Item>
                              </Item.Group>
                              <span
                                class="sr-only"
                                role="status"
                              />
                            </div>
                          </Accordion.Content>
                        </Accordion.Item>
                      </Accordion>
                    </template>
                  </template>
                </template>
              </Card>
            </SettingsSection>

            <SettingsSection
              title="Project"
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
                            class="ai ai-box text-body-xs text-(--text-default)"
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
                              icon="ai ai-chevron-down"
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
                                  class="flex w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-start transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
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
                                    class="ai ai-check shrink-0 text-body-xs text-(--text-default)"
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
            </SettingsSection>

            <SettingsSection
              title="Environment"
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
            </SettingsSection>
          </fieldset>
        </PanelBody>

        <PanelFooter>
          <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
            <div class="flex min-w-0 items-center gap-(--spacing-sm)" />
            <Button
              label="Deploy"
              variant="primary"
              size="medium"
              type="submit"
            />
          </div>
        </PanelFooter>
      </form>
    </DrawerContent>
  </Drawer>
</template>

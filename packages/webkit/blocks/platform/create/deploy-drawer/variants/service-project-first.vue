<script setup>
  import Accordion from '@aziontech/webkit/accordion'
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Field from '@aziontech/webkit/field'
  import RadioButton from '@aziontech/webkit/radio-button'
  import Separator from '@aziontech/webkit/separator'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tag from '@aziontech/webkit/tag'
  import { computed, reactive, ref, watch } from 'vue'

  const resources = [
    {
      key: 'service',
      label: 'Service',
      name: 'web-app',
      icon: 'pi pi-server',
      note: '',
      total: 6,
      versions: [
        {
          id: 'AEO25I38',
          name: 'AEO25I38',
          author: 'Rafael Umman',
          createdAgo: '1 day ago',
          active: true
        },
        {
          id: 'AG1VVDJP',
          name: 'AG1VVDJP',
          author: 'Marcus Grando',
          createdAgo: '3 days ago'
        },
        {
          id: 'AHFPL906',
          name: 'AHFPL906',
          author: 'Bruno Germano',
          createdAgo: '3 days ago'
        },
        { id: 'AITJB4GN', name: 'AITJB4GN', author: 'Gab Lisboa', createdAgo: '4 days ago' },
        {
          id: 'AK7D0ZX4',
          name: 'AK7D0ZX4',
          author: 'Robson Junior',
          createdAgo: '6 days ago'
        }
      ],
      owner: true,
      dependencies: [
        {
          key: 'service@AG1VVDJP:module-auth-gateway',
          label: 'Module',
          name: 'auth-gateway',
          icon: 'pi pi-code',
          note: '',
          total: 8,
          versions: [
            {
              id: 'APICRFV0',
              name: 'APICRFV0',
              author: 'Rafael Umman',
              createdAgo: '2 days ago'
            },
            {
              id: 'AQW6HBBH',
              name: 'AQW6HBBH',
              author: 'Marcus Grando',
              createdAgo: '3 days ago'
            },
            {
              id: 'ASA076RY',
              name: 'ASA076RY',
              author: 'Bruno Germano',
              createdAgo: '5 days ago'
            },
            {
              id: 'ATNTX28F',
              name: 'ATNTX28F',
              author: 'Gab Lisboa',
              createdAgo: '5 days ago'
            },
            {
              id: 'AV1NMXOW',
              name: 'AV1NMXOW',
              author: 'Robson Junior',
              createdAgo: '6 days ago'
            }
          ]
        },
        {
          key: 'service@AG1VVDJP:module-geo-redirect',
          label: 'Module',
          name: 'geo-redirect',
          icon: 'pi pi-code',
          note: '',
          total: 11,
          versions: [
            {
              id: 'AK16MQ4R',
              name: 'AK16MQ4R',
              author: 'Herbert Júlio',
              createdAgo: '2 days ago'
            },
            {
              id: 'ALF0CLL8',
              name: 'ALF0CLL8',
              author: 'Rafael Umman',
              createdAgo: '4 days ago'
            },
            {
              id: 'AMSU2H1P',
              name: 'AMSU2H1P',
              author: 'Marcus Grando',
              createdAgo: '4 days ago'
            },
            {
              id: 'AO6NSCI6',
              name: 'AO6NSCI6',
              author: 'Bruno Germano',
              createdAgo: '6 days ago'
            },
            {
              id: 'APKHI7YN',
              name: 'APKHI7YN',
              author: 'Gab Lisboa',
              createdAgo: '6 days ago'
            }
          ]
        },
        {
          key: 'service@AG1VVDJP:integration-payments-api',
          label: 'Integration',
          name: 'payments-api',
          icon: 'pi pi-link',
          note: '',
          total: 11,
          versions: [
            {
              id: 'ASEKWJQF',
              name: 'ASEKWJQF',
              author: 'Gab Lisboa',
              createdAgo: '21 hours ago'
            },
            {
              id: 'ATSEMF6W',
              name: 'ATSEMF6W',
              author: 'Robson Junior',
              createdAgo: '2 days ago'
            },
            {
              id: 'AV68CAND',
              name: 'AV68CAND',
              author: 'Isaque Böck',
              createdAgo: '2 days ago'
            },
            {
              id: 'AWK2263U',
              name: 'AWK2263U',
              author: 'Rafael Garbinatto',
              createdAgo: '3 days ago'
            },
            {
              id: 'AXXVS1KB',
              name: 'AXXVS1KB',
              author: 'Herbert Júlio',
              createdAgo: '5 days ago'
            }
          ]
        }
      ]
    }
  ]

  const projectModes = [
    { value: 'existing', label: 'Use existing' },
    { value: 'new', label: 'Create new' }
  ]

  const newProject = { name: 'web-app', domain: 'web-app.example.com' }

  const boundProjects = [
    {
      id: '1020655',
      name: 'project-01',
      domain: 'project-1.example.com',
      environment: 'Production'
    }
  ]

  const environmentChoices = [
    {
      name: 'Production',
      description: 'Live traffic. One version serves the domain, and deploying replaces it.',
      tag: 'Last used'
    },
    {
      name: 'Preview',
      description:
        'Every other branch. Each version keeps its own URL, so a build can be read before it is live.',
      tag: ''
    },
    {
      name: 'Stage',
      description: 'A rehearsal before Production. Each version keeps its own URL.',
      tag: ''
    }
  ]

  const open = ref(false)
  const picks = reactive({})
  const versionOpen = reactive({})
  const projectMode = ref('existing')
  const projectId = ref(boundProjects[0].id)
  const projectOpen = ref(false)
  const environment = ref('Production')

  const project = computed(() =>
    projectMode.value === 'new'
      ? newProject
      : boundProjects.find((entry) => entry.id === projectId.value)
  )

  const isLastUsed = computed(
    () => projectMode.value === 'existing' && project.value.id === boundProjects[0].id
  )

  const pickProject = (id) => {
    projectId.value = id
    projectOpen.value = false
  }

  const versionOf = (row) =>
    row.versions.find((entry) => entry.id === picks[row.key]) ?? row.versions[0]

  const versionSummary = (row) =>
    row.total > row.versions.length
      ? `${row.versions.length} of ${row.total} Ready versions`
      : `${row.total} Ready versions`

  const pickVersion = (row, id) => {
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
    size="medium"
    side="right"
  >
    <DrawerTrigger>
      <Button
        label="Deploy"
        kind="outlined"
        size="medium"
        icon="pi pi-cloud-upload"
      />
    </DrawerTrigger>

    <DrawerPortal>
      <DrawerOverlay />
      <DrawerContent>
        <form
          class="flex min-h-0 flex-1 flex-col"
          aria-label="Deploy"
          novalidate
          @submit.prevent="open = false"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Deploy</DrawerTitle>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">Deploy</legend>
              <SettingsSection
                title="Resources"
                hint="The service version this deployment publishes, and the version of every module and integration it references."
              >
                <Card :padded="false">
                  <template #content>
                    <template
                      v-for="(row, index) in resources"
                      :key="row.key"
                    >
                      <Separator v-if="index" />
                      <Item
                        kind="inline"
                        size="small"
                      >
                        <Item.Media>
                          <span
                            class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                          >
                            <i
                              :class="row.icon"
                              class="text-body-xs text-(--text-default)"
                              aria-hidden="true"
                            />
                          </span>
                        </Item.Media>
                        <Item.Content>
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
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
                        <Item.Actions v-if="!row.note">
                          <Popover
                            v-model:open="versionOpen[row.key]"
                            placement="bottom-end"
                            width="small"
                          >
                            <Popover.Trigger>
                              <Button
                                label="Change version"
                                kind="outlined"
                                size="small"
                                icon="pi pi-chevron-down"
                                icon-position="trailing"
                                :disabled="!row.versions.length"
                              />
                            </Popover.Trigger>
                            <Popover.Content>
                              <div
                                class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
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
                                  <template #iconLeft>
                                    <i
                                      class="pi pi-search"
                                      aria-hidden="true"
                                    />
                                  </template>
                                </Input>
                              </div>

                              <div
                                class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)"
                              >
                                <button
                                  v-for="entry in row.versions"
                                  :key="entry.id"
                                  type="button"
                                  :aria-current="entry.id === versionOf(row).id || undefined"
                                  class="flex w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-start transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                  @click="pickVersion(row, entry.id)"
                                >
                                  <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                                    <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                      <span class="truncate text-body-sm text-(--text-default)">
                                        {{ entry.name }}
                                      </span>
                                      <Tag
                                        v-if="entry.active"
                                        label="Active"
                                        severity="success"
                                        size="small"
                                        class="shrink-0"
                                      />
                                    </span>
                                    <span
                                      class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                                    >
                                      <Avatar
                                        :alt="entry.author"
                                        :label="entry.author"
                                        size="small"
                                        kind="square"
                                        class="shrink-0"
                                      />
                                      <span class="truncate"
                                        >{{ entry.author }} · {{ entry.createdAgo }}</span
                                      >
                                    </span>
                                  </span>
                                  <i
                                    v-if="entry.id === versionOf(row).id"
                                    class="pi pi-check shrink-0 text-body-xs text-(--text-default)"
                                    aria-hidden="true"
                                  />
                                </button>
                              </div>

                              <div
                                v-if="row.total > row.versions.length"
                                class="border-t border-(--border-default) p-(--spacing-xxs)"
                              >
                                <Button
                                  :label="`Load ${Math.min(row.versions.length, row.total - row.versions.length)} more`"
                                  kind="transparent"
                                  size="small"
                                  class="w-full"
                                />
                              </div>

                              <span
                                class="sr-only"
                                role="status"
                                >{{ versionSummary(row) }}</span
                              >
                            </Popover.Content>
                          </Popover>
                        </Item.Actions>
                      </Item>
                      <template v-if="row.owner">
                        <Separator />
                        <Accordion
                          type="single"
                          collapsible
                          size="small"
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
                                  <div class="flex flex-col gap-(--spacing-sm)">
                                    <Item
                                      v-for="dependency in row.dependencies"
                                      :key="dependency.key"
                                      kind="inline"
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
                                        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                                          <span class="shrink-0 text-body-sm text-(--text-muted)">
                                            {{ dependency.label }}
                                          </span>
                                          <Item.Title>{{ dependency.name }}</Item.Title>
                                          <Tag
                                            v-if="!dependency.note"
                                            :label="
                                              dependency.versions.length
                                                ? 'Ready'
                                                : 'No ready version'
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
                                        <Popover
                                          v-model:open="versionOpen[dependency.key]"
                                          placement="bottom-end"
                                          width="small"
                                        >
                                          <Popover.Trigger>
                                            <Button
                                              label="Change version"
                                              kind="outlined"
                                              size="small"
                                              icon="pi pi-chevron-down"
                                              icon-position="trailing"
                                              :disabled="!dependency.versions.length"
                                            />
                                          </Popover.Trigger>
                                          <Popover.Content>
                                            <div
                                              class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
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
                                                <template #iconLeft>
                                                  <i
                                                    class="pi pi-search"
                                                    aria-hidden="true"
                                                  />
                                                </template>
                                              </Input>
                                            </div>

                                            <div
                                              class="max-h-(--container-xs) overflow-auto overscroll-contain p-(--spacing-xxs)"
                                            >
                                              <button
                                                v-for="entry in dependency.versions"
                                                :key="entry.id"
                                                type="button"
                                                :aria-current="
                                                  entry.id === versionOf(dependency).id || undefined
                                                "
                                                class="flex w-full min-w-0 items-center gap-(--spacing-xs) rounded-(--shape-button) px-(--spacing-xs) py-(--spacing-xs) text-start transition-colors duration-fast-02 ease-productive-entrance hover:bg-(--bg-hover) focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) motion-reduce:transition-none"
                                                @click="pickVersion(dependency, entry.id)"
                                              >
                                                <span
                                                  class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)"
                                                >
                                                  <span
                                                    class="flex min-w-0 items-center gap-(--spacing-xs)"
                                                  >
                                                    <span
                                                      class="truncate text-body-sm text-(--text-default)"
                                                    >
                                                      {{ entry.name }}
                                                    </span>
                                                    <Tag
                                                      v-if="entry.active"
                                                      label="Active"
                                                      severity="success"
                                                      size="small"
                                                      class="shrink-0"
                                                    />
                                                  </span>
                                                  <span
                                                    class="flex min-w-0 items-center gap-(--spacing-xs) text-body-xs text-(--text-muted)"
                                                  >
                                                    <Avatar
                                                      :alt="entry.author"
                                                      :label="entry.author"
                                                      size="small"
                                                      kind="square"
                                                      class="shrink-0"
                                                    />
                                                    <span class="truncate"
                                                      >{{ entry.author }} ·
                                                      {{ entry.createdAgo }}</span
                                                    >
                                                  </span>
                                                </span>
                                                <i
                                                  v-if="entry.id === versionOf(dependency).id"
                                                  class="pi pi-check shrink-0 text-body-xs text-(--text-default)"
                                                  aria-hidden="true"
                                                />
                                              </button>
                                            </div>

                                            <div
                                              v-if="dependency.total > dependency.versions.length"
                                              class="border-t border-(--border-default) p-(--spacing-xxs)"
                                            >
                                              <Button
                                                :label="`Load ${Math.min(dependency.versions.length, dependency.total - dependency.versions.length)} more`"
                                                kind="transparent"
                                                size="small"
                                                class="w-full"
                                              />
                                            </div>

                                            <span
                                              class="sr-only"
                                              role="status"
                                              >{{ versionSummary(dependency) }}</span
                                            >
                                          </Popover.Content>
                                        </Popover>
                                      </Item.Actions>
                                    </Item>
                                  </div>
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
                hint="The project whose domains serve the service. Create one to publish it on a new domain."
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
                  <template #content>
                    <div class="p-(--spacing-lg)">
                      <Item
                        kind="outlined"
                        size="small"
                      >
                        <Item.Media>
                          <span
                            class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                          >
                            <i
                              class="pi pi-box text-body-xs text-(--text-default)"
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
                        <Item.Actions v-if="projectMode === 'existing'">
                          <Popover
                            v-model:open="projectOpen"
                            placement="bottom-end"
                            width="small"
                          >
                            <Popover.Trigger>
                              <Button
                                label="Change"
                                kind="outlined"
                                size="small"
                                icon="pi pi-chevron-down"
                                icon-position="trailing"
                              />
                            </Popover.Trigger>
                            <Popover.Content>
                              <div class="flex min-w-0 flex-col p-(--spacing-xxs)">
                                <p
                                  class="px-(--spacing-xs) py-(--spacing-xxs) text-label-sm text-(--text-muted)"
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
                                    <span class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
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
                                      class="pi pi-check shrink-0 text-body-xs text-(--text-default)"
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
                hint="Where the deployment goes live. Each environment publishes with its own Deployment Settings."
              >
                <div
                  role="radiogroup"
                  aria-label="Environment"
                  class="flex min-w-0 flex-col gap-(--spacing-xs)"
                >
                  <div
                    v-for="entry in environmentChoices"
                    :key="entry.name"
                    class="relative min-w-0"
                  >
                    <Field.Label>
                      <Field orientation="horizontal">
                        <RadioButton
                          v-model="environment"
                          name="service-deploy-environment"
                          :value="entry.name"
                        />
                        <Field.Content>
                          <Field.Title>
                            {{ entry.name }}
                          </Field.Title>
                          <Field.Description v-if="entry.description">
                            {{ entry.description }}
                          </Field.Description>
                        </Field.Content>
                      </Field>
                    </Field.Label>
                    <div
                      v-if="entry.tag"
                      class="pointer-events-none absolute end-(--spacing-sm) top-(--spacing-sm)"
                    >
                      <Tag
                        :label="entry.tag"
                        severity="info"
                        size="small"
                      />
                    </div>
                  </div>
                </div>
              </SettingsSection>
            </fieldset>
          </PanelContent>

          <PanelFooter>
            <div class="flex w-full flex-wrap items-center justify-between gap-(--spacing-sm)">
              <div class="flex min-w-0 items-center gap-(--spacing-sm)" />
              <Button
                label="Deploy"
                kind="primary"
                size="medium"
                type="submit"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>

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
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
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

  const projectGroups = [
    {
      key: 'serving',
      label: 'Serving web-app',
      projects: [
        {
          id: '1020655',
          name: 'project-01',
          detail: '2 environments',
          domains: [
            {
              environment: 'Production',
              total: 8,
              summary: '8 domains',
              domains: [
                'project-1.example.com',
                'project-1-alias-1.example.com',
                'project-1-alias-2.example.com',
                'project-1-alias-3.example.com',
                'project-1-alias-4.example.com',
                'project-1-alias-5.example.com',
                'project-1-alias-6.example.com',
                'project-1-alias-7.example.com'
              ]
            }
          ]
        }
      ]
    },
    {
      key: 'flexible',
      label: 'Flexible',
      projects: [
        {
          id: '1031410004',
          name: 'campaign-landing',
          detail: 'Serves black-friday-2025',
          domains: [
            {
              environment: 'Production',
              total: 1,
              summary: '1 domains',
              domains: ['campaign.example.com']
            }
          ]
        },
        {
          id: '1031410005',
          name: 'docs-site',
          detail: 'Serves docs-web · Preview only',
          domains: [
            {
              environment: 'Preview',
              total: 1,
              summary: '1 domains',
              domains: ['*-preview.docs.example.com']
            }
          ]
        },
        {
          id: '1021001',
          name: 'project-03',
          detail: 'Serves analytics-pro',
          domains: [
            {
              environment: 'Production',
              total: 22,
              summary: '10 of 22 domains',
              domains: [
                'project-3.example.com',
                'project-3-alias-1.example.com',
                'project-3-alias-2.example.com',
                'project-3-alias-3.example.com',
                'project-3-alias-4.example.com',
                'project-3-alias-5.example.com',
                'project-3-alias-6.example.com',
                'project-3-alias-7.example.com',
                'project-3-alias-8.example.com',
                'project-3-alias-9.example.com'
              ]
            }
          ]
        },
        {
          id: '1021866',
          name: 'project-08',
          detail: 'Serves ecommerce-v2',
          domains: [
            {
              environment: 'Production',
              total: 57,
              summary: '10 of 57 domains',
              domains: [
                'project-8.example.com',
                'project-8-alias-1.example.com',
                'project-8-alias-2.example.com',
                'project-8-alias-3.example.com',
                'project-8-alias-4.example.com',
                'project-8-alias-5.example.com',
                'project-8-alias-6.example.com',
                'project-8-alias-7.example.com',
                'project-8-alias-8.example.com',
                'project-8-alias-9.example.com'
              ]
            }
          ]
        },
        {
          id: '1022731',
          name: 'project-13',
          detail: 'Serves mobile-app',
          domains: [
            {
              environment: 'Production',
              total: 92,
              summary: '10 of 92 domains',
              domains: [
                'project-13.example.com',
                'project-13-alias-1.example.com',
                'project-13-alias-2.example.com',
                'project-13-alias-3.example.com',
                'project-13-alias-4.example.com',
                'project-13-alias-5.example.com',
                'project-13-alias-6.example.com',
                'project-13-alias-7.example.com',
                'project-13-alias-8.example.com',
                'project-13-alias-9.example.com'
              ]
            }
          ]
        },
        {
          id: '1023596',
          name: 'project-18',
          detail: 'Serves react-dashboard',
          domains: [
            {
              environment: 'Production',
              total: 28,
              summary: '10 of 28 domains',
              domains: [
                'project-18.example.com',
                'project-18-alias-1.example.com',
                'project-18-alias-2.example.com',
                'project-18-alias-3.example.com',
                'project-18-alias-4.example.com',
                'project-18-alias-5.example.com',
                'project-18-alias-6.example.com',
                'project-18-alias-7.example.com',
                'project-18-alias-8.example.com',
                'project-18-alias-9.example.com'
              ]
            }
          ]
        }
      ]
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
    }
  ]

  const impacted = [
    {
      environment: 'Production',
      projects: [
        {
          id: '1020655',
          name: 'project-01',
          selected: true,
          domains: [
            {
              environment: 'Production',
              total: 8,
              summary: '8 domains',
              domains: [
                'project-1.example.com',
                'project-1-alias-1.example.com',
                'project-1-alias-2.example.com',
                'project-1-alias-3.example.com',
                'project-1-alias-4.example.com',
                'project-1-alias-5.example.com',
                'project-1-alias-6.example.com',
                'project-1-alias-7.example.com'
              ]
            }
          ]
        },
        {
          id: '1021347',
          name: 'project-05',
          domains: [
            {
              environment: 'Production',
              total: 36,
              summary: '10 of 36 domains',
              domains: [
                'project-5.example.com',
                'project-5-alias-1.example.com',
                'project-5-alias-2.example.com',
                'project-5-alias-3.example.com',
                'project-5-alias-4.example.com',
                'project-5-alias-5.example.com',
                'project-5-alias-6.example.com',
                'project-5-alias-7.example.com',
                'project-5-alias-8.example.com',
                'project-5-alias-9.example.com'
              ]
            }
          ]
        },
        {
          id: '1022039',
          name: 'project-09',
          domains: [
            {
              environment: 'Production',
              total: 64,
              summary: '10 of 64 domains',
              domains: [
                'project-9.example.com',
                'project-9-alias-1.example.com',
                'project-9-alias-2.example.com',
                'project-9-alias-3.example.com',
                'project-9-alias-4.example.com',
                'project-9-alias-5.example.com',
                'project-9-alias-6.example.com',
                'project-9-alias-7.example.com',
                'project-9-alias-8.example.com',
                'project-9-alias-9.example.com'
              ]
            }
          ]
        }
      ]
    }
  ]

  const open = ref(false)
  const picks = reactive({ service: 'AG1VVDJP' })
  const versionOpen = reactive({})
  const projectMode = ref('existing')
  const projectId = ref('1020655')
  const environment = ref('Production')

  const project = computed(() =>
    projectMode.value === 'new'
      ? newProject
      : projectGroups
          .flatMap((group) => group.projects)
          .find((entry) => entry.id === projectId.value)
  )

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
    picks.service = 'AG1VVDJP'
    Object.keys(versionOpen).forEach((key) => delete versionOpen[key])
    projectMode.value = 'existing'
    projectId.value = '1020655'
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
                          <DropdownMenu
                            v-model:open="versionOpen[row.key]"
                            placement="bottom-end"
                            @select="(event, id) => pickVersion(row, String(id))"
                          >
                            <DropdownMenu.Trigger>
                              <Button
                                label="Change version"
                                kind="outlined"
                                size="small"
                                icon="pi pi-chevron-down"
                                icon-position="trailing"
                                :disabled="!row.versions.length"
                              />
                            </DropdownMenu.Trigger>
                            <template #top>
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
                                  <template #iconLeft>
                                    <i
                                      class="pi pi-search"
                                      aria-hidden="true"
                                    />
                                  </template>
                                </Input>
                              </div>
                            </template>
                            <DropdownMenu.Group>
                              <DropdownMenu.Option
                                v-for="entry in row.versions"
                                :key="entry.id"
                                :value="entry.id"
                                :label="entry.name"
                                :selected="entry.id === versionOf(row).id"
                                :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                              >
                                <template #left>
                                  <Avatar
                                    :alt="entry.author"
                                    :label="entry.author"
                                    size="small"
                                    kind="square"
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
                                <template #right>
                                  <span class="text-body-xs text-(--text-muted)">{{
                                    entry.createdAgo
                                  }}</span>
                                </template>
                              </DropdownMenu.Option>
                            </DropdownMenu.Group>
                            <template
                              v-if="row.total > row.versions.length"
                              #bottom
                            >
                              <div
                                class="border-t border-(--border-default) px-(--spacing-xxs) pt-(--spacing-xxs)"
                              >
                                <Button
                                  :label="`Load ${Math.min(row.versions.length, row.total - row.versions.length)} more`"
                                  kind="transparent"
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
                                <Item.Group
                                  v-else
                                  class="gap-(--spacing-sm)!"
                                >
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
                                      <DropdownMenu
                                        v-model:open="versionOpen[dependency.key]"
                                        placement="bottom-end"
                                        @select="(event, id) => pickVersion(dependency, String(id))"
                                      >
                                        <DropdownMenu.Trigger>
                                          <Button
                                            label="Change version"
                                            kind="outlined"
                                            size="small"
                                            icon="pi pi-chevron-down"
                                            icon-position="trailing"
                                            :disabled="!dependency.versions.length"
                                          />
                                        </DropdownMenu.Trigger>
                                        <template #top>
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
                                              <template #iconLeft>
                                                <i
                                                  class="pi pi-search"
                                                  aria-hidden="true"
                                                />
                                              </template>
                                            </Input>
                                          </div>
                                        </template>
                                        <DropdownMenu.Group>
                                          <DropdownMenu.Option
                                            v-for="entry in dependency.versions"
                                            :key="entry.id"
                                            :value="entry.id"
                                            :label="entry.name"
                                            :selected="entry.id === versionOf(dependency).id"
                                            :aria-label="`${entry.name}${entry.active ? ', active' : ''}, by ${entry.author}, ${entry.createdAgo}`"
                                          >
                                            <template #left>
                                              <Avatar
                                                :alt="entry.author"
                                                :label="entry.author"
                                                size="small"
                                                kind="square"
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
                                            <template #right>
                                              <span class="text-body-xs text-(--text-muted)">{{
                                                entry.createdAgo
                                              }}</span>
                                            </template>
                                          </DropdownMenu.Option>
                                        </DropdownMenu.Group>
                                        <template
                                          v-if="dependency.total > dependency.versions.length"
                                          #bottom
                                        >
                                          <div
                                            class="border-t border-(--border-default) px-(--spacing-xxs) pt-(--spacing-xxs)"
                                          >
                                            <Button
                                              :label="`Load ${Math.min(dependency.versions.length, dependency.total - dependency.versions.length)} more`"
                                              kind="transparent"
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
                    <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
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
                            class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xxs) p-0"
                          >
                            <li
                              v-for="domainGroup in project.domains"
                              :key="domainGroup.environment"
                              class="flex min-w-0 items-center gap-(--spacing-xs)"
                            >
                              <Tag
                                :label="domainGroup.environment"
                                severity="secondary"
                                size="small"
                                class="shrink-0"
                              />
                              <div class="flex min-w-0">
                                <Tooltip
                                  :text="`Open ${domainGroup.domains[0]} in a new tab`"
                                  class="w-full"
                                >
                                  <a
                                    :href="`https://${domainGroup.domains[0]}`"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    data-link="true"
                                    class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                  >
                                    <span
                                      class="truncate underline-offset-2 group-hover/link:underline"
                                    >
                                      {{ domainGroup.domains[0] }}
                                    </span>
                                    <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                                    <i
                                      class="pi pi-external-link shrink-0 text-body-xs leading-none"
                                      aria-hidden="true"
                                    />
                                  </a>
                                </Tooltip>
                              </div>
                              <Popover
                                v-if="domainGroup.total > 1"
                                placement="bottom-start"
                                width="small"
                              >
                                <Popover.Trigger>
                                  <div class="shrink-0 cursor-pointer">
                                    <Tag
                                      :label="`+${domainGroup.total - 1}`"
                                      severity="secondary"
                                      size="small"
                                    />
                                  </div>
                                </Popover.Trigger>
                                <Popover.Content>
                                  <div
                                    class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
                                  >
                                    <p class="text-label-sm text-(--text-muted)">
                                      {{ domainGroup.summary }}
                                    </p>
                                    <Input
                                      v-if="domainGroup.total > 10"
                                      size="medium"
                                      placeholder="Search domains"
                                      aria-label="Search domains"
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
                                    <a
                                      v-for="domain in domainGroup.domains"
                                      :key="domain"
                                      :href="`https://${domain}`"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                    >
                                      <span class="truncate">{{ domain }}</span>
                                      <i
                                        class="pi pi-external-link ms-auto shrink-0 text-body-xs leading-none"
                                        aria-hidden="true"
                                      />
                                    </a>
                                  </div>

                                  <div
                                    v-if="domainGroup.total > domainGroup.domains.length"
                                    class="border-t border-(--border-default) p-(--spacing-xxs)"
                                  >
                                    <Button
                                      :label="`Load ${Math.min(10, domainGroup.total - domainGroup.domains.length)} more`"
                                      kind="transparent"
                                      size="small"
                                      class="w-full"
                                    />
                                  </div>

                                  <span
                                    class="sr-only"
                                    role="status"
                                  >
                                    {{ domainGroup.summary }}
                                  </span>
                                </Popover.Content>
                              </Popover>
                            </li>
                          </ul>
                        </Item.Content>
                        <Item.Actions v-if="projectMode === 'existing'">
                          <DropdownMenu
                            placement="bottom-end"
                            @select="(event, id) => (projectId = String(id))"
                          >
                            <DropdownMenu.Trigger>
                              <Button
                                label="Change"
                                kind="outlined"
                                size="small"
                                icon="pi pi-chevron-down"
                                icon-position="trailing"
                              />
                            </DropdownMenu.Trigger>
                            <DropdownMenu.Group
                              v-for="group in projectGroups"
                              :key="group.key"
                              :label="group.label"
                            >
                              <DropdownMenu.Option
                                v-for="entry in group.projects"
                                :key="entry.id"
                                :value="entry.id"
                                :label="entry.name"
                                :selected="entry.id === project.id"
                              >
                                <template #right>
                                  <span class="truncate text-body-xs text-(--text-muted)">
                                    {{ entry.detail }}
                                  </span>
                                </template>
                              </DropdownMenu.Option>
                            </DropdownMenu.Group>
                          </DropdownMenu>
                        </Item.Actions>
                      </Item>
                    </div>
                  </template>
                </Card>
              </SettingsSection>

              <SettingsSection
                title="Environment"
                hint="Where the deployment goes live, from the environments this project serves. Each one publishes with the Deployment Settings set on the project."
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

              <SettingsSection
                title="Projects impacted"
                hint="This environment publishes with shared Deployment Settings, so the deployment reaches every project below, in every environment they are linked to, and the domains they serve."
              >
                <div class="flex min-w-0 flex-col gap-(--spacing-md)">
                  <div
                    v-for="group in impacted"
                    :key="group.environment"
                    class="flex min-w-0 flex-col gap-(--spacing-xs)"
                  >
                    <ul
                      class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xs) p-0"
                      :aria-label="`Projects impacted in ${group.environment} (${group.projects.length})`"
                    >
                      <li
                        v-for="target in group.projects"
                        :key="target.id"
                        class="min-w-0"
                      >
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
                              <Item.Title>{{ target.name }}</Item.Title>
                              <Tag
                                v-if="target.selected"
                                label="Selected"
                                severity="secondary"
                                size="small"
                                class="shrink-0"
                              />
                            </span>
                            <ul class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xxs) p-0">
                              <li
                                v-for="domainGroup in target.domains"
                                :key="domainGroup.environment"
                                class="flex min-w-0 items-center gap-(--spacing-xs)"
                              >
                                <Tag
                                  :label="domainGroup.environment"
                                  severity="secondary"
                                  size="small"
                                  class="shrink-0"
                                />
                                <div class="flex min-w-0">
                                  <Tooltip
                                    :text="`Open ${domainGroup.domains[0]} in a new tab`"
                                    class="w-full"
                                  >
                                    <a
                                      :href="`https://${domainGroup.domains[0]}`"
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      data-link="true"
                                      class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-xxs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                    >
                                      <span
                                        class="truncate underline-offset-2 group-hover/link:underline"
                                      >
                                        {{ domainGroup.domains[0] }}
                                      </span>
                                      <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                                      <i
                                        class="pi pi-external-link shrink-0 text-body-xs leading-none"
                                        aria-hidden="true"
                                      />
                                    </a>
                                  </Tooltip>
                                </div>
                                <Popover
                                  v-if="domainGroup.total > 1"
                                  placement="bottom-start"
                                  width="small"
                                >
                                  <Popover.Trigger>
                                    <div class="shrink-0 cursor-pointer">
                                      <Tag
                                        :label="`+${domainGroup.total - 1}`"
                                        severity="secondary"
                                        size="small"
                                      />
                                    </div>
                                  </Popover.Trigger>
                                  <Popover.Content>
                                    <div
                                      class="flex flex-col gap-(--spacing-xs) border-b border-(--border-default) px-(--spacing-sm) pb-(--spacing-xs) pt-(--spacing-sm)"
                                    >
                                      <p class="text-label-sm text-(--text-muted)">
                                        {{ domainGroup.summary }}
                                      </p>
                                      <Input
                                        v-if="domainGroup.total > 10"
                                        size="medium"
                                        placeholder="Search domains"
                                        aria-label="Search domains"
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
                                      <a
                                        v-for="domain in domainGroup.domains"
                                        :key="domain"
                                        :href="`https://${domain}`"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        class="flex items-center gap-(--spacing-xxs) rounded-(--shape-elements) px-(--spacing-xs) py-(--spacing-xxs) text-body-sm text-(--text-default) hover:bg-(--bg-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                                      >
                                        <span class="truncate">{{ domain }}</span>
                                        <i
                                          class="pi pi-external-link ms-auto shrink-0 text-body-xs leading-none"
                                          aria-hidden="true"
                                        />
                                      </a>
                                    </div>

                                    <div
                                      v-if="domainGroup.total > domainGroup.domains.length"
                                      class="border-t border-(--border-default) p-(--spacing-xxs)"
                                    >
                                      <Button
                                        :label="`Load ${Math.min(10, domainGroup.total - domainGroup.domains.length)} more`"
                                        kind="transparent"
                                        size="small"
                                        class="w-full"
                                      />
                                    </div>

                                    <span
                                      class="sr-only"
                                      role="status"
                                    >
                                      {{ domainGroup.summary }}
                                    </span>
                                  </Popover.Content>
                                </Popover>
                              </li>
                            </ul>
                          </Item.Content>
                        </Item>
                      </li>
                    </ul>
                  </div>
                </div>
              </SettingsSection>

              <span
                class="sr-only"
                role="status"
              />
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

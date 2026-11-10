<script setup>
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import Drawer from '@aziontech/webkit/drawer'
  import DrawerClose from '@aziontech/webkit/drawer-close'
  import DrawerContent from '@aziontech/webkit/drawer-content'
  import DrawerOverlay from '@aziontech/webkit/drawer-overlay'
  import DrawerPortal from '@aziontech/webkit/drawer-portal'
  import DrawerTitle from '@aziontech/webkit/drawer-title'
  import DrawerTrigger from '@aziontech/webkit/drawer-trigger'
  import DropdownMenu from '@aziontech/webkit/dropdown-menu'
  import FieldRadioBlock from '@aziontech/webkit/field-radio-block'
  import Hint from '@aziontech/webkit/hint'
  import Input from '@aziontech/webkit/input'
  import Item from '@aziontech/webkit/item'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Spinner from '@aziontech/webkit/spinner'
  import Tag from '@aziontech/webkit/tag'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref, watch } from 'vue'

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
  const elapsed = ref(2)
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

  watch(open, (isOpen) => {
    if (!isOpen) return
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
          aria-label="Build and Deployment"
          novalidate
          @submit.prevent="open = false"
        >
          <PanelHeader class="w-full">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <DrawerTitle>Build and Deployment</DrawerTitle>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">Build and Deployment</legend>
              <section
                data-stacked="true"
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)]"
              >
                <div
                  data-stacked="true"
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <h2
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Resources</span>
                    </h2>
                    <Hint
                      text="The service version this deployment publishes, and the version of every module and integration it references."
                      class="shrink-0"
                    />
                  </div>
                </div>

                <div
                  data-open="true"
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 data-collapsible:overflow-hidden">
                    <div
                      data-open="true"
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
                    >
                      <Item
                        kind="outline"
                        size="small"
                        aria-live="polite"
                      >
                        <Item.Media>
                          <span
                            class="flex size-7 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface-raised)"
                          >
                            <i
                              class="pi pi-server text-body-xs text-(--text-default)"
                              aria-hidden="true"
                            />
                          </span>
                        </Item.Media>
                        <Item.Content>
                          <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                            <Item.Title>web-app</Item.Title>
                            <Tag
                              label="A77SA473"
                              severity="secondary"
                              size="small"
                              class="shrink-0"
                            />
                          </span>
                          <Item.Description>Building…</Item.Description>
                        </Item.Content>
                        <Item.Actions>
                          <span
                            class="font-(family-name:--font-code) text-label-sm tabular-nums text-(--text-muted)"
                          >
                            {{ elapsed }} s
                          </span>
                          <div class="contents text-(--text-default)">
                            <Spinner class="shrink-0" />
                          </div>
                        </Item.Actions>
                      </Item>
                    </div>
                  </div>
                </div>
              </section>

              <section
                data-stacked="true"
                inert
                data-pending="true"
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-pending:opacity-32 motion-reduce:transition-none"
              >
                <div
                  data-stacked="true"
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <h2
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Project</span>
                    </h2>
                    <Hint
                      text="The project whose domains serve the service. Create one to publish it on a new domain."
                      class="shrink-0"
                    />
                  </div>
                </div>

                <div
                  data-open="true"
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 data-collapsible:overflow-hidden">
                    <div
                      data-open="true"
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
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
                              kind="outline"
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
                                              class="pi pi-external-link ml-auto shrink-0 text-body-xs leading-none"
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
                                            kind="text"
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
                    </div>
                  </div>
                </div>
              </section>

              <section
                data-stacked="true"
                inert
                data-pending="true"
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-pending:opacity-32 motion-reduce:transition-none"
              >
                <div
                  data-stacked="true"
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <h2
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Environment</span>
                    </h2>
                    <Hint
                      text="Where the deployment goes live, from the environments this project serves. Each one publishes with the Deployment Settings set on the project."
                      class="shrink-0"
                    />
                  </div>
                </div>

                <div
                  data-open="true"
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 data-collapsible:overflow-hidden">
                    <div
                      data-open="true"
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
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
                          <FieldRadioBlock
                            v-model="environment"
                            name="service-deploy-environment"
                            :value="entry.name"
                            :label="entry.name"
                            :description="entry.description"
                          />
                          <div
                            v-if="entry.tag"
                            class="pointer-events-none absolute right-(--spacing-sm) top-(--spacing-sm)"
                          >
                            <Tag
                              :label="entry.tag"
                              severity="info"
                              size="small"
                            />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>

              <section
                data-stacked="true"
                inert
                data-pending="true"
                class="grid grid-cols-1 gap-x-[var(--layout-split-gap,3rem)] gap-y-(--spacing-md) [&:not(:first-of-type)]:mt-(--layout-section-gap) data-divided:[&:not(:first-of-type)]:border-t-(length:--border-width-default) data-divided:[&:not(:first-of-type)]:border-(--border-muted) data-divided:[&:not(:first-of-type)]:pt-(--layout-section-gap) md:not-data-stacked:grid-cols-[var(--layout-split-aside,20rem)_minmax(0,1fr)] transition-opacity duration-moderate-01 ease-productive-entrance data-pending:opacity-32 motion-reduce:transition-none"
              >
                <div
                  data-stacked="true"
                  class="flex min-w-0 flex-col gap-(--spacing-xxs) md:not-data-stacked:sticky md:not-data-stacked:top-(--spacing-lg) md:not-data-stacked:self-start"
                >
                  <div class="group/heading relative flex min-w-0 items-center gap-(--spacing-xxs)">
                    <h2
                      class="scroll-mt-(--spacing-xl) text-balance text-heading-xxs text-(--text-default)"
                    >
                      <span class="flex items-center gap-(--spacing-xs)">Projects Impacted</span>
                    </h2>
                    <Hint
                      text="This environment publishes with shared Deployment Settings, so the deployment reaches every project below, in every environment they are linked to, and the domains they serve."
                      class="shrink-0"
                    />
                  </div>
                </div>

                <div
                  data-open="true"
                  class="grid min-w-0 grid-rows-[0fr] transition-[grid-template-rows] duration-moderate-02 ease-expressive-entrance data-open:grid-rows-[1fr] motion-reduce:transition-none"
                >
                  <div class="min-w-0 data-collapsible:overflow-hidden">
                    <div
                      data-open="true"
                      class="flex min-w-0 -translate-y-1 flex-col gap-(--spacing-lg) opacity-0 transition-[opacity,translate] duration-moderate-02 ease-expressive-entrance data-open:translate-y-0 data-open:opacity-100 motion-reduce:transition-none"
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
                                kind="outline"
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
                                  <ul
                                    class="m-0 flex min-w-0 list-none flex-col gap-(--spacing-xxs) p-0"
                                  >
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
                                            <span class="sr-only">{{
                                              ' (opens in a new tab)'
                                            }}</span>
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
                                                class="pi pi-external-link ml-auto shrink-0 text-body-xs leading-none"
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
                                              kind="text"
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
                    </div>
                  </div>
                </div>
              </section>

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
                disabled
                type="submit"
              />
            </div>
          </PanelFooter>
        </form>
      </DrawerContent>
    </DrawerPortal>
  </Drawer>
</template>

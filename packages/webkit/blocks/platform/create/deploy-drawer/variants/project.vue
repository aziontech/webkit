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
  import Alert from '@aziontech/webkit/alert'
  import PanelContent from '@aziontech/webkit/panel-content'
  import PanelFooter from '@aziontech/webkit/panel-footer'
  import PanelHeader from '@aziontech/webkit/panel-header'
  import Popover from '@aziontech/webkit/popover'
  import SettingsSection from '@aziontech/webkit/settings-section'
  import Tag from '@aziontech/webkit/tag'
  import { computed, reactive, ref, watch } from 'vue'

  const resources = [
    {
      key: 'service',
      label: 'Service',
      name: 'project-01-web',
      icon: 'pi pi-server',
      note: '',
      total: 12,
      versions: [
        {
          id: 'AWPT11GA',
          name: 'AWPT11GA',
          author: 'Rafael Garbinatto',
          createdAgo: '21 hours ago',
          active: true
        },
        {
          id: 'AY3MQWWR',
          name: 'AY3MQWWR',
          author: 'Herbert Júlio',
          createdAgo: '2 days ago'
        },
        {
          id: 'AZHGGSD8',
          name: 'AZHGGSD8',
          author: 'Rafael Umman',
          createdAgo: '4 days ago'
        },
        {
          id: 'A1VA6NTP',
          name: 'A1VA6NTP',
          author: 'Marcus Grando',
          createdAgo: '4 days ago'
        },
        {
          id: 'A393WJA6',
          name: 'A393WJA6',
          author: 'Bruno Germano',
          createdAgo: '6 days ago'
        }
      ],
      owner: true,
      dependencies: [
        {
          key: 'service@AWPT11GA:module-image-optimizer',
          label: 'Module',
          name: 'image-optimizer',
          icon: 'pi pi-code',
          note: '',
          total: 6,
          versions: [
            {
              id: 'ATNSEE8Y',
              name: 'ATNSEE8Y',
              author: 'Rafael Garbinatto',
              createdAgo: '2 days ago'
            },
            {
              id: 'AV1M49PF',
              name: 'AV1M49PF',
              author: 'Herbert Júlio',
              createdAgo: '3 days ago'
            },
            {
              id: 'AWFFU55W',
              name: 'AWFFU55W',
              author: 'Rafael Umman',
              createdAgo: '4 days ago'
            },
            {
              id: 'AXT9K0MD',
              name: 'AXT9K0MD',
              author: 'Marcus Grando',
              createdAgo: '6 days ago'
            },
            {
              id: 'AZ739W2U',
              name: 'AZ739W2U',
              author: 'Bruno Germano',
              createdAgo: '6 days ago'
            }
          ]
        },
        {
          key: 'service@AWPT11GA:integration-search-index',
          label: 'Integration',
          name: 'search-index',
          icon: 'pi pi-link',
          note: '',
          total: 3,
          versions: [
            {
              id: 'AHMVCHSJ',
              name: 'AHMVCHSJ',
              author: 'Herbert Júlio',
              createdAgo: '2 days ago'
            },
            {
              id: 'AJ0P2D90',
              name: 'AJ0P2D90',
              author: 'Rafael Umman',
              createdAgo: '4 days ago'
            },
            {
              id: 'AKEIS8PH',
              name: 'AKEIS8PH',
              author: 'Marcus Grando',
              createdAgo: '4 days ago'
            }
          ]
        }
      ]
    },
    {
      key: 'storage',
      label: 'Storage',
      name: 'project-01-storage',
      icon: 'pi pi-database',
      note: 'Not versioned',
      total: 0,
      versions: [],
      owner: false,
      dependencies: []
    }
  ]

  const environmentChoices = [
    {
      name: 'Production',
      description: 'Live traffic. One version serves the domain, and deploying replaces it.',
      tag: 'Last used',
      setting: { name: 'shared-storefront', shared: true, projects: ['project-05', 'project-09'] }
    },
    {
      name: 'Preview',
      description:
        'Every other branch. Each version keeps its own URL, so a build can be read before it is live.',
      tag: '',
      setting: { name: 'project-01-preview', shared: false, projects: [] }
    }
  ]

  const open = ref(false)
  const picks = reactive({})
  const versionOpen = reactive({})
  const environment = ref('Production')

  const setting = computed(
    () => environmentChoices.find((entry) => entry.name === environment.value).setting
  )

  const sharedWith = computed(() => (setting.value.shared ? setting.value.projects : []))

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
              <p class="text-body-sm text-(--text-muted)">
                Publish project-01. Review what this release carries and where it lands.
              </p>
            </div>
            <DrawerClose />
          </PanelHeader>

          <PanelContent>
            <fieldset class="m-0 flex min-w-0 flex-col border-0 p-0">
              <legend class="sr-only">Deploy</legend>
              <SettingsSection
                title="Resources"
                hint="Everything this project serves, at the version this deployment publishes, with the version of every dependency they reference."
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
                          name="project-deploy-environment"
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

                <Alert
                  v-if="sharedWith.length"
                  severity="warning"
                  size="small"
                  :label="`Deploying with ${setting.name} also publishes to ${sharedWith.join(', ')}.`"
                />
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

<script setup lang="ts">
  import Avatar from '@aziontech/webkit/avatar'
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import DropdownMenu, { type DropdownMenuItemValue } from '@aziontech/webkit/dropdown-menu'
  import EmptyState from '@aziontech/webkit/empty-state'
  import IconButton from '@aziontech/webkit/icon-button'
  import Link from '@aziontech/webkit/link'
  import PageTabs from '@aziontech/webkit/page-tabs'
  import StatusIndicator, { type StatusIndicatorSeverity } from '@aziontech/webkit/status-indicator'
  import Subheader from '@aziontech/webkit/subheader'
  import Tabs from '@aziontech/webkit/tabs'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { useLocale } from '@aziontech/webkit/use-locale'
  import { computed, ref } from 'vue'

  import { sampleResource } from './resource-detail.sample'

  /** A tab of the resource page. */
  export type ResourceDetailTab = 'overview' | 'versions' | 'build' | 'deployments'

  /** The resource the page shows. */
  export interface ResourceDetailResource {
    /** Slug name, used in the tab routes and the CLI link command. */
    name: string
    /** The live address, without the scheme; Visit and both address links open it. */
    domain: string
    /** The deployment that serves the address, linked to its page. */
    deploymentId: string
    /** The environment of that deployment, shown as a tag. */
    environment: string
    /** The status label. */
    status: string
    /** The status color. */
    statusSeverity: StatusIndicatorSeverity
    /** When the resource was created, shown as a relative time. */
    createdAt: Date
    /** Who created it, shown with an avatar. */
    createdBy: string
    /** The framework preset label. */
    framework: string
    /** The framework icon class, a colored icon such as az-color az-nextjs. */
    frameworkIcon: string
  }

  export interface ResourceDetailProps {
    /** The resource the page shows. Left out, the sample renders. */
    resource?: ResourceDetailResource
  }

  const props = withDefaults(defineProps<ResourceDetailProps>(), {
    resource: undefined
  })

  const emit = defineEmits<{
    'resource-action': [
      event: globalThis.MouseEvent | globalThis.KeyboardEvent,
      value: DropdownMenuItemValue
    ]
    'connect-repository': [event: MouseEvent]
  }>()

  const activeTab = defineModel<ResourceDetailTab>('tab', { default: 'overview' })

  const resource = computed<ResourceDetailResource>(() => props.resource ?? sampleResource)
  const address = computed(() => `https://${resource.value.domain}`)

  const { formatRelativeTime } = useLocale()
  const created = computed(
    () => `${formatRelativeTime(resource.value.createdAt)} by ${resource.value.createdBy}`
  )

  const tabs: { value: ResourceDetailTab; label: string }[] = [
    { value: 'overview', label: 'Overview' },
    { value: 'versions', label: 'Versions' },
    { value: 'build', label: 'Build' },
    { value: 'deployments', label: 'Deployments' }
  ]

  const tabLabel = computed(() => tabs.find((tab) => tab.value === activeTab.value)?.label ?? '')

  const PATHS = [
    { label: 'CLI', value: 'cli' },
    { label: 'GitHub Actions', value: 'actions' }
  ]

  const cliSteps = computed(() => [
    {
      title: 'Install the CLI',
      description:
        'Install it globally. It builds with your framework preset and ships the build in one step.',
      tabs: [
        {
          label: 'npm',
          value: 'npm',
          language: 'bash',
          code: 'npm install -g platform-cli'
        },
        {
          label: 'yarn',
          value: 'yarn',
          language: 'bash',
          code: 'yarn global add platform-cli'
        },
        { label: 'pnpm', value: 'pnpm', language: 'bash', code: 'pnpm add -g platform-cli' },
        {
          label: 'brew',
          value: 'brew',
          language: 'bash',
          code: 'brew install platform-cli'
        }
      ]
    },
    {
      title: 'Link your project',
      description:
        'Authenticate, then link the local project to this resource so every deploy lands on it.',
      tabs: [
        {
          label: 'Link',
          value: 'link',
          language: 'bash',
          code: `platform login
platform link \\
  --name ${resource.value.name}`
        }
      ]
    },
    {
      title: 'Deploy and visit your site',
      description:
        'Build and ship. The CLI prints the domain when it finishes, and sync reconciles platform.json with what the console shows.',
      tabs: [
        {
          label: 'Deploy',
          value: 'deploy',
          language: 'bash',
          code: `platform deploy --auto --local
platform sync`
        }
      ]
    }
  ])

  const ACTIONS_STEPS = [
    {
      title: 'Store your personal token',
      description:
        'Create a personal token in Account settings and keep it as the repository secret the workflow authenticates with.',
      tabs: [
        {
          label: 'Secret',
          value: 'secret',
          language: 'bash',
          code: `gh secret set \\
  PLATFORM_TOKEN`
        }
      ]
    },
    {
      title: 'Add the deploy workflow',
      description:
        'One job that installs the CLI and deploys the build. Every push to the production branch runs it.',
      tabs: [
        {
          label: 'deploy.yml',
          value: 'workflow',
          fileName: '.github/workflows/deploy.yml',
          language: 'yaml',
          code: `on:
  push:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm install -g platform-cli
      - run: platform login --token \${{ secrets.PLATFORM_TOKEN }}
      - run: platform deploy --auto --local`
        }
      ]
    },
    {
      title: 'Push to deploy',
      description:
        'Every push to the production branch builds and ships. The deployment lands on the Overview tab as it runs.',
      tabs: [{ label: 'Push', value: 'push', language: 'bash', code: 'git push origin main' }]
    }
  ]

  const path = ref('cli')
  const steps = computed(() => (path.value === 'actions' ? ACTIONS_STEPS : cliSteps.value))
</script>

<template>
  <div class="flex min-h-0 flex-1 flex-col">
    <div class="sticky top-0 z-1 bg-(--bg-canvas)">
      <PageTabs v-model="activeTab">
        <Tabs.Trigger
          v-for="tab in tabs"
          :key="tab.value"
          :value="tab.value"
          :label="tab.label"
        />
      </PageTabs>
    </div>

    <div
      v-if="activeTab === 'overview'"
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <section class="min-h-0 flex-1">
        <div class="flex min-h-full flex-col">
          <div class="layout-column layout-boundary flex min-w-0 flex-col">
            <section
              class="layout-section-start flex min-w-0 flex-col gap-(--layout-section-gap) pb-(--layout-section-gap)"
            >
              <Card :padded="false">
                <template #default>
                  <div
                    class="@container/band flex min-h-(--size-14) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) px-(--spacing-md) py-(--spacing-xs)"
                  >
                    <div
                      class="flex min-w-0 flex-1 basis-(--container-2xs) items-center gap-(--spacing-xs)"
                    >
                      <i
                        class="az az-globe shrink-0 text-body-lg text-(--text-muted)"
                        aria-hidden="true"
                      />
                      <div class="flex min-w-0">
                        <Tooltip
                          :content="`Open ${resource.domain} in a new tab`"
                          class="w-full"
                        >
                          <a
                            :href="address"
                            target="_blank"
                            rel="noopener noreferrer"
                            data-link
                            class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                          >
                            <span class="truncate underline-offset-2 group-hover/link:underline">{{
                              resource.domain
                            }}</span>
                            <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                            <i
                              class="az az-external-link shrink-0 text-body-xs leading-none"
                              aria-hidden="true"
                            />
                          </a>
                        </Tooltip>
                      </div>
                    </div>

                    <div class="ms-auto flex shrink-0 items-center gap-(--spacing-xs)">
                      <Button
                        label="Visit"
                        :href="address"
                        target="_blank"
                        variant="secondary"
                        size="medium"
                        icon="az az-external-link"
                      />

                      <DropdownMenu
                        side="bottom"
                        align="end"
                        @select="(event, value) => emit('resource-action', event, value)"
                      >
                        <DropdownMenu.Trigger>
                          <Tooltip content="Resource actions">
                            <IconButton
                              icon="az az-ellipsis"
                              variant="outline"
                              size="medium"
                              aria-label="Resource actions"
                            />
                          </Tooltip>
                        </DropdownMenu.Trigger>

                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            value="copy-url"
                            label="Copy URL"
                          >
                            <template #leading>
                              <i
                                class="az az-copy"
                                aria-hidden="true"
                              />
                            </template>
                          </DropdownMenu.Item>
                        </DropdownMenu.Group>

                        <DropdownMenu.Group>
                          <DropdownMenu.Item
                            value="settings"
                            label="Settings"
                          >
                            <template #leading>
                              <i
                                class="az az-settings"
                                aria-hidden="true"
                              />
                            </template>
                          </DropdownMenu.Item>
                        </DropdownMenu.Group>
                      </DropdownMenu>
                    </div>
                  </div>

                  <div
                    class="@container/band border-t border-(--border-muted) px-(--spacing-md) py-(--spacing-md) grid grid-cols-2 gap-(--spacing-sm) sm:grid-cols-3 lg:grid-cols-6"
                  >
                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Deployment</span>
                      <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                        <div class="flex min-w-0">
                          <Tooltip
                            :content="`Open ${resource.deploymentId} in Deployments`"
                            class="w-full"
                          >
                            <Link
                              :label="resource.deploymentId"
                              :href="`/deployments/${resource.deploymentId}`"
                              size="small"
                            />
                          </Tooltip>
                        </div>
                        <Tag
                          :label="resource.environment"
                          severity="neutral"
                          size="small"
                          class="shrink-0"
                        />
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Domains</span>
                      <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                        <div class="flex min-w-0">
                          <Tooltip
                            :content="`Open ${resource.domain} in a new tab`"
                            class="w-full"
                          >
                            <a
                              :href="address"
                              target="_blank"
                              rel="noopener noreferrer"
                              data-link
                              class="group/link data-link:cursor-pointer inline-flex min-w-0 items-center gap-(--spacing-2xs) rounded-(--shape-button) text-body-sm text-(--text-default) no-underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas)"
                            >
                              <span
                                class="truncate underline-offset-2 group-hover/link:underline"
                                >{{ resource.domain }}</span
                              >
                              <span class="sr-only">{{ ' (opens in a new tab)' }}</span>
                              <i
                                class="az az-external-link shrink-0 text-body-xs leading-none"
                                aria-hidden="true"
                              />
                            </a>
                          </Tooltip>
                        </div>
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Status</span>
                      <div class="flex min-h-7 min-w-0 items-center">
                        <StatusIndicator
                          :severity="resource.statusSeverity"
                          :label="resource.status"
                        />
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Created</span>
                      <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                        <span class="truncate text-body-sm text-(--text-default)">
                          {{ created }}
                        </span>
                        <Avatar
                          :alt="resource.createdBy"
                          :label="resource.createdBy"
                          size="small"
                          variant="square"
                          class="shrink-0"
                        />
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Source</span>
                      <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-sm)">
                        <Button
                          variant="link"
                          label="Connect Git repository"
                          @click="(event: MouseEvent) => emit('connect-repository', event)"
                        />
                      </div>
                    </div>

                    <div class="flex min-w-0 flex-col gap-(--spacing-2xs) lg:col-span-2">
                      <span class="text-label-sm text-(--text-muted)">Framework</span>
                      <div class="flex min-h-7 min-w-0 items-center gap-(--spacing-xs)">
                        <i
                          :class="resource.frameworkIcon"
                          class="shrink-0 text-body-lg"
                          aria-hidden="true"
                        />
                        <span class="truncate text-body-sm text-(--text-default)">
                          {{ resource.framework }}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div
                    class="@container/band flex min-h-(--size-12) flex-wrap items-center gap-x-(--spacing-md) gap-y-(--spacing-xs) border-t border-(--border-muted) bg-(--bg-canvas) px-(--spacing-md) py-(--spacing-xs)"
                  >
                    <p
                      class="min-w-0 flex-1 basis-(--container-2xs) text-pretty text-body-sm text-(--text-muted)"
                    >
                      To deploy to Production, drop your project anywhere on this page, connect Git,
                      or run
                      <code
                        class="font-(family-name:--font-code) text-body-sm text-(--text-default)"
                        >platform deploy</code
                      >
                      via the CLI.
                    </p>

                    <div class="w-full shrink-0 @lg/band:ms-auto @lg/band:w-fit">
                      <Button
                        class="w-full"
                        label="Documentation"
                        variant="outline"
                        size="medium"
                        icon="az az-book"
                        href="https://example.com/docs/cli"
                        target="_blank"
                      />
                    </div>
                  </div>
                </template>
              </Card>

              <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
                <Subheader title="Get started">
                  <template #description>
                    Two ways to build and deploy this resource. Select one and follow the steps, or
                    read the
                    <a
                      href="https://example.com/docs/cli"
                      target="_blank"
                      rel="noopener noreferrer"
                      class="rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) underline hover:decoration-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                      >CLI docs</a
                    >.
                  </template>
                  <template #actions>
                    <ToggleGroup
                      v-model="path"
                      :options="PATHS"
                      size="large"
                      aria-label="Deploy with"
                    />
                  </template>
                </Subheader>

                <div class="grid min-w-0 gap-(--spacing-lg) @4xl:grid-cols-3">
                  <div
                    v-for="(step, index) in steps"
                    :key="step.title"
                    class="relative flex min-w-0"
                  >
                    <span
                      v-if="index > 0"
                      aria-hidden="true"
                      class="absolute end-full top-9 hidden w-(--spacing-lg) border-t border-dashed border-(--border-default) @4xl:block"
                    />
                    <div class="flex min-w-0 flex-1">
                      <Card
                        :padded="false"
                        class="w-full"
                      >
                        <template #default>
                          <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
                            <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                              <span
                                class="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--bg-surface-overlay) text-label-sm text-(--text-default)"
                              >
                                {{ index + 1 }}
                              </span>
                              <h3 class="min-w-0 text-heading-xs text-(--text-default)">
                                {{ step.title }}
                              </h3>
                            </div>
                            <p class="text-pretty text-body-sm text-(--text-muted)">
                              {{ step.description }}
                            </p>
                            <div class="mt-(--spacing-2xs) min-w-0">
                              <CodeBlock
                                :tabs="step.tabs"
                                :show-line-numbers="false"
                                :copy-aria-label="`Copy the commands for ${step.title}`"
                                class="w-full"
                              />
                            </div>
                          </div>
                        </template>
                      </Card>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
    <div
      v-else
      class="relative flex min-h-0 flex-1 flex-col"
    >
      <div class="layout-column layout-boundary flex min-w-0 flex-col">
        <div class="layout-section-start">
          <EmptyState
            size="medium"
            icon="az az-external-link"
            :title="tabLabel"
            :description="`${tabLabel} opens on its own page.`"
          >
            <template #actions>
              <Button
                :label="`Open ${tabLabel}`"
                variant="outline"
                size="small"
                :href="`/resources/${resource.name}/${activeTab}`"
              />
            </template>
          </EmptyState>
        </div>
      </div>
    </div>
  </div>
</template>

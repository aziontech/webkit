<script setup lang="ts">
  import Button from '@aziontech/webkit/button'
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import IntegrationCard, { type IntegrationCardBadge } from '@aziontech/webkit/integration-card'
  import Item from '@aziontech/webkit/item'
  import Link from '@aziontech/webkit/link'
  import Subheader from '@aziontech/webkit/subheader'
  import Tag from '@aziontech/webkit/tag'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import Tooltip from '@aziontech/webkit/tooltip'
  import { computed, ref } from 'vue'

  import { sampleDeployment, sampleNextSteps, sampleResources } from './sample'

  /** Whether the flow made the resource or attached one that already existed. */
  export type DeploySuccessResourceState = 'created' | 'bound'

  /** The Git source the service deploys from. */
  export interface DeploySuccessSource {
    /** The account or organization, shown as the scope tag in the lead. */
    scope: string
    /** Provider glyph class. */
    icon: string
    /** The repository as owner and name. */
    repository: string
    /** Where the repository opens, in a new tab. */
    href: string
    /** The production branch. */
    branch: string
  }

  /** The live service the deployment card shows. */
  export interface DeploySuccessDeployment {
    /** Service name, the card heading. */
    name: string
    /** When it was created, already formatted, such as Created just now. */
    created: string
    /** The domain it answers on, without the scheme. */
    domain: string
    /** The full address Visit site and the domain link open. */
    url: string
    /** Where Add custom domain leads. */
    addDomainHref: string
    /** The Git source; left out, the lead drops the scope tag and the repository row. */
    source?: DeploySuccessSource
  }

  /** One resource the flow created or bound. */
  export interface DeploySuccessResource {
    /** Stable key. */
    key: string
    /** Kind, such as Service or Storage. */
    kind: string
    /** Kind glyph class. */
    icon: string
    /** Display name. */
    name: string
    /** Created or bound. */
    state: DeploySuccessResourceState
    /** Its ID or its contents, shown after the kind. */
    reference: string
  }

  /** One next-step tile. */
  export interface DeploySuccessNextStep {
    /** Glyph class. */
    icon: string
    /** Title, verb first. */
    title: string
    /** One sentence. */
    description: string
    /** Where the tile leads; left out, the tile is a button that emits next-step. */
    href?: string
    /** Shows the Recommended badge. */
    recommended?: boolean
  }

  export interface DeploySuccessProps {
    /** The outcome heading. */
    title?: string
    /** The lead sentence; the scope tag follows it when the deployment has a Git source. */
    description?: string
    /** The live service; null leaves the card out when nothing serves the resource. Left out, the sample renders. */
    deployment?: DeploySuccessDeployment | null
    /** What the flow created or bound. Left out, the sample renders. */
    resources?: DeploySuccessResource[]
    /** The next-step tiles. Left out, the sample renders. */
    nextSteps?: DeploySuccessNextStep[]
    /** Resource name the Get started commands link; empty leaves the Get started section out. */
    getStarted?: string
  }

  const props = withDefaults(defineProps<DeploySuccessProps>(), {
    title: 'Resource deployed',
    description: 'You deployed a new resource.',
    deployment: undefined,
    resources: undefined,
    nextSteps: undefined,
    getStarted: ''
  })

  const emit = defineEmits<{
    /** A next-step tile without href was activated. */
    'next-step': [event: MouseEvent, step: DeploySuccessNextStep]
    /** Manage service was pressed. */
    manage: [event: MouseEvent]
  }>()

  const recommendedBadge: IntegrationCardBadge[] = [{ label: 'Recommended', variant: 'primary' }]

  const currentDeployment = computed(() =>
    props.deployment === undefined ? sampleDeployment : props.deployment
  )
  const source = computed(() => currentDeployment.value?.source)
  const lead = computed(() => (source.value ? `${props.description} Source:` : props.description))
  const currentResources = computed(() => props.resources ?? sampleResources)
  const currentNextSteps = computed(() => props.nextSteps ?? sampleNextSteps)

  const PATHS = [
    { label: 'CLI', value: 'cli' },
    { label: 'GitHub Actions', value: 'actions' }
  ]

  const cliSteps = (name: string) => [
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
  --name ${name}`
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
  ]

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
  const steps = computed(() =>
    path.value === 'actions' ? ACTIONS_STEPS : cliSteps(props.getStarted)
  )
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
    <div class="flex min-h-full flex-1 flex-col pb-(--layout-section-gap)">
      <div
        class="layout-column-form layout-boundary-inline flex min-w-0 flex-1 flex-col pt-(--layout-section-gap)"
      >
        <div class="layout-column-content my-auto flex flex-col gap-(--spacing-xl)">
          <header
            class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-2xs)"
          >
            <h1 class="text-balance text-heading-lg text-(--text-default)">{{ title }}</h1>
            <p
              class="flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)"
            >
              {{ lead }}
              <Tag
                v-if="source"
                :label="source.scope"
                severity="neutral"
                :icon="source.icon"
              />
            </p>
          </header>

          <div
            class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-lg) [--content-enter-delay:var(--transition-duration-fast-01)]"
          >
            <Card v-if="currentDeployment">
              <template #default>
                <div class="flex flex-col gap-(--spacing-md) sm:flex-row">
                  <div
                    aria-hidden="true"
                    class="relative flex aspect-16/10 w-full shrink-0 items-center justify-center overflow-hidden rounded-(--shape-control) border border-(--border-muted) bg-(--bg-canvas) sm:w-56"
                  >
                    <span
                      class="relative flex size-10 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface)"
                    >
                      <i
                        class="az az-globe text-body-md leading-none text-(--text-default)"
                        aria-hidden="true"
                      />
                    </span>
                  </div>

                  <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-md)">
                    <div class="flex flex-wrap items-start justify-between gap-(--spacing-sm)">
                      <div class="flex min-w-0 flex-col gap-(--spacing-2xs)">
                        <div class="flex min-w-0 flex-wrap items-center gap-(--spacing-xs)">
                          <h2 class="min-w-0 truncate text-heading-xs text-(--text-default)">
                            {{ currentDeployment.name }}
                          </h2>
                          <Tag
                            label="Live"
                            severity="success"
                            size="small"
                          />
                        </div>
                        <span class="text-body-sm text-(--text-muted)">{{
                          currentDeployment.created
                        }}</span>
                      </div>

                      <Button
                        label="Visit site"
                        variant="outline"
                        size="medium"
                        icon="az az-external-link"
                        icon-position="trailing"
                        :href="currentDeployment.url"
                        target="_blank"
                      />
                    </div>

                    <ul class="flex flex-col gap-(--spacing-xs)">
                      <li class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)">
                        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <i
                            class="az az-globe shrink-0 text-(--text-muted)"
                            aria-hidden="true"
                          />
                          <div class="min-w-0">
                            <Tooltip
                              :content="`Open ${currentDeployment.domain} in a new tab`"
                              class="w-full"
                            >
                              <Link
                                :label="currentDeployment.domain"
                                :href="currentDeployment.url"
                                target="_blank"
                                size="small"
                              />
                            </Tooltip>
                          </div>
                        </span>
                        <Button
                          label="Add custom domain"
                          variant="link"
                          size="small"
                          icon="az az-circle-plus"
                          :href="currentDeployment.addDomainHref"
                        />
                      </li>
                      <li
                        v-if="source"
                        class="flex min-h-7 min-w-0 flex-wrap items-center gap-x-(--spacing-md)"
                      >
                        <span class="flex min-w-0 items-center gap-(--spacing-xs)">
                          <i
                            :class="source.icon"
                            class="shrink-0 text-(--text-muted)"
                            aria-hidden="true"
                          />
                          <div class="min-w-0">
                            <Tooltip
                              :content="`Open ${source.repository} in a new tab`"
                              class="w-full"
                            >
                              <Link
                                :label="source.repository"
                                :href="source.href"
                                target="_blank"
                                size="small"
                              />
                            </Tooltip>
                          </div>
                        </span>
                        <span class="flex min-w-0 items-center gap-(--spacing-2xs)">
                          <i
                            class="az az-git-branch shrink-0 text-(--text-muted)"
                            aria-hidden="true"
                          />
                          <span class="truncate text-body-sm text-(--text-default)">{{
                            source.branch
                          }}</span>
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </template>
            </Card>

            <section class="flex flex-col gap-(--spacing-sm)">
              <h2 class="text-label-md text-(--text-default)">Resources</h2>
              <Card :padded="false">
                <template #default>
                  <Item.List>
                    <Item
                      v-for="resource in currentResources"
                      :key="resource.key"
                      size="small"
                    >
                      <Item.Media>
                        <span
                          class="flex size-8 items-center justify-center rounded-(--shape-control) border border-(--border-muted) bg-(--bg-surface)"
                        >
                          <i
                            :class="resource.icon"
                            class="text-body-sm leading-none text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                      </Item.Media>
                      <Item.Content>
                        <Item.Title>{{ resource.name }}</Item.Title>
                        <Item.Description>
                          {{ resource.kind }} · {{ resource.reference }}
                        </Item.Description>
                      </Item.Content>
                      <Item.Actions>
                        <Tag
                          :label="resource.state === 'bound' ? 'Bound' : 'Created'"
                          :severity="resource.state === 'bound' ? 'info' : 'success'"
                          size="small"
                        />
                      </Item.Actions>
                    </Item>
                  </Item.List>
                </template>
              </Card>
            </section>

            <section class="flex flex-col gap-(--spacing-sm)">
              <h2 class="text-label-md text-(--text-default)">Next steps</h2>
              <div class="grid grid-cols-1 gap-(--spacing-sm) sm:grid-cols-3">
                <IntegrationCard
                  v-for="step in currentNextSteps"
                  :key="step.title"
                  :title="step.title"
                  :logo="step.icon"
                  :description="step.description"
                  :href="step.href ?? ''"
                  :badges="step.recommended ? recommendedBadge : []"
                  @select="(event: MouseEvent) => emit('next-step', event, step)"
                />
              </div>
            </section>

            <div
              v-if="getStarted"
              class="@container flex min-w-0 flex-col gap-(--spacing-md)"
            >
              <Subheader title="Get started">
                <template #description>
                  Two ways to build and deploy this resource. Select one and follow the steps, or
                  read the
                  <Link
                    href="https://example.com/docs/cli"
                    target="_blank"
                    inline
                    >CLI docs</Link
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

            <Button
              class="w-full"
              label="Manage service"
              variant="secondary"
              size="large"
              @click="(event: MouseEvent) => emit('manage', event)"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

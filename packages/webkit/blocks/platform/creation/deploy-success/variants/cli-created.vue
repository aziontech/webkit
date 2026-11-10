<script setup>
  import Button from '@aziontech/webkit/button'
  import CardBox from '@aziontech/webkit/card-box'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Item from '@aziontech/webkit/item'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import Tag from '@aziontech/webkit/tag'
  import { computed, ref } from 'vue'

  const resources = [
    {
      key: 'resource',
      kind: 'Resource',
      icon: 'pi pi-box',
      name: 'analytics-app',
      state: 'created',
      reference: '1650382274'
    }
  ]

  const nextSteps = [
    {
      icon: 'pi pi-cloud-upload',
      title: 'Deploy this resource',
      description:
        'Provision a service for it and deploy, without leaving this flow. The platform names the domain, and you can change it after.',
      action: true,
      recommended: true
    },
    {
      icon: 'pi pi-server',
      title: 'Deploy using a new service',
      description:
        'Name the service, put a policy in front of it, and compose the release yourself.',
      href: '/services/new?resource=analytics-app'
    }
  ]

  const PATHS = [
    { label: 'CLI', value: 'cli' },
    { label: 'GitHub Actions', value: 'actions' }
  ]

  const CLI_STEPS = [
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
  --name analytics-app`
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
        'Create a personal token in Account Settings and keep it as the repository secret the workflow authenticates with.',
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
  const steps = computed(() => (path.value === 'actions' ? ACTIONS_STEPS : CLI_STEPS))
</script>

<template>
  <div class="flex min-h-dvh flex-col bg-(--bg-canvas)">
    <div class="flex min-h-full flex-1 flex-col pb-(--layout-section-gap)">
      <div
        class="layout-column-form layout-boundary-inline flex min-w-0 flex-1 flex-col pt-(--layout-section-gap)"
      >
        <div class="layout-column-content my-auto flex flex-col gap-(--spacing-xl)">
          <header
            class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-xxs)"
          >
            <h1 class="text-balance text-heading-lg text-(--text-default)">Resource created</h1>
            <p
              class="flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)"
            >
              The resource is ready. Nothing serves it yet. Deploy it from Next steps.
            </p>
          </header>

          <div
            class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-lg) [--content-enter-delay:var(--transition-duration-fast-01)]"
          >
            <section class="flex flex-col gap-(--spacing-sm)">
              <h2 class="text-label-md text-(--text-default)">Resources created</h2>
              <CardBox :padded="false">
                <template #content>
                  <Item.List>
                    <Item
                      v-for="resource in resources"
                      :key="resource.key"
                      size="small"
                    >
                      <Item.Media>
                        <span
                          class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
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
              </CardBox>
            </section>

            <section class="flex flex-col gap-(--spacing-sm)">
              <h2 class="text-label-md text-(--text-default)">Next steps</h2>
              <div class="grid grid-cols-1 gap-(--spacing-sm) sm:grid-cols-3">
                <CardBox
                  v-for="step in nextSteps"
                  :key="step.title"
                  :padded="false"
                >
                  <template #content>
                    <component
                      :is="step.action ? 'button' : 'a'"
                      :type="step.action ? 'button' : undefined"
                      :href="step.href || undefined"
                      :target="step.external ? '_blank' : undefined"
                      :rel="step.external ? 'noopener noreferrer' : undefined"
                      class="group/step relative flex h-full w-full cursor-pointer flex-col gap-(--spacing-sm) rounded-(--shape-card) border-0 bg-transparent p-(--spacing-md) text-left text-inherit no-underline before:pointer-events-none before:absolute before:inset-0 before:rounded-[inherit] before:bg-(--bg-hover) before:opacity-0 before:content-[''] before:transition-opacity before:duration-fast-02 before:ease-productive-entrance hover:before:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-1 focus-visible:ring-offset-(--bg-canvas) motion-reduce:before:transition-none"
                    >
                      <span class="relative flex items-center justify-between gap-(--spacing-xs)">
                        <span
                          class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)"
                        >
                          <i
                            :class="step.icon"
                            class="text-body-sm leading-none text-(--text-default)"
                            aria-hidden="true"
                          />
                        </span>
                        <i
                          :class="step.external ? 'pi pi-external-link' : 'pi pi-chevron-right'"
                          class="text-body-xs leading-none text-(--text-muted)"
                          aria-hidden="true"
                        />
                      </span>
                      <span class="relative flex flex-col gap-(--spacing-xxs)">
                        <span class="flex flex-wrap items-center gap-(--spacing-xs)">
                          <span class="text-label-md text-(--text-default)">{{ step.title }}</span>
                          <Tag
                            v-if="step.recommended"
                            label="Recommended"
                            severity="primary"
                            size="small"
                          />
                        </span>
                        <span class="text-pretty text-body-sm text-(--text-muted)">{{
                          step.description
                        }}</span>
                      </span>
                    </component>
                  </template>
                </CardBox>
              </div>
            </section>

            <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
              <header class="group/heading flex flex-col">
                <div
                  class="flex flex-wrap items-start justify-between gap-(--spacing-md) px-(--spacing-xs)"
                >
                  <div class="flex min-w-0 grow flex-col gap-(--spacing-xxs)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xxs)">
                      <h2
                        class="scroll-mt-(--spacing-xl) text-balance text-heading-xs text-(--text-default)"
                      >
                        Get started
                      </h2>
                    </div>
                    <p class="text-pretty text-body-sm text-(--text-muted)">
                      Two ways to build and deploy this resource. Pick one and follow the steps, or
                      read the
                      <a
                        href="https://example.com/docs/cli"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                        >CLI docs</a
                      >.
                    </p>
                  </div>
                  <div
                    class="flex w-full shrink-0 flex-wrap items-center gap-(--spacing-xs) md:w-auto md:max-w-full"
                  >
                    <SegmentedButton
                      v-model="path"
                      :options="PATHS"
                      size="large"
                      aria-label="Deploy with"
                    />
                  </div>
                </div>
              </header>

              <div class="grid min-w-0 gap-(--spacing-lg) @4xl:grid-cols-3">
                <div
                  v-for="(step, index) in steps"
                  :key="step.title"
                  class="relative flex min-w-0"
                >
                  <span
                    v-if="index > 0"
                    aria-hidden="true"
                    class="absolute right-full top-9 hidden w-(--spacing-lg) border-t border-dashed border-(--border-default) @4xl:block"
                  />
                  <div class="flex min-w-0 flex-1">
                    <CardBox
                      :padded="false"
                      class="w-full"
                    >
                      <template #content>
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
                          <div class="mt-(--spacing-xxs) min-w-0">
                            <CodeBlock
                              :tabs="step.tabs"
                              :show-line-numbers="false"
                              :copy-aria-label="`Copy the commands for ${step.title}`"
                              class="w-full"
                            />
                          </div>
                        </div>
                      </template>
                    </CardBox>
                  </div>
                </div>
              </div>
            </div>

            <Button
              class="w-full"
              label="Manage"
              kind="secondary"
              size="large"
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

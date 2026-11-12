<script setup lang="ts">
  import Card from '@aziontech/webkit/card'
  import CodeBlock from '@aziontech/webkit/code-block'
  import SectionHeader from '@aziontech/webkit/section-header'
  import ToggleGroup from '@aziontech/webkit/toggle-group'
  import { computed, ref } from 'vue'

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
  const steps = computed(() => (path.value === 'actions' ? ACTIONS_STEPS : CLI_STEPS))
</script>

<template>
  <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
    <SectionHeader title="Get started">
      <template #description>
        Two ways to build and deploy this resource. Select one and follow the steps, or read the
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
    </SectionHeader>

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
            <template #content>
              <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
                <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                  <span
                    class="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--bg-surface-overlay) text-label-sm text-(--text-default)"
                  >
                    {{ index + 1 }}
                  </span>
                  <h3 class="min-w-0 text-heading-xs text-(--text-default)">{{ step.title }}</h3>
                </div>
                <p class="text-pretty text-body-sm text-(--text-muted)">{{ step.description }}</p>
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
          </Card>
        </div>
      </div>
    </div>
  </div>
</template>

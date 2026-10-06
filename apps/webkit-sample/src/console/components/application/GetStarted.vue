<script setup lang="ts">
  import CardBox from '@aziontech/webkit/card-box'
  import CodeBlock from '@aziontech/webkit/code-block'
  import SegmentedButton from '@aziontech/webkit/segmented-button'
  import { computed, ref } from 'vue'

  import SectionHeading from '../page/SectionHeading.vue'

  interface Props {
    name?: string
    repository?: string
    documentationHref?: string
  }

  const props = withDefaults(defineProps<Props>(), {
    name: '',
    repository: '',
    documentationHref: 'https://www.azion.com/en/documentation/products/azion-cli/overview/'
  })

  const PATHS = [
    { label: 'Azion CLI', value: 'cli' },
    { label: 'GitHub Actions', value: 'actions' }
  ]

  const path = ref(props.repository ? 'actions' : 'cli')

  const linkCommand = props.name ? `azion link \\\n  --name ${props.name}` : 'azion link'
  const productionBranch = 'main'

  const INSTALL_STEP = {
    title: 'Install the Azion CLI',
    description:
      'Install it globally. It builds with your framework preset and ships straight to the edge.',
    tabs: [
      { label: 'npm', value: 'npm', language: 'bash', code: 'npm install -g azion' },
      { label: 'yarn', value: 'yarn', language: 'bash', code: 'yarn global add azion' },
      { label: 'pnpm', value: 'pnpm', language: 'bash', code: 'pnpm add -g azion' },
      { label: 'brew', value: 'brew', language: 'bash', code: 'brew install azion' }
    ]
  }

  const CLI_STEPS = [
    INSTALL_STEP,
    {
      title: 'Link your project',
      description:
        'Authenticate, then link the local project to this application so every deploy lands on it.',
      tabs: [
        {
          label: 'Link',
          value: 'link',
          language: 'bash',
          code: ['azion login', linkCommand].join('\n')
        }
      ]
    },
    {
      title: 'Deploy and visit your site',
      description:
        'Build and ship. The CLI prints the domain when it finishes, and sync reconciles azion.json with what Console shows.',
      tabs: [
        {
          label: 'Deploy',
          value: 'deploy',
          language: 'bash',
          code: ['azion deploy --auto --local', 'azion sync'].join('\n')
        }
      ]
    }
  ]

  const WORKFLOW = [
    'on:',
    '  push:',
    `    branches: [${productionBranch}]`,
    '',
    'jobs:',
    '  deploy:',
    '    runs-on: ubuntu-latest',
    '    steps:',
    '      - uses: actions/checkout@v4',
    '      - run: npm install -g azion',
    '      - run: azion login --token ${{ secrets.AZION_PERSONAL_TOKEN }}',
    '      - run: azion deploy --auto --local'
  ].join('\n')

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
          code: ['gh secret set \\', '  AZION_PERSONAL_TOKEN'].join('\n')
        }
      ]
    },
    {
      title: 'Add the deploy workflow',
      description:
        'One job that installs the CLI and deploys the build. Every push to the production branch runs it.',
      tabs: [
        {
          label: 'azion-deploy.yml',
          value: 'workflow',
          fileName: '.github/workflows/azion-deploy.yml',
          language: 'yaml',
          code: WORKFLOW
        }
      ]
    },
    {
      title: 'Push to deploy',
      description:
        'Every push to the production branch builds and ships. The deployment lands on the Overview tab as it runs.',
      tabs: [
        {
          label: 'Push',
          value: 'push',
          language: 'bash',
          code: `git push origin ${productionBranch}`
        }
      ]
    }
  ]

  const steps = computed(() => (path.value === 'actions' ? ACTIONS_STEPS : CLI_STEPS))
</script>

<template>
  <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
    <SectionHeading title="Get started">
      <template #description>
        Two ways to build and deploy this application. Pick one and follow the steps, or read the
        <a
          :href="documentationHref"
          target="_blank"
          rel="noopener noreferrer"
          class="rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
          >Azion CLI docs</a
        >.
      </template>
      <template #actions>
        <SegmentedButton
          v-model="path"
          :options="PATHS"
          size="large"
          aria-label="Deploy with"
        />
      </template>
    </SectionHeading>

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
        <CardBox
          :padded="false"
          class="min-w-0 flex-1"
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
              <CodeBlock
                :tabs="step.tabs"
                :show-line-numbers="false"
                :copy-aria-label="`Copy the commands for ${step.title}`"
                class="mt-(--spacing-xxs) min-w-0"
              />
            </div>
          </template>
        </CardBox>
      </div>
    </div>
  </div>
</template>

<script setup>
  // HOW YOU PUT CODE IN THIS APPLICATION — the first thing the Build tab shows.
  //
  // Azion has no "build settings" resource: an application is built and shipped either
  // from the reader's own terminal (the Azion CLI) or from a workflow in the repository
  // that runs the same CLI. So this tab opens by TEACHING those two paths instead of by
  // presenting a form for a build service we do not have.
  //
  // THREE NUMBERED STEPS, side by side, each with the command it names — the shape a
  // reader already knows from every platform's "Get started". The path selector sits on
  // the heading row and swaps all three: one screen answers both scenarios instead of
  // two screens each answering half.
  //
  // It is mounted TWICE, deliberately: on the create's success screen (the handoff, at
  // the moment the application is made) and here, permanently. Once is not enough — a
  // reader who reloads has lost the success screen and still has the same question.
  import CardBox from '@aziontech/webkit/card-box'
  import CodeBlock from '@aziontech/webkit/code-block'
  import Select from '@aziontech/webkit/select'
  import { computed, ref } from 'vue'

  import SectionHeading from '../page/SectionHeading.vue'

  const props = defineProps({
    /** The application the commands link against, named in the `azion link` step. */
    name: { type: String, default: '' },
    /** The connected repository, when there is one. It decides which path opens first. */
    repository: { type: String, default: '' },
    /** Where the Documentation link on the heading goes. */
    documentationHref: {
      type: String,
      default: 'https://www.azion.com/en/documentation/products/azion-cli/overview/'
    }
  })

  const PATHS = [
    { label: 'Azion CLI', value: 'cli' },
    { label: 'GitHub Actions', value: 'actions' }
  ]

  // A repository-backed application ships from its workflow, so that path opens; one
  // without a repository has only the terminal.
  const path = ref(props.repository ? 'actions' : 'cli')
  const pathLabel = (value) => PATHS.find((option) => option.value === value)?.label ?? ''

  // Broken over two lines so the application's name is readable inside a step card
  // rather than scrolling out of it.
  const linkCommand = props.name ? `azion link \\\n  --name ${props.name}` : 'azion link'
  const productionBranch = 'main'

  // The CLI path's first step. The workflow path installs the CLI inside the job, so it
  // does not ask the reader to install anything locally.
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

  // The workflow YAML is assembled line by line because `${{ secrets.… }}` cannot appear
  // in a template literal — JavaScript reads it as an interpolation and fails to parse.
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
  <!-- A CONTAINER QUERY, not a viewport one: this block is mounted at two very different
       widths — the create's success column and the Build tab's form measure — and the
       viewport is the same in both. Below three columns' worth of CARD width the steps
       stack, so a command keeps the full width instead of scrolling inside a 300px box. -->
  <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
    <SectionHeading
      title="Get started"
      description="Two ways to build and deploy this application. Pick one and follow the steps."
      :documentation="documentationHref"
    >
      <template #actions>
        <Select
          v-model="path"
          size="large"
          class="w-full md:w-(--container-3xs)"
          :display-value="pathLabel"
        >
          <Select.Trigger aria-label="Deploy with" />
          <Select.Content>
            <Select.Option
              v-for="option in PATHS"
              :key="option.value"
              :value="option.value"
            >
              {{ option.label }}
            </Select.Option>
          </Select.Content>
        </Select>
      </template>
    </SectionHeading>

    <div class="grid min-w-0 gap-(--spacing-lg) @4xl:grid-cols-3">
      <div
        v-for="(step, index) in steps"
        :key="step.title"
        class="relative flex min-w-0"
      >
        <!-- The seam between two cards, drawn only where they sit side by side. It spans
             exactly the grid gap, at the height of the number it joins. -->
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

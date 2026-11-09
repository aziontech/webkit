import Button from '@aziontech/webkit/button'
import CardBox from '@aziontech/webkit/card-box'
import CodeBlock from '@aziontech/webkit/code-block'
import CopyButton from '@aziontech/webkit/copy-button'
import Item from '@aziontech/webkit/item'
import SegmentedButton from '@aziontech/webkit/segmented-button'
import Tag from '@aziontech/webkit/tag'
import { computed, ref } from 'vue'

import { toSfc } from '../../_shared/story-source'

const quoted = (text) => `'${text.replaceAll("'", "\\'")}'`

const multiline = (text) =>
  `\`${text.replace(/\\/g, '\\\\').replace(/`/g, '\\`').replace(/\$\{/g, '\\${')}\``

const literal = (value, depth = 1) => {
  const pad = '  '.repeat(depth)
  const close = '  '.repeat(depth - 1)
  if (Array.isArray(value)) {
    return `[\n${value.map((entry) => `${pad}${literal(entry, depth + 1)}`).join(',\n')}\n${close}]`
  }
  if (typeof value === 'object') {
    const entries = Object.entries(value).map(
      ([key, entry]) => `${key}: ${literal(entry, depth + 1)}`
    )
    const inline = `{ ${entries.join(', ')} }`
    return inline.length <= 96 && !inline.includes('\n')
      ? inline
      : `{\n${entries.map((entry) => `${pad}${entry}`).join(',\n')}\n${close}}`
  }
  if (typeof value === 'string') return value.includes('\n') ? multiline(value) : quoted(value)
  return String(value)
}

const declare = (name, value) => `const ${name} = ${literal(value)}`

const DOMAIN = 'my-storefront.map.azionedge.net'
const DOCUMENTATION = 'https://www.azion.com/en/documentation/'
const CLI_DOCUMENTATION = 'https://www.azion.com/en/documentation/products/azion-cli/overview/'

const RESOURCES = [
  { kind: 'Workload', icon: 'ai ai-workloads', name: 'my-storefront', reference: '7f3a1c92' },
  {
    kind: 'Application',
    icon: 'ai ai-edge-application',
    name: 'my-storefront',
    reference: '1848274'
  },
  { kind: 'Connector', icon: 'ai ai-edge-connectors', name: 'my-storefront', reference: '2201937' },
  {
    kind: 'Cache Settings',
    icon: 'ai ai-tiered-cache',
    name: 'my-storefront',
    reference: '915502'
  },
  {
    kind: 'Rules Engine rule',
    icon: 'pi pi-sliders-h',
    name: 'Serve from my-storefront',
    reference: '1848274'
  }
]

const NEXT_STEPS = [
  {
    icon: 'pi pi-globe',
    title: 'Customize domain',
    description: 'Associate a custom domain and subdomains to Azion to handle user access.',
    href: DOCUMENTATION
  },
  {
    icon: 'pi pi-sitemap',
    title: 'Point traffic',
    description:
      'Redirect the traffic of a domain to Azion and take advantage of the distributed network.',
    href: DOCUMENTATION
  },
  {
    icon: 'pi pi-chart-line',
    title: 'View analytics',
    description: 'Gain powerful insights into your performance, availability, and security.',
    href: DOCUMENTATION
  }
]

const PATHS = [
  { label: 'Azion CLI', value: 'cli' },
  { label: 'GitHub Actions', value: 'actions' }
]

const CLI_STEPS = [
  {
    title: 'Install the Azion CLI',
    description:
      'Install it globally. It builds with your framework preset and ships straight to the edge.',
    tabs: [
      { label: 'npm', value: 'npm', language: 'bash', code: 'npm install -g azion' },
      { label: 'yarn', value: 'yarn', language: 'bash', code: 'yarn global add azion' },
      { label: 'pnpm', value: 'pnpm', language: 'bash', code: 'pnpm add -g azion' },
      { label: 'brew', value: 'brew', language: 'bash', code: 'brew install azion' }
    ]
  },
  {
    title: 'Link your project',
    description:
      'Authenticate, then link the local project to this application so every deploy lands on it.',
    tabs: [
      {
        label: 'Link',
        value: 'link',
        language: 'bash',
        code: ['azion login', 'azion link \\', '  --name my-storefront'].join('\n')
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
  '    branches: [main]',
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
    tabs: [{ label: 'Push', value: 'push', language: 'bash', code: 'git push origin main' }]
  }
]

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CardBox from '@aziontech/webkit/card-box'",
  "import CodeBlock from '@aziontech/webkit/code-block'",
  "import CopyButton from '@aziontech/webkit/copy-button'",
  "import Item from '@aziontech/webkit/item'",
  "import SegmentedButton from '@aziontech/webkit/segmented-button'",
  "import Tag from '@aziontech/webkit/tag'",
  "import { computed, ref } from 'vue'",
  '',
  declare('resources', RESOURCES),
  declare('nextSteps', NEXT_STEPS),
  declare('paths', PATHS),
  declare('cliSteps', CLI_STEPS),
  declare('actionsSteps', ACTIONS_STEPS),
  '',
  "const path = ref('cli')",
  "const steps = computed(() => (path.value === 'actions' ? actionsSteps : cliSteps))"
]

const components = {
  Button,
  CardBox,
  CodeBlock,
  CopyButton,
  Item,
  'Item.List': Item.List,
  'Item.Media': Item.Media,
  'Item.Content': Item.Content,
  'Item.Title': Item.Title,
  'Item.Description': Item.Description,
  'Item.Actions': Item.Actions,
  SegmentedButton,
  Tag
}

const TEMPLATE = `<div class="min-h-dvh bg-(--bg-canvas)">
  <main class="layout-form-create layout-boundary-inline py-(--layout-section-gap)">
    <div class="flex w-full flex-col gap-(--spacing-xl)">
      <header class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-xxs)">
        <h1 class="text-balance text-heading-lg text-(--text-default)">Application deployed</h1>
        <p class="flex flex-wrap items-center gap-(--spacing-xs) text-body-sm text-(--text-muted)">
          You deployed a new application into
          <Tag label="aziontech" severity="secondary" icon="pi pi-github" />
        </p>
      </header>

      <div class="animate-content-enter motion-reduce:animate-none flex w-full flex-col gap-(--spacing-lg) [--content-enter-delay:var(--transition-duration-fast-01)]">
        <CardBox>
          <template #content>
            <div class="flex flex-wrap items-center gap-(--spacing-sm)">
              <span class="flex size-8 shrink-0 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)">
                <i class="pi pi-globe leading-none text-(--text-default)" aria-hidden="true" />
              </span>
              <div class="flex min-w-0 flex-1 flex-col gap-(--spacing-xxs)">
                <span class="text-label-sm text-(--text-muted)">Domain</span>
                <a
                  href="https://${DOMAIN}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="w-fit max-w-full break-all text-label-md text-(--text-default) no-underline hover:underline"
                >
                  ${DOMAIN}
                </a>
              </div>
              <div class="ml-auto flex shrink-0 items-center gap-(--spacing-xs)">
                <CopyButton kind="outlined" size="medium" value="${DOMAIN}" aria-label="Copy domain" />
                <Button label="Visit" kind="outlined" size="medium" href="https://${DOMAIN}" target="_blank" />
              </div>
            </div>
          </template>
        </CardBox>

        <CardBox title="Resources created" :padded="false">
          <template #content>
            <Item.List>
              <Item v-for="resource in resources" :key="resource.kind + resource.reference" size="small">
                <Item.Media>
                  <span class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)">
                    <i :class="resource.icon" class="leading-none text-(--text-default)" aria-hidden="true" />
                  </span>
                </Item.Media>
                <Item.Content>
                  <Item.Title>{{ resource.name }}</Item.Title>
                  <Item.Description>{{ resource.kind }} · {{ resource.reference }}</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <Tag label="Created" severity="success" size="small" />
                </Item.Actions>
              </Item>
            </Item.List>
          </template>
        </CardBox>

        <CardBox title="Next steps" :padded="false">
          <template #content>
            <Item.List>
              <Item v-for="step in nextSteps" :key="step.title" as-child size="small">
                <a :href="step.href" target="_blank" rel="noopener" class="text-left no-underline">
                  <Item.Media>
                    <span class="flex size-8 items-center justify-center rounded-(--shape-elements) border border-(--border-muted) bg-(--bg-surface)">
                      <i :class="step.icon" class="leading-none text-(--text-default)" aria-hidden="true" />
                    </span>
                  </Item.Media>
                  <Item.Content>
                    <Item.Title>{{ step.title }}</Item.Title>
                    <Item.Description>{{ step.description }}</Item.Description>
                  </Item.Content>
                  <Item.Actions>
                    <i class="pi pi-chevron-right text-(--text-muted)" aria-hidden="true" />
                  </Item.Actions>
                </a>
              </Item>
            </Item.List>
          </template>
        </CardBox>

        <div class="@container flex min-w-0 flex-col gap-(--spacing-md)">
          <header class="flex flex-col gap-(--spacing-md) px-(--spacing-xs) md:flex-row md:items-start md:justify-between">
            <div class="flex min-w-0 flex-col gap-(--spacing-xxs)">
              <h2 class="text-balance text-heading-xs text-(--text-default)">Get started</h2>
              <p class="text-pretty text-body-sm text-(--text-muted)">
                Two ways to build and deploy this application. Pick one and follow the steps, or read the
                <a
                  href="${CLI_DOCUMENTATION}"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="rounded-(--shape-button) text-(--text-link) underline-offset-2 transition-colors duration-fast-02 ease-productive-entrance hover:text-(--text-link-hover) hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-(--ring-color) focus-visible:ring-offset-2 focus-visible:ring-offset-(--bg-canvas) motion-reduce:transition-none"
                >Azion CLI docs</a>.
              </p>
            </div>
            <div class="flex w-full flex-wrap items-center gap-(--spacing-xs) md:w-auto md:shrink-0 md:flex-nowrap">
              <SegmentedButton v-model="path" :options="paths" size="large" aria-label="Deploy with" />
            </div>
          </header>

          <div class="grid min-w-0 gap-(--spacing-lg) @4xl:grid-cols-3">
            <div v-for="(step, index) in steps" :key="step.title" class="relative grid min-w-0">
              <span
                v-if="index > 0"
                aria-hidden="true"
                class="absolute right-full top-9 hidden w-(--spacing-lg) border-t border-dashed border-(--border-default) @4xl:block"
              />
              <CardBox :padded="false">
                <template #content>
                  <div class="flex min-w-0 flex-col gap-(--spacing-sm) p-(--spacing-lg)">
                    <div class="flex min-w-0 items-center gap-(--spacing-xs)">
                      <span class="flex size-6 shrink-0 items-center justify-center rounded-full bg-(--bg-surface-overlay) text-label-sm text-(--text-default)">
                        {{ index + 1 }}
                      </span>
                      <h3 class="min-w-0 text-heading-xs text-(--text-default)">{{ step.title }}</h3>
                    </div>
                    <p class="text-pretty text-body-sm text-(--text-muted)">{{ step.description }}</p>
                    <CodeBlock :tabs="step.tabs" :show-line-numbers="false" :copy-aria-label="'Copy the commands for ' + step.title" />
                  </div>
                </template>
              </CardBox>
            </div>
          </div>
        </div>

        <Button label="Manage" kind="secondary" size="large" class="w-full" />
      </div>
    </div>
  </main>
</div>`

const meta = {
  title: 'Templates/Platform/Creation/DeploySuccess',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'The screen the application wizard ends on once the first deployment is live: a heading with the Git scope as a Tag, the domain card with a copy control and a Visit button, the list of every resource the flow created, three next-step rows, the Get started band that walks the CLI or GitHub Actions path in three CodeBlock cards, and the Manage button. Create Application, Create Workload and Deploy Template all finish here. Built from `CardBox`, `Tag`, `CopyButton`, `Item`, `SegmentedButton`, `CodeBlock` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => {
      const path = ref('cli')
      const steps = computed(() => (path.value === 'actions' ? ACTIONS_STEPS : CLI_STEPS))
      return { resources: RESOURCES, nextSteps: NEXT_STEPS, paths: PATHS, path, steps }
    },
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'A CLI-built application just deployed: five created resources, the default next steps, and the Get started band switching between the Azion CLI and GitHub Actions walkthroughs.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

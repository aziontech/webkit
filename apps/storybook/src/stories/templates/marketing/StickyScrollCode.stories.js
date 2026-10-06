import Button from '@aziontech/webkit/button'
import CodeBlock from '@aziontech/webkit/code-block'
import FrameBox from '@aziontech/webkit/frame-box'
import SectionContainer from '@aziontech/webkit/section-container'
import SectionGap from '@aziontech/webkit/section-gap'
import SectionModule from '@aziontech/webkit/section-module'
import SectionTitle from '@aziontech/webkit/section-title'
import StickyStack from '@aziontech/webkit/sticky-stack'
import TextureMaterial from '@aziontech/webkit/texture-material'

import { COLUMN_IMPORTS, declareTabs, inColumn } from '../../_shared/markup'
import { toSfc } from '../../_shared/story-source'

const components = {
  Button,
  CodeBlock,
  FrameBox,
  SectionContainer,
  SectionGap,
  SectionModule,
  SectionTitle,
  StickyStack,
  TextureMaterial
}

const DOCS_HREF = 'https://www.azion.com/en/documentation/devtools/'

const CAPABILITIES = [
  {
    title: 'Automated deployment via Git or CLI',
    description:
      'Run one command from the project you already have, or connect the repository and let every push to the branch ship itself.'
  },
  {
    title: 'Compatibility with modern web frameworks',
    description:
      'Next, Nuxt, Astro, Svelte and twenty more build through a preset the CLI detects, so the config file stays this short.'
  },
  {
    title: 'APIs for automation and integration',
    description:
      'Everything the console does is a call you can make yourself, so a workload can be created by the pipeline that needed it.'
  },
  {
    title: 'Infrastructure as code with Terraform',
    description:
      'Declare workloads, applications and domains in the provider and apply them under the same review as the rest of your estate.'
  },
  {
    title: 'Metrics and events via GraphQL API',
    description:
      'Query the same numbers the console charts, from one endpoint, so a dashboard you already run can carry the platform too.'
  }
]

const SAMPLES = [
  {
    label: 'deploy.sh',
    value: 'deploy',
    language: 'bash',
    fileName: 'deploy.sh',
    fileIcon: 'ai ai-azion-cli',
    code: `# Ship the project in front of you
azion deploy

# Or link the repo once, and every push to main deploys
azion link --preset next
git push origin main

# Then roll back if it should not have gone out
azion rollback --to previous`
  },
  {
    label: 'azion.config.js',
    value: 'config',
    language: 'javascript',
    fileName: 'azion.config.js',
    fileIcon: 'ai ai-azion text-(--primary)!',
    code: `${'import'} { defineConfig } from 'azion'

export default defineConfig({
  build: {
    entry: 'src/index.ts',
    worker: true,
    preset: 'next'
  },
  functions: [
    { name: 'storefront', path: '.edge/worker.js' }
  ]
})`
  },
  {
    label: 'create-workload.sh',
    value: 'api',
    language: 'bash',
    fileName: 'create-workload.sh',
    fileIcon: 'ai ai-azion-cli',
    code: `# Create the workload the pipeline just built for
curl -X POST https://api.azion.com/v4/workloads \\
  -H "Authorization: Token $AZION_TOKEN" \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "storefront",
    "domains": ["storefront.example.com"]
  }'`
  },
  {
    label: 'main.tf',
    value: 'terraform',
    language: 'hcl',
    fileName: 'main.tf',
    fileIcon: 'ai-cor ai-terraform',
    code: `resource "azion_application" "storefront" {
  name                    = "storefront"
  edge_functions          = true
  application_accelerator = true
}

resource "azion_workload" "storefront" {
  name    = "storefront"
  domains = ["storefront.example.com"]

  application {
    id = azion_application.storefront.id
  }
}`
  },
  {
    label: 'requests.graphql',
    value: 'metrics',
    language: 'graphql',
    fileName: 'requests.graphql',
    fileIcon: 'ai-cor ai-graphql',
    code: `query RequestsByStatus($begin: DateTime!, $end: DateTime!) {
  httpMetrics(
    limit: 100
    filter: { tsRange: { begin: $begin, end: $end } }
    groupBy: [status]
  ) {
    status
    requests: sum(field: requests)
    p95: percentile(field: requestTime, percentile: 95)
  }
}`
  }
]

const quoted = (value) => `'${value.replace(/'/g, "\\'")}'`

const declareCapabilities = (name, items) =>
  `const ${name} = [\n${items
    .map(
      (item) =>
        `  {\n    title: ${quoted(item.title)},\n    description:\n      ${quoted(item.description)}\n  }`
    )
    .join(',\n')}\n]`

const IMPORTS = [
  "import Button from '@aziontech/webkit/button'",
  "import CodeBlock from '@aziontech/webkit/code-block'",
  "import FrameBox from '@aziontech/webkit/frame-box'",
  ...COLUMN_IMPORTS,
  "import SectionModule from '@aziontech/webkit/section-module'",
  "import SectionTitle from '@aziontech/webkit/section-title'",
  "import StickyStack from '@aziontech/webkit/sticky-stack'",
  "import TextureMaterial from '@aziontech/webkit/texture-material'",
  '',
  declareCapabilities('capabilities', CAPABILITIES),
  '',
  declareTabs('samples', SAMPLES)
]

const learnMore = (extraClass) => `<Button
  class="${extraClass}"
  label="Learn more"
  kind="secondary"
  size="small"
  href="${DOCS_HREF}"
  icon="pi pi-chevron-right"
  icon-position="trailing"
  animated
/>`

const TEMPLATE = inColumn(`<SectionModule :divided="false" :padded="false">
  <template #header>
    <SectionTitle
      eyebrow="Ship It"
      title="Everything You Need to Build and Deploy"
      description="Deploy from Git or the CLI, automate with APIs and Terraform, and query every metric over GraphQL. One platform carries your web app from the first push to the traffic it serves."
      size="large"
    >
      <template #actions>
        ${learnMore('lg:hidden').split('\n').join('\n        ')}
      </template>
    </SectionTitle>
  </template>

  <FrameBox
    flush
    borders="y"
    marks="bottom"
    class="[--sticky-stack-top:3.5rem] [--sticky-stack-height:min(40rem,calc(100dvh-3.5rem))] [--sticky-stack-align:stretch] [--sticky-stack-frame-border:1px]"
  >
    <StickyStack :items="capabilities">
      <template #media="{ index }">
        <TextureMaterial
          kind="pixelate"
          size="small"
          fade="top"
          class="max-lg:hidden"
        />
        <div class="relative z-10 flex w-full min-w-0 flex-col items-start gap-(--spacing-md)">
          <div class="w-full min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)">
            <CodeBlock
              :tabs="[samples[index]]"
              show-line-numbers
              animate-lines
              :copy-aria-label="'Copy the ' + samples[index].fileName + ' sample'"
            />
          </div>
          <div class="max-lg:hidden">
            ${learnMore('').replace('\n  class=""', '').split('\n').join('\n            ')}
          </div>
        </div>
      </template>
    </StickyStack>
  </FrameBox>
</SectionModule>`)

const meta = {
  title: 'Templates/Marketing/Media/StickyScrollCode',
  tags: ['autodocs'],
  parameters: {
    layout: 'fullscreen',
    backgrounds: { default: 'dark' },
    controls: { disable: true },
    docs: {
      description: {
        component:
          'A run of capabilities that pins under the site header while the page scrolls past it, with the code that proves each one held on the right: as the reader scrolls, the open capability advances and the sample beside it changes to match, a hairline filling under the open one as its share of the scroll is spent. Below `lg` it unpins into a plain list with the sample under each capability. Built from `SectionModule`, `SectionTitle`, `FrameBox`, `StickyStack`, `CodeBlock`, `TextureMaterial` and `Button`.'
      },
      canvas: { sourceState: 'shown' }
    }
  }
}

export default meta

export const Default = {
  render: () => ({
    components,
    setup: () => ({ capabilities: CAPABILITIES, samples: SAMPLES }),
    template: TEMPLATE
  }),
  parameters: {
    docs: {
      description: {
        story:
          'The "Everything You Need to Build and Deploy" band built for the Web Apps page: five capabilities, from deploying with the CLI to querying metrics over GraphQL, each paired with a one-file `CodeBlock` sample. The media cell is grounded on the same small, top-faded pixelate field as the media-split templates, and the docs button sits under the sample from `lg` up, moving to the section title below it. The `--sticky-stack-*` variables pin the band under a 3.5rem site nav and hold it to one screen, at most 40rem.'
      },
      source: { code: toSfc(IMPORTS, TEMPLATE) }
    }
  }
}

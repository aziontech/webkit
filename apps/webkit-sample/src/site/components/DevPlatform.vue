<script setup>
  import Button from '@aziontech/webkit/button'
  import CodeBlock from '@aziontech/webkit/code-block'
  import FrameBox from '@aziontech/webkit/frame-box'
  import SectionModule from '@aziontech/webkit/section-module'
  import SectionTitle from '@aziontech/webkit/section-title'
  import StickyStack from '@aziontech/webkit/sticky-stack'
  import TextureMaterial from '@aziontech/webkit/texture-material'

  const DOCS_HREF = 'https://www.azion.com/en/documentation/devtools/'
  const STICKY_QUERY = '(min-width: 64rem)'
  const CODE_CONTENT = '[data-testid="data-code-block__content"]'
  const RELEASE_FALLBACK_MS = 600

  const easedFrames = new WeakSet()
  let outgoingContent = null

  const prefersReducedMotion = () =>
    window.matchMedia?.('(prefers-reduced-motion: reduce)').matches ?? false

  const easeCodeHeight = (frame) => {
    if (!frame || easedFrames.has(frame)) return
    easedFrames.add(frame)
    if (!window.matchMedia?.(STICKY_QUERY).matches) return

    const content = frame.querySelector(CODE_CONTENT)
    if (!content) return

    const from = outgoingContent?.isConnected ? outgoingContent.getBoundingClientRect().height : 0
    const animate = from > 0 && !prefersReducedMotion()
    if (animate) content.style.height = `${from}px`

    requestAnimationFrame(() => {
      content.style.height = ''
      const to = content.getBoundingClientRect().height
      if (!to) return
      outgoingContent = content
      if (!animate || to === from) return

      content.style.height = `${from}px`
      void content.offsetHeight
      setTimeout(() => {
        if (content.style.height === `${to}px`) content.style.height = ''
      }, RELEASE_FALLBACK_MS)
      requestAnimationFrame(() => {
        content.style.height = `${to}px`
      })
    })
  }

  const capabilities = [
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

  const samples = [
    [
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
      }
    ],
    [
      {
        label: 'azion.config.js',
        value: 'config',
        language: 'javascript',
        fileName: 'azion.config.js',
        fileIcon: 'ai ai-azion text-(--primary)!',
        code: `import { defineConfig } from 'azion'

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
      }
    ],
    [
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
      }
    ],
    [
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
      }
    ],
    [
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
  ]
</script>

<template>
  <SectionModule
    :divided="false"
    :padded="false"
  >
    <template #header>
      <SectionTitle
        eyebrow="Ship It"
        title="Everything You Need to Build and Deploy"
        description="Deploy from Git or the CLI, automate with APIs and Terraform, and query every metric over GraphQL. One platform carries your web app from the first push to the traffic it serves."
        size="large"
      >
        <template #actions>
          <Button
            class="lg:hidden"
            label="Learn more"
            kind="secondary"
            size="small"
            :href="DOCS_HREF"
            icon="pi pi-chevron-right"
            icon-position="trailing"
            animated
          />
        </template>
      </SectionTitle>
    </template>

    <FrameBox
      flush
      borders="y"
      marks="bottom"
      class="[--sticky-stack-top:3.5rem]"
    >
      <StickyStack :items="capabilities">
        <template #media="{ index }">
          <TextureMaterial
            kind="grid"
            size="small"
            fade="top"
            class="max-lg:hidden"
          />
          <div class="relative z-10 flex w-full min-w-0 flex-col items-start gap-(--spacing-md)">
            <div
              :ref="easeCodeHeight"
              class="w-full min-w-0 rounded-(--shape-elements) shadow-(--shadow-sm)"
            >
              <CodeBlock
                :tabs="samples[index]"
                show-line-numbers
                animate-lines
                :copy-aria-label="`Copy the ${samples[index][0].fileName} sample`"
              />
            </div>
            <div class="max-lg:hidden">
              <Button
                label="Learn more"
                kind="secondary"
                size="small"
                :href="DOCS_HREF"
                icon="pi pi-chevron-right"
                icon-position="trailing"
                animated
              />
            </div>
          </div>
        </template>
      </StickyStack>
    </FrameBox>
  </SectionModule>
</template>
